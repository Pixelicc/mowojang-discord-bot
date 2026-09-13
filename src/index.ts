import { Hono } from "hono";
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from "discord-interactions";
import { commands } from "./commands";
import type { DiscordInteraction } from "./commands";

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => c.text("Mowojang Discord Bot is running."));

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

  if (interaction.type === InteractionType.PING) {
    return c.json({ type: InteractionResponseType.PONG });
  }

  if (
    interaction.type === InteractionType.APPLICATION_COMMAND &&
    interaction.data
  ) {
    const commandName = interaction.data.name;
    const command = commands[commandName];

    if (command) {
      const result = await command.execute(interaction, c.env);
      return c.json(result);
    }

    console.warn(`Received unknown command /${commandName}`);
    return c.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: { content: "Unknown command" },
    });
  }
  console.warn(`Unhandled interaction type ${interaction.type}`);
  return c.text("Unknown interaction type", 400);
});

export default app;
