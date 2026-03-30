import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Appointment, AppointmentStatus } from '../types';
import { api } from '../api';

interface CreateAppointmentDTO {
  name: string;
  phone: string;
  description: string;
}

export function useAppointments(page = 1) {
  const queryClient = useQueryClient();

  const { data: appointments, isLoading, error } = useQuery<Appointment[]>({
    queryKey: ['appointments', page],
    queryFn: async () => {
      const response = await api.get(`/appointments?page=${page}&limit=10`);
      return response.data;
    },
  });

  // 2. Mutação para Atualizar Status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: AppointmentStatus }) => {
      await api.patch(`/appointments/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || 'Erro ao atualizar status';
      alert(message); 
    }
  });


  const createAppointmentMutation = useMutation({
    mutationFn: async (data: CreateAppointmentDTO) => {
     
      const patientResponse = await api.post('/patients', {
        name: data.name,
        phone: data.phone
      });

      const patientId = patientResponse.data.id;

      // Depois criamos o atendimento vinculado a esse ID
      return api.post('/appointments', {
        patientId,
        description: data.description
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Erro ao criar agendamento');
    }
  });

  return { 
    appointments, 
    isLoading, 
    error,
    updateStatus: updateStatusMutation.mutate,
    isUpdating: updateStatusMutation.isPending,
    createAppointment: createAppointmentMutation.mutateAsync,
    isCreating: createAppointmentMutation.isPending
  };
}