import { useState, useEffect } from 'react';
import FlashButton from '../components/FlashButton';
import Button from '../components/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useProduct } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';
import { useReview } from '../contexts/ReviewContext';

const formatPrice = (price) => Number(price).toLocaleString('vi-VN') + 'đ';

const MOCK_PRODUCT_DETAILS = {
  "yonex-astrox-88d-pro": {
    productName: "Vợt Cầu Lông Yonex Astrox 88D Pro",
    image: "https://picsum.photos/seed/racket1/400/400",
    images: [
      { imageID: 1, displayOrder: 1, imageUrl: "https://picsum.photos/seed/racket1/400/400" },
      { imageID: 2, displayOrder: 2, imageUrl: "https://picsum.photos/seed/racket1b/400/400" },
      { imageID: 3, displayOrder: 3, imageUrl: "https://picsum.photos/seed/racket1c/400/400" },
    ],
    variants: [
      { detailId: 101, weightClass: "3U (85–89g)", gripSize: "G4", price: 3990000, inStock: true, stockQuantity: 15, balancePoint: "Đầu nặng", stiffness: "Cứng", maxTension: 30 },
      { detailId: 102, weightClass: "3U (85–89g)", gripSize: "G5", price: 3990000, inStock: true, stockQuantity: 8, balancePoint: "Đầu nặng", stiffness: "Cứng", maxTension: 30 },
      { detailId: 103, weightClass: "4U (80–84g)", gripSize: "G4", price: 3990000, inStock: false, stockQuantity: 0, balancePoint: "Đầu nặng", stiffness: "Cứng", maxTension: 30 },
      { detailId: 104, weightClass: "4U (80–84g)", gripSize: "G5", price: 3990000, inStock: true, stockQuantity: 5, balancePoint: "Đầu nặng", stiffness: "Cứng", maxTension: 30 },
    ],
  },
  "yonex-nanoflare-800": {
    productName: "Vợt Cầu Lông Yonex Nanoflare 800",
    image: "https://picsum.photos/seed/racket4/400/400",
    images: [
      { imageID: 1, displayOrder: 1, imageUrl: "https://picsum.photos/seed/racket4/400/400" },
      { imageID: 2, displayOrder: 2, imageUrl: "https://picsum.photos/seed/racket4b/400/400" },
    ],
    variants: [
      { detailId: 201, weightClass: "4U (80–84g)", gripSize: "G4", price: 5400000, inStock: true, stockQuantity: 10, balancePoint: "Đầu nhẹ", stiffness: "Cứng vừa", maxTension: 28 },
      { detailId: 202, weightClass: "4U (80–84g)", gripSize: "G5", price: 5400000, inStock: true, stockQuantity: 6, balancePoint: "Đầu nhẹ", stiffness: "Cứng vừa", maxTension: 28 },
      { detailId: 203, weightClass: "5U (75–79g)", gripSize: "G5", price: 5400000, inStock: true, stockQuantity: 3, balancePoint: "Đầu nhẹ", stiffness: "Cứng vừa", maxTension: 28 },
    ],
  },
  "victor-thruster-k-9900": {
    productName: "Vợt Cầu Lông Victor Thruster K 9900",
    image: "https://picsum.photos/seed/racket2/400/400",
    images: [
      { imageID: 1, displayOrder: 1, imageUrl: "https://picsum.photos/seed/racket2/400/400" },
      { imageID: 2, displayOrder: 2, imageUrl: "https://picsum.photos/seed/racket2b/400/400" },
    ],
    variants: [
      { detailId: 301, weightClass: "3U (85–89g)", gripSize: "F2", price: 3800000, inStock: true, stockQuantity: 12, balancePoint: "Đầu nặng", stiffness: "Cứng", maxTension: 32 },
      { detailId: 302, weightClass: "4U (80–84g)", gripSize: "F2", price: 3800000, inStock: true, stockQuantity: 7, balancePoint: "Đầu nặng", stiffness: "Cứng", maxTension: 32 },
    ],
  },
  "lining-turbo-charging-20": {
    productName: "Vợt Cầu Lông Li-Ning Turbo Charging 20",
    image: "https://picsum.photos/seed/racket3/400/400",
    images: [
      { imageID: 1, displayOrder: 1, imageUrl: "https://picsum.photos/seed/racket3/400/400" },
      { imageID: 2, displayOrder: 2, imageUrl: "https://picsum.photos/seed/racket3b/400/400" },
    ],
    variants: [
      { detailId: 401, weightClass: "4U (80–84g)", gripSize: "S1", price: 4680000, inStock: true, stockQuantity: 9, balancePoint: "Đầu nặng", stiffness: "Cứng", maxTension: 30 },
      { detailId: 402, weightClass: "5U (75–79g)", gripSize: "S1", price: 4680000, inStock: false, stockQuantity: 0, balancePoint: "Đầu nặng", stiffness: "Cứng", maxTension: 30 },
    ],
  },
  "yonex-astrox-100zz": {
    productName: "Vợt Cầu Lông Yonex Astrox 100ZZ",
    image: "https://picsum.photos/seed/racket7/400/400",
    images: [
      { imageID: 1, displayOrder: 1, imageUrl: "https://picsum.photos/seed/racket7/400/400" },
      { imageID: 2, displayOrder: 2, imageUrl: "https://picsum.photos/seed/racket7b/400/400" },
    ],
    variants: [
      { detailId: 501, weightClass: "3U (85–89g)", gripSize: "G4", price: 6480000, inStock: true, stockQuantity: 6, balancePoint: "Đầu nặng", stiffness: "Rất cứng", maxTension: 33 },
      { detailId: 502, weightClass: "4U (80–84g)", gripSize: "G4", price: 6480000, inStock: true, stockQuantity: 4, balancePoint: "Đầu nặng", stiffness: "Rất cứng", maxTension: 33 },
      { detailId: 503, weightClass: "4U (80–84g)", gripSize: "G5", price: 6480000, inStock: false, stockQuantity: 0, balancePoint: "Đầu nặng", stiffness: "Rất cứng", maxTension: 33 },
    ],
  },
  "yonex-power-cushion-65z3": {
    productName: "Giày Cầu Lông Yonex Power Cushion 65Z3",
    image: "https://picsum.photos/seed/shoe1/400/400",
    images: [
      { imageID: 1, displayOrder: 1, imageUrl: "https://picsum.photos/seed/shoe1/400/400" },
      { imageID: 2, displayOrder: 2, imageUrl: "https://picsum.photos/seed/shoe1b/400/400" },
    ],
    variants: [
      { detailId: 601, weightClass: "Size 39", gripSize: "Trắng/Đỏ", price: 2880000, inStock: true, stockQuantity: 5, balancePoint: "N/A", stiffness: "N/A", maxTension: 0 },
      { detailId: 602, weightClass: "Size 40", gripSize: "Trắng/Đỏ", price: 2880000, inStock: true, stockQuantity: 8, balancePoint: "N/A", stiffness: "N/A", maxTension: 0 },
      { detailId: 603, weightClass: "Size 41", gripSize: "Trắng/Đỏ", price: 2880000, inStock: false, stockQuantity: 0, balancePoint: "N/A", stiffness: "N/A", maxTension: 0 },
      { detailId: 604, weightClass: "Size 42", gripSize: "Trắng/Đỏ", price: 2880000, inStock: true, stockQuantity: 3, balancePoint: "N/A", stiffness: "N/A", maxTension: 0 },
    ],
  },
  "victor-sh-a960": {
    productName: "Giày Cầu Lông Victor SH-A960",
    image: "https://picsum.photos/seed/shoe6/400/400",
    images: [
      { imageID: 1, displayOrder: 1, imageUrl: "https://picsum.photos/seed/shoe6/400/400" },
      { imageID: 2, displayOrder: 2, imageUrl: "https://picsum.photos/seed/shoe6b/400/400" },
    ],
    variants: [
      { detailId: 701, weightClass: "Size 40", gripSize: "Đen/Vàng", price: 2975000, inStock: true, stockQuantity: 7, balancePoint: "N/A", stiffness: "N/A", maxTension: 0 },
      { detailId: 702, weightClass: "Size 41", gripSize: "Đen/Vàng", price: 2975000, inStock: true, stockQuantity: 4, balancePoint: "N/A", stiffness: "N/A", maxTension: 0 },
      { detailId: 703, weightClass: "Size 42", gripSize: "Đen/Vàng", price: 2975000, inStock: true, stockQuantity: 2, balancePoint: "N/A", stiffness: "N/A", maxTension: 0 },
    ],
  },
  "yonex-ba92426-12in1": {
    productName: "Balo Cầu Lông Yonex BA92426 12 in 1",
    image: "https://picsum.photos/seed/bag5/400/400",
    images: [
      { imageID: 1, displayOrder: 1, imageUrl: "https://picsum.photos/seed/bag5/400/400" },
      { imageID: 2, displayOrder: 2, imageUrl: "https://picsum.photos/seed/bag5b/400/400" },
    ],
    variants: [
      { detailId: 801, weightClass: "One Size", gripSize: "Xanh Navy", price: 2125000, inStock: true, stockQuantity: 10, balancePoint: "N/A", stiffness: "N/A", maxTension: 0 },
      { detailId: 802, weightClass: "One Size", gripSize: "Đen", price: 2125000, inStock: true, stockQuantity: 6, balancePoint: "N/A", stiffness: "N/A", maxTension: 0 },
    ],
  },
};

const normalizeApiProduct = (data) => ({
  productId: data.productId,
  productName: data.productName,
  image: data.mainImageUrl,
  images: (data.imgaes || []).map((img, idx) => ({
    imageID: idx + 1,
    displayOrder: img.displayOrder ?? idx + 1,
    imageUrl: img.imageUrl,
  })),
  variants: data.variants || [],
  description: data.description || '',
});

const ProductDetail = () => {
  const { productSlug } = useParams();
  const navigate = useNavigate();
  const { addToCart, fetchCart } = useCart();
  const { getProductDetaildBySlug } = useProduct();
  const { isAuthenticated } = useAuth();
  const { productReviews, averageRating, pagination, loading: reviewsLoading, fetchProductReviews } = useReview();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageOrder, setSelectedImageOrder] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [selectedGrip, setSelectedGrip] = useState(null);
  const [reviewPage, setReviewPage] = useState(1);
  const REVIEW_PAGE_SIZE = 5;

  const reviewTotal = pagination?.totalCount ?? 0;
  const reviewTotalPages = pagination?.totalPages ?? 1;

  const tabs = [
    { id: 'description', label: 'Mô tả sản phẩm' },
    { id: 'specs', label: 'Thông số kỹ thuật' },
    { id: 'reviews', label: `Đánh giá${reviewTotal > 0 ? ` (${reviewTotal}) ${averageRating.toFixed(1)}⭐` : ''}` },
  ];

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const apiResult = await getProductDetaildBySlug(productSlug);
        if (apiResult) {
          setProduct(normalizeApiProduct(apiResult));
        } else {
          setProduct(MOCK_PRODUCT_DETAILS[productSlug] ?? null);
        }
      } catch {
        setProduct(MOCK_PRODUCT_DETAILS[productSlug] ?? null);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [productSlug]);

  useEffect(() => {
    if (product?.variants?.length > 0 && (!selectedWeight || !selectedGrip)) {
      setSelectedWeight(product.variants[0].weightClass);
      setSelectedGrip(product.variants[0].gripSize);
    }
  }, [product]);

  useEffect(() => {
    if (!product?.productId || activeTab !== 'reviews') return;
    fetchProductReviews(product.productId, reviewPage, REVIEW_PAGE_SIZE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.productId, activeTab, reviewPage]);

  const weightOptions = [...new Set(product?.variants?.map(v => v.weightClass) ?? [])];
  const gripOptions = [...new Set(product?.variants?.map(v => v.gripSize) ?? [])];

  const isWeightAvailable = (w) => product?.variants?.some(v => v.weightClass === w && v.gripSize === selectedGrip) ?? false;
  const isGripAvailable = (g) => product?.variants?.some(v => v.gripSize === g && v.weightClass === selectedWeight) ?? false;

  const selectedVariant = product?.variants?.find(
    v => v.weightClass === selectedWeight && v.gripSize === selectedGrip
  ) || product?.variants?.[0];

  const handleSelectWeight = (w) => {
    if (!isWeightAvailable(w)) return;
    setSelectedWeight(w);
    if (!product.variants.find(v => v.weightClass === w && v.gripSize === selectedGrip)) {
      const fallback = product.variants.find(v => v.weightClass === w);
      if (fallback) setSelectedGrip(fallback.gripSize);
    }
  };

  const handleSelectGrip = (g) => {
    if (!isGripAvailable(g)) return;
    setSelectedGrip(g);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant?.detailId) { alert('Vui lòng chọn phân loại sản phẩm!'); return; }
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      await addToCart(selectedVariant.detailId, quantity);
      await fetchCart();
      setQuantity(1);
      alert('Đã thêm vào giỏ hàng!');
    } catch {
      alert('Không thể thêm vào giỏ hàng. Vui lòng thử lại!');
    }
  };

  const handleOrder = () => {
    if (!selectedVariant?.detailId) { alert('Vui lòng chọn phân loại sản phẩm!'); return; }
    if (!isAuthenticated) { navigate('/login'); return; }
    navigate('/cart', {
      state: {
        productItem: {
          detailId: selectedVariant.detailId,
          imageUrl: product.image,
          productName: product.productName,
          variantInfo: `${selectedVariant.weightClass} / ${selectedVariant.gripSize}`,
          quantity,
          unitPrice: selectedVariant.price,
          subTotal: selectedVariant.price * quantity,
        }
      }
    });
  };

  if (loading) return <div className="text-center py-20">Đang tải sản phẩm...</div>;
  if (!product) return <div className="text-center py-20">Không tìm thấy sản phẩm</div>;

  return (
    <div className="bg-white min-h-screen font-sans text-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {/* Left: Images */}
          <div className='flex flex-col h-125'>
            <div className='flex-1 min-h-0 flex items-center justify-center p-4'>
              {product.images
                .filter(img => img.displayOrder === selectedImageOrder)
                .map(img => (
                  <div key={img.imageID} className="border border-gray-100 rounded-xl w-full h-full object-contain p-4 flex justify-center mb-4">
                    <img src={img.imageUrl} alt={product.productName} className="h-full w-full object-contain" />
                  </div>
                ))}
            </div>
            <div className='flex justify-center gap-3'>
              {product.images.map(img => (
                <div key={img.imageID} className="flex gap-3 overflow-x-auto" onMouseEnter={() => setSelectedImageOrder(img.displayOrder)}>
                  <img src={img.imageUrl} className="w-20 h-20 border rounded-lg p-1 shrink-0 cursor-pointer hover:border-orange-500" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Summary & Order */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-slate-800 mb-4 leading-snug">{product.productName}</h1>
            <div className="mb-4"><span className="bg-teal-400 text-white px-3 py-1 rounded text-xs font-bold uppercase">✨ Mới</span></div>

            <div className="flex gap-6 text-sm mb-6 pb-6 border-b border-gray-100">
              <p>Xuất xứ: <span className="font-bold text-gray-900">Nhật Bản</span></p>
              <p>Tình trạng: {
                !selectedVariant?.inStock
                  ? <span className="bg-red-50 text-red-500 px-3 py-1 rounded-full text-xs border border-red-100">Hết hàng</span>
                  : <span className="bg-green-50 text-green-500 px-3 py-1 rounded-full text-xs border border-green-100">Còn hàng</span>
              }</p>
            </div>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-bold text-orange-500">{formatPrice(selectedVariant?.price ?? 0)}</span>
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-orange-800 mb-8">
              Liên hệ hotline <span className="font-bold">0979.170.274</span> để được tư vấn và đặt hàng nhanh nhất!
            </div>

            {/* Variant Selector */}
            <div className="mb-6 space-y-5">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Trọng lượng: <span className="text-gray-900">{selectedWeight}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {weightOptions.map(w => {
                    const avail = isWeightAvailable(w);
                    return (
                      <button key={w} onClick={() => handleSelectWeight(w)} disabled={!avail}
                        className={`px-4 py-2 rounded-full border-2 text-sm font-bold transition-all ${
                          selectedWeight === w ? 'border-orange-500 bg-orange-50 text-orange-500'
                          : avail ? 'border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-400'
                          : 'border-gray-100 text-gray-300 line-through cursor-not-allowed'
                        }`}>
                        {w}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Cỡ cán: <span className="text-gray-900">{selectedGrip}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {gripOptions.map(g => {
                    const avail = isGripAvailable(g);
                    return (
                      <button key={g} onClick={() => handleSelectGrip(g)} disabled={!avail}
                        className={`px-4 py-2 rounded-full border-2 text-sm font-bold transition-all ${
                          selectedGrip === g ? 'border-orange-500 bg-orange-50 text-orange-500'
                          : avail ? 'border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-400'
                          : 'border-gray-100 text-gray-300 line-through cursor-not-allowed'
                        }`}>
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedVariant && (
                <div className="flex flex-wrap gap-4 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-500">
                  <span>Cân bằng: <strong className="text-gray-800">{selectedVariant.balancePoint}</strong></span>
                  <span>Độ cứng: <strong className="text-gray-800">{selectedVariant.stiffness}</strong></span>
                  <span>Căng max: <strong className="text-gray-800">{selectedVariant.maxTension} lbs</strong></span>
                  <span>Tồn kho: <strong className="text-gray-800">{selectedVariant.stockQuantity} cái</strong></span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 mb-8">
              <span className="font-medium">Số lượng:</span>
              <div className="flex items-center border rounded-full px-4 py-2 w-32 justify-between">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span className="font-bold">{quantity < 10 ? `0${quantity}` : quantity}</span>
                <button onClick={() => setQuantity(Math.min(quantity + 1, selectedVariant?.stockQuantity ?? 99))}>+</button>
              </div>
            </div>

            {selectedVariant?.inStock ? (
              <div className='flex gap-4'>
                <Button onClick={handleAddToCart} className='w-50 rounded-2xl text-white bg-orange-default hover:bg-orange-dark'>
                  Thêm vào giỏ
                </Button>
                <Button onClick={handleOrder} className='w-50 rounded-2xl text-white bg-orange-default hover:bg-orange-dark'>
                  Mua ngay
                </Button>
              </div>
            ) : (
              <Button className='w-50 rounded-2xl bg-gray-200 text-slate-400 hover:cursor-not-allowed' disabled>
                Đang hết hàng
              </Button>
            )}
          </div>
        </div>

        {/* BOTTOM SECTION: TABS */}
        <div className="mt-12 bg-[#FFF7F2] rounded-3xl p-6 md:p-10 border border-orange-50">
          <div className="flex flex-wrap gap-4 mb-8 border-b border-orange-100">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-4 font-bold text-lg transition-all relative ${
                  activeTab === tab.id
                    ? 'text-orange-600 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-orange-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-gray-700 leading-relaxed text-lg">
            {activeTab === 'description' && (
              <div className="space-y-6 animate-fadeIn">
                {product.description ? (
                  <p>{product.description}</p>
                ) : (
                  <>
                    <p><span className="font-bold text-red-600">{product.productName}</span> là sản phẩm chính hãng chất lượng cao được nhiều vận động viên tin dùng.</p>
                    <p>Với thiết kế hiện đại, sản phẩm mang lại trải nghiệm tốt nhất cho người chơi cầu lông ở mọi trình độ.</p>
                    <h2 className="text-2xl font-bold text-slate-800 mt-8">Công nghệ tích hợp</h2>
                    <ul className="list-disc pl-6 space-y-3">
                      <li><strong>Vật liệu cao cấp:</strong> Chất liệu bền nhẹ, hấp thụ rung tốt.</li>
                      <li><strong>Thiết kế khí động học:</strong> Tối ưu tốc độ xoay cán và lực truyền.</li>
                    </ul>
                  </>
                )}
              </div>
            )}
            {activeTab === 'specs' && (
              <div className="animate-fadeIn space-y-4 max-w-2xl">
                {selectedVariant && (
                  <>
                    {selectedVariant.balancePoint !== 'N/A' && (
                      <div className="flex justify-between border-b py-3">
                        <span className="font-medium text-gray-500">Điểm cân bằng</span>
                        <span className="font-bold">{selectedVariant.balancePoint}</span>
                      </div>
                    )}
                    {selectedVariant.stiffness !== 'N/A' && (
                      <div className="flex justify-between border-b py-3">
                        <span className="font-medium text-gray-500">Độ cứng cán</span>
                        <span className="font-bold">{selectedVariant.stiffness}</span>
                      </div>
                    )}
                    {selectedVariant.maxTension > 0 && (
                      <div className="flex justify-between border-b py-3">
                        <span className="font-medium text-gray-500">Sức căng tối đa</span>
                        <span className="font-bold">{selectedVariant.maxTension} lbs</span>
                      </div>
                    )}
                    <div className="flex justify-between border-b py-3">
                      <span className="font-medium text-gray-500">Trọng lượng</span>
                      <span className="font-bold">{selectedVariant.weightClass}</span>
                    </div>
                    <div className="flex justify-between border-b py-3">
                      <span className="font-medium text-gray-500">Cỡ cán / màu sắc</span>
                      <span className="font-bold">{selectedVariant.gripSize}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between border-b py-3">
                  <span className="font-medium text-gray-500">Nguồn gốc</span>
                  <span className="font-bold">Nhật Bản / Chính hãng</span>
                </div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="animate-fadeIn space-y-4">
                {reviewsLoading ? (
                  <div className="py-20 text-center text-gray-400">Đang tải đánh giá...</div>
                ) : productReviews.length === 0 ? (
                  <div className="py-20 text-center text-gray-400">Chưa có đánh giá nào cho sản phẩm này.</div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 pb-3 border-b border-orange-100">
                      <span className="text-3xl font-black text-slate-800">{averageRating.toFixed(1)}</span>
                      <div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <span key={s} className={`text-lg ${s <= Math.round(averageRating) ? 'text-amber-400' : 'text-gray-300'}`}>★</span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-400">{reviewTotal} đánh giá</p>
                      </div>
                    </div>
                    {productReviews.map(rv => (
                      <div key={rv.reviewId} className="border-b border-orange-100 py-4 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-slate-800">{rv.userName}</span>
                          <span className="text-xs text-gray-400">
                            {rv.reviewDate ? new Date(rv.reviewDate).toLocaleDateString('vi-VN') : ''}
                          </span>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <span key={s} className={`text-sm ${s <= rv.rating ? 'text-amber-400' : 'text-gray-300'}`}>★</span>
                          ))}
                        </div>
                        {rv.comment && <p className="text-sm text-slate-700">{rv.comment}</p>}
                        {rv.images?.length > 0 && (
                          <div className="flex gap-2 flex-wrap pt-1">
                            {rv.images.map((img, i) => (
                              <img key={i} src={img} alt="" className="h-16 w-16 object-cover rounded-lg border border-gray-100" />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {reviewTotalPages > 1 && (
                      <div className="flex gap-2 justify-center pt-2">
                        <button disabled={reviewPage === 1} onClick={() => setReviewPage(p => p - 1)}
                          className="px-3 py-1 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-slate-50">
                          ‹
                        </button>
                        <span className="px-3 py-1 text-sm text-slate-600">{reviewPage} / {reviewTotalPages}</span>
                        <button disabled={reviewPage === reviewTotalPages} onClick={() => setReviewPage(p => p + 1)}
                          className="px-3 py-1 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-slate-50">
                          ›
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <button onClick={() => setActiveTab('description')}
            className="mt-10 mx-auto block text-orange-500 font-bold border-b border-orange-500 hover:text-orange-700 transition-colors">
            Thu gọn
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ProductDetail;
