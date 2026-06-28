import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages, pdfText } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API key not set. Add GEMINI_API_KEY to .env.local' }, { status: 500 });
    }

    const systemPrompt = `You are StudySphere AI, an intelligent study assistant. You have access to the following study material extracted from a PDF:

--- START OF PDF CONTENT ---
${pdfText}
--- END OF PDF CONTENT ---

Your job is to help the student understand this material. You can:
- Answer questions about the content
- Explain concepts clearly
- Summarize sections
- Create practice questions on the spot
- Connect ideas within the material

Be concise, accurate, and encouraging. If asked about something not in the document, say so clearly.
Format your responses with proper line breaks for readability. Use **bold** for key terms.`;

    // Build conversation history for Gemini
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { maxOutputTokens: 1000 },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Gemini API error');
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
    return NextResponse.json({ response: text });

  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
