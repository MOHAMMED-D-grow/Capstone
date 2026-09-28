import React, { useState } from 'react';
import { Product, ProductVariant } from '../types';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { Heart, ShoppingBag, ArrowLeft, Check, Shield, Truck, Star, Scale, MessageSquare, ArrowRight } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  isModal?: boolean;
  onClose?: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, isModal = false, onClose }) => {
  const {
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addToCompare,
    isInCompare,
    navigate,
    showToast,
  } = useShop();

  const [selectedFinish, setSelectedFinish] = useState<ProductVariant>(product.finishes[0]);
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'materials' | 'care' | 'reviews'>('specs');

  // Interactive review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [localReviews, setLocalReviews] = useState(product.reviews || []);

  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) {
      showToast('Please provide your name and remarks.');
      return;
    }
    const newRev = {
      id: `rev-${Date.now()}`,
      author: reviewName,
      rating: reviewRating,
      date: new Date().toISOString().split('T')[0],
      title: reviewTitle || 'Exceptional craftsmanship',
      comment: reviewComment,
      verified: true,
    };
    setLocalReviews([newRev, ...localReviews]);
    setReviewName('');
    setReviewTitle('');
    setReviewComment('');
    setShowReviewForm(false);
    showToast('Thank you. Your architectural review has been published.', 'success');
  };

  const handleAddToCart = () => {
    addToCart(product, selectedFinish, Math.max(1, quantity));
  };

  const handleBuyNow = () => {
    addToCart(product, selectedFinish, Math.max(1, quantity));
    if (onClose) onClose();
    navigate('checkout');
  };

  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id && (p.category === product.category || p.isFeatured)).slice(0, 3);

  return (
    <div className={`w-full ${isModal ? 'p-6 max-h-[90vh] overflow-y-auto' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'}`}>
      {/* Back button when on standalone PDP page */}
      {!isModal && (
        <button
          onClick={() => navigate('catalog')}
          className="inline-flex items-center gap-2 text-xs font-medium text-stone-600 hover:text-stone-950 mb-8 cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Catalog Index</span>
        </button>
      )}

      {/* Main Grid: Sticky Gallery (Left) & Contiguous Purchase Module (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Gallery Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
            <img
              src={selectedImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {product.isLimitedRun && (
              <div className="absolute top-4 left-4">
                <span className="text-xs font-mono tracking-wider uppercase bg-stone-900/85 text-stone-100 px-3 py-1 rounded backdrop-blur-xs">
                  Limited Architectural Run
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail Strip if multiple images */}
          {product.gallery.length > 1 && (
            <div className="flex gap-3">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded border-2 overflow-hidden cursor-pointer transition-all ${
                    selectedImage === img ? 'border-stone-900 opacity-100' : 'border-stone-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Preview ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Contiguous Purchase Module (Right) */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
          {/* Header & Meta */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
              <span className="uppercase tracking-widest">{product.categoryLabel}</span>
              <span className="font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="font-serif-display text-3xl sm:text-4xl font-medium text-stone-900">
              {product.name}
            </h1>

            <p className="text-sm text-stone-600 leading-relaxed">
              {product.subtitle}
            </p>
          </div>

          {/* Rating Summary (Unboxed clean text per section 1A) */}
          <div className="flex items-center gap-3 text-xs text-stone-500 pt-1 pb-2 border-b border-stone-200">
            <div className="flex items-center text-stone-900 font-medium gap-1">
              <Star className="w-4 h-4 fill-stone-900 text-stone-900" />
              <span className="font-mono tabular-nums">{product.rating}</span>
            </div>
            <span aria-hidden="true">·</span>
            <span>Based on {localReviews.length} architectural reviews</span>
            <span aria-hidden="true">·</span>
            <span className="text-stone-700 font-medium">{product.provenance}</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-3xl font-semibold text-stone-900 tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="font-mono text-lg text-stone-400 line-through tabular-nums">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="text-xs text-stone-500 ml-auto font-mono">
              VAT & Freight Included
            </span>
          </div>

          {/* Variant Selection (Finishes) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-stone-700">Material Finish:</span>
              <span className="text-stone-900 font-semibold">{selectedFinish.name}</span>
            </div>

            <div className="flex items-center gap-2">
              {product.finishes.map((variant) => {
                const isSelected = selectedFinish.id === variant.id;
                return (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedFinish(variant)}
                    title={variant.name}
                    className={`relative p-1 rounded-md border text-xs font-medium flex items-center gap-2 px-3 py-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-stone-900 bg-stone-100 text-stone-950 font-semibold'
                        : 'border-stone-200 text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-stone-400/50"
                      style={{ backgroundColor: variant.colorHex }}
                    />
                    <span className="truncate max-w-[120px]">{variant.name.split('/')[0]}</span>
                    {!variant.inStock && (
                      <span className="text-[10px] text-amber-700 font-normal">Backorder</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* In-Stock Indicator */}
            <div className="pt-1 text-xs font-mono">
              {selectedFinish.inStock && product.inStock ? (
                <div className="text-emerald-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse" />
                  <span>In Atelier — {product.stockCount} specimens available for immediate dispatch</span>
                </div>
              ) : (
                <div className="text-amber-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600 inline-block" />
                  <span>Made to Order — Individual commission crafted in 3-4 weeks</span>
                </div>
              )}
            </div>
          </div>

          {/* Quantity & Add to Cart & Buy Now Controls */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <span className="text-xs text-stone-600 font-medium">Quantity:</span>
              {/* Stepper */}
              <div className="flex items-center border border-stone-300 rounded-md bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-stone-600 hover:text-stone-950 text-sm font-mono cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-3 py-1.5 text-xs font-mono font-semibold text-stone-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-stone-600 hover:text-stone-950 text-sm font-mono cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 bg-stone-900 hover:bg-stone-800 text-stone-50 py-3.5 px-6 rounded-md font-medium text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-stone-300" />
                <span>Add to Shopping Bag</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="px-6 py-3.5 border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white rounded-md font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Buy Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Secondary actions: Wishlist & Compare */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`py-2 px-3 border rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  isWishlisted
                    ? 'border-rose-300 bg-rose-50/60 text-rose-700'
                    : 'border-stone-300 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                <span>{isWishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}</span>
              </button>

              <button
                onClick={() => addToCompare(product.id)}
                className={`py-2 px-3 border rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  isCompared
                    ? 'border-stone-900 bg-stone-900 text-white'
                    : 'border-stone-300 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>{isCompared ? 'In Compare List' : 'Compare Object'}</span>
              </button>
            </div>
          </div>

          {/* Atelier Trust Guarantee Badges */}
          <div className="pt-4 border-t border-stone-200 space-y-2.5 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-stone-500 shrink-0" />
              <span>Complimentary insured transit on orders over $300</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-stone-500 shrink-0" />
              <span>10-year structural warranty & authenticity certificate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Specification & Editorial Review Tabs */}
      <div className="mt-16 pt-10 border-t border-stone-200">
        <div className="flex items-center gap-6 border-b border-stone-200 pb-3 overflow-x-auto text-sm">
          <button
            onClick={() => setActiveTab('specs')}
            className={`font-medium py-1 transition-colors cursor-pointer ${
              activeTab === 'specs' ? 'text-stone-900 border-b-2 border-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Dimensions & Weight
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`font-medium py-1 transition-colors cursor-pointer ${
              activeTab === 'materials' ? 'text-stone-900 border-b-2 border-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Materials & Provenance
          </button>
          <button
            onClick={() => setActiveTab('care')}
            className={`font-medium py-1 transition-colors cursor-pointer ${
              activeTab === 'care' ? 'text-stone-900 border-b-2 border-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Architectural Care
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`font-medium py-1 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reviews' ? 'text-stone-900 border-b-2 border-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <span>Reviews</span>
            <span className="text-xs font-mono tabular-nums text-stone-400">({localReviews.length})</span>
          </button>
        </div>

        <div className="py-8">
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase text-stone-500">Metric & Imperial Dimensions</h4>
                <div className="border border-stone-200 rounded-md divide-y divide-stone-200 text-xs font-mono">
                  <div className="flex justify-between p-3">
                    <span className="text-stone-500">Height</span>
                    <span className="text-stone-900 font-medium">{product.dimensions.height}</span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-stone-500">Width</span>
                    <span className="text-stone-900 font-medium">{product.dimensions.width}</span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-stone-500">Depth</span>
                    <span className="text-stone-900 font-medium">{product.dimensions.depth}</span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-stone-500">Net Weight</span>
                    <span className="text-stone-900 font-medium">{product.dimensions.weight}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase text-stone-500">Installation Notes</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Arrives fully assembled in timber-reinforced crates. For overhead ceiling fixtures, mount strictly into load-bearing joists with included high-tensile hardware.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'materials' && (
            <div className="max-w-3xl space-y-4">
              <h4 className="text-xs font-mono uppercase text-stone-500">Sourced & Assembled Materiality</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700">
                {product.materials.map((mat, i) => (
                  <li key={i} className="flex items-center gap-2 p-2.5 bg-stone-100/70 rounded border border-stone-200">
                    <Check className="w-3.5 h-3.5 text-stone-900 shrink-0" />
                    <span>{mat}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 text-xs text-stone-600 leading-relaxed">
                <strong>Provenance Atelier:</strong> {product.provenance}. Sustainable chain of custody certified under PEFC and Nordic Swan ecolabels.
              </div>
            </div>
          )}

          {activeTab === 'care' && (
            <div className="max-w-2xl space-y-3 text-xs text-stone-600 leading-relaxed">
              <h4 className="text-xs font-mono uppercase text-stone-500">Preservation Instructions</h4>
              <p>
                Natural timber surfaces should be treated annually with cold-pressed natural linseed or organic beeswax oil. Avoid placing un-sealed stone items in direct contact with acidic liquids.
              </p>
              <p>
                For bouclé fabrics, use a soft bristle brush or low-suction upholstery vacuum attachment. Spot clean strictly with distilled water and mild wool soap.
              </p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif-display text-xl font-medium text-stone-900">
                    Architectural Collector Feedback
                  </h4>
                  <p className="text-xs text-stone-500">
                    Average rating: {product.rating} out of 5 stars
                  </p>
                </div>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-3.5 py-1.5 border border-stone-300 text-stone-800 text-xs font-medium rounded hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                </button>
              </div>

              {/* Review Submission Form */}
              {showReviewForm && (
                <form onSubmit={handleAddReview} className="bg-stone-100 p-4 rounded-lg border border-stone-300 space-y-3 text-xs">
                  <h5 className="font-semibold text-stone-900">Submit an architectural review</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-700 font-medium mb-1">Your Name / Practice</label>
                      <input
                        type="text"
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="e.g., Astrid Lind, Architect"
                        required
                        className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-medium mb-1">Rating</label>
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none"
                      >
                        <option value={5}>5 Stars - Flawless Craft</option>
                        <option value={4}>4 Stars - Highly Commended</option>
                        <option value={3}>3 Stars - Satisfactory</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Headline</label>
                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="e.g., Masterful tactile presence"
                      className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Detailed Remarks</label>
                    <textarea
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Describe material feel, joinery tolerance, and lighting behavior..."
                      required
                      className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 text-stone-50 font-medium rounded hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    Publish Verified Review
                  </button>
                </form>
              )}

              {/* Review Items */}
              <div className="space-y-4">
                {localReviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-stone-50 border border-stone-200/90 rounded-md space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-900">{rev.author}</span>
                      <span className="text-stone-400 font-mono">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-stone-900">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-stone-900 text-stone-900" />
                      ))}
                    </div>
                    <div className="text-xs font-semibold text-stone-900">{rev.title}</div>
                    <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Objects Section */}
      {!isModal && relatedProducts.length > 0 && (
        <div className="mt-16 pt-12 border-t border-stone-200">
          <div className="flex items-baseline justify-between mb-8">
            <h3 className="font-serif-display text-2xl font-medium text-stone-900">
              Harmonizing Architectural Objects
            </h3>
            <button
              onClick={() => navigate('catalog')}
              className="text-xs font-medium text-stone-600 hover:text-stone-950 underline"
            >
              View Full Archive
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigate('product', { productId: rel.id })}
                className="group border border-stone-200 rounded-lg p-4 bg-[#FAF9F5] hover:border-stone-400 transition-all cursor-pointer"
              >
                <div className="aspect-[4/3] bg-stone-100 rounded overflow-hidden mb-3">
                  <img
                    src={rel.image}
                    alt={rel.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="text-xs text-stone-500 uppercase tracking-wider">{rel.category}</div>
                <h4 className="font-serif-display text-base font-medium text-stone-900 group-hover:text-stone-700">
                  {rel.name}
                </h4>
                <div className="text-xs font-mono font-semibold text-stone-900 mt-1 tabular-nums">
                  {formatPrice(rel.price)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
