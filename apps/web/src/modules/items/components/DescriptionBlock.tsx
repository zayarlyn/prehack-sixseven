interface DescriptionBlockProps {
  description: string;
}

export default function DescriptionBlock({ description }: DescriptionBlockProps) {
  return (
    <section className="bg-white border border-border rounded-xl p-[22px_24px] max-w-[920px] mt-9">
      <h2 className="text-[16px] font-bold tracking-[-0.2px]">Description</h2>
      <p className="mt-3 text-[15px] leading-[1.65] whitespace-pre-wrap text-foreground">{description}</p>
    </section>
  );
}
