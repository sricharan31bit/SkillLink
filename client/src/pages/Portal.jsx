import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getProjects } from "../api/project.api";
import { getAllProfiles } from "../api/profile.api";
import { getMyProposals } from "../api/proposal.api";
import { useAuth } from "../context/AuthContext";
import { StatusBadge } from "../components/common/Badge";
import {
  Layers,
  Briefcase,
  Users,
  Sparkles,
  DollarSign,
  Calendar,
  ArrowRight,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  Star,
  PlusCircle,
  FileText,
  BarChart3,
  TrendingUp,
  Shield,
  SlidersHorizontal,
  Mail,
  UserCheck,
} from "lucide-react";

function Portal() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active view tab: "projects" | "freelancers" | "my-workspace"
  const activeTab = searchParams.get("tab") || "projects";

  // Data states
  const [projects, setProjects] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [myProposals, setMyProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchPortalData = async () => {
      setLoading(true);
      setError("");
      try {
        const [projRes, freeRes, propRes] = await Promise.all([
          getProjects().catch(() => ({ data: { projects: [] } })),
          getAllProfiles().catch(() => ({ data: { profiles: [] } })),
          user?.role === "freelancer"
            ? getMyProposals().catch(() => ({ data: { proposals: [] } }))
            : Promise.resolve({ data: { proposals: [] } }),
        ]);

        setProjects(projRes.data?.projects || []);
        setFreelancers(freeRes.data?.profiles || []);
        setMyProposals(propRes.data?.proposals || []);
      } catch (err) {
        setError("Failed to load platform data. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    };

    fetchPortalData();
  }, [user]);

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
    setSearchTerm("");
    setSelectedSkill("all");
  };

  // Collect unique skills from projects and freelancers
  const allSkills = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => p.requiredSkills?.forEach((s) => set.add(s)));
    freelancers.forEach((f) => f.skills?.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [projects, freelancers]);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        const matchesSearch =
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (project.client?.name &&
            project.client.name.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesSkill =
          selectedSkill === "all" ||
          project.requiredSkills?.some(
            (s) => s.toLowerCase() === selectedSkill.toLowerCase()
          );

        const matchesStatus =
          statusFilter === "all" || project.status === statusFilter;

        return matchesSearch && matchesSkill && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "highest-budget") return b.budget - a.budget;
        if (sortBy === "lowest-budget") return a.budget - b.budget;
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [projects, searchTerm, selectedSkill, statusFilter, sortBy]);

  // Filtered Freelancers
  const filteredFreelancers = useMemo(() => {
    return freelancers
      .filter((f) => {
        const name = f.user?.name || "";
        const bio = f.bio || "";
        const matchesSearch =
          name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bio.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesSkill =
          selectedSkill === "all" ||
          f.skills?.some((s) => s.toLowerCase() === selectedSkill.toLowerCase());

        const matchesAvailability =
          statusFilter === "all" || f.availability === statusFilter;

        return matchesSearch && matchesSkill && matchesAvailability;
      })
      .sort((a, b) => {
        if (sortBy === "highest-rate") return b.hourlyRate - a.hourlyRate;
        if (sortBy === "lowest-rate") return a.hourlyRate - b.hourlyRate;
        if (sortBy === "most-experience") return b.experience - a.experience;
        return (b.rating || 0) - (a.rating || 0);
      });
  }, [freelancers, searchTerm, selectedSkill, statusFilter, sortBy]);

  // Client's own projects
  const myClientProjects = useMemo(() => {
    if (!user || user.role !== "client") return [];
    return projects.filter((p) => p.client?._id === user.id);
  }, [projects, user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome & Role Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>SkillLink Central Data Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || "Professional"}!
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Explore live client project listings, browse registered freelance talent, and track contract milestones in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {user?.role === "client" && (
              <Link
                to="/post-project"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:brightness-110 transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post New Project</span>
              </Link>
            )}
            {user?.role === "freelancer" && (
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-white text-slate-900 shadow-sm hover:bg-slate-100 transition"
              >
                <UserCheck className="w-4 h-4 text-indigo-600" />
                <span>Update Freelancer Profile</span>
              </Link>
            )}
          </div>
        </div>

        {/* Global Key Metrics Telemetry */}
        <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">
              Client Projects
            </span>
            <span className="text-xl font-black text-white">{projects.length}</span>
            <span className="text-slate-400 block text-[11px]">Active Opportunities</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">
              Verified Freelancers
            </span>
            <span className="text-xl font-black text-indigo-300">{freelancers.length}</span>
            <span className="text-slate-400 block text-[11px]">Available for Hire</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">
              Escrow Protection
            </span>
            <span className="text-xl font-black text-emerald-300">100%</span>
            <span className="text-slate-400 block text-[11px]">Milestone Guaranteed</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">
              Your Workspace
            </span>
            <span className="text-xl font-black text-cyan-300 capitalize">{user?.role}</span>
            <span className="text-slate-400 block text-[11px]">{user?.email}</span>
          </div>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => handleTabChange("projects")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition shrink-0 ${
              activeTab === "projects"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Client Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => handleTabChange("freelancers")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition shrink-0 ${
              activeTab === "freelancers"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Freelancer Talent Pool ({freelancers.length})</span>
          </button>

          <button
            onClick={() => handleTabChange("my-workspace")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition shrink-0 ${
              activeTab === "my-workspace"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>
              {user?.role === "client" ? "My Posted Projects" : "My Applications & Status"}
            </span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar for Projects & Freelancers */}
      {activeTab !== "my-workspace" && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={
                  activeTab === "projects"
                    ? "Search projects by title, deliverables, or client name..."
                    : "Search freelancers by name, bio, or specializations..."
                }
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

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status or Availability Filter */}
              {activeTab === "projects" ? (
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                >
                  <option value="all">All Project Statuses</option>
                  <option value="open">Open for Proposals</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              ) : (
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                >
                  <option value="all">All Availability</option>
                  <option value="available">Available Now</option>
                  <option value="busy">Busy / Limited</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              )}

              {/* Sort selector */}
              {activeTab === "projects" ? (
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="highest-budget">Sort: Highest Budget</option>
                  <option value="lowest-budget">Sort: Lowest Budget</option>
                </select>
              ) : (
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                >
                  <option value="highest-rating">Sort: Top Rating</option>
                  <option value="most-experience">Sort: Experience</option>
                  <option value="lowest-rate">Sort: Hourly Rate (Low to High)</option>
                  <option value="highest-rate">Sort: Hourly Rate (High to Low)</option>
                </select>
              )}
            </div>
          </div>

          {/* Quick Skill Tag Chips */}
          {allSkills.length > 0 && (
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
              {allSkills.slice(0, 10).map((skill) => (
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
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Aggregating client and freelancer data...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-center mb-8">
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* TAB 1: CLIENT PROJECTS DATA */}
      {!loading && !error && activeTab === "projects" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Open Client Projects{" "}
              <span className="text-slate-400 font-normal text-sm">
                ({filteredProjects.length} found)
              </span>
            </h2>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No projects match your filter</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Try resetting search terms or selecting another skill filter.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSkill("all");
                  setStatusFilter("all");
                }}
                className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-100 transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((project) => {
                const isOwner = user && project.client?._id === user.id;

                return (
                  <Link
                    key={project._id}
                    to={`/projects/${project._id}`}
                    className="group bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between card-hover shadow-xs relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition duration-300" />

                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200">
                            {project.client?.name ? project.client.name.slice(0, 1) : "C"}
                          </div>
                          <span className="text-xs font-semibold text-slate-600 truncate max-w-[140px]">
                            {project.client?.name || "Client"}
                          </span>
                          {isOwner && (
                            <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded-md border border-indigo-200/60">
                              Your Post
                            </span>
                          )}
                        </div>
                        <StatusBadge status={project.status} />
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition flex items-center justify-between gap-2">
                        <span>{project.title}</span>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition shrink-0" />
                      </h3>

                      <p className="text-slate-600 text-sm mt-2 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {project.requiredSkills?.map((skill) => (
                          <span
                            key={skill}
                            className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/60"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

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
        </div>
      )}

      {/* TAB 2: FREELANCER TALENT DATA */}
      {!loading && !error && activeTab === "freelancers" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Verified Freelancers Directory{" "}
              <span className="text-slate-400 font-normal text-sm">
                ({filteredFreelancers.length} talent profiles)
              </span>
            </h2>
          </div>

          {filteredFreelancers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No freelancers found</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Try widening your skill filters or search terms.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSkill("all");
                  setStatusFilter("all");
                }}
                className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-100 transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFreelancers.map((f) => {
                const isMe = user && f.user?._id === user.id;

                return (
                  <div
                    key={f._id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs card-hover flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-100 to-cyan-100 text-indigo-700 font-bold text-base flex items-center justify-center shrink-0 border border-indigo-200/50">
                            {f.user?.name ? f.user.name.slice(0, 2).toUpperCase() : "FL"}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-base font-bold text-slate-900">
                                {f.user?.name || "Freelancer"}
                              </h3>
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            </div>
                            <span className="text-xs text-slate-400">{f.user?.email}</span>
                          </div>
                        </div>

                        {/* Availability Pill */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            f.availability === "available"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : f.availability === "busy"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          ● {f.availability}
                        </span>
                      </div>

                      {/* Bio */}
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                        {f.bio || "Full-stack freelancer ready for projects."}
                      </p>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {f.skills?.slice(0, 5).map((skill) => (
                          <span
                            key={skill}
                            className="text-xs font-semibold bg-indigo-50/80 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200/50"
                          >
                            {skill}
                          </span>
                        ))}
                        {f.skills?.length > 5 && (
                          <span className="text-[10px] bg-slate-100 text-slate-500 font-semibold px-1.5 py-0.5 rounded-md">
                            +{f.skills.length - 5}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stats footer */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block -mb-0.5">
                          Hourly Rate
                        </span>
                        <span className="text-base font-extrabold text-slate-900">
                          ${f.hourlyRate || 35}/hr
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block -mb-0.5">
                          Experience
                        </span>
                        <span className="text-xs font-bold text-slate-700">
                          {f.experience || 0} Years
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ROLE SPECIFIC MY WORKSPACE */}
      {!loading && !error && activeTab === "my-workspace" && (
        <div className="space-y-8">
          {user?.role === "client" ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">My Posted Projects</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Projects created under your client account. Click any project to view AI talent matches or review applicants.
                  </p>
                </div>
                <Link
                  to="/post-project"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
                >
                  + Post Another Project
                </Link>
              </div>

              {myClientProjects.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">
                    You haven't posted any projects yet
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 mb-6">
                    Create your first job listing to start receiving proposals and smart AI matches.
                  </p>
                  <Link
                    to="/post-project"
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
                  >
                    Post a Project Now &rarr;
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {myClientProjects.map((p) => (
                    <div
                      key={p._id}
                      className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <StatusBadge status={p.status} />
                          <span className="text-xs text-slate-400">
                            Budget: ${p.budget?.toLocaleString()}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">{p.title}</h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 max-w-xl">
                          {p.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to={`/projects/${p._id}/matches`}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          <span>AI Matches</span>
                        </Link>
                        <Link
                          to={`/projects/${p._id}/proposals`}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition flex items-center gap-1.5"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>Proposals</span>
                        </Link>
                        <Link
                          to={`/projects/${p._id}/dashboard`}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition flex items-center gap-1.5"
                        >
                          <BarChart3 className="w-3.5 h-3.5" />
                          <span>Dashboard</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">My Submitted Applications</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Proposals submitted by you across all client job posts.
                  </p>
                </div>
                <Link
                  to="/profile"
                  className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-100 transition"
                >
                  Edit Profile Studio
                </Link>
              </div>

              {myProposals.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">
                    No active proposals submitted
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 mb-6">
                    Switch to the "Client Projects" tab to find opportunities matching your skill set!
                  </p>
                  <button
                    onClick={() => handleTabChange("projects")}
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
                  >
                    Browse Client Projects &rarr;
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myProposals.map((prop) => (
                    <div
                      key={prop._id}
                      className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <StatusBadge status={prop.status} />
                          <span className="text-xs text-slate-400">
                            Bid: ${prop.bidAmount?.toLocaleString()}
                          </span>
                        </div>
                        <Link
                          to={`/projects/${prop.project?._id}`}
                          className="text-base font-bold text-slate-900 hover:text-indigo-600 transition"
                        >
                          {prop.project?.title || "Project Opportunity"}
                        </Link>
                        {prop.coverLetter && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 max-w-xl">
                            "{prop.coverLetter}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/projects/${prop.project?._id}`}
                          className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold transition"
                        >
                          View Job &rarr;
                        </Link>
                        {prop.status === "accepted" && (
                          <Link
                            to={`/projects/${prop.project?._id}/dashboard`}
                            className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl text-xs font-bold transition"
                          >
                            Open Dashboard &rarr;
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Portal;
