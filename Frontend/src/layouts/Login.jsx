import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FlashButton from '../components/FlashButton';
import { useMediaQuery } from '../mystate/useMediaQuery';

const Login = () => {
  const isShowPic = useMediaQuery("(min-width: 700px)");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      alert(`Đăng nhập thành công với email: ${email}`);
    }, 1000);
  };

  if (success) {
    return (
      <div className='flex w-full h-auto text-black justify-center items-center min-h-screen'>
        <div className='text-center'>
          <div className='text-green-500 text-2xl mb-4'>✅ Đăng nhập thành công!</div>
          <Link to="/" className='text-orange-default hover:text-orange-900'>Về trang chủ</Link>
        </div>
      </div>
    );
  }

  return (
    <div className='flex w-full h-auto text-black'>
      {isShowPic && (
        <img 
          src="https://static.fbshop.vn/wp-content/uploads/2023/08/plogin-img.jpg" 
          alt="" 
          className='w-1/2 h-auto'
        />
      )}
      <form onSubmit={handleSubmit} className='flex flex-col grow max-w-150 mx-10 md:mx-20 justify-center gap-1'>
        <label className='font-bold text-4xl'>Đăng nhập</label>
        
        <label className='pt-8'>Email</label>
        <input 
          type='email'
          className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 w-full'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <label className='pt-8'>Mật khẩu</label>
        <input 
          type='password'
          className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 w-full'
          placeholder='Mật khẩu'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <div className='w-full flex justify-end'>
          <a href="#" className='text-orange-default hover:text-orange-900 pt-3'>Quên mật khẩu</a>
        </div>
        
        <div className='w-full flex justify-center'>
          <FlashButton
            disabled={loading}
            type='submit'
            onClick={handleSubmit}
            itemName={loading ? "Đang xử lý..." : "Đăng nhập"}
          />
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