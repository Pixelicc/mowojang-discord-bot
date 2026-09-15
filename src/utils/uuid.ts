export const dashUUID = (UUID: string): string => {
  const clean = undashUUID(UUID);
  if (clean.length === 32) {
    return clean.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
  }
  return UUID;
};

export const undashUUID = (UUID: string): string => {
  return UUID.replaceAll("-", "");
};

export const UUIDToIntArray = (UUID: string): number[] => {
  return Array.from(
    { length: 4 },
    (_, index) =>
      Number.parseInt(undashUUID(UUID).slice(index * 8, index * 8 + 8), 16) | 0,
  );
};
