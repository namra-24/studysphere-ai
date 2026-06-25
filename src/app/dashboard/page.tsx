'use client';
import Link from 'next/link';
import { MessageSquare, Layers, Target, FileText, TrendingUp, Clock, Flame, BookOpen, ArrowRight, Sparkles } from 'lucide-react';

const tools = [
  { href: '/dashboard/chat', emoji: '💬', title: 'PDF Chat', desc: 'Talk to your PDF', color: '#CDB4DB22', accent: '#CDB4DB' },
  { href: '/dashboard/flashcards', emoji: '🃏', title: 'Flashcards', desc: 'AI-generated cards', color: '#A2D2FF22', accent: '#A2D2FF' },
  { href: '/dashboard/quiz', emoji: '🎯', title: 'Quiz', desc: 'Test yourself', color: '#FFC8DD22', accent: '#FFC8DD' },
  { href: '/dashboard/summary', emoji: '📝', title: 'Summary', desc: 'Quick summaries', color: '#B5EAD722', accent: '#B5EAD7' },
];

const stats = [
  { emoji: '🔥', label: 'Day Streak', value: '7', sub: 'Keep it up!' },
  { emoji: '⏱️', label: 'Study Time', value: '12h', sub: 'This week' },
  { emoji: '🃏', label: 'Flashcards', value: '142', sub: 'Created' },
  { emoji: '🎯', label: 'Quiz Score', value: '85%', sub: 'Average' },
];

const tips = [
  'Upload a PDF and ask it questions in the Chat section',
  'Generate flashcards to study with spaced repetition',
  'Create a quiz to test how well you know the material',
  'Get a summary to quickly review before an exam',
];

export default function DashboardHome() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome */}
      <div className="glass p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          background: 'radial-gradient(ellipse at 80% 50%, #A2D2FF44, transparent)'
        }} />
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm mb-1" style={{ color: 'var(--muted)' }}>Good day, Student 👋</p>
              <h2 className="font-display font-bold text-2xl md:text-3xl mb-2">
                Ready to <span className="gradient-text">study smarter?</span>
              </h2>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                Upload a PDF and let AI transform it into a complete study toolkit.
              </p>
            </div>
            <div className="text-5xl hidden md:block">🧠</div>
          </div>
          <Link href="/dashboard/chat" className="mt-4 inline-flex">
            <button className="btn-primary text-sm py-2 px-5 flex items-center gap-2">
              <Sparkles size={14} /> Start with PDF Chat <ArrowRight size={14} />
            </button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="glass p-4 text-center card-hover">
            <div className="text-2xl mb-1">{s.emoji}</div>
            <div className="font-display font-bold text-2xl gradient-text">{s.value}</div>
            <div className="font-medium text-sm">{s.label}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* AI Tools */}
      <div>
        <h3 className="font-display font-semibold text-lg mb-4">AI Study Tools</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tools.map(t => (
            <Link key={t.href} href={t.href}>
              <div className="glass card-hover p-5 text-center cursor-pointer h-full">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3"
                  style={{ background: t.color }}>
                  {t.emoji}
                </div>
                <div className="font-display font-semibold text-sm">{t.title}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{t.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div>
        <h3 className="font-display font-semibold text-lg mb-4">💡 How to get started</h3>
        <div className="glass p-5 rounded-2xl space-y-3">
          {tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #CDB4DB, #A2D2FF)' }}>
                {i + 1}
              </div>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
