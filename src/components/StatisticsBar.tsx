import React, { useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Package, PackageX, Database, ShieldBan, MonitorDot, Biohazard, Skull, AlertTriangle, XCircle, ChevronRight, GitBranch } from 'lucide-react';
import { formatNumber } from '@/lib/formatters';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRepositories } from '@/contexts/RepositoryContext';
import { formatDistanceToNow } from 'date-fns';
import { packageTypeColors } from '@/types/package';
import Chart from 'chart.js/auto';

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
  const { repositories, packageStats } = useRepositories();

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
    console.log('Navigating to User Management page');
    navigate('/users', { replace: true });
  }, [navigate]);

  const handleLatestPackagesClick = useCallback(() => {
    if (onChatQuery) {
      onChatQuery("Show me the last 5 package releases in my organization");
    }
  }, [onChatQuery]);

  const handleLatestBuildsClick = useCallback(() => {
    if (onChatQuery) {
      onChatQuery("Show me the last 5 builds in my organization");
    }
  }, [onChatQuery]);

  const handlePackageAtRiskClick = useCallback(() => {
    if (onChatQuery) {
      onChatQuery("Identify which packages are at risk in my organization");
    }
  }, [onChatQuery]);

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.02 }
  };

  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  // Helper function to get package type icon
  const getPackageTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'docker':
        return <img src="/lovable-uploads/docker.png" className="w-4 h-4" alt="Docker" />;
      case 'maven':
        return <img src="/lovable-uploads/maven.png" className="w-4 h-4" alt="Maven" />;
      case 'npm':
        return <img src="/lovable-uploads/npm.png" className="w-4 h-4" alt="NPM" />;
      case 'python':
        return <img src="/lovable-uploads/python.png" className="w-4 h-4" alt="Python" />;
      case 'debian':
        return <img src="/lovable-uploads/debian.png" className="w-4 h-4" alt="Debian" />;
      case 'rpm':
        return <img src="/lovable-uploads/rpm.png" className="w-4 h-4" alt="RPM" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  // Initialize Chart.js for Data Consumption
  React.useEffect(() => {
    const ctx = document.getElementById('data-consumption-chart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Data Consumption (GB)',
            data: [1, 2, 3.5, 5],
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Weeks',
            },
          },
          y: {
            title: {
              display: true,
              text: 'GB',
            },
            beginAtZero: true,
          },
        },
      },
    });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Blocked Malicious Packages Card */}
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="space-card p-4 h-full flex flex-col backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-blue-100/80">Malicious Packages</h3>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M3.6 15.3H5.175V13.05H6.525V15.3H8.775V13.05H10.125V15.3H11.7V11.9925C12.255 11.8275 12.7537 11.58 13.1962 11.25C13.6388 10.92 14.0175 10.5262 14.3325 10.0688C14.6475 9.61125 14.8875 9.10125 15.0525 8.53875C15.2175 7.97625 15.3 7.38 15.3 6.75C15.3 4.74 14.595 3.1125 13.185 1.8675C11.775 0.6225 9.93 0 7.65 0C5.37 0 3.525 0.6225 2.115 1.8675C0.705 3.1125 0 4.74 0 6.75C0 7.38 0.0825 7.97625 0.2475 8.53875C0.4125 9.10125 0.6525 9.61125 0.9675 10.0688C1.2825 10.5262 1.66125 10.92 2.10375 11.25C2.54625 11.58 3.045 11.8275 3.6 11.9925V15.3ZM9 10.35H6.3L7.65 7.65L9 10.35ZM5.61375 7.63875C5.30625 7.94625 4.935 8.1 4.5 8.1C4.065 8.1 3.69375 7.94625 3.38625 7.63875C3.07875 7.33125 2.925 6.96 2.925 6.525C2.925 6.09 3.07875 5.71875 3.38625 5.41125C3.69375 5.10375 4.065 4.95 4.5 4.95C4.935 4.95 5.30625 5.10375 5.61375 5.41125C5.92125 5.71875 6.075 6.09 6.075 6.525C6.075 6.96 5.92125 7.33125 5.61375 7.63875ZM11.9137 7.63875C11.6062 7.94625 11.235 8.1 10.8 8.1C10.365 8.1 9.99375 7.94625 9.68625 7.63875C9.37875 7.33125 9.225 6.96 9.225 6.525C9.225 6.09 9.37875 5.71875 9.68625 5.41125C9.99375 5.10375 10.365 4.95 10.8 4.95C11.235 4.95 11.6062 5.10375 11.9137 5.41125C12.2213 5.71875 12.375 6.09 12.375 6.525C12.375 6.96 12.2213 7.33125 11.9137 7.63875Z" fill="#FB515B"/>
            </svg>
          </div>
          <div className="space-y-3">
            {/* Current At-Risk Packages Section */}
            <div 
              className="group cursor-pointer hover:bg-blue-950/30 p-2 rounded-lg transition-all duration-200 border border-transparent hover:border-red-800/30 relative"
              onClick={handlePackageAtRiskClick}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-semibold text-red-400 space-glow">1</span>
                  <span className="text-xs text-red-200/70">package at risk</span>
                </div>
                <ChevronRight className="h-4 w-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-red-200/60 mt-1">
                ⚠️ Critical vulnerability detected
              </p>
            </div>

            {/* Historical Blocked Packages Section */}
            <div 
              className="group cursor-pointer hover:bg-blue-950/30 p-2 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-800/30 relative"
              onClick={handleBlockedPackagesClick}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-semibold text-white space-glow">{blockedPackages}</span>
                  <span className="text-xs text-blue-200/70">packages blocked</span>
                </div>
                <ChevronRight className="h-4 w-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-blue-200/60 mt-1">
                Successfully prevented in the last 30 days out of {totalPackages} scanned packages
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Recent Activity Card */}
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card className="space-card p-4 h-full flex flex-col backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-blue-100/80">Recent Activity</h3>
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-blue-400" />
              <GitBranch className="h-4 w-4 text-blue-400" />
            </div>
          </div>
          
          {/* Recent Packages Section */}
          <div 
            className="group cursor-pointer hover:bg-blue-950/30 p-2 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-800/30 relative mb-3"
            onClick={handleLatestPackagesClick}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-100/80">Recent Package</span>
              </div>
              <ChevronRight className="h-4 w-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {packageStats.latestPackages && packageStats.latestPackages.length > 0 ? (
              <div className="mt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-2">
                      {getPackageTypeIcon(packageStats.latestPackages[0].type)}
                    </div>
                    <span className="text-sm text-white space-glow">{packageStats.latestPackages[0].name}</span>
                    <span className="text-xs text-blue-200/70 ml-2">v{packageStats.latestPackages[0].version}</span>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(packageStats.latestPackages[0].status)}
                  </div>
                </div>
                <p className="text-xs text-blue-200/60 mt-1">
                  Published {formatDistanceToNow(new Date(packageStats.latestPackages[0].releaseDate), { addSuffix: true })}
                </p>
              </div>
            ) : (
              <p className="text-xs text-blue-200/60 mt-2">No recent package releases</p>
            )}
          </div>

          {/* Recent Builds Section */}
          <div 
            className="group cursor-pointer hover:bg-blue-950/30 p-2 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-800/30 relative"
            onClick={handleLatestBuildsClick}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <GitBranch className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-100/80">Recent Build</span>
              </div>
              <ChevronRight className="h-4 w-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {packageStats.latestBuilds && packageStats.latestBuilds.length > 0 ? (
              <div className="mt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm text-white space-glow">{packageStats.latestBuilds[0].repository}</span>
                    <span className="text-xs text-blue-200/70 ml-2">#{packageStats.latestBuilds[0].buildNumber}</span>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(packageStats.latestBuilds[0].status)}
                  </div>
                </div>
                <p className="text-xs text-blue-200/60 mt-1">
                  Built {formatDistanceToNow(new Date(packageStats.latestBuilds[0].buildDate), { addSuffix: true })}
                </p>
              </div>
            ) : (
              <p className="text-xs text-blue-200/60 mt-2">No recent builds</p>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Combined CI Coverage and Connected Developers Card */}
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card className="space-card p-4 h-full flex flex-col backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-blue-100/80">My Environment</h3>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-400" />
              <MonitorDot className="h-5 w-5 text-blue-400" />
            </div>
          </div>
          <div className="space-y-3">
            {/* CI Coverage Section */}
            <div 
              className="group cursor-pointer hover:bg-blue-950/30 p-2 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-800/30 relative"
              onClick={handleCICompletionClick}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-semibold text-white space-glow">{configuredRepos} / {totalRepos}</span>
                  <span className="text-xs text-blue-200/70">repositories configured</span>
                </div>
                <ChevronRight className="h-4 w-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <Progress 
                value={ciCompletionPercentage} 
                className="h-1.5 bg-blue-950/60 mt-2" 
                indicatorClassName="bg-gradient-to-r from-blue-600 to-blue-400"
              />
              <p className="text-xs text-blue-200/60 mt-1">
                {configuredRepos === totalRepos 
                  ? "All repositories are configured"
                  : 1 === totalRepos - configuredRepos ? "⚠️ 1 repository is not protected" : `⚠️ ${totalRepos - configuredRepos} repositories are not protected`}
              </p>
            </div>

            {/* Connected Developers Section */}
            <div 
              className="group cursor-pointer hover:bg-blue-950/30 p-2 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-800/30 relative"
              onClick={handleConnectedDevelopersClick}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-semibold text-white space-glow">21 / 30</span>
                  <span className="text-xs text-blue-200/70">developers connected</span>
                </div>
                <ChevronRight className="h-4 w-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-blue-200/60 mt-1">
                ⚠️ 9 Developers are not protected
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Data Consumption Card */}
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card className="space-card p-4 h-full flex flex-col backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-blue-100/80">Data Consumption</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold text-white space-glow">5 GB</span>
              <span className="text-xs text-blue-200/70">This Month</span>
            </div>
            <div className="mt-4">
              <canvas id="data-consumption-chart" className="w-full h-24"></canvas>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default StatisticsBar;
