import { useState } from "react";
import { useAppointments } from "./hooks/useAppointments";
import { StatusBadge } from "./components/StatusBadge";
import { CreateAppointmentForm } from "./components/CreateAppointmentForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Loader2 } from "lucide-react";

export default function App() {
  const [open, setOpen] = useState(false);
  const { appointments, isLoading, updateStatus, createAppointment, isCreating } = useAppointments();

  const handleCreate = async (data: any) => {
    await createAppointment(data);
    setOpen(false);
  };

  if (isLoading) return (
    <div className="h-screen w-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>
  );

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Dashboard CRM</h1>
          <p className="text-muted-foreground text-lg">Sistema de triagem e fluxo YoogSaúde</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-lg">
              <UserPlus className="mr-2 h-5 w-5" /> Novo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-2xl">Cadastrar Atendimento</DialogTitle>
            </DialogHeader>
            <CreateAppointmentForm onSubmit={handleCreate} isSubmitting={isCreating} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-xl border-none">
        <CardHeader className="bg-slate-50/50 border-b">
          <CardTitle>Fila de Atendimentos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[400px] pl-6">Descrição do Caso</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments?.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium pl-6 py-4">
                    {app.description}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={app.status} />
                  </TableCell>
                  <TableCell className="text-right pr-6 space-x-2">
                    {app.status === 'WAITING' && (
                      <Button variant="outline" size="sm" onClick={() => updateStatus({ id: app.id, status: 'IN_PROGRESS' })}>
                        Iniciar
                      </Button>
                    )}
                    {app.status === 'IN_PROGRESS' && (
                      <Button variant="default" size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => updateStatus({ id: app.id, status: 'FINISHED' })}>
                        Finalizar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}