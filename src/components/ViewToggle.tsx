
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";

interface ViewToggleProps {
  currentView: 'pitch' | 'list';
  onViewChange: (view: 'pitch' | 'list') => void;
}

const ViewToggle = ({ currentView, onViewChange }: ViewToggleProps) => {
  const selectedIndex = currentView === 'pitch' ? 0 : 1;
  
  return (
    <div className="relative inline-flex bg-muted rounded-full p-1">
      {/* Sliding background */}
      <div 
        className="absolute inset-y-1 bg-background rounded-full shadow-sm transition-all duration-300 ease-in-out"
        style={{
          width: `calc(50% - 2px)`,
          left: selectedIndex === 0 ? '2px' : '50%'
        }}
      />
      
      {/* Buttons */}
      <button
        onClick={() => onViewChange('pitch')}
        className={`relative z-10 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 min-w-[100px] ${
          currentView === 'pitch' 
            ? 'text-foreground' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <LayoutGrid className="h-4 w-4" />
        Pitch View
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`relative z-10 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 min-w-[100px] ${
          currentView === 'list' 
            ? 'text-foreground' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <List className="h-4 w-4" />
        List View
      </button>
    </div>
  );
};

export default ViewToggle;
