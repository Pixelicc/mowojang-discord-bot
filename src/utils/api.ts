import packageJSON from "../../package.json";
import { undashUUID, validatePlayer, validateUUID } from "./index";

const fetchApi = (path: string) =>
  fetch(`https://mowojang.matdoes.dev/${path}`, {
    cf: {
      cacheTtl: 300,
      cacheEverything: true,
    },
    headers: {
      "Content-Type": "application/json",
      "User-Agent": `workerd mowojang-discord-bot/${packageJSON.version} (https://github.com/pixelicc/mowojang-discord-bot)`,
    },
  });

export const getProfile = async (player: string) => {
  if (!validatePlayer(player)) return null;
  const lookup = validateUUID(player) ? undashUUID(player).toLowerCase() : player;

  const response = await fetchApi(encodeURIComponent(lookup));
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Profile lookup failed");

  const data = await response.json<{ id: string; name: string }>();
  return {
    UUID: data.id,
    username: data.name,
  };
};

export const getSession = async (UUID: string) => {
  if (!validateUUID(UUID)) return null;

  const response = await fetchApi(`session/minecraft/profile/${undashUUID(UUID).toLowerCase()}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Session lookup failed");

  const data = await response.json<{
    id: string;
    name: string;
    properties: { name: string; value: string }[];
  }>();
  const texturesProperty = data.properties.find((property) => property.name === "textures");
  if (!texturesProperty) return null;

  const decoded = JSON.parse(atob(texturesProperty.value)) as {
    textures: {
      SKIN?: { url: string; metadata?: { model?: string } };
      CAPE?: { url: string };
    };
  };
  return {
    UUID: data.id,
    username: data.name,
    skinURL: decoded.textures.SKIN?.url ?? null,
    capeURL: decoded.textures.CAPE?.url ?? null,
    slim: decoded.textures.SKIN?.metadata?.model === "slim",
  };
};
