'use client';

import React from 'react';
import Image from 'next/image';
import { Property } from '@/types';
import { Card } from './Card';
import { Button } from './Button';
import { formatPrice, truncateText, getMainImage, normalizeProperty } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  onViewDetails: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onViewDetails }) => {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoading, setImageLoading] = React.useState(true);
  
  // Normalizar propiedad para compatibilidad
  const normalizedProperty = normalizeProperty(property);
  
  console.log('PropertyCard rendering for:', normalizedProperty.name);
  console.log('Property images:', normalizedProperty.images);
  
  // Obtener imagen principal usando la nueva lógica
  const imageUrl = !imageError ? getMainImage(normalizedProperty) : '/placeholder-property.svg';
    
  console.log('Final imageUrl for', normalizedProperty.name, ':', imageUrl);

  const handleImageError = () => {
    console.log('Image failed to load:', imageUrl);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', imageUrl);
    setImageLoading(false);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full bg-gray-200">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        <Image
          src={imageUrl}
          alt={normalizedProperty.name}
          fill
          className="object-cover"
          onError={handleImageError}
          onLoad={handleImageLoad}
          priority={false}
        />
        <div className="absolute top-2 right-2">
          <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">
            {formatPrice(normalizedProperty.price)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {truncateText(normalizedProperty.name, 30)}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {truncateText(normalizedProperty.address, 40)}
        </p>

        <div className="text-xs text-gray-500 mb-4 space-y-1">
          <div>Código: {normalizedProperty.codeInternal}</div>
          {normalizedProperty.ownerName && (
            <div>Propietario: {normalizedProperty.ownerName}</div>
          )}
          {normalizedProperty.year && (
            <div>Año: {normalizedProperty.year}</div>
          )}
          {normalizedProperty.images && normalizedProperty.images.length > 1 && (
            <div className="flex items-center text-blue-600">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              {normalizedProperty.images.filter(img => img.enabled).length} imágenes
            </div>
          )}
        </div>

        <Button 
          onClick={() => onViewDetails(normalizedProperty)}
          className="w-full"
          size="sm"
        >
          Ver Detalles
        </Button>
      </div>
    </Card>
  );
};