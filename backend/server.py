"""Moobits — Phase 3 backend.

FastAPI + MongoDB. Implements:
- JWT cookie-based auth for a single admin user (seeded from env)
- Products / Promos / Orders / FAQ / Site Settings / Invoice Settings CRUD
- Order CSV export
- Resend email notification on new order (no-op if RESEND_API_KEY unset)
"""

from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import csv
import io
import logging
import uuid
from datetime import datetime, timezone, timedelta
from typing import Any, Dict, List, Optional

import bcrypt
import jwt
import httpx
from bson import ObjectId
from fastapi import APIRouter, Depends, FastAPI, HTTPException, Query, Request, Response, status
from fastapi.responses import JSONResponse, StreamingResponse
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from starlette.middleware.cors import CORSMiddleware

# ---------------- Mongo ----------------
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

JWT_ALGORITHM = "HS256"
JWT_SECRET = os.environ.get("JWT_SECRET", "change-me")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("moobits")

# ---------------- Helpers ----------------
def hash_password(p: str) -> str:
    return bcrypt.hashpw(p.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(p: str, h: str) -> bool:
    try:
        return bcrypt.checkpw(p.encode("utf-8"), h.encode("utf-8"))
    except Exception:
        return False

def create_access_token(uid: str, email: str) -> str:
    return jwt.encode(
        {"sub": uid, "email": email, "type": "access",
         "exp": datetime.now(timezone.utc) + timedelta(hours=12)},
        JWT_SECRET, algorithm=JWT_ALGORITHM,
    )

def create_refresh_token(uid: str) -> str:
    return jwt.encode(
        {"sub": uid, "type": "refresh",
         "exp": datetime.now(timezone.utc) + timedelta(days=7)},
        JWT_SECRET, algorithm=JWT_ALGORITHM,
    )

def set_auth_cookies(response: Response, access: str, refresh: str) -> None:
    response.set_cookie("access_token", access, httponly=True, secure=False,
                        samesite="lax", max_age=12 * 3600, path="/")
    response.set_cookie("refresh_token", refresh, httponly=True, secure=False,
                        samesite="lax", max_age=7 * 86400, path="/")

async def get_current_user(request: Request) -> Dict[str, Any]:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ---------------- Resend email ----------------
async def send_email_notification(subject: str, html: str) -> bool:
    api_key = os.environ.get("RESEND_API_KEY", "").strip()
    if not api_key:
        logger.info("[email] RESEND_API_KEY empty — skipping send. Subject: %s", subject)
        return False
    to = os.environ.get("ADMIN_NOTIFY_EMAIL", "moodinabites@gmail.com")
    sender = os.environ.get("RESEND_FROM", "Moobits <onboarding@resend.dev>")
    try:
        async with httpx.AsyncClient(timeout=10) as ac:
            r = await ac.post(
                "https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {api_key}",
                         "Content-Type": "application/json"},
                json={"from": sender, "to": [to], "subject": subject, "html": html},
            )
            ok = r.status_code < 400
            if not ok:
                logger.warning("[email] Resend %s: %s", r.status_code, r.text[:200])
            return ok
    except Exception as e:  # noqa: BLE001
        logger.warning("[email] Resend error: %s", e)
        return False

# ---------------- Default product/promo seed data ----------------
COOKIE_IMAGES = {
    "classic-og": "https://customer-assets.emergentagent.com/job_2d886d91-6abb-40c6-9e2f-b68641f5a7ed/artifacts/8s8pnu10_The%20Classic%20OG%20Cookies.png",
    "velvet-crush": "https://customer-assets.emergentagent.com/job_2d886d91-6abb-40c6-9e2f-b68641f5a7ed/artifacts/ks3xrubv_The%20Velvet%20Crush%20Cookies.png",
    "matcha-cookies": "https://customer-assets.emergentagent.com/job_2d886d91-6abb-40c6-9e2f-b68641f5a7ed/artifacts/swvvr9td_The%20Matcha%20Cookies.png",
    "blue-monstiez": "https://customer-assets.emergentagent.com/job_2d886d91-6abb-40c6-9e2f-b68641f5a7ed/artifacts/ao9drma2_The%20Blue%20Monstiez%20Cookies.png",
}
BOLU_MINI_IMAGES = {
    "bm-ketan-hitam-lumer": "https://customer-assets.emergentagent.com/job_moobits-launch/artifacts/lrn3thnd_Bolu%20Mini%20Ketan%20Hitam%20Isian%20Keju%20Lumer.png",
    "bm-ketan-hitam-parut": "https://customer-assets.emergentagent.com/job_moobits-launch/artifacts/hnz942qf_Bolu%20Mini%20Ketan%20Hitam%20Topping%20Keju%20Parut.png",
    "bm-redvelvet-lumer": "https://customer-assets.emergentagent.com/job_moobits-launch/artifacts/eaag6i5n_Bolu%20Mini%20Red%20Velvet%20Isian%20Keju%20Lumer.png",
    "bm-redvelvet-parut": "https://customer-assets.emergentagent.com/job_moobits-launch/artifacts/lm6bcgjz_Bolu%20Mini%20Red%20Velvet%20Topping%20Keju%20Parut.png",
    "bm-pandan-lumer": "https://customer-assets.emergentagent.com/job_moobits-launch/artifacts/9ranplh2_Bolu%20Mini%20Pandan%20Isian%20Keju%20Lumer.png",
    "bm-pandan-parut": "https://customer-assets.emergentagent.com/job_moobits-launch/artifacts/w9sjxxyk_Bolu%20Mini%20Pandan%20Topping%20Keju%20Parut.png",
}
BOLU_BIG_IMAGES = {
    "bb-ketan-hitam-lumer": "https://customer-assets.emergentagent.com/job_moobits-launch/artifacts/ly3jrmjj_Bolu%20Ketan%20Hitam%20Isian%20Keju%20Lumer.png",
    "bb-pandan-lumer": "https://customer-assets.emergentagent.com/job_moobits-launch/artifacts/fwllb8fc_Bolu%20Pandan%20Isian%20Keju%20Lumer.png",
}
BROWNIES_IMAGES = {
    "br-keju-full": "https://customer-assets.emergentagent.com/job_moobits-launch/artifacts/5vhizhqd_Brownies%20Ketan%20Hitam%20Topping%20Keju%20Parut%20Full.png",
    "br-half-half": "https://customer-assets.emergentagent.com/job_moobits-launch/artifacts/34986dvy_Brownies%20Ketan%20Hitam%20Topping%2050%25%20Keju%20Parut%2050%25%20Chocochips.png",
}

DEFAULT_PRODUCTS: List[Dict[str, Any]] = [
    # cookies
    {"id":"classic-og","name":"The Classic OG","category":"Cookies","image":COOKIE_IMAGES["classic-og"],"labels":["New Menu"],"price":10000,"discountPct":20,"size":"Ø ±10 cm","accent":"#8D5B4C","descId":"Classic chocolate chip cookie dengan rasa buttery manis yang familiar, simple, dan selalu aman jadi comfort snack.","descEn":"Classic chocolate chip cookie with a buttery sweet taste that feels familiar, simple, and comforting.","textureId":["Chewy","Soft inside","Slightly crisp outside"],"textureEn":["Chewy","Soft inside","Slightly crisp outside"],"stockStatus":"Pre-order","visible":True,"sort":1},
    {"id":"velvet-crush","name":"The Velvet Crush","category":"Cookies","image":COOKIE_IMAGES["velvet-crush"],"labels":["New Menu"],"price":12000,"discountPct":20,"size":"Ø ±10 cm","accent":"#9B2C2C","descId":"Red velvet cookie dengan rasa manis lembut, warna bold, dan white chips yang bikin setiap gigitan terasa creamy.","descEn":"Red velvet cookie with a soft sweet flavor, bold color, and white chips that make every bite feel creamy.","textureId":["Soft chewy","Moist","Creamy bites"],"textureEn":["Soft chewy","Moist","Creamy bites"],"stockStatus":"Pre-order","visible":True,"sort":2},
    {"id":"matcha-cookies","name":"The Matcha Cookies","category":"Cookies","image":COOKIE_IMAGES["matcha-cookies"],"labels":["New Menu"],"price":12000,"discountPct":20,"size":"Ø ±10 cm","accent":"#86A789","descId":"Cookie matcha dengan rasa earthy yang kalem, dipadukan white chips dan almond slices untuk gigitan yang lebih premium.","descEn":"Matcha cookie with a calm earthy flavor, paired with white chips and almond slices for a more premium bite.","textureId":["Chewy","Soft","Light almond crunch"],"textureEn":["Chewy","Soft","Light almond crunch"],"stockStatus":"Pre-order","visible":True,"sort":3},
    {"id":"blue-monstiez","name":"The Blue Monstiez","category":"Cookies","image":COOKIE_IMAGES["blue-monstiez"],"labels":["New Menu"],"price":12000,"discountPct":20,"size":"Ø ±10 cm","accent":"#3B82F6","descId":"Cookie biru playful dengan rasa manis creamy dan tampilan fun, cocok buat kamu yang suka sweet treats unik.","descEn":"A playful blue cookie with a creamy sweet taste and a fun look, made for anyone who loves unique sweet treats.","textureId":["Chewy","Soft","Chunky","Playful bites"],"textureEn":["Chewy","Soft","Chunky","Playful bites"],"stockStatus":"Pre-order","visible":True,"sort":4},
    # bolu mini
    {"id":"bm-ketan-hitam-lumer","name":"Bolu Mini Ketan Hitam Isian Keju Lumer","shortName":"Bolu Mini Ketan Hitam · Keju Lumer","category":"Bolu Mini","image":BOLU_MINI_IMAGES["bm-ketan-hitam-lumer"],"labels":["Best Seller","Recommended"],"price":5000,"discountPct":0,"accent":"#3A2A2E","descId":"Bolu mini ketan hitam yang moist dan legit, dengan isian keju lumer yang gurih creamy di dalamnya.","descEn":"Moist black sticky rice mini bolu with creamy melted cheese filling inside.","textureId":["Moist","Soft","Lumer"],"textureEn":["Moist","Soft","Lumer"],"stockStatus":"Pre-order","visible":True,"sort":10},
    {"id":"bm-ketan-hitam-parut","name":"Bolu Mini Ketan Hitam Topping Keju Parut","shortName":"Bolu Mini Ketan Hitam · Keju Parut","category":"Bolu Mini","image":BOLU_MINI_IMAGES["bm-ketan-hitam-parut"],"labels":[],"price":5000,"discountPct":0,"accent":"#3A2A2E","descId":"Bolu mini ketan hitam dengan topping keju parut yang gurih dan melimpah, cocok buat pencinta manis-gurih.","descEn":"Soft black sticky rice mini bolu with generous grated cheese topping for a sweet and savory bite.","textureId":["Soft","Moist","Cheesy topping"],"textureEn":["Soft","Moist","Cheesy topping"],"stockStatus":"Pre-order","visible":True,"sort":11},
    {"id":"bm-redvelvet-lumer","name":"Bolu Mini Red Velvet Isian Keju Lumer","shortName":"Bolu Mini Red Velvet · Keju Lumer","category":"Bolu Mini","image":BOLU_MINI_IMAGES["bm-redvelvet-lumer"],"labels":[],"price":5000,"discountPct":0,"accent":"#9B2C2C","descId":"Bolu mini red velvet dengan warna cantik, rasa manis lembut, dan isian keju lumer yang creamy.","descEn":"Soft red velvet mini bolu with a lovely color, gentle sweetness, and creamy melted cheese filling.","textureId":["Soft","Moist","Creamy lumer"],"textureEn":["Soft","Moist","Creamy lumer"],"stockStatus":"Pre-order","visible":True,"sort":12},
    {"id":"bm-redvelvet-parut","name":"Bolu Mini Red Velvet Topping Keju Parut","shortName":"Bolu Mini Red Velvet · Keju Parut","category":"Bolu Mini","image":BOLU_MINI_IMAGES["bm-redvelvet-parut"],"labels":[],"price":5000,"discountPct":0,"accent":"#9B2C2C","descId":"Bolu mini red velvet dengan topping keju parut yang bikin rasanya lebih gurih dan balance.","descEn":"Red velvet mini bolu with grated cheese topping for a balanced sweet and savory flavor.","textureId":["Soft","Moist","Cheesy"],"textureEn":["Soft","Moist","Cheesy"],"stockStatus":"Pre-order","visible":True,"sort":13},
    {"id":"bm-pandan-lumer","name":"Bolu Mini Pandan Isian Keju Lumer","shortName":"Bolu Mini Pandan · Keju Lumer","category":"Bolu Mini","image":BOLU_MINI_IMAGES["bm-pandan-lumer"],"labels":["Best Seller","Recommended"],"price":5000,"discountPct":0,"accent":"#86A789","descId":"Bolu mini pandan wangi dengan isian keju lumer yang gurih creamy, fresh, dan comforting.","descEn":"Fragrant pandan mini bolu with creamy melted cheese filling, fresh and comforting in every bite.","textureId":["Soft","Moist","Fragrant","Lumer"],"textureEn":["Soft","Moist","Fragrant","Lumer"],"stockStatus":"Pre-order","visible":True,"sort":14},
    {"id":"bm-pandan-parut","name":"Bolu Mini Pandan Topping Keju Parut","shortName":"Bolu Mini Pandan · Keju Parut","category":"Bolu Mini","image":BOLU_MINI_IMAGES["bm-pandan-parut"],"labels":[],"price":5000,"discountPct":0,"accent":"#86A789","descId":"Bolu mini pandan dengan aroma pandan yang lembut dan topping keju parut yang gurih.","descEn":"Soft pandan mini bolu with a gentle pandan aroma and savory grated cheese topping.","textureId":["Soft","Moist","Cheesy topping"],"textureEn":["Soft","Moist","Cheesy topping"],"stockStatus":"Pre-order","visible":True,"sort":15},
    # bolu big
    {"id":"bb-ketan-hitam-lumer","name":"Bolu BIG Ketan Hitam Isian Keju Lumer","shortName":"Bolu BIG Ketan Hitam · Keju Lumer","category":"Bolu BIG","image":BOLU_BIG_IMAGES["bb-ketan-hitam-lumer"],"labels":[],"price":45000,"discountPct":0,"accent":"#3A2A2E","descId":"Bolu ketan hitam ukuran besar dengan tekstur moist dan isian keju lumer yang cocok untuk sharing.","descEn":"Large black sticky rice bolu with a moist texture and creamy melted cheese filling, perfect for sharing.","textureId":["Moist","Soft","Lumer","Rich"],"textureEn":["Moist","Soft","Lumer","Rich"],"stockStatus":"Pre-order","visible":True,"sort":20},
    {"id":"bb-pandan-lumer","name":"Bolu BIG Pandan Isian Keju Lumer","shortName":"Bolu BIG Pandan · Keju Lumer","category":"Bolu BIG","image":BOLU_BIG_IMAGES["bb-pandan-lumer"],"labels":[],"price":45000,"discountPct":0,"accent":"#86A789","descId":"Bolu pandan ukuran besar dengan aroma pandan yang wangi dan isian keju lumer yang creamy.","descEn":"Large pandan bolu with a soft fragrant cake base and creamy melted cheese filling.","textureId":["Soft","Moist","Fragrant","Creamy"],"textureEn":["Soft","Moist","Fragrant","Creamy"],"stockStatus":"Pre-order","visible":True,"sort":21},
    # brownies
    {"id":"br-keju-full","name":"Brownies Ketan Hitam Topping Keju Parut Full","shortName":"Brownies · Keju Parut Full","category":"Brownies","image":BROWNIES_IMAGES["br-keju-full"],"labels":[],"price":35000,"discountPct":0,"accent":"#FCD34D","descId":"Brownies ketan hitam dengan topping keju parut full, cocok buat pencinta brownies manis-gurih.","descEn":"Black sticky rice brownies with full grated cheese topping for a rich sweet and savory taste.","textureId":["Moist","Dense","Soft","Cheesy"],"textureEn":["Moist","Dense","Soft","Cheesy"],"stockStatus":"Pre-order","visible":True,"sort":30},
    {"id":"br-half-half","name":"Brownies Ketan Hitam Topping ½ Keju Parut + ½ Choco Chips","shortName":"Brownies · ½ Keju + ½ Choco","category":"Brownies","image":BROWNIES_IMAGES["br-half-half"],"labels":[],"price":35000,"discountPct":0,"accent":"#8D5B4C","descId":"Brownies ketan hitam dengan dua topping dalam satu loyang: setengah keju parut dan setengah choco chips.","descEn":"Black sticky rice brownies with two toppings in one: half grated cheese and half choco chips.","textureId":["Moist","Dense","Cheesy","Chocolatey"],"textureEn":["Moist","Dense","Cheesy","Chocolatey"],"stockStatus":"Pre-order","visible":True,"sort":31},
]

DEFAULT_PROMOS = [
    {"id":"website-launch","name":"Website Launch Promo","type":"percentage","descId":"Diskon 20% khusus semua varian cookies.","descEn":"20% off for all cookie variants only.","discountPct":20,"appliesToCategory":"Cookies","active":True,"startDate":None,"endDate":None},
    {"id":"bundle-cookies-4","name":"Bundling Cookies 4 Varian","type":"bundle","descId":"Hemat 10% dengan paket bundling 4 varian cookies.","descEn":"Save 10% with the 4-variant cookie bundle.","discountPct":10,"appliesToCategory":"Cookies","contents":["classic-og","velvet-crush","matcha-cookies","blue-monstiez"],"originalPrice":46000,"bundlePrice":41400,"active":True},
]

DEFAULT_FAQ = [
    ("Apakah Moobits ready stock?","Moobits menggunakan sistem pre-order. Ready stock hanya tersedia jika ada produksi lebih.","Is Moobits ready stock?","Moobits uses a pre-order system. Ready stock is only available when there is extra production."),
    ("Bisa order untuk hari yang sama?","Belum bisa. Pesanan mengikuti jadwal pre-order.","Can I order for the same day?","Not yet. Orders follow the pre-order schedule."),
    ("Ada minimum order?","Tidak ada minimum order.","Is there a minimum order?","No minimum order."),
    ("Produk tahan berapa lama?","Produk tahan sekitar 3–5 hari jika disimpan dengan baik di kulkas.","How long do the products last?","Products last around 3–5 days if stored properly in the fridge."),
    ("Cara simpannya bagaimana?","Simpan di kulkas dalam wadah tertutup agar tekstur dan rasa tetap terjaga.","How should I store the products?","Keep them refrigerated in a closed container to maintain texture and quality."),
    ("Bisa dikirim ke luar kota?","Belum bisa. Untuk saat ini pengiriman hanya untuk area Jakarta.","Can Moobits deliver outside Jakarta?","Not yet. Delivery is currently available for Jakarta area only."),
    ("Bisa pickup sendiri?","Bisa. Area pickup di Sunter, Jakarta Utara. Detail alamat akan diberikan melalui WhatsApp.","Can I pick up my order?","Yes. Pickup area is Sunter, North Jakarta. Detailed address will be shared through WhatsApp."),
    ("Bisa request greeting card?","Bisa, selama request disampaikan saat konfirmasi order.","Can I request a greeting card?","Yes, as long as the request is sent during order confirmation."),
    ("Apakah tersedia hampers?","Belum tersedia.","Are hampers available?","Not yet."),
    ("Bisa pesan untuk acara?","Bisa untuk arisan, pengajian, meeting, ulang tahun, dan acara santai lainnya.","Can I order for events?","Yes, for arisan, pengajian, meetings, birthdays, and other casual events."),
    ("Apakah produk mengandung alergen?","Ya. Produk mengandung telur, gluten, keju/dairy, dan beberapa varian mengandung almond.","Do the products contain allergens?","Yes. Products contain egg, gluten, cheese/dairy, and some variants contain almond."),
    ("Bagaimana jika ada komplain?","Komplain dapat disampaikan melalui WhatsApp dengan menyertakan detail pesanan dan foto produk.","How can I make a complaint?","Complaints can be sent through WhatsApp with order details and product photos."),
]

DEFAULT_SITE_SETTINGS = {
    "_id": "site",
    "whatsapp": "083894855149",
    "email": "moodinabites@gmail.com",
    "instagram": "@mooobits",
    "area": "Sunter, Jakarta Utara",
    "hours": "07.00–17.00",
    "heroHeadlineId": "Treat Yourself, Fix Your Mood.",
    "heroHeadlineEn": "Treat Yourself, Fix Your Mood.",
    "heroSubId": "Cookies, bolu, dan brownies homemade yang dibuat fresh untuk jadi mood booster manis di hari kamu.",
    "heroSubEn": "Freshly made homemade cookies, bolu, and brownies to sweeten your everyday mood.",
    "aboutId": "Moobits adalah homemade sweet treats brand yang dibuat untuk menghadirkan camilan manis yang terasa dekat, comforting, dan menyenangkan.",
    "aboutEn": "Moobits is a homemade sweet treats brand created to bring sweet treats that feel warm, comforting, and joyful.",
    "promoBannerId": "Diskon 20% khusus semua varian cookies.",
    "promoBannerEn": "20% off for all cookie variants only.",
}

DEFAULT_INVOICE_SETTINGS = {
    "_id": "invoice",
    "qrisImage": "",  # base64 data URL (empty = use placeholder QR)
    "accountName": "Isagizz Store",
    "bcaAccountName": "",
    "bcaAccountNumber": "",
    "ewalletNote": "",
    "footerNote": "Thank you sudah order di Moobits. Your daily sweet mood starts here.",
    "adminWhatsapp": "083894855149",
}

# ---------------- Seed ----------------
async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@moobits.id").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "moobits2026")
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Moobits Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("[seed] admin user created: %s", admin_email)
    elif not verify_password(admin_password, existing.get("password_hash", "")):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
        logger.info("[seed] admin password updated for %s", admin_email)

async def seed_products():
    for p in DEFAULT_PRODUCTS:
        await db.products.update_one(
            {"id": p["id"]},
            {"$setOnInsert": {**p, "createdAt": datetime.now(timezone.utc).isoformat()}},
            upsert=True,
        )

async def seed_promos():
    for p in DEFAULT_PROMOS:
        await db.promos.update_one({"id": p["id"]}, {"$setOnInsert": p}, upsert=True)

async def seed_faq():
    count = await db.faq.count_documents({})
    if count > 0:
        return
    for i, (qid, aid, qen, aen) in enumerate(DEFAULT_FAQ):
        await db.faq.insert_one({
            "id": str(uuid.uuid4()), "questionId": qid, "answerId": aid,
            "questionEn": qen, "answerEn": aen, "visible": True, "sort": i,
        })

async def seed_settings():
    await db.site_settings.update_one({"_id": "site"}, {"$setOnInsert": DEFAULT_SITE_SETTINGS}, upsert=True)
    await db.invoice_settings.update_one({"_id": "invoice"}, {"$setOnInsert": DEFAULT_INVOICE_SETTINGS}, upsert=True)

# ---------------- App ----------------
app = FastAPI()
api = APIRouter(prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    await db.users.create_index("email", unique=True)
    await db.products.create_index("id", unique=True)
    await db.promos.create_index("id", unique=True)
    await db.orders.create_index("invoiceNumber", unique=True)
    await db.faq.create_index("id", unique=True)
    await seed_admin()
    await seed_products()
    await seed_promos()
    await seed_faq()
    await seed_settings()
    logger.info("[startup] seed complete")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# ---------------- Auth ----------------
class LoginBody(BaseModel):
    email: EmailStr
    password: str

@api.post("/auth/login")
async def login(body: LoginBody, response: Response, request: Request):
    email = body.email.lower()
    ip = request.client.host if request.client else "unknown"
    ident = f"{ip}:{email}"
    attempt = await db.login_attempts.find_one({"identifier": ident})
    now = datetime.now(timezone.utc)
    if attempt and attempt.get("locked_until"):
        locked_until = datetime.fromisoformat(attempt["locked_until"])
        if locked_until > now:
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user.get("password_hash", "")):
        fails = (attempt.get("fails", 0) if attempt else 0) + 1
        upd: Dict[str, Any] = {"identifier": ident, "fails": fails, "last_attempt": now.isoformat()}
        if fails >= 5:
            upd["locked_until"] = (now + timedelta(minutes=15)).isoformat()
        await db.login_attempts.update_one({"identifier": ident}, {"$set": upd}, upsert=True)
        raise HTTPException(status_code=401, detail="Invalid email or password")
    await db.login_attempts.delete_one({"identifier": ident})
    uid = str(user["_id"])
    access = create_access_token(uid, email)
    refresh = create_refresh_token(uid)
    set_auth_cookies(response, access, refresh)
    return {"id": uid, "email": email, "name": user.get("name"), "role": user.get("role", "admin")}

@api.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"ok": True}

@api.get("/auth/me")
async def me(user: Dict[str, Any] = Depends(get_current_user)):
    return user

@api.post("/auth/refresh")
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        new_access = create_access_token(str(user["_id"]), user["email"])
        response.set_cookie("access_token", new_access, httponly=True, secure=False, samesite="lax", max_age=12*3600, path="/")
        return {"ok": True}
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

# ---------------- Public products / promos / faq / settings ----------------
def _strip_mongo(doc: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    if not doc:
        return doc
    doc.pop("_id", None)
    return doc

@api.get("/products")
async def list_products(includeHidden: bool = False):
    q = {} if includeHidden else {"visible": True}
    cursor = db.products.find(q).sort("sort", 1)
    docs = []
    async for d in cursor:
        docs.append(_strip_mongo(d))
    return docs

@api.get("/promos")
async def list_promos(activeOnly: bool = True):
    q = {"active": True} if activeOnly else {}
    cursor = db.promos.find(q)
    docs = []
    async for d in cursor:
        docs.append(_strip_mongo(d))
    return docs

@api.get("/faq")
async def list_faq(includeHidden: bool = False):
    q = {} if includeHidden else {"visible": True}
    cursor = db.faq.find(q).sort("sort", 1)
    docs = []
    async for d in cursor:
        docs.append(_strip_mongo(d))
    return docs

@api.get("/settings/site")
async def get_site_settings():
    doc = await db.site_settings.find_one({"_id": "site"})
    if not doc:
        return DEFAULT_SITE_SETTINGS
    doc.pop("_id", None)
    return doc

@api.get("/settings/invoice")
async def get_invoice_settings():
    doc = await db.invoice_settings.find_one({"_id": "invoice"})
    if not doc:
        return DEFAULT_INVOICE_SETTINGS
    doc.pop("_id", None)
    return doc

# ---------------- Order intake ----------------
class OrderItem(BaseModel):
    productId: str
    productName: str
    category: str
    qty: int
    unitPrice: int
    originalPrice: int
    lineTotal: int
    note: Optional[str] = ""
    image: Optional[str] = ""

class OrderBody(BaseModel):
    model_config = ConfigDict(extra="allow")
    invoiceNumber: str
    customerName: str
    customerWa: str
    method: str
    address: Optional[str] = ""
    deliveryDate: str
    paymentMethod: str
    greeting: Optional[str] = ""
    custom: Optional[str] = ""
    notes: Optional[str] = ""
    items: List[OrderItem]
    subtotalOriginal: int
    discount: int
    total: int
    paymentStatus: str = "Unpaid"
    orderStatus: str = "New Order"
    lang: str = "id"

@api.post("/orders")
async def create_order(body: OrderBody):
    doc = body.model_dump()
    doc["createdAt"] = datetime.now(timezone.utc).isoformat()
    doc["adminNotes"] = ""
    try:
        await db.orders.insert_one(doc)
    except Exception as e:  # duplicate invoice number
        if "duplicate" in str(e).lower():
            raise HTTPException(status_code=409, detail="Invoice number already exists")
        raise
    # Fire-and-forget email notification
    try:
        rows = "".join(
            f"<li>{i.qty}× {i.productName} — Rp{i.lineTotal:,}</li>".replace(",", ".")
            for i in body.items
        )
        html = (
            f"<h2>New Moobits Order — {body.invoiceNumber}</h2>"
            f"<p><b>{body.customerName}</b> · {body.customerWa}</p>"
            f"<p>{body.method} · {body.deliveryDate}</p>"
            f"<ul>{rows}</ul>"
            f"<p><b>Total: Rp{body.total:,}</b></p>".replace(",", ".")
        )
        await send_email_notification(f"New Order {body.invoiceNumber}", html)
    except Exception as e:  # noqa: BLE001
        logger.warning("[email] notify failed: %s", e)
    doc.pop("_id", None)
    return doc

# ---------------- Admin: product CRUD ----------------
class ProductUpsert(BaseModel):
    model_config = ConfigDict(extra="allow")
    id: str
    name: str
    category: str

@api.post("/admin/products", dependencies=[Depends(get_current_user)])
async def create_product(body: ProductUpsert):
    payload = body.model_dump()
    payload.setdefault("visible", True)
    payload.setdefault("labels", [])
    payload.setdefault("discountPct", 0)
    payload.setdefault("stockStatus", "Pre-order")
    payload.setdefault("createdAt", datetime.now(timezone.utc).isoformat())
    try:
        await db.products.insert_one(payload)
    except Exception:
        raise HTTPException(status_code=409, detail="Product id already exists")
    payload.pop("_id", None)
    return payload

@api.put("/admin/products/{pid}", dependencies=[Depends(get_current_user)])
async def update_product(pid: str, body: Dict[str, Any]):
    body.pop("_id", None)
    res = await db.products.update_one({"id": pid}, {"$set": body})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    doc = await db.products.find_one({"id": pid})
    return _strip_mongo(doc)

@api.delete("/admin/products/{pid}", dependencies=[Depends(get_current_user)])
async def delete_product(pid: str):
    res = await db.products.delete_one({"id": pid})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"ok": True}

# ---------------- Admin: promos ----------------
@api.put("/admin/promos/{promo_id}", dependencies=[Depends(get_current_user)])
async def update_promo(promo_id: str, body: Dict[str, Any]):
    body.pop("_id", None)
    res = await db.promos.update_one({"id": promo_id}, {"$set": body})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Promo not found")
    doc = await db.promos.find_one({"id": promo_id})
    return _strip_mongo(doc)

@api.post("/admin/promos", dependencies=[Depends(get_current_user)])
async def create_promo(body: Dict[str, Any]):
    body.setdefault("id", str(uuid.uuid4()))
    body.setdefault("active", True)
    body.setdefault("type", "percentage")
    try:
        await db.promos.insert_one(body)
    except Exception:
        raise HTTPException(status_code=409, detail="Promo id exists")
    return _strip_mongo(body)

@api.delete("/admin/promos/{promo_id}", dependencies=[Depends(get_current_user)])
async def delete_promo(promo_id: str):
    res = await db.promos.delete_one({"id": promo_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Promo not found")
    return {"ok": True}

# ---------------- Admin: orders ----------------
@api.get("/admin/orders", dependencies=[Depends(get_current_user)])
async def list_orders(
    status_filter: Optional[str] = Query(None, alias="status"),
    q: Optional[str] = None,
    fromDate: Optional[str] = None,
    toDate: Optional[str] = None,
    limit: int = 200,
):
    query: Dict[str, Any] = {}
    if status_filter:
        query["orderStatus"] = status_filter
    if q:
        query["$or"] = [
            {"customerName": {"$regex": q, "$options": "i"}},
            {"customerWa": {"$regex": q, "$options": "i"}},
            {"invoiceNumber": {"$regex": q, "$options": "i"}},
        ]
    if fromDate or toDate:
        rng: Dict[str, Any] = {}
        if fromDate:
            rng["$gte"] = fromDate
        if toDate:
            rng["$lte"] = toDate + "T23:59:59"
        query["createdAt"] = rng
    cursor = db.orders.find(query).sort("createdAt", -1).limit(limit)
    docs = []
    async for d in cursor:
        d.pop("_id", None)
        docs.append(d)
    return docs

@api.get("/admin/orders-export.csv", dependencies=[Depends(get_current_user)])
async def export_orders(
    status_filter: Optional[str] = Query(None, alias="status"),
    fromDate: Optional[str] = None,
    toDate: Optional[str] = None,
):
    query: Dict[str, Any] = {}
    if status_filter:
        query["orderStatus"] = status_filter
    if fromDate or toDate:
        rng: Dict[str, Any] = {}
        if fromDate:
            rng["$gte"] = fromDate
        if toDate:
            rng["$lte"] = toDate + "T23:59:59"
        query["createdAt"] = rng

    buf = io.StringIO()
    w = csv.writer(buf)
    w.writerow([
        "Invoice", "Date", "Customer", "WhatsApp", "Method", "Address",
        "DeliveryDate", "Payment", "Products", "Subtotal", "Discount",
        "Total", "PaymentStatus", "OrderStatus", "Notes",
    ])
    cursor = db.orders.find(query).sort("createdAt", -1)
    async for d in cursor:
        items = "; ".join(
            f"{i.get('qty')}x {i.get('productName')} @{i.get('unitPrice')}"
            for i in d.get("items", [])
        )
        w.writerow([
            d.get("invoiceNumber", ""), d.get("createdAt", ""), d.get("customerName", ""),
            d.get("customerWa", ""), d.get("method", ""), d.get("address", ""),
            d.get("deliveryDate", ""), d.get("paymentMethod", ""), items,
            d.get("subtotalOriginal", 0), d.get("discount", 0), d.get("total", 0),
            d.get("paymentStatus", ""), d.get("orderStatus", ""), d.get("notes", ""),
        ])
    buf.seek(0)
    filename = f"moobits-orders-{datetime.now().strftime('%Y%m%d-%H%M%S')}.csv"
    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )

@api.get("/admin/orders/{invoice_number}", dependencies=[Depends(get_current_user)])
async def get_order(invoice_number: str):
    doc = await db.orders.find_one({"invoiceNumber": invoice_number})
    if not doc:
        raise HTTPException(status_code=404, detail="Order not found")
    doc.pop("_id", None)
    return doc

@api.put("/admin/orders/{invoice_number}", dependencies=[Depends(get_current_user)])
async def update_order(invoice_number: str, body: Dict[str, Any]):
    body.pop("_id", None)
    res = await db.orders.update_one({"invoiceNumber": invoice_number}, {"$set": body})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    doc = await db.orders.find_one({"invoiceNumber": invoice_number})
    doc.pop("_id", None)
    return doc

# ---------------- Admin: FAQ ----------------
class FaqBody(BaseModel):
    model_config = ConfigDict(extra="allow")
    questionId: str
    answerId: str
    questionEn: str
    answerEn: str
    visible: bool = True
    sort: int = 0

@api.post("/admin/faq", dependencies=[Depends(get_current_user)])
async def create_faq(body: FaqBody):
    payload = body.model_dump()
    payload["id"] = str(uuid.uuid4())
    await db.faq.insert_one(payload)
    payload.pop("_id", None)
    return payload

@api.put("/admin/faq/{fid}", dependencies=[Depends(get_current_user)])
async def update_faq(fid: str, body: Dict[str, Any]):
    body.pop("_id", None)
    res = await db.faq.update_one({"id": fid}, {"$set": body})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="FAQ not found")
    doc = await db.faq.find_one({"id": fid})
    return _strip_mongo(doc)

@api.delete("/admin/faq/{fid}", dependencies=[Depends(get_current_user)])
async def delete_faq(fid: str):
    res = await db.faq.delete_one({"id": fid})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="FAQ not found")
    return {"ok": True}

# ---------------- Admin: settings ----------------
@api.put("/admin/settings/site", dependencies=[Depends(get_current_user)])
async def update_site(body: Dict[str, Any]):
    body.pop("_id", None)
    await db.site_settings.update_one({"_id": "site"}, {"$set": body}, upsert=True)
    doc = await db.site_settings.find_one({"_id": "site"})
    doc.pop("_id", None)
    return doc

@api.put("/admin/settings/invoice", dependencies=[Depends(get_current_user)])
async def update_invoice(body: Dict[str, Any]):
    body.pop("_id", None)
    await db.invoice_settings.update_one({"_id": "invoice"}, {"$set": body}, upsert=True)
    doc = await db.invoice_settings.find_one({"_id": "invoice"})
    doc.pop("_id", None)
    return doc

# ---------------- Admin: dashboard stats ----------------
@api.get("/admin/stats", dependencies=[Depends(get_current_user)])
async def admin_stats():
    pipeline = [{"$group": {"_id": "$orderStatus", "n": {"$sum": 1}}}]
    counts = {}
    async for r in db.orders.aggregate(pipeline):
        counts[r["_id"] or "Unknown"] = r["n"]
    total = sum(counts.values())
    # revenue (paid only)
    revenue_doc = await db.orders.aggregate([
        {"$match": {"paymentStatus": "Paid"}},
        {"$group": {"_id": None, "sum": {"$sum": "$total"}}},
    ]).to_list(1)
    revenue = revenue_doc[0]["sum"] if revenue_doc else 0
    # best seller (sum qty by product)
    best = await db.orders.aggregate([
        {"$unwind": "$items"},
        {"$group": {"_id": "$items.productName", "qty": {"$sum": "$items.qty"}}},
        {"$sort": {"qty": -1}},
        {"$limit": 1},
    ]).to_list(1)
    active_promos = await db.promos.count_documents({"active": True})
    recent_cur = db.orders.find({}).sort("createdAt", -1).limit(5)
    recent = []
    async for d in recent_cur:
        d.pop("_id", None)
        recent.append(d)
    return {
        "totalOrders": total,
        "newOrders": counts.get("New Order", 0),
        "waitingPayment": counts.get("Waiting Payment", 0),
        "confirmed": counts.get("Confirmed", 0),
        "completed": counts.get("Completed", 0),
        "revenue": revenue,
        "bestSeller": best[0]["_id"] if best else None,
        "activePromos": active_promos,
        "recent": recent,
    }

@api.get("/")
async def root():
    return {"service": "moobits-api", "version": "phase3"}

app.include_router(api)
