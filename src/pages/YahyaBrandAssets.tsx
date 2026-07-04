import { useEffect, useRef, useState } from "react";
import { Download, Check, Package } from "lucide-react";
import JSZip from "jszip";
import { Button } from "@/components/ui/button";
import logoWhiteTransparent from "@/assets/yahya/logo-white-transparent.png.asset.json";
import logoBlackTransparent from "@/assets/yahya/logo-black-transparent.png.asset.json";
import logoWhiteSvg from "@/assets/yahya/logo-white.svg.asset.json";
import logoWhiteTransparentSvg from "@/assets/yahya/logo-white-transparent.svg.asset.json";
import logoBlackTransparentSvg from "@/assets/yahya/logo-black-transparent.svg.asset.json";
import logoWhiteNoTaglineSvg from "@/assets/yahya/logo-white-no-tagline.svg.asset.json";
import logoWhiteTransparentNoTaglineSvg from "@/assets/yahya/logo-white-transparent-no-tagline.svg.asset.json";
import logoBlackTransparentNoTaglineSvg from "@/assets/yahya/logo-black-transparent-no-tagline.svg.asset.json";
import logoWhiteNoTaglinePng from "@/assets/yahya/logo-white-no-tagline.png.asset.json";
import logoWhiteTransparentNoTaglinePng from "@/assets/yahya/logo-white-transparent-no-tagline.png.asset.json";
import logoBlackTransparentNoTaglinePng from "@/assets/yahya/logo-black-transparent-no-tagline.png.asset.json";
import cormorantFont from "@/assets/yahya/cormorant-garamond.ttf.asset.json";
import interFont from "@/assets/yahya/inter.ttf.asset.json";

// Same-origin relative path — served by Lovable infra in preview and production.
// Using a relative URL avoids CORS issues that broke fetch/download in preview.
const assetUrl = (path: string) => path;

const palette = [
  { name: "Deep Teal", hex: "#0C3D3E", role: "Primary", ink: "#FFFFFF" },
  { name: "Cocoa Brown", hex: "#6A4F3F", role: "Secondary", ink: "#FFFFFF" },
  { name: "Seafoam", hex: "#5FA79B", role: "Accent", ink: "#FFFFFF" },
  { name: "Sand Beige", hex: "#E6DED3", role: "Neutral", ink: "#111111" },
  { name: "Terracotta", hex: "#C88E6B", role: "Accent", ink: "#FFFFFF" },
];

const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const YahyaBrandAssets = () => {
  const [savedPng, setSavedPng] = useState(false);
  const paletteRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.title = "YAHYA — Brand Assets Dashboard";
  }, []);

  const handleDownloadPalette = () => {
    const W = 1600;
    const H = 900;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#FAFAF7";
    ctx.fillRect(0, 0, W, H);

    // Header
    ctx.fillStyle = "#111111";
    ctx.font = "600 26px 'Inter', system-ui, sans-serif";
    ctx.fillText("YAHYA — BRAND COLOUR PALETTE", 80, 100);

    ctx.fillStyle = "#666666";
    ctx.font = "400 20px 'Inter', system-ui, sans-serif";
    ctx.fillText("Swim & Resort Wear · Approved Brand System", 80, 132);

    // Swatches
    const gap = 32;
    const swatchW = (W - 160 - gap * (palette.length - 1)) / palette.length;
    const swatchH = 520;
    const top = 200;

    palette.forEach((c, i) => {
      const x = 80 + i * (swatchW + gap);
      ctx.fillStyle = c.hex;
      ctx.fillRect(x, top, swatchW, swatchH);

      // Label block below
      ctx.fillStyle = "#111111";
      ctx.font = "600 14px 'Inter', system-ui, sans-serif";
      ctx.fillText(`0${i + 1} · ${c.role.toUpperCase()}`, x, top + swatchH + 40);

      ctx.font = "500 22px 'Inter', system-ui, sans-serif";
      ctx.fillText(c.name, x, top + swatchH + 72);

      ctx.fillStyle = "#666666";
      ctx.font = "400 18px 'JetBrains Mono', 'SF Mono', monospace";
      ctx.fillText(c.hex.toUpperCase(), x, top + swatchH + 100);
    });

    canvas.toBlob((blob) => {
      if (!blob) return;
      triggerDownload(blob, "yahya-brand-palette.png");
      setSavedPng(true);
      setTimeout(() => setSavedPng(false), 1600);
    }, "image/png");
  };

  const handleDownloadPng = async (variant: "white" | "black") => {
    const src = assetUrl(
      variant === "white" ? logoWhiteTransparent.url : logoBlackTransparent.url,
    );
    const res = await fetch(src);
    const blob = await res.blob();
    triggerDownload(blob, `yahya-logo-${variant}-transparent.png`);
  };

  const handleDownloadSvgFile = async (
    variant: "white-teal" | "white-transparent" | "black-transparent",
  ) => {
    const map = {
      "white-teal": logoWhiteSvg,
      "white-transparent": logoWhiteTransparentSvg,
      "black-transparent": logoBlackTransparentSvg,
    } as const;
    const asset = map[variant];
    const res = await fetch(assetUrl(asset.url));
    const blob = await res.blob();
    triggerDownload(blob, asset.original_filename);
  };

  const fonts = [
    {
      role: "Headlines & Subheads",
      name: "Cormorant Garamond",
      note: "Free stand-in for the licensed Canela Display used in the logotype. Use for editorial titles, quotes, and refined captions.",
      asset: cormorantFont,
      filename: "CormorantGaramond-Variable.ttf",
      license: "SIL Open Font License 1.1",
      preview: "The Resort Edit",
      previewClass: "font-serif",
    },
    {
      role: "Body & UI",
      name: "Inter",
      note: "Web, product copy, and interface.",
      asset: interFont,
      filename: "Inter-Variable.ttf",
      license: "SIL Open Font License 1.1",
      preview: "Elevated swimwear, thoughtfully composed.",
      previewClass: "font-sans",
    },
  ];

  const handleDownloadFont = async (asset: { url: string }, filename: string) => {
    const res = await fetch(assetUrl(asset.url));
    const blob = await res.blob();
    triggerDownload(blob, filename);
  };

  return (
    <main className="min-h-screen bg-[#FAFAF7] text-[#111111]">
      <header className="border-b border-black/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 sm:flex-row sm:items-end sm:justify-between sm:py-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-black/50">
              Internal · Brand Assets Dashboard
            </p>
            <h1 className="mt-2 font-serif text-3xl tracking-tight sm:text-4xl">
              YAHYA — Approved Brand Kit
            </h1>
          </div>
          <p className="max-w-sm text-xs leading-5 text-black/60">
            Working files for our internal file system. Not published on the
            main website.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
        {/* Logo card */}
        <div className="rounded-2xl border border-black/10 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-black/10 px-6 py-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/50">
                01 · Primary Logo
              </p>
              <h2 className="mt-1 font-serif text-xl">Approved vector · SVG</h2>
              <p className="mt-1 text-xs text-black/55">
                Scalable vector files — three approved variants.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-0 sm:grid-cols-3">
            <div className="flex flex-col">
              <div
                className="flex flex-1 items-center justify-center p-8"
                style={{ backgroundColor: "#0C3D3E" }}
              >
                <img
                  src={assetUrl(logoWhiteSvg.url)}
                  alt="Yahya logo on deep teal"
                  className="w-full max-w-xs object-contain"
                />
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-black/10 px-4 py-3">
                <span className="text-[11px] font-medium text-black/70">
                  White on Teal
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 border-black/20"
                  onClick={() => handleDownloadSvgFile("white-teal")}
                >
                  <Download size={14} /> .svg
                </Button>
              </div>
            </div>
            <div className="flex flex-col border-t border-black/10 sm:border-l sm:border-t-0">
              <div
                className="flex flex-1 items-center justify-center p-8"
                style={{ backgroundColor: "#6A4F3F" }}
              >
                <img
                  src={assetUrl(logoWhiteTransparentSvg.url)}
                  alt="Yahya white logo, transparent SVG"
                  className="w-full max-w-xs object-contain"
                />
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-black/10 px-4 py-3">
                <span className="text-[11px] font-medium text-black/70">
                  White · transparent
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 border-black/20"
                  onClick={() => handleDownloadSvgFile("white-transparent")}
                >
                  <Download size={14} /> .svg
                </Button>
              </div>
            </div>
            <div className="flex flex-col border-t border-black/10 sm:border-l sm:border-t-0">
              <div
                className="flex flex-1 items-center justify-center p-8"
                style={{ backgroundColor: "#E6DED3" }}
              >
                <img
                  src={assetUrl(logoBlackTransparentSvg.url)}
                  alt="Yahya black logo, transparent SVG"
                  className="w-full max-w-xs object-contain"
                />
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-black/10 px-4 py-3">
                <span className="text-[11px] font-medium text-black/70">
                  Black · transparent
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 border-black/20"
                  onClick={() => handleDownloadSvgFile("black-transparent")}
                >
                  <Download size={14} /> .svg
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Palette card */}
        {/* Transparent PNG card */}
        <div className="mt-10 rounded-2xl border border-black/10 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-black/10 px-6 py-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/50">
                01b · Logo — No Tagline
              </p>
              <h2 className="mt-1 font-serif text-xl">Wordmark only · SVG + PNG</h2>
              <p className="mt-1 text-xs text-black/55">
                Tagline-free variants for compact placements — three approved lockups.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-0 sm:grid-cols-3">
            {[
              { label: "White on Teal", bg: "#0C3D3E", svg: logoWhiteNoTaglineSvg, png: logoWhiteNoTaglinePng },
              { label: "White · transparent", bg: "#6A4F3F", svg: logoWhiteTransparentNoTaglineSvg, png: logoWhiteTransparentNoTaglinePng },
              { label: "Black · transparent", bg: "#E6DED3", svg: logoBlackTransparentNoTaglineSvg, png: logoBlackTransparentNoTaglinePng },
            ].map((v, i) => (
              <div
                key={v.label}
                className={`flex flex-col ${i === 0 ? "" : "border-t border-black/10 sm:border-l sm:border-t-0"}`}
              >
                <div className="flex flex-1 items-center justify-center p-8" style={{ backgroundColor: v.bg }}>
                  <img src={assetUrl(v.svg.url)} alt={`Yahya wordmark — ${v.label}`} className="w-full max-w-xs object-contain" />
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-black/10 px-4 py-3">
                  <span className="text-[11px] font-medium text-black/70">{v.label}</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 border-black/20"
                      onClick={async () => {
                        const res = await fetch(assetUrl(v.svg.url));
                        triggerDownload(await res.blob(), v.svg.original_filename);
                      }}
                    >
                      <Download size={14} /> .svg
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 border-black/20"
                      onClick={async () => {
                        const res = await fetch(assetUrl(v.png.url));
                        triggerDownload(await res.blob(), v.png.original_filename);
                      }}
                    >
                      <Download size={14} /> .png
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-black/10 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-black/10 px-6 py-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/50">
                02 · Logo — Transparent PNG
              </p>
              <h2 className="mt-1 font-serif text-xl">High-resolution · no background</h2>
              <p className="mt-1 text-xs text-black/55">3840 × 1280 px · text only, transparent background.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => handleDownloadPng("white")}
                className="gap-2 bg-[#0C3D3E] text-white hover:bg-[#0C3D3E]/90"
              >
                <Download size={16} /> White (.png)
              </Button>
              <Button
                onClick={() => handleDownloadPng("black")}
                variant="outline"
                className="gap-2 border-black/20"
              >
                <Download size={16} /> Black (.png)
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
            <div
              className="flex items-center justify-center p-8"
              style={{ backgroundColor: "#0C3D3E" }}
            >
              <img
                src={assetUrl(logoWhiteTransparent.url)}
                alt="Yahya white logo, transparent background"
                className="w-full max-w-md object-contain"
              />
            </div>
            <div
              className="flex items-center justify-center p-8"
              style={{ backgroundColor: "#E6DED3" }}
            >
              <img
                src={assetUrl(logoBlackTransparent.url)}
                alt="Yahya black logo, transparent background"
                className="w-full max-w-md object-contain"
              />
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-black/10 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-black/10 px-6 py-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/50">
                03 · Colour Palette
              </p>
              <h2 className="mt-1 font-serif text-xl">Approved brand hex codes</h2>
            </div>
            <Button
              onClick={handleDownloadPalette}
              className="gap-2 bg-[#0C3D3E] text-white hover:bg-[#0C3D3E]/90"
            >
              {savedPng ? <Check size={16} /> : <Download size={16} />}
              {savedPng ? "Saved" : "Download Palette (.png)"}
            </Button>
          </div>

          <div ref={paletteRef} className="p-6 sm:p-10">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 sm:gap-5">
              {palette.map((c, i) => (
                <div key={c.hex} className="overflow-hidden rounded-xl border border-black/5">
                  <div
                    className="flex aspect-[3/4] items-end p-4"
                    style={{ backgroundColor: c.hex, color: c.ink }}
                  >
                    <span className="font-mono text-[11px] uppercase tracking-wider opacity-90">
                      {c.hex}
                    </span>
                  </div>
                  <div className="bg-white px-3 py-3">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-black/50">
                      0{i + 1} · {c.role}
                    </p>
                    <p className="mt-1 text-sm font-medium">{c.name}</p>
                    <p className="mt-0.5 font-mono text-[11px] uppercase text-black/50">
                      {c.hex}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-[11px] uppercase tracking-[0.28em] text-black/40">
          Internal · Not linked from public navigation
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="rounded-2xl border border-black/10 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-black/10 px-6 py-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/50">
                04 · Typography
              </p>
              <h2 className="mt-1 font-serif text-xl">Approved brand fonts</h2>
              <p className="mt-1 text-xs text-black/55">
                Open-source font files used across the Yahya brand system.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {fonts.map((f, i) => (
              <div
                key={f.name}
                className={`flex flex-col p-6 sm:p-8 ${i === 0 ? "" : "border-t border-black/10 sm:border-l sm:border-t-0"}`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-black/50">
                  {f.role}
                </p>
                <p className="mt-2 font-serif text-2xl">{f.name}</p>
                <p
                  className={`mt-6 text-3xl leading-tight text-[#0C3D3E] ${f.previewClass}`}
                >
                  {f.preview}
                </p>
                <p className="mt-6 text-xs leading-5 text-black/60">{f.note}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-black/40">
                  {f.license}
                </p>
                <div className="mt-6">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 border-black/20"
                    onClick={() => handleDownloadFont(f.asset, f.filename)}
                  >
                    <Download size={14} /> {f.filename}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-black/10 px-6 py-5 text-xs leading-5 text-black/60">
            <span className="font-semibold text-black/80">Canela Display</span>{" "}
            (used in the logotype) is a commercial typeface licensed from
            Commercial Type and is not included here. Purchase a license at{" "}
            <a
              href="https://commercialtype.com/catalog/canela"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-black/30 underline-offset-2 hover:text-black"
            >
              commercialtype.com
            </a>
            . For all other uses, the logo vector should be used instead of
            retyping.
          </div>
        </div>
      </section>
    </main>
  );
};

export default YahyaBrandAssets;