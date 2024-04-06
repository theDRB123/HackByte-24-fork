import React from 'react'
import { Link } from 'react-router-dom'
const Home_retailers_comp = () => {
  return (
    
    <div className='bg-[#f8d5d1]  h-[500px] flex flex-col justify-center items-center gap-7'>
            <div className='text-[50px]'>Start your contribution NOW!</div>
            <div className='text-center'>Worried about your identity? contribution anonymously to the repositories</div>
            <div className='flex gap-4'>
            <Link to="/explore">
              <button className="inline-block bg-black text-white rounded-full border-2 border-black px-4 pb-[6px] pt-2 text-[16px] font-medium leading-normal transition duration-150 ease-in-out hover:border-white hover:bg-white hover:text-black focus:border-neutral-800 focus:text-neutral-800 focus:outline-none focus:ring-0 active:border-neutral-900 active:text-neutral-900 max-lg:text-[14px]">
                Contribute Now!
              </button>
            </Link>
            </div>
            {/* <div>
                Are you a designer? <Link to='/designers' className='underline'>Join Drawn2Shoe</Link>
            </div> */}
    </div>
  )
}

export default Home_retailers_comp
