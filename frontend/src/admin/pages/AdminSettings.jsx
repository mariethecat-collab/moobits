import { useEffect, useState } from "react";
import api from "../../lib/api";

const FIELDS = [
  ["whatsapp","WhatsApp Number"],
  ["email","Email"],
  ["instagram","Instagram"],
  ["area","Area"],
  ["hours","Operating Hours"],
  ["heroHeadlineId","Hero Headline (ID)"],
  ["heroHeadlineEn","Hero Headline (EN)"],
  ["heroSubId","Hero Subheadline (ID)"],
  ["heroSubEn","Hero Subheadline (EN)"],
  ["aboutId","About Copy (ID)"],
  ["aboutEn","About Copy (EN)"],
  ["promoBannerId","Promo Banner (ID)"],
  ["promoBannerEn","Promo Banner (EN)"],
];

export default function AdminSettings() {
  const [s, setS] = useState(null);
  const [msg, setMsg] = useState("");
  useEffect(()=>{ api.get("/settings/site").then(({data})=>setS(data)); }, []);
  if (!s) return <div className="text-[#525252]">Loading…</div>;
  const set = (k,v)=>setS({...s,[k]:v});
  const save = async () => { await api.put("/admin/settings/site", s); setMsg("Saved"); setTimeout(()=>setMsg(""),1500); };

  return (
    <div data-testid="page-admin-settings" className="max-w-3xl">
      <h1 className="font-display text-[28px] sm:text-[32px] font-bold tracking-tight">Site Settings</h1>
      <p className="mt-1.5 text-[14px] text-[#525252]">Edit contact info, hero, about, and promo banner copy. Public website reads these values.</p>

      <div className="mt-6 rounded-[1.5rem] bg-white ring-1 ring-black/5 p-6 space-y-4">
        {FIELDS.map(([k,l])=>{
          const isLong = k.startsWith("about")||k.startsWith("heroSub")||k.startsWith("promoBanner");
          return (
            <div key={k}>
              <label className="block text-[12px] font-semibold mb-1.5">{l}</label>
              {isLong ? (
                <textarea rows={2} value={s[k]||""} onChange={(e)=>set(k,e.target.value)} data-testid={`set-${k}`} className="w-full rounded-xl bg-[#FDFBF7] px-3 py-2 text-[13px]"/>
              ) : (
                <input value={s[k]||""} onChange={(e)=>set(k,e.target.value)} data-testid={`set-${k}`} className="w-full rounded-xl bg-[#FDFBF7] px-3 py-2 text-[13px]"/>
              )}
            </div>
          );
        })}

        <div className="flex items-center justify-end gap-3">
          {msg && <span className="text-[12px] text-[#86A789] font-semibold">{msg}</span>}
          <button onClick={save} data-testid="save-site-settings" className="rounded-full bg-[#121212] text-white px-5 py-2.5 text-[13px] font-semibold">Save Changes</button>
        </div>
      </div>

      <div className="mt-6 rounded-[1.5rem] bg-[#FDFBF7] ring-1 ring-black/5 p-5 text-[12.5px] text-[#525252]">
        <b className="text-[#121212]">Note:</b> Email notification to <code>moodinabites@gmail.com</code> requires <code>RESEND_API_KEY</code> in <code>/app/backend/.env</code>. Without the key, new-order notifications log to the server but are not sent.
      </div>
    </div>
  );
}
