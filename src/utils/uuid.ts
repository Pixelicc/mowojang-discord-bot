/**
 * @link https://github.com/Pixelicc/mowojang/blob/main/src/utils.ts
 */

/**
 * Adds dashes to a UUID string if not already dashed
 *
 * @example
 * ```TS
 * dashUUID("14727faefbdc4aff848cd2713eb9939e"); // "14727fae-fbdc-4aff-848c-d2713eb9939e"
 * ```
 */
export const dashUUID = (UUID: string): string => {
  const clean = undashUUID(UUID);
  if (clean.length === 32) {
    return clean.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
  }
  return UUID;
};

/**
 * Removes dashes from a UUID string
 *
 * @example
 * ```TS
 * undashUUID("14727fae-fbdc-4aff-848c-d2713eb9939e"); // "14727faefbdc4aff848cd2713eb9939e"
 * ```
 */
export const undashUUID = (UUID: string): string => {
  return UUID.replaceAll("-", "");
};

export const UUIDToIntArray = (UUID: string): number[] => {
  return Array.from(
    { length: 4 },
    (_, index) => Number.parseInt(undashUUID(UUID).slice(index * 8, index * 8 + 8), 16) | 0,
  );
};
