
export const getSquadDisplayName = (squadType: string) => {
  switch (squadType) {
    case 'first-team': return 'First Team';
    case 'shadow-squad': return 'Shadow Squad (Reserve Players)';
    case 'u21': return 'Under 21s';
    case 'u18': return 'Under 18s';
    case 'on-loan': return 'On Loan Players';
    default: return 'Squad';
  }
};
