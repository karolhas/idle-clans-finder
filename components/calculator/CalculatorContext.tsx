'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import {
    CalculatorContext as CalculatorContextType,
    CalculatorState,
    GeneralBuffs,
    GatheringBuffs,
    PotionsState,
    SkillBoosts,
    SkillType,
    UpgradeBuffs,
} from '@/types/calculator.types';
import { INITIAL_SKILL_BOOSTS } from '@/utils/gamedata/calculator-constants';
import { Player } from '@/types/player.types';

// Create initial state
const initialSkillBoosts: Record<SkillType, SkillBoosts> = {
    crafting: { ...INITIAL_SKILL_BOOSTS },
    mining: { ...INITIAL_SKILL_BOOSTS },
    smithing: { ...INITIAL_SKILL_BOOSTS },
    carpentry: { ...INITIAL_SKILL_BOOSTS },
    farming: { ...INITIAL_SKILL_BOOSTS },
    foraging: { ...INITIAL_SKILL_BOOSTS },
    cooking: { ...INITIAL_SKILL_BOOSTS },
    enchanting: { ...INITIAL_SKILL_BOOSTS },
    woodcutting: { ...INITIAL_SKILL_BOOSTS },
    agility: { ...INITIAL_SKILL_BOOSTS },
    fishing: { ...INITIAL_SKILL_BOOSTS },
    plundering: { ...INITIAL_SKILL_BOOSTS },
    brewing: { ...INITIAL_SKILL_BOOSTS },
};

const initialState: CalculatorState = {
    generalBuffs: {
        clanHouse: 'none',
        personalHouse: 'none',
        offerTheyCanRefuse: false,
    },
    gatheringBuffs: {
        theFisherman: 0,
        powerForager: 0,
        theLumberjack: 0,
        efficientFisherman: 0,
        farmingTrickery: 0,
        powerFarmHand: 0,
        smeltingMagic: 0,
        plankBargain: 0,
    },
    upgradeBuffs: {
        arrowCrafter: false,
        responsibleDrinking: false,
        delicateManufacturing: false,
        lastNegotiation: false,
        prestigiousWoodworking: false,
        betterFisherman: false,
        betterLumberjack: false,
        gatherers: false,
    },
    potions: {
        negotiationPotion: {
            active: false,
            cost: 0,
        },
        trickeryPotion: {
            active: false,
            cost: 0,
        },
        knowledgePotion: {
            active: false,
            cost: 0,
        },
    },
    currentSkill: 'crafting',
    skillBoosts: initialSkillBoosts,
    currentExp: 0,
    targetLevel: 120,
    selectedItem: null,
    playerSkillExperiences: {},
};

// Create the context
const CalculatorContext = createContext<CalculatorContextType | undefined>(
    undefined
);

// Create a provider component
export function CalculatorProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [state, setState] = useState<CalculatorState>(initialState);

    // Setters
    const setGeneralBuff = useCallback(
        (key: keyof GeneralBuffs, value: string | boolean) => {
            setState((prev) => ({
                ...prev,
                generalBuffs: {
                    ...prev.generalBuffs,
                    [key]: value,
                },
            }));
        },
        []
    );

    const setGatheringBuff = useCallback(
        (key: keyof GatheringBuffs, value: number) => {
            setState((prev) => ({
                ...prev,
                gatheringBuffs: {
                    ...prev.gatheringBuffs,
                    [key]: value,
                },
            }));
        },
        []
    );

    const setUpgradeBuff = useCallback(
        (key: keyof UpgradeBuffs, value: boolean) => {
            setState((prev) => ({
                ...prev,
                upgradeBuffs: {
                    ...prev.upgradeBuffs,
                    [key]: value,
                },
            }));
        },
        []
    );

    const setPotion = (
        potionName: keyof PotionsState,
        key: 'active' | 'cost',
        value: boolean | number
    ) => {
        setState((prev) => ({
            ...prev,
            potions: {
                ...prev.potions,
                [potionName]: {
                    ...prev.potions[potionName],
                    [key]: value,
                },
            },
        }));
    };

    // Helper function to update current exp based on current skill
    const updateCurrentSkillExp = (skill: SkillType) => {
        setState((prev) => {
            const skillExp =
                prev.playerSkillExperiences[skill.toLowerCase()] || 0;
            return {
                ...prev,
                currentExp: skillExp,
            };
        });
    };

    const setCurrentSkill = (skill: SkillType) => {
        setState((prev) => ({
            ...prev,
            currentSkill: skill,
        }));

        // Update experience after setting the skill
        updateCurrentSkillExp(skill);
    };

    const setSkillBoost = (
        skill: SkillType,
        key: keyof SkillBoosts,
        value: string | number | boolean
    ) => {
        setState((prev) => ({
            ...prev,
            skillBoosts: {
                ...prev.skillBoosts,
                [skill]: {
                    ...prev.skillBoosts[skill],
                    [key]: value,
                },
            },
        }));
    };

    const setCurrentExp = (exp: number) => {
        setState((prev) => ({
            ...prev,
            currentExp: exp,
        }));
    };

    const setTargetLevel = (level: number) => {
        setState((prev) => ({
            ...prev,
            targetLevel: level,
        }));
    };

    const setSelectedItem = (itemName: string | null) => {
        setState((prev) => ({
            ...prev,
            selectedItem: itemName,
        }));
    };

    const resetCalculator = () => {
        setState(initialState);
    };

    const loadPlayerData = useCallback(
        (playerData: Player) => {
            // Set current experience from player data
            const skillExp = playerData.skillExperiences || {};

            // Update state with player data
            setState((prevState) => ({
                ...prevState,
                playerSkillExperiences: skillExp,
                currentExp: skillExp[prevState.currentSkill.toLowerCase()] || 0,
                clanName: playerData.guildName,
            }));

            // Map player upgrades to calculator state
            if (playerData.upgrades) {
                // Set general buffs
                setGeneralBuff(
                    'clanHouse',
                    playerData.upgrades.valuedClanMember > 0 ? 't6' : 'none'
                );

                // Handle personal housing tier - check all possible field names
                const housingTier =
                    playerData.upgrades.housing ||
                    playerData.upgrades.personalHousing ||
                    playerData.upgrades.keepItSpacious ||
                    0;

                if (housingTier > 0) {
                    const tier = Math.min(housingTier, 5);
                    setGeneralBuff('personalHouse', `t${tier}`);
                } else {
                    setGeneralBuff('personalHouse', 'none');
                }

                // Set gathering buffs with actual tier levels
                setGatheringBuff(
                    'theFisherman',
                    playerData.upgrades.theFisherman || 0
                );
                setGatheringBuff(
                    'powerForager',
                    playerData.upgrades.powerForager || 0
                );
                setGatheringBuff(
                    'theLumberjack',
                    playerData.upgrades.theLumberjack || 0
                );
                setGatheringBuff(
                    'efficientFisherman',
                    playerData.upgrades.mostEfficientFisherman || 0
                );
                setGatheringBuff(
                    'farmingTrickery',
                    playerData.upgrades.farmingTrickery || 0
                );
                setGatheringBuff(
                    'smeltingMagic',
                    playerData.upgrades.smeltingMagic || 0
                );
                setGatheringBuff(
                    'plankBargain',
                    playerData.upgrades.plankBargain || 0
                );

                // For powerFarmHand, we'll reuse the farming trickery tier
                // since it's not directly available in the API
                setGatheringBuff(
                    'farmingTrickery',
                    playerData.upgrades.farmingTrickery || 0
                );

                // Set upgrade buffs
                setUpgradeBuff(
                    'arrowCrafter',
                    playerData.upgrades.arrowCrafter > 0
                );
                setUpgradeBuff(
                    'responsibleDrinking',
                    playerData.upgrades.responsibleDrinking > 0
                );
                setUpgradeBuff(
                    'delicateManufacturing',
                    playerData.upgrades.delicateManufacturing > 0
                );
                setUpgradeBuff(
                    'lastNegotiation',
                    playerData.upgrades.lastNegotiation > 0
                );
                setUpgradeBuff(
                    'prestigiousWoodworking',
                    playerData.upgrades.prestigiousWoodworking > 0
                );
                setUpgradeBuff(
                    'betterFisherman',
                    playerData.upgrades.betterFisherman > 0
                );
                setUpgradeBuff(
                    'betterLumberjack',
                    playerData.upgrades.betterLumberjack > 0
                );

                // Set clan gatherers upgrade (key 23)
                let hasGatherersUpgrade = false;

                // Check if player belongs to a clan
                if (playerData.guildName) {
                    // If API has returned serializedUpgrades directly
                    if (playerData.clan && playerData.clan.serializedUpgrades) {
                        try {
                            // Parse the serializedUpgrades
                            let upgradesArray: number[] = [];

                            const serializedValue =
                                playerData.clan.serializedUpgrades;
                            if (typeof serializedValue === 'string') {
                                // Now try to parse the string as JSON
                                try {
                                    // Handle "[21,31,16,23,...]" format
                                    upgradesArray = JSON.parse(serializedValue);
                                } catch {
                                    // Fallback: handle plain comma-separated string
                                    upgradesArray = serializedValue
                                        .replace(/[\[\]\s]/g, '') // Remove brackets and whitespace
                                        .split(',')
                                        .map((s) => parseInt(s.trim(), 10))
                                        .filter((n) => !isNaN(n));
                                }
                            } else if (Array.isArray(serializedValue)) {
                                // It's already an array
                                upgradesArray = serializedValue;
                            }

                            // Check if 23 (Gatherers) is in the array
                            hasGatherersUpgrade = upgradesArray.includes(23);
                        } catch (error) {
                            console.error(
                                'Error processing clan serializedUpgrades:',
                                error
                            );
                        }
                    }
                    // Fallback for older API or missing clan data
                    else if (playerData.upgrades) {
                        const key23 = playerData.upgrades['23'] || 0;
                        hasGatherersUpgrade = key23 > 0;
                    }
                }

                setUpgradeBuff('gatherers', hasGatherersUpgrade);
            }
        },
        [setGeneralBuff, setGatheringBuff, setUpgradeBuff]
    );

    const contextValue: CalculatorContextType = {
        state,
        setGeneralBuff,
        setGatheringBuff,
        setUpgradeBuff,
        setPotion,
        setCurrentSkill,
        setSkillBoost,
        setCurrentExp,
        setTargetLevel,
        setSelectedItem,
        resetCalculator,
        loadPlayerData,
    };

    return (
        <CalculatorContext.Provider value={contextValue}>
            {children}
        </CalculatorContext.Provider>
    );
}

// Create a hook to use the context
export function useCalculator() {
    const context = useContext(CalculatorContext);
    if (context === undefined) {
        throw new Error(
            'useCalculator must be used within a CalculatorProvider'
        );
    }
    return context;
}
