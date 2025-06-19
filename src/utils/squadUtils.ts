
export const getSquadDisplayName = (squadType: string) => {
  switch (squadType) {
    case 'first-xi': return 'First XI';
    case 'shadow-squad': return 'Shadow Squad';
    case 'u23': return 'Under 23s';
    case 'u21': return 'Under 21s';
    case 'u18': return 'Under 18s';
    default: return 'Squad';
  }
};
