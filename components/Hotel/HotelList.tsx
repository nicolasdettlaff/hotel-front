import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getHotels, deleteHotel } from "@/lib/api";
import { Hotel } from "@/types";
import Card from "../UI/Card";
import Button from "../UI/Button";
import Alert from "../UI/Alert";
import HotelCard from "./HotelCard";

export default function HotelList() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    setLoading(true);
    const response = await getHotels();
    setLoading(false);

    if (response.error) {
      setError(response.error);
      return;
    }

    if (response.data) {
      setHotels(response.data);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este hotel?")) {
      return;
    }

    const response = await deleteHotel(id);

    if (response.error) {
      setError(response.error);
      return;
    }

    setSuccessMessage("Hotel eliminado con éxito");
    // Recargar la lista de hoteles
    loadHotels();

    // Limpiar el mensaje después de 3 segundos
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lista de Hoteles</h1>
        <Link href="/hoteles/nuevo">
          <Button variant="primary">Nuevo Hotel</Button>
        </Link>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          className="mb-4"
          onClose={() => setError(null)}
        />
      )}

      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          className="mb-4"
          onClose={() => setSuccessMessage(null)}
        />
      )}

      {loading ? (
        <p className="text-center py-4">Cargando hoteles...</p>
      ) : hotels.length === 0 ? (
        <Card>
          <p className="text-center py-4">No hay hoteles registrados.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              onDelete={() => handleDelete(hotel.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
