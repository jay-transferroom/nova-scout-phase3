
export const getSquadDisplayName = (squadType: string) => {
  switch (squadType) {
    case 'first-xi': return 'First XI (Starting 11)';
    case 'shadow-squad': return 'Shadow Squad (Reserve Players)';
    default: return 'Squad';
  }
};
