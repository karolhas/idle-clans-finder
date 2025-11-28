import React, { useMemo } from "react";
import Image from "next/image";
import { Tooltip } from "react-tooltip";
import { Equipment } from "@/types/player.types";
import {
  equipmentNames,
  getDisplayItemName,
  createSafeImagePath,
  getItemName,
} from "@/utils/equipmentHelper";
import { getItemStats, ItemStats } from "@/utils/itemStats";
import { FaFistRaised } from "react-icons/fa";
import { GiMagicSwirl, GiBowman } from "react-icons/gi";

interface EquipmentDisplayProps {
  equipment?: Equipment;
}

interface StatRowProps {
  label: string;
  icon: React.ElementType;
  strength: number;
  accuracy: number;
  defence: number;
  colorClass: string;
}

export default function EquipmentDisplay({ equipment }: EquipmentDisplayProps) {
  const equipmentData = useMemo(() => {
    const defaultStats: ItemStats = {
      strength: 0,
      accuracy: 0,
      defence: 0,
      archeryStrength: 0,
      archeryAccuracy: 0,
      archeryDefence: 0,
      magicStrength: 0,
      magicAccuracy: 0,
      magicDefence: 0,
    };

    if (!equipment) return { stats: defaultStats, items: {} };

    const totalStats = { ...defaultStats };
    const items: {
      [key: string]: {
        name: string | null;
        image: string | null;
        rawName: string | null;
      };
    } = {};

    Object.keys(equipmentNames).forEach((slot) => {
      const id = equipment[slot];
      const numericId =
        typeof id === "string" ? parseInt(id, 10) : (id as number);

      if (
        numericId !== null &&
        numericId !== undefined &&
        numericId !== 0 &&
        numericId !== -1
      ) {
        // Stats
        const itemStats = getItemStats(numericId);
        totalStats.strength += itemStats.strength;
        totalStats.accuracy += itemStats.accuracy;
        totalStats.defence += itemStats.defence;
        totalStats.archeryStrength += itemStats.archeryStrength;
        totalStats.archeryAccuracy += itemStats.archeryAccuracy;
        totalStats.archeryDefence += itemStats.archeryDefence;
        totalStats.magicStrength += itemStats.magicStrength;
        totalStats.magicAccuracy += itemStats.magicAccuracy;
        totalStats.magicDefence += itemStats.magicDefence;

        // Display info
        const rawName = getItemName(numericId);
        const displayName = getDisplayItemName(rawName, slot);
        const image = createSafeImagePath(rawName);

        items[slot] = { name: displayName, image, rawName };
      } else {
        items[slot] = { name: null, image: null, rawName: null };
      }
    });

    return { stats: totalStats, items };
  }, [equipment]);

  const renderSlot = (slot: string) => {
    const item = equipmentData.items[slot];
    const hasItem = !!item?.name;
    const tooltipId = `tooltip-equip-${slot}`;
    const isEnchanted = /enchanted/i.test(item.rawName || "");

    return (
      <div className="flex flex-col items-center gap-1">
        <div className="relative group">
          <div
            className={`sm:w-[72px] sm:h-[72px] w-16 h-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center relative hover:border-emerald-500/50 transition-all duration-300 ${
              isEnchanted ? "ring-1 ring-blue-400/30" : ""
            }`}
            data-tooltip-id={tooltipId}
          >
            {hasItem && item.image ? (
              <Image
                src={item.image}
                alt={item.name || slot}
                width={40}
                height={40}
                className={`w-8 h-8 sm:w-10 sm:h-10 object-contain ${
                  isEnchanted
                    ? "animate-pulse drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]"
                    : ""
                }`}
                style={{
                  filter: /gold/i.test(item.rawName || "")
                    ? "drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))"
                    : isEnchanted
                    ? "drop-shadow(0 0 8px rgba(0, 191, 255, 0.6))"
                    : "none",
                }}
                unoptimized
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <></>
            )}
          </div>

          <Tooltip id={tooltipId} place="top" className="z-50">
            {item?.name || "Empty"}
          </Tooltip>
        </div>
        <span className="text-[9px] text-gray-400 font-medium capitalize">
          {equipmentNames[slot]}
        </span>
      </div>
    );
  };

  const StatRow = ({
    label,
    icon: Icon,
    strength,
    accuracy,
    defence,
    colorClass,
  }: StatRowProps) => (
    <div
      className={`p-2 rounded-lg bg-white/5 border border-white/5 ${colorClass}`}
    >
      <div className="flex items-center gap-2 mb-2 text-xs font-bold opacity-90 border-b border-white/5 pb-1">
        <Icon className="text-sm" /> {label}
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        <div className="flex flex-col items-center bg-black/20 rounded p-1">
          <span className="text-[8px] uppercase tracking-wider opacity-60 mb-0.5 font-semibold">
            Str
          </span>
          <span className="font-mono font-medium text-xs">{strength}</span>
        </div>
        <div className="flex flex-col items-center bg-black/20 rounded p-1">
          <span className="text-[8px] uppercase tracking-wider opacity-60 mb-0.5 font-semibold">
            Acc
          </span>
          <span className="font-mono font-medium text-xs">{accuracy}</span>
        </div>
        <div className="flex flex-col items-center bg-black/20 rounded p-1">
          <span className="text-[8px] uppercase tracking-wider opacity-60 mb-0.5 font-semibold">
            Def
          </span>
          <span className="font-mono font-medium text-xs">{defence}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Equipment Grid - Expanded */}
      <div className="flex gap-4 justify-center xl:justify-start flex-grow flex-wrap sm:flex-nowrap">
        {/* Accessories Column */}
        <div className="flex flex-row sm:flex-col gap-3 order-2 sm:order-1 w-full sm:w-auto justify-center sm:justify-start">
          {renderSlot("ammunition")}
          {renderSlot("earrings")}
          {renderSlot("amulet")}
          {renderSlot("jewellery")}
          {renderSlot("bracelet")}
        </div>

        {/* Main Gear Grid */}
        <div className="grid grid-cols-3 gap-x-4 order-1 sm:order-2">
          {renderSlot("pet")}
          {renderSlot("head")}
          {renderSlot("cape")}

          {renderSlot("rightHand")}
          {renderSlot("body")}
          {renderSlot("leftHand")}

          {renderSlot("gloves")}
          {renderSlot("legs")}
          {renderSlot("belt")}

          <div className="col-start-2">{renderSlot("boots")}</div>
        </div>
      </div>

      {/* Stats Panel - Compact */}
      <div className="md:w-1/2 w-full flex flex-col justify-center gap-4">
        <StatRow
          label="Melee"
          icon={FaFistRaised}
          strength={equipmentData.stats.strength}
          accuracy={equipmentData.stats.accuracy}
          defence={equipmentData.stats.defence}
          colorClass="text-orange-400 border-orange-500/20 bg-orange-500/5"
        />
        <StatRow
          label="Ranged"
          icon={GiBowman}
          strength={equipmentData.stats.archeryStrength}
          accuracy={equipmentData.stats.archeryAccuracy}
          defence={equipmentData.stats.archeryDefence}
          colorClass="text-cyan-400 border-cyan-500/20 bg-cyan-500/5"
        />
        <StatRow
          label="Magic"
          icon={GiMagicSwirl}
          strength={equipmentData.stats.magicStrength}
          accuracy={equipmentData.stats.magicAccuracy}
          defence={equipmentData.stats.magicDefence}
          colorClass="text-fuchsia-400 border-fuchsia-500/20 bg-fuchsia-500/5"
        />
      </div>
    </div>
  );
}
