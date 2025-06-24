
export const getSquadDisplayName = (squadType: string) => {
  switch (squadType) {
    case 'first-xi': return 'First XI';
    case 'shadow-squad': return 'Shadow Squad';
    default: return 'Squad';
  }
};
