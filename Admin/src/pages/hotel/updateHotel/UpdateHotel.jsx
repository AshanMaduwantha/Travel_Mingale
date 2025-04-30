import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";

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
  
  const [formStep, setFormStep] = useState(1);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    watch,
    getValues
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

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Next step handler
  const handleNextStep = async () => {
    // Validate current step fields
    const fieldsToValidate = formStep === 1 
      ? ["name", "hotelId", "type", "city", "address"]
      : ["distance", "price", "title", "desc"];
      
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      setFormStep(formStep + 1);
    }
  };

  // Previous step handler
  const handlePrevStep = () => {
    setFormStep(formStep - 1);
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:4000/api/hotels/${hotel._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        showNotification("Hotel updated successfully!", "success");
        setTimeout(() => navigate("/admin"), 1500);
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || "Failed to update hotel", "error");
      }
    } catch (error) {
      console.error("Update error:", error);
      showNotification("An error occurred while updating the hotel", "error");
    } finally {
      setLoading(false);
    }
  };

  // Calculate form completion percentage
  const calculateProgress = () => {
    const fields = ["name", "hotelId", "type", "city", "address", "distance", "price", "title", "desc"];
    const completedFields = fields.filter(field => getValues(field) && !errors[field]);
    return Math.round((completedFields.length / fields.length) * 100);
  };

  if (!hotel) return <div className="text-center mt-10 p-4 bg-red-100 text-red-700 rounded-lg">No hotel data found. Please return to the hotels list.</div>;

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center ${
            notification.type === "success" ? "bg-green-100 text-green-800" : 
            notification.type === "warning" ? "bg-yellow-100 text-yellow-800" : 
            "bg-red-100 text-red-800"
          }`}
        >
          <span className="mr-2">
            {notification.type === "success" ? "✅" : notification.type === "warning" ? "⚠️" : "❌"}
          </span>
          {notification.message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <h2 className="text-2xl font-bold">Update Hotel</h2>
          <p className="mt-2 opacity-90">Update hotel details in your inventory</p>
          
          {/* Progress indicator */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{calculateProgress()}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Form Steps Indicator */}
        <div className="flex border-b border-gray-200">
          <button 
            className={`flex-1 py-3 text-center font-medium ${formStep === 1 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => formStep !== 1 && handlePrevStep()}
          >
            1. Basic Details
          </button>
          <button 
            className={`flex-1 py-3 text-center font-medium ${formStep === 2 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => formStep === 1 && handleNextStep()}
          >
            2. Additional Info
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {/* Step 1: Basic Details */}
          {formStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
                  <input 
                    type="text" 
                    {...register("name")} 
                    className={`w-full px-4 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`} 
                    placeholder="Enter hotel name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hotel ID</label>
                  <input 
                    type="text" 
                    {...register("hotelId")} 
                    className={`w-full px-4 py-2 rounded-lg border ${errors.hotelId ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`} 
                    placeholder="Enter hotel ID (letters and numbers only)"
                  />
                  {errors.hotelId && <p className="mt-1 text-sm text-red-600">{errors.hotelId.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Type</label>
                <select 
                  {...register("type")} 
                  className={`w-full px-4 py-2 rounded-lg border ${errors.type ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select a type</option>
                  <option value="hotel">Hotel</option>
                  <option value="villa">Villa</option>
                  <option value="apartment">Apartment</option>
                  <option value="resort">Resort</option>
                  <option value="kaban">Kaban</option>
                </select>
                {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input 
                    type="text" 
                    {...register("city")} 
                    className={`w-full px-4 py-2 rounded-lg border ${errors.city ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`} 
                    placeholder="Enter city name"
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input 
                    type="text" 
                    {...register("address")} 
                    className={`w-full px-4 py-2 rounded-lg border ${errors.address ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`} 
                    placeholder="Enter full address"
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Additional Info */}
          {formStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Distance from City Center (km)</label>
                  <input 
                    type="text" 
                    {...register("distance")} 
                    className={`w-full px-4 py-2 rounded-lg border ${errors.distance ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`} 
                    placeholder="Enter distance in km"
                  />
                  {errors.distance && <p className="mt-1 text-sm text-red-600">{errors.distance.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Starting Price (₹)</label>
                  <input 
                    type="number" 
                    {...register("price")} 
                    className={`w-full px-4 py-2 rounded-lg border ${errors.price ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`} 
                    placeholder="Enter starting price"
                  />
                  {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  {...register("title")} 
                  className={`w-full px-4 py-2 rounded-lg border ${errors.title ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`} 
                  placeholder="Enter an attractive title"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  {...register("desc")} 
                  className={`w-full px-4 py-2 rounded-lg border ${errors.desc ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`} 
                  placeholder="Enter a detailed description of the hotel"
                  rows="6"
                />
                {errors.desc && <p className="mt-1 text-sm text-red-600">{errors.desc.message}</p>}
              </div>
            </div>
          )}

          {/* Form Navigation */}
          <div className="mt-8 flex justify-between">
            {formStep > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Back
              </button>
            )}
            
            {formStep < 2 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-blue-400"
              >
                {loading ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">⟳</span>
                    Submitting...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateHotel;