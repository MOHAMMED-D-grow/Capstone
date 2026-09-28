import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { CURRENCIES } from '../data/products';
import { Currency } from '../types';
import { ShoppingBag, Heart, SlidersHorizontal, Search, X } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentRoute,
    navigate,
    cartCount,
    setCartOpen,
    wishlistCount,
    compareList,
    currency,
    setCurrency,
    formatPrice,
    cartSubtotal,
    searchQuery,
    setSearchQuery,
  } = useShop();

  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center">
            <button
              onClick={() => navigate('catalog')}
              className="text-left group cursor-pointer focus:outline-none"
              aria-label="Atelier Nordic Home"
            >
              <span className="font-serif-display text-2xl sm:text-3xl font-medium tracking-tight text-stone-900 group-hover:text-stone-700 transition-colors">
                Atelier Nordic
              </span>
            </button>
          </div>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-stone-600">
            <button
              onClick={() => navigate('catalog')}
              className={`hover:text-stone-950 transition-colors py-1 cursor-pointer whitespace-nowrap ${
                currentRoute.view === 'catalog' ? 'text-stone-950 border-b-2 border-stone-900' : ''
              }`}
            >
              Catalog
            </button>
            <button
              onClick={() => {
                navigate('catalog');
                const catEl = document.getElementById('catalog-section');
                if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-stone-950 transition-colors py-1 cursor-pointer whitespace-nowrap"
            >
              Curated Collections
            </button>
            <button
              onClick={() => navigate('wishlist')}
              className={`hover:text-stone-950 transition-colors py-1 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                currentRoute.view === 'wishlist' ? 'text-stone-950 border-b-2 border-stone-900' : ''
              }`}
            >
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="text-xs text-stone-500 font-mono tabular-nums">({wishlistCount})</span>
              )}
            </button>
            <button
              onClick={() => navigate('compare')}
              className={`hover:text-stone-950 transition-colors py-1 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                currentRoute.view === 'compare' ? 'text-stone-950 border-b-2 border-stone-900' : ''
              }`}
            >
              <span>Compare Objects</span>
              {compareList.length > 0 && (
                <span className="text-xs text-stone-500 font-mono tabular-nums">({compareList.length})</span>
              )}
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions & utility controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Input or Toggle */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center bg-stone-100 rounded-md px-2.5 py-1.5 border border-stone-300">
                  <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search objects, timber, bronze..."
                    className="w-32 sm:w-56 bg-transparent text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="text-stone-400 hover:text-stone-700 ml-1"
                    aria-label="Close search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-md transition-colors"
                  aria-label="Open search bar"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Currency Selector */}
            <div className="hidden sm:block">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="bg-transparent text-xs font-mono font-medium text-stone-600 hover:text-stone-900 border border-stone-300 rounded px-2 py-1 focus:outline-none focus:border-stone-500 cursor-pointer"
                aria-label="Select currency"
              >
                {Object.keys(CURRENCIES).map((cur) => (
                  <option key={cur} value={cur}>
                    {cur} ({CURRENCIES[cur as Currency].symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Wishlist Link */}
            <button
              onClick={() => navigate('wishlist')}
              className="relative p-2 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
              aria-label={`Saved objects wishlist (${wishlistCount})`}
              title="Saved objects"
            >
              <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'text-stone-900' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-stone-900 text-stone-50 text-[10px] font-mono rounded-full flex items-center justify-center px-1">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setCartOpen(true)}
              className="flex items-center space-x-2.5 bg-stone-900 text-stone-50 px-3.5 py-2 rounded-md hover:bg-stone-800 transition-colors shadow-xs group cursor-pointer"
              aria-label="Open shopping bag"
            >
              <ShoppingBag className="w-4 h-4 text-stone-300 group-hover:text-white transition-colors" />
              <span className="text-xs font-medium tracking-wide">Bag</span>
              <span className="text-xs font-mono tabular-nums text-stone-400 group-hover:text-stone-200">
                ({cartCount})
              </span>
              {cartCount > 0 && (
                <span className="hidden md:inline text-xs font-mono text-stone-300 border-l border-stone-700 pl-2">
                  {formatPrice(cartSubtotal)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation strip */}
        <div className="flex lg:hidden items-center justify-between py-2 border-t border-stone-200 text-xs font-medium text-stone-600 overflow-x-auto">
          <button
            onClick={() => navigate('catalog')}
            className={`px-3 py-1 whitespace-nowrap ${currentRoute.view === 'catalog' ? 'text-stone-950 font-semibold' : ''}`}
          >
            Catalog
          </button>
          <button
            onClick={() => navigate('wishlist')}
            className={`px-3 py-1 whitespace-nowrap ${currentRoute.view === 'wishlist' ? 'text-stone-950 font-semibold' : ''}`}
          >
            Wishlist ({wishlistCount})
          </button>
          <button
            onClick={() => navigate('compare')}
            className={`px-3 py-1 whitespace-nowrap ${currentRoute.view === 'compare' ? 'text-stone-950 font-semibold' : ''}`}
          >
            Compare ({compareList.length})
          </button>
        </div>
      </div>
    </header>
  );
};
