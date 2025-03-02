
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Search as SearchIcon, X } from 'lucide-react';

interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
}

const Search = React.forwardRef<HTMLInputElement, SearchProps>(
  ({ className, onSearch, ...props }, ref) => {
    const [value, setValue] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      if (onSearch) {
        onSearch(newValue);
      }
    };

    const handleClear = () => {
      setValue('');
      if (onSearch) {
        onSearch('');
      }
    };

    return (
      <div className={cn(
        "relative flex items-center w-full max-w-md",
        className
      )}>
        <SearchIcon className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          className="h-10 w-full rounded-full bg-white px-10 text-sm ring-1 ring-muted/20 transition-all focus-visible:ring-2 focus-visible:ring-primary/30"
          value={value}
          onChange={handleChange}
          placeholder="Search repositories..."
          ref={ref}
          {...props}
        />
        {value && (
          <button 
            onClick={handleClear}
            className="absolute right-3 h-4 w-4 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

Search.displayName = 'Search';

export default Search;
