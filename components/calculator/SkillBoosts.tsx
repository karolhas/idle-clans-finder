"use client";

import { BsInfoCircleFill } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useCalculator } from "./CalculatorContext";
import {
  BOOST_OPTIONS,
  OUTFIT_PIECES,
  TOOLS_BY_SKILL,
  T1_SCROLLS,
  T2_SCROLLS,
  T3_SCROLLS,
  MAX_OUTFIT_PIECES,
} from "@/utils/gamedata/calculator-constants";

export default function SkillBoosts() {
  const { state, setSkillBoost } = useCalculator();
  const { currentSkill, skillBoosts } = state;
  const currentBoosts = skillBoosts[currentSkill];
  const tools = TOOLS_BY_SKILL[currentSkill] || [];

  // Filter out Clan House, Personal House, and Scrolls as they need special handling
  const filteredBoostOptions = BOOST_OPTIONS.filter(
    (option) =>
      option.name !== "clanHouse" &&
      option.name !== "personalHouse" &&
      option.name !== "t1Scrolls" &&
      option.name !== "t2Scrolls" &&
      option.name !== "t3Scrolls"
  );

  // Handler for scroll selection with updated logic - max 4 scrolls total
  const handleScrollChange = (
    tier: "t1Scrolls" | "t2Scrolls" | "t3Scrolls",
    value: string
  ) => {
    // Calculate total scrolls currently selected
    const currentT1 = parseInt(currentBoosts.t1Scrolls) || 0;
    const currentT2 = parseInt(currentBoosts.t2Scrolls) || 0;
    const currentT3 = parseInt(currentBoosts.t3Scrolls) || 0;

    // Calculate how many scrolls will be in this tier after change
    const newTierValue = parseInt(value) || 0;

    // Calculate how many scrolls are currently in the changing tier
    let currentTierValue = 0;
    if (tier === "t1Scrolls") currentTierValue = currentT1;
    else if (tier === "t2Scrolls") currentTierValue = currentT2;
    else if (tier === "t3Scrolls") currentTierValue = currentT3;

    // Calculate the total that will exist after the change
    const totalAfterChange =
      currentT1 + currentT2 + currentT3 - currentTierValue + newTierValue;

    // Only allow the change if total will be <= 4
    if (totalAfterChange <= 4) {
      setSkillBoost(currentSkill, tier, value);
    }
  };

  // Calculate current total scrolls
  const currentT1Count = parseInt(currentBoosts.t1Scrolls) || 0;
  const currentT2Count = parseInt(currentBoosts.t2Scrolls) || 0;
  const currentT3Count = parseInt(currentBoosts.t3Scrolls) || 0;
  const totalScrolls = currentT1Count + currentT2Count + currentT3Count;

  // Check if we've reached max scrolls (4) and this tier has 0 selected
  const isT1Disabled = totalScrolls >= 4 && currentT1Count === 0;
  const isT2Disabled = totalScrolls >= 4 && currentT2Count === 0;
  const isT3Disabled = totalScrolls >= 4 && currentT3Count === 0;

  // Calculate how many scrolls are still available
  const scrollsAvailable = 4 - totalScrolls;

  // Funkcja sprawdzająca, czy opcja powinna być zablokowana
  const isOptionDisabled = (
    scrollValue: string,
    currentTierCount: number,
    selectedValue: string
  ) => {
    const value = parseInt(scrollValue) || 0;

    // Zawsze pozwalamy wybrać 0 (usunąć scrolle)
    if (value === 0) return false;

    // Jeśli to jest aktualnie wybrana wartość, pozwalamy
    if (scrollValue === selectedValue) return false;

    // Jeśli to jest mniejsza wartość niż obecna, pozwalamy
    if (currentTierCount > 0 && value <= currentTierCount) return false;

    // Sprawdzamy, czy wartość mieści się w dostępnych slotach + obecnie wybranych w tym tierze
    return value > scrollsAvailable + currentTierCount;
  };

  return (
    <div className="bg-black/60 p-6 rounded-2xl border-2 border-white/10 relative backdrop-blur-md shadow-xl hover:border-teal-500/50 hover:shadow-teal-900/20 transition-all duration-300 group">
      <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-300 group-hover:text-teal-400 transition-colors mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-teal-500"></span>
        Skill Boosts
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Tool */}
        <div>
          <label
            htmlFor="tool"
            className="block text-sm font-medium text-gray-400 mb-2"
          >
            Tool
          </label>
          <select
            id="tool"
            value={currentBoosts.tool}
            onChange={(e) =>
              setSkillBoost(currentSkill, "tool", e.target.value)
            }
            className="w-full px-4 py-2.5 bg-black/90 border border-white/5 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all"
          >
            {tools.map((tool) => (
              <option key={tool.value} value={tool.value}>
                {tool.name} {tool.boost > 0 ? `(+${tool.boost}%)` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* T1 Scrolls */}
        <div>
          <label
            htmlFor="t1Scrolls"
            className={`block text-sm font-medium mb-2 ${
              !isT1Disabled ? "text-gray-400" : "text-gray-600"
            }`}
          >
            T1 Scrolls {isT1Disabled && `(Max 4 scrolls reached)`}
            {!isT1Disabled &&
              totalScrolls > 0 &&
              ` (${scrollsAvailable} slots left)`}
          </label>
          <select
            id="t1Scrolls"
            value={currentBoosts.t1Scrolls}
            onChange={(e) => handleScrollChange("t1Scrolls", e.target.value)}
            disabled={isT1Disabled}
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all ${
              !isT1Disabled
                ? "bg-black/90 border-white/5 text-white"
                : "bg-black/20 border-white/5 text-gray-600 cursor-not-allowed"
            }`}
          >
            {T1_SCROLLS.map((scroll) => (
              <option
                key={scroll.value}
                value={scroll.value}
                disabled={isOptionDisabled(
                  scroll.value,
                  currentT1Count,
                  currentBoosts.t1Scrolls
                )}
                className={
                  isOptionDisabled(
                    scroll.value,
                    currentT1Count,
                    currentBoosts.t1Scrolls
                  )
                    ? "text-gray-500 bg-gray-900"
                    : ""
                }
              >
                {scroll.name} {scroll.boost > 0 ? `(+${scroll.boost}%)` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* T2 Scrolls */}
        <div>
          <label
            htmlFor="t2Scrolls"
            className={`block text-sm font-medium mb-2 ${
              !isT2Disabled ? "text-gray-400" : "text-gray-600"
            }`}
          >
            T2 Scrolls {isT2Disabled && `(Max 4 scrolls reached)`}
            {!isT2Disabled &&
              totalScrolls > 0 &&
              ` (${scrollsAvailable} slots left)`}
          </label>
          <select
            id="t2Scrolls"
            value={currentBoosts.t2Scrolls}
            onChange={(e) => handleScrollChange("t2Scrolls", e.target.value)}
            disabled={isT2Disabled}
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all ${
              !isT2Disabled
                ? "bg-black/90 border-white/5 text-white"
                : "bg-black/20 border-white/5 text-gray-600 cursor-not-allowed"
            }`}
          >
            {T2_SCROLLS.map((scroll) => (
              <option
                key={scroll.value}
                value={scroll.value}
                disabled={isOptionDisabled(
                  scroll.value,
                  currentT2Count,
                  currentBoosts.t2Scrolls
                )}
                className={
                  isOptionDisabled(
                    scroll.value,
                    currentT2Count,
                    currentBoosts.t2Scrolls
                  )
                    ? "text-gray-500 bg-gray-900"
                    : ""
                }
              >
                {scroll.name} {scroll.boost > 0 ? `(+${scroll.boost}%)` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* T3 Scrolls */}
        <div>
          <label
            htmlFor="t3Scrolls"
            className={`block text-sm font-medium mb-2 ${
              !isT3Disabled ? "text-gray-400" : "text-gray-600"
            }`}
          >
            T3 Scrolls {isT3Disabled && `(Max 4 scrolls reached)`}
            {!isT3Disabled &&
              totalScrolls > 0 &&
              ` (${scrollsAvailable} slots left)`}
          </label>
          <select
            id="t3Scrolls"
            value={currentBoosts.t3Scrolls}
            onChange={(e) => handleScrollChange("t3Scrolls", e.target.value)}
            disabled={isT3Disabled}
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all ${
              !isT3Disabled
                ? "bg-black/90 border-white/5 text-white"
                : "bg-black/20 border-white/5 text-gray-600 cursor-not-allowed"
            }`}
          >
            {T3_SCROLLS.map((scroll) => (
              <option
                key={scroll.value}
                value={scroll.value}
                disabled={isOptionDisabled(
                  scroll.value,
                  currentT3Count,
                  currentBoosts.t3Scrolls
                )}
                className={
                  isOptionDisabled(
                    scroll.value,
                    currentT3Count,
                    currentBoosts.t3Scrolls
                  )
                    ? "text-gray-500 bg-gray-900"
                    : ""
                }
              >
                {scroll.name} {scroll.boost > 0 ? `(+${scroll.boost}%)` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Outfit Pieces */}
        <div>
          <label
            htmlFor="outfitPieces"
            className="block text-sm font-medium text-gray-400 mb-2"
          >
            Outfit Pieces
          </label>
          <select
            id="outfitPieces"
            value={currentBoosts.outfitPieces}
            onChange={(e) =>
              setSkillBoost(
                currentSkill,
                "outfitPieces",
                parseInt(e.target.value, 10)
              )
            }
            disabled={MAX_OUTFIT_PIECES[currentSkill] === 0}
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all ${
              MAX_OUTFIT_PIECES[currentSkill] === 0
                ? "bg-black/20 border-white/5 text-gray-600 cursor-not-allowed"
                : "bg-black/90 border-white/5 text-white"
            }`}
          >
            {OUTFIT_PIECES.filter(
              (piece) => piece.value <= MAX_OUTFIT_PIECES[currentSkill]
            ).map((piece) => (
              <option key={piece.value} value={piece.value}>
                {piece.value} {piece.boost > 0 ? `(+${piece.boost}%)` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Other standard boost options */}
        {filteredBoostOptions.map((option) => (
          <div key={option.name}>
            <label
              htmlFor={option.name}
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              {option.label}
            </label>
            <select
              id={option.name}
              value={
                currentBoosts[
                  option.name as keyof typeof currentBoosts
                ] as string
              }
              onChange={(e) =>
                setSkillBoost(
                  currentSkill,
                  option.name as keyof typeof currentBoosts,
                  e.target.value
                )
              }
              className="w-full px-4 py-2.5 bg-black/90 border border-white/5 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-emerald-500/50 transition-all"
            >
              {option.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.name} {opt.boost > 0 ? `(+${opt.boost}%)` : ""}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Checkboxes - full width section */}
      <div className="mt-6 border-t border-white/5 pt-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Additional Boosts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* XP Boost */}
          <div className="flex items-center p-3 bg-black/90 rounded-lg border border-white/5">
            <input
              id="xpBoost"
              type="checkbox"
              checked={currentBoosts.xpBoost}
              onChange={(e) =>
                setSkillBoost(currentSkill, "xpBoost", e.target.checked)
              }
              className="h-4 w-4 text-teal-500 border-white/10 rounded focus:ring-teal-500/50 bg-black/90"
            />
            <label
              htmlFor="xpBoost"
              className="ml-3 block text-sm text-gray-300"
            >
              XP Boost (+30%)
              <BsInfoCircleFill
                className="inline-block ml-1 text-gray-400 cursor-help"
                size={14}
                data-tooltip-id="xp-boost-tooltip"
              />
            </label>
            <Tooltip
              id="xp-boost-tooltip"
              place="top"
              content="Will only account for 8 hours out of every 24 hours, +30% in your total time required."
              style={{
                backgroundColor: "#003030",
                color: "#fff",
                borderRadius: "6px",
              }}
            />
          </div>

          {/* Negotiation Potion */}
          <div className="flex items-center p-3 bg-black/90 rounded-lg border border-white/5">
            <input
              id="negotiationPotion"
              type="checkbox"
              checked={currentBoosts.negotiationPotion}
              onChange={(e) =>
                setSkillBoost(
                  currentSkill,
                  "negotiationPotion",
                  e.target.checked
                )
              }
              className="h-4 w-4 text-teal-500 border-white/10 rounded focus:ring-teal-500/50 bg-black/90"
            />
            <label
              htmlFor="negotiationPotion"
              className="ml-3 block text-sm text-gray-300"
            >
              Negotiation Potion (+5% gold)
            </label>
          </div>

          {/* Trickery Potion */}
          <div className="flex items-center p-3 bg-black/90 rounded-lg border border-white/5">
            <input
              id="trickeryPotion"
              type="checkbox"
              checked={currentBoosts.trickeryPotion}
              onChange={(e) =>
                setSkillBoost(currentSkill, "trickeryPotion", e.target.checked)
              }
              className="h-4 w-4 text-teal-500 border-white/10 rounded focus:ring-teal-500/50 bg-black/90"
            />
            <label
              htmlFor="trickeryPotion"
              className="ml-3 block text-sm text-gray-300"
            >
              Trickery Potion (+15% gold)
            </label>
          </div>

          {/* Knowledge Potion */}
          <div className="flex items-center p-3 bg-black/90 rounded-lg border border-white/5">
            <input
              id="knowledgePotion"
              type="checkbox"
              checked={currentBoosts.knowledgePotion}
              onChange={(e) =>
                setSkillBoost(currentSkill, "knowledgePotion", e.target.checked)
              }
              className="h-4 w-4 text-teal-500 border-white/10 rounded focus:ring-teal-500/50 bg-black/90"
            />
            <label
              htmlFor="knowledgePotion"
              className="ml-3 block text-sm text-gray-300"
            >
              Knowledge Potion (+50% Scroll effect)
            </label>
          </div>

          {/* Guardian's Trowel for Farming skill */}
          {currentSkill === "farming" && (
            <div className="flex items-center p-3 bg-black/90 rounded-lg border border-white/5">
              <input
                id="guardiansTrowel"
                type="checkbox"
                checked={currentBoosts.guardiansTrowel}
                onChange={(e) =>
                  setSkillBoost(
                    currentSkill,
                    "guardiansTrowel",
                    e.target.checked
                  )
                }
                className="h-4 w-4 text-teal-500 border-white/10 rounded focus:ring-teal-500/50 bg-black/90"
              />
              <label
                htmlFor="guardiansTrowel"
                className="ml-3 block text-sm text-gray-300"
              >
                Guardian&apos;s Trowel (+5% skill boost)
              </label>
            </div>
          )}

          {/* Guardian&apos;s Chisel for Crafting skill */}
          {currentSkill === "crafting" && (
            <div className="flex items-center p-3 bg-black/90 rounded-lg border border-white/5">
              <input
                id="guardiansChisel"
                type="checkbox"
                checked={currentBoosts.guardiansChisel}
                onChange={(e) =>
                  setSkillBoost(
                    currentSkill,
                    "guardiansChisel",
                    e.target.checked
                  )
                }
                className="h-4 w-4 text-teal-500 border-white/10 rounded focus:ring-teal-500/50 bg-black/90"
              />
              <label
                htmlFor="guardiansChisel"
                className="ml-3 block text-sm text-gray-300"
              >
                Guardian&apos;s Chisel (+10% XP to Refinement)
              </label>
            </div>
          )}

          {/* Forgery Potion for Smithing skill */}
          {currentSkill === "smithing" && (
            <div className="flex items-center p-3 bg-black/90 rounded-lg border border-white/5">
              <input
                id="forgeryPotion"
                type="checkbox"
                checked={currentBoosts.forgeryPotion}
                onChange={(e) =>
                  setSkillBoost(currentSkill, "forgeryPotion", e.target.checked)
                }
                className="h-4 w-4 text-teal-500 border-white/10 rounded focus:ring-teal-500/50 bg-black/90"
              />
              <label
                htmlFor="forgeryPotion"
                className="ml-3 block text-sm text-gray-300"
              >
                Forgery Potion (+10% to save bars)
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
