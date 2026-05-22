import DecorativeStack from './DecorativeStack';

export default function LeftPanel() {
  return (
    <aside className="hidden lg:flex flex-col bg-primary text-white flex-[0_0_46%] max-w-[720px] min-w-0 p-12 md:p-14 relative overflow-hidden min-h-screen">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            'radial-gradient(60% 80% at 20% 0%, rgba(255,255,255,0.18), transparent 60%)',
            'radial-gradient(50% 60% at 100% 100%, rgba(0,0,0,0.18), transparent 60%)',
          ].join(', '),
        }}
      />

      {/* <div className="relative z-[2]">
        <Logo size="lg" variant="white" />
      </div> */}

      <div className="flex-1 flex flex-col justify-center gap-8 relative z-[2] mt-8">
        <div className="flex flex-col gap-3.5">
          <h2 className="m-0 text-4xl font-extrabold tracking-[-1.2px] leading-tight max-w-[480px]">
            The student marketplace for KMUTT.
          </h2>
          <p className="text-white/85 m-0 text-base leading-relaxed max-w-[460px]">
            Textbooks, dorm essentials, lab gear, hand-me-down bikes. Everything stays inside campus — verified by your
            Microsoft account.
          </p>
        </div>
        <DecorativeStack />
      </div>

      <div className="text-white/75 relative z-[2] text-[12.5px] flex items-center gap-3.5">
        <span>© 2026 Swap</span>
        <span className="w-[3px] h-[3px] rounded-full bg-white/40" />
        <span>Terms</span>
        <span className="w-[3px] h-[3px] rounded-full bg-white/40" />
        <span>Privacy</span>
      </div>
    </aside>
  );
}
