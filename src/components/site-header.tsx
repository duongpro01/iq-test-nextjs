"use client"

import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link 
            href="/" 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">IQ</span>
            </div>
            <span className="hidden font-bold sm:inline-block">
              IQ Test System
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link 
            href="/" 
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Home
          </Link>
          <Link 
            href="/test" 
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Take Test
          </Link>
          <Link 
            href="/settings" 
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Settings
          </Link>
        </nav>

        {/* Mobile Controls */}
        <div className="flex items-center space-x-3 md:space-x-2">
          <ThemeToggle />
          <button
            className="md:hidden p-3 hover:bg-accent rounded-md transition-colors active:scale-95"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <nav className="container px-4 py-6 space-y-4">
            <Link 
              href="/" 
              className="block py-3 px-4 text-base font-medium transition-colors hover:text-foreground/80 text-foreground/60 hover:bg-accent rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/test" 
              className="block py-3 px-4 text-base font-medium transition-colors hover:text-foreground/80 text-foreground/60 hover:bg-accent rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Take Test
            </Link>
            <Link 
              href="/settings" 
              className="block py-3 px-4 text-base font-medium transition-colors hover:text-foreground/80 text-foreground/60 hover:bg-accent rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Settings
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
} 