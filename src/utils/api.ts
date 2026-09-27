import { undashUUID, validatePlayer, validateUUID } from "./index";

export const getProfile = async (
  player: string,
): Promise<null | { UUID: string; username: string }> => {
  if (!validatePlayer(player)) return null;

  const response = await fetch(`https://mowojang.matdoes.dev/${player}`, {
    cf: {
      cacheTtl: 300,
      cacheEverything: true,
    },
  });
  if (!response.ok) {
    return null;
  }
  const data = await response.json<{ id: string; name: string }>();
  return {
    UUID: data.id,
    username: data.name,
  };
};

export const getSession = async (
  UUID: string,
): Promise<null | {
  UUID: string;
  username: string;
  skinURL: string | null;
  capeURL: string | null;
  slim: boolean;
}> => {
  if (!validateUUID(UUID)) return null;

  const response = await fetch(
    `https://mowojang.matdoes.dev/session/minecraft/profile/${undashUUID(UUID)}`,
    {
      cf: {
        cacheTtl: 300,
        cacheEverything: true,
      },
    },
  );
  if (!response.ok) {
    return null;
  }
  const data = await response.json<{
    id: string;
    name: string;
    properties: { name: string; value: string }[];
  }>();
  const texturesProperty = data.properties.find(
    (property) => property.name === "textures",
  );
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
