import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getProjects } from "../api/project.api";
import { StatusBadge } from "../components/common/Badge";
import {
  Search,
  Filter,
  DollarSign,
  Calendar,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle,
  Briefcase,
  Users,
  Shield,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProjects();
        setProjects(res.data.projects || []);
      } catch (err) {
        setError("Failed to load projects. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Collect all unique skills
  const availableSkills = useMemo(() => {
    const skillSet = new Set();
    projects.forEach((p) => {
      if (Array.isArray(p.requiredSkills)) {
        p.requiredSkills.forEach((s) => skillSet.add(s));
      }
    });
    return Array.from(skillSet);
  }, [projects]);

  // Filtered and sorted projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        const matchesSearch =
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesSkill =
          selectedSkill === "all" ||
          (Array.isArray(project.requiredSkills) &&
            project.requiredSkills.some(
              (s) => s.toLowerCase() === selectedSkill.toLowerCase()
            ));

        const matchesStatus =
          statusFilter === "all" || project.status === statusFilter;

        return matchesSearch && matchesSkill && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "highest-budget") {
          return b.budget - a.budget;
        }
        if (sortBy === "lowest-budget") {
          return a.budget - b.budget;
        }
        // default newest
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [projects, searchTerm, selectedSkill, statusFilter, sortBy]);

  return (
    <div className="relative pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 gradient-mesh border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50/90 text-indigo-700 border border-indigo-200/80 shadow-xs mb-6 animate-in fade-in slide-in-from-top-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Next-Gen Smart Match Freelance Marketplace</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Where Elite Talent Meets{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                High-Impact Projects
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
              Find verified freelancers matched through intelligent skill scoring, protected milestones, and predictive project health metrics.
            </p>

            {/* Quick Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {user?.role === "client" ? (
                <Link
                  to="/post-project"
                  className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition duration-200"
                >
                  Post a New Project
                </Link>
              ) : (
                <a
                  href="#projects-directory"
                  className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition duration-200"
                >
                  Explore Open Opportunities
                </a>
              )}
              {user?.role === "freelancer" && (
                <Link
                  to="/profile"
                  className="px-6 py-3.5 rounded-xl font-bold text-sm bg-white text-slate-700 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 shadow-xs hover:-translate-y-0.5 transition duration-200"
                >
                  Optimize My Profile
                </Link>
              )}
            </div>

            {/* Metric Highlights */}
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2 text-indigo-600 mb-1">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Active Projects
                  </span>
                </div>
                <p className="text-2xl font-black text-slate-900">{projects.length}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Open & In-Flight</p>
              </div>

              <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2 text-emerald-600 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Match Precision
                  </span>
                </div>
                <p className="text-2xl font-black text-slate-900">98.4%</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Skill Fit Accuracy</p>
              </div>

              <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2 text-cyan-600 mb-1">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Milestones
                  </span>
                </div>
                <p className="text-2xl font-black text-slate-900">100%</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Risk-Monitored</p>
              </div>

              <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2 text-indigo-600 mb-1">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Contract Escrow
                  </span>
                </div>
                <p className="text-2xl font-black text-slate-900">Protected</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Zero Prepayment Risk</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Project Directory */}
      <section id="projects-directory" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects by title, keywords, or requirements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open for Proposals</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              {/* Sort selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
              >
                <option value="newest">Sort: Newest</option>
                <option value="highest-budget">Sort: Highest Budget</option>
                <option value="lowest-budget">Sort: Lowest Budget</option>
              </select>
            </div>
          </div>

          {/* Quick Skill Tag Chips */}
          {availableSkills.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Skill:
              </span>
              <button
                onClick={() => setSelectedSkill("all")}
                className={`text-xs px-3 py-1 rounded-lg font-semibold shrink-0 transition ${
                  selectedSkill === "all"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Skills
              </button>
              {availableSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => setSelectedSkill(skill)}
                  className={`text-xs px-3 py-1 rounded-lg font-semibold shrink-0 transition ${
                    selectedSkill === skill
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Header row with count */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Available Opportunities{" "}
            <span className="text-slate-400 font-normal text-lg">
              ({filteredProjects.length})
            </span>
          </h2>
          {user?.role === "client" && (
            <Link
              to="/post-project"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Post another project &rarr;
            </Link>
          )}
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs animate-pulse space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div className="h-6 w-24 bg-slate-200 rounded-full" />
                  <div className="h-5 w-16 bg-slate-200 rounded-full" />
                </div>
                <div className="h-7 w-3/4 bg-slate-200 rounded-lg" />
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-full" />
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-slate-200 rounded-md" />
                  <div className="h-6 w-16 bg-slate-200 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-center">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredProjects.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No matching projects found</h3>
            <p className="text-sm text-slate-500 mt-1 mb-6">
              Try adjusting your search criteria, skill filters, or status options.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedSkill("all");
                setStatusFilter("all");
              }}
              className="px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project) => {
              const isOwner = user && project.client?._id === user.id;

              return (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="group bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between card-hover shadow-xs relative overflow-hidden"
                >
                  {/* Top highlight bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition duration-300" />

                  <div>
                    {/* Top Row: Client & Status Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center border border-slate-200">
                          {project.client?.name ? project.client.name.slice(0, 1) : "C"}
                        </div>
                        <span className="text-xs font-semibold text-slate-600 truncate max-w-[140px]">
                          {project.client?.name || "Client"}
                        </span>
                        {isOwner && (
                          <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded-md border border-indigo-200/60">
                            Your Project
                          </span>
                        )}
                      </div>
                      <StatusBadge status={project.status} />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition flex items-center justify-between gap-2">
                      <span>{project.title}</span>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition shrink-0" />
                    </h3>

                    {/* Description */}
                    <p className="text-slate-600 text-sm mt-2 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {project.requiredSkills?.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs font-medium bg-slate-100/80 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/60 group-hover:border-indigo-100 transition"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom: Budget & Deadline */}
                  <div className="pt-5 mt-6 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block -mb-0.5">
                          Budget
                        </span>
                        <span className="text-base font-extrabold text-slate-900">
                          ${project.budget?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {project.deadline && (
                      <div className="flex items-center gap-1.5 text-right">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block -mb-0.5">
                            Deadline
                          </span>
                          <span className="text-xs font-semibold text-slate-700">
                            {new Date(project.deadline).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;