import React from 'react'

import { useNavigate } from 'react-router-dom'
import { IoEyeOutline } from "react-icons/io5";
import { useState } from 'react';
import { IoEye } from "react-icons/io5";
import axios from 'axios';
import { signInWithPopup } from 'firebase/auth';
import {auth, provider } from '../../utils/Firebase';
import { useUser } from '../context/UserContext';
import logo from "../assets/logo.png"
function Registration() {
    const navigate=useNavigate()
    const [show,setShow]=useState(false)
    const [errors,setErrors]=useState({})
    const [loading, setLoading] = useState(false);
    const [values,setValues]=useState({
        username:"",
        email:"",
        password:"",
    })
    const handleChange=(e)=>{
        const {name,value}=e.target;
        setValues((prev)=>({
            ...prev,
            [name]:value
        }))
         setErrors((prevErrors) => ({
    ...prevErrors,
    [name]: ""  // Clear only current field error
  }));

    }

    const handleSubmit=async(e)=>{
        e.preventDefault()
         setLoading(true);
            try{
                let response=await axios.post("https://one-cart-backend-mene.onrender.com/register",values)
                if(response.data.success){
                    alert("Registration Secessfully")
                    setErrors({})
                    navigate("/login")

                }
                else{
                    alert(response.data.message|| "Registration Failed")
                     setLoading(false);
                }
           } catch (error) {
             setLoading(false);
    if (error.response && error.response.data.errors) {
      const formattedErrors = {};
      error.response.data.errors.forEach(err => {
        const [field] = err.split(' ');
        formattedErrors[field.toLowerCase()] = err;
      });
      setErrors(formattedErrors);
    } else if (error.response) {
      alert(error.response.data.error || error.response.data.message);
    } else {
      console.error("Signup error:", error);
      alert("Something went wrong");
    }
  }
    }
    const { fetchCurrentUser}=useUser()
                        
    const googleSignUp=async()=>{
                try{
                        const response=await signInWithPopup(auth,provider)
                        let user=response.user
                        let name=user.displayName
                        let email=user.email
                        const result=await axios.post("https://one-cart-backend-mene.onrender.com/googleLogin",{name,email},{withCredentials:true})
                        // console.log(result.data)
                         fetchCurrentUser()
                        navigate("/")
                }catch(error){
                        console.log(error)
                }
    }
  return (
    <div className='w-[100vw] h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-[white] flex flex-col items-center justify-start'>
         <div className='w-[100%] h-[80px] flex items-center justify-start px-[30px] gap-[10px] cursor-pointer' onClick={()=>navigate("/")}>
            <img src={logo} alt='logo' className='w-[40px]'/>
            <h1 className='text-[22px] font-sans'>one cart</h1>
         </div>
         <div className='w-[100%] h-[100px] flex items-center justify-center flex-col gap-[10px]'>
            <span className='text-[25px] font-semibold'>Registration Page</span>
            <span className='text-[16px]'>Welcome to OncCart, Place your order</span>
         </div>
         <div className='max-w-[600px] w-[90%] h-[auto] bg-[#00000025] border-[1px] border-[#96969635] backdrop:blur-2xl rounded-lg shadow-lg flex items-center justify-center pb-3'>
            <form onSubmit={handleSubmit} className='w-[90%] h-[90%] gap-[20px] flex flex-col items-center justify-start'>
                <div className='w-[90%] h-[50px] bg-[#42656cae] rounded-full flex items-center justify-center gap-[10px] py-[20px] cursor-pointer' onClick={googleSignUp}>
                    <img src="https://icon2.cleanpng.com/20240216/ikb/transparent-google-logo-google-logo-with-multicolored-g-and-1710875587855.webp" alt='' className='w-[20px] rounded-full'/> Registration with Google
                </div>
                <div className='w-[100%] h-[20px] flex items-center justify-center gap-[10px]'>
                    <div className='w-[100%] h-[1px] bg-[#96969635]'></div>
                    OR
                    <div className='w-[100%] h-[1px] bg-[#96969635]'></div>
                </div>
                <div className='w-[90%] h-[400px] flex flex-col items-center justify-center gap-[15px] relative'>
                    <div className='w-[100%] flex flex-col'>

                        <input type='text' className='w-[100%] h-[50px] border-[2px] border-[#96969635] backdrop:blur-sm rounded-lg shadow-lg bg-transparent placeholder-[#ffffffc7] px-[20px] font-semibold' placeholder='Userame' name='username' value={values.username} onChange={handleChange}/>
                                     {errors.username && <p className="text-red-500 text-sm mt-1 ml-3">{errors.username}</p>}
                    </div>
                    <div className='w-[100%] flex flex-col'>

                        <input type='email' className='w-[100%] h-[50px] border-[2px] border-[#96969635] backdrop:blur-sm rounded-lg shadow-lg bg-transparent placeholder-[#ffffffc7] px-[20px] font-semibold' placeholder='Email' name="email" value={values.email} onChange={handleChange} />
                         {errors.email && <p className="text-red-500 text-sm mt-1 ml-3">{errors.email}</p>}
                    </div>
                    <div className='w-[100%] flex flex-col relative'>

                        <input type={show?"text":'password'} className='w-[100%] h-[50px] border-[2px] border-[#96969635] backdrop:blur-sm rounded-lg shadow-lg bg-transparent placeholder-[#ffffffc7] px-[20px] font-semibold' placeholder='Password' name='password' value={values.password} onChange={handleChange}/>
                         {errors.password && <p className="text-red-500 text-sm mt-1 ml-3">{errors.password}</p>}
                 
                        {!show && <IoEyeOutline  className='w-[20px] h-[20px] cursor-pointer absolute top-[14px] right-[20px]' onClick={()=>setShow(!show)}/>}
                       {show && <IoEye className='w-[20px] h-[20px] cursor-pointer absolute top-[14px] right-[20px]' onClick={()=>setShow(!show)}/>}
                           </div>
                        <button type='submit' disabled={loading} className='w-[100%] h-[50px] bg-[#6060f5] rounded-lg flex  items-center justify-center mt-[20px] text-[17px] font-semibold'>{loading ? "Creating..." : "Create Account"}</button>
                        <p className='flex gap-[10px]'>You have any account? <span className='text-[#5555f6cf] text-[17[x font-semibold cursor-pointer' onClick={()=>navigate("/login")}>Login</span></p>
                </div>
            </form>
         </div>
    </div>
  )
}

export default Registration
