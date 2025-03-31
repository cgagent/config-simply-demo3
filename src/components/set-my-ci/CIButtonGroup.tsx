
import React from 'react';
import { Button } from '@/components/ui/button';
import { Github, Code, Package, Check, ArrowRight } from 'lucide-react';

interface ButtonOption {
  id: string;
  label: string;
  description?: string;
}

interface CIButtonGroupProps {
  options: ButtonOption[];
  onSelect: (id: string) => void;
  multiSelect?: boolean;
  selectedOptions?: string[];
  showContinueButton?: boolean;
  onContinue?: () => void;
}

export const CIButtonGroup: React.FC<CIButtonGroupProps> = ({ 
  options, 
  onSelect, 
  multiSelect = false, 
  selectedOptions = [],
  showContinueButton = false,
  onContinue
}) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'github':
        return <Github className="h-5 w-5" />;
      case 'other':
        return <Code className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-3 ml-12">
      <div className={`grid ${options.length > 3 ? 'grid-cols-2 gap-2' : 'grid-cols-1 gap-2'}`}>
        {options.map((option) => (
          <Button
            key={option.id}
            variant={selectedOptions?.includes(option.id) ? "default" : "outline"}
            className="justify-start py-3 px-4 h-auto text-left"
            onClick={() => onSelect(option.id)}
          >
            <div className="flex items-center space-x-2">
              {getIcon(option.id)}
              <div>
                <div className="font-medium">{option.label}</div>
                {option.description && <div className="text-xs opacity-80">{option.description}</div>}
              </div>
              {selectedOptions?.includes(option.id) && (
                <Check className="h-4 w-4 ml-2" />
              )}
            </div>
          </Button>
        ))}
      </div>
      
      {showContinueButton && (
        <div className="flex justify-end mt-4">
          <Button 
            onClick={onContinue}
            className="px-4"
          >
            Continue <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
