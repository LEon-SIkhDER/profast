import React, { useRef, useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import Map from '../../Components/Map';
import { useLoaderData } from 'react-router';

const Coverage = () => {
    const serviceCenter = useLoaderData()
    const inputRef = useRef()

    const [searched, setSearched] = useState()
    const [selected, setSelected] = useState()
    console.log(searched)

    const handleSearch = (e) => {
        e.preventDefault()
        const value = e.target.search?.value || e.target.value

        if (value.trim() === "") {
            return setSearched()
        }
        const searched = serviceCenter.filter((center) => center.district.toLowerCase().startsWith(value.toLowerCase()))
        if (searched.length === 0) {
            return setSearched(["No result found"])
        }
        setSearched(searched)
    }

    const handleFly = (value) => {
        inputRef.current.value = value.district
        setSearched([value])
        setSelected(value)

        console.log(value)

    }

    return (
        <div>
            <section>
                <div className='bg-white rounded-2xl shadow-sm py-16 px-28'>

                    <div className=' relative'>
                        <div className='bg-[#EAECED] flex items-center rounded-full ps-4  '>
                            <IoSearch size={24} />
                            <form className='w-full flex' onSubmit={handleSearch}>
                                <input required ref={inputRef} onChange={handleSearch} className=' px-3 focus:outline-none text-xl font-medium w-full' type="text" placeholder='Search Here' name='search' />
                                <button className='primary-bg py-3 px-8 rounded-full text-xl font-bold '>Search</button>
                            </form>
                        </div>

                        {searched &&
                            <div className='p-2.5 shadow-sm bg-gray-50 w-full rounded absolute top-full left-0 max-h-64 overflow-y-auto'>
                                {searched?.map((value, index) =>
                                    <button onClick={() => handleFly(value)} key={index} className='border-b border-b-gray-300 hover:bg-gray-200 duration-100 p-2.5 cursor-pointer select-none w-full text-left'>
                                        <h1 className='text-lg font-semibold'>{value.district || value}</h1>
                                        <p>{value.covered_area?.join(", ")}</p>
                                    </button>
                                )}
                            </div>}
                    </div>



                    <div className='border-b border-gray-200 my-12'></div>

                    <h1 className='text-[#03373D] text-5xl font-extrabold   text-center'>We are available in 64 districts</h1>
                    <h1 className='text-2xl font-extrabold text-[#03373D] mb-12 text-center mt-5'>We deliver reliably to almost all areas across Bangladesh, covering most districts nationwide.</h1>
                    <Map serviceCenter={serviceCenter} selected={selected} ></Map>





                </div>
            </section>

        </div>
    );
};

export default Coverage;