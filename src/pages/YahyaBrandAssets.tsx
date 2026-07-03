import { useEffect, useRef, useState } from "react";
import { Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { YahyaLogoSvg, yahyaLogoSvgString } from "@/components/yahya/YahyaLogoSvg";
import logoWhiteTransparent from "@/assets/yahya/logo-white-transparent.png.asset.json";
import logoBlackTransparent from "@/assets/yahya/logo-black-transparent.png.asset.json";

const assetUrl = (path: string) => `https://episolve-rebrand.lovable.app${path}`;

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
  const [savedSvg, setSavedSvg] = useState(false);
  const [savedPng, setSavedPng] = useState(false);
  const paletteRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.title = "YAHYA — Brand Assets Dashboard";
  }, []);

  const handleDownloadSvg = () => {
    const svg = yahyaLogoSvgString();
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    triggerDownload(blob, "yahya-logo.svg");
    setSavedSvg(true);
    setTimeout(() => setSavedSvg(false), 1600);
  };

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
              <h2 className="mt-1 font-serif text-xl">Inline SVG · fully editable</h2>
            </div>
            <Button
              onClick={handleDownloadSvg}
              className="gap-2 bg-[#0C3D3E] text-white hover:bg-[#0C3D3E]/90"
            >
              {savedSvg ? <Check size={16} /> : <Download size={16} />}
              {savedSvg ? "Saved" : "Download Logo (.svg)"}
            </Button>
          </div>
          <div className="p-6 sm:p-10">
            <YahyaLogoSvg className="mx-auto w-full max-w-3xl" />
            <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-5 text-black/55">
              Rendered from{" "}
              <code className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-[11px]">
                src/components/yahya/YahyaLogoSvg.tsx
              </code>{" "}
              — edit strokes, letter-spacing, or colour tokens directly in code.
            </p>
          </div>
        </div>

        {/* Palette card */}
        <div className="mt-10 rounded-2xl border border-black/10 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-black/10 px-6 py-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/50">
                02 · Colour Palette
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
    </main>
  );
};

export default YahyaBrandAssets;