import { dashUUID, undashUUID, UUIDToIntArray } from "./utils";
import type { StatusEntry } from "./types";

const ProfileEmbed = (data: { id: string; name: string }) => ({
  title: "Minecraft Profile",
  description: `**Username:** \`${data.name}\` (${data.name.length})\n**UUID:**\n \`${undashUUID(data.id)}\`\n\`${dashUUID(data.id)}\`\n\`[I;${UUIDToIntArray(data.id).join(",")}]\``,
  color: 0xffc2d1,
  thumbnail: {
    url: `https://mc-heads.net/body/${undashUUID(data.id)}/left`,
  },
});

const NotFoundEmbed = {
  title: "Error",
  description:
    "Could not find a Minecraft Profile for the given Username/UUID.",
  color: 0xf8ad9d,
};

const StatusEmbed = {
  title: "Status",
  description:
    "Check the current status of the Mowojang API and other Minecraft related APIs.",
  color: 0xf8ad9d,
  url: "https://mowojang-status.pixelic.dev/",
};

const StatusSummaryEmbed = (statuses: StatusEntry[]) => ({
  title: "Status",
  description: "Latest status checks for Mowojang and related Minecraft APIs.",
  color: statuses.every((status) => status.results[0]?.success)
    ? 0xb8f2c2
    : 0xf8ad9d,
  url: "https://mowojang-status.pixelic.dev/",
  fields: Object.entries(
    Object.groupBy(statuses, (status) => status.group),
  ).flatMap(([group, groupedStatuses = []]) =>
    Array.from(
      { length: Math.ceil(groupedStatuses.length / 5) },
      (_, index) => {
        const chunk = groupedStatuses.slice(index * 5, index * 5 + 5);
        return {
          name:
            groupedStatuses.length > 5
              ? `${group} (${index + 1}/${Math.ceil(groupedStatuses.length / 5)})`
              : group,
          value: chunk
            .map((status) => {
              const result = status.results[0];
              const latency = result
                ? `${(result.duration / 1000000).toFixed(0)} ms`
                : "N/A";
              return `${result?.success ? "✅" : "❌"} **${status.name}**\n${result?.status ?? "N/A"} | ${result?.hostname ?? "N/A"} | ${latency}`;
            })
            .join("\n\n"),
          inline: false,
        };
      },
    ),
  ),
});

export const EMBEDS = {
  PROFILE: ProfileEmbed,
  STATUS: StatusSummaryEmbed,
  STATUSHINT: StatusEmbed,
  NOT_FOUND: NotFoundEmbed,
};
