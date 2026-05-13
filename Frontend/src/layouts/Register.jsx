import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FlashButton from '../components/FlashButton';
import { useMediaQuery } from '../mystate/useMediaQuery';

const Register = () => {
  const isShowPic = useMediaQuery("(min-width: 700px)");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      alert("Vui lòng đồng ý với Điều khoản sử dụng dịch vụ!");
      return;
    }
    
    if (password !== confirmPassword) {
      alert("Mật khẩu nhập lại không khớp!");
      return;
    }
    
    if (password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      alert(`Đăng ký thành công với email: ${email}`);
    }, 1000);
  };

  if (success) {
    return (
      <div className='flex w-full h-auto text-black justify-center items-center min-h-screen'>
        <div className='text-center'>
          <div className='text-green-500 text-2xl mb-4'>✅ Đăng ký thành công!</div>
          <Link to="/login" className='text-orange-default hover:text-orange-900'>Đăng nhập ngay</Link>
        </div>
      </div>
    );
  }

  return (
    <div className='flex w-full h-auto text-black'>
      {isShowPic && (
        <img 
          src="https://cdn.shopvnb.com/uploads/images/bai_viet/anh-cau-long-ngau-1-1737322298.webp" 
          alt="" 
          className='w-1/2 h-auto'
        />
      )}
      <form onSubmit={handleSubmit} className='flex flex-col grow max-w-150 mx-10 my-20 md:mx-20 justify-center gap-1'>
        <label className='font-bold text-4xl'>Đăng ký</label>
        
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
        {(password.length < 6 && password.length > 0) && (
          <p className='text-red-500 text-sm'>Mật khẩu phải có ít nhất 6 ký tự</p>
        )}
        
        <label className='pt-8'>Nhập lại mật khẩu</label>
        <input 
          type='password'
          className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 w-full'
          placeholder='Xác nhận mật khẩu'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {(confirmPassword.length > 0 && confirmPassword !== password) && (
          <p className='text-red-500 text-sm'>Mật khẩu nhập lại không khớp</p>
        )}  
        
        <div className='relative z-200 w-full flex gap-2 py-2'>
          <input 
            type="checkbox"
            className='size-4 accent-blue-600 cursor-pointer' 
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
          />
          <label>Tôi đồng ý với Điều khoản sử dụng dịch vụ</label>
        </div>
        
        <div className='w-full flex justify-center'>
          <FlashButton
            disabled={loading}
            type='submit'
            onClick={handleSubmit}
            itemName={loading ? "Đang xử lý..." : "Đăng ký"}
          />
        </div>
        
        <div className={`flex ${isShowPic ? '' : 'justify-center'}`}>
          <div className='flex gap-2 py-3'>
            <label>Bạn đã có tài khoản?</label>
            <Link to="/login" className='text-orange-default hover:text-orange-900'>Đăng nhập</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;