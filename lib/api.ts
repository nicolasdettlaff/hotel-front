import {
  ApiResponse,
  Hotel,
  HotelFormData,
  HotelRoom,
  HotelRoomFormData,
  RoomType,
  Accommodation,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    if (response.status === 422) {
      // Manejar errores de validación de Laravel
      const errorData = await response.json();
      return { errors: errorData.errors };
    }

    const error = await response.text();
    return { error: error || "Ha ocurrido un error con la solicitud" };
  }

  // Para respuestas 204 No Content (como en delete)
  if (response.status === 204) {
    return {};
  }

  const data = await response.json();
  return { data };
}

export async function getHotels(): Promise<ApiResponse<Hotel[]>> {
  try {
    const response = await fetch(`${API_URL}/hotels`);
    return handleResponse<Hotel[]>(response);
  } catch (error) {
    return { error: "Error al obtener los hoteles" };
  }
}

export async function getHotel(id: number): Promise<ApiResponse<Hotel>> {
  try {
    const response = await fetch(`${API_URL}/hotels/${id}`);
    return handleResponse<Hotel>(response);
  } catch (error) {
    return { error: "Error al obtener el hotel" };
  }
}

export async function createHotel(
  data: HotelFormData
): Promise<ApiResponse<Hotel>> {
  try {
    const response = await fetch(`${API_URL}/hotels`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<Hotel>(response);
  } catch (error) {
    return { error: "Error al crear el hotel" };
  }
}

export async function updateHotel(
  id: number,
  data: HotelFormData
): Promise<ApiResponse<Hotel>> {
  try {
    const response = await fetch(`${API_URL}/hotels/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<Hotel>(response);
  } catch (error) {
    return { error: "Error al actualizar el hotel" };
  }
}

export async function deleteHotel(id: number): Promise<ApiResponse<null>> {
  try {
    const response = await fetch(`${API_URL}/hotels/${id}`, {
      method: "DELETE",
    });
    return handleResponse<null>(response);
  } catch (error) {
    return { error: "Error al eliminar el hotel" };
  }
}

export async function getHotelRooms(
  hotelId: number
): Promise<ApiResponse<HotelRoom[]>> {
  try {
    const response = await fetch(`${API_URL}/hotels/${hotelId}/rooms`);
    return handleResponse<HotelRoom[]>(response);
  } catch (error) {
    return { error: "Error al obtener las habitaciones del hotel" };
  }
}

export async function createHotelRoom(
  hotelId: number,
  data: HotelRoomFormData
): Promise<ApiResponse<HotelRoom>> {
  try {
    const response = await fetch(`${API_URL}/hotels/${hotelId}/rooms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<HotelRoom>(response);
  } catch (error) {
    return { error: "Error al crear la habitación del hotel" };
  }
}

export async function updateHotelRoom(
  hotelId: number,
  roomId: number,
  data: HotelRoomFormData
): Promise<ApiResponse<HotelRoom>> {
  try {
    const response = await fetch(
      `${API_URL}/hotels/${hotelId}/rooms/${roomId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    return handleResponse<HotelRoom>(response);
  } catch (error) {
    return { error: "Error al actualizar la habitación del hotel" };
  }
}

export async function deleteHotelRoom(
  hotelId: number,
  roomId: number
): Promise<ApiResponse<null>> {
  try {
    const response = await fetch(
      `${API_URL}/hotels/${hotelId}/rooms/${roomId}`,
      {
        method: "DELETE",
      }
    );
    return handleResponse<null>(response);
  } catch (error) {
    return { error: "Error al eliminar la habitación del hotel" };
  }
}

export async function getRoomTypes(): Promise<ApiResponse<RoomType[]>> {
  try {
    const response = await fetch(`${API_URL}/room-types`);
    return handleResponse<RoomType[]>(response);
  } catch (error) {
    return { error: "Error al obtener los tipos de habitación" };
  }
}

export async function getValidAccommodations(
  roomTypeId: number
): Promise<ApiResponse<Accommodation[]>> {
  try {
    const response = await fetch(
      `${API_URL}/room-types/${roomTypeId}/accommodations`
    );
    return handleResponse<Accommodation[]>(response);
  } catch (error) {
    return { error: "Error al obtener las acomodaciones válidas" };
  }
}

export async function getAccommodations(): Promise<
  ApiResponse<Accommodation[]>
> {
  try {
    const response = await fetch(`${API_URL}/accommodations`);
    return handleResponse<Accommodation[]>(response);
  } catch (error) {
    return { error: "Error al obtener las acomodaciones" };
  }
}
