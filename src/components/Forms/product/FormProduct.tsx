'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useAuctionForm } from '@/app/context/AuctionFormContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createProduct, uploadImages } from '@/app/products/actions';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
}

interface FormErrors {
  name?: string;
  description?: string;
  initialPrice?: string;
  finalPrice?: string;
  categoryId?: string;
  images?: string;
}

interface FormProductProps {
  returnPath?: string;
}

export default function FormProduct({ returnPath = '/auctions/create' }: FormProductProps) {
  const { userData } = useAuth();
  const { setAuctionForm } = useAuctionForm();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    // Cargar categorías
    fetch('http://localhost:3001/api/category')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load categories');
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data.items)) {
          setCategories(
            data.items.map((cat: { id: string; name: string }) => ({
              id: cat.id,
              name: cat.name,
            }))
          );
        } else {
          // console.error("Unexpected categories format:", data);
          throw new Error('Invalid categories data format');
        }
        setIsLoadingCategories(false);
      })
      .catch(() => {
        // Error handling code (optional)
      });
  }, []);

  const validateForm = (formData: FormData): FormErrors => {
    const errors: FormErrors = {};
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const initialPrice = formData.get('initialPrice') as string;
    const finalPrice = formData.get('finalPrice') as string;
    const categoryId = formData.get('categoryId') as string;

    if (!name || name.length < 3) {
      errors.name = 'Name must be at least 3 characters long';
    }

    if (!description || description.length < 10) {
      errors.description = 'Description must be at least 10 characters long';
    }

    if (!initialPrice || Number(initialPrice) <= 0) {
      errors.initialPrice = 'Initial price must be greater than 0';
    }

    if (!finalPrice || Number(finalPrice) <= Number(initialPrice)) {
      errors.finalPrice = 'Final price must be greater than initial price';
    }

    if (!categoryId) {
      errors.categoryId = 'Category is required';
    }

    if (uploadedImages.length === 0) {
      errors.images = 'At least one image is required';
    }

    return errors;
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImages(true);
    setUploadProgress(0);
    setFormErrors({});

    try {
      const urls = await uploadImages(Array.from(files), userData?.token || '');
      setUploadedImages((prev) => [...prev, ...urls]);
    } catch (error: unknown) {
      // console.error("Error uploading images:", error);
      setFormErrors({ images: (error as Error).message });
    } finally {
      setIsUploadingImages(false);
      event.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);

      // Añadir las imágenes al FormData
      uploadedImages.forEach((url) => {
        formData.append('imgProduct', url);
      });

      // Create product
      formData.append('token', userData?.token || '');
      const result = await createProduct(formData);

      if (result && result.id) {
        // Guardar el nombre del producto en el contexto de subasta
        setAuctionForm({
          productId: result.id,
          productName: formData.get('name') as string,
        });
        // Limpiar el contexto después de crear el producto
        setTimeout(() => setAuctionForm({}), 0);
        // Redirigir de vuelta al formulario de subasta con el ID del producto
        const returnUrl = new URL(returnPath, window.location.origin);
        returnUrl.searchParams.set('productId', result.id);
        returnUrl.searchParams.set('productName', formData.get('name') as string);
        router.push(returnUrl.toString());
      } else {
        throw new Error('Failed to get product ID from response');
      }
    } catch (error) {
      // console.error("Error:", error);
      setError((error as Error).message || 'An error occurred while creating the product');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white shadow-sm rounded-lg p-6">
      {error && <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">{error}</div>}

      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Product Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {formErrors.description && (
            <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="initialPrice" className="block text-sm font-medium text-gray-700">
              Initial Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="initialPrice"
              name="initialPrice"
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {formErrors.initialPrice && (
              <p className="mt-1 text-sm text-red-600">{formErrors.initialPrice}</p>
            )}
          </div>

          <div>
            <label htmlFor="finalPrice" className="block text-sm font-medium text-gray-700">
              Final Price (Reserve Price) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="finalPrice"
              name="finalPrice"
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {formErrors.finalPrice && (
              <p className="mt-1 text-sm text-red-600">{formErrors.finalPrice}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            disabled={isLoadingCategories}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {formErrors.categoryId && (
            <p className="mt-1 text-sm text-red-600">{formErrors.categoryId}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload files</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    onChange={handleImageUpload}
                    accept="image/*"
                    disabled={isUploadingImages}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
            </div>
          </div>
          {isUploadingImages && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Uploading... {Math.round(uploadProgress)}%
              </p>
            </div>
          )}
          {formErrors.images && <p className="mt-1 text-sm text-red-600">{formErrors.images}</p>}
        </div>

        {uploadedImages.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {uploadedImages.map((url, index) => (
              <div key={index} className="relative">
                <Image
                  src={url}
                  alt={`Uploaded ${index + 1}`}
                  width={400}
                  height={128}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting || isUploadingImages}
            className="flex-1 bg-blue-700 text-white py-3 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Creating Product...' : 'Create Product'}
          </button>
        </div>
      </div>
    </form>
  );
}
