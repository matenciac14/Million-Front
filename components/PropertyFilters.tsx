'use client';

import React, { useState, useEffect } from 'react';
import { PropertyFilters, PriceRange } from '@/types';
import { Card } from './Card';
import { Input } from './Input';
import { Button } from './Button';

interface PropertyFiltersComponentProps {
  onFiltersChange: (filters: PropertyFilters) => void;
  isLoading: boolean;
}

const PRICE_RANGES: PriceRange[] = [
  { min: 0, max: 100000000, label: 'Hasta $100M' },
  { min: 100000000, max: 300000000, label: '$100M - $300M' },
  { min: 300000000, max: 500000000, label: '$300M - $500M' },
  { min: 500000000, max: 1000000000, label: '$500M - $1B' },
  { min: 1000000000, max: Infinity, label: 'Más de $1B' },
];

export const PropertyFiltersComponent: React.FC<PropertyFiltersComponentProps> = ({
  onFiltersChange,
  isLoading
}) => {
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Effect to trigger API call when filters change
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  // Simple debounced input handlers
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTimeout(() => {
      setFilters(prev => ({ ...prev, name: value || undefined }));
    }, 500);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTimeout(() => {
      setFilters(prev => ({ ...prev, address: value || undefined }));
    }, 500);
  };

  const handlePriceRangeChange = (range: PriceRange) => {
    setFilters(prev => ({
      ...prev,
      minPrice: range.min === 0 ? undefined : range.min,
      maxPrice: range.max === Infinity ? undefined : range.max,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <div className="lg:sticky lg:top-4">
      {/* Mobile Toggle Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-between p-3 bg-white border border-gray-300 rounded-md text-left"
        >
          <span className="font-medium text-gray-900">Filtros de Búsqueda</span>
          <svg 
            className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Filters Content */}
      <div className={`lg:block ${isCollapsed ? 'hidden' : 'block'}`}>
        <Card title="Filtros de Búsqueda" className="lg:block hidden">
          <div className="space-y-4">
            <Input
              label="Buscar por nombre"
              placeholder="Nombre de la propiedad..."
              onChange={handleNameChange}
              disabled={isLoading}
            />

            <Input
              label="Buscar por dirección"
              placeholder="Dirección de la propiedad..."
              onChange={handleAddressChange}
              disabled={isLoading}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rango de Precio
              </label>
              <div className="space-y-2">
                {PRICE_RANGES.map((range, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handlePriceRangeChange(range)}
                    disabled={isLoading}
                    className="w-full text-left px-3 py-2 text-sm border rounded-md transition-colors border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full"
              disabled={isLoading}
            >
              Limpiar Filtros
            </Button>
          </div>
        </Card>

        {/* Mobile Filters */}
        <div className="lg:hidden bg-white border border-gray-300 rounded-md p-4 space-y-4">
          <Input
            label="Buscar por nombre"
            placeholder="Nombre de la propiedad..."
            onChange={handleNameChange}
            disabled={isLoading}
          />

          <Input
            label="Buscar por dirección"
            placeholder="Dirección de la propiedad..."
            onChange={handleAddressChange}
            disabled={isLoading}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rango de Precio
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRICE_RANGES.map((range, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handlePriceRangeChange(range)}
                  disabled={isLoading}
                  className="text-left px-3 py-2 text-xs border rounded-md transition-colors border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            onClick={clearFilters}
            className="w-full"
            disabled={isLoading}
            size="sm"
          >
            Limpiar Filtros
          </Button>
        </div>
      </div>
    </div>
  );
};