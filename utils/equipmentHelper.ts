import { getItemName } from "@/utils/gamedata/items";

export { getItemName };

export const equipmentNames: { [key: string]: string } = {
  ammunition: "Arrow",
  earrings: "Earring",
  amulet: "Amulet",
  jewellery: "Ring",
  bracelet: "Bracelet",
  pet: "Pet",
  rightHand: "Right Hand",
  gloves: "Gloves",
  head: "Helmet",
  body: "Chestplate",
  legs: "Legs",
  cape: "Cape",
  leftHand: "Left Hand",
  belt: "Belt",
  boots: "Boots",
};

export function getBaseItemName(itemName: string | null): string | null {
  if (!itemName) return null;

  // Check if the name contains the word "enchanted" and store it
  const isEnchanted = /enchanted/i.test(itemName);

  // Clean the item name by removing the word "enchanted" and any enchantment level suffix
  let cleanName = itemName
    .replace(/enchanted/i, "") // Remove any occurrence of 'enchanted'
    .replace(/ \+\d+$/, "")
    .trim();

  // Special Cases
  if (cleanName === "Belt of the Moon") {
    cleanName = "Lunar Belt";
  }

  // If the item was enchanted, prepend "Enchanted" to the base name
  if (isEnchanted) {
    cleanName = `Enchanted ${cleanName}`;
  }

  return cleanName;
}

export function getDisplayItemName(
  itemName: string | null,
  slot: string
): string | null {
  if (!itemName) return null;

  let name = getBaseItemName(itemName);

  // Handle the pet slot by removing the word "pet" if it's present
  if (name && slot === "pet") {
    name = name.replace(/\bpet\b/gi, "").trim();

    // Special cases for pets
    const lilPets: { [key: string]: string } = {
      agility: "Lil' Runner",
      brewing: "Lil' Brewer",
      carpentry: "Lil' Carpenter",
      crafting: "Lil' Crafter",
      cooking: "Lil' Chef",
      enchanting: "Lil' Enchanter",
      farming: "Lil' Farmer",
      fishing: "Lil' Fisher",
      foraging: "Lil' Forager",
      mining: "Lil' Miner",
      plundering: "Lil' Plunderer",
      smithing: "Lil' Smither",
      woodcutting: "Lil' Chopper",
      bloodmoon: "Lil' eclipse",
    };

    // Combat pet mappings
    const combatPets: { [key: string]: string } = {
      melee: "Lil' Fighter",
      magic: "Lil' Wizard",
      archer: "Lil' Archer",
    };

    const lowerName = name.toLowerCase();

    // Handle combat pets with tiers
    if (lowerName.includes("tier")) {
      const tierPatterns = [
        /tier_(\d+)/i, // tier_1, tier_2, etc.
        /tier\s*(\d+)/i, // tier 1, tier 2, etc.
      ];

      let tier = "";
      for (const pattern of tierPatterns) {
        const match = lowerName.match(pattern);
        if (match && match[1]) {
          tier = match[1];
          break;
        }
      }

      // Check for combat pet types in the name
      for (const [key, value] of Object.entries(combatPets)) {
        // Only match if the name is exactly the combat type or starts with it
        if (lowerName === key || lowerName.startsWith(`${key} `)) {
          name = tier ? `${value} (Tier ${tier})` : value;
          break;
        }
      }
    } else {
      // Handle regular pets
      for (const [key, value] of Object.entries(lilPets)) {
        if (lowerName === key) {
          name = value;
          break;
        }
      }
    }
  }

  // Special Cases
  if (name === "Belt of the Moon") {
    name = "Lunar Belt";
  }

  return name;
}

// Function to safely create image paths with fallback handling
export function createSafeImagePath(name: string | null): string {
  if (!name) return "/placeholder.png";
  // Remove 'enchanted' from the name for the image path
  let cleanName = name
    .replace(/enchanted/i, "")
    .trim()
    .replace(/\s+/g, "_")
    .toLowerCase();

  // Special Cases
  if (cleanName === "lunar_belt") {
    cleanName = "belt_of_the_moon";
  }

  // Special cases for gilded pets
  if (cleanName === "lil'_companion") {
    cleanName = "gilded_pet_1";
  } else if (cleanName === "lil'_swagger") {
    cleanName = "gilded_pet_2";
  } else if (cleanName === "lil_eclipse") {
    cleanName = "pet_bloodmoon";
  }

  // Add public prefix
  return `/gameimages/${cleanName}.png`;
}
