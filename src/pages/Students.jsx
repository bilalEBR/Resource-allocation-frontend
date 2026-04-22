import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Calendar, ChevronLeft, ChevronRight, User, Hash, Monitor } from 'lucide-react';

const Students = () => {
  const [data, setData] = useState({ history: [], totalPages: 0, totalRecords: 0 });
  const [filters, setFilters] = useState({ search: "", date: "", page: 1 });
  const API_BASE = 'http://localhost:5000/api/history';

  const fetchHistory = async () => {
    try {
      const res = await axios.get(API_BASE, { params: filters });
      setData(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchHistory(); }, [filters]);

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  return (
    <div className="history-page">
      {/* 1. FILTER BAR */}
      <div className="glass-card filter-container">
        <div className="filter-group">
          <div className="search-wrapper">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search Student Name or ID..." 
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            />
          </div>
          <div className="date-wrapper">
            <Calendar size={18} />
            <input 
              type="date" 
              onChange={(e) => setFilters({ ...filters, date: e.target.value, page: 1 })}
            />
          </div>
        </div>
        <div className="record-count">
           Found <strong>{data.totalRecords}</strong> Records
        </div>
      </div>

      {/* 2. DATA TABLE */}
      <div className="glass-card table-container" style={{marginTop: '25px'}}>
        <table className="history-table">
          <thead>
            <tr>
              <th><User size={14}/> Student Name</th>
              <th><Hash size={14}/> Student ID</th>
              <th><Monitor size={14}/> PC #</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.history.map((h) => (
              <tr key={h._id}>
                <td className="bold">{h.studentName}</td>
                <td><code className="id-badge">{h.studentId}</code></td>
                <td><span className="pc-pill">PC {h.pcNumber}</span></td>
                <td>{new Date(h.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</td>
                <td>{new Date(h.endTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</td>
                <td className="date-cell">{new Date(h.startTime).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 3. PAGINATION CONTROLS */}
        <div className="pagination">
          <button 
            disabled={filters.page === 1} 
            onClick={() => handlePageChange(filters.page - 1)}
          >
            <ChevronLeft size={18}/> Previous
          </button>
          
          <span className="page-info">
            Page <strong>{filters.page}</strong> of {data.totalPages || 1}
          </span>

          <button 
            disabled={filters.page >= data.totalPages} 
            onClick={() => handlePageChange(filters.page + 1)}
          >
            Next <ChevronRight size={18}/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Students;