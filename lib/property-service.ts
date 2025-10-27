import { Property, PropertyFilters, PaginatedResponse, PropertyCreateDto, PropertyUpdateDto, ApiResponse } from '@/types';
import { API_CONFIG, handleApiResponse, checkApiHealth } from './api-config';

// Servicio para manejar propiedades
export class PropertyService {
  /**
   * Obtiene todas las propiedades con filtros opcionales
   */
  static async getProperties(filters: PropertyFilters = {}): Promise<PaginatedResponse<Property>> {
    try {
      // Verificar conectividad primero
      const isHealthy = await checkApiHealth();
      if (!isHealthy) {
        console.warn('Backend health check failed, proceeding anyway...');
      }

      const queryParams = new URLSearchParams();
      
      // Agregar filtros a los query parameters
      if (filters.name && filters.name.trim()) {
        queryParams.append('name', filters.name.trim());
      }
      if (filters.address && filters.address.trim()) {
        queryParams.append('address', filters.address.trim());
      }
      if (filters.minPrice !== undefined && filters.minPrice > 0) {
        queryParams.append('minPrice', filters.minPrice.toString());
      }
      if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
        queryParams.append('maxPrice', filters.maxPrice.toString());
      }
      if (filters.year !== undefined && filters.year > 0) {
        queryParams.append('year', filters.year.toString());
      }
      if (filters.city && filters.city.trim()) {
        queryParams.append('city', filters.city.trim());
      }
      if (filters.state && filters.state.trim()) {
        queryParams.append('state', filters.state.trim());
      }
      if (filters.country && filters.country.trim()) {
        queryParams.append('country', filters.country.trim());
      }
      if (filters.ownerName && filters.ownerName.trim()) {
        queryParams.append('ownerName', filters.ownerName.trim());
      }
      
      // Paginación y ordenamiento
      if (filters.page && filters.page > 0) {
        queryParams.append('page', filters.page.toString());
      }
      if (filters.pageSize && filters.pageSize > 0) {
        queryParams.append('pageSize', filters.pageSize.toString());
      }
      if (filters.sortBy) {
        queryParams.append('sortBy', filters.sortBy);
      }
      if (filters.sortDirection) {
        queryParams.append('sortDirection', filters.sortDirection);
      }

      const queryString = queryParams.toString();
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROPERTIES}${queryString ? `?${queryString}` : ''}`;
      
      console.log('Fetching properties from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: API_CONFIG.HEADERS,
      });

      const data = await handleApiResponse<PaginatedResponse<Property> | Property[]>(response);
      
      console.log('API Response received:', data);
      
      // Manejar diferentes formatos de respuesta del backend
      if (Array.isArray(data)) {
        // Si la respuesta es directamente un array de propiedades (sin filtros)
        console.log('Processing array response with', data.length, 'properties');
        data.forEach((prop, index) => {
          console.log(`Property ${index + 1} image:`, prop.image);
        });
        return {
          properties: data as Property[],
          totalCount: data.length,
          page: 1,
          pageSize: data.length,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false
        };
      } else if (data && 'properties' in data) {
        // Si la respuesta viene con paginación
        console.log('Processing paginated response:', data);
        return data as PaginatedResponse<Property>;
      } else {
        // Respuesta vacía o formato no reconocido
        console.log('Empty or unrecognized response format');
        return {
          properties: [],
          totalCount: 0,
          page: 1,
          pageSize: 10,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false
        };
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      
      // Proporcionar datos de prueba en caso de error para desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data for development');
        const mockData = this.getMockProperties();
        return {
          properties: mockData,
          totalCount: mockData.length,
          page: 1,
          pageSize: mockData.length,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false
        };
      }
      
      throw error;
    }
  }

  /**
   * Obtiene una propiedad por ID
   */
  static async getPropertyById(id: string): Promise<ApiResponse<Property>> {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROPERTY_BY_ID(id)}`;
      
      console.log('Fetching property by ID from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: API_CONFIG.HEADERS,
      });

      const data = await handleApiResponse<unknown>(response);
      
      // Adaptar la respuesta según el formato
      if (this.isProperty(data)) {
        return {
          data: data as Property,
          success: true,
          message: 'Propiedad obtenida exitosamente'
        };
      } else if (this.isApiResponse(data) && this.isProperty(data.data)) {
        return data as ApiResponse<Property>;
      } else {
        throw new Error('Propiedad no encontrada');
      }
    } catch (error) {
      console.error(`Error fetching property ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crea una nueva propiedad
   */
  static async createProperty(propertyData: PropertyCreateDto): Promise<ApiResponse<Property>> {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROPERTIES}`;
      
      console.log('Creating property at:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(propertyData),
      });

      const data = await handleApiResponse<Property>(response);
      
      return {
        data: data as Property,
        success: true,
        message: 'Propiedad creada exitosamente'
      };
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  }

  /**
   * Actualiza una propiedad existente
   */
  static async updateProperty(id: string, propertyData: PropertyUpdateDto): Promise<ApiResponse<Property>> {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROPERTY_BY_ID(id)}`;
      
      console.log('Updating property at:', url);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(propertyData),
      });

      const data = await handleApiResponse<Property>(response);
      
      return {
        data: data as Property,
        success: true,
        message: 'Propiedad actualizada exitosamente'
      };
    } catch (error) {
      console.error(`Error updating property ${id}:`, error);
      throw error;
    }
  }

  /**
   * Elimina una propiedad
   */
  static async deleteProperty(id: string): Promise<ApiResponse<boolean>> {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROPERTY_BY_ID(id)}`;
      
      console.log('Deleting property at:', url);
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: API_CONFIG.HEADERS,
      });

      await handleApiResponse<unknown>(response);
      
      return {
        data: true,
        success: true,
        message: 'Propiedad eliminada exitosamente'
      };
    } catch (error) {
      console.error(`Error deleting property ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene propiedades por propietario
   */
  static async getPropertiesByOwner(ownerId: string): Promise<PaginatedResponse<Property>> {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROPERTIES_BY_OWNER(ownerId)}`;
      
      console.log('Fetching properties by owner from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: API_CONFIG.HEADERS,
      });

      const data = await handleApiResponse<PaginatedResponse<Property> | Property[]>(response);
      
      if (Array.isArray(data)) {
        return {
          properties: data as Property[],
          totalCount: data.length,
          page: 1,
          pageSize: data.length,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false
        };
      } else {
        return data as PaginatedResponse<Property>;
      }
    } catch (error) {
      console.error(`Error fetching properties for owner ${ownerId}:`, error);
      throw error;
    }
  }

  /**
   * Datos de prueba para desarrollo
   */
  private static getMockProperties(): Property[] {
    return [
      {
        idProperty: '1',
        name: 'Casa Moderna en Zona Norte',
        address: 'Calle 123 #45-67, Bogotá',
        price: 450000000,
        codeInternal: 'PROP001',
        year: 2020,
        idOwner: 'owner-001',
        createdAt: new Date().toISOString(),
        // Múltiples imágenes como en la estructura real
        images: [
          {
            idPropertyImage: 'img1',
            idProperty: '1',
            file: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500',
            enabled: true,
            isMain: true,
            description: 'Vista frontal de la casa',
            createdAt: new Date().toISOString()
          },
          {
            idPropertyImage: 'img2',
            idProperty: '1',
            file: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500',
            enabled: true,
            isMain: false,
            description: 'Vista del jardín',
            createdAt: new Date().toISOString()
          },
          {
            idPropertyImage: 'img3',
            idProperty: '1',
            file: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=500',
            enabled: true,
            isMain: false,
            description: 'Interior sala principal',
            createdAt: new Date().toISOString()
          }
        ],
        // Información del propietario
        owner: {
          idOwner: 'owner-001',
          name: 'Juan Carlos',
          address: 'Calle 456 #78-90, Bogotá',
          phone: '+57 300 123 4567',
          email: 'juan.carlos@email.com'
        },
        // Historial de transacciones
        traces: [
          {
            idPropertyTrace: 'trace1',
            idProperty: '1',
            dateSale: '2020-05-15',
            name: 'Compra inicial',
            value: 420000000,
            tax: 42000000,
            createdAt: new Date().toISOString()
          }
        ],
        // Campos calculados para compatibilidad
        id: '1',
        ownerName: 'Juan Carlos',
        ownerPhone: '+57 300 123 4567',
        city: 'Bogotá',
        state: 'Cundinamarca',
        country: 'Colombia'
      },
      {
        idProperty: '2',
        name: 'Apartamento Ejecutivo Centro',
        address: 'Carrera 7 #15-20, Bogotá',
        price: 280000000,
        codeInternal: 'PROP002',
        year: 2018,
        idOwner: 'owner-002',
        createdAt: new Date().toISOString(),
        images: [
          {
            idPropertyImage: 'img4',
            idProperty: '2',
            file: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500',
            enabled: true,
            isMain: true,
            description: 'Vista del apartamento',
            createdAt: new Date().toISOString()
          },
          {
            idPropertyImage: 'img5',
            idProperty: '2',
            file: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500',
            enabled: true,
            isMain: false,
            description: 'Cocina moderna',
            createdAt: new Date().toISOString()
          }
        ],
        owner: {
          idOwner: 'owner-002',
          name: 'María García',
          address: 'Carrera 15 #80-25, Bogotá',
          phone: '+57 311 234 5678',
          email: 'maria.garcia@email.com'
        },
        traces: [
          {
            idPropertyTrace: 'trace2',
            idProperty: '2',
            dateSale: '2018-03-20',
            name: 'Compra inicial',
            value: 250000000,
            tax: 25000000,
            createdAt: new Date().toISOString()
          },
          {
            idPropertyTrace: 'trace3',
            idProperty: '2',
            dateSale: '2024-01-10',
            name: 'Revalorización',
            value: 280000000,
            tax: 0,
            createdAt: new Date().toISOString()
          }
        ],
        id: '2',
        ownerName: 'María García',
        ownerPhone: '+57 311 234 5678',
        city: 'Bogotá',
        state: 'Cundinamarca',
        country: 'Colombia'
      },
      {
        idProperty: '3',
        name: 'Penthouse con Vista',
        address: 'Avenida 19 #100-50, Bogotá',
        price: 750000000,
        codeInternal: 'PROP003',
        year: 2022,
        idOwner: 'owner-003',
        createdAt: new Date().toISOString(),
        images: [
          {
            idPropertyImage: 'img6',
            idProperty: '3',
            file: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500',
            enabled: true,
            isMain: true,
            description: 'Vista panorámica',
            createdAt: new Date().toISOString()
          },
          {
            idPropertyImage: 'img7',
            idProperty: '3',
            file: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500',
            enabled: true,
            isMain: false,
            description: 'Terraza con vista',
            createdAt: new Date().toISOString()
          },
          {
            idPropertyImage: 'img8',
            idProperty: '3',
            file: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
            enabled: true,
            isMain: false,
            description: 'Sala de estar',
            createdAt: new Date().toISOString()
          },
          {
            idPropertyImage: 'img9',
            idProperty: '3',
            file: 'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=500',
            enabled: true,
            isMain: false,
            description: 'Dormitorio principal',
            createdAt: new Date().toISOString()
          }
        ],
        owner: {
          idOwner: 'owner-003',
          name: 'Carlos Rodríguez',
          address: 'Avenida 19 #95-30, Bogotá',
          phone: '+57 320 345 6789',
          email: 'carlos.rodriguez@email.com'
        },
        traces: [
          {
            idPropertyTrace: 'trace4',
            idProperty: '3',
            dateSale: '2022-08-15',
            name: 'Compra inicial',
            value: 720000000,
            tax: 72000000,
            createdAt: new Date().toISOString()
          }
        ],
        id: '3',
        ownerName: 'Carlos Rodríguez',
        ownerPhone: '+57 320 345 6789',
        city: 'Bogotá',
        state: 'Cundinamarca',
        country: 'Colombia'
      }
    ];
  }

  /**
   * Type guards para verificar tipos
   */
  private static isProperty(obj: unknown): obj is Property {
    return typeof obj === 'object' && obj !== null && 
           ('idProperty' in obj || 'id' in obj) && 
           'name' in obj && 'address' in obj && 'price' in obj;
  }

  private static isApiResponse(obj: unknown): obj is ApiResponse<unknown> {
    return typeof obj === 'object' && obj !== null && 'data' in obj && 'success' in obj;
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