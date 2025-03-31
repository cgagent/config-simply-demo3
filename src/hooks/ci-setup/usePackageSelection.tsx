import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/components/ai-chat/constants';

export const usePackageSelection = (messages: Message[], isProcessing: boolean) => {
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [showPackageOptions, setShowPackageOptions] = useState(false);
  const { toast } = useToast();

  const handlePackageSelection = (packageName: string) => {
    setSelectedPackages(prev => {
      // If already selected, remove it
      if (prev.includes(packageName)) {
        return prev.filter(p => p !== packageName);
      }
      // Otherwise add it
      return [...prev, packageName];
    });
  };

  const handleContinueWithPackages = () => {
    if (selectedPackages.length === 0) {
      toast({
        title: "Selection required",
        description: "Please select at least one package manager.",
        variant: "destructive"
      });
      return false;
    }

    // Return true to indicate success
    return true;
  };

  return {
    selectedPackages,
    showPackageOptions,
    setShowPackageOptions,
    handlePackageSelection,
    handleContinueWithPackages
  };
};
