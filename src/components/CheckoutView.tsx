import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import confetti from 'canvas-confetti';
import { ShieldCheck, Truck, CreditCard, Lock, ArrowLeft, ArrowRight, Check, MapPin, User, Package } from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartShipping,
    cartDiscount,
    cartTax,
    cartTotal,
    formatPrice,
    placeOrder,
    navigate,
    showToast,
  } = useShop();

  // Multi-step state: 1 (Customer), 2 (Shipping & Freight), 3 (Payment)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: 'Astrid Lindgren',
    email: 'astrid.architect@nordicdesign.se',
    phone: '+46 8 123 4567',
    address: 'Sveavägen 44, Floor 5',
    city: 'Stockholm',
    postalCode: '111 34',
    country: 'Sweden',
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'white-glove' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple-pay' | 'cod'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('382');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center">
        <h2 className="font-serif-display text-3xl font-medium text-stone-900 mb-3">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-sm text-stone-600 mb-6">
          Add architectural objects from the catalog before proceeding to checkout.
        </p>
        <button
          onClick={() => navigate('catalog')}
          className="px-6 py-3 bg-stone-900 text-stone-50 text-xs font-medium rounded hover:bg-stone-800 transition-colors cursor-pointer"
        >
          Return to Catalog Index
        </button>
      </div>
    );
  }

  // Validate Step 1
  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!shippingAddress.fullName.trim()) newErrors.fullName = 'Full Name is required.';
    if (!shippingAddress.email.trim() || !shippingAddress.email.includes('@')) {
      newErrors.email = 'Valid email address is required.';
    }
    if (!shippingAddress.phone.trim()) newErrors.phone = 'Phone number is required for courier.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please complete required customer details.');
      return;
    }
    setErrors({});
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Validate Step 2
  const handleProceedToStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!shippingAddress.address.trim()) newErrors.address = 'Street address is required.';
    if (!shippingAddress.city.trim()) newErrors.city = 'City is required.';
    if (!shippingAddress.postalCode.trim()) newErrors.postalCode = 'Postal code is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please complete delivery destination fields.');
      return;
    }
    setErrors({});
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Final Order Submission
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#1c1917', '#78716c', '#d4af37', '#e7e5e4'],
        });
      } catch (err) {
        console.log(err);
      }

      placeOrder(shippingAddress, shippingMethod, paymentMethod);
      setIsSubmitting(false);
    }, 1100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate('catalog')}
        className="inline-flex items-center gap-2 text-xs font-medium text-stone-600 hover:text-stone-950 mb-8 cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span>Return to Catalog Index</span>
      </button>

      {/* Step Progress Bar */}
      <div className="mb-10 max-w-3xl">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-stone-200 -translate-y-1/2 z-0" />
          
          {/* Step 1 Indicator */}
          <div className="relative z-10 flex flex-col items-center">
            <button
              onClick={() => setCurrentStep(1)}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-mono font-medium transition-colors ${
                currentStep >= 1 ? 'bg-stone-900 text-stone-50' : 'bg-stone-200 text-stone-600'
              }`}
            >
              {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
            </button>
            <span className="text-[11px] font-medium text-stone-800 mt-1.5 whitespace-nowrap">
              Customer Details
            </span>
          </div>

          {/* Step 2 Indicator */}
          <div className="relative z-10 flex flex-col items-center">
            <button
              onClick={() => {
                if (shippingAddress.fullName && shippingAddress.email) setCurrentStep(2);
              }}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-mono font-medium transition-colors ${
                currentStep >= 2 ? 'bg-stone-900 text-stone-50' : 'bg-stone-200 text-stone-600'
              }`}
            >
              {currentStep > 2 ? <Check className="w-4 h-4" /> : '2'}
            </button>
            <span className="text-[11px] font-medium text-stone-800 mt-1.5 whitespace-nowrap">
              Shipping & Freight
            </span>
          </div>

          {/* Step 3 Indicator */}
          <div className="relative z-10 flex flex-col items-center">
            <button
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-mono font-medium transition-colors ${
                currentStep === 3 ? 'bg-stone-900 text-stone-50' : 'bg-stone-200 text-stone-600'
              }`}
            >
              3
            </button>
            <span className="text-[11px] font-medium text-stone-800 mt-1.5 whitespace-nowrap">
              Payment Protocol
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Multi-Step Forms */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: Customer Information */}
          {currentStep === 1 && (
            <form onSubmit={handleProceedToStep2} className="bg-[#FAF9F5] border border-stone-200/90 rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center gap-2 pb-4 border-b border-stone-200">
                <User className="w-4 h-4 text-stone-600" />
                <h2 className="font-serif-display text-2xl font-medium text-stone-900">
                  Step 1: Customer Information
                </h2>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Full Legal Name / Architectural Practice *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    placeholder="e.g. Astrid Lindgren Studio"
                    className="w-full bg-white border border-stone-300 rounded px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-stone-600 text-xs"
                  />
                  {errors.fullName && <p className="text-rose-600 text-[11px] mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Email Address (Dispatch invoice & tracking notifications) *
                  </label>
                  <input
                    type="email"
                    value={shippingAddress.email}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                    placeholder="astrid@studio.se"
                    className="w-full bg-white border border-stone-300 rounded px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-stone-600 text-xs"
                  />
                  {errors.email && <p className="text-rose-600 text-[11px] mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Mobile Phone (Direct courier scheduling & SMS verification) *
                  </label>
                  <input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    placeholder="+46 8 123 4567"
                    className="w-full bg-white border border-stone-300 rounded px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-stone-600 text-xs"
                  />
                  {errors.phone && <p className="text-rose-600 text-[11px] mt-1">{errors.phone}</p>}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-stone-900 text-stone-50 text-xs font-medium rounded hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Continue to Shipping & Freight</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: Shipping Destination & Freight Tier */}
          {currentStep === 2 && (
            <form onSubmit={handleProceedToStep3} className="bg-[#FAF9F5] border border-stone-200/90 rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center gap-2 pb-4 border-b border-stone-200">
                <MapPin className="w-4 h-4 text-stone-600" />
                <h2 className="font-serif-display text-2xl font-medium text-stone-900">
                  Step 2: Shipping & Freight Destination
                </h2>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Street Address *</label>
                  <input
                    type="text"
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                    placeholder="Sveavägen 44, Floor 5"
                    className="w-full bg-white border border-stone-300 rounded px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-stone-600"
                  />
                  {errors.address && <p className="text-rose-600 text-[11px] mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">City *</label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      placeholder="Stockholm"
                      className="w-full bg-white border border-stone-300 rounded px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-stone-600"
                    />
                    {errors.city && <p className="text-rose-600 text-[11px] mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Postal Code *</label>
                    <input
                      type="text"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      placeholder="111 34"
                      className="w-full bg-white border border-stone-300 rounded px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-stone-600"
                    />
                    {errors.postalCode && <p className="text-rose-600 text-[11px] mt-1">{errors.postalCode}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Country</label>
                  <select
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-stone-600"
                  >
                    <option value="Sweden">Sweden</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Norway">Norway</option>
                    <option value="Germany">Germany</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Japan">Japan</option>
                    <option value="Italy">Italy</option>
                  </select>
                </div>

                {/* Freight Method Selection */}
                <div className="pt-3">
                  <label className="block text-stone-700 font-medium mb-2">Select Freight Tier</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div
                      onClick={() => setShippingMethod('standard')}
                      className={`p-3.5 rounded border cursor-pointer transition-colors ${
                        shippingMethod === 'standard' ? 'border-stone-900 bg-stone-100 font-medium' : 'border-stone-200 bg-white'
                      }`}
                    >
                      <div className="font-semibold text-stone-900">Standard Freight</div>
                      <div className="text-stone-500 text-[11px] mt-0.5">3-5 business days</div>
                      <div className="font-mono text-stone-800 text-xs mt-2">
                        {cartShipping === 0 ? 'Complimentary' : formatPrice(cartShipping)}
                      </div>
                    </div>

                    <div
                      onClick={() => setShippingMethod('white-glove')}
                      className={`p-3.5 rounded border cursor-pointer transition-colors ${
                        shippingMethod === 'white-glove' ? 'border-stone-900 bg-stone-100 font-medium' : 'border-stone-200 bg-white'
                      }`}
                    >
                      <div className="font-semibold text-stone-900">White-Glove Service</div>
                      <div className="text-stone-500 text-[11px] mt-0.5">Room uncrating & debris removal</div>
                      <div className="font-mono text-stone-800 text-xs mt-2">+ {formatPrice(120)}</div>
                    </div>

                    <div
                      onClick={() => setShippingMethod('express')}
                      className={`p-3.5 rounded border cursor-pointer transition-colors ${
                        shippingMethod === 'express' ? 'border-stone-900 bg-stone-100 font-medium' : 'border-stone-200 bg-white'
                      }`}
                    >
                      <div className="font-semibold text-stone-900">Express Priority Air</div>
                      <div className="text-stone-500 text-[11px] mt-0.5">48-hour dispatched flight</div>
                      <div className="font-mono text-stone-800 text-xs mt-2">+ {formatPrice(180)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-3 border border-stone-300 rounded text-xs font-medium text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-stone-900 text-stone-50 text-xs font-medium rounded hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Continue to Payment Protocol</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Payment & Escrow Review */}
          {currentStep === 3 && (
            <form onSubmit={handleSubmitOrder} className="bg-[#FAF9F5] border border-stone-200/90 rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center gap-2 pb-4 border-b border-stone-200">
                <Lock className="w-4 h-4 text-stone-600" />
                <h2 className="font-serif-display text-2xl font-medium text-stone-900">
                  Step 3: Payment & Order Confirmation
                </h2>
              </div>

              {/* Order recipient preview */}
              <div className="p-3.5 bg-stone-100 rounded border border-stone-200 text-xs flex justify-between items-center">
                <div>
                  <div className="font-medium text-stone-900">{shippingAddress.fullName} · {shippingAddress.city}, {shippingAddress.country}</div>
                  <div className="text-stone-500 text-[11px] mt-0.5">{shippingAddress.address} ({shippingMethod} freight)</div>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-stone-600 hover:text-stone-900 underline text-xs cursor-pointer"
                >
                  Edit
                </button>
              </div>

              {/* Payment selector tabs */}
              <div className="space-y-3">
                <label className="block text-stone-700 font-medium text-xs">Payment Method</label>
                <div className="flex gap-2 p-1 bg-stone-200/70 rounded">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 py-2 text-xs font-medium rounded transition-colors cursor-pointer ${
                      paymentMethod === 'card' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600'
                    }`}
                  >
                    Credit / Debit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple-pay')}
                    className={`flex-1 py-2 text-xs font-medium rounded transition-colors cursor-pointer ${
                      paymentMethod === 'apple-pay' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600'
                    }`}
                  >
                    Apple Pay / G-Pay
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex-1 py-2 text-xs font-medium rounded transition-colors cursor-pointer ${
                      paymentMethod === 'cod' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600'
                    }`}
                  >
                    Cash on Delivery
                  </button>
                </div>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded px-3.5 py-2.5 text-stone-900 font-mono text-xs focus:outline-none focus:border-stone-600"
                      />
                      <CreditCard className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-700 font-medium mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded px-3.5 py-2.5 text-stone-900 font-mono text-xs focus:outline-none focus:border-stone-600"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-medium mb-1">Security CVC</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded px-3.5 py-2.5 text-stone-900 font-mono text-xs focus:outline-none focus:border-stone-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 space-y-1">
                  <div className="font-semibold">Cash on Delivery Verification</div>
                  <p>
                    Pay upon physical inspection and crate unsealing. Our logistics desk will confirm delivery appointment with {shippingAddress.phone}.
                  </p>
                </div>
              )}

              {paymentMethod === 'apple-pay' && (
                <div className="p-5 bg-stone-100 rounded text-center text-xs text-stone-700">
                  Ready to authorize simulated payment of {formatPrice(cartTotal)} using biometric authentication.
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-3 border border-stone-300 rounded text-xs font-medium text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-4 px-6 bg-stone-900 hover:bg-stone-800 text-stone-50 font-medium text-xs rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Authenticating Escrow Order...'
                      : `Confirm & Authorize Order · ${formatPrice(cartTotal)}`}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 bg-[#FAF9F5] border border-stone-200/90 rounded-lg p-6 lg:sticky lg:top-28 space-y-6 shadow-xs">
          <h3 className="font-serif-display text-xl font-medium text-stone-900 pb-3 border-b border-stone-200">
            Order Inventory Summary
          </h3>

          <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedFinish.id}`}
                className="flex items-center gap-3.5 text-xs"
              >
                <div className="w-14 h-14 bg-stone-100 rounded overflow-hidden shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-stone-900 truncate">{item.product.name}</div>
                  <div className="text-stone-500 text-[11px] truncate">
                    {item.selectedFinish.name.split('/')[0]} · Qty {item.quantity}
                  </div>
                </div>
                <div className="font-mono font-semibold text-stone-900 tabular-nums">
                  {formatPrice(item.product.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-stone-200 pt-4 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-stone-600">
              <span>Item Subtotal</span>
              <span className="tabular-nums">{formatPrice(cartSubtotal)}</span>
            </div>
            {cartDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Promotional Deduction</span>
                <span className="tabular-nums">-{formatPrice(cartDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>Freight Handling</span>
              <span className="tabular-nums">
                {cartShipping === 0 ? 'Complimentary' : formatPrice(cartShipping)}
              </span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Estimated Tax (8%)</span>
              <span className="tabular-nums">{formatPrice(cartTax)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-stone-950 pt-2 border-t border-stone-200">
              <span>Final Total</span>
              <span className="tabular-nums">{formatPrice(cartTotal)}</span>
            </div>
          </div>

          <div className="p-3.5 bg-stone-100 rounded border border-stone-200 text-[11px] text-stone-600 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-stone-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Continental Transit Guarantee</span>
            </div>
            <p>
              Every shipment is encased in timber-reinforced crates with integrated shock indicators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
