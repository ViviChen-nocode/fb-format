import React, { useState, useEffect, useRef } from 'react';
import { SYMBOL_CATEGORIES } from '../constants';
import { SymbolItem, SymbolCategory } from '../types';

interface SymbolPickerProps {
  onSelect: (char: string) => void;
  isMobileMode?: boolean;
}

const RECENT_CATEGORY_ID = 'recently_used';
const MAX_RECENT_ITEMS = 20;
const STORAGE_KEY = 'fb_converter_recents';

// Helper function to check if localStorage is available
const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

// Helper function to safely get from localStorage
const getFromStorage = (): SymbolItem[] => {
  if (!isLocalStorageAvailable()) {
    return [];
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load recents from localStorage', e);
  }
  return [];
};

// Helper function to safely save to localStorage
const saveToStorage = (items: SymbolItem[]): void => {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available, recent items will not be persisted');
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save recents to localStorage', e);
    // Try to handle quota exceeded error
    if (e instanceof DOMException && (e.code === 22 || e.code === 1014 || e.name === 'QuotaExceededError')) {
      console.warn('localStorage quota exceeded, clearing old items');
      try {
        // Try to save with fewer items
        const reducedItems = items.slice(0, Math.floor(MAX_RECENT_ITEMS / 2));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reducedItems));
      } catch (e2) {
        console.error('Failed to save even with reduced items', e2);
      }
    }
  }
};

const SymbolPicker: React.FC<SymbolPickerProps> = ({ onSelect, isMobileMode = false }) => {
  const [activeTab, setActiveTab] = useState(RECENT_CATEGORY_ID);
  const [recentItems, setRecentItems] = useState<SymbolItem[]>([]);
  const isMountedRef = useRef(true);

  // Load recently used from localStorage on mount
  useEffect(() => {
    isMountedRef.current = true;
    const items = getFromStorage();
    if (isMountedRef.current) {
      setRecentItems(items);
    }
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleSelect = (item: SymbolItem) => {
    onSelect(item.char);
    addToRecent(item);
  };

  const addToRecent = (item: SymbolItem) => {
    // Calculate new recents immediately (synchronously)
    const currentItems = recentItems.length > 0 ? recentItems : getFromStorage();
    const filtered = currentItems.filter((i) => i.char !== item.char);
    const newRecents = [item, ...filtered].slice(0, MAX_RECENT_ITEMS);
    
    // Save to localStorage immediately (before state update)
    saveToStorage(newRecents);
    
    // Update state
    setRecentItems(newRecents);
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
    ? "h-full flex flex-col" // Mobile: fill the modal content area
    : "glass-card overflow-hidden flex flex-col h-full max-h-[600px] md:max-h-full"; // Desktop: card style

  return (
    <div className={containerClasses} style={!isMobileMode ? { borderRadius: 'var(--radius)' } : {}}>
      {/* Header only for desktop, mobile uses modal header */}
      {!isMobileMode && (
        <div className="card-header">
          <h3 className="text-sm font-semibold" style={{ color: 'hsl(var(--foreground))' }}>插入符號與表情</h3>
        </div>
      )}
      
      {/* Tabs */}
      <div className="flex overflow-x-auto scrollbar-hide border-b" style={{ borderColor: 'hsl(var(--border) / 0.5)', background: 'hsl(var(--card))' }}>
        {displayCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`flex-none px-4 py-3 text-sm font-medium transition-colors duration-200 whitespace-nowrap
              ${activeTab === cat.id 
                ? 'border-b-2' 
                : ''
              }`}
            style={activeTab === cat.id 
              ? { 
                  color: 'hsl(var(--primary))', 
                  borderBottomColor: 'hsl(var(--primary))',
                  background: 'hsl(var(--primary) / 0.05)'
                }
              : { 
                  color: 'hsl(var(--muted-foreground))'
                }
            }
            onMouseEnter={(e) => {
              if (activeTab !== cat.id) {
                e.currentTarget.style.color = 'hsl(var(--foreground))';
                e.currentTarget.style.background = 'hsl(var(--muted) / 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== cat.id) {
                e.currentTarget.style.color = 'hsl(var(--muted-foreground))';
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar" style={{ background: 'hsl(var(--card))' }}>
        {displayCategories.map((cat) => {
          if (activeTab !== cat.id) return null;

          if (cat.id === RECENT_CATEGORY_ID && cat.items.length === 0) {
            return (
              <div key={cat.id} className="h-full flex flex-col items-center justify-center text-sm p-4 min-h-[200px]" style={{ color: 'hsl(var(--muted-foreground))' }}>
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
                  className={`flex items-center justify-center rounded-lg transition-all duration-150 active:scale-95 cursor-pointer select-none border
                    ${isKaomoji ? 'p-2 text-sm h-auto aspect-auto py-3' : 'aspect-square text-2xl sm:text-xl'}
                  `}
                  style={{
                    background: isKaomoji ? 'hsl(var(--muted) / 0.3)' : 'transparent',
                    borderColor: 'transparent',
                    color: 'hsl(var(--foreground))'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'hsl(var(--primary) / 0.1)';
                    e.currentTarget.style.borderColor = 'hsl(var(--primary) / 0.3)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isKaomoji ? 'hsl(var(--muted) / 0.3)' : 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
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