import Link from "next/link";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import DashboardButton from "@/components/DashboardButton";
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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <header className="site-header">
          <div className="header-left">
            <Link href="/">
              <Image
                src="/stewart-logo.png"
                alt="Stewart logo"
                className="logo"
                width={180}
                height={52}
                priority
              />
            </Link>
          </div>
          <div className="header-center">
            <h1 className="site-title">Feedback Coaching</h1>
          </div>
          <div className="header-right">
            <DashboardButton />
            <a href="mailto:psnowden@stewart.com" style={{ marginLeft: '1rem' }}>
              <Image
                src="/sailboat-new.png"
                alt="SAIL logo"
                width={52}
                height={52}
                style={{ width: 'auto', height: '52px' }}
              />
            </a>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
