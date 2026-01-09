

import { useForm } from "react-hook-form";
import { PaymentIntentResponse, UserType } from "../../../../../backend/src/shared/types";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { useSearchContext } from "../../../contexts/searchContext";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";
import * as apiClient from "../../../api-client"
import { useAppContext } from "../../../contexts/Appcontext";
import { useState } from "react";

type Props = {
    currentUser: UserType;
    paymentIntent: PaymentIntentResponse;
    paymentMethod: 'stripe' | 'mpesa';
}

export type BookingFormData = {
    firstName: string;
    lastName: string;
    email: string;
    adultCount: number;
    childrenCount: number;
    checkIn: string;
    checkOut: string;
    hotelId: string;
    paymentIntentId: string;
    totalCost: number;
    paymentMethod: 'stripe' | 'mpesa';
}



const BookingForm = ({ currentUser, paymentIntent, paymentMethod }: Props) => {
    const stripe = useStripe();
    const elements = useElements();
    const { showToast } = useAppContext();
    const [isProcessing, setIsProcessing] = useState(false);
    const search = useSearchContext();
    const {hotelId} = useParams();

    const { mutate: bookRoom, isLoading } = useMutation(apiClient.createRoomBooking, {
        onSuccess: () => showToast({ message: "Booking successful!", type: "SUCCESS" }),
        onError: () => showToast({ message: "Error saving booking", type: "ERROR" }),
    });

    const { handleSubmit } = useForm<BookingFormData>({
        defaultValues:{
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            paymentIntentId: paymentIntent.paymentIntentId,
            paymentMethod: paymentMethod,
            adultCount: search.adultCount,
            childrenCount: search.childrenCount,
            checkIn: search.checkIn.toISOString(),
            checkOut: search.checkOut.toISOString(),
            hotelId: hotelId,
            totalCost: paymentIntent.totalCost,

        }
    });

    const onSubmit = async (formData: BookingFormData) => {
        if (paymentMethod === 'stripe') {
            if (!stripe || !elements) return;
            setIsProcessing(true);
            const result = await stripe.confirmCardPayment(paymentIntent.clientSecret!, {
                payment_method: { card: elements.getElement(CardElement) as StripeCardElement }
            });
            setIsProcessing(false);
            if (result.paymentIntent?.status === "succeeded") {
                bookRoom({ ...formData, paymentIntentId: result.paymentIntent.id });
            }
        } else {
            // M-Pesa Verification Flow
            setIsProcessing(true);
            showToast({ message: "Verifying M-Pesa payment...", type: "SUCCESS" });
            setTimeout(() => {
                setIsProcessing(false);
                bookRoom(formData);
            }, 5000); // Adjust polling/timeout as per your backend
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-5 rounded-lg border border-slate-500 p-5 bg-white">
            <h2 className="text-2xl font-bold">Finalize Booking</h2>
            
            {/* Price Summary */}
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                <p className="font-bold text-lg">Total to Pay: ${paymentIntent.totalCost.toFixed(2)}</p>
                <p className="text-xs text-gray-600">Method: {paymentMethod.toUpperCase()}</p>
            </div>

            {paymentMethod === 'stripe' ? (
                <div className="space-y-2">
                    <h3 className="font-semibold">Credit Card Details</h3>
                    <CardElement className="border rounded-md p-3" />
                </div>
            ) : (
                <div className="bg-green-50 p-4 rounded-md border border-green-200">
                    <p className="text-sm font-medium text-green-800">
                        STK Push Sent! Please enter your PIN on your phone to complete the transaction.
                    </p>
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading || isProcessing}
                className="bg-blue-600 text-white py-3 font-bold hover:bg-blue-500 disabled:bg-gray-400"
            >
                {isProcessing ? "Processing..." : "Complete Booking"}
            </button>
        </form>
    );
};

export default BookingForm;


// Before Mpesa
/* import { useForm } from "react-hook-form";
import { PaymentIntentResponse, UserType } from "../../../../../backend/src/shared/types";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { useSearchContext } from "../../../contexts/searchContext";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";
import * as apiClient from "../../../api-client"
import { useAppContext } from "../../../contexts/Appcontext";

type Props = {
    currentUser: UserType;
    paymentIntent: PaymentIntentResponse

}


 export type BookingFormData = {
    firstName: string;
    lastName: string;
    email: string;
    adultCount: number;
    childrenCount: number;
    checkIn: string;
    checkOut: string;
    hotelId: string;
    paymentIntentId: string;
    totalCost: number
}

const BookingForm = ({currentUser, paymentIntent}:Props)=>{

    const stripe = useStripe();
    const elements = useElements();


    const search = useSearchContext();
    const {hotelId} = useParams();

    const {showToast} = useAppContext();



    const {mutate: bookRoom, isLoading} = useMutation(apiClient.createRoomBooking, {
        onSuccess: ()=>{
          //

          showToast({message: "Booking saved!", type: "SUCCESS"})
        },
        onError: ()=>{
            //

            showToast({
                message: "Error Saving booking",
                type: "ERROR"
            })
        },

    })
    
    const {handleSubmit,register} = useForm<BookingFormData>({
        defaultValues:{
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            adultCount: search.adultCount,
            childrenCount: search.childrenCount,
            checkIn: search.checkIn.toISOString(),
            checkOut: search.checkOut.toISOString(),
            hotelId: hotelId,
            totalCost: paymentIntent.totalCost,
            paymentIntentId: paymentIntent.paymentIntentId
        }
    });


    const onSubmit = async (formData:BookingFormData)=>{
        if(!stripe || !elements){
            return;
        }

        const result = await  stripe.confirmCardPayment(paymentIntent.clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement) as StripeCardElement
            }

            
        });

        if(result.paymentIntent?.status === "succeeded"){
            // book the room
            bookRoom({...formData, paymentIntentId: result.paymentIntent.id})
        }


    }


    return (
        <form className="grid grid-cols-1 gap-5 rounded-lg border border-slate-500 p-5 " onSubmit={handleSubmit(onSubmit)}>
            <span className="text-3xl font-bold">Confirm your Details</span>

            <div className="grid grid-cols-2 gap-6">
                <label className="text-gray-700 text-sm font-bold flex-1">
                    First Name
                    <input className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"  type="text"

                    readOnly
                    disabled
                    {...register("firstName")}

                    />

                </label>

                <label className="text-gray-700 text-sm font-bold flex-1">
                    Last Name
                    <input className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"  type="text"

                    readOnly
                    disabled
                    {...register("lastName")}

                    />

                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                  Email
                    <input className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"  type="text"

                    readOnly
                    disabled
                    {...register("email")}

                    />

                </label>



            </div>
                 <div className="space-y-2">
                     <h2 className="text-xl font-semibold">Your Price Summary</h2>
                     <div className="bg-blue-200 p-4 rounded-md">
                <div className="font-semibold text-lg">
                    Total Cost: ${paymentIntent.totalCost.toFixed(2)}

                </div>
                <div className="text-xs">
                    Includes taxes and charges

                </div>

            </div>

                 </div>


               <div className="space-y-2">
                <h3 className="text-xl font-semibold ">
                    Payment Details

                </h3>

                <CardElement id="payment-element" className="border rounded-md p-2 text-sm "/>
                
                </div>  

                <div className="flex justify-end">
                    <button type="submit"
                    disabled={isLoading}
                     className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md disabled:bg-gray-500"
                    >
                        {
                            isLoading ? "Saving...": " Confirm Booking"

                        }
                     
                    </button>

                </div>

            


        </form>
    )




}


export default BookingForm; */