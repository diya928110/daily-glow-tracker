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
    primary: 'bg-pink-600 hover:bg-pink-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-100',
    success: 'bg-green-600 hover:bg-green-700 text-white',
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
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${className}`}
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
        className={`p-2 text-sm rounded hover:bg-pink-100 dark:hover:bg-gray-700 ${
          isSelected ? 'bg-pink-600 text-white' : ''
        } ${isToday && !isSelected ? 'bg-pink-100 dark:bg-gray-700' : ''}`}
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

const ProgressBar = ({ value, max, color = 'pink' }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const colorClasses = {
    pink: 'bg-pink-600',
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600'
  };
  
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
      <div 
        className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color]}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

const BodyCare = () => {
  // Using React state instead of localStorage
  const [data, setData] = useState({});
  const [products, setProducts] = useState([
    { id: 1, name: 'Cleanser', category: 'Skincare', routine: 'Morning' },
    { id: 2, name: 'Moisturizer', category: 'Skincare', routine: 'Both' },
    { id: 3, name: 'Sunscreen', category: 'Skincare', routine: 'Morning' },
    { id: 4, name: 'Body Lotion', category: 'Body Care', routine: 'Evening' },
    { id: 5, name: 'Push-ups', category: 'Exercise', routine: 'Morning' },
    { id: 6, name: 'Yoga', category: 'Exercise', routine: 'Evening' }
  ]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMetricsModal, setShowMetricsModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Skincare', routine: 'Morning' });
  
  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const dayData = data[selectedDateStr] || {
    completedItems: {},
    waterIntake: 0,
    sleepHours: 0,
    weight: 0,
    mood: '',
    symptoms: [],
    notes: '',
    workoutMinutes: 0,
    steps: 0
  };
  
  const updateDayData = (updates) => {
    setData(prev => ({
      ...prev,
      [selectedDateStr]: { ...dayData, ...updates }
    }));
  };
  
  const addProduct = () => {
    if (newProduct.name.trim()) {
      const product = {
        id: Date.now(),
        name: newProduct.name.trim(),
        category: newProduct.category,
        routine: newProduct.routine
      };
      setProducts(prev => [...prev, product]);
      setNewProduct({ name: '', category: 'Skincare', routine: 'Morning' });
      setShowAddModal(false);
    }
  };
  
  const toggleItem = (id) => {
    updateDayData({
      completedItems: {
        ...dayData.completedItems,
        [id]: !dayData.completedItems[id]
      }
    });
  };
  
  const updateWaterIntake = (glasses) => {
    updateDayData({ waterIntake: Math.max(0, glasses) });
  };
  
  const addSymptom = () => {
    const symptom = prompt('Add symptom or note:');
    if (symptom && symptom.trim()) {
      updateDayData({
        symptoms: [...dayData.symptoms, {
          id: Date.now(),
          text: symptom.trim(),
          time: new Date().toLocaleTimeString()
        }]
      });
    }
  };
  
  const removeSymptom = (id) => {
    updateDayData({
      symptoms: dayData.symptoms.filter(symptom => symptom.id !== id)
    });
  };
  
  const categories = ['Skincare', 'Hair Care', 'Body Care', 'Exercise', 'Wellness'];
  const routines = ['Morning', 'Evening', 'Both'];
  const moods = ['😄 Great', '😊 Good', '😐 Okay', '😔 Not Great', '😰 Stressed'];
  
  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {});
  
  const completedCount = Object.values(dayData.completedItems).filter(Boolean).length;
  const totalItems = products.length;
  const waterGoal = 8; // glasses
  const sleepGoal = 8; // hours
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            BodyCare Tracker
          </h2>
          <div className="flex space-x-2">
            <Button onClick={() => setShowAddModal(true)} size="sm">
              Add Item
            </Button>
            <Button onClick={() => setShowMetricsModal(true)} size="sm" variant="secondary">
              Health Metrics
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar & Summary */}
          <div className="lg:col-span-1 space-y-4">
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
            
            {/* Daily Summary */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Daily Summary
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Routine Progress</span>
                    <span className="text-sm font-medium">{completedCount}/{totalItems}</span>
                  </div>
                  <ProgressBar value={completedCount} max={totalItems} color="pink" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Water Intake</span>
                    <span className="text-sm font-medium">{dayData.waterIntake}/{waterGoal} glasses</span>
                  </div>
                  <ProgressBar value={dayData.waterIntake} max={waterGoal} color="blue" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Sleep</span>
                    <span className="text-sm font-medium">{dayData.sleepHours}/{sleepGoal} hours</span>
                  </div>
                  <ProgressBar value={dayData.sleepHours} max={sleepGoal} color="purple" />
                </div>
                
                {dayData.mood && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Mood</span>
                    <span className="text-sm font-medium">{dayData.mood}</span>
                  </div>
                )}
              </div>
            </Card>
            
            {/* Quick Actions */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => updateWaterIntake(dayData.waterIntake + 1)}
                    size="sm"
                    variant="secondary"
                    className="flex-1"
                  >
                    💧 +1 Water
                  </Button>
                  <Button
                    onClick={() => updateWaterIntake(dayData.waterIntake - 1)}
                    size="sm"
                    variant="secondary"
                  >
                    -1
                  </Button>
                </div>
                <Button onClick={addSymptom} size="sm" variant="secondary" className="w-full">
                  📝 Add Note
                </Button>
              </div>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Daily Routine - {selectedDate.toLocaleDateString()}
              </h3>
              
              {/* Products by Category */}
              {categories.map(category => {
                const categoryProducts = groupedProducts[category] || [];
                if (categoryProducts.length === 0) return null;
                
                return (
                  <div key={category} className="mb-6">
                    <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3 border-b border-gray-200 dark:border-gray-600 pb-1 flex items-center">
                      <span className="mr-2">
                        {category === 'Skincare' && '✨'}
                        {category === 'Hair Care' && '💇‍♀️'}
                        {category === 'Body Care' && '🧴'}
                        {category === 'Exercise' && '💪'}
                        {category === 'Wellness' && '🧘‍♀️'}
                      </span>
                      {category}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {categoryProducts.map(product => (
                        <div
                          key={product.id}
                          className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                            dayData.completedItems[product.id]
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                              : 'border-gray-200 dark:border-gray-600 hover:border-pink-300 dark:hover:border-pink-500'
                          }`}
                          onClick={() => toggleItem(product.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={dayData.completedItems[product.id] || false}
                                onChange={() => toggleItem(product.id)}
                                className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                              />
                              <span className="text-gray-900 dark:text-gray-100 font-medium">
                                {product.name}
                              </span>
                            </div>
                            <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                              {product.routine}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </Card>
            
            {/* Health Metrics */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Health Metrics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">{dayData.workoutMinutes}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Minutes Workout</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{dayData.steps}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Steps</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{dayData.weight || '-'}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Weight (kg)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{dayData.sleepHours}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Sleep Hours</div>
                </div>
              </div>
            </Card>
            
            {/* Symptoms & Notes */}
            {dayData.symptoms.length > 0 && (
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Notes & Symptoms
                </h3>
                <div className="space-y-2">
                  {dayData.symptoms.map(symptom => (
                    <div
                      key={symptom.id}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                    >
                      <div>
                        <span className="text-gray-900 dark:text-gray-100">{symptom.text}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          {symptom.time}
                        </span>
                      </div>
                      <Button
                        onClick={() => removeSymptom(symptom.id)}
                        size="sm"
                        variant="danger"
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
            
            {/* Daily Notes */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Daily Notes
              </h3>
              <textarea
                value={dayData.notes}
                onChange={(e) => updateDayData({ notes: e.target.value })}
                placeholder="How are you feeling today? Any observations about your routine, skin, energy levels..."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 resize-none"
              />
            </Card>
          </div>
        </div>
        
        {/* Add Product Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Item"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Item Name
              </label>
              <Input
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Enter item name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Routine
              </label>
              <select
                value={newProduct.routine}
                onChange={(e) => setNewProduct({ ...newProduct, routine: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
                {routines.map(routine => (
                  <option key={routine} value={routine}>
                    {routine}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-2">
              <Button onClick={addProduct} className="flex-1">
                Add Item
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
        
        {/* Health Metrics Modal */}
        <Modal
          isOpen={showMetricsModal}
          onClose={() => setShowMetricsModal(false)}
          title="Update Health Metrics"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Workout Minutes
              </label>
              <Input
                type="number"
                value={dayData.workoutMinutes}
                onChange={(e) => updateDayData({ workoutMinutes: parseInt(e.target.value) || 0 })}
                placeholder="Minutes exercised"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Steps
              </label>
              <Input
                type="number"
                value={dayData.steps}
                onChange={(e) => updateDayData({ steps: parseInt(e.target.value) || 0 })}
                placeholder="Steps taken"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Weight (kg)
              </label>
              <Input
                type="number"
                step="0.1"
                value={dayData.weight}
                onChange={(e) => updateDayData({ weight: parseFloat(e.target.value) || 0 })}
                placeholder="Current weight"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sleep Hours
              </label>
              <Input
                type="number"
                step="0.5"
                value={dayData.sleepHours}
                onChange={(e) => updateDayData({ sleepHours: parseFloat(e.target.value) || 0 })}
                placeholder="Hours slept"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mood
              </label>
              <select
                value={dayData.mood}
                onChange={(e) => updateDayData({ mood: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
                <option value="">Select mood</option>
                {moods.map(mood => (
                  <option key={mood} value={mood}>
                    {mood}
                  </option>
                ))}
              </select>
            </div>
            <Button
              onClick={() => setShowMetricsModal(false)}
              className="w-full"
            >
              Update Metrics
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default BodyCare;
