/** @type {import('jest').Config} */
const config = {
  // Añadir más configuraciones de setupFiles antes de que cada test se ejecute
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  
  testEnvironment: 'jsdom',
  
  // Patrones para archivos de prueba
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)'
  ],
  
  // Directorios a ignorar
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/out/'
  ],
  
  // Mapeo de módulos
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  
  // Configuración de coverage
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Umbrales de coverage
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  
  // Variables de entorno para testing
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
  },
  
  // Transformaciones
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  
  // Extensiones de archivos
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
}

module.exports = config