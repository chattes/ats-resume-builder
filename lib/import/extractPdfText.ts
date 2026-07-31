// Client-only: extract text lines from a PDF using pdf.js, with column awareness.
// LinkedIn "Save to PDF" uses a two-column layout (a narrow left sidebar +
// a main column). A naive row grouping reads across both columns and scrambles
// the content, so we detect columns and emit the main column first, sidebar last.

export type PdfItem = { str: string; x: number; y: number };

let configured = false;

function buildLines(items: PdfItem[]): string[] {
  const rows = new Map<number, PdfItem[]>();
  for (const it of items) {
    const key = Math.round(it.y / 3) * 3; // vertical tolerance
    if (!rows.has(key)) rows.set(key, []);
    rows.get(key)!.push(it);
  }
  const ys = [...rows.keys()].sort((a, b) => b - a); // top → bottom
  const out: string[] = [];
  for (const y of ys) {
    const line = rows
      .get(y)!
      .sort((a, b) => a.x - b.x)
      .map((r) => r.str)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (line) out.push(line);
  }
  return out;
}

/** Split a page's items into main-column lines and sidebar lines.
 * Detects a narrow left sidebar (a dense left cluster of x-starts) vs the main
 * column. The main column is the group with more text; sidebar content is
 * emitted after it so sections stay contiguous. Right-aligned annotations
 * (e.g. dates) stay with the main column because they share the main rows. */
export function splitColumns(
  rawItems: PdfItem[],
  pageWidth: number
): { main: string[]; side: string[] } {
  const items = rawItems.filter((i) => i.str && i.str.trim());
  if (items.length === 0) return { main: [], side: [] };

  // Cluster x-start positions into columns.
  const bins = new Map<number, number>();
  for (const it of items) {
    const b = Math.floor(it.x / 12) * 12;
    bins.set(b, (bins.get(b) ?? 0) + 1);
  }
  type Cluster = { minx: number; maxx: number; count: number };
  const clusters: Cluster[] = [];
  for (const b of [...bins.keys()].sort((a, z) => a - z)) {
    const last = clusters[clusters.length - 1];
    if (!last || b - last.maxx > 40) {
      clusters.push({ minx: b, maxx: b, count: bins.get(b)! });
    } else {
      last.maxx = b;
      last.count += bins.get(b)!;
    }
  }

  const total = items.length;
  const big = clusters.filter((c) => c.count >= total * 0.08);
  // Two-column only when the leftmost dense cluster is a genuine (narrow, minority)
  // sidebar with a larger main cluster to its right. This avoids mistaking
  // right-aligned date annotations for a column on single-column pages.
  if (
    big.length >= 2 &&
    big[0].maxx < pageWidth * 0.45 &&
    big[0].count < big[1].count
  ) {
    const split = (big[0].maxx + big[1].minx) / 2 + 6;
    const left = items.filter((i) => i.x < split);
    const right = items.filter((i) => i.x >= split);
    if (left.length >= 3 && right.length >= 3) {
      const leftLines = buildLines(left);
      const rightLines = buildLines(right);
      const rightIsMain = right.length >= left.length;
      return rightIsMain
        ? { main: rightLines, side: leftLines }
        : { main: leftLines, side: rightLines };
    }
  }
  return { main: buildLines(items), side: [] };
}

export async function extractPdfLines(file: File): Promise<string[]> {
  const pdfjs = await import("pdfjs-dist");
  if (!configured) {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
    configured = true;
  }

  const data = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data }).promise;

  // Accumulate all main content first, then all sidebar content, so sections
  // stay contiguous across pages (the sidebar only exists on page 1).
  const mainLines: string[] = [];
  const sideLines: string[] = [];

  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const viewport = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();
    const items: PdfItem[] = (content.items as { str: string; transform: number[] }[])
      .filter((it) => it.str)
      .map((it) => ({ str: it.str, x: it.transform[4], y: it.transform[5] }));
    const { main, side } = splitColumns(items, viewport.width);
    mainLines.push(...main);
    sideLines.push(...side);
  }

  return [...mainLines, ...sideLines];
}

export async function extractPdfText(file: File): Promise<string> {
  return (await extractPdfLines(file)).join("\n");
}
