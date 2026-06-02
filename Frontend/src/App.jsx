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
import Dashboard from './components/admin/Dashboard';
import Statistics from './components/admin/Statistics';
import UserList from './components/admin/UserList';
import AdminInfo from './components/admin/AdminInfo';
import ChangePassword from './components/ChangePassword';
import Information from './components/Information';
import MyOrder from './layouts/MyOrder';
import CartDrawer from './layouts/CartDrawer';
import CartPage from './layouts/CartPage';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const isHideMainHeader = useMediaQuery('(min-width: 1250px)');

  return (
    <AuthProvider>
      <UserProvider>
        <CartProvider>
          <BrowserRouter>
            <div className="bg-white relative h-auto w-full">
              <PageHeader
                setIsMenuOpen={setIsMenuOpen}
                setIsCartOpen={setIsCartOpen}
              />
              {isHideMainHeader && <MainHeader />}
              <MenuHeader isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
              <Routes>
                <Route path="/" element={<Advertisement />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/admin-info" element={<AdminInfo />} />
                <Route path="/changepwd" element={<ChangePassword />} />
                <Route path="/information" element={<Information />} />
                <Route path="/myorder" element={<MyOrder />} />
                <Route path="/cart" element={<CartPage />} />
              </Routes>
              <CartDrawer isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
            </div>
          </BrowserRouter>
        </CartProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;