import { dashUUID, undashUUID, UUIDToIntArray } from "./utils";

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

export const EMBEDS = {
  PROFILE: ProfileEmbed,
  STATUS: StatusEmbed,
  NOT_FOUND: NotFoundEmbed,
};
