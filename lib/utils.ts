// Utilidades y funciones helper para el proyecto inmobiliario

import { Property, PropertyImage } from '@/types';

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Formatear precio en pesos colombianos
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price);
};

// Formatear direcciones
export const formatAddress = (address: string): string => {
  return address.trim().replace(/\s+/g, ' ');
};

// Debounce para filtros de búsqueda
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Validar URL de imagen
export const isValidImageUrl = (url: string): boolean => {
  try {
    new URL(url);
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  } catch {
    return false;
  }
};

// Truncar texto
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// ===== FUNCIONES PARA MANEJO DE PROPIEDADES E IMÁGENES =====

/**
 * Obtiene la imagen principal de una propiedad
 */
export const getMainImage = (property: Property): string => {
  if (!property.images || property.images.length === 0) {
    return '/images/placeholder-property.jpg';
  }
  
  // Buscar imagen marcada como principal
  const mainImage = property.images.find(img => img.isMain && img.enabled);
  if (mainImage) {
    return mainImage.file;
  }
  
  // Si no hay imagen principal marcada, usar la primera habilitada
  // (común en el backend real donde todas están marcadas como isMain: false)
  const firstEnabled = property.images.find(img => img.enabled);
  return firstEnabled?.file || '/images/placeholder-property.jpg';
};

/**
 * Obtiene todas las imágenes habilitadas de una propiedad
 */
export const getPropertyImages = (property: Property): PropertyImage[] => {
  if (!property.images) return [];
  
  return property.images
    .filter(img => img.enabled && isValidImageUrl(img.file))
    .sort((a, b) => {
      // Ordenar: imagen principal primero
      if (a.isMain && !b.isMain) return -1;
      if (!a.isMain && b.isMain) return 1;
      return 0;
    });
};

/**
 * Obtener URL de imagen con fallback
 */
export const getImageUrl = (imageFile: string | null | undefined): string => {
  if (imageFile && isValidImageUrl(imageFile)) {
    return imageFile;
  }
  return '/placeholder-property.svg';
};

/**
 * Normaliza una propiedad para asegurar compatibilidad con componentes
 */
export const normalizeProperty = (property: Property): Property => {
  return {
    ...property,
    // Asegurar que existe los campos necesarios
    images: property.images || [],
    owner: property.owner || {
      name: 'Propietario no especificado',
      photo: '',
      phone: '',
      email: ''
    },
    traces: property.traces || [],
    // Campos de compatibilidad (aliases)
    idProperty: property.id,
    codeInternal: property.codigoInternal,
    ownerName: property.owner?.name,
    ownerPhone: property.owner?.phone
  };
};