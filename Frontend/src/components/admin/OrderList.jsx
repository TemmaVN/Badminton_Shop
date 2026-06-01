import { useState } from "react";
import { Search, Eye, RotateCcw, X } from "lucide-react";

const STATUSES = {
  1: { text: "Chờ xác nhận",  color: "bg-yellow-100 dark:bg-yellow-500/15 text-yellow-700 dark:text-yellow-400" },
  2: { text: "Đã xác nhận",   color: "bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400" },
  3: { text: "Đang xử lý",    color: "bg-indigo-100 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-400" },
  4: { text: "Đang đan lưới", color: "bg-teal-100 dark:bg-teal-500/15 text-teal-700 dark:text-teal-400" },
  5: { text: "Đang giao hàng",color: "bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-400" },
  6: { text: "Đã giao hàng",  color: "bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400" },
  7: { text: "Hoàn tất",      color: "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" },
  8: { text: "Đã huỷ",        color: "bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400" },
};

// ── Dữ liệu mẫu cố định ──────────────────────────────────────────────────────
const MOCK_ORDERS = [
  { orderId: 1001, receiverName: "Nguyễn Văn An",   phoneNumber: "0901234567", finalAmount: 3990000, status: 7, orderDate: "2026-05-01T10:30:00", address: "123 Lê Lợi, Q.1, TP.HCM",      note: "",                   orderDetails: [{ productName: "Vợt Yonex Astrox 88D Pro",      quantity: 1, price: 3990000 }] },
  { orderId: 1002, receiverName: "Trần Thị Bích",   phoneNumber: "0912345678", finalAmount: 5750000, status: 5, orderDate: "2026-05-10T14:00:00", address: "45 Trần Hưng Đạo, Q.5, TP.HCM", note: "Giao giờ hành chính", orderDetails: [{ productName: "Vợt Yonex Nanoflare 800",         quantity: 1, price: 5400000 }, { productName: "Cầu lông Yonex hộp 12 quả", quantity: 1, price: 350000 }] },
  { orderId: 1003, receiverName: "Lê Minh Cường",   phoneNumber: "0923456789", finalAmount: 2610000, status: 2, orderDate: "2026-05-15T09:15:00", address: "89 Nguyễn Huệ, Q.1, TP.HCM",    note: "",                   orderDetails: [{ productName: "Vợt Victor Brave Sword 12",     quantity: 1, price: 2610000 }] },
  { orderId: 1004, receiverName: "Phạm Thị Dung",   phoneNumber: "0934567890", finalAmount: 2880000, status: 6, orderDate: "2026-05-18T16:45:00", address: "12 Đinh Tiên Hoàng, Bình Thạnh", note: "",                   orderDetails: [{ productName: "Giày Yonex Power Cushion 65Z3", quantity: 1, price: 2880000 }] },
  { orderId: 1005, receiverName: "Hoàng Văn Em",    phoneNumber: "0945678901", finalAmount: 1530000, status: 1, orderDate: "2026-05-25T08:00:00", address: "34 Cộng Hòa, Tân Bình",         note: "Gọi trước khi giao",  orderDetails: [{ productName: "Balo Yonex BA92229 6 in 1",    quantity: 1, price: 1530000 }] },
  { orderId: 1006, receiverName: "Vũ Thị Phương",   phoneNumber: "0956789012", finalAmount: 4320000, status: 3, orderDate: "2026-05-22T11:30:00", address: "56 Võ Văn Tần, Q.3, TP.HCM",   note: "",                   orderDetails: [{ productName: "Vợt Li-Ning Turbo Charging 20", quantity: 1, price: 4680000 }] },
  { orderId: 1007, receiverName: "Đặng Văn Giàu",   phoneNumber: "0967890123", finalAmount:  855000, status: 8, orderDate: "2026-05-12T13:00:00", address: "78 Lý Thường Kiệt, Q.10",      note: "",                   orderDetails: [{ productName: "Túi Victor BR9611 3 in 1",     quantity: 1, price:  855000 }] },
  { orderId: 1008, receiverName: "Ngô Thị Hoa",     phoneNumber: "0978901234", finalAmount: 6480000, status: 7, orderDate: "2026-04-28T10:00:00", address: "90 Phan Xích Long, Phú Nhuận",  note: "",                   orderDetails: [{ productName: "Vợt Yonex Astrox 100ZZ",       quantity: 1, price: 6480000 }] },
  { orderId: 1009, receiverName: "Lý Văn Inh",      phoneNumber: "0989012345", finalAmount: 3330000, status: 4, orderDate: "2026-05-23T15:20:00", address: "23 Nguyễn Đình Chiểu, Q.3",   note: "Đan lưới 26lb",      orderDetails: [{ productName: "Vợt Victor Thruster K 9900",   quantity: 1, price: 3800000 }] },
  { orderId: 1010, receiverName: "Bùi Thị Kim",     phoneNumber: "0990123456", finalAmount: 2125000, status: 7, orderDate: "2026-04-20T09:30:00", address: "67 Trường Chinh, Tân Phú",     note: "",                   orderDetails: [{ productName: "Balo Yonex BA92426 12 in 1",   quantity: 1, price: 2125000 }] },
  { orderId: 1011, receiverName: "Trịnh Văn Long",  phoneNumber: "0901357924", finalAmount: 4725000, status: 6, orderDate: "2026-05-08T14:30:00", address: "15 Hoàng Diệu, Q.4, TP.HCM",  note: "",                   orderDetails: [{ productName: "Giày Victor SH-A960",          quantity: 1, price: 2975000 }, { productName: "Vợt Kawasaki Master 6600", quantity: 1, price: 1620000 }] },
  { orderId: 1012, receiverName: "Đỗ Thị Mai",      phoneNumber: "0912468024", finalAmount: 1980000, status: 5, orderDate: "2026-05-20T10:00:00", address: "38 Bạch Đằng, Bình Thạnh",    note: "",                   orderDetails: [{ productName: "Giày Li-Ning Ranger TD",       quantity: 1, price: 1980000 }] },
];

// ── OrderDetail inline ────────────────────────────────────────────────────────
const OrderDetail = ({ order, onClose, onStatusChange }) => {
  const [status, setStatus] = useState(order.status);

  const handleSave = () => {
    onStatusChange(order.orderId, status);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <p className="text-xs font-mono text-slate-400">Đơn hàng #{order.orderId}</p>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Chi tiết đơn hàng</h3>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-sm">
          {/* Thông tin khách */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Khách hàng</p>
            <div className="grid grid-cols-2 gap-2">
              <div><p className="text-xs text-slate-400">Tên</p><p className="font-medium text-slate-800 dark:text-white">{order.receiverName}</p></div>
              <div><p className="text-xs text-slate-400">SĐT</p><p className="font-medium text-slate-800 dark:text-white">{order.phoneNumber}</p></div>
              <div className="col-span-2"><p className="text-xs text-slate-400">Địa chỉ</p><p className="font-medium text-slate-800 dark:text-white">{order.address}</p></div>
              {order.note && <div className="col-span-2"><p className="text-xs text-slate-400">Ghi chú</p><p className="font-medium text-slate-800 dark:text-white">{order.note}</p></div>}
            </div>
          </div>

          {/* Sản phẩm */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Sản phẩm</p>
            <div className="space-y-2">
              {order.orderDetails.map((d, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-white">{d.productName}</p>
                    <p className="text-xs text-slate-400">Số lượng: {d.quantity}</p>
                  </div>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">{d.price.toLocaleString()}₫</p>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold">
              <span className="text-slate-700 dark:text-slate-200">Tổng cộng</span>
              <span className="text-orange-500">{order.finalAmount.toLocaleString()}₫</span>
            </div>
          </div>

          {/* Cập nhật trạng thái */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Cập nhật trạng thái</p>
            <select
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
              className="w-full py-2.5 px-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
            >
              {Object.entries(STATUSES).map(([id, { text }]) => (
                <option key={id} value={id}>{text}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Đóng</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors">Lưu</button>
        </div>
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const PAGE_SIZE = 10;

const OrderList = () => {
  const [allOrders, setAllOrders] = useState(MOCK_ORDERS.map((o) => ({ ...o })));
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ status: "", keyword: "" });

  const displayed = allOrders
    .filter((o) => !filters.status || o.status === Number(filters.status))
    .filter((o) => {
      const q = filters.keyword.toLowerCase();
      return !q ||
        o.receiverName?.toLowerCase().includes(q) ||
        o.phoneNumber?.includes(q) ||
        String(o.orderId).includes(q);
    });

  const totalPages = Math.max(1, Math.ceil(displayed.length / PAGE_SIZE));
  const paged = displayed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const pageList = [];
  for (let i = page - 2; i <= page + 2; i++) {
    if (i > 0 && i <= totalPages) pageList.push(i);
  }

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPage(1);
  };

  const resetFilters = () => { setFilters({ status: "", keyword: "" }); setPage(1); };

  const handleStatusChange = (orderId, newStatus) => {
    setAllOrders((prev) => prev.map((o) => o.orderId === orderId ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="p-1 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-8xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        {/* Header + Filters */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Quản lý đơn hàng</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input name="keyword" value={filters.keyword} onChange={handleFilterChange} placeholder="Tìm theo tên, SĐT, mã đơn..." className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <select name="status" value={filters.status} onChange={handleFilterChange} className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-orange-500">
              <option value="">Tất cả trạng thái</option>
              {Object.entries(STATUSES).map(([id, { text }]) => <option key={id} value={id}>{text}</option>)}
            </select>
            <button onClick={resetFilters} className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
              <RotateCcw size={16} /> Làm mới
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <tr className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                <th className="px-5 py-3">Order ID</th>
                <th className="px-5 py-3">Khách hàng</th>
                <th className="px-5 py-3">Sản phẩm</th>
                <th className="px-5 py-3 text-right">Tổng tiền</th>
                <th className="px-5 py-3 text-center">Trạng thái</th>
                <th className="px-5 py-3">Ngày tạo</th>
                <th className="px-5 py-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {paged.length === 0 ? (
                <tr><td colSpan={7} className="py-16 text-center text-slate-400 text-sm">Không có đơn hàng nào.</td></tr>
              ) : paged.map((order) => {
                const firstProduct = order.orderDetails?.[0]?.productName || "N/A";
                const totalProducts = order.orderDetails?.length || 0;
                const statusInfo = STATUSES[order.status] ?? { text: "Không xác định", color: "bg-gray-100 text-gray-600" };
                return (
                  <tr key={order.orderId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-sm cursor-pointer" onClick={() => setSelectedOrder(order)}>
                    <td className="px-5 py-3.5 font-mono text-orange-500 dark:text-orange-400 font-semibold">#{order.orderId}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-slate-800 dark:text-white">{order.receiverName}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-xs">{order.phoneNumber}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-50" title={firstProduct}>{firstProduct}</p>
                      {totalProducts > 1 && <span className="text-xs text-slate-400">và {totalProducts - 1} sản phẩm khác</span>}
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-slate-800 dark:text-white">{order.finalAmount?.toLocaleString()}₫</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${statusInfo.color}`}>{statusInfo.text}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-sm">{new Date(order.orderDate).toLocaleDateString("vi-VN")}</td>
                    <td className="px-5 py-3.5 text-center">
                      <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-500 dark:text-blue-400 rounded-lg transition-colors"><Eye size={16} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <span className="text-sm text-slate-500 dark:text-slate-400">Trang <span className="font-semibold text-slate-700 dark:text-slate-200">{page}</span> / {totalPages}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors">Trước</button>
            {pageList.map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-lg text-xs font-semibold transition-colors ${p === page ? 'bg-orange-500 text-white shadow shadow-orange-500/25' : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{p}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors">Sau</button>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default OrderList;
