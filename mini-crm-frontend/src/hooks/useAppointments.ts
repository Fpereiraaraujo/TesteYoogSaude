import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '../api';

export type AppointmentStatus = 'WAITING' | 'IN_PROGRESS' | 'FINISHED';

export interface Appointment {
  id: string;
  description: string;
  status: AppointmentStatus;
  name: string;  // Injetado pelo select
  phone: string; // Injetado pelo select
  patient?: {    // Estrutura original da API
    name: string;
    phone: string;
  };
}

interface CreateAppointmentDTO {
  name: string;
  phone: string;
  description: string;
}

export function useAppointments(page = 1) {
  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery<any, Error, Appointment[]>({
    queryKey: ['appointments', page],
    queryFn: async () => {
      const response = await api.get(`/appointments?page=${page}&limit=10`);
      return response.data;
    },
    // Pattern Sênior: Transformação de dados na camada de Hook
    select: (data) => data.map((app: any) => ({
      ...app,
      name: app.patient?.name || 'Paciente s/ nome',
      phone: app.patient?.phone || ''
    }))
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: AppointmentStatus }) => {
      await api.patch(`/appointments/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Status atualizado!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Erro ao atualizar status');
    }
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: CreateAppointmentDTO) => {
      const patientResponse = await api.post('/patients', {
        name: data.name,
        phone: data.phone
      });

      return api.post('/appointments', {
        patientId: patientResponse.data.id,
        description: data.description
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Agendamento realizado!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Erro ao criar agendamento');
    }
  });

  return { 
    appointments, 
    isLoading, 
    updateStatus: updateStatusMutation.mutate,
    createAppointment: createAppointmentMutation.mutateAsync,
    isCreating: createAppointmentMutation.isPending
  };
}