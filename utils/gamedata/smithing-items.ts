import { SkillItem } from '@/types/calculator.types';

// Extended type to include materials requirements
interface SmithingItem extends SkillItem {
    oreBarsNeeded?: number;
    coalNeeded?: number;
    tinNeeded?: number;
}

export const SMITHING_ITEMS: SmithingItem[] = [
    // Bars
    {
        name: 'Bronze Bar',
        level: 1,
        exp: 7.5,
        seconds: 3,
        expPerSecond: 2.5,
        goldValue: 12,
        goldPerSecond: 4,
        category: 'Bars',
        oreBarsNeeded: 1, // Ore bars needed
        tinNeeded: 1, // Tin needed
    },
    {
        name: 'Iron Bar',
        level: 15,
        exp: 14,
        seconds: 5,
        expPerSecond: 2.8,
        goldValue: 18,
        goldPerSecond: 3.6,
        category: 'Bars',
        oreBarsNeeded: 1, // Ore bars needed
    },
    {
        name: 'Silver Bar',
        level: 25,
        exp: 17.5,
        seconds: 6,
        expPerSecond: 2.9,
        goldValue: 14,
        goldPerSecond: 2.3,
        category: 'Bars',
        oreBarsNeeded: 1, // Ore bars needed
    },
    {
        name: 'Steel Bar',
        level: 30,
        exp: 20,
        seconds: 6.5,
        expPerSecond: 3.1,
        goldValue: 30,
        goldPerSecond: 4.6,
        category: 'Bars',
        oreBarsNeeded: 2, // Ore bars needed
        coalNeeded: 1, // Coal needed
    },
    {
        name: 'Gold Bar',
        level: 50,
        exp: 29,
        seconds: 8,
        expPerSecond: 3.6,
        goldValue: 30,
        goldPerSecond: 3.8,
        category: 'Bars',
        oreBarsNeeded: 1, // Ore bars needed
    },
    {
        name: 'Platinum Bar',
        level: 55,
        exp: 50,
        seconds: 9,
        expPerSecond: 4.2,
        goldValue: 125,
        goldPerSecond: 13.9,
        category: 'Bars',
        oreBarsNeeded: 3, // Ore bars needed
        coalNeeded: 3, // Coal needed
    },
    {
        name: 'Meteorite Bar',
        level: 65,
        exp: 100,
        seconds: 20,
        expPerSecond: 5,
        goldValue: 345,
        goldPerSecond: 17.3,
        category: 'Bars',
        oreBarsNeeded: 3, // Ore bars needed
        coalNeeded: 6, // Coal needed
    },
    {
        name: 'Diamond Bar',
        level: 70,
        exp: 115,
        seconds: 22,
        expPerSecond: 5.2,
        goldValue: 115,
        goldPerSecond: 5.2,
        category: 'Bars',
        oreBarsNeeded: 3, // Ore bars needed
    },
    {
        name: 'Titanium Bar',
        level: 80,
        exp: 225,
        seconds: 30,
        expPerSecond: 7.5,
        goldValue: 650,
        goldPerSecond: 21.7,
        category: 'Bars',
        oreBarsNeeded: 3, // Ore bars needed
        coalNeeded: 9, // Coal needed
    },
    {
        name: 'Astronomical Bar',
        level: 90,
        exp: 2500,
        seconds: 60,
        expPerSecond: 41.7,
        goldValue: 50000,
        goldPerSecond: 833.3,
        category: 'Bars',
        oreBarsNeeded: 1, // Ore bars needed
        coalNeeded: 5000, // Coal needed
    },

    // Bronze Equipment
    {
        name: 'Bronze Platebody',
        level: 1,
        exp: 60,
        seconds: 9,
        expPerSecond: 7,
        goldValue: 96,
        goldPerSecond: 11,
        category: 'Bronze Equipment',
        oreBarsNeeded: 6, // Bronze bars needed
    },
    {
        name: 'Bronze Platelegs',
        level: 1,
        exp: 40,
        seconds: 9,
        expPerSecond: 4.4,
        goldValue: 64,
        goldPerSecond: 7.1,
        category: 'Bronze Equipment',
        oreBarsNeeded: 4, // Bronze bars needed
    },
    {
        name: 'Bronze Helmet',
        level: 1,
        exp: 20,
        seconds: 9,
        expPerSecond: 2.2,
        goldValue: 32,
        goldPerSecond: 3.6,
        category: 'Bronze Equipment',
        oreBarsNeeded: 2, // Bronze bars needed
    },
    {
        name: 'Bronze Shield',
        level: 1,
        exp: 40,
        seconds: 9,
        expPerSecond: 4.4,
        goldValue: 64,
        goldPerSecond: 7.1,
        category: 'Bronze Equipment',
        oreBarsNeeded: 4, // Bronze bars needed
    },

    // Iron Equipment
    {
        name: 'Iron Platebody',
        level: 20,
        exp: 75,
        seconds: 9,
        expPerSecond: 8,
        goldValue: 95,
        goldPerSecond: 11,
        category: 'Iron Equipment',
        oreBarsNeeded: 6, // Iron bars needed
    },
    {
        name: 'Iron Platelegs',
        level: 20,
        exp: 50,
        seconds: 9,
        expPerSecond: 5.6,
        goldValue: 64,
        goldPerSecond: 7.1,
        category: 'Iron Equipment',
        oreBarsNeeded: 4, // Iron bars needed
    },
    {
        name: 'Iron Helmet',
        level: 20,
        exp: 25,
        seconds: 9,
        expPerSecond: 2.8,
        goldValue: 32,
        goldPerSecond: 3.6,
        category: 'Iron Equipment',
        oreBarsNeeded: 2, // Iron bars needed
    },
    {
        name: 'Iron Shield',
        level: 20,
        exp: 50,
        seconds: 9,
        expPerSecond: 5.6,
        goldValue: 64,
        goldPerSecond: 7.1,
        category: 'Iron Equipment',
        oreBarsNeeded: 4, // Iron bars needed
    },

    // Silver Items
    {
        name: 'Silver Amulet',
        level: 30,
        exp: 35,
        seconds: 3,
        expPerSecond: 11.7,
        goldValue: 30,
        goldPerSecond: 10,
        category: 'Silver Items',
        oreBarsNeeded: 2, // Silver bars needed
    },
    {
        name: 'Silver Ring',
        level: 30,
        exp: 35,
        seconds: 3,
        expPerSecond: 11.7,
        goldValue: 30,
        goldPerSecond: 10,
        category: 'Silver Items',
        oreBarsNeeded: 2, // Silver bars needed
    },
    {
        name: 'Silver Bracelet',
        level: 30,
        exp: 35,
        seconds: 3,
        expPerSecond: 11.7,
        goldValue: 30,
        goldPerSecond: 10,
        category: 'Silver Items',
        oreBarsNeeded: 2, // Silver bars needed
    },
    {
        name: 'Silver Earrings',
        level: 30,
        exp: 35,
        seconds: 3,
        expPerSecond: 11.7,
        goldValue: 30,
        goldPerSecond: 10,
        category: 'Silver Items',
        oreBarsNeeded: 2, // Silver bars needed
    },

    // Steel Equipment
    {
        name: 'Steel Platebody',
        level: 35,
        exp: 90,
        seconds: 9,
        expPerSecond: 10,
        goldValue: 216,
        goldPerSecond: 24,
        category: 'Steel Equipment',
        oreBarsNeeded: 6, // Steel bars needed
    },
    {
        name: 'Steel Platelegs',
        level: 35,
        exp: 60,
        seconds: 9,
        expPerSecond: 6.7,
        goldValue: 144,
        goldPerSecond: 16,
        category: 'Steel Equipment',
        oreBarsNeeded: 4, // Steel bars needed
    },
    {
        name: 'Steel Helmet',
        level: 35,
        exp: 30,
        seconds: 9,
        expPerSecond: 3.3,
        goldValue: 72,
        goldPerSecond: 8,
        category: 'Steel Equipment',
        oreBarsNeeded: 2, // Steel bars needed
    },
    {
        name: 'Steel Shield',
        level: 35,
        exp: 60,
        seconds: 9,
        expPerSecond: 6.7,
        goldValue: 144,
        goldPerSecond: 16,
        category: 'Steel Equipment',
        oreBarsNeeded: 4, // Steel bars needed
    },

    // Gold Items
    {
        name: 'Gold Amulet',
        level: 50,
        exp: 40,
        seconds: 3,
        expPerSecond: 13.3,
        goldValue: 40,
        goldPerSecond: 13.3,
        category: 'Gold Items',
        oreBarsNeeded: 2, // Gold bars needed
    },
    {
        name: 'Gold Ring',
        level: 50,
        exp: 40,
        seconds: 3,
        expPerSecond: 13.3,
        goldValue: 40,
        goldPerSecond: 13.3,
        category: 'Gold Items',
        oreBarsNeeded: 2, // Gold bars needed
    },
    {
        name: 'Gold Bracelet',
        level: 50,
        exp: 40,
        seconds: 3,
        expPerSecond: 13.3,
        goldValue: 40,
        goldPerSecond: 13.3,
        category: 'Gold Items',
        oreBarsNeeded: 2, // Gold bars needed
    },
    {
        name: 'Gold Earrings',
        level: 50,
        exp: 40,
        seconds: 3,
        expPerSecond: 13.3,
        goldValue: 40,
        goldPerSecond: 13.3,
        category: 'Gold Items',
        oreBarsNeeded: 2, // Gold bars needed
    },

    // Platinum Equipment
    {
        name: 'Platinum Platebody',
        level: 55,
        exp: 150,
        seconds: 9,
        expPerSecond: 16.7,
        goldValue: 2340,
        goldPerSecond: 260,
        category: 'Platinum Equipment',
        oreBarsNeeded: 6, // Platinum bars needed
    },
    {
        name: 'Platinum Platelegs',
        level: 55,
        exp: 100,
        seconds: 9,
        expPerSecond: 11.1,
        goldValue: 1560,
        goldPerSecond: 173,
        category: 'Platinum Equipment',
        oreBarsNeeded: 4, // Platinum bars needed
    },
    {
        name: 'Platinum Helmet',
        level: 55,
        exp: 60,
        seconds: 9,
        expPerSecond: 6.6,
        goldValue: 780,
        goldPerSecond: 87,
        category: 'Platinum Equipment',
        oreBarsNeeded: 2, // Platinum bars needed
    },
    {
        name: 'Platinum Shield',
        level: 55,
        exp: 100,
        seconds: 9,
        expPerSecond: 11.1,
        goldValue: 1560,
        goldPerSecond: 173,
        category: 'Platinum Equipment',
        oreBarsNeeded: 4, // Platinum bars needed
    },

    // Meteorite Equipment
    {
        name: 'Meteorite Platebody',
        level: 70,
        exp: 210,
        seconds: 9,
        expPerSecond: 23.3,
        goldValue: 6210,
        goldPerSecond: 690,
        category: 'Meteorite Equipment',
        oreBarsNeeded: 6, // Meteorite bars needed
    },
    {
        name: 'Meteorite Platelegs',
        level: 70,
        exp: 140,
        seconds: 9,
        expPerSecond: 15.6,
        goldValue: 4140,
        goldPerSecond: 460,
        category: 'Meteorite Equipment',
        oreBarsNeeded: 4, // Meteorite bars needed
    },
    {
        name: 'Meteorite Helmet',
        level: 70,
        exp: 70,
        seconds: 9,
        expPerSecond: 7.8,
        goldValue: 2070,
        goldPerSecond: 230,
        category: 'Meteorite Equipment',
        oreBarsNeeded: 2, // Meteorite bars needed
    },
    {
        name: 'Meteorite Shield',
        level: 70,
        exp: 140,
        seconds: 9,
        expPerSecond: 15.6,
        goldValue: 4140,
        goldPerSecond: 460,
        category: 'Meteorite Equipment',
        oreBarsNeeded: 4, // Meteorite bars needed
    },

    // Diamond Items
    {
        name: 'Diamond Amulet',
        level: 75,
        exp: 70,
        seconds: 4.5,
        expPerSecond: 15.6,
        goldValue: 200,
        goldPerSecond: 44.4,
        category: 'Diamond Items',
        oreBarsNeeded: 2, // Diamond bars needed
    },
    {
        name: 'Diamond Ring',
        level: 75,
        exp: 70,
        seconds: 4.5,
        expPerSecond: 15.6,
        goldValue: 200,
        goldPerSecond: 44.4,
        category: 'Diamond Items',
        oreBarsNeeded: 2, // Diamond bars needed
    },
    {
        name: 'Diamond Bracelet',
        level: 75,
        exp: 70,
        seconds: 4.5,
        expPerSecond: 15.6,
        goldValue: 200,
        goldPerSecond: 44.4,
        category: 'Diamond Items',
        oreBarsNeeded: 2, // Diamond bars needed
    },
    {
        name: 'Diamond Earrings',
        level: 75,
        exp: 70,
        seconds: 4.5,
        expPerSecond: 15.6,
        goldValue: 200,
        goldPerSecond: 44.4,
        category: 'Diamond Items',
        oreBarsNeeded: 2, // Diamond bars needed
    },

    // Titanium Equipment
    {
        name: 'Titanium Platebody',
        level: 85,
        exp: 240,
        seconds: 9,
        expPerSecond: 27,
        goldValue: 15600,
        goldPerSecond: 1733,
        category: 'Titanium Equipment',
        oreBarsNeeded: 6, // Titanium bars needed
    },
    {
        name: 'Titanium Platelegs',
        level: 85,
        exp: 160,
        seconds: 9,
        expPerSecond: 17.8,
        goldValue: 10400,
        goldPerSecond: 1155.6,
        category: 'Titanium Equipment',
        oreBarsNeeded: 4, // Titanium bars needed
    },
    {
        name: 'Titanium Helmet',
        level: 85,
        exp: 80,
        seconds: 9,
        expPerSecond: 8.9,
        goldValue: 5200,
        goldPerSecond: 577.8,
        category: 'Titanium Equipment',
        oreBarsNeeded: 2, // Titanium bars needed
    },
    {
        name: 'Titanium Shield',
        level: 85,
        exp: 160,
        seconds: 9,
        expPerSecond: 17.8,
        goldValue: 10400,
        goldPerSecond: 1155.6,
        category: 'Titanium Equipment',
        oreBarsNeeded: 4, // Titanium bars needed
    },

    // Astronomical Equipment
    {
        name: 'Astronomical Platebody',
        level: 95,
        exp: 3000,
        seconds: 9,
        expPerSecond: 333.3,
        goldValue: 450000,
        goldPerSecond: 50000,
        category: 'Astronomical Equipment',
        oreBarsNeeded: 6, // Astronomical bars needed
    },
    {
        name: 'Astronomical Platelegs',
        level: 95,
        exp: 2000,
        seconds: 9,
        expPerSecond: 222.2,
        goldValue: 300000,
        goldPerSecond: 33333.3,
        category: 'Astronomical Equipment',
        oreBarsNeeded: 4, // Astronomical bars needed
    },
    {
        name: 'Astronomical Helmet',
        level: 95,
        exp: 1000,
        seconds: 9,
        expPerSecond: 111.1,
        goldValue: 150000,
        goldPerSecond: 16666.7,
        category: 'Astronomical Equipment',
        oreBarsNeeded: 2, // Astronomical bars needed
    },
    {
        name: 'Astronomical Shield',
        level: 95,
        exp: 2000,
        seconds: 9,
        expPerSecond: 222.2,
        goldValue: 300000,
        goldPerSecond: 33333.3,
        category: 'Astronomical Equipment',
        oreBarsNeeded: 4, // Astronomical bars needed
    },
];
