import React from 'react';

const Checkbox = ({ label, checked, onChange, className = '' }) => {
  return (
    <label className={`flex items-center space-x-3 cursor-pointer ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
    </label>
  );
};

export default Checkbox;