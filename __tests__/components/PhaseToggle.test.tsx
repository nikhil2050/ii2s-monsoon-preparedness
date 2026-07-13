import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import PhaseToggle from "@/components/PhaseToggle";

describe("PhaseToggle", () => {
  test("renders three tabs (Before / During / After)", () => {
    render(<PhaseToggle activePhase="before" onPhaseChange={jest.fn()} />);
    expect(screen.getByText("Before Monsoon")).toBeInTheDocument();
    expect(screen.getByText("During Monsoon")).toBeInTheDocument();
    expect(screen.getByText("After Monsoon")).toBeInTheDocument();
  });

  test("clicking During Monsoon calls onPhaseChange with during", () => {
    const onPhaseChange = jest.fn();
    render(<PhaseToggle activePhase="before" onPhaseChange={onPhaseChange} />);
    fireEvent.click(screen.getByText("During Monsoon"));
    expect(onPhaseChange).toHaveBeenCalledWith("during");
  });

  test("clicking After Monsoon calls onPhaseChange with after", () => {
    const onPhaseChange = jest.fn();
    render(<PhaseToggle activePhase="during" onPhaseChange={onPhaseChange} />);
    fireEvent.click(screen.getByText("After Monsoon"));
    expect(onPhaseChange).toHaveBeenCalledWith("after");
  });
});
