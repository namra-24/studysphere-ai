'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Send, FileText, X, Sparkles, Bot, User, RefreshCw } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function PDFChatPage() {
  const [pdfText, setPdfText] = useState('');
  const [pdfName, setPdfName] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const pdfjsLib = await import('pdfjs-dist');
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= Math.min(pdf.numPages, 30); i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
    }
    return fullText.trim();
  };

  const handleFile = useCallback(async (file: File) => {
    if (!file || file.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('File too large. Max 20MB.');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const text = await extractTextFromPDF(file);
      if (!text || text.length < 50) throw new Error('Could not extract text. Try another PDF.');
      setPdfText(text);
      setPdfName(file.name);
      setMessages([{
        role: 'assistant',
        content: `✅ I've read **${file.name}** (${pdf_pages(text)} pages worth of content). Ask me anything about it!\n\nHere's a quick preview of what I found:\n\n"${text.slice(0, 200)}..."`,
        timestamp: new Date()
      }]);
    } catch (e: any) {
      setError(e.message || 'Failed to read PDF.');
    } finally {
      setUploading(false);
    }
  }, []);

  function pdf_pages(text: string) {
    return Math.ceil(text.length / 3000);
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const sendMessage = async () => {
    if (!input.trim() || !pdfText || loading) return;
    const userMsg: Message = { role: 'user', content: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          pdfText: pdfText.slice(0, 15000),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'API error');
      setMessages(prev => [...prev, { role: 'assistant', content: data.response, timestamp: new Date() }]);
    } catch (e: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ ${e.message === 'Failed to fetch' ? 'Could not connect. Make sure your API key is set in .env.local' : e.message}`,
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setPdfText('');
    setPdfName('');
    setMessages([]);
    setInput('');
    setError('');
  };

  const suggestedQuestions = [
    'Summarize the main topics',
    'What are the key concepts?',
    'Create 5 important questions',
    'Explain the most difficult part',
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col gap-4">
      {/* Upload area */}
      {!pdfText ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div
            className={`glass w-full max-w-lg p-10 text-center cursor-pointer transition-all ${dragOver ? 'ring-2 ring-blue-400 scale-105' : ''}`}
            style={{ borderStyle: 'dashed' }}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ background: '#A2D2FF22' }}>📖</div>
                <div className="font-semibold">Reading your PDF...</div>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map(i => <div key={i} className="typing-dot" />)}
                </div>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
                  style={{ background: '#A2D2FF22' }}>📄</div>
                <div className="font-display font-semibold text-lg mb-2">Upload your PDF</div>
                <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
                  Drag & drop or click to browse<br />Max 20MB • Any textbook, notes, or document
                </p>
                <button className="btn-primary text-sm py-2 px-6">
                  <Upload size={14} className="inline mr-2" /> Choose PDF
                </button>
              </>
            )}
            <input ref={fileInputRef} type="file" accept=".pdf" className="hidden"
              onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
          </div>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

          <div className="mt-8 text-center">
            <p className="text-sm font-medium mb-3" style={{ color: 'var(--muted)' }}>What you can ask after uploading:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestedQuestions.map(q => (
                <span key={q} className="glass-sm px-3 py-1.5 text-xs rounded-full">{q}</span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* PDF info bar */}
          <div className="glass-sm flex items-center gap-3 px-4 py-3">
            <FileText size={16} style={{ color: '#A2D2FF' }} />
            <span className="text-sm font-medium flex-1 truncate">{pdfName}</span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#A2D2FF22', color: '#A2D2FF' }}>
              Ready
            </span>
            <button onClick={resetChat} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
              <X size={14} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user'
                    ? 'text-white'
                    : 'glass-sm'
                }`} style={msg.role === 'user' ? { background: 'linear-gradient(135deg, #CDB4DB, #A2D2FF)' } : {}}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>

                {/* Bubble */}
                <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-xs mt-1 opacity-60">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full glass-sm flex items-center justify-center flex-shrink-0">
                  <Bot size={14} />
                </div>
                <div className="chat-bubble-ai">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map(i => <div key={i} className="typing-dot" />)}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested questions */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map(q => (
                <button key={q} onClick={() => setInput(q)}
                  className="glass-sm px-3 py-1.5 text-xs rounded-full hover:scale-105 transition-transform">
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="glass-sm flex gap-2 p-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Ask anything about your PDF..."
              className="flex-1 bg-transparent text-sm outline-none px-2"
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white disabled:opacity-40 transition-all hover:scale-110"
              style={{ background: 'linear-gradient(135deg, #CDB4DB, #A2D2FF)' }}>
              <Send size={15} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
