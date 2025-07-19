import React, { useState } from 'react';

// UI Components
const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, size = 'md', variant = 'primary', className = '' }) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-100',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };
  
  return (
    <button
      onClick={onClick}
      className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-md font-medium transition-colors ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ value, onChange, placeholder, type = 'text', className = '' }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${className}`}
  />
);

const Calendar = ({ selectedDate, onDateSelect }) => {
  const today = new Date();
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const days = [];
  
  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="p-2"></div>);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    const isSelected = date.toDateString() === selectedDate.toDateString();
    const isToday = date.toDateString() === today.toDateString();
    
    days.push(
      <button
        key={day}
        onClick={() => onDateSelect(date)}
        className={`p-2 text-sm rounded hover:bg-blue-100 dark:hover:bg-gray-700 ${
          isSelected ? 'bg-blue-600 text-white' : ''
        } ${isToday && !isSelected ? 'bg-blue-100 dark:bg-gray-700' : ''}`}
      >
        {day}
      </button>
    );
  }
  
  const navigateMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(currentMonth + direction);
    onDateSelect(newDate);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          ←
        </button>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button
          onClick={() => navigateMonth(1)}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-xs font-medium text-gray-500 text-center">
            {day}
          </div>
        ))}
        {days}
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Study = () => {
  // Using React state instead of localStorage
  const [data, setData] = useState({});
  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Arrays', category: 'DSA' },
    { id: 2, name: 'React', category: 'Web Dev' },
    { id: 3, name: 'SQL', category: 'Database' }
  ]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', category: 'DSA' });
  
  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const dayData = data[selectedDateStr] || {
    studiedSubjects: {},
    hoursStudied: {},
    notes: '',
    links: []
  };
  
  const updateDayData = (updates) => {
    setData(prev => ({
      ...prev,
      [selectedDateStr]: { ...dayData, ...updates }
    }));
  };
  
  const addSubject = () => {
    if (newSubject.name.trim()) {
      const subject = {
        id: Date.now(),
        name: newSubject.name.trim(),
        category: newSubject.category
      };
      setSubjects(prev => [...prev, subject]);
      setNewSubject({ name: '', category: 'DSA' });
      setShowAddModal(false);
    }
  };
  
  const toggleSubject = (id) => {
    updateDayData({
      studiedSubjects: {
        ...dayData.studiedSubjects,
        [id]: !dayData.studiedSubjects[id]
      }
    });
  };
  
  const updateHours = (id, hours) => {
    const numHours = parseFloat(hours) || 0;
    updateDayData({
      hoursStudied: {
        ...dayData.hoursStudied,
        [id]: Math.max(0, Math.min(24, numHours))
      }
    });
  };
  
  const addLink = () => {
    const link = prompt('Enter link (Notion, Google Drive, GitHub, etc.):');
    if (link && link.trim()) {
      try {
        const url = new URL(link.trim());
        updateDayData({
          links: [...dayData.links, {
            id: Date.now(),
            url: link.trim(),
            title: url.hostname
          }]
        });
      } catch {
        updateDayData({
          links: [...dayData.links, {
            id: Date.now(),
            url: link.trim(),
            title: 'Link'
          }]
        });
      }
    }
  };
  
  const removeLink = (id) => {
    updateDayData({
      links: dayData.links.filter(link => link.id !== id)
    });
  };
  
  const categories = ['DSA', 'Web Dev', 'Database', 'System Design', 'Projects'];
  
  const groupedSubjects = subjects.reduce((acc, subject) => {
    if (!acc[subject.category]) acc[subject.category] = [];
    acc[subject.category].push(subject);
    return acc;
  }, {});
  
  const totalHours = Object.values(dayData.hoursStudied).reduce((sum, hours) => sum + (hours || 0), 0);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Study Tracker
          </h2>
          <div className="flex space-x-2">
            <Button onClick={() => setShowAddModal(true)} size="sm">
              Add Subject
            </Button>
            <Button onClick={addLink} size="sm" variant="secondary">
              Add Link
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
            
            {/* Daily Summary */}
            <Card className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Daily Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Hours:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {totalHours.toFixed(1)}h
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subjects Studied:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {Object.values(dayData.studiedSubjects).filter(Boolean).length}
                  </span>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Study Progress - {selectedDate.toLocaleDateString()}
              </h3>
              
              {/* Subjects by Category */}
              {categories.map(category => {
                const categorySubjects = groupedSubjects[category] || [];
                if (categorySubjects.length === 0) return null;
                
                return (
                  <div key={category} className="mb-6">
                    <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3 border-b border-gray-200 dark:border-gray-600 pb-1">
                      {category}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {categorySubjects.map(subject => (
                        <div
                          key={subject.id}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            dayData.studiedSubjects[subject.id]
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={dayData.studiedSubjects[subject.id] || false}
                                onChange={() => toggleSubject(subject.id)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <span className="text-gray-900 dark:text-gray-100 font-medium">
                                {subject.name}
                              </span>
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              value={dayData.hoursStudied[subject.id] || ''}
                              onChange={(e) => updateHours(subject.id, e.target.value)}
                              placeholder="Hours"
                              className="text-sm"
                            />
                            <span className="text-xs text-gray-500 dark:text-gray-400">hours</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </Card>
            
            {/* Notes Section */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Notes
              </h3>
              <textarea
                value={dayData.notes}
                onChange={(e) => updateDayData({ notes: e.target.value })}
                placeholder="Add your study notes, reflections, or important points..."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 resize-none"
              />
            </Card>
            
            {/* Links Section */}
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Study Links
                </h3>
                <Button onClick={addLink} size="sm" variant="secondary">
                  Add Link
                </Button>
              </div>
              {dayData.links.length > 0 ? (
                <div className="space-y-2">
                  {dayData.links.map(link => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                    >
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline flex-1 truncate"
                      >
                        {link.title}
                      </a>
                      <Button
                        onClick={() => removeLink(link.id)}
                        size="sm"
                        variant="danger"
                        className="ml-2"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No links added yet. Add study resources, notes, or project links!
                </p>
              )}
            </Card>
          </div>
        </div>
        
        {/* Add Subject Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Subject"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subject Name
              </label>
              <Input
                value={newSubject.name}
                onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                placeholder="Enter subject name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={newSubject.category}
                onChange={(e) => setNewSubject({ ...newSubject, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-2">
              <Button onClick={addSubject} className="flex-1">
                Add Subject
              </Button>
              <Button
                onClick={() => setShowAddModal(false)}
                variant="secondary"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Study;