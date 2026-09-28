import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Trash2, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    cartShipping,
    cartDiscount,
    cartTax,
    cartTotal,
    freeShippingThreshold,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    formatPrice,
    navigate,
  } = useShop();

  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ message: string; success: boolean } | null>(null);

  if (!cartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput) return;
    const res = applyPromoCode(promoInput);
    setPromoFeedback(res);
    if (res.success) {
      setPromoInput('');
    }
  };

  const handleCheckoutClick = () => {
    setCartOpen(false);
    navigate('checkout');
  };

  const distanceToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPct = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setCartOpen(false)}
        className="absolute inset-0 bg-stone-950/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F5] border-l border-stone-200 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-stone-200 flex items-center justify-between">
            <div>
              <h2 className="font-serif-display text-2xl font-medium text-stone-900">
                Shopping Bag
              </h2>
              <span className="text-xs text-stone-500 font-mono">
                {cart.length} unique {cart.length === 1 ? 'object' : 'objects'}
              </span>
            </div>
            <button
              onClick={() => setCartOpen(false)}
              className="p-2 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-200/50 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Freight Progress */}
          <div className="px-6 py-3.5 bg-stone-100 border-b border-stone-200">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-medium text-stone-700">
                {distanceToFreeShipping === 0 || appliedPromo?.code === 'FREESHIP'
                  ? 'Complimentary insured freight qualified'
                  : `Add ${formatPrice(distanceToFreeShipping)} for complimentary freight`}
              </span>
              <span className="font-mono text-stone-500 tabular-nums">
                {appliedPromo?.code === 'FREESHIP' ? '100%' : `${progressPct}%`}
              </span>
            </div>
            <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-stone-900 transition-all duration-300"
                style={{ width: `${appliedPromo?.code === 'FREESHIP' ? 100 : progressPct}%` }}
              />
            </div>
          </div>

          {/* Itemized List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-16">
                <span className="font-serif-display text-xl text-stone-800">Your bag is empty</span>
                <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                  Discover structural seating, machined lighting fixtures, and high-fire ceramics in our catalog.
                </p>
                <button
                  onClick={() => {
                    setCartOpen(false);
                    navigate('catalog');
                  }}
                  className="mt-2 px-5 py-2.5 bg-stone-900 text-stone-50 text-xs font-medium rounded hover:bg-stone-800 transition-colors"
                >
                  Browse Atelier Objects
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedFinish.id}`}
                  className="flex gap-4 p-3 bg-white rounded-lg border border-stone-200/80"
                >
                  <div className="w-20 h-20 bg-stone-100 rounded overflow-hidden shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif-display text-sm font-semibold text-stone-900 truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedFinish.id)}
                          className="text-stone-400 hover:text-rose-600 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-stone-500 truncate mt-0.5">
                        Finish: {item.selectedFinish.name.split('/')[0]}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-200 rounded">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.selectedFinish.id, item.quantity - 1)
                          }
                          className="px-2 py-0.5 text-stone-600 hover:text-stone-900 text-xs font-mono"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-mono text-stone-900 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.selectedFinish.id, item.quantity + 1)
                          }
                          className="px-2 py-0.5 text-stone-600 hover:text-stone-900 text-xs font-mono"
                        >
                          +
                        </button>
                      </div>

                      <div className="font-mono text-xs font-semibold text-stone-900 tabular-nums">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-50/70 space-y-4">
              {/* Promo Code Input */}
              <div>
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2.5 rounded text-xs text-emerald-800">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-mono font-medium">{appliedPromo.code}</span>
                      <span>({appliedPromo.discountPct * 100}% off)</span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-stone-500 hover:text-stone-900 underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo (CAPSTONE20, FREESHIP)"
                      className="flex-1 bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none uppercase font-mono"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-medium rounded transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoFeedback && !appliedPromo && (
                  <p className="text-[11px] text-rose-600 mt-1">{promoFeedback.message}</p>
                )}
              </div>

              {/* Subtotal Breakdown */}
              <div className="space-y-1.5 text-xs font-mono border-t border-stone-200 pt-3">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{formatPrice(cartSubtotal)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span className="tabular-nums">-{formatPrice(cartDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Insured Freight</span>
                  <span className="tabular-nums">
                    {cartShipping === 0 ? 'Complimentary' : formatPrice(cartShipping)}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Estimated Tax (8%)</span>
                  <span className="tabular-nums">{formatPrice(cartTax)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-stone-950 pt-2 border-t border-stone-200">
                  <span>Total Amount</span>
                  <span className="tabular-nums">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              {/* Primary Checkout CTA */}
              <button
                onClick={handleCheckoutClick}
                className="w-full bg-stone-900 hover:bg-stone-800 text-stone-50 py-3.5 px-4 rounded font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
                <span>Encrypted 256-bit architectural escrow checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
