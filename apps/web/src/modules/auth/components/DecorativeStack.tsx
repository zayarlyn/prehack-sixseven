/* ── Decorative card stack ── */

const CARD_PALETTE: Record<string, { bg: string; stripe: string; label: string }> = {
  Electronics: { bg: '#eef1f7', stripe: '#dbe1ec', label: '#3c4a64' },
  Furniture: { bg: '#f1efe9', stripe: '#e3dfd2', label: '#6b5d3a' },
  Books: { bg: '#fef3ec', stripe: '#fde0cd', label: '#a3580f' },
};

interface DecorCardProps {
  title: string;
  price: string;
  category: keyof typeof CARD_PALETTE;
  tag: string;
  top: number;
  left: number;
  rotate: number;
  z: number;
}

function DecorCard({ title, price, category, tag, top, left, rotate, z }: DecorCardProps) {
  const p = CARD_PALETTE[category];
  return (
    <div
      className="absolute w-[168px] h-[218px] bg-white rounded-[10px] shadow-xl overflow-hidden"
      style={{
        top,
        left,
        zIndex: z,
        transform: `rotate(${rotate}deg)`,
      }}
    >
      <div
        className="w-full h-[130px] flex items-center justify-center"
        style={{
          background: `repeating-linear-gradient(135deg, ${p.bg} 0 12px, ${p.stripe} 12px 24px)`,
        }}
      >
        <span
          className="font-mono text-[10.5px] px-[7px] py-[3px] rounded-[4px] tracking-[0.2px] uppercase"
          style={{
            color: p.label,
            background: 'rgba(255,255,255,0.78)',
          }}
        >
          [{tag}]
        </span>
      </div>
      <div className="p-3 text-od-text">
        <div className="text-xs font-medium leading-tight overflow-hidden text-ellipsis whitespace-nowrap">{title}</div>
        <div className="text-base font-extrabold mt-1.5 tracking-[-0.3px]">{price}</div>
      </div>
    </div>
  );
}

export default function DecorativeStack() {
  return (
    <div className="relative h-60 max-w-[440px]">
      <DecorCard
        title="TI-84 Plus calculator"
        price="฿1,850"
        category="Electronics"
        tag="TI-84"
        top={0}
        left={0}
        rotate={-4}
        z={1}
      />
      <DecorCard
        title="IKEA MALM desk, white"
        price="฿1,200"
        category="Furniture"
        tag="MALM desk"
        top={-8}
        left={120}
        rotate={3}
        z={2}
      />
      <DecorCard
        title="Calculus 8th ed."
        price="฿980"
        category="Books"
        tag="Calculus"
        top={0}
        left={240}
        rotate={-2}
        z={3}
      />
    </div>
  );
}
