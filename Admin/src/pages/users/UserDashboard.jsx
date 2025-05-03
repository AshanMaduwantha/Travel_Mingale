import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Search, AlertCircle, Check, Trash2, UserCheck, UserX, 
  Filter, ChevronDown, ChevronUp, Edit, Download, RefreshCw, UserPlus
} from "lucide-react";

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "ascending" });
  const [filterOptions, setFilterOptions] = useState({
    showVerifiedOnly: false,
    showUnverifiedOnly: false,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 1,
  });
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

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
      const fetchedUsers = response.data.users;
      setUsers(fetchedUsers);
      setPagination({
        ...pagination,
        totalPages: Math.ceil(fetchedUsers.length / pagination.itemsPerPage),
      });
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
  const handleDelete = async (userId, name, e) => {
    e.stopPropagation();
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

  // Handle sorting
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting to users
  const sortedUsers = [...users].sort((a, b) => {
    if (!a[sortConfig.key] && !b[sortConfig.key]) return 0;
    if (!a[sortConfig.key]) return 1;
    if (!b[sortConfig.key]) return -1;

    const compareA = a[sortConfig.key].toLowerCase?.() || a[sortConfig.key];
    const compareB = b[sortConfig.key].toLowerCase?.() || b[sortConfig.key];

    if (compareA < compareB) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (compareA > compareB) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Apply filters and search
  const filteredUsers = sortedUsers.filter(
    (user) => {
      // Search filter
      const matchesSearch = 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Verification filters
      const matchesVerificationFilter = 
        (filterOptions.showVerifiedOnly && user.isAccountVerified) ||
        (filterOptions.showUnverifiedOnly && !user.isAccountVerified) ||
        (!filterOptions.showVerifiedOnly && !filterOptions.showUnverifiedOnly);
      
      return matchesSearch && matchesVerificationFilter;
    }
  );

  // Handle pagination
  const paginatedUsers = filteredUsers.slice(
    (pagination.currentPage - 1) * pagination.itemsPerPage,
    pagination.currentPage * pagination.itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination({ ...pagination, currentPage: newPage });
  };

  const toggleFilterMenu = () => {
    setShowFilterMenu(!showFilterMenu);
  };

  const resetFilters = () => {
    setFilterOptions({
      showVerifiedOnly: false,
      showUnverifiedOnly: false,
    });
    setSearchTerm("");
    setSortConfig({ key: "name", direction: "ascending" });
  };

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const handleExportData = async () => {
    setExportLoading(true);
    try {
      // In a real app, you might want to call an API endpoint for this
      const csvContent = convertToCSV(filteredUsers);
      downloadCSV(csvContent, 'users_export.csv');
      showNotification("Data exported successfully", "success");
    } catch (err) {
      console.error("Export failed:", err);
      showNotification("Failed to export data", "error");
    } finally {
      setExportLoading(false);
    }
  };

  const convertToCSV = (data) => {
    const headers = ["Name", "Email", "Phone", "Address", "Gender", "Verified"];
    const rows = data.map(user => [
      user.name || "N/A",
      user.email || "N/A",
      user.phone || "N/A",
      user.address || "N/A",
      user.gender || "Not specified",
      user.isAccountVerified ? "Yes" : "No"
    ]);
    
    return [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
  };

  const downloadCSV = (content, fileName) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full px-6 py-8 bg-gray-50 min-h-screen">
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

      {/* Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 overflow-hidden">
            <div className="px-6 py-4 bg-blue-600 text-white flex justify-between items-center">
              <h3 className="text-lg font-medium">User Details</h3>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-white hover:text-gray-200"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                    {selectedUser.name?.charAt(0) || "U"}
                  </div>
                </div>
                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500">Name</label>
                    <p className="font-medium">{selectedUser.name || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500">Email</label>
                    <p className="font-medium">{selectedUser.email || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500">Phone</label>
                    <p className="font-medium">{selectedUser.phone || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500">Gender</label>
                    <p className="font-medium">{selectedUser.gender || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500">Address</label>
                    <p className="font-medium">{selectedUser.address || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500">Birthday</label>
                    <p className="font-medium">{selectedUser.birthday || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500">Account Status</label>
                    <p className="font-medium flex items-center">
                      {selectedUser.isAccountVerified ? (
                        <><UserCheck className="h-4 w-4 mr-1 text-green-600" /> Verified</>
                      ) : (
                        <><UserX className="h-4 w-4 mr-1 text-red-600" /> Not Verified</>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button 
                  className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium flex items-center"
                  onClick={() => alert("Edit functionality to be implemented")}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </button>
                <button 
                  className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium flex items-center"
                  onClick={(e) => {
                    handleDelete(selectedUser._id, selectedUser.name, e);
                    setShowDetailModal(false);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <button 
            onClick={fetchUsers}
            className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 rounded-lg shadow flex items-center justify-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button 
            onClick={() => alert("Add user functionality to be implemented")}
            className="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg shadow flex items-center justify-center"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </button>
          <button 
            onClick={handleExportData}
            disabled={exportLoading}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow flex items-center justify-center disabled:opacity-50"
          >
            {exportLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Export
          </button>
        </div>
      </div>

      {/* Search and filter bar */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={toggleFilterMenu}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
              {showFilterMenu ? (
                <ChevronUp className="h-4 w-4 ml-2" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-2" />
              )}
            </button>
            
            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10 p-4">
                <h3 className="font-medium text-gray-700 mb-3">Filter Options</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filterOptions.showVerifiedOnly}
                      onChange={() => setFilterOptions({
                        ...filterOptions,
                        showVerifiedOnly: !filterOptions.showVerifiedOnly,
                        showUnverifiedOnly: false,
                      })}
                      className="mr-2"
                    />
                    <span>Verified Users Only</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filterOptions.showUnverifiedOnly}
                      onChange={() => setFilterOptions({
                        ...filterOptions,
                        showUnverifiedOnly: !filterOptions.showUnverifiedOnly,
                        showVerifiedOnly: false,
                      })}
                      className="mr-2"
                    />
                    <span>Unverified Users Only</span>
                  </label>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <button
                    onClick={resetFilters}
                    className="w-full px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            )}
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
            {(searchTerm || filterOptions.showVerifiedOnly || filterOptions.showUnverifiedOnly) && (
              <button
                className="mt-2 text-blue-600 hover:underline"
                onClick={resetFilters}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th 
                    className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("name")}
                  >
                    <div className="flex items-center">
                      User
                      {sortConfig.key === "name" && (
                        sortConfig.direction === "ascending" ? 
                          <ChevronUp className="h-4 w-4 ml-1" /> : 
                          <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("email")}
                  >
                    <div className="flex items-center">
                      Contact
                      {sortConfig.key === "email" && (
                        sortConfig.direction === "ascending" ? 
                          <ChevronUp className="h-4 w-4 ml-1" /> : 
                          <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Personal Info
                  </th>
                  <th 
                    className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("isAccountVerified")}
                  >
                    <div className="flex items-center">
                      Verification
                      {sortConfig.key === "isAccountVerified" && (
                        sortConfig.direction === "ascending" ? 
                          <ChevronUp className="h-4 w-4 ml-1" /> : 
                          <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedUsers.map((user) => (
                  <tr 
                    key={user._id} 
                    className="hover:bg-blue-50 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(user)}
                  >
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
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.gender ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                        }`}>
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
                          className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert("Edit functionality to be implemented");
                          }}
                          title="Edit"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          className="text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors"
                          onClick={(e) => handleDelete(user._id, user.name, e)}
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

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between">
          <div className="text-sm text-gray-500 mb-3 sm:mb-0">
            Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.itemsPerPage + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(pagination.currentPage * pagination.itemsPerPage, filteredUsers.length)}
            </span>{" "}
            of <span className="font-medium">{filteredUsers.length}</span> users
          </div>
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => handlePageChange(1)}
              disabled={pagination.currentPage === 1}
              className="px-2 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              First
            </button>
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <div className="px-4 py-1 border border-gray-300 rounded-md bg-white text-gray-700">
              {pagination.currentPage} / {Math.max(1, pagination.totalPages)}
            </div>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
            <button 
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="px-2 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;