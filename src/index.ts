import { Hono } from "hono";
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from "discord-interactions";
import { commands } from "./commands";
import type { DiscordInteraction } from "../types";
import { renderPrivacyPage, renderTermsPage } from "./legal";
import { renderLandingPage } from "./landing";
import {
  fetchStatuses,
  buildStatusPage,
  incrementCommandStatistic,
} from "./utils";
import { EMBEDS } from "./embeds";

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => c.html(renderLandingPage(c.env.DISCORD_APPLICATION_ID)));
app.get("/legal/privacy", (c) => c.html(renderPrivacyPage()));
app.get("/legal/terms", (c) => c.html(renderTermsPage()));

app.post("/interactions", async (c) => {
  const signature = c.req.header("x-signature-ed25519");
  const timestamp = c.req.header("x-signature-timestamp");
  const body = await c.req.text();

  if (!signature || !timestamp) {
    console.warn("Received interaction request missing signature headers");
    return c.text("Bad request signature", 401);
  }

  const isValid = await verifyKey(
    body,
    signature,
    timestamp,
    c.env.DISCORD_PUBLIC_KEY,
  );
  if (!isValid) {
    console.warn("Invalid interaction request signature");
    return c.text("Bad request signature", 401);
  }

  const interaction: DiscordInteraction = JSON.parse(body);

  if (
    interaction.type === InteractionType.APPLICATION_COMMAND &&
    interaction.data
  ) {
    const commandName = interaction.data.name;
    const command = commands[commandName];

    if (command) {
      c.executionCtx.waitUntil(incrementCommandStatistic(c.env, commandName));
      const result = await command.execute(interaction, c.env);
      return c.json(result);
    }

    console.warn(`Received unknown command /${commandName}`);
    return c.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: { content: "Unknown command" },
    });
  }

  if (interaction.type === InteractionType.MESSAGE_COMPONENT) {
    if (interaction.data?.custom_id?.startsWith("status:")) {
      const group = interaction.data.custom_id.slice("status:".length);
      try {
        const statuses = await fetchStatuses();
        return c.json({
          type: InteractionResponseType.UPDATE_MESSAGE,
          data: buildStatusPage(statuses, group),
        });
      } catch (err) {
        console.error(
          `[status] Failed to fetch statuses: ${err instanceof Error ? err.message : String(err)}`,
        );
        return c.json({
          type: InteractionResponseType.UPDATE_MESSAGE,
          data: { embeds: [EMBEDS.STATUSHINT], components: [] },
        });
      }
    }

    console.warn(
      `Received unknown component custom_id '${interaction.data?.custom_id}'`,
    );
    return c.json({ type: InteractionResponseType.DEFERRED_UPDATE_MESSAGE });
  }

  console.warn(`Unhandled interaction type ${interaction.type}`);
  return c.text("Unknown interaction type", 400);
});

export default app;
