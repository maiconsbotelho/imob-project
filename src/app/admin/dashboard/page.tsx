"use client";

import { PropertyForm } from "@/components/PropertyForm";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useProperties } from "@/contexts/PropertyContext";
import { Property } from "@/types/property";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AdminDashboard() {
  const { properties, deleteProperty } = useProperties();
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | undefined>(undefined);

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
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel Administrativo</h1>
              <p className="text-gray-600">Gerencie todos os imóveis cadastrados</p>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <Plus className="h-5 w-5" />
              <span>Adicionar Imóvel</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-gray-600 mb-2">Total de Imóveis</p>
              <p className="text-3xl font-bold text-gray-900">{properties.length}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-gray-600 mb-2">Para Venda</p>
              <p className="text-3xl font-bold text-blue-600">
                {properties.filter((p) => p.status === "venda").length}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-gray-600 mb-2">Para Aluguel</p>
              <p className="text-3xl font-bold text-green-600">
                {properties.filter((p) => p.status === "aluguel").length}
              </p>
            </div>
          </div>

          {/* Properties Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Imóvel</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 hidden sm:table-cell">
                      Tipo
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 hidden md:table-cell">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Preço</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {property.images && property.images.length > 0 ? (
                            <img
                              src={property.images[0]}
                              alt={property.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400">
                              No img
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-1">{property.title}</p>
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {property.city}, {property.state}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="inline-flex px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm capitalize">
                          {property.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-sm ${
                            property.status === "venda" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                          }`}
                        >
                          {property.status === "venda" ? "Venda" : "Aluguel"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{formatPrice(property.price)}</p>
                      </td>
                      <td className="px-6 py-4">
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
              <h2 className="text-xl font-bold mb-4">{editingProperty ? "Editar Imóvel" : "Adicionar Novo Imóvel"}</h2>
              <PropertyForm initialData={editingProperty} onSuccess={handleSuccess} onCancel={handleModalClose} />
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
