import {
    FaTimes,
    FaMagic,
    FaTools,
    FaChevronDown,
    FaChevronUp,
} from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import { getItemName } from '../utils/gamedata/items';
import { Tooltip } from 'react-tooltip'; // Fancy Tooltip
import Image from 'next/image';
import { Equipment, EnchantmentBoosts } from '@/types/player.types';
import { WikiModal } from './WikiModal';

interface AdvancedPlayerInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    playerData: {
        equipment: Equipment;
        enchantmentBoosts: EnchantmentBoosts;
    };
}

// Painful order for equipment
const equipmentNames: { [key: string]: string } = {
    ammunition: 'Arrow',
    earrings: 'Earring',
    amulet: 'Amulet',
    jewellery: 'Ring',
    bracelet: 'Bracelet',
    pet: 'Pet',
    rightHand: 'Right Hand',
    gloves: 'Gloves',
    head: 'Helmet',
    body: 'Chestplate',
    legs: 'Legs',
    cape: 'Cape',
    leftHand: 'Left Hand',
    belt: 'Belt',
    boots: 'Boots',
};

function getBaseItemName(itemName: string | null): string | null {
    if (!itemName) return null;

    // Check if the name contains the word "enchanted" and store it
    const isEnchanted = /enchanted/i.test(itemName);

    // Clean the item name by removing the word "enchanted" and any enchantment level suffix
    let cleanName = itemName
        .replace(/enchanted/i, '')  // Remove any occurrence of 'enchanted'
        .replace(/ \+\d+$/, '')     // Remove any enchantment level (e.g., " +5")
        .trim();

    // If the item was enchanted, prepend "Enchanted" to the base name
    if (isEnchanted) {
        cleanName = `Enchanted ${cleanName}`;
    }

    return cleanName;
}

function getDisplayItemName(
    itemName: string | null,
    slot: string
): string | null {
    if (!itemName) return null;
    
    let name = getBaseItemName(itemName);
    
    // Handle the pet slot by removing the word "pet" if it's present
    if (name && slot === 'pet') {
        name = name.replace(/\bpet\b/gi, '').trim();
    }
    
    return name;
}

// Function to safely create image paths with fallback handling
function createSafeImagePath(name: string | null): string {
    if (!name) return '/placeholder.png';
    // Remove 'enchanted' from the name for the image path
    const cleanName = name
        .replace(/enchanted/i, '')
        .replace(/\s+/g, '_')
        .toLowerCase()
        .trim();
    // Add public prefix
    return `/gameimages/${cleanName}.png`;
}

export default function AdvancedPlayerInfoModal({
    isOpen,
    onClose,
    playerData,
}: AdvancedPlayerInfoModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [showEquipment, setShowEquipment] = useState(true);
    const [showEnchantments, setShowEnchantments] = useState(true);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Only close if we're not clicking on the wiki modal
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node) &&
                !(event.target as Element).closest('.wiki-modal')
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const equipmentSlots = Object.keys(equipmentNames);
    if (!isOpen) return null;

    const handleItemClick = (itemName: string | null) => {
        if (itemName) {
            setSelectedItem(itemName);
        }
    };

    const handleCloseWiki = () => {
        setSelectedItem(null);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 overflow-y-auto p-2 sm:p-4 advanced-player-modal">
            <div
                ref={modalRef}
                className="bg-[#002626] p-3 sm:p-6 rounded-lg border border-[#004444] w-full max-w-3xl mx-auto my-4 sm:my-8 max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-emerald-400">
                        Advanced Player Info
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-100 hover:text-white transition-colors"
                    >
                        <FaTimes className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>

                {/* Equipment Section */}
                <div className="mb-4 sm:mb-6">
                    <button
                        className="text-lg sm:text-xl font-bold text-emerald-400 mb-2 flex items-center w-full text-left"
                        onClick={() => setShowEquipment(!showEquipment)}
                    >
                        <FaTools className="mr-2" /> Equipment
                        {showEquipment ? (
                            <FaChevronUp className="ml-auto" />
                        ) : (
                            <FaChevronDown className="ml-auto" />
                        )}
                    </button>
                    {showEquipment && (
                        <div className="bg-[#003333] p-2 sm:p-3 rounded-lg text-gray-200 flex gap-2 sm:gap-4 justify-center max-w-lg mx-auto overflow-x-auto">
                            {[ 
                                equipmentSlots.slice(0, 5),
                                equipmentSlots.slice(5, 8),
                                equipmentSlots.slice(8, 11),
                                equipmentSlots.slice(11, 16),
                            ].map((group, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col gap-2 sm:gap-3 flex-shrink-0"
                                >
                                    {group.map((slot) => {
                                        // Only process item details if there's an actual equipment ID
                                        const equipmentId =
                                            playerData.equipment[slot];

                                        // Skip processing if no equipment in this slot
                                        const hasEquipment =
                                            equipmentId !== undefined &&
                                            equipmentId !== null &&
                                            equipmentId !== 0;

                                        // Only get item details if we have equipment
                                        const rawItemName = hasEquipment
                                            ? getItemName(equipmentId)
                                            : null;
                                        const baseItemName = hasEquipment
                                            ? getBaseItemName(rawItemName)
                                            : null;
                                        const displayItemName = hasEquipment
                                            ? getDisplayItemName(
                                                  rawItemName,
                                                  slot
                                              )
                                            : null;

                                        // Only create image path if we have a valid baseItemName
                                        const imagePath = baseItemName
                                            ? createSafeImagePath(baseItemName.replace(/enchanted/i, '').trim())
                                            : null;

                                        const tooltipId = `tooltip-${slot}`;

                                        return (
                                            <div
                                                key={slot}
                                                className="flex flex-col items-center p-1 sm:p-2 bg-[#004444] rounded-md text-center text-xs sm:text-sm"
                                            >
                                                <span className="text-white font-semibold truncate w-full">
                                                    {equipmentNames[slot] ||
                                                        slot}
                                                </span>
                                                <div
                                                    data-tooltip-id={tooltipId}
                                                    className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-md flex items-center justify-center mt-1"
                                                >
                                                    {hasEquipment &&
                                                    baseItemName &&
                                                    imagePath ? (
                                                        <div 
                                                            onClick={() => handleItemClick(baseItemName)}
                                                            className="cursor-pointer"
                                                        >
                                                            <Image
                                                                src={imagePath}
                                                                alt={baseItemName}
                                                                width={48}
                                                                height={48}
                                                                className={`w-full h-full object-contain ${
                                                                    /enchanted/i.test(rawItemName || '')
                                                                        ? 'animate-pulse'
                                                                        : ''
                                                                }`}
                                                                style={{
                                                                    filter: /gold/i.test(rawItemName || '')
                                                                        ? 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.8))'
                                                                        : /enchanted/i.test(rawItemName || '')
                                                                        ? 'drop-shadow(0 0 12px rgba(0, 191, 255, 0.8))'
                                                                        : 'none'
                                                                }}
                                                                unoptimized={true}
                                                                loading="eager"
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display = 'none';
                                                                }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </div>
                                                <Tooltip
                                                    id={tooltipId}
                                                    place="top"
                                                >
                                                    {displayItemName ||
                                                        'Empty slot'}
                                                </Tooltip>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Enchantment Boosts Section */}
                <div>
                    <button
                        className="text-lg sm:text-xl font-bold text-emerald-400 mb-2 flex items-center w-full text-left"
                        onClick={() => setShowEnchantments(!showEnchantments)}
                    >
                        <FaMagic className="mr-2" /> Enchantment Boosts
                        {showEnchantments ? (
                            <FaChevronUp className="ml-auto" />
                        ) : (
                            <FaChevronDown className="ml-auto" />
                        )}
                    </button>
                    {showEnchantments && (
                        <div className="bg-[#003333] p-2 sm:p-4 rounded-lg text-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                            {playerData.enchantmentBoosts &&
                            Object.keys(playerData.enchantmentBoosts).length >
                                0 ? (
                                Object.entries(playerData.enchantmentBoosts)
                                    .sort((a, b) => b[1] - a[1])
                                    .map(([boost, value]) => {
                                        // Make sure boost name is valid for image path
                                        const boostName = boost.trim();
                                        const hasValidName =
                                            boostName.length > 0;

                                        return (
                                            <div
                                                key={boost}
                                                className="flex items-center gap-2 sm:gap-3 p-2 bg-[#004444] rounded-md"
                                            >
                                                <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                                                    {hasValidName && (
                                                        <Image
                                                            src={createSafeImagePath(
                                                                boostName
                                                            )}
                                                            alt={boostName}
                                                            width={32}
                                                            height={32}
                                                            className="w-full h-full object-contain"
                                                            unoptimized={true}
                                                            loading="eager"
                                                            onError={(e) => {
                                                                // Just hide the image on error without logging
                                                                e.currentTarget.style.display =
                                                                    'none';
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                                <p className="capitalize text-white font-semibold text-xs sm:text-sm">
                                                    {boost}:
                                                </p>
                                                <p className="text-gray-300 text-xs sm:text-sm ml-auto">
                                                    {value}%
                                                </p>
                                            </div>
                                        );
                                    })
                            ) : (
                                <p className="text-gray-400 text-xs sm:text-sm">
                                    No enchantment boosts available.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {selectedItem && (
                <div className="wiki-modal">
                    <WikiModal
                        isOpen={!!selectedItem}
                        onClose={handleCloseWiki}
                        itemName={selectedItem}
                    />
                </div>
            )}
        </div>
    );
}
