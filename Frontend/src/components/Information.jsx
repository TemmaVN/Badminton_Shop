import React, { useEffect, useState } from 'react';
import MyInput from './MyInput';
import { useMediaQuery } from '../mystate/useMediaQuery';
import FlashButton from './FlashButton';
import { useUser } from '../contexts/UserContext';

const Information = () => {
  const { user, updateProfile, getUserInfo } = useUser();
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setDateOfBirth(user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '');
      setEmail(user.email || '');
      setPhoneNumber(user.phoneNumber || '');
      setCity(user.city || '');
      setDistrict(user.district || '');
      setDetailedAddress(user.detailedAddress || '');
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!fullName || !email) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }
    setLoading(true);
    const result = await updateProfile({ fullName, dateOfBirth, phoneNumber, city, district, detailedAddress });
    if (result.success) {
      alert('Cập nhật thành công!');
      getUserInfo();
    } else {
      alert(result.message);
    }
    setLoading(false);
  };

  const isMini = useMediaQuery('(max-width: 768px)');
  const isCol = useMediaQuery('(min-width: 970px)');

  return (
    <form onSubmit={handleSave} className={`w-full h-full p-8 flex flex-col border-gray-300 ${isMini ? 'border-y-2' : 'border-l-2'}`}>
      <div className='border-b-2 border-gray-300 pb-8'>
        <h2 className='font-bold text-2xl pb-8'>Thông tin tài khoản</h2>
        <div className='flex flex-wrap gap-3 justify-around items-center'>
          <img src="https://static.fbshop.vn/template/assets/images/im-des.png" className='rounded-full h-20 w-20'/>
          <div className={`flex grow ${isCol ? '' : 'flex-wrap'} max-w-160 gap-3`}>
            <div className={`flex flex-wrap grow ${isCol ? 'max-w-80' : 'max-w-120'}`}>
              <div className='flex flex-col grow max-w-120'>
                <div className='flex gap-2 pb-2'><label>Họ và tên</label><span className='text-orange-default'>*</span></div>
                <MyInput size="200" placeHolder="Họ và tên" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className='flex flex-col grow max-w-120'>
                <label className='pb-2'>Ngày sinh</label>
                <MyInput size="200" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
              </div>
            </div>
            <div className={`flex flex-wrap grow ${isCol ? 'max-w-80' : 'max-w-120'}`}>
              <div className='flex grow flex-col max-w-120'>
                <label className='pb-2'>Email</label>
                <MyInput size="200" isReadOnly={true} value={email} />
              </div>
              <div className='flex grow flex-col max-w-120'>
                <label className='pb-2'>Số điện thoại</label>
                <MyInput size="200" placeHolder="Số điện thoại" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='pt-8 gap-8 flex flex-col'>
        <h2 className='font-bold text-2xl'>Thông tin giao hàng</h2>
        <div className='flex flex-col gap-3'>
          <MyInput size="800" placeHolder="Tỉnh/thành phố" value={city} onChange={(e) => setCity(e.target.value)} />
          <MyInput size="800" placeHolder="Phường/xã" value={district} onChange={(e) => setDistrict(e.target.value)} />
          <MyInput size="800" placeHolder="Địa chỉ của bạn" value={detailedAddress} onChange={(e) => setDetailedAddress(e.target.value)} />
        </div>
      </div>
      <div className='flex w-full justify-center mt-4'>
        <FlashButton type='submit' itemName={loading ? "Đang lưu..." : "Lưu thông tin"} />
      </div>
    </form>
  );
};

export default Information;