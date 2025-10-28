import { PropertyService } from '@/lib/property-service'
import { PropertyFilters, Property } from '@/types'

// Mock del módulo API config
jest.mock('@/lib/api-config', () => ({
  API_CONFIG: {
    BASE_URL: 'https://localhost:7007',
    ENDPOINTS: {
      PROPERTIES: '/api/Property',
      PROPERTY_BY_ID: (id: string) => `/api/Property/${id}`,
    },
    HEADERS: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  },
  handleApiResponse: jest.fn(),
  checkApiHealth: jest.fn(),
}))

describe('PropertyService', () => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getProperties', () => {
    const mockApiResponse = {
      properties: [
        {
          id: '1',
          name: 'Test Property 1',
          address: 'Test Address 1',
          price: 300000000,
          codigoInternal: 'TEST001',
          year: 2023,
          createdAt: '2023-01-01T00:00:00.000Z',
          city: 'Test City',
          state: 'Test State',
          country: 'Test Country',
          images: [],
          owner: {
            name: 'Test Owner',
            photo: '',
            phone: '+57 300 123 4567',
            email: 'test@example.com'
          },
          traces: []
        },
        {
          id: '2',
          name: 'Test Property 2',
          address: 'Test Address 2',
          price: 450000000,
          codigoInternal: 'TEST002',
          year: 2023,
          createdAt: '2023-01-01T00:00:00.000Z',
          city: 'Test City',
          state: 'Test State',
          country: 'Test Country',
          images: [],
          owner: {
            name: 'Test Owner 2',
            photo: '',
            phone: '+57 300 123 4568',
            email: 'test2@example.com'
          },
          traces: []
        }
      ],
      totalCount: 2,
      page: 1,
      pageSize: 10,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false
    }

    it('should fetch properties successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      } as Response)

      const result = await PropertyService.getProperties()

      expect(result.properties).toHaveLength(2)
      expect(result.totalCount).toBe(2)
      expect(result.page).toBe(1)
      expect(result.pageSize).toBe(10)
    })

    it('should handle API errors and return mock data in development', async () => {
      // Simular error de red
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      // Mock para process.env.NODE_ENV = 'development'
      const originalEnv = process.env.NODE_ENV
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        configurable: true
      })

      const result = await PropertyService.getProperties()

      // Debería devolver datos mock en caso de error durante desarrollo
      expect(result.properties?.length || 0).toBeGreaterThan(0)
      expect(result.totalCount).toBeGreaterThan(0)

      // Restaurar env original
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalEnv,
        configurable: true
      })
    })

    it('should build correct query parameters from filters', async () => {
      const filters: PropertyFilters = {
        minPrice: 200000000,
        maxPrice: 500000000,
        city: 'Bogotá',
        page: 2,
        pageSize: 5
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      } as Response)

      await PropertyService.getProperties(filters)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('minPrice=200000000'),
        expect.any(Object)
      )
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('maxPrice=500000000'),
        expect.any(Object)
      )
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('city=Bogot%C3%A1'),
        expect.any(Object)
      )
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('page=2'),
        expect.any(Object)
      )
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('pageSize=5'),
        expect.any(Object)
      )
    })

    it('should handle different response formats', async () => {
      // Simular respuesta como array directo (sin paginación)
      const directArrayResponse = [
        {
          id: '1',
          name: 'Test Property',
          address: 'Test Address',
          price: 300000000,
          codigoInternal: 'TEST001',
          year: 2023,
          createdAt: '2023-01-01T00:00:00.000Z',
          city: 'Test City',
          state: 'Test State',
          country: 'Test Country',
          images: [],
          owner: {
            name: 'Test Owner',
            photo: '',
            phone: '+57 300 123 4567',
            email: 'test@example.com'
          },
          traces: []
        }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => directArrayResponse,
      } as Response)

      const result = await PropertyService.getProperties()

      expect(result.properties).toHaveLength(1)
      expect(result.totalCount).toBe(1)
    })
  })

  describe('getPropertyById', () => {
    const mockProperty: Property = {
      id: '1',
      name: 'Test Property',
      address: 'Test Address',
      price: 300000000,
      codigoInternal: 'TEST001',
      year: 2023,
      createdAt: '2023-01-01T00:00:00.000Z',
      city: 'Test City',
      state: 'Test State',
      country: 'Test Country',
      images: [
        {
          idPropertyImage: 'img1',
          file: 'https://example.com/image1.jpg',
          enabled: true,
          isMain: true,
          description: 'Main image'
        }
      ],
      owner: {
        name: 'Test Owner',
        photo: '',
        phone: '+57 300 123 4567',
        email: 'test@example.com'
      },
      traces: [
        {
          dateSale: '2023-01-15',
          name: 'Compra inicial',
          value: 300000000,
          tax: 30000000
        }
      ]
    }

    it('should fetch property by ID successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockProperty }),
      } as Response)

      const result = await PropertyService.getPropertyById('1')

      expect(result.success).toBe(true)
      expect(result.data?.id).toBe('1')
      expect(result.data?.name).toBe('Test Property')
    })

    it('should handle property not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response)

      const result = await PropertyService.getPropertyById('999')

      expect(result.success).toBe(false)
      expect(result.message).toContain('404')
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await PropertyService.getPropertyById('1')

      expect(result.success).toBe(false)
      expect(result.message).toBe('Network error')
    })
  })

  describe('Mock Data Generation', () => {
    it('should generate valid mock properties', async () => {
      // Forzar error para activar datos mock
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const originalEnv = process.env.NODE_ENV
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        configurable: true
      })

      const result = await PropertyService.getProperties()

      expect(result.properties?.length || 0).toBeGreaterThan(0)
      
      // Verificar estructura de propiedades mock
      result.properties?.forEach(property => {
        expect(property).toHaveProperty('id')
        expect(property).toHaveProperty('name')
        expect(property).toHaveProperty('address')
        expect(property).toHaveProperty('price')
        expect(property).toHaveProperty('codigoInternal')
        expect(property).toHaveProperty('images')
        expect(property).toHaveProperty('owner')
        expect(property).toHaveProperty('traces')
        
        // Verificar que las imágenes tienen la estructura correcta
        if (property.images.length > 0) {
          property.images.forEach(image => {
            expect(image).toHaveProperty('idPropertyImage')
            expect(image).toHaveProperty('file')
            expect(image).toHaveProperty('enabled')
            expect(image).toHaveProperty('isMain')
            expect(image.file).toMatch(/^https?:\/\/.+/)
          })
        }

        // Verificar estructura del propietario
        expect(property.owner).toHaveProperty('name')
        expect(property.owner).toHaveProperty('phone')
        expect(property.owner).toHaveProperty('email')

        // Verificar estructura de traces
        if (property.traces.length > 0) {
          property.traces.forEach(trace => {
            expect(trace).toHaveProperty('dateSale')
            expect(trace).toHaveProperty('name')
            expect(trace).toHaveProperty('value')
            expect(trace).toHaveProperty('tax')
          })
        }
      })

      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalEnv,
        configurable: true
      })
    })
  })
})