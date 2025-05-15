'use client';

import { useCalculator } from './CalculatorContext';
import { SkillType } from '@/types/calculator.types';

const SKILL_OPTIONS: Array<{ value: SkillType; label: string }> = [
    { value: 'crafting', label: 'Crafting' },
    { value: 'mining', label: 'Mining' },
    { value: 'smithing', label: 'Smithing' },
    { value: 'carpentry', label: 'Carpentry' },
    { value: 'farming', label: 'Farming' },
    { value: 'foraging', label: 'Foraging' },
    { value: 'cooking', label: 'Cooking' },
    { value: 'enchanting', label: 'Enchanting' },
    { value: 'woodcutting', label: 'Woodcutting' },
    { value: 'agility', label: 'Agility' },
    { value: 'fishing', label: 'Fishing' },
    { value: 'plundering', label: 'Plundering' },
    { value: 'brewing', label: 'Brewing' },
];

export default function SkillSelector() {
    const { state, setCurrentSkill } = useCalculator();
    const { currentSkill } = state;

    return (
        <div className="bg-[#001010] rounded-lg p-4 mb-4">
            <label
                htmlFor="skillSelector"
                className="block text-sm font-medium text-gray-300 mb-1"
            >
                Select Skill
            </label>
            <select
                id="skillSelector"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value as SkillType)}
                className="py-2 px-3 block w-full rounded-md bg-[#002020] border-gray-700 text-white focus:ring-emerald-500 focus:border-emerald-500"
            >
                {SKILL_OPTIONS.map((skill) => (
                    <option key={skill.value} value={skill.value}>
                        {skill.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
