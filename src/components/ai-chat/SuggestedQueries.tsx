
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { SUGGESTED_QUERIES } from './constants';

interface SuggestedQueriesProps {
  queries: { label: string; query: string }[];
  onSelectQuery: (query: string) => void;
}

export const SuggestedQueries: React.FC<SuggestedQueriesProps> = ({ queries, onSelectQuery }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {queries.map((queryItem, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="text-xs rounded-full px-4 hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-1"
          onClick={() => onSelectQuery(queryItem.query)}
        >
          {queryItem.label}
          <ArrowUp className="h-3 w-3" />
        </Button>
      ))}
    </div>
  );
};
