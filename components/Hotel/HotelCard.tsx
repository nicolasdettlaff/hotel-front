import React from "react";
import Link from "next/link";
import { Hotel } from "@/types";
import Card from "../UI/Card";
import Button from "../UI/Button";

interface HotelCardProps {
  hotel: Hotel;
  onDelete: () => void;
}

export default function HotelCard({ hotel, onDelete }: HotelCardProps) {
  // Calcular el total de habitaciones configuradas
  const totalRooms = hotel.hotelRooms.reduce(
    (sum, room) => sum + room.quantity,
    0
  );

  return (
    <Card className="flex flex-col h-full">
      <div className="flex-grow">
        <h3 className="text-lg font-semibold">{hotel.name}</h3>
        <p className="text-gray-500 text-sm mb-2">{hotel.city}</p>

        <div className="space-y-1 mb-4">
          <p className="text-sm">
            <span className="font-medium">Dirección:</span> {hotel.address}
          </p>
          <p className="text-sm">
            <span className="font-medium">NIT:</span> {hotel.nit}
          </p>
          <p className="text-sm">
            <span className="font-medium">Habitaciones:</span> {totalRooms} de{" "}
            {hotel.max_rooms}
          </p>
        </div>

        {hotel.hotelRooms.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-sm mb-1">Tipos de habitaciones:</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {hotel.hotelRooms.map((room) => (
                <li key={room.id}>
                  {room.quantity} {room.roomType.name} -{" "}
                  {room.accommodation.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex space-x-2 mt-4">
        <Link href={`/hoteles/${hotel.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            Ver
          </Button>
        </Link>
        <Link href={`/hoteles/${hotel.id}/editar`} className="flex-1">
          <Button variant="primary" className="w-full">
            Editar
          </Button>
        </Link>
        <Button variant="danger" onClick={onDelete} className="flex-1">
          Eliminar
        </Button>
      </div>
    </Card>
  );
}
