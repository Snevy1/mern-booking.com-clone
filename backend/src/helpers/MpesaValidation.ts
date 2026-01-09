import { getMpesaAccessToken } from "./MpesaToken";
import axios from "axios";
// Helper function to check M-Pesa transaction status
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE;
const MPESA_PASSKEY = process.env.MPESA_PASSKEY;

 export async function checkMpesaTransactionStatus(checkoutRequestID: string) {
    const accessToken = await getMpesaAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');
    
    const response = await axios.post(
        'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
        {
            BusinessShortCode: MPESA_SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            CheckoutRequestID: checkoutRequestID
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    );
    
    return response.data;
}
