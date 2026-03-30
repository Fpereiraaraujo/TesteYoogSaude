import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "@/App";
import * as useAppointmentsHook from "@/hooks/useAppointments";

vi.mock("@/hooks/useAppointments", () => ({
  useAppointments: vi.fn()
}));

describe("Integração: App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve abrir o modal e permitir preencher o nome", async () => {
    (useAppointmentsHook.useAppointments as any).mockReturnValue({
      appointments: [],
      isLoading: false,
      isCreating: false,
      createAppointment: vi.fn(),
      updateStatus: vi.fn(),
      deleteAppointment: vi.fn(),
    });

    render(<App />);
    const btn = screen.getByText(/NOVO PACIENTE/i);
    fireEvent.click(btn);

    await waitFor(() => {
      const input = screen.getByLabelText(/Nome do Paciente/i);
      fireEvent.change(input, { target: { value: "Teste" } });
      expect(input).toHaveValue("Teste");
    });
  });

  it("deve exibir o modal de exclusão quando houver um agendamento", async () => {
    const mockDelete = vi.fn();
    
    (useAppointmentsHook.useAppointments as any).mockReturnValue({
      appointments: [{ 
        id: "1", 
        name: "João", 
        description: "Gripe", 
        status: "waiting" 
      }],
      isLoading: false,
      isCreating: false,
      createAppointment: vi.fn(),
      updateStatus: vi.fn(),
      deleteAppointment: mockDelete,
    });

    render(<App />);

    // Tenta encontrar o botão de excluir pelo texto ou pelo papel de botão
    // Se o botão tem apenas o ícone, certifique-se que o componente AppointmentActions 
    // tem um aria-label="Excluir"
    const deleteBtn = await screen.findByRole("button", { name: /excluir/i });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(screen.getByText(/Excluir Atendimento\?/i)).toBeInTheDocument();
    });
  });
});