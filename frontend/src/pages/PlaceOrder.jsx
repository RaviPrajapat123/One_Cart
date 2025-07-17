import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import razorpay from '../assets/razorpay.jpg'
import { shopDataContex } from '../context/ShopContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
function PlaceOrder() {
  const [method,setMethod]=useState("cod")
  const navigate=useNavigate()
  const {cartItem,setCartItem,getCartAmount,delivery_fee,product}=useContext(shopDataContex)
  const [formData,setFormData]=useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    pinCode:"",

    country:"",
    phone:""
  })

  const handleChange=(e)=>{
    const{name,value}=e.target;
    setFormData(data=>({...data,[name]:value}))
  }

  const handleSubmit=async(e)=>{
    e.preventDefault()
    try {
      let orderItems=[]
      for(const items in cartItem){
        for(const item in cartItem[items]){
          if(cartItem[items][item]>0){
            const itemInfo=structuredClone(product.find(product=>product._id===items))
            if(itemInfo){
              itemInfo.size=item
              itemInfo.quantity=cartItem[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }
      let orderData={
        address:[formData],
        items:orderItems,
        amount:getCartAmount() + delivery_fee
      }
      switch(method){
        case 'cod': 
        const result= await axios.post("https://one-cart-backend-mene.onrender.com/placeOrder",orderData,{withCredentials:true})
        // console.log(result.data)
        if(result.data){
          
          alert("Order placed successfully!");
          setCartItem({})
          navigate("/order")
        }
        else{
          console.log(result.data.message)
        }
        break;
        default:break;
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='w-full min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] flex items-center justify-center flex-col md:flex-row gap-[50px] relative'>
      <div className='lg:w-[50%] w-[100%] h-[100%] flex items-center justify-center lg:mt-[0px] mt-[90px]'>
        <form action="" onSubmit={handleSubmit} className='lg:w-[70%] w-[95%] lg:h-[70%] h-[100%]'>
          <div className='py-[10px]'>
                <Title text1={'DELIVERY'} text2={'INFORMATION'}/>
          </div>
          <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
              <input type="text" placeholder='First Name' className='w-[48%] h-[50px] rounded-md bg-slate-700 placeholder:text-white text-[18px] px-[20px] shadow-sm shadow-[#343434]' onChange={handleChange} name='firstName' value={formData.firstName}  required/>

              <input type="text" placeholder='Last Name' className='w-[48%] h-[50px] rounded-md bg-slate-700 placeholder:text-white text-[18px] px-[20px] shadow-sm shadow-[#343434]'onChange={handleChange} name='lastName' value={formData.lastName} required />
          </div>
          <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
              <input type="email" placeholder='Email Address' className='w-[100%] h-[50px] rounded-md bg-slate-700 placeholder:text-white text-[18px] px-[20px] shadow-sm shadow-[#343434]' onChange={handleChange} name='email' value={formData.email} required/>

             
          </div>
           <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
              <input type="text" placeholder='Street' className='w-[100%] h-[50px] rounded-md bg-slate-700 placeholder:text-white text-[18px] px-[20px] shadow-sm shadow-[#343434]' onChange={handleChange} name='street' value={formData.street} required/>
          </div>
           <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
              <input type="text" placeholder='City' className='w-[48%] h-[50px] rounded-md bg-slate-700 placeholder:text-white text-[18px] px-[20px] shadow-sm shadow-[#343434]' onChange={handleChange} name='city' value={formData.city} required/>

              <input type="text" placeholder='State' className='w-[48%] h-[50px] rounded-md bg-slate-700 placeholder:text-white text-[18px] px-[20px] shadow-sm shadow-[#343434]'  onChange={handleChange} name='state' value={formData.state} required/>
          </div>
           <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
              <input type="text" placeholder='Pincode' className='w-[48%] h-[50px] rounded-md bg-slate-700 placeholder:text-white text-[18px] px-[20px] shadow-sm shadow-[#343434]' onChange={handleChange} name='pinCode' value={formData.pinCode} required/>

              <input type="text" placeholder='Country' className='w-[48%] h-[50px] rounded-md bg-slate-700 placeholder:text-white text-[18px] px-[20px] shadow-sm shadow-[#343434]' onChange={handleChange} name='country' value={formData.country} required/>
          </div>
            <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
              <input type="text" placeholder='Phone' className='w-[100%] h-[50px] rounded-md bg-slate-700 placeholder:text-white text-[18px] px-[20px] shadow-sm shadow-[#343434]' onChange={handleChange} name='phone' value={formData.phone} required/>
          </div>
          <div className=''>
            <button type='submit' className='text-[18px] active:bg-slate-500 cursor-pointer bg-[#3bcee848] py-[10px] px-[50px] rounded-2xl text-white flex items-center justify-center gap-[20px] absolute lg:right-[20%] bottom-[10%] right-[35%] border-[1px] border-[#80808049] ml-[30px] mt-[20px]'>PLACE ORDER</button>
            </div>
        </form>
           
      </div>
       <div className='lg:w-[50%] w-[100%] min-h-[100%] flex items-center justify-center gap-[30px]'>
              <div className='lg:w-[70%] w-[90%] lg:h-[70%] h-[100%] flex items-center justify-center gap-[10px] flex-col '>
                <CartTotal/>
                 <div className='py-[10px]'>
                <Title text1={'PAYMENT'} text2={'METHOD'}/>
          </div>
          <div className='w-[100%] h-[30vh] lg:h-[100px] flex items-start mt-[20px] lg:mt-[0px] justify-center gap-[50px]'>
              <button onClick={()=>setMethod('rezorpay')} className={`w-[150px] h-[50px] rounded-sm ${method==='rezorpay' ? 'border-[5px] border-blue-900 rounded-sm' :""}`}>
                <img src={razorpay} alt=""  className='w-[100%] h-[100%] object-fill rounded-sm'/>
              </button>
              <button onClick={()=>setMethod('cod')} className={`w-[200px] h-[50px]  bg-gradient-to-l from-[#95b3f8] to-white text-[14px] text-[#332f6f] rounded-sm ${method==='cod' ? 'border-[5px] border-blue-900 rounded-sm' :""}`}>
               CASH ON DELIVERY
              </button>
          </div>
              </div>
            </div>
    </div>
  )
}

export default PlaceOrder
