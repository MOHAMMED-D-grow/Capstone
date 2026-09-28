import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductDetail } from './ProductDetail';
import { X } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct } = useShop();

  if (!quickViewProduct) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Backdrop */}
      <div
        onClick={() => setQuickViewProduct(null)}
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Content */}
      <div className="relative bg-[#FAF9F5] rounded-xl max-w-4xl w-full border border-stone-200 shadow-2xl z-10 overflow-hidden">
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 text-stone-500 hover:text-stone-950 bg-white/80 hover:bg-white rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <ProductDetail
          product={quickViewProduct}
          isModal={true}
          onClose={() => setQuickViewProduct(null)}
        />
      </div>
    </div>
  );
};
