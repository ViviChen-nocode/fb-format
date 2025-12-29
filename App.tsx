import React, { useRef, useCallback, useState } from 'react';
import TextConverter from './components/TextConverter';
import SymbolPicker from './components/SymbolPicker';

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
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm flex-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
              F
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
              FB/IG 轉換神器
            </h1>
          </div>
          <div className="hidden sm:block text-xs text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
            自動保留空行與縮排
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 w-full box-border">
        
        {/* Mobile Toolbar (Visible only on lg and below) */}
        <div className="lg:hidden mb-4">
           <button 
             onClick={() => setIsMobilePickerOpen(true)}
             className="w-full bg-white border border-blue-200 text-blue-700 font-medium py-3 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 active:bg-blue-50 transition-colors"
           >
             <span>😊</span>
             <span>開啟符號選單</span>
             <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[500px]">
          {/* Main Editor Area */}
          <div className="lg:col-span-8 h-full flex flex-col">
            <TextConverter onInsertRequest={setInsertHandler} />
          </div>

          {/* Desktop Sidebar (Hidden on Mobile) */}
          <div className="hidden lg:block lg:col-span-4 h-full">
            <SymbolPicker onSelect={handleSymbolSelect} />
          </div>
        </div>
      </main>

      {/* Mobile Modal for Symbol Picker */}
      {isMobilePickerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm"
            onClick={() => setIsMobilePickerOpen(false)}
          ></div>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-0 text-center sm:items-center sm:p-0">
              {/* Modal Panel */}
              <div className="relative transform overflow-hidden rounded-t-xl sm:rounded-xl bg-white text-left shadow-xl transition-all w-full sm:my-8 sm:w-full sm:max-w-lg h-[80vh] sm:h-[600px] flex flex-col">
                
                {/* Modal Header */}
                <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between items-center border-b border-gray-100 flex-none">
                  <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">選擇符號 (點選自動插入)</h3>
                  <button 
                    type="button" 
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
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

      <footer className="text-center py-4 text-gray-400 text-sm flex-none">
        <p>© {new Date().getFullYear()} Social Media Formatter Tool</p>
      </footer>
    </div>
  );
}

export default App;