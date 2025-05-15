'use client';

import { useCalculator } from '../CalculatorContext';
import EnchantingItems from './EnchantingItems';

export default function EnchantingModule() {
    const { state } = useCalculator();
    const { currentSkill } = state;

    // List of skills that support enchanting functionality
    const enchantingSkills = ['enchanting'];

    // Check if the current skill is an enchanting skill
    const isEnchantingSkill = enchantingSkills.includes(currentSkill);

    if (!isEnchantingSkill) {
        return null;
    }

    return (
        <div>
            <EnchantingItems />
        </div>
    );
}
