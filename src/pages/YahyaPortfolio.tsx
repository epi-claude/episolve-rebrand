import { useEffect, useState } from "react";
import logoWhiteAsset from "@/assets/yahya/logo-white.png.asset.json";
import markWhiteAsset from "@/assets/yahya/mark-white.png.asset.json";
import markBlackAsset from "@/assets/yahya/mark-black.png.asset.json";
import storeTeal from "@/assets/yahya/store-teal.png.asset.json";
import storeCocoa from "@/assets/yahya/store-cocoa.png.asset.json";
import storeSeafoam from "@/assets/yahya/store-seafoam.png.asset.json";
import storeTerracotta from "@/assets/yahya/store-terracotta.png.asset.json";

const assetUrl = (path: string) => `https://episolve-rebrand.lovable.app${path}`;

const logoOnTeal = assetUrl(logoWhiteAsset.url);
const markWhite = assetUrl(markWhiteAsset.url);
const markBlack = assetUrl(markBlackAsset.url);

const palette = [
  { id: "teal", name: "Deep Teal", hex: "#0C3D3E", role: "Primary", logo: "white" as const },
  { id: "cocoa", name: "Cocoa Brown", hex: "#6A4F3F", role: "Secondary", logo: "white" as const },
  { id: "seafoam", name: "Seafoam", hex: "#5FA79B", role: "Accent", logo: "white" as const },
  { id: "sand", name: "Sand Beige", hex: "#E6DED3", role: "Neutral", logo: "black" as const },
  { id: "terracotta", name: "Terracotta", hex: "#C88E6B", role: "Accent", logo: "white" as const },
];

const storefronts = [
  { name: "Deep Teal Facade", hex: "#0C3D3E", src: assetUrl(storeTeal.url) },
  { name: "Terracotta Facade", hex: "#C88E6B", src: assetUrl(storeTerracotta.url) },
  { name: "Seafoam Facade", hex: "#5FA79B", src: assetUrl(storeSeafoam.url) },
  { name: "Cocoa Facade", hex: "#6A4F3F", src: assetUrl(storeCocoa.url) },
];

const typography = [
  { role: "Logotype", face: "Custom — inspired by Canela Display", note: "Use vector logo only. Never retype.", sample: "YAHYA", className: "font-serif tracking-[0.08em]" },
  { role: "Headlines", face: "Canela Display", note: "Editorial titles & luxury headlines.", sample: "The Resort Edit", className: "font-serif" },
  { role: "Subheads", face: "Cormorant Garamond", note: "Quotes, accents, refined captions.", sample: "Effortless coastal luxury", className: "font-serif italic" },
  { role: "Body & UI", face: "Inter", note: "Web, product copy, interface.", sample: "Elevated swimwear, thoughtfully composed.", className: "font-sans" },
];

const personality = ["Luxury", "Coastal", "Elegant", "Sophisticated", "Timeless", "Modern", "Relaxed", "Minimal", "Editorial", "Premium"];

const YahyaPortfolio = () => {
  const [active, setActive] = useState(palette[0]);

  useEffect(() => {
    document.title = "Yahya Swim & Resort Wear — Brand Identity";
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-0 sm:px-6 sm:py-4 lg:px-10">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground sm:text-xs">
              Brand Identity
            </p>
            <h1 className="mt-1 text-lg font-serif tracking-wide text-foreground sm:mt-2 sm:text-2xl">YAHYA — Swim &amp; Resort Wear</h1>
          </div>
          <nav aria-label="Page menu">
            <a href="#brand-kit" className="text-xs font-semibold uppercase tracking-[0.28em] text-foreground transition-opacity hover:opacity-70 sm:text-sm">
              Brand Kit
            </a>
          </nav>
        </div>
      </header>

      <section id="brand-kit" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        {/* Intro / Hero */}
        <div className="mx-auto mb-16 max-w-3xl text-center sm:mb-24">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-muted-foreground sm:text-xs">Brand Identity</p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-foreground sm:text-5xl md:text-6xl">
            Coastal luxury,<br />quietly composed.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
            The visual foundation for Yahya Swim &amp; Resort Wear — logotype, palette, typography, and applications.
          </p>
        </div>

        {/* Primary logo */}
        <section className="mb-16 sm:mb-24">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-muted-foreground sm:text-xs">01 — Logotype</p>
          <div className="mt-6 overflow-hidden rounded-lg">
            <img src={logoOnTeal} alt="Yahya Swim & Resort Wear logotype" className="w-full object-contain" loading="lazy" />
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            A bespoke high-contrast serif wordmark. Always use the official vector — never retype.
          </p>
        </section>

        {/* Interactive logo preview */}
        <section className="mb-16 sm:mb-24">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-muted-foreground sm:text-xs">02 — Logo Colour Preview</p>
          <h3 className="mt-3 font-serif text-2xl text-foreground sm:text-3xl">See the mark on every brand colour.</h3>

          <div
            className="mt-8 flex min-h-[280px] w-full items-center justify-center rounded-2xl px-6 py-16 transition-colors duration-300 sm:min-h-[380px] sm:py-24"
            style={{ backgroundColor: active.hex }}
          >
            <img
              key={active.id}
              src={active.logo === "white" ? markWhite : markBlack}
              alt={`Yahya wordmark on ${active.name}`}
              className="w-full max-w-md animate-[fade-in_300ms_ease-out] object-contain sm:max-w-lg"
            />
          </div>

          <div className="mt-6 flex flex-col items-center gap-6">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {palette.map((c) => {
                const isActive = c.id === active.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-label={`Preview on ${c.name}`}
                    aria-pressed={isActive}
                    onClick={() => setActive(c)}
                    className={`h-12 w-12 rounded-xl shadow-sm ring-offset-2 transition-transform duration-200 hover:scale-105 sm:h-14 sm:w-14 ${
                      isActive ? "ring-2 ring-foreground ring-offset-background" : "ring-1 ring-border/60"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                );
              })}
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">{active.name}</p>
              <p className="mt-0.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">{active.hex}</p>
            </div>
          </div>
        </section>

        {/* Palette */}
        <section className="mb-16 sm:mb-24">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-muted-foreground sm:text-xs">03 — Colour Palette</p>
          <h3 className="mt-3 font-serif text-2xl text-foreground sm:text-3xl">Five colours. One coastline.</h3>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {palette.map((c, i) => (
              <div key={c.hex} className="overflow-hidden rounded-lg">
                <div className="aspect-[3/4] w-full" style={{ backgroundColor: c.hex }} />
                <div className="pt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">0{i + 1} · {c.role}</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{c.name}</p>
                  <p className="mt-0.5 font-mono text-xs uppercase text-muted-foreground">{c.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Storefronts */}
        <section className="mb-16 sm:mb-24">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-muted-foreground sm:text-xs">04 — Storefront Applications</p>
          <h3 className="mt-3 font-serif text-2xl text-foreground sm:text-3xl">The mark, in the world.</h3>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {storefronts.map((s) => (
              <figure key={s.name} className="overflow-hidden rounded-lg bg-secondary/20">
                <img src={s.src} alt={`Yahya storefront — ${s.name}`} className="w-full object-contain" loading="lazy" />
                <figcaption className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm font-medium text-foreground">{s.name}</span>
                  <span className="font-mono text-xs uppercase text-muted-foreground">{s.hex}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section className="mb-16 sm:mb-24">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-muted-foreground sm:text-xs">05 — Typography</p>
          <h3 className="mt-3 font-serif text-2xl text-foreground sm:text-3xl">Type system.</h3>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {typography.map((t) => (
              <div key={t.role} className="rounded-lg border border-border/60 p-6 sm:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">{t.role}</p>
                <p className={`mt-6 text-3xl text-foreground sm:text-4xl ${t.className}`}>{t.sample}</p>
                <p className="mt-6 text-sm font-medium text-foreground">{t.face}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{t.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Personality */}
        <section>
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-muted-foreground sm:text-xs">06 — Brand Personality</p>
          <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
            {personality.map((p) => (
              <span key={p} className="rounded-full border border-border/60 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-foreground sm:text-sm">
                {p}
              </span>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
};

export default YahyaPortfolio;