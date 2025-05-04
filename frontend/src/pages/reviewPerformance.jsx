import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import axios from "axios";

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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/reviews");
        processReviewData(response.data);
      } catch (err) {
        setError("Failed to load reviews data.");
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

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
    { name: "Positive (4-5★)", value: metrics.positiveReviews, color: "#4CAF50" },
    { name: "Neutral (3★)", value: metrics.neutralReviews, color: "#FF9800" },
    { name: "Negative (1-2★)", value: metrics.negativeReviews, color: "#F44336" }
  ];

  if (loading) return <div className="text-center p-5 text-xl">Loading review data...</div>;
  if (error) return <div className="text-center text-red-600 p-5">{error}</div>;

  return (
    <div className="max-w-screen-xl mx-auto p-5 font-sans">
      <h1 className="text-center text-3xl text-gray-800 mb-8">Review Performance Dashboard</h1>
      
      {/* First Div: Summary Metrics */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg p-5 shadow-md text-center">
          <h3 className="text-lg text-gray-600">Total Reviews</h3>
          <p className="text-3xl font-bold text-gray-800">{metrics.totalReviews}</p>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-md text-center">
          <h3 className="text-lg text-gray-600">Average Rating</h3>
          <p className="text-3xl font-bold text-gray-800">{metrics.averageRating}</p>
          <p className="text-sm text-gray-500">out of 5</p>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-md text-center">
          <h3 className="text-lg text-gray-600">Positive Reviews</h3>
          <p className="text-3xl font-bold text-green-500">{metrics.positiveReviews}</p>
          <p className="text-sm text-gray-500">4-5 stars</p>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-md text-center">
          <h3 className="text-lg text-gray-600">Neutral Reviews</h3>
          <p className="text-3xl font-bold text-orange-500">{metrics.neutralReviews}</p>
          <p className="text-sm text-gray-500">3 stars</p>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-md text-center">
          <h3 className="text-lg text-gray-600">Negative Reviews</h3>
          <p className="text-3xl font-bold text-red-500">{metrics.negativeReviews}</p>
          <p className="text-sm text-gray-500">1-2 stars</p>
        </div>
      </div>

      {/* Second Div: Pie Chart */}
      <div className="bg-white rounded-lg p-5 shadow-md mb-8">
        <h2 className="text-2xl text-gray-800">Rating Distribution</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} reviews`]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Third Div: Detailed Breakdown */}
      <div className="bg-white rounded-lg p-5 shadow-md">
        <h2 className="text-2xl text-gray-800">Detailed Rating Breakdown</h2>
        <div className="space-y-4 mt-5">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = metrics.ratingDistribution[rating];
            const percentage = metrics.totalReviews ? (count / metrics.totalReviews) * 100 : 0;
            
            return (
              <div key={rating} className="flex justify-between items-center">
                <div className="flex-1">
                  <span className="font-semibold text-gray-800">{rating} ★</span>
                  <span className="text-sm text-gray-500">({count} reviews, {percentage.toFixed(1)}%)</span>
                </div>
                <div className="flex-2 bg-gray-200 rounded-full h-3">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: 
                        rating >= 4 ? "#4CAF50" :
                        rating === 3 ? "#FF9800" : "#F44336"
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReviewPerformance;
