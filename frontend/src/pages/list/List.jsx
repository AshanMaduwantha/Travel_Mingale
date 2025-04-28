import React, { useState } from 'react';
import Header from '../../components/header/Header';
import Navbar from '../../components/navbar/Navbar';
import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from '../../components/searchItem/SearchItem';
import useFetch from '../../hooks/useFetch.jsx';

const List = () => {
  const location = useLocation();
  const [destination, setDestination] = useState(location.state.destination);
  const [dates, setDates] = useState(location.state.dates);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(location.state.options);
  
  // Controlled inputs for min and max prices
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  // Search values that only update when the button is clicked
  const [searchMin, setSearchMin] = useState(5000);
  const [searchMax, setSearchMax] = useState(31000);

  // Fetch data only when the button is clicked
  const { data, loading, error, reFetch } = useFetch(
    `http://localhost:8070/api/hotels?city=${destination}&min=${searchMin}&max=${searchMax}`
  );

  const handleClick = () => {
    setSearchMin(min || 5000); // Default value if empty
    setSearchMax(max || 31000);
    reFetch(); // Trigger API call
  };

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-5xl flex gap-5">
          <div className="flex-1 bg-yellow-400 p-5 rounded-lg sticky top-10">
            <h1 className="text-2xl text-gray-500 mb-5">Search</h1>

            <div className="flex flex-col gap-3 mb-5">
              <label className="text-l">Destination</label>
              <input
                type="text"
                placeholder={destination}
                className="h-8 p-2 border-none  bg-white rounded-sm"
              />
            </div>

            <div className="flex flex-col gap-3 mb-5">
              <label className="text-l">Check-in Date</label>
              <span
                onClick={() => setOpenDate(!openDate)}
                className="h-8 p-2 bg-white flex items-center cursor-pointer rounded-sm"
              >
                {`${format(dates[0].startDate, "MM/dd/yyyy")} to ${format(dates[0].endDate, "MM/dd/yyyy")}`}
              </span>
              {openDate && (
                <DateRange
                  onChange={(item) => setDates([item.selection])}
                  minDate={new Date()}
                  ranges={dates}
                />
              )}
            </div>

            <div className="flex flex-col gap-5 mb-5">
              <label className="text-xl">Options</label>
              <div className="p-2">
                <div className="flex justify-between text-l text-gray-700 mb-3 ">
                  <span>Min price <small><br/>(per night)</small></span>
                  <input
                    type="number"
                    value={min}
                    onChange={(e) => setMin(e.target.value)}
                    className="w-26 h-7 bg-white rounded-sm"
                    placeholder='5000'
                  />
                </div>

                <div className="flex justify-between text-l text-gray-700 mb-3">
                  <span>Max price <small><br/> (per night) </small></span>
                  <input
                    type="number"
                    value={max}
                    onChange={(e) => setMax(e.target.value)}
                    className="w-26 h-7 bg-white rounded-sm"
                    placeholder='35000'
                  />
                </div>

                <div className="flex justify-between text-sm text-gray-700 mb-3">
                  <span>Adult</span>
                  <input type="number" min={1} className="w-16" placeholder={options.adult} />
                </div>

                <div className="flex justify-between text-sm text-gray-700 mb-3">
                  <span>Children</span>
                  <input type="number" min={0} className="w-16" placeholder={options.children} />
                </div>

                <div className="flex justify-between text-sm text-gray-700 mb-3">
                  <span>Room</span>
                  <input type="number" min={1} className="w-16" placeholder={options.room} />
                </div>
              </div>
            </div>

            <button onClick={handleClick} className="w-full py-2 bg-blue-700 text-white font-medium cursor-pointer rounded-md">
              Search
            </button>
          </div>

          <div className="flex-3">
            {loading ? (
              "loading"
            ) : error ? (
              <p>Error fetching data</p>
            ) : (
              <>
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((item) => (
                    <SearchItem item={item} key={item._id} />
                  ))
                ) : (
                  <p>No data available</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default List;
