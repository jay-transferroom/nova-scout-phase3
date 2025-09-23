import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
interface ViewToggleProps {
  currentView: 'pitch' | 'list';
  onViewChange: (view: 'pitch' | 'list') => void;
}
const ViewToggle = ({
  currentView,
  onViewChange
}: ViewToggleProps) => {
  const selectedIndex = currentView === 'pitch' ? 0 : 1;
  return;
};
export default ViewToggle;