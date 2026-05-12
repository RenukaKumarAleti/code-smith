import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://codesmith.spotmies.ai"),
  title: {
    default: "CODE-SMITH — Turn any idea into production-ready software",
    template: "%s — CODE-SMITH",
  },
  description:
    "Five AI prompts that work together as a complete system. Start with an idea. Ship clean, production-grade code.",
  openGraph: {
    title: "CODE-SMITH",
    description:
      "Five AI prompts that work together as a complete system. Start with an idea. Ship clean, production-grade code.",
    url: "https://codesmith.spotmies.ai",
    siteName: "CODE-SMITH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CODE-SMITH",
    description: "Idea → PRD → Architecture → Design → Spec → Code → Audit.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${jetBrainsMono.variable}`}
    >
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
