import { useState } from "react";
import { Plus, Zap } from "lucide-react";

export default function ScoreForm({ onSubmit, busy }) {
  const [userId, setUserId] = useState("");
  const [score, setScore] = useState("");
  const [mode, setMode] = useState("set");

  async function handleSubmit(event) {
    event.preventDefault();

    const success = await onSubmit({
      userId: userId.trim(),
      score: Number(score),
      mode,
    });

    if (success) {
      setUserId("");
      setScore("");
    }
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-[#10131d] p-5 sm:p-6">
      <p className="text-xs font-bold tracking-[0.2em] text-lime-400">
        PLAYER CONTROL
      </p>

      <h2 className="mt-2 text-xl font-black text-white">
        Manage Scores
      </h2>

      <p className="mt-2 text-sm leading-6 text-zinc-500">
        Add a player or award extra points to boost their ranking.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-black/30 p-1">
        <button
          type="button"
          onClick={() => setMode("set")}
          className={`flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold transition ${
            mode === "set"
              ? "bg-lime-400 text-black"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Plus size={16} />
          Set score
        </button>

        <button
          type="button"
          onClick={() => setMode("increment")}
          className={`flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold transition ${
            mode === "increment"
              ? "bg-lime-400 text-black"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Zap size={16} />
          Add points
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label className="mb-2 block text-xs font-semibold text-zinc-400">
            PLAYER USER ID
          </label>
          <input
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            placeholder="e.g. player_01"
            required
            maxLength={100}
            className="w-full rounded-xl border border-white/10 bg-[#090c13] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-lime-400/60"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold text-zinc-400">
            {mode === "set" ? "NEW TOTAL SCORE" : "POINTS TO AWARD"}
          </label>
          <input
            type="number"
            min="0"
            max="1000000000"
            step="1"
            value={score}
            onChange={(event) => setScore(event.target.value)}
            placeholder={mode === "set" ? "1000" : "100"}
            required
            className="w-full rounded-xl border border-white/10 bg-[#090c13] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-lime-400/60"
          />
        </div>

        <button
          type="submit"
          disabled={busy || !userId.trim() || score === ""}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 px-4 py-3.5 text-sm font-black text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {mode === "set" ? <Plus size={17} /> : <Zap size={17} />}
          {busy
            ? "PROCESSING..."
            : mode === "set"
              ? "SAVE SCORE"
              : "AWARD POINTS"}
        </button>
      </form>
    </section>
  );
}