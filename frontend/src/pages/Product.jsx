import React from 'react'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'

function Product() {
  return (
    <div className='w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] flex itmes-center justify-start flex-col py-[20px]'>
        <div className='w-[100%] min-h-[70px] flex items-center justify-center gap-[10px] flex-col'>
            <LatestCollection/>
        </div>
        <div className='w-[100%] min-h-[70px] flex items-center justify-center gap-[10px] flex-col'>
            <BestSeller/>
        </div>
    </div>
  )
}

export default Product