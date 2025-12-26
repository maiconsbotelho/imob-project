"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

export default function NegociePage() {
  const [phone, setPhone] = useState("");
  const [cep, setCep] = useState("");
  const [errors, setErrors] = useState({ phone: "", cep: "" });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");

    setPhone(value);
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);

    value = value.replace(/^(\d{5})(\d)/, "$1-$2");

    setCep(value);
    if (errors.cep) setErrors((prev) => ({ ...prev, cep: "" }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    let hasError = false;
    const newErrors = { phone: "", cep: "" };

    const rawPhone = phone.replace(/\D/g, "");
    if (rawPhone.length < 10 || rawPhone.length > 11) {
      newErrors.phone = "Por favor, informe um número de celular válido.";
      hasError = true;
    }

    const rawCep = cep.replace(/\D/g, "");
    if (rawCep.length !== 8) {
      newErrors.cep = "Por favor, informe um CEP válido.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      toast.error("Por favor, corrija os erros no formulário.");
      return;
    }

    const message =
      `*Nova solicitação de negociação de imóvel*\n\n` +
      `*Dados Pessoais:*\n` +
      `Nome: ${data.nome}\n` +
      `Celular: ${phone}\n` +
      `E-mail: ${data.email}\n\n` +
      `*Dados do Imóvel:*\n` +
      `Tipo de Negócio: ${data.tipoNegocio}\n` +
      `Tipo de Imóvel: ${data.tipoImovel}\n` +
      `CEP: ${cep}\n` +
      `Endereço: ${data.endereco}\n\n` +
      `*Descrição:*\n${data.descricao}`;

    const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Negocie seu Imóvel</h1>

        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 max-w-5xl mx-auto">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Seus dados */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Seus dados:</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome*</Label>
                  <Input id="nome" name="nome" placeholder="Digite seu nome" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="celular">Celular*</Label>
                  <Input
                    id="celular"
                    name="celular"
                    placeholder="(00) 00000-0000"
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength={15}
                    className={errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail*</Label>
                  <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
                </div>
              </div>
            </div>

            {/* Dados do imóvel */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Dados do imóvel:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo-negocio">Você gostaria de*</Label>
                  <Select name="tipoNegocio" required>
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
                  <Select name="tipoImovel" required>
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
                  <Input
                    id="cep"
                    name="cep"
                    placeholder="00000-000"
                    required
                    value={cep}
                    onChange={handleCepChange}
                    maxLength={9}
                    className={errors.cep ? "border-red-500 focus-visible:ring-red-500" : ""}
                    aria-invalid={!!errors.cep}
                  />
                  {errors.cep && <p className="text-red-500 text-sm mt-1">{errors.cep}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="endereco">Endereço*</Label>
                  <Input id="endereco" name="endereco" placeholder="Rua, número, bairro..." required />
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
                name="descricao"
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
