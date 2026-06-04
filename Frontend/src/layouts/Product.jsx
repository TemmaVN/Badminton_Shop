// Product.jsx
import { useEffect, useState } from "react";
import Advertisement from "../components/Advertisement";
import Button from "../components/Button";
import { Search, FilterIcon, ChevronDown, X } from "lucide-react";
import { useMediaQuery } from "../mystate/useMediaQuery";
import Filter from "../components/Filter";
import { HiFire } from "react-icons/hi";
import ProductFrame_Minh from "../components/ProductFrame_Minh";
import { useParams, useSearchParams } from "react-router-dom";

const CATEGORY_NAMES = {
  "vot-cau-long": "Vợt cầu lông",
  "giay-cau-long": "Giày cầu lông",
  "bao-vot-balo": "Bao vợt & Balo",
  "phu-kien": "Phụ kiện cầu lông",
};

const MOCK_PRODUCTS = [
  { Id: 1, productName: "Vợt Cầu Lông Yonex Astrox 88D Pro", basePrice: 4500000, sellingPrice: 3990000, IsBestSeller: true, discountPercent: 11, mainImageUrl: "https://picsum.photos/seed/racket1/400/400", slug: "yonex-astrox-88d-pro", categorySlug: "vot-cau-long", brandSlug: "yonex", hasVoucher: true, createdAt: "2024-07-10" },
  { Id: 2, productName: "Vợt Cầu Lông Victor Thruster K 9900", basePrice: 3800000, sellingPrice: 3800000, IsBestSeller: false, discountPercent: 0, mainImageUrl: "https://picsum.photos/seed/racket2/400/400", slug: "victor-thruster-k-9900", categorySlug: "vot-cau-long", brandSlug: "victor", hasVoucher: false, createdAt: "2024-06-15" },
  { Id: 3, productName: "Vợt Cầu Lông Li-Ning Turbo Charging 20", basePrice: 5200000, sellingPrice: 4680000, IsBestSeller: true, discountPercent: 10, mainImageUrl: "https://picsum.photos/seed/racket3/400/400", slug: "lining-turbo-charging-20", categorySlug: "vot-cau-long", brandSlug: "lining", hasVoucher: false, createdAt: "2024-06-01" },
  { Id: 4, productName: "Vợt Cầu Lông Yonex Nanoflare 800", basePrice: 6000000, sellingPrice: 5400000, IsBestSeller: false, discountPercent: 10, mainImageUrl: "https://picsum.photos/seed/racket4/400/400", slug: "yonex-nanoflare-800", categorySlug: "vot-cau-long", brandSlug: "yonex", hasVoucher: true, createdAt: "2024-05-20" },
  { Id: 5, productName: "Vợt Cầu Lông Victor Brave Sword 12", basePrice: 2900000, sellingPrice: 2610000, IsBestSeller: false, discountPercent: 10, mainImageUrl: "https://picsum.photos/seed/racket5/400/400", slug: "victor-brave-sword-12", categorySlug: "vot-cau-long", brandSlug: "victor", hasVoucher: false, createdAt: "2024-05-01" },
  { Id: 6, productName: "Vợt Cầu Lông Kawasaki Master 6600", basePrice: 1800000, sellingPrice: 1620000, IsBestSeller: false, discountPercent: 10, mainImageUrl: "https://picsum.photos/seed/racket6/400/400", slug: "kawasaki-master-6600", categorySlug: "vot-cau-long", brandSlug: "kawasaki", hasVoucher: false, createdAt: "2024-04-15" },
  { Id: 7, productName: "Vợt Cầu Lông Yonex Astrox 100ZZ", basePrice: 7200000, sellingPrice: 6480000, IsBestSeller: true, discountPercent: 10, mainImageUrl: "https://picsum.photos/seed/racket7/400/400", slug: "yonex-astrox-100zz", categorySlug: "vot-cau-long", brandSlug: "yonex", hasVoucher: true, createdAt: "2024-07-15" },
  { Id: 8, productName: "Vợt Cầu Lông Victor Thruster Ryuga II", basePrice: 4200000, sellingPrice: 3780000, IsBestSeller: false, discountPercent: 10, mainImageUrl: "https://picsum.photos/seed/racket8/400/400", slug: "victor-thruster-ryuga-ii", categorySlug: "vot-cau-long", brandSlug: "victor", hasVoucher: false, createdAt: "2024-06-25" },
  { Id: 9, productName: "Giày Cầu Lông Yonex Power Cushion 65Z3", basePrice: 3200000, sellingPrice: 2880000, IsBestSeller: true, discountPercent: 10, mainImageUrl: "https://picsum.photos/seed/shoe1/400/400", slug: "yonex-power-cushion-65z3", categorySlug: "giay-cau-long", brandSlug: "yonex", hasVoucher: true, createdAt: "2024-07-05" },
  { Id: 10, productName: "Giày Cầu Lông Victor A780 III", basePrice: 2600000, sellingPrice: 2340000, IsBestSeller: false, discountPercent: 10, mainImageUrl: "https://picsum.photos/seed/shoe2/400/400", slug: "victor-a780-iii", categorySlug: "giay-cau-long", brandSlug: "victor", hasVoucher: false, createdAt: "2024-06-10" },
  { Id: 11, productName: "Giày Cầu Lông Li-Ning Ranger TD", basePrice: 2200000, sellingPrice: 1980000, IsBestSeller: true, discountPercent: 10, mainImageUrl: "https://picsum.photos/seed/shoe3/400/400", slug: "lining-ranger-td", categorySlug: "giay-cau-long", brandSlug: "lining", hasVoucher: false, createdAt: "2024-05-25" },
  { Id: 12, productName: "Giày Cầu Lông Kawasaki K-063", basePrice: 1500000, sellingPrice: 1350000, IsBestSeller: false, discountPercent: 10, mainImageUrl: "https://picsum.photos/seed/shoe4/400/400", slug: "kawasaki-k063", categorySlug: "giay-cau-long", brandSlug: "kawasaki", hasVoucher: false, createdAt: "2024-05-10" },
  { Id: 13, productName: "Giày Cầu Lông Yonex SHB 65X2", basePrice: 2800000, sellingPrice: 2800000, IsBestSeller: false, discountPercent: 0, mainImageUrl: "https://picsum.photos/seed/shoe5/400/400", slug: "yonex-shb-65x2", categorySlug: "giay-cau-long", brandSlug: "yonex", hasVoucher: false, createdAt: "2024-04-20" },
  { Id: 14, productName: "Giày Cầu Lông Victor SH-A960", basePrice: 3500000, sellingPrice: 2975000, IsBestSeller: true, discountPercent: 15, mainImageUrl: "https://picsum.photos/seed/shoe6/400/400", slug: "victor-sh-a960", categorySlug: "giay-cau-long", brandSlug: "victor", hasVoucher: true, createdAt: "2024-07-18" },
  { Id: 15, productName: "Balo Cầu Lông Yonex BA92229 6 in 1", basePrice: 1800000, sellingPrice: 1530000, IsBestSeller: true, discountPercent: 15, mainImageUrl: "https://picsum.photos/seed/bag1/400/400", slug: "yonex-ba92229-6in1", categorySlug: "bao-vot-balo", brandSlug: "yonex", hasVoucher: false, createdAt: "2024-06-20" },
  { Id: 16, productName: "Túi Đựng Vợt Victor BR9611 3 in 1", basePrice: 950000, sellingPrice: 855000, IsBestSeller: false, discountPercent: 10, mainImageUrl: "https://picsum.photos/seed/bag2/400/400", slug: "victor-br9611-3in1", categorySlug: "bao-vot-balo", brandSlug: "victor", hasVoucher: false, createdAt: "2024-05-30" },
  { Id: 17, productName: "Balo Cầu Lông Li-Ning ABSU392", basePrice: 1200000, sellingPrice: 1080000, IsBestSeller: false, discountPercent: 10, mainImageUrl: "https://picsum.photos/seed/bag3/400/400", slug: "lining-absu392", categorySlug: "bao-vot-balo", brandSlug: "lining", hasVoucher: false, createdAt: "2024-05-15" },
  { Id: 18, productName: "Túi Đựng Vợt Kawasaki KBB-8150 2 in 1", basePrice: 650000, sellingPrice: 650000, IsBestSeller: false, discountPercent: 0, mainImageUrl: "https://picsum.photos/seed/bag4/400/400", slug: "kawasaki-kbb-8150", categorySlug: "bao-vot-balo", brandSlug: "kawasaki", hasVoucher: false, createdAt: "2024-05-01" },
  { Id: 19, productName: "Balo Cầu Lông Yonex BA92426 12 in 1", basePrice: 2500000, sellingPrice: 2125000, IsBestSeller: true, discountPercent: 15, mainImageUrl: "https://picsum.photos/seed/bag5/400/400", slug: "yonex-ba92426-12in1", categorySlug: "bao-vot-balo", brandSlug: "yonex", hasVoucher: true, createdAt: "2024-07-08" },
  { Id: 20, productName: "Túi Đựng Vợt Victor BR9609 6 in 1", basePrice: 1100000, sellingPrice: 990000, IsBestSeller: false, discountPercent: 10, mainImageUrl: "https://picsum.photos/seed/bag6/400/400", slug: "victor-br9609-6in1", categorySlug: "bao-vot-balo", brandSlug: "victor", hasVoucher: false, createdAt: "2024-06-28" },
];

const FilterDrawer = ({ isOpen, setIsOpen, rangePrice, setRangePrice }) => (
  <>
    <div
      className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={() => setIsOpen(false)}
    />
    <div className={`fixed left-0 top-0 h-full w-80 bg-white z-50 shadow-2xl transform transition-transform duration-300 overflow-y-auto ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        <h2 className="text-xl font-bold">Bộ lọc</h2>
        <button onClick={() => setIsOpen(false)} className="p-1 rounded hover:bg-gray-100">
          <X size={20} />
        </button>
      </div>
      <div className="p-4">
        <Filter rangePrice={rangePrice} setRangePrice={setRangePrice} isHasList={false} />
      </div>
    </div>
  </>
);

const SORT_OPTIONS = [
  { value: "",           label: "Mặc định (Mới nhất)" },
  { value: "price_asc",  label: "Giá thấp → cao" },
  { value: "price_desc", label: "Giá cao → thấp" },
  { value: "name_asc",   label: "Tên A → Z" },
  { value: "name_desc",  label: "Tên Z → A" },
  { value: "oldest",     label: "Cũ nhất" },
];

const Product = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [inputKeyword, setInputKeyword] = useState(""); // chỉ dùng cho UI input

  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ totalCount: 0, totalPages: 1, currentPage: 1 });

  const pageCatagory = CATEGORY_NAMES[categorySlug] || '';
  if (pageCatagory !== "") sessionStorage.setItem("pageCatagory", pageCatagory);
  const pageCatagorySession = sessionStorage.getItem("pageCatagory");

  const isMediumScreen     = useMediaQuery("(min-width: 1025px)");
  const isSmallScreen      = useMediaQuery("(max-width: 850px)");
  const isHighMediumScreen = useMediaQuery("(min-width: 1200px)");

  const linkAdvertisement = [
    "https://static.fbshop.vn/wp-content/uploads/2024/01/891903_627183127297272_1688220992_o-scaled.jpg",
  ];

  // ── Đọc filter từ URL ─────────────────────────────────────
  const keyword      = searchParams.get("keyword")      ?? "";
  const minPrice     = searchParams.get("minPrice")     ?? "";
  const maxPrice     = searchParams.get("maxPrice")     ?? "";
  const voucher      = searchParams.get("voucher")      === "true";
  const isBestSeller = searchParams.get("isBestSeller") === "true";
  const sortBy       = searchParams.get("sortBy")       ?? "";
  const page         = Number(searchParams.get("page")  ?? 1);

  // Sync inputKeyword khi URL thay đổi (ví dụ bấm Back)
  useEffect(() => {
    setInputKeyword(keyword);
  }, [keyword]);

  const isSearchRoute = categorySlug === 'search';

  // ── Lọc từ dữ liệu mẫu khi searchParams hoặc slug thay đổi ─
  useEffect(() => {
    setLoading(true);
    setError(null);
    const timer = setTimeout(() => {
      try {
        let filtered = [...MOCK_PRODUCTS];
        if (!isSearchRoute && categorySlug) filtered = filtered.filter(p => p.categorySlug === categorySlug);
        if (keyword) {
          const kw = keyword.toLowerCase();
          filtered = filtered.filter(p => p.productName.toLowerCase().includes(kw));
        }
        if (minPrice) filtered = filtered.filter(p => p.sellingPrice >= Number(minPrice));
        if (maxPrice) filtered = filtered.filter(p => p.sellingPrice <= Number(maxPrice));
        if (voucher) filtered = filtered.filter(p => p.hasVoucher);
        if (isBestSeller) filtered = filtered.filter(p => p.IsBestSeller);

        if (sortBy === 'price_asc') filtered.sort((a, b) => a.sellingPrice - b.sellingPrice);
        else if (sortBy === 'price_desc') filtered.sort((a, b) => b.sellingPrice - a.sellingPrice);
        else if (sortBy === 'name_asc') filtered.sort((a, b) => a.productName.localeCompare(b.productName, 'vi'));
        else if (sortBy === 'name_desc') filtered.sort((a, b) => b.productName.localeCompare(a.productName, 'vi'));
        else if (sortBy === 'oldest') filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        else filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const totalCount = filtered.length;
        const totalPages = Math.max(1, Math.ceil(totalCount / 12));
        const start = (page - 1) * 12;
        setProducts(filtered.slice(start, start + 12));
        setPagination({ totalCount, totalPages, currentPage: page });
      } catch (err) {
        setError(err.message || 'Có lỗi xảy ra');
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [searchParams, categorySlug]);

  // ── Helper: cập nhật URL ──────────────────────────────────
  const updateParams = (overrides = {}) => {
    const current = {
      ...(keyword      && { keyword }),
      ...(minPrice     && { minPrice }),
      ...(maxPrice     && { maxPrice }),
      ...(voucher      && { voucher: "true" }),
      ...(isBestSeller && { isBestSeller: "true" }),
      ...(sortBy       && { sortBy }),
      page,
    };

    const next = { ...current, page: 1, ...overrides };

    // Xóa các key falsy khỏi URL
    Object.keys(next).forEach((k) => {
      if (!next[k] && next[k] !== 0) delete next[k];
    });

    setSearchParams(next); // ✅ cập nhật URL trình duyệt
  };

  // ── Handlers ─────────────────────────────────────────────
  const handleSearch           = () => updateParams({ keyword: inputKeyword });
  const handleKeyDown          = (e) => e.key === "Enter" && handleSearch();
  const handleSortChange       = (e) => updateParams({ sortBy: e.target.value });
  const handleVoucherToggle    = () => updateParams({ voucher: !voucher ? "true" : undefined });
  const handleBestSellerToggle = () => updateParams({ isBestSeller: !isBestSeller ? "true" : undefined });
  const handleApplyPrice       = (min, max) => updateParams({ minPrice: min, maxPrice: max });
  const handlePageChange       = (newPage) => updateParams({ page: newPage });

  const handleResetFilters = () => {
    setInputKeyword("");
    setSearchParams({}); // xóa toàn bộ query string
  };

  // ── Computed ─────────────────────────────────────────────
  const hasActiveFilters = keyword || minPrice || maxPrice || voucher || isBestSeller || sortBy;

  // ─────────────────────────────────────────────────────────
  return (
    <div className="w-full h-auto">
      <Advertisement linkAdvertisement={linkAdvertisement} />

      <div className="min-h-screen text-[#333] p-4">
        <FilterDrawer
          isOpen={isFilterOpen}
          setIsOpen={setIsFilterOpen}
          rangePrice={[Number(minPrice) || 0, Number(maxPrice) || 10000000]}
          setRangePrice={([min, max]) => handleApplyPrice(min, max)}
        />

        <div className="container max-w-350 mx-auto px-4 py-8">
          {/* ── Quick-filter buttons ─────────────────────────── */}
          <div className={`flex grow ${isHighMediumScreen ? "" : "flex-col"} mb-20 items-center justify-between`}>
            <h2 className="font-bold whitespace-nowrap text-3xl px-8">
              Phân loại sản phẩm
            </h2>

            <div className={`flex ${isHighMediumScreen ? "gap-6" : "gap-2"} ${isSmallScreen ? "flex-col" : ""}`}>
              <div className={`flex ${isSmallScreen ? "gap-4 py-1" : ""} ${isHighMediumScreen ? "gap-6" : "gap-2"}`}>
                <Button
                  variant="search"
                  size="search"
                  onClick={handleBestSellerToggle}
                  className={`whitespace-nowrap ${isHighMediumScreen ? "py-3 px-5 text-1xl" : "px-2 py-2 text-[18px]"} gap-2 flex items-center ${isBestSeller ? "border-orange-500 bg-orange-50 text-orange-600" : ""}`}
                >
                  <HiFire className={`w-6 h-6 ${isBestSeller ? "text-orange-500" : "text-red-600"}`} />
                  Sản phẩm bán chạy
                  {isBestSeller && <X size={14} />}
                </Button>

                <Button
                  variant="search"
                  size="search"
                  onClick={handleVoucherToggle}
                  className={`whitespace-nowrap ${isHighMediumScreen ? "py-3 px-5 text-1xl" : "px-2 py-2 text-[18px]"} gap-2 flex items-center ${voucher ? "border-orange-500 bg-orange-50 text-orange-600" : ""}`}
                >
                  <img
                    src="https://static.fbshop.vn/template/assets/images/icon-cate-tag.png"
                    className="w-6 h-6"
                    alt=""
                  />
                  Có Voucher
                  {voucher && <X size={14} />}
                </Button>
              </div>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="search"
                  onClick={handleResetFilters}
                  className="whitespace-nowrap px-3 py-2 text-sm text-red-500 border border-red-200 hover:bg-red-50 gap-1 flex items-center rounded-lg"
                >
                  <X size={14} /> Xóa bộ lọc
                </Button>
              )}
            </div>
          </div>

          <div className="flex gap-8">
            {isMediumScreen && (
              <Filter
                rangePrice={[Number(minPrice) || 0, Number(maxPrice) || 10000000]}
                setRangePrice={([min, max]) => handleApplyPrice(min, max)}
                className="w-100 shrink-0"
                isHasList={false}
              />
            )}

            <div className="flex-1">
              {/* ── Toolbar ───────────────────────────────────── */}
              <div className="flex flex-col justify-between mb-8 pb-4 border-b border-gray-100 gap-4">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">{isSearchRoute ? 'Kết quả tìm kiếm' : pageCatagorySession}</h1>
                  <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                    {pagination.totalCount ?? 0} sản phẩm
                  </span>
                  {hasActiveFilters && (
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">
                      Đang lọc
                    </span>
                  )}
                </div>

                <div className={`flex items-center justify-between gap-4 ${isSmallScreen ? "flex-col items-start" : ""}`}>
                  {/* Search input */}
                  <div className={`flex items-center flex-1 max-w-2xl ${isSmallScreen ? "w-full" : ""}`}>
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search size={18} />
                      </span>
                      <input
                        type="text"
                        value={inputKeyword}
                        onChange={(e) => setInputKeyword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Tìm kiếm sản phẩm trong danh mục..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-l-lg text-sm font-semibold hover:border-orange-500 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
                      />
                    </div>
                    <Button
                      variant="find"
                      size="find"
                      onClick={handleSearch}
                      className="px-6 py-3 rounded-r-lg"
                    >
                      Tìm kiếm
                    </Button>
                  </div>

                  {/* Filter button (mobile) */}
                  {!isMediumScreen && (
                    <Button
                      variant="filter"
                      size="filter"
                      onClick={() => setIsFilterOpen(true)}
                      className={`${isSmallScreen ? "w-full justify-center" : "mx-4"}`}
                    >
                      <FilterIcon /> Bộ lọc
                    </Button>
                  )}

                  {/* Sort */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-sm font-medium text-gray-600 ${isMediumScreen ? "mx-2" : ""}`}>
                      Sắp xếp:
                    </span>
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={handleSortChange}
                        className="appearance-none bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 py-2 text-sm font-medium focus:ring-1 focus:ring-orange-500 outline-none cursor-pointer text-gray-800"
                      >
                        {SORT_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <ChevronDown size={16} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Product grid ──────────────────────────────── */}
              {loading ? (
                <div className="py-20 text-center font-bold text-gray-500">
                  Đang tải sản phẩm...
                </div>
              ) : error ? (
                <div className="py-20 text-center text-red-500 font-semibold">
                  Có lỗi xảy ra. Vui lòng thử lại.
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                  {products.map((product, idx) => (
                    <ProductFrame_Minh
                      key={product.Id || idx}
                      image={product.mainImageUrl}
                      productName={product.productName}
                      basePrice={product.basePrice}
                      sellingPrice={product.sellingPrice}
                      isBestSeller={product.IsBestSeller}
                      discountPercent={product.discountPercent}
                      categorySlug={categorySlug}
                      productDetailSlug={product.slug}
                    />
                  ))}
                </div>
              ) : (
                <div className="pt-24 pb-32 text-center">
                  <h3 className="text-xl font-bold text-gray-800">
                    {hasActiveFilters
                      ? "Không tìm thấy sản phẩm phù hợp với bộ lọc."
                      : "Chưa có sản phẩm nào trong danh mục này."}
                  </h3>
                  {hasActiveFilters && (
                    <button
                      onClick={handleResetFilters}
                      className="mt-4 text-orange-500 underline text-sm"
                    >
                      Xóa bộ lọc và xem tất cả
                    </button>
                  )}
                </div>
              )}

              {/* ── Pagination ────────────────────────────────── */}
              {pagination.totalPages > 1 && (
                <div className="p-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
                  <div className="text-sm text-slate-500">
                    Trang{" "}
                    <span className="font-semibold text-slate-800">{pagination.currentPage}</span>
                    {" "}trên{" "}
                    <span className="font-semibold text-slate-800">{pagination.totalPages}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="px-3 py-1 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Trước
                    </button>

                    {[...Array(pagination.totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      if (pagination.totalPages > 5 && Math.abs(pageNum - pagination.currentPage) > 2)
                        return null;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                            pagination.currentPage === pageNum
                              ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="px-3 py-1 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Sau
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;