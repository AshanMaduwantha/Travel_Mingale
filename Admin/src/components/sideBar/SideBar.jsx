import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ onToggle }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  // Notify parent component when collapsed state changes
  useEffect(() => {
    if (onToggle) {
      onToggle(collapsed);
    }
  }, [collapsed, onToggle]);

  // Define menu items to make code more maintainable
  const menuItems = [
    { path: "/admin", label: "Manage Hotels", icon: "🏨" },
    { path: "/adminDashboard", label: "Manage Bookings", icon: "🛏️" },
    { path: "/usermanage", label: "Manage Users", icon: "👥" },
    { path: "/reviews", label: "Manage Reviews", icon: "⭐" },
  ];

  // Check if current path matches menu item path
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div 
      className={`${
        collapsed ? "w-16" : "w-64"
      } h-screen bg-gradient-to-b from-blue-800 to-blue-900 text-white fixed left-0 top-0 flex flex-col transition-all duration-300 shadow-xl`}
    >
      {/* Header with toggle button */}
      <div className="flex items-center justify-between p-4 border-b border-blue-700">
        {!collapsed && (
          <h2 className="text-xl font-bold text-white">Admin Panel</h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`${
            collapsed ? "mx-auto" : ""
          } p-2 rounded-md bg-blue-700 hover:bg-blue-600 transition-colors`}
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* User profile section */}
      <div className={`p-4 border-b border-blue-700 ${collapsed ? "flex justify-center" : ""}`}>
        {collapsed ? (
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">A</div>
        ) : (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">A</div>
            <div>
              <div className="font-medium">Admin User</div>
              <div className="text-xs text-blue-300">admin23@gmail.com</div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path} className="mb-1 px-3">
              <Link
                to={item.path}
                className={`flex items-center py-3 px-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-blue-600 text-white"
                    : "text-blue-100 hover:bg-blue-700"
                }`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-blue-700">
        <Link
          to="/logout"
          className="flex items-center py-2 px-3 rounded-lg text-red-300 hover:bg-red-800 hover:text-white transition-colors"
        >
          <span className="text-xl mr-3">🚪</span>
          {!collapsed && <span>Logout</span>}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;