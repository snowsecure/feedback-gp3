import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Feedback Coaching",
  description: "Practice giving feedback to employees with AI coaching.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="site-header">
          <div className="header-brand">
            <Image
              src="/stewart-logo.png"
              alt="Stewart logo"
              className="logo"
              width={180}
              height={52}
              priority
            />
            <h1 className="site-title">Feedback Coaching</h1>
          </div>
          <span className="created-by">Created by SAIL</span>
        </header>
        {children}
      </body>
    </html>
  );
}
