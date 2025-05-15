import { SkillItem } from '@/types/calculator.types';

// Extended interface for plundering items
interface PlunderingItem extends SkillItem {
    successRate: number;
}

export const PLUNDERING_ITEMS: PlunderingItem[] = [
    {
        name: 'Small Village',
        level: 1,
        exp: 120,
        seconds: 32.5,
        expPerSecond: 3.69,
        goldValue: 0, // No gold value shown in image
        goldPerSecond: 0,
        successRate: 31,
    },
    {
        name: 'Fishing Town',
        level: 20,
        exp: 150,
        seconds: 35,
        expPerSecond: 4.29,
        goldValue: 0,
        goldPerSecond: 0,
        successRate: 25.1,
    },
    {
        name: 'Mining Community',
        level: 30,
        exp: 180,
        seconds: 37.5,
        expPerSecond: 4.8,
        goldValue: 0,
        goldPerSecond: 0,
        successRate: 21.1,
    },
    {
        name: 'Farm',
        level: 40,
        exp: 225,
        seconds: 40,
        expPerSecond: 5.63,
        goldValue: 0,
        goldPerSecond: 0,
        successRate: 16.1,
    },
    {
        name: 'Small City',
        level: 50,
        exp: 290,
        seconds: 45,
        expPerSecond: 6.44,
        goldValue: 0,
        goldPerSecond: 0,
        successRate: 11.1,
    },
    {
        name: 'Sports Center',
        level: 60,
        exp: 350,
        seconds: 47.5,
        expPerSecond: 7.58,
        goldValue: 0,
        goldPerSecond: 0,
        successRate: 9,
    },
    {
        name: 'Woodworking Factory',
        level: 70,
        exp: 400,
        seconds: 50,
        expPerSecond: 8.0,
        goldValue: 0,
        goldPerSecond: 0,
        successRate: 11,
    },
    {
        name: 'Food Factory',
        level: 85,
        exp: 550,
        seconds: 55,
        expPerSecond: 9.09,
        goldValue: 0,
        goldPerSecond: 0,
        successRate: 9,
    },
    {
        name: 'Royal Clan',
        level: 95,
        exp: 750,
        seconds: 60,
        expPerSecond: 12.5,
        goldValue: 0,
        goldPerSecond: 0,
        successRate: 6,
    },
];
