'use client';

import React from 'react';
import Image from 'next/image';
import { Property } from '@/types';
import { Card } from './Card';
import { Button } from './Button';
import { formatPrice, isValidImageUrl } from '@/lib/utils';

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isOpen,
  onClose
}) => {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoading, setImageLoading] = React.useState(true);

  // Reset image state when property changes
  React.useEffect(() => {
    if (property) {
      setImageError(false);
      setImageLoading(true);
    }
  }, [property?.id]);

  if (!isOpen || !property) return null;

  const imageUrl = (property.image && isValidImageUrl(property.image) && !imageError) 
    ? property.image 
    : '/placeholder-property.svg';

  const handleImageError = () => {
    console.log('Modal image failed to load:', property.image);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative w-full max-w-2xl">
          <Card className="max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                Detalles de la Propiedad
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="p-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Image */}
              <div className="relative h-64 md:h-80 w-full mb-6 rounded-lg overflow-hidden bg-gray-200">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                )}
                <Image
                  src={imageUrl}
                  alt={property.name}
                  fill
                  className="object-cover"
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
              </div>

              {/* Property Details */}
              <div className="space-y-6">
                {/* Title and Price */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {property.name}
                  </h3>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPrice(property.price)}
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Dirección</p>
                    <p className="text-gray-900">{property.address}</p>
                  </div>
                </div>

                {/* Owner Information */}
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-700">ID del Propietario</p>
                    <p className="text-gray-900 font-mono text-sm">{property.idOwner}</p>
                  </div>
                </div>

                {/* Property ID */}
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-700">ID de la Propiedad</p>
                    <p className="text-gray-900 font-mono text-sm">{property.id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
              <Button variant="outline" onClick={onClose}>
                Cerrar
              </Button>
              <Button variant="primary">
                Contactar
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};