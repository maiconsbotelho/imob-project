"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Contato</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo*</Label>
                    <Input id="nome" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="celular">Celular*</Label>
                    <Input id="celular" placeholder="(00) 00000-0000" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail*</Label>
                    <Input id="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade*</Label>
                    <Input id="cidade" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mensagem">Mensagem*</Label>
                  <Textarea id="mensagem" className="min-h-[150px]" required />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold h-12"
                >
                  ENVIAR FORMULÁRIO
                </Button>
              </form>
            </div>
          </div>

          {/* Map */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-3xl shadow-sm p-2 h-full min-h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3472.637207436855!2d-50.79374492440333!3d-29.49774947519965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9519343907727409%3A0xc66c04f982270929!2sR.%20Gen.%20Ernesto%20Dorneles%2C%20168%20-%20Centro%2C%20Igrejinha%20-%20RS%2C%2095650-000!5e0!3m2!1spt-BR!2sbr!4v1715000000000!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: "1rem", minHeight: "400px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
