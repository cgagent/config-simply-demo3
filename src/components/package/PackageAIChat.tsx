import React from 'react';
import { Package } from '@/types/package';
import { PackageSummary } from './PackageSummary';
import { AIChat } from '@/components/ai-chat/AIChat';
import { Bot, Home } from 'lucide-react';
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { useNavigate } from 'react-router-dom';

interface PackageAIChatProps {
  packages: Package[];
}

const PackageAIChat: React.FC<PackageAIChatProps> = ({ packages }) => {
  const navigate = useNavigate();

  // Calculate summary metrics
  const totalPackages = packages.length;
  const totalConsumption = packages.reduce((acc, pkg) => acc + pkg.downloads, 0);
  const totalStorage = packages.reduce((acc, pkg) => acc + pkg.size, 0);
  const maliciousPackages = packages.filter(pkg => pkg.vulnerabilities > 2).length;

  const handleBackToHome = () => {
    navigate('/home');
  };

  return (
    <div className="flex flex-col h-[700px] border rounded-lg overflow-hidden bg-background">
      <div className="bg-primary p-3">
        <h3 className="text-white font-medium flex items-center">
          <Bot className="w-5 h-5 mr-2" />
          Package Management Assistant
        </h3>
      </div>
      
      {/* Breadcrumb Navigation */}
      <div className="p-3 border-b">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <button
                  onClick={handleBackToHome}
                  className="flex items-center text-sm text-muted-foreground hover:text-primary"
                >
                  <Home className="h-3.5 w-3.5 mr-1" />
                  Back to Home
                </button>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      {/* Summary Cards at the top */}
      <div className="p-4 bg-muted/30">
        <PackageSummary 
          totalPackages={totalPackages} 
          totalConsumption={totalConsumption} 
          totalStorage={totalStorage} 
          maliciousPackages={maliciousPackages} 
        />
      </div>
      
      {/* Generic AIChat component */}
      <div className="flex-1 overflow-hidden">
        <AIChat />
      </div>
    </div>
  );
};

export default PackageAIChat;
