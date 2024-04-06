import React from 'react'
import { Link } from 'react-router-dom'
const contribute = () => {
  return (
    
    <div className='bg-[#f8d5d1]  h-[500px] flex flex-col justify-center items-center gap-7'>
            <div className='text-center'>Look for our pre-existing datasets:</div>
            <div className='text-[50px]'>Check out our pre-existing datasets:</div>
            <div className='flex gap-4'>
            <Link to="/shop">
              <button className="inline-block bg-black text-white rounded-full border-2 border-black px-4 pb-[6px] pt-2 text-[16px] font-medium leading-normal transition duration-150 ease-in-out hover:border-white hover:bg-white hover:text-black focus:border-neutral-800 focus:text-neutral-800 focus:outline-none focus:ring-0 active:border-neutral-900 active:text-neutral-900 max-lg:text-[14px]">
                Start Exploring Now!
              </button>
            </Link>
            </div>
            <div>
                Got any issue? Read our FAQs <Link to='/designers' className='underline'>Join Drawn2Shoe</Link>
            </div>
    </div>
  )
}

export default contribute
