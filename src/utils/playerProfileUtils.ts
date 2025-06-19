
export const getPositionColor = (position: string) => {
  const colors: Record<string, string> = {
    'GK': 'bg-yellow-500',
    'CB': 'bg-blue-500',
    'LB': 'bg-blue-300',
    'RB': 'bg-blue-300',
    'LWB': 'bg-teal-400',
    'RWB': 'bg-teal-400',
    'CDM': 'bg-green-600',
    'CM': 'bg-green-500',
    'CAM': 'bg-green-400',
    'LM': 'bg-teal-300',
    'RM': 'bg-teal-300',
    'LW': 'bg-red-300',
    'RW': 'bg-red-300',
    'ST': 'bg-red-600',
    'CF': 'bg-red-500',
  };
  
  return colors[position] || 'bg-gray-400';
};

export const getFormRatingColor = (rating: number) => {
  if (rating >= 8) return 'text-green-500';
  if (rating >= 7) return 'text-blue-500';
  if (rating >= 6) return 'text-yellow-500';
  return 'text-red-500';
};

export const getContractStatusColor = (status: string) => {
  switch (status) {
    case 'Free Agent': return 'bg-red-100 text-red-800';
    case 'Under Contract': return 'bg-green-100 text-green-800';
    case 'Loan': return 'bg-blue-100 text-blue-800';
    case 'Youth Contract': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const calculateAge = (dateOfBirth: string) => {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export const formatDateLocal = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
