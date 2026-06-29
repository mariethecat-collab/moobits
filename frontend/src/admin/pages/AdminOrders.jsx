import { useEffect, useState } from "react";
import api from "../../lib/api";
import { Download, Copy, Search } from "lucide-react";

const STATUSES = ["New Order","Waiting Payment","Confirmed","In Production","Ready for Pickup/Delivery","Delivered","Completed","Canceled"];
const PAYMENTS = ["Unpaid","Paid","DP 50%"];
const fmtIDR = (n) => `Rp${(n || 0).toLocaleString("id-ID")}`;

const Detail = ({ order, onClose, onSaved }) => {
  const [form, setForm] = useState({ ...order });
  const set = (k,v)=>setForm(f=>({...f,[k]:v}));

  const save = async () => {
    try {
      await api.put(`/admin/orders/${order.invoiceNumber}`, {
        orderStatus: form.orderStatus, paymentStatus: form.paymentStatus, adminNotes: form.adminNotes||"",
      });
      onSaved();
    } catch (e) { alert(e.response?.data?.detail || e.message); }
  };

  const wa = `https://wa.me/${(form.customerWa||"").replace(/[^0-9]/g,"")}`;

  return (
    <div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div onClick={(e)=>e.stopPropagation()} className="bg-white rounded-[1.5rem] w-full max-w-2xl my-8 ring-1 ring-black/5 max-h-[88vh] overflow-y-auto" data-testid="order-detail">
        <div className="px-6 py-4 border-b border-black/5">
          <div className="text-[10px] uppercase tracking-wider font-bold text-[#8D5B4C]">Order</div>
          <div className="font-display text-[20px] font-bold">{order.invoiceNumber}</div>
        </div>
        <div className="px-6 py-5 grid grid-cols-2 gap-4 text-[13px]">
          <div><div className="text-[11px] text-[#737373] font-bold uppercase">Customer</div>{order.customerName}</div>
          <div><div className="text-[11px] text-[#737373] font-bold uppercase">WhatsApp</div>
            <div className="flex items-center gap-1"><span>{order.customerWa}</span>
              <button onClick={()=>navigator.clipboard?.writeText(order.customerWa)} className="text-[#8D5B4C]"><Copy size={11}/></button>
              <a href={wa} target="_blank" rel="noreferrer" className="text-[#86A789] text-[11px] font-bold">WA</a>
            </div>
          </div>
          <div><div className="text-[11px] text-[#737373] font-bold uppercase">Method</div>{order.method}</div>
          <div><div className="text-[11px] text-[#737373] font-bold uppercase">Date</div>{order.deliveryDate}</div>
          {order.address && <div className="col-span-2"><div className="text-[11px] text-[#737373] font-bold uppercase">Address</div>{order.address}</div>}
          <div><div className="text-[11px] text-[#737373] font-bold uppercase">Payment Method</div>{order.paymentMethod}</div>
          <div><div className="text-[11px] text-[#737373] font-bold uppercase">Created</div>{(order.createdAt||"").slice(0,16).replace("T"," ")}</div>
        </div>

        <div className="px-6 pb-5">
          <div className="text-[11px] text-[#737373] font-bold uppercase mb-2">Items</div>
          <div className="rounded-xl bg-[#FDFBF7] ring-1 ring-black/5 divide-y divide-black/5">
            {(order.items||[]).map((it,i)=>(
              <div key={i} className="flex gap-3 p-3">
                <div className="h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-black">{it.image && <img src={it.image} alt="" className="h-full w-full object-cover"/>}</div>
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-[#8D5B4C]">{it.category}</div>
                  <div className="text-[13px] font-semibold">{it.productName}</div>
                  {it.note && <div className="text-[11px] italic text-[#737373]">Note: {it.note}</div>}
                  <div className="text-[12px] text-[#525252]">{it.qty} × {fmtIDR(it.unitPrice)}</div>
                </div>
                <div className="font-bold text-[13px]">{fmtIDR(it.lineTotal)}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 space-y-1 text-[13px]">
            <div className="flex justify-between text-[#525252]"><span>Subtotal</span><span>{fmtIDR(order.subtotalOriginal)}</span></div>
            {order.discount>0 && <div className="flex justify-between text-[#9B2C2C]"><span>Discount</span><span>− {fmtIDR(order.discount)}</span></div>}
            <div className="flex justify-between font-bold text-[14px] pt-1.5 border-t border-black/5"><span>Total</span><span>{fmtIDR(order.total)}</span></div>
          </div>
        </div>

        <div className="px-6 pb-5 grid grid-cols-2 gap-3">
          <div><label className="block text-[11px] font-bold uppercase text-[#737373] mb-1">Order Status</label>
            <select value={form.orderStatus} onChange={(e)=>set("orderStatus",e.target.value)} data-testid="order-status-select" className="w-full rounded-xl bg-[#FDFBF7] px-3 py-2 text-[13px]">{STATUSES.map(s=><option key={s}>{s}</option>)}</select></div>
          <div><label className="block text-[11px] font-bold uppercase text-[#737373] mb-1">Payment Status</label>
            <select value={form.paymentStatus} onChange={(e)=>set("paymentStatus",e.target.value)} data-testid="payment-status-select" className="w-full rounded-xl bg-[#FDFBF7] px-3 py-2 text-[13px]">{PAYMENTS.map(s=><option key={s}>{s}</option>)}</select></div>
          <div className="col-span-2"><label className="block text-[11px] font-bold uppercase text-[#737373] mb-1">Admin Notes</label>
            <textarea rows={2} value={form.adminNotes||""} onChange={(e)=>set("adminNotes",e.target.value)} className="w-full rounded-xl bg-[#FDFBF7] px-3 py-2 text-[13px]"/></div>
        </div>

        <div className="px-6 py-4 border-t border-black/5 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-full px-5 py-2.5 text-[13px] font-semibold bg-[#FDFBF7] ring-1 ring-black/5">Close</button>
          <button onClick={save} data-testid="save-order" className="rounded-full px-5 py-2.5 text-[13px] font-semibold bg-[#121212] text-white">Save</button>
        </div>
      </div>
    </div>
  );
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [statusF, setStatusF] = useState("");
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selected, setSelected] = useState(null);

  const load = async () => {
    const params = {};
    if (statusF) params.status = statusF;
    if (q) params.q = q;
    if (from) params.fromDate = from;
    if (to) params.toDate = to;
    const { data } = await api.get("/admin/orders", { params });
    setOrders(data);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [statusF, from, to]);

  const exportUrl = () => {
    const u = new URL(`${process.env.REACT_APP_BACKEND_URL}/api/admin/orders-export.csv`);
    if (statusF) u.searchParams.set("status", statusF);
    if (from) u.searchParams.set("fromDate", from);
    if (to) u.searchParams.set("toDate", to);
    return u.toString();
  };

const updateOrderStatus = (id, status) => {
  setOrders((prev) =>
    prev.map((o) =>
      o.id === id ? { ...o, orderStatus: status } : o
    )
  );
};

const updatePaymentStatus = (id, status) => {
  setOrders((prev) =>
    prev.map((o) =>
      o.id === id ? { ...o, paymentStatus: status } : o
    )
  );
};

const sendWhatsAppUpdate = (o) => {
  const rawPhone = o.customerPhone || o.phone || o.whatsapp || "";
  const phone = rawPhone.replace(/^0/, "62").replace(/[^0-9]/g, "");

  const message = `Halo ${o.customerName || "Customer"}, ini dari Moobits ya.

Order kamu dengan invoice ${o.invoiceNumber} statusnya: ${o.orderStatus || "Confirmed"}.

Thank you sudah order di Moobits.
Treat Yourself, Fix Your Mood.`;

  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
};

  return (
    <div data-testid="page-admin-orders">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-[28px] sm:text-[32px] font-bold tracking-tight">Orders</h1>
          <p className="mt-1 text-[14px] text-[#525252]">View, filter, and update incoming orders.</p>
        </div>
        <a
          href={exportUrl()}
          data-testid="export-csv"
          className="inline-flex items-center gap-2 rounded-full bg-[#121212] text-white px-4 py-2.5 text-[13px] font-semibold"
        ><Download size={14}/>Export CSV</a>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]"/>
          <input value={q} onChange={(e)=>setQ(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&load()} placeholder="Search name, WA, invoice…" className="w-full rounded-full bg-white ring-1 ring-black/5 pl-9 pr-4 py-2.5 text-[13px]"/>
        </div>
        <select value={statusF} onChange={(e)=>setStatusF(e.target.value)} data-testid="orders-filter-status" className="rounded-full bg-white ring-1 ring-black/5 px-4 py-2.5 text-[13px]">
          <option value="">All Statuses</option>
          {STATUSES.map(s=><option key={s}>{s}</option>)}
        </select>
        <input type="date" value={from} onChange={(e)=>setFrom(e.target.value)} className="rounded-full bg-white ring-1 ring-black/5 px-4 py-2.5 text-[13px]"/>
        <input type="date" value={to} onChange={(e)=>setTo(e.target.value)} className="rounded-full bg-white ring-1 ring-black/5 px-4 py-2.5 text-[13px]"/>
      </div>

      <div className="mt-5 rounded-[1.5rem] bg-white ring-1 ring-black/5 overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-[#FDFBF7] text-left text-[11px] uppercase tracking-wider text-[#737373]">
            <tr>
              <th className="px-5 py-3">Invoice</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Payment</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-7 text-center text-[#737373]">No orders match.</td></tr>
            )}
            {orders.map(o=>(
              <tr key={o.invoiceNumber} className="border-t border-black/5" data-testid={`order-row-${o.invoiceNumber}`}>
                <td className="px-5 py-3 font-semibold">{o.invoiceNumber}</td>
                <td className="px-5 py-3">{o.customerName}<div className="text-[11px] text-[#737373]">{o.customerWa}</div></td>
                <td className="px-5 py-3">{fmtIDR(o.total)}</td>
                <td className="px-5 py-3">{o.paymentStatus}</td>
                <td className="px-5 py-3">{o.orderStatus}</td>
                <td className="px-5 py-3 text-right align-top">
                  <div className="flex flex-wrap justify-end gap-1 max-w-[220px] ml-auto">
                    <button
                    onClick={() => navigator.clipboard.writeText(o.customerPhone || o.phone || o.whatsapp || "")}
                    className="px-2 py-1 rounded-lg bg-gray-100 text-gray-700 text-[11px]"
                  >
                    Copy WA
                  </button>

                  <button
                    onClick={() => updatePaymentStatus(o.id, "Paid")}
                    className="px-2 py-1 rounded-lg bg-green-100 text-green-700 text-[11px]"
                  >
                    Paid
                  </button>

                  <button
                    onClick={() => updateOrderStatus(o.id, "In Production")}
                    className="px-2 py-1 rounded-lg bg-yellow-100 text-yellow-700 text-[11px]"
                  >
                    Production
                  </button>

                  <button
                    onClick={() => updateOrderStatus(o.id, "Ready")}
                    className="px-2 py-1 rounded-lg bg-blue-100 text-blue-700 text-[11px]"
                  >
                    Ready
                  </button>

                  <button
                    onClick={() => sendWhatsAppUpdate(o)}
                    className="px-2 py-1 rounded-lg bg-[#8D5B4C] text-white text-[11px]"
                  >
                    Send WA
                  </button>

                  <button
                    onClick={() => setSelected(o)}
                    className="px-2 py-1 rounded-lg border border-black/10 text-[11px]"
                  >
                    View
                  </button>
                </div>
              </td>
              </tr>

            ))}
          </tbody>
        </table>

        {selected && (
  <Detail
    order={selected}
    onClose={() => setSelected(null)}
    onSaved={() => {
      // isi function kalau ada
    }}
  />
)}

      </div>

      {selected && <Detail order={selected} onClose={()=>setSelected(null)} onSaved={()=>{ setSelected(null); load(); }}/>}
    </div>
  );
}
