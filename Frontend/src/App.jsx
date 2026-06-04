import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { CartProvider } from './contexts/CartContext';
import PageHeader from './layouts/PageHeader';
import MainHeader from './layouts/MainHeader';
import MenuHeader from './layouts/MenuHeader';
import { useMediaQuery } from './mystate/useMediaQuery';
import Advertisement from './components/Advertisement';
import Login from './layouts/Login';
import Register from './layouts/Register';
import Product from './layouts/Product';
import ProductDetail from './layouts/ProductDetail';
import Admin from './layouts/Admin';
import Dashboard from './components/admin/Dashboard';
import Statistics from './components/admin/Statistics';
import UserList from './components/admin/UserList';
import AdminInfo from './components/admin/AdminInfo';
import UserInfor from './layouts/UserInfor';
import MyOrder from './layouts/MyOrder';
import CartDrawer from './layouts/CartDrawer';
import CartPage from './layouts/CartPage';

const UserLayout = ({ isMenuOpen, setIsMenuOpen, isCartOpen, setIsCartOpen, children }) => {
  const isHideMainHeader = useMediaQuery('(min-width: 1250px)');
  return (
    <div className="bg-white relative h-auto w-full">
      <PageHeader setIsMenuOpen={setIsMenuOpen} setIsCartOpen={setIsCartOpen} />
      {isHideMainHeader && <MainHeader />}
      <MenuHeader isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      {children}
      <CartDrawer isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
    </div>
  );
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <AuthProvider>
      <UserProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Admin routes - wrapped inside Admin layout (no header/footer) */}
              <Route element={<Admin />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/admin-info" element={<AdminInfo />} />
              </Route>

              {/* Public routes - wrapped inside user layout with header */}
              <Route
                path="*"
                element={
                  <UserLayout
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                    isCartOpen={isCartOpen}
                    setIsCartOpen={setIsCartOpen}
                  >
                    <Routes>
                      <Route path="/" element={<Advertisement />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/products/:categorySlug" element={<Product />} />
                      <Route path="/p/:productSlug" element={<ProductDetail />} />
                      <Route path="/user-info" element={<UserInfor />} />
                      <Route path="/myorder" element={<MyOrder />} />
                      <Route path="/cart" element={<CartPage />} />
                    </Routes>
                  </UserLayout>
                }
              />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;