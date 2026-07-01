import { useEffect } from "react";
import serifStorefront from "@/assets/yahya/serif-storefront.png.asset.json";
import serifLogo from "@/assets/yahya/serif-logo.png.asset.json";

const assetUrl = (path: string) => `https://episolve-rebrand.lovable.app${path}`;

const logoSrc = assetUrl(serifLogo.url);
const storefrontSrc = assetUrl(serifStorefront.url);

const palette = [
  { name: "Boutique Navy", hex: "#1F2A44", note: "Primary — signage, headlines" },
  { name: "Sand", hex: "#E9DFD1", note: "Secondary — backgrounds, packaging" },
  { name: "Warm Ivory", hex: "#F6F1EA", note: "Neutral — surfaces" },
  { name: "Deep Charcoal", hex: "#1A1A1A", note: "Body text, fine detail" },
];

const typography = [
  {
    role: "Primary Wordmark",
    face: "Refined Serif",
    usage: "Reserved for the logo lockup and hero moments only.",
    sample: "Yahya",
    className: "font-serif tracking-tight",
  },
  {
    role: "Headlines",
    face: "Modern Serif",
    usage: "Editorial headers, campaign titles, feature banners.",
    sample: "The Resort Edit",
    className: "font-serif",
  },
  {
    role: "Body & UI",
    face: "Clean Sans-Serif",
    usage: "Product copy, in-store signage, digital interface text.",
    sample: "Elevated swimwear, thoughtfully composed.",
    className: "font-sans",
  },
];

const usageRules = [
  { do: true, text: "Maintain generous clear space equal to the height of the 'Y' around the wordmark." },
  { do: true, text: "Use the wordmark in Boutique Navy on Warm Ivory or Sand for primary applications." },
  { do: true, text: "Reserve the serif wordmark for brand moments — pair with clean sans for supporting copy." },
  { do: false, text: "Do not stretch, rotate, outline, or recolor the wordmark outside the approved palette." },
  { do: false, text: "Do not place the wordmark over busy imagery without a solid or scrimmed background." },
  { do: false, text: "Do not substitute the serif for another typeface, even a similar one." },
];

const YahyaPortfolio = () => {
  useEffect(() => {
    document.title = "Yahya Swimwear Boutique — Brand Kit";
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-0 sm:px-6 sm:py-4 lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Brand Kit
            </p>
            <h1 className="mt-1 text-lg font-semibold text-foreground sm:mt-2 sm:text-2xl">Yahya Swimwear Boutique</h1>
          </div>

          <nav aria-label="Page menu">
            <a
              href="#brand-kit"
              className="text-xs font-semibold uppercase tracking-[0.28em] text-foreground transition-opacity hover:opacity-70 sm:text-sm"
            >
              Brand Kit
            </a>
          </nav>
        </div>
      </header>

      <section id="brand-kit" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-16">
        {/* Intro */}
        <div className="mb-12 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Approved Direction — Refined Serif
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-foreground sm:text-3xl md:text-4xl">
            Clean, elevated, and fashion-led — the visual foundation for Yahya Swimwear Boutique.
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
            This brand kit documents the approved wordmark, color system, typography, and usage
            standards. Use it as the single reference for every touchpoint — from storefront signage
            to packaging, print, and digital.
          </p>
        </div>

        {/* Wordmark */}
        <section className="mb-12 overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm">
          <div className="grid grid-cols-1 gap-px bg-border/60 xl:grid-cols-2">
            <div className="bg-card p-6 sm:p-8 md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                01 — Primary Wordmark
              </p>
              <h3 className="mt-3 text-xl font-semibold text-foreground sm:text-2xl">The Yahya Wordmark</h3>
              <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
                A refined serif wordmark that leads with elegance and legibility. Use as the primary
                identifier across signage, hangtags, packaging, and digital surfaces.
              </p>
              <div className="mt-6 overflow-hidden rounded-md border border-border/70 bg-white">
                <img
                  src={logoSrc}
                  alt="Yahya Swimwear Boutique refined serif wordmark"
                  className="aspect-[4/3] w-full object-contain"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="bg-card p-4 sm:p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                In Context — Storefront
              </p>
              <div className="mt-4 overflow-hidden rounded-md border border-border/70 bg-secondary/35">
                <img
                  src={storefrontSrc}
                  alt="Yahya Swimwear Boutique wordmark on storefront signage"
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Color palette */}
        <section className="mb-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">02 — Color</p>
              <h3 className="mt-2 text-xl font-semibold text-foreground sm:text-2xl">Color Palette</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {palette.map((c) => (
              <div key={c.hex} className="overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm">
                <div className="h-28 w-full sm:h-32" style={{ backgroundColor: c.hex }} />
                <div className="p-4">
                  <p className="text-sm font-semibold text-foreground">{c.name}</p>
                  <p className="mt-0.5 font-mono text-xs uppercase text-muted-foreground">{c.hex}</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{c.note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section className="mb-12">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">03 — Typography</p>
            <h3 className="mt-2 text-xl font-semibold text-foreground sm:text-2xl">Type System</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {typography.map((t) => (
              <div key={t.role} className="overflow-hidden rounded-lg border border-border/70 bg-card p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">{t.role}</p>
                <p className={`mt-4 text-3xl text-foreground sm:text-4xl ${t.className}`}>{t.sample}</p>
                <p className="mt-4 text-sm font-medium text-foreground">{t.face}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{t.usage}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Usage rules */}
        <section className="mb-4">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">04 — Usage</p>
            <h3 className="mt-2 text-xl font-semibold text-foreground sm:text-2xl">Do & Don't</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-border/70 bg-card p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Do</p>
              <ul className="mt-4 space-y-3">
                {usageRules.filter((r) => r.do).map((r) => (
                  <li key={r.text} className="flex gap-3 text-sm leading-6 text-foreground">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                    {r.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-border/70 bg-card p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-700">Don't</p>
              <ul className="mt-4 space-y-3">
                {usageRules.filter((r) => !r.do).map((r) => (
                  <li key={r.text} className="flex gap-3 text-sm leading-6 text-foreground">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-600" />
                    {r.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};

export default YahyaPortfolio;