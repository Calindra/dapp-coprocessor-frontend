import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div style={{
      // position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        width: '100vw',
        height: '100vh',
        top: 0,
        left: 0,
      }} className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;