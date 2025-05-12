import React, { useState, useEffect } from "react";
import {
  HotelRoom,
  HotelRoomFormData,
  RoomType,
  Accommodation,
  ValidationErrors,
} from "@/types";
import {
  createHotelRoom,
  updateHotelRoom,
  getValidAccommodations,
} from "@/lib/api";
import Input from "../UI/Input";
import Select from "../UI/Select";
import Button from "../UI/Button";
import Alert from "../UI/Alert";

interface RoomFormProps {
  hotelId: number;
  roomTypes: RoomType[];
  accommodations: Accommodation[];
  maxQuantity: number;
  initialData?: HotelRoom;
  onSuccess: () => void;
  onCancel: () => void;
  onError: (message: string) => void;
}

export default function RoomForm({
  hotelId,
  roomTypes,
  accommodations,
  maxQuantity,
  initialData,
  onSuccess,
  onCancel,
  onError,
}: RoomFormProps) {
  const [formData, setFormData] = useState<HotelRoomFormData>({
    room_type_id: initialData?.room_type_id || 0,
    accommodation_id: initialData?.accommodation_id || 0,
    quantity: initialData?.quantity || 1,
  });

  const [validAccommodations, setValidAccommodations] = useState<
    Accommodation[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [validatingType, setValidatingType] = useState(false);

  useEffect(() => {
    if (formData.room_type_id) {
      loadValidAccommodations(formData.room_type_id);
    }
  }, [formData.room_type_id]);

  const loadValidAccommodations = async (roomTypeId: number) => {
    setValidatingType(true);
    try {
      const response = await getValidAccommodations(roomTypeId);

      if (response.data) {
        setValidAccommodations(response.data);

        // Si la acomodación actual no es válida para el nuevo tipo de habitación, resetearla
        const currentAccommodationIsValid = response.data.some(
          (acc) => acc.id === formData.accommodation_id
        );

        if (!currentAccommodationIsValid) {
          setFormData((prev) => ({
            ...prev,
            accommodation_id: 0,
          }));
        }
      } else {
        onError("Error al cargar las acomodaciones válidas");
      }
    } catch (error) {
      onError("Error al cargar las acomodaciones válidas");
    } finally {
      setValidatingType(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    let processedValue: string | number = value;

    // Manejar campos numéricos
    if (
      name === "quantity" ||
      name === "room_type_id" ||
      name === "accommodation_id"
    ) {
      processedValue = value ? parseInt(value) : 0;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Limpiar errores de validación
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

    // Validación del lado del cliente
    const errors: ValidationErrors = {};

    if (!formData.room_type_id) {
      errors.room_type_id = ["Debes seleccionar un tipo de habitación"];
    }

    if (!formData.accommodation_id) {
      errors.accommodation_id = ["Debes seleccionar una acomodación"];
    }

    if (!formData.quantity || formData.quantity <= 0) {
      errors.quantity = ["La cantidad debe ser mayor a cero"];
    } else if (formData.quantity > maxQuantity) {
      errors.quantity = [`La cantidad no puede ser mayor a ${maxQuantity}`];
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    try {
      let response;

      if (initialData) {
        response = await updateHotelRoom(hotelId, initialData.id, formData);
      } else {
        response = await createHotelRoom(hotelId, formData);
      }

      if (response.error) {
        onError(response.error);
        setLoading(false);
        return;
      }

      if (response.errors) {
        setValidationErrors(response.errors);
        setLoading(false);
        return;
      }

      onSuccess();
    } catch (error) {
      onError("Error al guardar la habitación");
      setLoading(false);
    }
  };

  // Verificar la compatibilidad entre tipo de habitación y acomodación según las reglas
  const validateRoomTypeAndAccommodation = () => {
    if (!formData.room_type_id || !formData.accommodation_id) return true;

    const selectedRoomType = roomTypes.find(
      (rt) => rt.id === formData.room_type_id
    );
    const selectedAccommodation = accommodations.find(
      (acc) => acc.id === formData.accommodation_id
    );

    if (!selectedRoomType || !selectedAccommodation) return true;

    // Reglas de validación:
    // - Si el tipo de habitación es Estándar: la acomodación debe ser Sencilla o Doble.
    // - Si el tipo de habitación es Junior: la acomodación debe ser Triple o Cuádruple
    // - Si el tipo de habitación es Suite: la acomodación debe ser Sencilla, Doble o Triple

    const typeName = selectedRoomType.name.toLowerCase();
    const accommodationName = selectedAccommodation.name.toLowerCase();

    if (typeName === "estándar" || typeName === "estandar") {
      return accommodationName === "sencilla" || accommodationName === "doble";
    }

    if (typeName === "junior") {
      return (
        accommodationName === "triple" ||
        accommodationName === "cuádruple" ||
        accommodationName === "cuadruple"
      );
    }

    if (typeName === "suite") {
      return (
        accommodationName === "sencilla" ||
        accommodationName === "doble" ||
        accommodationName === "triple"
      );
    }

    return true;
  };

  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <h3 className="font-medium mb-4">
        {initialData ? "Editar Habitación" : "Agregar Habitación"}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            id="room_type_id"
            name="room_type_id"
            label="Tipo de Habitación"
            value={formData.room_type_id}
            onChange={handleChange}
            options={roomTypes.map((rt) => ({ value: rt.id, label: rt.name }))}
            placeholder="Selecciona un tipo de habitación"
            error={validationErrors.room_type_id?.[0]}
            required
            disabled={loading}
          />

          <Select
            id="accommodation_id"
            name="accommodation_id"
            label="Acomodación"
            value={formData.accommodation_id}
            onChange={handleChange}
            options={validAccommodations.map((acc) => ({
              value: acc.id,
              label: acc.name,
            }))}
            placeholder="Selecciona una acomodación"
            error={validationErrors.accommodation_id?.[0]}
            required
            disabled={loading || validatingType || !formData.room_type_id}
          />

          <Input
            id="quantity"
            name="quantity"
            type="number"
            label={`Cantidad (Máximo: ${maxQuantity})`}
            value={formData.quantity}
            onChange={handleChange}
            error={validationErrors.quantity?.[0]}
            required
            disabled={loading}
          />
        </div>

        {formData.room_type_id &&
          formData.accommodation_id &&
          !validateRoomTypeAndAccommodation() && (
            <Alert
              type="error"
              message="La combinación de tipo de habitación y acomodación seleccionada no es válida según las reglas establecidas."
              className="mt-4"
            />
          )}

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading || !validateRoomTypeAndAccommodation()}
          >
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
