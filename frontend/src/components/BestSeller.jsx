import React, { useContext, useEffect, useState } from 'react'
import Title from './Title'
import { shopDataContex } from '../context/ShopContext'
import Card from './Card'

function BestSeller() {
    let {product}=useContext(shopDataContex)
    const[bestSeller,setBestSeller]=useState([])
    useEffect(() => {
      const filteredProduct=product.filter((item)=>item.bestSeller)
        setBestSeller(filteredProduct.slice(0,4))
      
    }, [product])
    
  return (
    <div>
        <div className='h-[8%] w-[100%] text-center mt-[50px]'>
            <Title text1={"BEST"} text2={"SELLER"}/>
            <p className='w-full m-auto text-[13px] md:text-[20px] px-[10px] text-blue-100'>
                Tried, Tested, Loved | Discover Our All-Time Best Sellers.
            </p>
        </div>
        <div className='w-full h-1/2 mt-[30px] flex items-center justify-center flex-wrap gap-[50px]'>{bestSeller.map((item,i)=>(
            <Card key={i} name={item.name} id={item._id} price={item.price} image={item.image1}/>
        ))}
        </div>
    </div>
  )
}

export default BestSeller