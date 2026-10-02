export const incrementCommandStatistic = async function (env: Env, commandName: string): Promise<void> {
  const key = `stats:commands:${commandName}`;
  const current = Number.parseInt((await env.MOWOJANG_DISCORD_BOT.get(key)) ?? "0", 10);
  await env.MOWOJANG_DISCORD_BOT.put(key, String(current + 1));
};

export const getCommandStatistics = async function (env: Env): Promise<Record<string, number>> {
  const stats: Record<string, number> = {};
  const { keys } = await env.MOWOJANG_DISCORD_BOT.list({
    prefix: "stats:commands:",
  });
  const values = await Promise.all(keys.map((k) => env.MOWOJANG_DISCORD_BOT.get(k.name)));
  keys.forEach((k, i) => {
    const commandName = k.name.slice("stats:commands:".length);
    stats[commandName] = Number.parseInt(values[i] ?? "0", 10);
  });
  return stats;
};
