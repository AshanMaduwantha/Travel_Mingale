import React, { useState, useEffect } from 'react';
import Header from '../../components/header/Header';
import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from '../../components/searchItem/SearchItem';
import useFetch from '../../hooks/useFetch.jsx';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSearch, 
  faCalendarDays, 
  faSliders,
  faUser, 
  faChild, 
  faBed,
  faFilter,
  faSortAmountDown,
  faMapMarkerAlt,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";
import Navbar from '../../components/Navbar.jsx';

const List = () => {
  const location = useLocation();
  const [destination, setDestination] = useState(location.state?.destination || "");
  const [dates, setDates] = useState(location.state?.dates || [
    {
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      key: 'selection'
    }
  ]);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(location.state?.options || {
    adult: 1,
    children: 0,
    room: 1
  });
  
  // Controlled inputs for min and max prices
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [adultsCount, setAdultsCount] = useState(options.adult);
  const [childrenCount, setChildrenCount] = useState(options.children);
  const [roomCount, setRoomCount] = useState(options.room);

  // Search values that only update when the button is clicked
  const [searchMin, setSearchMin] = useState(5000);
  const [searchMax, setSearchMax] = useState(31000);
  
  // Filter and sort controls
  const [openFilters, setOpenFilters] = useState(false);
  const [activeSort, setActiveSort] = useState("recommended");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch data only when the button is clicked
  const { data, loading, error, reFetch } = useFetch(
    `http://localhost:4000/api/hotels?city=${destination}&min=${searchMin}&max=${searchMax}`
  );

  const handleClick = () => {
    setSearchMin(min || 5000); // Default value if empty
    setSearchMax(max || 31000);
    
    // Update options with current values
    const updatedOptions = {
      adult: adultsCount,
      children: childrenCount,
      room: roomCount
    };
    setOptions(updatedOptions);
    
    reFetch(); // Trigger API call
    
    // Close mobile filters if open
    setMobileFilterOpen(false);
  };

  const handleSort = (sortType) => {
    setActiveSort(sortType);
    // Implement actual sorting logic here
  };

  // Custom increment/decrement handler
  const handleCounter = (type, operation) => {
    if (type === "adult") {
      if (operation === "inc") {
        setAdultsCount(prev => prev + 1);
      } else if (operation === "dec" && adultsCount > 1) {
        setAdultsCount(prev => prev - 1);
      }
    } else if (type === "children") {
      if (operation === "inc") {
        setChildrenCount(prev => prev + 1);
      } else if (operation === "dec" && childrenCount > 0) {
        setChildrenCount(prev => prev - 1);
      }
    } else if (type === "room") {
      if (operation === "inc") {
        setRoomCount(prev => prev + 1);
      } else if (operation === "dec" && roomCount > 1) {
        setRoomCount(prev => prev - 1);
      }
    }
  };

  return (
    <div>
      <Navbar />
    
    <div className="bg-gray-50 min-h-screen">
      <Header type="list" />
      
      {/* Mobile filter button - only visible on small screens */}
      <div className="md:hidden sticky top-0 z-10 bg-white p-4 shadow-md">
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium"
        >
          <FontAwesomeIcon icon={faFilter} />
          Filters & Sorting
        </button>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Search sidebar */}
          <div className={`md:w-80 transition-all duration-300 ${mobileFilterOpen ? "block fixed inset-0 z-50 bg-white overflow-auto p-4" : "hidden md:block"}`}>
            {mobileFilterOpen && (
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                <h2 className="text-xl font-bold">Filters</h2>
                <button 
                  onClick={() => setMobileFilterOpen(false)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>
            )}
            
            <div className="bg-white rounded-xl shadow-md p-5">
              <h1 className="text-xl font-bold text-gray-800 mb-6">Search</h1>

              <div className="mb-5">
                <label className="block text-gray-700 font-medium mb-2">Destination</label>
                <div className="relative">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Where are you going?"
                    className="w-full pl-10 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-gray-700 font-medium mb-2">Check-in Date</label>
                <div className="relative">
                  <div
                    onClick={() => setOpenDate(!openDate)}
                    className="flex items-center justify-between w-full border border-gray-300 rounded-lg py-2 px-3 cursor-pointer hover:border-blue-500"
                  >
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faCalendarDays} className="text-gray-400 mr-2" />
                      <span className="text-gray-700">
                        {`${format(dates[0].startDate, "MMM dd, yyyy")} — ${format(dates[0].endDate, "MMM dd, yyyy")}`}
                      </span>
                    </div>
                    <span className="text-blue-600 text-sm">Edit</span>
                  </div>
                  {openDate && (
                    <div className="absolute z-20 mt-1 shadow-lg rounded-lg overflow-hidden">
                      <DateRange
                        editableDateInputs={true}
                        onChange={(item) => setDates([item.selection])}
                        moveRangeOnFirstSelection={false}
                        ranges={dates}
                        minDate={new Date()}
                        className="border border-gray-200 rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-gray-700 font-medium">Price Range</h2>
                  <span className="text-sm text-gray-500">per night</span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-3 text-gray-500">Rs.</span>
                    <input
                      type="number"
                      value={min}
                      onChange={(e) => setMin(e.target.value)}
                      placeholder="5000"
                      className="w-full pl-10 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <span className="text-gray-400">—</span>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-3 text-gray-500">Rs.</span>
                    <input
                      type="number"
                      value={max}
                      onChange={(e) => setMax(e.target.value)}
                      placeholder="35000"
                      className="w-full pl-10 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 
                  className="flex items-center justify-between text-gray-700 font-medium mb-3 cursor-pointer"
                  onClick={() => setOpenFilters(!openFilters)}
                >
                  <span>Guests and Rooms</span>
                  <FontAwesomeIcon 
                    icon={faSliders} 
                    className={`transition-transform ${openFilters ? "rotate-180" : ""}`} 
                  />
                </h2>
                
                {openFilters && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faUser} className="text-gray-400 mr-2" />
                        <span className="text-gray-700">Adults</span>
                      </div>
                      <div className="flex items-center">
                        <button 
                          onClick={() => handleCounter("adult", "dec")}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{adultsCount}</span>
                        <button 
                          onClick={() => handleCounter("adult", "inc")}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faChild} className="text-gray-400 mr-2" />
                        <span className="text-gray-700">Children</span>
                      </div>
                      <div className="flex items-center">
                        <button 
                          onClick={() => handleCounter("children", "dec")}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{childrenCount}</span>
                        <button 
                          onClick={() => handleCounter("children", "inc")}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faBed} className="text-gray-400 mr-2" />
                        <span className="text-gray-700">Rooms</span>
                      </div>
                      <div className="flex items-center">
                        <button 
                          onClick={() => handleCounter("room", "dec")}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{roomCount}</span>
                        <button 
                          onClick={() => handleCounter("room", "inc")}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={handleClick} 
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faSearch} />
                Search
              </button>

              {mobileFilterOpen && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => setMobileFilterOpen(false)}
                    className="w-full py-3 border border-gray-300 rounded-lg text-gray-700 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Results section */}
          <div className="flex-1">
            <div className="mb-5">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-0">
                  {destination ? `Hotels in ${destination}` : "All Hotels"}
                  {Array.isArray(data) && <span className="text-sm font-normal text-gray-500 ml-2">({data.length} found)</span>}
                </h2>
                
                {/* Sorting options */}
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-gray-600 text-sm">Sort by:</span>
                  {["recommended", "price", "rating"].map((sortType) => (
                    <button
                      key={sortType}
                      className={`py-1 px-3 text-sm rounded-full ${
                        activeSort === sortType 
                          ? "bg-blue-100 text-blue-700" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => handleSort(sortType)}
                    >
                      {sortType.charAt(0).toUpperCase() + sortType.slice(1)}
                    </button>
                  ))}
                  <button className="p-1 rounded-full hover:bg-gray-100">
                    <FontAwesomeIcon icon={faSortAmountDown} className="text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results loading state */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FontAwesomeIcon icon={faSpinner} className="text-blue-600 text-4xl animate-spin mb-4" />
                <p className="text-gray-600">Loading hotels...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600 mb-2">Oops! Something went wrong.</p>
                <p className="text-gray-600">Unable to fetch hotel data. Please try again later.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((item) => (
                    <SearchItem item={item} key={item._id} />
                  ))
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                      <FontAwesomeIcon icon={faSearch} className="text-blue-600 text-2xl" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No hotels found</h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your search criteria or try a different destination.
                    </p>
                    <div className="flex justify-center">
                      <button 
                        onClick={() => setMobileFilterOpen(true)}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <FontAwesomeIcon icon={faFilter} className="mr-1" />
                        Adjust filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default List;