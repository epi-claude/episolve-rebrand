import { forwardRef, SVGProps } from "react";

/**
 * YAHYA — Swim & Resort Wear
 * Inline, editable, fully scalable SVG logo.
 *
 * Design notes:
 * - Uses a serif display face (Cormorant Garamond / Canela-style fallback)
 *   for the wordmark so the shape stays crisp at every size.
 * - The tail on the final "A" is drawn as an SVG path so it never
 *   depends on font substitution.
 * - Everything is editable: change `background`, `ink`, or the text
 *   strings directly in this file.
 */

export interface YahyaLogoSvgProps extends SVGProps<SVGSVGElement> {
  background?: string;
  ink?: string;
  showBackground?: boolean;
}

export const YahyaLogoSvg = forwardRef<SVGSVGElement, YahyaLogoSvgProps>(
  (
    {
      background = "#0C3D3E",
      ink = "#FFFFFF",
      showBackground = true,
      ...rest
    },
    ref,
  ) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1600 560"
      role="img"
      aria-label="YAHYA — Swim and Resort Wear"
      {...rest}
    >
      {showBackground && (
        <rect width="1600" height="560" fill={background} />
      )}

      {/* Wordmark */}
      <text
        x="800"
        y="340"
        textAnchor="middle"
        fill={ink}
        fontFamily="'Cormorant Garamond', 'Canela Display', 'Playfair Display', 'Times New Roman', serif"
        fontWeight={500}
        fontSize="300"
        letterSpacing="18"
      >
        YAHYA
      </text>

      {/* Signature tail sweeping out from the final A */}
      <path
        d="M 1180 340 C 1260 350, 1340 372, 1420 396 C 1360 388, 1300 384, 1240 388"
        fill="none"
        stroke={ink}
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Divider flourishes */}
      <path
        d="M 470 452 q 20 -14 40 0 t 40 0"
        fill="none"
        stroke={ink}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M 1050 452 q 20 -14 40 0 t 40 0"
        fill="none"
        stroke={ink}
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Subtitle */}
      <text
        x="800"
        y="470"
        textAnchor="middle"
        fill={ink}
        fontFamily="'Cormorant Garamond', 'Canela Display', 'Playfair Display', 'Times New Roman', serif"
        fontWeight={400}
        fontSize="54"
        letterSpacing="22"
      >
        SWIM &amp; RESORT WEAR
      </text>
    </svg>
  ),
);

YahyaLogoSvg.displayName = "YahyaLogoSvg";

/** Return the standalone .svg file contents for download. */
export const yahyaLogoSvgString = ({
  background = "#0C3D3E",
  ink = "#FFFFFF",
  showBackground = true,
}: {
  background?: string;
  ink?: string;
  showBackground?: boolean;
} = {}) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 560" role="img" aria-label="YAHYA — Swim and Resort Wear">
  ${showBackground ? `<rect width="1600" height="560" fill="${background}"/>` : ""}
  <text x="800" y="340" text-anchor="middle" fill="${ink}" font-family="'Cormorant Garamond','Canela Display','Playfair Display','Times New Roman',serif" font-weight="500" font-size="300" letter-spacing="18">YAHYA</text>
  <path d="M 1180 340 C 1260 350, 1340 372, 1420 396 C 1360 388, 1300 384, 1240 388" fill="none" stroke="${ink}" stroke-width="6" stroke-linecap="round"/>
  <path d="M 470 452 q 20 -14 40 0 t 40 0" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>
  <path d="M 1050 452 q 20 -14 40 0 t 40 0" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>
  <text x="800" y="470" text-anchor="middle" fill="${ink}" font-family="'Cormorant Garamond','Canela Display','Playfair Display','Times New Roman',serif" font-weight="400" font-size="54" letter-spacing="22">SWIM &amp; RESORT WEAR</text>
</svg>
`;