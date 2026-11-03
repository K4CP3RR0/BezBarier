import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "@/components/landing/hero-visual";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden pb-16 pt-28 sm:justify-center sm:pb-24 sm:pt-32">
      <HeroVisual />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-8">
        <div className="max-w-xl">
          <p className="landing-reveal landing-reveal-delay-1 font-heading text-5xl font-semibold tracking-tight text-foreground sm:text-7xl md:text-8xl">
            BezBarier
          </p>
          <h1 className="landing-reveal landing-reveal-delay-2 mt-5 max-w-md text-xl leading-snug text-foreground/90 sm:text-2xl">
            Bezpieczna nawigacja piesza i głosowe zgłaszanie barier miejskich.
          </h1>
          <p className="landing-reveal landing-reveal-delay-3 mt-4 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Trasy dopasowane do Twojego profilu mobilności — dla osób niewidomych,
            na wózku oraz wolontariuszy mapujących miasto.
          </p>
          <div className="landing-reveal landing-reveal-delay-4 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              size="lg"
              className="h-11 px-5 text-sm"
              render={<Link href="/onboarding" />}
              nativeButton={false}
            >
              Wybierz swój profil
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-11 px-5 text-sm"
              render={<Link href="#jak-to-dziala" />}
              nativeButton={false}
            >
              Jak to działa
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
