const ProfileComponents = (data: { UUID: string; username: string }) => ({
  type: 1,
  components: [
    {
      type: 2,
      style: 5,
      label: "NameMC",
      url: `https://namemc.com/profile/${encodeURIComponent(data.UUID)}`,
    },
    {
      type: 2,
      style: 5,
      label: "Laby",
      url: `https://laby.net/@${encodeURIComponent(data.UUID)}`,
    },
    {
      type: 2,
      style: 5,
      label: "Crafty",
      url: `https://crafty.gg/@${encodeURIComponent(data.UUID)}`,
    },
  ],
});

export const COMPONENTS = {
  PROFILE: ProfileComponents,
};
