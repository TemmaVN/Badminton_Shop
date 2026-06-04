// src/components/ChangePass.jsx
import React, { useState } from 'react';
import MyInput from './MyInput';
import FlashButton from './FlashButton';
import { useMediaQuery } from '../mystate/useMediaQuery';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const ChangePass = () => {
  const isMini = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();
  const { changePassword } = useUser();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Mật khẩu mới và xác nhận không khớp!');
      return;
    }
    if (newPassword.length < 6) {
      alert('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }
    setLoading(true);
    const result = await changePassword(oldPassword, newPassword);
    if (result.success) {
      alert('Đổi mật khẩu thành công!');
      navigate('/user-info');
    } else {
      alert(result.message);
    }
    setLoading(false);
  };

  return (
    <form className={`max-w-160 h-full p-8 gap-4 flex flex-col grow border-gray-300 ${isMini ? 'border-t-2' : 'border-l-2'}`}>
      <h2 className='font-bold text-2xl pb-4'>Thay đổi mật khẩu</h2>
      <div className='gap-3 flex flex-col font-medium'>
        <label>Mật khẩu cũ</label>
        <MyInput size="300" type="password" placeholder='Mật khẩu cũ' value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
      </div>
      <div className='gap-3 flex flex-col font-medium'>
        <label>Mật khẩu mới</label>
        <MyInput size="300" type="password" placeholder='Mật khẩu mới' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        {newPassword && newPassword.length < 6 && <span className='text-red-500 text-sm'>Mật khẩu mới phải có ít nhất 6 ký tự</span>}
      </div>
      <div className='gap-3 flex flex-col font-medium'>
        <label>Nhập lại mật khẩu mới</label>
        <MyInput size="300" type="password" placeholder='Nhập lại mật khẩu mới' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        {confirmPassword && confirmPassword !== newPassword && <span className='text-red-500 text-sm'>Mật khẩu xác nhận không khớp</span>}
      </div>
      <div className='w-full flex justify-center'>
        <FlashButton disabled={loading} onClick={handleSave} itemName={loading ? "Đang lưu..." : "Lưu thay đổi"} />
      </div>
    </form>
  );
};

export default ChangePass;