import { undashUUID } from "./index";

/**
 * @link https://github.com/Pixelicc/mowojang/blob/main/src/validators.ts
 */

const UUID_REGEX = /^[0-9a-f]{12}4[0-9a-f]{19}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{1,16}$/;

/**
 * Validates a UUID string both dashed or undashed
 *
 * @example
 * ```TS
 * validateUUID("14727fae-fbdc-4aff-848c-d2713eb9939e"); // true
 * ```
 */
export const validateUUID = (UUID: string): boolean => {
  if (typeof UUID !== "string") return false;
  UUID = undashUUID(UUID);
  if (UUID.length !== 32) return false;
  return UUID_REGEX.test(UUID);
};

/**
 * Validates a Minecraft Username
 *
 * @example
 * ```TS
 * validateUsername("Pixelic"); // true
 * ```
 */
export const validateUsername = (username: string): boolean => {
  if (typeof username !== "string") return false;
  return USERNAME_REGEX.test(username);
};

/**
 * Validates a Minecraft Player by either validating their Username or supplied UUID
 *
 * @example
 * ```TS
 * validatePlayer("Pixelic"); // true
 * validatePlayer("14727fae-fbdc-4aff-848c-d2713eb9939e"); // true
 * ```
 */
export const validatePlayer = (player: string): boolean =>
  validateUUID(player) || validateUsername(player);
