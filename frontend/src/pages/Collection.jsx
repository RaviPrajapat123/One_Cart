import React, { useContext, useEffect, useState } from 'react'
import { FaChevronRight } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import Title from '../components/Title';
import { shopDataContex } from '../context/ShopContext';
import Card from '../components/Card';

function Collection() {
    const [showFilter,setShowFilter]=useState(false)
    const {product,Search,showSearch}=useContext(shopDataContex)
    const [filteredProduct,setFilteredProduct]=useState([])
    const [category,setCategory]=useState([])
    const [subCategory,setSubCategory]=useState([])
    const [sortType,setSortType]=useState("relavent")
    const toogleCategory=(e)=>{
        if(category.includes(e.target.value)){
            setCategory(prev=>prev.filter(item=>item !==e.target.value))
        }
        else{
            setCategory(prev=>[...prev,e.target.value])
        }
    }

    const toogleSubCategory=(e)=>{
        if(subCategory.includes(e.target.value)){
            setSubCategory(prev=>prev.filter(item=>item !==e.target.value))
        }
        else{
            setSubCategory(prev=>[...prev,e.target.value])
        }
    }
    let applyFillter=()=>{
        let productCopy=product.slice()
        if(showSearch && Search){
            productCopy=productCopy.filter(item=>item.name.toLowerCase().includes(Search.toLowerCase()))
        }
        if(category.length>0){
            productCopy=productCopy.filter(item=>category.includes(item.category))
        }
        if(subCategory.length>0){
            productCopy=productCopy.filter(item=>subCategory.includes(item.subCategory))
        }
        setFilteredProduct(productCopy)
    }

    const sortProducts=(e)=>{
            let fpcopy=filteredProduct.slice()
            switch(sortType){
                case 'low-high' :setFilteredProduct(fpcopy.sort((a,b)=>(a.price - b.price)))
                break;
                case 'high-low' :setFilteredProduct(fpcopy.sort((a,b)=>(b.price - a.price)))
                break;
                default:applyFillter()
                break;
            }
    }

    useEffect(()=>{
        sortProducts()
    },[sortType])

    useEffect(()=>{
           setFilteredProduct[product]
    },[product])

    useEffect(() => {
      applyFillter()
    }, [category,subCategory,Search,showSearch])
    
  return (
    <div className='w-full min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] flex  flex-col md:flex-row  pt-[70px] overflow-x-hidden pb-[110px] '>
        <div className={`md:w-[30vw] lg:w-[20vw] w-[100vw] md:min-h-[100vh] ${showFilter?"h-auto":"h-[8vh]"} p-[20px] border-r-[1px] border-gray-400 text-[#aaf5fa]  lg:fixed`}>
            <p className='text-[25px] font-semibold flex gap-[5px] items-center justify-start cursor-pointer' onClick={()=>setShowFilter(prev=>!prev)}>FILTERS
              { !showFilter && <FaChevronRight className='text-[18px] md:hidden'/>}
                {showFilter && <FaChevronDown className='text-[18px] md:hidden'/>}
            </p>
            <div className={`border-[2px] border-[#dedcdc] pl-5 py-3 mt-6 rounded-md  bg-slate-600 ${showFilter?"": "hidden"} md:block`}>
                <p className='text-[18px] text-[#f8fafa]'>CATEGORIES</p>
                <div className='w-[230px] h-[120px] flex items-start justify-center gap-[10px] flex-col'>
                    <p className='flex items-center justify-center gap-[10px] text-[16px] font-light'><input type='checkbox' value={"Men"} className='w-3'  onChange={toogleCategory} id='man'/><label htmlFor='man'>Man</label></p>
                    <p className='flex items-center justify-center gap-[10px] text-[16px] font-light'><input type='checkbox' value={"Women"} className='w-3' onChange={toogleCategory} id='women'/><label htmlFor='women'>Women</label></p>
                    <p className='flex items-center justify-center gap-[10px] text-[16px] font-light'><input type='checkbox' value={"Kids"} className='w-3' onChange={toogleCategory} id='kid'/><label htmlFor='kid'>Kids</label></p>
                </div>
            </div>
            <div className={`border-[2px] border-[#dedcdc] pl-5 py-3 mt-6 rounded-md  bg-slate-600 ${showFilter?"" :"hidden"} md:block`}>
                <p className='text-[18px] text-[#f8fafa]'>SUB-CATEGORIES</p>
                <div className='w-[230px] h-[120px] flex items-start justify-center gap-[10px] flex-col'>
                    <p className='flex items-center justify-center gap-[10px] text-[16px] font-light'><input type='checkbox' value={"TopWear"} className='w-3' onChange={toogleSubCategory} id='topwear'/><label htmlFor='topwear'>TopWear</label></p>
                    <p className='flex items-center justify-center gap-[10px] text-[16px] font-light'><input type='checkbox' value={"BottomWear"} className='w-3' onChange={toogleSubCategory} id='bottomwear'/><label htmlFor='bottomwear'>BottomWear</label></p>
                    <p className='flex items-center justify-center gap-[10px] text-[16px] font-light'><input type='checkbox' value={"WinterWear"} className='w-3' onChange={toogleSubCategory} id='winterwear'/><label htmlFor='winterwear'>WinterWear</label></p>
                </div>
            </div>
        </div>
        <div className='lg:pl-[20%] md:py-[10px]'>
            <div className='lg:w-[80vw] md:w-[80vw] w-[100vw] p-[20px] flex justify-between flex-col lg:flex-row lg:px-[50px]'>
                <Title text1={"ALL"} text2={"COLLECTIONS"}/>
                <select name="" id="" className='bg-slate-600 w-[60%] md:w-[200px] h-[50px] px-[10px] text-[white] rounded-lg hover:border-[#46d1f7] border-[2px]' onChange={(e)=>setSortType(e.target.value)}>
                    <option value="relavent" className='w-[100%] h-[100%]'>Sort By: Relavent</option>
                    <option value="low-high" className='w-[100%] h-[100%]'>Sort By: Low to High</option>
                    <option value="high-low" className='w-[100%] h-[100%]'>Sort By: High to Low</option>
                </select>
            </div>
            <div className='lg:w-[80vw] md:w-[60vw] w-[100vw] min-h-[70vh] flex items-center justify-center flex-wrap gap-[30px]'>
              {filteredProduct.map((item,i)=>(
                <Card key={i} id={item._id} name={item.name} price={item.price} image={item.image1}/>
              ))}
            </div>
        </div>
    </div>
  )
}

export default Collection