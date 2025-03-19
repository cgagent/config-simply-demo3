
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { ChatOption } from './types';

interface SelectableOptionsProps {
  options: ChatOption[];
  onSelectOption: (option: ChatOption) => void;
}

export const SelectableOptions: React.FC<SelectableOptionsProps> = ({
  options,
  onSelectOption
}) => {
  if (!options || options.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {options.map((option) => (
        <Button
          key={option.id}
          variant="outline"
          size="sm"
          className="text-xs rounded-full px-4 hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-1"
          onClick={() => onSelectOption(option)}
        >
          {option.label}
          <ArrowUp className="h-3 w-3" />
        </Button>
      ))}
    </div>
  );
};
