import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Appointment, AppointmentStatus } from '../types';
import { api } from '../api';

export function useAppointments(page = 1) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<Appointment[]>({
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
    },
  });

  return { appointments: data, isLoading, updateStatus: updateStatusMutation.mutate };
}