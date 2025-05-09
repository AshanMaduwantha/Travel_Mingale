import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  AlertCircle,
  Check,
  Calendar,
  Clock,
  Hotel,
  DollarSign,
  RefreshCw,
  UserCheck,
  UserX,
  Filter,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
} from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const AdminDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
  });
  const [pdfExportLoading, setPdfExportLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:4000/api/reservations");
      const data = response.data;
      setReservations(data);

      setStats({
        total: data.length,
        confirmed: data.filter((r) => r.status === "confirmed").length,
        pending: data.filter((r) => r.status === "pending").length,
        cancelled: data.filter((r) => r.status === "cancelled").length,
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

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axios.put(`http://localhost:4000/api/reservations/${id}`, {
        status: newStatus,
      });

      setReservations((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: res.data.status } : r))
      );

      // Update stats
      const updatedStats = { ...stats };
      if (res.data.status === "confirmed") updatedStats.confirmed += 1;
      if (res.data.status === "pending") updatedStats.pending += 1;
      if (res.data.status === "cancelled") updatedStats.cancelled += 1;
      setStats(updatedStats);

      showNotification("Status updated successfully", "success");
    } catch (err) {
      console.error("Update failed:", err);
      showNotification("Failed to update status", "error");
    }
  };

  const filteredReservations = reservations.filter((res) => {
    const matchesSearch =
      res.hotelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || res.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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

  // Add Travel Mingel header to PDF
  const addTravelMingelHeader = (doc) => {
    // Main header with brand color
    doc.setFillColor(30, 120, 180); // Travel Mingel blue
    doc.rect(0, 0, doc.internal.pageSize.width, 20, 'F');
    
    // Logo text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('Travel Mingel', 15, 13);
    
    // Tagline
    doc.setFontSize(10);
    doc.text('Connecting travelers worldwide', 15, 18);
    
    // Report title section
    doc.setFillColor(240, 248, 255); // Light blue background
    doc.rect(0, 20, doc.internal.pageSize.width, 15, 'F');
    
    return 35; // Return the Y position after header
  };

  // Add Travel Mingel footer to PDF
  const addTravelMingelFooter = (doc) => {
    const pageCount = doc.internal.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Footer line
      doc.setDrawColor(30, 120, 180);
      doc.setLineWidth(0.5);
      doc.line(20, doc.internal.pageSize.height - 20, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 20);
      
      // Footer text
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 15, { align: 'center' });
      doc.text('© Travel Mingel - Confidential', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    }
  };

  // Convert to CSV function
  const convertToCSV = (data) => {
    const headers = ["Hotel Name", "Guest Name", "Email", "Phone", "Check-In", "Check-Out", "Room Count", "Room Price", "Status", "Message"];
    const rows = data.map(res => [
      res.hotelName || "N/A",
      res.name || "N/A",
      res.email || "N/A",
      res.phone || "N/A",
      res.checkIn ? new Date(res.checkIn).toLocaleDateString() : "N/A",
      res.checkOut ? new Date(res.checkOut).toLocaleDateString() : "N/A",
      res.roomCount || "N/A",
      res.roomPrice ? `$${res.roomPrice}` : "N/A",
      res.status || "N/A",
      res.message || "N/A"
    ]);
    
    return [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
  };

  // Download CSV function
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

  // Handle CSV export
  const handleExportData = async () => {
    setExportLoading(true);
    try {
      const csvContent = convertToCSV(filteredReservations);
      downloadCSV(csvContent, 'travel_mingel_reservations_export.csv');
      showNotification("Data exported successfully", "success");
    } catch (err) {
      console.error("Export failed:", err);
      showNotification("Failed to export data", "error");
    } finally {
      setExportLoading(false);
    }
  };

  // Handle PDF export for all reservations
  const handleExportAllPDF = async () => {
    setPdfExportLoading(true);
    try {
      const doc = new jsPDF();
      
      // Add header and get starting Y position
      const startY = addTravelMingelHeader(doc);
      
      // Main title
      doc.setFontSize(16);
      doc.setTextColor(30, 120, 180);
      doc.text('Reservations Management Report', 105, startY, { align: 'center' });
      
      // Subtitle
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()} | ${filteredReservations.length} reservations found`, 
        105, startY + 7, { align: 'center' });
      
      // Summary section
      const confirmedCount = filteredReservations.filter(r => r.status === "confirmed").length;
      const pendingCount = filteredReservations.filter(r => r.status === "pending").length;
      const cancelledCount = filteredReservations.filter(r => r.status === "cancelled").length;
      
      doc.setFontSize(10);
      doc.setTextColor(30, 120, 180);
      doc.text('Summary:', 14, startY + 20);
      doc.setTextColor(100);
      doc.text(`• Total Reservations: ${filteredReservations.length}`, 20, startY + 25);
      doc.text(`• Confirmed: ${confirmedCount} (${Math.round((confirmedCount/filteredReservations.length)*100)}%)`, 20, startY + 30);
      doc.text(`• Pending: ${pendingCount}`, 20, startY + 35);
      doc.text(`• Cancelled: ${cancelledCount}`, 20, startY + 40);
      
      // Reservations table
      const tableData = filteredReservations.map(res => [
        res.hotelName || "N/A",
        res.name || "N/A",
        res.email || "N/A",
        res.checkIn ? new Date(res.checkIn).toLocaleDateString() : "N/A",
        res.checkOut ? new Date(res.checkOut).toLocaleDateString() : "N/A",
        `$${res.roomPrice || "0"}`,
        res.status || "N/A"
      ]);
      
      autoTable(doc, {
        startY: startY + 50,
        head: [["Hotel", "Guest", "Email", "Check-In", "Check-Out", "Price", "Status"]],
        body: tableData,
        theme: "grid",
        headStyles: { 
          fillColor: [30, 120, 180],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: { fillColor: [240, 248, 255] },
        styles: { 
          cellPadding: 3,
          fontSize: 9,
          overflow: 'linebreak'
        },
        margin: { top: 10 },
        pageBreak: 'auto',
        tableWidth: 'wrap'
      });
      
      // Add footer
      addTravelMingelFooter(doc);
      
      // Save PDF
      doc.save("Travel_Mingel_Reservations_Report.pdf");
      showNotification("PDF exported successfully", "success");
    } catch (err) {
      console.error("PDF Export failed:", err);
      showNotification("Failed to export PDF", "error");
    } finally {
      setPdfExportLoading(false);
    }
  };

  // Handle PDF export for single reservation
  const handleExportReservationPDF = async (reservation) => {
    setPdfExportLoading(true);
    try {
      const doc = new jsPDF();
      
      // Add header and get starting Y position
      const startY = addTravelMingelHeader(doc);
      
      // Main title
      doc.setFontSize(16);
      doc.setTextColor(30, 120, 180);
      doc.text('Reservation Details', 105, startY, { align: 'center' });
      
      // Subtitle
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, startY + 7, { align: 'center' });
      
      // Reservation header section
      doc.setFillColor(240, 248, 255);
      doc.roundedRect(20, startY + 15, 170, 20, 3, 3, 'F');
      doc.setFontSize(14);
      doc.setTextColor(30, 120, 180);
      doc.text(`${reservation.hotelName || 'Reservation'} - ${reservation.status || 'Status'}`, 25, startY + 25);
      
      // Reservation details table
      const reservationData = [
        ["Hotel Name:", reservation.hotelName || "N/A"],
        ["Guest Name:", reservation.name || "N/A"],
        ["Email:", reservation.email || "N/A"],
        ["Phone:", reservation.phone || "N/A"],
        ["Check-In:", reservation.checkIn ? new Date(reservation.checkIn).toLocaleDateString() : "N/A"],
        ["Check-Out:", reservation.checkOut ? new Date(reservation.checkOut).toLocaleDateString() : "N/A"],
        ["Room Count:", reservation.roomCount || "N/A"],
        ["Room Price:", reservation.roomPrice ? `$${reservation.roomPrice}` : "N/A"],
        ["Status:", reservation.status || "N/A"],
        ["Special Requests:", reservation.message || "N/A"]
      ];
      
      autoTable(doc, {
        startY: startY + 40,
        head: [["Field", "Details"]],
        body: reservationData,
        theme: "grid",
        headStyles: { 
          fillColor: [30, 120, 180],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: { fillColor: [240, 248, 255] },
        styles: { 
          cellPadding: 5,
          fontSize: 10,
          valign: 'middle'
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 40 }
        },
        margin: { top: 10 }
      });
      
      // Additional notes section
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('This document contains confidential reservation information for Travel Mingel internal use only.', 
        14, doc.internal.pageSize.height - 30, { maxWidth: 180 });
      
      // Add footer
      addTravelMingelFooter(doc);
      
      // Save PDF
      doc.save(`Travel_Mingel_Reservation_${reservation._id}.pdf`);
      showNotification("PDF exported successfully", "success");
    } catch (err) {
      console.error("PDF Export failed:", err);
      showNotification("Failed to export PDF", "error");
    } finally {
      setPdfExportLoading(false);
    }
  };

  return (
    <div className="w-full px-6 py-8 bg-gray-50 min-h-screen">
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center ${
            notification.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
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

      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reservation Management</h2>
          <p className="text-gray-500 mt-1">Manage and track guest reservations</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 rounded-lg shadow flex items-center justify-center"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          
          <div className="relative inline-block">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow flex items-center justify-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                <ul className="py-1">
                  <li>
                    <button
                      onClick={handleExportData}
                      disabled={exportLoading}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-gray-700"
                    >
                      {exportLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      Export as CSV
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleExportAllPDF}
                      disabled={pdfExportLoading}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-gray-700"
                    >
                      {pdfExportLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      ) : (
                        <FileText className="h-4 w-4 mr-2" />
                      )}
                      Export as PDF
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search by hotel, guest name or email..."
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
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            title: "Total Reservations",
            value: stats.total,
            icon: <Calendar className="h-6 w-6 text-blue-500" />,
            bg: "bg-blue-50",
          },
          {
            title: "Confirmed",
            value: stats.confirmed,
            icon: <UserCheck className="h-6 w-6 text-green-500" />,
            bg: "bg-green-50",
          },
          {
            title: "Pending",
            value: stats.pending,
            icon: <Clock className="h-6 w-6 text-yellow-500" />,
            bg: "bg-yellow-50",
          },
          {
            title: "Cancelled",
            value: stats.cancelled,
            icon: <UserX className="h-6 w-6 text-red-500" />,
            bg: "bg-red-50",
          },
        ].map((card, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
              <div className={`p-3 rounded-full ${card.bg}`}>{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Reservations Table */}
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
                      <div className="font-semibold text-gray-800 mb-1">
                        {reservation.hotelName || "Hotel Unknown"}
                      </div>
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
                        {reservation.roomCount} room(s)
                      </div>
                      <div className="flex items-center text-sm text-gray-900">
                        <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                        ${reservation.roomPrice || "0"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(reservation.status)}`}>
                        {reservation.status}
                      </div>
                      {reservation.message && (
                        <div className="text-sm text-gray-500 mt-1 truncate max-w-xs" title={reservation.message}>
                          {reservation.message}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          className="text-green-600 hover:bg-green-50 p-2 rounded-full transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExportReservationPDF(reservation);
                          }}
                          title="Export PDF"
                        >
                          <FileText className="h-5 w-5" />
                        </button>
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
                          onClick={(e) => {
                            e.stopPropagation();
                            window.confirm(`Send confirmation email to ${reservation.name}?`) &&
                            showNotification("Email sent to " + reservation.email, "success");
                          }}
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

      {/* Footer */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-between">
        <div className="text-sm text-gray-500 mb-4 sm:mb-0">
          Showing <span className="font-medium">{filteredReservations.length}</span> of{" "}
          <span className="font-medium">{reservations.length}</span> reservations
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;