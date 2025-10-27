// Tipos TypeScript para el proyecto inmobiliario

// Interfaz principal para las propiedades
export interface Property {
  id: string;
  idOwner: string;
  name: string;
  address: string;
  price: number;
  image: string;
}

// DTO para crear/actualizar propiedades
export interface PropertyDto {
  idOwner: string;
  name: string;
  address: string;
  price: number;
  image: string;
}

// Filtros para buscar propiedades
export interface PropertyFilters {
  name?: string;
  address?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

// Respuesta de la API
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
}

// Estados de carga y error
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Información del propietario
export interface Owner {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

// Rango de precios para filtros
export interface PriceRange {
  min: number;
  max: number;
  label: string;
}