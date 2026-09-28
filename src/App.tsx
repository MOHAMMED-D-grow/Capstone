import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { PRODUCTS } from './data/products';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetail } from './components/ProductDetail';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { OrderConfirmation } from './components/OrderConfirmation';
import { ProductCompare } from './components/ProductCompare';
import { WishlistView } from './components/WishlistView';
import { QuickViewModal } from './components/QuickViewModal';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { currentRoute, navigate } = useShop();

  // Find product for PDP if route is product
  const activeProduct = currentRoute.productId
    ? PRODUCTS.find((p) => p.id === currentRoute.productId)
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-stone-900 selection:bg-stone-900 selection:text-white">
      {/* Top Bar Contract Navigation */}
      <Header />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {currentRoute.view === 'catalog' && (
          <>
            <Hero />
            <ProductCatalog />
          </>
        )}

        {currentRoute.view === 'product' && (
          <>
            {activeProduct ? (
              <ProductDetail product={activeProduct} />
            ) : (
              <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-4">
                <h2 className="font-serif-display text-3xl font-medium text-stone-900">
                  Object Not Found
                </h2>
                <p className="text-xs text-stone-600">
                  The requested architectural object could not be found in our archive index.
                </p>
                <button
                  onClick={() => navigate('catalog')}
                  className="px-5 py-2.5 bg-stone-900 text-stone-50 text-xs font-medium rounded hover:bg-stone-800 transition-colors"
                >
                  Return to Catalog
                </button>
              </div>
            )}
          </>
        )}

        {currentRoute.view === 'checkout' && <CheckoutView />}

        {currentRoute.view === 'order-confirmation' && <OrderConfirmation />}

        {currentRoute.view === 'compare' && <ProductCompare />}

        {currentRoute.view === 'wishlist' && <WishlistView />}
      </main>

      {/* Slide-over cart drawer */}
      <CartDrawer />

      {/* Quick view modal */}
      <QuickViewModal />

      {/* Feedback toasts */}
      <ToastContainer />

      {/* Editorial footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
