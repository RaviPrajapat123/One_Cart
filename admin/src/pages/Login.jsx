import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoEyeOutline, IoEye } from "react-icons/io5";
import axios from 'axios';
import { useAdmin } from '../context/authContext';
// import { signInWithPopup } from 'firebase/auth';
// import {auth, provider } from '../../utils/Firebase';
// import { useUser } from '../context/UserContext';
function Login() {
  const navigate = useNavigate();
   const {admin,fetchAdmin}=useAdmin()
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState({
    email: "",
    password: "",
  });
   useEffect(() => {
    if (admin) {
      navigate("/admin/home"); // ✅ Already logged in
    }
  }, [admin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ""
    }));
  };

//   const {fetchCurrentUser }=useUser()
//   const {fetchAdmin}=useAdmin()
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("https://one-cart-backend-mene.onrender.com/adminLogin", values, {
        withCredentials: true,
      });

      if (response.data.success) {
        //   await fetchCurrentUser();
        await fetchAdmin()
        alert("Login Successfully");
        setErrors({});
        navigate("/admin/home"); 
      } else {
        alert(response.data.error || "Login Failed");
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
      console.error("Login error:", error);
      alert("Something went wrong");
    }
  }
    finally {
      setLoading(false);
    }
  };

    const googleLogin=async()=>{
                  try{
                          const response=await signInWithPopup(auth,provider)
                          let user=response.user
                          let name=user.displayName
                          let email=user.email
                          const result=await axios.post("https://one-cart-backend-mene.onrender.com/googleLogin",{name,email},{withCredentials:true})
                        //   console.log(result.data)
                        // fetchCurrentUser()
                        navigate("/")
                  }catch(error){
                          console.log(error)
                  }
      }
  return (
    <div className='w-[100vw] h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-white flex flex-col items-center justify-start'>
      
      {/* Header */}
      <div className='w-full h-[80px] flex items-center justify-start px-[30px] gap-[10px] cursor-pointer'>
        <img src="../src/assets/logo.png" alt='logo' className='w-[40px]' />
        <h1 className='text-[22px] font-sans'>one cart</h1>
      </div>

      {/* Title */}
      <div className='w-full h-[100px] flex items-center justify-center flex-col gap-[10px]'>
        <span className='text-[25px] font-semibold'>Login Page</span>
        <span className='text-[16px]'>Welcome to OneCart, Apply to Admin Login</span>
      </div>

      {/* Form */}
      <div className='max-w-[600px] w-[90%] h-[400px] bg-[#00000025] border border-[#96969635] backdrop:blur-2xl rounded-lg shadow-lg flex items-center justify-center pb-3'>
        <form onSubmit={handleSubmit} className='w-[90%] py-5 gap-[20px] flex flex-col items-center justify-start'>

          {/* Email Field */}
          <div className='w-full flex flex-col'>
            <input
              type='email'
              name='email'
              placeholder='Email'
              value={values.email}
              onChange={handleChange}
              className='w-full h-[50px] border-2 border-[#96969635] rounded-lg shadow-lg bg-transparent px-[20px] placeholder-[#ffffffc7] font-semibold'
            />
            {errors.email && <p className="text-red-500 text-sm mt-1 ml-3">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div className='w-full flex flex-col relative'>
            <input
              type={show ? "text" : "password"}
              name='password'
              placeholder='Password'
              value={values.password}
              onChange={handleChange}
              className='w-full h-[50px] border-2 border-[#96969635] rounded-lg shadow-lg bg-transparent px-[20px] pr-[40px] placeholder-[#ffffffc7] font-semibold'
            />
            {!show ? (
              <IoEyeOutline className='w-5 h-5 cursor-pointer absolute top-[14px] right-[20px]' onClick={() => setShow(!show)} />
            ) : (
              <IoEye className='w-5 h-5 cursor-pointer absolute top-[14px] right-[20px]' onClick={() => setShow(!show)} />
            )}
            {errors.password && <p className="text-red-500 text-sm mt-1 ml-3">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            disabled={loading}
            className='w-full h-[50px] bg-[#6060f5] rounded-lg flex items-center justify-center mt-[20px] text-[17px] font-semibold'
          >
            {loading ? "Logging in..." : "Login"}
          </button>

         
        </form>
      </div>
    </div>
  );
}

export default Login;
