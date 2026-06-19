import { PackageSearch, Search } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import trackingImage from "../../assets/live-tracking.png"
import ReadyToTrack from '../../Components/ParcelTrack/ReadyToTrack';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import SearchLoading from '../../Components/ParcelTrack/SearchLoading';
import TrackingResult from '../../Components/ParcelTrack/TrackingResult';
import { useLocation } from 'react-router';
import NoParcelFound from '../../Components/ParcelTrack/NoParcelFound';

const TrackYourParcel = () => {
    const axiosSecure = useAxiosSecure()
    const [searchLoading, setSearchLoading] = useState(false)
    const [parcel, setParcel] = useState()
    console.log(parcel?.length)
    console.log(!!parcel)
    const [parcelId, setParcelId] = useState()
    const location = useLocation()
    const searchInput = useRef()

    const handleTrack = async (value) => {
        // e.preventDefault()
        setSearchLoading(true)
        const { data } = await axiosSecure.get(`parcel?parcelId=${value.trim()}`)

        setParcel(data || [])
        setSearchLoading(false)
    }
    useEffect(() => {
        if (location.state) {
            searchInput.current.value = location.state
            handleTrack(location.state)
        }

    }, [])
    const handleSubmit = (e) => {
        e.preventDefault()
        handleTrack(e.target.search.value)
        setParcelId(e.target.search.value)
    }
    const [inputError, setInputError] = useState()
    const handleInput = (e) => {
        const value = e.target.value.toUpperCase().trim()
        console.log(typeof value)
        if (value.trim() === "") {
            return setInputError()
        }
        else if (value.startsWith("PCL")) {
            return setInputError()
        }
        else if (!"PCL".startsWith(value)) {
            return setInputError('Tracking Id Must Starts With PCL')
        }
        else {
            return setInputError()
        }
    }
    console.log(parcel)
    return (
        <div>
            <div className='p-5 sm:p-8 mb-8 shadow rounded-2xl sm:rounded-4xl bg-linear-to-r from-[#CAEB66]/40 via-white to-[#CAEB66]/40'>
                <div className='grid  md:grid-cols-[1.25fr_0.75fr] '>
                    <div>
                        <h1 className='flex items-center gap-2 px-4 py-2 text-sm font-bold bg-[#CAEB66]/50  w-max rounded-full text-[#536e00]'><PackageSearch size={16} /> Live Parcel Tracking</h1>
                        <h2 className='text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight max-w-3xl mt-4'>Track every parcel step from booking to doorstep delivery.</h2>
                        <p className="mt-2 sm:mt-4 text-sm sm:text-base font-medium  max-w-xl leading-relaxed ">
                            Enter your parcel ID to see the latest delivery status, route progress, payment state, and destination details in one place.
                        </p>
                        <form
                            onSubmit={handleSubmit}
                            className='mt-5 sm:mt-8 flex flex-wrap xs:flex-nowrap gap-2 sm:gap-5 w-full'>
                            <label className='input border-none flex bg-white shadow-sm h-14 rounded-xl sm:rounded-2xl w-full max-w-2xl'>
                                <Search className='text-gray-500 ' size={18} />
                                <input ref={searchInput} onChange={handleInput} type="text" className="grow" placeholder='Enter parcel ID' name='search' required />
                            </label>
                            <button className='btn bg-green-800 text-white flex h-14 rounded-xl sm:rounded-2xl px-8 xs:w-[167px] w-full '>{searchLoading ? <span className="loading loading-spinner loading-xs"></span> : <Search size={18} />}Track Parcel</button>
                        </form>
                        <p className='text-red-500 text-sm mt-2'>{inputError}</p>


                        <p className="mt-1 text-sm">
                            Example statuses: Order Placed, Rider Assigned, In Transit, Delivered.
                        </p>
                    </div>
                    <div className='hidden md:flex items-center justify-center'>
                        <img src={trackingImage} alt="" />
                    </div>
                </div>
            </div>
            {!parcel && !searchLoading &&
                <ReadyToTrack></ReadyToTrack>
            }
            {searchLoading &&
                <SearchLoading></SearchLoading>
            }
            {parcel && !searchLoading && parcel.length !== 0 &&
                < TrackingResult parcel={parcel} ></TrackingResult>
            }
            {
                parcel && parcel.length === 0 && !searchLoading &&
                <NoParcelFound submittedParcelId={parcelId} ></NoParcelFound>
            }



        </div >
    );
};

export default TrackYourParcel;
