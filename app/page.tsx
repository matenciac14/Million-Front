'use client';

import { useState, useEffect, useCallback } from "react";
import { Property, PropertyFilters, LoadingState } from "@/types";
import { PropertyService } from "@/lib/property-service";
import { 
  PropertyList, 
  PropertyFiltersComponent, 
  PropertyDetailModal 
} from "@/components";

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    error: null
  });

  // Función para cargar propiedades
  const loadProperties = useCallback(async (filters: PropertyFilters = {}) => {
    setLoadingState({ isLoading: true, error: null });
    
    try {
      const response = await PropertyService.getProperties(filters);
      if (response.success) {
        setProperties(response.data);
      } else {
        setLoadingState({ 
          isLoading: false, 
          error: response.message || 'Error al cargar propiedades' 
        });
      }
    } catch (error) {
      console.error('Error loading properties:', error);
      setLoadingState({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      });
    } finally {
      setLoadingState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Cargar propiedades al montar el componente
  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  // Manejar cambios en filtros
  const handleFiltersChange = useCallback((filters: PropertyFilters) => {
    loadProperties(filters);
  }, [loadProperties]);

  // Manejar ver detalles de propiedad
  const handleViewDetails = useCallback((property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  }, []);

  // Cerrar modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Million Real Estate
            </h1>
            <p className="text-lg text-gray-600">
              Encuentra la propiedad perfecta para ti
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filtros */}
          <div className="lg:col-span-1">
            <PropertyFiltersComponent 
              onFiltersChange={handleFiltersChange}
              isLoading={loadingState.isLoading}
            />
          </div>

          {/* Main Content - Lista de Propiedades */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Propiedades Disponibles
              </h2>
              {!loadingState.isLoading && !loadingState.error && (
                <span className="text-sm text-gray-500">
                  {properties.length} {properties.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
                </span>
              )}
            </div>

            {/* Error State */}
            {loadingState.error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <div className="flex">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Error al cargar propiedades
                    </h3>
                    <p className="mt-1 text-sm text-red-700">
                      {loadingState.error}
                    </p>
                    <p className="mt-2 text-sm text-red-600">
                      Asegúrate de que el servidor backend esté ejecutándose en http://localhost:5179
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Property List */}
            <PropertyList
              properties={properties}
              isLoading={loadingState.isLoading}
              onViewDetails={handleViewDetails}
            />
          </div>
        </div>
      </main>

      {/* Property Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Million Real Estate - Sistema de Gestión de Propiedades
            </p>
            <p className="text-xs mt-2">
              Desarrollado con Next.js 16, TypeScript y Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
