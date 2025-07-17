import React from 'react'
import Nav from "../components/Nav"
import Sidebar from '../components/Sidebar'
import { useState } from 'react'
import axios from "axios"
import { useEffect } from 'react'
import { SiEbox } from "react-icons/si";

function Orders() {
  const [orders,setOrders]=useState([])
  const fetchAllOrders=async()=>{
    try {
       const result=await axios.get("https://one-cart-backend-mene.onrender.com/allOrders",{withCredentials:true})
       setOrders(result.data.data.reverse())
       console.log(result.data.data)
      } catch (error) {
        console.log(error.message)
      }
    }
    
  useEffect(() => {
    fetchAllOrders()
  }, [])
  
  return (
    <div className='w-full min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-white'>
      <Nav />
      <div className='w-[100%] h-[100%] flex items-center lg:justify-start justify-center'>
        <Sidebar />
        <div className='lg:w-[85%] md:w-[70%]  h-[100%] lg:ml-[310px] md:ml-[250px] mt-[70px] flex flex-col gap-[30px] overflow-x-hidden py-[50px] ml-[20vw]'>
          <div className='w-[400px] h-[50px] text-[28px] md:text-[40px] mb-[20px] text-white'>All Order List</div>
         {
  orders.map((order, i) => (
    <div key={i} className='w-[95%] lg:w-[90%] bg-[#1e293b] text-white rounded-xl shadow-lg p-5 flex flex-col gap-4'>
      
      {/* Order Header */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
        <div className='flex items-center gap-4'>
          <SiEbox className='w-[50px] h-[50px] text-blue-400 bg-white p-2 rounded-md' />
          <div>
            <h2 className='text-lg font-semibold'>Order #{order._id.slice(-5)}</h2>
            <p className='text-sm text-gray-400'>Placed on {new Date(order.date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className='mt-4 md:mt-0 text-sm text-gray-300'>
          <p className='text-green-400 font-medium'>Total: ₹{order.amount}</p>
          <div className='flex items-center'>
                <p>Payment :</p>
                <p className='uppercase text-xs bg-green-900 text-white  px-2 py-1 rounded-md inline-block mt-1'> {order.payment?"Done":"Pending"}</p>
          </div>
          

        </div>
      </div>

      {/* Ordered Items */}
      <div className='bg-slate-700 p-3 rounded-md text-sm text-cyan-300'>
        <p className='font-semibold mb-1'>Items:</p>
        <ul className='list-disc list-inside'>
          {order.items.map((item, i) => (
            <li key={i}>
              {item.name.toUpperCase()} - Qty: {item.quantity} | Size: {item.size}
            </li>
          ))}
        </ul>
      </div>

      {/* Shipping Address */}
      <div className='bg-slate-800 p-3 rounded-md text-sm'>
        <p className='font-semibold text-yellow-300 mb-1'>Delivery Address:</p>
        <p>{order.address[0]?.firstName + " " + order.address[0]?.lastName}</p>
        <p>{order.address[0]?.street}, {order.address[0]?.city}</p>
        <p>{order.address[0]?.state}, {order.address[0]?.country} - {order.address[0]?.pinCode}</p>
        <p>📞 {order.address[0]?.phone}</p>
      </div>
      {/* Admin Status Update Section */}
<div className='bg-slate-700 p-3 rounded-md text-sm text-white flex flex-col md:flex-row gap-3 items-start md:items-center justify-between'>
  <div>
    <p className='font-semibold text-green-400 mb-1'>Current Status:</p>
    <p className='text-white'>{order.status || "Pending"}</p>
  </div>
  <div className='flex gap-2 items-center'>
    <label htmlFor="status" className='text-sm'>Change Status:</label>
    <select
      id="status"
      className='bg-slate-800 border border-gray-600 px-2 py-1 rounded text-white'
      value={order.status || "Pending"}
      onChange={async (e) => {
        const newStatus = e.target.value;
        try {
          const res = await axios.put("http://localhost:3000/updateStatus", {
            orderId: order._id,
            status: newStatus
          }, { withCredentials: true });

          // Update the status in local state without full refresh
          setOrders((prev) =>
            prev.map((o, idx) =>
              idx === i ? { ...o, status: newStatus } : o
            )
          );
          alert("Status updated successfully");
        } catch (err) {
          console.error(err);
          alert("Failed to update status");
        }
      }}
    >
      <option value="Order Placed">Order Placed</option>
      <option value="Packing">Packing</option>
      <option value="Shipped">Shipped</option>
      <option value="">Delivered</option>
      <option value="Out of delivery">Out of delivery</option>
     
    </select>
  </div>
</div>

    </div>
  ))
}

        </div>
      </div>
    </div>
  )
}

export default Orders
