import React, { useContext, useState } from 'react';
import { FaCircleUser } from "react-icons/fa6";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoSearchCircleOutline, IoSearchCircleSharp } from "react-icons/io5";
import { IoMdHome } from "react-icons/io";
import { HiOutlineCollection } from "react-icons/hi";
import { MdContacts } from "react-icons/md";
import { useUser } from "../context/UserContext";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { shopDataContex } from '../context/ShopContext';
import logo from '../assets/logo.png'
function Nav() {
  const { currentUser, loading, setCurrentUser} = useUser();
  
  let {showSearch,setShowSearch,Search,setSearch,getCartCount}=useContext(shopDataContex)
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await axios.get("http://localhost:3000/userLogout", { withCredentials: true });
      setCurrentUser(null);
      navigate("/login");
      setShowProfile(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className='w-full h-[70px] bg-[#ecfafaec] z-10 fixed top-0 flex items-center justify-between px-4 md:px-6 shadow-md shadow-black'>

      {/* Logo */}
      <div className='w-[30%] flex items-center gap-2'>
        <img src={logo} alt="logo" className='w-[30px]' />
        <h1 className='text-[22px] md:text-[25px] font-sans text-black'>OneCart</h1>
      </div>

      {/* Desktop Nav */}
      <div className='hidden md:flex w-[40%] justify-center'>
        <ul className='flex gap-4 lg:gap-6 text-white'>
          <li className='text-sm hover:bg-slate-500 cursor-pointer bg-[#000000c9] py-2 px-4 rounded-2xl' onClick={()=>navigate("/")}>HOME</li>
          <li className='text-sm hover:bg-slate-500 cursor-pointer bg-[#000000c9] py-2 px-4 rounded-2xl' onClick={()=>navigate("/collection")}>COLLECTIONS</li>
          <li className='text-sm hover:bg-slate-500 cursor-pointer bg-[#000000c9] py-2 px-4 rounded-2xl' onClick={()=>navigate("/about")}>ABOUT</li>
          <li className='text-sm hover:bg-slate-500 cursor-pointer bg-[#000000c9] py-2 px-4 rounded-2xl' onClick={()=>navigate("/contact")}>CONTACT</li>
        </ul>
      </div>

      {/* Right Icons */}
      <div className='w-[30%] flex items-center justify-end gap-4 relative'>
        {!showSearch ? (
          <IoSearchCircleOutline className='w-8 h-8 text-black cursor-pointer' onClick={() =>{ setShowSearch(true);navigate("/collection")}} />
        ) : (
          <IoSearchCircleSharp className='w-8 h-8 text-black cursor-pointer' onClick={() => setShowSearch(false)} />
        )}

        {!currentUser && (
          <FaCircleUser className='w-7 h-7 text-black cursor-pointer' onClick={() => setShowProfile(!showProfile)} />
        )}

        {currentUser?.username && (
          <div className='w-8 h-8 bg-[#080808] text-white rounded-full flex items-center justify-center cursor-pointer' onClick={() => setShowProfile(!showProfile)}>
            {currentUser.username.slice(0, 1).toUpperCase()}
          </div>
        )}

        <MdOutlineShoppingCart className='w-7 h-7 text-black cursor-pointer hidden md:block' onClick={()=>navigate("/cart")} />
        <p className='absolute top-[-4px] right-[-4px] w-5 h-5 text-xs bg-black text-white rounded-full flex items-center justify-center hidden md:flex'>
          {getCartCount()}
        </p>
      </div >

      {/* Search Bar */}
      {showSearch && (
        <div className='absolute top-[100%] left-0 w-full h-[80px] bg-[#d8f6f9dd] flex items-center justify-center'>
          <input
            type='text'
            className='w-[90%] md:w-[60%] h-[60%] bg-[#233533] rounded-[30px] px-6 placeholder:text-white text-white text-base'
            placeholder='Search Here'
            value={Search}
            onChange={(e)=>setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Profile Dropdown */}
      {showProfile && (
        <div className='absolute top-[110%] right-[4%] w-[220px] h-[150px] bg-[#000000d7] border border-[#aaa9a9] rounded-lg z-10'>
          <ul className='flex flex-col gap-2 text-white p-3'>
            {!currentUser ? (
              <li className='hover:bg-[#2f2f2f] px-3 py-2 cursor-pointer' onClick={() => { navigate("/login"); setShowProfile(false); }}>Login</li>
            ) : (
              <li className='hover:bg-[#2f2f2f] px-3 py-2 cursor-pointer' onClick={handleLogOut}>LogOut</li>
            )}
            <li className='hover:bg-[#2f2f2f] px-3 py-2 cursor-pointer' onClick={()=>navigate("/order")}>Orders</li>
            <li className='hover:bg-[#2f2f2f] px-3 py-2 cursor-pointer' onClick={()=>navigate("/about")}>About</li>
          </ul>
        </div>
      )}

      {/* Bottom Nav - Mobile Only */}
      <div className='w-full h-[70px] flex items-center justify-between px-6 fixed bottom-0 left-0 bg-[#191818] text-xs text-white md:hidden'>
        <button className='flex flex-col items-center gap-1' onClick={()=>navigate("/")}>
          <IoMdHome className='w-6 h-6' />
          Home
        </button>
        <button className='flex flex-col items-center gap-1'>
          <HiOutlineCollection className='w-6 h-6' onClick={()=>navigate("/collection")}/>
          Collections
        </button>
        <button className='flex flex-col items-center gap-1' onClick={()=>navigate("/contact")}>
          <MdContacts className='w-6 h-6' />
          Contact
        </button>
        <button className='flex flex-col items-center gap-1' onClick={()=>navigate("/cart")}>
          <MdOutlineShoppingCart className='w-6 h-6'   />
          Cart
        </button>
        <p className='absolute top-[5px] right-[16px] w-5 h-5 text-[9px] py-[2px] px-[5px] bg-white text-black font-semibold rounded-full flex items-center justify-center '>{getCartCount()}</p>
      </div>
    </div>
  );
}

export default Nav;
