import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const LOGO_URL = "https://static.fbshop.vn/wp-content/uploads/2026/01/cropped-logo-4.webp";

const Footer = () => {
  return (
    <footer className='bg-[#1a1a2e] text-white mt-16'>
      <div className='max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10'>
        {/* Company Info */}
        <div className='flex flex-col gap-4'>
          <img src={LOGO_URL} alt="Logo" className='h-12 w-auto object-contain' />
          <p className='text-sm text-gray-300 leading-relaxed'>
            Công ty TNHH Minh Nguyên Sport - Chuyên cung cấp dụng cụ cầu lông chính hãng, chất lượng cao.
          </p>
          <div className='flex gap-3 mt-2'>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className='w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors'>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className='w-9 h-9 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors'>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58a2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className='flex flex-col gap-3'>
          <h3 className='font-bold text-lg text-orange-400 mb-1'>Danh mục</h3>
          {[
            { to: '/vot-cau-long', label: 'Vợt cầu lông' },
            { to: '/giay-cau-long', label: 'Giày cầu lông' },
            { to: '/balo-tui-cau-long', label: 'Balo & Túi' },
            { to: '/cau-long', label: 'Cầu lông' },
            { to: '/phu-kien', label: 'Phụ kiện' },
          ].map(link => (
            <Link key={link.to} to={link.to} className='text-gray-300 hover:text-orange-400 text-sm transition-colors'>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Support */}
        <div className='flex flex-col gap-3'>
          <h3 className='font-bold text-lg text-orange-400 mb-1'>Hỗ trợ</h3>
          {[
            { to: '/contract', label: 'Liên hệ' },
            { to: '/vouchers', label: 'Khuyến mãi' },
            { to: '/myorder', label: 'Tra cứu đơn hàng' },
            { to: '/user-info', label: 'Tài khoản của tôi' },
          ].map(link => (
            <Link key={link.to} to={link.to} className='text-gray-300 hover:text-orange-400 text-sm transition-colors'>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div className='flex flex-col gap-4'>
          <h3 className='font-bold text-lg text-orange-400 mb-1'>Liên hệ</h3>
          <div className='flex items-start gap-3 text-sm text-gray-300'>
            <MapPin size={16} className='shrink-0 mt-0.5 text-orange-400' />
            <span>12/70 ngõ 102 Trường Chinh, Đống Đa, Hà Nội</span>
          </div>
          <div className='flex items-center gap-3 text-sm text-gray-300'>
            <Phone size={16} className='text-orange-400' />
            <a href="tel:0979170274" className='hover:text-orange-400 transition-colors'>0979.170.274</a>
          </div>
          <div className='flex items-center gap-3 text-sm text-gray-300'>
            <Mail size={16} className='text-orange-400' />
            <a href="mailto:minhnguyensport@gmail.com" className='hover:text-orange-400 transition-colors'>minhnguyensport@gmail.com</a>
          </div>
        </div>
      </div>

      <div className='border-t border-white/10 py-5 text-center text-sm text-gray-400'>
        © 2026 Công ty TNHH Minh Nguyên Sport. Bảo lưu mọi quyền.
      </div>
    </footer>
  );
};

export default Footer;
