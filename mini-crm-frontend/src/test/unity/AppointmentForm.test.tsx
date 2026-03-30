import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AppointmentForm } from "@/components/AppointmentForm";

describe("AppointmentForm", () => {
  const mockOnSubmit = vi.fn();
  const mockOnPhoneChange = vi.fn();

  // Mock simplificado do register do react-hook-form
  const mockRegister = vi.fn().mockReturnValue({
    onChange: vi.fn(),
    onBlur: vi.fn(),
    name: "phone",
    ref: vi.fn(),
  });

  const defaultProps = {
    register: mockRegister as any,
    onSubmit: mockOnSubmit,
    errors: {},
    isSubmitting: false,
    onPhoneChange: mockOnPhoneChange,
  };

  it("deve renderizar todos os campos e labels corretamente", () => {
    render(<AppointmentForm {...defaultProps} />);
    expect(screen.getByLabelText(/Nome do Paciente/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefone/i)).toBeInTheDocument();
  });

  it("deve chamar onPhoneChange ao digitar no telefone", () => {
    render(<AppointmentForm {...defaultProps} />);
    const input = screen.getByLabelText(/Telefone/i);
    
    // Dispara o evento de mudança
    fireEvent.change(input, { target: { value: "(41) 99999-8888" } });
    
    expect(mockOnPhoneChange).toHaveBeenCalled();
  });
});