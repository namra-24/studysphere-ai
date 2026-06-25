'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Brain, LayoutDashboard, MessageSquare, Layers, Target,
  FileText, TrendingUp, Moon, Sun, Menu, X, ChevronRight,
  Sparkles, Bell, User, LogOut, Settings
} from 'lucide-react';

function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    setDark(saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches));
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };
  return { dark, toggle };
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/chat', label: 'PDF Chat', icon: MessageSquare },
  { href: '/dashboard/flashcards', label: 'Flashcards', icon: Layers },
  { href: '/dashboard/quiz', label: 'Quiz', icon: Target },
  { href: '/dashboard/summary', label: 'Summaries', icon: FileText },
  { href: '/dashboard/analytics', label: 'Analytics', icon: TrendingUp },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { dark, toggle } = useDarkMode();
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen z-40 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        style={{ width: 240, background: 'var(--sidebar)', borderRight: '1px solid var(--border)', backdropFilter: 'blur(16px)' }}>

        {/* Logo */}
        <div className="flex items-center gap-2 p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #CDB4DB, #A2D2FF)' }}>
            <Brain size={20} color="white" />
          </div>
          <span className="font-display font-bold text-lg">StudySphere</span>
          <button className="ml-auto md:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold mb-3 px-3" style={{ color: 'var(--muted)', letterSpacing: '0.08em' }}>
            MAIN MENU
          </div>
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
              className={`sidebar-link ${pathname === href ? 'active' : ''}`}>
              <Icon size={18} />
              {label}
              {pathname === href && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="glass-sm p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #CDB4DB, #A2D2FF)' }}>
              S
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">Student</div>
              <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>Free Plan</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-4 md:px-6 py-3"
          style={{ background: 'var(--sidebar)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(16px)' }}>
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 rounded-lg" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              onClick={() => setSidebarOpen(true)}>
              <Menu size={18} />
            </button>
            <div>
              <h1 className="font-display font-semibold text-base">
                {navItems.find(n => n.href === pathname)?.label || 'Dashboard'}
              </h1>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>StudySphere AI</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggle} className="p-2 rounded-lg transition-colors"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button className="p-2 rounded-lg" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <Bell size={16} />
            </button>
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #CDB4DB, #A2D2FF)' }}>
                S
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-10 w-48 glass rounded-xl shadow-xl p-2 z-50">
                  {[
                    { icon: User, label: 'Profile' },
                    { icon: Settings, label: 'Settings' },
                    { icon: LogOut, label: 'Sign out' },
                  ].map(({ icon: Icon, label }) => (
                    <button key={label} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-purple-100 dark:hover:bg-purple-900/20"
                      onClick={() => setProfileOpen(false)}>
                      <Icon size={14} /> {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
