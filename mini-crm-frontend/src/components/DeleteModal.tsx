import { Trash2, AlertTriangle } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
}

export function DeleteModal({ isOpen, onClose, onConfirm, title }: DeleteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] border-none shadow-2xl">
        <DialogHeader className="flex flex-col items-center justify-center text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <AlertTriangle size={24} />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-xl font-bold text-slate-900">
              Excluir Atendimento?
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              {title || "Esta ação não pode ser desfeita. O agendamento será removido permanentemente da fila."}
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="flex-1 font-semibold border-slate-200"
          >
            Cancelar
          </Button>
          <Button 
            onClick={() => {
              onConfirm();
              onClose();
            }} 
            className="flex-1 bg-red-600 hover:bg-red-700 font-bold text-white shadow-lg shadow-red-100"
          >
            <Trash2 className="w-4 h-4 mr-2" /> EXCLUIR
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}