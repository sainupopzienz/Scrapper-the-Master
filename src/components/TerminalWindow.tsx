import React, { useEffect, useRef } from 'react';
import { Terminal, Minimize2, Maximize2, X } from 'lucide-react';

interface TerminalWindowProps {
  output: string[];
  isActive: boolean;
  progress: number;
  currentUrl: string;
}

const TerminalWindow: React.FC<TerminalWindowProps> = ({ 
  output, 
  isActive, 
  progress, 
  currentUrl 
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [isMinimized, setIsMinimized] = React.useState(false);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const getLineColor = (line: string) => {
    if (line.startsWith('$')) return 'text-yellow-400';
    if (line.includes('200 OK') || line.includes('completed successfully')) return 'text-green-400';
    if (line.includes('Downloading') || line.includes('Saving')) return 'text-blue-400';
    if (line.includes('Error') || line.includes('Failed')) return 'text-red-400';
    return 'text-gray-300';
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
      {/* Terminal Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">
              {isActive ? 'Scraping...' : 'Terminal'} 
              {currentUrl && ` - ${new URL(currentUrl).hostname}`}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {isActive && (
        <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-300 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Terminal Content */}
      {!isMinimized && (
        <div 
          ref={terminalRef}
          className="h-96 overflow-y-auto p-4 bg-black/50 font-mono text-sm"
        >
          {output.length === 0 ? (
            <div className="text-gray-500 italic">
              {isActive ? 'Initializing scraper...' : 'Terminal ready. Enter a URL to start scraping.'}
            </div>
          ) : (
            <div className="space-y-1">
              {output.map((line, index) => (
                <div key={index} className={`${getLineColor(line)} leading-relaxed`}>
                  {line.startsWith('$') ? (
                    <div className="flex">
                      <span className="text-green-500 mr-2">user@scrapper:~</span>
                      <span>{line}</span>
                    </div>
                  ) : (
                    <div className="pl-4">{line}</div>
                  )}
                </div>
              ))}
              
              {isActive && (
                <div className="flex items-center text-green-400 animate-pulse">
                  <span className="text-green-500 mr-2">user@scrapper:~</span>
                  <span className="bg-green-400 w-2 h-4 ml-1 animate-pulse"></span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TerminalWindow;