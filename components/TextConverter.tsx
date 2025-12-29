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
    <div className="flex flex-col h-full min-h-0">
      <div className="glass-card overflow-hidden flex flex-col flex-1 relative min-h-0" style={{ borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div className="card-header flex justify-between items-center relative flex-none">
          <h3 className="text-sm font-semibold" style={{ color: 'hsl(var(--foreground))' }}>編輯區</h3>
          <span className="text-xs hidden sm:inline" style={{ color: 'hsl(var(--muted-foreground))' }}>支援 Markdown 風格縮排與空行</span>
        </div>
        
        {/* Textarea Container */}
        <div 
          className="flex flex-col"
          style={{ 
            height: '400px',
            overflow: 'hidden'
          }}
        >
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="在此貼上或輸入文字..."
            className="w-full p-4 resize-none outline-none text-base leading-relaxed font-sans custom-scrollbar transition-all"
            style={{ 
              color: 'hsl(var(--foreground))',
              background: 'hsl(var(--card))',
              height: '100%',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        {/* Footer - 固定在底部 */}
        <div className="p-4 border-t flex items-center justify-between gap-3 flex-wrap flex-none relative z-10" style={{ borderColor: 'hsl(var(--border) / 0.5)', background: 'hsl(var(--muted) / 0.3)' }}>
           <div className="flex gap-2">
             <button
              onClick={handleConvert}
              disabled={!text}
              className="btn-primary"
            >
              轉換並複製
            </button>
            <button
              onClick={handleClear}
              disabled={!text}
              className="btn-secondary"
            >
              清空
            </button>
           </div>

           {status && (
             <span className="font-medium text-sm animate-fade-in flex items-center" style={{ color: 'hsl(var(--secondary))' }}>
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