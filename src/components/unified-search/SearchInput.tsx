
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchInputProps {
  placeholder: string;
  onClick?: () => void;
  readOnly?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const SearchInput = ({ 
  placeholder, 
  onClick, 
  readOnly = false, 
  value, 
  onChange,
  className = ""
}: SearchInputProps) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder={placeholder}
        className="pl-10 pr-4"
        onClick={onClick}
        readOnly={readOnly}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      />
    </div>
  );
};

export default SearchInput;
