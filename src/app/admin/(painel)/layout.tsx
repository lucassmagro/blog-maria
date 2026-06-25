import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminToaster } from "@/components/admin/AdminToaster";
import { requireUser } from "@/lib/admin";

export default async function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <>
      <AdminHeader email={user.email ?? undefined} />
      <main className="mx-auto w-full max-w-[1100px] flex-grow px-5 py-8">
        {children}
      </main>
      <AdminToaster />
    </>
  );
}
