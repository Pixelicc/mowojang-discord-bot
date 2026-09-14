import { InteractionResponseType } from "discord-interactions";
import { getCommandStatistics } from "./stats";
import { dashUUID } from "./utils";
import { EMBEDS } from "./embeds";
import { COMPONENTS } from "./components";
import type { Command } from "./types";

export const pingCommand: Command = {
  name: "ping",
  description: "Replies with pong!",
  execute: () => {
    console.log("[ping] Executed /ping");
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: { content: "🏓 Pong!", flags: 64 },
    };
  },
};

export const uuidCommand: Command = {
  name: "uuid",
  description: "Convert a Minecraft Username to its UUID",
  options: [
    {
      type: 3,
      name: "username",
      description: "Minecraft Username",
      required: true,
    },
  ],
  execute: async (interaction) => {
    const usernameOption = interaction.data?.options?.find(
      (opt) => opt.name === "username",
    );
    const username = usernameOption?.value?.trim() as string;
    console.log(`[uuid] Looking up UUID for Username '${username}'`);
    try {
      const res = await fetch(
        `https://mowojang.matdoes.dev/users/profiles/minecraft/${encodeURIComponent(username)}`,
      );
      if (res.status === 200) {
        const data = (await res.json()) as { id: string; name: string };
        const formattedUuid = dashUUID(data.id);
        console.log(`[uuid] Found UUID '${formattedUuid}' for '${data.name}'`);
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            embeds: [EMBEDS.PROFILE(data)],
            components: [COMPONENTS.PROFILE(data)],
          },
        };
      }
      console.log(`[uuid] Username '${username}' not found.`);
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [EMBEDS.NOT_FOUND],
        },
      };
    } catch (err) {
      console.error(
        `[uuid] Failed to fetch profile: ${err instanceof Error ? err.message : String(err)}`,
      );
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [EMBEDS.STATUS],
        },
      };
    }
  },
};

export const usernameCommand: Command = {
  name: "username",
  description: "Convert a Minecraft UUID to its Username",
  options: [
    {
      type: 3,
      name: "uuid",
      description: "Minecraft UUID",
      required: true,
    },
  ],
  execute: async (interaction) => {
    const uuidOption = interaction.data?.options?.find(
      (opt) => opt.name === "uuid",
    );
    const uuid = uuidOption?.value?.trim() as string;
    console.log(`[username] Looking up Username for UUID '${uuid}'`);
    const cleanUuid = uuid.replaceAll("-", "");
    try {
      const res = await fetch(
        `https://mowojang.matdoes.dev/session/minecraft/profile/${encodeURIComponent(cleanUuid)}`,
      );
      if (res.status === 200) {
        const data = (await res.json()) as { id: string; name: string };
        const formattedUuid = dashUUID(data.id);
        console.log(
          `[username] Found Username '${data.name}' for ${formattedUuid}`,
          interaction.id ?? "",
        );
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            embeds: [EMBEDS.PROFILE(data)],
            components: [COMPONENTS.PROFILE(data)],
          },
        };
      }
      console.log(`[username] UUID '${uuid}' not found.`);
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [EMBEDS.NOT_FOUND],
        },
      };
    } catch (err) {
      console.error(
        `[username] Failed to fetch session profile: ${err instanceof Error ? err.message : String(err)}`,
      );
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [EMBEDS.STATUS],
        },
      };
    }
  },
};

export const statsCommand: Command = {
  name: "stats",
  description: "View Statistics",
  execute: async (_interaction, env) => {
    const stats = await getCommandStatistics(env);
    const entries = Object.entries(stats).sort(([, a], [, b]) => b - a);
    const description = entries
      .map(([name, count]) => `**/${name}:** ${count}`)
      .join("\n");

    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        embeds: [
          {
            title: "Statistics",
            description,
            color: 0xffc2d1,
          },
        ],
      },
    };
  },
};

export const commands: Record<string, Command> = {
  [pingCommand.name]: pingCommand,
  [uuidCommand.name]: uuidCommand,
  [usernameCommand.name]: usernameCommand,
  [statsCommand.name]: statsCommand,
};
