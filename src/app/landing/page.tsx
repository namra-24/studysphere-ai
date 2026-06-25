'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Brain, Sparkles, BookOpen, Zap, Star, ChevronDown,
  ArrowRight, Check, MessageSquare, FileText, Target,
  Moon, Sun, Menu, X, Play, Users, Award, TrendingUp,
  Flashlight, Clock, BarChart3, Layers
} from 'lucide-react';

// ─── Dark Mode Hook ───────────────────────────────────────────
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

// ─── Floating Particle ────────────────────────────────────────
function Particle({ style }: { style: React.CSSProperties }) {
  return <div className="particle" style={style} />;
}

// ─── Navbar ───────────────────────────────────────────────────
function Navbar({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass shadow-lg' : ''}`}
      style={{ padding: '1rem 2rem' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #CDB4DB, #A2D2FF)' }}>
            <Brain size={20} color="white" />
          </div>
          <span className="font-display font-bold text-xl">StudySphere<span className="gradient-text"> AI</span></span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How It Works', 'Pricing', 'FAQ'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              className="text-sm font-medium transition-colors hover:text-purple-400"
              style={{ color: 'var(--muted)' }}>{item}</a>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button onClick={toggleDark} className="p-2 rounded-lg transition-colors"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link href="/dashboard">
            <button className="btn-primary text-sm py-2 px-5">
              Try for Free <ArrowRight size={14} className="inline ml-1" />
            </button>
          </Link>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={toggleDark} className="p-2 rounded-lg" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden glass mt-2 mx-4 rounded-2xl p-4 flex flex-col gap-3">
          {['Features', 'How It Works', 'Pricing', 'FAQ'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              className="text-sm font-medium py-2 px-3 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/20"
              onClick={() => setMenuOpen(false)}>{item}</a>
          ))}
          <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
            <button className="btn-primary w-full text-sm py-2">Try for Free</button>
          </Link>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────
function Hero() {
  const particles = [
    { width: 80, height: 80, background: '#CDB4DB55', top: '15%', left: '8%', animationDelay: '0s' },
    { width: 120, height: 120, background: '#A2D2FF44', top: '60%', left: '5%', animationDelay: '2s' },
    { width: 60, height: 60, background: '#FFC8DD66', top: '25%', right: '10%', animationDelay: '1s' },
    { width: 100, height: 100, background: '#B5EAD755', top: '70%', right: '8%', animationDelay: '3s' },
    { width: 40, height: 40, background: '#CDB4DB77', top: '45%', left: '15%', animationDelay: '4s' },
    { width: 70, height: 70, background: '#A2D2FF55', top: '80%', right: '20%', animationDelay: '1.5s' },
  ];

  return (
    <section className="hero-gradient relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 overflow-hidden">
      {particles.map((p, i) => (
        <Particle key={i} style={{ ...p, position: 'absolute' }} />
      ))}

      {/* Badge */}
      <div className="glass-sm flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium"
        style={{ color: 'var(--muted)' }}>
        <Sparkles size={14} style={{ color: '#CDB4DB' }} />
        <span>AI-Powered Study Platform</span>
        <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #CDB4DB, #A2D2FF)' }}>NEW</span>
      </div>

      {/* Heading */}
      <h1 className="font-display font-black text-5xl md:text-7xl leading-tight mb-6 max-w-4xl">
        Study Smarter with<br />
        <span className="gradient-text">AI Superpowers</span>
      </h1>

      <p className="text-lg md:text-xl max-w-2xl mb-10 leading-relaxed" style={{ color: 'var(--muted)' }}>
        Upload your PDFs and let AI transform them into flashcards, quizzes, summaries, mind maps,
        and an interactive tutor — all in one beautiful workspace.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 mb-16">
        <Link href="/dashboard">
          <button className="btn-primary flex items-center gap-2 text-base px-8 py-3">
            <Sparkles size={18} /> Start Studying Free
          </button>
        </Link>
        <a href="#how-it-works">
          <button className="btn-secondary flex items-center gap-2 text-base px-8 py-3">
            <Play size={16} /> See How It Works
          </button>
        </a>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-8 justify-center mb-16">
        {[
          { value: '50K+', label: 'Students' },
          { value: '2M+', label: 'Flashcards Made' },
          { value: '98%', label: 'Satisfaction' },
          { value: '4.9★', label: 'Rating' },
        ].map(s => (
          <div key={s.label} className="text-center">
            <div className="font-display font-bold text-2xl gradient-text">{s.value}</div>
            <div className="text-sm" style={{ color: 'var(--muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Dashboard Preview */}
      <div className="glass w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <span className="ml-3 text-xs" style={{ color: 'var(--muted)' }}>studysphere.ai/dashboard</span>
        </div>
        <div className="p-6 gradient-bg">
          <div className="flex gap-4">
            {/* Mini sidebar */}
            <div className="glass-sm p-3 rounded-xl flex flex-col gap-2 w-12 items-center">
              {[Brain, BookOpen, FileText, BarChart3].map((Icon, i) => (
                <div key={i} className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: i === 0 ? 'linear-gradient(135deg,#CDB4DB,#A2D2FF)' : 'transparent' }}>
                  <Icon size={15} color={i === 0 ? 'white' : '#9ca3af'} />
                </div>
              ))}
            </div>
            {/* Main area */}
            <div className="flex-1 flex flex-col gap-3">
              <div className="glass-sm p-4 rounded-xl">
                <div className="text-sm font-semibold mb-2">📚 AI Chat with PDF</div>
                <div className="flex gap-2 items-start">
                  <div className="chat-bubble-ai text-xs p-2">Photosynthesis converts light energy into glucose using chlorophyll. The reaction requires CO₂ and water...</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['Flashcards', 'Quiz', 'Summary'].map((f, i) => (
                  <div key={f} className="glass-sm p-3 rounded-xl text-center">
                    <div className="text-lg mb-1">
                      {i === 0 ? '🃏' : i === 1 ? '🎯' : '📝'}
                    </div>
                    <div className="text-xs font-medium">{f}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 animate-bounce">
        <ChevronDown size={24} style={{ color: 'var(--muted)' }} />
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────
function Features() {
  const features = [
    {
      icon: MessageSquare, color: '#CDB4DB', bg: '#CDB4DB22',
      title: 'PDF Chat', emoji: '💬',
      desc: 'Upload any PDF and have a real conversation with it. Ask questions, get explanations, find answers instantly.'
    },
    {
      icon: Layers, color: '#A2D2FF', bg: '#A2D2FF22',
      title: 'Flashcard Generator', emoji: '🃏',
      desc: 'AI creates beautiful flashcards automatically from your notes. Study with spaced repetition built in.'
    },
    {
      icon: Target, color: '#FFC8DD', bg: '#FFC8DD22',
      title: 'Quiz Generator', emoji: '🎯',
      desc: 'Generate MCQs, short answers, and more. Get instant feedback and track your progress.'
    },
    {
      icon: FileText, color: '#B5EAD7', bg: '#B5EAD722',
      title: 'Smart Summaries', emoji: '📝',
      desc: 'Get one-line, one-page, or detailed summaries. Perfect for quick revision before exams.'
    },
    {
      icon: TrendingUp, color: '#FFDAC1', bg: '#FFDAC122',
      title: 'Study Analytics', emoji: '📊',
      desc: 'Track study hours, accuracy, weak areas, and growth over time with beautiful charts.'
    },
    {
      icon: Clock, color: '#CDB4DB', bg: '#CDB4DB22',
      title: 'Study Planner', emoji: '📅',
      desc: 'AI generates a personalized study timetable based on your exam dates and availability.'
    },
  ];

  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="glass-sm inline-flex items-center gap-2 px-4 py-2 mb-4 text-sm font-medium" style={{ color: 'var(--muted)' }}>
            <Zap size={14} style={{ color: '#A2D2FF' }} /> Features
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">
            Everything you need to <span className="gradient-text">ace your exams</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
            A complete AI toolkit that transforms boring PDFs into interactive learning experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="glass card-hover p-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-2xl"
                style={{ background: f.bg }}>
                {f.emoji}
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { emoji: '📤', title: 'Upload Your Material', desc: 'Drop any PDF — textbook, notes, lab manual, anything.' },
    { emoji: '🤖', title: 'AI Analyzes It', desc: 'Our AI reads, understands, and indexes every concept.' },
    { emoji: '✨', title: 'Generate Resources', desc: 'Create flashcards, quizzes, summaries in one click.' },
    { emoji: '🎓', title: 'Study & Ace Exams', desc: 'Track progress, revise smartly, and perform at your best.' },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">
            How <span className="gradient-text">StudySphere AI</span> works
          </h2>
          <p className="text-lg" style={{ color: 'var(--muted)' }}>From upload to exam-ready in minutes.</p>
        </div>

        <div className="relative">
          {/* Line connector */}
          <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5"
            style={{ background: 'linear-gradient(90deg, #CDB4DB, #A2D2FF, #FFC8DD, #B5EAD7)' }} />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={s.title} className="flex flex-col items-center text-center">
                <div className="glass w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 relative z-10 card-hover">
                  {s.emoji}
                </div>
                <div className="text-xs font-bold mb-1 gradient-text">STEP {i + 1}</div>
                <h3 className="font-display font-semibold text-base mb-2">{s.title}</h3>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────
function Testimonials() {
  const testimonials = [
    { name: 'Priya Sharma', role: 'UPSC Aspirant', stars: 5, text: 'StudySphere AI completely changed how I prepare. I upload my notes and the AI creates perfect revision materials. Scored 40% better in my last mock test!', avatar: '👩‍💼' },
    { name: 'Arjun Mehta', role: 'Engineering Student, IIT Delhi', stars: 5, text: 'The PDF chat feature is insane. I literally asked my DBMS textbook questions and it answered perfectly with page references. No more searching manually.', avatar: '👨‍💻' },
    { name: 'Sneha Patel', role: 'Class 12 Student', stars: 5, text: 'Generated 200 flashcards from my Chemistry notes in 2 minutes. My friends are jealous. The flip animations are so satisfying!', avatar: '👩‍🎓' },
  ];

  return (
    <section className="py-24 px-6 gradient-bg">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl mb-4">
            Students <span className="gradient-text">love</span> StudySphere AI
          </h2>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="#FFC8DD" color="#FFC8DD" />)}
          </div>
          <p style={{ color: 'var(--muted)' }}>4.9/5 from 2,000+ reviews</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="glass card-hover p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(t.stars)].map((_, i) => <Star key={i} size={14} fill="#FFC8DD" color="#FFC8DD" />)}
              </div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--muted)' }}>"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl glass-sm">{t.avatar}</div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────
function Pricing() {
  const plans = [
    {
      name: 'Free', price: '₹0', period: 'forever', popular: false,
      features: ['5 PDF uploads/month', 'AI Chat (10 msg/day)', '50 flashcards/month', 'Basic quizzes', 'Community support'],
      cta: 'Get Started Free', href: '/dashboard'
    },
    {
      name: 'Pro', price: '₹299', period: '/month', popular: true,
      features: ['Unlimited PDF uploads', 'Unlimited AI Chat', 'Unlimited flashcards', 'Advanced quizzes', 'Smart summaries', 'Study planner', 'Priority support'],
      cta: 'Start Pro', href: '/dashboard'
    },
    {
      name: 'Team', price: '₹799', period: '/month', popular: false,
      features: ['Everything in Pro', 'Up to 10 members', 'Shared workspaces', 'Admin dashboard', 'Custom integrations', 'Dedicated support'],
      cta: 'Contact Sales', href: '/dashboard'
    },
  ];

  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl mb-4">
            Simple, <span className="gradient-text">honest pricing</span>
          </h2>
          <p style={{ color: 'var(--muted)' }}>Start free. Upgrade when you need more.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div key={p.name} className={`glass card-hover p-6 relative ${p.popular ? 'ring-2' : ''}`}
              style={p.popular ? { outline: '2px solid #A2D2FF' } : {}}>
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #CDB4DB, #A2D2FF)' }}>
                  Most Popular
                </div>
              )}
              <div className="mb-4">
                <div className="font-display font-bold text-lg mb-1">{p.name}</div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-black text-4xl gradient-text">{p.price}</span>
                  <span className="text-sm" style={{ color: 'var(--muted)' }}>{p.period}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check size={14} color="#A2D2FF" /> {f}
                  </li>
                ))}
              </ul>
              <Link href={p.href}>
                <button className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${p.popular ? 'btn-primary' : 'btn-secondary'}`}>
                  {p.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    { q: 'What file types can I upload?', a: 'Currently we support PDF files. Support for Word documents, PowerPoint, and images is coming soon.' },
    { q: 'How accurate are the AI-generated flashcards?', a: 'Very accurate! Our AI understands context, not just keywords. It identifies the most important concepts and creates meaningful flashcards. You can always edit or delete any card.' },
    { q: 'Is my data private and secure?', a: 'Absolutely. Your uploaded files are encrypted and never shared. We never train our AI on your personal documents.' },
    { q: 'Can I use it on mobile?', a: 'Yes! StudySphere AI is fully responsive and works beautifully on all devices — phones, tablets, and desktops.' },
    { q: 'Do I need a credit card to start?', a: 'No credit card needed for the free plan. Just sign up and start studying immediately.' },
    { q: 'What languages are supported?', a: 'The interface is in English, but you can upload PDFs in any language. Hindi support is coming soon.' },
  ];

  return (
    <section id="faq" className="py-24 px-6 gradient-bg">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl mb-4">
            Frequently asked <span className="gradient-text">questions</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="glass overflow-hidden">
              <button className="w-full flex items-center justify-between p-5 text-left font-medium"
                onClick={() => setOpen(open === i ? null : i)}>
                {faq.q}
                <ChevronDown size={18} className={`transition-transform ${open === i ? 'rotate-180' : ''}`}
                  style={{ color: 'var(--muted)', flexShrink: 0 }} />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Banner ───────────────────────────────────────────────
function CTABanner() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="glass p-12 rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={{
            background: 'radial-gradient(ellipse at 30% 50%, #CDB4DB55, transparent), radial-gradient(ellipse at 70% 50%, #A2D2FF55, transparent)'
          }} />
          <div className="relative z-10">
            <div className="text-5xl mb-6">🚀</div>
            <h2 className="font-display font-black text-4xl md:text-5xl mb-4">
              Ready to study <span className="gradient-text">smarter?</span>
            </h2>
            <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
              Join 50,000+ students who are already using StudySphere AI to ace their exams.
            </p>
            <Link href="/dashboard">
              <button className="btn-primary text-base px-10 py-3">
                <Sparkles size={16} className="inline mr-2" />
                Start for Free — No Credit Card
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-12 px-6 border-t" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #CDB4DB, #A2D2FF)' }}>
                <Brain size={16} color="white" />
              </div>
              <span className="font-display font-bold">StudySphere AI</span>
            </div>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              Your AI-powered academic companion for smarter studying.
            </p>
          </div>

          {[
            { title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
            { title: 'Support', links: ['Help Center', 'Contact', 'Privacy', 'Terms'] },
          ].map(col => (
            <div key={col.title}>
              <div className="font-semibold text-sm mb-4">{col.title}</div>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" className="text-sm transition-colors hover:text-purple-400"
                      style={{ color: 'var(--muted)' }}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            © 2025 StudySphere AI. Made with ❤️ for students everywhere.
          </p>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Powered by Claude AI
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function LandingPage() {
  const { dark, toggle } = useDarkMode();

  return (
    <main>
      <Navbar dark={dark} toggleDark={toggle} />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTABanner />
      <Footer />
    </main>
  );
}
