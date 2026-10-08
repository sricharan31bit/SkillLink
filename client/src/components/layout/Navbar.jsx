import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  Sparkles,
  Briefcase,
  PlusCircle,
  FileText,
  User,
  LogOut,
  Menu,
  X,
  Layers,
  LayoutGrid,
} from "lucide-react";

function Navbar() {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      addToast("Successfully logged out. See you soon!", "info");
      navigate("/login");
    } catch {
      addToast("Failed to logout", "error");
    }
  };

  const isActive = (path) => location.pathname === path;
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/85 border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to={user ? "/portal" : "/"}
            className="flex items-center gap-2.5 group transition-transform duration-200 hover:scale-[1.02]"
            onClick={closeMenu}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-transparent">
                Skill<span className="text-indigo-600">Link</span>
              </span>
              <span className="text-[10px] font-medium tracking-wider uppercase text-slate-400 -mt-1 hidden sm:block">
                Smart Match Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {user ? (
              <>
                <Link
                  to="/portal"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                    isActive("/portal")
                      ? "bg-indigo-50/80 text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4 text-indigo-500" />
                  <span>Talent & Project Hub</span>
                </Link>

                {user.role === "freelancer" && (
                  <>
                    <Link
                      to="/my-proposals"
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                        isActive("/my-proposals")
                          ? "bg-indigo-50/80 text-indigo-700 shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                      }`}
                    >
                      <FileText className="w-4 h-4 text-indigo-500" />
                      <span>My Proposals</span>
                    </Link>
                    <Link
                      to="/profile"
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                        isActive("/profile")
                          ? "bg-indigo-50/80 text-indigo-700 shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                      }`}
                    >
                      <User className="w-4 h-4 text-indigo-500" />
                      <span>Profile Studio</span>
                    </Link>
                  </>
                )}

                {user.role === "client" && (
                  <Link
                    to="/post-project"
                    className="flex items-center gap-2 ml-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/35 hover:brightness-105 transition"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Post a Project</span>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                    isActive("/")
                      ? "bg-indigo-50/80 text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
                >
                  <span>Overview</span>
                </Link>
              </>
            )}
          </nav>

          {/* Right Action / User Area */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center border border-indigo-200/80 shadow-xs">
                    {user.name ? user.name.slice(0, 2).toUpperCase() : "U"}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[11px] capitalize font-medium text-slate-400">
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100/70 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2 rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:brightness-105 transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2">
          {user ? (
            <>
              <Link
                to="/portal"
                onClick={closeMenu}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                  isActive("/portal") ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <LayoutGrid className="w-4 h-4 text-indigo-500" />
                <span>Talent & Project Hub</span>
              </Link>

              {user.role === "freelancer" && (
                <>
                  <Link
                    to="/my-proposals"
                    onClick={closeMenu}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                      isActive("/my-proposals")
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <FileText className="w-4 h-4 text-indigo-500" />
                    <span>My Proposals</span>
                  </Link>
                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                      isActive("/profile")
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <User className="w-4 h-4 text-indigo-500" />
                    <span>Profile Studio</span>
                  </Link>
                </>
              )}

              {user.role === "client" && (
                <Link
                  to="/post-project"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Post a Project</span>
                </Link>
              )}
            </>
          ) : (
            <Link
              to="/"
              onClick={closeMenu}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <span>Platform Overview</span>
            </Link>
          )}

          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                    {user.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    closeMenu();
                    handleLogout();
                  }}
                  className="text-xs font-semibold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="text-center py-2 text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="text-center py-2 text-sm font-semibold bg-indigo-600 text-white rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;