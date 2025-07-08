interface PrivatePlayerLoadingStateProps {
  // No props needed for now
}

export const PrivatePlayerLoadingState = ({}: PrivatePlayerLoadingStateProps) => {
  return (
    <div className="container mx-auto py-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg font-medium">Loading private player data...</p>
      </div>
    </div>
  );
};