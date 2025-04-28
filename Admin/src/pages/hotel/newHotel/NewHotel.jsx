import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

// ✅ Yup validation schema
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
    .matches(/^[a-zA-Z\s]*$/, "City cannot contain numbers or special characters"),
  address: yup.string().required("Address is required"),
  distance: yup.string().required("Distance is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Cheapest price is required")
    .positive("Price must be positive"),
  title: yup.string().required("Title is required"),
  desc: yup.string().required("Description is required"),
  rooms: yup
    .array()
    .of(yup.string())
    .min(1, "At least one room must be selected")
});

const NewHotel = () => {
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // 🚀 Fetch room data (instead of useFetch)
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("http://localhost:8070/api/rooms");
        const data = await res.json();
        setRooms(data);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
    };

    fetchRooms();
  }, []);

  // 🖼 Image preview
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreview(previews);
  };

  // ☁️ Cloudinary Upload
  const uploadImages = async (files) => {
    const cloudName = "digdkr6r0";
    const uploadPreset = "TravelMingle";

    const uploadedUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        }
      } catch (error) {
        console.error("Upload failed for file:", file.name, error);
      }
    }

    return uploadedUrls;
  };

  const handleRoomSelect = (e) => {
    const values = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedRooms(values);
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const imageUrls = await uploadImages(files);

    const hotelData = {
      ...data,
      photos: imageUrls,
      rooms: selectedRooms,
    };

    try {
      const response = await fetch("http://localhost:8070/api/hotels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hotelData),
      });

      if (response.ok) {
        alert("✅ Hotel added successfully!");
        navigate("/admin");
      } else {
        alert("❌ Failed to add hotel.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ An error occurred while adding the hotel.");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-center text-2xl font-bold mb-5 text-blue-900">Add New Hotel</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700">Hotel Name</label>
            <input type="text" {...register("name")} className="input-field" />
            <p className="text-red-500 text-sm">{errors.name?.message}</p>
          </div>

          <div>
            <label className="block text-gray-700">Hotel Number</label>
            <input type="text" {...register("hotelId")} className="input-field" />
            <p className="text-red-500 text-sm">{errors.hotelId?.message}</p>
          </div>

          <div>
            <label className="block text-gray-700">Hotel Type</label>
            <select {...register("type")} className="input-field">
              <option value="">Select a type</option>
              <option value="hotel">Hotel</option>
              <option value="villa">Villa</option>
              <option value="apartment">Apartment</option>
              <option value="resort">Resort</option>
              <option value="kaban">Kaban</option>
            </select>
            <p className="text-red-500 text-sm">{errors.type?.message}</p>
          </div>

          <div>
            <label className="block text-gray-700">City</label>
            <input type="text" {...register("city")} className="input-field" />
            <p className="text-red-500 text-sm">{errors.city?.message}</p>
          </div>

          <div>
            <label className="block text-gray-700">Address</label>
            <input type="text" {...register("address")} className="input-field" />
            <p className="text-red-500 text-sm">{errors.address?.message}</p>
          </div>

          <div>
            <label className="block text-gray-700">Distance</label>
            <input type="text" {...register("distance")} className="input-field" />
            <p className="text-red-500 text-sm">{errors.distance?.message}</p>
          </div>

          <div>
            <label className="block text-gray-700">Price</label>
            <input type="number" {...register("price")} className="input-field" />
            <p className="text-red-500 text-sm">{errors.price?.message}</p>
          </div>

          <div>
            <label className="block text-gray-700">Title</label>
            <input type="text" {...register("title")} className="input-field" />
            <p className="text-red-500 text-sm">{errors.title?.message}</p>
          </div>

          <div>
            <label className="block text-gray-700">Description</label>
            <textarea {...register("desc")} className="input-field" />
            <p className="text-red-500 text-sm">{errors.desc?.message}</p>
          </div>

          <div>
            <label className="block text-gray-700">Images</label>
            <input type="file" multiple onChange={handleFileChange} />
            <div className="flex flex-wrap gap-2 mt-2">
              {preview.map((src, index) => (
                <img key={index} src={src} alt="preview" className="w-20 h-20 object-cover rounded" />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700">Select Rooms</label>
            <select multiple {...register("rooms")} className="input-field">
              {rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.title}
                </option>
              ))}
            </select>
            <p className="text-red-500 text-sm">{errors.rooms?.message}</p>
          </div>


          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "Submitting..." : "Add Hotel"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewHotel;
