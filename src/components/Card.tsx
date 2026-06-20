import {
  Users,
  UserCheck,
  AlertTriangle,
  Wallet,
} from "lucide-react";

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
  const getIcon = () => {
    if (title.includes("Total")) {
      return <Users size={22} />;
    }

    if (title.includes("ativos")) {
      return <UserCheck size={22} />;
    }

    if (title.includes("vencidos")) {
      return <AlertTriangle size={22} />;
    }

    return <Wallet size={22} />;
  };

  return (
    <div
      className="
        group
        rounded-3xl
        border
        border-white/10
        bg-white/[0.03]
        p-6
        shadow-2xl
        shadow-black/30
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#7CFF5B]/30
        hover:shadow-[#7CFF5B]/10
      "
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          {title}
        </p>

        <div
          className="
            rounded-xl
            bg-[#7CFF5B]/10
            p-2
            text-[#7CFF5B]
          "
        >
          {getIcon()}
        </div>
      </div>

      <h3 className="mt-4 text-4xl font-bold">
        {value}
      </h3>

      <p className="mt-3 text-sm text-zinc-500">
        {description}
      </p>
    </div>
  );
}