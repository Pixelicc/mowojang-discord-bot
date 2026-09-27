import { EMBEDS } from "../embeds";
import { COMPONENTS } from "../components";
import type { StatusEntry } from "../../types";

const STATUS_GROUPS = [
  "Mowojang API",
  "Seraph API",
  "Minecraft API",
  "Other APIs",
];

export async function fetchStatuses(): Promise<StatusEntry[]> {
  const response = await fetch(
    "https://mowojang-status.pixelic.dev/api/v1/endpoints/statuses?page=1&pageSize=1",
  );
  return (await response.json()) as StatusEntry[];
}

export function orderGroups(statuses: StatusEntry[]): string[] {
  const groups = [...new Set(statuses.map((status) => status.group))];
  return groups.sort((a, b) => {
    const indexA = STATUS_GROUPS.indexOf(a);
    const indexB = STATUS_GROUPS.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
}

export function buildStatusPage(statuses: StatusEntry[], group: string) {
  return {
    embeds: [EMBEDS.STATUS(statuses, group)],
    components: [COMPONENTS.STATUS(orderGroups(statuses), group)],
  };
}
