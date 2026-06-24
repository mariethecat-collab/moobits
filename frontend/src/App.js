import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { CartProvider } from "@/cart/CartContext";
import { AuthProvider } from "@/admin/AuthContext";
import CartDrawer from "@/cart/CartDrawer";
import Layout from "@/components/Layout";
import ScrollToTop from "@/components/ScrollToTop";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Menu from "@/pages/Menu";
import OrderGuide from "@/pages/OrderGuide";
import FAQ from "@/pages/FAQ";
import Order from "@/pages/Order";
import BulkOrder from "@/pages/BulkOrder";
import Policy from "@/pages/Policy";

// Admin
import AdminLogin from "@/admin/AdminLogin";
import AdminLayout from "@/admin/AdminLayout";
import ProtectedRoute from "@/admin/ProtectedRoute";
import AdminDashboard from "@/admin/pages/AdminDashboard";
import AdminProducts from "@/admin/pages/AdminProducts";
import AdminOrders from "@/admin/pages/AdminOrders";
import AdminPromos from "@/admin/pages/AdminPromos";
import AdminInvoiceSettings from "@/admin/pages/AdminInvoiceSettings";
import AdminFaq from "@/admin/pages/AdminFaq";
import AdminSettings from "@/admin/pages/AdminSettings";

const PublicShell = ({ children }) => (
  <>
    <Layout>{children}</Layout>
    <CartDrawer />
  </>
);

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <LanguageProvider>
          <CartProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                {/* Public */}
                <Route path="/" element={<PublicShell><Home /></PublicShell>} />
                <Route path="/about" element={<PublicShell><About /></PublicShell>} />
                <Route path="/menu" element={<PublicShell><Menu /></PublicShell>} />
                <Route path="/order-guide" element={<PublicShell><OrderGuide /></PublicShell>} />
                <Route path="/faq" element={<PublicShell><FAQ /></PublicShell>} />
                <Route path="/order" element={<PublicShell><Order /></PublicShell>} />
                <Route path="/bulk-order" element={<PublicShell><BulkOrder /></PublicShell>} />
                <Route path="/policy" element={<PublicShell><Policy /></PublicShell>} />

                {/* Admin */}
                <Route path="/admin" element={<AdminLogin />} />
                <Route
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/promos" element={<AdminPromos />} />
                  <Route path="/admin/invoice-settings" element={<AdminInvoiceSettings />} />
                  <Route path="/admin/faq" element={<AdminFaq />} />
                  <Route path="/admin/settings" element={<AdminSettings />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </LanguageProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
