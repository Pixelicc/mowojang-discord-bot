const ProfileComponents = (data: { id: string; name: string }) => ({
  type: 1,
  components: [
    {
      type: 2,
      style: 5,
      label: "NameMC",
      url: `https://namemc.com/profile/${encodeURIComponent(data.id)}`,
    },
    {
      type: 2,
      style: 5,
      label: "Laby",
      url: `https://laby.net/@${encodeURIComponent(data.id)}`,
    },
    {
      type: 2,
      style: 5,
      label: "Crafty",
      url: `https://crafty.gg/@${encodeURIComponent(data.id)}`,
    },
  ],
});

export const COMPONENTS = {
  PROFILE: ProfileComponents,
};
