"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateAuction } from "@/app/auctions/actions";
import { useAuth } from "@/app/context/AuthContext";
import { IEditAuctionErrors, IEditAuctionFormProps, IEditAuctionFormValues } from "@/app/types/index";
import { validateEditAuctionForm } from "@/components/lib/validate";
import { toast } from "react-toastify";


export default function EditAuctionForm({ auction }: IEditAuctionFormProps) {
  const router = useRouter();
  const { userData } = useAuth();
  /*   // Type assertion for initialData
    const data = initialData as {
      
    };
    const [name, setName] = useState(data?.name || "");
    const [description, setDescription] = useState(data?.description || "");
    const [endDate, setEndDate] = useState(data?.endDate?.slice(0, 16) || ""); */
  const initialValues = {
    name: auction.name,
    description: auction.description,
    endDate: auction.endDate.slice(0, 16),
  };


  // Estado del formulario
  const [form, setForm] = useState<IEditAuctionFormValues>(initialValues);
  const [errors, setErrors] = useState<IEditAuctionErrors>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value /* Lo que hace es que busca dentro de Form por cada objeto por su nombre */
    });
  }

  useEffect(() => {
    setErrors(validateEditAuctionForm(form));
  }, [form]);

  // Envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Si hay errores, no continuamos con el envío
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the errors before submitting");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("endDate", form.endDate);
      formData.append("token", userData?.token || "");

      await updateAuction(auction.id, formData);
      router.push(`/auctions/${auction.id}`);
    } catch (err) {
      toast.error("Error updating auction");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
      {/* Muestra los errores */}
      {Object.values(errors).map((error, index) => (
        error && <div key={index} className="text-red-600">{error}</div>
      ))}

      <div>
        <label className="block font-medium">Auction name</label>
        <input
          type="text"
          value={form.name}
          name="name"
          onChange={handleInputChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-medium">Description</label>
        <textarea
          value={form.description}
          name="description"
          onChange={handleInputChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-medium">End date</label>
        <input
          type="datetime-local"
          value={form.endDate}
          name="endDate"
          onChange={handleInputChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}