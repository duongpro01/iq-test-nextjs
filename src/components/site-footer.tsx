export function SiteFooter() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with{" "}
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Next.js
          </a>
          ,{" "}
          <a
            href="https://tailwindcss.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Tailwind CSS
          </a>
          , and{" "}
          <a
            href="https://www.radix-ui.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Radix UI
          </a>
          .
        </p>
        <div className="flex items-center space-x-1">
          <a
            href="/privacy"
            className="text-sm text-muted-foreground hover:underline"
          >
            Privacy
          </a>
          <span className="text-muted-foreground">·</span>
          <a
            href="/terms"
            className="text-sm text-muted-foreground hover:underline"
          >
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
} 