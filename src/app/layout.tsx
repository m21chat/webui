"use client";
import "./globals.css";
import "highlight.js/styles/tokyo-night-dark.css";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>m21.chat - Worlds most accessible accessibleAI</title>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
