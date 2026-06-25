import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-[1200px] flex-grow flex-col items-center justify-center px-5 py-20 text-center">
        <p className="text-[0.8rem] font-bold uppercase tracking-[0.5px] text-texto-secundario">
          Erro 404
        </p>
        <h2 className="mt-3 text-[2.1rem] sm:text-[2.6rem]">
          Página não encontrada
        </h2>
        <p className="mt-4 max-w-md text-texto-secundario">
          A página que você procura pode ter sido movida ou não existe mais.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-full border border-acento-hover bg-acento-hover px-5 py-2 text-[0.85rem] font-bold uppercase tracking-[0.5px] text-fundo transition-colors hover:bg-texto-principal"
        >
          Voltar para a página inicial
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
