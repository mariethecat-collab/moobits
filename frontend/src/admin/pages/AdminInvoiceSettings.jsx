import { useEffect, useState } from "react";
import api from "../../lib/api";

const fileToDataURL = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

export default function AdminInvoiceSettings() {
  const [s, setS] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(()=>{ api.get("/settings/invoice").then(({data})=>setS(data)); }, []);

  if (!s) return <div className="text-[#525252]">Loading…</div>;
  const set = (k,v)=>setS({...s,[k]:v});

  const handleQris = async (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    if (f.size > 5*1024*1024) { alert("Max 5MB"); return; }
    set("qrisImage", await fileToDataURL(f));
  };

  const save = async () => {
    await api.put("/admin/settings/invoice", s);
    setMsg("Saved");
    setTimeout(()=>setMsg(""), 1500);
  };

  return (
    <div data-testid="page-admin-invoice-settings" className="max-w-3xl">
      <h1 className="font-display text-[28px] sm:text-[32px] font-bold tracking-tight">Invoice Settings</h1>
      <p className="mt-1.5 text-[14px] text-[#525252]">Upload QRIS image, edit payment account info, and invoice footer.</p>

      <div className="mt-6 rounded-[1.5rem] bg-white ring-1 ring-black/5 p-6 space-y-5">
        <div className="flex items-start gap-5">
          <div className="h-32 w-32 shrink-0 rounded-2xl bg-[#FDFBF7] ring-1 ring-black/5 flex items-center justify-center overflow-hidden">
            {s.qrisImage ? <img src={s.qrisImage} alt="QRIS" className="h-full w-full object-contain"/> : <span className="text-[10px] text-[#737373] text-center px-2">No QRIS uploaded</span>}
          </div>
          <div className="flex-1">
            <label className="block text-[12px] font-semibold mb-1.5">QRIS Image</label>
            <input type="file" accept="image/*" onChange={handleQris} data-testid="qris-upload"/>
            <p className="mt-1 text-[10.5px] text-[#737373]">Replace with real QRIS later. PNG/JPG, max 5MB.</p>
            {s.qrisImage && <button onClick={()=>set("qrisImage","")} className="mt-2 text-[11px] text-[#9B2C2C] font-semibold">Remove image</button>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[["accountName","Payment Account Name"],["bcaAccountName","BCA Account Name"],["bcaAccountNumber","BCA Account Number"],["adminWhatsapp","Admin WhatsApp"]].map(([k,l])=>(
            <div key={k}>
              <label className="block text-[12px] font-semibold mb-1.5">{l}</label>
              <input value={s[k]||""} onChange={(e)=>set(k,e.target.value)} data-testid={`invoice-${k}`} className="w-full rounded-xl bg-[#FDFBF7] px-3 py-2 text-[13px] ring-1 ring-black/5 focus:ring-[#8D5B4C] outline-none"/>
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="block text-[12px] font-semibold mb-1.5">E-wallet Note</label>
            <input value={s.ewalletNote||""} onChange={(e)=>set("ewalletNote",e.target.value)} className="w-full rounded-xl bg-[#FDFBF7] px-3 py-2 text-[13px] ring-1 ring-black/5"/>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[12px] font-semibold mb-1.5">Invoice Footer Note</label>
            <textarea rows={2} value={s.footerNote||""} onChange={(e)=>set("footerNote",e.target.value)} className="w-full rounded-xl bg-[#FDFBF7] px-3 py-2 text-[13px]"/>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          {msg && <span className="text-[12px] text-[#86A789] font-semibold">{msg}</span>}
          <button onClick={save} data-testid="save-invoice-settings" className="rounded-full bg-[#121212] text-white px-5 py-2.5 text-[13px] font-semibold">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
