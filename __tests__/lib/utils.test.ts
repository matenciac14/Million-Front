import {
  formatDate,
  formatPrice,
  formatAddress,
  debounce,
  isValidImageUrl,
  truncateText,
  getMainImage,
  getPropertyImages,
  getImageUrl,
  normalizeProperty,
  cn,
  generateId,
} from '@/lib/utils'
import { Property, PropertyImage } from '@/types'

describe('Utils Functions', () => {
  describe('formatDate', () => {
    it('should format date correctly in Spanish', () => {
      const date = new Date('2023-12-25')
      const formatted = formatDate(date)
      expect(formatted).toContain('diciembre')
      expect(formatted).toContain('2023')
    })

    it('should handle invalid dates', () => {
      const invalidDate = new Date('invalid')
      // Las fechas inválidas en el formateo pueden lanzar errores, así que verificamos que maneje graciosamente
      expect(() => {
        try {
          formatDate(invalidDate)
        } catch (error) {
          // Está bien que falle con fechas inválidas
          throw error
        }
      }).toThrow()
    })
  })

  describe('formatPrice', () => {
    it('should format Colombian peso prices correctly', () => {
      expect(formatPrice(450000000)).toBe('$ 450.000.000')
      expect(formatPrice(1500000)).toBe('$ 1.500.000')
      expect(formatPrice(0)).toBe('$ 0')
    })

    it('should handle negative prices', () => {
      expect(formatPrice(-100000)).toBe('-$ 100.000')
    })
  })

  describe('formatAddress', () => {
    it('should trim and normalize spaces in addresses', () => {
      expect(formatAddress('  Carrera 7  #15-20   ')).toBe('Carrera 7 #15-20')
      expect(formatAddress('Avenida   19    #100-50')).toBe('Avenida 19 #100-50')
    })

    it('should handle empty addresses', () => {
      expect(formatAddress('')).toBe('')
      expect(formatAddress('   ')).toBe('')
    })
  })

  describe('debounce', () => {
    jest.useFakeTimers()

    it('should debounce function calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('arg1')
      debouncedFn('arg2')
      debouncedFn('arg3')

      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(100)

      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenLastCalledWith('arg3')
    })

    afterEach(() => {
      jest.clearAllTimers()
    })
  })

  describe('isValidImageUrl', () => {
    it('should validate image URLs correctly', () => {
      expect(isValidImageUrl('https://example.com/image.jpg')).toBe(true)
      expect(isValidImageUrl('https://example.com/image.png')).toBe(true)
      expect(isValidImageUrl('https://example.com/image.gif')).toBe(true)
      expect(isValidImageUrl('https://example.com/image.webp')).toBe(true)
      expect(isValidImageUrl('https://example.com/image.svg')).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(isValidImageUrl('not-a-url')).toBe(false)
      expect(isValidImageUrl('https://example.com/document.pdf')).toBe(false)
      expect(isValidImageUrl('')).toBe(false)
    })
  })

  describe('truncateText', () => {
    it('should truncate text when longer than maxLength', () => {
      const longText = 'This is a very long text that should be truncated'
      expect(truncateText(longText, 20)).toBe('This is a very long...')
    })

    it('should not truncate text when shorter than maxLength', () => {
      const shortText = 'Short text'
      expect(truncateText(shortText, 20)).toBe('Short text')
    })

    it('should handle exact length', () => {
      const text = 'Exactly twenty chars'
      expect(truncateText(text, 20)).toBe('Exactly twenty chars')
    })
  })

  describe('cn (className utility)', () => {
    it('should combine valid class names', () => {
      expect(cn('class1', 'class2', 'class3')).toBe('class1 class2 class3')
    })

    it('should filter out falsy values', () => {
      expect(cn('class1', null, 'class2', undefined, false, 'class3')).toBe('class1 class2 class3')
    })

    it('should handle empty input', () => {
      expect(cn()).toBe('')
      expect(cn(null, undefined, false)).toBe('')
    })
  })

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      
      expect(id1).toBeTruthy()
      expect(id2).toBeTruthy()
      expect(id1).not.toBe(id2)
      expect(typeof id1).toBe('string')
      expect(typeof id2).toBe('string')
    })
  })

  describe('Property Image Utils', () => {
    const mockProperty: Property = {
      id: '1',
      name: 'Test Property',
      address: 'Test Address',
      price: 100000000,
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
          isMain: false,
          description: 'Image 1'
        },
        {
          idPropertyImage: 'img2',
          file: 'https://example.com/image2.jpg',
          enabled: true,
          isMain: true,
          description: 'Main Image'
        },
        {
          idPropertyImage: 'img3',
          file: 'https://example.com/image3.jpg',
          enabled: false,
          isMain: false,
          description: 'Disabled Image'
        }
      ],
      owner: {
        name: 'Test Owner',
        photo: '',
        phone: '+57 300 123 4567',
        email: 'test@example.com'
      },
      traces: []
    }

    describe('getMainImage', () => {
      it('should return main image when available', () => {
        const mainImageUrl = getMainImage(mockProperty)
        expect(mainImageUrl).toBe('https://example.com/image2.jpg')
      })

      it('should return first enabled image when no main image', () => {
        const propertyWithoutMain = {
          ...mockProperty,
          images: mockProperty.images.map(img => ({ ...img, isMain: false }))
        }
        const imageUrl = getMainImage(propertyWithoutMain)
        expect(imageUrl).toBe('https://example.com/image1.jpg')
      })

      it('should return placeholder when no images', () => {
        const propertyWithoutImages = { ...mockProperty, images: [] }
        const imageUrl = getMainImage(propertyWithoutImages)
        expect(imageUrl).toBe('/images/placeholder-property.jpg')
      })
    })

    describe('getPropertyImages', () => {
      it('should return only enabled images', () => {
        const images = getPropertyImages(mockProperty)
        expect(images).toHaveLength(2)
        expect(images.every(img => img.enabled)).toBe(true)
      })

      it('should return empty array when no images', () => {
        const propertyWithoutImages = { ...mockProperty, images: [] }
        const images = getPropertyImages(propertyWithoutImages)
        expect(images).toEqual([])
      })
    })

    describe('getImageUrl', () => {
      it('should return valid image URL', () => {
        const url = getImageUrl('https://example.com/image.jpg')
        expect(url).toBe('https://example.com/image.jpg')
      })

      it('should return placeholder for invalid URLs', () => {
        expect(getImageUrl(null)).toBe('/placeholder-property.svg')
        expect(getImageUrl(undefined)).toBe('/placeholder-property.svg')
        expect(getImageUrl('invalid-url')).toBe('/placeholder-property.svg')
      })
    })

    describe('normalizeProperty', () => {
      it('should normalize property with all fields', () => {
        const normalized = normalizeProperty(mockProperty)
        
        expect(normalized.id).toBe('1')
        expect(normalized.images).toEqual(mockProperty.images)
        expect(normalized.owner).toEqual(mockProperty.owner)
        expect(normalized.traces).toEqual(mockProperty.traces)
        expect(normalized.idProperty).toBe('1')
        expect(normalized.codeInternal).toBe('TEST001')
        expect(normalized.ownerName).toBe('Test Owner')
        expect(normalized.ownerPhone).toBe('+57 300 123 4567')
      })

      it('should handle property with missing optional fields', () => {
        const minimalProperty: Property = {
          id: '1',
          name: 'Test Property',
          address: 'Test Address',
          price: 100000000,
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
            phone: '',
            email: ''
          },
          traces: []
        }

        const normalized = normalizeProperty(minimalProperty)
        
        expect(normalized.images).toEqual([])
        expect(normalized.owner.name).toBe('Test Owner')
        expect(normalized.traces).toEqual([])
      })
    })
  })
})