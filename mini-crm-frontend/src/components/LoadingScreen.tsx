import { Loader2 } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="text-slate-500 font-bold tracking-tight text-lg">Carregando YoogSaúde...</p>
    </div>
  );
}