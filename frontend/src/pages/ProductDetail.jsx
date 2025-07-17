import React, { useContext, useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import { shopDataContex } from '../context/ShopContext'
import { FaStar } from "react-icons/fa";
import { FaStarHalfStroke } from "react-icons/fa6";
import { IoIosStarHalf } from "react-icons/io";
import RelatedProduct from '../components/RelatedProduct';

function ProductDetail() {
    const { productId } = useParams()
    const { product, currency,addtoCart } = useContext(shopDataContex)
    const [productData, setProductData] = useState(false)
    const [image, setImage] = useState("")
    const [image1, setImage1] = useState("")
    const [image2, setImage2] = useState("")
    const [image3, setImage3] = useState("")
    const [image4, setImage4] = useState("")
    const [size, setSize] = useState('')

    const fetchProductData = async () => {
        product.map((item) => {
            if (item._id === productId) {
                setProductData(item)

                setImage1(item.image1)
                setImage2(item.image2)
                setImage3(item.image3)
                setImage4(item.image4)
                setImage(item.image1)
                return null;
            }
        })
    }
    useEffect(() => {
        fetchProductData()
    }, [productId, product])
    return productData ? (
        <div className='pb-[100px] md:pb-[0px] h-full bg-gradient-to-l from-[#141414] to-[#0c2025]'>
            {/* Product Section */}
            <div className='w-full min-h-screen flex flex-col lg:flex-row  gap-5 pt-[80px] px-4 '>
                {/* Left: Images */}
                <div className='w-full lg:w-1/2 flex flex-col-reverse lg:flex-row gap-5 items-center justify-center'>

                    <div className='flex lg:flex-col gap-3'>
                        {[image1, image2, image3, image4].map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                onClick={() => setImage(img)}
                                className='w-[60px] h-[80px] object-cover border rounded cursor-pointer hover:scale-105 transition'
                            />
                        ))}
                    </div>
                    {/* Main Image */}
                    <div className='w-full max-w-[400px] h-auto'>
                        <img src={image} className='w-full h-full object-contain rounded-lg border' />
                    </div>
                </div>

                {/* Right: Info */}
                <div className='w-full lg:w-1/2 flex flex-col gap-4 text-white'>
                    <h1 className='text-2xl md:text-3xl font-bold'>{productData.name.toUpperCase()}</h1>
                    {/* Rating */}
                    <div className='flex items-center gap-1'>
                        <FaStar className='text-yellow-400' />
                        <FaStar className='text-yellow-400' />
                        <FaStar className='text-yellow-400' />
                        <FaStar className='text-yellow-400' />
                        <IoIosStarHalf className='text-yellow-400' />
                        <p className='ml-2'>(124)</p>
                    </div>
                    {/* Price */}
                    <p className='text-xl md:text-2xl font-semibold text-green-400'>
                        {currency} {productData.price}
                    </p>
                    {/* Description */}
                    <p className='text-sm md:text-base'>
                        {productData.description} and Stylish, breathable cotton shirt with a modern slim fit. Easy to wash, super comfortable, and designed for effortless style.
                    </p>

                    {/* Size Selection */}
                    <div>
                        <p className='text-lg font-medium mb-2'>Select Size</p>
                        <div className='flex flex-wrap gap-3'>
                            {productData.sizes.map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSize(item)}
                                    className={`py-2 px-4 rounded-md border ${size === item ? 'bg-blue-600 text-white' : 'bg-slate-300 text-black'
                                        }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Add to Cart */}
                    <button className='w-[150px] mt-4 py-2 px-6 bg-[#80808049] rounded-md hover:bg-blue-600 transition' onClick={()=>addtoCart(productData._id,size)}>
                        Add to Cart
                    </button>

                    {/* Benefits */}
                    <div className='mt-5 text-sm text-gray-300'>
                        <p>100% Original Product.</p>
                        <p>Cash on delivery available.</p>
                        <p>Easy return/exchange within 7 days.</p>
                    </div>
                </div>
            </div>

            {/* Description/Review Section */}
            <div className='w-full  px-4 lg:px-20 pt-10 '>
                <div className='flex gap-4 mb-4'>
                    <button className='border px-4 py-2 text-white'>Description</button>
                    <button className='border px-4 py-2 text-white'>Reviews (124)</button>
                </div>
                <div className='bg-gray-800 text-white p-5 rounded-lg'>
                    <p className='text-sm md:text-base'>
                        Upgrade your wardrobe with this stylish slim-fit cotton shirt, available now on OneCart. Crafted from breathable, high-quality fabric, it offers all-day comfort and effortless style. Easy to maintain and perfect for any setting, this shirt is a must-have essential for those who value both fashion and function.
                    </p>
                </div>
                <RelatedProduct category={productData.category} subCategory={productData.subCategory} currentProductId={productData._id} />
            </div>
        </div>
    ) : (
        <div className='text-white text-center p-10'>Loading...</div>
    );

}

export default ProductDetail