import React, { useState } from 'react';
import { Play, Loader2, Globe, AlertCircle, Download } from 'lucide-react';

interface UrlInputProps {
  onStartScraping: (url: string) => void;
  isScrapingActive: boolean;
}

const UrlInput: React.FC<UrlInputProps> = ({ onStartScraping, isScrapingActive }) => {
  const [url, setUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loadingDownloads, setLoadingDownloads] = useState(false);

  const validateUrl = (inputUrl: string): boolean => {
    try {
      new URL(inputUrl);
      return true;
    } catch {
      return false;
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputUrl = e.target.value;
    setUrl(inputUrl);
    
    if (inputUrl.trim()) {
      setIsValidUrl(validateUrl(inputUrl));
    } else {
      setIsValidUrl(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && isValidUrl && !isScrapingActive) {
      onStartScraping(url.trim());
      // Refresh downloads after scraping
      setTimeout(() => {
        fetchDownloads();
      }, 2000);
    }
  };

  const fetchDownloads = async () => {
    setLoadingDownloads(true);
    try {
      const response = await fetch('/api/downloads');
      const data = await response.json();
      setDownloads(data.downloads || []);
    } catch (error) {
      console.error('Failed to fetch downloads:', error);
    } finally {
      setLoadingDownloads(false);
    }
  };

  const handleDownload = async (domain: string) => {
    try {
      const response = await fetch(`/api/download/${domain}`);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }

      // Create blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${domain}-scraped.zip`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  React.useEffect(() => {
    fetchDownloads();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Globe className="w-6 h-6 mr-2 text-green-400" />
          Website Scraper
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
              Enter Website URL
            </label>
            <div className="relative">
              <input
                type="url"
                id="url"
                value={url}
                onChange={handleUrlChange}
                placeholder="https://example.com"
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors pr-10 ${
                  isValidUrl 
                    ? 'border-gray-600 focus:ring-green-500 focus:border-green-500' 
                    : 'border-red-500 focus:ring-red-500 focus:border-red-500'
                }`}
                disabled={isScrapingActive}
              />
              {!isValidUrl && (
                <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
              )}
            </div>
            {!isValidUrl && (
              <p className="mt-2 text-sm text-red-400">Please enter a valid URL</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!url.trim() || !isValidUrl || isScrapingActive}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {isScrapingActive ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Scraping in Progress...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Start Scraping</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
          <h3 className="text-sm font-semibold text-gray-300 mb-2">Command Preview:</h3>
          <code className="text-xs text-green-400 break-all">
            wget --mirror --convert-links --adjust-extension --page-requisites --no-parent 
            --user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36" 
            {url || '[URL]'}
          </code>
        </div>
      </div>

      {/* Downloads Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold flex items-center">
            <Download className="w-5 h-5 mr-2 text-blue-400" />
            Available Downloads
          </h3>
          <button
            onClick={fetchDownloads}
            disabled={loadingDownloads}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            {loadingDownloads ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {downloads.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No downloads available yet</p>
        ) : (
          <div className="space-y-3">
            {downloads.map((download, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                <div>
                  <h4 className="font-medium text-white">{download.domain}</h4>
                  <p className="text-sm text-gray-400">
                    {download.sizeFormatted} • {new Date(download.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDownload(download.domain)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>ZIP</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlInput;