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
    primary: 'bg-orange-600 hover:bg-orange-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-100',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white'
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
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${className}`}
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
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="p-2"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    const isSelected = date.toDateString() === selectedDate.toDateString();
    const isToday = date.toDateString() === today.toDateString();

    days.push(
      <button
        key={day}
        onClick={() => onDateSelect(date)}
        className={`p-2 text-sm rounded hover:bg-orange-100 dark:hover:bg-gray-700 ${
          isSelected ? 'bg-orange-600 text-white' : ''
        } ${isToday && !isSelected ? 'bg-orange-100 dark:bg-gray-700' : ''}`}
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
        <button onClick={() => navigateMonth(-1)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">←</button>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{monthNames[currentMonth]} {currentYear}</h3>
        <button onClick={() => navigateMonth(1)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">→</button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-xs font-medium text-gray-500 text-center">{day}</div>
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
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
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

const ProgressBar = ({ value, max, color = 'orange' }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const colorClasses = {
    orange: 'bg-orange-600',
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
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

const Timer = ({ isActive, time, onStart, onStop, onReset }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center">
      <div className="text-4xl font-mono font-bold text-orange-600 mb-4">
        {formatTime(time)}
      </div>
      <div className="flex justify-center space-x-2">
        {!isActive ? (
          <Button onClick={onStart} variant="success">▶️ Start</Button>
        ) : (
          <Button onClick={onStop} variant="danger">⏸️ Stop</Button>
        )}
        <Button onClick={onReset} variant="secondary">🔄 Reset</Button>
      </div>
    </div>
  );
};

// Main Component
import Exercise from './Exercise';
export default Exercise;
