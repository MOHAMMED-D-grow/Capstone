import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product, ProductVariant, CartItem, Order, Category, Currency, ActiveRoute, RouteType } from '../types';
import { PRODUCTS, CURRENCIES } from '../data/products';

interface Toast {
  id: string;
  message: string;
  type?: 'info' | 'success';
}

interface ShopContextType {
  // Routing
  currentRoute: ActiveRoute;
  navigate: (view: RouteType, params?: { productId?: string; orderId?: string }) => void;

  // Catalog filtering & searching
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';
  setSortBy: (sort: 'featured' | 'price-asc' | 'price-desc' | 'rating') => void;

  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  cartShipping: number;
  cartDiscount: number;
  cartTax: number;
  cartTotal: number;
  freeShippingThreshold: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (product: Product, finish?: ProductVariant, quantity?: number) => void;
  updateQuantity: (productId: string, finishId: string, quantity: number) => void;
  removeFromCart: (productId: string, finishId: string) => void;
  clearCart: () => void;
  appliedPromo: { code: string; discountPct: number } | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;

  // Wishlist
  wishlist: string[];
  wishlistCount: number;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Compare
  compareList: string[];
  addToCompare: (productId: string) => boolean;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;

  // Currency
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (usdAmount: number) => string;

  // Quick View
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Orders
  orders: Order[];
  lastOrder: Order | null;
  getOrderById: (orderId: string) => Order | undefined;
  placeOrder: (shippingAddress: Order['shippingAddress'], shippingMethod: Order['shippingMethod'], paymentMethod: Order['paymentMethod']) => Order;

  // Notifications
  toasts: Toast[];
  showToast: (message: string, type?: 'info' | 'success') => void;
  dismissToast: (id: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const parseHash = (): ActiveRoute => {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (!hash || hash === 'catalog') {
    return { view: 'catalog' };
  }
  if (hash.startsWith('product/')) {
    const productId = hash.replace('product/', '');
    return { view: 'product', productId };
  }
  if (hash.startsWith('order/')) {
    const orderId = hash.replace('order/', '');
    return { view: 'order-confirmation', orderId };
  }
  if (['checkout', 'compare', 'wishlist'].includes(hash)) {
    return { view: hash as RouteType };
  }
  return { view: 'catalog' };
};

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentRoute, setCurrentRoute] = useState<ActiveRoute>(parseHash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(parseHash());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback((view: RouteType, params?: { productId?: string; orderId?: string }) => {
    let newHash = '#/';
    if (view === 'catalog') newHash = '#/catalog';
    else if (view === 'product' && params?.productId) newHash = `#/product/${params.productId}`;
    else if (view === 'order-confirmation' && params?.orderId) newHash = `#/order/${params.orderId}`;
    else newHash = `#/${view}`;

    window.location.hash = newHash;
    setCurrentRoute({ view, ...params });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPct: number } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('atelier_cart_items', JSON.stringify(cart));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [cart]);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_wishlist_ids');
      return saved ? JSON.parse(saved) : ['lounge-chair-oslo'];
    } catch {
      return ['lounge-chair-oslo'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('atelier_wishlist_ids', JSON.stringify(wishlist));
    } catch (e) {
      console.warn(e);
    }
  }, [wishlist]);

  // Compare
  const [compareList, setCompareList] = useState<string[]>([]);

  // Currency
  const [currency, setCurrency] = useState<Currency>('USD');

  // Quick View
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'info' | 'success' = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Cart operations
  const addToCart = useCallback((product: Product, finish?: ProductVariant, quantity = 1) => {
    const safeQty = Math.max(1, Math.floor(quantity));
    const selectedFinish = finish || product.finishes[0];
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedFinish.id === selectedFinish.id
      );
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += safeQty;
        return next;
      }
      return [...prev, { product, quantity: safeQty, selectedFinish }];
    });
    showToast(`Added ${safeQty > 1 ? `${safeQty}x ` : ''}${product.name} (${selectedFinish.name.split('/')[0]}) to bag.`, 'success');
  }, [showToast]);

  const removeFromCart = useCallback((productId: string, finishId: string) => {
    setCart((prev) => prev.filter((i) => !(i.product.id === productId && i.selectedFinish.id === finishId)));
    showToast('Removed item from bag.');
  }, [showToast]);

  const updateQuantity = useCallback((productId: string, finishId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, finishId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedFinish.id === finishId
          ? { ...item, quantity: Math.max(1, Math.floor(quantity)) }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    setAppliedPromo(null);
  }, []);

  const applyPromoCode = useCallback((code: string) => {
    const cleaned = code.trim().toUpperCase();
    if (cleaned === 'CAPSTONE20') {
      setAppliedPromo({ code: 'CAPSTONE20', discountPct: 0.20 });
      return { success: true, message: '20% Capstone Scholar discount applied!' };
    }
    if (cleaned === 'FREESHIP') {
      setAppliedPromo({ code: 'FREESHIP', discountPct: 0.05 });
      return { success: true, message: 'Complimentary freight coupon activated!' };
    }
    if (cleaned === 'ARCHITECT10') {
      setAppliedPromo({ code: 'ARCHITECT10', discountPct: 0.10 });
      return { success: true, message: '10% Studio Partner discount applied!' };
    }
    return { success: false, message: 'Invalid code. Try CAPSTONE20 or ARCHITECT10' };
  }, []);

  const removePromoCode = useCallback(() => {
    setAppliedPromo(null);
    showToast('Promo code removed.');
  }, [showToast]);

  // Wishlist operations
  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const targetProduct = PRODUCTS.find((p) => p.id === productId);
      const name = targetProduct ? targetProduct.name : 'Item';
      if (exists) {
        showToast(`Removed ${name} from saved objects.`);
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`Saved ${name} to your architectural wishlist.`, 'success');
        return [...prev, productId];
      }
    });
  }, [showToast]);

  const isInWishlist = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  // Compare operations
  const addToCompare = useCallback((productId: string) => {
    if (compareList.includes(productId)) return true;
    if (compareList.length >= 4) {
      showToast('Maximum 4 items can be compared side-by-side.');
      return false;
    }
    const item = PRODUCTS.find((p) => p.id === productId);
    setCompareList((prev) => [...prev, productId]);
    showToast(`Added ${item?.name || 'object'} to comparison matrix.`, 'info');
    return true;
  }, [compareList, showToast]);

  const removeFromCompare = useCallback((productId: string) => {
    setCompareList((prev) => prev.filter((id) => id !== productId));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareList([]);
  }, []);

  const isInCompare = useCallback((productId: string) => compareList.includes(productId), [compareList]);

  // Format price helper
  const formatPrice = useCallback((usdAmount: number) => {
    const cfg = CURRENCIES[currency];
    const converted = usdAmount * cfg.rate;
    if (currency === 'JPY') {
      return `${cfg.symbol}${Math.round(converted).toLocaleString('en-US')}`;
    }
    return `${cfg.symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }, [currency]);

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const freeShippingThreshold = 300;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold || appliedPromo?.code === 'FREESHIP';
  const cartShipping = cartSubtotal === 0 ? 0 : isFreeShipping ? 0 : 45;
  const cartDiscount = appliedPromo ? Math.round(cartSubtotal * appliedPromo.discountPct) : 0;
  const taxableAmount = Math.max(0, cartSubtotal - cartDiscount);
  const cartTax = Math.round(taxableAmount * 0.08); // 8% estimated VAT/Sales tax
  const cartTotal = Math.max(0, taxableAmount + cartShipping + cartTax);

  const getOrderById = useCallback(
    (orderId: string): Order | undefined => {
      return orders.find((o) => o.id === orderId);
    },
    [orders]
  );

  // Place Order
  const placeOrder = useCallback(
    (
      shippingAddress: Order['shippingAddress'],
      shippingMethod: Order['shippingMethod'],
      paymentMethod: Order['paymentMethod']
    ): Order => {
      const orderId = `AT-${Math.floor(100000 + Math.random() * 900000)}`;
      const trackingNumber = `SE-EXP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      const newOrder: Order = {
        id: orderId,
        date: new Date().toISOString(),
        items: [...cart],
        shippingAddress,
        shippingMethod,
        paymentMethod,
        subtotal: cartSubtotal,
        discount: cartDiscount,
        shipping: cartShipping,
        tax: cartTax,
        total: cartTotal,
        trackingNumber,
        status: 'confirmed',
      };

      setOrders((prev) => [newOrder, ...prev]);
      try {
        localStorage.setItem('atelier_orders', JSON.stringify([newOrder, ...orders]));
      } catch (e) {
        console.warn(e);
      }
      setLastOrder(newOrder);
      clearCart();
      navigate('order-confirmation', { orderId: newOrder.id });
      return newOrder;
    },
    [cart, cartSubtotal, cartDiscount, cartShipping, cartTax, cartTotal, orders, clearCart, navigate]
  );

  return (
    <ShopContext.Provider
      value={{
        currentRoute,
        navigate,
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
        cart,
        cartCount,
        cartSubtotal,
        cartShipping,
        cartDiscount,
        cartTax,
        cartTotal,
        freeShippingThreshold,
        cartOpen,
        setCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isInWishlist,
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        currency,
        setCurrency,
        formatPrice,
        quickViewProduct,
        setQuickViewProduct,
        orders,
        lastOrder,
        getOrderById,
        placeOrder,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
