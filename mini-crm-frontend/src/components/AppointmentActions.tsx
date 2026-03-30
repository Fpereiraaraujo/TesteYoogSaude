import { Button } from "@/components/ui/button";

interface AppointmentActionsProps {
  status: 'WAITING' | 'IN_PROGRESS' | 'FINISHED';
  onUpdate: (newStatus: 'IN_PROGRESS' | 'FINISHED') => void;
}

export function AppointmentActions({ status, onUpdate }: AppointmentActionsProps) {
  if (status === 'FINISHED') {
    return <span className="text-slate-300 font-bold italic text-sm">ATENDIDO</span>;
  }

  if (status === 'IN_PROGRESS') {
    return (
      <Button 
        className="bg-emerald-600 hover:bg-emerald-700 font-bold text-white shadow-md shadow-emerald-100" 
        onClick={() => onUpdate('FINISHED')}
      >
        FINALIZAR
      </Button>
    );
  }

  return (
    <Button 
      variant="outline" 
      className="border-blue-200 text-blue-600 font-bold hover:bg-blue-50" 
      onClick={() => onUpdate('IN_PROGRESS')}
    >
      ATENDER
    </Button>
  );
}