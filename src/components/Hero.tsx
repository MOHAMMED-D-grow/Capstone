import React from 'react';
import { HERO_IMAGE } from '../data/products';
import { useShop } from '../context/ShopContext';
import { ArrowDown, Compass, ShieldCheck, Truck } from 'lucide-react';

export const Hero: React.FC = () => {
  const { navigate } = useShop();

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('catalog');
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 space-y-6">
            {/* Quiet 1-line text kicker - unboxed metadata */}
            <div className="flex items-center gap-2 text-xs text-stone-500 font-medium tracking-wider uppercase">
              <span>Collection 2026</span>
              <span aria-hidden="true">·</span>
              <span>Architectural Living</span>
              <span aria-hidden="true">·</span>
              <span>Pure Materiality</span>
            </div>

            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-stone-900 leading-[1.12]">
              Objects shaped by light, timber, and geological time.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl font-normal">
              An intentional catalogue of monolithic stone tables, cold-spun brass luminaires, and solid oak seating—crafted for tranquil architectural interiors.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={scrollToCatalog}
                className="px-6 py-3.5 bg-stone-900 text-stone-50 text-sm font-medium rounded-md hover:bg-stone-800 transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <span>Explore the Catalog</span>
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('compare')}
                className="px-5 py-3.5 border border-stone-300 text-stone-700 hover:text-stone-950 hover:border-stone-400 text-sm font-medium rounded-md transition-colors cursor-pointer"
              >
                Compare Objects
              </button>
            </div>

            {/* Adjacent Trust Proof - Adjacency section */}
            <div className="pt-8 border-t border-stone-200/80 grid grid-cols-3 gap-4 text-left">
              <div>
                <span className="block font-serif-display text-lg text-stone-900 font-medium">100% Provenance</span>
                <span className="text-xs text-stone-500">Traceable Nordic timber & stone</span>
              </div>
              <div>
                <span className="block font-serif-display text-lg text-stone-900 font-medium">Zero Synthetic Foam</span>
                <span className="text-xs text-stone-500">Natural virgin wool & organic latex</span>
              </div>
              <div>
                <span className="block font-serif-display text-lg text-stone-900 font-medium">White-Glove Courier</span>
                <span className="text-xs text-stone-500">Insured continental crate delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[16/10] sm:aspect-[16/10] rounded-lg overflow-hidden bg-stone-100 shadow-md">
              <img
                src={HERO_IMAGE}
                alt="Scandinavian sunlit architectural living space with smoked oak armchair and travertine floor"
                referrerPolicy="no-referrer"
                loading="eager"
                fetchPriority="high"
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                <span className="font-serif-display text-sm tracking-wide text-stone-100 drop-shadow-xs">
                  The Småland Pavilion — Curated Study 01
                </span>
                <span className="text-stone-300 font-mono text-[11px] backdrop-blur-xs bg-black/30 px-2 py-0.5 rounded">
                  Stockholm Exhibition 2026
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
