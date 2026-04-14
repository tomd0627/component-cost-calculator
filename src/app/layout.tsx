import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
  weight: ["600", "700", "800"],
});

export const viewport: Viewport = {
  colorScheme: "dark light",
};

export const metadata: Metadata = {
  title: "Component Cost Calculator",
  description:
    "Quantify the true cost of building a design system from scratch vs. adopting open-source primitives or licensing a commercial library — including the accessibility debt most teams forget to budget for.",
  keywords: [
    "design system",
    "component library",
    "build vs buy",
    "accessibility cost",
    "WCAG",
    "Radix UI",
    "shadcn",
    "front-end architecture",
  ],
  authors: [{ name: "Tom DeLuca", url: "https://tomdeluca.dev" }],
  openGraph: {
    title: "Component Cost Calculator",
    description:
      "Should your team build, borrow, or buy? Get a research-backed cost estimate in seconds.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Component Cost Calculator",
    description:
      "Should your team build, borrow, or buy? Get a research-backed cost estimate in seconds.",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
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
      // Default dark; the inline script below overwrites this before paint.
      data-theme="dark"
      className={`${inter.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Runs synchronously before any paint so the correct data-theme is
          applied before CSS is rendered — eliminating the dark→light flash.
          suppressHydrationWarning on <html> handles any SSR/client mismatch.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('ccc-theme');var p=t||(window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',p);document.documentElement.classList.add('no-transitions')}catch(e){}})()`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <a href="#main-content" className="skip-nav">
            Skip to main content
          </a>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
