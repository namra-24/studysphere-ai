'use client';
import { useState, useRef, useCallback } from 'react';
import { Upload, Sparkles, CheckCircle, XCircle, RotateCcw, FileText, Trophy } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export default function QuizPage() {
  const [pdfText, setPdfText] = useState('');
  const [pdfName, setPdfName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizDone, setQuizDone] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [count, setCount] = useState(5);
  const [quizStarted, setQuizStarted] = useState(false);
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
      setPdfText(text);
      setPdfName(file.name);
    } catch {
      setError('Failed to read PDF.');
    } finally {
      setUploading(false);
    }
  }, []);

  const generateQuiz = async () => {
    if (!pdfText) return;
    setGenerating(true); setError('');
    setQuestions([]); setAnswers({}); setCurrentQ(0); setQuizDone(false); setQuizStarted(false);
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfText: pdfText.slice(0, 12000), difficulty, count }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate');
      setQuestions(data.questions);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  };

  const selectAnswer = (option: string) => {
    if (selected) return;
    setSelected(option);
    setAnswers(prev => ({ ...prev, [currentQ]: option }));
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
      setSelected(null);
    } else {
      setQuizDone(true);
    }
  };

  const score = Object.entries(answers).filter(([i, a]) => questions[Number(i)]?.answer === a).length;
  const percentage = questions.length ? Math.round((score / questions.length) * 100) : 0;

  const getScoreEmoji = () => {
    if (percentage >= 90) return '🏆';
    if (percentage >= 70) return '🎉';
    if (percentage >= 50) return '📚';
    return '💪';
  };

  const getScoreMessage = () => {
    if (percentage >= 90) return 'Outstanding! You nailed it!';
    if (percentage >= 70) return 'Great job! Keep it up!';
    if (percentage >= 50) return 'Good effort. Review and retry!';
    return 'Keep studying — you\'ve got this!';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Setup */}
      {questions.length === 0 && (
        <div className="glass p-5">
          <h2 className="font-display font-semibold text-lg mb-4">🎯 Quiz Generator</h2>

          <div
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all mb-4`}
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
                <span className="text-sm font-medium">{pdfName} ✓</span>
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

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--muted)' }}>DIFFICULTY</label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl outline-none"
                style={{ background: 'var(--card)', color: 'var(--fg)', border: '1px solid var(--border)' }}>
                {['Easy', 'Medium', 'Hard'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--muted)' }}>QUESTIONS</label>
              <select value={count} onChange={e => setCount(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-xl outline-none"
                style={{ background: 'var(--card)', color: 'var(--fg)', border: '1px solid var(--border)' }}>
                {[3, 5, 10].map(n => <option key={n} value={n}>{n} questions</option>)}
              </select>
            </div>
          </div>

          <button onClick={generateQuiz} disabled={!pdfText || generating}
            className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 disabled:opacity-50">
            {generating ? (
              <><div className="flex gap-1">{[0,1,2].map(i => <div key={i} className="typing-dot w-2 h-2" />)}</div> Generating...</>
            ) : (
              <><Sparkles size={15} /> Generate Quiz</>
            )}
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      )}

      {/* Results */}
      {quizDone && (
        <div className="glass p-8 text-center">
          <div className="text-6xl mb-4">{getScoreEmoji()}</div>
          <h3 className="font-display font-bold text-2xl mb-2">Quiz Complete!</h3>
          <p className="mb-4" style={{ color: 'var(--muted)' }}>{getScoreMessage()}</p>

          <div className="glass-sm inline-flex items-center gap-3 px-8 py-4 mb-6">
            <div>
              <div className="font-display font-black text-4xl gradient-text">{percentage}%</div>
              <div className="text-sm" style={{ color: 'var(--muted)' }}>{score}/{questions.length} correct</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6 text-sm">
            <div className="glass-sm p-3 text-center">
              <div className="font-bold text-green-500">{score}</div>
              <div style={{ color: 'var(--muted)' }}>Correct</div>
            </div>
            <div className="glass-sm p-3 text-center">
              <div className="font-bold text-red-400">{questions.length - score}</div>
              <div style={{ color: 'var(--muted)' }}>Wrong</div>
            </div>
            <div className="glass-sm p-3 text-center">
              <div className="font-bold gradient-text">{difficulty}</div>
              <div style={{ color: 'var(--muted)' }}>Level</div>
            </div>
          </div>

          {/* Answer review */}
          <div className="text-left space-y-3 mb-6">
            <h4 className="font-semibold text-sm">Answer Review:</h4>
            {questions.map((q, i) => (
              <div key={i} className="glass-sm p-3 rounded-xl">
                <div className="flex items-start gap-2 mb-1">
                  {answers[i] === q.answer
                    ? <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                    : <XCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                  }
                  <p className="text-sm font-medium">{q.question}</p>
                </div>
                {answers[i] !== q.answer && (
                  <p className="text-xs ml-6" style={{ color: 'var(--muted)' }}>
                    ✅ Correct: <span className="font-medium text-green-500">{q.answer}</span><br />
                    ❌ Your answer: <span className="text-red-400">{answers[i]}</span>
                  </p>
                )}
                <p className="text-xs ml-6 mt-1 italic" style={{ color: 'var(--muted)' }}>{q.explanation}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => { setCurrentQ(0); setAnswers({}); setSelected(null); setQuizDone(false); }}
              className="flex-1 btn-secondary py-2.5 text-sm flex items-center justify-center gap-2">
              <RotateCcw size={14} /> Retake
            </button>
            <button onClick={() => { setQuestions([]); setPdfText(''); setPdfName(''); }}
              className="flex-1 btn-primary py-2.5 text-sm flex items-center justify-center gap-2">
              New Quiz
            </button>
          </div>
        </div>
      )}

      {/* Active Quiz */}
      {questions.length > 0 && !quizDone && (
        <div className="space-y-4">
          {/* Header */}
          <div className="glass-sm flex items-center justify-between px-4 py-2.5">
            <span className="text-sm" style={{ color: 'var(--muted)' }}>
              Q {currentQ + 1} / {questions.length}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{
                background: difficulty === 'Easy' ? '#B5EAD722' : difficulty === 'Hard' ? '#FFC8DD22' : '#A2D2FF22',
                color: difficulty === 'Easy' ? '#059669' : difficulty === 'Hard' ? '#be185d' : '#0369a1'
              }}>
              {difficulty}
            </span>
          </div>

          {/* Progress */}
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: `${((currentQ + 1) / questions.length) * 100}%`, background: 'linear-gradient(90deg, #CDB4DB, #A2D2FF)' }} />
          </div>

          {/* Question */}
          <div className="glass p-6">
            <h3 className="font-display font-semibold text-lg leading-snug mb-6">
              {questions[currentQ].question}
            </h3>

            <div className="space-y-3">
              {questions[currentQ].options.map((opt) => {
                const isCorrect = opt === questions[currentQ].answer;
                const isSelected = opt === selected;
                let bg = 'var(--card)', border = 'var(--border)', textColor = 'var(--fg)';
                if (selected) {
                  if (isCorrect) { bg = '#B5EAD744'; border = '#86efac'; textColor = '#059669'; }
                  else if (isSelected) { bg = '#FFC8DD44'; border = '#f9a8d4'; textColor = '#be185d'; }
                }
                return (
                  <button key={opt} onClick={() => selectAnswer(opt)}
                    className="w-full text-left p-3.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.01]"
                    style={{ background: bg, border: `1.5px solid ${border}`, color: textColor }}>
                    {opt}
                    {selected && isCorrect && <span className="float-right">✅</span>}
                    {selected && isSelected && !isCorrect && <span className="float-right">❌</span>}
                  </button>
                );
              })}
            </div>

            {selected && (
              <div className="mt-4 p-3 rounded-xl text-sm" style={{ background: '#A2D2FF22' }}>
                <span className="font-semibold">💡 </span>
                {questions[currentQ].explanation}
              </div>
            )}
          </div>

          {selected && (
            <button onClick={nextQuestion} className="btn-primary w-full py-2.5">
              {currentQ < questions.length - 1 ? 'Next Question →' : 'See Results 🏆'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
