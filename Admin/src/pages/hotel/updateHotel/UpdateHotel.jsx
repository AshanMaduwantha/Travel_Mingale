import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// ✅ Yup Validation Schema
const schema = yup.object().shape({
  name: yup.string().required("Hotel name is required"),
  hotelId: yup
  .string()
  .required("Hotel ID is required")
  .matches(/^[A-Za-z0-9]+$/, "Hotel ID can only contain letters and numbers"),
  type: yup.string().required("Hotel type is required"),
  city: yup
    .string()
    .required("City is required")
    .matches(/^[a-zA-Z\s]*$/, "City cannot contain numbers or symbols"),
  address: yup.string().required("Address is required"),
  distance: yup.string().required("Distance is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required")
    .positive("Price must be positive"),
  title: yup.string().required("Title is required"),
  desc: yup.string().required("Description is required"),
});

const UpdateHotel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotel } = location.state || {};

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // ⏪ Populate form fields
  useEffect(() => {
    if (hotel) {
      Object.entries(hotel).forEach(([key, value]) => {
        if (key in schema.fields) setValue(key, value);
      });
    }
  }, [hotel, setValue]);

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`http://localhost:4000/api/hotels/${hotel._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("✅ Hotel updated successfully!");
        navigate("/admin");
      } else {
        alert("❌ Failed to update hotel.");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("❌ An error occurred while updating the hotel.");
    }
  };

  if (!hotel) return <div className="text-center mt-10 text-red-500">No hotel data found.</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-center text-2xl font-bold mb-5 text-blue-900">Update Hotel</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Name */}
          <div>
            <label className="block text-gray-700">Hotel Name</label>
            <input {...register("name")} className="input-field" />
            <p className="text-red-500 text-sm">{errors.name?.message}</p>
          </div>

          {/* Hotel ID */}
          <div>
            <label className="block text-gray-700">Hotel ID</label>
            <input {...register("hotelId")} className="input-field" />
            <p className="text-red-500 text-sm">{errors.hotelId?.message}</p>
          </div>

          {/* Type */}
          <div>
            <label className="block text-gray-700">Hotel Type</label>
            <select {...register("type")} className="input-field">
              <option value="">Select type</option>
              <option value="Hotel">Hotel</option>
              <option value="Villa">Villa</option>
              <option value="Apartment">Apartment</option>
              <option value="Resort">Resort</option>
              <option value="Kaban">Kaban</option>
            </select>
            <p className="text-red-500 text-sm">{errors.type?.message}</p>
          </div>

          {/* City */}
          <div>
            <label className="block text-gray-700">City</label>
            <input {...register("city")} className="input-field" />
            <p className="text-red-500 text-sm">{errors.city?.message}</p>
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700">Address</label>
            <input {...register("address")} className="input-field" />
            <p className="text-red-500 text-sm">{errors.address?.message}</p>
          </div>

          {/* Distance */}
          <div>
            <label className="block text-gray-700">Distance</label>
            <input {...register("distance")} className="input-field" />
            <p className="text-red-500 text-sm">{errors.distance?.message}</p>
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-700">Cheapest Price</label>
            <input type="number" {...register("price")} className="input-field" />
            <p className="text-red-500 text-sm">{errors.price?.message}</p>
          </div>

          {/* Title */}
          <div>
            <label className="block text-gray-700">Title</label>
            <input {...register("title")} className="input-field" />
            <p className="text-red-500 text-sm">{errors.title?.message}</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700">Description</label>
            <textarea {...register("desc")} className="input-field" />
            <p className="text-red-500 text-sm">{errors.desc?.message}</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateHotel;
