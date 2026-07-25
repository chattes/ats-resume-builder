export const ACCENT_PALETTE = [
  { name: "Navy", hex: "#1E3A5F" },
  { name: "Slate", hex: "#334155" },
  { name: "Teal", hex: "#0F766E" },
  { name: "Burgundy", hex: "#7F1D1D" },
  { name: "Forest", hex: "#14532D" },
] as const;

/** Relative luminance contrast vs near-black body (#111) — accents used on white paper. */
export function contrastRatio(hex: string, bg = "#FFFFFF"): number {
  const lum = (h: string) => {
    const n = h.replace("#", "");
    const r = parseInt(n.slice(0, 2), 16) / 255;
    const g = parseInt(n.slice(2, 4), 16) / 255;
    const b = parseInt(n.slice(4, 6), 16) / 255;
    const f = (c: number) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const L1 = lum(hex);
  const L2 = lum(bg);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function isContrastSafe(hex: string): boolean {
  return contrastRatio(hex) >= 4.5;
}
