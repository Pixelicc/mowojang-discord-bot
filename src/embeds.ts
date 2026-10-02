import { dashUUID, undashUUID, UUIDToIntArray } from "./utils";
import type { StatusEntry } from "../types";

const ProfileEmbed = (data: { UUID: string; username: string }) => ({
  title: "Minecraft Profile",
  description: `**Username:** \`${data.username}\` (${data.username.length})\n**UUID:**\n \`${undashUUID(data.UUID)}\`\n\`${dashUUID(data.UUID)}\`\n\`[I;${UUIDToIntArray(data.UUID).join(",")}]\``,
  color: 0xa67996,
  thumbnail: {
    url: `https://mc-heads.net/body/${undashUUID(data.UUID)}/left`,
  },
});

const NotFoundEmbed = {
  title: "Error",
  description: "Could not find a Minecraft Profile for the given Username/UUID.",
  color: 0xa67980,
};

const SessionEmbed = (data: {
  UUID: string;
  username: string;
  skinURL: string | null;
  capeURL: string | null;
  slim: boolean;
}) => ({
  title: "Minecraft Session Profile",
  description: `**Username:** \`${data.username}\` (${data.username.length})\n**UUID:**\n \`${undashUUID(data.UUID)}\`\n\`${dashUUID(data.UUID)}\`\n\`[I;${UUIDToIntArray(data.UUID).join(",")}]\`\n**Skin Model:** ${data.slim ? "Slim" : "Classic"}\n**Skin URL:** ${data.skinURL ?? "N/A"}\n**Cape URL:** ${data.capeURL ?? "N/A"}`,
  color: 0xa67996,
  thumbnail: {
    url: `https://mc-heads.net/body/${undashUUID(data.UUID)}/left`,
  },
});

const StatusEmbed = {
  title: "Status",
  description: "Check the current status of the Mowojang API and other Minecraft related APIs.",
  color: 0xa67980,
  url: "https://mowojang-status.pixelic.dev/",
};

const StatusSummaryEmbed = (statuses: StatusEntry[], group: string) => {
  const groupedStatuses = statuses.filter((status) => status.group === group);

  return {
    title: `Status — ${group}`,
    description: "Latest status checks for Mowojang and related Minecraft APIs.",
    color: groupedStatuses.every((status) => status.results[0]?.success) ? 0x80a679 : 0xa67980,
    url: "https://mowojang-status.pixelic.dev/",
    fields: Array.from({ length: Math.ceil(groupedStatuses.length / 5) }, (_, index) => {
      const chunk = groupedStatuses.slice(index * 5, index * 5 + 5);
      return {
        name: "Endpoints",
        value: chunk
          .map((status) => {
            const result = status.results[0];
            const latency = result ? `${(result.duration / 1000000).toFixed(0)} ms` : "N/A";
            return `${result?.success ? "✅" : "❌"} **${status.name}**\n${result?.status ?? "N/A"} | ${result?.hostname ?? "N/A"} | ${latency}`;
          })
          .join("\n\n"),
        inline: false,
      };
    }),
  };
};

export const EMBEDS = {
  PROFILE: ProfileEmbed,
  SESSION: SessionEmbed,
  STATUS: StatusSummaryEmbed,
  STATUSHINT: StatusEmbed,
  NOT_FOUND: NotFoundEmbed,
};
