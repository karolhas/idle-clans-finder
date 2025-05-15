'use client';

import { useCalculator } from '../CalculatorContext';
import AgilityItems from './AgilityItems';

export default function AgilityModule() {
    const { state } = useCalculator();
    const { currentSkill } = state;

    // List of skills that support agility functionality
    const agilitySkills = ['agility'];

    // Check if the current skill is an agility skill
    const isAgilitySkill = agilitySkills.includes(currentSkill);

    if (!isAgilitySkill) {
        return null;
    }

    return (
        <div>
            <AgilityItems />
        </div>
    );
}
