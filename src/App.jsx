import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home as HomeIcon, Monitor, Users, LogOut } from 'lucide-react';
import Home from './pages/Home';
import Computers from './pages/Computers';
import Students from './pages/Students';
import './App.css';

function App() {
  const location = useLocation();

  return (
    <div className="dashboard-wrapper">
      {/* SIDEBAR NAVIGATION */}
      <nav className="sidebar">
        <div className="sidebar-logo">
          <h2>RA System</h2>
        </div>
        <div className="sidebar-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            <HomeIcon size={20} /> <span>Dashboard</span>
          </Link>
          <Link to="/computers" className={location.pathname === '/computers' ? 'active' : ''}>
            <Monitor size={20} /> <span>Computers</span>
          </Link>
          <Link to="/students" className={location.pathname === '/students' ? 'active' : ''}>
            <Users size={20} /> <span>History</span>
          </Link>
        </div>
        <div className="sidebar-footer">
          <button className="logout-btn"><LogOut size={20} /> Logout</button>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        <header className="top-header">
          <h1>{location.pathname === '/' ? 'Controller dashboard' : 
               location.pathname === '/computers' ? 'Hardware Management' : 'Usage History'}</h1>
        </header>
        
        <div className="page-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/computers" element={<Computers />} />
            <Route path="/students" element={<Students />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;