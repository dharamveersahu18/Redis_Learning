import { Gamepad2, Zap, Radio } from "lucide-react";

export default function Navbar({ connected }) {
  return (
    <header className="border-b border-white/10 bg-[#0b0e16]/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-lime-400/30 bg-lime-400/10 p-2.5">
            <Gamepad2 className="text-lime-400" size={25} />
          </div>

          <div>
            <h1 className="text-lg font-black tracking-tight text-white">
              NEXUS<span className="text-lime-400">.GG</span>
            </h1>
            <p className="text-[10px] tracking-[0.25em] text-zinc-500">
              COMPETITIVE ARENA
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2 sm:flex">
          <Zap size={15} className="text-lime-400" />
          <span className="text-xs font-semibold text-zinc-300">
            RANKED MODE
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Radio
            size={15}
            className={connected ? "text-lime-400" : "text-red-400"}
          />
          <span className={connected ? "text-lime-400" : "text-red-400"}>
            {connected ? "API CONNECTED" : "API OFFLINE"}
          </span>
        </div>
      </div>
    </header>
  );
}