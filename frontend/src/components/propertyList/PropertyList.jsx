import React from 'react';
import hotel from './image/hotel.jpg';
import vila from './image/vila.jpg';
import kabana from './image/kabana.jpg';
import resort from './image/resort.jpg';
import apartment from './image/apartment.jpg';
import useFetch from '../../hooks/useFetch';
import house from './image/house.jpg';
import cottage from './image/cottage.jpg';

function PropertyList() {
  const { data, loading, error } = useFetch("http://localhost:8070/api/hotels/countByType");

  console.log("Fetched property types:", data);

  // Ensure `data` is always an array (fallback to empty array if not)
  const propertyData = Array.isArray(data) ? data : [];

  const propertyTypes = [
    { type: "hotel", label: "Hotels", img: hotel },
    { type: "villas", label: "Villas", img: vila },
    { type: "kabana", label: "Kabana", img: kabana },
    { type: "resorts", label: "Resorts", img: resort },
    { type: "apartments", label: "Apartments", img: apartment },
    { type: "house", label: "Guest House", img: house },
    { type: "cottage", label: "cottage", img: cottage }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto flex justify-between gap-5">
      {loading ? (
        <p>Loading, please wait...</p>
      ) : error ? (
        <p>Error loading data</p>
      ) : (
        propertyTypes.map((property, index) => {
          const countObj = propertyData.find((item) => item.type === property.type);
          return (
            <div key={index} className="flex-1 rounded-lg overflow-hidden cursor-pointer">
              <img src={property.img} alt={property.label} className="w-full h-45 object-cover" />
              <div className="p-3">
                <h1 className="text-lg text-gray-700 capitalize">{property.label}</h1>
                <h2 className="text-md text-gray-500">{countObj?.count ?? 0} Properties</h2>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default PropertyList;
