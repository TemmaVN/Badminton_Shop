import { useState } from 'react';
import { Box, ChevronRight, Plus, Edit2, Trash2 } from 'lucide-react';

// Dữ liệu mẫu cố định
const MOCK_CATEGORIES = [
  { categoryId: 1, categoryName: "Vợt Cầu Lông",   slug: "vot-cau-long"   },
  { categoryId: 2, categoryName: "Giày Cầu Lông",   slug: "giay-cau-long"  },
  { categoryId: 3, categoryName: "Bao Vợt & Balo",  slug: "bao-vot-balo"   },
  { categoryId: 4, categoryName: "Cầu & Phụ Kiện",  slug: "cau-phu-kien"   },
  { categoryId: 5, categoryName: "Áo Cầu Lông",     slug: "ao-cau-long"    },
  { categoryId: 6, categoryName: "Quần Cầu Lông",   slug: "quan-cau-long"  },
];

let _nextId = 7;

const getCategoryDisplay = (name) => {
  const n = name.toLowerCase();
  if (n.includes('vợt'))   return { icon: '🏸', color: 'bg-orange-100 text-orange-600' };
  if (n.includes('giày'))  return { icon: '👟', color: 'bg-blue-100 text-blue-600' };
  if (n.includes('áo'))    return { icon: '👕', color: 'bg-purple-100 text-purple-600' };
  if (n.includes('quần'))  return { icon: '👖', color: 'bg-indigo-100 text-indigo-600' };
  if (n.includes('balo') || n.includes('bao')) return { icon: '🎒', color: 'bg-amber-100 text-amber-600' };
  if (n.includes('cước'))  return { icon: '🧵', color: 'bg-rose-100 text-rose-600' };
  if (n.includes('cầu'))   return { icon: '🏸', color: 'bg-emerald-100 text-emerald-600' };
  return { icon: '📦', color: 'bg-slate-100 text-slate-600' };
};

const Categories = () => {
  const [categories, setCategories] = useState(MOCK_CATEGORIES.map((c) => ({ ...c })));

  const handleAddCategory = () => {
    const name = prompt("Nhập tên danh mục mới:");
    if (!name || !name.trim()) return;
    const newCat = {
      categoryId: _nextId++,
      categoryName: name.trim(),
      slug: name.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-'),
    };
    setCategories((prev) => [...prev, newCat]);
    alert("Thêm danh mục thành công!");
  };

  const handleDelete = (e, id, name) => {
    e.stopPropagation();
    if (!window.confirm(`Bạn có chắc muốn xóa danh mục "${name}"?`)) return;
    setCategories((prev) => prev.filter((c) => c.categoryId !== id));
    alert("Xóa thành công!");
  };

  const handleEdit = (e, id, currentName) => {
    e.stopPropagation();
    const newName = prompt("Nhập tên mới cho danh mục:", currentName);
    if (!newName || newName === currentName) return;
    setCategories((prev) =>
      prev.map((c) =>
        c.categoryId === id ? { ...c, categoryName: newName.trim() } : c
      )
    );
    alert("Cập nhật thành công!");
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="mx-auto rounded-2xl overflow-hidden space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Quản lý danh mục</h3>
            <p className="text-slate-500 text-sm mt-1">Quản lý các nhóm sản phẩm trong cửa hàng</p>
          </div>
          <button
            onClick={handleAddCategory}
            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-orange-200 dark:shadow-orange-500/10"
          >
            <Plus size={20} /> Thêm danh mục
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.length > 0 ? (
            categories.map((cat) => {
              const display = getCategoryDisplay(cat.categoryName);
              return (
                <div
                  key={cat.categoryId}
                  className="group bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md relative overflow-hidden"
                >
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-orange-500/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative z-10">
                    <div className={`w-14 h-14 ${display.color} rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                      {display.icon}
                    </div>
                    <h4 className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-orange-500 transition-colors">
                      {cat.categoryName}
                    </h4>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs font-mono text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                        /{cat.slug}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleEdit(e, cat.categoryId, cat.categoryName)}
                          className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all"
                          title="Sửa"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, cat.categoryId, cat.categoryName)}
                          className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                          title="Xóa"
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all text-slate-600 dark:text-slate-300">
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center p-10 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              <Box className="mx-auto text-slate-300 dark:text-slate-600 mb-2" size={48} />
              <p className="text-slate-500 dark:text-slate-400">Không có danh mục nào để hiển thị.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
