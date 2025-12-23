"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function NegociePage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Negocie seu Imóvel</h1>

        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 max-w-5xl mx-auto">
          <form className="space-y-8">
            {/* Seus dados */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Seus dados:</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome*</Label>
                  <Input id="nome" placeholder="Digite seu nome" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="celular">Celular*</Label>
                  <Input id="celular" placeholder="(00) 00000-0000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail*</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" required />
                </div>
              </div>
            </div>

            {/* Dados do imóvel */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Dados do imóvel:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo-negocio">Você gostaria de*</Label>
                  <Select required>
                    <SelectTrigger id="tipo-negocio">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vender">Vender</SelectItem>
                      <SelectItem value="alugar">Alugar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo-imovel">Seu imóvel é*</Label>
                  <Select required>
                    <SelectTrigger id="tipo-imovel">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casa">Casa</SelectItem>
                      <SelectItem value="apartamento">Apartamento</SelectItem>
                      <SelectItem value="terreno">Terreno</SelectItem>
                      <SelectItem value="comercial">Comercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="cep">CEP*</Label>
                  <Input id="cep" placeholder="00000-000" required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="endereco">Endereço*</Label>
                  <Input id="endereco" placeholder="Rua, número, bairro..." required />
                </div>
              </div>
            </div>

            {/* Descreva seu imóvel */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Descreva seu imóvel</h2>
              <p className="text-sm text-gray-500">
                Forneça dados para valorizar o anúncio, como a condição do imóvel, destaques do bairro, vizinhança,
                ventilação e iluminação, e valores.
              </p>
              <Textarea
                className="min-h-[150px]"
                placeholder="Digite os detalhes do seu imóvel aqui..."
              />
            </div>

            <Button type="submit" size="lg" className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold h-12">
              ENVIAR FORMULÁRIO
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
