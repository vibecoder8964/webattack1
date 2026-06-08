'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { MessageCircle, Send, ArrowLeft, Bot, User, Clock, ChevronDown } from 'lucide-react';

interface ChatMsg {
  id: number;
  sessionId: string;
  userId: number | null;
  sender: string;
  message: string;
  username: string | null;
  createdAt: string;
}

const DEMO_SESSIONS = [
  { id: 'chat-006', label: 'Rachel - Fashion inquiry', preview: 'Hi! Do you have any new arrivals...' },
  { id: 'chat-007', label: 'Marcus - Security questions', preview: 'Hello, I am a cybersecurity researcher...' },
  { id: 'chat-003', label: 'Emma - Stock checker', preview: 'Hey, I was wondering about the stock...' },
  { id: 'chat-004', label: 'Olivia - Login issues', preview: "I'm having trouble logging in..." },
  { id: 'chat-009', label: 'David - Upload testing', preview: 'Hey, I was trying to upload...' },
  { id: 'chat-005', label: 'Alex - Tech questions', preview: 'Hey, I was browsing the site...' },
  { id: 'chat-008', label: 'Naomi - International', preview: 'Hi there! I am visiting from Japan...' },
  { id: 'chat-001', label: 'Jessica - Shipping delay', preview: 'Hi, I placed an order 5 days ago...' },
  { id: 'chat-002', label: 'Tyler - Product return', preview: 'I need to return the running shoes...' },
  { id: 'chat-010', label: 'Customer1 - New account', preview: 'Hello! I just created my account...' },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedSession, setSelectedSession] = useState('chat-006');
  const [showSessionList, setShowSessionList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatSessionId] = useState(() => `chat-${Date.now()}`);

  const { loggedIn, username } = useMemo(() => {
    if (typeof document === 'undefined') return { loggedIn: false, username: '' };
    const cookies = document.cookie.split(';').reduce((acc, c) => {
      const [key, val] = c.trim().split('=');
      acc[key] = val;
      return acc;
    }, {} as Record<string, string>);

    if (cookies.session_id) {
      return {
        loggedIn: true,
        username: cookies.role === 'admin' ? 'Admin' : cookies.user_id || 'User',
      };
    }
    return { loggedIn: false, username: '' };
  }, []);

  useEffect(() => {
    if (!loggedIn) {
      return;
    }

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/chat?sessionId=${selectedSession}`);
        const data = await res.json();
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
        } else {
          setMessages([]);
        }
      } catch (_e) {
        // Could not load history
      }
      setLoading(false);
    };
    fetchHistory();
  }, [loggedIn, selectedSession]);

  // Set loading to false when not logged in (derived state)
  const effectiveLoading = !loggedIn ? false : loading;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMsg: ChatMsg = {
      id: Date.now(),
      sessionId: chatSessionId,
      userId: null,
      sender: 'customer',
      message: input.trim(),
      username: 'You',
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatSessionId,
          message: userMsg.message,
        }),
      });

      // Simulate support response
      setTimeout(() => {
        const supportMsg: ChatMsg = {
          id: Date.now() + 1,
          sessionId: chatSessionId,
          userId: 11,
          sender: 'support',
          message: "Thank you for your message! A support agent will be with you shortly. In the meantime, feel free to browse our FAQ section or check out our product pages.",
          username: 'Lisa S.',
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, supportMsg]);
      }, 1500);
    } catch (_e) {
      // Failed to send
    }
    setSending(false);
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
              <MessageCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
            <p className="text-gray-500 mb-6">Please sign in to access customer support chat.</p>
            <Link href="/login" className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700">
              Sign In
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentSessionLabel = DEMO_SESSIONS.find(s => s.id === selectedSession)?.label || 'Select a conversation';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-6 h-[calc(100vh-10rem)] flex gap-4">
          {/* Session List Sidebar */}
          <div className="w-64 flex-shrink-0 hidden md:block">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-full">
              <div className="p-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 text-sm">Conversations</h3>
              </div>
              <div className="overflow-y-auto max-h-[calc(100vh-14rem)]">
                {DEMO_SESSIONS.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => setSelectedSession(session.id)}
                    className={`w-full text-left p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                      selectedSession === session.id ? 'bg-emerald-50 border-l-2 border-l-emerald-600' : ''
                    }`}
                  >
                    <p className={`text-sm font-medium truncate ${selectedSession === session.id ? 'text-emerald-700' : 'text-gray-900'}`}>
                      {session.label}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{session.preview}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat Header */}
            <div className="flex items-center gap-3 mb-4">
              <Link href="/" className="text-gray-400 hover:text-emerald-600">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">Customer Support</h1>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    <span className="text-xs text-emerald-600">Online</span>
                  </div>
                </div>
              </div>
              {/* Mobile session selector */}
              <div className="md:hidden relative">
                <button
                  onClick={() => setShowSessionList(!showSessionList)}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-emerald-600 px-3 py-1.5 border border-gray-200 rounded-lg"
                >
                  <Clock className="h-3.5 w-3.5" />
                  History
                  <ChevronDown className="h-3 w-3" />
                </button>
                {showSessionList && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-64 max-h-64 overflow-y-auto">
                    {DEMO_SESSIONS.map((session) => (
                      <button
                        key={session.id}
                        onClick={() => {
                          setSelectedSession(session.id);
                          setShowSessionList(false);
                        }}
                        className={`w-full text-left p-2.5 text-sm border-b border-gray-50 hover:bg-gray-50 ${
                          selectedSession === session.id ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'
                        }`}
                      >
                        {session.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-y-auto p-4 space-y-4 mb-4 min-h-0">
              {effectiveLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageCircle className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">No messages yet. Start a conversation!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'support' && (
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="h-4 w-4 text-teal-600" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                        msg.sender === 'customer'
                          ? 'bg-emerald-600 text-white rounded-br-md'
                          : 'bg-gray-100 text-gray-900 rounded-bl-md'
                      }`}
                    >
                      {msg.sender === 'support' && (
                        <p className="text-xs font-medium text-teal-600 mb-1">
                          {msg.username === 'Mike W.' || msg.username === 'mike_wazowski' ? 'Support Agent: Mike W.' : msg.username === 'Lisa S.' || msg.username === 'lisa_sullivan' ? 'Support Agent: Lisa S.' : 'Support Agent'}
                        </p>
                      )}
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                      <p className={`text-xs mt-1 ${msg.sender === 'customer' ? 'text-emerald-200' : 'text-gray-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {msg.sender === 'customer' && (
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="h-4 w-4 text-emerald-600" />
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={!input.trim() || sending}
                className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
