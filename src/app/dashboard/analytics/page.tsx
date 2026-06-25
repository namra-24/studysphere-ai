'use client';

const stats = [
  { emoji: '📚', label: 'PDFs Analyzed', value: '0', color: '#CDB4DB' },
  { emoji: '🃏', label: 'Flashcards Made', value: '0', color: '#A2D2FF' },
  { emoji: '🎯', label: 'Quizzes Taken', value: '0', color: '#FFC8DD' },
  { emoji: '⏱️', label: 'Study Hours', value: '0h', color: '#B5EAD7' },
];

export default function AnalyticsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="glass p-6">
        <h2 className="font-display font-bold text-2xl mb-1">📊 Study Analytics</h2>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Track your learning progress over time.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="glass p-4 text-center card-hover">
            <div className="text-2xl mb-2">{s.emoji}</div>
            <div className="font-display font-bold text-3xl gradient-text mb-1">{s.value}</div>
            <div className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="glass p-8 text-center">
        <div className="text-5xl mb-4">🚀</div>
        <h3 className="font-display font-semibold text-xl mb-2">Start studying to see your analytics!</h3>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Upload a PDF, generate flashcards, take a quiz — your stats will appear here automatically.
        </p>
      </div>
    </div>
  );
}
