import Navbar from "@/components/Navbar";

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64 }}>{children}</main>
    </>
  );
}
