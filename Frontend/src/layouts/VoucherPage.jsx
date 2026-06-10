import { useState } from 'react';
import { Search, Copy, Check, Tag, Clock, Bookmark, BookmarkCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const formatCurrency = (v) => v.toLocaleString('vi-VN') + 'đ';
const formatDate = (d) => new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

const MOCK_VOUCHERS = [
  { voucherId: 1, voucherCode: "WELCOME10",  isPercent: true,  discountValue: 10,     maxDiscountAmount: 100000, minOrderValue: 500000,  endDate: "2026-12-31", description: "Giảm 10% cho đơn hàng đầu tiên",           isGlobal: true  },
  { voucherId: 2, voucherCode: "SUMMER50K",  isPercent: false, discountValue: 50000,  maxDiscountAmount: null,   minOrderValue: 800000,  endDate: "2026-09-30", description: "Giảm 50.000đ cho đơn từ 800.000đ",         isGlobal: true  },
  { voucherId: 3, voucherCode: "NEWUSER20",  isPercent: true,  discountValue: 20,     maxDiscountAmount: 200000, minOrderValue: 1000000, endDate: "2026-12-31", description: "Ưu đãi khách hàng mới – giảm 20%",         isGlobal: false },
  { voucherId: 4, voucherCode: "RACKET15",   isPercent: true,  discountValue: 15,     maxDiscountAmount: 150000, minOrderValue: 2000000, endDate: "2026-08-31", description: "Giảm 15% cho đơn hàng từ 2 triệu",         isGlobal: true  },
  { voucherId: 5, voucherCode: "FREESHIP",   isPercent: false, discountValue: 30000,  maxDiscountAmount: null,   minOrderValue: 300000,  endDate: "2026-07-31", description: "Miễn phí vận chuyển toàn quốc",            isGlobal: true  },
  { voucherId: 6, voucherCode: "VIP100K",    isPercent: false, discountValue: 100000, maxDiscountAmount: null,   minOrderValue: 2000000, endDate: "2026-11-30", description: "Ưu đãi độc quyền cho khách hàng VIP",      isGlobal: false },
  { voucherId: 7, voucherCode: "FLASH25",    isPercent: true,  discountValue: 25,     maxDiscountAmount: 300000, minOrderValue: 1500000, endDate: "2026-06-30", description: "Flash sale cuối tuần – giảm 25%",          isGlobal: true  },
];

const TABS = [
  { id: 'all',     label: 'Tất cả'     },
  { id: 'percent', label: '% Giảm'    },
  { id: 'fixed',   label: 'Giảm tiền' },
];

const VoucherCard = ({ voucher, isSaved, onSave, isAuth }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(voucher.voucherCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const discountLabel = voucher.isPercent
    ? `Giảm ${voucher.discountValue}%${voucher.maxDiscountAmount ? ` (tối đa ${formatCurrency(voucher.maxDiscountAmount)})` : ''}`
    : `Giảm ${formatCurrency(voucher.discountValue)}`;

  return (
    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex hover:shadow-md transition-shadow'>
      <div className='w-2 bg-orange-default shrink-0' />
      <div className='flex-1 p-5'>
        <div className='flex items-start justify-between gap-3 mb-3'>
          <div>
            <div className='flex items-center gap-2 mb-1'>
              <Tag size={14} className='text-orange-default' />
              <span className='text-xs text-orange-default font-semibold uppercase tracking-wide'>
                {voucher.isPercent ? 'Giảm theo %' : 'Giảm tiền mặt'}
              </span>
            </div>
            <h3 className='font-black text-lg text-gray-900'>{discountLabel}</h3>
            <p className='text-sm text-gray-500 mt-0.5'>{voucher.description}</p>
          </div>
          <button
            onClick={() => isAuth && onSave(voucher.voucherId)}
            className={`p-2 rounded-xl transition-colors ${isSaved ? 'text-orange-default bg-orange-50' : 'text-gray-300 hover:text-orange-default hover:bg-orange-50'}`}
            title={isAuth ? (isSaved ? 'Đã lưu' : 'Lưu voucher') : 'Đăng nhập để lưu'}
          >
            {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
          </button>
        </div>

        <div className='flex items-center justify-between gap-3 pt-3 border-t border-dashed border-gray-200'>
          <div className='space-y-1'>
            <p className='text-xs text-gray-400'>Đơn tối thiểu: <span className='font-semibold text-gray-600'>{formatCurrency(voucher.minOrderValue)}</span></p>
            <div className='flex items-center gap-1 text-xs text-gray-400'>
              <Clock size={11} />
              <span>HSD: {formatDate(voucher.endDate)}</span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <span className='font-mono font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded-lg text-sm tracking-wider'>
              {voucher.voucherCode}
            </span>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                copied ? 'bg-green-100 text-green-600' : 'bg-orange-default text-white hover:bg-orange-dark'
              }`}
            >
              {copied ? <><Check size={14} /> Đã chép</> : <><Copy size={14} /> Sao chép</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const VoucherPage = () => {
  const { isAuthenticated } = useAuth();
  const [savedIds, setSavedIds] = useState(new Set());
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const handleSave = (voucherId) => {
    setSavedIds((prev) => new Set([...prev, voucherId]));
  };

  const filtered = MOCK_VOUCHERS.filter(v => {
    const matchTab = activeTab === 'all' || (activeTab === 'percent' ? v.isPercent : !v.isPercent);
    const q = search.toLowerCase();
    const matchSearch = !q || v.voucherCode.toLowerCase().includes(q) || v.description.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  return (
    <div className='min-h-screen bg-gray-50 py-10 px-4'>
      <div className='max-w-3xl mx-auto'>
        <div className='text-center mb-10'>
          <div className='inline-flex items-center gap-2 bg-orange-50 text-orange-default px-4 py-2 rounded-full text-sm font-semibold mb-4'>
            <Tag size={16} /> Ưu đãi dành cho bạn
          </div>
          <h1 className='text-3xl font-black text-gray-900 mb-2'>Kho Voucher</h1>
          <p className='text-gray-500'>Sao chép mã để áp dụng khi thanh toán</p>
        </div>

        <div className='bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row gap-3'>
          <div className='relative flex-1'>
            <Search size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm mã voucher..."
              className='w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition'
            />
          </div>
          <div className='flex gap-2'>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-orange-default text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className='text-center py-16'>
            <p className='text-4xl mb-3'>🏷️</p>
            <p className='text-gray-500'>Không tìm thấy voucher phù hợp</p>
          </div>
        ) : (
          <div className='space-y-4'>
            {filtered.map(v => (
              <VoucherCard
                key={v.voucherId}
                voucher={v}
                isSaved={savedIds.has(v.voucherId)}
                onSave={handleSave}
                isAuth={isAuthenticated}
              />
            ))}
          </div>
        )}

        {!isAuthenticated && (
          <p className='text-center text-sm text-gray-400 mt-8'>
            <a href="/login" className='text-orange-default hover:underline font-semibold'>Đăng nhập</a> để lưu voucher vào tài khoản của bạn
          </p>
        )}
      </div>
    </div>
  );
};

export default VoucherPage;
