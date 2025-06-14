import React from 'react';
import { Linkedin, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-4 h-4 text-red-500 mr-2" />
            <span className="text-gray-300">Created by</span>
            <a 
              href="https://linkedin.com/in/sainudeensafar" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 text-blue-400 hover:text-blue-300 transition-colors font-semibold"
            >
              Sainudeen Safar
            </a>
          </div>
          
          <div className="flex items-center justify-center space-x-4 mb-4">
            <a 
              href="https://linkedin.com/in/sainudeensafar" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
              <span>Connect on LinkedIn</span>
            </a>
          </div>
          
          <div className="text-sm text-gray-500 space-y-1">
            <p>© 2024 Scrapper The Master. All rights reserved.</p>
            <p>Professional web scraping tool for developers and researchers.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;