import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { getProjectDashboard } from "../api/dashboard.api";
import { createMilestone, updateMilestoneStatus } from "../api/milestone.api";
import { RiskBadge } from "../components/common/Badge";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Modal from "../components/common/Modal";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  TrendingUp,
  Target,
  Sparkles,
  Layers,
  Flag,
} from "lucide-react";

function Dashboard() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add Milestone Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    weight: 25,
    dueDate: "",
  });
  const [addingMilestone, setAddingMilestone] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchDashboard = async () => {
    try {
      const res = await getProjectDashboard(id);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load project dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [id]);

  const handleStatusChange = async (milestoneId, newStatus) => {
    setUpdatingId(milestoneId);
    try {
      await updateMilestoneStatus(milestoneId, newStatus);
      addToast(`Milestone updated to ${newStatus}`, "success");
      await fetchDashboard();
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to update milestone", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAddMilestone = async (e) => {
    e.preventDefault();
    setAddingMilestone(true);
    try {
      await createMilestone(id, {
        title: newMilestone.title,
        weight: Number(newMilestone.weight),
        dueDate: newMilestone.dueDate,
      });
      addToast("New milestone added successfully!", "success");
      setShowAddModal(false);
      setNewMilestone({ title: "", weight: 25, dueDate: "" });
      await fetchDashboard();
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to add milestone", "error");
    } finally {
      setAddingMilestone(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 font-medium">Aggregating telemetry & risk telemetry...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="p-8 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700">
          <p className="font-bold text-lg mb-2">Unable to load dashboard</p>
          <p className="text-sm mb-4">{error}</p>
          <Link
            to={`/projects/${id}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Project
          </Link>
        </div>
      </div>
    );
  }

  const { project, health, milestones } = data;
  const isOwner = user && project.client?._id === user.id;
  const isAssigned =
    user && project.assignedFreelancer && project.assignedFreelancer._id === user.id;
  const canEditMilestones = isOwner || isAssigned;

  const currentTotalWeight = milestones.reduce((sum, m) => sum + (m.weight || 0), 0);
  const remainingWeight = Math.max(0, 100 - currentTotalWeight);

  const pieData = [
    { name: "Completed", value: health.progress },
    { name: "Remaining", value: Math.max(0, 100 - health.progress) },
  ];
  const PIE_COLORS = ["#4f46e5", "#e2e8f0"];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to={`/projects/${id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to "{project.title}"
        </Link>
        <RiskBadge riskLevel={health.riskLevel} />
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Project Performance & Health Hub
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              {project.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Client: {project.client?.name} · Freelancer:{" "}
              {project.assignedFreelancer?.name || "Unassigned"}
            </p>
          </div>

          {isOwner && remainingWeight > 0 && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition"
            >
              <Plus className="w-4 h-4" /> Add Milestone
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards & Donut Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Progress Donut Chart */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col items-center justify-center">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Weighted Progress
          </h2>
          <div className="relative w-40 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={54}
                  outerRadius={70}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-slate-900">{health.progress}%</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Done</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {health.completedCount} of {health.totalMilestones} milestones reached
          </p>
        </div>

        {/* Stats Grid */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs md:col-span-2 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Schedule & Risk Analytics
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 block font-medium">Completed</span>
                <span className="text-2xl font-black text-slate-900 mt-0.5 block">
                  {health.completedCount}
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold">
                  Milestones finished
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 block font-medium">In Queue</span>
                <span className="text-2xl font-black text-slate-900 mt-0.5 block">
                  {health.pendingCount}
                </span>
                <span className="text-[11px] text-amber-600 font-semibold">
                  Pending delivery
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 block font-medium">Fixed Budget</span>
                <span className="text-2xl font-black text-slate-900 mt-0.5 block">
                  ${project.budget}
                </span>
                <span className="text-[11px] text-indigo-600 font-semibold">Escrow allocated</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-slate-400 font-medium">Contract Deadline</p>
                <p className="font-bold text-slate-800">
                  {new Date(project.deadline).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <p className="text-slate-400 font-medium">Est. Completion</p>
                <p className="font-bold text-slate-800">
                  {health.estimatedCompletion
                    ? new Date(health.estimatedCompletion).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Calibrating velocity..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones Roadmap Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Flag className="w-5 h-5 text-indigo-600" />
              Milestone Roadmap & Delivery Checkpoints
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Total Weight: {currentTotalWeight}% / 100%
            </p>
          </div>
        </div>

        {milestones.length === 0 ? (
          <div className="p-8 border border-dashed border-slate-200 rounded-xl text-center">
            <p className="text-slate-500 font-medium text-sm">No milestones defined yet.</p>
            {isOwner && (
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-3 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition"
              >
                + Define First Milestone
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {milestones.map((m, index) => {
              const isCompleted = m.status === "completed";
              const isInProgress = m.status === "in-progress";

              return (
                <div
                  key={m._id}
                  className={`p-4 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isCompleted
                      ? "bg-emerald-50/40 border-emerald-200/70"
                      : isInProgress
                      ? "bg-indigo-50/40 border-indigo-200/70"
                      : "bg-slate-50/50 border-slate-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 ${
                        isCompleted
                          ? "bg-emerald-100 text-emerald-700"
                          : isInProgress
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div>
                      <h4
                        className={`text-sm font-bold ${
                          isCompleted ? "text-slate-800 line-through decoration-emerald-500" : "text-slate-900"
                        }`}
                      >
                        {m.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <span>
                          Weight: <strong className="text-slate-700">{m.weight}%</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Due:{" "}
                          <strong className="text-slate-700">
                            {new Date(m.dueDate).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </strong>
                        </span>
                        {m.completedAt && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-700 font-semibold">
                              Finished {new Date(m.completedAt).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions / Status pills */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {canEditMilestones ? (
                      <select
                        value={m.status}
                        disabled={updatingId === m._id}
                        onChange={(e) => handleStatusChange(m._id, e.target.value)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border focus:outline-none cursor-pointer transition ${
                          isCompleted
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                            : isInProgress
                            ? "bg-indigo-100 text-indigo-800 border-indigo-300"
                            : "bg-white text-slate-700 border-slate-300"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    ) : (
                      <span
                        className={`text-xs px-2.5 py-1 rounded-md capitalize font-semibold ${
                          isCompleted
                            ? "bg-emerald-100 text-emerald-700"
                            : isInProgress
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {m.status}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Milestone Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Project Milestone"
      >
        <form onSubmit={handleAddMilestone} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Milestone Objective
            </label>
            <input
              type="text"
              required
              value={newMilestone.title}
              onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
              placeholder="e.g. Frontend Architecture & API Integration"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Weight Percentage (%)
              </label>
              <span className="text-[11px] text-slate-400">
                Available: {remainingWeight}%
              </span>
            </div>
            <input
              type="number"
              required
              min="1"
              max={remainingWeight || 100}
              value={newMilestone.weight}
              onChange={(e) =>
                setNewMilestone({ ...newMilestone, weight: Number(e.target.value) })
              }
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              required
              value={newMilestone.dueDate}
              onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={addingMilestone}
              className="w-full py-2.5 rounded-xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {addingMilestone ? "Creating Milestone..." : "Save Milestone"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Dashboard;