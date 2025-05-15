import { SkillItem } from '@/types/calculator.types';

export const ENCHANTING_ITEMS: SkillItem[] = [
    {
        name: 'Common Scroll',
        level: 1,
        exp: 5000,
        seconds: 0, // Not applicable for enchanting
        expPerSecond: 0, // Not applicable for enchanting
        goldValue: 0, // Not applicable for enchanting
        goldPerSecond: 0, // Not applicable for enchanting
        category: '20', // Magic requirement
    },
    {
        name: 'Rare Scroll',
        level: 40,
        exp: 15000,
        seconds: 0, // Not applicable for enchanting
        expPerSecond: 0, // Not applicable for enchanting
        goldValue: 0, // Not applicable for enchanting
        goldPerSecond: 0, // Not applicable for enchanting
        category: '50', // Magic requirement
    },
    {
        name: 'Exceptional Scroll',
        level: 80,
        exp: 75000,
        seconds: 0, // Not applicable for enchanting
        expPerSecond: 0, // Not applicable for enchanting
        goldValue: 0, // Not applicable for enchanting
        goldPerSecond: 0, // Not applicable for enchanting
        category: '80', // Magic requirement
    },
];
