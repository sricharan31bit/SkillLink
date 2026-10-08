import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProposalsForProject, acceptProposal } from "../../api/proposal.api";
import { getProjectById } from "../../api/project.api";
import { StatusBadge } from "../../components/common/Badge";
import { useToast } from "../../context/ToastContext";
import {
  ArrowLeft,
  DollarSign,
  UserCheck,
  Sparkles,
  Mail,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";

function ProjectProposals() {
  const { id } = useParams();
  const [proposals, setProposals] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [acceptingId, setAcceptingId] = useState(null);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propRes, projRes] = await Promise.all([
          getProposalsForProject(id),
          getProjectById(id).catch(() => ({ data: { project: null } })),
        ]);
        setProposals(propRes.data.proposals || []);
        if (projRes.data?.project) {
          setProject(projRes.data.project);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load project proposals.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAccept = async (proposalId, freelancerName) => {
    setAcceptingId(proposalId);
    try {
      await acceptProposal(proposalId);
      addToast(`Hired ${freelancerName}! Project assigned successfully.`, "success");
      navigate(`/projects/${id}/dashboard`);
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to accept proposal", "error");
      setAcceptingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 font-medium">Retrieving proposal dossiers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="p-8 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700">
          <p className="font-bold text-lg mb-2">Unable to load proposals</p>
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to={`/projects/${id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Project Overview
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Candidate Review
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Received Proposals
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Project: <span className="font-semibold text-slate-800">{project?.title || id}</span>{" "}
              {project?.budget && `· Budget: $${project.budget}`}
            </p>
          </div>

          <Link
            to={`/projects/${id}/matches`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold hover:bg-indigo-100 transition self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>View AI Matches</span>
          </Link>
        </div>
      </div>

      {/* Proposals List */}
      {proposals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No proposals submitted yet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Freelancers browsing the platform haven't submitted bids for this project yet. You can check matching talent and invite them!
          </p>
          <Link
            to={`/projects/${id}/matches`}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
          >
            Browse Recommended Freelancers &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {proposals.map((p) => {
            const isAccepted = p.status === "accepted";
            const isPending = p.status === "pending";

            return (
              <div
                key={p._id}
                className={`bg-white rounded-2xl border p-6 shadow-xs transition duration-200 ${
                  isAccepted
                    ? "border-emerald-300 ring-2 ring-emerald-500/10 bg-emerald-50/20"
                    : "border-slate-200/90 hover:border-slate-300"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 font-bold text-base flex items-center justify-center shrink-0">
                      {p.freelancer?.name?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{p.freelancer?.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{p.freelancer?.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 font-medium block">Proposed Bid</span>
                      <span className="text-2xl font-black text-slate-900">
                        ${p.bidAmount?.toLocaleString()}
                      </span>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                </div>

                {/* Pitch Letter */}
                <div className="mt-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Proposal Cover Letter
                  </span>
                  <div className="p-4 bg-slate-50 rounded-xl text-sm text-slate-700 leading-relaxed whitespace-pre-line border border-slate-100">
                    {p.coverLetter}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-400">
                    Submitted {new Date(p.createdAt || Date.now()).toLocaleDateString()}
                  </span>

                  {isPending && (
                    <button
                      onClick={() => handleAccept(p._id, p.freelancer?.name)}
                      disabled={acceptingId === p._id}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 shadow-md shadow-indigo-600/20 transition"
                    >
                      {acceptingId === p._id ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Finalizing Contract...</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4" />
                          <span>Accept & Hire Freelancer</span>
                        </>
                      )}
                    </button>
                  )}

                  {isAccepted && (
                    <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Hired & Assigned to Project</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProjectProposals;