import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { CURRENCIES } from '../data/products';
import { Currency } from '../types';
import { ArrowRight, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, currency, setCurrency, showToast } = useShop();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please provide a valid studio email address.');
      return;
    }
    setSubscribed(true);
    showToast('Subscribed to the Atelier Nordic Archival Dispatches.', 'success');
  };

  return (
    <footer className="border-t border-stone-200 bg-[#F5F2EB] text-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand Manifesto */}
          <div className="lg:col-span-5 space-y-4">
            <span className="font-serif-display text-2xl font-medium tracking-tight text-stone-900">
              Atelier Nordic
            </span>
            <p className="text-xs text-stone-600 leading-relaxed max-w-sm">
              Founded on the belief that everyday objects should possess sculptural weight, geological honesty, and generational permanence. Designed across Stockholm, Småland, and Brescia.
            </p>
            <div className="pt-2 text-xs text-stone-500 font-mono">
              PEFC Certified Timber · 10-Year Joinery Guarantee · Crate Freight
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <div className="font-semibold text-stone-900 uppercase tracking-wider font-mono text-[11px]">
              Collection Index
            </div>
            <ul className="space-y-2 text-stone-600">
              <li>
                <button onClick={() => navigate('catalog')} className="hover:text-stone-950 transition-colors cursor-pointer">
                  Seating & Furniture
                </button>
              </li>
              <li>
                <button onClick={() => navigate('catalog')} className="hover:text-stone-950 transition-colors cursor-pointer">
                  Architectural Lighting
                </button>
              </li>
              <li>
                <button onClick={() => navigate('catalog')} className="hover:text-stone-950 transition-colors cursor-pointer">
                  Hand-Thrown Ceramics
                </button>
              </li>
              <li>
                <button onClick={() => navigate('catalog')} className="hover:text-stone-950 transition-colors cursor-pointer">
                  Horology & Timepieces
                </button>
              </li>
              <li>
                <button onClick={() => navigate('wishlist')} className="hover:text-stone-950 transition-colors cursor-pointer">
                  Saved Objects Archive
                </button>
              </li>
              <li>
                <button onClick={() => navigate('compare')} className="hover:text-stone-950 transition-colors cursor-pointer">
                  Compare Objects
                </button>
              </li>
            </ul>
          </div>

          {/* Atelier Services */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <div className="font-semibold text-stone-900 uppercase tracking-wider font-mono text-[11px]">
              Atelier Services
            </div>
            <ul className="space-y-2 text-stone-600">
              <li>
                <span className="text-stone-700">Architectural Consulting</span>
              </li>
              <li>
                <span className="text-stone-700">Custom Timber Milling</span>
              </li>
              <li>
                <span className="text-stone-700">White-Glove Placement</span>
              </li>
              <li>
                <span className="text-stone-700">10-Year Guarantee</span>
              </li>
            </ul>
          </div>

          {/* Newsletter & Atelier Dispatches */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <div className="font-semibold text-stone-900 uppercase tracking-wider font-mono text-[11px]">
              Studio Dispatches
            </div>
            <p className="text-stone-600 leading-relaxed">
              Occasional releases of limited-edition workshop castings and monograph essays on material culture.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 p-2 bg-stone-100 rounded text-emerald-800 font-medium">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Subscribed to Archival Notes.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="architect@studio.com"
                    required
                    className="w-full bg-white border border-stone-300 rounded-l px-3 py-2 text-stone-900 text-xs placeholder:text-stone-400 focus:outline-none focus:border-stone-500"
                  />
                  <button
                    type="submit"
                    className="bg-stone-900 text-white px-3 py-2 rounded-r hover:bg-stone-800 transition-colors shrink-0"
                    aria-label="Subscribe to newsletter"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Quiet Sub-Footer */}
        <div className="mt-14 pt-8 border-t border-stone-300/70 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div>
            © 2026 Atelier Nordic Ab. All rights reserved. Web Development Capstone Specification.
          </div>

          <div className="flex items-center gap-6">
            <span className="font-mono">Stockholm · Copenhagen · Brescia</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="bg-transparent border border-stone-300 rounded px-2 py-0.5 text-stone-700 text-xs font-mono focus:outline-none"
            >
              {Object.keys(CURRENCIES).map((cur) => (
                <option key={cur} value={cur}>
                  {cur} ({CURRENCIES[cur as Currency].symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
};
