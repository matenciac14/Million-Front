// Configuración de la API
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5179',
  ENDPOINTS: {
    PROPERTIES: '/api/properties',
    PROPERTY_BY_ID: (id: string) => `/api/properties/${id}`,
  },
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;

// Función helper para manejar respuestas de la API
export const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
};