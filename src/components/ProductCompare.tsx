import React from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { Scale, X, ShoppingBag, ArrowLeft, Plus } from 'lucide-react';

export const ProductCompare: React.FC = () => {
  const {
    compareList,
    removeFromCompare,
    clearCompare,
    formatPrice,
    addToCart,
    navigate,
  } = useShop();

  const comparedProducts = PRODUCTS.filter((p) => compareList.includes(p.id));

  if (comparedProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-600">
          <Scale className="w-6 h-6" />
        </div>
        <h2 className="font-serif-display text-3xl font-medium text-stone-900">
          No Objects in Comparison Matrix
        </h2>
        <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
          Select up to 4 objects from the catalog by clicking the scale icon on any card to evaluate structural dimensions, materials, and pricing side-by-side.
        </p>
        <button
          onClick={() => navigate('catalog')}
          className="mt-4 px-6 py-2.5 bg-stone-900 text-stone-50 text-xs font-medium rounded hover:bg-stone-800 transition-colors"
        >
          Explore Catalog Objects
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-200">
        <div>
          <button
            onClick={() => navigate('catalog')}
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Catalog</span>
          </button>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-medium text-stone-900">
            Comparative Matrix
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Analyzing {comparedProducts.length} architectural {comparedProducts.length === 1 ? 'object' : 'objects'} side-by-side.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={clearCompare}
            className="px-3.5 py-1.5 border border-stone-300 rounded text-xs font-medium text-stone-700 hover:bg-stone-100 transition-colors"
          >
            Clear Matrix
          </button>
          <button
            onClick={() => navigate('catalog')}
            className="px-3.5 py-1.5 bg-stone-900 text-stone-50 rounded text-xs font-medium hover:bg-stone-800 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add More Objects</span>
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto border border-stone-200 rounded-lg bg-white shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50/70">
              <th className="p-4 sm:p-5 w-48 font-mono uppercase text-stone-400 font-normal">
                Property
              </th>
              {comparedProducts.map((p) => (
                <th key={p.id} className="p-4 sm:p-5 min-w-[240px] align-top">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[11px] font-mono text-stone-400 uppercase">{p.sku}</span>
                    <button
                      onClick={() => removeFromCompare(p.id)}
                      className="text-stone-400 hover:text-stone-900 p-1"
                      aria-label="Remove object from comparison"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div
                    onClick={() => navigate('product', { productId: p.id })}
                    className="aspect-[4/3] bg-stone-100 rounded overflow-hidden mb-3 cursor-pointer group"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <h3
                    onClick={() => navigate('product', { productId: p.id })}
                    className="font-serif-display text-base font-semibold text-stone-900 leading-snug cursor-pointer hover:text-stone-700 transition-colors"
                  >
                    {p.name}
                  </h3>

                  <div className="font-mono text-base font-semibold text-stone-900 mt-1 tabular-nums">
                    {formatPrice(p.price)}
                  </div>

                  <button
                    onClick={() => addToCart(p)}
                    className="w-full mt-3 py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-100 font-mono">
            <tr>
              <td className="p-4 sm:p-5 font-semibold text-stone-900 font-sans">Category</td>
              {comparedProducts.map((p) => (
                <td key={p.id} className="p-4 sm:p-5 text-stone-700 capitalize">
                  {p.categoryLabel}
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-4 sm:p-5 font-semibold text-stone-900 font-sans">Provenance & Origin</td>
              {comparedProducts.map((p) => (
                <td key={p.id} className="p-4 sm:p-5 text-stone-700 font-sans">
                  {p.provenance}
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-4 sm:p-5 font-semibold text-stone-900 font-sans">Availability</td>
              {comparedProducts.map((p) => (
                <td key={p.id} className="p-4 sm:p-5">
                  {p.inStock ? (
                    <span className="text-emerald-700 font-medium">In Atelier ({p.stockCount} remaining)</span>
                  ) : (
                    <span className="text-amber-700">Made to Order</span>
                  )}
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-4 sm:p-5 font-semibold text-stone-900 font-sans">Dimensions (H × W × D)</td>
              {comparedProducts.map((p) => (
                <td key={p.id} className="p-4 sm:p-5 text-stone-700">
                  {p.dimensions.height} × {p.dimensions.width}
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-4 sm:p-5 font-semibold text-stone-900 font-sans">Net Weight</td>
              {comparedProducts.map((p) => (
                <td key={p.id} className="p-4 sm:p-5 text-stone-700">
                  {p.dimensions.weight}
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-4 sm:p-5 font-semibold text-stone-900 font-sans">Primary Materiality</td>
              {comparedProducts.map((p) => (
                <td key={p.id} className="p-4 sm:p-5 text-stone-700 font-sans">
                  <ul className="list-disc list-inside space-y-1">
                    {p.materials.map((m, idx) => (
                      <li key={idx} className="text-[11px]">{m}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-4 sm:p-5 font-semibold text-stone-900 font-sans">Finishes & Variations</td>
              {comparedProducts.map((p) => (
                <td key={p.id} className="p-4 sm:p-5 text-stone-700 font-sans">
                  <div className="flex flex-wrap gap-1.5">
                    {p.finishes.map((f) => (
                      <span key={f.id} className="text-[11px] bg-stone-100 px-2 py-0.5 rounded text-stone-800">
                        {f.name.split('/')[0]}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-4 sm:p-5 font-semibold text-stone-900 font-sans">Curator Rating</td>
              {comparedProducts.map((p) => (
                <td key={p.id} className="p-4 sm:p-5 text-stone-900 font-semibold tabular-nums">
                  ★ {p.rating} / 5.0 ({p.reviewCount} reviews)
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
