import { ReactNode } from "react";
import { Navbar } from "./Navbar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col relative overflow-hidden bg-background">
      {/* Deep decorative background element */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center">
        <div className="w-[1200px] h-[500px] bg-primary/10 rounded-full blur-[150px] -top-[200px] absolute opacity-50"></div>
      </div>
      
      <Navbar />
      
      <main className="flex-1 w-full relative z-10">
        {children}
      </main>
    </div>
  );
}