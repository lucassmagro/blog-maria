import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1200px] flex-grow px-5 pb-10">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
