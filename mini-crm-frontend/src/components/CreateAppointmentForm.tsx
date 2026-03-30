import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface FormData {
  name: string;
  phone: string;
  description: string;
}

interface Props {
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting: boolean;
}

export function CreateAppointmentForm({ onSubmit, isSubmitting }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <div className="space-y-2">
        <label className="text-sm font-semibold">Nome do Paciente</label>
        <Input {...register("name", { required: true })} placeholder="Fernando Pereira" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold">Telefone</label>
        <Input {...register("phone", { required: true })} placeholder="41 99999-9999" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold">Descrição</label>
        <Textarea {...register("description", { required: true })} placeholder="Motivo da consulta..." />
      </div>
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Criar Agendamento"}
      </Button>
    </form>
  );
}