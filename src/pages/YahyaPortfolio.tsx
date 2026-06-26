import { useEffect } from "react";
import playfulStorefront from "@/assets/yahya/playful-storefront.png.asset.json";
import playfulLogo from "@/assets/yahya/playful-logo.png.asset.json";
import scriptStorefront from "@/assets/yahya/script-storefront.png.asset.json";
import scriptLogo from "@/assets/yahya/script-logo.png.asset.json";
import serifStorefront from "@/assets/yahya/serif-storefront.png.asset.json";
import serifLogo from "@/assets/yahya/serif-logo.png.asset.json";
import goldStorefront from "@/assets/yahya/gold-storefront.png.asset.json";
import goldLogo from "@/assets/yahya/gold-logo.png.asset.json";

const assetUrl = (path: string) => `https://episolve-rebrand.lovable.app${path}`;

const logoConcepts = [
  {
    name: "Playful Boutique",
    note: "Soft, welcoming, and youthful with an approachable boutique personality.",
    logo: assetUrl(playfulLogo.url),
    storefront: assetUrl(playfulStorefront.url),
  },
  {
    name: "Signature Script",
    note: "Elegant handwritten motion with a refined resort-style luxury feel.",
    logo: assetUrl(scriptLogo.url),
    storefront: assetUrl(scriptStorefront.url),
  },
  {
    name: "Refined Serif",
    note: "Cean, elevated, and fashion-led for a polished premium retail impression.",
    logo: assetUrl(serifLogo.url),
    storefront: assetUrl(serifStorefront.url),
  },
  {
    name: "Gold Prestige",
    note: "High-end and timeless with stronger luxury cues and upscale visibility.",
    logo: assetUrl(goldLogo.url),
    storefront: assetUrl(goldStorefront.url),
  },
];

const YahyaPortfolio = () => {
  useEffect(() => {
    document.title = "Yahya Logo Designs | epiSolve";
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              {"\n"}
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-foreground">Yahya Swimwear Boutique</h1>
          </div>

          <nav aria-label="Page menu">
            <a
              href="#logo-designs"
              className="text-sm font-semibold uppercase tracking-[0.28em] text-foreground transition-opacity hover:opacity-70"
            >
              Logo Designs
            </a>
          </nav>
        </div>
      </header>

      <section id="logo-designs" className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold text-foreground md:text-4xl">
            Presented with both logo artwork and storefront application.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
            Each direction pairs the flat logo treatment with a real-world storefront visualization to help assess presence, legibility, and brand character.
          </p>
        </div>

        <div className="space-y-8">
          {logoConcepts.map((concept, index) => (
            <article key={concept.name} className="overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm">
              <div className="grid gap-px bg-border/60 xl:grid-cols-[0.92fr_1.08fr]">
                <div className="bg-card p-6 md:p-8">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                        Option {index + 1}
                      </p>
                      <h3 className="mt-3 text-2xl font-semibold text-foreground">{concept.name}</h3>
                    </div>
                    <span className="rounded-full border border-border px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      Logo + Mockup
                    </span>
                  </div>

                  <p className="mb-6 max-w-xl text-base leading-7 text-muted-foreground">{concept.note}</p>

                  <div className="overflow-hidden rounded-md border border-border/70 bg-secondary/45">
                    <img
                      src={concept.logo}
                      alt={`${concept.name} Yahya Swimwear Boutique logo concept`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className="bg-card p-3 md:p-4">
                  <div className="overflow-hidden rounded-md border border-border/70 bg-secondary/35">
                    <img
                      src={concept.storefront}
                      alt={`${concept.name} logo shown on Yahya storefront signage`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default YahyaPortfolio;