import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function AdminPromos() {
  const [promos, setPromos] = useState([]);
  const load = () => api.get("/promos?activeOnly=false").then(({data})=>setPromos(data));
  useEffect(()=>{ load(); }, []);

  const update = async (id, patch) => {
    await api.put(`/admin/promos/${id}`, patch);
    load();
  };

  return (
    <div data-testid="page-admin-promos">
      <h1 className="font-display text-[28px] sm:text-[32px] font-bold tracking-tight">Promos</h1>
      <p className="mt-1.5 text-[14px] text-[#525252]">Toggle active state and edit descriptions for built-in promos.</p>

      <div className="mt-6 space-y-4">
        {promos.map(p=>(
          <div key={p.id} className="rounded-[1.5rem] bg-white ring-1 ring-black/5 p-5" data-testid={`promo-${p.id}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-[#8D5B4C]">{p.type}</div>
                <div className="font-display text-[17px] font-bold">{p.name}</div>
                <div className="mt-1 text-[12.5px] text-[#525252]">{p.descId}</div>
                <div className="mt-0.5 text-[12.5px] text-[#737373] italic">{p.descEn}</div>
                {p.bundlePrice && (
                  <div className="mt-2 text-[12px] text-[#525252]">
                    Original: Rp{(p.originalPrice||0).toLocaleString("id-ID")} → Bundle: Rp{(p.bundlePrice||0).toLocaleString("id-ID")}
                  </div>
                )}
                {p.discountPct && p.type==="percentage" && (
                  <div className="mt-2 text-[12px] text-[#525252]">Discount: <b>{p.discountPct}%</b> · Category: <b>{p.appliesToCategory||"All"}</b></div>
                )}
              </div>
              <button onClick={()=>update(p.id,{active:!p.active})} data-testid={`promo-toggle-${p.id}`} className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-bold ${p.active?"bg-[#86A789] text-white":"bg-[#9B2C2C] text-white"}`}>
                {p.active?"Active":"Inactive"}
              </button>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><label className="block text-[11px] font-bold uppercase text-[#737373] mb-1">Description ID</label>
                <textarea rows={2} value={p.descId||""} onChange={(e)=>setPromos(ps=>ps.map(x=>x.id===p.id?{...x,descId:e.target.value}:x))} className="w-full rounded-xl bg-[#FDFBF7] px-3 py-2 text-[12.5px]"/></div>
              <div><label className="block text-[11px] font-bold uppercase text-[#737373] mb-1">Description EN</label>
                <textarea rows={2} value={p.descEn||""} onChange={(e)=>setPromos(ps=>ps.map(x=>x.id===p.id?{...x,descEn:e.target.value}:x))} className="w-full rounded-xl bg-[#FDFBF7] px-3 py-2 text-[12.5px]"/></div>
            </div>
            <div className="mt-3 text-right">
              <button onClick={()=>update(p.id,{descId:p.descId,descEn:p.descEn})} data-testid={`promo-save-${p.id}`} className="rounded-full bg-[#121212] text-white px-4 py-2 text-[12px] font-semibold">Save Description</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
