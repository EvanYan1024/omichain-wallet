import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LogIn,
  UserRound,
  Server,
  ChartBar,
  CalendarDays,
  Home,
  LogOut,
} from "lucide-react";
import { cn } from "../../lib/utils";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  // <Link to='/'>Home</Link>
  //       <Link to='/web3modal'>Web3Modal</Link>
  //       <Link to='/signin'>SignIn</Link>
  //       <Link to='/eth'>ETH</Link>
  //       <Link to='/rainbow'>Rainbow</Link>
  //       {/* <Link>ADA</Link> */}
  //       <Link to='/starknet'>Starknet</Link>

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Web3Modal", path: "/web3modal", icon: UserRound },
    { name: "SignIn", path: "/signin", icon: LogIn },
    { name: "ETH", path: "/eth", icon: Server },
    { name: "Rainbow", path: "/rainbow", icon: Server },
    { name: "Starknet", path: "/starknet", icon: Server },
    {
      name: "Solana",
      path: "solana",
      icon: Server,
    },
  ];

  return (
    <nav
      className={cn(
        "bg-base-100 shadow-sm fixed top-0 w-full z-50 transition-all duration-300 px-6 md:px-12 lg:px-16",
        scrolled || open
          ? "py-4 bg-background/90 backdrop-blur-lg border-b border-border"
          : "py-6"
      )}
    >
      <div className="flex items-center justify-between">
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "text-sm font-medium transition-colors rounded-box z-1 p-2",
                isActive(item.path) ? "text-purple" : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden py-4 mt-4 animate-fade-in">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg transition-colors",
                  isActive(item.path)
                    ? "bg-secondary text-zkom-purple"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
                onClick={() => setOpen(false)}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
