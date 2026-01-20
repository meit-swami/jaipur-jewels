"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  priceRange: [number, number];
  size: string[];
  jewelryType: string[];
  stones: string[];
}

const SIZES = ["Small", "Medium", "Large", "Extra Large"];
const JEWELRY_TYPES = ["Gold", "Silver", "Platinum", "Rose Gold", "White Gold"];
const STONES = ["Diamond", "Pearl", "Ruby", "Emerald", "Sapphire", "Amethyst", "Topaz", "Garnet", "Opal", "Turquoise"];

export default function ProductFilters({ onFilterChange }: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStones, setSelectedStones] = useState<string[]>([]);

  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleStoneToggle = (stone: string) => {
    setSelectedStones((prev) =>
      prev.includes(stone) ? prev.filter((s) => s !== stone) : [...prev, stone]
    );
  };

  const clearAll = () => {
    setPriceRange([0, 1000000]);
    setSelectedSizes([]);
    setSelectedTypes([]);
    setSelectedStones([]);
  };

  // Update parent when filters change
  useEffect(() => {
    onFilterChange({
      priceRange,
      size: selectedSizes,
      jewelryType: selectedTypes,
      stones: selectedStones,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceRange, selectedSizes, selectedTypes, selectedStones]);

  return (
    <div className="bg-white rounded-2xl p-6 luxury-shadow space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-luxury-charcoal">Filters</h3>
        <button
          onClick={clearAll}
          className="text-sm text-luxury-gold hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-luxury-charcoal">
            Price Range (₹)
          </label>
          <div className="text-sm font-semibold text-luxury-gold">
            ₹{priceRange[0].toLocaleString("en-IN")} - ₹{priceRange[1].toLocaleString("en-IN")}
          </div>
        </div>
        
        {/* Dual Range Slider */}
        <div className="relative">
          <input
            type="range"
            min="0"
            max="1000000"
            step="1000"
            value={priceRange[0]}
            onChange={(e) => {
              const newMin = Math.min(Number(e.target.value), priceRange[1]);
              setPriceRange([newMin, priceRange[1]]);
            }}
            className="absolute w-full h-2 bg-luxury-ivory-darker rounded-lg appearance-none cursor-pointer slider"
            style={{
              zIndex: priceRange[0] > priceRange[1] - 10000 ? 2 : 1,
            }}
          />
          <input
            type="range"
            min="0"
            max="1000000"
            step="1000"
            value={priceRange[1]}
            onChange={(e) => {
              const newMax = Math.max(Number(e.target.value), priceRange[0]);
              setPriceRange([priceRange[0], newMax]);
            }}
            className="absolute w-full h-2 bg-luxury-ivory-darker rounded-lg appearance-none cursor-pointer slider"
            style={{ zIndex: 2 }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-luxury-charcoal-light mt-2">
          <span>₹0</span>
          <span>₹10,00,000</span>
        </div>
      </div>

      {/* Size */}
      <div>
        <label className="block text-sm font-medium text-luxury-charcoal mb-2">
          Size
        </label>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeToggle(size)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedSizes.includes(size)
                  ? "bg-luxury-gold text-white"
                  : "bg-luxury-ivory-dark text-luxury-charcoal hover:bg-luxury-gold-light"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Jewelry Type */}
      <div>
        <label className="block text-sm font-medium text-luxury-charcoal mb-2">
          Jewelry Type
        </label>
        <div className="flex flex-wrap gap-2">
          {JEWELRY_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => handleTypeToggle(type)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTypes.includes(type)
                  ? "bg-luxury-gold text-white"
                  : "bg-luxury-ivory-dark text-luxury-charcoal hover:bg-luxury-gold-light"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Stones */}
      <div>
        <label className="block text-sm font-medium text-luxury-charcoal mb-2">
          Stones
        </label>
        <div className="flex flex-wrap gap-2">
          {STONES.map((stone) => (
            <button
              key={stone}
              onClick={() => handleStoneToggle(stone)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedStones.includes(stone)
                  ? "bg-luxury-gold text-white"
                  : "bg-luxury-ivory-dark text-luxury-charcoal hover:bg-luxury-gold-light"
              }`}
            >
              {stone}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
