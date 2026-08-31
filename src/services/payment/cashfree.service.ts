import { cashfree } from "../../config/cashfree.config";
import { FRONTEND_URL } from "../../../src/config/environment.config";

interface CreateCashfreeOrderParams {
    orderId: string;
    amount: number;
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    returnPath: string;
}

export const createCashfreeOrder = async ({
    orderId,
    amount,
    customerId,
    customerName,
    customerEmail,
    customerPhone,
    returnPath,
}: CreateCashfreeOrderParams) => {
    const response = await cashfree.PGCreateOrder({
        order_id: orderId,
        order_amount: amount,
        order_currency: "INR",

        customer_details: {
            customer_id: customerId,
            customer_name: customerName,
            customer_email: customerEmail,
            customer_phone: customerPhone,
        },

        order_meta: {
            return_url: `${FRONTEND_URL}/payment/success?order_id=${orderId}&redirect=${encodeURIComponent(returnPath)}`,
        },
    });

    return response.data;
};
// export const getCashfreePaymentStatus = async (orderId: string) => {
//     const response = await cashfree.PGOrderFetchPayments(orderId);

//     return response.data;
// };