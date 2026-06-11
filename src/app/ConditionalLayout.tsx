"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ReactNode } from "react";

export function ConditionalLayout({ children }: { children: ReactNode }) {
  const path = usePathname();
  const isTool = path === "/tool";
  return (
    <>
      {!isTool && <Navbar />}
      <main className={isTool ? "" : "pt-16"}>{children}</main>
      {!isTool && <Footer />}
    </>
  );
}
