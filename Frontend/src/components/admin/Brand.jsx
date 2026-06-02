import { useState } from 'react';
import { Edit2, Trash2, Plus, Globe, Package, RefreshCw } from 'lucide-react';

const MOCK_BRANDS = [
  { brandId: 1, brandName: "Yonex",     slug: "yonex"     },
  { brandId: 2, brandName: "Victor",    slug: "victor"    },
  { brandId: 3, brandName: "Li-Ning",   slug: "lining"    },
  { brandId: 4, brandName: "Kawasaki",  slug: "kawasaki"  },
  { brandId: 5, brandName: "Apacs",     slug: "apacs"     },
  { brandId: 6, brandName: "Proace",    slug: "proace"    },
];

let _nextId = 7;

const Brand = () => {
  const [brands, setBrands] = useState(MOCK_BRANDS.map((b) => ({ ...b })));

  const handleAddBrand = () => {
    const name = prompt("Nhập tên thương hiệu mới:");
    if (!name || !name.trim()) return;
    const newBrand = {
      brandId: _nextId++,
      brandName: name.trim(),
      slug: name.trim().toLowerCase().replace(/\s+/g, '-'),
    };
    setBrands((prev) => [newBrand, ...prev]);
    alert("Thêm thành công!");
  };

  const handleUpdate = (e, id, currentName) => {
    e.stopPropagation();
    const newName = prompt("Nhập tên mới cho thương hiệu:", currentName);
    if (!newName || newName === currentName) return;
    setBrands((prev) =>
      prev.map((b) =>
        b.brandId === id
          ? { ...b, brandName: newName.trim(), slug: newName.trim().toLowerCase().replace(/\s+/g, '-') }
          : b
      )
    );
    alert("Cập nhật thành công!");
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa thương hiệu này?")) return;
    setBrands((prev) => prev.filter((b) => b.brandId !== id));
    alert("Xóa thành công!");
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="mx-auto rounded-2xl overflow-hidden space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Thương hiệu</h2>
            <p className="text-sm text-slate-500">Tổng số: {brands.length} nhãn hàng</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setBrands(MOCK_BRANDS.map((b) => ({ ...b })))}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              title="Khôi phục dữ liệu mẫu"
            >
              <RefreshCw size={20} />
            </button>
            <button
              onClick={handleAddBrand}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all"
            >
              <Plus size={20} /> Thêm Brand
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <div
              key={brand.brandId}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-orange-500 transition-all group relative"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-800 dark:text-white font-black text-xl uppercase group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  {brand.brandName?.charAt(0)}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleUpdate(e, brand.brandId, brand.brandName)}
                    className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-500 rounded-lg transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(brand.brandId)}
                    className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-500 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-1">{brand.brandName}</h3>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Globe size={12} />
                  <span>slug: /{brand.slug}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Package size={12} />
                  <span>Mã số: {brand.brandId}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {brands.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-slate-400 dark:text-slate-500">Chưa có dữ liệu thương hiệu nào.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Brand;
