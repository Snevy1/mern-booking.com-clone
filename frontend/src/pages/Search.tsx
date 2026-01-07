import React, { useMemo, useState } from 'react'
import { useSearchContext } from '../contexts/searchContext'
import { useQuery } from 'react-query';
import * as apiClient from "../api-client"
import SearchResultCard from '../components/SearchResultCard';
import Pagination from '../components/Pagination';
import StarRatingFilter from '../components/StarRatingFilter';
import HotelTypesFilter from '../components/HotelTypesFilter';
import FacilitiesFilter from '../components/FacilitiesFilter';
import PriceFilter from '../components/PriceFilter';


const Search = () => {
    const search = useSearchContext();
    const [page, setPage] = useState<number>(1);

    const [selectedStars, setSelectedStars] = useState<string[]>([]);
    const [selectedHotelTypes, setselectedHotelTypes] = useState<string[]>([]);
    const [selectedFacilities, setselectedFacilities] = useState<string[]>([]);
    const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
    const [sortOption, setSortOption] = useState<string>("");



    const searchParams = useMemo(() => ({
        destination: search.destination,
        checkIn: search.checkIn.toISOString(),
        checkOut: search.checkOut.toISOString(),
        adultCount: search.adultCount.toString(),
        childrenCount: search.childrenCount.toString(),
        page: page.toString(),
        stars: selectedStars,
        types:selectedHotelTypes,
        facilities: selectedFacilities,
        maxPrice: selectedPrice?.toString(),
        sortOption: sortOption

    }), [
        search.destination, 
        search.checkIn, 
        search.checkOut, 
        search.adultCount, 
        search.childrenCount, 
        page,
        selectedStars,
        selectedHotelTypes,
        selectedFacilities,
        selectedPrice,
        sortOption
    ]);
    const {data: hotelData} = useQuery(["searchHotels", searchParams], ()=> apiClient.searchHotels(searchParams));

  const handleStarsChange = (event:React.ChangeEvent<HTMLInputElement>)=>{

    const starRating = event.target.value;

    setSelectedStars((prevStars)=>
      event.target.checked ? [...prevStars, starRating]
    : prevStars.filter(star => star !== starRating)
    
    )

  }  

  const handleHotelTypeChange = (event:React.ChangeEvent<HTMLInputElement>)=>{

    const hotelType = event.target.value;

    setselectedHotelTypes((prevHotelTypes)=>
      event.target.checked ? [...prevHotelTypes, hotelType]
    : prevHotelTypes.filter(type => type !== hotelType)
    
    )

  }  
  const handleFacilitiesChange = (event:React.ChangeEvent<HTMLInputElement>)=>{

    const facility = event.target.value;

    setselectedFacilities((prevFacilities)=>
      event.target.checked ? [...prevFacilities, facility]
    : prevFacilities.filter(facility => facility !== facility)
    
    )

  }  

  return (
    <div className='grid grid-cols-[150px_1fr] lg:grid-cols-[250px_1fr] gap-5'>
      <div className='rounded-lg border border-slate-300 p-5 h-fit sticky top-10 '>
        <div className='space-y-6 p-6 bg-white rounded-xl shadow-sm border border-slate-100'>
  <div className='pb-4 border-b border-slate-200'>
    <h3 className='text-xl font-bold text-slate-800 tracking-tight'>
      Filter Results
    </h3>
    <p className='text-sm text-slate-500 mt-1'>
      Refine your search using the filters below
    </p>
  </div>

  <div className='space-y-7'>
    {/* FILTERS */}
    <div className='space-y-3'>
      <h4 className='text-base font-semibold text-slate-700 mb-2'>Star Rating</h4>
      <StarRatingFilter 
        selectedStars={selectedStars}  
        onChange={handleStarsChange} 
      />
    </div>

    <div className='space-y-3'>
      <h4 className='text-base font-semibold text-slate-700 mb-2'>Hotel Type</h4>
      <HotelTypesFilter 
        selectedHotelTypes={selectedHotelTypes} 
        onChange={handleHotelTypeChange} 
      />
    </div>

    <div className='space-y-3'>
      <h4 className='text-base font-semibold text-slate-700 mb-2'>Facilities</h4>
      <FacilitiesFilter 
        selectedFacilities={selectedFacilities} 
        onChange={handleFacilitiesChange} 
      />
    </div>

    <div className='space-y-3'>
      <h4 className='text-base font-semibold text-slate-700 mb-2'>Price Range</h4>
      <PriceFilter 
        selectedPrice={selectedPrice}  
        onChange={(value?: number) => setSelectedPrice(value)}
      />
    </div>
  </div>
</div>

        

      </div>
      <div className='flex flex-col gap-5 '>
          <div className='flex justify-between items-center '>
            <span className='text-xl font-bold'>
              {hotelData?.data.length} Hotels found 
              {search.destination ? ` in  ${search.destination}`: ""}
            </span>
             
              {/* TODO sort options */}
              <select value={sortOption} 
              onChange={(event)=>setSortOption(event.target.value)} 
               className='p-2 border rounded-md'
              >

                <option value="">Sort By</option>
                <option value="StarRating">Star Rating</option>
                <option value="pricePerNightAsc">pricePerNight (low to high)</option>
                <option value="pricePerNightDesc">pricePerNight (high to low)</option>

              </select>

          </div>
          {hotelData?.data.map((hotel)=>(
            <SearchResultCard hotel={hotel} />
          ))}
          <div>
            <Pagination page={hotelData?.pagination.page || 1}  pages={hotelData?.pagination.pages || 1}
             onPageChange={(page)=> setPage(page)}
            />
          </div>
        </div>

    </div>
  )
}

export default Search;