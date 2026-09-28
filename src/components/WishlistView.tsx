import React from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { Heart, ShoppingBag, ArrowLeft, Trash2, Scale, ArrowRight } from 'lucide-react';

export const WishlistView: React.FC = () => {
  const {
    wishlist,
    toggleWishlist,
    addToCart,
    addToCompare,
    isInCompare,
    formatPrice,
    navigate,
    showToast,
  } = useShop();

  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  const handleAddAllToCart = () => {
    let count = 0;
    wishlistedProducts.forEach((p) => {
      if (p.inStock) {
        addToCart(p);
        count++;
      }
    });
    if (count > 0) {
      showToast(`Added ${count} available objects to your bag.`, 'success');
    } else {
      showToast('No in-stock objects to add.');
    }
  };

  const handleClearWishlist = () => {
    wishlistedProducts.forEach((p) => toggleWishlist(p.id));
    showToast('Cleared all saved objects from wishlist.');
  };

  if (wishlistedProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-500">
          <Heart className="w-7 h-7" />
        </div>
        <h2 className="font-serif-display text-3xl font-medium text-stone-900">
          Your Saved Archive is Empty
        </h2>
        <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
          Save sculptural furniture, spun brass lamps, and handcrafted stoneware to your personal architectural archive for future reference.
        </p>
        <button
          onClick={() => navigate('catalog')}
          className="mt-4 px-6 py-3 bg-stone-900 text-stone-50 text-xs font-medium rounded hover:bg-stone-800 transition-colors cursor-pointer"
        >
          Explore Catalog Objects
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-stone-200">
        <div>
          <button
            onClick={() => navigate('catalog')}
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 mb-2 cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Catalog</span>
          </button>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-medium text-stone-900">
            Saved Objects Archive
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            {wishlistedProducts.length} curated {wishlistedProducts.length === 1 ? 'object' : 'objects'} saved for your living space.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleClearWishlist}
            className="px-3.5 py-2 border border-stone-300 rounded text-xs font-medium text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            Clear Archive
          </button>
          <button
            onClick={handleAddAllToCart}
            className="px-4 py-2 bg-stone-900 text-stone-50 rounded text-xs font-medium hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add In-Stock to Bag</span>
          </button>
        </div>
      </div>

      {/* Grid of Wishlisted Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {wishlistedProducts.map((product) => {
          const isCompared = isInCompare(product.id);
          return (
            <div
              key={product.id}
              className="bg-[#FAF9F5] border border-stone-200/90 rounded-lg overflow-hidden flex flex-col justify-between hover:border-stone-400 transition-all shadow-xs"
            >
              <div>
                {/* Visual Area */}
                <div
                  onClick={() => navigate('product', { productId: product.id })}
                  className="relative aspect-[4/3] bg-stone-100 overflow-hidden cursor-pointer group"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    title="Remove from saved objects"
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/85 text-rose-600 hover:bg-white shadow-xs transition-colors cursor-pointer"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="absolute bottom-3 left-3">
                    <span className="text-[11px] font-mono tracking-wider uppercase bg-stone-900/80 text-stone-200 px-2 py-0.5 rounded backdrop-blur-xs">
                      {product.inStock ? `${product.stockCount} in stock` : 'Made to order'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 uppercase font-medium tracking-wider">
                    <span>{product.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{product.provenance}</span>
                  </div>

                  <h3
                    onClick={() => navigate('product', { productId: product.id })}
                    className="font-serif-display text-xl font-medium text-stone-900 hover:text-stone-700 transition-colors cursor-pointer"
                  >
                    {product.name}
                  </h3>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-5 pt-0 space-y-3">
                <div className="flex items-baseline justify-between pt-3 border-t border-stone-200/80">
                  <span className="font-mono text-lg font-semibold text-stone-900 tabular-nums">
                    {formatPrice(product.price)}
                  </span>
                  <button
                    onClick={() => addToCompare(product.id)}
                    className={`text-xs flex items-center gap-1 px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                      isCompared ? 'bg-stone-900 text-white border-stone-900' : 'text-stone-700 border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    <Scale className="w-3 h-3" />
                    <span>{isCompared ? 'Compared' : 'Compare'}</span>
                  </button>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-medium rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-stone-300" />
                  <span>Add to Shopping Bag</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
