import React from 'react';
import surfing from './image/surfing.jpg';
import hiking from './image/hiking.jpg';
import safari from './image/wild.jpg';
import diving from './image/slider1.jpg';

function FeaturedAdventures() {
  const adventures = [
    {
      id: 1,
      name: "Surfing Experience",
      location: "Arugam Bay",
      price: "7,500.00",
      rating: 5,
      image: surfing,
      badge: "Water Sport"
    },
    {
      id: 2,
      name: "Mountain Hiking",
      location: "Ella",
      price: "6,000.00",
      rating: 5,
      image: hiking,
      badge: "Adventure"
    },
    {
      id: 3,
      name: "Wildlife Safari",
      location: "Yala National Park",
      price: "8,000.00",
      rating: 5,
      image: safari,
      badge: "Nature"
    },
    {
      id: 4,
      name: "Scuba Diving",
      location: "Trincomalee",
      price: "9,500.00",
      rating: 5,
      image: diving,
      badge: "Underwater"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Top Adventure Packages</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adventures.map((adventure) => (
          <div 
            key={adventure.id}
            className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white flex flex-col"
          >
            <div className="relative">
              <img 
                src={adventure.image} 
                alt={adventure.name} 
                className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105" 
              />
              <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {adventure.badge}
              </span>
            </div>
            
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="font-bold text-lg text-gray-800 mb-1">{adventure.name}</h3>
              <div className="flex items-center mb-2">
                <svg className="w-4 h-4 text-gray-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-500">{adventure.location}</span>
              </div>
              
              <div className="mt-auto">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-800">
                    Starting from <span className="text-blue-600 font-bold">Rs.{adventure.price}</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <div className="bg-blue-600 text-white px-2 py-1 rounded font-bold text-sm">
                      {adventure.rating}
                    </div>
                    <span className="text-xs font-medium text-gray-600">Excellent</span>
                  </div>
                </div>
                
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors duration-300 font-medium text-sm">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturedAdventures;
