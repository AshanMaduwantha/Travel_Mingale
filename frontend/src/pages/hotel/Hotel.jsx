import React, { useState } from 'react'
import Header from '../../components/header/Header'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft, faCircleArrowRight, faCircleXmark, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import MailList from '../../components/mailList/MailList';
import Footer from '../../components/footer/Footer'
import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import useFetch from "../../hooks/useFetch.jsx";
import fallback from "./image/araliya.jpg"
import { SearchContext } from '../../context/SearchContext.jsx';


const Hotel = () => {
  const location = useLocation();
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

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? 5 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === 5 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber);
  };

  const handleClick = () => {
    if (user) {
      setOpenModal(true);
    } else {
      navigate("/login");
    }
  };

  return (
    <div>

      <Header type="list" />
      {loading ? (
        "loading"
      ) : (
        <div className="flex flex-col items-center mt-5">
          {open && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center z-50">
              <FontAwesomeIcon
                icon={faCircleXmark}
                className="absolute top-5 right-5 text-3xl text-gray-400 cursor-pointer"
                onClick={() => setOpen(false)}
              />
              <FontAwesomeIcon
                icon={faCircleArrowLeft}
                className="absolute left-5 text-5xl text-gray-400 cursor-pointer"
                onClick={() => handleMove("l")}
              />
              <div className="w-full h-full flex justify-center items-center">
                <img
                  src={data.photos[slideNumber] || fallback} // Provide a fallback image
                  alt=""
                  className="w-4/5 h-4/5 object-cover" />

              </div>
              <FontAwesomeIcon
                icon={faCircleArrowRight}
                className="absolute right-5 text-5xl text-gray-400 cursor-pointer"
                onClick={() => handleMove("r")}
              />
            </div>
          )}

          <div className="w-full max-w-4xl flex flex-col gap-3 relative top-10">
            <button className="absolute top-5 right-0 border-none py-2 px-5 bg-blue-700 text-white font-bold rounded-md cursor-pointer">
              Reserve or Book Now!
            </button>

            <h1 className="text-2xl font-semibold text-black">{data.name}</h1>

            <div className="text-sm flex items-center gap-2">
              <FontAwesomeIcon icon={faLocationDot} />
              <span>{data.address}</span>
            </div>

            <span className="text-blue-700 font-medium">
              Excellent location – {data.distance}m from center
            </span>

            <span className="text-green-800 font-medium">
              Book a stay over Rs.{data.price} at this property and get a
              free airport taxi
            </span>

            {/* Image Thumbnails */}
            {data.photos?.length > 0 ? (
              data.photos.map((photo, i) => (
                <div className="w-1/3" key={i}>
                  <img
                    onClick={() => handleOpen(i)}
                    src={photo || fallback}  // Provide a fallback image
                    alt="Hotel Preview"
                    className="w-full h-40 object-cover cursor-pointer"
                  />
                </div>
              ))
            ) : (
              <p>No images available</p>
            )}


            <div className="flex gap-5 mt-5">
              <div className="flex-3">
                <h1 className="text-2xl font-semibold">{data.title}</h1>
                <p className="text-sm mt-5">
                  {data.desc}
                </p>
              </div>

              <div className="flex-1 bg-blue-100 p-5 flex flex-col gap-5">
                <h1 className="text-lg text-gray-700">Perfect for a {days}-night stay!</h1>
                <span className="text-sm">
                  Located in the real heart of Krakow, this property has an excellent location score of 9.8!
                </span>
                <h2 className="font-light text-xl">
                  <b>Rs.{days * data.price * options.room}</b> ({days}{" "} nights)
                </h2>
                <button onClick={handleClick} className="py-2 px-5 bg-blue-700 text-white font-bold rounded-md cursor-pointer">
                  Reserve or Book Now!
                </button>
              </div>
            </div>
          </div>

          <MailList />
          <Footer />
        </div>
      )}
      {openModal && <Reserve setOpen={setOpenModal} hotelId={id}/>}
    </div>
  );
};

export default Hotel;
