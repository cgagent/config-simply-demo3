
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Package, PackageX, Database, ArrowRight } from 'lucide-react';
import { formatNumber } from '@/lib/formatters';
import { useNavigate } from 'react-router-dom';

interface StatisticsBarProps {
  ciCompletionPercentage: number;
  blockedPackages: number;
  totalPackages: number;
  dataConsumption: number;
}

const StatisticsBar: React.FC<StatisticsBarProps> = ({
  ciCompletionPercentage,
  blockedPackages,
  totalPackages,
  dataConsumption
}) => {
  const navigate = useNavigate();

  const handleCICompletionClick = () => {
    navigate('/repositories');
  };

  const handlePackageClick = () => {
    // Navigate to the packages page when implemented
    navigate('/home');
  };

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
        <div className="flex items-center text-primary text-xs mt-2 font-medium">
          <span>View details</span>
          <ArrowRight className="h-3 w-3 ml-1" />
        </div>
      </Card>
      
      <Card 
        className="p-4 flex flex-col cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-destructive"
        onClick={handlePackageClick}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">Blocked Packages</h3>
          <PackageX className="h-5 w-5 text-destructive" />
        </div>
        <p className="text-2xl font-bold">{blockedPackages}</p>
        <p className="text-xs text-muted-foreground mt-2">Last 30 days</p>
        <div className="flex items-center text-destructive text-xs mt-2 font-medium">
          <span>View details</span>
          <ArrowRight className="h-3 w-3 ml-1" />
        </div>
      </Card>
      
      <Card 
        className="p-4 flex flex-col cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-blue-500"
        onClick={handlePackageClick}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">Total Packages</h3>
          <Package className="h-5 w-5 text-blue-500" />
        </div>
        <p className="text-2xl font-bold">{formatNumber(totalPackages)}</p>
        <p className="text-xs text-muted-foreground mt-2">Last 30 days</p>
        <div className="flex items-center text-blue-500 text-xs mt-2 font-medium">
          <span>View details</span>
          <ArrowRight className="h-3 w-3 ml-1" />
        </div>
      </Card>
      
      <Card 
        className="p-4 flex flex-col cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-amber-500"
        onClick={handlePackageClick}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">Data Consumption</h3>
          <Database className="h-5 w-5 text-amber-500" />
        </div>
        <p className="text-2xl font-bold">{formatNumber(dataConsumption)} MB</p>
        <p className="text-xs text-muted-foreground mt-2">Last 30 days</p>
        <div className="flex items-center text-amber-500 text-xs mt-2 font-medium">
          <span>View details</span>
          <ArrowRight className="h-3 w-3 ml-1" />
        </div>
      </Card>
    </div>
  );
};

export default StatisticsBar;
