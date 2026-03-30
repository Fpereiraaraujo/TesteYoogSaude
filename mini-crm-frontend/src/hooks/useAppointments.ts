import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '../api';
import type { Appointment, AppointmentStatus } from '../types';

interface CreateAppointmentDTO {
  name: string;
  phone: string;
  description: string;
}

export function useAppointments(page = 1) {
  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery<Appointment[]>({
    queryKey: ['appointments', page],
    queryFn: async () => {
      const response = await api.get(`/appointments?page=${page}&limit=10`);
      return response.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: AppointmentStatus }) => {
      await api.patch(`/appointments/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Status atualizado com sucesso!');
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || 'Erro ao atualizar status';
      toast.error(message);
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
      toast.success('Agendamento realizado com sucesso!');
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || 'Erro ao criar agendamento';
      toast.error(message);
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