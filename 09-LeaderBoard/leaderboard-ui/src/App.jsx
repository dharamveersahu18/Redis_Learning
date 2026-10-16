import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  CircleHelp,
  Gamepad2,
  Search,
  ShieldCheck,
  Trophy,
  Users,
  X,
} from "lucide-react";

import Navbar from "./components/Navbar";
import Podium from "./components/Podium";
import LeaderboardTable from "./components/LeaderboardTable";
import ScoreForm from "./components/ScoreForm";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/+$/, "");

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [lookupId, setLookupId] = useState("");
  const [playerInfo, setPlayerInfo] = useState(null);

  const request = useCallback(async (path, options = {}) => {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message || `Request failed (${response.status})`
      );
    }

    return data;
  }, []);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await request("/leaderboard");

      if (!Array.isArray(data.leaderboard)) {
        throw new Error("Unexpected leaderboard API response.");
      }

      setUsers(data.leaderboard);
      setConnected(true);
    } catch (err) {
      setConnected(false);
      setError(err.message || "Unable to load leaderboard.");
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  async function handleScoreSubmit({ userId, score, mode }) {
    setBusy(true);
    setError("");
    setNotice("");

    try {
      const data = await request(
        mode === "set" ? "/score" : "/score/increment",
        {
          method: "POST",
          body: JSON.stringify(
            mode === "set"
              ? { userId, score }
              : { userId, points: score }
          ),
        }
      );

      setNotice(
        `${data.userId} now has ${Number(data.score).toLocaleString()} points.`
      );

      await fetchLeaderboard();
      return true;
    } catch (err) {
      setError(err.message || "Could not save score.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function findPlayer(event) {
    event.preventDefault();

    const id = lookupId.trim();
    if (!id) return;

    setError("");
    setNotice("");
    setPlayerInfo(null);

    try {
      const [rankData, scoreData] = await Promise.all([
        request(`/users/${encodeURIComponent(id)}/rank`),
        request(`/users/${encodeURIComponent(id)}/score`),
      ]);

      setPlayerInfo({
        userId: id,
        rank: rankData.rank,
        score: scoreData.score,
      });
    } catch (err) {
      setError(err.message || "Could not find this player.");
    }
  }

  return (
    <div className="grid-bg min-h-screen bg-[#080a10] text-zinc-100">
      <Navbar connected={connected} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className="relative mb-8 overflow-hidden rounded-3xl border border-lime-400/20 bg-gradient-to-br from-[#151d20] via-[#10131d] to-[#10101b] p-6 sm:p-10">
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-lime-400/10 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] text-lime-300">
                <Activity size={13} />
                THE COMPETITION STARTS HERE
              </div>

              <h1 className="max-w-2xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                PROVE YOUR
                <span className="neon-text block text-lime-400">
                  DOMINANCE.
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
                Every point counts. Climb the rankings, challenge
                the competition, and claim your place at the top.
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="rounded-xl bg-lime-400/10 p-3">
                <Gamepad2 size={28} className="text-lime-400" />
              </div>
              <div>
                <p className="text-xs text-zinc-500">POWERED BY</p>
                <p className="mt-1 font-black text-white">
                  REDIS
                  <span className="text-lime-400"> ZSET</span>
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  Real leaderboard data
                </p>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300"
          >
            <AlertCircle className="mt-0.5 shrink-0" size={18} />
            <div className="flex-1">
              <p className="font-semibold">{error}</p>
              {!connected && (
                <p className="mt-1 text-red-200/70">
                  Check that your Express server and Redis are running.
                </p>
              )}
            </div>
            <button
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {notice && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-lime-400/20 bg-lime-400/10 p-4 text-sm text-lime-300">
            <CheckCircle2 size={18} />
            <p>{notice}</p>
            <button
              className="ml-auto"
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
            >
              <X size={17} />
            </button>
          </div>
        )}

        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={Users}
            label="TOTAL PLAYERS"
            value={users.length}
            color="text-cyan-300"
          />
          <StatCard
            icon={Trophy}
            label="TOP SCORE"
            value={users[0]?.score?.toLocaleString() ?? "—"}
            color="text-yellow-300"
          />
          <StatCard
            icon={ShieldCheck}
            label="DATA SOURCE"
            value="Redis"
            color="text-lime-400"
          />
        </section>

        <section className="mb-8">
          <Podium users={users.slice(0, 3)} />
        </section>

        <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.8fr)]">
          <LeaderboardTable
            users={users}
            loading={loading}
            onRefresh={fetchLeaderboard}
            search={search}
            setSearch={setSearch}
          />

          <div className="space-y-6">
            <ScoreForm onSubmit={handleScoreSubmit} busy={busy} />

            <section className="rounded-2xl border border-white/10 bg-[#10131d] p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <Search size={18} className="text-lime-400" />
                <h2 className="font-black text-white">
                  Find a Player
                </h2>
              </div>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Look up a player's current rank and score in Redis.
              </p>

              <form onSubmit={findPlayer} className="mt-4 flex gap-2">
                <input
                  value={lookupId}
                  onChange={(event) => setLookupId(event.target.value)}
                  placeholder="Enter user ID"
                  required
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#090c13] px-3 py-3 text-sm text-white outline-none focus:border-lime-400/60"
                />

                <button
                  type="submit"
                  aria-label="Find player"
                  className="rounded-xl bg-lime-400 px-4 text-black transition hover:bg-lime-300"
                >
                  <Search size={18} />
                </button>
              </form>

              {playerInfo && (
                <div className="mt-4 rounded-xl border border-lime-400/20 bg-lime-400/5 p-4">
                  <p className="truncate font-bold text-white">
                    {playerInfo.userId}
                  </p>
                  <div className="mt-3 flex justify-between gap-3 text-sm">
                    <span className="text-zinc-500">Current rank</span>
                    <span className="font-bold text-lime-400">
                      #{playerInfo.rank}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between gap-3 text-sm">
                    <span className="text-zinc-500">Current score</span>
                    <span className="font-bold text-white">
                      {Number(playerInfo.score).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </section>

            <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <CircleHelp
                size={19}
                className="mt-0.5 shrink-0 text-zinc-500"
              />
              <div>
                <p className="text-sm font-semibold text-zinc-300">
                  How ranking works
                </p>
                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Players are ordered by score from highest to lowest.
                  Redis sorted sets make score updates and rank lookups
                  efficient.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs text-zinc-600 sm:flex-row">
          <p>NEXUS.GG · Redis Leaderboard Project</p>
          <p>React + Vite · Express · ioredis</p>
        </footer>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="neon-card rounded-2xl border border-white/10 bg-[#10131d] p-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold tracking-[0.16em] text-zinc-500">
          {label}
        </p>
        <Icon size={19} className={color} />
      </div>
      <p className={`mt-4 text-2xl font-black ${color}`}>{value}</p>
    </div>
  );
}