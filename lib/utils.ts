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

// ===== NUEVAS FUNCIONES PARA MANEJO DE IMÁGENES =====

// Obtener imagen principal de una propiedad
export const getMainImage = (property: Property): string => {
  // Si tiene imágenes en la nueva estructura
  if (property.images && property.images.length > 0) {
    // Buscar imagen marcada como principal
    const mainImage = property.images.find(img => img.enabled && img.isMain);
    if (mainImage && isValidImageUrl(mainImage.file)) {
      return mainImage.file;
    }
    
    // Si no hay imagen principal, usar la primera habilitada
    const firstEnabled = property.images.find(img => img.enabled);
    if (firstEnabled && isValidImageUrl(firstEnabled.file)) {
      return firstEnabled.file;
    }
  }
  
  // Fallback al placeholder
  return '/placeholder-property.svg';
};

// Obtener todas las imágenes válidas de una propiedad
export const getPropertyImages = (property: Property): PropertyImage[] => {
  if (!property.images) return [];
  
  return property.images
    .filter(img => img.enabled && isValidImageUrl(img.file))
    .sort((a, b) => {
      // Ordenar: imagen principal primero, luego por fecha de creación
      if (a.isMain && !b.isMain) return -1;
      if (!a.isMain && b.isMain) return 1;
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });
};

// Obtener URL de imagen con fallback
export const getImageUrl = (imageFile: string | null | undefined): string => {
  if (imageFile && isValidImageUrl(imageFile)) {
    return imageFile;
  }
  return '/placeholder-property.svg';
};

// Normalizar propiedad para compatibilidad con componentes existentes
export const normalizeProperty = (property: Property): Property => {
  return {
    ...property,
    id: property.idProperty, // Alias para compatibilidad
    ownerName: property.owner?.name || property.ownerName,
    ownerPhone: property.owner?.phone || property.ownerPhone,
  };
};