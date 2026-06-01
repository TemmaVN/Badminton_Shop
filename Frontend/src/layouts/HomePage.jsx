import React from "react";
import Advertisement from "../components/Advertisement";
import CategoryShowcase from "../components/CategoryShowcase";
import { ChevronDown } from "lucide-react";

// SVG Quả cầu lông
const ShuttlecockSVG = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    <path d="M12 16 8.5 4 5 2h14l-3.5 2L12 16Z" />
    <path d="M7 8h10" />
    <path d="M9 12h6" />
    <path d="M12 16V2" />
  </svg>
);

// SVG Vợt cầu lông
const RacketSVG = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <ellipse cx="12" cy="7" rx="4.5" ry="6" />
    <line x1="12" y1="13" x2="12" y2="19" />
    <line x1="12" y1="19" x2="12" y2="23" strokeWidth="2.5" />
    <line x1="8.5" y1="5" x2="15.5" y2="5" strokeWidth="0.5" />
    <line x1="7.5" y1="7" x2="16.5" y2="7" strokeWidth="0.5" />
    <line x1="8.5" y1="9" x2="15.5" y2="9" strokeWidth="0.5" />
    <line x1="10" y1="1.5" x2="10" y2="12.5" strokeWidth="0.5" />
    <line x1="12" y1="1" x2="12" y2="13" strokeWidth="0.5" />
    <line x1="14" y1="1.5" x2="14" y2="12.5" strokeWidth="0.5" />
  </svg>
);

// TẠO COMPONENT HIỆU ỨNG TRANG TRÍ CHUYỂN ĐỘNG 2 BÊN VIỀN
const AnimatedSideDecoration = ({ side }) => {
  const items = Array.from({ length: 16 });
  const isLeft = side === "left";

  return (
    <div
      className={`absolute top-[18%] pointer-events-none hidden xl:flex ${
        isLeft ? "left-2 2xl:left-10" : "right-2 2xl:right-10"
      }`}
    >
      <div className="flex flex-col -space-y-6">
        {items.map((_, i) => (
          <ChevronDown
            key={`c1-${i}`}
            size={48}
            className="animate-flowing-arrows"
            style={{
              opacity: Math.max(0, 1 - i * 0.06),
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// TẠO COMPONENT QUẢ CẦU LÔNG VÀ VỢT BAY LƠ LỬNG
const FloatingBadmintonDeco = ({ side }) => {
  const isLeft = side === "left";
  return (
    <div
      className={`absolute top-[25%] bottom-[10%] pointer-events-none hidden xl:flex flex-col justify-around ${
        isLeft ? "left-10 2xl:left-24" : "right-10 2xl:right-24"
      }`}
    >
      <div
        className="animate-float-slow opacity-[0.15] text-orange-500"
        style={{ animationDelay: "0s" }}
      >
        <ShuttlecockSVG
          className={`w-20 h-20 ${isLeft ? "rotate-[15deg]" : "-rotate-[15deg]"}`}
        />
      </div>
      <div
        className="animate-float-fast opacity-[0.12] text-orange-600"
        style={{ animationDelay: "1.5s" }}
      >
        <RacketSVG
          className={`w-24 h-24 ${isLeft ? "rotate-[-30deg]" : "rotate-[30deg]"}`}
        />
      </div>
      <div
        className="animate-float-slow opacity-20 text-orange-400"
        style={{ animationDelay: "0.8s" }}
      >
        <ShuttlecockSVG
          className={`w-16 h-16 ${isLeft ? "rotate-[75deg]" : "-rotate-[75deg]"}`}
        />
      </div>
    </div>
  );
};

// =============================================
// DỮ LIỆU MẪU TĨNH
// =============================================

const CATEGORIES = [
  { categoryId: 1, categoryName: "Vợt cầu lông", slug: "vot-cau-long" },
  { categoryId: 2, categoryName: "Giày cầu lông", slug: "giay-cau-long" },
  { categoryId: 3, categoryName: "Bao vợt & Balo", slug: "bao-vot-balo" },
];

const HOME_PRODUCTS = {
  "Vợt cầu lông": [
    {
      productId: 1,
      categoryName: "Vợt cầu lông",
      productName: "Vợt Cầu Lông Yonex Astrox 88D Pro",
      basePrice: 4500000,
      sellingPrice: 3990000,
      isBestSeller: true,
      discountPercent: 11,
      mainImageUrl: "https://picsum.photos/seed/racket1/400/400",
      slug: "yonex-astrox-88d-pro",
    },
    {
      productId: 2,
      categoryName: "Vợt cầu lông",
      productName: "Vợt Cầu Lông Victor Thruster K 9900",
      basePrice: 3800000,
      sellingPrice: 3800000,
      isBestSeller: false,
      discountPercent: 0,
      mainImageUrl: "https://picsum.photos/seed/racket2/400/400",
      slug: "victor-thruster-k-9900",
    },
    {
      productId: 3,
      categoryName: "Vợt cầu lông",
      productName: "Vợt Cầu Lông Li-Ning Turbo Charging 20",
      basePrice: 5200000,
      sellingPrice: 4680000,
      isBestSeller: true,
      discountPercent: 10,
      mainImageUrl: "https://picsum.photos/seed/racket3/400/400",
      slug: "lining-turbo-charging-20",
    },
    {
      productId: 4,
      categoryName: "Vợt cầu lông",
      productName: "Vợt Cầu Lông Yonex Nanoflare 800",
      basePrice: 6000000,
      sellingPrice: 5400000,
      isBestSeller: false,
      discountPercent: 10,
      mainImageUrl: "https://picsum.photos/seed/racket4/400/400",
      slug: "yonex-nanoflare-800",
    },
    {
      productId: 5,
      categoryName: "Vợt cầu lông",
      productName: "Vợt Cầu Lông Victor Brave Sword 12",
      basePrice: 2900000,
      sellingPrice: 2610000,
      isBestSeller: false,
      discountPercent: 10,
      mainImageUrl: "https://picsum.photos/seed/racket5/400/400",
      slug: "victor-brave-sword-12",
    },
    {
      productId: 6,
      categoryName: "Vợt cầu lông",
      productName: "Vợt Cầu Lông Kawasaki Master 6600",
      basePrice: 1800000,
      sellingPrice: 1620000,
      isBestSeller: false,
      discountPercent: 10,
      mainImageUrl: "https://picsum.photos/seed/racket6/400/400",
      slug: "kawasaki-master-6600",
    },
  ],
  "Giày cầu lông": [
    {
      productId: 7,
      categoryName: "Giày cầu lông",
      productName: "Giày Cầu Lông Yonex Power Cushion 65Z3",
      basePrice: 3200000,
      sellingPrice: 2880000,
      isBestSeller: true,
      discountPercent: 10,
      mainImageUrl: "https://picsum.photos/seed/shoe1/400/400",
      slug: "yonex-power-cushion-65z3",
    },
    {
      productId: 8,
      categoryName: "Giày cầu lông",
      productName: "Giày Cầu Lông Victor A780 III",
      basePrice: 2600000,
      sellingPrice: 2340000,
      isBestSeller: false,
      discountPercent: 10,
      mainImageUrl: "https://picsum.photos/seed/shoe2/400/400",
      slug: "victor-a780-iii",
    },
    {
      productId: 9,
      categoryName: "Giày cầu lông",
      productName: "Giày Cầu Lông Li-Ning Ranger TD",
      basePrice: 2200000,
      sellingPrice: 1980000,
      isBestSeller: true,
      discountPercent: 10,
      mainImageUrl: "https://picsum.photos/seed/shoe3/400/400",
      slug: "lining-ranger-td",
    },
    {
      productId: 10,
      categoryName: "Giày cầu lông",
      productName: "Giày Cầu Lông Kawasaki K-063",
      basePrice: 1500000,
      sellingPrice: 1350000,
      isBestSeller: false,
      discountPercent: 10,
      mainImageUrl: "https://picsum.photos/seed/shoe4/400/400",
      slug: "kawasaki-k063",
    },
    {
      productId: 11,
      categoryName: "Giày cầu lông",
      productName: "Giày Cầu Lông Yonex SHB 65X2",
      basePrice: 2800000,
      sellingPrice: 2800000,
      isBestSeller: false,
      discountPercent: 0,
      mainImageUrl: "https://picsum.photos/seed/shoe5/400/400",
      slug: "yonex-shb-65x2",
    },
    {
      productId: 12,
      categoryName: "Giày cầu lông",
      productName: "Giày Cầu Lông Victor SH-A960",
      basePrice: 3500000,
      sellingPrice: 2975000,
      isBestSeller: true,
      discountPercent: 15,
      mainImageUrl: "https://picsum.photos/seed/shoe6/400/400",
      slug: "victor-sh-a960",
    },
  ],
  "Bao vợt & Balo": [
    {
      productId: 13,
      categoryName: "Bao vợt & Balo",
      productName: "Balo Cầu Lông Yonex BA92229 6 in 1",
      basePrice: 1800000,
      sellingPrice: 1530000,
      isBestSeller: true,
      discountPercent: 15,
      mainImageUrl: "https://picsum.photos/seed/bag1/400/400",
      slug: "yonex-ba92229-6in1",
    },
    {
      productId: 14,
      categoryName: "Bao vợt & Balo",
      productName: "Túi Đựng Vợt Victor BR9611 3 in 1",
      basePrice: 950000,
      sellingPrice: 855000,
      isBestSeller: false,
      discountPercent: 10,
      mainImageUrl: "https://picsum.photos/seed/bag2/400/400",
      slug: "victor-br9611-3in1",
    },
    {
      productId: 15,
      categoryName: "Bao vợt & Balo",
      productName: "Balo Cầu Lông Li-Ning ABSU392",
      basePrice: 1200000,
      sellingPrice: 1080000,
      isBestSeller: false,
      discountPercent: 10,
      mainImageUrl: "https://picsum.photos/seed/bag3/400/400",
      slug: "lining-absu392",
    },
    {
      productId: 16,
      categoryName: "Bao vợt & Balo",
      productName: "Túi Đựng Vợt Kawasaki KBB-8150 2 in 1",
      basePrice: 650000,
      sellingPrice: 650000,
      isBestSeller: false,
      discountPercent: 0,
      mainImageUrl: "https://picsum.photos/seed/bag4/400/400",
      slug: "kawasaki-kbb-8150",
    },
    {
      productId: 17,
      categoryName: "Bao vợt & Balo",
      productName: "Balo Cầu Lông Yonex BA92426 12 in 1",
      basePrice: 2500000,
      sellingPrice: 2125000,
      isBestSeller: true,
      discountPercent: 15,
      mainImageUrl: "https://picsum.photos/seed/bag5/400/400",
      slug: "yonex-ba92426-12in1",
    },
    {
      productId: 18,
      categoryName: "Bao vợt & Balo",
      productName: "Túi Đựng Vợt Victor BR9609 6 in 1",
      basePrice: 1100000,
      sellingPrice: 990000,
      isBestSeller: false,
      discountPercent: 10,
      mainImageUrl: "https://picsum.photos/seed/bag6/400/400",
      slug: "victor-br9609-6in1",
    },
  ],
};

const CATEGORY_IMAGES = {
  "Vợt cầu lông":
    "https://static.fbshop.vn/wp-content/uploads/2024/01/Artboard-5-copy-2@2x.webp",
  "Giày cầu lông":
    "https://static.fbshop.vn/wp-content/uploads/2024/01/Banner-website-balo.webp",
  "Bao vợt & Balo":
    "https://static.fbshop.vn/wp-content/uploads/2024/01/Banner-website-balo.webp",
};

// =============================================

const HomePage = () => {
  const linkAdvertisement = [
    "https://static.fbshop.vn/wp-content/uploads/2025/12/mua-do.png",
    "https://static.fbshop.vn/wp-content/uploads/2025/12/he-thong-cau-long.png",
    "https://static.fbshop.vn/wp-content/uploads/2024/01/Banner-website-4-min.webp",
    "https://static.fbshop.vn/wp-content/uploads/2024/01/Banner-website-6-min.webp",
    "https://static.fbshop.vn/wp-content/uploads/2026/01/anh-banner-website-4000x1425-1-1920x684.jpg",
  ];

  return (
    <div className="relative w-full overflow-hidden bg-white">
      <style>
        {`
          @keyframes flowing-arrows {
            0%, 100% { transform: translateY(0) scaleY(0.4); color: #fdba74; }
            50% { transform: translateY(8px) scaleY(0.4); color: #ea580c; }
          }
          .animate-flowing-arrows {
            animation: flowing-arrows 2s infinite ease-in-out;
          }

          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
          .animate-float-slow {
            animation: float 5s ease-in-out infinite;
          }
          .animate-float-fast {
            animation: float 3s ease-in-out infinite;
          }
        `}
      </style>

      <Advertisement linkAdvertisement={linkAdvertisement} />

      <div className="relative bg-gray-50 py-1">
        <AnimatedSideDecoration side="left" />
        <AnimatedSideDecoration side="right" />

        <FloatingBadmintonDeco side="left" />
        <FloatingBadmintonDeco side="right" />

        {CATEGORIES.map((category) => {
          const productsForCategory = HOME_PRODUCTS[category.categoryName];
          if (!productsForCategory || productsForCategory.length === 0) {
            return null;
          }
          return (
            <CategoryShowcase
              key={category.categoryId}
              category={category}
              products={productsForCategory}
              categoryImage={
                CATEGORY_IMAGES[category.categoryName] ||
                "https://images.unsplash.com/photo-1599481238640-4c12727c393a?w=500&q=80"
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
