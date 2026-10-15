import type { Metadata, Viewport } from "next";
import { Chakra_Petch, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plex = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const chakra = Chakra_Petch({
  variable: "--font-chakra",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const title = "Quang Truong Ngoc — Backend Engineer, Payments";
const description =
  "Backend engineer in Espoo, Finland. Owns the payment layer of a multi-market iGaming platform: 34 provider integrations, idempotent callbacks, and the Claude-based harness the team codes with.";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL("https://quangtruong.dev"),
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Quang Truong Ngoc",
    type: "profile",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#08070E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plex.variable} ${chakra.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ink-1 text-chrome font-sans">{children}</body>
    </html>
  );
}
