/** @format */

"use client";

import React from "react";
import Image from "next/image";
import { Property } from "@/types";
import { Card } from "./Card";
import { Button } from "./Button";
import {
  formatPrice,
  getPropertyImages,
  getMainImage,
  normalizeProperty,
} from "@/lib/utils";

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isOpen,
  onClose,
}) => {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoading, setImageLoading] = React.useState(true);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  // Reset image state when property changes
  React.useEffect(() => {
    if (property) {
      setImageError(false);
      setImageLoading(true);
      setCurrentImageIndex(0);
    }
  }, [property?.idProperty]);

  if (!isOpen || !property) return null;

  // Normalizar propiedad para compatibilidad
  const normalizedProperty = normalizeProperty(property);

  // Obtener todas las imágenes válidas
  const propertyImages = getPropertyImages(normalizedProperty);

  // Imagen actual (si hay múltiples) o imagen principal
  const currentImage =
    propertyImages.length > 0
      ? propertyImages[currentImageIndex]?.file
      : getMainImage(normalizedProperty);

  const handleImageError = () => {
    console.log("Modal image failed to load:", currentImage);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const nextImage = () => {
    if (propertyImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
      setImageLoading(true);
      setImageError(false);
    }
  };

  const prevImage = () => {
    if (propertyImages.length > 1) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + propertyImages.length) % propertyImages.length
      );
      setImageLoading(true);
      setImageError(false);
    }
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
    setImageLoading(true);
    setImageError(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-2xl">
          <Card className="max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                Detalles de la Propiedad
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="p-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Image Gallery */}
              <div className="relative mb-6">
                {/* Main Image */}
                <div className="relative h-64 md:h-80 w-full rounded-lg overflow-hidden bg-gray-200">
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                  <Image
                    src={currentImage || "/placeholder-property.svg"}
                    alt={normalizedProperty.name}
                    fill
                    className="object-cover"
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                  />

                  {/* Navigation Arrows (solo si hay múltiples imágenes) */}
                  {propertyImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                        aria-label="Imagen anterior"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                        aria-label="Imagen siguiente"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>

                      {/* Image counter */}
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                        {currentImageIndex + 1} / {propertyImages.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail Gallery (solo si hay múltiples imágenes) */}
                {propertyImages.length > 1 && (
                  <div className="flex mt-3 space-x-2 overflow-x-auto pb-2">
                    {propertyImages.map((img, index) => (
                      <button
                        key={img.idPropertyImage}
                        onClick={() => selectImage(index)}
                        className={`shrink-0 relative w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                          index === currentImageIndex
                            ? "border-blue-500"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Image
                          src={img.file}
                          alt={`Vista ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        {img.isMain && (
                          <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-1 rounded">
                            P
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="space-y-6">
                {/* Title and Price */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {normalizedProperty.name}
                  </h3>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPrice(normalizedProperty.price)}
                  </div>
                  {normalizedProperty.codeInternal && (
                    <div className="text-sm text-gray-500 mt-1">
                      Código: {normalizedProperty.codeInternal}
                    </div>
                  )}
                </div>

                {/* Address */}
                <div className="flex items-start space-x-2">
                  <svg
                    className="w-5 h-5 text-gray-400 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Dirección
                    </p>
                    <p className="text-gray-900">
                      {normalizedProperty.address}
                    </p>
                  </div>
                </div>

                {/* Owner Information */}
                <div className="flex items-start space-x-2">
                  <svg
                    className="w-5 h-5 text-gray-400 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Propietario
                    </p>
                    <p className="text-gray-900">
                      {normalizedProperty.ownerName || "No especificado"}
                    </p>
                    {normalizedProperty.ownerPhone && (
                      <p className="text-gray-600 text-sm">
                        {normalizedProperty.ownerPhone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-2 gap-4">
                  {normalizedProperty.year && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Año de construcción
                      </p>
                      <p className="text-gray-900">{normalizedProperty.year}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      ID de la Propiedad
                    </p>
                    <p className="text-gray-900 font-mono text-sm">
                      {normalizedProperty.idProperty}
                    </p>
                  </div>
                </div>

                {/* Property Traces (if available) */}
                {normalizedProperty.traces &&
                  normalizedProperty.traces.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-3">
                        Historial de Transacciones
                      </p>
                      <div className="space-y-2">
                        {normalizedProperty.traces.map((trace, index) => (
                          <div
                            key={`${trace.dateSale}-${trace.value}-${index}`}
                            className="bg-gray-50 p-3 rounded-md"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {trace.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {new Date(
                                    trace.dateSale
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">
                                  {formatPrice(trace.value)}
                                </p>
                                {trace.tax > 0 && (
                                  <p className="text-sm text-gray-600">
                                    Impuesto: {formatPrice(trace.tax)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
              <Button variant="outline" onClick={onClose}>
                Cerrar
              </Button>
              <Button variant="primary">Contactar</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
