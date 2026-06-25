"use client";

import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";
import { signIn, type FormState } from "@/app/admin/actions";
import { AdminToaster } from "@/components/admin/AdminToaster";

const initial: FormState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, initial);

  useEffect(() => {
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 py-16">
      <AdminToaster />
      <div className="w-full max-w-sm">
        <h1 className="text-center font-serif text-[2rem] font-bold text-texto-principal">
          Cátedra Política
        </h1>
        <p className="mt-1 text-center text-[0.8rem] font-bold uppercase tracking-[1px] text-acento">
          Acesso ao painel
        </p>

        <form action={formAction} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[0.85rem] font-medium text-texto-secundario">
              E-mail
            </span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="rounded-md border border-linha bg-transparent px-3 py-2.5 text-texto-principal focus:border-acento focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[0.85rem] font-medium text-texto-secundario">
              Senha
            </span>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="rounded-md border border-linha bg-transparent px-3 py-2.5 text-texto-principal focus:border-acento focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-full bg-acento-hover px-5 py-2.5 font-bold text-fundo transition-colors hover:bg-texto-principal disabled:opacity-60"
          >
            {pending ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
