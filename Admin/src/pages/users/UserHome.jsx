import React, { useState } from 'react';
import UserTable from './UserDashboard';
import Sidebar from '../../components/sideBar/SideBar';

function AdminHome() {
  // Track sidebar collapsed state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Handle sidebar toggle
  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Pass the toggle handler to Sidebar */}
      <Sidebar onToggle={handleSidebarToggle} />
      
      {/* Main content area with dynamic margin based on sidebar state */}
      <div 
        className={`flex-1 overflow-auto transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <div className="py-6">
          <UserTable />
        </div>
      </div>
    </div>
  );
}

export default AdminHome;