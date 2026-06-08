'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Upload, Terminal, Activity, Users, Package, AlertTriangle, CheckCircle, XCircle, ShoppingCart, MessageCircle } from 'lucide-react';

export default function AdminDashboardPage() {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [diagHost, setDiagHost] = useState('');
  const [diagResult, setDiagResult] = useState<any>(null);
  const [diagLoading, setDiagLoading] = useState(false);

  const { authorized, checking } = useMemo(() => {
    if (typeof document === 'undefined') return { authorized: false, checking: true };
    const cookies = document.cookie.split(';').reduce((acc, c) => {
      const [key, val] = c.trim().split('=');
      acc[key] = val;
      return acc;
    }, {} as Record<string, string>);

    return {
      authorized: cookies.role === 'admin' && cookies['2fa_verified'] === 'true',
      checking: false,
    };
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploadLoading(true);
    setUploadResult(null);

    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setUploadResult(data);
    } catch (e) {
      setUploadResult({ error: 'Upload failed' });
    }
    setUploadLoading(false);
  };

  const handleDiagnostic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagHost) return;

    setDiagLoading(true);
    setDiagResult(null);

    try {
      const res = await fetch('/api/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host: diagHost }),
      });
      const data = await res.json();
      setDiagResult(data);
    } catch (e) {
      setDiagResult({ error: 'Diagnostic failed' });
    }
    setDiagLoading(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-500 mb-6">
              You need admin privileges and 2FA verification to access this page.
            </p>
            <Link href="/admin-panel-x7k9m" className="bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700">
              Go to 2FA Verification
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

      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Dashboard Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-500 mt-1">Manage your ShopZone store</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">2FA Verified</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">50</p>
                  <p className="text-xs text-gray-500">Products</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">15</p>
                  <p className="text-xs text-gray-500">Users</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">25</p>
                  <p className="text-xs text-gray-500">Orders</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">99.9%</p>
                  <p className="text-xs text-gray-500">Uptime</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                  <p className="text-xs text-gray-500">Security Issues</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders & Support Chats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-gray-700" />
                  <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                </div>
                <Link href="/orders" className="text-xs text-emerald-600 hover:text-emerald-700">View All</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100">
                      <th className="pb-2 font-medium">Order</th>
                      <th className="pb-2 font-medium">Status</th>
                      <th className="pb-2 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr>
                      <td className="py-2 text-gray-900">#1042</td>
                      <td className="py-2"><span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">Pending</span></td>
                      <td className="py-2 text-gray-600">$148.98</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-900">#1038</td>
                      <td className="py-2"><span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Shipped</span></td>
                      <td className="py-2 text-gray-600">$167.98</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-900">#1035</td>
                      <td className="py-2"><span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">Delivered</span></td>
                      <td className="py-2 text-gray-600">$189.98</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-900">#1031</td>
                      <td className="py-2"><span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full">Cancelled</span></td>
                      <td className="py-2 text-gray-600">$129.99</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Support Chats */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-gray-700" />
                  <h2 className="text-lg font-semibold text-gray-900">Recent Support Chats</h2>
                </div>
                <Link href="/chat" className="text-xs text-emerald-600 hover:text-emerald-700">View All</Link>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-emerald-600">JR</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Jessica Ramirez</p>
                    <p className="text-xs text-gray-500 truncate">Shipping delay inquiry - Order #1042</p>
                  </div>
                  <span className="text-xs text-gray-400">2h ago</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-blue-600">TD</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Tyler Durden</p>
                    <p className="text-xs text-gray-500 truncate">Product return - Running Shoes</p>
                  </div>
                  <span className="text-xs text-gray-400">5h ago</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-purple-600">OP</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Olivia Parker</p>
                    <p className="text-xs text-gray-500 truncate">Account access issue</p>
                  </div>
                  <span className="text-xs text-gray-400">1d ago</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-amber-600">AK</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Alex Kumar</p>
                    <p className="text-xs text-gray-500 truncate">Website technical questions</p>
                  </div>
                  <span className="text-xs text-gray-400">2d ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upload & Diagnostic */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* File Upload Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Upload className="h-5 w-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">Product Image Upload</h2>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Upload product images. Only JPEG, PNG, and GIF files are accepted.
              </p>

              <form onSubmit={handleUpload} className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {uploadFile ? uploadFile.name : 'Click to select a file'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Accepted: image/jpeg, image/png, image/gif
                    </p>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!uploadFile || uploadLoading}
                  className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {uploadLoading ? 'Uploading...' : 'Upload Image'}
                </button>
              </form>

              {uploadResult && (
                <div className={`mt-4 p-3 rounded-lg text-sm ${uploadResult.success ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(uploadResult, null, 2)}</pre>
                </div>
              )}
            </div>

            {/* Network Diagnostic Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Terminal className="h-5 w-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">Network Diagnostic</h2>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Test network connectivity to internal and external hosts using ping.
              </p>

              <form onSubmit={handleDiagnostic} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Host</label>
                  <input
                    type="text"
                    value={diagHost}
                    onChange={(e) => setDiagHost(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm"
                    placeholder="e.g., localhost or 192.168.1.1"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!diagHost || diagLoading}
                  className="w-full bg-amber-600 text-white py-2.5 rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50"
                >
                  {diagLoading ? 'Running diagnostic...' : 'Run Ping Test'}
                </button>
              </form>

              {diagResult && (
                <div className="mt-4 p-3 bg-gray-900 rounded-lg">
                  <pre className="whitespace-pre-wrap text-xs text-green-400 font-mono">
                    {diagResult.output || diagResult.error || JSON.stringify(diagResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Security Warnings */}
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800">Security Audit Pending</h3>
                <p className="text-sm text-amber-700 mt-1">
                  The following issues need to be addressed: image loader path validation,
                  stock checker URL restriction, admin panel cookie-based access control,
                  and diagnostic tool input sanitization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
