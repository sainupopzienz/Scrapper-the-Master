import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Globe, Download, Github, Linkedin, Zap, Shield, Cpu } from 'lucide-react';
import UrlInput from './components/UrlInput';
import TerminalWindow from './components/TerminalWindow';
import Header from './components/Header';
import Footer from './components/Footer';
import Stats from './components/Stats';

function App() {
  const [isScrapingActive, setIsScrapingActive] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [scrapingProgress, setScrapingProgress] = useState(0);
  const [currentUrl, setCurrentUrl] = useState('');

  const handleStartScraping = async (url: string) => {
    setCurrentUrl(url);
    setIsScrapingActive(true);
    setTerminalOutput([]);
    setScrapingProgress(0);

    // Simulate scraping process with realistic terminal output
    const commands = [
      `$ wget --mirror --convert-links --adjust-extension --page-requisites --no-parent`,
      `  --user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"`,
      `  ${url}`,
      ``,
      `Resolving domain...`,
      `Connecting to ${new URL(url).hostname}...`,
      `HTTP request sent, awaiting response...`,
      `200 OK`,
      `Length: unspecified [text/html]`,
      `Saving to: '${new URL(url).hostname}/index.html'`,
      ``,
      `Downloading resources...`,
    ];

    for (let i = 0; i < commands.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setTerminalOutput(prev => [...prev, commands[i]]);
      setScrapingProgress((i + 1) / commands.length * 50);
    }

    // Start actual scraping
    try {
      setTerminalOutput(prev => [...prev, 'Starting actual scraping process...']);
      
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();

      if (result.success) {
        setTerminalOutput(prev => [...prev, 
          'Scraping completed successfully!',
          `Domain: ${result.domain}`,
          'All files saved to server.',
          'Ready for download as ZIP file.'
        ]);
        setScrapingProgress(100);
      } else {
        setTerminalOutput(prev => [...prev, 
          `Error: ${result.error}`,
          result.details || 'Unknown error occurred'
        ]);
      }
    } catch (error) {
      setTerminalOutput(prev => [...prev, 
        'Error: Failed to connect to scraping service',
        'Please check your connection and try again.'
      ]);
    }

    setIsScrapingActive(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Animated background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-transparent"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full shadow-lg shadow-green-500/25 animate-pulse">
                <Terminal className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Scrapper The Master
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Professional web scraping tool with advanced terminal interface. 
              Extract complete websites with all assets and download as ZIP files.
            </p>
          </div>

          <Stats />

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <UrlInput 
              onStartScraping={handleStartScraping}
              isScrapingActive={isScrapingActive}
            />

            <TerminalWindow 
              output={terminalOutput}
              isActive={isScrapingActive}
              progress={scrapingProgress}
              currentUrl={currentUrl}
            />
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-400" />
              Features
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-green-400" />
                  Complete website mirroring
                </li>
                <li className="flex items-center">
                  <Cpu className="w-4 h-4 mr-2 text-blue-400" />
                  All assets (CSS, JS, Images)
                </li>
                <li className="flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-purple-400" />
                  Cross-platform support
                </li>
                <li className="flex items-center">
                  <Download className="w-4 h-4 mr-2 text-indigo-400" />
                  ZIP download functionality
                </li>
              </ul>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <Terminal className="w-4 h-4 mr-2 text-cyan-400" />
                  Real-time terminal output
                </li>
                <li className="flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                  Progress tracking
                </li>
                <li className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-red-400" />
                  Docker containerized
                </li>
                <li className="flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-green-400" />
                  Production ready
                </li>
              </ul>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;