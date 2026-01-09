

import mongoose from 'mongoose';
import { BookingType, HotelType } from '../shared/types';

// Booking Schema - now in its own collection
const bookingSchema = new mongoose.Schema<BookingType>({
   hotelId: {type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true},
   userId: {type: String, required: true},
   firstName: {type: String, required: true},
   lastName: {type: String, required: true},
   email: {type: String, required: true},
   adultCount: {type: Number, required: true},
   childrenCount: {type: Number, required: true},
   checkIn: {type: Date, required: true},
   checkOut: {type: Date, required: true},
   totalCost: {type: Number, required: true},
});

// Add indexes for common queries
bookingSchema.index({userId: 1});
bookingSchema.index({hotelId: 1});
bookingSchema.index({checkIn: 1, checkOut: 1});

// Hotel Schema - without embedded bookings
const hotelSchema = new mongoose.Schema<HotelType>({
    userId: {type: String, required: true},
    name: {type: String, required: true},
    city: {type: String, required: true},
    country: {type: String, required: true},
    description: {type: String, required: true},
    type: {type: String, required: true},
    adultCount: {type: Number, required: true},
    childrenCount: {type: Number, required: true},
    roomCount: {type: Number, required: true}, 
    facilities: {type: [String], required: true},
    pricePerNight: {type: Number, required: true},
    starRating: {type: Number, required: true, min: 1, max: 5},
    lastUpdated: {type: Date, required: true},
    imageUrls: {type: [String], required: true}
});

// Create models
const Hotel = mongoose.model<HotelType>("Hotel", hotelSchema);
const Booking = mongoose.model<BookingType>("Booking", bookingSchema);

export { Hotel, Booking };

// Original


/* import mongoose from "mongoose"
import { BookingType, HotelType } from "../shared/types";



const bookingSchema = new mongoose.Schema<BookingType>({
   userId: {type: String, required: true},
   firstName: {type: String, required: true},
   lastName: {type: String, required: true},
   email: {type: String, required: true},
   adultCount: {type: String, required: true},
   childCount: {type: String, required: true},
   checkIn: {type:Date, required: true},
   checkOut: {type: Date, required: true},
   totalCost: {type: Number, required: true}
});

const hotelSchema = new mongoose.Schema<HotelType>({
    userId: {type: String, required: true},
    name: {type: String, required: true},
    city: {type: String, required: true},
    country: {type: String, required: true},
    description: {type: String, required: true},
    type: {type: String, required: true},
    adultCount: {type: Number, required: true},
    childrenCount: {type: Number, required: true},
    roomCount: {type: Number, required: true}, 
    facilities: {type: [String], required: true},
    pricePerNight: {type: Number, required: true},
    bookings: [bookingSchema],
    starRating: {type: Number, required: true, min:1, max:5},
    lastUpdated: {type: Date, required: true},
    imageUrls:{type: [String], required: true}

});


const Hotel = mongoose.model<HotelType>("Hotel", hotelSchema);

export default Hotel; */