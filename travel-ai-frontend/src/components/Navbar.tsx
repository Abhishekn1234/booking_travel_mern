import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../store/auth.store";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/upload", label: "Upload" },
  { to: "/itineraries", label: "My Trips" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, token } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    [
      "rounded-xl px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200",
      isActive
        ? "bg-slate-950 text-white shadow-sm"
        : "text-slate-700 hover:bg-slate-50 hover:text-slate-950",
    ].join(" ");

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(token ? "/dashboard" : "/")}
          className="flex items-center gap-3 text-left"
        >
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-sky-600 via-indigo-500 to-emerald-500 text-base font-black text-white shadow-sm">
            TA
          </span>
          <span className="leading-tight">
            <span className="block text-base font-black text-slate-950">
              Travel AI
            </span>
            <span className="hidden text-xs font-medium text-slate-500 sm:block">
              Smart trip parser
            </span>
          </span>
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {token ? (
            <>
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={navClass}>
                  {item.label}
                </NavLink>
              ))}

              <div className="ml-3 hidden max-w-40 truncate text-sm font-semibold text-slate-700 lg:block">
                {user?.name ?? "Traveler"}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="ml-2 rounded-xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/" className={navClass}>
                Login
              </NavLink>
              <Link
                to="/register"
                className="rounded-xl bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white/80 text-lg font-semibold text-slate-800 shadow-sm transition hover:bg-white md:hidden"
          aria-label="Toggle navigation"
        >
          {menuOpen ? "X" : "Menu"}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-slate-200/70 bg-white/80 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex flex-col gap-2">
            {token ? (
              <>
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={navClass}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl bg-slate-950 px-3 py-2 text-left text-sm font-semibold text-white shadow-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/"
                  className={navClass}
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={navClass}
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
