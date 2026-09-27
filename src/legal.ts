const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

type MarkdownSection = { heading: string; body: string };

const renderMarkdownCard = (
  filename: string,
  title: string,
  sections: MarkdownSection[],
): string => {
  const body = sections
    .map(
      ({ heading, body }) =>
        `<span class="h2"># ${escapeHtml(heading)}</span>\n<span class="p">${escapeHtml(body)}</span>`,
    )
    .join("</br></br>");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(filename)}</title>
<style>
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
  .tab {
    color: #9a9ab0;
    font-size: 0.85rem;
  }
  pre {
    margin: 0;
    padding: 1.5rem;
    color: #d4d4e0;
    font-size: 0.9rem;
    line-height: 1.7;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .title { color: #7fb7ff; font-weight: bold; }
  .h2 { color: #7fb7ff; }
  .p { color: #e9a874; }
</style>
</head>
<body>
  <div class="card">
    <div class="titlebar">
      <div class="dots">
        <div class="dot red"></div>
        <div class="dot yellow"></div>
        <div class="dot green"></div>
      </div>
      <div class="tab">${escapeHtml("Mowojang/" + filename)}</div>
    </div>
    <pre><span class="title"># ${escapeHtml(title)}</span></br></br>${body}</pre>
  </div>
</body>
</html>`;
};

const PRIVACY_POLICY_SECTIONS: MarkdownSection[] = [
  { heading: "Last Updated", body: "2026-09-27" },
  {
    heading: "Data collected",
    body: "The Minecraft username or UUID you provide as a command argument, and an anonymous per-command usage counter (e.g. how many times /profile has been run in total).",
  },
  {
    heading: "Data not collected",
    body: "We do not store your Discord user ID, username, email, messages, or any other personal account information.",
  },
  {
    heading: "Data Retention",
    body: "Usage counters are aggregated and anonymous and are kept indefinitely. Command input is not persisted by the bot beyond the request needed to answer it. It does however temporarily appear in the Cloudflare Worker's logs.",
  },
  {
    heading: "Third-Parties",
    body: "The Minecraft username or UUID you provide as a command argument is forwarded to the third-party API mowojang.matdoes.dev to resolve profile data. The bot runs on Cloudflare Workers, which processes requests and may generate its own infrastructure logs under Cloudflare's privacy practices.",
  },
  {
    heading: "Your Rights",
    body: "Since no personal Discord account data is stored, there is no per-user data to access or delete any personal information. Aggregate usage counters contain no identifying information.",
  },
  {
    heading: "Changes",
    body: "This policy may be updated to reflect changes to the bot. Continued use of the bot after changes means you accept the updated policy.",
  },
  {
    heading: "Contact",
    body: "For further questions, please reach out to contact@pixelic.dev",
  },
];

const TERMS_OF_SERVICE_SECTIONS: MarkdownSection[] = [
  { heading: "Last Updated", body: "2026-09-27" },
  {
    heading: "Acceptance",
    body: "By adding or using this bot through your Profile or Server, you agree to these terms and to Discord's own Terms of Service.",
  },
  {
    heading: "Description",
    body: "The bot provides slash commands to look up Minecraft usernames and UUIDs by querying a third-party API.",
  },
  {
    heading: "Acceptable Use",
    body: "You may not use the bot to spam or abuse its commands.",
  },
  {
    heading: "Disclaimer",
    body: "The bot is provided as-is, without warranty of any kind. Profile data is sourced from a third-party proxy and its accuracy or availability is not guaranteed.",
  },
  {
    heading: "Changes to Terms",
    body: "These terms may be updated at any time. Continued use of the bot after changes means you accept the updated terms.",
  },
  {
    heading: "Contact",
    body: "For further questions, please reach out to contact@pixelic.dev",
  },
];

export const renderPrivacyPage = (): string =>
  renderMarkdownCard(
    "Privacy-Policy.md",
    "Mowojang Discord Bot - Privacy Policy",
    PRIVACY_POLICY_SECTIONS,
  );

export const renderTermsPage = (): string =>
  renderMarkdownCard(
    "Terms-of-Service.md",
    "Mowojang Discord Bot - Terms of Service",
    TERMS_OF_SERVICE_SECTIONS,
  );
