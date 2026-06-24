import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Tag,
  FileText,
  HelpCircle,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/promos", label: "Promos", icon: Tag },
  { to: "/admin/invoice-settings", label: "Invoice Settings", icon: FileText },
  { to: "/admin/faq", label: "FAQ / Content", icon: HelpCircle },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#121212]" data-testid="admin-layout">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 min-h-screen bg-white border-r border-black/5 px-4 py-6 sticky top-0">
          <div className="px-2 mb-7">
            <div className="font-display text-[19px] font-bold tracking-tight">
              Moobits Admin
            </div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#8D5B4C] font-bold mt-0.5">
              Control Panel
            </div>
          </div>
          <nav className="flex-1 space-y-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                data-testid={`admin-nav-${to.split("/").pop()}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all ${
                    isActive
                      ? "bg-[#121212] text-white"
                      : "text-[#525252] hover:bg-[#FDFBF7]"
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-5 pt-5 border-t border-black/5 space-y-1">
            <div className="px-3 text-[11px] text-[#737373] truncate">
              {user?.email}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              data-testid="admin-logout"
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium text-[#9B2C2C] hover:bg-[#9B2C2C]/10"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 min-w-0 p-6 sm:p-8 lg:p-10">
          {/* Mobile top bar */}
          <div className="md:hidden mb-5 flex items-center justify-between">
            <div className="font-display font-bold">Moobits Admin</div>
            <button onClick={handleLogout} className="text-[#9B2C2C] text-sm font-semibold">
              Logout
            </button>
          </div>
          {/* Mobile nav (horizontal scroll) */}
          <nav className="md:hidden mb-6 flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `shrink-0 px-3 py-2 rounded-full text-[12.5px] font-semibold ${
                    isActive ? "bg-[#121212] text-white" : "bg-white ring-1 ring-black/5 text-[#525252]"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
