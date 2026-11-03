import Link from "next/link";
import { Mic, Accessibility, HandHeart } from "lucide-react";
import { Button } from "@/components/ui/button";

const roles = [
  {
    id: "BLIND",
    href: "/onboarding?role=BLIND",
    icon: Mic,
    title: "Niewidomy / słabowidzący",
    description:
      "Sterowanie głosem, TTS i audiodeskrypcja trasy — bez precyzyjnego celowania w ekran.",
  },
  {
    id: "WHEELCHAIR",
    href: "/onboarding?role=WHEELCHAIR",
    icon: Accessibility,
    title: "Wózek / ograniczona mobilność",
    description:
      "Mapa wysokiego kontrastu i trasy bez schodów, z kontrolą nachyleń i szerokości przejść.",
  },
  {
    id: "VOLUNTEER",
    href: "/onboarding?role=VOLUNTEER",
    icon: HandHeart,
    title: "Wolontariusz / audytor",
    description:
      "Weryfikuj zgłoszenia w okolicy, dodawaj zdjęcia i potwierdzaj stan barier na mapie.",
  },
] as const;

export function RolesPreview() {
  return (
    <section
      id="role"
      aria-labelledby="roles-heading"
      className="border-t border-border/80 bg-secondary/40 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <h2
          id="roles-heading"
          className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
        >
          Wybierz sposób pracy
        </h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Rola ustalona przy starcie determinuje interfejs i algorytm tras.
        </p>

        <ul className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <li key={role.id}>
                <Link
                  href={role.href}
                  className="group block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Icon
                    className="size-7 text-primary transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                  <h3 className="mt-4 font-heading text-lg font-semibold text-foreground group-hover:underline group-hover:underline-offset-4">
                    {role.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {role.description}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-14">
          <Button
            size="lg"
            className="h-11 px-5 text-sm"
            render={<Link href="/onboarding" />}
            nativeButton={false}
          >
            Przejdź do wyboru profilu
          </Button>
        </div>
      </div>
    </section>
  );
}
