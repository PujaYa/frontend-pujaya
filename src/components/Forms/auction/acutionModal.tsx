import { useState, useEffect } from 'react';

interface AuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (auctionData: AuctionFormData) => void;
  auction?: {
    id: string;
    name: string;
    initialPrice: number;
    currentPrice: number;
    endDate: string;
    category: string;
    description: string;
    imageUrl: string;
    isActive: boolean;
  };
}

interface AuctionFormData {
  name: string;
  initialPrice: number;
  endDate: string;
  category: string;
  description: string;
  image?: File;
}

export default function AuctionModal({ isOpen, onClose, onSubmit, auction }: AuctionModalProps) {
  const [formData, setFormData] = useState<AuctionFormData>({
    name: '',
    initialPrice: 0,
    endDate: '',
    category: '',
    description: '',
  });
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (auction) {
      setFormData({
        name: auction.name,
        initialPrice: auction.initialPrice,
        endDate: auction.endDate,
        category: auction.category,
        description: auction.description,
      });
      setImagePreview(auction.imageUrl);
    }
  }, [auction]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'initialPrice' ? Number(value) : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{auction ? 'Editar' : 'Crear'} Subasta</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre del Artículo</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Precio Inicial</label>
              <input
                type="number"
                name="initialPrice"
                value={formData.initialPrice}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha de Finalización</label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Categoría</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar categoría</option>
                <option value="art">Arte</option>
                <option value="collectibles">Coleccionables</option>
                <option value="electronics">Electrónicos</option>
                <option value="fashion">Moda</option>
                <option value="jewelry">Joyería</option>
                <option value="sports">Deportes</option>
                <option value="other">Otros</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Imagen del Artículo</label>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="mt-1 block w-full"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 h-20 w-20 object-cover rounded"
                />
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {auction ? 'Actualizar' : 'Crear'} Subasta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 