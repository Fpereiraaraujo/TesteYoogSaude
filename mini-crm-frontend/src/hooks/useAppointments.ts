import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '../api';

export type AppointmentStatus = 'WAITING' | 'IN_PROGRESS' | 'FINISHED';

export interface Appointment {
  id: string;
  description: string;
  status: AppointmentStatus;
  name: string;  
  phone: string; 
  patient?: {    
    name: string;
    phone: string;
  };
}

export function useAppointments(page = 1, search = '', status = '') {
  const queryClient = useQueryClient();


  const { data: appointments, isLoading } = useQuery<any, Error, Appointment[]>({
    queryKey: ['appointments', page, search, status],
    queryFn: async () => {
      const response = await api.get('/appointments', {
        params: {
          page,
          limit: 10,
          search: search || undefined,
          status: status || undefined,
        }
      });
      return response.data;
    },
    select: (data) => {
      const list = Array.isArray(data) ? data : (data.data || []);
      return list.map((app: any) => ({
        ...app,
        name: app.patient?.name || 'Paciente não identificado',
        phone: app.patient?.phone || '',
      }));
    },
    staleTime: 1000 * 5,
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
      toast.error(err.response?.data?.message || 'Erro ao transicionar status');
    }
  });

  
  const createAppointmentMutation = useMutation({
    mutationFn: async (data: any) => {
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
      toast.success('Agendamento registrado na fila!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Erro ao criar agendamento');
    }
  });

  const deleteAppointmentMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/appointments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Atendimento removido com sucesso!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Não foi possível excluir o atendimento');
    }
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: async ({ id, description }: { id: string; description: string }) => {
      await api.put(`/appointments/${id}`, { description });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Informações atualizadas!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Erro ao editar atendimento');
    }
  });

  return { 
    appointments, 
    isLoading, 
    updateStatus: updateStatusMutation.mutate,
    createAppointment: createAppointmentMutation.mutateAsync, 
    deleteAppointment: deleteAppointmentMutation.mutate,
    updateAppointment: updateAppointmentMutation.mutate,
    isCreating: createAppointmentMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending
  };
}