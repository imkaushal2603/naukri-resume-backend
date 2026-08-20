import { cashfree } from "../../config/cashfree.config";
import { SERVER_URL } from "../../../src/config/environment.config";

interface CreateCashfreeOrderParams {
    orderId: string;
    amount: number;
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
}

export const createCashfreeOrder = async ({
    orderId,
    amount,
    customerId,
    customerName,
    customerEmail,
    customerPhone,
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
            return_url: `${SERVER_URL}/payment/success?order_id=${orderId}`,
        },
    });

    return response.data;
};
// export const getCashfreePaymentStatus = async (orderId: string) => {
//     const response = await cashfree.PGOrderFetchPayments(orderId);

//     return response.data;
// };