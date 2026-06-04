// src/layouts/CartDrawer.jsx
import React from 'react';
import { X, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const CartDrawer = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const { cart, totalItems, updateCartItem, deleteCartItem, loading } = useCart();

  const changeQuantity = async (cartItemId, detailId, delta, currentQuantity) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity <= 0) {
      await deleteCartItem(cartItemId);
    } else {
      await updateCartItem(cartItemId, newQuantity);
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.subTotal || item.unitPrice * item.quantity), 0);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 ease-in-out z-999 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsOpen(false)}
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-112.5 bg-white shadow-2xl z-1000 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all">
          <X size={24} />
        </button>
        <div className="flex flex-col h-full">
          <div className="pt-12 pb-6 text-center">
            <h2 className="text-4xl font-bold text-[#001e3c]">Giỏ hàng</h2>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            {loading && <div className="text-center py-20">Đang tải...</div>}
            {!loading && cart.length === 0 && (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">🛒</p>
                <p className="text-gray-500">Giỏ hàng trống</p>
                <button onClick={() => setIsOpen(false)} className="mt-4 text-orange-500 hover:text-orange-600">Tiếp tục mua sắm</button>
              </div>
            )}
            {!loading && cart.map((item) => (
              <div key={item.cartItemId} className="flex gap-4 relative">
                <div className="w-20 h-20 shrink-0">
                  <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-contain border border-gray-100 rounded-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[16px] font-medium leading-tight text-gray-800 line-clamp-2 mb-3">{item.productName}</h3>
                  <p className="text-xs text-gray-400 mb-2">{item.variantInfo}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded">
                      <button onClick={() => changeQuantity(item.cartItemId, item.detailId, -1, item.quantity)} className="px-2 py-1 text-gray-500 hover:text-orange-500 transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="px-3 py-1 text-xs font-bold border-x border-gray-200">{item.quantity < 10 ? `0${item.quantity}` : item.quantity}</span>
                      <button onClick={() => changeQuantity(item.cartItemId, item.detailId, 1, item.quantity)} className="px-2 py-1 text-gray-500 hover:text-orange-500 transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="text-orange-600 font-bold text-base">{item.unitPrice.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 border-t border-gray-100 bg-white">
            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
              <span className="text-xl font-bold text-red-600">{totalAmount.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-center">
              <button onClick={() => { setIsOpen(false); navigate('/cart'); }} className="py-3.5 px-20 bg-orange-500 text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-orange-100">
                <ShoppingCart size={18} /> Đặt mua
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;