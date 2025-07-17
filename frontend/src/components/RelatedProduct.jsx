import React, { useContext, useEffect, useState } from 'react'
import { shopDataContex } from '../context/ShopContext'
import Title from './Title'
import Card from './Card'
function RelatedProduct({category,subCategory,currentProductId}) {
    let {product}=useContext(shopDataContex)
    const [related,setRelated]=useState([])

    useEffect(()=>{
        if(product.length>0){
            let productCopy=product.slice()
            productCopy=productCopy.filter((item)=>category===item.category)
            productCopy=productCopy.filter((item)=>subCategory===item.subCategory)
            productCopy=productCopy.filter((item)=>currentProductId !== item._id)
            setRelated(productCopy.slice(0,4))
        }
    },[product,category,subCategory,currentProductId])
  return (
    <div className='my-[130px] md:my-[40px] md:px-[60px]'>
            <div className='ml-[20px] lg:ml-[80px]'>
                <Title text1={"RELATED"} text2={"PRODUCTS"}/>

            </div>
            <div className='w-full mt-[30px] flex items-center justify-center flex-wrap gap-[50px]'>
                {
                    related.map((item,i)=>(
                        <Card key={i} id={item._id} name={item.name} price={item.price} image={item.image1}/>
                    ))
                }
            </div>
    </div>
  )
}

export default RelatedProduct