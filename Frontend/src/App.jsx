import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { CategoryProvider } from './contexts/CategoryContext';
import { ProductProvider } from './contexts/ProductContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';
import { useMediaQuery } from './mystate/useMediaQuery';

import PageHeader from './layouts/PageHeader';
import MainHeader from './layouts/MainHeader';
import Footer from './layouts/Footer';
import Admin from './layouts/Admin';
import CartPage from './layouts/CartPage';
import Contract from './layouts/Contract';
import HomePage from './layouts/HomePage';
import Login from './layouts/Login';
import MyOrder from './layouts/MyOrder';
import Product from './layouts/Product';
import ProductDetail from './layouts/ProductDetail';
import Register from './layouts/Register';
import UserInfor from './layouts/UserInfor';
import VoucherPage from './layouts/VoucherPage';

import ProtectedRoute from './components/ProtectedRoute';
import AdminInfo from './components/admin/AdminInfo';
import Brand from './components/admin/Brand';
import Categories from './components/admin/Categories';
import Dashboard from './components/admin/Dashboard';
import OrderList from './components/admin/OrderList';
import Payment from './components/admin/Payment';
import ProductList from './components/admin/ProductList';
import Statistics from './components/admin/Statistics';
import UserList from './components/admin/UserList';
import VoucherManagement from './components/admin/VoucherManagement';
import WarrantyManagement from './components/admin/WarrantyManagement';

function AppContent() {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const showMainHeader = useMediaQuery('(min-width: 1250px)') && !isAdmin();
  const adminOnlyPaths = ['/', '/login', '/register'];

  if (isAdmin() && adminOnlyPaths.includes(location.pathname)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen w-full">
      {!isAdmin() && <PageHeader />}
      {showMainHeader && <MainHeader />}

      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contract" element={<Contract />} />
        <Route path="/khuyen-mai" element={<VoucherPage />} />
        <Route path="/sales" element={<Navigate to="/khuyen-mai" replace />} />
        <Route path="/p/:productSlug" element={<ProductDetail />} />
        <Route path="/:categorySlug/*" element={<Product />} />

        {/* Protected – user */}
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/user-info" element={<ProtectedRoute><UserInfor /></ProtectedRoute>} />
        <Route path="/myorder" element={<ProtectedRoute><MyOrder /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute adminOnly={true}><Admin /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="product" element={<ProductList />} />
          <Route path="categories" element={<Categories />} />
          <Route path="brands" element={<Brand />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="users-list" element={<UserList />} />
          <Route path="payment" element={<Payment />} />
          <Route path="admin-info" element={<AdminInfo />} />
          <Route path="warranty" element={<WarrantyManagement />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="vouchers" element={<VoucherManagement />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={isAdmin() ? '/admin/dashboard' : '/'} replace />} />
      </Routes>

      {!isAdmin() && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <UserProvider>
          <CartProvider>
            <CategoryProvider>
              <ProductProvider>
                <BrowserRouter>
                  <AppContent />
                </BrowserRouter>
              </ProductProvider>
            </CategoryProvider>
          </CartProvider>
        </UserProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
