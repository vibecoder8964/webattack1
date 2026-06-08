'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Package, Star, Tag, ChevronRight, MessageCircle, TrendingUp, ArrowRight } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image: string | null;
  stock: number;
}

interface Review {
  id: number;
  productId: number;
  userId: number;
  username: string;
  rating: number;
  title: string;
  content: string;
  verified: boolean;
  createdAt: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [stockResult, setStockResult] = useState<string>('');
  const [stockLoading, setStockLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const hasFetchedRef = useRef<string>('');

  const categories = ['All', 'Electronics', 'Clothing', 'Food', 'Sports', 'Home', 'Accessories', 'Books', 'Gaming', 'Beauty', 'Toys', 'Garden', 'Automotive'];

  useEffect(() => {
    const currentCat = category || 'All';
    if (hasFetchedRef.current === currentCat) return;
    hasFetchedRef.current = currentCat;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = category && category !== 'All'
          ? `/api/products?category=${encodeURIComponent(category)}`
          : '/api/products';
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (e) {
        console.error('Failed to fetch products', e);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [category]);

  useEffect(() => {
    // Fetch recent reviews
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews?productId=1');
        const data = await res.json();
        setRecentReviews((data.reviews || []).slice(0, 4));
      } catch (_e) {
        // failed
      }
    };
    fetchReviews();

    // Set trending products from all products
    const fetchTrending = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        const prods = data.products || [];
        // Pick some trending items
        const trending = prods.filter((p: Product) =>
          [1, 4, 11, 19, 26, 6].includes(p.id)
        );
        setTrendingProducts(trending);
      } catch (_e) {
        // failed
      }
    };
    fetchTrending();
  }, []);

  const checkStock = async (productId: number) => {
    setStockLoading(true);
    setSelectedProduct(productId);
    setStockResult('');
    try {
      const res = await fetch('/api/stockCheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stockApi: `http://stock.shopzone.internal:8080/product/stock/check?productId=${productId}&storeId=1`
        }),
      });
      const data = await res.json();
      if (data.body) {
        setStockResult(data.body);
      } else if (data.error) {
        setStockResult(`Error: ${data.error}`);
      }
    } catch (e) {
      setStockResult('Failed to check stock');
    }
    setStockLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to ShopZone</h1>
            <p className="text-lg md:text-xl text-emerald-100 mb-8 max-w-2xl">
              Discover amazing deals on electronics, fashion, food, and more. Free shipping on orders over $50!
            </p>
            <div className="flex gap-4">
              <Link href="#products" className="bg-white text-emerald-700 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors">
                Shop Now
              </Link>
              <Link href="/chat" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Live Support
              </Link>
            </div>
          </div>
        </section>

        {/* Trending Products */}
        {trendingProducts.length > 0 && (
          <section className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
                    <p className="text-sm text-gray-500">Most popular items this week</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {trendingProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="flex-shrink-0 w-48 bg-gray-50 rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="h-24 bg-white rounded-lg flex items-center justify-center mb-3">
                      <img
                        src={`/api/loadImage?filename=${product.image || 'placeholder.png'}`}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <p className="font-medium text-gray-900 text-sm truncate">{product.name}</p>
                    <p className="text-emerald-600 font-bold mt-1">${product.price.toFixed(2)}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Category Filter */}
        <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat === 'All' ? '' : cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  (cat === 'All' && !category) || cat === category
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Product Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-xl h-72 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {/* Product Image */}
                  <div className="bg-gray-50 h-48 flex items-center justify-center relative">
                    <img
                      src={`/api/loadImage?filename=${product.image || 'placeholder.png'}`}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <span className="absolute top-2 right-2 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                      {product.category}
                    </span>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-emerald-600">${product.price.toFixed(2)}</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {products.length === 0 && !loading && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No products found in this category.</p>
            </div>
          )}
        </section>

        {/* Staff Picks Section */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Staff Picks</h2>
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                <span>Curated by Mike W.</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Star className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Top Rated</p>
                    <p className="text-xs text-gray-500">Wireless Headphones</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  &ldquo;Best noise-cancelling headphones I&apos;ve ever tested. 30-hour battery is a game changer!&rdquo;
                </p>
                <p className="text-xs text-gray-400 mt-2">- Mike Wazowski, Staff</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <Tag className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Best Value</p>
                    <p className="text-xs text-gray-500">Organic Coffee Beans</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  &ldquo;Fair-trade and delicious. At $24.99 for 1kg, you can&apos;t go wrong with this one.&rdquo;
                </p>
                <p className="text-xs text-gray-400 mt-2">- Sarah Connor, Customer</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">New Arrival</p>
                    <p className="text-xs text-gray-500">Smart Watch</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  &ldquo;The GPS tracking is incredibly accurate. Perfect for runners and fitness enthusiasts.&rdquo;
                </p>
                <p className="text-xs text-gray-400 mt-2">- Mike Wazowski, Staff</p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Reviews Section */}
        {recentReviews.length > 0 && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Recent Reviews</h2>
                <Link href="/product/1" className="text-sm text-emerald-600 font-medium flex items-center gap-1 hover:text-emerald-700">
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentReviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'text-amber-400 fill-current' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <p className="font-medium text-gray-900 text-sm mb-1">{review.title}</p>
                    <p className="text-xs text-gray-600 line-clamp-3">{review.content}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-400">by {review.username}</span>
                      {review.verified && (
                        <span className="text-xs text-emerald-600">Verified</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Support CTA */}
        <section className="bg-emerald-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Need Help?</h2>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">Our support team is available to help with any questions about products, orders, or your account.</p>
            <div className="flex gap-4 justify-center">
              <Link href="/chat" className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Chat with Support
              </Link>
              <Link href="/orders" className="border border-emerald-600 text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-100 transition-colors flex items-center gap-2">
                <Package className="h-4 w-4" />
                Track Orders
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Chat Button */}
      <Link
        href="/chat"
        className="fixed bottom-6 right-6 bg-emerald-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-700 transition-colors z-50"
        title="Chat with Support"
      >
        <MessageCircle className="h-6 w-6" />
      </Link>

      <Footer />
    </div>
  );
}
