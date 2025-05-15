export interface Upgrades {
    //general
    keepItSpacious: number;
    valuedClanMember: number;
    personalHousing: number;
    housing: number;
    lazyRaider: number;
    extraLoadouts: number;
    offlineProgress: number;
    toolbeltUpgrade: number;
    //skilling
    ancientWisdom: number;
    masterCrafter: number;
    mostEfficientFisherman: number;
    farmingTrickery: number;
    theFisherman: number;
    powerForager: number;
    plankBargain: number;
    smeltingMagic: number;
    theLumberjack: number;
    //combat
    autoEating: number;
    autoLooting: number;
    bossSlayer: number;
    ninja: number;
    monsterHunter: number;
    showUsTheMoney: number;
    kronosWho: number;
    pickyEater: number;
    'ammo-saver': number;
    teamwork: number;
    bountyHunter: number;
    //unlocked with items
    arrowCrafter: number;
    keepItBurning: number;
    betterSkinner: number;
    delicateManufacturing: number;
    gettingInSync: number;
    lastNegotiation: number;
    prestigiousWoodworking: number;
    responsibleDrinking: number;
    betterFisherman: number;
    betterLumberjack: number;

    // Allow for dynamically named properties like clan upgrades and serialized properties
    [key: string]: number | undefined;
}
