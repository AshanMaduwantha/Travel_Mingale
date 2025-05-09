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

  const [isUploading, setIsUploading] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    getValues
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // Watch form values for progress indicator
  const formValues = watch();



  // Show notification
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // 🖼 Image preview
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreview(previews);
  };

  // Remove preview image
  const removeImage = (index) => {
    const newFiles = [...files];
    const newPreviews = [...preview];
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setFiles(newFiles);
    setPreview(newPreviews);
  };

  // ☁️ Cloudinary Upload
  const uploadImages = async (files) => {
    if (files.length === 0) return [];
    
    setIsUploading(true);
    const cloudName = "digdkr6r0";
    const uploadPreset = "TravelMingle";

    const uploadedUrls = [];
    let uploadedCount = 0;

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
          uploadedCount++;
        }
      } catch (error) {
        console.error("Upload failed for file:", file.name, error);
      }
    }

    setIsUploading(false);
    if (uploadedCount < files.length) {
      showNotification(`${uploadedCount} of ${files.length} images uploaded successfully`, "warning");
    }
    
    return uploadedUrls;
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
      // Upload images to Cloudinary
      const imageUrls = await uploadImages(files);
      
      if (imageUrls.length === 0 && files.length > 0) {
        showNotification("Failed to upload images", "error");
        setLoading(false);
        return;
      }

      const hotelData = {
        ...data,
        photos: imageUrls,
      };

      const response = await fetch("http://localhost:4000/api/hotels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hotelData),
      });

      if (response.ok) {
        showNotification("Hotel added successfully!", "success");
        setTimeout(() => navigate("/admin"), 1500);
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || "Failed to add hotel", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification("An error occurred while adding the hotel", "error");
    } finally {
      setLoading(false);
    }
  };

  // Calculate form completion percentage
  const calculateProgress = () => {
    const fields = ["name", "hotelId", "type", "city", "address", "distance", "price", "title", "desc", "rooms"];
    const completedFields = fields.filter(field => getValues(field) && !errors[field]);
    return Math.round((completedFields.length / fields.length) * 100);
  };

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
          <h2 className="text-2xl font-bold">Add New Hotel</h2>
          <p className="mt-2 opacity-90">Fill in the details to add a new hotel to your inventory</p>
          
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
          <button 
            className={`flex-1 py-3 text-center font-medium ${formStep === 3 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => formStep === 2 && handleNextStep()}
          >
            3. Media & Rooms
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Starting Price (Rs)</label>
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

          {/* Step 3: Media & Rooms */}
          {formStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg px-6 py-8 text-center cursor-pointer hover:border-blue-500 transition-colors">
                  <input 
                    type="file" 
                    multiple 
                    onChange={handleFileChange} 
                    id="file-upload"
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-blue-600 font-medium">
                      {preview.length === 0 ? 'Click to upload images' : 'Add more images'}
                    </span>
                    <span className="mt-1 block text-sm text-gray-500">
                      Upload hotel images (PNG, JPG, up to 5MB each)
                    </span>
                  </label>
                </div>
                
                {/* Preview images */}
                {preview.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700">Selected Images:</h3>
                    <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                      {preview.map((src, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={src} 
                            alt={`preview ${index + 1}`} 
                            className="h-24 w-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
            
            {formStep < 3 ? (
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
                disabled={loading || isUploading}
                className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-blue-400"
              >
                {loading || isUploading ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">⟳</span>
                    {isUploading ? "Uploading..." : "Submitting..."}
                  </span>
                ) : (
                  "Add Hotel"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewHotel;