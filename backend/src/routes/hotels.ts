
import  express , {Request,Response} from "express";
import Hotel from "../models/hotel";
import { HotelSearchResponse } from "../shared/types";

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

})


const constructSearchQuery = (queryParams: any)=>{
    let constructedQuery: any = {};

    if(queryParams.destination){
        constructedQuery.$or = [
            {
                city: new RegExp(queryParams.destination, "i")
            },
            {
                country: new RegExp(queryParams.destination, "i")
            }
        ]
    }

    if(queryParams.adultCount){
        constructedQuery.adultCount = {
            $gte: parseInt(queryParams.adultCount)
        }
    }

    if(queryParams.childrenCount){
        constructedQuery.childrenCount = {
            $gte: parseInt(queryParams.childrenCount)
        }
    }


if(queryParams.facilities){
    constructedQuery.facilities = {
        $all: Array.isArray(queryParams.facilities) ?  queryParams.facilities
        : [queryParams.facilities],
    }
}

if(queryParams.types){
    constructedQuery.type = {
        $in: Array.isArray(queryParams.types) ? queryParams.types : [queryParams.types]
    }
}

if(queryParams.stars){
    const starRatings = Array.isArray(queryParams.stars) ? queryParams.stars.map((star: string)=> parseInt(star))
    : parseInt(queryParams.stars);

    constructedQuery.starRating = {$in: starRatings}
}

if(queryParams.maxPrice){
    constructedQuery.maxPrice = {
        $lte: parseInt(queryParams.maxPrice).toString()
    }
}
if(queryParams.pricePerNight){
    constructedQuery.pricePerNight = {
        $lte: parseInt(queryParams.pricePerNight).toString()
    }
}




    return constructedQuery;

}

export default router;