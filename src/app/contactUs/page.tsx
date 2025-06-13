"use client";
"use client";
import { useState } from "react";

export default function ContactUs() {
  const [status, setStatus] = useState("");


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Sending...");
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    console.log(data);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("Message sent successfully!");
        form.reset();
      } else {
        setStatus("Error sending the message.");
      }
    } catch {
      setStatus("Error sending the message.");
    }
  };

  return (
    <main className="flex flex-col items-center px-4 py-8 min-h-screen bg-blue-50">
      <h1 className="text-3xl font-bold mb-4 text-blue-900">Contact Us</h1>
      <p className="text-gray-600 mb-8 text-center max-w-xl">
        Do you have any questions, suggestions, or need help? Fill out the form
        and we will contact you as soon as possible.
      </p>
      <form
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl space-y-4"
        onSubmit={handleSubmit}>
        <div>
          <label
            className="block text-blue-900 mb-1 font-medium"
            htmlFor="name">
            Name
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            id="name"
            name="name"
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <label
            className="block text-blue-900 mb-1 font-medium"
            htmlFor="email">
            Email
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="email"
            id="email"
            name="email"
            placeholder="your@email.com"
            required
          />
        </div>
        <div>
          <label
            className="block text-blue-900 mb-1 font-medium"
            htmlFor="message">
            Message
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            id="message"
            name="message"
            rows={4}
            placeholder="Write your message here..."
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded-xl font-semibold hover:bg-blue-800 transition">
          Send
        </button>
        {status && <p className="text-center mt-2">{status}</p>}
      </form>
    </main>
  );
}