import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Ana Sayfa", href: "#home" },
    { name: "Turlar", href: "#tours" },
    { name: "Hakkımızda", href: "#about" },
    { name: "Galeri", href: "#gallery" },
    { name: "SSS", href: "#faq" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md py-4 shadow-sm"
          : "bg-transparent py-8"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center">
          <span className={`text-2xl md:text-3xl font-display italic font-semibold ${isScrolled ? 'text-foreground' : 'text-background'}`}>
            Cyprigo
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-12">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-base font-medium tracking-wide transition-all duration-300 ${
                isScrolled 
                  ? 'text-foreground/80 hover:text-foreground' 
                  : 'text-background/90 hover:text-background'
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center">
          <a 
            href="#" 
            className={`text-sm font-medium transition-colors ${
              isScrolled ? 'text-foreground' : 'text-background'
            }`}
          >
            Giriş Yap
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`lg:hidden w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
            isScrolled 
              ? 'border border-border hover:bg-muted' 
              : 'bg-background/10 backdrop-blur-sm border border-background/30 hover:bg-background/20'
          }`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={`h-5 w-5 ${isScrolled ? 'text-foreground' : 'text-background'}`} />
          ) : (
            <Menu className={`h-5 w-5 ${isScrolled ? 'text-foreground' : 'text-background'}`} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-background mt-2 mx-4 rounded-2xl p-8 shadow-lg border border-border animate-fade-in">
          <div className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-foreground/70 hover:text-foreground transition-colors duration-300 text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 border-t border-border">
              <a href="#" className="text-foreground font-medium">
                Giriş Yap
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
