
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

interface SuggestedQueriesProps {
  queries: string[];
  onSelectQuery: (query: string) => void;
}

export const SuggestedQueries: React.FC<SuggestedQueriesProps> = ({ queries, onSelectQuery }) => {
  return (
    <div className="px-4 py-2 bg-muted/20">
      <p className="text-xs text-muted-foreground mb-2">Try asking about:</p>
      <div className="flex flex-wrap gap-2">
        {queries.map((query, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="text-xs flex items-center gap-1"
            onClick={() => onSelectQuery(query)}
          >
            {query}
            <ArrowUp className="h-3 w-3" />
          </Button>
        ))}
      </div>
    </div>
  );
};
