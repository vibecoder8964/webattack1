'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Package, Star, ArrowLeft, ShoppingCart, MessageCircle } from 'lucide-react';

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

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [stockResult, setStockResult] = useState<string>('');
  const [stockLoading, setStockLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          const found = data.product;
          if (found) {
            setProduct({
              id: found.id,
              name: found.name,
              description: found.description,
              price: found.price,
              category: found.category,
              image: found.image,
              stock: found.stock,
            });
            setRelatedProducts(data.relatedProducts || []);
          }
        }
      } catch (_e) {
        // failed
      }
      setLoading(false);
    };

    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews?productId=${id}`);
        const data = await res.json();
        setReviews(data.reviews || []);
      } catch (_e) {
        // failed
      }
    };

    if (id) {
      fetchProduct();
      fetchReviews();
    }
  }, [id]);

  const checkStock = async () => {
    if (!product) return;
    setStockLoading(true);
    setStockResult('');
    try {
      const res = await fetch('/api/stockCheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stockApi: `http://stock.shopzone.internal:8080/product/stock/check?productId=${product.id}&storeId=1`
        }),
      });
      const data = await res.json();
      if (data.body) {
        setStockResult(data.body);
      } else if (data.error) {
        // Show a friendly message instead of raw error details
        setStockResult('Unable to retrieve live stock information at this time. Please check back later or contact support.');
      }
    } catch (_e) {
      setStockResult('Unable to retrieve live stock information at this time. Please check back later or contact support.');
    }
    setStockLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
            <p className="text-gray-500 mb-6">This product doesn&apos;t exist.</p>
            <Link href="/" className="text-emerald-600 font-medium hover:text-emerald-700">
              Back to ShopZone
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-emerald-600 flex items-center gap-1 mb-6">
            <ArrowLeft className="h-3 w-3" /> Back to Products
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Product Image */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="h-96 flex items-center justify-center bg-gray-50">
                <img
                  src={`/api/loadImage?filename=${product.image || 'placeholder.jpg'}`}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                    const parent = img.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="flex flex-col items-center justify-center text-gray-400"><svg class="h-16 w-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><span class="text-sm">${product.name}</span></div>`;
                    }
                  }}
                />
              </div>
            </div>

            {/* Product Info */}
            <div>
              <span className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium mb-3">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-emerald-600">${product.price.toFixed(2)}</span>
                {avgRating && (
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">{avgRating}</span>
                    <span className="text-xs text-gray-400">({reviews.length} reviews)</span>
                  </div>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

              <div className="flex items-center gap-3 mb-4">
                <div className={`flex items-center gap-1.5 text-sm ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  <Package className="h-4 w-4" />
                  <span>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={checkStock}
                  disabled={stockLoading}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  <Package className="h-4 w-4" />
                  {stockLoading ? 'Checking...' : 'Check Stock'}
                </button>
                <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </button>
                <Link
                  href="/chat"
                  className="flex items-center gap-2 border border-emerald-600 text-emerald-600 px-6 py-3 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Ask Support
                </Link>
              </div>

              {stockResult && (
                <div className={`mt-4 p-3 rounded-lg text-sm border ${
                  stockResult.startsWith('Unable to')
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  <span className="font-medium">
                    {stockResult.startsWith('Unable to') ? '⚠ ' : '✓ '}
                  </span>
                  {stockResult}
                </div>
              )}
              {stockLoading && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-400 border border-gray-200">
                  Checking stock...
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Customer Reviews
              {avgRating && (
                <span className="ml-3 text-base font-normal text-gray-500">
                  {avgRating} out of 5 ({reviews.length} reviews)
                </span>
              )}
            </h2>

            {reviews.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <Star className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No reviews yet for this product.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? 'text-amber-400 fill-current' : 'text-gray-200'}`}
                            />
                          ))}
                        </div>
                        {review.verified && (
                          <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">Verified Purchase</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{review.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{review.content}</p>
                    <p className="text-xs text-gray-400 mt-3">by {review.username}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((rp) => (
                  <Link
                    key={rp.id}
                    href={`/product/${rp.id}`}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="h-32 bg-gray-50 flex items-center justify-center">
                      <img
                        src={`/api/loadImage?filename=${rp.image || 'placeholder.jpg'}`}
                        alt={rp.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="p-3">
                      <p className="font-medium text-gray-900 text-sm truncate">{rp.name}</p>
                      <p className="text-emerald-600 font-bold text-sm mt-1">${rp.price.toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
