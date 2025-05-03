import React from 'react'
import { Link } from "react-router-dom";
import araliya from "./image/araliya.jpg"

const SearchItem = ({item}) => {
    return (
        <div className="flex gap-5 border border-light-gray p-4 rounded-lg mb-5">
            <img src={item.photos[0] || araliya} alt="Araliya" className="w-48 h-48 object-cover" />
            <div className="flex flex-col gap-2 flex-2">
                <h1 className="text-xl text-blue-700">{item.name}</h1>
                <span className="text-xs">{item.distance}m from center</span>
                <span className="text-xs bg-green-800 text-white px-2 py-1 rounded-md">Free airport taxi</span>
                <span className="text-xs font-bold">Studio Apartment with Air conditioning</span>
                <span className="text-xs">{item.desc}</span>
                <span className="text-xs text-green-800 font-bold">Free cancellation</span>
                <span className="text-xs text-green-800">You can cancel later, so lock in this great price today!</span>
            </div>
            <div className="flex flex-col justify-between flex-1">
                {item.rating && <div className="flex justify-between">
                    <span className="font-medium">Excellent</span>
                    <button className="bg-blue-800 text-white px-3 py-1 font-bold">{item.rating}</button>
                </div>}
                <div className="text-right flex flex-col gap-1">
                    <span className="text-2xl">Rs.{item.price}</span>
                    <span className="text-xs text-gray-600">Includes taxes and fees</span>
                    <Link to={`/hotels/${item._id}`}>
                    <button className="bg-blue-700 text-white font-bold px-4 py-2 rounded-md">See availability</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SearchItem
