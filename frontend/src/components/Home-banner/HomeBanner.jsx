import React from 'react'
import banner from '../../assets/banner-hero.png'
import { Link } from 'react-router-dom'

const HomeBanner = () => {

  return (
    <div className="flex justify-center items-center my-8">
      <div className="w-[80%] flex max-md:flex-col-reverse justify-center items-center max-md:text-center">
        <div className="w-[50%] max-md:w-full p-3">
          <div className="text-[45px] max-md:text-[36px]  leading-tight custom">
            Need the perfect dataset?
          </div>
          <br />
          <div className="text-[16px] max-md:text-[16px]  leading-[28px]">
          Discover the perfect dataset for your needs. Create custom surveys or explore curated datasets from diverse contributors.
          </div>
          <br />
          <div className='flex gap-2 max-lg:justify-center'>
            <div>
            <a href="#guide" smooth={true} duration={1000}>
              <button className="inline-block rounded-full border-2 border-neutral-800 px-4 pb-[6px] pt-2 text-[16px] font-medium leading-normal text-neutral-800 transition duration-150 ease-in-out hover:border-neutral-800 hover:bg-black hover:text-white focus:border-neutral-800 focus:text-neutral-800 focus:outline-none focus:ring-0 active:border-neutral-900 active:text-neutral-900 max-lg:text-[14px]">
                Get Started Now!
              </button>
            </a>
            </div>
            <div>
            <Link to="/explore">
              <button className="inline-block bg-black  rounded-full border-2 border-neutral-800 px-6 pb-[6px] pt-2 text-[16px] font-medium leading-normal text-white transition duration-150 ease-in-out hover:border-neutral-800 hover:bg-white hover:text-black focus:border-neutral-800 focus:text-neutral-800 focus:outline-none focus:ring-0 active:border-neutral-900 active:text-neutral-900 max-lg:text-[14px]">
                Explore Datasets
              </button>
            </Link>
            </div>
          </div>
        </div>
        <div className="w-[60%] p-3 max-md:w-full flex justify-center">
        <img src={banner} alt="" />
        </div>
      </div>
    </div>
  );
}

export default HomeBanner
