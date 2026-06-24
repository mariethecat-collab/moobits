import { ShieldAlert } from "lucide-react";
import { useLang } from "../i18n/LanguageContext";

export default function Disclaimer({ compact = false }) {
  const { lang } = useLang();
  const allergen =
    lang === "id"
      ? "Produk mengandung telur, gluten, keju/dairy. Beberapa varian mengandung almond."
      : "Products contain egg, gluten, cheese/dairy. Some variants contain almond.";
  const homemade =
    lang === "id"
      ? "Karena dibuat homemade dan fresh by order, bentuk, topping, warna, dan tampilan akhir dapat sedikit berbeda dari foto."
      : "Because every product is made homemade and fresh by order, shape, topping, color, and final look may slightly vary from photos.";

  return (
    <div
      data-testid="disclaimer-card"
      className={`rounded-2xl bg-[#FDFBF7] ring-1 ring-black/5 ${
        compact ? "p-4" : "p-5"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-xl bg-[#FCD34D]/20 text-[#8D5B4C] flex items-center justify-center shrink-0">
          <ShieldAlert size={16} />
        </div>
        <div className="text-[12.5px] leading-relaxed text-[#525252]">
          <div>
            <b className="text-[#121212]">
              {lang === "id" ? "Alergen:" : "Allergen:"}
            </b>{" "}
            {allergen}
          </div>
          <div className="mt-1.5">
            <b className="text-[#121212]">
              {lang === "id" ? "Homemade:" : "Homemade:"}
            </b>{" "}
            {homemade}
          </div>
        </div>
      </div>
    </div>
  );
}
