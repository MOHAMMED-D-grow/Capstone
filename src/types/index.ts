export type Category = 'all' | 'furniture' | 'lighting' | 'ceramics' | 'timepieces' | 'objects';

export interface ProductVariant {
  id: string;
  name: string;
  colorHex: string;
  inStock: boolean;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  subtitle: string;
  category: Category;
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  description: string;
  longDescription: string;
  image: string;
  gallery: string[];
  dimensions: {
    height: string;
    width: string;
    depth: string;
    weight: string;
  };
  materials: string[];
  finishes: ProductVariant[];
  provenance: string;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isLimitedRun?: boolean;
  reviews: ProductReview[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedFinish: ProductVariant;
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  rate: number; // relative to USD
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  shippingMethod: 'standard' | 'white-glove' | 'express';
  paymentMethod: 'card' | 'apple-pay' | 'cod';
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  trackingNumber: string;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
}

export type RouteType = 'catalog' | 'product' | 'checkout' | 'compare' | 'wishlist' | 'order-confirmation';

export interface ActiveRoute {
  view: RouteType;
  productId?: string;
  orderId?: string;
}
