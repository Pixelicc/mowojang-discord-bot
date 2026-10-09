import { EMBEDS } from "../embeds";
import { COMPONENTS } from "../components";
import type { StatusEntry } from "../../types";

const STATUS_GROUPS = ["Mowojang API", "Seraph API", "Minecraft API", "Other APIs"];

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

const isStatusEntry = (value: unknown): value is StatusEntry =>
  isRecord(value) &&
  typeof value.name === "string" &&
  typeof value.group === "string" &&
  Array.isArray(value.results) &&
  value.results.every(
    (result) =>
      isRecord(result) &&
      typeof result.status === "number" &&
      typeof result.hostname === "string" &&
      typeof result.duration === "number" &&
      typeof result.success === "boolean" &&
      typeof result.timestamp === "string",
  );

export async function fetchStatuses(): Promise<StatusEntry[]> {
  const response = await fetch("https://mowojang-status.pixelic.dev/api/v1/endpoints/statuses?page=1&pageSize=1", {
    cf: {
      cacheTtl: 300,
      cacheEverything: true,
    },
  });
  if (!response.ok) {
    throw new Error(`Status service request failed (${response.status})`);
  }
  const data: unknown = await response.json();
  if (!Array.isArray(data) || !data.every(isStatusEntry)) {
    throw new Error("Status service returned an invalid response");
  }
  return data;
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
