
interface ProspectRecommendationHeaderProps {
  matchPercentage: number;
  recommendation: string;
  name: string;
  position: string;
}

const ProspectRecommendationHeader = ({ 
  matchPercentage, 
  recommendation, 
  name, 
  position 
}: ProspectRecommendationHeaderProps) => {
  return (
    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
        {matchPercentage}%
      </div>
      <div className="flex-1">
        <div className="font-medium text-blue-900">{recommendation}</div>
        <div className="text-sm text-blue-700">
          {name} looks like an excellent fit for {position}
        </div>
      </div>
    </div>
  );
};

export default ProspectRecommendationHeader;
