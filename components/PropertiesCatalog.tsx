'use client';

import { useState } from 'react';
import { uploadPropertyPhoto } from '@/lib/storage';
import { createPropertyAction } from '@/app/dashboard/properties/actions';

interface Agent {
  id: string;
  name: string;
}

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  status: 'DRAFT' | 'ACTIVE' | 'UNDER_CONTRACT' | 'SOLD';
  type: 'RESIDENTIAL' | 'VILLA' | 'COMMERCIAL' | 'PLOT';
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaSqFt?: number | null;
  address: string;
  city: string;
  agent?: Agent | null;
  createdAt: string;
}

interface PropertyImage {
  url: string;
  displayOrder: number;
  property: {
    id: string;
  };
}

export default function PropertiesCatalog({
  initialProperties,
  initialImages,
}: {
  initialProperties: Property[];
  initialImages: PropertyImage[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState<Property['status']>('ACTIVE');
  const [type, setType] = useState<Property['type']>('RESIDENTIAL');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [areaSqFt, setAreaSqFt] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Map images by property ID
  const getPropertyImages = (propertyId: string) => {
    return initialImages
      .filter((img) => img.property.id === propertyId)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      // Validate file type & size early
      const invalid = filesArray.some(
        (f) => !['image/jpeg', 'image/png'].includes(f.type) || f.size > 5 * 1024 * 1024
      );

      if (invalid) {
        setError('All photos must be JPEG or PNG and under 5MB.');
        return;
      }
      setError('');
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !price || !address || !city) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Mock generated ID for folder structuring
      const tempId = Math.random().toString(36).substring(2, 9);
      const uploadedUrls: { url: string; displayOrder: number }[] = [];

      // 1. Upload photos to Firebase Storage
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const url = await uploadPropertyPhoto(tempId, file, (progress) => {
          setUploadProgress((prev) => ({ ...prev, [file.name]: progress }));
        });
        uploadedUrls.push({ url, displayOrder: i });
      }

      // 2. Call Server Action to save records
      const res = await createPropertyAction(
        {
          title,
          description,
          price: parseFloat(price),
          status,
          type,
          bedrooms: bedrooms ? parseInt(bedrooms) : null,
          bathrooms: bathrooms ? parseInt(bathrooms) : null,
          areaSqFt: areaSqFt ? parseFloat(areaSqFt) : null,
          address,
          city,
        },
        uploadedUrls
      );

      if (res.success) {
        // Reset state
        setTitle('');
        setDescription('');
        setPrice('');
        setStatus('ACTIVE');
        setType('RESIDENTIAL');
        setBedrooms('');
        setBathrooms('');
        setAreaSqFt('');
        setAddress('');
        setCity('');
        setSelectedFiles([]);
        setUploadProgress({});
        setIsOpen(false);
      } else {
        setError(res.error || 'Failed to create listing.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error uploading files or saving properties.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 overflow-hidden h-full">
      {/* Top Header Row */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Property Catalog</h1>
          <p className="text-sm text-zinc-400 mt-1">View, manage, and intake listing entries</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm py-2.5 px-5 rounded-lg shadow-lg hover:shadow-indigo-500/20 transition cursor-pointer"
        >
          Add Property Listing
        </button>
      </div>

      {/* Grid List */}
      <div className="flex-1 overflow-y-auto pr-2 pb-8 scrollbar-thin">
        {initialProperties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/10">
            <span className="text-4xl">🏠</span>
            <p className="mt-4 text-zinc-400 font-semibold text-sm">No properties in catalog yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {initialProperties.map((prop) => {
              const propImages = getPropertyImages(prop.id);
              const mainImageUrl = propImages[0]?.url || '/placeholder.png'; // Placeholder if no images

              return (
                <div
                  key={prop.id}
                  className="bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden flex flex-col group transition shadow-lg hover:shadow-2xl"
                >
                  {/* Photo area */}
                  <div className="h-48 w-full relative bg-zinc-950 overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mainImageUrl}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-900/90 text-indigo-400 border border-zinc-800">
                        {prop.type}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-extrabold text-base text-zinc-100 line-clamp-1">
                          {prop.title}
                        </h3>
                      </div>
                      <p className="text-zinc-400 text-xs line-clamp-2">{prop.description}</p>
                      <p className="text-xs text-zinc-500">{prop.address}, {prop.city}</p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-zinc-800/60">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-black text-indigo-400">
                          ${prop.price.toLocaleString()}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-300">
                          {prop.status}
                        </span>
                      </div>

                      <div className="flex justify-between text-[11px] text-zinc-400 bg-zinc-950/40 p-2 rounded-lg border border-zinc-800/40">
                        <span>🛏️ {prop.bedrooms ?? 0} Beds</span>
                        <span>🛁 {prop.bathrooms ?? 0} Baths</span>
                        <span>📐 {prop.areaSqFt ?? 0} SqFt</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Intake Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-2xl relative my-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Create New Listing</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="bg-red-950/50 border border-red-800 text-red-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-zinc-300 uppercase">Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Sleek Beachfront Villa"
                    className="mt-1 block w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-700 transition"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-zinc-300 uppercase">Description *</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide property details..."
                    rows={3}
                    className="mt-1 block w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-700 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase">Price ($) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="1200000"
                    className="mt-1 block w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-700 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase">Status *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="mt-1 block w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-300 transition"
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="UNDER_CONTRACT">UNDER CONTRACT</option>
                    <option value="SOLD">SOLD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase">Type *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="mt-1 block w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-300 transition"
                  >
                    <option value="RESIDENTIAL">RESIDENTIAL</option>
                    <option value="VILLA">VILLA</option>
                    <option value="COMMERCIAL">COMMERCIAL</option>
                    <option value="PLOT">PLOT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase">Beds</label>
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    placeholder="3"
                    className="mt-1 block w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase">Baths</label>
                  <input
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    placeholder="2"
                    className="mt-1 block w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase">Area (SqFt)</label>
                  <input
                    type="number"
                    value={areaSqFt}
                    onChange={(e) => setAreaSqFt(e.target.value)}
                    placeholder="1800"
                    className="mt-1 block w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase">Address *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Ocean Drive"
                    className="mt-1 block w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Miami"
                    className="mt-1 block w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 transition"
                  />
                </div>
              </div>

              {/* Photos upload dropzone */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-zinc-300 uppercase">Upload Listing Photos</label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 bg-zinc-950/40 rounded-xl p-6 transition hover:border-zinc-700 relative">
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <span className="text-2xl">📸</span>
                  <p className="mt-2 text-xs text-zinc-400">Click or drag images (JPEG/PNG, under 5MB)</p>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-semibold text-zinc-300">Selected files ({selectedFiles.length}):</p>
                    {selectedFiles.map((file) => (
                      <div key={file.name} className="bg-zinc-950/60 border border-zinc-800/60 p-2.5 rounded-lg space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="truncate max-w-[80%] font-medium text-zinc-300">{file.name}</span>
                          <span className="text-indigo-400 font-bold">
                            {uploadProgress[file.name] !== undefined ? `${Math.round(uploadProgress[file.name])}%` : 'Pending'}
                          </span>
                        </div>
                        {uploadProgress[file.name] !== undefined && (
                          <div className="w-full bg-zinc-900 rounded-full h-1">
                            <div
                              className="bg-indigo-500 h-1 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress[file.name]}%` }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800/80">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-sm font-semibold rounded-lg text-zinc-300 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold rounded-lg text-white transition cursor-pointer"
                >
                  {isSubmitting ? 'Creating Listing...' : 'Create Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
