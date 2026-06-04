// src/layouts/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FlashButton from '../components/FlashButton';
import { useMediaQuery } from '../mystate/useMediaQuery';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';

const Login = () => {
  const isShowPic = useMediaQuery("(min-width: 700px)");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAdmin } = useAuth();
  const { getUserInfo } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      await getUserInfo();
      if (isAdmin()) {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } else {
      setError(result.message);
      alert(result.message);
    }
    setLoading(false);
  };

  return (
    <div className='flex w-full h-auto text-black'>
      {isShowPic && <img src="https://static.fbshop.vn/wp-content/uploads/2023/08/plogin-img.jpg" alt="" className='w-1/2 h-auto'/>}
      <form onSubmit={handleSubmit} className='flex flex-col grow max-w-150 mx-10 md:mx-20 justify-center gap-1'>
        <label className='font-bold text-4xl'>Đăng nhập</label>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <label className='pt-8'>Email</label>
        <input type='email' className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 w-full' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label className='pt-8'>Mật khẩu</label>
        <input type='password' className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 w-full' placeholder='Mật khẩu' value={password} onChange={(e) => setPassword(e.target.value)} required />
        <div className='w-full flex justify-end'>
          <a href="#" className='text-orange-default hover:text-orange-900 pt-3'>Quên mật khẩu</a>
        </div>
        <div className='w-full flex justify-center'>
          <FlashButton disabled={loading} type='submit' itemName={loading ? "Đang xử lý..." : "Đăng nhập"} />
        </div>
        <div className={`flex ${isShowPic ? '' : 'justify-center'}`}>
          <div className='flex gap-2 py-3'>
            <label>Bạn mới biết đến FBShop?</label>
            <Link to="/register" className='text-orange-default hover:text-orange-900'>Đăng ký</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;