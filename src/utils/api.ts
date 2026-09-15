import { validatePlayer } from "./validators";

export const getProfile = async (
  player: string,
): Promise<null | { UUID: string; username: string }> => {
  if (!validatePlayer(player)) return null;

  const response = await fetch(`https://mowojang.matdoes.dev/${player}`);
  if (!response.ok) {
    return null;
  }
  const data = await response.json<{ id: string; name: string }>();
  return {
    UUID: data.id,
    username: data.name,
  };
};
