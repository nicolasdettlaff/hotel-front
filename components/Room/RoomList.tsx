import React, { useState, useEffect } from "react";
import { Hotel, HotelRoom, RoomType, Accommodation } from "@/types";
import { getRoomTypes, getAccommodations, deleteHotelRoom } from "@/lib/api";
import Card from "../UI/Card";
import Button from "../UI/Button";
import Alert from "../UI/Alert";
import RoomForm from "./RoomForm";

interface RoomListProps {
  hotel: Hotel;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export default function RoomList({ hotel, onSuccess, onError }: RoomListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<HotelRoom | null>(null);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(false);

  // Calcular el total de habitaciones configuradas
  const totalRooms = hotel.hotelRooms.reduce(
    (sum, room) => sum + room.quantity,
    0
  );
  const remainingRooms = hotel.max_rooms - totalRooms;

  useEffect(() => {
    loadRoomTypesAndAccommodations();
  }, []);

  const loadRoomTypesAndAccommodations = async () => {
    setLoading(true);

    try {
      const [roomTypesResponse, accommodationsResponse] = await Promise.all([
        getRoomTypes(),
        getAccommodations(),
      ]);

      if (roomTypesResponse.data) {
        setRoomTypes(roomTypesResponse.data);
      }

      if (accommodationsResponse.data) {
        setAccommodations(accommodationsResponse.data);
      }
    } catch (error) {
      onError("Error al cargar los tipos de habitación y acomodaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roomId: number) => {
    if (
      !confirm(
        "¿Estás seguro de que deseas eliminar esta configuración de habitación?"
      )
    ) {
      return;
    }

    try {
      const response = await deleteHotelRoom(hotel.id, roomId);

      if (response.error) {
        onError(response.error);
        return;
      }

      onSuccess("Habitación eliminada con éxito");
    } catch (error) {
      onError("Error al eliminar la habitación");
    }
  };

  const handleEdit = (room: HotelRoom) => {
    setEditingRoom(room);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingRoom(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingRoom(null);
  };

  // Organizar las habitaciones por tipo para mostrarlas agrupadas
  const roomsByType: Record<string, HotelRoom[]> = {};
  hotel.hotelRooms.forEach((room) => {
    const typeName = room.roomType.name;
    if (!roomsByType[typeName]) {
      roomsByType[typeName] = [];
    }
    roomsByType[typeName].push(room);
  });

  return (
    <div>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Habitaciones</h2>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-3">
              {remainingRooms} de {hotel.max_rooms} disponibles
            </span>
            {remainingRooms > 0 && (
              <Button onClick={() => setShowForm(true)} disabled={loading}>
                Agregar Habitación
              </Button>
            )}
          </div>
        </div>

        {showForm ? (
          <RoomForm
            hotelId={hotel.id}
            roomTypes={roomTypes}
            accommodations={accommodations}
            maxQuantity={remainingRooms + (editingRoom?.quantity || 0)}
            initialData={editingRoom || undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
            onError={onError}
          />
        ) : (
          <>
            {hotel.hotelRooms.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay habitaciones configuradas para este hotel.
                <br />
                Haz clic en "Agregar Habitación" para comenzar.
              </div>
            ) : (
              <div className="space-y-6">
                {Object.keys(roomsByType).map((typeName) => (
                  <div
                    key={typeName}
                    className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
                  >
                    <h3 className="font-medium mb-2">{typeName}</h3>
                    <div className="space-y-3">
                      {roomsByType[typeName].map((room) => (
                        <div
                          key={room.id}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded"
                        >
                          <div>
                            <span className="font-medium">{room.quantity}</span>{" "}
                            habitacion(es) con acomodación{" "}
                            <span className="font-medium">
                              {room.accommodation.name}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleEdit(room)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(room.id)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
