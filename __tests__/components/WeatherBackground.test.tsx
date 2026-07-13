import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import WeatherBackground from "@/components/WeatherBackground";

// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear();
});

describe("WeatherBackground", () => {
  test("renders null when condition is clear", () => {
    const { container } = render(<WeatherBackground condition="clear" city="Pune" />);
    expect(container.innerHTML).toBe("");
  });

  test("renders overlay div when condition is heavy_rain", () => {
    const { container } = render(<WeatherBackground condition="heavy_rain" city="Pune" />);
    const overlay = container.querySelector('[aria-hidden="true"]');
    expect(overlay).toBeInTheDocument();
  });

  test("overlay div has aria-hidden=true", () => {
    const { container } = render(<WeatherBackground condition="thunderstorm" city="Pune" />);
    const overlay = container.querySelector('[aria-hidden="true"]');
    expect(overlay).toBeInTheDocument();
  });

  test("overlay div has pointer-events-none class", () => {
    const { container } = render(<WeatherBackground condition="heavy_rain" city="Pune" />);
    const overlay = container.querySelector('[aria-hidden="true"]');
    expect(overlay).toHaveClass("pointer-events-none");
  });

  test("sr-only span is present and contains city name", () => {
    const { container } = render(<WeatherBackground condition="heavy_rain" city="Mumbai" />);
    const srOnly = container.querySelector(".sr-only");
    expect(srOnly).toBeInTheDocument();
    expect(srOnly?.textContent).toContain("Mumbai");
  });

  test("hint badge has correct aria-label", () => {
    render(<WeatherBackground condition="heavy_rain" city="Pune" />);
    const badge = screen.getByRole("status");
    expect(badge).toHaveAttribute("aria-label", "Weather background: Heavy Rain conditions in Pune");
  });
});
