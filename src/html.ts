import type { HTMLPage } from "../types";

export const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const SHARED_STYLES = `
  body {
    margin: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1e1e2e;
    font-family: "Fira Code", Consolas, monospace;
    padding: 2rem;
    box-sizing: border-box;
  }
  .card {
    width: 100%;
    max-width: 1200px;
    background: #2b2b3a;
    border-radius: 10px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
    overflow: hidden;
  }
  .titlebar {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1rem;
    background: #232332;
  }
  .dots { display: flex; gap: 0.25rem; }
  .dot { width: 12px; height: 12px; border-radius: 50%; }
  .dot.red { background: #ff5f66; }
  .dot.yellow { background: #ffbd5e; }
  .dot.green { background: #27c96f; }
  .tab { color: #9a9ab0; font-size: 0.85rem; }
`;

export const renderHtmlPage = ({
  title,
  filename,
  styles,
  content,
}: HTMLPage): string => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
<style>${SHARED_STYLES}${styles}</style>
</head>
<body>
  <div class="card">
    <div class="titlebar">
      <div class="dots">
        <div class="dot red"></div>
        <div class="dot yellow"></div>
        <div class="dot green"></div>
      </div>
      <div class="tab">Mowojang/${escapeHtml(filename)}</div>
    </div>
    ${content}
  </div>
</body>
</html>`;
