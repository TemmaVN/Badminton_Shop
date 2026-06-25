// src/layouts/CartPage.jsx
import React, { useState, useEffect } from 'react';
import {
  ChevronLeftIcon, MapPinIcon, CreditCardIcon, BanknotesIcon,
  WalletIcon, DevicePhoneMobileIcon, ShieldCheckIcon, ChevronRightIcon,
  UserIcon, PhoneIcon, MapIcon, HomeIcon, DocumentTextIcon, ShoppingBagIcon,
  TagIcon, ChevronDownIcon, ChevronUpIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon, CheckIcon } from '@heroicons/react/24/solid';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { useVoucher } from '../contexts/VoucherContext';
import { useOrder } from '../contexts/OrderContext';
import { orderApi } from '../api';

// Ánh xạ key thanh toán UI -> giá trị paymentMethod backend
const PAYMENT_METHOD_MAP = {
  COD: 'COD',
  bank: 'Bank Transfer',
  momo: 'E-Wallet',
  zalopay: 'E-Wallet',
};

const CartPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const productItem = location.state?.productItem ?? null;
  const isSingleItem = productItem !== null;

  const { cart, fetchCart, deleteCartItem } = useCart();
  const { user, getUserInfo } = useUser();
  const { getCheckoutVouchers } = useVoucher();
  const { createOrder } = useOrder();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isLoading, setIsLoading] = useState(false);
  const [orderError, setOrderError] = useState('');

  // Voucher / preview state
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucherIds, setSelectedVoucherIds] = useState([]);
  const [voucherOpen, setVoucherOpen] = useState(false);
  const [preview, setPreview] = useState(null);

  // paymentMethod gửi cho backend (đã ánh xạ)
  const backendPaymentMethod = PAYMENT_METHOD_MAP[paymentMethod] ?? 'COD';

  // Hiển thị sản phẩm: nếu mua ngay thì chỉ 1 item, nếu từ giỏ hàng thì lấy từ cart
  const displayItems = isSingleItem
    ? [{
        cartItemId: productItem.detailId,
        imageUrl: productItem.imageUrl,
        productName: productItem.productName,
        variantInfo: productItem.variantInfo,
        quantity: productItem.quantity,
        unitPrice: productItem.unitPrice,
        subTotal: productItem.unitPrice * productItem.quantity,
        detailId: productItem.detailId,
      }]
    : cart;

  const subtotal = displayItems.reduce((acc, item) => acc + item.subTotal, 0);
  const totalQuantity = displayItems.reduce((acc, item) => acc + item.quantity, 0);

  // Khởi tạo form data từ user info (đã lấy từ context)
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    city: '',
    district: '',
    address: '',
    note: ''
  });

  // Lấy thông tin user khi component mount hoặc user thay đổi
  useEffect(() => {
    const loadUserInfo = async () => {
      if (!user) {
        await getUserInfo();
      }
    };
    loadUserInfo();
  }, [user, getUserInfo]);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
        city: user.city || '',
        district: user.district || '',
        address: user.detailedAddress || '',
        note: ''
      });
    }
  }, [user]);

  // Nếu không phải mua ngay và giỏ hàng trống, tải lại giỏ
  useEffect(() => {
    if (!isSingleItem && cart.length === 0) {
      fetchCart();
    }
  }, [isSingleItem, cart.length, fetchCart]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Chi tiết đơn cho voucher/preview/order
  const orderDetails = displayItems.map(item => ({
    detailId: item.detailId,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
  }));

  // Lấy danh sách voucher áp dụng được khi vào bước 2 hoặc đổi phương thức thanh toán
  useEffect(() => {
    if (step !== 2 || displayItems.length === 0) return;
    let cancelled = false;
    getCheckoutVouchers(orderDetails, backendPaymentMethod)
      .then(list => {
        if (cancelled) return;
        const arr = Array.isArray(list) ? list : [];
        setVouchers(arr);
        // Bỏ chọn voucher không còn áp dụng được (đổi phương thức thanh toán)
        const eligibleIds = new Set(arr.filter(v => v.isEligible !== false).map(v => v.voucherId));
        setSelectedVoucherIds(prev => prev.filter(id => eligibleIds.has(id)));
      })
      .catch(() => { if (!cancelled) setVouchers([]); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, paymentMethod, displayItems.length]);

  const buildOrderPayload = () => ({
    receiverName: formData.fullName,
    phoneNumber: formData.phoneNumber,
    shippingAddress: `${formData.address}, ${formData.district}, ${formData.city}`,
    paymentMethod: backendPaymentMethod,
    voucherIds: selectedVoucherIds,
    orderDetails: displayItems.map(item => ({
      detailId: item.detailId,
      quantity: item.quantity,
    })),
  });

  // Xem trước tổng tiền (đã trừ voucher) khi đổi voucher/phương thức ở bước 2
  useEffect(() => {
    if (step !== 2 || displayItems.length === 0) return;
    let cancelled = false;
    orderApi.preview(buildOrderPayload())
      .then(res => { if (!cancelled) setPreview(res.data ?? null); })
      .catch(() => { if (!cancelled) setPreview(null); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, paymentMethod, selectedVoucherIds, displayItems.length]);

  const toggleVoucher = (id) =>
    setSelectedVoucherIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  const totalDiscount = preview?.totalDiscount ?? 0;
  const finalTotal = preview?.finalAmount ?? subtotal;

  const handleNextAction = async () => {
    if (step === 1) {
      if (!formData.fullName || !formData.phoneNumber || !formData.address) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
      }
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsLoading(true);
      setOrderError('');
      try {
        const payload = buildOrderPayload();
        const previewRes = await orderApi.preview(payload);
        if (previewRes.data && previewRes.data.isValid === false) {
          setOrderError(previewRes.data.errorMessage || 'Đơn hàng không hợp lệ. Vui lòng kiểm tra lại.');
          return;
        }
        const result = await createOrder(payload);
        if (result.success) {
          if (!isSingleItem) {
            try {
              await Promise.all(cart.map(item => deleteCartItem(item.cartItemId)));
              await fetchCart();
            } catch {
              fetchCart().catch(() => {});
            }
          }
          alert('Đặt hàng thành công! 🎉');
          navigate('/');
        } else {
          setOrderError(result.message || 'Đặt hàng thất bại. Vui lòng thử lại!');
        }
      } catch (error) {
        setOrderError(error.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại!');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] py-10 px-4 text-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => step === 2 ? setStep(1) : window.history.back()}
            className="p-3 bg-white rounded-full border border-gray-100 shadow-sm hover:bg-gray-50"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-black">Đặt hàng</h1>
            <p className="text-sm text-gray-500">
              {step === 1 ? 'Thông tin giao hàng' : 'Xác nhận & thanh toán'}
            </p>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="flex items-center mb-12 relative max-w-4xl mx-auto">
          <div className="flex items-center gap-3 z-10 bg-[#fcfcfc] pr-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-orange-default text-white' : 'bg-gray-100 text-gray-400'}`}>
              {step > 1 ? <CheckCircleIcon className="w-6 h-6" /> : '1'}
            </div>
            <span className={`text-sm font-semibold ${step >= 1 ? 'text-orange-default' : 'text-gray-400'}`}>Thông tin</span>
          </div>
          <div className={`absolute top-5 left-0 right-0 h-0.5 -z-10 transition-colors duration-300 ${step > 1 ? 'bg-orange-default' : 'bg-gray-100'}`}></div>
          <div className="flex items-center gap-3 z-10 bg-[#fcfcfc] pl-4 ml-auto">
            <span className={`text-sm font-semibold ${step === 2 ? 'text-orange-default' : 'text-gray-400'}`}>Xác nhận</span>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${step === 2 ? 'bg-orange-default text-white' : 'bg-gray-100 text-gray-400'}`}>
              2
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
          {/* CỘT TRÁI */}
          <div className="space-y-6">
            {step === 1 && (
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm animate-fade-in">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 bg-orange-100 text-orange-default rounded-full">
                    <MapPinIcon className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-black">Thông tin người nhận</h2>
                </div>
                <div className="space-y-6">
                  <InputField label="Họ và tên" name="fullName" value={formData.fullName} onChange={handleInputChange} icon={UserIcon} placeholder="VD: Nguyễn Văn An" required />
                  <InputField label="Số điện thoại" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} icon={PhoneIcon} placeholder="VD: 0901234567" required />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Tỉnh / Thành phố" name="city" value={formData.city} onChange={handleInputChange} placeholder="VD: TP. Hồ Chí Minh" required />
                    <InputField label="Phường / Xã" name="district" value={formData.district} onChange={handleInputChange} icon={MapIcon} placeholder="VD: Phường 2" required />
                  </div>
                  <InputField label="Số nhà, tên đường" name="address" value={formData.address} onChange={handleInputChange} icon={HomeIcon} placeholder="VD: 123 Nguyễn Trãi" required />
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-600">Ghi chú đơn hàng (tuỳ chọn)</label>
                    <div className="relative">
                      <DocumentTextIcon className="w-5 h-5 text-gray-400 absolute top-4 left-4" />
                      <textarea 
                        name="note"
                        value={formData.note}
                        onChange={handleInputChange}
                        placeholder="Giao giờ hành chính, gọi trước khi giao..." 
                        rows="4"
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-100 rounded-2xl bg-[#fafafa] placeholder:text-gray-300 text-sm focus:ring-1 focus:ring-orange-default focus:border-orange-default outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative">
                  <div className="flex items-center gap-3 mb-4">
                    <MapPinIcon className="w-6 h-6 text-orange-default" />
                    <h2 className="text-lg font-black text-gray-800">Địa chỉ giao hàng</h2>
                  </div>
                  <button onClick={() => setStep(1)} className="absolute top-6 right-6 text-orange-default text-sm font-bold hover:underline">Thay đổi</button>
                  <div className="space-y-1 text-sm">
                    <p className="font-black text-base">{formData.fullName}</p>
                    <p className="text-gray-600 flex items-center gap-2"><PhoneIcon className="w-4 h-4" /> {formData.phoneNumber}</p>
                    <p className="text-gray-600 flex items-start gap-2 mt-2">
                      <MapPinIcon className="w-4 h-4 shrink-0 mt-0.5" /> 
                      <span>{formData.address}, {formData.district}, {formData.city}</span>
                    </p>
                    {formData.note && <p className="text-gray-500 italic mt-2">- Ghi chú: {formData.note}</p>}
                  </div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-8">
                    <CreditCardIcon className="w-6 h-6 text-orange-default" />
                    <h2 className="text-lg font-black">Phương thức thanh toán</h2>
                  </div>
                  <div className="space-y-4">
                    <PaymentOption id="COD" title="Thanh toán khi nhận hàng" desc="Trả tiền mặt khi nhận hàng (COD)" icon={<BanknotesIcon className="w-6 h-6" />} selected={paymentMethod === 'COD'} onSelect={() => setPaymentMethod('COD')} />
                    <PaymentOption id="bank" title="Chuyển khoản ngân hàng" desc="Vietcombank, BIDV, Techcombank..." icon={<CreditCardIcon className="w-6 h-6" />} selected={paymentMethod === 'bank'} onSelect={() => setPaymentMethod('bank')} />
                    <PaymentOption id="momo" title="Ví MoMo" desc="Thanh toán nhanh qua ví MoMo" icon={<WalletIcon className="w-6 h-6" />} selected={paymentMethod === 'momo'} onSelect={() => setPaymentMethod('momo')} />
                    <PaymentOption id="zalopay" title="ZaloPay" desc="Thanh toán qua ứng dụng ZaloPay" icon={<DevicePhoneMobileIcon className="w-6 h-6" />} selected={paymentMethod === 'zalopay'} onSelect={() => setPaymentMethod('zalopay')} />
                  </div>
                </div>
                <div className="p-4 bg-orange-50/50 rounded-2xl flex items-center gap-3 text-orange-default border border-orange-100/50">
                  <ShieldCheckIcon className="w-5 h-5 shrink-0" />
                  <p className="text-[11px] font-medium">Thông tin của bạn được bảo mật an toàn. Đổi trả dễ dàng trong 7 ngày.</p>
                </div>
              </div>
            )}
          </div>

          {/* CỘT PHẢI: BILL THANH TOÁN */}
          <div className="lg:sticky lg:top-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-50 text-orange-default rounded-full">
                <ShoppingBagIcon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black">Đơn hàng ({totalQuantity} sản phẩm)</h3>
            </div>
            <div className="space-y-4 max-h-75 overflow-y-auto pr-2 custom-scrollbar">
              {displayItems.map(item => (
                <div key={item.cartItemId} className="flex flex-row items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                  <div className="relative shrink-0">
                    <img src={item.imageUrl} alt={item.productName} className="w-16 h-16 rounded-xl object-cover border border-gray-100 shadow-sm" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-orange-default text-white flex items-center justify-center text-[10px] font-bold shadow-md">{item.quantity}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight">{item.productName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.variantInfo}</p>
                  </div>
                  <div className="text-sm font-bold text-orange-default whitespace-nowrap">{item.unitPrice.toLocaleString()} đ</div>
                </div>
              ))}
            </div>
            {/* ── Voucher selector (chỉ hiện ở bước xác nhận) ── */}
            {step === 2 && vouchers.some(v => v.isEligible !== false) && (
              <div className="mt-5 border border-dashed border-orange-200 rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setVoucherOpen(o => !o)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-orange-50/60 hover:bg-orange-50 transition-colors"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-orange-700">
                    <TagIcon className="w-4 h-4" />
                    Mã giảm giá
                    {selectedVoucherIds.length > 0 && (
                      <span className="bg-orange-default text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {selectedVoucherIds.length}
                      </span>
                    )}
                  </span>
                  {voucherOpen
                    ? <ChevronUpIcon className="w-4 h-4 text-orange-500" />
                    : <ChevronDownIcon className="w-4 h-4 text-orange-500" />}
                </button>

                {voucherOpen && (
                  <div className="divide-y divide-orange-50 max-h-56 overflow-y-auto">
                    {vouchers.filter(v => v.isEligible !== false).map(v => {
                      const isSelected = selectedVoucherIds.includes(v.voucherId);
                      const meetsMin = subtotal >= (v.minOrderValue ?? 0);
                      return (
                        <button
                          key={v.voucherId}
                          type="button"
                          onClick={() => meetsMin && toggleVoucher(v.voucherId)}
                          disabled={!meetsMin}
                          className={`w-full text-left flex items-center gap-3 px-4 py-3 transition-colors
                            ${isSelected ? 'bg-emerald-50' : meetsMin ? 'hover:bg-gray-50' : 'opacity-50 cursor-not-allowed bg-white'}`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                            ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'}`}>
                            {isSelected && <CheckIcon className="w-3 h-3 text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold font-mono text-gray-800 truncate">{v.voucherCode}</p>
                            <p className="text-[11px] text-gray-500 truncate">
                              {v.isPercent ? `Giảm ${v.discountValue}%` : `Giảm ${(v.discountValue ?? 0).toLocaleString()}đ`}
                              {' · '}Tối thiểu {(v.minOrderValue ?? 0).toLocaleString()}đ
                            </p>
                          </div>
                          {!meetsMin && (
                            <span className="text-[10px] text-gray-400 shrink-0">Chưa đủ ĐK</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <div className="pt-6 space-y-4 mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Tạm tính</span>
                <span className="font-bold text-gray-900">{subtotal.toLocaleString()} đ</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Phí vận chuyển</span>
                <span className="font-bold text-orange-default">Miễn phí</span>
              </div>
              {totalDiscount > 0 && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Giảm giá</span>
                    <span className="font-bold text-emerald-600">−{Math.round(totalDiscount).toLocaleString()} đ</span>
                  </div>
                  {preview?.appliedVouchers?.map((av, i) => {
                    // preview trả { voucherId, discountValue }; tra mã từ danh sách voucher
                    const code = av.voucherCode
                      ?? vouchers.find(v => v.voucherId === av.voucherId)?.voucherCode
                      ?? `#${av.voucherId}`;
                    const amount = av.appliedDiscount ?? av.discountValue ?? 0;
                    return (
                      <div key={i} className="flex justify-between text-xs pl-2">
                        <span className="text-emerald-600 font-mono">{code}</span>
                        <span className="text-emerald-600">−{Math.round(amount).toLocaleString()}đ</span>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
            <div className="mt-4 p-3 bg-green-50 border border-green-100 text-green-600 rounded-xl text-xs font-medium flex items-center gap-2">
              🎉 Bạn được miễn phí vận chuyển!
            </div>
            <div className="flex justify-between items-center pt-6 border-t border-dashed border-gray-200 mt-6">
              <span className="font-black text-lg">Tổng cộng</span>
              <span className="text-2xl font-black text-orange-default">{Math.round(finalTotal).toLocaleString()} đ</span>
            </div>
          </div>
        </div>

        {/* NÚT ACTION */}
        <div className="mt-10 flex justify-center pb-20">
          {orderError && <p className="text-center text-red-500 text-sm mb-3">{orderError}</p>}
          <button 
            onClick={handleNextAction}
            disabled={isLoading}
            className="w-full max-w-xl py-4 px-8 bg-orange-default text-white text-lg font-black rounded-2xl hover:bg-orange-dark hover:shadow-orange-200 transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-2 tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Đang xử lý...
              </>
            ) : (
              <>
                {step === 1 ? 'Tiếp tục tới thanh toán' : 'Xác nhận đặt hàng'}
                <ChevronRightIcon className="w-6 h-6" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Component Input
const InputField = ({ label, name, value, onChange, icon: Icon, required, ...props }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-sm font-medium text-gray-600">{label} {required && <span className="text-red-500">*</span>}</label>
    <div className="relative">
      {Icon && <Icon className="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 left-4" />}
      <input type="text" name={name} value={value} onChange={onChange} className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3.5 border border-gray-200 rounded-2xl bg-white placeholder:text-gray-300 text-sm focus:ring-2 focus:ring-orange-default/20 focus:border-orange-default outline-none transition-all text-gray-800 font-medium`} {...props} />
    </div>
  </div>
);

const PaymentOption = ({ id, title, desc, icon, selected, onSelect }) => (
  <div onClick={onSelect} className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${selected ? 'border-orange-default bg-orange-50/30 shadow-sm shadow-orange-100' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
    <div className={`p-3 rounded-xl ${selected ? 'bg-white text-orange-default shadow-sm' : 'bg-gray-50 text-gray-400'}`}>{icon}</div>
    <div className="flex-1">
      <p className={`text-sm font-black ${selected ? 'text-gray-900' : 'text-gray-800'}`}>{title}</p>
      <p className="text-xs text-gray-500 mt-1">{desc}</p>
    </div>
    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selected ? 'border-orange-default' : 'border-gray-200'}`}>
      {selected && <div className="w-3 h-3 rounded-full bg-orange-default" />}
    </div>
  </div>
);

export default CartPage;