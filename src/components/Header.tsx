'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { ShoppingCart, Menu, X, Search, Package, MessageCircle, User } from 'lucide-react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Read cookies to determine login status (client-side only)
  const { loggedIn, username, isAdmin } = useMemo(() => {
    if (typeof document === 'undefined') return { loggedIn: false, username: '', isAdmin: false };
    const cookies = document.cookie.split(';').reduce((acc, c) => {
      const [key, val] = c.trim().split('=');
      acc[key] = val;
      return acc;
    }, {} as Record<string, string>);

    if (cookies.session_id) {
      return {
        loggedIn: true,
        username: cookies.role === 'admin' ? 'Admin' : cookies.user_id || 'User',
        isAdmin: cookies.role === 'admin',
      };
    }
    return { loggedIn: false, username: '', isAdmin: false };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <ShoppingCart className="h-8 w-8 text-emerald-600" />
            <span className="text-xl font-bold text-gray-900">ShopZone</span>
          </Link>

          {/* Search bar (desktop) */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Navigation (desktop) */}
          <nav className="hidden md:flex items-center gap-5">
            <Link href="/" className="text-gray-700 hover:text-emerald-600 text-sm font-medium">Home</Link>
            <Link href="/profile" className="text-gray-700 hover:text-emerald-600 text-sm font-medium flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              My Account
            </Link>
            {loggedIn && (
              <>
                <Link href="/orders" className="text-gray-700 hover:text-emerald-600 text-sm font-medium flex items-center gap-1">
                  <Package className="h-3.5 w-3.5" />
                  Orders
                </Link>
                <Link href="/chat" className="text-gray-700 hover:text-emerald-600 text-sm font-medium flex items-center gap-1">
                  <MessageCircle className="h-3.5 w-3.5" />
                  Support
                </Link>
              </>
            )}
            {loggedIn ? (
              <span className="text-emerald-600 text-sm font-medium">Welcome, {username}</span>
            ) : (
              <Link href="/login" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            <nav className="flex flex-col gap-2 pt-4">
              <Link href="/" className="text-gray-700 hover:text-emerald-600 px-2 py-2 text-sm font-medium">Home</Link>
              <Link href="/profile" className="text-gray-700 hover:text-emerald-600 px-2 py-2 text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" /> My Account
              </Link>
              {loggedIn && (
                <>
                  <Link href="/orders" className="text-gray-700 hover:text-emerald-600 px-2 py-2 text-sm font-medium flex items-center gap-2">
                    <Package className="h-4 w-4" /> Orders
                  </Link>
                  <Link href="/chat" className="text-gray-700 hover:text-emerald-600 px-2 py-2 text-sm font-medium flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" /> Support
                  </Link>
                </>
              )}
              {loggedIn ? (
                <span className="text-emerald-600 px-2 py-2 text-sm font-medium">Welcome, {username}</span>
              ) : (
                <Link href="/login" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 text-center">
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
