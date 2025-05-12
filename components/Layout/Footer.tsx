import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white mt-auto py-6 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Hoteles Decameron. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}
