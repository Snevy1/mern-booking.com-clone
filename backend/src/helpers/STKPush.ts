import axios from "axios";
import "dotenv/config";
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE;
const MPESA_PASSKEY = process.env.MPESA_PASSKEY;
const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL;

import { getMpesaAccessToken } from "./MpesaToken";

 export async function initiateMpesaSTKPush(phoneNumber: string, amount: number, accountReference: string) {
    const accessToken = await getMpesaAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');
    
    const response = await axios.post(
        'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        {
            BusinessShortCode: MPESA_SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount:  1 ,//amount,
            PartyA: phoneNumber,
            PartyB: MPESA_SHORTCODE,
            PhoneNumber: phoneNumber,
            CallBackURL: MPESA_CALLBACK_URL,
            AccountReference: accountReference,
            TransactionDesc: 'Hotel Booking Payment'
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    );
    
    return response.data;
}