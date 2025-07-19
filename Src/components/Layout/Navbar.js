import React from 'react';
import { Menu, Moon, Sun, Download } from 'lucide-react';
import { exportToPDF, exportToJSON } from '../../utils/exportData';

const Navbar = ({ onMenuClick, darkMode, setDarkMode }) => {
  const handleExport = (type) => {
    const allData = {};
    
    // Collect all data from localStorage
    const keys = Object.keys(localStorage).filter(key => key.startsWith('dailyGlow'));
    keys.forEach(key => {
      try {
        allData[key.replace('dailyGlow-', '')] = JSON.parse(localStorage.getItem(key));
      } catch (e) {
        allData[key.replace('dailyGlow-', '')] = localStorage.getItem(key);
      }
    });
    
    if (type === 'pdf') {
      exportToPDF(allData);
    } else {
      exportToJSON(allData);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex-shrink-0 ml-2 md:ml-0">
              <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                Daily Glow
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative group">
              <button className="btn-secondary flex items-center space-x-1">
                <Download size={18} />
                <span className="hidden sm:inline">Export</span>
              </button>
              
              <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button
                  onClick={() => handleExport('json')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                >
                  JSON
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
                >
                  PDF
                </button>
              </div>
            </div>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="btn-secondary p-2"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;