import { useState } from 'react';

export default function MatrixStatsCalculator() {
  const [matrix, setMatrix] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]);
  const [data, setData] = useState('');
  const [matrixResult, setMatrixResult] = useState('');
  const [statsResult, setStatsResult] = useState(null);

  const handleMatrixChange = (row, col, value) => {
    const newMatrix = [...matrix];
    newMatrix[row][col] = value;
    setMatrix(newMatrix);
  };

  const handleDataChange = (e) => {
    setData(e.target.value);
  };

  const calculateMatrix = (operation) => {
    const numMatrix = matrix.map(row => row.map(cell => parseFloat(cell) || 0));
    
    if (operation === 'determinant') {
      if (numMatrix.length !== 3 || numMatrix[0].length !== 3) {
        setMatrixResult('Matrix must be 3x3 for determinant');
        return;
      }
      // Calculate determinant for 3x3 matrix
      const det = 
        numMatrix[0][0]*(numMatrix[1][1]*numMatrix[2][2] - numMatrix[1][2]*numMatrix[2][1]) -
        numMatrix[0][1]*(numMatrix[1][0]*numMatrix[2][2] - numMatrix[1][2]*numMatrix[2][0]) +
        numMatrix[0][2]*(numMatrix[1][0]*numMatrix[2][1] - numMatrix[1][1]*numMatrix[2][0]);
      setMatrixResult(`Determinant: ${det}`);
    } else if (operation === 'transpose') {
      const rows = numMatrix.length;
      const cols = numMatrix[0].length;
      let transposed = Array(cols).fill().map(() => Array(rows).fill(0));
      
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          transposed[j][i] = numMatrix[i][j];
        }
      }
      setMatrixResult(`Transposed: ${JSON.stringify(transposed)}`);
    } else if (operation === 'add') {
      // For simplicity, we assume adding to another 3x3 matrix
      setMatrixResult('Feature not implemented in demo');
    }
  };

  const calculateStats = () => {
    const numbers = data.split(',').map(num => parseFloat(num.trim())).filter(num => !isNaN(num));
    if (numbers.length === 0) {
      setStatsResult('No valid data');
      return;
    }
    
    const sum = numbers.reduce((a, b) => a + b, 0);
    const mean = sum / numbers.length;
    const sorted = [...numbers].sort((a, b) => a - b);
    const median = sorted.length % 2 === 0 
      ? (sorted[sorted.length/2 - 1] + sorted[sorted.length/2]) / 2
      : sorted[Math.floor(sorted.length/2)];
    
    // Standard deviation
    const variance = numbers.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / numbers.length;
    const stdDev = Math.sqrt(variance);
    
    setStatsResult({
      mean: mean.toFixed(2),
      median: median.toFixed(2),
      stdDev: stdDev.toFixed(2),
      min: Math.min(...numbers).toFixed(2),
      max: Math.max(...numbers).toFixed(2),
      count: numbers.length
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-[#FF0A54] mb-4">Matrix & Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Matrix Section */}
        <div>
          <h3 className="text-xl font-semibold text-[#FF477E] mb-3">Matrix Calculator (3x3)</h3>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {matrix.map((row, rowIndex) => (
              row.map((cell, colIndex) => (
                <input
                  key={`${rowIndex}-${colIndex}`}
                  type="number"
                  value={cell}
                  onChange={(e) => handleMatrixChange(rowIndex, colIndex, e.target.value)}
                  className="p-2 border border-[#FFB3C6] rounded text-center"
                />
              ))
            ))}
          </div>
          <div className="flex space-x-2">
            {['determinant', 'transpose', 'add'].map(op => (
              <button
                key={op}
                onClick={() => calculateMatrix(op)}
                className="bg-[#FFB3C6] hover:bg-[#FF8FAB] text-[#FF0A54] px-3 py-2 rounded"
              >
                {op.charAt(0).toUpperCase() + op.slice(1)}
              </button>
            ))}
          </div>
          {matrixResult && (
            <div className="mt-4 p-3 bg-[#FFF0F3] rounded">
              <p className="text-[#FF0A54]">{matrixResult}</p>
            </div>
          )}
        </div>
        
        {/* Statistics Section */}
        <div>
          <h3 className="text-xl font-semibold text-[#FF477E] mb-3">Statistics Calculator</h3>
          <div className="mb-4">
            <label className="block text-[#FF477E] mb-1">Enter data (comma separated):</label>
            <input
              type="text"
              value={data}
              onChange={handleDataChange}
              className="w-full p-2 border border-[#FFB3C6] rounded"
              placeholder="e.g. 1, 2, 3, 4, 5"
            />
          </div>
          <button
            onClick={calculateStats}
            className="bg-[#FFB3C6] hover:bg-[#FF8FAB] text-[#FF0A54] px-4 py-2 rounded"
          >
            Calculate
          </button>
          {statsResult && typeof statsResult === 'object' && (
            <div className="mt-4 p-3 bg-[#FFF0F3] rounded">
              <p className="text-[#FF0A54]">Mean: {statsResult.mean}</p>
              <p className="text-[#FF0A54]">Median: {statsResult.median}</p>
              <p className="text-[#FF0A54]">Standard Deviation: {statsResult.stdDev}</p>
              <p className="text-[#FF0A54]">Min: {statsResult.min} | Max: {statsResult.max}</p>
              <p className="text-[#FF0A54]">Count: {statsResult.count}</p>
            </div>
          )}
          {statsResult && typeof statsResult === 'string' && (
            <div className="mt-4 p-3 bg-[#FFF0F3] rounded">
              <p className="text-[#FF0A54]">{statsResult}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}