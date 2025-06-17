const analyzeBitFrequency = (bits: string) => {
  const zeros = (bits.match(/0/g) || []).length;
  const ones = (bits.match(/1/g) || []).length;
  const total = bits.length;

  return {
    zeros,
    ones,
    total,
    zeroPercentage: total > 0 ? (zeros / total) * 100 : 0,
    onePercentage: total > 0 ? (ones / total) * 100 : 0,
  };
};

export default analyzeBitFrequency;
