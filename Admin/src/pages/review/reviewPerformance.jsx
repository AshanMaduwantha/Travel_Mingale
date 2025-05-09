import React, { useState, useEffect, useRef } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Star, Loader, AlertTriangle, RefreshCw, TrendingUp, TrendingDown, Activity, MessageSquare, Calendar, ChevronDown, ChevronUp, Filter } from "lucide-react";

const ReviewPerformance = () => {
  const [metrics, setMetrics] = useState({
    totalReviews: 0,
    averageRating: 0,
    positiveReviews: 0,
    neutralReviews: 0,
    negativeReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [animateChart, setAnimateChart] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [timeframe, setTimeframe] = useState("all");
  const [expandedSection, setExpandedSection] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const animationTimerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Enhanced function to animate the chart with consistent behavior
  const animateChartSequence = () => {
    // Clear any existing animation timer
    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current);
    }
    
    setAnimateChart(true);
    
    // Start the animation cycle through each segment with a slower interval (2500ms)
    // This makes the animation more noticeable and consistent across refresh methods
    let index = 0;
    
    // First, reset any active index
    setActiveIndex(null);
    
    // Brief delay before starting animation sequence
    setTimeout(() => {
      animationTimerRef.current = setInterval(() => {
        setActiveIndex(index);
        index = (index + 1) % chartData.length;
        
        // Stop the animation after one full cycle
        if (index === 0) {
          clearInterval(animationTimerRef.current);
          animationTimerRef.current = null;
        }
      }, 2500); // Increased from 1500ms to 2500ms for slower animation
    }, 300);
  };

  const fetchReviews = async () => {
    try {
      setError("");
      // Using the same logic for fetching data
      const response = await fetch("http://localhost:4000/api/reviews");
      const data = await response.json();
      processReviewData(data);
      
      // After data is processed, trigger animation with a consistent delay
      // The animation itself will now be triggered after loading state is removed
      setTimeout(() => {
        setLoading(false);
        setRefreshing(false);
        
        // Start animation sequence after UI has rendered
        setTimeout(() => {
          animateChartSequence();
        }, 500);
      }, 800);
      
    } catch (err) {
      setError("Failed to load reviews data.");
      console.error("Error fetching reviews:", err);
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Function to handle page refresh via browser refresh
  useEffect(() => {
    // This will run when the component mounts
    const handleInitialLoad = () => {
      setLoading(true);
      // Add a deliberate delay on initial page load to match the refresh button behavior
      setTimeout(() => {
        fetchReviews();
      }, 600);
    };
    
    handleInitialLoad();
    
    // Cleanup on component unmount
    return () => {
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
        animationTimerRef.current = null;
      }
    };
  }, []);
  
  // Handle manual refresh button click with the same animation sequence
  const handleRefresh = () => {
    setRefreshing(true);
    setLoading(true);
    setActiveIndex(null); // Reset active index for clean animation start
    
    // Use the same delay for consistency in animation
    setTimeout(() => {
      fetchReviews();
    }, 600);
  };

  // Function to handle timeframe change
  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
    setDropdownOpen(false);
    
    // In a real app, you would fetch data based on the new timeframe
    setRefreshing(true);
    setLoading(true);
    
    // Simulate fetching new data based on timeframe
    setTimeout(() => {
      fetchReviews();
    }, 600);
  };

  const processReviewData = (reviewsData) => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalRating = 0;
    let positive = 0;
    let neutral = 0;
    let negative = 0;

    reviewsData.forEach(review => {
      const rating = review.rating;
      distribution[rating]++;
      totalRating += rating;

      if (rating >= 4) positive++;
      else if (rating === 3) neutral++;
      else negative++;
    });

    setMetrics({
      totalReviews: reviewsData.length,
      averageRating: reviewsData.length ? (totalRating / reviewsData.length).toFixed(1) : 0,
      positiveReviews: positive,
      neutralReviews: neutral,
      negativeReviews: negative,
      ratingDistribution: distribution
    });
  };

  const chartData = [
    { name: "Positive (4-5★)", value: metrics.positiveReviews, color: "#10B981" },
    { name: "Neutral (3★)", value: metrics.neutralReviews, color: "#F59E0B" },
    { name: "Negative (1-2★)", value: metrics.negativeReviews, color: "#EF4444" }
  ];

  const barData = [5, 4, 3, 2, 1].map(rating => ({
    name: `${rating} ★`,
    count: metrics.ratingDistribution[rating],
    color: rating >= 4 ? "#10B981" : rating === 3 ? "#F59E0B" : "#EF4444"
  }));
  
  // Custom active shape for pie chart animation and hover
  const renderActiveShape = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-midAngle * Math.PI / 180);
    const cos = Math.cos(-midAngle * Math.PI / 180);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#333" className="text-base font-medium">
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="text-sm font-medium">{`${value} reviews`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#666" className="text-xs">
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };
  
  // Handlers for pie chart interaction
  const onPieEnter = (_, index) => {
    setHoverIndex(index);
  };
  
  const onPieLeave = () => {
    setHoverIndex(null);
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? "all" : section);
  };

  // Display stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={16} 
          className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
        />
      );
    }
    return <div className="flex">{stars}</div>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Loader className="mx-auto h-12 w-12 text-indigo-600 animate-spin" />
          <p className="mt-4 text-lg font-medium text-gray-700">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-screen-xl mx-auto p-5 text-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded">
          <div className="flex items-center">
            <div className="text-red-500">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
              <button 
                onClick={handleRefresh}
                className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-2 px-4 rounded-md transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto p-5 font-sans bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Review Performance Dashboard</h1>
        
        <div className="mt-4 md:mt-0 flex flex-wrap space-x-2">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Calendar size={16} className="mr-2" />
              <span>{timeframe === "all" ? "All Time" : 
                    timeframe === "week" ? "Last Week" : 
                    timeframe === "month" ? "Last Month" : "Last Year"}</span>
              <ChevronDown size={16} className="ml-2" />
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
                <button 
                  onClick={() => handleTimeframeChange("all")}
                  className={`block w-full text-left px-4 py-2 text-sm ${timeframe === "all" ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  All Time
                </button>
                <button 
                  onClick={() => handleTimeframeChange("week")}
                  className={`block w-full text-left px-4 py-2 text-sm ${timeframe === "week" ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  Last Week
                </button>
                <button 
                  onClick={() => handleTimeframeChange("month")}
                  className={`block w-full text-left px-4 py-2 text-sm ${timeframe === "month" ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  Last Month
                </button>
                <button 
                  onClick={() => handleTimeframeChange("year")}
                  className={`block w-full text-left px-4 py-2 text-sm ${timeframe === "year" ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  Last Year
                </button>
              </div>
            )}
          </div>
          
          <button 
            onClick={handleRefresh}
            className="flex items-center bg-indigo-600 rounded-md px-4 py-2 text-white hover:bg-indigo-700 transition-colors"
          >
            <RefreshCw 
              className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} 
            />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>
      
      {/* Performance Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("overview")}>
            <h2 className="text-xl font-semibold text-gray-800">Performance Overview</h2>
            {expandedSection === "overview" ? 
              <ChevronUp size={20} className="text-gray-500" /> :
              <ChevronDown size={20} className="text-gray-500" />
            }
          </div>
        </div>
        
        {(expandedSection === "overview" || expandedSection === "all") && (
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Reviews</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{metrics.totalReviews}</h3>
                  </div>
                  <span className="bg-blue-100 p-2 rounded-lg">
                    <MessageSquare size={20} className="text-blue-600" />
                  </span>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <span className="text-green-500 flex items-center">
                    <TrendingUp size={16} className="mr-1" />
                    <span>12%</span>
                  </span>
                  <span className="text-gray-500 ml-2">vs last period</span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Average Rating</p>
                    <div className="flex items-center mt-1">
                      <h3 className="text-2xl font-bold text-gray-800">{metrics.averageRating}</h3>
                      <span className="text-sm text-gray-500 ml-1">/ 5</span>
                    </div>
                  </div>
                  <span className="bg-yellow-100 p-2 rounded-lg">
                    <Star size={20} className="text-yellow-500" />
                  </span>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <span className="text-green-500 flex items-center">
                    <TrendingUp size={16} className="mr-1" />
                    <span>3.2%</span>
                  </span>
                  <span className="text-gray-500 ml-2">vs last period</span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Positive Reviews</p>
                    <h3 className="text-2xl font-bold text-green-600 mt-1">{metrics.positiveReviews}</h3>
                  </div>
                  <span className="bg-green-100 p-2 rounded-lg">
                    <TrendingUp size={20} className="text-green-600" />
                  </span>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <span className="text-gray-500">
                    {((metrics.positiveReviews / metrics.totalReviews) * 100).toFixed(1)}% of total
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Neutral Reviews</p>
                    <h3 className="text-2xl font-bold text-yellow-500 mt-1">{metrics.neutralReviews}</h3>
                  </div>
                  <span className="bg-yellow-100 p-2 rounded-lg">
                    <Activity size={20} className="text-yellow-500" />
                  </span>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <span className="text-gray-500">
                    {((metrics.neutralReviews / metrics.totalReviews) * 100).toFixed(1)}% of total
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Negative Reviews</p>
                    <h3 className="text-2xl font-bold text-red-500 mt-1">{metrics.negativeReviews}</h3>
                  </div>
                  <span className="bg-red-100 p-2 rounded-lg">
                    <TrendingDown size={20} className="text-red-500" />
                  </span>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <span className="text-red-500 flex items-center">
                    <TrendingDown size={16} className="mr-1" />
                    <span>2.1%</span>
                  </span>
                  <span className="text-gray-500 ml-2">vs last period</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Rest of the component remains the same... */}
      {/* Visualizations */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("pie")}>
              <h2 className="text-xl font-semibold text-gray-800">Rating Distribution</h2>
              {expandedSection === "pie" ? 
                <ChevronUp size={20} className="text-gray-500" /> :
                <ChevronDown size={20} className="text-gray-500" />
              }
            </div>
          </div>
          
          {(expandedSection === "pie" || expandedSection === "all") && (
            <div className="p-6">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      activeIndex={hoverIndex !== null ? hoverIndex : (animateChart ? activeIndex : null)}
                      activeShape={renderActiveShape}
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={1500}
                      isAnimationActive={true}
                      onMouseEnter={onPieEnter}
                      onMouseLeave={onPieLeave}
                    >
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value} reviews`, name]}
                      contentStyle={{
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        padding: '12px',
                        border: 'none',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)'
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      iconType="circle"
                      formatter={(value) => (
                        <span style={{ color: '#333', fontSize: '14px', fontWeight: '500' }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 bg-gray-50 p-3 rounded-md border border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Chart Navigation</h3>
                <p className="text-xs text-gray-600">Watch the progressive animation highlight each segment. Hover over segments anytime to see detailed information.</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("bar")}>
              <h2 className="text-xl font-semibold text-gray-800">Star Rating Breakdown</h2>
              {expandedSection === "bar" ? 
                <ChevronUp size={20} className="text-gray-500" /> :
                <ChevronDown size={20} className="text-gray-500" />
              }
            </div>
          </div>
          
          {(expandedSection === "bar" || expandedSection === "all") && (
            <div className="p-6">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={50} />
                    <Tooltip formatter={(value) => [`${value} reviews`]} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Detailed Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("detailed")}>
            <h2 className="text-xl font-semibold text-gray-800">Detailed Rating Breakdown</h2>
            {expandedSection === "detailed" ? 
              <ChevronUp size={20} className="text-gray-500" /> :
              <ChevronDown size={20} className="text-gray-500" />
            }
          </div>
        </div>
        
        {(expandedSection === "detailed" || expandedSection === "all") && (
          <div className="p-6">
            <div className="space-y-6">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = metrics.ratingDistribution[rating];
                const percentage = metrics.totalReviews ? (count / metrics.totalReviews) * 100 : 0;
                
                return (
                  <div key={rating} className="group">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center w-16">
                        <span className="font-semibold text-gray-800 mr-1">{rating}</span>
                        <Star size={16} className="text-yellow-400 fill-current" />
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500 ease-in-out group-hover:opacity-80"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: 
                                rating >= 4 ? "#10B981" :
                                rating === 3 ? "#F59E0B" : "#EF4444"
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-24 text-right">
                        <span className="font-medium text-gray-800">{count}</span>
                        <span className="text-gray-500 ml-1">({percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 flex justify-center">
              <button className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium py-2 px-6 rounded-md transition-colors flex items-center">
              <a href="/adminreview">
                <span>View All Reviews</span>
            </a>
                <ChevronDown size={16} className="ml-2" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer with last updated */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default ReviewPerformance;