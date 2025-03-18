
import React, { useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Package, PackageX, Database } from 'lucide-react';
import { formatNumber } from '@/lib/formatters';
import { useNavigate } from 'react-router-dom';

interface StatisticsBarProps {
  ciCompletionPercentage: number;
  blockedPackages: number;
  totalPackages: number;
  dataConsumption: number;
  onChatQuery?: (query: string) => void;
}

const StatisticsBar: React.FC<StatisticsBarProps> = ({
  ciCompletionPercentage,
  blockedPackages,
  totalPackages,
  dataConsumption,
  onChatQuery
}) => {
  const navigate = useNavigate();

  const handleCICompletionClick = useCallback(() => {
    // Navigate to CI configuration page instead of repositories
    navigate('/ci-configuration');
  }, [navigate]);

  const handleBlockedPackagesClick = useCallback(() => {
    if (onChatQuery) {
      onChatQuery("Show me detailed information about blocked packages in the last 30 days");
    }
  }, [onChatQuery]);

  const handleTotalPackagesClick = useCallback(() => {
    if (onChatQuery) {
      onChatQuery("What are the most popular packages in my organization?");
    }
  }, [onChatQuery]);

  const handleDataConsumptionClick = useCallback(() => {
    if (onChatQuery) {
      onChatQuery("Provide a breakdown of data consumption over the last 30 days");
    }
  }, [onChatQuery]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card 
        className="p-4 flex flex-col cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-primary" 
        onClick={handleCICompletionClick}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">CI Completion</h3>
          <CheckCircle className="h-5 w-5 text-primary" />
        </div>
        <p className="text-2xl font-bold mb-2">{ciCompletionPercentage}%</p>
        <Progress value={ciCompletionPercentage} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">Current CI Status</p>
      </Card>
      
      <Card 
        className="p-4 flex flex-col cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-destructive"
        onClick={handleBlockedPackagesClick}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">Blocked Packages</h3>
          <PackageX className="h-5 w-5 text-destructive" />
        </div>
        <p className="text-2xl font-bold">{blockedPackages}</p>
        <p className="text-xs text-muted-foreground mt-2">Last 30 days</p>
      </Card>
      
      <Card 
        className="p-4 flex flex-col cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-blue-500"
        onClick={handleTotalPackagesClick}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">Total Packages</h3>
          <Package className="h-5 w-5 text-blue-500" />
        </div>
        <p className="text-2xl font-bold">{formatNumber(totalPackages)}</p>
        <p className="text-xs text-muted-foreground mt-2">Last 30 days</p>
      </Card>
      
      <Card 
        className="p-4 flex flex-col cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-amber-500"
        onClick={handleDataConsumptionClick}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">Data Consumption</h3>
          <Database className="h-5 w-5 text-amber-500" />
        </div>
        <p className="text-2xl font-bold">{formatNumber(dataConsumption)} MB</p>
        <p className="text-xs text-muted-foreground mt-2">Last 30 days</p>
      </Card>
    </div>
  );
};

export default StatisticsBar;
