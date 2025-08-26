import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

interface FloatingActionButtonProps {
  onClick: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        fixed bottom-8 right-8 z-50
        w-16 h-16
        bg-gradient-to-br from-blue-500 to-purple-600
        hover:from-blue-600 hover:to-purple-700
        active:scale-95
        rounded-full
        shadow-2xl shadow-blue-500/25
        backdrop-blur-lg backdrop-saturate-150
        border border-white/20
        flex items-center justify-center
        transition-all duration-300 ease-out
        hover:scale-110 hover:shadow-3xl hover:shadow-blue-500/30
        focus:outline-none focus:ring-4 focus:ring-blue-500/20
        group
      "
      aria-label="Adicionar nova transação"
    >
      {/* Glass effect overlay */}
      <div className="
        absolute inset-0 rounded-full
        bg-gradient-to-br from-white/20 to-transparent
        opacity-60 group-hover:opacity-80
        transition-opacity duration-300
      " />
      
      {/* Icon */}
      <PlusIcon 
        className="
          w-8 h-8 text-white
          drop-shadow-lg
          group-hover:rotate-90
          transition-transform duration-300 ease-out
        " 
      />
      
      {/* Ripple effect on hover */}
      <div className="
        absolute inset-0 rounded-full
        bg-white/10
        scale-0 group-hover:scale-100
        opacity-0 group-hover:opacity-100
        transition-all duration-500 ease-out
      " />
    </button>
  );
};

export default FloatingActionButton;
