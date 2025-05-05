import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { TrendingUp, TrendingDown, Star, Activity, MessageSquare, Calendar, ChevronDown, ChevronUp, Filter } from "lucide-react";

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
  const [timeframe, setTimeframe] = useState("all");
  const [expandedSection, setExpandedSection] = useState("all");
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Simulate API call with loading delay for demo
        setTimeout(() => {
          // Mock data for demonstration
          const mockData = [
            { id: 1, rating: 5, date: "2025-04-30" },
            { id: 2, rating: 4, date: "2025-04-29" },
            { id: 3, rating: 5, date: "2025-04-28" },
            { id: 4, rating: 3, date: "2025-04-27" },
            { id: 5, rating: 5, date: "2025-04-26" },
            { id: 6, rating: 2, date: "2025-04-25" },
            { id: 7, rating: 4, date: "2025-04-24" },
            { id: 8, rating: 5, date: "2025-04-23" },
            { id: 9, rating: 1, date: "2025-04-22" },
            { id: 10, rating: 3, date: "2025-04-21" },
            { id: 11, rating: 5, date: "2025-04-20" },
            { id: 12, rating: 4, date: "2025-04-19" },
            { id: 13, rating: 5, date: "2025-04-18" },
            { id: 14, rating: 4, date: "2025-04-17" },
            { id: 15, rating: 2, date: "2025-04-16" },
          ];
          processReviewData(mockData);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to load reviews data.");
        console.error("Error fetching reviews:", err);
        setLoading(false);
      }
    };

    fetchReviews();
  }, [timeframe]);

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

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? "all" : section);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
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
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
              <button className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-2 px-4 rounded-md transition-colors">
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
          <div className="relative">
            <button 
              className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Calendar size={16} className="mr-2" />
              <span>{timeframe === "all" ? "All Time" : 
                    timeframe === "week" ? "Last Week" : 
                    timeframe === "month" ? "Last Month" : "Last Year"}</span>
              <ChevronDown size={16} className="ml-2" />
            </button>
            {/* Dropdown would be here */}
          </div>
          
          <button className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter size={16} className="mr-2" />
            <span>Filter</span>
          </button>
          
          <button className="flex items-center bg-indigo-600 rounded-md px-4 py-2 text-white hover:bg-indigo-700 transition-colors">
            <Activity size={16} className="mr-2" />
            <span>Generate Report</span>
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
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} reviews`]} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
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
                <span>View All Reviews</span>
                <ChevronDown size={16} className="ml-2" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewPerformance;