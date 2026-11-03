import { SiteHeader } from "@/components/landing/site-header";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { RolesPreview } from "@/components/landing/roles-preview";
import { SiteFooter } from "@/components/landing/site-footer";

export default function HomePage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Przejdź do treści
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        <Hero />
        <HowItWorks />
        <RolesPreview />
      </main>
      <SiteFooter />
    </>
  );
}
