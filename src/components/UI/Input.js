import React from 'react';

const Input = ({ label, className = '', ...props }) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        className={`input ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;