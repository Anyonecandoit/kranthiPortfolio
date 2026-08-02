import './globals.css';

export const metadata = {
  title: 'Kranthi Kumar Katta | SDET 2 & QA Automation Engineer',
  description: 'Portfolio of Kranthi Kumar Katta, SDET 2 specializing in Fintech, Microservices, and API Testing.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
