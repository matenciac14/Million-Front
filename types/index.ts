// Tipos TypeScript para el proyecto inmobiliario (según schema de DB)

// Entidad PropertyImage (tabla separada para imágenes)
export interface PropertyImage {
  idPropertyImage: string;
  idProperty: string;
  file: string;
  enabled: boolean;
  isMain?: boolean; // Para identificar imagen principal
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Entidad PropertyTrace (trazabilidad/historial de ventas)
export interface PropertyTrace {
  idPropertyTrace: string;
  idProperty: string;
  dateSale: string;
  name: string;
  value: number;
  tax: number;
  createdAt?: string;
  updatedAt?: string;
}

// Entidad Owner según schema de DB
export interface Owner {
  idOwner: string;
  name: string;
  address: string;
  photo?: string;
  birthday?: string;
  // Campos adicionales del backend si existen
  lastName?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Interfaz principal para las propiedades (según schema real de DB)
export interface Property {
  idProperty: string;
  name: string;
  address: string;
  price: number;
  codeInternal: string;
  year?: number;
  idOwner: string;
  createdAt?: string;
  updatedAt?: string;
  
  // Relaciones pobladas desde otras tablas
  images?: PropertyImage[];
  traces?: PropertyTrace[];
  owner?: Owner;
  
  // Campos calculados para compatibilidad con el frontend existente
  id?: string; // Alias para idProperty
  ownerName?: string;
  ownerPhone?: string;
  city?: string;
  state?: string;
  country?: string;
}

// DTO para crear/actualizar propiedades (según backend)
export interface PropertyCreateDto {
  name: string;
  address: string;
  price: number;
  idOwner: string;
  codeInternal: string;
  year?: number;
}

// DTO para actualizar propiedades
export interface PropertyUpdateDto {
  name?: string;
  address?: string;
  price?: number;
  year?: number;
}

// DTO para crear propietarios
export interface OwnerCreateDto {
  name: string;
  address: string;
  photo?: string;
  birthday?: string;
}

// DTO para actualizar propietarios
export interface OwnerUpdateDto {
  name?: string;
  address?: string;
  photo?: string;
  birthday?: string;
}

// DTO para crear PropertyImage
export interface PropertyImageCreateDto {
  idProperty: string;
  file: string;
  enabled: boolean;
  isMain?: boolean;
  description?: string;
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

// Rango de precios para filtros
export interface PriceRange {
  min: number;
  max: number;
  label: string;
}