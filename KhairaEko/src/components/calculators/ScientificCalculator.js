import { useState } from 'react';

export default function ScientificCalculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState([]);

  const handleButtonClick = (value) => {
    if (value === '=') {
      try {
        // Replace special functions with JavaScript equivalents
        let expression = input
          .replace(/sin\(/g, 'Math.sin(')
          .replace(/cos\(/g, 'Math.cos(')
          .replace(/tan\(/g, 'Math.tan(')
          .replace(/log\(/g, 'Math.log10(')
          .replace(/ln\(/g, 'Math.log(')
          .replace(/π/g, Math.PI)
          .replace(/e/g, Math.E)
          .replace(/√\(/g, 'Math.sqrt(')
          .replace(/\^/g, '**');
        
        // Handle factorial
        if (expression.includes('!')) {
          const num = parseFloat(expression.replace('!', ''));
          if (num >= 0) {
            let fact = 1;
            for (let i = 2; i <= num; i++) fact *= i;
            setResult(fact.toString());
            setHistory([...history, `${input} = ${fact}`]);
            return;
          }
        }
        
        const evalResult = eval(expression);
        setResult(evalResult);
        setHistory([...history, `${input} = ${evalResult}`]);
        setInput(evalResult.toString());
      } catch (error) {
        setResult('Error');
      }
    } else if (value === 'C') {
      setInput('');
      setResult('');
    } else if (value === 'CE') {
      setInput(input.slice(0, -1));
    } else if (value === 'M+') {
      setMemory(memory + parseFloat(input || result || '0'));
    } else if (value === 'M-') {
      setMemory(memory - parseFloat(input || result || '0'));
    } else if (value === 'MR') {
      setInput(input + memory.toString());
    } else if (value === 'MC') {
      setMemory(0);
    } else if (value === 'x²') {
      setInput(`(${input})**2`);
    } else if (value === '1/x') {
      setInput(`1/(${input})`);
    } else if (value === 'quad') {
      // Quadratic equation solver
      setInput('ax²+bx+c=0');
      setResult('Use a,b,c inputs');
    } else {
      setInput(input + value);
    }
  };

  const buttons = [
    'C', 'CE', 'M+', 'M-', 'MR', 'MC',
    'sin(', 'cos(', 'tan(', 'log(', 'ln(',
    '7', '8', '9', '/', 'x²',
    '4', '5', '6', '*', '√(',
    '1', '2', '3', '-', '!',
    '0', '.', 'π', 'e', '1/x',
    '(', ')', '+', '=', 'quad'
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-[#FF0A54] mb-4">Scientific Calculator</h2>
      
      <div className="mb-4">
        <input
          type="text"
          value={input}
          readOnly
          className="w-full p-3 text-right text-2xl border border-[#FFB3C6] rounded-lg bg-[#FFF0F3]"
          placeholder="0"
        />
        <div className="text-right text-lg text-[#FF477E] mt-1">
          {result ? `= ${result}` : ''}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {buttons.map((btn) => (
          <button
            key={btn}
            onClick={() => handleButtonClick(btn)}
            className={`p-3 text-center rounded-lg ${
              ['C', 'CE', 'M+', 'M-', 'MR', 'MC'].includes(btn)
                ? 'bg-[#FF0A54] text-white'
                : ['=', '+', '-', '*', '/'].includes(btn)
                ? 'bg-[#FF8FAB] text-white'
                : ['sin(', 'cos(', 'tan(', 'log(', 'ln(', 'x²', '√(', '!', '1/x', 'quad', 'π', 'e'].includes(btn)
                ? 'bg-[#FFB3C6] text-[#FF0A54]'
                : 'bg-[#FFE5EC] text-[#FF477E]'
            } hover:opacity-80`}
          >
            {btn}
          </button>
        ))}
      </div>

      {history.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-[#FF477E] mb-2">History</h3>
          <div className="bg-[#FFF0F3] p-3 rounded-lg max-h-32 overflow-y-auto">
            {history.map((item, index) => (
              <div key={index} className="text-[#FF0A54] py-1 border-b border-[#FFC2D1]">
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}