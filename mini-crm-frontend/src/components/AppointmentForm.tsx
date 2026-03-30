import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { nameRegex } from "@/utils/masks";
import { AppointmentFormData } from "@/App";


interface AppointmentFormProps {
  register: UseFormRegister<AppointmentFormData>;
  onSubmit: () => void;
  errors: FieldErrors<AppointmentFormData>;
  isSubmitting: boolean;
  onPhoneChange: (value: string) => void;
}

export function AppointmentForm({ register, onSubmit, errors, isSubmitting, onPhoneChange }: AppointmentFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nome do Paciente</label>
        <Input 
          {...register("name", { 
            required: "O nome é obrigatório",
            pattern: { value: nameRegex, message: "O nome não deve conter números" }
          })} 
          placeholder="Ex: João da Silva" 
          className="h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all" 
        />
        {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
      </div>
      
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Telefone / WhatsApp</label>
        <Input 
          {...register("phone", { 
            required: "O telefone é obrigatório",
            minLength: { value: 14, message: "Telefone incompleto" }
          })} 
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="(41) 99999-9999" 
          className="h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all" 
        />
        {errors.phone && <p className="text-xs text-red-500 font-medium">{errors.phone.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Descrição do Caso</label>
        <Textarea 
          {...register("description", { required: "A descrição é obrigatória" })} 
          placeholder="Relato breve dos sintomas..." 
          className="min-h-[120px] bg-slate-50/50 border-slate-200 focus:bg-white transition-all resize-none p-4" 
        />
        {errors.description && <p className="text-xs text-red-500 font-medium">{errors.description.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full h-14 bg-blue-600 hover:bg-blue-700 font-bold text-lg shadow-lg shadow-blue-100 mt-2">
        {isSubmitting ? <Loader2 className="animate-spin" /> : "CONFIRMAR REGISTRO"}
      </Button>
    </form>
  );
}