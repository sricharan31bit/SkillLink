import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Layers,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Briefcase,
  Users,
  CheckCircle2,
  Lock,
  BarChart3,
  Search,
  Star,
  Target,
  Clock,
} from "lucide-react";

function Landing() {
  const { user } = useAuth();

  return (
    <div className="relative pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32 gradient-mesh border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-50/90 text-indigo-700 border border-indigo-200/80 shadow-xs mb-6 animate-in fade-in slide-in-from-top-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Next-Generation Smart Match Freelance Marketplace</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Precision Talent Matching Meets{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                Milestone Risk Protection
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
              Connect visionary clients with elite freelance engineers through multi-factor skill algorithms, transparent milestone escrow, and predictive project health telemetry.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              {user ? (
                <Link
                  to="/portal"
                  className="px-8 py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition duration-200 flex items-center gap-2"
                >
                  <span>Enter Talent Hub & Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-8 py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition duration-200 flex items-center gap-2"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <Link
                    to="/login"
                    className="px-8 py-4 rounded-2xl font-bold text-base bg-white text-slate-700 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 shadow-xs hover:-translate-y-0.5 transition duration-200"
                  >
                    Sign In to Workspace
                  </Link>
                </>
              )}
            </div>

            {/* If Logged in notice */}
            {user && (
              <p className="text-xs text-slate-500 mt-4">
                Logged in as <strong className="text-slate-800">{user.name}</strong> ({user.role})
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Two Dedicated Gateways: For Clients & For Freelancers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Tailored Ecosystem
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
            Built for Both Sides of Exceptional Work
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Clients Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-indigo-300 transition duration-300">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">For Clients & Companies</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Define your project scope and let our matching engine surface top-tier candidates with proven overlapping skills and availability.
              </p>

              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Algorithmic skill match scores with 4-factor breakdown</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Milestone health tracking & predictive risk radar</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Review proposals side-by-side with 1-click hiring</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 mt-8 border-t border-slate-100">
              <Link
                to={user ? "/portal?tab=projects" : "/register"}
                className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700"
              >
                <span>{user ? "View Client Opportunities" : "Post a Project as Client"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* For Freelancers Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-cyan-300 transition duration-300">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 to-indigo-500" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">For Freelance Engineers</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Showcase your verified technical competencies, set your hourly rate, and bid on high-budget projects with safe escrow contracts.
              </p>

              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span>Interactive profile studio with live candidate card preview</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span>Direct proposal pipeline with transparent bid status</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span>Protected milestone checkpoints with on-time delivery metrics</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 mt-8 border-t border-slate-100">
              <Link
                to={user ? "/portal?tab=freelancers" : "/register"}
                className="inline-flex items-center gap-2 text-sm font-bold text-cyan-600 hover:text-cyan-700"
              >
                <span>{user ? "Explore Freelancer Talent" : "Join as Freelancer"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Capabilities Grid */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Why SkillLink
            </span>
            <h2 className="text-3xl font-extrabold mt-1">Engineered for Transparency & Speed</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/80">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold mb-2">Smart Match Algorithm</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Calculates weighted affinity across skill vectors (40%), historical rating (25%), experience level (20%), and current availability (15%).
              </p>
            </div>

            <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold mb-2">Milestone Health Radar</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Real-time progress donut charts, velocity extrapolation, and proactive risk classifications (Healthy, Attention, Critical).
              </p>
            </div>

            <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/80">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold mb-2">Protected Contract Terms</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Milestone weights ensure funds are allocated logically with clear deliverables before completion sign-off.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
