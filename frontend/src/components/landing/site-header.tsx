import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:h-20 sm:px-8">
        <Link
          href="/"
          className="font-heading text-lg font-semibold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          BezBarier
        </Link>
        <nav aria-label="Główne" className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="lg"
            className="hidden sm:inline-flex"
            render={<Link href="#jak-to-dziala" />}
            nativeButton={false}
          >
            Jak to działa
          </Button>
          <Button
            size="lg"
            render={<Link href="/onboarding" />}
            nativeButton={false}
          >
            Zacznij
          </Button>
        </nav>
      </div>
    </header>
  );
}
