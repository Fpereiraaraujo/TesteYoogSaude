import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAppointments } from "./hooks/useAppointments";
import { StatusBadge } from "./components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, Loader2, Stethoscope } from "lucide-react";
import { Toaster } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";

interface AppointmentFormData {
  name: string;
  phone: string;
  description: string;
}

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { appointments, isLoading, updateStatus, createAppointment, isCreating } = useAppointments();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AppointmentFormData>();

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      await createAppointment(data);
      reset();
      setIsModalOpen(false);
    } catch (error) {
      // Erro tratado no hook via Sonner
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-500 font-medium">Carregando painel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <Toaster richColors position="top-right" />
      
      <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600">
              <Stethoscope size={28} />
              <span className="font-black tracking-tighter text-2xl uppercase">YoogSaúde</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Gerenciamento de Fluxo</h1>
            <p className="text-slate-500 text-lg">Acompanhe a triagem e atendimentos em tempo real.</p>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 h-14 px-8 text-md font-bold transition-all hover:scale-105 active:scale-95">
                <UserPlus className="mr-2 h-5 w-5" /> NOVO PACIENTE
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Cadastrar Atendimento</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">NOME DO PACIENTE</label>
                  <Input {...register("name", { required: "Campo obrigatório" })} placeholder="Nome completo" className="h-12" />
                  {errors.name && <span className="text-xs text-red-500 font-medium">{errors.name.message}</span>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">TELEFONE / WHATSAPP</label>
                  <Input {...register("phone", { required: "Campo obrigatório" })} placeholder="41 99999-9999" className="h-12" />
                  {errors.phone && <span className="text-xs text-red-500 font-medium">{errors.phone.message}</span>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">DESCRIÇÃO DO CASO</label>
                  <Textarea {...register("description", { required: "Campo obrigatório" })} placeholder="Relato breve do paciente..." className="min-h-[100px] resize-none" />
                  {errors.description && <span className="text-xs text-red-500 font-medium">{errors.description.message}</span>}
                </div>

                <Button type="submit" className="w-full h-12 bg-blue-600 font-bold text-md" disabled={isCreating}>
                  {isCreating ? <Loader2 className="animate-spin" /> : "CONFIRMAR REGISTRO"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* LISTA / CARD */}
        <Card className="shadow-2xl shadow-slate-200 border-none overflow-hidden">
          <CardHeader className="bg-white border-b px-8 py-6">
            <CardTitle className="text-xl font-bold text-slate-800">Fila de Espera</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="pl-8 py-4 font-bold text-slate-600">DETALHES DO CASO</TableHead>
                  <TableHead className="font-bold text-slate-600">STATUS</TableHead>
                  <TableHead className="text-right pr-8 font-bold text-slate-600">AÇÕES</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-20 text-slate-400 font-medium">
                      Nenhum atendimento em aberto no momento.
                    </TableCell>
                  </TableRow>
                )}
                {appointments?.map((app) => (
                  <TableRow key={app.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="pl-8 py-5">
                      <div className="font-bold text-slate-700 text-lg leading-tight">{app.description}</div>
                      <div className="text-xs text-slate-400 mt-1 uppercase tracking-widest">ID: {app.id.slice(0,8)}</div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={app.status} />
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      {app.status === 'WAITING' && (
                        <Button variant="outline" className="border-blue-200 text-blue-600 font-bold hover:bg-blue-50" onClick={() => updateStatus({ id: app.id, status: 'IN_PROGRESS' })}>
                          ATENDER
                        </Button>
                      )}
                      {app.status === 'IN_PROGRESS' && (
                        <Button className="bg-emerald-600 hover:bg-emerald-700 font-bold" onClick={() => updateStatus({ id: app.id, status: 'FINISHED' })}>
                          FINALIZAR
                        </Button>
                      )}
                      {app.status === 'FINISHED' && (
                        <span className="text-slate-300 font-bold italic text-sm">ATENDIDO</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}