import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useGetMe } from "@workspace/api-client-react";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [location] = useLocation();
  const { data: user } = useGetMe();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/cards", label: "Cards" },
    { href: "/shop", label: "Shop" },
    { href: "/pokemon", label: "Pokemon" },
    { href: "/leaderboard", label: "Leaderboard" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <img src={`${import.meta.env.BASE_URL}aqua.jpg`} alt="Aqua" className="w-8 h-8 rounded-full border border-primary/50 object-cover" />
            <span className="font-bold text-xl text-white tracking-tight">KonoBot</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === link.href ? "text-primary" : "text-white/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          {user ? (
            <Link href="/profile">
              <Button variant="default" className="rounded-full shadow-[0_0_15px_rgba(0,168,232,0.3)]">
                Profile
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="outline" className="rounded-full border-primary/50 text-white hover:bg-primary/20">
                Login
              </Button>
            </Link>
          )}
        </div>

        <button 
          className="md:hidden p-2 text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-background absolute top-16 left-0 w-full">
          <div className="flex flex-col p-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-base font-medium transition-colors ${
                  location === link.href ? "text-primary" : "text-white/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full">Profile</Button>
              </Link>
            ) : (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}