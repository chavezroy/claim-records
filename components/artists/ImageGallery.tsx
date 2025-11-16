'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageItem {
  id: string;
  media_id: string;
  title?: string | null;
  description?: string | null;
  file_path?: string;
  file_url?: string;
}

interface ImageGalleryProps {
  images: ImageItem[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => {
          const imageUrl = image.file_url || image.file_path;
          if (!imageUrl) return null;

          return (
            <div
              key={image.id}
              className="relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-200"
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={imageUrl}
                alt={image.title || 'Gallery image'}
                fill
                className="object-cover hover:scale-105 transition-transform"
              />
            </div>
          );
        })}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-5xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
              <Image
                src={selectedImage.file_url || selectedImage.file_path || ''}
                alt={selectedImage.title || 'Gallery image'}
                fill
                className="object-contain"
              />
            </div>
            {(selectedImage.title || selectedImage.description) && (
              <div className="mt-4 text-white text-center">
                {selectedImage.title && <h3 className="text-xl font-bold mb-2">{selectedImage.title}</h3>}
                {selectedImage.description && <p className="text-gray-300">{selectedImage.description}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

