// import React from 'react'
// import { FaCircle } from "react-icons/fa";

// function Hero({ heroData, heroCount, setHeroCount }) {
//     return (
//         <div className='w-[100%] h-[100%] relative'>
//             <div className='absolute text-[#88d9ee] text-[10px] sm:text-[20px] md:text-[40px] lg:text-[55px] md:left-[10%] md:top-[80px] lg:top-[130px] left-[10%] top-[10%]'>
//                 <p>{heroData.text1}</p>
//                 <p>{heroData.text2}</p>
//             </div>
//             <div className='absolute md:top-[300px] lg:top-[500px] top-[70px] sm:top-[130px] left-[10%] flex items-center justify-center gap-[10px] '>
//                 <FaCircle  className={`w-[10px] sm:w-[14px] ${heroCount===0?"fill-orange-400": "fill-white"}`} onClick={()=>setHeroCount(0)}/>
//                 <FaCircle className={`w-[10px] sm:w-[14px] ${heroCount===1?"fill-orange-400": "fill-white"}`} onClick={()=>setHeroCount(1)}/>
//                 <FaCircle className={`w-[10px] sm:w-[14px] ${heroCount===2?"fill-orange-400": "fill-white"}`} onClick={()=>setHeroCount(2)}/>
//                 <FaCircle className={`w-[10px] sm:w-[14px] ${heroCount===3?"fill-orange-400": "fill-white"}`} onClick={()=>setHeroCount(3)}/>
//             </div>
//         </div>
//     )
// }

// export default Hero





import React from 'react'
import { FaCircle } from "react-icons/fa";

function Hero({ heroData, heroCount, setHeroCount }) {
    return (
        <div className='w-full h-auto md:h-[100%]  flex  flex-col justify-around items-center'>
            <div className='text-[#88d9ee]  text-center text-[10px] sm:text-[20px] md:text-[40px] lg:text-[55px] '>
                <p>{heroData.text1}</p>
                <p>{heroData.text2}</p>
            </div>
            <div className='flex items-center justify-center gap-[10px] '>
                <FaCircle  className={`w-[10px] sm:w-[14px] ${heroCount===0?"fill-orange-400": "fill-white"}`} onClick={()=>setHeroCount(0)}/>
                <FaCircle className={`w-[10px] sm:w-[14px] ${heroCount===1?"fill-orange-400": "fill-white"}`} onClick={()=>setHeroCount(1)}/>
                <FaCircle className={`w-[10px] sm:w-[14px] ${heroCount===2?"fill-orange-400": "fill-white"}`} onClick={()=>setHeroCount(2)}/>
                <FaCircle className={`w-[10px] sm:w-[14px] ${heroCount===3?"fill-orange-400": "fill-white"}`} onClick={()=>setHeroCount(3)}/>
            </div>
        </div>
    )
}

export default Hero