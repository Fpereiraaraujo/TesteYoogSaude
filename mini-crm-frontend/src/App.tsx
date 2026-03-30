import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Toaster } from "sonner";
import { UserPlus, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppointments, AppointmentStatus } from "@/hooks/useAppointments";
import { maskPhone } from "@/utils/masks";
import { AppointmentFormData } from "@/types/appointment";
import { LoadingScreen } from "./components/LoadingScreen";
import { AppointmentForm } from "./components/AppointmentForm";
import { StatusBadge } from "./components/StatusBadge";
import { AppointmentActions } from "./components/AppointmentActions";
import { EmptyState } from "./components/EmptyState";
import { AppointmentFilters } from "./components/AppointmentFilters";
import { Pagination } from "./components/Pagination";
import { DeleteModal } from "./components/DeleteModal";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(""); 
  const [debouncedSearch, setDebouncedSearch] = useState(""); 
  const [statusFilter, setStatusFilter] = useState("all");
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); 
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { appointments, isLoading, updateStatus, createAppointment, deleteAppointment, isCreating } = useAppointments(
    page, 
    debouncedSearch, 
    statusFilter === "all" ? "" : statusFilter
  );
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<AppointmentFormData>();

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      await createAppointment(data);
      reset();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans antialiased text-slate-900">
      <Toaster richColors position="top-right" />
      
      <DeleteModal 
        isOpen={!!appointmentToDelete} 
        onClose={() => setAppointmentToDelete(null)}
        onConfirm={() => {
          if (appointmentToDelete) {
            deleteAppointment(appointmentToDelete);
            setAppointmentToDelete(null);
          }
        }}
      />

      <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600">
              <Stethoscope size={28} />
              <span className="font-black tracking-tighter text-2xl uppercase">YoogSaúde</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Fluxo de Atendimento</h1>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 h-14 px-8 font-bold transition-all hover:scale-105 active:scale-95">
                <UserPlus className="mr-2 h-5 w-5" /> NOVO PACIENTE
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] p-0 border-none shadow-2xl">
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

        <AppointmentFilters 
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusChange={(val) => { setStatusFilter(val); setPage(1); }}
          onClear={() => { setSearch(""); setDebouncedSearch(""); setStatusFilter("all"); setPage(1); }}
        />

        <Card className="shadow-2xl shadow-slate-200 border-none overflow-hidden bg-white">
          <CardHeader className="bg-white border-b px-8 py-6">
            <CardTitle className="text-xl font-bold text-slate-800">Fila de Espera</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="pl-8 py-5 font-bold text-slate-600 uppercase text-xs">Paciente / Caso</TableHead>
                  <TableHead className="font-bold text-slate-600 uppercase text-xs">Status</TableHead>
                  <TableHead className="text-right pr-8 font-bold text-slate-600 uppercase text-xs">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!appointments || appointments.length === 0 ? (
                  <EmptyState />
                ) : (
                  appointments.map((app) => (
                    <TableRow key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                      <TableCell className="pl-8 py-5">
                        <div className="font-bold text-slate-700 text-lg group-hover:text-blue-700 transition-colors capitalize">
                          {app.description}
                        </div>
                        <div className="text-xs text-slate-400 mt-1 font-semibold flex items-center gap-2">
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">ID: {app.id.slice(0, 6)}</span>
                          <span>• {app.name}</span>
                        </div>
                      </TableCell>
                      <TableCell><StatusBadge status={app.status} /></TableCell>
                      <TableCell className="text-right pr-8">
                        <AppointmentActions 
                          status={app.status} 
                          onUpdate={(newStatus) => updateStatus({ id: app.id, status: newStatus as AppointmentStatus })}
                          onDeleteRequest={() => setAppointmentToDelete(app.id)} 
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <Pagination 
              page={page} 
              hasMore={!!appointments && appointments.length >= 10} 
              onPageChange={setPage} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}