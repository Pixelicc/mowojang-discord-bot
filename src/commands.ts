import { InteractionResponseType } from "discord-interactions";
import { getCommandStatistics } from "./stats";
import { getProfile } from "./utils";
import { EMBEDS } from "./embeds";
import { COMPONENTS } from "./components";
import { fetchStatuses, orderGroups, buildStatusPage } from "./status";
import type { Command } from "../types";

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
      const profile = await getProfile(username);
      if (profile) {
        console.log(
          `[uuid] Found UUID '${profile.UUID}' for '${profile.username}'`,
        );
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            embeds: [EMBEDS.PROFILE(profile)],
            components: [COMPONENTS.PROFILE(profile)],
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
          embeds: [EMBEDS.STATUSHINT],
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
      const profile = await getProfile(cleanUuid);
      if (profile) {
        console.log(
          `[username] Found Username '${profile.username}' for ${profile.UUID}`,
        );
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            embeds: [EMBEDS.PROFILE(profile)],
            components: [COMPONENTS.PROFILE(profile)],
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
          embeds: [EMBEDS.STATUSHINT],
        },
      };
    }
  },
};

export const profileCommand: Command = {
  name: "profile",
  description: "Look up a Profile by Username or UUID",
  options: [
    {
      type: 3,
      name: "player",
      description: "Minecraft Username or UUID",
      required: true,
    },
  ],
  execute: async (interaction) => {
    const playerOption = interaction.data?.options?.find(
      (opt) => opt.name === "player",
    );
    const player = (playerOption?.value as string)?.trim().replaceAll("-", "");
    console.log(`[profile] Looking up profile for '${player}'`);
    try {
      const profile = await getProfile(player);
      if (profile) {
        console.log(
          `[profile] Found profile '${profile.username}' (${profile.UUID})`,
        );
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            embeds: [EMBEDS.PROFILE(profile)],
            components: [COMPONENTS.PROFILE(profile)],
          },
        };
      }
      console.log(`[profile] Player '${player}' not found.`);
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [EMBEDS.NOT_FOUND],
        },
      };
    } catch (err) {
      console.error(
        `[profile] Failed to fetch profile: ${err instanceof Error ? err.message : String(err)}`,
      );
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [EMBEDS.STATUSHINT],
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
            color: 0x7980a6,
          },
        ],
      },
    };
  },
};

export const statusCommand: Command = {
  name: "status",
  description: "View the Status of Mowojang and related Minecraft APIs",
  execute: async () => {
    try {
      const statuses = await fetchStatuses();
      const [defaultGroup] = orderGroups(statuses);
      if (!defaultGroup) {
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { embeds: [EMBEDS.STATUSHINT] },
        };
      }

      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: buildStatusPage(statuses, defaultGroup),
      };
    } catch (err) {
      console.error(
        `[status] Failed to fetch statuses: ${err instanceof Error ? err.message : String(err)}`,
      );
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [EMBEDS.STATUSHINT],
        },
      };
    }
  },
};

export const commands: Record<string, Command> = {
  [pingCommand.name]: pingCommand,
  [uuidCommand.name]: uuidCommand,
  [usernameCommand.name]: usernameCommand,
  [profileCommand.name]: profileCommand,
  [statsCommand.name]: statsCommand,
  [statusCommand.name]: statusCommand,
};
