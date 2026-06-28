import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { pdfText, cardType, count } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API key not set. Add GEMINI_API_KEY to .env.local' }, { status: 500 });
    }

    const typeInstructions: Record<string, string> = {
      'Q&A': 'Create question-answer flashcards. Front = question. Back = clear answer.',
      'Definition': 'Create definition flashcards. Front = term or concept. Back = definition.',
      'Fill in the Blank': 'Create fill-in-the-blank cards. Front = sentence with a key word replaced by "___". Back = the missing word and full sentence.',
      'True/False': 'Create true/false flashcards. Front = statement. Back = True or False with explanation.',
      'Concept': 'Create concept cards. Front = concept name. Back = explanation with an example.',
    };

    const prompt = `You are a study assistant. Based on the following study material, generate exactly ${count} flashcards of type: ${cardType}.

${typeInstructions[cardType] || typeInstructions['Q&A']}

Study Material:
${pdfText}

Return ONLY a valid JSON array.

Rules:
- Do NOT use markdown.
- Do NOT use ```json.
- Do NOT explain anything.
- Do NOT include any text before or after the array.
- Escape all quotation marks inside strings.
- Every string must begin and end with double quotes.
- The response must be valid JSON that can be parsed directly.

Example:
[
  {
    "front": "What is photosynthesis?",
    "back": "The process by which plants convert light energy into chemical energy."
  }
]

Make the cards educational, accurate, and based only on the provided material.`;

    const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
  maxOutputTokens: 2000,
  temperature: 0.2,
},
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Gemini API error');
    }

const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

// Remove markdown fences if present
let cleaned = text.replace(/```json|```/gi, "").trim();

// Keep only the JSON array
const start = cleaned.indexOf("[");
const end = cleaned.lastIndexOf("]");

if (start !== -1 && end !== -1) {
  cleaned = cleaned.substring(start, end + 1);
}

let cards;

try {
  cards = JSON.parse(cleaned);
} catch (err) {
  console.error("Gemini returned invalid JSON:", cleaned);
  throw new Error("AI returned an invalid flashcard format. Please try again.");
}

if (!Array.isArray(cards)) {
  throw new Error("Invalid response format");
}

    if (!Array.isArray(cards)) throw new Error('Invalid response format');

    return NextResponse.json({ cards: cards.slice(0, count) });

  } catch (error: any) {
    console.error('Flashcards API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate flashcards' }, { status: 500 });
  }
}
