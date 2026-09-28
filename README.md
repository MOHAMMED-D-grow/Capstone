# Atelier Nordic — Architectural E-Commerce Capstone

A production-grade, high-performance E-Commerce Product Catalog and Architectural Living Web Application built as a Web Development Capstone Project.

## Core Pillars & Key Features

### 1. Modular Frontend Architecture
- **Component Hierarchy**: Segregated into dedicated domain modules (`Header`, `Hero`, `ProductCatalog`, `ProductCard`, `ProductDetail`, `CartDrawer`, `CheckoutView`, `OrderConfirmation`, `ProductCompare`, `WishlistView`, `QuickViewModal`, `ToastContainer`, `Footer`).
- **Typed Global State**: Centralized `ShopContext` providing reactive management for shopping cart items, wishlist storage, product comparison matrix, promo code calculations, currency conversion rates, and toast messaging.
- **Persistent Data**: Cart and wishlist selections persist in `localStorage` across page reloads.

### 2. Client-Side Routing
- **Zero-Latency Navigation**: Implements an instantaneous hash-synchronized routing engine (`#/catalog`, `#/product/:id`, `#/checkout`, `#/compare`, `#/wishlist`, `#/order/:id`).
- **Deep Linking Support**: Direct access to specific product views and order receipts without requiring server round-trips.

### 3. Asset & Performance Optimization
- **Core Web Vitals Adherence**:
  - Sub-second Largest Contentful Paint (LCP < 0.9s) via prioritized hero asset preloading.
  - Zero Cumulative Layout Shift (CLS < 0.01) utilizing strict CSS aspect-ratio containment.
  - Smooth interaction responsiveness (INP < 15ms).
- **Zero-Broken-Image Policy**: Built-in CSS/SVG fallback containers with asynchronous `onError` handlers.
- **Tree-Shaking & Minification**: Compact production bundle optimized through Vite and Esbuild.

### 4. Interactive E-Commerce Experience
- **Faceted Catalog Filters**: Live search, category segmented controls, price slider, and in-stock toggle.
- **Contiguous Purchase Module (PDP)**: High-resolution gallery, variant finish switchers, dimensional specifications, and verified collector review submissions.
- **Slide-Over Bag & Checkout**: Real-time tax computation, shipping threshold progress bar, coupon redemption (`CAPSTONE20`, `FREESHIP`), multi-step checkout with celebratory particle animation, and printable archival receipts.
- **Comparative Matrix**: Side-by-side technical evaluation of up to 4 objects.

## Live Deployment

The application is deployed live with a public URL:
- **Production URL**: `https://ais-pre-hd3lg6ul6crcdm57f4jucn-812035538985.asia-southeast1.run.app`

### Deploying to Modern Platforms

Configuration files for leading cloud platforms are pre-bundled in the repository:
- **Vercel**: Pre-configured `vercel.json` with SPA rewrites and immutable cache headers.
- **Netlify**: Pre-configured `netlify.toml` with publish rules and redirect handling.
- **Render**: Pre-configured `render.yaml` static site specification.

#### Local Development
```bash
npm install
npm run dev
```

#### Production Build
```bash
npm run build
npm run preview
```
