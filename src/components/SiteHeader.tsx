import Link from "next/link";
import { SITE } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="px-5 py-12 text-center sm:py-14">
      <h1 className="inline-block text-[2.2rem] leading-none sm:text-[2.8rem]">
        <Link
          href="/"
          className="inline-block border-b-2 border-borda-titulo pb-2 text-texto-principal transition-colors hover:text-acento-hover"
        >
          {SITE.name}
        </Link>
      </h1>
    </header>
  );
}
