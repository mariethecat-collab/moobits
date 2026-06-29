import { useEffect, useState } from "react";
import api from "../../lib/api";
import {
  ShoppingBag, Clock, CheckCircle2, Star, DollarSign, Tag, AlertCircle,
} from "lucide-react";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from "recharts";

const Card = ({ icon: Icon, label, value, color = "#8D5B4C", testid }) => (
  <div
    data-testid={testid}
    className="rounded-[1.5rem] bg-white ring-1 ring-black/5 p-5"
  >
    <div className="flex items-center gap-3">
      <div
        className="h-10 w-10 rounded-2xl flex items-center justify-center"
        style={{ background: `${color}1A`, color }}
      >
        <Icon size={17} />
      </div>
      <div className="text-[12px] uppercase tracking-wider font-bold text-[#737373]">
        {label}
      </div>
    </div>
    <div className="mt-4 font-display text-[26px] font-bold text-[#121212]">
      {value}
    </div>
  </div>
);

const salesData = [
  { day: "Sen", sales: 120000 },
  { day: "Sel", sales: 85000 },
  { day: "Rab", sales: 150000 },
  { day: "Kam", sales: 110000 },
  { day: "Jum", sales: 200000 },
  { day: "Sab", sales: 175000 },
  { day: "Min", sales: 240000 },
];

const productData = [
  { name: "Classic OG", orders: 12 },
  { name: "Blue Monstiez", orders: 8 },
  { name: "Bolu Pandan", orders: 15 },
  { name: "Bolu Ketan", orders: 18 },
  { name: "Brownies", orders: 7 },
];

const statusData = [
  { name: "New Order", value: 6 },
  { name: "Waiting Payment", value: 4 },
  { name: "Confirmed", value: 5 },
  { name: "Completed", value: 10 },
];

const COLORS = ["#8D5B4C", "#FCD34D", "#A92D2D", "#6B8E23"];

const ChartCard = ({ title, children }) => (
  <div className="rounded-[1.5rem] bg-white ring-1 ring-black/5 p-5">
    <h2 className="font-bold text-[#3A241C] mb-4">{title}</h2>
    {children}
  </div>
);

const fmtIDR = (n) => `Rp${(n || 0).toLocaleString("id-ID")}`;

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    api.get("/admin/stats").then(({ data }) => setStats(data)).catch((e) => setErr(e.message));
  }, []);

  if (err) return <div className="text-red-700">{err}</div>;
  if (!stats) return <div className="text-[#525252]">Loading…</div>;

  return (
    <div data-testid="page-admin-dashboard">
      <h1 className="font-display text-[28px] sm:text-[32px] font-bold tracking-tight">
        Dashboard Overview
      </h1>
      <p className="mt-1.5 text-[14px] text-[#525252]">
        Snapshot of orders, revenue, and active promos.
      </p>

      <div className="mt-7 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card icon={ShoppingBag} label="Total Orders" value={stats.totalOrders} color="#8D5B4C" testid="stat-total" />
        <Card icon={AlertCircle} label="New Orders" value={stats.newOrders} color="#9B2C2C" testid="stat-new" />
        <Card icon={Clock} label="Waiting Payment" value={stats.waitingPayment} color="#FCD34D" testid="stat-waiting" />
        <Card icon={CheckCircle2} label="Completed" value={stats.completed} color="#86A789" testid="stat-completed" />
        <Card icon={DollarSign} label="Revenue (Paid)" value={fmtIDR(stats.revenue)} color="#3B82F6" testid="stat-revenue" />
        <Card icon={Star} label="Best Seller" value={stats.bestSeller || "—"} color="#FCD34D" testid="stat-best" />
        <Card icon={Tag} label="Active Promos" value={stats.activePromos} color="#86A789" testid="stat-promos" />
        <Card icon={CheckCircle2} label="Confirmed" value={stats.confirmed} color="#8D5B4C" testid="stat-confirmed" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-7">
  <ChartCard title="Weekly Sales">
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={salesData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis tickFormatter={(v) => `${v / 1000}k`} />
        <Tooltip />
        <Line type="monotone" dataKey="sales" stroke="#8D5B4C" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  </ChartCard>

  <ChartCard title="Best Selling Products">
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={productData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="orders" fill="#8D5B4C" radius={[10, 10, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </ChartCard>

  <ChartCard title="Order Status">
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={100} label>
          {statusData.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </ChartCard>
</div>

      <div className="mt-9">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-[20px] font-bold">Recent Orders</h2>
        </div>
        <div className="rounded-[1.5rem] bg-white ring-1 ring-black/5 overflow-hidden">
          {stats.recent?.length ? (
            <table className="w-full text-[13px]">
              <thead className="bg-[#FDFBF7] text-left text-[11px] uppercase tracking-wider text-[#737373]">
                <tr>
                  <th className="px-5 py-3">Invoice</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Payment</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((o) => (
                  <tr key={o.invoiceNumber} className="border-t border-black/5">
                    <td className="px-5 py-3 font-semibold">{o.invoiceNumber}</td>
                    <td className="px-5 py-3">{o.customerName}</td>
                    <td className="px-5 py-3">{fmtIDR(o.total)}</td>
                    <td className="px-5 py-3">{o.paymentStatus}</td>
                    <td className="px-5 py-3">{o.orderStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="px-5 py-7 text-center text-[#737373] text-[14px]">
              No orders yet. Orders from the public site will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
