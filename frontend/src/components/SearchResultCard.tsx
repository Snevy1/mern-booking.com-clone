

import React from 'react'
import { HotelType } from '../../../backend/src/shared/types'
import { AiFillStar } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { MdLocationOn, MdWifi, MdLocalParking, MdRestaurant, MdPool } from 'react-icons/md'
import { FaSpa, FaDumbbell, FaConciergeBell } from 'react-icons/fa'
import { BsFillPeopleFill } from 'react-icons/bs'

type Props = {
    hotel: HotelType
}

// Map common facilities to icons for better visuals
const facilityIcons: Record<string, React.ReactNode> = {
    'Free WiFi': <MdWifi className="w-4 h-4" />,
    'Parking': <MdLocalParking className="w-4 h-4" />,
    'Restaurant': <MdRestaurant className="w-4 h-4" />,
    'Swimming Pool': <MdPool className="w-4 h-4" />,
    'Spa': <FaSpa className="w-4 h-4" />,
    'Fitness Center': <FaDumbbell className="w-4 h-4" />,
    '24/7 Front Desk': <FaConciergeBell className="w-4 h-4" />
}

const SearchResultCard = ({ hotel }: Props) => {
    // Get the first 3 facilities with icons or default
    const displayedFacilities = hotel.facilities.slice(0, 3).map(facility => ({
        name: facility,
        icon: facilityIcons[facility] || <BsFillPeopleFill className="w-4 h-4" />
    }))

    return (
        <div className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
            {/* Top-right badge for special offers */}
            {hotel.pricePerNight < 150 && (
    <div className="absolute top-4 right-4 z-10">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-md">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Best Value
        </span>
    </div>
)}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                {/* Image Section with hover effect */}
                <div className="lg:col-span-1 relative overflow-hidden rounded-xl">
                    <div className="relative h-64 lg:h-full">
                        <img 
                            src={hotel.imageUrls[0]} 
                            alt={hotel.name}
                            className="w-full h-full object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        {/* Image overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                        
                        {/* Multiple images indicator */}
                        {hotel.imageUrls.length > 1 && (
                            <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                                +{hotel.imageUrls.length - 1} photos
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="lg:col-span-2 flex flex-col justify-between">
                    {/* Header Section */}
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center">
                                    {Array.from({ length: hotel.starRating }).map((_, index) => (
                                        <AiFillStar 
                                            key={index} 
                                            className="w-5 h-5 fill-amber-400 drop-shadow-sm" 
                                        />
                                    ))}
                                    <span className="ml-2 text-sm font-medium text-gray-600">
                                        {hotel.starRating}.0
                                    </span>
                                </div>
                                
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
                                    {hotel.type}
                                </span>
                            </div>
                            
                            <div className="flex items-center text-gray-500 text-sm">
                                <MdLocationOn className="w-4 h-4 mr-1" />
                                <span>{hotel.city}, {hotel.country}</span>
                            </div>
                        </div>

                        <Link 
                            to={`/detail/${hotel._id}`}
                            className="group/title block"
                        >
                            <h3 className="text-2xl font-bold text-gray-900 group-hover/title:text-blue-600 transition-colors duration-300">
                                {hotel.name}
                            </h3>
                        </Link>

                        {/* Description with fade effect */}
                        <div className="relative">
                            <p className="text-gray-600 leading-relaxed line-clamp-2 transition-all duration-300 group-hover:line-clamp-4">
                                {hotel.description}
                            </p>
                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    </div>

                    {/* Facilities Section */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex flex-wrap items-center gap-3">
                            {displayedFacilities.map((facility, index) => (
                                <div 
                                    key={index}
                                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-300 hover:shadow-sm group/facility"
                                >
                                    <div className="text-blue-500 group-hover/facility:scale-110 transition-transform">
                                        {facility.icon}
                                    </div>
                                    <span className="text-sm font-medium whitespace-nowrap">
                                        {facility.name}
                                    </span>
                                </div>
                            ))}
                            
                            {hotel.facilities.length > 3 && (
                                <button className="relative px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-300 group/more">
                                    +{hotel.facilities.length - 3} more
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 scale-x-0 group-hover/more:scale-x-100 transition-transform duration-300 origin-left" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Footer with Price and CTA */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-gray-900">
                                        ${hotel.pricePerNight}
                                    </span>
                                    <span className="text-gray-500">/ night</span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    <span className="inline-flex items-center">
                                        <BsFillPeopleFill className="w-3 h-3 mr-1" />
                                        Max {hotel.adultCount} adults • {hotel.childrenCount} children
                                    </span>
                                </div>
                            </div>

                            <Link
  to={`/detail/${hotel._id}`}
  className="group/btn relative inline-flex items-center justify-center px-8 py-3 bg-[#74B9CB] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-[#B45309] transition-all duration-300 overflow-hidden"
>
  {/* Animated background effect */}
  <span className="absolute inset-0 w-full h-full bg-blue-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />

  {/* Button content */}
  <span className="relative flex items-center">
    View Details
    <svg
      className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform duration-300"
      fill="none"
      stroke="#FFFFFF"   // explicitly set stroke color
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 8l4 4m0 0l-4 4m4-4H3"
      />
    </svg>
  </span>

  {/* Ripple effect */}
  <span className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 group-active/btn:opacity-20 transition-opacity duration-300" />
</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom gradient border effect */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-300  to-[#74B9CB] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </div>
    )
}

export default SearchResultCard





// Original code

/* import React from 'react'
import { HotelType } from '../../../backend/src/shared/types'
import { AiFillStar } from 'react-icons/ai'
import { Link } from 'react-router-dom'

type Props = {
    hotel: HotelType

}
const SearchResultCard = ({hotel}:Props) => {
  return (
    <div className='grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-slate-300 rounded-lg p-8 gap-8'>
      <div className='w-full h-[300px]'>
        <img src={hotel.imageUrls[0]} className='w-full h-full object-cover object-center '/>
      </div>
      <div className='grid grid-rows-[1fr_2fr_1fr] justify-between'>
        <div>
            <div className='flex items-center '>
                <span className='flex'>
                    {Array.from({length: hotel.starRating}).map(()=>(
                        <AiFillStar className='fill-yellow-400'  />
                    ))}
                </span>

                <span className='ml-1 text-sm'>
                    {hotel.type}
                </span>


            </div>
            <Link to={`/detail/${hotel._id}`} className='text-2xl font-bold cursor-pointer'>{hotel.name}</Link>
        </div>
        
        <div>
           <div className='line-clamp-4'>
            {hotel.description}
            </div> 
        </div>
        <div className='grid grid-cols-2 items-end whitespace-nowrap '>
            <div className='flex gap-1 items-center'>
                {hotel.facilities.slice(0,3).map((facility)=>(
                    <span className='bg-slate-300 p-2 rounded-lg font-bold text-xs whitespace-nowrap '>
                       {facility}
                    </span>
                ))}

                <span className='text-sm'>
                    {hotel.facilities.length > 3 && `+${hotel.facilities.length - 3} more`}
                </span>

            </div>

            <div className='flex flex-col items-end gap-1'>
                <span className='font-bold'>
                    ${hotel.pricePerNight} per night
                </span>
                <Link to={`/detail/${hotel._id}`} className='bg-blue-600 text-white h-full p-2 font-bold text-xl max-w-fit hover:bg-blue-500'>
                    View More
                </Link>

            </div> 

        </div>
        
      </div>
    </div>
  )
}

export default SearchResultCard */