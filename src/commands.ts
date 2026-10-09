import { InteractionResponseType } from "discord-interactions";
import {
  getProfile,
  getSession,
  validatePlayer,
  validateUsername,
  validateUUID,
  fetchStatuses,
  orderGroups,
  buildStatusPage,
  getCommandStatistics,
} from "./utils";
import { EMBEDS } from "./embeds";
import { COMPONENTS } from "./components";
import type { Command } from "../types";

const getOptionValue = (interaction: Parameters<Command["execute"]>[0], name: string): string =>
  interaction.data?.options?.find((option) => option.name === name)?.value.trim() ?? "";

const invalidInputResponse = () => ({
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: { embeds: [EMBEDS.INVALID_INPUT] },
});

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
    const username = getOptionValue(interaction, "username");
    if (!validateUsername(username)) return invalidInputResponse();
    console.log(`[uuid] Looking up UUID for Username '${username}'`);
    try {
      const profile = await getProfile(username);
      if (profile) {
        console.log(`[uuid] Found UUID '${profile.UUID}' for '${profile.username}'`);
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
      console.error(`[uuid] Failed to fetch profile: ${err instanceof Error ? err.message : String(err)}`);
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [EMBEDS.API_ERROR],
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
    const uuid = getOptionValue(interaction, "uuid");
    if (!validateUUID(uuid)) return invalidInputResponse();
    console.log(`[username] Looking up Username for UUID '${uuid}'`);
    const cleanUuid = uuid.replaceAll("-", "");
    try {
      const profile = await getProfile(cleanUuid);
      if (profile) {
        console.log(`[username] Found Username '${profile.username}' for ${profile.UUID}`);
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
      console.error(`[username] Failed to fetch session profile: ${err instanceof Error ? err.message : String(err)}`);
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [EMBEDS.API_ERROR],
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
    const rawPlayer = getOptionValue(interaction, "player");
    if (!validatePlayer(rawPlayer)) return invalidInputResponse();
    const player = rawPlayer.replaceAll("-", "");
    console.log(`[profile] Looking up profile for '${player}'`);
    try {
      const profile = await getProfile(player);
      if (profile) {
        console.log(`[profile] Found profile '${profile.username}' (${profile.UUID})`);
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
      console.error(`[profile] Failed to fetch profile: ${err instanceof Error ? err.message : String(err)}`);
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [EMBEDS.API_ERROR],
        },
      };
    }
  },
};

export const sessionCommand: Command = {
  name: "session",
  description: "Look up a Session Profile including skin and cape by Username or UUID",
  options: [
    {
      type: 3,
      name: "player",
      description: "Minecraft Username or UUID",
      required: true,
    },
  ],
  execute: async (interaction) => {
    const player = getOptionValue(interaction, "player");
    if (!validatePlayer(player)) return invalidInputResponse();
    console.log(`[session] Looking up session for '${player}'`);
    try {
      let uuid = player.replaceAll("-", "");
      if (!validateUUID(uuid)) {
        const profile = await getProfile(player);
        if (!profile) {
          console.log(`[session] Player '${player}' not found.`);
          return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              embeds: [EMBEDS.NOT_FOUND],
            },
          };
        }
        uuid = profile.UUID;
      }
      const session = await getSession(uuid);
      if (session) {
        console.log(`[session] Found session for '${session.username}' (${session.UUID})`);
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            embeds: [EMBEDS.SESSION(session)],
            components: [COMPONENTS.PROFILE(session)],
          },
        };
      }
      console.log(`[session] Player '${player}' not found.`);
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [EMBEDS.NOT_FOUND],
        },
      };
    } catch (err) {
      console.error(`[session] Failed to fetch session: ${err instanceof Error ? err.message : String(err)}`);
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [EMBEDS.API_ERROR],
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
    const description = entries.map(([name, count]) => `**/${name}:** ${count}`).join("\n");

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
      console.error(`[status] Failed to fetch statuses: ${err instanceof Error ? err.message : String(err)}`);
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
  [uuidCommand.name]: uuidCommand,
  [usernameCommand.name]: usernameCommand,
  [profileCommand.name]: profileCommand,
  [sessionCommand.name]: sessionCommand,
  [statsCommand.name]: statsCommand,
  [statusCommand.name]: statusCommand,
};
