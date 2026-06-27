import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tech Blog Admin",
  description: "게시물 작성과 실시간 미리보기를 지원하는 관리자 도구",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-violet-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
