import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "বাংলা বিশ্বজয় — পৃথিবীকে বলুক বাংলা",
  description:
    "বিশ্বব্যাপী বাংলা ভাষা জনপ্রিয় করার রূপরেখা, আন্দোলন ও প্রতিজ্ঞা-মঞ্চ। ভাষা শহীদদের স্বপ্নে — বাংলা এবার বিশ্বের ভাষা।",
};

export const viewport: Viewport = {
  themeColor: "#0d0906",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="bn">
      <body className="bg-ink font-body text-cream antialiased">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Noto+Serif+Bengali:wght@500;600;700;800;900&display=swap"
        />
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
