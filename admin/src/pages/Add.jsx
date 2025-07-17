

import React, { useState } from 'react';
import Nav from '../components/Nav';
import Sidebar from '../components/Sidebar';
import upload from "../assets/upload.jpg";
import axios from 'axios';

function Add() {
    const [image, setImage] = useState({
        image1: "",
        image2: "",
        image3: "",
        image4: "",
    });

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        subCategory: "",
        sizes: [],
        bestSeller: false,
    });
    const availableSizes = ["S", "M", "L", "XL", "XXL"];

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        setErrors(prev => ({ ...prev, [name]: "" }));
        
    };

    const uploadToCloudinary = async (file) => {
        const data = new FormData();
        data.append("file", file);
        try {
            const res = await axios.post("http://localhost:3000/upload-image", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return res.data.url;
        } catch (err) {
            console.error("Image Upload Error:", err);
            return "";
        }
    };

    const handleImageChange = async (e, key) => {
        const file = e.target.files[0];
        if (file) {
            const url = await uploadToCloudinary(file);
            if (url) {
                setImage(prev => ({
                    ...prev,
                    [key]: url,
                }));
                setErrors(prev => ({ ...prev, [key]: "" }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                ...formData,
                ...image,
                price: parseFloat(formData.price),
                date: Date.now(),
            };

            const res = await axios.post("http://localhost:3000/addProduct", payload);
            alert("Product added successfully!");
            setErrors({});
            setImage({
                 image1: "",
        image2: "",
        image3: "",
        image4: "",
            })
            setFormData({
                  name: "",
        description: "",
        price: "",
        category: "",
        subCategory: "",
        sizes: [],
        bestSeller: false,
            })
        } catch (error) {
  if (error.response?.data?.errors) {
    const formatted = {};

    error.response.data.errors.forEach((err) => {
      if (err.includes("Product name")) formatted.name = err;
      else if (err.includes("Description")) formatted.description = err;
      else if (err.includes("Price")) formatted.price = err;
      else if (err.includes("Category")) formatted.category = err;
      else if (err.includes("Subcategory")) formatted.subCategory = err;
      else if (err.includes("Image 1")) formatted.image1 = err;
      else if (err.includes("Image 2")) formatted.image2 = err;
      else if (err.includes("Image 3")) formatted.image3 = err;
      else if (err.includes("Image 4")) formatted.image4 = err;
      else if (err.toLowerCase().includes("size")) formatted.sizes = err; // ✅ Important
      else if (err.includes("Best Seller")) formatted.bestSeller = err;
    });

    setErrors(formatted); // ✅ Set all matched errors
  } else {
    alert("Error adding product");
  }
}

    };

    return (
        <div className='w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-white overflow-x-hidden relative'>
            <Nav />
            <Sidebar />
            <div className='w-[82%] h-auto flex items-center justify-start overflow-x-hidden absolute right-0'>
                <form onSubmit={handleSubmit} className='w-[100%] md:w-[90%] mt-[70px] flex flex-col gap-[30px] py-[60px] px-[30px] md:px-[60px]'>

                    <h2 className='text-[25px] md:text-[40px] font-bold'>Add Product Page</h2>

                    {/* Image Upload */}
                    <div className='flex justify-center md:justify-start flex-wrap gap-5'>
                        {["image1", "image2", "image3", "image4"].map((key) => (
                            <div key={key}>
                                <label htmlFor={key} className='w-[100px] h-[100px] cursor-pointer block'>
                                    <img
                                        src={
                                            image[key]
                                                ? image[key]
                                                : upload
                                        }
                                        alt="preview"
                                        className='w-full h-full object-cover border-2 rounded-lg'
                                    />
                                    <input
                                        type='file'
                                        id={key}
                                        className='hidden'
                                        accept='image/*'
                                        onChange={(e) => handleImageChange(e, key)}
                                    />
                                </label>
                                {errors[key] && <p className="text-red-400 text-sm mt-1">{errors[key]}</p>}
                            </div>
                        ))}
                    </div>

                    {/* Product Name */}
                    <div>
                        <input
                            type="text"
                            name="name"
                            placeholder="Product Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className='bg-slate-600 hover:border-[#46d1f7] border px-4 py-2 rounded-md text-white w-full'
                        />
                        {errors.name && <p className='text-red-400 text-sm mt-1'>{errors.name}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <textarea
                            name="description"
                            placeholder="Product Description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className='bg-slate-600 hover:border-[#46d1f7] border px-4 py-2 rounded-md text-white w-full'
                        />
                        {errors.description && <p className='text-red-400 text-sm mt-1'>{errors.description}</p>}
                    </div>

                    {/* Category and Subcategory */}
                    <div className='w-full flex-col sm:flex-row flex justify-between gap-4'>
                        <div className='w-[100%] sm:w-[50%]'>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className='bg-slate-600 px-4 py-2 rounded-md text-white hover:border-[#46d1f7] border w-full'
                            >
                                <option value="" >Select Category</option>
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                                <option value="Kids">Kids</option>
                            </select>
                            {errors.category && <p className='text-red-400 text-sm mt-1'>{errors.category}</p>}
                        </div>
                        <div className='w-[100%] sm:w-[50%]'>
                            <select
                                name="subCategory"
                                value={formData.subCategory}
                                onChange={handleInputChange}
                                className='bg-slate-600 px-4 py-2 rounded-md text-white hover:border-[#46d1f7] border w-full'
                            >
                                <option value="">Select Sub Category</option>
                                <option value="TopWear">TopWear</option>
                                <option value="BottomWear">BottomWear</option>
                                <option value="WinterWear">WinterWear</option>
                            </select>
                            {errors.subCategory && <p className='text-red-400 text-sm mt-1'>{errors.subCategory}</p>}
                        </div>
                    </div>

                    {/* Price */}

                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className='bg-slate-600 hover:border-[#46d1f7] border px-4 py-2 rounded-md text-white w-full'
                    />
                    {errors.price && <p className='text-red-400 text-sm mt-1'>{errors.price}</p>}
                    <div>
                        <p className='mb-2 font-semibold'>Select Sizes</p>
                        <div className='flex gap-3 flex-wrap'>
                            {availableSizes.map((size) => (
                                <div
                                    key={size}
                                    onClick={() => {
                                        setFormData((prev) => {
                                            const alreadySelected = prev.sizes.includes(size);
                                            const updatedSizes = alreadySelected
                                                ? prev.sizes.filter((s) => s !== size)
                                                : [...prev.sizes, size];

                                            return { ...prev, sizes: updatedSizes };
                                        });

                                        setErrors((prev) => ({ ...prev, sizes: "" }));
                                    }}
                                    className={`cursor-pointer px-4 py-2 rounded-md border 
          ${formData.sizes.includes(size)
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "bg-slate-600 text-white border-slate-400"}`}
                                >
                                    {size}
                                </div>
                            ))}
                        </div>
                        {errors.sizes && <p className='text-red-400 text-sm mt-2'>{errors.sizes}</p>}
                    </div>



                    {/* Best Seller */}
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                name="bestSeller"
                                checked={formData.bestSeller}
                                onChange={handleInputChange}
                            />
                            <span className='ml-2'>Best Seller</span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button type='submit' className='bg-blue-600 px-5 py-2 rounded-md mt-4'>
                        Add Product
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Add;
