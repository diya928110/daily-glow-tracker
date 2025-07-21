import React, { useState } from 'react';
import { useDarkMode } from './hooks/useDarkMode.js';
import Navbar from './components/Layout/Navbar.js';
import Sidebar from './components/Layout/Sidebar.js';
import Haircare from './components/pages/Haircare.js';
import Supplements from './components/pages/Supplements.js';
import Study from './components/pages/Study.js';
import Bodycare from './components/pages/Bodycare.js';
import Exercise from './components/pages/Exercise.js';

const pages = {
  skincare: Skincare,
  haircare: Haircare,
  supplements: Supplements,
  study: Study,
  bodycare: Bodycare,
  exercise: Exercise,
};

function App() {
  const [currentPage, setCurrentPage] = useState('skincare');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();

  const CurrentPageComponent = pages[currentPage];

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Navbar 
          onMenuClick={() => setSidebarOpen(true)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
        
        <div className="flex">
          <Sidebar 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          
          <main className="flex-1 p-4 md:p-6 lg:p-8 md:ml-64">
            <div className="max-w-6xl mx-auto">
              <CurrentPageComponent />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
