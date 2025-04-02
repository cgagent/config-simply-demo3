import React, { useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Package, PackageX, Database, ShieldBan, MonitorDot, Biohazard, Skull } from 'lucide-react';
import { formatNumber } from '@/lib/formatters';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePackageLocalStorage } from '@/hooks/usePackageLocalStorage';
import { useRepositories } from '@/contexts/RepositoryContext';

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
  const { packageStats } = usePackageLocalStorage();
  const { repositories } = useRepositories();

  // Calculate repository statistics
  const totalRepos = repositories.length;
  const configuredRepos = repositories.filter(repo => repo.isConfigured).length;

  const handleCICompletionClick = useCallback(() => {
    console.log('Navigating to CI page');
    navigate('/repositories', { replace: true });
  }, [navigate]);

  const handleBlockedPackagesClick = useCallback(() => {
    if (onChatQuery) {
      onChatQuery("which packages were blocked in the last two weeks?");
    }
  }, [onChatQuery]);

  const handleTotalPackagesClick = useCallback(() => {
    if (onChatQuery) {
      onChatQuery("show me the packages that are at risk in my organization");
    }
  }, [onChatQuery]);

  const handleConnectedDevelopersClick = useCallback(() => {
    if (onChatQuery) {
      onChatQuery("Show me the status of connected developers in my organization");
    }
  }, [onChatQuery]);

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.02 }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xl font-semibold text-white space-glow">{configuredRepos} / {totalRepos}</span>
              <span className="text-xs text-blue-200/70">repositories</span>
            </div>
            <Progress 
              value={ciCompletionPercentage} 
              className="h-1.5 bg-blue-950/60" 
              indicatorClassName="bg-gradient-to-r from-blue-600 to-blue-400"
            />
            <p className="text-xs text-blue-200/60 mt-2">
              Click to view CI configuration details
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Blocked Malicious Packages Card */}
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
            <h3 className="text-sm font-medium text-blue-100/80">Blocked Malicious Packages</h3>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M3.6 15.3H5.175V13.05H6.525V15.3H8.775V13.05H10.125V15.3H11.7V11.9925C12.255 11.8275 12.7537 11.58 13.1962 11.25C13.6388 10.92 14.0175 10.5262 14.3325 10.0688C14.6475 9.61125 14.8875 9.10125 15.0525 8.53875C15.2175 7.97625 15.3 7.38 15.3 6.75C15.3 4.74 14.595 3.1125 13.185 1.8675C11.775 0.6225 9.93 0 7.65 0C5.37 0 3.525 0.6225 2.115 1.8675C0.705 3.1125 0 4.74 0 6.75C0 7.38 0.0825 7.97625 0.2475 8.53875C0.4125 9.10125 0.6525 9.61125 0.9675 10.0688C1.2825 10.5262 1.66125 10.92 2.10375 11.25C2.54625 11.58 3.045 11.8275 3.6 11.9925V15.3ZM9 10.35H6.3L7.65 7.65L9 10.35ZM5.61375 7.63875C5.30625 7.94625 4.935 8.1 4.5 8.1C4.065 8.1 3.69375 7.94625 3.38625 7.63875C3.07875 7.33125 2.925 6.96 2.925 6.525C2.925 6.09 3.07875 5.71875 3.38625 5.41125C3.69375 5.10375 4.065 4.95 4.5 4.95C4.935 4.95 5.30625 5.10375 5.61375 5.41125C5.92125 5.71875 6.075 6.09 6.075 6.525C6.075 6.96 5.92125 7.33125 5.61375 7.63875ZM11.9137 7.63875C11.6062 7.94625 11.235 8.1 10.8 8.1C10.365 8.1 9.99375 7.94625 9.68625 7.63875C9.37875 7.33125 9.225 6.96 9.225 6.525C9.225 6.09 9.37875 5.71875 9.68625 5.41125C9.99375 5.10375 10.365 4.95 10.8 4.95C11.235 4.95 11.6062 5.10375 11.9137 5.41125C12.2213 5.71875 12.375 6.09 12.375 6.525C12.375 6.96 12.2213 7.33125 11.9137 7.63875Z" fill="#FB515B"/>
            </svg>
          </div>
          <div>
            <span className="text-xl items-center font-semibold text-white space-glow">{blockedPackages}</span>
            <p className="text-xs text-blue-200/60 mt-2">
              Malicious packages blocked from entering your organization in the past month
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
            <h3 className="text-sm font-medium text-blue-100/80">Total Packages</h3>
            <Package className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <span className="text-sm font-semibold text-white space-glow">
              <img src="/lovable-uploads/docker.png" className="w-4 h-4 inline-block mr-2" alt="Docker"/>
              {formatNumber(packageStats.packageTypeCounts.docker)}
            </span>
            <br></br>
            <span className="text-sm font-semibold text-white space-glow">
              <img src="/lovable-uploads/maven.png" className="w-4 h-4 inline-block mr-2" alt="Maven"/>
              {formatNumber(packageStats.packageTypeCounts.maven)}
            </span>
            <br></br>
            <span className="text-sm font-semibold text-white space-glow">
              <img src="/lovable-uploads/npm.png" className="w-4 h-4 inline-block mr-2" alt="NPM"/>
              {formatNumber(packageStats.packageTypeCounts.npm)}
            </span>
            <p className="text-xs text-blue-200/60 mt-2">
              Packages stored in your organization
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Connected Developers Card */}
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        transition={{ duration: 0.3, delay: 0.3 }}
        className="cursor-pointer"
        onClick={handleConnectedDevelopersClick}
      >
        <Card className="space-card p-6 h-full flex flex-col justify-between backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-blue-100/80">Connected Developers</h3>
            <MonitorDot className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <span className="text-xl font-semibold">21 / 30</span>
            <br></br>
            <p className="text-xs text-blue-200/60 mt-2">
              ⚠️ 9 Developers are not protected
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default StatisticsBar;
