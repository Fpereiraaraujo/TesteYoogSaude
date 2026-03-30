import { useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster } from "sonner";
import { UserPlus, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { maskPhone } from "@/utils/masks";
import { useAppointments } from "@/hooks/useAppointments";
import { LoadingScreen } from "./components/LoadingScreen";
import { AppointmentForm } from "./components/AppointmentForm";
import { StatusBadge } from "./components/StatusBadge";
import { AppointmentActions } from "./components/AppointmentActions";
import { EmptyState } from "./components/EmptyState";

export interface AppointmentFormData {
  name: string;
  phone: string;
  description: string;
}

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { appointments, isLoading, updateStatus, createAppointment, isCreating } = useAppointments();
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<AppointmentFormData>();

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      await createAppointment(data);
      reset();
      setIsModalOpen(false);
    } catch (error) {
     
    }
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans antialiased">
      <Toaster richColors position="top-right" />
      
      <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-10">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
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
            
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl">
              <DialogHeader className="p-6 bg-white border-b border-slate-100">
                <DialogTitle className="text-2xl font-bold text-slate-900">Cadastrar Atendimento</DialogTitle>
              </DialogHeader>
              
              <div className="p-6">
                <AppointmentForm 
                  register={register}
                  onSubmit={handleSubmit(onSubmit)}
                  errors={errors}
                  isSubmitting={isCreating}
                  onPhoneChange={(val) => setValue("phone", maskPhone(val))}
                />
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <Card className="shadow-2xl shadow-slate-200 border-none overflow-hidden">
          <CardHeader className="bg-white border-b px-8 py-6">
            <CardTitle className="text-xl font-bold text-slate-800">Fila de Espera</CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="pl-8 py-4 font-bold text-slate-600 uppercase text-xs tracking-wider">Detalhes do Caso</TableHead>
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider">Status</TableHead>
                  <TableHead className="text-right pr-8 font-bold text-slate-600 uppercase text-xs tracking-wider">Ações</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {appointments?.length === 0 ? (
                  <EmptyState />
                ) : (
                  appointments?.map((app) => (
                    <TableRow key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                      <TableCell className="pl-8 py-5">
                        <div className="font-bold text-slate-700 text-lg leading-tight group-hover:text-blue-700 transition-colors">
                          {app.description}
                        </div>
                        <div className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">
                          ID: {app.id.slice(0, 8)} • {app.name}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <StatusBadge status={app.status} />
                      </TableCell>
                      
                      <TableCell className="text-right pr-8">
                        <AppointmentActions 
                          status={app.status} 
                          onUpdate={(newStatus) => updateStatus({ id: app.id, status: newStatus })} 
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}