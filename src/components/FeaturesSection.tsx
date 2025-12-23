"use client";

import { Award, Clock, Home, MapPin, Shield, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: Home,
    title: "Ampla Variedade",
    description: "Milhares de opções de imóveis residenciais e comerciais para todos os gostos.",
    bgColor: "bg-blue-500/10",
    hoverBgColor: "group-hover:bg-blue-500/20",
    iconColor: "text-blue-500",
  },
  {
    icon: TrendingUp,
    title: "Melhores Taxas",
    description: "Garantimos as melhores condições de financiamento e negociação do mercado.",
    bgColor: "bg-green-500/10",
    hoverBgColor: "group-hover:bg-green-500/20",
    iconColor: "text-green-500",
  },
  {
    icon: Shield,
    title: "Segurança Total",
    description: "Processo de compra e venda transparente, com suporte jurídico completo.",
    bgColor: "bg-purple-500/10",
    hoverBgColor: "group-hover:bg-purple-500/20",
    iconColor: "text-purple-500",
  },
  {
    icon: MapPin,
    title: "Localização Prime",
    description: "Imóveis situados nas regiões mais valorizadas e estratégicas da cidade.",
    bgColor: "bg-orange-500/10",
    hoverBgColor: "group-hover:bg-orange-500/20",
    iconColor: "text-orange-500",
  },
  {
    icon: Award,
    title: "Atendimento Premium",
    description: "Equipe especializada pronta para atender suas necessidades com excelência.",
    bgColor: "bg-yellow-500/10",
    hoverBgColor: "group-hover:bg-yellow-500/20",
    iconColor: "text-yellow-500",
  },
  {
    icon: Clock,
    title: "Agilidade",
    description: "Processos desburocratizados para você conquistar seu imóvel mais rápido.",
    bgColor: "bg-red-500/10",
    hoverBgColor: "group-hover:bg-red-500/20",
    iconColor: "text-red-500",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-[0.03] pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600 blur-[100px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-600 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="py-1.5 px-3 sm:py-2 sm:px-4 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] sm:text-xs tracking-wider uppercase">
              Por que nos escolher
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-gray-900 mb-6 tracking-tight leading-tight"
          >
            Experiência Imobiliária <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              de Outro Nível
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-gray-600 leading-relaxed"
          >
            Combinamos tecnologia de ponta e expertise humana para tornar sua jornada imobiliária não apenas simples,
            mas memorável.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-8 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden"
            >
              <div
                className={`absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500`}
              >
                <feature.icon className="w-32 h-32 text-gray-900" />
              </div>

              <div className="relative z-10">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${feature.bgColor} ${feature.hoverBgColor}`}
                >
                  <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
              </div>

              {/* Gradient Border Effect on Hover */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-100 rounded-3xl transition-colors duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
