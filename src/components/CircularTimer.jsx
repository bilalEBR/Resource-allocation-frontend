// import { useState, useEffect } from 'react';

// const CircularTimer = ({ endTime, status }) => {
//   const [timeLeft, setTimeLeft] = useState(0);

//   useEffect(() => {
//     if (status !== 'Active') return;
//     const timer = setInterval(() => {
//       const now = new Date().getTime();
//       const end = new Date(endTime).getTime();
//       setTimeLeft(Math.max(0, end - now));
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [endTime, status]);

//   const formatTime = (ms) => {
//     const s = Math.floor(ms / 1000);
//     const m = Math.floor(s / 60);
//     const h = Math.floor(m / 60);
//     return `${h}:${(m % 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
//   };

//   const percentage = (timeLeft / (2 * 60 * 60 * 1000)) * 100;
//   const color = percentage < 10 ? '#ef4444' : percentage < 30 ? '#f59e0b' : '#10b981';

//   return (
//     <div className="circular-timer">
//       <svg viewBox="0 0 36 36" className="circular-chart">
//         <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
//         <path className="circle" stroke={color} strokeDasharray={`${percentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
//         <text x="18" y="20.35" className="percentage">{status === 'Queued' ? 'WAIT' : formatTime(timeLeft)}</text>
//       </svg>
//     </div>
//   );
// };

// export default CircularTimer;

import { useState, useEffect } from 'react';

const CircularTimer = ({ endTime, status, isPaused }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    // If it's not active or it is paused, don't tick
    if (status !== 'Active' || isPaused) {
      if (endTime) {
        const remaining = Math.max(0, new Date(endTime).getTime() - new Date().getTime());
        setTimeLeft(remaining);
      }
      return;
    }

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const diff = Math.max(0, end - now);
      setTimeLeft(diff);
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, status, isPaused]);

  const formatTime = (ms) => {
    const totalSecs = Math.floor(ms / 1000);
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${h > 0 ? h + ':' : ''}${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  // Percentage based on a 2-hour max (7200000 ms)
  const percentage = (timeLeft / 7200000) * 100;
  const color = isPaused ? "#f59e0b" : percentage < 10 ? '#ef4444' : percentage < 30 ? '#facc15' : '#10b981';

  return (
    <div className="timer-box">
      <svg viewBox="0 0 36 36" className="circular-chart">
        <path className="circle-bg"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none" stroke="#eee" strokeWidth="2"
        />
        <path className="circle"
          strokeDasharray={`${percentage}, 100`}
          stroke={color}
          fill="none" strokeWidth="3" strokeLinecap="round"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          style={{ transition: 'stroke-dasharray 1s linear, stroke 0.3s' }}
        />
        <text x="18" y="21" className="timer-text" fill={color} fontSize="7" fontWeight="bold" textAnchor="middle">
          {isPaused ? "PAUSED" : formatTime(timeLeft)}
        </text>
      </svg>
    </div>
  );
};

export default CircularTimer;