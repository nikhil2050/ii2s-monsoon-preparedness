import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import WeatherSidebar from "@/components/WeatherSidebar";
import { mockForecast } from "../mocks/mockData";

describe("WeatherSidebar", () => {
  test("displays city name", () => {
    render(<WeatherSidebar forecast={mockForecast} />);
    expect(screen.getByText("Pune")).toBeInTheDocument();
  });

  test("renders 7 day cards", () => {
    render(<WeatherSidebar forecast={mockForecast} />);
    const dayNames = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"];
    dayNames.forEach((name) => {
      expect(screen.getAllByText(name).length).toBeGreaterThanOrEqual(1);
    });
  });

  test("days with rainMm > 80 show red color class", () => {
    const { container } = render(<WeatherSidebar forecast={mockForecast} />);
    // Day 0 has rainMm=85, should have text-red-600
    const redElements = container.querySelectorAll(".text-red-600");
    expect(redElements.length).toBeGreaterThanOrEqual(1);
  });

  test("days with rainMm = 0 show blue-200 color class", () => {
    const { container } = render(<WeatherSidebar forecast={mockForecast} />);
    const blueElements = container.querySelectorAll(".text-blue-200");
    expect(blueElements.length).toBeGreaterThanOrEqual(1);
  });

  test("mini bar chart renders one bar per forecast day", () => {
    const { container } = render(<WeatherSidebar forecast={mockForecast} />);
    const bars = container.querySelectorAll('[title*="mm"]');
    expect(bars.length).toBe(7);
  });
});
