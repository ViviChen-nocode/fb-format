import React, { useRef, useCallback, useState } from 'react';
import TextConverter from './components/TextConverter';
import SymbolPicker from './components/SymbolPicker';
import { MascotCharacter } from './components/MascotCharacter';
import { Sparkles } from 'lucide-react';

function App() {
  const insertTextRef = useRef<((text: string) => void) | null>(null);
  const [isMobilePickerOpen, setIsMobilePickerOpen] = useState(false);

  // Handle symbol insertion
  const handleSymbolSelect = useCallback((char: string) => {
    if (insertTextRef.current) {
      // Automatically append a half-width space after the selected symbol
      insertTextRef.current(char + ' ');
      
      // If on mobile (picker is open), close it automatically after selection
      if (isMobilePickerOpen) {
        setIsMobilePickerOpen(false);
      }
    }
  }, [isMobilePickerOpen]);

  const setInsertHandler = useCallback((handler: (text: string) => void) => {
    insertTextRef.current = handler;
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'var(--gradient-bg)' }}>
      <div className="flex-1 flex flex-col overflow-hidden py-4 px-4">
        <div className="max-w-6xl mx-auto flex-1 flex flex-col w-full min-h-0">
          {/* Header */}
          <div className="text-center mb-4 space-y-2 flex-none">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-2" style={{ background: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))' }}>
              <Sparkles className="w-4 h-4" />
              大師姐的工具包
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
              FB/IG 排版轉換神器
            </h1>
            <p className="text-xs sm:text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
              讓你的 Facebook 和 Instagram 貼文更專業！自動保留空行與縮排，完美呈現你的排版設計。
            </p>
          </div>

          {/* Main Card */}
          <div className="glass-card overflow-hidden transition-shadow duration-300 flex-1 flex flex-col min-h-0 mb-2">
            {/* Mobile Toolbar (Visible only on lg and below) */}
            <div className="lg:hidden p-3 border-b flex-none" style={{ borderColor: 'hsl(var(--border) / 0.5)' }}>
              <button 
                onClick={() => setIsMobilePickerOpen(true)}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <span>😊</span>
                <span>開啟符號選單</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 p-4 sm:p-6 flex-1 min-h-0">
              {/* Main Editor Area */}
              <div className="lg:col-span-7 h-full flex flex-col min-h-0">
                <TextConverter onInsertRequest={setInsertHandler} />
              </div>

              {/* Desktop Sidebar (Hidden on Mobile) */}
              <div className="hidden lg:block lg:col-span-5 h-full min-h-0">
                <SymbolPicker onSelect={handleSymbolSelect} />
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center text-xs sm:text-sm py-2 flex-none" style={{ color: 'hsl(var(--muted-foreground))' }}>
            <p>
              Made with ❤️ by{" "}
              <a href="https://www.facebook.com/vivichen.sister" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline" style={{ color: 'hsl(var(--primary))' }}>
                Vivi Chen 大師姐
              </a>
              {" "}| © {new Date().getFullYear()}
            </p>
          </footer>
        </div>
      </div>

      {/* Mobile Modal for Symbol Picker */}
      {isMobilePickerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 transition-opacity backdrop-blur-sm"
            style={{ background: 'hsl(220 30% 15% / 0.75)' }}
            onClick={() => setIsMobilePickerOpen(false)}
          ></div>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-0 text-center sm:items-center sm:p-0">
              {/* Modal Panel */}
              <div className="relative transform overflow-hidden rounded-t-2xl sm:rounded-2xl text-left transition-all w-full sm:my-8 sm:w-full sm:max-w-lg h-[80vh] sm:h-[600px] flex flex-col glass-card" style={{ borderRadius: 'calc(var(--radius) * 2)' }}>
                
                {/* Modal Header */}
                <div className="card-header flex justify-between items-center flex-none">
                  <h3 className="text-base font-semibold leading-6" id="modal-title" style={{ color: 'hsl(var(--foreground))' }}>選擇符號 (點選自動插入)</h3>
                  <button 
                    type="button" 
                    className="rounded-md p-1 transition-colors"
                    style={{ color: 'hsl(var(--muted-foreground))' }}
                    onClick={() => setIsMobilePickerOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Modal Content - Symbol Picker */}
                <div className="flex-1 overflow-hidden">
                   <SymbolPicker onSelect={handleSymbolSelect} isMobileMode={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mascot */}
      <MascotCharacter />
    </div>
  );
}

export default App;