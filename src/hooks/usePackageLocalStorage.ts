import { useState, useEffect } from 'react';
import { PackageStatistics, BlockedPackage, defaultPackageStatistics, defaultBlockedPackages } from '@/types/package';

const PACKAGE_STATS_KEY = 'package_statistics';
const BLOCKED_PACKAGES_KEY = 'blocked_packages';

export const usePackageLocalStorage = () => {
  const [packageStats, setPackageStats] = useState<PackageStatistics>(defaultPackageStatistics);
  const [blockedPackages, setBlockedPackages] = useState<BlockedPackage[]>(defaultBlockedPackages);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      // Reset to default data on page refresh
      setPackageStats(defaultPackageStatistics);
      setBlockedPackages(defaultBlockedPackages);
      
      // Save to localStorage
      localStorage.setItem(PACKAGE_STATS_KEY, JSON.stringify(defaultPackageStatistics));
      localStorage.setItem(BLOCKED_PACKAGES_KEY, JSON.stringify(defaultBlockedPackages));
    };

    loadData();
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(PACKAGE_STATS_KEY, JSON.stringify(packageStats));
  }, [packageStats]);

  useEffect(() => {
    localStorage.setItem(BLOCKED_PACKAGES_KEY, JSON.stringify(blockedPackages));
  }, [blockedPackages]);

  return {
    packageStats,
    blockedPackages,
    setPackageStats,
    setBlockedPackages
  };
}; 