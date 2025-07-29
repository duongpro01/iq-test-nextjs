import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://your-domain.com'),
  title: {
    default: "Adaptive IQ Test System",
    template: "%s | Adaptive IQ Test System"
  },
  description: "Advanced IQ test with adaptive difficulty, real-time scoring, and detailed analytics. Simulate real-world standardized IQ tests with pattern recognition, spatial reasoning, logic, and more.",
  keywords: ["IQ test", "intelligence test", "adaptive testing", "cognitive assessment", "pattern recognition", "spatial reasoning"],
  authors: [{ name: "IQ Test System" }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    siteName: 'Adaptive IQ Test System',
    title: 'Adaptive IQ Test System',
    description: 'Advanced IQ test with adaptive difficulty and real-time scoring',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Adaptive IQ Test System'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Adaptive IQ Test System',
    description: 'Advanced IQ test with adaptive difficulty and real-time scoring',
    images: ['/twitter-image.jpg'],
    creator: '@yourusername'
  },
  alternates: {
    canonical: 'https://your-domain.com',
    languages: {
      'en': '/en',
      'vi': '/vi'
    }
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  }
};

// Structured data for the application
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Adaptive IQ Test System",
  "description": "Advanced IQ test with adaptive difficulty, real-time scoring, and detailed analytics.",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Adaptive difficulty",
    "Real-time scoring",
    "Detailed analytics",
    "Pattern recognition",
    "Spatial reasoning",
    "Logical deduction"
  ],
  "browserRequirements": "Requires JavaScript. Best viewed in modern browsers.",
  "permissions": "No special permissions required"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
