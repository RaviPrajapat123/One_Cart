import React from 'react'
import Nav from '../components/Nav'
import Sidebar from '../components/Sidebar'
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'

function List() {
    const [list,setList]=useState([])
    useEffect(()=>{
        fetchList()
    },[])
    const fetchList=async()=>{
        try {
             let response=await axios.get("https://one-cart-backend-mene.onrender.com/allProducts")
             if(response.data.success){
                setList(response.data.data)
             }
             else{
                alert("Failed to fetch products")
             }
        } catch (error) {
             console.error("Fetch List Error:", error);
    alert("Something went wrong while fetching products");
        }
    }
    const removeProduct=async(id)=>{
        try {
                if(window.confirm("Are you sure to delete Product?")){

                    let result=await axios.delete(`https://one-cart-backend-mene.onrender.com/removeProduct/${id}`)
                    if(result.data.success){
                        alert(result.data.message)
                        fetchList()
                    }
                    else{
                        alert("Failed to remove Product")
                    }
                }
        } catch (error) {
              console.error("Fetch List Error:", error);
    alert("Something went wrong while fetching products");
        }
    }
    return (
        <div className='w-full min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-white'>
            <Nav />
            <div className='w-[100%] h-[100%] flex items-center justify-start'>
                <Sidebar />
                <div className='w-[82%] h-[100%] lg:ml-[320px] md:ml-[230px] mt-[70px] flex flex-col gap-[30px] overflow-x-hidden py-[50px] ml-[23vw]'>
                    <div className='w-[400px] h-[50px] text-[6vw] md:text-[40px] mb-[20px] text-white'>All Listed Products</div>
                    
                    { list?.length > 0 ? (
                        list.map((item)=>(
                            <div key={item._id} className='w-[90%]  h-[120px] bg-slate-600 rounded-xl flex items-center justify-start gap-[5px] md:gap-[30px] p-[10px] md:px-[30px]'>
                                <img src={item.image1} className='w-[30%] md:w-[120px] h-[90%] rounded-lg'/>
                                <div  className='w-[90%] h-[80%] flex flex-col items-start justify-center gap-[2px]'>
                                    <div className='w-[100%] md:text-[20px] text-[15px] text-[#bef0f3]'>
                                        {item.name}
                                    </div>
                                    <div className='md:text-[17px] text-[15px] text-[#bef3da]'>
                                        {item.category}
                                    </div>
                                    <div className='md:text-[17px] text-[15px] text-[#bef3da]'>
                                       ₹ {item.price} 
                                    </div>
                                </div>
                                <div className='w-[10%] h-[100%] bg-transparent flex items-center justify-center'><span className='w-[35px] h-[30%] flex items-center justify-center rounded-md md:hover:bg-red-300 md:hover:text-black cursor-pointer hover:text-red-300' onClick={()=>removeProduct(item._id)}>X</span></div>
                            </div>
                        ))
                    )
                    :(
                        <div className='text-white text-lg'>No Product available</div>
                    )
                    }
                </div>
            </div>
        </div>
    )
}

export default List
