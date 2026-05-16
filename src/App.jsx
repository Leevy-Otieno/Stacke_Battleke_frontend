import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Auth from './pages/Auth'; // Import the new combined module page block
import Dashboard from './pages/Dashboard';
import Arena from './pages/Arena';
import Groups from './pages/Groups';
import Leaderboards from './pages/Leaderboards';
import Profile from './pages/Profile';
import Challenge from './pages/Challenge';

export default function App() {
  // Set default core route configuration straight to auth screen
  const [currentPage, setCurrentPage] = useState('auth');
  
  // Storage profile container mapping properties
  const [userData, setUserData] = useState({
    name: "Guest Player",
    email: "",
    institution: "Academic Institution",
    points: "0",
    globalRank: "Unranked",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
  });

  // Handle unauthenticated views dynamically inside a cleaner conditional router block
  if (currentPage === 'auth') {
    return <Auth setCurrentPage={setCurrentPage} setUserData={setUserData} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard setCurrentPage={setCurrentPage} userData={userData} />;
      case 'arena': return <Arena setCurrentPage={setCurrentPage} />;
      case 'groups': return <Groups />;
      case 'leaderboards': return <Leaderboards />;
      case 'profile': return <Profile userData={userData} />;
      case 'challenge': return <Challenge />;
      default: return <Dashboard setCurrentPage={setCurrentPage} userData={userData} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar navigation handling trigger */}
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {/* Shared navigation block template rendering parameters */}
      <Navbar title={currentPage} userData={userData} />
      
      <main className="pl-72 pr-8 pt-24 pb-8 min-h-screen">
        {renderPage()}
      </main>
    </div>
  );
}