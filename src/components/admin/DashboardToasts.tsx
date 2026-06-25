"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

const MENSAGENS: Record<string, string> = {
  criado: "Publicação criada.",
  editado: "Publicação atualizada.",
  excluido: "Publicação excluída.",
  publicado: "Publicação publicada.",
  despublicado: "Publicação despublicada.",
};

/** Mostra um toast de sucesso após ações que redirecionam com ?ok=... */
export function DashboardToasts() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ok = searchParams.get("ok");

  useEffect(() => {
    if (ok && MENSAGENS[ok]) {
      toast.success(MENSAGENS[ok]);
      router.replace("/admin");
    }
  }, [ok, router]);

  return null;
}
