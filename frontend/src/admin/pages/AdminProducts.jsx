import { useEffect, useState } from "react";
import api from "../../lib/api";
import { Pencil, Save, X, Eye, EyeOff } from "lucide-react";

const CATS = ["Cookies", "Bolu Mini", "Bolu BIG", "Brownies"];
const STOCKS = ["Pre-order", "Ready Stock", "Sold Out"];
const LABELS = ["New Menu", "Best Seller", "Recommended"];
const fmtIDR = (n) => `Rp${(n || 0).toLocaleString("id-ID")}`;

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

const Editor = ({ product, onClose, onSaved }) => {
  const [form, setForm] = useState({ ...product });
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleImage = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      alert("Max 5MB");
      return;
    }
    const url = await fileToDataURL(f);
    set("image", url);
  };

  const save = async () => {
    setBusy(true);
    try {
      await api.put(`/admin/products/${product.id}`, form);
      onSaved();
    } catch (e) {
      alert(e.response?.data?.detail || e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-[1.5rem] w-full max-w-2xl my-8 ring-1 ring-black/5" data-testid="product-editor">
        <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between">
          <h3 className="font-display font-bold text-[17px]">Edit Product</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-[#FDFBF7] flex items-center justify-center"><X size={15}/></button>
        </div>
        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          <div className="sm:col-span-2 flex items-start gap-4">
            <div className="h-24 w-24 rounded-2xl overflow-hidden bg-black shrink-0">
              {form.image && <img src={form.image} alt="" className="h-full w-full object-cover"/>}
            </div>
            <div className="flex-1">
              <label className="block text-[12px] font-semibold mb-1.5">Product Image</label>
              <input type="file" accept="image/*" onChange={handleImage} className="text-[12px]" />
              <p className="mt-1 text-[10.5px] text-[#737373]">PNG/JPG, max 5MB. Stored as base64 in DB.</p>
            </div>
          </div>
          {[["name","Name"],["shortName","Short Name"],["size","Size"],["accent","Accent (#hex)"]].map(([k,l])=>(
            <div key={k}><label className="block text-[12px] font-semibold mb-1.5">{l}</label>
              <input value={form[k]||""} onChange={(e)=>set(k,e.target.value)} className="w-full rounded-xl bg-[#FDFBF7] px-3 py-2 text-[13px] ring-1 ring-black/5 focus:ring-[#8D5B4C] outline-none"/></div>
          ))}
          <div><label className="block text-[12px] font-semibold mb-1.5">Category</label>
            <select value={form.category} onChange={(e)=>set("category",e.target.value)} className="w-full rounded-xl bg-[#FDFBF7] px-3 py-2 text-[13px]">{CATS.map(c=><option key={c}>{c}</option>)}</select></div>
          <div><label className="block text-[12px] font-semibold mb-1.5">Stock Status</label>
            <select value={form.stockStatus||"Pre-order"} onChange={(e)=>set("stockStatus",e.target.value)} className="w-full rounded-xl bg-[#FDFBF7] px-3 py-2 text-[13px]">{STOCKS.map(c=><option key={c}>{c}</option>)}</select></div>
          <div><label className="block text-[12px] font-semibold mb-1.5">Price (IDR)</label>
            <input type="number" value={form.price||0} onChange={(e)=>set("price",parseInt(e.target.value||"0",10))} className="w-full rounded-xl bg-[#FDFBF7] px-3 py-2 text-[13px]"/></div>
          <div><label className="block text-[12px] font-semibold mb-1.5">Discount %</label>
            <input type="number" value={form.discountPct||0} onChange={(e)=>set("discountPct",parseInt(e.target.value||"0",10))} className="w-full rounded-xl bg-[#FDFBF7] px-3 py-2 text-[13px]"/></div>
          <div className="sm:col-span-2"><label className="block text-[12px] font-semibold mb-1.5">Labels</label>
            <div className="flex flex-wrap gap-2">{LABELS.map(l=>{
              const on=(form.labels||[]).includes(l);
              return <button type="button" key={l} onClick={()=>set("labels",on?(form.labels||[]).filter(x=>x!==l):[...(form.labels||[]),l])} className={`px-3 py-1.5 rounded-full text-[12px] font-semibold ${on?"bg-[#121212] text-white":"bg-[#FDFBF7] ring-1 ring-black/5 text-[#525252]"}`}>{l}</button>;
            })}</div></div>
          <div className="sm:col-span-2"><label className="block text-[12px] font-semibold mb-1.5">Description ID</label>
            <textarea rows={2} value={form.descId||""} onChange={(e)=>set("descId",e.target.value)} className="w-full rounded-xl bg-[#FDFBF7] px-3 py-2 text-[13px]"/></div>
          <div className="sm:col-span-2"><label className="block text-[12px] font-semibold mb-1.5">Description EN</label>
            <textarea rows={2} value={form.descEn||""} onChange={(e)=>set("descEn",e.target.value)} className="w-full rounded-xl bg-[#FDFBF7] px-3 py-2 text-[13px]"/></div>
          <div className="sm:col-span-2 flex items-center gap-3">
            <label className="text-[12px] font-semibold">Visible on website</label>
            <button type="button" onClick={()=>set("visible",!form.visible)} className={`px-3 py-1.5 rounded-full text-[12px] font-semibold ${form.visible?"bg-[#86A789] text-white":"bg-[#9B2C2C] text-white"}`}>{form.visible?"Show":"Hidden"}</button>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-black/5 flex items-center justify-end gap-3">
          <button onClick={onClose} className="rounded-full px-5 py-2.5 text-[13px] font-semibold bg-[#FDFBF7] ring-1 ring-black/5">Cancel</button>
          <button onClick={save} disabled={busy} data-testid="save-product" className="rounded-full px-5 py-2.5 text-[13px] font-semibold bg-[#121212] text-white inline-flex items-center gap-2"><Save size={14}/>{busy?"Saving…":"Save"}</button>
        </div>
      </div>
    </div>
  );
};

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("All");

  const load = () => api.get("/products?includeHidden=true").then(({data})=>setItems(data));
  useEffect(()=>{ load(); }, []);

  const toggleVisible = async (p) => {
    await api.put(`/admin/products/${p.id}`, { visible: !p.visible });
    load();
  };

  const shown = filter==="All"? items : items.filter(i=>i.category===filter);

  return (
    <div data-testid="page-admin-products">
      <h1 className="font-display text-[28px] sm:text-[32px] font-bold tracking-tight">Products</h1>
      <p className="mt-1.5 text-[14px] text-[#525252]">Manage prices, stock, labels, descriptions, and visibility.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {["All",...CATS].map(c=>(
          <button key={c} onClick={()=>setFilter(c)} className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold ${filter===c?"bg-[#121212] text-white":"bg-white ring-1 ring-black/5 text-[#525252]"}`}>{c}</button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {shown.map(p => (
          <div key={p.id} data-testid={`admin-product-${p.id}`} className="rounded-[1.25rem] bg-white ring-1 ring-black/5 p-4 flex gap-4">
            <div className="h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-black">
              {p.image && <img src={p.image} alt={p.name} className="h-full w-full object-cover"/>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-wider font-bold" style={{color:p.accent||"#8D5B4C"}}>{p.category}</div>
              <div className="font-display font-semibold text-[14.5px] text-[#121212] truncate">{p.name}</div>
              <div className="mt-1 flex items-center gap-2 text-[12px] text-[#525252]">
                <span>{fmtIDR(p.price)}</span>
                {p.discountPct>0 && <span className="text-[#9B2C2C]">-{p.discountPct}%</span>}
                <span className="text-[#737373]">· {p.stockStatus}</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button onClick={()=>setEditing(p)} data-testid={`edit-${p.id}`} className="inline-flex items-center gap-1.5 rounded-full bg-[#121212] text-white px-3 py-1.5 text-[12px] font-semibold"><Pencil size={12}/>Edit</button>
                <button onClick={()=>toggleVisible(p)} data-testid={`toggle-${p.id}`} className="inline-flex items-center gap-1.5 rounded-full bg-[#FDFBF7] ring-1 ring-black/5 px-3 py-1.5 text-[12px] font-semibold text-[#525252]">{p.visible?<><Eye size={12}/>Visible</>:<><EyeOff size={12}/>Hidden</>}</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && <Editor product={editing} onClose={()=>setEditing(null)} onSaved={()=>{ setEditing(null); load(); }}/>}
    </div>
  );
}
