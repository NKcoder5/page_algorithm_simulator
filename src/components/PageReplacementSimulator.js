import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/PageReplacementSimulator.css';

const PageReplacementSimulator = () => {
  const [referenceString, setReferenceString] = useState('');
  const [frameCount, setFrameCount] = useState(3);
  const [algorithm, setAlgorithm] = useState('fifo');
  const [simulationSteps, setSimulationSteps] = useState([]);
  const [pageFaults, setPageFaults] = useState(0);

  const isValidInput = (refString, frames) => {
    const numbers = refString.split(',').map(num => parseInt(num.trim()));
    return numbers.length > 0 && 
           !numbers.some(isNaN) && 
           frames > 0 && 
           frames <= 10;
  };

  const simulateFIFO = (referenceString, frames, result) => {
    const queue = [];
    const frameArray = new Array(frames).fill(null);
    
    for (let i = 0; i < referenceString.length; i++) {
      const page = referenceString[i];
      const step = {
        page: page,
        frames: [...frameArray],
        fault: false
      };

      if (!frameArray.includes(page)) {
        result.pageFaults++;
        step.fault = true;

        if (queue.length < frames) {
          const index = queue.length;
          frameArray[index] = page;
          queue.push(index);
        } else {
          const indexToReplace = queue.shift();
          frameArray[indexToReplace] = page;
          queue.push(indexToReplace);
        }
      }

      result.steps.push(step);
    }

    return result;
  };

  const simulateLRU = (referenceString, frames, result) => {
    const lastUsed = new Map();
    const frameArray = new Array(frames).fill(null);
    
    for (let i = 0; i < referenceString.length; i++) {
      const page = referenceString[i];
      const step = {
        page: page,
        frames: [...frameArray],
        fault: false
      };

      if (!frameArray.includes(page)) {
        result.pageFaults++;
        step.fault = true;

        if (frameArray.includes(null)) {
          const index = frameArray.indexOf(null);
          frameArray[index] = page;
        } else {
          let lruIndex = 0;
          let minLastUsed = Infinity;

          for (let j = 0; j < frameArray.length; j++) {
            if (lastUsed.get(frameArray[j]) < minLastUsed) {
              minLastUsed = lastUsed.get(frameArray[j]);
              lruIndex = j;
            }
          }

          frameArray[lruIndex] = page;
        }
      }

      lastUsed.set(page, i);
      result.steps.push(step);
    }

    return result;
  };

  const simulateOptimal = (referenceString, frames, result) => {
    const frameArray = new Array(frames).fill(null);
    
    for (let i = 0; i < referenceString.length; i++) {
      const page = referenceString[i];
      const step = {
        page: page,
        frames: [...frameArray],
        fault: false
      };

      if (!frameArray.includes(page)) {
        result.pageFaults++;
        step.fault = true;

        if (frameArray.includes(null)) {
          const index = frameArray.indexOf(null);
          frameArray[index] = page;
        } else {
          let farthestIndex = 0;
          let farthestDistance = -1;

          for (let j = 0; j < frameArray.length; j++) {
            let distance = referenceString.slice(i + 1).indexOf(frameArray[j]);
            if (distance === -1) {
              farthestIndex = j;
              break;
            }
            if (distance > farthestDistance) {
              farthestDistance = distance;
              farthestIndex = j;
            }
          }

          frameArray[farthestIndex] = page;
        }
      }

      result.steps.push(step);
    }

    return result;
  };

  const handleSimulate = () => {
    const numbers = referenceString.split(',').map(num => parseInt(num.trim()));
    
    if (isValidInput(referenceString, frameCount)) {
      const result = {
        steps: [],
        pageFaults: 0
      };

      switch (algorithm) {
        case 'fifo':
          simulateFIFO(numbers, frameCount, result);
          break;
        case 'lru':
          simulateLRU(numbers, frameCount, result);
          break;
        case 'optimal':
          simulateOptimal(numbers, frameCount, result);
          break;
        default:
          break;
      }

      setSimulationSteps(result.steps);
      setPageFaults(result.pageFaults);
    } else {
      alert('Please enter valid input!');
    }
  };

  return (
    <motion.div 
      className="simulator-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="input-section">
        <div className="input-group">
          <label htmlFor="reference-string">Reference String (comma-separated):</label>
          <input
            type="text"
            id="reference-string"
            value={referenceString}
            onChange={(e) => setReferenceString(e.target.value)}
            placeholder="e.g., 1,2,3,4,1,2,5,1,2,3,4,5"
          />
        </div>

        <div className="input-group">
          <label htmlFor="frame-count">Number of Frames (1-10):</label>
          <input
            type="number"
            id="frame-count"
            value={frameCount}
            onChange={(e) => setFrameCount(parseInt(e.target.value))}
            min="1"
            max="10"
          />
        </div>

        <div className="input-group">
          <label htmlFor="algorithm">Algorithm:</label>
          <select
            id="algorithm"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
          >
            <option value="fifo">First In First Out (FIFO)</option>
            <option value="lru">Least Recently Used (LRU)</option>
            <option value="optimal">Optimal</option>
          </select>
        </div>

        <button onClick={handleSimulate} className="simulate-button">
          Simulate
        </button>
      </div>

      <div className="results-section">
        <h2>Page Faults: {pageFaults}</h2>
        
        <div className="simulation-steps">
          <AnimatePresence>
            {simulationSteps.map((step, index) => (
              <motion.div
                key={index}
                className="step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3>Step {index + 1}: Page {step.page}</h3>
                <div className="frames">
                  {step.frames.map((frame, frameIndex) => (
                    <motion.div
                      key={frameIndex}
                      className={`frame ${step.fault && frame === step.page ? 'fault' : ''}`}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {frame === null ? '-' : frame}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default PageReplacementSimulator; 