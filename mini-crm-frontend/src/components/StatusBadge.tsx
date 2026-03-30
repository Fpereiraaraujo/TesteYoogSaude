import { Badge } from "@/components/ui/badge";
import { Clock, PlayCircle, CheckCircle, HelpCircle } from "lucide-react";

const statusConfig: Record<string, any> = {
  waiting: { label: "Aguardando", color: "bg-amber-100 text-amber-700", icon: Clock },
  in_progress: { label: "Em Progresso", color: "bg-blue-100 text-blue-700", icon: PlayCircle },
  completed: { label: "Finalizado", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
};

export function StatusBadge({ status }: { status: string }) {
  // Normaliza para minúsculo para evitar erro de WAITING vs waiting
  const normalizedStatus = status?.toLowerCase();
  const config = statusConfig[normalizedStatus] || { 
    label: status, 
    color: "bg-slate-100 text-slate-700", 
    icon: HelpCircle 
  };

  const Icon = config.icon || HelpCircle;

  return (
    <Badge className={`${config.color} hover:${config.color} gap-1.5 shadow-none border-none font-bold py-1 px-3 uppercase text-[10px]`}>
      <Icon size={14} data-testid="status-icon" />
      {config.label}
    </Badge>
  );
}