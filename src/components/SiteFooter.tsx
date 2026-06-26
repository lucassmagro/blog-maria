import Link from "next/link";
import { SITE } from "@/lib/site";
import { LockIcon } from "@/components/icons";

export function SiteFooter() {
  const ano = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-rodape-bg text-rodape-fg">
      <div className="px-5 py-10 text-center">
        <nav
          aria-label="Redes sociais"
          className="mb-4 flex items-center justify-center gap-5"
        >
          <a
            href={SITE.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.8rem] font-bold uppercase tracking-[1px] text-borda-titulo transition-colors hover:text-white"
          >
            Instagram
          </a>
          <a
            href={SITE.social.linktree}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.8rem] font-bold uppercase tracking-[1px] text-borda-titulo transition-colors hover:text-white"
          >
            Linktree
          </a>
        </nav>
        <p className="text-[0.85rem] tracking-[0.5px] text-acento">
          &copy; {ano} {SITE.name}. Todos os direitos reservados.
        </p>
      </div>

      {/* Crédito do desenvolvedor — faixa em marrom mais escuro */}
      <div className="bg-black/25 px-5 py-3 text-center text-[0.8rem] text-rodape-fg/75">
        Feito por{" "}
        <a
          href="https://lucasmagro.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-rodape-fg underline decoration-borda-titulo underline-offset-2 transition-colors hover:text-white"
        >
          Lucas Santos Magro
        </a>
      </div>

      {/* Acesso ao painel administrativo */}
      <div className="bg-black/25 px-5 pb-4 text-center">
        <Link
          href="/admin"
          aria-label="Painel administrativo"
          title="Painel administrativo"
          className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-[0.8rem] font-bold text-rodape-fg/80 transition-colors hover:bg-white/15 hover:text-white"
        >
          <LockIcon width={14} height={14} />
          Painel
        </Link>
      </div>
    </footer>
  );
}
