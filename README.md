# 🧠 OS Page Replacement Simulator
### A High-Performance Visualizer for Operating System Memory Management

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

**Page Replacement Simulator** is a sophisticated educational tool designed to demystify how Operating Systems manage physical memory. Built with **React** and **Framer Motion**, it provides an interactive, step-by-step visualization of complex paging algorithms, helping students and engineers understand memory hits, faults, and replacement strategies in real-time.

---

## 🚀 Supported Algorithms

### ⬅️ First-In, First-Out (FIFO)
*   **Logic**: Replaces the oldest page in memory.
*   **Visualization**: Clear tracking of the arrival queue and replacement markers.
*   **Analysis**: Demonstrates Belady's Anomaly and simple queue-based management.

### 🕒 Least Recently Used (LRU)
*   **Logic**: Replaces the page that has not been used for the longest period of time.
*   **Visualization**: Real-time "recency" counters and stack-based replacement logic.
*   **Analysis**: Shows how temporal locality is leveraged for better hit rates.

### 🎯 Optimal Algorithm (OPT/MIN)
*   **Logic**: Replaces the page that will not be used for the farthest period in the future.
*   **Visualization**: Look-ahead logic highlighting why this algorithm achieves the lowest possible page fault rate.
*   **Analysis**: Used as a theoretical benchmark for evaluating FIFO and LRU efficiency.

---

## 🎨 Interactive Capabilities
*   **Step-by-Step Playback**: Play, pause, and manually step through the reference string to analyze every state change.
*   **Dynamic Configuration**: Change the number of frames (1-10) and input custom reference strings on-the-fly.
*   **Real-Time Analytics**: Live calculation of **Page Faults**, **Hit Rate**, and **Fault Percentage** with professional-grade charts.

---

## 🛠️ Technology Stack
*   **Frontend Core**: React 18 (State-driven simulation engine)
*   **Animations**: Framer Motion (Smooth layout transitions and entry/exit effects)
*   **Styling**: Custom CSS Modules with modern layout patterns
*   **State**: Hooks-based architecture for atomic simulation updates

---

## ⚡ Performance Engineering
*   **Memoized Simulations**: Page replacement logic is decoupled from rendering to ensure buttery-smooth performance even with long reference strings.
*   **Infinite Scrolback**: The simulation view maintains a complete history of states, optimized for minimal DOM overhead as the simulation progresses.
*   **Validated Inputs**: Robust error handling for malformed reference strings and out-of-bounds frame counts.

---

## 📦 Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/NKcoder5/page_algorithm_simulator.git
   cd page_algorithm_simulator
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the simulator**:
   ```bash
   npm start
   ```

4. **Access the Tool**:
   *   Open `http://localhost:3000` in your browser.
   *   Enter a reference string like `1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5`.
   *   Select an algorithm and click **Simulate**.

---

## 📄 License
Licensed under the **MIT License**.

---
*Created with ❤️ for Advanced Operating System Education.*
