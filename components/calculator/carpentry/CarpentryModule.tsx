'use client';

import { useCalculator } from '../CalculatorContext';
import CarpentryItems from './CarpentryItems';

export default function CarpentryModule() {
    const { state } = useCalculator();
    const { currentSkill } = state;

    // List of skills that support carpentry functionality (currently just carpentry)
    const carpentrySkills = ['carpentry'];

    // Check if the current skill is a carpentry skill
    const isCarpentrySkill = carpentrySkills.includes(currentSkill);

    if (!isCarpentrySkill) {
        return null;
    }

    return (
        <div>
            <CarpentryItems />
        </div>
    );
}
