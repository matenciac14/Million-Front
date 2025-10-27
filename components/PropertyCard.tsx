'use client';

import React from 'react';
import Image from 'next/image';
import { Property } from '@/types';
import { Card } from './Card';
import { Button } from './Button';
import { formatPrice, truncateText, isValidImageUrl } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  onViewDetails: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onViewDetails }) => {
  const imageUrl = (property.image && isValidImageUrl(property.image)) 
    ? property.image 
    : '/placeholder-property.svg';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={property.name}
          fill
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-property.svg';
          }}
        />
        <div className="absolute top-2 right-2">
          <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">
            {formatPrice(property.price)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {truncateText(property.name, 30)}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {truncateText(property.address, 40)}
        </p>

        <div className="text-xs text-gray-500 mb-4">
          <div>ID Propietario: {property.idOwner}</div>
          <div>Propietario: {property.ownerName}</div>
          <div>Año: {property.year}</div>
        </div>

        <Button 
          onClick={() => onViewDetails(property)}
          className="w-full"
          size="sm"
        >
          Ver Detalles
        </Button>
      </div>
    </Card>
  );
};