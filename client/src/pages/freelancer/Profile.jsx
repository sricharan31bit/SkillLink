import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile, updateMyProfile } from "../../api/profile.api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  User,
  Sparkles,
  DollarSign,
  Clock,
  CheckCircle2,
  Save,
  Plus,
  X,
  ShieldCheck,
  Eye,
  Star,
} from "lucide-react";

const SUGGESTED_SKILLS = [
  "React",
  "Node.js",
  "MongoDB",
  "TypeScript",
  "Tailwind CSS",
  "Python",
  "Figma",
  "UI Design",
  "Docker",
  "Next.js",
  "PostgreSQL",
  "AWS",
];

function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [skillsList, setSkillsList] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [formData, setFormData] = useState({
    bio: "",
    experience: 3,
    hourlyRate: 45,
    availability: "available",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyProfile();
        const p = res.data.profile;
        if (p) {
          setSkillsList(p.skills || []);
          setFormData({
            bio: p.bio || "",
            experience: p.experience ?? 3,
            hourlyRate: p.hourlyRate ?? 45,
            availability: p.availability || "available",
          });
        }
      } catch {
        // no profile yet, start with sensible defaults
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleAddSkill = (skillToAdd) => {
    const trimmed = (skillToAdd || skillInput).trim();
    if (!trimmed) return;
    if (!skillsList.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkillsList([...skillsList, trimmed]);
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkillsList(skillsList.filter((s) => s !== skillToRemove));
  };

  const handleKeyDownSkill = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await updateMyProfile({
        skills: skillsList,
        bio: formData.bio,
        experience: Number(formData.experience) || 0,
        hourlyRate: Number(formData.hourlyRate) || 0,
        availability: formData.availability,
      });
      addToast("Profile updated! Your AI match score is recalculated.", "success");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to save profile";
      setError(msg);
      addToast(msg, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 font-medium">Loading profile credentials...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Professional Portfolio
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Freelancer Profile Studio
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Refine your technical skills, compensation rate, and availability to maximize matches.
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
            {/* Skills Tag Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Technical Skills & Specializations
              </label>

              {/* Tag pills */}
              <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl min-h-[48px] items-center">
                {skillsList.map((skill) => (
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
                  placeholder={
                    skillsList.length === 0 ? "Type a skill and press Enter..." : "Add more..."
                  }
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleKeyDownSkill}
                  className="flex-1 bg-transparent border-none text-xs text-slate-800 placeholder-slate-400 focus:outline-none p-1.5 min-w-[120px]"
                />
              </div>

              {/* Suggested Skills */}
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-400 font-semibold mr-1">Quick Add:</span>
                {SUGGESTED_SKILLS.filter(
                  (s) => !skillsList.some((curr) => curr.toLowerCase() === s.toLowerCase())
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

            {/* Bio */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Professional Bio & Pitch
              </label>
              <textarea
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Detail your engineering background, specialties, production achievements, and what sets your craft apart..."
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Experience & Rate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Experience (Years)
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Hourly Rate ($ USD / hr)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    min="1"
                    value={formData.hourlyRate}
                    onChange={(e) =>
                      setFormData({ ...formData, hourlyRate: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Availability Radio Pills */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Availability Status
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    key: "available",
                    label: "Available",
                    desc: "Immediate start",
                    color: "border-emerald-500 bg-emerald-50 text-emerald-800",
                    dot: "bg-emerald-500",
                  },
                  {
                    key: "busy",
                    label: "Limited",
                    desc: "Part-time only",
                    color: "border-amber-500 bg-amber-50 text-amber-800",
                    dot: "bg-amber-500",
                  },
                  {
                    key: "unavailable",
                    label: "Unavailable",
                    desc: "Not accepting bids",
                    color: "border-slate-400 bg-slate-50 text-slate-700",
                    dot: "bg-slate-400",
                  },
                ].map((status) => {
                  const isSelected = formData.availability === status.key;
                  return (
                    <button
                      key={status.key}
                      type="button"
                      onClick={() => setFormData({ ...formData, availability: status.key })}
                      className={`p-3 rounded-xl border text-left transition ${
                        isSelected
                          ? status.color + " ring-2 ring-indigo-500/20 font-bold"
                          : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                        <span className="text-xs">{status.label}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block">{status.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/40 disabled:opacity-50 transition"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Synchronizing Profile...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save & Publish Profile</span>
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
            <span>Live Candidate Preview</span>
          </div>

          <div className="bg-white rounded-2xl border border-indigo-200/80 p-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-indigo-600 to-indigo-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Live Preview
            </div>

            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-100 to-cyan-100 text-indigo-700 font-bold text-lg flex items-center justify-center border border-indigo-200/50 shadow-xs">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "ME"}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{user?.name || "Your Name"}</h3>
                <span className="text-xs text-slate-500">{user?.email || "freelancer@skilllink.io"}</span>
              </div>
            </div>

            {formData.bio ? (
              <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                "{formData.bio}"
              </p>
            ) : (
              <p className="text-xs text-slate-400 italic mb-4">
                Your profile bio will be featured here...
              </p>
            )}

            <div className="flex flex-wrap gap-1.5 mb-5">
              {skillsList.length > 0 ? (
                skillsList.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-semibold px-2 py-0.5 rounded-md"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No skills added yet</span>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Hourly Rate
                </span>
                <span className="text-base font-extrabold text-slate-900">
                  ${formData.hourlyRate || 0}/hr
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Experience
                </span>
                <span className="text-base font-extrabold text-slate-900">
                  {formData.experience || 0} Years
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Client Match Status</span>
              <span className="font-bold capitalize text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {formData.availability}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;