import { Play, CheckCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppointmentActionsProps {
  status: 'WAITING' | 'IN_PROGRESS' | 'FINISHED';
  onUpdate: (newStatus: 'IN_PROGRESS' | 'FINISHED') => void;
  onDeleteRequest: () => void;
}

export function AppointmentActions({ status, onUpdate, onDeleteRequest }: AppointmentActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <div className="mr-2">
        {/* Se estiver FINISHED, não mostra botão, apenas o texto */}
        {status === 'FINISHED' ? (
          <span className="text-slate-400 font-bold italic text-sm flex items-center gap-1 uppercase tracking-wider">
            <CheckCircle size={14} className="text-emerald-500" />
            Atendido
          </span>
        ) : (
          <Button 
            size="sm"
            className={status === 'IN_PROGRESS' 
              ? "bg-emerald-600 hover:bg-emerald-700 font-bold text-white shadow-md shadow-emerald-100" 
              : "border-blue-200 text-blue-600 font-bold hover:bg-blue-50"}
            variant={status === 'IN_PROGRESS' ? "default" : "outline"}
            // LÓGICA: Se está WAITING, vai para IN_PROGRESS. Se está IN_PROGRESS, vai para FINISHED.
            onClick={() => onUpdate(status === 'WAITING' ? 'IN_PROGRESS' : 'FINISHED')}
          >
            {status === 'WAITING' ? (
              <>
                <Play size={14} className="mr-2 fill-current"/>
                ATENDER
              </>
            ) : (
              <>
                <CheckCircle size={14} className="mr-2"/>
                FINALIZAR
              </>
            )}
          </Button>
        )}
      </div>

      <div className="h-4 w-[1px] bg-slate-200 mx-1" />

      <Button
        variant="ghost"
        size="icon"
        onClick={onDeleteRequest}
        aria-label="Excluir" 
        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );
}