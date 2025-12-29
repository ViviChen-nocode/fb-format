import React, { useState, useEffect } from 'react';
import { SYMBOL_CATEGORIES } from '../constants';
import { SymbolItem, SymbolCategory } from '../types';

interface SymbolPickerProps {
  onSelect: (char: string) => void;
  isMobileMode?: boolean;
}

const RECENT_CATEGORY_ID = 'recently_used';
const MAX_RECENT_ITEMS = 20;

const SymbolPicker: React.FC<SymbolPickerProps> = ({ onSelect, isMobileMode = false }) => {
  const [activeTab, setActiveTab] = useState(RECENT_CATEGORY_ID);
  const [recentItems, setRecentItems] = useState<SymbolItem[]>([]);

  // Load recently used from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('fb_converter_recents');
      if (stored) {
        setRecentItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load recents', e);
    }
  }, []);

  const handleSelect = (item: SymbolItem) => {
    onSelect(item.char);
    addToRecent(item);
  };

  const addToRecent = (item: SymbolItem) => {
    setRecentItems((prev) => {
      // Remove if exists to push to front
      const filtered = prev.filter((i) => i.char !== item.char);
      const newRecents = [item, ...filtered].slice(0, MAX_RECENT_ITEMS);
      
      // Persist
      try {
        localStorage.setItem('fb_converter_recents', JSON.stringify(newRecents));
      } catch (e) {
        console.error('Failed to save recents', e);
      }
      return newRecents;
    });
  };

  // Construct display categories including "Recently Used"
  const displayCategories: SymbolCategory[] = [
    {
      id: RECENT_CATEGORY_ID,
      label: '最近使用',
      items: recentItems.length > 0 ? recentItems : [] // Will handle empty state in render
    },
    ...SYMBOL_CATEGORIES
  ];

  // Adjust container class based on mode (desktop sidebar vs mobile modal)
  const containerClasses = isMobileMode 
    ? "h-full flex flex-col bg-white" // Mobile: fill the modal content area
    : "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full max-h-[600px] md:max-h-full"; // Desktop: card style

  return (
    <div className={containerClasses}>
      {/* Header only for desktop, mobile uses modal header */}
      {!isMobileMode && (
        <div className="p-3 bg-gray-50 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">插入符號與表情</h3>
        </div>
      )}
      
      {/* Tabs */}
      <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-100 bg-white">
        {displayCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`flex-none px-4 py-3 text-sm font-medium transition-colors duration-200 whitespace-nowrap
              ${activeTab === cat.id 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-white">
        {displayCategories.map((cat) => {
          if (activeTab !== cat.id) return null;

          if (cat.id === RECENT_CATEGORY_ID && cat.items.length === 0) {
            return (
              <div key={cat.id} className="h-full flex flex-col items-center justify-center text-gray-400 text-sm p-4 min-h-[200px]">
                <span className="text-3xl mb-3">🕘</span>
                <p>還沒有使用記錄</p>
                <p className="text-xs mt-1">點選其他分頁的符號來使用</p>
              </div>
            );
          }

          // Special layout for Kaomoji (id === 'kaomoji')
          const isKaomoji = cat.id === 'kaomoji';
          const gridClass = isKaomoji 
            ? 'grid-cols-2' // Wider items
            : 'grid-cols-5'; // Standard items

          return (
            <div key={cat.id} className={`grid ${gridClass} gap-3 sm:gap-2 pb-10`}>
              {cat.items.map((item, index) => (
                <button
                  key={`${cat.id}-${item.char}-${index}`}
                  onClick={() => handleSelect(item)}
                  title={item.name}
                  className={`flex items-center justify-center hover:bg-blue-100 rounded-lg transition-colors duration-150 active:scale-95 active:bg-blue-200 cursor-pointer select-none border border-transparent hover:border-blue-200
                    ${isKaomoji ? 'p-2 text-sm h-auto aspect-auto py-3 bg-gray-50' : 'aspect-square text-2xl sm:text-xl'}
                  `}
                >
                  {item.char}
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SymbolPicker;