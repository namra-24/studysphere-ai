'use client';
import { useState, useRef, useCallback } from 'react';
import { Upload, Sparkles, ChevronLeft, ChevronRight, RotateCcw, Download, FileText } from 'lucide-react';

interface Flashcard {
  front: string;
  back: string;
}

export default function FlashcardsPage() {
  const [pdfText, setPdfText] = useState('');
  const [pdfName, setPdfName] = useState('');
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [cardType, setCardType] = useState('Q&A');
  const [count, setCount] = useState(10);
  const [progress, setProgress] = useState<Record<number, 'know' | 'review' | null>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const pdfjsLib = await import('pdfjs-dist');
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= Math.min(pdf.numPages, 20); i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
    }
    return fullText.trim();
  };

  const handleFile = useCallback(async (file: File) => {
    if (!file || file.type !== 'application/pdf') { setError('Please upload a PDF.'); return; }
    setError(''); setUploading(true);
    try {
      const text = await extractTextFromPDF(file);
      setPdfText(text);
      setPdfName(file.name);
    } catch {
      setError('Failed to read PDF. Try another file.');
    } finally {
      setUploading(false);
    }
  }, []);

  const generateFlashcards = async () => {
    if (!pdfText) return;
    setGenerating(true); setError(''); setCards([]); setCurrentCard(0); setProgress({});
    try {
      const res = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfText: pdfText.slice(0, 12000), cardType, count }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate');
      setCards(data.cards);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  };

  const next = () => { setFlipped(false); setTimeout(() => setCurrentCard(c => Math.min(c + 1, cards.length - 1)), 150); };
  const prev = () => { setFlipped(false); setTimeout(() => setCurrentCard(c => Math.max(c - 1, 0)), 150); };

  const markCard = (status: 'know' | 'review') => {
    setProgress(p => ({ ...p, [currentCard]: status }));
    if (currentCard < cards.length - 1) next();
  };

  const knowCount = Object.values(progress).filter(v => v === 'know').length;
  const reviewCount = Object.values(progress).filter(v => v === 'review').length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Upload + Settings */}
      <div className="glass p-5">
        <h2 className="font-display font-semibold text-lg mb-4">🃏 Flashcard Generator</h2>

        {/* PDF Upload */}
        <div
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all mb-4 ${pdfText ? 'border-green-300 bg-green-50 dark:bg-green-900/10' : 'hover:border-purple-300'}`}
          style={{ borderColor: pdfText ? '#86efac' : 'var(--border)' }}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="flex gap-1">{[0,1,2].map(i => <div key={i} className="typing-dot" />)}</div>
              <span className="text-sm">Reading PDF...</span>
            </div>
          ) : pdfText ? (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <FileText size={16} />
              <span className="text-sm font-medium">{pdfName}</span>
              <span className="text-xs opacity-60">✓ Ready</span>
            </div>
          ) : (
            <div>
              <div className="text-2xl mb-1">📄</div>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Click to upload PDF</p>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept=".pdf" className="hidden"
            onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--muted)' }}>CARD TYPE</label>
            <select value={cardType} onChange={e => setCardType(e.target.value)}
              className="w-full glass-sm px-3 py-2 text-sm rounded-xl outline-none"
              style={{ background: 'var(--card)', color: 'var(--fg)', border: '1px solid var(--border)' }}>
              {['Q&A', 'Definition', 'Fill in the Blank', 'True/False', 'Concept'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--muted)' }}>NUMBER OF CARDS</label>
            <select value={count} onChange={e => setCount(Number(e.target.value))}
              className="w-full glass-sm px-3 py-2 text-sm rounded-xl outline-none"
              style={{ background: 'var(--card)', color: 'var(--fg)', border: '1px solid var(--border)' }}>
              {[5, 10, 15, 20].map(n => <option key={n} value={n}>{n} cards</option>)}
            </select>
          </div>
        </div>

        <button onClick={generateFlashcards} disabled={!pdfText || generating}
          className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 disabled:opacity-50">
          {generating ? (
            <><div className="flex gap-1">{[0,1,2].map(i => <div key={i} className="typing-dot w-2 h-2" />)}</div> Generating...</>
          ) : (
            <><Sparkles size={15} /> Generate {count} Flashcards</>
          )}
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {/* Cards */}
      {cards.length > 0 && (
        <div className="space-y-4">
          {/* Progress */}
          <div className="glass-sm flex items-center justify-between px-4 py-2.5 text-sm">
            <span style={{ color: 'var(--muted)' }}>Card {currentCard + 1} of {cards.length}</span>
            <div className="flex gap-3">
              <span className="text-green-500 font-medium">✓ {knowCount} know</span>
              <span className="text-yellow-500 font-medium">↩ {reviewCount} review</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <div className="h-full rounded-full transition-all"
              style={{
                width: `${((currentCard + 1) / cards.length) * 100}%`,
                background: 'linear-gradient(90deg, #CDB4DB, #A2D2FF)'
              }} />
          </div>

          {/* Flashcard */}
          <div className="flip-card h-64" style={{ height: 280 }}
            onClick={() => setFlipped(f => !f)}>
            <div className={`flip-card-inner ${flipped ? 'flipped' : ''}`}>
              <div className="flip-card-front">
                <div className="text-xs font-semibold mb-3 opacity-60 uppercase tracking-wider">
                  {cardType === 'Q&A' ? '❓ Question' : cardType === 'Definition' ? '📖 Term' : '📝 Front'}
                </div>
                <p className="font-display font-semibold text-lg leading-snug">{cards[currentCard].front}</p>
                <p className="text-xs mt-4 opacity-50">Click to reveal answer</p>
              </div>
              <div className="flip-card-back">
                <div className="text-xs font-semibold mb-3 opacity-60 uppercase tracking-wider">
                  {cardType === 'Q&A' ? '✅ Answer' : cardType === 'Definition' ? '📝 Definition' : '✅ Back'}
                </div>
                <p className="text-base leading-relaxed">{cards[currentCard].back}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3">
            <button onClick={prev} disabled={currentCard === 0}
              className="glass-sm p-3 rounded-xl disabled:opacity-30 hover:scale-105 transition-transform">
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-2 flex-1">
              <button onClick={() => markCard('review')}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                style={{ background: '#FFDAC122', color: '#d97706', border: '1px solid #FFDAC1' }}>
                ↩ Review Later
              </button>
              <button onClick={() => markCard('know')}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                style={{ background: '#B5EAD722', color: '#059669', border: '1px solid #B5EAD7' }}>
                ✓ I Know This
              </button>
            </div>

            <button onClick={next} disabled={currentCard === cards.length - 1}
              className="glass-sm p-3 rounded-xl disabled:opacity-30 hover:scale-105 transition-transform">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Restart */}
          <button onClick={() => { setCurrentCard(0); setFlipped(false); setProgress({}); }}
            className="w-full btn-secondary py-2.5 text-sm flex items-center justify-center gap-2">
            <RotateCcw size={14} /> Restart Deck
          </button>
        </div>
      )}
    </div>
  );
}
