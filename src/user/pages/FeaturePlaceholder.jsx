import React from 'react';

const FeaturePlaceholder = ({ title = 'Feature', message }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600">
        {message || 'This feature is not available on the user view yet or you do not have access.'}
      </p>
    </div>
  );
};

export default FeaturePlaceholder;
