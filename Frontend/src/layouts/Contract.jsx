import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react';

const ContractInfo = ({ icon, title, content }) => (
  <div className='flex items-start gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100'>
    <div className='w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center shrink-0 text-orange-default'>
      {icon}
    </div>
    <div>
      <p className='text-sm font-semibold text-gray-500 mb-1'>{title}</p>
      <p className='font-bold text-gray-800'>{content}</p>
    </div>
  </div>
);

const Contract = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Banner */}
      <div className='relative h-56 overflow-hidden'>
        <img
          src="https://cdn.shopvnb.com/uploads/images/bai_viet/anh-cau-long-ngau-1-1737322298.webp"
          alt="Liên hệ"
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 flex items-center justify-center'>
          <div className='text-center text-white'>
            <h1 className='text-4xl font-black mb-2'>Liên hệ với chúng tôi</h1>
            <p className='text-white/80'>Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
          </div>
        </div>
      </div>

      <div className='max-w-6xl mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* Left: Info */}
          <div className='space-y-6'>
            <div>
              <h2 className='text-2xl font-black text-gray-900 mb-2'>Thông tin liên hệ</h2>
              <p className='text-gray-500 text-sm'>Liên hệ với đội ngũ của chúng tôi qua các kênh dưới đây</p>
            </div>

            <div className='space-y-4'>
              <ContractInfo icon={<MapPin size={20} />} title="Địa chỉ" content="12/70 ngõ 102 Trường Chinh, Đống Đa, Hà Nội" />
              <ContractInfo icon={<Phone size={20} />} title="Điện thoại" content="0979.170.274" />
              <ContractInfo icon={<Mail size={20} />} title="Email" content="minhnguyensport@gmail.com" />
              <ContractInfo icon={<Clock size={20} />} title="Giờ làm việc" content="Thứ 2 – Chủ nhật: 8:00 – 21:00" />
            </div>

            <div className='p-5 bg-orange-50 rounded-2xl border border-orange-100'>
              <div className='flex items-center gap-3 mb-3'>
                <MessageCircle size={20} className='text-orange-default' />
                <h3 className='font-bold text-orange-default'>Chat trực tiếp</h3>
              </div>
              <p className='text-sm text-gray-600 mb-4'>Nhắn tin qua Zalo hoặc Facebook để được hỗ trợ nhanh nhất trong giờ làm việc.</p>
              <div className='flex gap-3'>
                <a href="https://zalo.me" target="_blank" rel="noopener noreferrer" className='flex-1 py-2 bg-blue-500 text-white text-sm font-bold rounded-xl text-center hover:bg-blue-600 transition-colors'>
                  Zalo
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className='flex-1 py-2 bg-blue-700 text-white text-sm font-bold rounded-xl text-center hover:bg-blue-800 transition-colors'>
                  Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className='bg-white rounded-3xl shadow-sm border border-gray-100 p-8'>
            <h2 className='text-2xl font-black text-gray-900 mb-6'>Gửi tin nhắn</h2>

            {sent && (
              <div className='mb-5 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium flex items-center gap-2'>
                ✅ Tin nhắn đã được gửi thành công! Chúng tôi sẽ phản hồi sớm nhất.
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-5'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <div>
                  <label className='block text-sm font-medium text-gray-600 mb-1.5'>Họ và tên <span className='text-red-500'>*</span></label>
                  <input name="name" value={form.name} onChange={handleChange} required placeholder="Nguyễn Văn A" className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition' />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-600 mb-1.5'>Số điện thoại</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="0901234567" className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition' />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-600 mb-1.5'>Email <span className='text-red-500'>*</span></label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="email@example.com" className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition' />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-600 mb-1.5'>Tiêu đề</label>
                <input name="subject" value={form.subject} onChange={handleChange} placeholder="Tôi muốn hỏi về..." className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition' />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-600 mb-1.5'>Nội dung <span className='text-red-500'>*</span></label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Nhập nội dung tin nhắn..." className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition resize-none' />
              </div>

              <button type="submit" className='w-full py-3.5 bg-orange-default hover:bg-orange-dark text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors'>
                <Send size={18} /> Gửi tin nhắn
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contract;
