
import express, {Request, Response} from "express";
import verifyToken from "../middleware/auth";
import {  Booking, Hotel } from "../models/hotel";

const router = express.Router();


// /api/my-bookings

router.get("/", verifyToken, async(req:Request, res:Response)=>{

    try {

        const bookings = await Booking.find({ userId: req.userId }).populate('hotelId'); 

        res.status(200).json(bookings);

    } catch (error) {

        console.log(error);

        res.status(500).json({message: "Unable to fetch bookings"})
        
    }

});

export default router

