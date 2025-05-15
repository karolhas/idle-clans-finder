'use client';

import { useCalculator } from '../CalculatorContext';
import FarmingItems from './FarmingItems';

export default function FarmingModule() {
    const { state } = useCalculator();
    const { currentSkill } = state;

    // List of skills that support farming functionality (currently just farming)
    const farmingSkills = ['farming'];

    // Check if the current skill is a farming skill
    const isFarmingSkill = farmingSkills.includes(currentSkill);

    if (!isFarmingSkill) {
        return null;
    }

    return (
        <div>
            <FarmingItems />
        </div>
    );
}
