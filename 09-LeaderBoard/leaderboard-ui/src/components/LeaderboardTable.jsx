import { Medal, RefreshCw, Search, Trophy } from "lucide-react";

export default function LeaderboardTable({
  users,
  loading,
  onRefresh,
  search,
  setSearch,
}) {
  const filteredUsers = users.filter((user) =>
    user.userId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#10131d]">
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-lime-400">
            LIVE STANDINGS
          </p>
          <h2 className="mt-2 text-xl font-black text-white">
            Leaderboard
          </h2>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-zinc-300 transition hover:border-lime-400/40 hover:text-lime-400 disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="border-b border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4">
          <Search size={17} className="text-zinc-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search player by user ID..."
            className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-zinc-600"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[440px] text-left">
          <thead>
            <tr className="border-b border-white/10 text-[10px] tracking-[0.16em] text-zinc-500">
              <th className="px-5 py-4 font-semibold">RANK</th>
              <th className="px-5 py-4 font-semibold">PLAYER</th>
              <th className="px-5 py-4 text-right font-semibold">SCORE</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.userId}
                className="border-b border-white/[0.05] transition hover:bg-lime-400/[0.03]"
              >
                <td className="px-5 py-4">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-black ${
                      user.rank === 1
                        ? "bg-yellow-400/10 text-yellow-300"
                        : user.rank === 2
                          ? "bg-zinc-400/10 text-zinc-300"
                          : user.rank === 3
                            ? "bg-orange-400/10 text-orange-300"
                            : "text-zinc-500"
                    }`}
                  >
                    {user.rank <= 3 ? (
                      <Medal size={17} />
                    ) : (
                      user.rank
                    )}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-lime-400/20 to-cyan-400/10 text-xs font-black uppercase text-lime-300">
                      {user.userId.slice(0, 2)}
                    </div>
                    <span className="font-semibold text-zinc-200">
                      {user.userId}
                    </span>
                  </div>
                </td>

                <td className="px-5 py-4 text-right">
                  <span className="font-black tabular-nums text-white">
                    {user.score.toLocaleString()}
                  </span>
                  <span className="ml-2 text-[10px] text-lime-400">
                    PTS
                  </span>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-5 py-12 text-center text-sm text-zinc-500"
                >
                  {loading
                    ? "Loading leaderboard..."
                    : search
                      ? "No matching players found."
                      : "No players yet. Add a score to begin."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-3 px-5 py-4 text-xs text-zinc-500">
        <span>{filteredUsers.length} players displayed</span>
        <span className="flex items-center gap-1.5">
          <Trophy size={13} className="text-lime-400" />
          Redis Sorted Set
        </span>
      </div>
    </section>
  );
}