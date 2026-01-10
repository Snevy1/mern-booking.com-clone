
import  express , {Request,Response} from "express";
import axios from 'axios';
import {Booking, Hotel} from "../models/hotel";
import { BookingType, HotelSearchResponse, PaymentIntentResponse } from "../shared/types";
import { param, validationResult } from "express-validator";
import Stripe from "stripe";
import verifyToken from "../middleware/auth";
import { initiateMpesaSTKPush } from "../helpers/STKPush";
import { checkMpesaTransactionStatus } from "../helpers/MpesaValidation";



const StripeKey =  process.env.STRIPE_API_KEY

if(!StripeKey){
    throw new Error("Stripe API KEY required");
}


const stripe = new Stripe(StripeKey)
const router = express.Router();







// /api/hotels/search?



router.get("/search", async(req:Request, res:Response)=>{

    try {

        const query = constructSearchQuery(req.query);
        
        


        let sortOptions = {};

        switch(req.query.sortOption){
            case "StarRating": 
            sortOptions = { starRating: -1 };
            break;

            case "pricePerNightAsc": 
            sortOptions = { pricePerNight: 1}
            break;

            case "pricePerNightDesc": 
            sortOptions = {pricePerNight: -1}

            break;
        }

        const pageSize = 5;

        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
        

        const skip = (pageNumber - 1 ) * pageSize;

        const hotels = await Hotel.find(query).sort(sortOptions).skip(skip).limit(pageSize);
                    // so the order matters
                    //1. Mongoose is going to find results that match query
                    // 2. Will sort the results based on sort options
                    //3. Will add pagination stuff at very end

        const total = await Hotel.countDocuments();

        const response: HotelSearchResponse = {
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total/pageSize)
            }
        }

         res.status(200).json(response)
        
    } catch (error) {
        console.log("Error", error)
        res.status(500).json({message: "Something went wrong"});
        
    }

});

router.get("/", async(req:Request, response: Response)=>{

try {
    const hotels = await Hotel.find().sort("_lastUpdated");

    response.json(hotels)
    
} catch (error) {

    console.log("error", error)

    response.status(500).json({message: "Error fetching hotels"});

    
}

})


// api/hotels/8976543490
router.get("/:id",[
    param("id").notEmpty().withMessage("Hotel ID is required")
] ,async(req:Request, res:Response)=>{

    const errors = validationResult(req);

    if(!errors.isEmpty()){
         res.status(400).json({errors: errors.array()});
    }

    const id = req.params.id.toString();

    try {

        const hotel = await Hotel.findById(id);

        res.json(hotel)
        
    } catch (error) {

        console.log(error);

        res.status(500).json({message: "Error fetching hotel"})
        
    }

});

// Stripe payments and Mpesa, modified;



router.post("/:hotelId/bookings/payment-intent", verifyToken, async(req: Request, res: Response) => {
    try {
        const { numberOfNights, paymentMethod, phoneNumber } = req.body;
        const hotelId = req.params.hotelId;

        const hotel = await Hotel.findById(hotelId);

        if (!hotel) {
            res.status(400).json({ message: "Hotel not found" });
            return;
        }

        const totalCost = hotel.pricePerNight * numberOfNights;

        if (paymentMethod === 'mpesa') {
            // Handle M-Pesa payment
            if (!phoneNumber) {
                res.status(400).json({ message: "Phone number required for M-Pesa payment" });
                return;
            }

            // Convert USD to KES (you might want to use a currency conversion API)
            const kshAmount = totalCost  // * 130 if in usd Approximate conversion rate

            const mpesaResponse = await initiateMpesaSTKPush(
                phoneNumber,
                kshAmount,
                `HOTEL-${hotelId}`
            );

            const response = {
                paymentIntentId: mpesaResponse.CheckoutRequestID,
                clientSecret: null,
                totalCost,
                paymentMethod: 'mpesa',
                merchantRequestID: mpesaResponse.MerchantRequestID
            };

            res.send(response);
        } else {
            
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(totalCost * 100),
                currency: 'usd',
                metadata: {
                    hotelId,
                    userId: req.userId
                }
            });

            if (!paymentIntent.client_secret) {
                res.status(500).json({ message: "Error creating paymentIntent" });
                return;
            }

            const response = {
                paymentIntentId: paymentIntent.id,
                clientSecret: paymentIntent.client_secret.toString(),
                totalCost,
                paymentMethod: 'stripe'
            };

            res.send(response);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating payment intent" });
    }
});


router.post("/:hotelId/bookings", verifyToken, async(req: Request, res: Response) => {
    try {
        const { paymentIntentId, paymentMethod } = req.body;

        

        if (paymentMethod === 'mpesa') {
            // Verify M-Pesa payment
            const mpesaStatus = await checkMpesaTransactionStatus(paymentIntentId);
            
            if (mpesaStatus.ResultCode !== "0") {
                res.status(400).json({ 
                    message: `M-Pesa payment not succeeded. Status: ${mpesaStatus.ResultDesc}` 
                });
                return;
            }
        } else {
            // Verify Stripe payment (existing code)
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId as string);

            if (!paymentIntent) {
                res.status(400).json({ message: "payment intent not found" });
                return;
            }

            if (paymentIntent.metadata.hotelId !== req.params.hotelId || 
                paymentIntent.metadata.userId !== req.userId) {
                res.status(400).json({ message: "payment intent mismatch" });
                return;
            }

            if (paymentIntent.status !== "succeeded") {
                res.status(400).json({ 
                    message: `payment intent not succeeded. Status: ${paymentIntent.status}` 
                });
                return;
            }
        }

        const newBooking = new Booking({
            ...req.body,
            userId: req.userId,
            hotelId: req.params.hotelId,
        });

        const hotel = await Hotel.findById(req.params.hotelId);

        if (!hotel) {
            res.status(400).json({ message: "hotel not found" });
            return;
        }

        await newBooking.save();

        res.status(200).json({
            message: "Booking created successfully",
            bookingId: newBooking._id
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});


router.post("/mpesa/callback", async (req: Request, res: Response) => {
    try {
        const { Body } = req.body;
        
        if (Body.stkCallback.ResultCode === 0) {
            // Payment successful
            console.log('M-Pesa payment successful:', Body.stkCallback);
            // Store the transaction details for verification
        } else {
            // Payment failed
            console.log('M-Pesa payment failed:', Body.stkCallback.ResultDesc);
        }
        
        res.status(200).json({ message: "Callback received" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Callback processing error" });
    }
});



const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }

  // Use a helper or check for NaN explicitly
  if (queryParams.adultCount) {
    const adults = parseInt(queryParams.adultCount);
    if (!isNaN(adults)) {
      constructedQuery.adultCount = { $gte: adults };
    }
  }

  if (queryParams.childrenCount) {
    const children = parseInt(queryParams.childrenCount);
    if (!isNaN(children)) {
      constructedQuery.childrenCount = { $gte: children };
    }
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types) ? queryParams.types : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star)).filter((n:any) => !isNaN(n))
      : [parseInt(queryParams.stars)].filter((n) => !isNaN(n));

    if (starRatings.length > 0) {
      constructedQuery.starRating = { $in: starRatings };
    }
  }

  if (queryParams.maxPrice) {
    const maxPrice = parseInt(queryParams.maxPrice);
    if (!isNaN(maxPrice)) {
      constructedQuery.pricePerNight = { $lte: maxPrice };
    }
  }

  return constructedQuery;
};

export default router;



/* 


// This  code for payments intent before Mpesa


router.post("/:hotelId/bookings/payment-intent", verifyToken, async(req:Request, res:Response)=>{
    // 1. totalCost
    // 2. hotelId
    // 3. userId


    const {numberOfNights} = req.body;

    const  hotelId = req.params.hotelId;

    const hotel = await Hotel.findById(hotelId);

    if(!hotel){
         res.status(400).json({message: "Hotel not found"});
         return
         
    }

    const totalCost = hotel?.pricePerNight * numberOfNights;

    
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalCost * 100),
        currency: 'usd',
        metadata: {
            hotelId,
            userId: req.userId
        }
    });

    if(!paymentIntent.client_secret){
        res.status(500).json({message: "Error creating paymentIntent"})
        return;
    };

    const response:PaymentIntentResponse = {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret.toString(),
        totalCost,

    };

    res.send(response);


});










This code is bookings before Mpesa modification




 router.post("/:hotelId/bookings", verifyToken, async(req:Request, res:Response)=>{
    try {

        const paymentIntentId = req.body.paymentIntentId;

        const paymentIntent = await stripe.paymentIntents.retrieve(
            paymentIntentId as string
        );

        if(!paymentIntent){
            res.status(400).json({message: "payment intent not found"});

            return;
        }

        if(paymentIntent.metadata.hotelId !== req.params.hotelId || paymentIntent.metadata.userId !== req.userId){
            res.status(400).json({message: "payment intent mismatch"});
            return
        }


        if(paymentIntent.status !== "succeeded"){
             res.status(400).json({message: `payment intent not succeeded. Status: ${paymentIntent.status} `});
             return;
        };


        const newBooking = new Booking({
            ...req.body, 
            userId: req.userId,
            hotelId: req.params.hotelId,

        })
            // Because I created a separate bookings schema, we will use findOne
        /* const hotel = await Hotel.findOneAndUpdate(
            {
                _id: req.params.hotelId
            },
            {
                $push: {bookings: newBooking}
            }
        ); 

        // Verify hotel exists before creating booking
        const hotel = await Hotel.findById(req.params.hotelId);


        if(!hotel){
            res.status(400).json({message: "hotel not found"})
        }

         // Bookings are no longer  specific to a hotel
       // await hotel?.save()

       // Create new booking in separate collection

        await newBooking.save();

        res.status(200).json({
            message: "Booking created successfully",
            bookingId: newBooking._id
        });





        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"})
        
    }
})


*/