import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminDashboard = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Heavy Left Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-2xl font-bold tracking-tight text-white">Command Center</h2>
          <p className="text-slate-400 text-sm mt-1">Stack-Battle KE</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link 
            to="/admin" 
            className={`block px-4 py-3 rounded transition-colors ${isActive('/admin') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            📊 Overview Stats
          </Link>
          <Link 
            to="/admin/users" 
            className={`block px-4 py-3 rounded transition-colors ${isActive('/admin/users') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            👥 Manage Users
          </Link>
          <Link 
            to="/admin/challenges" 
            className={`block px-4 py-3 rounded transition-colors ${isActive('/admin/challenges') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            💻 Challenges
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* The Outlet is where ManageUsers or AdminChallenges will be injected */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;