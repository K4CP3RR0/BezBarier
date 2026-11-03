const steps = [
  {
    number: "01",
    title: "Wybierz profil",
    description:
      "Zadeklaruj rolę — niewidomy, wózek lub wolontariusz. Interfejs i trasy dopasują się automatycznie.",
  },
  {
    number: "02",
    title: "Nawiguj głosem lub mapą",
    description:
      "Powiedz „Prowadź do…” albo wskaż cel na mapie. System omija schody, awarie wind i zgłoszone przeszkody.",
  },
  {
    number: "03",
    title: "Zgłaszaj i weryfikuj",
    description:
      "Dyktuj bariery w terenie. Wolontariusze potwierdzają zgłoszenia zdjęciem — dane stają się wiarygodne dla wszystkich.",
  },
] as const;

export function HowItWorks() {
  return (
    <section
      id="jak-to-dziala"
      aria-labelledby="how-heading"
      className="border-t border-border/80 bg-background py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <h2
          id="how-heading"
          className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
        >
          Jak to działa
        </h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Od profilu mobilności do trasy bez barier — w trzech krokach.
        </p>

        <ol className="mt-14 grid gap-12 sm:grid-cols-3 sm:gap-8">
          {steps.map((step) => (
            <li key={step.number}>
              <span className="font-heading text-sm font-medium tracking-widest text-primary/50">
                {step.number}
              </span>
              <h3 className="mt-3 font-heading text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
