import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createProject } from "../../api/project.api";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import {
  Briefcase,
  DollarSign,
  Calendar,
  Sparkles,
  ArrowRight,
  Plus,
  X,
  Layers,
  CheckCircle,
  Eye,
} from "lucide-react";

const POPULAR_SKILLS = [
  "React",
  "Node.js",
  "MongoDB",
  "TypeScript",
  "Python",
  "Figma",
  "Tailwind",
  "Docker",
  "PostgreSQL",
  "UI Design",
];

function PostProject() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
  });
  const [skills, setSkills] = useState(["React", "Node.js"]);
  const [skillInput, setSkillInput] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAddSkill = (skillToAdd) => {
    const trimmed = (skillToAdd || skillInput).trim();
    if (!trimmed) return;
    if (!skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleKeyDownSkill = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (skills.length === 0) {
      setError("Please add at least one required skill.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await createProject({
        title: formData.title,
        description: formData.description,
        requiredSkills: skills,
        budget: Number(formData.budget),
        deadline: formData.deadline,
      });
      addToast("Project posted successfully to the marketplace!", "success");
      navigate(`/projects/${res.data.project._id}`);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create project";
      setError(msg);
      addToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Project Launchpad
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Post a New Project
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Define your technical requirements and budget to activate smart candidate matching.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Project Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Next-Gen Financial Dashboard with Real-Time WebSockets"
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Project Description & Scope
              </label>
              <textarea
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe your architectural goals, required deliverables, timeline constraints, and team expectations..."
                className="w-full border border-slate-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Required Skills Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Required Technical Skills
              </label>

              <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl min-h-[48px] items-center">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded-lg text-xs font-bold shadow-xs"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-indigo-400 hover:text-indigo-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder="Type a skill & press Enter..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleKeyDownSkill}
                  className="flex-1 bg-transparent border-none text-xs text-slate-800 placeholder-slate-400 focus:outline-none p-1.5 min-w-[120px]"
                />
              </div>

              {/* Suggestions */}
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-400 font-semibold mr-1">Quick Select:</span>
                {POPULAR_SKILLS.filter(
                  (s) => !skills.some((curr) => curr.toLowerCase() === s.toLowerCase())
                )
                  .slice(0, 6)
                  .map((suggested) => (
                    <button
                      key={suggested}
                      type="button"
                      onClick={() => handleAddSkill(suggested)}
                      className="text-[11px] bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 px-2 py-0.5 rounded-md transition"
                    >
                      + {suggested}
                    </button>
                  ))}
              </div>
            </div>

            {/* Budget & Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Project Budget ($ USD)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="e.g. 1500"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Target Deadline
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="deadline"
                    min={todayStr}
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/40 disabled:opacity-50 transition"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Publishing Project...</span>
                  </>
                ) : (
                  <>
                    <Briefcase className="w-4 h-4" />
                    <span>Publish Project & Start Matching</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Live Preview Card (5 cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Eye className="w-4 h-4 text-indigo-500" />
            <span>Marketplace Card Preview</span>
          </div>

          <div className="bg-white rounded-2xl border border-indigo-200/80 p-6 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                  {user?.name ? user.name.slice(0, 1) : "C"}
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  {user?.name || "Your Company"}
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Open for Bids
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 line-clamp-1">
              {formData.title || "Your Project Title Preview"}
            </h3>

            <p className="text-slate-600 text-xs mt-2 line-clamp-3 leading-relaxed">
              {formData.description ||
                "Your project scope and deliverable details will appear here as freelancers browse open opportunities..."}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-4">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block -mb-0.5">
                  Budget
                </span>
                <span className="text-base font-extrabold text-slate-900">
                  ${formData.budget ? Number(formData.budget).toLocaleString() : "0"}
                </span>
              </div>

              {formData.deadline && (
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block -mb-0.5">
                    Deadline
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    {new Date(formData.deadline).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostProject;