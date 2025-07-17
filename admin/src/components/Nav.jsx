import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../context/authContext'

function Nav() {
    const navigate=useNavigate()
    const {fetchAdmin}=useAdmin()
    const logOut=async()=>{
            try {
      await axios.get("https://one-cart-backend-mene.onrender.com/adminLogout", { withCredentials: true });
      fetchAdmin()
      navigate("/admin/login");
      
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <div className='w-[100vw] h-[70px] bg-[#dcdbdbf8] z-10 fixed top-0 flex items-center justify-between px-[30px] overflow-x-hidden shadow-md shadow-black'>
        <div className='w-[30%] flex items-center justify-start gap-[10px] cursor-pointer' onClick={()=>navigate("/admin/home")}>
            <img src="../src/assets/logo.png" alt="logo" className='w-[30px]'/>
            <h1 className='text-[25px] text-black font-sans'>OneCart</h1>
        </div>
            <button className='text-[15px] hover:border-[2px] border-[#89daea] cursor-pointer bg-[#000000ca] py-[10px] px-[20px] rounded-2xl text-white' onClick={logOut}>LogOut</button>
    </div>
  )
}

export default Nav
