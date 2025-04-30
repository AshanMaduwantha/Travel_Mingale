import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, AlertCircle, Check, Trash2, UserCheck, UserX } from "lucide-react";

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Fetch users from backend on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:4000/api/user/all", {
        withCredentials: true,
      });
      setUsers(response.data.users);
      showNotification("Users loaded successfully", "success");
    } catch (err) {
      console.error("Failed to fetch users:", err);
      showNotification("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Delete user by ID
  const handleDelete = async (userId, name) => {
    if (window.confirm(`Are you sure you want to delete user ${name}?`)) {
      try {
        await axios.delete("http://localhost:4000/api/user/delete", {
          data: { userID: userId },
          withCredentials: true,
        });
        setUsers(users.filter((user) => user._id !== userId));
        showNotification("User deleted successfully", "success");
      } catch (err) {
        console.error("Delete failed:", err);
        showNotification("Failed to delete user", "error");
      }
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full px-6 py-8">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center ${
            notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <Check className="mr-2 h-5 w-5" />
          ) : (
            <AlertCircle className="mr-2 h-5 w-5" />
          )}
          {notification.message}
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 text-lg">No users found</div>
            {searchTerm && (
              <button
                className="mt-2 text-blue-600 hover:underline"
                onClick={() => setSearchTerm("")}
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Personal Info</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                          {user.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name || "N/A"}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{user.email || "No email"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{user.phone || "No phone"}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{user.address || "No address"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {user.gender || "Not specified"}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">{user.birthday || "No birthday info"}</div>
                    </td>
                    <td className="px-6 py-4">
                      {user.isAccountVerified ? (
                        <div className="flex items-center text-green-600">
                          <UserCheck className="h-5 w-5 mr-1" />
                          <span className="text-sm">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <UserX className="h-5 w-5 mr-1" />
                          <span className="text-sm">Not Verified</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-3">
                        <button
                          className="text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors"
                          onClick={() => handleDelete(user._id, user.name)}
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination (simplified for now) */}
      <div className="mt-5 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{filteredUsers.length}</span> of{" "}
          <span className="font-medium">{users.length}</span> users
        </div>
        <div className="flex space-x-1">
          <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50">
            Previous
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;