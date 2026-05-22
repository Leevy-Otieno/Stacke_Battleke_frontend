import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminDashboard = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-100">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold">Command Center</h2>
          <p className="text-slate-400 text-xs mt-1">Stack-Battle KE Admin</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { path: '/admin', label: 'Overview' },
            { path: '/admin/users', label: 'Manage Users' },
            { path: '/admin/challenges', label: 'Challenges' }
          ].map((item) => (
            <Link key={item.path} to={item.path} 
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActive(item.path) ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};
export default AdminDashboard;