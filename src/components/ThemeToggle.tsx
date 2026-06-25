"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@/components/icons";

/**
 * Alterna entre tema claro e escuro. A preferência fica em localStorage
 * ("tema"). O tema inicial é aplicado por um script inline no layout (antes da
 * pintura), evitando flash; aqui apenas sincronizamos o ícone e os cliques.
 */
export function ThemeToggle() {
  const [escuro, setEscuro] = useState(false);
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setEscuro(document.documentElement.classList.contains("dark"));
    setMontado(true);
  }, []);

  function alternar() {
    const proximo = !escuro;
    setEscuro(proximo);
    document.documentElement.classList.toggle("dark", proximo);
    try {
      localStorage.setItem("tema", proximo ? "escuro" : "claro");
    } catch {
      // ignora indisponibilidade de localStorage
    }
  }

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={escuro ? "Ativar tema claro" : "Ativar tema escuro"}
      aria-pressed={escuro}
      title={escuro ? "Tema claro" : "Tema escuro"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-linha text-texto-secundario transition-colors hover:border-acento hover:text-acento-hover"
    >
      {/* Antes de montar, evita divergência de hidratação mostrando o ícone neutro */}
      {montado && escuro ? <SunIcon width={18} height={18} /> : <MoonIcon width={18} height={18} />}
    </button>
  );
}
