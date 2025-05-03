import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, AlertCircle, Check, Calendar, Clock, Hotel, DollarSign, RefreshCw, UserCheck, UserX, Filter } from "lucide-react";

const AdminDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0
  });

  // Fetch reservations from backend on component mount
  useEffect(() => {
    fetchReservations();
    // No auto-refresh interval - rely on manual refresh button instead
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:4000/api/reservations");
      setReservations(response.data);
      
      // Calculate stats
      const data = response.data;
      setStats({
        total: data.length,
        confirmed: data.filter(r => r.status === "confirmed").length,
        pending: data.filter(r => r.status === "pending").length,
        cancelled: data.filter(r => r.status === "cancelled").length
      });
      
      showNotification("Reservations loaded successfully", "success");
    } catch (err) {
      console.error("Failed to fetch reservations:", err);
      showNotification("Failed to load reservations", "error");
    } finally {
      setLoading(false);
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchReservations();
    setTimeout(() => setRefreshing(false), 500);
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Handle status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axios.put(`http://localhost:4000/api/reservations/${id}`, {
        status: newStatus
      });
      
      setReservations(prev =>
        prev.map(r => (r._id === id ? { ...r, status: res.data.status } : r))
      );
      
      showNotification("Status updated successfully", "success");
    } catch (err) {
      console.error("Update failed:", err);
      showNotification("Failed to update status", "error");
    }
  };

  // Filter reservations based on search term and status filter
  const filteredReservations = reservations.filter(
    (res) => {
      const matchesSearch = 
        res.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.roomType?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || res.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    }
  );

  // Status styling
  const getStatusClass = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

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
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reservation Management</h2>
          <p className="text-gray-500 mt-1">Manage and track guest reservations</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search reservations..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors flex items-center justify-center"
          >
            <RefreshCw className={`h-5 w-5 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Reservations</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Calendar className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Confirmed</p>
              <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <UserCheck className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Cancelled</p>
              <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-full">
              <UserX className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 text-lg">No reservations found</div>
            {(searchTerm || statusFilter !== "all") && (
              <button
                className="mt-2 text-blue-600 hover:underline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
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
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Stay Details</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Room Info</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReservations.map((reservation) => (
                  <tr key={reservation._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                          {reservation.name?.charAt(0) || "G"}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{reservation.name || "N/A"}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{reservation.email || "No email"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900 mb-1">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        Check-in: {new Date(reservation.checkIn).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-900">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        Check-out: {new Date(reservation.checkOut).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900 mb-1">
                        <Hotel className="h-4 w-4 mr-2 text-gray-500" />
                        {reservation.roomType}
                      </div>
                      <div className="flex items-center text-sm text-gray-900">
                        <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                        ${reservation.roomPrice}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(reservation.status)}`}>
                        {reservation.status}
                      </div>
                      {reservation.message && (
                        <div className="text-sm text-gray-500 mt-1 truncate max-w-xs" title={reservation.message}>
                          "{reservation.message}"
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <select
                          value={reservation.status}
                          onChange={(e) => handleStatusChange(reservation._id, e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => window.confirm(`Send confirmation email to ${reservation.name}?`) && 
                            showNotification("Email sent to " + reservation.email, "success")}
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                          title="Email Guest"
                        >
                          Email
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

      {/* Pagination and export controls */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-between">
        <div className="text-sm text-gray-500 mb-4 sm:mb-0">
          Showing <span className="font-medium">{filteredReservations.length}</span> of{" "}
          <span className="font-medium">{reservations.length}</span> reservations
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex space-x-1">
            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50">
              Next
            </button>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => showNotification("Report downloaded successfully", "success")}
              className="px-4 py-1 bg-green-50 text-green-600 rounded-lg border border-green-200 hover:bg-green-100 transition-colors flex items-center justify-center"
            >
              <span>Export Excel</span>
            </button>
            <button 
              onClick={() => showNotification("PDF generated successfully", "success")}
              className="px-4 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors flex items-center justify-center"
            >
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;