import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  label?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  onClick, 
  icon: Icon = Plus,
  label = "Adicionar transação"
}) => {
  return (
    <button
      onClick={onClick}
      className="fab group"
      aria-label={label}
      type="button"
    >
      <Icon className="w-6 h-6 transition-transform duration-200 group-active:scale-110" />
      
      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-full opacity-0 group-active:opacity-20 group-active:animate-ping bg-white"></div>
    </button>
  );
};

export default FloatingActionButton;
