import './globals.css';
import Providers from '@/components/Providers';

export const metadata = {
  title: 'HireSense AI - The Next Gen AI-Powered Recruitment Platform',
  description: 'Enterprise recruitment platform with automated ATS parsing, semantic vector job matching, AI interviewer simulators, and a sandboxed coding playground.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-[#1B263B] text-[#E0E1DD]" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
