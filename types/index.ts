// Tipos TypeScript globales para el proyecto

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface TestItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}