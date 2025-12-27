"use client";

import { PropertyForm } from "@/components/PropertyForm";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useProperties } from "@/contexts/PropertyContext";
import { Property } from "@/types/property";
import {
  Edit,
  Eye,
  Plus,
  Trash2,
  Home,
  DollarSign,
  Key,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function AdminDashboard() {
  const { properties, deleteProperty } = useProperties();
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | undefined>(
    undefined
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este imóvel?")) {
      await deleteProperty(id);
    }
  };

  const handleCreate = () => {
    setEditingProperty(undefined);
    setShowModal(true);
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingProperty(undefined);
  };

  const handleSuccess = () => {
    handleModalClose();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto  px-4 pb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Painel Administrativo
              </h1>
              <p className="text-gray-600">
                Gerencie todos os imóveis cadastrados
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm hover:shadow-md"
            >
              <Plus className="h-5 w-5" />
              <span>Adicionar Imóvel</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
              <div className="p-2 bg-gray-50 rounded-lg mb-2">
                <Home className="h-5 w-5 text-gray-600" />
              </div>
              <p className="text-xs font-medium text-gray-500 mb-0.5">Total</p>
              <p className="text-xl font-bold text-gray-900">
                {properties.length}
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
              <div className="p-2 bg-blue-50 rounded-lg mb-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-xs font-medium text-gray-500 mb-0.5">Venda</p>
              <p className="text-xl font-bold text-blue-600">
                {properties.filter((p) => p.status === "venda").length}
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
              <div className="p-2 bg-green-50 rounded-lg mb-2">
                <Key className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-xs font-medium text-gray-500 mb-0.5">
                Aluguel
              </p>
              <p className="text-xl font-bold text-green-600">
                {properties.filter((p) => p.status === "aluguel").length}
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
              <div className="p-2 bg-purple-50 rounded-lg mb-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-xs font-medium text-gray-500 mb-0.5">Ativos</p>
              <p className="text-xl font-bold text-purple-600">
                {properties.length}
              </p>
            </div>
          </div>

          {/* Mobile Properties List (Cards) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    {property.images?.[0] ? (
                      <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                        <span className="text-xs">Sem foto</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate mb-1">
                      {property.title}
                    </h3>
                    <p className="text-blue-600 font-bold text-lg">
                      {formatPrice(property.price)}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {property.type}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          property.status === "venda"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {property.status === "venda" ? "Venda" : "Aluguel"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-50">
                  <Link
                    href={`/imoveis/${property.id}`}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Visualizar"
                  >
                    <Eye className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleEdit(property)}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}

            {properties.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-500">Nenhum imóvel cadastrado</p>
              </div>
            )}
          </div>

          {/* Desktop Properties Table */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Imóvel
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Tipo
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Preço
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {properties.map((property) => (
                    <tr
                      key={property.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {property.images?.[0] ? (
                              <Image
                                src={property.images[0]}
                                alt={property.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <span className="text-[10px]">Sem foto</span>
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-gray-900 line-clamp-1">
                            {property.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {property.type}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            property.status === "venda"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {property.status === "venda" ? "Venda" : "Aluguel"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {formatPrice(property.price)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/imoveis/${property.id}`}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Visualizar"
                          >
                            <Eye className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleEdit(property)}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(property.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {properties.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhum imóvel cadastrado</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <h2 className="text-xl font-bold mb-4">
                {editingProperty ? "Editar Imóvel" : "Adicionar Novo Imóvel"}
              </h2>
              <PropertyForm
                initialData={editingProperty}
                onSuccess={handleSuccess}
                onCancel={handleModalClose}
              />
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
