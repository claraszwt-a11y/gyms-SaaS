type CardProps = {
  title: string;
  value: string;
  description: string;
};

export function Card({
  title,
  value,
  description,
}: CardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/30">
      <p className="text-sm text-zinc-500">
        {title}
      </p>

      <h3 className="mt-4 text-3xl font-bold">
        {value}
      </h3>

      <p className="mt-3 text-sm text-zinc-500">
        {description}
      </p>
    </div>
  );
}