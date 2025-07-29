import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Toaster } from "@/components/ui/toaster";
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://your-domain.com'),
  title: {
    default: "Adaptive IQ Test System",
    template: "%s | Adaptive IQ Test System"
  },
  description: "Advanced IQ test with adaptive difficulty, real-time scoring, and detailed analytics. Simulate real-world standardized IQ tests with pattern recognition, spatial reasoning, logic, and more.",
  keywords: ["IQ test", "intelligence test", "adaptive testing", "cognitive assessment", "pattern recognition", "spatial reasoning"],
  authors: [{ name: "IQ Test System" }],
  viewport: "width=device-width, initial-scale=1",
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
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 items-center justify-between">
                <div className="mr-4 hidden md:flex">
                  <a 
                    className="mr-6 flex items-center space-x-2" 
                    href="/"
                    aria-label="Home"
                  >
                    <span className="hidden font-bold sm:inline-block">
                      IQ Test System
                    </span>
                  </a>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                  <ThemeToggle />
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t py-6 md:py-0">
              <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                  Built with Next.js, Tailwind CSS, and Radix UI.
                </p>
              </div>
            </footer>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
