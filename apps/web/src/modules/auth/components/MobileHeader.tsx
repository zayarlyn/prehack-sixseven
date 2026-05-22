import Logo from '@swap-web/common/components/Logo';

export default function MobileHeader() {
  return (
    <div className="flex flex-col gap-3 lg:hidden bg-primary text-white p-9 md:p-7 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(80% 120% at 110% -10%, rgba(255,255,255,0.16), transparent 55%)',
        }}
      />
      <div className="relative z-[2]">
        <Logo size="md" variant="white" />
      </div>
      <p className="text-white/90 relative z-[2] m-0 text-[15px] leading-snug">
        Buy and sell with fellow KMUTT students.
      </p>
    </div>
  );
}
