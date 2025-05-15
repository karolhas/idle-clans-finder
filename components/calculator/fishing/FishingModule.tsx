'use client';

import { useCalculator } from '../CalculatorContext';
import FishingItems from './FishingItems';

export default function FishingModule() {
    const { state } = useCalculator();
    const { currentSkill } = state;

    // List of skills that support fishing functionality
    const fishingSkills = ['fishing'];

    // Check if the current skill is a fishing skill
    const isFishingSkill = fishingSkills.includes(currentSkill);

    if (!isFishingSkill) {
        return null;
    }

    return (
        <div>
            <FishingItems />
        </div>
    );
}
