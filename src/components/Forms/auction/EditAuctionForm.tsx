"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateAuction } from "@/app/auctions/actions";
import { useAuth } from "@/app/context/AuthContext";

interface EditAuctionFormProps {
  initialData: unknown;
}

export default function EditAuctionForm({ initialData }: EditAuctionFormProps) {
  const router = useRouter();
  const { userData } = useAuth();
  // Type assertion for initialData
  const data = initialData as {
    id: string;
    name?: string;
    description?: string;
    endDate?: string;
  };
  const [name, setName] = useState(data?.name || "");
  const [description, setDescription] = useState(data?.description || "");
  const [endDate, setEndDate] = useState(data?.endDate?.slice(0, 16) || "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("endDate", endDate);
      formData.append("token", userData?.token || "");
      await updateAuction(data.id, formData);
      router.push(`/auctions/${data.id}`);
    } catch (err) {
      setError((err as Error).message || "Error updating auction");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white shadow rounded-lg p-6">
      {error && <div className="text-red-600">{error}</div>}
      <div>
        <label className="block font-medium">Auction name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-medium">End date</label>
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 disabled:opacity-50">
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
