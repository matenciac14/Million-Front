// Configuración de la API
export const API_CONFIG = {
  BASE_URL: 'https://localhost:7007',
  ENDPOINTS: {
    // Property endpoints
    PROPERTIES: '/api/Property',
    PROPERTY_BY_ID: (id: string) => `/api/Property/${id}`,
    PROPERTIES_BY_OWNER: (ownerId: string) => `/api/Property/owner/${ownerId}`,
    PROPERTIES_BY_PRICE_RANGE: '/api/Property/price-range',

    // Owner endpoints
    OWNERS: '/api/Owner',
    OWNER_BY_ID: (id: string) => `/api/Owner/${id}`,
    OWNERS_SEARCH: '/api/Owner/search',
  },
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;

// Función helper para manejar respuestas de la API con mejor debugging
export const handleApiResponse = async <T>(response: Response): Promise<T> => {
  console.log(`API Response - Status: ${response.status}, URL: ${response.url}`);

  if (!response.ok) {
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    let errorDetails = null;

    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        errorDetails = await response.json();
        errorMessage = errorDetails.message || errorDetails.error || errorMessage;
      } else {
        const textError = await response.text();
        if (textError) {
          errorMessage = textError;
        }
      }
    } catch (parseError) {
      console.warn('Could not parse error response:', parseError);
    }

    console.error('API Error Details:', { status: response.status, message: errorMessage, details: errorDetails });
    throw new Error(errorMessage);
  }

  try {
    const data = await response.json();
    console.log('API Response Data:', data);
    return data;
  } catch (parseError) {
    console.error('Could not parse successful response:', parseError);
    throw new Error('La respuesta del servidor no es válida');
  }
};

// Función para verificar conectividad con el backend
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    // En desarrollo, simplemente probamos la conectividad básica
    const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
      method: 'GET',
      headers: API_CONFIG.HEADERS,
    });
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};