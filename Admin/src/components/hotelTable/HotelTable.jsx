import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  AlertCircle, 
  Check, 
  Hotel, 
  ChevronDown, 
  MapPin, 
  DollarSign, 
  Star, 
  Filter, 
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const HotelTable = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const itemsPerPage = 5;

  // Fetch hotels from backend on component mount
  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/api/hotels/all");
      setHotels(res.data);
    } catch (err) {
      console.error("Failed to fetch hotels:", err);
      showNotification("Failed to load hotels", "error");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await fetchHotels();
    setIsRefreshing(false);
    showNotification("Data refreshed successfully", "success");
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Delete hotel by ID
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await axios.delete(`http://localhost:4000/api/hotels/${id}`);
        setHotels(hotels.filter((hotel) => hotel._id !== id));
        showNotification("Hotel deleted successfully", "success");
      } catch (err) {
        console.error("Delete failed:", err);
        showNotification("Failed to delete hotel", "error");
      }
    }
  };

  // Navigate to edit hotel page
  const handleEdit = (hotel) => {
    navigate("/admin/edit-hotel", { state: { hotel } });
  };

  // Handle sort
  const handleSort = (field) => {
    const newOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);
  };

  // Apply sorting and filtering
  const processedHotels = hotels
    .filter(
      (hotel) =>
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((hotel) => !filterType || hotel.type === filterType)
    .sort((a, b) => {
      if (sortField === "price") {
        return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
      } else if (sortField === "distance") {
        return sortOrder === "asc" ? a.distance - b.distance : b.distance - a.distance;
      }
      
      const aValue = a[sortField]?.toLowerCase() || "";
      const bValue = b[sortField]?.toLowerCase() || "";
      
      if (sortOrder === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

  // Calculate pagination
  const totalPages = Math.ceil(processedHotels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHotels = processedHotels.slice(startIndex, startIndex + itemsPerPage);

  // Get unique hotel types for filter dropdown
  const hotelTypes = [...new Set(hotels.map((hotel) => hotel.type))];

  // Rating display component
  const RatingDisplay = ({ rating = 4.5 }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} fill="#FFD700" stroke="#FFD700" size={14} />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star size={14} fill="none" stroke="#FFD700" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <Star size={14} fill="#FFD700" stroke="#FFD700" />
            </div>
          </div>
        )}
        <span className="ml-1 text-xs font-medium text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header section */}
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Hotel className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Hotel Management</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search hotels..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <div className="flex gap-2">
              <div className="relative">
                <select
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">All types</option>
                  {hotelTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              
              <button
                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                onClick={refreshData}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                onClick={() => navigate("/admin/add-hotel")}
              >
                <Plus className="h-5 w-5" />
                <span>Add Hotel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Hotels</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{hotels.length}</h3>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <Hotel className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-green-600 flex items-center">
              <span className="font-medium">+12%</span>
              <span className="ml-1">from last month</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Price</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  Rs.{hotels.length > 0 
                    ? Math.round(hotels.reduce((sum, hotel) => sum + hotel.price, 0) / hotels.length)
                    : 0}
                </h3>
              </div>
              <div className="bg-purple-50 p-2 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-red-600 flex items-center">
              <span className="font-medium">-3%</span>
              <span className="ml-1">from last month</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Top Location</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {hotels.length > 0 
                    ? (() => {
                        const locations = {};
                        hotels.forEach(hotel => {
                          locations[hotel.city] = (locations[hotel.city] || 0) + 1;
                        });
                        return Object.keys(locations).reduce((a, b) => 
                          locations[a] > locations[b] ? a : b, "");
                      })()
                    : "N/A"}
                </h3>
              </div>
              <div className="bg-amber-50 p-2 rounded-lg">
                <MapPin className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600 flex items-center">
              <span className="font-medium">{hotels.length > 0 
                ? (() => {
                    const locations = {};
                    hotels.forEach(hotel => {
                      locations[hotel.city] = (locations[hotel.city] || 0) + 1;
                    });
                    const topLocation = Object.keys(locations).reduce((a, b) => 
                      locations[a] > locations[b] ? a : b, "");
                    return `${locations[topLocation]} hotels`;
                  })()
                : "0 hotels"}
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : processedHotels.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Hotel className="h-8 w-8 text-gray-400" />
              </div>
              <div className="text-gray-500 text-lg">No hotels found</div>
              {(searchTerm || filterType) && (
                <button
                  className="mt-2 text-blue-600 hover:underline"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterType("");
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
                    <th 
                      className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        Hotel Name
                        {sortField === "name" && (
                          <ChevronDown className={`ml-1 h-4 w-4 ${sortOrder === "desc" ? "transform rotate-180" : ""}`} />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("type")}
                    >
                      <div className="flex items-center">
                        Type
                        {sortField === "type" && (
                          <ChevronDown className={`ml-1 h-4 w-4 ${sortOrder === "desc" ? "transform rotate-180" : ""}`} />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("city")}
                    >
                      <div className="flex items-center">
                        Location
                        {sortField === "city" && (
                          <ChevronDown className={`ml-1 h-4 w-4 ${sortOrder === "desc" ? "transform rotate-180" : ""}`} />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("price")}
                    >
                      <div className="flex items-center">
                        Price
                        {sortField === "price" && (
                          <ChevronDown className={`ml-1 h-4 w-4 ${sortOrder === "desc" ? "transform rotate-180" : ""}`} />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedHotels.map((hotel) => (
                    <tr key={hotel._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold mr-3">
                            {hotel.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{hotel.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{hotel.title}</div>
                            <RatingDisplay rating={hotel.rating || 4 + Math.random()} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {hotel.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-1 flex-shrink-0" />
                          <div>
                            <div className="text-sm text-gray-900">{hotel.city}</div>
                            <div className="text-sm text-gray-500">{hotel.distance} km from center</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">Rs.{hotel.price}</div>
                        <div className="text-xs text-gray-500">starting price</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                            onClick={() => handleEdit(hotel)}
                            title="Edit"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button
                            className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                            onClick={() => handleDelete(hotel._id, hotel.name)}
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
        {processedHotels.length > 0 && (
          <div className="mt-5 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">{Math.min(startIndex + itemsPerPage, processedHotels.length)}</span> of{" "}
              <span className="font-medium">{processedHotels.length}</span> hotels
            </div>
            <div className="flex space-x-2">
              <button 
                className={`px-3 py-1 border border-gray-300 rounded-md flex items-center ${
                  currentPage === 1 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Prev
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Logic to display page numbers centered around current page
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={i}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button 
                className={`px-3 py-1 border border-gray-300 rounded-md flex items-center ${
                  currentPage === totalPages 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelTable;