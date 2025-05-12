import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/PageReplacementSimulator.css';

const PageReplacementSimulator = () => {
  const [referenceString, setReferenceString] = useState('');
  const [frameCount, setFrameCount] = useState(3);
  const [algorithm, setAlgorithm] = useState('fifo');
  const [simulationSteps, setSimulationSteps] = useState([]);
  const [pageFaults, setPageFaults] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [analysisData, setAnalysisData] = useState([]);
  const simulationRef = useRef(null);

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

  const calculateAnalysisData = (steps) => {
    return steps.map((step, index) => ({
      step: index + 1,
      page: step.page,
      frames: [...step.frames],
      fault: step.fault,
      hit: !step.fault,
      hitRate: ((index + 1 - steps.slice(0, index + 1).filter(s => s.fault).length) / (index + 1)) * 100
    }));
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
      setAnalysisData(calculateAnalysisData(result.steps));
      setCurrentStep(0);
      setIsPlaying(false);
    } else {
      alert('Please enter valid input!');
    }
  };

  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < simulationSteps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, 1000);
    } else if (currentStep >= simulationSteps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, simulationSteps.length]);

  useEffect(() => {
    if (simulationRef.current) {
      simulationRef.current.scrollTop = simulationRef.current.scrollHeight;
    }
  }, [currentStep]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStepForward = () => {
    if (currentStep < simulationSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
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
        <div className="statistics-panel">
          <h2>Statistics</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <h3>Page Faults</h3>
              <p>{pageFaults}</p>
            </div>
            <div className="stat-item">
              <h3>Hit Rate</h3>
              <p>{((simulationSteps.length - pageFaults) / simulationSteps.length * 100).toFixed(2)}%</p>
            </div>
            <div className="stat-item">
              <h3>Fault Rate</h3>
              <p>{(pageFaults / simulationSteps.length * 100).toFixed(2)}%</p>
            </div>
          </div>
        </div>

        <div className="simulation-controls">
          <button onClick={handleReset} className="control-button">
            Reset
          </button>
          <button onClick={handleStepBackward} className="control-button" disabled={currentStep === 0}>
            Previous
          </button>
          <button onClick={handlePlayPause} className="control-button play-button">
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button onClick={handleStepForward} className="control-button" disabled={currentStep === simulationSteps.length - 1}>
            Next
          </button>
        </div>

        <div className="simulation-view" ref={simulationRef}>
          <AnimatePresence>
            {simulationSteps.slice(0, currentStep + 1).map((step, index) => (
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

        <div className="analysis-table">
          <h2>Detailed Analysis</h2>
          <table>
            <thead>
              <tr>
                <th>Step</th>
                <th>Page</th>
                <th>Frames</th>
                <th>Status</th>
                <th>Hit Rate</th>
              </tr>
            </thead>
            <tbody>
              {analysisData.map((data, index) => (
                <tr key={index} className={data.fault ? 'fault-row' : 'hit-row'}>
                  <td>{data.step}</td>
                  <td>{data.page}</td>
                  <td>{data.frames.join(', ')}</td>
                  <td>{data.fault ? 'Fault' : 'Hit'}</td>
                  <td>{data.hitRate.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default PageReplacementSimulator; 