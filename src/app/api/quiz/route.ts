import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { pdfText, difficulty, count } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API key not set. Add GEMINI_API_KEY to .env.local' }, { status: 500 });
    }

    const difficultyGuide: Record<string, string> = {
      Easy: 'Simple recall questions. Straightforward answers obvious from the text.',
      Medium: 'Application and comprehension questions. Require understanding, not just memorization.',
      Hard: 'Analysis and critical thinking. Require deep understanding, comparison, or inference.',
    };

    const prompt = `You are a quiz generator. Based on the following study material, create exactly ${count} multiple choice questions.

Difficulty: ${difficulty} — ${difficultyGuide[difficulty]}

Study Material:
${pdfText}

Return ONLY a valid JSON array. No markdown, no explanation. Just:
[
  {
    "question": "...",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "answer": "A. ...",
    "explanation": "Brief explanation of why this is correct."
  }
]

Rules:
- Each question has exactly 4 options labeled A, B, C, D
- The "answer" field must exactly match one of the options
- All options must be plausible
- Questions must be based on the provided material only`;

    const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 1000 },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Gemini API error');
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    const cleaned = text.replace(/```json|```/g, '').trim();
    const questions = JSON.parse(cleaned);

    if (!Array.isArray(questions)) throw new Error('Invalid format');

    return NextResponse.json({ questions: questions.slice(0, count) });

  } catch (error: any) {
    console.error('Quiz API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate quiz' }, { status: 500 });
  }
}
