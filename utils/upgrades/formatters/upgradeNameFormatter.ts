export const formatUpgradeName = (name: string): string => {
  return name
    .split(/(?=[A-Z])|[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
