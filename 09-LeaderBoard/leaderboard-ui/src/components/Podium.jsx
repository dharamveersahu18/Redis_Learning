import { Crown, Medal, Trophy } from "lucide-react";

const styles = {
  1: {
    height: "h-40",
    border: "border-yellow-400/40",
    glow: "shadow-yellow-400/10",
    text: "text-yellow-300",
    icon: "text-yellow-300",
    avatar: "bg-yellow-400/15",
  },
  2: {
    height: "h-28",
    border: "border-zinc-400/30",
    glow: "shadow-zinc-400/5",
    text: "text-zinc-200",
    icon: "text-zinc-300",
    avatar: "bg-zinc-400/15",
  },
  3: {
    height: "h-24",
    border: "border-orange-400/30",
    glow: "shadow-orange-400/5",
    text: "text-orange-300",
    icon: "text-orange-300",
    avatar: "bg-orange-400/15",
  },
};

function PodiumCard({ user, rank }) {
  const style = styles[rank];
  const Icon = rank === 1 ? Crown : Medal;

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center">
      <div
        className={`mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border ${style.border} ${style.avatar}`}
      >
        <Icon size={27} className={style.icon} />
      </div>

      <p className={`max-w-full truncate text-sm font-bold ${style.text}`}>
        {user.userId}
      </p>

      <p className="mt-1 text-lg font-black text-white">
        {user.score.toLocaleString()}
      </p>

      <p className="mb-3 text-[10px] tracking-widest text-zinc-500">
        POINTS
      </p>

      <div
        className={`flex w-full ${style.height} flex-col items-center justify-center rounded-t-2xl border border-b-0 ${style.border} bg-gradient-to-b from-white/[0.06] to-transparent shadow-xl ${style.glow}`}
      >
        <Trophy size={rank === 1 ? 27 : 21} className={style.icon} />
        <span className={`mt-2 text-2xl font-black ${style.text}`}>
          {String(rank).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

export default function Podium({ users }) {
  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-zinc-500">
        No scores yet. Add your first player to start the competition.
      </div>
    );
  }

  const first = users[0];
  const second = users[1];
  const third = users[2];

  return (
    <section className="rounded-2xl border border-white/10 bg-[#10131d] p-5 sm:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-lime-400">
            THE CHAMPIONS
          </p>
          <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">
            Top Players
          </h2>
        </div>
        <Trophy className="text-lime-400" size={25} />
      </div>

      <div className="mx-auto flex max-w-lg items-end gap-3 sm:gap-5">
        {second && <PodiumCard user={second} rank={2} />}
        <PodiumCard user={first} rank={1} />
        {third && <PodiumCard user={third} rank={3} />}
      </div>
    </section>
  );
}