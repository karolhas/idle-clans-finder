'use client';

import { useCalculator } from '../CalculatorContext';
import CookingItems from './CookingItems';

export default function CookingModule() {
    const { state } = useCalculator();
    const { currentSkill } = state;

    // List of skills that support cooking functionality
    const cookingSkills = ['cooking'];

    // Check if the current skill is a cooking skill
    const isCookingSkill = cookingSkills.includes(currentSkill);

    if (!isCookingSkill) {
        return null;
    }

    return (
        <div>
            <CookingItems />
        </div>
    );
}
