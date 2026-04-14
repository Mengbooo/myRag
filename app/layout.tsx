import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My RAG',
  description: 'Document Q&A with RAG',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
