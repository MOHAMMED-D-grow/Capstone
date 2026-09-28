import React, { useState } from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { Heart, ShoppingBag, Eye, Scale, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addToCompare,
    removeFromCompare,
    isInCompare,
    navigate,
    setQuickViewProduct,
  } = useShop();

  const [imgError, setImgError] = useState(false);
  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCompared) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product.id);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <article
      onClick={() => navigate('product', { productId: product.id })}
      className="group relative flex flex-col bg-[#FAF9F5] border border-stone-200/90 rounded-lg overflow-hidden transition-all duration-300 hover:border-stone-400 hover:shadow-sm cursor-pointer"
    >
      {/* Visual Slot: 68% height on neutral backdrop */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-200 text-stone-500 p-4 text-center">
            <span className="font-serif-display text-lg text-stone-700">{product.name}</span>
            <span className="text-xs text-stone-400 mt-1">Architectural Specimen</span>
          </div>
        )}

        {/* Hover Quick Actions Bar */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          {/* Wishlist button */}
          <button
            onClick={handleWishlistClick}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            className={`p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
              isWishlisted
                ? 'bg-rose-50 text-rose-600'
                : 'bg-white/80 text-stone-600 hover:text-stone-950 hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
          </button>

          {/* Quick View */}
          <button
            onClick={handleQuickView}
            aria-label="Quick preview of product specifications"
            className="p-2 rounded-full bg-white/80 backdrop-blur-md text-stone-600 hover:text-stone-950 hover:bg-white transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Compare Toggle */}
          <button
            onClick={handleCompareClick}
            aria-label={isCompared ? 'Remove from compare' : 'Compare object'}
            className={`p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
              isCompared
                ? 'bg-stone-900 text-white'
                : 'bg-white/80 text-stone-600 hover:text-stone-950 hover:bg-white'
            }`}
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>

        {/* Unboxed Status Kicker overlay */}
        {product.isLimitedRun && (
          <div className="absolute bottom-3 left-3">
            <span className="text-[11px] font-mono tracking-wider uppercase bg-stone-900/80 text-stone-200 px-2 py-0.5 rounded backdrop-blur-xs">
              Limited Edition
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between space-y-3">
        <div>
          {/* Unboxed quiet metadata with separator */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
            <span className="uppercase tracking-wider text-[11px]">{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{product.provenance}</span>
            <span aria-hidden="true">·</span>
            {product.inStock ? (
              <span className="text-emerald-700 font-medium font-mono text-[11px]">In Stock ({product.stockCount})</span>
            ) : (
              <span className="text-amber-800 font-mono text-[11px]">Made to order</span>
            )}
          </div>

          {/* Product Name */}
          <h2 className="font-serif-display text-lg sm:text-xl font-medium text-stone-900 mt-1 line-clamp-1 group-hover:text-stone-700 transition-colors">
            {product.name}
          </h2>

          {/* Subtitle / summary */}
          <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-base font-semibold text-stone-900 tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="font-mono text-xs text-stone-400 line-through tabular-nums">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-800 text-xs font-medium rounded transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>
        </div>
      </div>
    </article>
  );
};
