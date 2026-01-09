
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import BookingForm from "../forms/ManageHotelForm/BookingForm/BookingForm";
import { useSearchContext } from "../contexts/searchContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingDetailSummary from "../components/BookingDetailSummary";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../contexts/Appcontext";

const Booking = () => {
    const { stripePromise } = useAppContext();
    const search = useSearchContext();
    const { hotelId } = useParams();
    
    const [numberOfNights, setNumberofNights] = useState<number>(0);
    // 1. Start with undefined so no method is pre-selected
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'mpesa' | undefined>(undefined);
    const [phoneNumber, setPhoneNumber] = useState<string>('');

    useEffect(() => {
        if (search.checkIn && search.checkOut) {
            const nights = Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) / (1000 * 60 * 60 * 24);
            setNumberofNights(Math.ceil(nights));
        }
    }, [search.checkIn, search.checkOut]);

    const { data: paymentIntentData, refetch: refetchPaymentIntent, isLoading: isIntentLoading } = useQuery(
        "createPaymentIntent", 
        () => apiClient.createPaymentIntent(
            hotelId as string, 
            numberOfNights.toString(),
            paymentMethod!,
            phoneNumber
        ), 
        { enabled: false }
    );

    const { data: hotel } = useQuery("fetchHotelById", () => apiClient.fetchHotelById(hotelId as string), { enabled: !!hotelId });
    const { data: currentUser } = useQuery("fetchCurrentUser", apiClient.fetchCurrentUser);

    // 2. Logic to handle switching and fetching
    const handlePaymentMethodChange = (method: 'stripe' | 'mpesa') => {
        setPaymentMethod(method);
        // If switching to stripe, we can auto-fetch the intent
        if (method === 'stripe' && hotelId && numberOfNights > 0) {
            setTimeout(() => refetchPaymentIntent(), 0); 
        }
    };

    const handleInitiateMpesa = () => {
        if (!phoneNumber) {
            alert('Please enter your M-Pesa phone number');
            return;
        }
        refetchPaymentIntent();
    };

    if (!hotel) return <></>;

    return (
        <div className="grid md:grid-cols-[1fr_2fr] gap-4">
            <BookingDetailSummary
                checkIn={search.checkIn} 
                checkOut={search.checkOut} 
                adultCount={search.adultCount} 
                childrenCount={search.childrenCount}
                numberOfNights={numberOfNights} 
                hotel={hotel}
            />
            
            <div className="space-y-4">
                {/* Payment Method Selection Section */}
                <div className="bg-white rounded-lg border border-slate-300 p-5">
                    <h3 className="text-xl font-semibold mb-4">Choose Payment Method</h3>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => handlePaymentMethodChange('stripe')}
                            className={`flex-1 p-3 border rounded-md transition ${paymentMethod === 'stripe' ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600' : 'border-slate-300'}`}
                        >
                            Stripe (Card)
                        </button>
                        <button 
                            onClick={() => handlePaymentMethodChange('mpesa')}
                            className={`flex-1 p-3 border rounded-md transition ${paymentMethod === 'mpesa' ? 'border-green-600 bg-green-50 ring-2 ring-green-600' : 'border-slate-300'}`}
                        >
                            M-Pesa
                        </button>
                    </div>

                    {paymentMethod === 'mpesa' && !paymentIntentData && (
                        <div className="mt-4 space-y-3 animate-in fade-in duration-300">
                            <label className="block text-sm font-bold">Phone Number</label>
                            <input
                                type="tel"
                                placeholder="254XXXXXXXXX"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="border rounded w-full py-2 px-3"
                            />
                            <button
                                onClick={handleInitiateMpesa}
                                disabled={isIntentLoading}
                                className="bg-green-600 text-white px-4 py-2 rounded font-bold w-full"
                            >
                                {isIntentLoading ? "Initiating..." : "Confirm Phone & Pay"}
                            </button>
                        </div>
                    )}
                </div>

                {/* Booking Form Rendering */}
                {currentUser && paymentIntentData && paymentMethod && (
                    <div className="animate-in slide-in-from-top-2 duration-500">
                        {paymentMethod === 'stripe' && paymentIntentData.clientSecret ? (
                            <Elements stripe={stripePromise} options={{ clientSecret: paymentIntentData.clientSecret }}>
                                <BookingForm 
                                    currentUser={currentUser} 
                                    paymentIntent={paymentIntentData} 
                                    paymentMethod={paymentMethod}
                                />
                            </Elements>
                        ) : (
                            <Elements stripe={stripePromise}  options={paymentMethod === 'stripe' ? { clientSecret: paymentIntentData.clientSecret } : undefined}>
                                <BookingForm 
                                currentUser={currentUser} 
                                paymentIntent={paymentIntentData} 
                                paymentMethod={paymentMethod}
                            />
                            </Elements>
                            
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Booking;









 // ====== Before Mpesa




/* import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import BookingForm from "../forms/ManageHotelForm/BookingForm/BookingForm";
import { useSearchContext } from "../contexts/searchContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingDetailSummary from "../components/BookingDetailSummary";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../contexts/Appcontext";


const Booking = ()=>{
    const { stripePromise } = useAppContext()

    const search = useSearchContext();

    const {hotelId} = useParams();

    const [numberOfNights, setNumberofNights] = useState<number>(0);


    useEffect(()=>{
        if(search.checkIn && search.checkOut){
            const nights = Math.abs(search.checkOut.getTime() - search.checkIn.getTime())/ (1000 * 60 * 60 * 24);

            setNumberofNights(Math.ceil(nights))
        }
    }, [search.checkIn, search.checkOut]);

    const {data: paymentIntentData} = useQuery("createPaymentIntent", ()=>apiClient.createPaymentIntent(
        hotelId as string, numberOfNights.toString()
    ), {
        enabled: !!hotelId && numberOfNights > 0
    });





    const {data: hotel} = useQuery("fetchHotelById", 
           ()=> apiClient.fetchHotelById(hotelId as string),
           {
            enabled: !!hotelId
           }
        );



    

    const {data:currentUser} = useQuery("fetchCurrentUser", 
        apiClient.fetchCurrentUser
    );

    if(!hotel){
        return <></>
    }

    

    return <div className="grid md:grid-cols-[1fr_2fr]">
        <BookingDetailSummary
        checkIn={search.checkIn} 
        checkOut={search.checkOut} 
        adultCount={search.adultCount} 
        childrenCount={search.childrenCount}
        numberOfNights={numberOfNights} 
         hotel={hotel}
        />
        { currentUser && paymentIntentData && (
            <Elements stripe={stripePromise} options={{
                clientSecret: paymentIntentData.clientSecret
            }}>
                <BookingForm currentUser={currentUser} paymentIntent={paymentIntentData} />
            </Elements>
            
        ) }
        
    </div>



}

export default Booking; */