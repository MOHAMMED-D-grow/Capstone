import React, { useMemo, useState } from 'react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { Category, Product } from '../types';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { LayoutGrid, List, SlidersHorizontal, RotateCcw, Search, X, Check, Heart, Scale, ShoppingBag } from 'lucide-react';

export const ProductCatalog: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    priceRange,
    setPriceRange,
    inStockOnly,
    setInStockOnly,
    sortBy,
    setSortBy,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addToCompare,
    isInCompare,
    navigate,
  } = useShop();

  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      // Category match
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // In-stock match
      if (inStockOnly && !item.inStock) {
        return false;
      }
      // Price range match
      if (item.price < priceRange[0] || item.price > priceRange[1]) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matched =
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.materials.some((m) => m.toLowerCase().includes(query)) ||
          item.provenance.toLowerCase().includes(query) ||
          item.categoryLabel.toLowerCase().includes(query);
        if (!matched) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [selectedCategory, inStockOnly, priceRange, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setPriceRange([0, 3000]);
    setInStockOnly(false);
    setSortBy('featured');
  };

  const isFiltered =
    selectedCategory !== 'all' ||
    searchQuery !== '' ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 3000 ||
    inStockOnly;

  return (
    <section id="catalog-section" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-stone-200">
        <div>
          <div className="text-xs text-stone-500 uppercase tracking-widest font-mono">
            Architectural Stock Index
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-medium text-stone-900 mt-1">
            The Living Catalog
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Showing <span className="font-mono tabular-nums font-semibold text-stone-900">{filteredProducts.length}</span> curated {filteredProducts.length === 1 ? 'object' : 'objects'} crafted for enduring spaces.
          </p>
        </div>

        {/* Layout & Sort Controls */}
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          {/* Sort selector */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600">
            <span className="hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border border-stone-300 rounded px-2.5 py-1.5 text-xs text-stone-900 font-medium focus:outline-none focus:border-stone-500 cursor-pointer"
            >
              <option value="featured">Curator's Selection</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Grid vs List Mode Toggle */}
          <div className="flex items-center border border-stone-300 rounded p-0.5 bg-stone-100">
            <button
              onClick={() => setLayoutMode('grid')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                layoutMode === 'grid' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
              aria-label="Grid layout view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayoutMode('list')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                layoutMode === 'list' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
              aria-label="List layout view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Filter toggle button for mobile */}
          <button
            onClick={() => setFilterDrawerOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 border border-stone-300 rounded text-xs font-medium text-stone-700 hover:bg-stone-100 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters {isFiltered && '•'}</span>
          </button>
        </div>
      </div>

      {/* Category Segmented Control (Interactive Filter Buttons per Section 1A) */}
      <div className="mb-8">
        <div className="flex items-center gap-1.5 p-1 bg-stone-200/60 rounded-lg overflow-x-auto">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as Category)}
                className={`px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-stone-50 shadow-xs'
                    : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Filter Bar (Desktop) */}
      <div className="mb-8 hidden md:grid md:grid-cols-12 gap-4 items-center bg-stone-100/70 p-4 rounded-lg border border-stone-200/80">
        {/* Search in Catalog */}
        <div className="md:col-span-4 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by material, name, provenance..."
            className="w-full bg-white border border-stone-300 rounded-md pl-9 pr-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
            >
              Clear
            </button>
          )}
        </div>

        {/* Price Slider */}
        <div className="md:col-span-5 flex items-center gap-3">
          <span className="text-xs text-stone-600 font-medium whitespace-nowrap">
            Max Price: <span className="font-mono tabular-nums font-semibold">{formatPrice(priceRange[1])}</span>
          </span>
          <input
            type="range"
            min="200"
            max="3000"
            step="50"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, Number(e.target.value)])}
            className="w-full accent-stone-900 cursor-pointer"
          />
        </div>

        {/* In-Stock Toggle & Reset */}
        <div className="md:col-span-3 flex items-center justify-end gap-4">
          <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded accent-stone-900 cursor-pointer"
            />
            <span>In Stock Only</span>
          </label>

          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Active Filters Bar if any filter is set */}
      {isFiltered && (
        <div className="md:hidden flex items-center justify-between mb-4 p-2.5 bg-stone-100 rounded-md text-xs">
          <span className="text-stone-600">Filters applied</span>
          <button
            onClick={handleResetFilters}
            className="text-stone-900 font-medium underline flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        </div>
      )}

      {/* Product Display Area */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-stone-300 rounded-lg p-8">
          <div className="max-w-md mx-auto space-y-3">
            <h3 className="font-serif-display text-2xl font-medium text-stone-900">
              No matching objects found
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              No pieces match your current combination of filters. Try broadening your price threshold, searching for broader terms like "oak" or "brass", or clearing filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-5 py-2.5 bg-stone-900 text-stone-50 text-xs font-medium rounded hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      ) : layoutMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Polished List Mode View */
        <div className="space-y-4">
          {filteredProducts.map((product) => {
            const isWishlisted = isInWishlist(product.id);
            const isCompared = isInCompare(product.id);
            return (
              <div
                key={product.id}
                className="bg-[#FAF9F5] border border-stone-200/90 rounded-lg p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center gap-6 hover:border-stone-400 transition-colors"
              >
                <div
                  onClick={() => navigate('product', { productId: product.id })}
                  className="w-full md:w-52 aspect-[4/3] bg-stone-100 rounded overflow-hidden shrink-0 cursor-pointer group"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-stone-500 font-medium uppercase tracking-wider">
                    <span>{product.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{product.provenance}</span>
                    <span aria-hidden="true">·</span>
                    {product.inStock ? (
                      <span className="text-emerald-700 font-mono text-[11px] font-semibold">In Stock ({product.stockCount})</span>
                    ) : (
                      <span className="text-amber-800 font-mono text-[11px]">Made to order</span>
                    )}
                  </div>
                  <h3
                    onClick={() => navigate('product', { productId: product.id })}
                    className="font-serif-display text-xl sm:text-2xl font-medium text-stone-900 hover:text-stone-700 cursor-pointer"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {product.longDescription}
                  </p>
                  <div className="text-xs text-stone-500 font-mono">
                    Dimensions: {product.dimensions.width} × {product.dimensions.height} · Weight: {product.dimensions.weight}
                  </div>
                </div>

                <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-stone-200 shrink-0">
                  <div className="text-left md:text-right">
                    <div className="font-mono text-xl font-semibold text-stone-900 tabular-nums">
                      {formatPrice(product.price)}
                    </div>
                    {product.originalPrice && (
                      <span className="font-mono text-xs text-stone-400 line-through tabular-nums">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`p-2 rounded border transition-colors cursor-pointer ${
                        isWishlisted ? 'border-rose-300 text-rose-600 bg-rose-50' : 'border-stone-300 text-stone-600 hover:bg-stone-100'
                      }`}
                      aria-label="Wishlist toggle"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                    </button>
                    <button
                      onClick={() => addToCompare(product.id)}
                      className={`p-2 rounded border transition-colors cursor-pointer ${
                        isCompared ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-300 text-stone-600 hover:bg-stone-100'
                      }`}
                      aria-label="Compare toggle"
                    >
                      <Scale className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-medium rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mobile Filter Drawer Modal */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
          <div
            onClick={() => setFilterDrawerOpen(false)}
            className="absolute inset-0 bg-stone-950/40 backdrop-blur-xs transition-opacity"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-[#FAF9F5] border-l border-stone-200 shadow-xl flex flex-col p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <h3 className="font-serif-display text-xl font-medium text-stone-900">
                  Filter Catalog
                </h3>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div className="space-y-1.5 text-xs">
                <label className="font-medium text-stone-700">Search Objects</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Timber, brass, stone..."
                    className="w-full bg-white border border-stone-300 rounded pl-9 pr-3 py-2 text-stone-900"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2 text-xs">
                <label className="font-medium text-stone-700">Category</label>
                <div className="flex flex-col gap-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id as Category)}
                      className={`text-left px-3 py-2 rounded text-xs transition-colors ${
                        selectedCategory === cat.id ? 'bg-stone-900 text-stone-50 font-medium' : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Price */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="font-medium text-stone-700">Maximum Price</span>
                  <span className="font-mono font-semibold text-stone-900">{formatPrice(priceRange[1])}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="3000"
                  step="50"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                  className="w-full accent-stone-900"
                />
              </div>

              {/* In-stock toggle */}
              <label className="flex items-center gap-2 text-xs text-stone-800 cursor-pointer pt-2 border-t border-stone-200">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded accent-stone-900"
                />
                <span>In Stock Objects Only</span>
              </label>

              {/* Drawer Actions */}
              <div className="pt-6 border-t border-stone-200 space-y-2 mt-auto">
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="w-full py-3 bg-stone-900 text-stone-50 rounded text-xs font-medium"
                >
                  Show {filteredProducts.length} Objects
                </button>
                {isFiltered && (
                  <button
                    onClick={handleResetFilters}
                    className="w-full py-2 border border-stone-300 rounded text-xs text-stone-600 hover:text-stone-900"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
