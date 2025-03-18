import React, { useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Package, PackageX, Database } from 'lucide-react';
import { formatNumber } from '@/lib/formatters';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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
    console.log('Navigating to CI Configuration page');
    navigate('/ci-configuration', { replace: true });
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

  const cardVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <motion.div
        initial="initial"
        animate="animate"
        whileHover="hover"
        variants={cardVariants}
        transition={{ duration: 0.2 }}
        custom={0}
      >
        <Card 
          className="p-4 flex flex-col cursor-pointer transition-all duration-300 border-l-4 border-l-primary rounded-xl overflow-hidden backdrop-blur-sm" 
          onClick={handleCICompletionClick}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">CI Completion</h3>
            <CheckCircle className="h-5 w-5 text-primary" />
          </div>
          <p className="text-2xl font-bold mb-2">{ciCompletionPercentage}%</p>
          <Progress value={ciCompletionPercentage} className="h-2" indicatorClassName="bg-gradient-to-r from-primary/80 to-primary" />
          <p className="text-xs text-muted-foreground mt-2">Current CI Status</p>
        </Card>
      </motion.div>
      
      <motion.div
        initial="initial"
        animate="animate"
        whileHover="hover"
        variants={cardVariants}
        transition={{ duration: 0.2, delay: 0.1 }}
        custom={1}
      >
        <Card 
          className="p-4 flex flex-col cursor-pointer transition-all duration-300 border-l-4 border-l-destructive rounded-xl overflow-hidden backdrop-blur-sm"
          onClick={handleBlockedPackagesClick}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Blocked Packages</h3>
            <PackageX className="h-5 w-5 text-destructive" />
          </div>
          <p className="text-2xl font-bold">{blockedPackages}</p>
          <p className="text-xs text-muted-foreground mt-2">Last 30 days</p>
        </Card>
      </motion.div>
      
      <motion.div
        initial="initial"
        animate="animate"
        whileHover="hover"
        variants={cardVariants}
        transition={{ duration: 0.2, delay: 0.2 }}
        custom={2}
      >
        <Card 
          className="p-4 flex flex-col cursor-pointer transition-all duration-300 border-l-4 border-l-blue-500 rounded-xl overflow-hidden backdrop-blur-sm"
          onClick={handleTotalPackagesClick}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Total Packages</h3>
            <Package className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">{formatNumber(totalPackages)}</p>
          <p className="text-xs text-muted-foreground mt-2">Last 30 days</p>
        </Card>
      </motion.div>
      
      <motion.div
        initial="initial"
        animate="animate"
        whileHover="hover"
        variants={cardVariants}
        transition={{ duration: 0.2, delay: 0.3 }}
        custom={3}
      >
        <Card 
          className="p-4 flex flex-col cursor-pointer transition-all duration-300 border-l-4 border-l-amber-500 rounded-xl overflow-hidden backdrop-blur-sm"
          onClick={handleDataConsumptionClick}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Data Consumption</h3>
            <Database className="h-5 w-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold">{formatNumber(dataConsumption)} MB</p>
          <p className="text-xs text-muted-foreground mt-2">Last 30 days</p>
        </Card>
      </motion.div>
    </div>
  );
};

export default StatisticsBar;
