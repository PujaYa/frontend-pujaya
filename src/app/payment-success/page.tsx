import Link from "next/link"

export default function PaymentSuccess({
    searchParams: { amount },
}: {
    searchParams: { amount: string }
}) {
    return (
        <>
            <main className="mt-20 max-w-lg mx-auto bg-white p-6 rounded-lg shadow border">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Paid succesfully</h2>
                <p className="text-lg text-gray-600 text-center mb-6">Thank You!: <span className="font-bold text-blue-600">${amount} USD paid succesfully</span></p>
                <Link
                    href="/"
                    className="align-content-center px-6 py-3 bg-yellow-400 text-blue-900 font-semibold rounded-xl shadow-md hover:bg-yellow-500 transition"
                >
                    Return to Home
                </Link>
            </main>
        </>
    )
}