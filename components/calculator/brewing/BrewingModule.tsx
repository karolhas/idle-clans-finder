'use client';

import { useCalculator } from '../CalculatorContext';
import BrewingItems from './BrewingItems';

export default function BrewingModule() {
    const { state } = useCalculator();
    const { currentSkill } = state;

    // List of skills that support brewing functionality
    const brewingSkills = ['brewing'];

    // Check if the current skill is a brewing skill
    const isBrewingSkill = brewingSkills.includes(currentSkill);

    if (!isBrewingSkill) {
        return null;
    }

    return (
        <div>
            <BrewingItems />
        </div>
    );
}
