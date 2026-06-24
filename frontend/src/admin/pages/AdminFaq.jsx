import { useEffect, useState } from "react";
import api from "../../lib/api";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";

export default function AdminFaq() {
  const [items, setItems] = useState([]);
  const load = () => api.get("/faq?includeHidden=true").then(({data})=>setItems(data));
  useEffect(()=>{ load(); }, []);

  const upd = (id,patch)=>setItems(items.map(i=>i.id===id?{...i,...patch}:i));

  const save = async (it) => { await api.put(`/admin/faq/${it.id}`, it); load(); };
  const del = async (it) => { if(!window.confirm("Delete this FAQ?")) return; await api.delete(`/admin/faq/${it.id}`); load(); };
  const add = async () => {
    await api.post("/admin/faq", { questionId:"Pertanyaan baru?", answerId:"Jawaban...", questionEn:"New question?", answerEn:"Answer...", visible:true, sort:items.length });
    load();
  };

  return (
    <div data-testid="page-admin-faq">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[28px] sm:text-[32px] font-bold tracking-tight">FAQ / Content</h1>
          <p className="mt-1.5 text-[14px] text-[#525252]">Edit, hide, and reorder FAQ items shown on the public website.</p>
        </div>
        <button onClick={add} data-testid="faq-add" className="rounded-full bg-[#121212] text-white px-4 py-2 text-[12.5px] font-semibold inline-flex items-center gap-2"><Plus size={13}/>Add FAQ</button>
      </div>

      <div className="mt-6 space-y-4">
        {items.map(it=>(
          <div key={it.id} className="rounded-[1.25rem] bg-white ring-1 ring-black/5 p-5" data-testid={`faq-${it.id}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#737373] mb-1">Question ID</label>
                <input value={it.questionId||""} onChange={(e)=>upd(it.id,{questionId:e.target.value})} className="w-full rounded-lg bg-[#FDFBF7] px-3 py-2 text-[13px]"/>
                <label className="block text-[11px] font-bold uppercase text-[#737373] mt-3 mb-1">Answer ID</label>
                <textarea rows={2} value={it.answerId||""} onChange={(e)=>upd(it.id,{answerId:e.target.value})} className="w-full rounded-lg bg-[#FDFBF7] px-3 py-2 text-[13px]"/>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#737373] mb-1">Question EN</label>
                <input value={it.questionEn||""} onChange={(e)=>upd(it.id,{questionEn:e.target.value})} className="w-full rounded-lg bg-[#FDFBF7] px-3 py-2 text-[13px]"/>
                <label className="block text-[11px] font-bold uppercase text-[#737373] mt-3 mb-1">Answer EN</label>
                <textarea rows={2} value={it.answerEn||""} onChange={(e)=>upd(it.id,{answerEn:e.target.value})} className="w-full rounded-lg bg-[#FDFBF7] px-3 py-2 text-[13px]"/>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button onClick={()=>upd(it.id,{visible:!it.visible})} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold ${it.visible?"bg-[#86A789] text-white":"bg-[#9B2C2C] text-white"}`}>
                  {it.visible?<><Eye size={12}/>Visible</>:<><EyeOff size={12}/>Hidden</>}
                </button>
                <input type="number" value={it.sort||0} onChange={(e)=>upd(it.id,{sort:parseInt(e.target.value||"0",10)})} className="w-20 rounded-full bg-[#FDFBF7] px-3 py-1.5 text-[12px]" title="Sort"/>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={()=>del(it)} className="inline-flex items-center gap-1.5 rounded-full bg-[#9B2C2C]/10 text-[#9B2C2C] px-3 py-1.5 text-[12px] font-semibold"><Trash2 size={12}/>Delete</button>
                <button onClick={()=>save(it)} data-testid={`faq-save-${it.id}`} className="rounded-full bg-[#121212] text-white px-4 py-1.5 text-[12px] font-semibold">Save</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
