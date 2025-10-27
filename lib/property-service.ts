import { Property, PropertyFilters, ApiResponse } from '@/types';
import { API_CONFIG, handleApiResponse } from './api-config';

// Servicio para manejar propiedades
export class PropertyService {
  /**
   * Obtiene todas las propiedades con filtros opcionales
   */
  static async getProperties(filters: PropertyFilters = {}): Promise<ApiResponse<Property[]>> {
    try {
      const queryParams = new URLSearchParams();
      
      // Agregar filtros a los query parameters
      if (filters.name) queryParams.append('name', filters.name);
      if (filters.address) queryParams.append('address', filters.address);
      if (filters.minPrice !== undefined) queryParams.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice !== undefined) queryParams.append('maxPrice', filters.maxPrice.toString());
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.limit) queryParams.append('limit', filters.limit.toString());

      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROPERTIES}?${queryParams.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: API_CONFIG.HEADERS,
      });

      return handleApiResponse<ApiResponse<Property[]>>(response);
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  }

  /**
   * Obtiene una propiedad por ID
   */
  static async getPropertyById(id: string): Promise<ApiResponse<Property>> {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROPERTY_BY_ID(id)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: API_CONFIG.HEADERS,
      });

      return handleApiResponse<ApiResponse<Property>>(response);
    } catch (error) {
      console.error(`Error fetching property ${id}:`, error);
      throw error;
    }
  }

  /**
   * Función helper para formatear precio
   */
  static formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  }

  /**
   * Función helper para validar URL de imagen
   */
  static isValidImageUrl(url: string): boolean {
    try {
      new URL(url);
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    } catch {
      return false;
    }
  }
}