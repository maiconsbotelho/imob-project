"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "./ui/button";

export function ParallaxSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-30%", "30%"]);

  return (
    <section ref={ref} className="relative h-[500px] overflow-hidden flex items-center justify-center">
      <motion.div style={{ y }} className="absolute w-full h-[160%] -top-[30%] z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/paralax.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
      </motion.div>

      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-6xl font-black mb-6 tracking-tight"
        >
          Viva a Experiência <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Completa</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto text-gray-200 leading-relaxed"
        >
          Não vendemos apenas imóveis, realizamos sonhos. Venha conhecer nosso portfólio exclusivo e encontre o lugar
          perfeito para sua história.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/imoveis">
            <Button
              size="lg"
              className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.6)] border border-blue-500/50"
            >
              Agendar Visita
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
