<!-- @format -->

# Million Real Estate - Frontend

Aplicación frontend para la gestión de propiedades inmobiliarias desarrollada con Next.js, conectada a una API .NET con MongoDB.

## 🎯 Descripción del Proyecto

Este proyecto forma parte de una aplicación full-stack para una empresa inmobiliaria que requiere:

- **Backend**: API .NET 8/9 con MongoDB
- **Frontend**: Aplicación web con Next.js y TypeScript
- **Funcionalidades**: Búsqueda y filtrado de propiedades inmobiliarias

## 🚀 Stack Tecnológico

- **Next.js 16** - Framework React con App Router
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS 4** - Framework de CSS utilitario
- **React 19** - Biblioteca de interfaz de usuario
- **ESLint** - Linter para mantener calidad de código

## 📁 Estructura del Proyecto

```
├── app/                           # Páginas y rutas (App Router)
│   ├── layout.tsx                # Layout principal
│   ├── page.tsx                  # Página principal de propiedades
│   └── globals.css               # Estilos globales
├── components/                   # Componentes React reutilizables
│   ├── Button.tsx               # Componente de botón con variantes
│   ├── Card.tsx                 # Componente de tarjeta
│   ├── Input.tsx                # Componente de input con validación
│   ├── PropertyCard.tsx         # Tarjeta individual de propiedad
│   ├── PropertyList.tsx         # Lista de propiedades con estados de carga
│   ├── PropertyFilters.tsx      # Sistema de filtros avanzado
│   ├── PropertyDetailModal.tsx  # Modal de detalles de propiedad
│   ├── ErrorBoundary.tsx        # Manejo de errores global
│   └── index.ts                 # Exportaciones centralizadas
├── lib/                         # Utilidades y servicios
│   ├── api-config.ts           # Configuración de la API
│   ├── property-service.ts     # Servicio para propiedades
│   └── utils.ts                # Funciones helper
├── types/                      # Definiciones de tipos TypeScript
│   └── index.ts               # Tipos para propiedades y API
└── public/                    # Archivos estáticos
    └── placeholder-property.svg # Imagen placeholder
```

## 🛠 Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- Backend API ejecutándose en `http://localhost:5179`
- npm, yarn, pnpm o bun

### Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:3000
```

## 🏗 Backend API Requerida

La aplicación frontend se conecta a una API .NET que debe estar ejecutándose en `http://localhost:5179` con los siguientes endpoints:

### Endpoints Principales

```
GET /api/properties              # Obtener todas las propiedades
GET /api/properties?name=...     # Filtrar por nombre
GET /api/properties?address=...  # Filtrar por dirección
GET /api/properties?minPrice=... # Filtrar por precio mínimo
GET /api/properties?maxPrice=... # Filtrar por precio máximo
GET /api/properties/{id}         # Obtener propiedad por ID
```

### Estructura de Datos (DTO)

```typescript
interface Property {
  id: string;
  idOwner: string; // ID del propietario
  name: string; // Nombre de la propiedad
  address: string; // Dirección de la propiedad
  price: number; // Precio de la propiedad
  image: string; // URL de la imagen
}
```

## 🚦 Comandos Disponibles

```bash
# Modo desarrollo (puerto 3000)
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm run start

# Verificar código con ESLint
npm run lint
```

## 📱 Características Implementadas

### ✅ Funcionalidades Core

- **Lista de Propiedades**: Visualización en grid responsive
- **Filtros Avanzados**: Por nombre, dirección y rango de precios
- **Detalles de Propiedad**: Modal con información completa
- **Búsqueda en Tiempo Real**: Con debounce para optimizar performance
- **Responsive Design**: Adaptable a móviles, tablets y desktop

### ✅ Filtros Implementados

- 🔍 **Búsqueda por nombre**: Filtrado dinámico con debounce
- 📍 **Búsqueda por dirección**: Búsqueda en tiempo real
- 💰 **Filtro por precio**: Rangos predefinidos y personalizados
- 🗂 **Filtros combinados**: Múltiples filtros simultáneos

### ✅ UX/UI Features

- 📱 **Responsive**: Diseño optimizado para todos los dispositivos
- ⚡ **Estados de carga**: Skeletons y spinners
- ❌ **Manejo de errores**: Error boundaries y mensajes informativos
- 🎨 **Interfaz moderna**: Usando Tailwind CSS

## 🔧 Componentes Principales

### PropertyCard

Tarjeta individual que muestra información básica de cada propiedad:

```tsx
<PropertyCard property={property} onViewDetails={handleViewDetails} />
```

### PropertyFilters

Sistema de filtros avanzado con búsqueda en tiempo real:

```tsx
<PropertyFiltersComponent
  onFiltersChange={handleFiltersChange}
  isLoading={isLoading}
/>
```

### PropertyDetailModal

Modal con información detallada de la propiedad:

```tsx
<PropertyDetailModal
  property={selectedProperty}
  isOpen={isModalOpen}
  onClose={handleCloseModal}
/>
```

## 🎯 Flujo de Usuario

1. **Carga inicial**: Lista todas las propiedades disponibles
2. **Aplicar filtros**: El usuario puede filtrar por nombre, dirección o precio
3. **Ver detalles**: Click en "Ver Detalles" abre modal con información completa
4. **Navegación**: Diseño responsive para uso en cualquier dispositivo

## ⚙️ Configuración de API

La configuración de la API se encuentra en `lib/api-config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: "http://localhost:5179",
  ENDPOINTS: {
    PROPERTIES: "/api/properties",
    PROPERTY_BY_ID: (id: string) => `/api/properties/${id}`,
  },
};
```

## 🧪 Testing y Calidad

### Implementado

- **TypeScript Strict**: Tipado fuerte en todo el proyecto
- **ESLint**: Configuración estricta para calidad de código
- **Error Boundaries**: Manejo robusto de errores
- **Performance**: Debouncing, lazy loading y optimizaciones

### Recomendado para Implementar

- **Jest + Testing Library**: Tests unitarios para componentes
- **Cypress**: Tests end-to-end
- **Storybook**: Documentación visual de componentes

## 🚀 Despliegue

### Desarrollo

```bash
npm run dev
# Aplicación disponible en http://localhost:3000
```

### Producción

```bash
npm run build
npm run start
```

### Vercel (Recomendado)

```bash
npm i -g vercel
vercel --prod
```

## 📋 Requisitos del Proyecto Cumplidos

### ✅ Backend Integration

- [x] Conexión con API .NET en `localhost:5179`
- [x] Filtros por nombre, dirección y rango de precios
- [x] Manejo de DTOs según especificación

### ✅ Frontend Requirements

- [x] Aplicación Next.js responsive
- [x] Lista de propiedades desde API
- [x] Filtros de búsqueda implementados
- [x] Vista de detalles individuales
- [x] Diseño responsive

### ✅ Best Practices

- [x] Arquitectura limpia y modular
- [x] Código organizado y mantenible
- [x] Manejo de errores implementado
- [x] Performance optimizada
- [x] Documentación completa

## 🔧 Troubleshooting

### Error de conexión con API

Si ves errores de conexión, verifica que:

1. El backend esté ejecutándose en `http://localhost:5179`
2. Los endpoints de la API estén disponibles
3. No haya problemas de CORS

### Problemas de desarrollo

```bash
# Limpiar caché de Next.js
rm -rf .next

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Verificar puerto disponible
netstat -an | grep 3000
```

## 📞 Soporte

Para problemas o preguntas sobre el proyecto:

1. Verificar que el backend esté ejecutándose correctamente
2. Revisar la consola del navegador para errores específicos
3. Consultar la documentación de Next.js para temas del framework

---

**Desarrollado como proyecto de demostración full-stack con Next.js, TypeScript, Tailwind CSS y API .NET**
