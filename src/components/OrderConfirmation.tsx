import React from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle2, PackageCheck, Printer, ArrowRight, Truck, MapPin } from 'lucide-react';

export const OrderConfirmation: React.FC = () => {
  const { currentRoute, getOrderById, lastOrder, formatPrice, navigate } = useShop();

  const activeOrder = (currentRoute.orderId ? getOrderById(currentRoute.orderId) : null) || lastOrder;

  if (!activeOrder) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center">
        <h2 className="font-serif-display text-3xl font-medium text-stone-900 mb-3">
          No Order Found
        </h2>
        <p className="text-xs text-stone-600 mb-6">
          The requested order receipt could not be located in your local session archive.
        </p>
        <button
          onClick={() => navigate('catalog')}
          className="px-6 py-2.5 bg-stone-900 text-stone-50 text-xs font-medium rounded hover:bg-stone-800 transition-colors cursor-pointer"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Success Banner */}
      <div className="bg-[#FAF9F5] border border-stone-200/90 rounded-xl p-8 sm:p-10 text-center space-y-4 mb-8">
        <div className="w-16 h-16 bg-stone-900 text-stone-50 rounded-full flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-8 h-8 text-stone-50" />
        </div>

        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-stone-500">
            Order Confirmation & Archival Receipt
          </span>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-medium text-stone-900 mt-1">
            Order #{activeOrder.id} Confirmed
          </h1>
          <p className="text-stone-600 text-sm max-w-lg mx-auto mt-2">
            Preparing white-glove crate transit for your architectural selection. An invoice and confirmation have been dispatched to{' '}
            <strong className="text-stone-900">{activeOrder.shippingAddress.email}</strong>.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 rounded-md border border-stone-300 text-xs font-mono text-stone-800">
          <Truck className="w-4 h-4 text-stone-600" />
          <span>Tracking Reference: {activeOrder.trackingNumber}</span>
        </div>
      </div>

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-xs">
        {/* Shipping Destination */}
        <div className="p-6 bg-white border border-stone-200 rounded-lg space-y-2">
          <div className="flex items-center gap-1.5 font-semibold text-stone-900 text-sm">
            <MapPin className="w-4 h-4 text-stone-600" />
            <span>Delivery Destination</span>
          </div>
          <div className="text-stone-800 font-medium">{activeOrder.shippingAddress.fullName}</div>
          <div className="text-stone-600 leading-relaxed">
            {activeOrder.shippingAddress.address}<br />
            {activeOrder.shippingAddress.postalCode} {activeOrder.shippingAddress.city}<br />
            {activeOrder.shippingAddress.country}
          </div>
          <div className="text-stone-500 pt-2 font-mono">
            Phone: {activeOrder.shippingAddress.phone}
          </div>
        </div>

        {/* Shipping Method & Payment */}
        <div className="p-6 bg-white border border-stone-200 rounded-lg space-y-2">
          <div className="flex items-center gap-1.5 font-semibold text-stone-900 text-sm">
            <PackageCheck className="w-4 h-4 text-stone-600" />
            <span>Fulfillment Protocol</span>
          </div>
          <div className="flex justify-between py-1 border-b border-stone-100">
            <span className="text-stone-500">Method</span>
            <span className="font-semibold text-stone-900 capitalize">{activeOrder.shippingMethod}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-stone-100">
            <span className="text-stone-500">Payment</span>
            <span className="font-semibold text-stone-900 capitalize">{activeOrder.paymentMethod}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-stone-500">Status</span>
            <span className="text-emerald-700 font-mono font-medium">Preparing Shipment</span>
          </div>
        </div>
      </div>

      {/* Itemized Receipt Table */}
      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden mb-8">
        <div className="p-6 border-b border-stone-200 flex justify-between items-center">
          <h3 className="font-serif-display text-xl font-medium text-stone-900">
            Archival Receipt Breakdown
          </h3>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-stone-300 rounded text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>

        <div className="divide-y divide-stone-100 p-6">
          {activeOrder.items.map((item) => (
            <div key={`${item.product.id}-${item.selectedFinish.id}`} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-stone-100 rounded overflow-hidden">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-stone-900">{item.product.name}</div>
                  <div className="text-stone-500 text-[11px]">
                    {item.selectedFinish.name.split('/')[0]} · Qty {item.quantity}
                  </div>
                </div>
              </div>
              <div className="font-mono font-semibold text-stone-900 tabular-nums">
                {formatPrice(item.product.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-stone-50/80 p-6 border-t border-stone-200 space-y-1.5 text-xs font-mono">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal</span>
            <span>{formatPrice(activeOrder.subtotal)}</span>
          </div>
          {activeOrder.discount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Applied Discount</span>
              <span>-{formatPrice(activeOrder.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-stone-600">
            <span>Freight Handling</span>
            <span>{activeOrder.shipping === 0 ? 'Complimentary' : formatPrice(activeOrder.shipping)}</span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>Tax (8%)</span>
            <span>{formatPrice(activeOrder.tax)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-stone-950 pt-3 border-t border-stone-200">
            <span>Amount Settled</span>
            <span>{formatPrice(activeOrder.total)}</span>
          </div>
        </div>
      </div>

      {/* Continue Action */}
      <div className="flex justify-center">
        <button
          onClick={() => navigate('catalog')}
          className="px-8 py-3.5 bg-stone-900 text-stone-50 font-medium text-xs rounded hover:bg-stone-800 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <span>Continue Architectural Exploration</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
