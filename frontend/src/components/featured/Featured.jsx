import React from "react";
import colombo from "./image/colombo.jpg";
import kandy from "./image/kandy.jpg";
import galle from "./image/galle.jpg";
import negombo from "./image/negombo.jpg";
import ella from "./image/ella.jpg";
import nuwaraeliya from "./image/nuwaraeliya.jpg";
import anuradhapura from "./image/anuradhapura.jpg";
import trincomalee from "./image/trincomalee.jpg";
import mirissa from "./image/mirissa.webp";
import polonnaruwa from "./image/polonnaruwa.jpg";
//import kalpitiya from "./image/kalpitiya.jpg";
//import jaffna from "./image/jaffna.jpg";
import useFetch from "../../hooks/useFetch";

const Featured = () => {
  const { data, loading, error } = useFetch(
    "http://localhost:4000/api/hotels/countByCity?cities=colombo,kandy,galle,negombo,ella,nuwaraeliya,anuradhapura,trincomalee,mirissa,polonnaruwa,kalpitiya,jaffna"
  );

  const places = [
    { name: "Colombo", image: colombo },
    { name: "Kandy", image: kandy },
    { name: "Galle", image: galle },
    { name: "Negombo", image: negombo },
    { name: "Ella", image: ella },
    { name: "Nuwara Eliya", image: nuwaraeliya },
    { name: "Anuradhapura", image: anuradhapura },
    { name: "Trincomalee", image: trincomalee },
    { name: "Mirissa", image: mirissa },
    { name: "Polonnaruwa", image: polonnaruwa },
  ];

  return (
    
      
    <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-5 gap-5 z-30 relative ">
      {loading ? (
        "Loading please wait..."
      ) : (
        places.map((place, index) => (
          <div key={index} className="relative text-white rounded-lg overflow-hidden h-64">
            <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
            <div className="absolute bottom-5 left-5">
              <h1 className="text-xl font-bold">{place.name}</h1>
              <h2 className="text-lg">{data[index] || 0} Properties</h2>
            </div>
          </div>
        ))
      )}
    </div>
   
  );
};

export default Featured;
