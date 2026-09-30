import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Scroll Car Animation | Recreation',
  description: 'Faithful recreation of car scroll animation using Next.js 14 and GSAP.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#d1d1d1] text-[#111111]">
        {children}
      </body>
    </html>
  );
}
