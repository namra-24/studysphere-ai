'use client';
import { useState, useRef, useCallback } from 'react';
import { Sparkles, FileText, Copy, Check } from 'lucide-react';

export default function SummaryPage() {
  const [pdfText, setPdfText] = useState('');
  const [pdfName, setPdfName] = useState('');
  const [summary, setSummary] = useState('');
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [summaryType, setSummaryType] = useState('Quick Summary');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.6.82/pdf.worker.min.js`;
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
      setPdfText(text); setPdfName(file.name);
    } catch { setError('Failed to read PDF.'); }
    finally { setUploading(false); }
  }, []);

  const generateSummary = async () => {
    if (!pdfText) return;
    setGenerating(true); setError(''); setSummary('');
    try {
      const res = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfText: pdfText.slice(0, 15000), summaryType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setSummary(data.summary);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="glass p-5">
        <h2 className="font-display font-semibold text-lg mb-4">📝 Summary Generator</h2>

        <div className="border-2 border-dashed rounded-xl p-5 text-center cursor-pointer mb-4"
          style={{ borderColor: pdfText ? '#86efac' : 'var(--border)' }}
          onClick={() => fileInputRef.current?.click()}>
          {uploading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="flex gap-1">{[0,1,2].map(i => <div key={i} className="typing-dot" />)}</div>
              <span className="text-sm">Reading...</span>
            </div>
          ) : pdfText ? (
            <span className="text-green-600 text-sm font-medium">✓ {pdfName}</span>
          ) : (
            <div><div className="text-2xl mb-1">📄</div><p className="text-sm" style={{ color: 'var(--muted)' }}>Click to upload PDF</p></div>
          )}
          <input ref={fileInputRef} type="file" accept=".pdf" className="hidden"
            onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
        </div>

        <div className="mb-4">
          <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--muted)' }}>SUMMARY TYPE</label>
          <div className="flex flex-wrap gap-2">
            {['Quick Summary', 'Detailed Summary', 'One Page Summary', 'Bullet Points', 'Exam Summary'].map(t => (
              <button key={t} onClick={() => setSummaryType(t)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{
                  background: summaryType === t ? 'linear-gradient(135deg, #CDB4DB, #A2D2FF)' : 'var(--card)',
                  color: summaryType === t ? 'white' : 'var(--fg)',
                  border: '1px solid var(--border)'
                }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <button onClick={generateSummary} disabled={!pdfText || generating}
          className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 disabled:opacity-50">
          {generating ? (
            <><div className="flex gap-1">{[0,1,2].map(i => <div key={i} className="typing-dot w-2 h-2" />)}</div> Generating...</>
          ) : <><Sparkles size={15} /> Generate {summaryType}</>}
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {summary && (
        <div className="glass p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">{summaryType}</h3>
            <button onClick={copy} className="glass-sm px-3 py-1.5 text-xs flex items-center gap-1.5 hover:scale-105 transition-transform">
              {copied ? <><Check size={12} className="text-green-500" /> Copied!</> : <><Copy size={12} /> Copy</>}
            </button>
          </div>
          <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--muted)' }}>
            {summary}
          </div>
        </div>
      )}
    </div>
  );
}
