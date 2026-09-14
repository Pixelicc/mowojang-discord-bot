const keyFor = (commandName: string): string =>
  `mowojang/bot/stats/${commandName}`;

export async function incrementCommandStatistic(
  env: Env,
  commandName: string,
): Promise<void> {
  const key = keyFor(commandName);
  const current = Number.parseInt(
    (await env.COMMAND_STATS.get(key)) ?? "0",
    10,
  );
  await env.COMMAND_STATS.put(key, String(current + 1));
}

export async function getCommandStats(
  env: Env,
): Promise<Record<string, number>> {
  const stats: Record<string, number> = {};
  const { keys } = await env.COMMAND_STATS.list({
    prefix: "mowojang/bot/stats/",
  });
  const values = await Promise.all(
    keys.map((k) => env.COMMAND_STATS.get(k.name)),
  );
  keys.forEach((k, i) => {
    const commandName = k.name.slice("mowojang/bot/stats/".length);
    stats[commandName] = Number.parseInt(values[i] ?? "0", 10);
  });
  return stats;
}
