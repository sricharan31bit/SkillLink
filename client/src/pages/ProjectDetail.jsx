import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProjectById } from "../api/project.api";
import { createProposal, getMyProposals } from "../api/proposal.api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Modal from "../components/common/Modal";
import { StatusBadge } from "../components/common/Badge";
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  Sparkles,
  BarChart3,
  Users,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  UserCheck,
  Briefcase,
  HelpCircle,
} from "lucide-react";

function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasApplied, setHasApplied] = useState(false);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [proposalData, setProposalData] = useState({ coverLetter: "", bidAmount: "" });
  const [proposalError, setProposalError] = useState("");
  const [proposalSuccess, setProposalSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await getProjectById(id);
        setProject(res.data.project);
        if (res.data.project?.budget) {
          setProposalData((prev) => ({ ...prev, bidAmount: res.data.project.budget }));
        }
      } catch (err) {
        setError("Project not found or was removed.");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  useEffect(() => {
    const checkApplied = async () => {
      if (user?.role === "freelancer") {
        try {
          const res = await getMyProposals();
          const applied = res.data.proposals.some((p) => p.project?._id === id);
          setHasApplied(applied);
        } catch {
          // silently ignore
        }
      }
    };
    checkApplied();
  }, [id, user]);

  const handleProposalChange = (e) => {
    setProposalData({ ...proposalData, [e.target.name]: e.target.value });
  };

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    setProposalError("");
    setSubmitting(true);
    try {
      await createProposal(id, {
        coverLetter: proposalData.coverLetter,
        bidAmount: Number(proposalData.bidAmount),
      });
      setProposalSuccess(true);
      setHasApplied(true);
      addToast("Proposal submitted successfully to the client!", "success");
      setTimeout(() => {
        setShowApplyModal(false);
        setProposalSuccess(false);
      }, 1200);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to submit proposal";
      setProposalError(msg);
      addToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 font-medium">Loading project specifications...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="p-8 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700">
          <p className="font-bold text-lg mb-2">Unable to load project</p>
          <p className="text-sm mb-4">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4" /> Back to all projects
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user && project.client?._id === user.id;
  const isFreelancer = user && user.role === "freelancer";

  // Calculate days remaining
  const daysRemaining = project.deadline
    ? Math.ceil((new Date(project.deadline) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Link & Breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to projects
        </Link>
        <span className="text-xs text-slate-400 font-mono">ID: {project._id.slice(-6)}</span>
      </div>

      {/* Main Container Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Scope & Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <StatusBadge status={project.status} />
              <span className="text-xs text-slate-400">
                Created {new Date(project.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {project.title}
            </h1>

            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center">
                {project.client?.name ? project.client.name.slice(0, 1) : "C"}
              </div>
              <div>
                <p className="text-xs text-slate-400">Project Posted By</p>
                <p className="text-sm font-bold text-slate-800">{project.client?.name}</p>
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              Project Overview & Deliverables
            </h2>
            <div className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">
              {project.description}
            </div>
          </div>

          {/* Required Skills */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Required Skills & Technologies
            </h2>
            <p className="text-xs text-slate-500">
              Our AI matching engine pairs freelancers based on proficiency in these tags:
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {project.requiredSkills?.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-xl text-sm font-semibold bg-indigo-50/80 text-indigo-700 border border-indigo-200/60 shadow-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Freelancer Application Action Area */}
          {isFreelancer && (
            <div className="bg-gradient-to-br from-indigo-50 via-white to-indigo-50/50 rounded-2xl border border-indigo-200/70 p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Interested in this opportunity?
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Submit your bid and cover letter directly to {project.client?.name}.
                  </p>
                </div>

                {project.status === "open" && !hasApplied && (
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition"
                  >
                    Submit a Proposal
                  </button>
                )}

                {hasApplied && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>You have applied to this project</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Key Details & Owner Dashboard */}
        <div className="space-y-6">
          {/* Financials & Deadline Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Project Parameters
            </h3>

            {/* Budget */}
            <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Fixed Budget</p>
                <p className="text-2xl font-extrabold text-slate-900">
                  ${project.budget?.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Deadline */}
            {project.deadline && (
              <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Target Deadline</p>
                  <p className="text-sm font-bold text-slate-800">
                    {new Date(project.deadline).toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  {daysRemaining !== null && (
                    <p
                      className={`text-[11px] font-semibold mt-0.5 ${
                        daysRemaining < 3 ? "text-rose-600" : "text-slate-500"
                      }`}
                    >
                      {daysRemaining > 0
                        ? `${daysRemaining} days remaining`
                        : "Deadline reached"}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Security Guarantee */}
            <div className="flex items-center gap-2 pt-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Milestone escrow protection verified</span>
            </div>
          </div>

          {/* Assigned Freelancer Card */}
          {project.assignedFreelancer && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Assigned Freelancer
                </h3>
                <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200/60">
                  Active Contract
                </span>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                  {project.assignedFreelancer.name?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900">
                    {project.assignedFreelancer.name}
                  </p>
                  <p className="text-xs text-slate-400">{project.assignedFreelancer.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Client Project Control Center (For Project Owner) */}
          {isOwner && (
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Client Management
                </h3>
                <span className="text-[10px] bg-indigo-500/30 text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-400/30">
                  Owner Panel
                </span>
              </div>

              <p className="text-xs text-slate-300">
                Manage candidate proposals, view intelligent talent matches, and monitor milestones.
              </p>

              <div className="space-y-2.5 pt-2">
                <Link
                  to={`/projects/${id}/matches`}
                  className="flex items-center justify-between w-full p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-white border border-slate-700/80 hover:border-indigo-500 transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
                    <div>
                      <p className="text-sm font-bold">AI Skill Matches</p>
                      <p className="text-[11px] text-slate-400">Ranked freelancer matches</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-cyan-400">&rarr;</span>
                </Link>

                <Link
                  to={`/projects/${id}/proposals`}
                  className="flex items-center justify-between w-full p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-white border border-slate-700/80 hover:border-indigo-500 transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition" />
                    <div>
                      <p className="text-sm font-bold">Review Proposals</p>
                      <p className="text-[11px] text-slate-400">Candidate bids & hire action</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-indigo-400">&rarr;</span>
                </Link>

                <Link
                  to={`/projects/${id}/dashboard`}
                  className="flex items-center justify-between w-full p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-white border border-slate-700/80 hover:border-indigo-500 transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <BarChart3 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
                    <div>
                      <p className="text-sm font-bold">Project Health & Milestones</p>
                      <p className="text-[11px] text-slate-400">Progress donut & risk tracker</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400">&rarr;</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Apply to Project Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title={`Apply to "${project.title}"`}
        maxWidth="max-w-lg"
      >
        {proposalSuccess ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-slate-900 font-bold text-base">Proposal Submitted!</p>
            <p className="text-slate-500 text-xs">
              The project owner will be notified of your proposal and bid.
            </p>
          </div>
        ) : (
          <form onSubmit={handleProposalSubmit} className="space-y-4">
            {proposalError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                {proposalError}
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Cover Letter & Pitch
                </label>
                <span className="text-[11px] text-slate-400">
                  {proposalData.coverLetter.length} chars
                </span>
              </div>
              <textarea
                name="coverLetter"
                value={proposalData.coverLetter}
                onChange={handleProposalChange}
                required
                rows={5}
                placeholder="Explain why you are the best fit for this project, relevant past experience, and your proposed delivery approach..."
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Bid Amount ($ USD)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  name="bidAmount"
                  value={proposalData.bidAmount}
                  onChange={handleProposalChange}
                  required
                  min="1"
                  placeholder="e.g. 500"
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Client's budget is ${project.budget}. You can match or negotiate.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/40 disabled:opacity-50 transition"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting Proposal...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Proposal Now</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default ProjectDetail;