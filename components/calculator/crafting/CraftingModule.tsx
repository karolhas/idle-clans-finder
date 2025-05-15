'use client';

import CraftingItems from './CraftingItems';
import { useCalculator } from '../CalculatorContext';

export default function CraftingModule() {
    const { state } = useCalculator();
    const { currentSkill } = state;

    // List of skills that support crafting functionality
    const craftingSkills = ['crafting'];

    // Check if the current skill is a crafting skill
    const isCraftingSkill = craftingSkills.includes(currentSkill);

    if (!isCraftingSkill) {
        return null;
    }

    return (
        <div>
            <CraftingItems />
        </div>
    );
}
