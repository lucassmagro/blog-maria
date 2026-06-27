import Link from "next/link";
import { SITE } from "@/lib/site";
import { LockIcon } from "@/components/icons";

export function SiteFooter() {
  const ano = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-rodape-bg text-rodape-fg">
      <div className="relative px-5 py-10 text-center">
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
      <div className="relative bg-black/25 px-5 py-3 text-center text-[0.8rem] text-rodape-fg/75">
        Feito por{" "}
        <a
          href="https://lucasmagro.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-rodape-fg underline decoration-borda-titulo underline-offset-2 transition-colors hover:text-white"
        >
          Lucas Santos Magro
        </a>

        {/* Acesso ao painel administrativo — esquerda, alinhado ao texto */}
        <Link
          href="/admin"
          aria-label="Painel administrativo"
          title="Painel administrativo"
          className="absolute left-5 top-1/2 inline-flex -translate-y-1/2 items-center gap-1.5 text-[0.8rem] font-bold text-rodape-fg/55 transition-colors hover:text-rodape-fg"
        >
          <LockIcon width={14} height={14} />
          Painel
        </Link>
      </div>
    </footer>
  );
}
