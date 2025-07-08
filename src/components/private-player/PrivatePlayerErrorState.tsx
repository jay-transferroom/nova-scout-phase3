import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PrivatePlayerErrorStateProps {
  // No additional props needed
}

export const PrivatePlayerErrorState = ({}: PrivatePlayerErrorStateProps) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-lg font-medium text-gray-900 mb-2">Private player not found</p>
        <p className="text-gray-600 mb-4">
          This private player either doesn't exist, has been removed, or you don't have permission to view it. 
          Private players can only be viewed by the user who created them.
        </p>
        <Button onClick={() => navigate('/')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};