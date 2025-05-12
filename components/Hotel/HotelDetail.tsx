import React, { useState } from "react";
import Link from "next/link";
import { Hotel } from "@/types";
import Card from "../UI/Card";
import Button from "../UI/Button";
import Alert from "../UI/Alert";
import RoomList from "../Room/RoomList";

interface HotelDetailProps {
  hotel: Hotel;
}

export default function HotelDetail({ hotel }: HotelDetailProps) {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Calcular el total de habitaciones configuradas
  const totalRooms = hotel.hotelRooms.reduce(
    (sum, room) => sum + room.quantity,
    0
  );
  const remainingRooms = hotel.max_rooms - totalRooms;

  return (
    <div className="space-y-6">
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      <Card>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold">{hotel.name}</h1>
            <p className="text-gray-600">{hotel.city}</p>
          </div>
          <Link href={`/hoteles/${hotel.id}/editar`}>
            <Button>Editar Hotel</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Dirección</h3>
            <p>{hotel.address}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">NIT</h3>
            <p>{hotel.nit}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Habitaciones</h3>
            <p>
              {totalRooms} de {hotel.max_rooms} configuradas ({remainingRooms}{" "}
              disponibles)
            </p>
          </div>
        </div>
      </Card>

      <RoomList
        hotel={hotel}
        onSuccess={(message: React.SetStateAction<string | null>) => {
          setSuccessMessage(message);
          setTimeout(() => setSuccessMessage(null), 3000);
        }}
        onError={(message: React.SetStateAction<string | null>) => setError(message)}
      />
    </div>
  );
}
