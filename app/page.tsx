'use client';

import { useState } from "react";
import { Button, Card, Input } from "@/components";
import { TestItem } from "@/types";
import { generateId } from "@/lib/utils";

export default function Home() {
  const [items, setItems] = useState<TestItem[]>([]);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');

  const addItem = () => {
    if (newItemTitle.trim() && newItemDescription.trim()) {
      const newItem: TestItem = {
        id: generateId(),
        title: newItemTitle,
        description: newItemDescription,
        completed: false
      };
      setItems([...items, newItem]);
      setNewItemTitle('');
      setNewItemDescription('');
    }
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frontend Test - Million
          </h1>
          <p className="text-lg text-gray-600">
            Aplicación de prueba construida con Next.js, TypeScript y Tailwind CSS
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Formulario para agregar items */}
          <Card title="Agregar Nuevo Item" description="Completa los campos para agregar un nuevo elemento">
            <div className="space-y-4">
              <Input
                label="Título"
                placeholder="Ingresa el título del item"
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
              />
              <Input
                label="Descripción"
                placeholder="Ingresa la descripción del item"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
              />
              <Button 
                onClick={addItem}
                className="w-full"
                disabled={!newItemTitle.trim() || !newItemDescription.trim()}
              >
                Agregar Item
              </Button>
            </div>
          </Card>

          {/* Lista de items */}
          <Card title="Lista de Items" description={`Total: ${items.length} items`}>
            {items.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No hay items aún. Agrega el primero usando el formulario.
              </p>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div 
                    key={item.id}
                    className={`p-4 border rounded-lg ${
                      item.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`font-medium ${
                          item.completed ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}>
                          {item.title}
                        </h3>
                        <p className={`text-sm mt-1 ${
                          item.completed ? 'line-through text-gray-400' : 'text-gray-600'
                        }`}>
                          {item.description}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant={item.completed ? "secondary" : "primary"}
                          onClick={() => toggleItem(item.id)}
                        >
                          {item.completed ? '↶' : '✓'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          🗑
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <footer className="mt-12 text-center text-gray-500">
          <p>Construido con Next.js 14, TypeScript y Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
}
