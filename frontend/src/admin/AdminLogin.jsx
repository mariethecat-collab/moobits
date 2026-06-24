import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "./AuthContext";

export default function AdminLogin() {
  const { login, user } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@moobits.id");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user && typeof user === "object") {
    nav("/admin/dashboard", { replace: true });
  }

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const r = await login(email.trim(), password);
    setBusy(false);
    if (!r.ok) setError(r.error || "Login failed");
    else nav("/admin/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-5">
      <div className="w-full max-w-md rounded-[2rem] bg-white ring-1 ring-black/5 p-8">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-[#121212] text-white flex items-center justify-center">
            <Lock size={18} />
          </div>
          <div>
            <div className="font-display text-[18px] font-bold">Moobits Admin</div>
            <div className="text-[12px] text-[#737373]">Sign in to manage your shop</div>
          </div>
        </div>

        <form onSubmit={submit} className="mt-7 space-y-4" data-testid="admin-login-form">
          <div>
            <label className="block text-[12px] font-semibold text-[#525252] mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="login-email"
              className="w-full rounded-2xl bg-[#FDFBF7] px-4 py-3 text-[14px] ring-1 ring-black/5 focus:ring-[#8D5B4C] outline-none"
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-[#525252] mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="login-password"
              className="w-full rounded-2xl bg-[#FDFBF7] px-4 py-3 text-[14px] ring-1 ring-black/5 focus:ring-[#8D5B4C] outline-none"
            />
          </div>
          {error && (
            <div
              data-testid="login-error"
              className="flex items-center gap-2 rounded-2xl bg-[#9B2C2C]/10 text-[#9B2C2C] px-4 py-3 text-[13px] font-medium"
            >
              <AlertCircle size={15} />
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={busy}
            data-testid="login-submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#121212] px-6 py-3.5 text-[14px] font-semibold text-white hover:bg-[#2A2A2A] disabled:opacity-60 transition-all"
          >
            <LogIn size={15} />
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
