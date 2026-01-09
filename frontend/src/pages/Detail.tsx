

import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { AiFillStar } from "react-icons/ai";
import GuestInfoForm from "../components/forms/GuestInfoForm/GuestInfoForm";

const Detail = () => {
  const { hotelId } = useParams();

  const { data: hotel } = useQuery(
    "fetchHotelById",
    () => apiClient.fetchHotelById(hotelId as string),
    {
      enabled: !!hotelId,
    }
  );

  if (!hotel) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex">
            {Array.from({ length: hotel.starRating }).map((_, index) => (
              <AiFillStar key={index} className="fill-yellow-400 w-5 h-5 sm:w-6 sm:h-6" />
            ))}
          </span>
          <span className="text-sm sm:text-base text-slate-600 font-medium">
            {hotel.starRating} Star Hotel
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 leading-tight">
          {hotel.name}
        </h1>

        <div className="flex items-center gap-4 text-slate-600">
          <span className="text-lg sm:text-xl font-semibold text-blue-700">
            ${hotel.pricePerNight.toFixed(2)} <span className="text-sm font-normal">per night</span>
          </span>
          <span className="text-sm sm:text-base">•</span>
          <span className="text-sm sm:text-base">{hotel.type}</span>
          <span className="text-sm sm:text-base">•</span>
          <span className="text-sm sm:text-base">{hotel.city}, {hotel.country}</span>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {hotel.imageUrls.map((image, index) => (
          <div
            key={index}
            className="h-[250px] sm:h-[300px] md:h-[350px] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={image}
              alt={`${hotel.name} - View ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
      </div>

      {/* Facilities */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Facilities & Amenities</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {hotel.facilities.map((facility, index) => (
            <div
              key={index}
              className="border border-slate-200 rounded-lg p-4 bg-white hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center text-center"
            >
              <span className="font-medium text-slate-800 text-sm sm:text-base">
                {facility}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Description & Booking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Description */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">About This Hotel</h2>
            <div className="prose prose-slate max-w-none">
              <p className="whitespace-pre-line text-slate-700 leading-relaxed text-base sm:text-lg">
                {hotel.description}
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Hotel Type</h3>
              <p className="text-slate-700">{hotel.type}</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Location</h3>
              <p className="text-slate-700">{hotel.city}, {hotel.country}</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Adult Capacity</h3>
              <p className="text-slate-700">{hotel.adultCount} adults</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Child Capacity</h3>
              <p className="text-slate-700">{hotel.childrenCount} children</p>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className=" lg:top-6 self-start">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Book Your Stay</h3>
              <p className="text-slate-600 text-sm">Secure your reservation now</p>
            </div>
            <GuestInfoForm
              pricePerNight={hotel.pricePerNight}
              hotelId={hotel._id}
            />
            <div className="pt-4 border-t border-slate-200">
              <div className="flex justify-between items-center text-slate-700">
                <span className="font-medium">Price per night:</span>
                <span className="text-xl font-bold text-blue-700">${hotel.pricePerNight.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;









// original

/* import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import * as apiClient from "../api-client"
import { AiFillStar } from "react-icons/ai";
import GuestInfoForm from "../components/forms/GuestInfoForm/GuestInfoForm";

const Detail = ()=>{

    const {hotelId} = useParams();

    const {data: hotel} = useQuery("fetchHotelById", ()=>
      apiClient.fetchHotelById(hotelId as string),
    {
        enabled: !!hotelId
    }
    );

    if(!hotel){
        return <></>
    }


    return (
        <div className="space-y-6 ">
            <div>
                <span className="flex  ">
                    {Array.from({length: hotel.starRating}).map(()=>(
                       <AiFillStar className="fill-yellow-400"/> 
                    ))}
                </span>

                <h1 className="text-3xl font-bold ">{hotel.name}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {
                    hotel.imageUrls.map((image)=>(
                        <div className="h-[300px]">
                            <img src={image} alt={hotel.name} className="rounded-md w-full h-full object-cover object-center"/>

                        </div>
                    ))
                }

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
                {
                 hotel.facilities.map((facility)=>(
                    <div className="border border-slate-300 rounded-sm p-3">
                        {facility}

                    </div>

                 ))   
                }

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
                <div className="whitespace-pre-line">
                    {hotel.description}
                </div>
                <div className="h-fit">
                     <GuestInfoForm pricePerNight={hotel.pricePerNight} hotelId={hotel._id}  /> 
                    
                </div>

            </div>

        </div>
    )

}

export default Detail; */