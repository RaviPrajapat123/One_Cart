import React, { useContext, useEffect, useState } from 'react'
import Title from '../components/Title'
import { shopDataContex } from '../context/ShopContext'
import axios from 'axios'

function Order() {
    const [orderData,setOrderData]=useState([])
    const {currency}=useContext(shopDataContex)
    const loadOrderData=async()=>{
        try {
                const result=await axios.get("https://one-cart-backend-mene.onrender.com/userOrders",{withCredentials:true})
                if(result.data){
                    console.log(result.data)
                    let allOrdersItem=[]
                    result.data.data.map((order)=>{
                        order.items.map((item)=>{
                            item['status']=order.status
                            item['payment']=order.payment
                            item['paymentMethod']=order.paymentMethod
                            item['date']=order.date
                            allOrdersItem.push(item)
                        })
                    })
                    setOrderData(allOrdersItem.reverse())
                }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        loadOrderData()
    },[])
  return (
  <div className='w-full min-h-screen bg-gradient-to-l from-[#141414] to-[#0c2025] px-4 sm:px-6 md:px-10 py-10 pb-40'>
      <div className='text-center mt-16 sm:mt-20'>
        <Title text1='MY' text2='ORDER' />
      </div>

      <div className='w-full mt-10 flex flex-col gap-6'>
        {orderData.map((item, i) => (
          <div key={i} className='w-full border-t border-b border-gray-600 pt-4 pb-6'>
            <div className='w-full flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 bg-[#51808048] p-4 sm:p-6 rounded-2xl relative'>
              {/* Product Image */}
              <img src={item.image1} alt={item.name} className='w-full sm:w-[150px] h-[150px] object-cover rounded-lg' />

              {/* Order Info */}
              <div className='flex-1 flex flex-col gap-2 text-[#f3f9fc]'>
                <p className='text-lg sm:text-xl md:text-2xl font-semibold'>{item.name}</p>

                <div className='flex flex-wrap gap-3 text-sm sm:text-base text-[#aaf4e7]'>
                  <p>💰 {currency} {item.price}</p>
                  <p>📦 Quantity: {item.quantity}</p>
                  <p>📐 Size: {item.size}</p>
                </div>

                <p className='text-xs sm:text-sm text-[#aaf4e7]'>
                  🗓️ Date: <span className='text-[#e4fbff] pl-1'>{new Date(item.date).toDateString()}</span>
                </p>

                <p className='text-xs sm:text-sm text-[#aaf4e7]'>💳 Payment Method: {item.paymentMethod}</p>

                {/* Status & Track Order */}
                <div className='flex justify-between items-center flex-wrap mt-3'>
                  <div className='flex items-center gap-2'>
                    <span className='w-3 h-3 rounded-full bg-green-500'></span>
                    <p className='text-sm sm:text-base'>{item.status}</p>
                  </div>

                  <button
                    className='mt-2 sm:mt-0 px-4 py-2 bg-[#101919] hover:bg-[#1c2c2c] text-white text-xs sm:text-sm rounded-md transition duration-200'
                    onClick={loadOrderData}
                  >
                    Track Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>  )
}

export default Order
