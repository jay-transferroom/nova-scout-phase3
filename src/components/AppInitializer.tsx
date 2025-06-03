
import React from 'react';
import { useAppInitialization } from '@/hooks/useAppInitialization';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const { isInitialized, initializationStatus } = useAppInitialization();

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <div className="text-center">
                <h2 className="text-lg font-semibold mb-2">Initializing Application</h2>
                <p className="text-sm text-gray-600">{initializationStatus}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default AppInitializer;
