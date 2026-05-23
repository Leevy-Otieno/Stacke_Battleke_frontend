// src/pages/admin/AdminLayout.jsx
// Wraps all /admin/* pages with the fixed sidebar + scrollable main area.
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminLayout = () => (
  <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
    <AdminSidebar />

    {/* Content shifted right of the fixed 240px sidebar */}
    <main style={{
      flex: 1,
      marginLeft: '240px',
      padding: '2rem',
      overflowY: 'auto',
      minHeight: '100vh',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Outlet />
      </div>
    </main>
  </div>
);

export default AdminLayout;