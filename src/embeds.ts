import { dashUUID, undashUUID, UUIDToIntArray } from "./utils";
import type { StatusEntry } from "../types";

const ProfileEmbed = (data: { UUID: string; username: string }) => ({
  title: "Minecraft Profile",
  description: `**Username:** \`${data.username}\` (${data.username.length})\n**UUID:**\n \`${undashUUID(data.UUID)}\`\n\`${dashUUID(data.UUID)}\`\n\`[I;${UUIDToIntArray(data.UUID).join(",")}]\``,
  color: 0xa67996,
  thumbnail: {
    url: `https://nmsr.nickac.dev/fullbody/${undashUUID(data.UUID)}`,
  },
});

const NotFoundEmbed = {
  title: "Error",
  description: "Could not find a Minecraft Profile for the given Username/UUID.",
  color: 0xa67980,
};

const InvalidInputEmbed = {
  title: "Invalid input",
  description: "Enter a valid Minecraft username or UUID for this command.",
  color: 0xa67980,
};

const ApiErrorEmbed = {
  title: "Service unavailable",
  description: "A Minecraft profile service did not respond as expected. Please try again shortly.",
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
  description: `**Username:** \`${data.username}\` (${data.username.length})\n**UUID:**\n \`${undashUUID(data.UUID)}\`\n\`${dashUUID(data.UUID)}\`\n\`[I;${UUIDToIntArray(data.UUID).join(",")}]\`\n\n**Skin Model:** ${data.slim ? "Slim" : "Classic"}\n**Skin:** ${data.skinURL ? `[Visit URL](${data.skinURL})` : "N/A"}\n**Cape:** ${data.capeURL ? `[Visit URL](${data.capeURL})` : "N/A"}`,
  color: 0xa67996,
  thumbnail: {
    url: `https://nmsr.nickac.dev/fullbody/${undashUUID(data.UUID)}`,
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
  const visibleStatuses = groupedStatuses.slice(0, 100);
  const allHealthy =
    groupedStatuses.length > 0 && groupedStatuses.every((status) => status.results[0]?.success === true);
  const hasFailure = groupedStatuses.some((status) => status.results[0]?.success === false);

  return {
    title: `Status — ${group}`,
    description: groupedStatuses.length
      ? "Latest status checks for Mowojang and related Minecraft APIs."
      : "No status endpoints are available for this group.",
    color: allHealthy ? 0x80a679 : hasFailure ? 0xa67980 : 0x7980a6,
    url: "https://mowojang-status.pixelic.dev/",
    fields: Array.from({ length: Math.ceil(visibleStatuses.length / 4) }, (_, index) => {
      const chunk = visibleStatuses.slice(index * 4, index * 4 + 4);
      return {
        name: "\u200b",
        value: chunk
          .map((status) => {
            const result = status.results[0];
            const latency = result ? `${(result.duration / 1000000).toFixed(0)} ms` : "N/A";
            const indicator = result?.success ? "✅" : result ? "❌" : "⚪";
            return `${indicator} **${status.name.slice(0, 100)}**\n${result?.status ?? "N/A"} | ${result?.hostname.slice(0, 80) ?? "N/A"} | ${latency}`;
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
  INVALID_INPUT: InvalidInputEmbed,
  API_ERROR: ApiErrorEmbed,
};
