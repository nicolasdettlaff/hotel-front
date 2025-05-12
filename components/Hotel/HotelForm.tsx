import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HotelFormData, ValidationErrors } from "@/types";
import { createHotel, updateHotel } from "@/lib/api";
import Input from "../UI/Input";
import Button from "../UI/Button";
import Card from "../UI/Card";
import Alert from "../UI/Alert";

interface HotelFormProps {
  initialData?: HotelFormData;
  hotelId?: number;
  mode: "create" | "edit";
}

const emptyHotelForm: HotelFormData = {
  name: "",
  address: "",
  city: "",
  nit: "",
  max_rooms: 0,
};

export default function HotelForm({
  initialData = emptyHotelForm,
  hotelId,
  mode,
}: HotelFormProps) {
  // Use state to track if the component is mounted
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState<HotelFormData>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  // Set mounted state to true after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only access router after component is mounted
  const router = isMounted ? useRouter() : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    // Convertir a número si el campo es numérico
    const processedValue =
      type === "number" ? (value ? parseInt(value) : "") : value;

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Limpiar el error de validación de este campo cuando el usuario lo modifica
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidationErrors({});

    // Validación básica del lado del cliente
    const errors: ValidationErrors = {};

    if (!formData.name.trim())
      errors.name = ["El nombre del hotel es obligatorio"];
    if (!formData.address.trim())
      errors.address = ["La dirección del hotel es obligatoria"];
    if (!formData.city.trim()) errors.city = ["La ciudad es obligatoria"];
    if (!formData.nit.trim()) errors.nit = ["El NIT es obligatorio"];
    if (!formData.max_rooms || formData.max_rooms <= 0)
      errors.max_rooms = [
        "El número máximo de habitaciones debe ser mayor a 0",
      ];

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    try {
      let response;

      if (mode === "create") {
        response = await createHotel(formData);
      } else if (mode === "edit" && hotelId) {
        response = await updateHotel(hotelId, formData);
      }

      if (response?.error) {
        setError(response.error);
        setLoading(false);
        return;
      }

      if (response?.errors) {
        setValidationErrors(response.errors);
        setLoading(false);
        return;
      }

      // Solo navegar si el router está disponible
      if (router) {
        router.push(mode === "create" ? "/" : `/hoteles/${hotelId}`);
      }
    } catch (err) {
      setError("Ocurrió un error inesperado");
      setLoading(false);
    }
  };

  // Solo renderizar el formulario completo cuando el componente está montado
  if (!isMounted) {
    return (
      <Card title={mode === "create" ? "Nuevo Hotel" : "Editar Hotel"}>
        <div className="flex justify-center py-8">
          <div className="animate-pulse">Cargando...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card title={mode === "create" ? "Nuevo Hotel" : "Editar Hotel"}>
      {error && (
        <Alert
          type="error"
          message={error}
          className="mb-4"
          onClose={() => setError(null)}
        />
      )}

      <form onSubmit={handleSubmit}>
        <Input
          id="name"
          name="name"
          label="Nombre del Hotel"
          value={formData.name}
          onChange={handleChange}
          error={validationErrors.name?.[0]}
          required
        />

        <Input
          id="address"
          name="address"
          label="Dirección"
          value={formData.address}
          onChange={handleChange}
          error={validationErrors.address?.[0]}
          required
        />

        <Input
          id="city"
          name="city"
          label="Ciudad"
          value={formData.city}
          onChange={handleChange}
          error={validationErrors.city?.[0]}
          required
        />

        <Input
          id="nit"
          name="nit"
          label="NIT"
          value={formData.nit}
          onChange={handleChange}
          error={validationErrors.nit?.[0]}
          required
        />

        <Input
          id="max_rooms"
          name="max_rooms"
          type="number"
          label="Número máximo de habitaciones"
          value={formData.max_rooms}
          onChange={handleChange}
          error={validationErrors.max_rooms?.[0]}
          required
        />

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router && router.back()}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading
              ? "Guardando..."
              : mode === "create"
              ? "Crear Hotel"
              : "Guardar Cambios"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
