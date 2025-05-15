'use client';

import { useCalculator } from '../CalculatorContext';
import WoodcuttingItems from './WoodcuttingItems';

export default function WoodcuttingModule() {
    const { state } = useCalculator();
    const { currentSkill } = state;

    // List of skills that support woodcutting functionality
    const woodcuttingSkills = ['woodcutting'];

    // Check if the current skill is a woodcutting skill
    const isWoodcuttingSkill = woodcuttingSkills.includes(currentSkill);

    if (!isWoodcuttingSkill) {
        return null;
    }

    return (
        <div>
            <WoodcuttingItems />
        </div>
    );
}
