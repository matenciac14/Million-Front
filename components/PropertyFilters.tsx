/** @format */

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { PropertyFilters, PriceRange } from "@/types";
import { Card } from "./Card";
import { Input } from "./Input";
import { Button } from "./Button";

interface PropertyFiltersComponentProps {
  onFiltersChange: (filters: PropertyFilters) => void;
  isLoading: boolean;
}

const PRICE_RANGES: PriceRange[] = [
  { min: 0, max: 100000000, label: "Hasta $100M" },
  { min: 100000000, max: 300000000, label: "$100M - $300M" },
  { min: 300000000, max: 500000000, label: "$300M - $500M" },
  { min: 500000000, max: 1000000000, label: "$500M - $1B" },
  { min: 1000000000, max: Infinity, label: "Más de $1B" },
];

export const PropertyFiltersComponent: React.FC<
  PropertyFiltersComponentProps
> = ({ onFiltersChange, isLoading }) => {
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Timeout ref para el debounce manual
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Función para manejar el debounce de filtros
  const triggerFiltersChange = useCallback((newFilters: PropertyFilters) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      onFiltersChange(newFilters);
    }, 500);
  }, [onFiltersChange]);

  // Effect para llamar la API cuando los filtros cambien
  useEffect(() => {
    triggerFiltersChange(filters);
    
    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [filters, triggerFiltersChange]);

  // Función helper para actualizar filtros sin causar re-renders innecesarios
  const updateFilters = useCallback((updates: Partial<PropertyFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  }, []);

  // Handlers para inputs de texto - ahora más simples
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateFilters({ name: value || undefined });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateFilters({ address: value || undefined });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateFilters({ city: value || undefined });
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateFilters({ state: value || undefined });
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateFilters({ country: value || undefined });
  };

  const handleOwnerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateFilters({ ownerName: value || undefined });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setFilters((prev) => ({
      ...prev,
      year: isNaN(value) ? undefined : value,
    }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortDirection] = e.target.value.split("-") as [
      PropertyFilters["sortBy"],
      PropertyFilters["sortDirection"]
    ];
    setFilters((prev) => ({
      ...prev,
      sortBy: sortBy || undefined,
      sortDirection: sortDirection || undefined,
    }));
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pageSize = parseInt(e.target.value);
    setFilters((prev) => ({
      ...prev,
      pageSize: isNaN(pageSize) ? undefined : pageSize,
      page: 1, // Reset page when changing page size
    }));
  };

  const handlePriceRangeChange = (range: PriceRange) => {
    setFilters((prev) => ({
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
            className={`w-5 h-5 transition-transform ${
              isCollapsed ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Filters Content */}
      <div className={`lg:block ${isCollapsed ? "hidden" : "block"}`}>
        <Card title="Filtros de Búsqueda" className="lg:block hidden">
          <div className="space-y-4">
            {/* Text Filters */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
                Búsqueda por Texto
              </h4>
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

              <Input
                label="Propietario"
                placeholder="Nombre del propietario..."
                onChange={handleOwnerNameChange}
                disabled={isLoading}
              />
            </div>

            {/* Location Filters */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
                Ubicación
              </h4>
              <Input
                label="Ciudad"
                placeholder="Ciudad..."
                onChange={handleCityChange}
                disabled={isLoading}
              />

              <Input
                label="Estado/Departamento"
                placeholder="Estado..."
                onChange={handleStateChange}
                disabled={isLoading}
              />

              <Input
                label="País"
                placeholder="País..."
                onChange={handleCountryChange}
                disabled={isLoading}
              />
            </div>

            {/* Numeric Filters */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
                Filtros Numéricos
              </h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Año de Construcción
                </label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="Ej: 2020"
                  onChange={handleYearChange}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                />
              </div>

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
            </div>

            {/* Sorting and Pagination */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
                Ordenamiento
              </h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ordenar por
                </label>
                <select
                  onChange={handleSortChange}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="">Sin ordenar</option>
                  <option value="name-asc">Nombre (A-Z)</option>
                  <option value="name-desc">Nombre (Z-A)</option>
                  <option value="price-asc">Precio (menor a mayor)</option>
                  <option value="price-desc">Precio (mayor a menor)</option>
                  <option value="address-asc">Dirección (A-Z)</option>
                  <option value="address-desc">Dirección (Z-A)</option>
                  <option value="createdAt-desc">Más recientes</option>
                  <option value="createdAt-asc">Más antiguos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resultados por página
                </label>
                <select
                  onChange={handlePageSizeChange}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="10">10 propiedades</option>
                  <option value="20">20 propiedades</option>
                  <option value="50">50 propiedades</option>
                  <option value="100">100 propiedades</option>
                </select>
              </div>
            </div>

            <Button
              variant="warning"
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
          <div className="grid grid-cols-1 gap-3">
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

            <Input
              label="Propietario"
              placeholder="Nombre del propietario..."
              onChange={handleOwnerNameChange}
              disabled={isLoading}
            />

            <div className="grid grid-cols-3 gap-2">
              <Input
                label="Ciudad"
                placeholder="Ciudad..."
                onChange={handleCityChange}
                disabled={isLoading}
              />

              <Input
                label="Estado"
                placeholder="Estado..."
                onChange={handleStateChange}
                disabled={isLoading}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Año
                </label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="2020"
                  onChange={handleYearChange}
                  disabled={isLoading}
                  className="w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ordenar por
                </label>
                <select
                  onChange={handleSortChange}
                  disabled={isLoading}
                  className="w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="">Sin ordenar</option>
                  <option value="price-desc">Precio ↓</option>
                  <option value="price-asc">Precio ↑</option>
                  <option value="name-asc">Nombre A-Z</option>
                  <option value="createdAt-desc">Más recientes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Por página
                </label>
                <select
                  onChange={handlePageSizeChange}
                  disabled={isLoading}
                  className="w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
          </div>

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
            variant="warning"
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
