import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="font-heading text-sm font-semibold tracking-tight text-foreground">
          BezBarier
        </p>
        <p className="text-sm text-muted-foreground">
          Platforma nawigacji miejskiej i audytu barier · MVP
        </p>
        <Link
          href="#main"
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Do góry
        </Link>
      </div>
    </footer>
  );
}
