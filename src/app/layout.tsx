import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StudySphere AI — Your AI-Powered Study Companion',
  description: 'Transform your study materials into interactive learning experiences with AI-powered flashcards, quizzes, summaries, and more.',
  keywords: 'AI study, flashcards, quiz generator, PDF chat, study assistant',
  openGraph: {
    title: 'StudySphere AI',
    description: 'Your AI-powered academic companion',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              const theme = localStorage.getItem('theme');
              if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              }
            } catch(e) {}
          `
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
