export const getImagePath = (name: string) => {
  if (name === "kronosWho?") {
    return "/upgrades/kronosWho.png";
  }
  return `/upgrades/${name}.png`;
};
