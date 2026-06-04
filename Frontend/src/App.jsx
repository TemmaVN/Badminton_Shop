import { Outlet, BrowserRouter, Route, Routes } from 'react-router-dom';
import PageHeader from './layouts/PageHeader';
import MainHeader from './layouts/MainHeader';
import { useMediaQuery } from './mystate/useMediaQuery';
import HomePage from './layouts/HomePage';
import Login from './layouts/Login';
import Register from './layouts/Register';
import Product from './layouts/Product';
import ProductDetail from './layouts/ProductDetail'
import Admin from './layouts/Admin';
import Dashboard from './components/admin/Dashboard';
import Statistics from './components/admin/Statistics';
import UserList from './components/admin/UserList';
import AdminInfo from './components/admin/AdminInfo';
import OrderList from './components/admin/OrderList';
import Payment from './components/admin/Payment';
import ProductList from './components/admin/ProductList';
import VoucherManagement from './components/admin/VoucherManagement';
import WarrantyManagement from './components/admin/WarrantyManagement';
import Brand from './components/admin/Brand';
import Categories from './components/admin/Categories';
import { Navigate } from 'react-router-dom';

const PublicLayout = () => {
  const isHideMainHeader = useMediaQuery('(min-width: 1250px)');
  return (
    <div className='bg-white relative h-auto w-full'>
      <PageHeader />
      {isHideMainHeader && <MainHeader />}
      <Outlet />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/:categorySlug' element={<Product/>} />
          <Route path='/p/:productSlug' element={<ProductDetail/>} />
        </Route>
        <Route path='/admin' element={<Admin />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='statistics' element={<Statistics />} />
          <Route path='users-list' element={<UserList />} />
          <Route path='admin-info' element={<AdminInfo />} />
          <Route path='orders' element={<OrderList />} />
          <Route path='payment' element={<Payment />} />
          <Route path='product' element={<ProductList />} />
          <Route path='vouchers' element={<VoucherManagement />} />
          <Route path='warranty' element={<WarrantyManagement />} />
          <Route path='brands' element={<Brand />} />
          <Route path='categories' element={<Categories />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
