"use client";

import { useEffect, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

const CheckoutForm = ({ amount }: { amount: number }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { userData, updateUserRole } = useAuth();

    useEffect(() => {
        const createPaymentIntent = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/create-intent`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, userId: userData?.user.id, plan: "monthly", currency: "usd" }),
            });
            const data = await res.json();
            setClientSecret(data.clientSecret);
        };

        createPaymentIntent();
    }, [amount]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements || !clientSecret) return;

        setLoading(true);

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)!,
            },
        });

        if (error) {
            toast.error(error.message || "Payment failed");
        } else if (paymentIntent?.status === "succeeded") {
            toast.success("Payment successful!");

            // Set del nuevo rol localmente
            updateUserRole("premium");

            // Revisar el back para hacer el cambio en el back.
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/create-subscription`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: userData?.user.id,
                    role: "premium",
                    plan: "monthly",
                    priceId: paymentIntent?.id,
                    customerId: paymentIntent?.client_secret,
                }),
            });

            router.push(`/payment-success?amount=${amount}`);
        }

        setLoading(false);
    };


    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow border"
        >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Complete your payment</h2>
            <p className="text-lg text-gray-600 text-center mb-6">Amount: <span className="font-bold text-blue-600">${amount} USD</span></p>

            <div className="mb-6 p-4 bg-gray-50 border rounded">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: "16px",
                                color: "#1a202c",
                                "::placeholder": { color: "#cbd5e0" },
                            },
                            invalid: { color: "#e53e3e" },
                        },
                    }}
                />
            </div>

            <button
                type="submit"
                disabled={!stripe || loading}
                className={`w-full py-3 rounded-md text-white font-semibold transition duration-300 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-400 hover:bg-yellow-500"
                    }`}
            >
                {loading ? "Processing..." : `Pay ${amount} USD`}
            </button>
        </form>
    );
};

export default CheckoutForm;
