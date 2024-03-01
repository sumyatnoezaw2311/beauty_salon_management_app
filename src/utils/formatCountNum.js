export const formatCountNum = (value) => {
    if (value < 1000) {
      return value;
    } else if (value < 1000000) {
      return `${(value / 1000).toFixed(1)}K`;
    } else {
      return `${(value / 1000000).toFixed(1)}M`;
    }
};