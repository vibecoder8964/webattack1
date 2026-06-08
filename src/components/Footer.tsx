import Link from 'next/link';
import { ShoppingCart, MessageCircle, Package } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="h-6 w-6 text-emerald-400" />
              <span className="text-lg font-bold text-white">ShopZone</span>
            </div>
            <p className="text-sm text-gray-400">
              Your one-stop online store for electronics, clothing, food, and more. Free shipping on orders over $50!
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-emerald-400">All Products</Link></li>
              <li><Link href="/?category=Electronics" className="hover:text-emerald-400">Electronics</Link></li>
              <li><Link href="/?category=Clothing" className="hover:text-emerald-400">Clothing</Link></li>
              <li><Link href="/?category=Food" className="hover:text-emerald-400">Food & Drink</Link></li>
              <li><Link href="/?category=Gaming" className="hover:text-emerald-400">Gaming</Link></li>
              <li><Link href="/?category=Books" className="hover:text-emerald-400">Books</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Account</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="hover:text-emerald-400">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-emerald-400">Create Account</Link></li>
              <li><Link href="/profile" className="hover:text-emerald-400">My Profile</Link></li>
              <li><Link href="/orders" className="hover:text-emerald-400 flex items-center gap-1">
                <Package className="h-3 w-3" /> Track Orders
              </Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Customer Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/chat" className="hover:text-emerald-400 flex items-center gap-1">
                <MessageCircle className="h-3 w-3" /> Live Chat
              </Link></li>
              <li><span className="text-gray-400">help@shopzone.com</span></li>
              <li><span className="text-gray-400">1-800-SHOPZONE</span></li>
              <li><span className="text-gray-400">Mon-Fri 9am-6pm EST</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">More</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/?category=Beauty" className="hover:text-emerald-400">Beauty</Link></li>
              <li><Link href="/?category=Garden" className="hover:text-emerald-400">Garden</Link></li>
              <li><Link href="/?category=Automotive" className="hover:text-emerald-400">Automotive</Link></li>
              <li><Link href="/?category=Toys" className="hover:text-emerald-400">Toys & Games</Link></li>
              <li><Link href="/?category=Home" className="hover:text-emerald-400">Home & Living</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          &copy; 2024 ShopZone Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
