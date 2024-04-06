import React from 'react'
import { Link } from 'react-router-dom'
import step1 from "../../assets/step_1.png"
import step2 from "../../assets/step_2.png"
import step3 from "../../assets/step_3.png"
import step from "../../assets/step.png"

const Guide = () => {
    return (
    <div className=' flex justify-center my-11 flex-col items-center' id="guide">
        <div className='w-[80%] flex flex-col gap-6'>
            <div className='text-[50px] text-center custom max-md:text-[30px]'>
                Create Survey in 3 Easy Steps!
            </div>
            <div className='flex gap-4 max-md:flex-col' >
                <div className='rounded-2xl shadow-[2px_4px_35px_4px_rgba(0,0,0,0.10)] px-10 py-5'>
                    <img src={step} alt="" />
                    <br />
                    <p className='font-bold text-[24px] custom'>
                    Define a Dataset:
                    </p>
                    <br />
                    <ul className='list-disc text-[15px] text-[#6e6d78]' >
                        <li>
                            Specify the number of questions you will be adding in the survey.
                        </li>
                        <li>
                            Each question represents a field of the dataset.
                        </li>
                    </ul>
                </div>
                <div className='rounded-2xl shadow-[2px_4px_35px_4px_rgba(0,0,0,0.10)] px-10 py-5'>
                    <img src={step} alt="" />
                    <br />
                    <p className='font-bold text-[24px] custom'>
                    Populate the fields:
                    </p>
                    <br />
                    <ul className='list-disc text-[15px] text-[#6e6d78]'>
                        <li>
                        Add the questions along with a brief description of the question.
                        </li>
                    </ul>
                </div>
                <div className='rounded-2xl shadow-[2px_4px_35px_4px_rgba(0,0,0,0.10)] px-10 py-5'>
                    <img src={step} alt="" />
                    <br />
                    <p className='font-bold text-[24px] custom'>
                    Submit and Share:
                    </p>
                    <br />
                    <ul className='list-disc text-[15px] text-[#6e6d78]'>
                        <li>
                        Once you submit the survey, you're all set.
                        </li>
                        <li>
                        Users may now be able to contribute to the dataset.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div className='mt-[40px] shadow-[2px_4px_35px_4px_rgba(0,0,0,0.10)] rounded-2xl'>
        <Link to="/create">
              <button className="inline-block bg-black text-white rounded-full border-2 border-black px-5 pb-[8px] pt-3 text-[25px] font-medium leading-normal transition duration-150 ease-in-out hover:bg-white hover:text-black focus:border-neutral-800 focus:text-neutral-800 focus:outline-none focus:ring-0 active:border-neutral-900 active:text-neutral-900 max-lg:text-[14px] hover:border-black">
                Start Now!
              </button>
            </Link>
        </div>
    </div>
  )
}

export default Guide
