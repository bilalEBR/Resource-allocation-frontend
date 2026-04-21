// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import CircularTimer from '../components/CircularTimer';
// import { Trash2, Clock, UserPlus } from 'lucide-react';

// const Home = () => {
//   const [pcs, setPcs] = useState([]);
//   const [queue, setQueue] = useState([]);
//   const [formData, setFormData] = useState({ studentName: '', studentId: '' });
//   const API_BASE = 'http://localhost:5000/api/library';

//   const refresh = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/status`);
//       setPcs(res.data.pcs);
//       setQueue(res.data.queue);
//     } catch (err) { console.log(err); }
//   };

//   useEffect(() => {
//     refresh();
//     const inv = setInterval(refresh, 5000);
//     return () => clearInterval(inv);
//   }, []);

//   const handleAssign = async (e) => {
//     e.preventDefault();
//     await axios.post(`${API_BASE}/assign`, formData);
//     setFormData({ studentName: '', studentId: '' });
//     refresh();
//   };

//   return (
//     <div className="home-grid">
//       {/* Left Panel */}
//       <div className="left-panel">
//         <div className="glass-card" style={{marginBottom: '20px'}}>
//           <h3 style={{display:'flex', alignItems:'center', gap:'10px'}}><UserPlus size={20}/> New Student</h3>
//           <form onSubmit={handleAssign} className="modern-form">
//             <input type="text" placeholder="Student Full Name" value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})} required />
//             <input type="text" placeholder="Student ID Number" value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} required />
//             <button type="submit">Assign Desktop</button>
//           </form>
//         </div>

//         <div className="glass-card">
//           <h3><Clock size={20}/> Waiting Queue</h3>
//           {queue.length === 0 ? <p style={{color:'#94a3b8'}}>No students waiting.</p> : 
//             queue.map((q, i) => (
//               <div key={i} style={{padding:'10px', borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between'}}>
//                 <span>{q.studentName} <br/><small>PC {q.pcNumber}</small></span>
//                 <button style={{background:'none', color:'red', border:'none'}} onClick={() => {/* Delete Logic */}}><Trash2 size={16}/></button>
//               </div>
//             ))
//           }
//         </div>
//       </div>

//       {/* Right Panel - PC Grid */}
//       <div className="pc-display-grid">
//         {pcs.map(pc => (
//           <div key={pc._id} className={`pc-glass-card ${pc.status}`}>
//             <div className="pc-tag">PC {pc.pcNumber}</div>
            
//             <div style={{marginTop:'20px'}}>
//               {pc.status === 'Available' ? (
//                 <div style={{padding:'40px 0'}}>
//                    <Monitor size={40} color="#cbd5e1" />
//                    <p style={{color:'#10b981', fontWeight:'bold'}}>AVAILABLE</p>
//                 </div>
//               ) : (
//                 <div className="pc-occupied">
//                   <CircularTimer endTime={pc.currentSession?.endTime} status={pc.currentSession?.status} />
//                   <p style={{fontWeight:'bold', margin:'5px 0'}}>{pc.currentSession?.studentName}</p>
                  
//                   {pc.currentSession?.status === 'Queued' ? (
//                     <button className="start-btn" style={{background:'#10b981', color:'white', border:'none', padding:'5px 15px', borderRadius:'5px'}} onClick={() => axios.patch(`${API_BASE}/start/${pc.currentSession._id}`).then(refresh)}>START</button>
//                   ) : (
//                     <button className="finish-btn" style={{background:'#ef4444', color:'white', border:'none', padding:'5px 15px', borderRadius:'5px'}} onClick={() => axios.post(`${API_BASE}/release/${pc.pcNumber}`).then(refresh)}>FINISH</button>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // Simple Monitor icon for the empty state
// const Monitor = ({size, color}) => (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
// );

// export default Home;

import { useState, useEffect } from 'react';
import axios from 'axios';
import CircularTimer from '../components/CircularTimer';
import { Trash2, Clock, Play, Pause, Monitor, UserPlus, AlertCircle } from 'lucide-react';

const Home = () => {
  const [pcs, setPcs] = useState([]);
  const [queue, setQueue] = useState([]);
  const [formData, setFormData] = useState({ studentName: '', studentId: '' });
  
  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [activePcNum, setActivePcNum] = useState(null);

  const API_BASE = 'http://localhost:5000/api/library';

  const refresh = async () => {
    try {
      const res = await axios.get(`${API_BASE}/status`);
      setPcs(res.data.pcs);
      setQueue(res.data.queue);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    await axios.post(`${API_BASE}/assign`, formData);
    setFormData({ studentName: '', studentId: '' });
    refresh();
  };

  const handleStart = async (id) => {
    await axios.patch(`${API_BASE}/start/${id}`);
    refresh();
  };

  const handlePause = async (id) => {
    await axios.patch(`${API_BASE}/pause/${id}`);
    refresh();
  };

  const handleFinishClick = (pcNum) => {
    setActivePcNum(pcNum);
    setShowModal(true);
  };

  const confirmFinish = async () => {
    await axios.post(`${API_BASE}/release/${activePcNum}`);
    setShowModal(false);
    refresh();
  };

  const handleRemoveQueue = async (id) => {
    if (window.confirm("Remove this student from the queue?")) {
      await axios.delete(`${API_BASE}/session/${id}`);
      refresh();
    }
  };

  return (
    <div className="home-grid">
      {/* LEFT PANEL: Form and Queue */}
      <div className="left-panel">
        <div className="glass-card">
          <h3 className="panel-title"><UserPlus size={18}/> Register Student</h3>
          <form onSubmit={handleAssign} className="modern-form">
            <input type="text" placeholder="Student Name" value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})} required />
            <input type="text" placeholder="ID Number" value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} required />
            <button type="submit">Assign Desktop</button>
          </form>
        </div>

       <div className="glass-card queue-container">
  <h3 className="panel-title"><Clock size={18}/> Waiting List</h3>
  {queue.length === 0 ? <p className="empty-msg">No students in queue</p> : 
    queue.map((q) => (
      <div key={q._id} className="queue-item-detailed">
        {/* PC BADGE: Shows PC 1, PC 2, etc */}
        <div className="pc-mini-badge">PC {q.pcNumber}</div>
        
        <div className="q-info">
          <div className="q-name">{q.studentName}</div>
          <div className="q-subtext">Following: <strong>{q.waitingForStudentName || '...'}</strong></div>
          <div className="q-subtext">Est. Start: {new Date(q.estimatedStartTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        </div>
        
        <button onClick={() => handleRemoveQueue(q._id)} className="q-del-btn">
          <Trash2 size={14}/>
        </button>
      </div>
    ))
  }
</div>
      </div>

      {/* RIGHT PANEL: PC Grid */}
      <div className="pc-display-grid">
        {pcs.map(pc => (
          <div key={pc._id} className={`pc-glass-card ${pc.status}`}>
            <div className="pc-tag">PC {pc.pcNumber}</div>
            
            {pc.status === 'Available' ? (
              <div className="pc-vacant">
                <Monitor size={40} className="icon-bg"/>
                <p>AVAILABLE</p>
              </div>
            ) : (
              <div className="pc-occupied">
                <CircularTimer 
                  endTime={pc.currentSession?.endTime} 
                  status={pc.currentSession?.status} 
                  isPaused={pc.currentSession?.isPaused}
                />
                <div className="student-info">
                   <strong>{pc.currentSession?.studentName}</strong>
                   <small>{pc.currentSession?.studentId}</small>
                </div>
                
                <div className="pc-actions">
                  {pc.currentSession?.status === 'Queued' ? (
                    <button className="btn-start" onClick={() => handleStart(pc.currentSession._id)}>
                       <Play size={14}/> START
                    </button>
                  ) : (
                    <>
                      <button className={pc.currentSession?.isPaused ? "btn-resume" : "btn-pause"} onClick={() => handlePause(pc.currentSession._id)}>
                        {pc.currentSession?.isPaused ? <><Play size={14}/> RESUME</> : <><Pause size={14}/> PAUSE</>}
                      </button>
                      <button className="btn-finish" onClick={() => handleFinishClick(pc.pcNumber)}>FINISH</button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* FINISH CONFIRMATION MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <AlertCircle size={40} color="#ef4444" />
            <h2>End Session?</h2>
            <p>Are you sure student on <strong>PC {activePcNum}</strong> has finished? This will free the computer for the next student.</p>
            <div className="modal-actions">
              <button className="confirm-finish" onClick={confirmFinish}>Confirm Finish</button>
              <button className="cancel-finish" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;