import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getMyProposals } from "../../api/proposal.api";
import { StatusBadge } from "../../components/common/Badge";
import {
  FileText,
  DollarSign,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Layers,
} from "lucide-react";

function MyProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await getMyProposals();
        setProposals(res.data.proposals || []);
      } catch (err) {
        setError("Failed to load your submitted proposals.");
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, []);

  const stats = useMemo(() => {
    return {
      total: proposals.length,
      pending: proposals.filter((p) => p.status === "pending").length,
      accepted: proposals.filter((p) => p.status === "accepted").length,
      rejected: proposals.filter((p) => p.status === "rejected").length,
    };
  }, [proposals]);

  const filteredProposals = useMemo(() => {
    if (activeTab === "all") return proposals;
    return proposals.filter((p) => p.status === activeTab);
  }, [proposals, activeTab]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 font-medium">Loading your proposal portfolio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="p-8 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700">
          <p className="font-bold text-lg mb-2">Error loading proposals</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Freelancer Pipeline
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          My Submitted Proposals
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Track the status of your applications, submitted bids, and client contract awards.
        </p>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs text-slate-400 block font-semibold">Total Applications</span>
          <span className="text-2xl font-black text-slate-900 mt-0.5 block">{stats.total}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs text-amber-600 block font-semibold">Under Review</span>
          <span className="text-2xl font-black text-amber-600 mt-0.5 block">{stats.pending}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs text-emerald-600 block font-semibold">Hired / Accepted</span>
          <span className="text-2xl font-black text-emerald-600 mt-0.5 block">{stats.accepted}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs text-rose-600 block font-semibold">Declined</span>
          <span className="text-2xl font-black text-rose-600 mt-0.5 block">{stats.rejected}</span>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3 mb-6 overflow-x-auto">
        {[
          { key: "all", label: "All Proposals" },
          { key: "pending", label: "Pending" },
          { key: "accepted", label: "Accepted" },
          { key: "rejected", label: "Declined" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              activeTab === tab.key
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Proposals List */}
      {filteredProposals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No proposals in this category</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Explore projects that match your skills and submit competitive proposals to win contracts.
          </p>
          <Link
            to="/"
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
          >
            Browse Available Projects &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProposals.map((p) => {
            const isAccepted = p.status === "accepted";

            return (
              <div
                key={p._id}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:border-indigo-200 transition duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <StatusBadge status={p.status} />
                      <span className="text-xs text-slate-400">
                        Submitted {new Date(p.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>

                    <Link
                      to={`/projects/${p.project?._id}`}
                      className="text-lg font-bold text-slate-900 hover:text-indigo-600 transition flex items-center gap-2"
                    >
                      <span>{p.project?.title || "Project Opportunity"}</span>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
                    </Link>

                    {p.coverLetter && (
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 max-w-2xl">
                        "{p.coverLetter}"
                      </p>
                    )}
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block -mb-0.5">
                      Your Proposed Bid
                    </span>
                    <span className="text-2xl font-black text-slate-900">
                      ${p.bidAmount?.toLocaleString()}
                    </span>

                    {isAccepted && p.project?._id && (
                      <Link
                        to={`/projects/${p.project._id}/dashboard`}
                        className="mt-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition"
                      >
                        Open Dashboard &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyProposals;