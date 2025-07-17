import React, { useContext, useState ,useEffect} from 'react'
import Title from './Title'
import { shopDataContex } from '../context/ShopContext'
import Card from './Card'


function LatestCollection() {
    const {product}=useContext(shopDataContex)
    const [latestProdut,setLatestProduct]=useState([])
    useEffect(()=>{
        setLatestProduct(product.slice(0,8))
    },[product])
  return (
    <div>
        <div className='h-[8%] w-[100%] text-center md:mt-[50px]'>
          <Title text1={"LATEST"}  text2={"COLLECTION"}/>
          <p className='w-[100%] m-auto text-[13px] md:text-[20px] px-[10px] text-blue-100'>step Into style - New Collection Dropping This Season!</p>
        </div>
        <div className='w-[100%] h-[50%] mt-[30px] flex items-center justify-center flex-wrap gap-[50px]'>
            {latestProdut.map((item,i)=>(
                <Card key={i} name={item.name} image={item.image1} id={item._id} price={item.price}/>
            ))}</div>
    </div>
  )
}

export default LatestCollection