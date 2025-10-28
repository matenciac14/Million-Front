/** @format */

"use client";

import React, { useState, useEffect } from "react";
import { Button, Card } from "@/components";
import { API_CONFIG, checkApiHealth } from "@/lib/api-config";

interface ApiTestResult {
  endpoint: string;
  status: "success" | "error" | "pending";
  statusCode?: number;
  message: string;
  data?: unknown;
  timestamp: string;
}

export const ApiDiagnostic: React.FC = () => {
  const [results, setResults] = useState<ApiTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (result: Omit<ApiTestResult, "timestamp">) => {
    setResults((prev) => [
      ...prev,
      { ...result, timestamp: new Date().toLocaleTimeString() },
    ]);
  };

  const testEndpoint = async (url: string, description: string) => {
    addResult({
      endpoint: description,
      status: "pending",
      message: "Probando...",
    });

    try {
      const startTime = Date.now();
      const response = await fetch(url, {
        method: "GET",
        headers: API_CONFIG.HEADERS,
      });
      const endTime = Date.now();

      let data = null;
      const contentType = response.headers.get("content-type") || "";

      try {
        if (contentType.includes("application/json")) {
          data = await response.json();
        } else {
          data = await response.text();
        }
      } catch (parseError) {
        data = "No se pudo parsear la respuesta";
      }

      addResult({
        endpoint: description,
        status: response.ok ? "success" : "error",
        statusCode: response.status,
        message: `${response.status} ${response.statusText} (${
          endTime - startTime
        }ms)`,
        data: data,
      });
    } catch (error) {
      addResult({
        endpoint: description,
        status: "error",
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  const runDiagnostic = async () => {
    setIsRunning(true);
    setResults([]);

    // Test 1: Health check (si existe)
    await testEndpoint(`${API_CONFIG.BASE_URL}/health`, "Health Check");

    // Test 2: Properties endpoint sin parámetros
    await testEndpoint(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROPERTIES}`,
      "Properties (sin filtros)"
    );

    // Test 3: Properties con un filtro simple
    await testEndpoint(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROPERTIES}?name=test`,
      "Properties (con filtro name)"
    );

    // Test 4: Verificar otros endpoints comunes
    await testEndpoint(`${API_CONFIG.BASE_URL}/api`, "API Root");

    // Test 5: Verificar swagger o documentación
    await testEndpoint(
      `${API_CONFIG.BASE_URL}/swagger`,
      "Swagger Documentation"
    );

    setIsRunning(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <Card title="Diagnóstico de API" className="mb-6">
      <div className="space-y-4">
        <div className="flex space-x-2">
          <Button
            onClick={runDiagnostic}
            disabled={isRunning}
            isLoading={isRunning}
          >
            {isRunning ? "Ejecutando..." : "Ejecutar Diagnóstico"}
          </Button>
          <Button
            variant="outline"
            onClick={clearResults}
            disabled={results.length === 0}
          >
            Limpiar Resultados
          </Button>
        </div>

        <div className="text-sm text-gray-600">
          <p>
            <strong>URL Base del Backend:</strong> {API_CONFIG.BASE_URL}
          </p>
          <p>
            <strong>Endpoint de Propiedades:</strong>{" "}
            {API_CONFIG.ENDPOINTS.PROPERTIES}
          </p>
        </div>

        {results.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Resultados:</h3>
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded border-l-4 ${
                  result.status === "success"
                    ? "border-green-500 bg-green-50"
                    : result.status === "error"
                    ? "border-red-500 bg-red-50"
                    : "border-yellow-500 bg-yellow-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{result.endpoint}</span>
                  <span className="text-xs text-gray-500">
                    {result.timestamp}
                  </span>
                </div>
                <div className="text-sm">
                  {result.statusCode && (
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs mr-2 ${
                        result.statusCode < 300
                          ? "bg-green-200 text-green-800"
                          : result.statusCode < 400
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {result.statusCode}
                    </span>
                  )}
                  {result.message}
                </div>
                {result.data !== null && result.data !== undefined && (
                  <details className="mt-2">
                    <summary className="text-xs text-gray-600 cursor-pointer">
                      Ver respuesta
                    </summary>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto max-h-32">
                      {String(
                        typeof result.data === "string"
                          ? result.data
                          : JSON.stringify(result.data, null, 2)
                      )}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>
            <strong>Posibles soluciones para error 400:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              Verificar que el backend esté ejecutándose en el puerto 5179
            </li>
            <li>
              Revisar que los parámetros de filtro sean los esperados por la API
            </li>
            <li>Verificar configuración de CORS en el backend</li>
            <li>Comprobar que el endpoint `/api/properties` exista</li>
            <li>Revisar logs del backend para más detalles del error</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};
