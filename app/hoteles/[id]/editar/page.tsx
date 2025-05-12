"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getHotel } from "@/lib/api";
import { Hotel } from "@/types";
import HotelForm from "@/components/Hotel/HotelForm";
import Alert from "@/components/UI/Alert";

export default function EditHotelPage() {
  const params = useParams();
  const router = useRouter();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotel = async () => {
      if (!params.id) return;

      setLoading(true);
      const hotelId = parseInt(params.id as string);

      const response = await getHotel(hotelId);
      setLoading(false);

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setHotel(response.data);
      }
    };

    fetchHotel();
  }, [params.id]);

  if (loading) {
    return <div className="text-center py-12">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="py-12">
        <Alert type="error" message={error} />
        <div className="mt-4 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Volver al listado
          </Link>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="py-12">
        <Alert type="error" message="Hotel no encontrado" />
        <div className="mt-4 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Volver al listado
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          ← Volver al listado
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Editar Hotel: {hotel.name}</h1>

      <HotelForm mode="edit" initialData={hotel} />
    </div>
  );
}
