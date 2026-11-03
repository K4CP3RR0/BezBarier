/** Stylized city-path plane for the full-bleed hero (no photo asset yet). */
export function HeroVisual() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_20%,oklch(0.92_0.04_145)_0%,oklch(0.97_0.01_106)_45%,oklch(0.94_0.02_200)_100%)]" />
      <div className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(oklch(0.45_0.04_145_/_0.08)_1px,transparent_1px),linear-gradient(90deg,oklch(0.45_0.04_145_/_0.08)_1px,transparent_1px)] [background-size:48px_48px]" />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M-40 620 C 180 540, 280 700, 520 640 C 760 580, 820 480, 1040 520 C 1260 560, 1340 420, 1520 460"
          stroke="oklch(0.45 0.06 145)"
          strokeWidth="56"
          strokeLinecap="round"
          opacity="0.18"
        />
        <path
          className="hero-path-dash"
          d="M-40 620 C 180 540, 280 700, 520 640 C 760 580, 820 480, 1040 520 C 1260 560, 1340 420, 1520 460"
          stroke="oklch(0.98 0.01 106)"
          strokeWidth="22"
          strokeLinecap="round"
          strokeDasharray="18 28"
          opacity="0.9"
        />
        <circle cx="520" cy="640" r="18" fill="oklch(0.35 0.08 145)" />
        <circle cx="520" cy="640" r="8" fill="oklch(0.98 0.01 106)" />
        <circle
          cx="1040"
          cy="520"
          r="14"
          fill="oklch(0.55 0.09 40)"
          opacity="0.85"
        />
        <rect
          x="980"
          y="360"
          width="28"
          height="72"
          rx="4"
          fill="oklch(0.4 0.05 145)"
          opacity="0.25"
          transform="rotate(12 994 396)"
        />
        <rect
          x="1180"
          y="280"
          width="36"
          height="100"
          rx="4"
          fill="oklch(0.4 0.05 145)"
          opacity="0.2"
          transform="rotate(-8 1198 330)"
        />
      </svg>
      <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-background/90 via-background/55 to-transparent sm:w-[70%]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
