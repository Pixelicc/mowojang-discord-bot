import { readFileSync } from "node:fs";
import { commands } from "../commands";

function loadDevVars(): Record<string, string> {
  try {
    const content = readFileSync(".dev.vars", "utf-8");
    const vars: Record<string, string> = {};
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      vars[key!] = rest.join("=").replace(/^"|"$/g, "");
    }
    return vars;
  } catch {
    return {};
  }
}

const vars = { ...loadDevVars(), ...process.env };
const applicationId = vars.DISCORD_APPLICATION_ID;
const token = vars.DISCORD_TOKEN;

const URL = `https://discord.com/api/v10/applications/${applicationId}/commands`;

const response = await fetch(URL, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bot ${token}`,
  },
  body: JSON.stringify(
    Object.values(commands).map(({ name, description, options, integration_types, contexts }) => ({
      name,
      description,
      options,
      integration_types: integration_types ?? [0, 1],
      contexts: contexts ?? [0, 1, 2],
    })),
  ),
});

if (!response.ok) {
  console.error(`Failed to register commands: ${response.status} ${await response.text()}`);
  process.exit(1);
}

console.log("Successfully registered commands:", await response.json());
