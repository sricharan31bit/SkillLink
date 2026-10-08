import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { getMatchesForProject } from "../api/project.api";
import {
  ArrowLeft,
  Sparkles,
  Award,
  Clock,
  DollarSign,
  TrendingUp,
  Star,
  CheckCircle2,
  SlidersHorizontal,
  Mail,
} from "lucide-react";

function Matches() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("match-score");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await getMatchesForProject(id);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load matching candidates.");
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [id]);

  const sortedMatches = useMemo(() => {
    if (!data?.matches) return [];
    return [...data.matches].sort((a, b) => {
      if (sortBy === "hourly-rate-low") {
        return a.hourlyRate - b.hourlyRate;
      }
      if (sortBy === "experience-high") {
        return b.experience - a.experience;
      }
      return b.matchScore - a.matchScore;
    });
  }, [data, sortBy]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h2 className="text-lg font-bold text-slate-800">Analyzing Candidate Pool...</h2>
        <p className="text-xs text-slate-500 mt-1">
          Evaluating skill vector overlap, availability, and historical client feedback.
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="p-8 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700">
          <p className="font-bold text-lg mb-2">Unable to load matches</p>
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
      <div className="mb-6">
        <Link
          to={`/projects/${id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to "{data.project?.title}"
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Talent Recommender</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Optimal Matches for "{data.project?.title}"
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Target Skills:</span>
            {data.project?.requiredSkills?.map((s) => (
              <span
                key={s}
                className="text-xs bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Algorithm Weight Indicator */}
        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">
              Skill Overlap
            </span>
            <span className="font-semibold text-indigo-300">40% Weight</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">
              Client Rating
            </span>
            <span className="font-semibold text-emerald-300">25% Weight</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">
              Years Experience
            </span>
            <span className="font-semibold text-cyan-300">20% Weight</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">
              Current Availability
            </span>
            <span className="font-semibold text-amber-300">15% Weight</span>
          </div>
        </div>
      </div>

      {/* Sorting bar */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          Candidate Recommendations{" "}
          <span className="text-slate-400 font-normal text-sm">
            ({sortedMatches.length} candidates)
          </span>
        </h2>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="match-score">Highest Match Score</option>
            <option value="hourly-rate-low">Lowest Hourly Rate</option>
            <option value="experience-high">Most Experience</option>
          </select>
        </div>
      </div>

      {/* Matches List */}
      {sortedMatches.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500 font-medium">No freelancer profiles available yet.</p>
          <p className="text-xs text-slate-400 mt-1">
            Registered freelancers with matching skill tags will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {sortedMatches.map((match, idx) => {
            const isTopMatch = idx === 0 && match.matchScore >= 80;

            return (
              <div
                key={match.freelancer.id}
                className={`bg-white rounded-2xl border transition duration-200 p-6 shadow-xs relative overflow-hidden ${
                  isTopMatch
                    ? "border-indigo-300 ring-2 ring-indigo-500/10 shadow-indigo-500/5"
                    : "border-slate-200/90 hover:border-slate-300"
                }`}
              >
                {isTopMatch && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-indigo-600 to-indigo-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-xs flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> Best Match
                  </div>
                )}

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  {/* Freelancer Profile Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-100 to-cyan-100 text-indigo-700 font-bold text-lg flex items-center justify-center shrink-0 border border-indigo-200/50 shadow-xs">
                      {match.freelancer.name?.slice(0, 2).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900">
                          {match.freelancer.name}
                        </h3>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                          <strong className="text-slate-800">${match.hourlyRate}</strong>/hr
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <strong className="text-slate-800">{match.experience}</strong> yrs
                          experience
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Mail className="w-3.5 h-3.5" />
                          {match.freelancer.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Match Score Radial Display */}
                  <div className="flex items-center gap-4 self-end md:self-auto">
                    <div className="text-right">
                      <div className="flex items-baseline justify-end gap-1">
                        <span className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                          {match.matchScore}%
                        </span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block -mt-1">
                        Fit Score
                      </span>
                    </div>
                  </div>
                </div>

                {/* Candidate Skill Tags */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-1.5 items-center">
                  <span className="text-xs font-semibold text-slate-400 mr-1">Skills:</span>
                  {match.skills?.map((skill) => {
                    const isTarget = data.project?.requiredSkills?.some(
                      (req) => req.toLowerCase() === skill.toLowerCase()
                    );

                    return (
                      <span
                        key={skill}
                        className={`text-xs px-2.5 py-0.5 rounded-lg font-medium transition ${
                          isTarget
                            ? "bg-indigo-100 text-indigo-800 font-semibold border border-indigo-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {skill}
                        {isTarget && " ✓"}
                      </span>
                    );
                  })}
                </div>

                {/* Algorithmic Breakdown Bars */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100 bg-slate-50/60 rounded-xl p-3">
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                      <span>Skill Match</span>
                      <span className="text-indigo-600">{match.breakdown?.skillScore}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${match.breakdown?.skillScore || 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                      <span>Client Rating</span>
                      <span className="text-emerald-600">{match.breakdown?.ratingScore}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${match.breakdown?.ratingScore || 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                      <span>Experience</span>
                      <span className="text-cyan-600">
                        {match.breakdown?.experienceScore}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-500 rounded-full"
                        style={{ width: `${match.breakdown?.experienceScore || 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                      <span>Availability</span>
                      <span className="text-amber-600">
                        {match.breakdown?.availabilityScore}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${match.breakdown?.availabilityScore || 0}%` }}
                      />
                    </div>
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

export default Matches;