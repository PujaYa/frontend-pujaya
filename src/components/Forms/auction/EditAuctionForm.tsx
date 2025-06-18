"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateAuction } from "@/app/auctions/actions";
import { useAuth } from "@/app/context/AuthContext";
import { IEditAuctionErrors, IEditAuctionFormProps, IEditAuctionFormValues } from "@/app/types/index";
import { validateEditAuctionForm } from "@/components/lib/validate";
import { toast } from "react-toastify";

export default function EditAuctionForm({ auction }: IEditAuctionFormProps) {
  const router = useRouter();
  const { userData } = useAuth();

  const initialValues = {
    name: auction.name,
    description: auction.description,
    endDate: auction.endDate.slice(0, 16),
  };

  const [form, setForm] = useState<IEditAuctionFormValues>(initialValues);
  const [errors, setErrors] = useState<IEditAuctionErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);
    setErrors(validateEditAuctionForm(updatedForm)); // validación en tiempo real
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validateEditAuctionForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
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
      toast.success("Auction updated successfully");
      router.push(`/auctions/${auction.id}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error updating auction";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
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
        {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
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
        {errors.description && <p className="text-red-600 text-sm">{errors.description}</p>}
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
        {errors.endDate && <p className="text-red-600 text-sm">{errors.endDate}</p>}
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
