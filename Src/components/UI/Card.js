import React from 'react';

const Card = ({ children, className = '', title, ...props }) => {
  return (
    <div className={`card ${className}`} {...props}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;