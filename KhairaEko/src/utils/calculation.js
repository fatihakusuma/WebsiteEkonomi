// Financial calculations
export const calculateFV = (pv, rate, nper, pmt = 0) => {
  const r = rate / 100;
  return pv * Math.pow(1 + r, nper) + pmt * (Math.pow(1 + r, nper) - 1) / r;
};

export const calculatePV = (fv, rate, nper, pmt = 0) => {
  const r = rate / 100;
  return fv / Math.pow(1 + r, nper) + pmt * (1 - Math.pow(1 + r, -nper)) / r;
};

export const calculatePMT = (pv, rate, nper) => {
  const r = rate / 100;
  return (pv * r) / (1 - Math.pow(1 + r, -nper));
};

// Statistics
export const calculateMean = (data) => {
  return data.reduce((a, b) => a + b, 0) / data.length;
};

export const calculateMedian = (data) => {
  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 
    ? sorted[mid] 
    : (sorted[mid - 1] + sorted[mid]) / 2;
};

export const calculateStdDev = (data) => {
  const mean = calculateMean(data);
  const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length;
  return Math.sqrt(variance);
};

// Matrix operations
export const matrixMultiply = (a, b) => {
  const aRows = a.length;
  const aCols = a[0].length;
  const bCols = b[0].length;
  
  const result = Array(aRows).fill().map(() => Array(bCols).fill(0));
  
  for (let i = 0; i < aRows; i++) {
    for (let j = 0; j < bCols; j++) {
      for (let k = 0; k < aCols; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  
  return result;
};

export const matrixDeterminant = (matrix) => {
  if (matrix.length !== matrix[0].length) {
    throw new Error('Matrix must be square');
  }
  
  if (matrix.length === 2) {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  }
  
  let det = 0;
  for (let i = 0; i < matrix.length; i++) {
    const minor = matrix.slice(1).map(row => row.filter((_, j) => j !== i));
    det += matrix[0][i] * Math.pow(-1, i) * matrixDeterminant(minor);
  }
  
  return det;
};