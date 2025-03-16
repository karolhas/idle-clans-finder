import { FaTimes, FaMagic, FaTools, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { getItemName } from "./items";
import { Tooltip } from "react-tooltip"; // Fancy Tooltip

interface AdvancedPlayerInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerData: {
    equipment: { [key: string]: number };
    enchantmentBoosts: { [key: number]: number };
  };
}

// Painful order for equipment
const equipmentNames: { [key: string]: string } = {
  ammunition: "Arrow",
  earrings: "Earring",
  amulet: "Amulet",
  jewellery: "Ring",
  bracelet: "Bracelet",
  pet: "Pet",
  rightHand: "Right Hand",
  gloves: "Gloves",
  head: "Helmet",
  body: "Chestplate",
  legs: "Legs",
  cape: "Cape",
  leftHand: "Left Hand",    
  belt: "Belt",
  boots: "Boots",
};

function getBaseItemName(itemName: string | null, slot: string): string | null {
  if (!itemName) return null;
  return itemName.replace(/enchanted/i, "").replace(/ \+\d+$/, "").trim();
}

function getDisplayItemName(itemName: string | null, slot: string): string | null {
  if (!itemName) return null;
  let name = getBaseItemName(itemName, slot);
  if (slot === "pet") name = name.replace(/\bpet\b/gi, "").trim();
  return name;
}

export default function AdvancedPlayerInfoModal({ isOpen, onClose, playerData }: AdvancedPlayerInfoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [showEquipment, setShowEquipment] = useState(true);
  const [showEnchantments, setShowEnchantments] = useState(true);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const equipmentSlots = Object.keys(equipmentNames);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 overflow-y-auto">
      <div ref={modalRef} className="bg-[#002626] p-6 rounded-lg border border-[#004444] max-w-3xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-emerald-400">Advanced Player Info</h2>
          <button onClick={onClose} className="text-gray-100 hover:text-white transition-colors">
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Equipment Section */}
        <div className="mb-6">
          <button
            className="text-xl font-bold text-emerald-400 mb-2 flex items-center w-full text-left"
            onClick={() => setShowEquipment(!showEquipment)}
          >
            <FaTools className="mr-2" /> Equipment
            {showEquipment ? <FaChevronUp className="ml-auto" /> : <FaChevronDown className="ml-auto" />}
          </button>
          {showEquipment && (
            <div className="bg-[#003333] p-3 rounded-lg text-gray-200 flex gap-4 justify-center max-w-lg mx-auto">
              {[
                equipmentSlots.slice(0, 5),
				equipmentSlots.slice(5, 8),
				equipmentSlots.slice(8, 11),
				equipmentSlots.slice(11, 16),
				].map((group, index) => (
                <div key={index} className="flex flex-col gap-3">
                  {group.map((slot) => {
                    const rawItemName = getItemName(playerData.equipment[slot]);
                    const baseItemName = getBaseItemName(rawItemName, slot);
                    const displayItemName = getDisplayItemName(rawItemName, slot);
                    const imagePath = baseItemName ? `/gameimages/${baseItemName.replace(/\s+/g, "_").toLowerCase()}.png` : null;
                    const tooltipId = `tooltip-${slot}`;

                    return (
                      <div key={slot} className="flex flex-col items-center p-2 bg-[#004444] rounded-md text-center text-sm">
                        <span className="text-white font-semibold">{equipmentNames[slot] || slot}</span>
                        <div data-tooltip-id={tooltipId} className="w-12 h-12 bg-gray-800 rounded-md flex items-center justify-center mt-1">
                          {imagePath ? <img src={imagePath} alt={baseItemName || "Unknown Item"} className="w-full h-full object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} /> : <span className="text-xs text-gray-400">No Img</span>}
                        </div>
                        <Tooltip id={tooltipId} place="top" effect="solid">{displayItemName || "Unknown Item"}</Tooltip>
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
          <button className="text-xl font-bold text-emerald-400 mb-2 flex items-center w-full text-left" onClick={() => setShowEnchantments(!showEnchantments)}>
            <FaMagic className="mr-2" /> Enchantment Boosts
            {showEnchantments ? <FaChevronUp className="ml-auto" /> : <FaChevronDown className="ml-auto" />}
          </button>
          {showEnchantments && (
            <div className="bg-[#003333] p-4 rounded-lg text-gray-200 grid grid-cols-2 gap-4">
              {playerData.enchantmentBoosts && Object.keys(playerData.enchantmentBoosts).length > 0 ? (
                Object.entries(playerData.enchantmentBoosts).sort((a, b) => b[1] - a[1]).map(([boost, value]) => (
                  <div key={boost} className="flex items-center gap-3 p-2 bg-[#004444] rounded-md">
                    <img src={`/gameimages/${boost.replace(/\s+/g, "_").toLowerCase()}.png`} alt={boost} className="w-8 h-8 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    <p className="capitalize text-white font-semibold">{boost}:</p>
                    <p className="text-gray-300">{value}%</p>
                  </div>
                ))
              ) : <p className="text-gray-400">No enchantment boosts available.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}