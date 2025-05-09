import React, { useState } from 'react';
import hotel from './image/hotel.jpg';
import vila from './image/vila.jpg';
import kabana from './image/kabana.jpg';
import resort from './image/resort.jpg';
import apartment from './image/apartment.jpg';
import house from './image/house.jpg';
import cottage from './image/cottage.jpg';
import bungalow from './image/bungalow.jpg';
import useFetch from '../../hooks/useFetch';
import { motion } from 'framer-motion';

function PropertyList() {
  const { data, loading, error } = useFetch("http://localhost:4000/api/hotels/countByType");
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Ensure `data` is always an array (fallback to empty array if not)
  const propertyData = Array.isArray(data) ? data : [];

  const propertyTypes = [
    { type: "hotel", label: "Hotels", img: hotel, icon: "🏨" },
    { type: "villas", label: "Villas", img: vila, icon: "🏡" },
    { type: "kabana", label: "Kabana", img: kabana, icon: "🌴" },
    { type: "resorts", label: "Resorts", img: resort, icon: "🏝️" },
    { type: "apartments", label: "Apartments", img: apartment, icon: "🏢" },
    { type: "house", label: "Guest House", img: house, icon: "🏠" },
    { type: "cottage", label: "Cottage", img: cottage, icon: "🌲" },
    { type: "bungalow", label: "Bungalow", img: bungalow, icon: "🛖" }
  ];

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto py-16 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 font-medium">Discovering properties...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto py-16 px-4">
        <div className="bg-red-50 p-6 rounded-lg">
          <h3 className="text-red-800 font-medium text-lg">Oops! Something went wrong</h3>
          <p className="text-red-600 mt-2">We couldn't load the property types. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Find the Perfect Stay</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Discover the perfect accommodation for your next adventure</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {propertyTypes.map((property, index) => {
          const countObj = propertyData.find((item) => item.type === property.type);
          const count = countObj?.count ?? 0;

          return (
            <motion.div
              key={index}
              className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer bg-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative overflow-hidden h-48">
                <img
                  src={property.img}
                  alt={property.label}
                  className={`w-full h-full object-cover transition-transform duration-700 ${hoveredIndex === index ? 'scale-110' : 'scale-100'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">{property.label}</h3>
                    <span className="text-2xl">{property.icon}</span>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-blue-600 font-semibold">{count.toLocaleString()}</span>
                    <span className="text-gray-500"> properties</span>
                  </div>

                  <div className={`py-1 px-3 rounded-full ${count > 100 ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'} text-xs font-semibold`}>
                    {count > 100 ? 'Popular' : 'Available'}
                  </div>
                </div>

                <div className="mt-3 flex items-center">
                  <div className="flex -space-x-1">
                    {[...Array(Math.min(3, Math.max(1, Math.floor(count / 50))))].map((_, i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-full border-2 border-white ${count > 0 ? 'bg-green-400' : 'bg-yellow-300'
                          }`}
                      ></div>
                    ))}
                  </div>
                  <span className="ml-2 text-xs text-gray-500">
                    {count > 0 ? 'Recently booked' : 'Be the first to book!'}
                  </span>
                </div>
              </div>

              <div className={`px-4 py-3 border-t border-gray-100 ${hoveredIndex === index ? 'bg-blue-50' : 'bg-gray-50'}`}>
                <span className="text-sm font-medium text-blue-600">Explore {property.label.toLowerCase()}</span>
                <svg
                  className={`inline-block ml-1 w-4 h-4 transition-transform duration-300 ${hoveredIndex === index ? 'translate-x-1' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default PropertyList;