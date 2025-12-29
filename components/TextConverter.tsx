import React, { useState, useRef, useEffect } from 'react';

interface TextConverterProps {
  onInsertRequest: (callback: (currentText: string, insertFn: (text: string) => void) => void) => void;
}

const TextConverter: React.FC<TextConverterProps> = ({ onInsertRequest }) => {
  const [text, setText] = useState<string>('');
  const [status, setStatus] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Conversion logic based on user request
  const processText = (originalText: string): string => {
    return originalText.split('\n').map(line => {
      // 1. Handle empty lines: return Braille Pattern Blank (\u2800)
      if (line.trim() === '') {
        return '\u2800'; 
      }

      // 2. Handle indentation: Replace leading spaces with Four-Per-Em Space (\u2005)
      return line.replace(/^ +/g, (match) => {
        return '\u2005'.repeat(match.length);
      });
    }).join('\n');
  };

  const handleConvert = async () => {
    if (!text) return;

    const converted = processText(text);

    try {
      await navigator.clipboard.writeText(converted);
      setStatus('轉換並複製成功！已保留縮排與空行。');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = converted;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setStatus('轉換並複製成功 (Fallback)。');
    }

    setTimeout(() => setStatus(null), 3000);
  };

  const handleClear = () => {
    if (window.confirm('確定要清空內容嗎？')) {
      setText('');
      setStatus(null);
    }
  };

  // Expose insertion capability to parent/sibling
  useEffect(() => {
    onInsertRequest((char: string) => {
      const textarea = textareaRef.current;
      if (!textarea) {
        setText(prev => prev + char);
        return;
      }

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentVal = textarea.value;

      const newVal = currentVal.substring(0, start) + char + currentVal.substring(end);
      
      setText(newVal);

      // Restore cursor position after state update
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + char.length;
        textarea.focus();
      });
    });
  }, [onInsertRequest]);

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col flex-1">
        <div className="p-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-700">編輯區</h3>
          <span className="text-xs text-gray-500 hidden sm:inline">支援 Markdown 風格縮排與空行</span>
        </div>
        
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="在此貼上或輸入文字..."
          className="flex-1 w-full p-4 resize-none outline-none text-base leading-relaxed font-sans placeholder-gray-400 focus:bg-blue-50/10 transition-colors custom-scrollbar min-h-[300px]"
        />
        
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3 flex-wrap">
           <div className="flex gap-2">
             <button
              onClick={handleConvert}
              disabled={!text}
              className={`px-6 py-2.5 rounded-lg font-medium text-white shadow-md transition-all
                ${!text 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 shadow-blue-500/20'
                }`}
            >
              轉換並複製
            </button>
            <button
              onClick={handleClear}
              disabled={!text}
              className="px-4 py-2.5 rounded-lg font-medium text-gray-600 bg-white border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              清空
            </button>
           </div>

           {status && (
             <span className="text-green-600 font-medium text-sm animate-fade-in flex items-center">
               <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
               {status}
             </span>
           )}
        </div>
      </div>
    </div>
  );
};

export default TextConverter;