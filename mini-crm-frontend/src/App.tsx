import { useAppointments } from './hooks/useAppointments';
import { CheckCircle, PlayCircle, Clock, UserPlus } from 'lucide-react';

export default function App() {
  const { appointments, isLoading, updateStatus } = useAppointments();

  if (isLoading) return <div className="flex h-screen items-center justify-center">Carregando CRM...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-900">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mini CRM Saúde</h1>
          <p className="text-gray-500">Gerencie os atendimentos do dia</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition">
          <UserPlus size={20} /> Novo Atendimento
        </button>
      </header>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600">
            <tr>
              <th className="px-6 py-4">Descrição</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {appointments?.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium">{app.description}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium 
                    ${app.status === 'WAITING' ? 'bg-yellow-100 text-yellow-700' : 
                      app.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    {app.status === 'WAITING' && <Clock size={14} />}
                    {app.status === 'IN_PROGRESS' && <PlayCircle size={14} />}
                    {app.status === 'FINISHED' && <CheckCircle size={14} />}
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  {app.status === 'WAITING' && (
                    <button 
                      onClick={() => updateStatus({ id: app.id, status: 'IN_PROGRESS' })}
                      className="text-xs font-bold text-blue-600 hover:underline">
                      INICIAR
                    </button>
                  )}
                  {app.status === 'IN_PROGRESS' && (
                    <button 
                      onClick={() => updateStatus({ id: app.id, status: 'FINISHED' })}
                      className="text-xs font-bold text-green-600 hover:underline">
                      FINALIZAR
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}