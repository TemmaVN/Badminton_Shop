import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { brandApi } from '../api';
import { useCategory } from '../contexts/CategoryContext';

const slugify = (str = '') =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const ACCESSORY_SLUG = 'phu-kien';

const ACCESSORY_MENU = {
  label: 'PHỤ KIỆN',
  slug: ACCESSORY_SLUG,
  productCategories: [
    {
      brand: 'QUẤN CÁN VỢT',
      items: ['Quấn cán Yonex AC102EX', 'Quấn cán vải mỏng', 'Quấn cán lỗ thoáng khí', 'Quấn cán Lining/Victor', 'Quấn cán overgrip'],
    },
    {
      brand: 'CƯỚC CẦU LÔNG',
      items: ['Cước Yonex BG65/65Ti', 'Cước Yonex BG80/80P', 'Cước Lining No.1/No.7', 'Cước Victor VBS-66N', 'Cước Aerobite Boost'],
    },
    {
      brand: 'PHỤ KIỆN KHÁC',
      items: ['Băng chặn mồ hôi', 'Tất (vớ) chuyên dụng', 'Bột quấn cán', 'Móc khóa cầu lông', 'Cầu lông lông vũ/nhựa'],
    },
  ],
};

const MainHeader = () => {
  const [isProductHovered, setIsProductHovered] = useState(false);
  const [currentProduct, setCurrentProduct] = useState([]);
  const [page, setPage] = useState('home');
  const [loading, setLoading] = useState(true);
  const { categories, refreshCategories, setPageCatagory } = useCategory();
  const [brandList, setBrandList] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await brandApi.getAll();
        setBrandList(response.data.data || []);
      } catch (err) {
        console.error('Không thể tải thương hiệu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
    refreshCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const menuItems = useMemo(() => {
    if (!categories.length) return [];

    const filtered = categories.filter(cat => cat.slug !== ACCESSORY_SLUG);
    const mainCats = filtered.slice(0, 3);
    const extraCats = filtered.slice(3);

    const buildBrandColumns = (cat) => {
      const catName = cat.categoryName ?? '';
      const shortCat = catName.split(' ')[0];
      return brandList.map(brand => {
        const bSlug = brand.slug ?? slugify(brand.brandName ?? '');
        return {
          brand: `${catName.toUpperCase()} ${(brand.brandName ?? '').toUpperCase()}`,
          brandTo: `/${cat.slug}/${bSlug}`,
          items: [
            { label: `Dòng ${shortCat.toLowerCase()} ${brand.brandName}`, to: `/${cat.slug}/${bSlug}` },
            { label: `${shortCat} ${brand.brandName} bán chạy`, to: `/${cat.slug}/${bSlug}?isBestSeller=true` },
            { label: `${shortCat} ${brand.brandName} khuyến mãi`, to: `/${cat.slug}/${bSlug}?voucher=true` },
          ],
        };
      });
    };

    const built = mainCats.map(cat => ({
      label: (cat.categoryName ?? '').toUpperCase(),
      slug: cat.slug,
      productCategories: buildBrandColumns(cat),
    }));

    const extraColumns = extraCats.map(cat => ({
      brand: (cat.categoryName ?? '').toUpperCase(),
      brandTo: `/${cat.slug}`,
      items: brandList.map(brand => ({
        label: `${cat.categoryName} ${brand.brandName}`,
        to: `/${cat.slug}/${brand.slug ?? slugify(brand.brandName ?? '')}`,
      })),
    }));

    built.push({
      ...ACCESSORY_MENU,
      productCategories: [...extraColumns, ...ACCESSORY_MENU.productCategories],
    });

    return built;
  }, [categories, brandList]);

  return (
    <nav
      className="relative bg-white dark:bg-slate-950 text-gray-700 dark:text-slate-300 font-sans flex justify-center"
      onMouseLeave={() => setIsProductHovered(false)}
    >
      <div className="container shadow-md border border-gray-200 dark:border-slate-700 flex grow max-w-325 items-center justify-center">
        <div className="flex space-x-15 uppercase text-sm font-bold py-4">
          <Link
            onClick={() => setPage('home')}
            to="/"
            className={`pb-3 border-orange-500 hover:text-orange-500 hover:border-b-2 ${
              page === 'home' ? 'text-orange-500 border-b-2' : ''
            }`}
          >
            Trang chủ
          </Link>

          {!loading &&
            menuItems.map(({ label, slug, productCategories }) => (
              <Link
                to={`/${slug}`}
                key={slug}
                onClick={() => {
                  setPageCatagory(label);
                  setPage(label);
                }}
                className={`pb-3 border-orange-500 hover:text-orange-500 hover:border-b-2 ${page === label ? 'text-orange-500 border-b-2' : ''}`}
                onMouseEnter={() => {
                  setCurrentProduct(productCategories);
                  setIsProductHovered(true);
                }}
              >
                {label} <span className="text-[10px]">▼</span>
              </Link>
            ))}

          <Link
            to="/sales"
            onClick={() => setPage('sale')}
            className={`hover:text-orange-500 pb-3 hover:border-b-2 border-orange-500 ${
              page === 'sale' ? 'text-orange-500 border-b-2' : ''
            }`}
          >
            GIẢM GIÁ
          </Link>
          <Link
            to="/contract"
            onClick={() => setPage('contract')}
            className={`hover:text-orange-500 pb-3 hover:border-b-2 border-orange-500 ${
              page === 'contract' ? 'text-orange-500 border-b-2' : ''
            }`}
          >
            Liên hệ
          </Link>
        </div>
      </div>

      {isProductHovered && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white dark:bg-slate-900 shadow-xl border-t border-gray-200 dark:border-slate-700">
          <div className="max-w-325 mx-auto px-6 py-6 flex gap-8 flex-wrap">
            {currentProduct.map((col, i) => (
              <div key={i} className="min-w-40">
                {col.brandTo ? (
                  <Link
                    to={col.brandTo}
                    className="block font-bold text-xs text-gray-900 dark:text-white mb-2 hover:text-orange-500"
                  >
                    {col.brand}
                  </Link>
                ) : (
                  <p className="font-bold text-xs text-gray-900 dark:text-white mb-2">{col.brand}</p>
                )}
                <ul className="flex flex-col gap-1.5">
                  {col.items.map((item, j) =>
                    typeof item === 'string' ? (
                      <li key={j} className="text-xs text-gray-500 dark:text-slate-400 hover:text-orange-500 cursor-pointer">
                        {item}
                      </li>
                    ) : (
                      <li key={j}>
                        <Link to={item.to} className="text-xs text-gray-500 dark:text-slate-400 hover:text-orange-500">
                          {item.label}
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default MainHeader;
