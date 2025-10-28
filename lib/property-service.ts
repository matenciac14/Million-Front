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
          if (prop.images && prop.images.length > 0) {
            console.log(`Property ${index + 1} images:`, prop.images.map(img => img.file));
          } else {
            console.log(`Property ${index + 1} has no images`);
          }
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
   * Datos de prueba para desarrollo (estructura exacta del backend real)
   */
  private static getMockProperties(): Property[] {
    return [
      {
        id: "69000ba3ea2a25a07b083ad2",
        name: "Casa Colonial Histórica",
        address: "Calle 10 #3-45, La Candelaria",
        price: 280000000,
        images: [
          {
            idPropertyImage: "69000c2aea2a25a07b083adc",
            file: "https://res.cloudinary.com/miguedev/image/upload/v1761610794/real-estate/properties/cocina-casa1_sn6zdd.jpg",
            enabled: true,
            isMain: false, // Backend real marca todas como false
            description: ""
          },
          {
            idPropertyImage: "69000c32ea2a25a07b083add",
            file: "https://res.cloudinary.com/miguedev/image/upload/v1761610801/real-estate/properties/habitacion-casa1_gohzzg.jpg",
            enabled: true,
            isMain: false,
            description: ""
          }
        ],
        owner: {
          name: "María Isabel González Herrera",
          photo: "",
          phone: "+57 315 777 8899",
          email: "maria.gonzalez@email.com"
        },
        traces: [
          {
            dateSale: "2023-07-30",
            name: "Restauración y valorización",
            value: 280000000,
            tax: 28000000
          },
          {
            dateSale: "2019-11-25",
            name: "Compra casa histórica",
            value: 250000000,
            tax: 25000000
          }
        ],
        codigoInternal: "CH005",
        year: 1920,
        createdAt: "2025-10-28T00:17:39.356Z",
        city: "",
        state: "",
        country: ""
      },
      {
        id: "69000b9cea2a25a07b083ad1",
        name: "Penthouse Vista Panorámica",
        address: "Carrera 11 #93-07, Chapinero Alto",
        price: 890000000,
        images: [
          {
            idPropertyImage: "69000c13ea2a25a07b083ada",
            file: "https://res.cloudinary.com/miguedev/image/upload/v1761610770/real-estate/properties/estudio-casa2_o2reea.jpg",
            enabled: true,
            isMain: false,
            description: ""
          },
          {
            idPropertyImage: "69000c20ea2a25a07b083adb",
            file: "https://res.cloudinary.com/miguedev/image/upload/v1761610783/real-estate/properties/test-house_ckkcce.jpg",
            enabled: true,
            isMain: false,
            description: ""
          }
        ],
        owner: {
          name: "Carlos Eduardo Martínez Rodríguez",
          photo: "",
          phone: "+57 300 555 1234",
          email: "carlos.martinez@email.com"
        },
        traces: [
          {
            dateSale: "2024-10-01",
            name: "Avalúo actualizado mercado",
            value: 890000000,
            tax: 89000000
          },
          {
            dateSale: "2023-04-18",
            name: "Adquisición penthouse premium",
            value: 850000000,
            tax: 85000000
          }
        ],
        codigoInternal: "PH004",
        year: 2023,
        createdAt: "2025-10-28T00:17:32.941Z",
        city: "",
        state: "",
        country: ""
      },
      {
        id: "69000b88ea2a25a07b083ace",
        name: "Casa Moderna Zona Norte",
        address: "Carrera 15 #85-42, Zona Norte",
        price: 450000000,
        images: [
          {
            idPropertyImage: "69000bbeea2a25a07b083ad3",
            file: "https://res.cloudinary.com/miguedev/image/upload/v1761610685/real-estate/properties/fachada-casa1_yxbrgo.jpg",
            enabled: true,
            isMain: false,
            description: ""
          },
          {
            idPropertyImage: "69000bccea2a25a07b083ad4",
            file: "https://res.cloudinary.com/miguedev/image/upload/v1761610700/real-estate/properties/interior-casa1_kgm3kr.jpg",
            enabled: true,
            isMain: false,
            description: ""
          },
          {
            idPropertyImage: "69000bd3ea2a25a07b083ad5",
            file: "https://res.cloudinary.com/miguedev/image/upload/v1761610706/real-estate/properties/jardin-casa1_oh8gcn.jpg",
            enabled: true,
            isMain: false,
            description: ""
          }
        ],
        owner: {
          name: "Carlos Eduardo Martínez Rodríguez",
          photo: "",
          phone: "+57 300 555 1234",
          email: "carlos.martinez@email.com"
        },
        traces: [
          {
            dateSale: "2024-02-10",
            name: "Valorización actualizada",
            value: 450000000,
            tax: 45000000
          },
          {
            dateSale: "2021-03-15",
            name: "Compra inicial",
            value: 400000000,
            tax: 40000000
          }
        ],
        codigoInternal: "ZN001",
        year: 2021,
        createdAt: "2025-10-28T00:17:12.062Z",
        city: "",
        state: "",
        country: ""
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