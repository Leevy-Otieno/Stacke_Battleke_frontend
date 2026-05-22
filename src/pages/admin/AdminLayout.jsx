// src/pages/admin/AdminLayout.jsx
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      {/* We add margin-left 64 to account for the fixed 64 (w-64) sidebar */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Outlet is where AdminDashboard, AdminUsers, etc. will render */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;