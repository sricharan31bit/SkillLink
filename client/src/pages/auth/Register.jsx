import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  Layers,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Briefcase,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { register, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const newUser = await register(formData);
      addToast(`Account created! Welcome to SkillLink, ${newUser?.name || ""}`, "success");
      navigate("/portal");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.message === "Network Error"
          ? "Unable to connect to the backend server. Please verify backend is running on port 5000."
          : err.message) ||
        "Registration failed. Please verify your data.";
      setError(msg);
      addToast(msg, "error");
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 gradient-mesh">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/90 p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-400" />

          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center mx-auto mb-4 shadow-md shadow-indigo-500/25">
              <Layers className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Join the SkillLink Network
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Select your primary goal to configure your workspace
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Visual Role Selector Cards */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                I want to participate as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleSelect("client")}
                  className={`p-3.5 rounded-2xl border text-left transition duration-200 ${
                    formData.role === "client"
                      ? "border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-2">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">A Client</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Post projects & hire engineers
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect("freelancer")}
                  className={`p-3.5 rounded-2xl border text-left transition duration-200 ${
                    formData.role === "freelancer"
                      ? "border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-2">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">A Freelancer</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Bid on contracts & deliver work
                  </p>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Alex Morgan"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/40 disabled:opacity-50 transition duration-200 mt-4"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Configuring Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6 text-xs text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-indigo-600 hover:underline">
              Log In instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;