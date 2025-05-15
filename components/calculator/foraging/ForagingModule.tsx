'use client';

import { useCalculator } from '../CalculatorContext';
import ForagingItems from './ForagingItems';

export default function ForagingModule() {
    const { state } = useCalculator();
    const { currentSkill } = state;

    // List of skills that support foraging functionality
    const foragingSkills = ['foraging'];

    // Check if the current skill is a foraging skill
    const isForagingSkill = foragingSkills.includes(currentSkill);

    if (!isForagingSkill) {
        return null;
    }

    return (
        <div>
            <ForagingItems />
        </div>
    );
}
