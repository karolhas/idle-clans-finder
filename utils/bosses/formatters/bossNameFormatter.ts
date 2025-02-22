export const formatBossName = (name: string): string => {
  return name
    .replace(/([A-Z])/g, " $1") // Dodaj spacje przed wielkimi literami
    .replace(/^./, (str) => str.toUpperCase()) // Pierwszą literę na wielką
    .trim();
};
