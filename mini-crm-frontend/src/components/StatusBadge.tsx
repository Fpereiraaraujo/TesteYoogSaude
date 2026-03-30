import { Badge } from "@/components/ui/badge";
import { AppointmentStatus } from "@/types";
import { Clock, PlayCircle, CheckCircle } from "lucide-react";

interface StatusBadgeProps {
  status: AppointmentStatus;
}

const statusConfig = {
  WAITING: { label: "Aguardando", color: "bg-amber-100 text-amber-700", icon: Clock },
  IN_PROGRESS: { label: "Em Progresso", color: "bg-blue-100 text-blue-700", icon: PlayCircle },
  FINISHED: { label: "Finalizado", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge className={`${config.color} hover:${config.color} gap-1.5 shadow-none border-none font-bold py-1 px-3`}>
      <Icon size={14} />
      {config.label}
    </Badge>
  );
}