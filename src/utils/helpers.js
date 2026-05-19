export const formatPoints = (points) => new Intl.NumberFormat('en-US').format(points);

export const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy':   return 'badge-easy';
    case 'medium': return 'badge-medium';
    case 'hard':   return 'badge-hard';
    default:       return '';
  }
};
