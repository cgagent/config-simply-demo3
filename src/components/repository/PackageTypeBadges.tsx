
import React from 'react';
import { Package, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface PackageTypeBadgesProps {
  packageTypes: string[];
  missingPackageTypes: string[];
  onRemoveMissingPackage?: (type: string) => void;
}

const PackageTypeBadges: React.FC<PackageTypeBadgesProps> = ({ 
  packageTypes,
  missingPackageTypes,
  onRemoveMissingPackage
}) => {
  return (
    <div className="flex gap-1 flex-wrap">
      {/* Connected package types */}
      {packageTypes.map((type, index) => (
        <Badge 
          key={index}
          variant="outline"
          className="text-xs bg-secondary text-secondary-foreground"
        >
          <Package className="h-3 w-3 mr-1" />
          {type}
        </Badge>
      ))}
      
      {/* Missing package types */}
      {missingPackageTypes.map((type, index) => (
        <Tooltip key={`missing-${index}`}>
          <TooltipTrigger asChild>
            <Badge 
              variant="outline"
              className="text-xs border-dashed bg-red-50 text-red-500 border-red-200 group relative"
            >
              <Package className="h-3 w-3 mr-1" />
              {type}
              {onRemoveMissingPackage && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveMissingPackage(type);
                  }}
                  className="opacity-0 group-hover:opacity-100 absolute -right-1 -top-1 bg-red-100 rounded-full p-0.5 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">This package type was detected but not configured</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};

export default PackageTypeBadges;
