import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/newui/components/ui/sonner";
import { ThemeProvider } from "@/newui/components/ThemeProvider";

export const metadata: Metadata = {
  title: "ChronoFlow",
  description: "Real-Time Yield Streams as NFTs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>
          <div className="relative flex min-h-screen w-full flex-col">
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
