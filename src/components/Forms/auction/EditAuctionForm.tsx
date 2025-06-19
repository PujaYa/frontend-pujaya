'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateAuction } from '@/app/auctions/actions';
import { useAuth } from '@/app/context/AuthContext';
import MapLibreMap from '@/components/MapLibreMap';
import { IEditAuctionFormValues, IEditAuctionErrors } from '@/app/types/index';
import { validateEditAuctionForm } from '@/components/lib/validate';
import { toast } from 'react-toastify';

interface EditAuctionFormProps {
  initialData: {
    id: string;
    name?: string;
    description?: string;
    endDate?: string;
    product?: {
      id?: string;
      name?: string;
    };
    latitude?: number;
    longitude?: number;
  };
}

export default function EditAuctionForm({ initialData }: EditAuctionFormProps) {
  const router = useRouter();
  const { userData } = useAuth();
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [endDate, setEndDate] = useState(initialData?.endDate?.slice(0, 16) || '');
  const [productId] = useState(initialData?.product?.id || '');
  const [productName] = useState(initialData?.product?.name || '');
  const [latitude, setLatitude] = useState<number | null>(initialData?.latitude || null);
  const [longitude, setLongitude] = useState<number | null>(initialData?.longitude || null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [minEndDate, setMinEndDate] = useState('');

  const [form, setForm] = useState<IEditAuctionFormValues>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    endDate: initialData?.endDate?.slice(0, 16) || '',
  });
  const [errors, setErrors] = useState<IEditAuctionErrors>({});

  useEffect(() => {
    const now = new Date();
    setMinEndDate(now.toISOString().slice(0, 16));
  }, []);

  const handleMapClick = (lngLat: { lng: number; lat: number }) => {
    setLatitude(lngLat.lat);
    setLongitude(lngLat.lng);
  };

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
      formData.append('name', name);
      formData.append('description', description);
      formData.append('endDate', endDate);
      formData.append('token', userData?.token || '');
      formData.append('productId', productId || '');
      if (latitude !== null && longitude !== null) {
        formData.append('latitude', String(latitude));
        formData.append('longitude', String(longitude));
      }
      await updateAuction(initialData.id, formData);
      router.push(`/auctions/${initialData.id}`);
    } catch (err) {
      setError((err as Error).message || 'Error updating auction');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
      {error && <div className="text-red-600">{error}</div>}
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
          value={endDate}
          min={minEndDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        {errors.endDate && <p className="text-red-600 text-sm">{errors.endDate}</p>}
      </div>
      <div>
        <label className="block font-medium">Product</label>
        <input
          type="text"
          value={productName}
          readOnly
          placeholder="No product selected"
          className="w-full border rounded px-3 py-2 bg-gray-50"
        />
      </div>
      <div>
        <label className="block font-medium">Location</label>
        <div className="h-64 w-full rounded-md overflow-hidden mb-2">
          <MapLibreMap
            lng={longitude || -58.3816}
            lat={latitude || -34.6037}
            zoom={10}
            style={{ width: '100%', height: '100%' }}
            radius={1}
            onClick={handleMapClick}
            onUserLocation={(coords) => {
              setLatitude(coords.lat);
              setLongitude(coords.lng);
            }}
          />
        </div>
        {latitude && longitude && (
          <p className="text-xs text-gray-500">
            Lat: {latitude}, Lng: {longitude}
          </p>
        )}
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
          {isSubmitting ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}
