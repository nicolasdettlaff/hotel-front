"use client";

import React from "react";
import Link from "next/link";
import HotelForm from "@/components/Hotel/HotelForm";

export default function NewHotelPage() {
  return (
    <div>
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          ← Volver al listado
        </Link>
      </div>

      <HotelForm mode="create" />
    </div>
  );
}
