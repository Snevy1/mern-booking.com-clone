import express, {Request, Response} from "express";
const router = express.Router();
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
import { HotelType } from "../shared/types";

const storage = multer.memoryStorage();

  const upload = multer({
    storage: storage,
    limits:{
        fileSize: 5 * 1024 * 1024, // 5 MB
    }
  });


// api/my-hotels
router.post("/", verifyToken,[
    body("name").notEmpty().withMessage('Name is required'),
    body("city").notEmpty().withMessage('city is required'),
    body("country").notEmpty().withMessage('country is required'),
    body("description").notEmpty().withMessage('description is required'),
    body("type").notEmpty().withMessage('type is required'),
    body("pricePerNight").notEmpty().isNumeric().withMessage('pricePerNight  is required and is a number'),
    body("facilities").notEmpty().isArray().withMessage('facilities  are required'),

] ,upload.array("imageFiles", 6),  async(req: Request, res:Response) => {
    try {
        const imageFiles = req.files as Express.Multer.File[];
        const newHotel: HotelType = req.body;

        

        



        // 1. Upload images to Cloudinary

        const imageUrls = await uploadCloudinary(imageFiles);
        newHotel.imageUrls = imageUrls
        newHotel.lastUpdated = new Date();
        newHotel.userId = req.userId;

        // 3. Save the hotel to the database

        const hotel = new Hotel(newHotel);

        await hotel.save();

                // 4. return a 201 status

        res.status(201).send(hotel);
        
    } catch (error) {

        console.log("Error creating hotel", error);

        res.status(500).json({message: "Something went wrong"});
        
    } 


});

router.get("/", verifyToken, async(req:Request, res:Response)=>{

    

    try {
        const hotels = await Hotel.find({userId:req.userId});

    res.json(hotels);
        
    } catch (error) {

        res.status(500).json({message: "Error fetching hotel "})
        
    }




})


router.get("/:id", verifyToken, async(req:Request,res:Response)=>{

    const id = req.params.id.toString();

    try {

        const hotel = await Hotel.findById({
            _id: id,
            userId: req.userId
        });

        res.json(hotel)




        
    } catch (error) {
        res.status(500).json({
            message: "Error fetching hotels"
        })
        
    }

});


router.put("/:hotelId", verifyToken, upload.array("imageFiles"), async(req: Request, res:Response)=>{

    try {

        const updatedHotel: HotelType = req.body;

        updatedHotel.lastUpdated = new Date();

        const hotel = await Hotel.findOneAndUpdate({
            _id: req.params.hotelId,
            userId: req.userId,
        }, updatedHotel, {new:true});

        if(!hotel){
             res.status(404).json({message: "Hotel not found"}); 
             return;
        };


        const files = req.files as Express.Multer.File[];

        const updatedImageUrls = await uploadCloudinary(files);

        hotel.imageUrls = [...updatedImageUrls,...(updatedHotel.imageUrls || []) ];



        await hotel.save();
        res.status(201).json(hotel);

    } catch (error) {
        res.status(500).json({message: "Something went wrong"})
        
    }

})

async function uploadCloudinary(imageFiles: Express.Multer.File[]) {
    const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString('base64');
        let dataUri = `data:${image.mimetype};base64,${b64}`;
        const response = await cloudinary.v2.uploader.upload(dataUri);
        return response.url;
    });

    // 2. if upload was successful, add the URLS to the new hotel;
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
}

export default router;
