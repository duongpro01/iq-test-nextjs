import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 px-4 md:h-14 md:flex-row md:px-0">
        {/* Mobile: Simplified version */}
        <div className="flex flex-col items-center gap-3 md:hidden">
          <p className="text-center text-sm text-muted-foreground">
            © 2024 IQ Test System
          </p>
          <div className="flex items-center space-x-6">
            <Link
              href="/privacy"
              className="text-sm hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm hover:text-foreground transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>

        {/* Desktop: Full version */}
        <div className="hidden md:flex flex-col items-center gap-4 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with{" "}
            <Link
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 hover:text-foreground"
            >
              Next.js
            </Link>
            ,{" "}
            <Link
              href="https://tailwindcss.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 hover:text-foreground"
            >
              Tailwind CSS
            </Link>
            , and{" "}
            <Link
              href="https://www.radix-ui.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 hover:text-foreground"
            >
              Radix UI
            </Link>
            .
          </p>
        </div>
        <div className="hidden md:flex flex-col items-center space-y-2 text-sm text-muted-foreground md:flex-row md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-4">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms
            </Link>
          </div>
          <span className="text-center md:text-left">© 2024 IQ Test System</span>
        </div>
      </div>
    </footer>
  );
} 