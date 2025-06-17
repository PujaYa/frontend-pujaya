'use client';

import { useAuth } from "@/app/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { createAuction, updateAuction } from "@/app/auctions/actions";
import { useAuctionForm } from "@/app/context/AuctionFormContext";

interface FormErrors {
  name?: string;
  description?: string;
  endDate?: string;
  productId?: string;
}

interface AuctionFormInitialData {
  id?: string;
  name?: string;
  description?: string;
  endDate?: string;
  product?: {
    id?: string;
    name?: string;
  };
}

interface FormAuctionProps {
  initialData?: AuctionFormInitialData;
  mode?: 'edit' | 'create';
}

export default function FormAuction({ initialData, mode = 'create' }: FormAuctionProps) {
  const { userData } = useAuth();
  const { auctionForm, setAuctionForm, clearAuctionForm } = useAuctionForm();
  const router = useRouter();
  const searchParams = useSearchParams();

  const productIdFromUrl = searchParams.get('productId');
  const productId = productIdFromUrl || auctionForm.productId;
  const productNameFromUrl = searchParams.get('productName');
  const productName = productNameFromUrl || auctionForm.productName;

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [name, setName] = useState(initialData?.name || auctionForm.name || '');
  const [description, setDescription] = useState(
    initialData?.description || auctionForm.description || ''
  );
  const [endDate, setEndDate] = useState(
    initialData?.endDate ? initialData.endDate.slice(0, 16) : auctionForm.endDate || ''
  );

  const [minEndDate, setMinEndDate] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setEndDate(initialData.endDate ? initialData.endDate.slice(0, 16) : '');
    }
  }, [initialData]);

  useEffect(() => {
    const now = new Date();
    setMinEndDate(now.toISOString().slice(0, 16));
  }, []);

  const validateField = (field: string, value: string): string | undefined => {
    if (field === 'name') {
      if (!value || value.length < 3) return 'Name must be at least 3 characters long';
    }
    if (field === 'description') {
      if (!value || value.length < 10) return 'Description must be at least 10 characters long';
    }
    if (field === 'endDate') {
      if (!value) return 'End date is required';
      const selectedDate = new Date(value);
      const now = new Date();
      if (selectedDate <= now) return 'End date must be in the future';
    }
    return undefined;
  };

  const validateForm = (formData: FormData): FormErrors => {
    const errors: FormErrors = {};
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const endDate = formData.get('endDate') as string;

    if (!name || name.length < 3) errors.name = 'Name must be at least 3 characters long';
    if (!description || description.length < 10) errors.description = 'Description must be at least 10 characters long';
    if (!endDate) {
      errors.endDate = 'End date is required';
    } else {
      const selectedDate = new Date(endDate);
      const now = new Date();
      if (selectedDate <= now) errors.endDate = 'End date must be in the future';
    }
    if (!productId) errors.productId = 'Product is required';

    return errors;
  };

  const handleFieldChange = (field: string, value: string) => {
    setAuctionForm({ [field]: value });

    if (field === 'name') setName(value);
    if (field === 'description') setDescription(value);
    if (field === 'endDate') setEndDate(value);

    const errorMessage = validateField(field, value);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [field]: errorMessage,
    }));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuctionForm({ name, description, endDate, productId, productName });

    const formData = new FormData(event.currentTarget);
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);
      formData.append('productId', productId || '');
      formData.append('token', userData?.token || '');

      if (mode === 'edit' && initialData?.id) {
        await updateAuction(initialData.id, formData);
      } else {
        await createAuction(formData);
      }

      clearAuctionForm();
      router.push('/auctions');
    } catch (error) {
      setError((error as Error).message || 'An error occurred while saving the auction');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleAddProduct = () => {
    const currentUrl = window.location.pathname;
    router.push(`/products/create?returnTo=${encodeURIComponent(currentUrl)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white shadow-sm rounded-lg p-6">
      {error && <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">{error}</div>}

      <div className="space-y-6">
        {/* Auction Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Auction Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {formErrors.name && (
            <p className="mt-1 text-sm text-red-600 transition-opacity duration-200">{formErrors.name}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            value={description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {formErrors.description && (
            <p className="mt-1 text-sm text-red-600 transition-opacity duration-200">{formErrors.description}</p>
          )}
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            id="endDate"
            name="endDate"
            required
            min={minEndDate}
            value={endDate}
            onChange={(e) => handleFieldChange('endDate', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {formErrors.endDate && (
            <p className="mt-1 text-sm text-red-600 transition-opacity duration-200">{formErrors.endDate}</p>
          )}
        </div>

        {/* Product */}
        <div>
          <label htmlFor="product" className="block text-sm font-medium text-gray-700">
            Product <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                id="product"
                name="product"
                value={productName || ''}
                readOnly
                placeholder="No product selected"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={handleAddProduct}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors"
            >
              Add Product
            </button>
          </div>
          {formErrors.productId && (
            <p className="mt-1 text-sm text-red-600 transition-opacity duration-200">{formErrors.productId}</p>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting || !productId}
            className="flex-1 bg-blue-700 text-white py-3 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            {isSubmitting
              ? mode === 'edit'
                ? 'Saving...'
                : 'Creating Auction...'
              : mode === 'edit'
                ? 'Save Changes'
                : 'Create Auction'}
          </button>
        </div>

        {!productId && (
          <p className="text-sm text-gray-500 text-center">
            Please add a product before creating the auction
          </p>
        )}
      </div>
    </form>
  );
}
