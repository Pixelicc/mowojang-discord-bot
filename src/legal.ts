import type { MarkdownSection } from "../types";
import { escapeHtml, renderHtmlPage } from "./html";

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

  return renderHtmlPage({
    title: filename,
    filename,
    styles: `
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
`,
    content: `
    <pre><span class="title"># ${escapeHtml(title)}</span></br></br>${body}</pre>
`,
  });
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
