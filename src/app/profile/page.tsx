'use client';

import { useState, useCallback, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { User, Mail, Shield, ExternalLink, ArrowLeft, ArrowRight } from 'lucide-react';

interface ProfileData {
  id: number;
  username: string;
  email: string | null;
  role: string;
  blogUrl: string | null;
  twoFaEnabled: boolean;
  memberSince: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [targetId, setTargetId] = useState('');
  const [error, setError] = useState('');

  const { currentId, notLoggedIn } = useMemo(() => {
    if (typeof document === 'undefined') return { currentId: '', notLoggedIn: true };
    const cookies = document.cookie.split(';').reduce((acc, c) => {
      const [key, val] = c.trim().split('=');
      acc[key] = val;
      return acc;
    }, {} as Record<string, string>);

    if (!cookies.session_id) {
      return { currentId: '', notLoggedIn: true };
    }
    return { currentId: cookies.user_id || '', notLoggedIn: false };
  }, []);

  const fetchProfile = useCallback(async (id: string) => {
    setError('');
    try {
      const res = await fetch(`/api/profile?id=${id}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to load profile');
      } else {
        setProfile(data);
      }
    } catch (_e) {
      setError('Network error');
    }
  }, []);

  const handleIdLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetId) {
      fetchProfile(targetId);
    }
  };

  if (notLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
            <p className="text-gray-500 mb-6">You need to be logged in to view your profile.</p>
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
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

          {/* ID Lookup Form - This enables IDOR */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Lookup</h2>
            <p className="text-sm text-gray-500 mb-4">Enter a user ID to view their profile.</p>
            <form onSubmit={handleIdLookup} className="flex gap-3">
              <input
                type="number"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                placeholder="Enter user ID"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                Lookup
              </button>
            </form>
            {currentId && (
              <button
                onClick={() => fetchProfile(currentId)}
                className="mt-3 text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to my profile (ID: {currentId})
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          {profile && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-8 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{profile.username}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Shield className={`h-4 w-4 ${profile.role === 'admin' ? 'text-amber-300' : 'text-emerald-200'}`} />
                      <span className="text-sm capitalize">{profile.role}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 w-24">User ID:</span>
                  <span className="text-sm text-gray-900">{profile.id}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{profile.email || 'Not provided'}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900">Role: {profile.role}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 w-24">2FA:</span>
                  <span className={`text-sm ${profile.twoFaEnabled ? 'text-emerald-600' : 'text-gray-500'}`}>
                    {profile.twoFaEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>

                {profile.blogUrl && (
                  <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                    <Link href={profile.blogUrl} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                      Visit my blog
                    </Link>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 w-24">Member since:</span>
                  <span className="text-sm text-gray-600">{new Date(profile.memberSince).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Navigation between profiles */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <button
                  onClick={() => fetchProfile(String(Math.max(1, profile.id - 1)))}
                  className="text-sm text-gray-600 hover:text-emerald-600 flex items-center gap-1"
                  disabled={profile.id <= 1}
                >
                  <ArrowLeft className="h-3 w-3" /> Previous User
                </button>
                <span className="text-xs text-gray-400">ID: {profile.id}</span>
                <button
                  onClick={() => fetchProfile(String(profile.id + 1))}
                  className="text-sm text-gray-600 hover:text-emerald-600 flex items-center gap-1"
                >
                  Next User <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
