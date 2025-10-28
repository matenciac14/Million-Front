// Tipos TypeScript para el proyecto inmobiliario (según schema de DB)

// Entidad PropertyImage (según respuesta real del backend)
export interface PropertyImage {
  idPropertyImage: string;
  file: string;
  enabled: boolean;
  isMain: boolean;
  description: string;
}

// Entidad PropertyTrace (según respuesta real del backend)
export interface PropertyTrace {
  dateSale: string;
  name: string;
  value: number;
  tax: number;
}

// Entidad Owner según respuesta real del backend
export interface Owner {
  name: string;
  photo: string;
  phone: string;
  email: string;
}

// Interfaz principal para las propiedades (según respuesta real del backend)
export interface Property {
  id: string;
  name: string;
  address: string;
  price: number;
  images: PropertyImage[];
  owner: Owner;
  traces: PropertyTrace[];
  codigoInternal: string;
  year: number;
  createdAt: string;
  city: string;
  state: string;
  country: string;
  
  // Campos calculados para compatibilidad con el frontend existente
  idProperty?: string; // Alias para id
  ownerName?: string;
  ownerPhone?: string;
  codeInternal?: string; // Alias para codigoInternal
}// DTO para crear/actualizar propiedades (según backend)
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