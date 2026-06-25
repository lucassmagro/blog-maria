import type { Metadata } from "next";

// A área administrativa nunca deve ser indexada.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Admin",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
