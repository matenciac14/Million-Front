# Frontend Test - Million

Este es un proyecto frontend desarrollado con Next.js para demostrar capacidades de desarrollo frontend moderno.

## 🚀 Stack Tecnológico

- **Next.js 16** - Framework React con App Router
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS 4** - Framework de CSS utilitario
- **React 19** - Biblioteca de interfaz de usuario
- **ESLint** - Linter para mantener calidad de código

## 📁 Estructura del Proyecto

```
├── app/                    # Páginas y rutas (App Router)
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página de inicio
│   └── globals.css        # Estilos globales
├── components/            # Componentes React reutilizables
│   ├── Button.tsx         # Componente de botón
│   ├── Card.tsx           # Componente de tarjeta
│   ├── Input.tsx          # Componente de input
│   └── index.ts           # Exportaciones
├── lib/                   # Utilidades y configuraciones
│   └── utils.ts           # Funciones helper
├── types/                 # Definiciones de tipos TypeScript
│   └── index.ts           # Tipos globales
└── public/                # Archivos estáticos
```

## 🛠 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm, yarn, pnpm o bun

### Instalación
```bash
# Clonar el repositorio (si aplica)
git clone <url-del-repo>

# Navegar al directorio
cd Front-Next

# Instalar dependencias (ya están instaladas)
npm install
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

## 📱 Características de la Aplicación

### Funcionalidades Implementadas
- ✅ **Gestión de Items**: Crear, completar y eliminar elementos
- ✅ **Componentes Reutilizables**: Button, Card, Input con variantes
- ✅ **Responsive Design**: Adaptable a diferentes tamaños de pantalla
- ✅ **TypeScript**: Tipado estático para mejor developer experience
- ✅ **Estado Local**: Manejo de estado con React hooks

### Componentes Disponibles

#### Button
```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Texto del botón
</Button>
```

#### Card
```tsx
<Card title="Título" description="Descripción">
  Contenido de la tarjeta
</Card>
```

#### Input
```tsx
<Input 
  label="Etiqueta" 
  placeholder="Placeholder"
  value={value}
  onChange={onChange}
  error="Mensaje de error"
/>
```

## 🎯 Cómo Usar

1. **Ejecutar el proyecto**: `npm run dev`
2. **Abrir el navegador**: Visita http://localhost:3000
3. **Agregar items**: Usa el formulario de la izquierda
4. **Gestionar items**: Marca como completado o elimina desde la lista

## 🔧 Desarrollo

### Agregar Nuevos Componentes
1. Crear archivo en `/components/NuevoComponente.tsx`
2. Implementar el componente con TypeScript
3. Exportar en `/components/index.ts`
4. Usar en las páginas con `import { NuevoComponente } from '@/components'`

### Estructura de Tipos
Los tipos TypeScript están centralizados en `/types/index.ts` para mantener consistencia.

### Utilidades
Las funciones helper están en `/lib/utils.ts` para reutilización.

## 📐 Arquitectura

- **App Router**: Utiliza el nuevo sistema de rutas de Next.js 13+
- **Componentes Modulares**: Cada componente es independiente y reutilizable
- **TypeScript Strict**: Configuración estricta para mejor calidad de código
- **Tailwind CSS**: Clases utilitarias para estilos rápidos y consistentes

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel --prod
```

### Otros Proveedores
El proyecto genera archivos estáticos compatibles con cualquier hosting que soporte Node.js.

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Notas Técnicas

- **Next.js 16**: Utiliza las últimas características del framework
- **Turbopack**: Habilitado para desarrollo más rápido
- **ESLint Config**: Configuración estándar de Next.js
- **TypeScript**: Configurado con strict mode

---

**Desarrollado como proyecto de demostración frontend con Next.js, TypeScript y Tailwind CSS**
