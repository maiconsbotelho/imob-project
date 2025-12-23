import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">Quem somos</h1>

        <div className="flex flex-col md:flex-row items-center gap-12 bg-white p-8 md:p-12 rounded-3xl shadow-sm">
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md aspect-square">
              <Image
                src="/logo.png"
                alt="ImóvelPro Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">Missão:</h2>
              <p className="text-gray-600 leading-relaxed text-lg text-justify">
                Na ImóvelPro, nossa missão é realizar sonhos e moldar o futuro com paixão e compromisso. Somos mais do
                que uma imobiliária; somos arquitetos de destinos e criadores de oportunidades. Nosso propósito é guiar
                cada cliente na jornada para encontrar o lar dos seus sonhos ou o investimento perfeito, sempre com
                integridade, inovação e uma dedicação inabalável.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg text-justify">
                Valorizamos cada relacionamento como uma parceria vital, construindo laços sólidos e duradouros com nossos
                clientes e com a região que chamamos de lar. Acreditamos no poder transformador de um lar bem escolhido e
                no impacto positivo que podemos ter em cada vida que tocamos. Juntos, construímos mais do que imóveis;
                construímos futuros brilhantes e inesquecíveis.
              </p>
            </div>

            <div className="pt-4">
              <Link href="/contato">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
                  Entrar em contato
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
