import { commands } from "./commands";
import { dashUUID, undashUUID, UUIDToIntArray } from "./utils";

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const renderMarkdown = (value: string): string =>
  escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br>");

const EXAMPLE_PROFILE = {
  UUID: "14727faefbdc4aff848cd2713eb9939e",
  username: "Pixelic",
};

const EXAMPLE_STATUS = [
  {
    name: "Mowojang API - GET /:username",
    hostname: "mowojang.matdoes.dev",
    status: 200,
    latency: "309 ms",
  },
  {
    name: "Mowojang API - GET /:UUID",
    hostname: "mowojang.matdoes.dev",
    status: 200,
    latency: "309 ms",
  },
  {
    name: "Mowojang API - GET /session/minecraft/profile/:UUID",
    hostname: "mowojang.matdoes.dev",
    status: 200,
    latency: "330 ms",
  },
  {
    name: "Mowojang API - GET /users/profiles/minecraft/:username",
    hostname: "mowojang.matdoes.dev",
    status: 200,
    latency: "310 ms",
  },
  {
    name: "Mowojang API - POST / - [username,UUID]",
    hostname: "mowojang.matdoes.dev",
    status: 200,
    latency: "330 ms",
  },
];

const renderProfilePreview = (): string => {
  const description = `**Username:** \`${EXAMPLE_PROFILE.username}\` (${EXAMPLE_PROFILE.username.length})\n**UUID:**\n \`${undashUUID(EXAMPLE_PROFILE.UUID)}\`\n\`${dashUUID(EXAMPLE_PROFILE.UUID)}\`\n\`[I;${UUIDToIntArray(EXAMPLE_PROFILE.UUID).join(",")}]\``;
  return `<div class="embed" style="border-left-color:#a67996">
    <div class="embed-body">
      <div class="embed-title">Minecraft Profile</div>
      <div class="embed-desc">${renderMarkdown(description)}</div>
    </div>
    <img class="embed-thumb" src="https://mc-heads.net/body/${undashUUID(EXAMPLE_PROFILE.UUID)}/left" alt="Minecraft Skin Preview">
  </div>`;
};

const renderStatusPreview = (): string => {
  const rows = EXAMPLE_STATUS.map(
    (entry) =>
      `✅ ${renderMarkdown(`**${entry.name}**`)}<br>${escapeHtml(String(entry.status))} | ${escapeHtml(entry.hostname)} | ${escapeHtml(entry.latency)}`,
  ).join("<br><br>");
  return `<div class="embed" style="border-left-color:#80a679">
    <div class="embed-body">
      <div class="embed-title">Status — Mowojang API</div>
      <div class="embed-desc">Latest status checks for Mowojang and related Minecraft APIs.</div>
      <div class="embed-field">${rows}</div>
    </div>
  </div>`;
};

const renderCommandList = (): string =>
  Object.values(commands)
    .map(
      (command) =>
        `<li><span class="cmd">/${escapeHtml(command.name)}</span> — ${escapeHtml(command.description)}</li>`,
    )
    .join("\n");

export const renderLandingPage = (clientId: string): string => {
  const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mowojang Discord Bot</title>
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
  .tab { color: #9a9ab0; font-size: 0.85rem; }
  .content {
    padding: 1.5rem 2rem 2rem;
    color: #d4d4e0;
  }
  .title { color: #7fb7ff; font-weight: bold; font-size: 1.4rem; }
  .tagline { color: #e9a874; margin: 0.5rem 0 1.5rem; }
  .invite {
    display: inline-block;
    color: #1e1e2e;
    background: #7fb7ff;
    font-weight: bold;
    text-decoration: none;
    padding: 0.6rem 1.2rem;
    border-radius: 6px;
    margin-bottom: 1.5rem;
  }
  .section-title { color: #7fb7ff; margin: 1.5rem 0 0.5rem; }
  ul.commands { list-style: none; padding: 0; margin: 0; line-height: 1.9; }
  .cmd { color: #e9a874; }
  .previews {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 0.5rem;
  }
  .embed {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    width: fit-content;
    max-width: 100%;
    background: #232332;
    border-left: 4px solid #7fb7ff;
    border-radius: 4px;
    padding: 0.9rem 1rem;
  }
  .embed-title { color: #7fb7ff; font-weight: bold; margin-bottom: 0.4rem; }
  .embed-desc { color: #d4d4e0; font-size: 0.85rem; line-height: 1.6; }
  .embed-desc strong, .embed-field strong { color: #fff; }
  .embed-desc code, .embed-field code {
    background: #1e1e2e;
    padding: 0.1rem 0.3rem;
    border-radius: 3px;
    font-size: 0.8em;
  }
  .embed-field { margin-top: 0.6rem; font-size: 0.8rem; line-height: 1.6; }
  .embed-thumb {
    flex-shrink: 0;
    width: 32px;
    object-fit: cover;
    object-position: top;
    border-radius: 4px;
  }
  .footer { margin-top: 2rem; font-size: 0.8rem; }
  .footer a { color: #9a9ab0; }
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
      <div class="tab">Mowojang/README.md</div>
    </div>
    <div class="content">
      <div class="title"># Mowojang Discord Bot</div>
      <p class="tagline">Look up Minecraft profiles, UUIDs, sessions and API status right from Discord.</p>
      <a class="invite" href="${inviteUrl}">Add to Discord</a>

      <div class="section-title"># Commands</div>
      <ul class="commands">
${renderCommandList()}
      </ul>

      <div class="section-title"># Previews</div>
      <div class="previews">
        ${renderProfilePreview()}
        ${renderStatusPreview()}
      </div>

      <div class="footer">
        <a href="/legal/privacy">Privacy Policy</a> &middot; <a href="/legal/terms">Terms of Service</a>
      </div>
    </div>
  </div>
</body>
</html>`;
};
