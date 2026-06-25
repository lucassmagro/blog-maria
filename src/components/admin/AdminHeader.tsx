import Link from "next/link";
import { signOut } from "@/app/admin/actions";
import { ThemeToggle } from "@/components/ThemeToggle";

export function AdminHeader({ email }: { email?: string }) {
  return (
    <header className="border-b border-linha">
      <div className="mx-auto flex w-full max-w-[1100px] flex-wrap items-center justify-between gap-3 px-5 py-4">
        <div className="flex items-baseline gap-2">
          <Link
            href="/admin"
            className="font-serif text-[1.3rem] font-bold text-texto-principal"
          >
            Cátedra Política
          </Link>
          <span className="text-[0.72rem] font-bold uppercase tracking-[1px] text-acento">
            Painel
          </span>
        </div>

        <div className="flex items-center gap-4 text-[0.85rem]">
          {email ? (
            <span className="hidden text-texto-secundario min-[520px]:inline">
              {email}
            </span>
          ) : null}
          <Link
            href="/"
            target="_blank"
            className="font-medium text-texto-secundario transition-colors hover:text-acento-hover"
          >
            Ver site
          </Link>
          <ThemeToggle />
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-full border border-linha px-3 py-1.5 font-bold text-texto-secundario transition-colors hover:border-acento hover:text-acento-hover"
            >
              Sair
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
