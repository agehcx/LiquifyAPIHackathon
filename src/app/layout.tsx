import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { TopNav } from "@/components/layout/TopNav";

// Brand primary face is "Terrova" (see design/ci-brand.md). Inter is the dev
// stand-in until licensed Terrova files are added; mono is JetBrains Mono.
const fontSans = Inter({
  variable: "--font-sans-app",
  subsets: ["latin"],
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono-app",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DeFi TaxGen — Your DeFi taxes, done in 3 minutes",
  description:
    "Paste a wallet address, get a tax-ready DeFi report. No account, no subscription — pay $2 USDC only when you export.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-canvas text-ink">
        <Providers>
          <TopNav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
