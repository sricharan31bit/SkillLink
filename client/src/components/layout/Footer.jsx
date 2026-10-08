import { Layers, ShieldCheck, Zap, Sparkles, Heart } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-200/80 bg-white/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Skill<span className="text-indigo-600">Link</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              The next-generation marketplace connecting visionaries with top talent using algorithmic skill-matching and milestone risk forecasting.
            </p>
          </div>

          {/* Platform Pillars */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Core Capabilities
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>AI Skill Matchmaking</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-500" />
                <span>Milestone Risk Predictor</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <span>Safe Escrow Contracts</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/" className="hover:text-indigo-600 transition">
                  Browse All Projects
                </Link>
              </li>
              <li>
                <Link to="/post-project" className="hover:text-indigo-600 transition">
                  Post a Project
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-indigo-600 transition">
                  Freelancer Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Technology Stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {["React 19", "Vite", "TailwindCSS v4", "Express.js", "MongoDB", "Recharts"].map(
                (tech) => (
                  <span
                    key={tech}
                    className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Designed with high-clarity UX & sub-second response times.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} SkillLink Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with modern web standards & performance excellence.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
