'use client';

import { useCalculator } from '../CalculatorContext';
import PlunderingItems from './PlunderingItems';

export default function PlunderingModule() {
    const { state } = useCalculator();
    const { currentSkill } = state;

    // List of skills that support plundering functionality
    const plunderingSkills = ['plundering'];

    // Check if the current skill is a plundering skill
    const isPlunderingSkill = plunderingSkills.includes(currentSkill);

    if (!isPlunderingSkill) {
        return null;
    }

    return (
        <div>
            <PlunderingItems />
        </div>
    );
}
