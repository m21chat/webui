"use client";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "highlight.js/styles/tokyo-night-dark.css";

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
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
