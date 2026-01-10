import { Link } from "react-router-dom";
import { HotelType } from "../../../backend/src/shared/types";
import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";

type Props = {
  hotel: HotelType;
};

const LatestDestinationCard = ({ hotel }: Props) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Link
        to={`/detail/${hotel._id}`}
        className="relative block overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
      >
        {/* Image Container */}
        <div className="relative h-[300px] md:h-[350px] overflow-hidden">
          <motion.img
            src={hotel.imageUrls[0]}
            alt={hotel.name}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            initial={{ scale: 1 }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Hotel Badge */}
          {hotel.type && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-800">
                {hotel.type}
              </span>
            </div>
          )}
          
          {/* Star Rating */}
          {hotel.starRating && (
            <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-sm font-semibold text-white">
                {hotel.starRating}
              </span>
            </div>
          )}
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium opacity-90">
                {hotel.city}, {hotel.country}
              </span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-2">
              {hotel.name}
            </h3>
          </div>
          
          {/* Price and Description */}
          <div className="flex items-center justify-between">
            <div>
              {hotel.pricePerNight && (
                <>
                  <div className="text-sm opacity-80">Starting from</div>
                  <div className="text-xl font-bold">
                    ${hotel.pricePerNight}
                    <span className="text-sm font-normal"> / night</span>
                  </div>
                </>
              )}
            </div>
            
            <motion.div
              className="w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.1 }}
            >
              →
            </motion.div>
          </div>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/30 rounded-2xl transition-colors pointer-events-none" />
      </Link>
    </motion.div>
  );
};

export default LatestDestinationCard;