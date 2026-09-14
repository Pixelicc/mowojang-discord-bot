import { InteractionResponseType } from "discord-interactions";
import { getCommandStats } from "./stats";

const MOWOJANG_STATUS_URL = "https://mowojang-status.pixelic.dev/";

const formatUUID = (UUID: string): string => {
  const clean = UUID.replaceAll("-", "");
  if (clean.length === 32) {
    return clean.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
  }
  return UUID;
};

const getSkinURL = (UUID: string): string =>
  `https://mc-heads.net/body/${UUID.replaceAll("-", "").toLowerCase()}/left`;

export interface CommandOption {
  type: number;
  name: string;
  description: string;
  required?: boolean;
}

export interface Command {
  name: string;
  description: string;
  options?: CommandOption[];
  integration_types?: number[];
  contexts?: number[];
  execute: (
    interaction: DiscordInteraction,
    env: Env,
  ) => unknown | Promise<unknown>;
}

export interface DiscordInteractionOption {
  name: string;
  type: number;
  value: string;
}

export interface DiscordInteractionUser {
  id?: string;
  username?: string;
}

export interface DiscordInteraction {
  id?: string;
  type: number;
  data?: {
    id?: string;
    name: string;
    options?: DiscordInteractionOption[];
  };
  member?: { user?: DiscordInteractionUser };
  user?: DiscordInteractionUser;
}

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
      description: "Minecraft username",
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
        const formattedUuid = formatUUID(data.id);
        console.log(`[uuid] Found UUID '${formattedUuid}' for '${data.name}'`);
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            embeds: [
              {
                title: "Minecraft Profile",
                description: `**Username:** ${data.name}\n**UUID:** \`${formattedUuid}\``,
                color: 0x5865f2,
                thumbnail: { url: getSkinURL(data.id) },
              },
            ],
            components: [
              {
                type: 1,
                components: [
                  {
                    type: 2,
                    style: 5,
                    label: "NameMC",
                    url: `https://namemc.com/profile/${encodeURIComponent(data.name)}`,
                  },
                  {
                    type: 2,
                    style: 5,
                    label: "Laby",
                    url: `https://laby.net/@${encodeURIComponent(data.name)}`,
                  },
                  {
                    type: 2,
                    style: 5,
                    label: "Crafty",
                    url: `https://crafty.gg/@${encodeURIComponent(data.name)}`,
                  },
                ],
              },
            ],
          },
        };
      }
      console.log(`[uuid] Username '${username}' not found.`);
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [
            {
              title: "Profile not found",
              description: `Could not find a Minecraft user with username **${username}**.`,
              color: 0xe74c3c,
            },
          ],
        },
      };
    } catch (err) {
      console.error(
        `[uuid] Failed to fetch profile: ${err instanceof Error ? err.message : String(err)}`,
      );
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [
            {
              title: "Mowojang API unavailable",
              description: `An error occurred while contacting the Mowojang API. Please check the status page: ${MOWOJANG_STATUS_URL}`,
              url: MOWOJANG_STATUS_URL,
              color: 0xe74c3c,
            },
          ],
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
        const formattedUuid = formatUUID(data.id);
        console.log(
          `[username] Found Username '${data.name}' for ${formattedUuid}`,
          interaction.id ?? "",
        );
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            embeds: [
              {
                title: "Minecraft Profile",
                description: `**UUID:** \`${formattedUuid}\`\n**Username:** ${data.name}`,
                color: 0x5865f2,
                thumbnail: { url: getSkinURL(data.id) },
              },
            ],
            components: [
              {
                type: 1,
                components: [
                  {
                    type: 2,
                    style: 5,
                    label: "NameMC",
                    url: `https://namemc.com/profile/${encodeURIComponent(data.name)}`,
                  },
                  {
                    type: 2,
                    style: 5,
                    label: "Laby",
                    url: `https://laby.net/@${encodeURIComponent(data.name)}`,
                  },
                  {
                    type: 2,
                    style: 5,
                    label: "Crafty",
                    url: `https://crafty.gg/@${encodeURIComponent(data.name)}`,
                  },
                ],
              },
            ],
          },
        };
      }
      console.log(`[username] UUID '${uuid}' not found.`);
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [
            {
              title: "Profile not found",
              description: `Could not find a Minecraft profile for UUID **${uuid}**.`,
              color: 0xe74c3c,
            },
          ],
        },
      };
    } catch (err) {
      console.error(
        `[username] Failed to fetch session profile: ${err instanceof Error ? err.message : String(err)}`,
      );
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [
            {
              title: "Mowojang API unavailable",
              description: `An error occurred while contacting the Mowojang API. Please check the status page: ${MOWOJANG_STATUS_URL}`,
              url: MOWOJANG_STATUS_URL,
              color: 0xe74c3c,
            },
          ],
        },
      };
    }
  },
};

export const statsCommand: Command = {
  name: "stats",
  description: "View Command Usage Statistics",
  execute: async (_interaction, env) => {
    const stats = await getCommandStats(env);
    const entries = Object.entries(stats).sort(([, a], [, b]) => b - a);
    const description = entries
      .map(([name, count]) => `**/${name}:** ${count}`)
      .join("\n");

    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        embeds: [
          {
            title: "Command Usage Stats",
            description,
            color: 0x5865f2,
          },
        ],
        flags: 64,
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
