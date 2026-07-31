// Client-only: extract text lines from a PDF using pdf.js.
// Groups text items into visual lines (by y position) so downstream parsing
// can reason about headings and entries.

type TextItem = { str: string; transform: number[] };

let configured = false;

export async function extractPdfLines(file: File): Promise<string[]> {
  const pdfjs = await import("pdfjs-dist");
  if (!configured) {
    // worker matched to the installed version, served from CDN at runtime
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
    configured = true;
  }

  const data = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data }).promise;
  const lines: string[] = [];

  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const items = content.items as TextItem[];

    // bucket items by rounded y (line), then sort each line by x
    const rows = new Map<number, { x: number; str: string }[]>();
    for (const it of items) {
      if (!it.str) continue;
      const y = Math.round(it.transform[5]);
      const x = it.transform[4];
      const key = Math.round(y / 3) * 3; // tolerance
      if (!rows.has(key)) rows.set(key, []);
      rows.get(key)!.push({ x, str: it.str });
    }
    const ys = [...rows.keys()].sort((a, b) => b - a); // top to bottom
    for (const y of ys) {
      const row = rows
        .get(y)!
        .sort((a, b) => a.x - b.x)
        .map((r) => r.str)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      if (row) lines.push(row);
    }
  }
  return lines;
}

export async function extractPdfText(file: File): Promise<string> {
  return (await extractPdfLines(file)).join("\n");
}
