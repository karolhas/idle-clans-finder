'use client';

import CraftingModule from './crafting/CraftingModule';
import MiningModule from './mining/MiningModule';
import CarpentryModule from './carpentry/CarpentryModule';
import FarmingModule from './farming/FarmingModule';
import ForagingModule from './foraging/ForagingModule';
import EnchantingModule from './enchanting/EnchantingModule';
import WoodcuttingModule from './woodcutting/WoodcuttingModule';
import AgilityModule from './agility/AgilityModule';
import FishingModule from './fishing/FishingModule';
import PlunderingModule from './plundering/PlunderingModule';
import BrewingModule from './brewing/BrewingModule';
import CookingModule from './cooking/CookingModule';
import SmithingModule from './smithing/SmithingModule';

export default function SkillItems() {
    // This component now acts as a router to different skill-specific modules

    return (
        <>
            {/* Crafting skills module */}
            <CraftingModule />

            {/* Mining-specific module */}
            <MiningModule />

            {/* Carpentry-specific module */}
            <CarpentryModule />

            {/* Farming-specific module */}
            <FarmingModule />

            {/* Foraging-specific module */}
            <ForagingModule />

            {/* Enchanting-specific module */}
            <EnchantingModule />

            {/* Woodcutting-specific module */}
            <WoodcuttingModule />

            {/* Agility-specific module */}
            <AgilityModule />

            {/* Fishing-specific module */}
            <FishingModule />

            {/* Plundering-specific module */}
            <PlunderingModule />

            {/* Brewing-specific module */}
            <BrewingModule />

            {/* Cooking-specific module */}
            <CookingModule />

            {/* Smithing-specific module */}
            <SmithingModule />

            {/* Additional skill modules will be added here as they are implemented */}
        </>
    );
}
