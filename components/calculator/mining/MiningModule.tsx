'use client';

import MiningItems from './MiningItems';
import { useCalculator } from '../CalculatorContext';

export default function MiningModule() {
    const { state } = useCalculator();
    const { currentSkill } = state;

    // List of skills that support mining functionality (currently just mining)
    const miningSkills = ['mining'];

    // Check if the current skill is a mining skill
    const isMiningSkill = miningSkills.includes(currentSkill);

    if (!isMiningSkill) {
        return null;
    }

    return (
        <div>
            <MiningItems />
        </div>
    );
}
