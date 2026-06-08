'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Package, Truck, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';

interface OrderItem {
  productId: number;
  name: string;
  qty: number;
  price: number;
}

interface Order {
  id: number;
  userId: number;
  status: string;
  total: number;
  items: OrderItem[];
  shippingAddr: string | null;
  createdAt: string;
}

const statusConfig: Record<string, { color: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
  delivered: { color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: CheckCircle },
  shipped: { color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', icon: Truck },
  pending: { color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', icon: Clock },
  cancelled: { color: 'text-red-700', bg: 'bg-red-50 border-red-200', icon: XCircle },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loggedIn = useMemo(() => {
    if (typeof document === 'undefined') return false;
    const cookies = document.cookie.split(';').reduce((acc, c) => {
      const [key, val] = c.trim().split('=');
      acc[key] = val;
      return acc;
    }, {} as Record<string, string>);
    return !!cookies.session_id;
  }, []);

  useEffect(() => {
    if (!loggedIn) {
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (res.ok) {
          setOrders(data.orders || []);
        } else {
          setError(data.error || 'Failed to load orders');
        }
      } catch (_e) {
        setError('Network error');
      }
      setLoading(false);
    };

    fetchOrders();
  }, [loggedIn]);

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
              <Package className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
            <p className="text-gray-500 mb-6">Please sign in to view your order history.</p>
            <Link href="/login" className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700">
              Sign In
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <Link href="/" className="text-gray-400 hover:text-emerald-600">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No orders found.</p>
              <Link href="/" className="text-emerald-600 font-medium hover:text-emerald-700 mt-4 inline-block">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const config = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = config.icon;
                return (
                  <div key={order.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-semibold text-gray-900">Order #{order.id}</p>
                          <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">{item.name} x{item.qty}</span>
                            <span className="text-gray-500">${item.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="text-sm text-gray-500">
                          {order.shippingAddr && (
                            <span>Ship to: {order.shippingAddr.split(',')[0]}</span>
                          )}
                        </div>
                        <p className="text-lg font-bold text-emerald-600">${order.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
