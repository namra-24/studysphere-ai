import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { pdfText, summaryType } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API key not set. Add GEMINI_API_KEY to .env.local' }, { status: 500 });
    }

    const instructions: Record<string, string> = {
      'Quick Summary': 'Write a concise 3-4 paragraph summary covering the most important points. Keep it easy to read.',
      'Detailed Summary': 'Write a comprehensive summary covering all major topics, concepts, and details. Organize by sections.',
      'One Page Summary': 'Write a summary that fits on one page. Use short paragraphs. Cover all key points concisely.',
      'Bullet Points': 'Create organized bullet point notes. Group related points. Use sub-bullets for details. Make it scannable.',
      'Exam Summary': 'Create exam-focused notes. Highlight key definitions, formulas, important dates, and likely exam topics. Mark high-priority items with ⭐.',
    };

    const prompt = `You are a study assistant. Summarize the following study material in the style of: ${summaryType}.

Instructions: ${instructions[summaryType] || instructions['Quick Summary']}

Study Material:
${pdfText}

Write the summary now. Be accurate and educational.`;

    const response = await fetch(
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}      {
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

    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return NextResponse.json({ summary });

  } catch (error: any) {
    console.error('Summary API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate summary' }, { status: 500 });
  }
}
