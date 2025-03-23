import React, { useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Package, PackageX, Database, MonitorDot } from 'lucide-react';
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
    console.log('Navigating to CI page');
    navigate('/repositories', { replace: true });
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
    animate: { opacity: 1, y: 0 },
    hover: { y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 100, 0.1)' }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-4 text-blue-100 space-glow">
        Platform Insights
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CI Completion Card */}
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          transition={{ duration: 0.3 }}
          className="cursor-pointer"
          onClick={handleCICompletionClick}
        >
          <Card className="space-card p-6 h-full flex flex-col justify-between backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-blue-100/80">CI Completion</h3>
              <CheckCircle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xl font-semibold text-white space-glow">{ciCompletionPercentage}%</span>
                <span className="text-xs text-blue-200/70">of total</span>
              </div>
              <Progress 
                value={ciCompletionPercentage} 
                className="h-1.5 bg-blue-950/60" 
                indicatorClassName="bg-gradient-to-r from-blue-600 to-blue-400"
              />
            </div>
            <p className="text-xs text-blue-200/60 mt-2">
              Click to view CI configuration details
            </p>
          </Card>
        </motion.div>

        {/* Blocked Packages Card */}
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          transition={{ duration: 0.3, delay: 0.1 }}
          className="cursor-pointer"
          onClick={handleBlockedPackagesClick}
        >
          <Card className="space-card p-6 h-full flex flex-col justify-between backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-blue-100/80">Prevented Packages</h3>
              <PackageX className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <span className="text-xl font-semibold text-white space-glow">{blockedPackages} / 1010</span>
              <p className="text-xs text-blue-200/60 mt-2">
                Packages blocked due to security vulnerabilities
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Total Packages Card */}
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          transition={{ duration: 0.3, delay: 0.2 }}
          className="cursor-pointer"
          onClick={handleTotalPackagesClick}
        >
          <Card className="space-card p-6 h-full flex flex-col justify-between backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-blue-100/80">My Packages</h3>
              <Package className="h-5 w-5 text-blue-400" />
            </div>
            <div>
            <span className="text-sm font-semibold text-white space-glow"> <img className="w-20px" src="/lovable-uploads/docker.png" className="w-4 h-4 inline-block mr-2"></img>  {formatNumber(20)}</span>
            <br></br>
            <span className="text-sm font-semibold text-white space-glow"> <img className="w-20px" src="/lovable-uploads/maven.png" className="w-4 h-4 inline-block mr-2"></img>  {formatNumber(14)}</span>
            <br></br>
            <span className="text-sm font-semibold text-white space-glow"> <img src="/lovable-uploads/npm.png" className="w-4 h-4 inline-block mr-2"></img>  {formatNumber(120)}</span>
              <p className="text-xs text-blue-200/60 mt-2">
                Total packages in your repositories
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Data Consumption Card */}
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          transition={{ duration: 0.3, delay: 0.3 }}
          className="cursor-pointer"
          onClick={handleDataConsumptionClick}
        >
          <Card className="space-card p-6 h-full flex flex-col justify-between backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-blue-100/80">Developers</h3>
              <MonitorDot className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <span className="text-xl font-semibold text-white space-glow">21 / 30</span>
              <p className="text-xs text-blue-200/60 mt-2">
                Developers connected to JFrog
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default StatisticsBar;
