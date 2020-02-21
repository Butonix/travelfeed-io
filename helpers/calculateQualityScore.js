const calculateQualityScore = scores => {
  let total = 10;
  if (scores.length > 0) {
    Object.values(scores[0]).forEach(score => {
      if (score === true) total -= 2.5;
    });
  }
  return total;
};

export default calculateQualityScore;
