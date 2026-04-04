import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { MainLayout } from "./components/layout/MainLayout";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { Home } from "./pages/Home";
import { Category } from "./pages/Category";
import { ProductDetail } from "./pages/ProductDetail";
import { CartPage } from "./pages/Cart";
import { CheckoutPage } from "./pages/Checkout";
import { AccountPage } from "./pages/Account";
import { AboutPage } from "./pages/About";
import { OrderHistoryPage } from "./pages/OrderHistory";
import Contact from "./pages/Contact";
import CustomersPage from "./pages/CustomersPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminProducts } from "./pages/admin/AdminProducts";
import AdminOrdersPage from "./pages/admin/AdminOrders";
import AdminUsersPage from "./pages/admin/AdminUsers";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <AnimatePresence mode="wait">
              <Routes>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/category/:categorySlug" element={<Category />} />
                  <Route path="/product/:slug" element={<ProductDetail />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/orders" element={<OrderHistoryPage />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/customers" element={<CustomersPage />} />
                  <Route path="/vendor" element={<AdminDashboard />} />
                  <Route path="/vendor/products" element={<AdminProducts />} />
                  <Route path="/vendor/products/:productId" element={<AdminProducts />} />
                  <Route path="/vendor/orders" element={<AdminOrdersPage />} />
                  <Route path="/vendor/users" element={<AdminUsersPage />} />
                </Route>
              </Routes>
            </AnimatePresence>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
