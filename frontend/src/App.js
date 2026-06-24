import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { CartProvider } from "@/cart/CartContext";
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

function App() {
  return (
    <div className="App">
      <LanguageProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/order-guide" element={<OrderGuide />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/order" element={<Order />} />
                <Route path="/bulk-order" element={<BulkOrder />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </Layout>
            <CartDrawer />
          </BrowserRouter>
        </CartProvider>
      </LanguageProvider>
    </div>
  );
}

export default App;
