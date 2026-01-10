
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { Loader2, Calendar, Users, MapPin, Star, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MyBookings = () => {
  const { data: bookings, isLoading, error } = useQuery(
    "fetchMyBookings",
    apiClient.fetchMyBookings,
    {
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to load bookings</h3>
          <p className="text-gray-600">Please try again later or contact support if the problem persists.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[60vh] flex items-center justify-center"
      >
        <div className="text-center p-8 max-w-md">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">No bookings yet</h3>
          <p className="text-gray-600 mb-8">
            When you make a booking, it will appear here with all the details you need.
          </p>
          <button
            onClick={() => (window.location.href = "/search")}
            className="px-8 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-sm hover:shadow"
          >
            Find Hotels
          </button>
        </div>
      </motion.div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-2">
              You have {bookings.length} booking{bookings.length > 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {bookings.map((booking) => {
            const nights = Math.ceil(
              (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) /
                (1000 * 60 * 60 * 24)
            );

            return (
              <motion.div
                key={booking.id}
                variants={cardVariants}
                layout
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    {/* Image Section */}
                    <div className="lg:col-span-4 relative overflow-hidden">
                      <div className="relative h-64 lg:h-full">
                        <img
                          src={booking.hotelId.imageUrls[0]}
                          alt={booking.hotelId.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-sm font-medium rounded-full">
                            {nights} night{nights > 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="lg:col-span-8 p-6 lg:p-8">
                      <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                              {booking.hotelId.name}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">
                                {booking.hotelId.city}, {booking.hotelId.country}
                              </span>
                              {booking.hotelId.starRating && (
                                <>
                                  <span className="text-gray-300">•</span>
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-sm font-medium">
                                      {booking.hotelId.starRating}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="px-4 py-2 bg-blue-50 rounded-lg">
                              
                            </div>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          {/* Dates */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">Check-in / Check-out</div>
                                <div className="font-medium">
                                  {new Date(booking.checkIn).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                  {" → "}
                                  {new Date(booking.checkOut).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Guests */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">Guests</div>
                                <div className="font-medium">
                                  {booking.adultCount} adult{booking.adultCount > 1 ? "s" : ""}
                                  {booking.childrenCount > 0 &&
                                    `, ${booking.childrenCount} child${booking.childrenCount > 1 ? "ren" : ""}`}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Price and Actions */}
                        <div className="mt-auto pt-6 border-t border-gray-100">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <div className="text-sm text-gray-500">Total Cost</div>
                              <div className="text-2xl font-bold text-gray-900">
                                ${booking.totalCost.toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {booking.totalCost / nights} per night
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <button className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                                View Details
                              </button>
                              <button className="px-5 py-2.5 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                                Manage Booking
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MyBookings;


// Original code

/* import { useQuery } from "react-query";
import * as apiClient from "../api-client";


const MyBookings = ()=>{

    const {data: bookings} = useQuery("fetchMyBookings", 
        apiClient.fetchMyBookings
    );

    if(!bookings || bookings.length === 0){
        return <span>
            No bookings found
        </span>
    };


    return (
      <div className="space-y-5">
        <h1 className="text-3xl font-bold">
          My bookings
        </h1>
        {bookings.map((booking)=>(
            // booking.hotelId is used to represent hotel, which was added on the backend after fetching bookings
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] border border-slate-300 rounded-lg p-8 gap-5 ">
                <div className="lg:w-full lg:h-[250px]">
                    <img src={booking.hotelId.imageUrls[0]} className="w-full h-full object-cover object-center" />
                </div>

                <div className="flex flex-col gap-4 overflow-x-auto max-h-[300px]">
                    <div className="text-2xl font-bold ">
                        {booking.hotelId.name}
                        <div className="text-xs font-normal">
                            {booking.hotelId.city}, {booking.hotelId.country}
                        </div>
                    </div>
                    <div>
                    <div>
                       <span className="font-bold mr-2">
                        Dates:
                        </span>
                        <span>
                            { new Date(booking.checkIn).toDateString()} -
                            {new Date(booking.checkOut).toDateString()}
                        </span> 
                    </div>

                    <div>
                        <span className="font-bold mr-2">Guests:</span>
                        <span>
                            {booking.adultCount} adults, {booking.childrenCount} children
                        </span>

                    </div>

                </div>

                </div>

                

            </div>
        ))}

      </div>  
    )

}

export default MyBookings; */