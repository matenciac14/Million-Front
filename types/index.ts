// Tipos TypeScript para el proyecto inmobiliario

// Interfaz principal para las propiedades (según el schema de MongoDB del backend .NET)
export interface Property {
  id: string;
  name: string;
  address: string;
  price: number;
  idOwner: string;
  codigoInternal: string;
  year?: number;
  createdAt: string;
  updatedAt?: string;
  image?: string | null; // Viene de PropertyImage collection
  ownerName?: string; // Viene populado del Owner
  ownerPhone?: string; // Viene populado del Owner
  city?: string; // Viene de PropertyPlace collection
  state?: string; // Viene de PropertyPlace collection
  country?: string; // Viene de PropertyPlace collection
}

// DTO para crear/actualizar propiedades (según backend)
export interface PropertyCreateDto {
  name: string;
  address: string;
  price: number;
  idOwner: string;
  codigoInternal: string;
  year?: number;
  image?: string;
  city?: string;
  state?: string;
  country?: string;
}

// DTO para actualizar propiedades
export interface PropertyUpdateDto {
  name?: string;
  address?: string;
  price?: number;
  year?: number;
  image?: string;
  city?: string;
  state?: string;
  country?: string;
}

// DTO para crear propietarios
export interface OwnerCreateDto {
  name: string;
  lastName: string;
  phone: string;
  email: string;
  birthday?: string;
}

// DTO para actualizar propietarios
export interface OwnerUpdateDto {
  name?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  birthday?: string;
}

// Filtros para buscar propiedades (según documentación del backend)
export interface PropertyFilters {
  // Filtros de texto
  name?: string;
  address?: string;
  
  // Filtros numéricos
  minPrice?: number;
  maxPrice?: number;
  year?: number;
  
  // Filtros de ubicación
  city?: string;
  state?: string;
  country?: string;
  
  // Filtros de relaciones
  ownerName?: string;
  
  // Paginación y ordenamiento
  page?: number;
  pageSize?: number;
  sortBy?: 'name' | 'price' | 'address' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
}

// Respuesta paginada del backend (según documentación)
export interface PaginatedResponse<T> {
  properties?: T[]; // Para la respuesta de properties
  data?: T[]; // Para respuestas genéricas
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Respuesta de la API (mantener compatibilidad)
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

// Información del propietario (según el schema de MongoDB)
export interface Owner {
  id: string;
  name: string;
  lastName: string;
  fullName?: string; // Calculado en el backend
  phone: string;
  email: string;
  birthday?: string;
  createdAt: string;
  updatedAt?: string;
}

// Rango de precios para filtros
export interface PriceRange {
  min: number;
  max: number;
  label: string;
}