import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCircleArrowLeft, 
  faCircleArrowRight, 
  faCircleXmark, 
  faLocationDot,
  faCheck,
  faStar,
  faCalendarDays,
  faUser,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";

import Header from '../../components/header/Header';
import MailList from '../../components/mailList/MailList';
import Footer from '../../components/footer/Footer';
import useFetch from "../../hooks/useFetch.jsx";
import { SearchContext } from '../../context/SearchContext.jsx';

import fallback from "./image/araliya.jpg";

const Hotel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.pathname.split("/")[2];
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const { data, loading, error } = useFetch(`http://localhost:4000/api/hotels/find/${id}`);
  const { dates, options } = useContext(SearchContext);

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  function dayDifference(date1, date2) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }

  const days = dayDifference(dates[0].endDate, dates[0].startDate);
  const formattedCheckIn = dates[0].startDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
  const formattedCheckOut = dates[0].endDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;
    const maxSlides = data.photos?.length || 1;

    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? maxSlides - 1 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === maxSlides - 1 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber);
  };

  const handleClick = () => {
    const user = true; // Replace with actual user check
    if (user) {
      const totalPrice = days * data.price * options.room + Math.round(data.price * days * 0.05);
      navigate("/reservation", {
        state: {
          hotelName: data.name,
          totalPrice: totalPrice,
          roomCount: options.room,
        }
      });
    } else {
      navigate("/login");
    }
  };
  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-blue-400 mb-3"></div>
          <div className="text-xl font-semibold text-gray-700">Loading hotel details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <h2 className="text-red-500 text-xl font-bold mb-4">Something went wrong</h2>
          <p className="text-gray-700">We couldn't load the hotel details. Please try again later.</p>
          <button 
            onClick={() => navigate("/")}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header type="list" />
      
      {/* Fullscreen image modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <button 
            className="absolute top-5 right-5 text-white bg-gray-800 bg-opacity-60 p-2 rounded-full hover:bg-opacity-80 transition duration-200"
            onClick={() => setOpen(false)}
          >
            <FontAwesomeIcon icon={faCircleXmark} className="text-2xl" />
          </button>
          
          <button 
            className="absolute left-5 bg-gray-800 bg-opacity-60 p-3 rounded-full hover:bg-opacity-80 transition duration-200"
            onClick={() => handleMove("l")}
          >
            <FontAwesomeIcon icon={faCircleArrowLeft} className="text-2xl text-white" />
          </button>
          
          <img
            src={data.photos?.[slideNumber] || fallback}
            alt={`Hotel view ${slideNumber + 1}`}
            className="max-w-5xl max-h-5xl object-contain"
          />
          
          <button 
            className="absolute right-5 bg-gray-800 bg-opacity-60 p-3 rounded-full hover:bg-opacity-80 transition duration-200"
            onClick={() => handleMove("r")}
          >
            <FontAwesomeIcon icon={faCircleArrowRight} className="text-2xl text-white" />
          </button>
          
          <div className="absolute bottom-5 text-center w-full">
            <div className="inline-flex gap-1">
              {data.photos?.map((_, i) => (
                <button 
                  key={i}
                  className={`w-2 h-2 rounded-full ${i === slideNumber ? 'bg-white' : 'bg-gray-400'}`}
                  onClick={() => setSlideNumber(i)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hotel header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <div className="flex items-center mb-1">
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded mr-2">
                Top Rated
              </span>
              <div className="flex items-center text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FontAwesomeIcon key={star} icon={faStar} className="text-sm" />
                ))}
                <span className="ml-1 text-gray-700 text-sm font-medium">5.0</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">{data.name}</h1>
            <div className="flex items-center text-gray-600 mt-1">
              <FontAwesomeIcon icon={faLocationDot} className="text-red-500 mr-1" />
              <span>{data.address}</span>
            </div>
          </div>
          
          <button 
            onClick={handleClick}
            className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center"
          >
            Reserve Now
            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
          </button>
        </div>

        {/* Special offers banner */}
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8 rounded-r-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faCheck} className="text-green-600 mt-1" />
            </div>
            <div className="ml-3">
              <p className="text-green-700 font-medium">
                Book a stay over Rs.{data.price} at this property and get a free airport taxi
              </p>
              <p className="text-green-600 text-sm mt-1">
                Excellent location – {data.distance}m from center
              </p>
            </div>
          </div>
        </div>
        
        {/* Modern Photo Gallery */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold text-gray-800">Hotel Gallery</h2>
            {data.photos?.length > 6 && (
              <button 
                onClick={() => handleOpen(6)}
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm bg-blue-50 px-4 py-2 rounded-full transition duration-200"
              >
                View all {data.photos.length} photos
                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </button>
            )}
          </div>
          
          {data.photos?.length > 0 ? (
            <div className="grid grid-cols-12 gap-3">
              {/* Main featured image */}
              <div 
                className="col-span-12 md:col-span-6 relative rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-lg transition duration-300 h-96"
                onClick={() => handleOpen(0)}
              >
                <img
                  src={data.photos[0] || fallback}
                  alt="Featured hotel view"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition duration-300 flex items-end justify-start p-6">
                  <div className="text-white font-medium flex items-center">
                    <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
                    <span>{data.name}</span>
                  </div>
                </div>
              </div>
              
              {/* Grid of smaller images */}
              <div className="col-span-12 md:col-span-6 grid grid-cols-2 gap-3 h-96">
                {data.photos.slice(1, 5).map((photo, i) => (
                  <div 
                    key={i} 
                    className="relative rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition duration-300 group"
                    onClick={() => handleOpen(i + 1)}
                  >
                    <img
                      src={photo || fallback}
                      alt={`Hotel view ${i + 2}`}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300">
                      <div className="p-2 bg-white/80 rounded-full">
                        <FontAwesomeIcon icon={faCircleArrowRight} className="text-blue-600 text-lg" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-xl p-10 text-center">
              <div className="mx-auto w-16 h-16 mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faCircleXmark} className="text-gray-400 text-2xl" />
              </div>
              <p className="text-gray-500 text-lg">No images available for this property</p>
              <p className="text-gray-400 text-sm mt-2">Check back later for updated photos</p>
            </div>
          )}
          
          {/* Image tags/categories */}
          {data.photos?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition duration-200">
                All Photos
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition duration-200">
                Rooms
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition duration-200">
                Exterior
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition duration-200">
                Dining
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition duration-200">
                Amenities
              </button>
            </div>
          )}
        </div>

        {/* Hotel details and booking widget */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Left column - Hotel details */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{data.title}</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {data.desc}
            </p>
            
            <div className="bg-blue-50 p-5 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Property Highlights</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faCheck} className="text-blue-600 mt-1 mr-3" />
                  <span className="text-gray-700">Top location: Highly rated by recent guests (9.8/10)</span>
                </li>
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faCheck} className="text-blue-600 mt-1 mr-3" />
                  <span className="text-gray-700">FREE cancellation on select options</span>
                </li>
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faCheck} className="text-blue-600 mt-1 mr-3" />
                  <span className="text-gray-700">On-site restaurant and bar</span>
                </li>
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faCheck} className="text-blue-600 mt-1 mr-3" />
                  <span className="text-gray-700">24/7 Front desk service</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Right column - Booking widget */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-blue-600 text-white p-5">
                <h3 className="text-xl font-bold">Booking Details</h3>
                <p className="text-sm text-blue-100 mt-1">Perfect for a {days}-night stay!</p>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faCalendarDays} className="text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Check-in</p>
                      <p className="text-lg font-semibold">{formattedCheckIn}</p>
                    </div>
                  </div>
                  
                  <FontAwesomeIcon icon={faArrowRight} className="text-gray-400" />
                  
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faCalendarDays} className="text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Check-out</p>
                      <p className="text-lg font-semibold">{formattedCheckOut}</p>
                    </div>
                  </div>
                </div>
                
                <div className="py-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faUser} className="text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Guests</p>
                      <p className="font-semibold">
                        {options.adult} {options.adult === 1 ? 'adult' : 'adults'}
                        {options.children > 0 && `, ${options.children} ${options.children === 1 ? 'child' : 'children'}`}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="py-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Rs.{data.price} x {days} nights</span>
                    <span className="font-medium">Rs.{data.price * days}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Room count</span>
                    <span className="font-medium">x{options.room}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Service fee</span>
                    <span className="font-medium">Rs.{Math.round(data.price * days * 0.05)}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-xl font-bold text-blue-600">
                      Rs.{days * data.price * options.room + Math.round(data.price * days * 0.05)}
                    </span>
                  </div>
                  
                  <button 
                    onClick={handleClick}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-200"
                  >
                    Reserve Now
                  </button>
                  
                  <p className="text-xs text-center text-gray-500 mt-4">
                    You won't be charged yet
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      
      {openModal && <Reserve setOpen={setOpenModal} hotelId={id}/>}
    </div>
  );
};

export default Hotel;