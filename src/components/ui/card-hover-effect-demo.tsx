import { HoverEffect } from "@/components/ui/card-hover-effect";

export default function CardHoverEffectDemo({ items }: { items: any[] }) {
  return (
    <div className="max-w-7xl mx-auto px-8">
      <HoverEffect items={items} />
    </div>
  );
}