// // import { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import { Monitor, Plus, Trash2, Search } from 'lucide-react';

// // const Computers = () => {
// //   const [pcs, setPcs] = useState([]);
// //   const [search, setSearch] = useState("");
// //   const [newPcNumber, setNewPcNumber] = useState("");
// //   const API_BASE = 'http://localhost:5000/api/computers';

// //   const fetchPcs = async () => {
// //     const res = await axios.get(`${API_BASE}?search=${search}`);
// //     setPcs(res.data);
// //   };

// //   useEffect(() => { fetchPcs(); }, [search]);

// //   const handleAddPc = async (e) => {
// //     e.preventDefault();
// //     try {
// //       await axios.post(API_BASE, { pcNumber: newPcNumber });
// //       setNewPcNumber("");
// //       fetchPcs();
// //     } catch (err) { alert(err.response?.data?.message || "Error adding PC"); }
// //   };

// //   const handleDelete = async (id) => {
// //     if (window.confirm("Are you sure you want to delete this PC?")) {
// //       await axios.delete(`${API_BASE}/${id}`);
// //       fetchPcs();
// //     }
// //   };

// //   const toggleStatus = async (pc) => {
// //     const nextStatus = pc.status === 'Maintenance' ? 'Available' : 'Maintenance';
// //     await axios.patch(`${API_BASE}/${pc._id}`, { status: nextStatus });
// //     fetchPcs();
// //   };

// //   return (
// //     <div className="computers-page">
// //       {/* TOP HEADER & ADD PC FORM */}
// //       <div className="glass-card header-row">
// //         <form onSubmit={handleAddPc} className="add-pc-form">
// //           <input 
// //             type="number" 
// //             placeholder="New PC Number" 
// //             value={newPcNumber} 
// //             onChange={(e) => setNewPcNumber(e.target.value)} 
// //             required 
// //           />
// //           <button type="submit"><Plus size={18}/> Add Desktop</button>
// //         </form>

// //         <div className="search-bar">
// //           <Search size={18}/>
// //           <input 
// //             type="text" 
// //             placeholder="Search by PC Number..." 
// //             value={search} 
// //             onChange={(e) => setSearch(e.target.value)}
// //           />
// //         </div>
// //       </div>

// //       {/* PC LIST TABLE */}
// //       <div className="glass-card" style={{marginTop:'20px'}}>
// //         <table className="modern-table">
// //           <thead>
// //             <tr>
// //               <th>ID</th>
// //               <th>Hardware</th>
// //               <th>Status</th>
// //               <th>Current User</th>
// //               <th>Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {pcs.map(pc => (
// //               <tr key={pc._id}>
// //                 <td>#{pc.pcNumber}</td>
// //                 <td><Monitor size={20} color="#64748b"/></td>
// //                 <td>
// //                   <span className={`status-pill ${pc.status}`}>{pc.status}</span>
// //                 </td>
// //                 <td>{pc.currentSession?.studentName || "None"}</td>
// //                 <td className="table-actions">
// //                   <button 
// //                     className="update-btn" 
// //                     onClick={() => toggleStatus(pc)}
// //                     title="Toggle Maintenance"
// //                   >
// //                     {pc.status === 'Maintenance' ? 'Restore' : 'Set Broken'}
// //                   </button>
// //                   <button 
// //                     className="delete-btn-icon" 
// //                     onClick={() => handleDelete(pc._id)}
// //                     title="Delete PC"
// //                   >
// //                     <Trash2 size={16}/>
// //                   </button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Computers;
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Monitor, Plus, Trash2, Search, Wrench, CheckCircle, AlertCircle, Cpu } from 'lucide-react';

// const Computers = () => {
//   const [pcs, setPcs] = useState([]);
//   const [search, setSearch] = useState("");
//   const [newPcNum, setNewPcNum] = useState("");

//   const API_BASE = 'http://localhost:5000/api/computers';

//   // Fetch PCs
//   const fetchPcs = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}?search=${search}`);
//       setPcs(res.data);
//     } catch (err) {
//       console.error("Fetch error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchPcs();
//   }, [search]);

//   // Add new PC
//   const handleAdd = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(API_BASE, { pcNumber: newPcNum });
//       setNewPcNum("");
//       fetchPcs();
//     } catch (err) {
//       alert(err.response?.data?.message || "Error adding PC");
//     }
//   };

//   // Toggle status
//   const handleToggle = async (id, currentStatus) => {
//     try {
//       // Optional safety: don't toggle if occupied
//       if (currentStatus === 'Occupied') return;

//       const nextStatus =
//         currentStatus === 'Maintenance' ? 'Available' : 'Maintenance';

//       await axios.patch(`${API_BASE}/${id}`, { status: nextStatus });
//       fetchPcs();
//     } catch (err) {
//       console.error("Toggle error:", err);
//     }
//   };

//   // Delete PC
//   const handleDelete = async (id) => {
//     if (window.confirm("Delete this hardware from system?")) {
//       try {
//         await axios.delete(`${API_BASE}/${id}`);
//         fetchPcs();
//       } catch (err) {
//         console.error("Delete error:", err);
//       }
//     }
//   };

//   // Stats
//   const total = pcs.length;
//   const online = pcs.filter(p => p.status !== 'Maintenance').length;
//   const broken = pcs.filter(p => p.status === 'Maintenance').length;

//   return (
//     <div className="computers-container">

//       {/* 1. STATISTICS */}
//       <div className="stats-row">
//         <div className="stat-card">
//           <div className="stat-icon blue"><Monitor /></div>
//           <div>
//             <h4>{total}</h4>
//             <p>Total Desktops</p>
//           </div>
//         </div>

//         <div className="stat-card">
//           <div className="stat-icon green"><CheckCircle /></div>
//           <div>
//             <h4>{online}</h4>
//             <p>Operational</p>
//           </div>
//         </div>

//         <div className="stat-card">
//           <div className="stat-icon red"><AlertCircle /></div>
//           <div>
//             <h4>{broken}</h4>
//             <p>In Maintenance</p>
//           </div>
//         </div>
//       </div>

//       {/* 2. ACTION BAR */}
//       <div className="actions-bar glass-card">
//         <form onSubmit={handleAdd} className="add-box">
//           <Plus size={18} />
//           <input
//             type="number"
//             placeholder="Add New PC Number"
//             value={newPcNum}
//             onChange={(e) => setNewPcNum(e.target.value)}
//             required
//           />
//           <button type="submit">Register PC</button>
//         </form>

//         <div className="search-box-modern">
//           <Search size={18} />
//           <input
//             type="text"
//             placeholder="Quick Search ID..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* 3. PC GRID */}
//       <div className="pc-management-grid">
//         {pcs.map(pc => (
//           <div key={pc._id} className={`manage-pc-card ${pc.status}`}>

//             {/* TOP */}
//             <div className="card-top">
//               <span className="pc-id-label">UNIT {pc.pcNumber}</span>
//               <span className={`dot ${pc.status}`}></span>
//             </div>

//             {/* MIDDLE */}
//             <div className="card-mid">
//               <div className="hardware-icon">
//                 <Cpu size={32} />
//               </div>
//               <div className="status-text">{pc.status}</div>
//               <small>
//                 {pc.currentSession
//                   ? `Active: ${pc.currentSession.studentName}`
//                   : "No Active User"}
//               </small>
//             </div>

//             {/* ACTIONS */}
//             <div className="card-actions">
//               <button
//                 className="btn-tool"
//                 onClick={() => handleToggle(pc._id, pc.status)}
//                 title="Toggle Maintenance"
//               >
//                 <Wrench size={16} />
//                 {pc.status === 'Maintenance' ? 'Repair' : 'Fixing'}
//               </button>

//               <button
//                 className="btn-trash"
//                 onClick={() => handleDelete(pc._id)}
//               >
//                 <Trash2 size={16} />
//               </button>
//             </div>

//           </div>
//         ))}
//       </div>

//     </div>
//   );
// };

// export default Computers;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Monitor, Plus, Trash2, Search, Wrench, CheckCircle, AlertCircle, Cpu } from 'lucide-react';

const Computers = () => {
  const [pcs, setPcs] = useState([]);
  const [search, setSearch] = useState("");
  const [newPcNum, setNewPcNum] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const API_BASE = 'http://localhost:5000/api/computers';

  const fetchPcs = async () => {
    try {
      const res = await axios.get(`${API_BASE}?search=${search}`);
      setPcs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchPcs(); }, [search]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_BASE, { pcNumber: newPcNum });
      setNewPcNum("");
      fetchPcs();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const handleToggle = async (id, currentStatus) => {
    if (currentStatus === 'Occupied') return;

    const nextStatus =
      currentStatus === 'Maintenance' ? 'Available' : 'Maintenance';

    await axios.patch(`${API_BASE}/${id}`, { status: nextStatus });
    fetchPcs();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this computer?")) {
      await axios.delete(`${API_BASE}/${id}`);
      fetchPcs();
    }
  };

  // Stats
  const total = pcs.length;
  const available = pcs.filter(p => p.status === 'Available').length;
  const maintenance = pcs.filter(p => p.status === 'Maintenance').length;

  return (
    <div className="computers-container">

      {/* STATS */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon blue"><Monitor /></div>
          <div><h4>{total}</h4><p>Total Computers</p></div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green"><CheckCircle /></div>
          <div><h4>{available}</h4><p>Available</p></div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red"><AlertCircle /></div>
          <div><h4>{maintenance}</h4><p>Maintenance</p></div>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="actions-bar glass-card">
        <form onSubmit={handleAdd} className="add-box">
          <Plus size={18} />
          <input
            type="number"
            placeholder="Add Computer Number"
            value={newPcNum}
            onChange={(e) => setNewPcNum(e.target.value)}
            required
          />
          <button type="submit">Add</button>
        </form>

        <div className="search-box-modern">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* FILTER */}
        <div className="filter-box">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* GRID */}
      <div className="pc-management-grid">
        {pcs
          .filter(pc => statusFilter === "All" || pc.status === statusFilter)
          .map(pc => (
            <div key={pc._id} className={`manage-pc-card ${pc.status}`}>

              <div className="card-top">
                <span className="pc-id-label">COMPUTER {pc.pcNumber}</span>
                <span className={`dot ${pc.status}`}></span>
              </div>

              <div className="card-mid">
                <div className="hardware-icon">
                  <Cpu size={32} />
                </div>

                <div className={`status-text ${pc.status}`}>
                  {pc.status}
                </div>

                <small>
                  {pc.currentSession
                    ? `Active: ${pc.currentSession.studentName}`
                    : "No Active User"}
                </small>
              </div>

              <div className="card-actions">
                <button
                  className="btn-tool"
                  onClick={() => handleToggle(pc._id, pc.status)}
                >
                  <Wrench size={16} />
                  {pc.status === 'Maintenance' ? 'Repair' : 'Fix'}
                </button>

                <button
                  className="btn-trash"
                  onClick={() => handleDelete(pc._id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>

            </div>
          ))}
      </div>

    </div>
  );
};

export default Computers;