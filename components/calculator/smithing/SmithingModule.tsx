'use client';

import SmithingItems from './SmithingItems';
import { useCalculator } from '../CalculatorContext';

export default function SmithingModule() {
    const { state } = useCalculator();
    const { currentSkill } = state;

    // List of skills that support smithing functionality (currently just smithing)
    const smithingSkills = ['smithing'];

    // Check if the current skill is a smithing skill
    const isSmithingSkill = smithingSkills.includes(currentSkill);

    if (!isSmithingSkill) {
        return null;
    }

    return (
        <div>
            <SmithingItems />
        </div>
    );
}
