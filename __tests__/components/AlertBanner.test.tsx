import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import AlertBanner from "@/components/AlertBanner";

describe("AlertBanner", () => {
  test("renders informational banner when risk is low", () => {
    render(<AlertBanner riskLevel="low" />);
    expect(screen.getByText(/Risk level is/i)).toBeInTheDocument();
  });

  test("renders when risk is high", () => {
    render(<AlertBanner riskLevel="high" />);
    expect(screen.getByText(/HIGH RISK/i)).toBeInTheDocument();
  });

  test("renders when risk is extreme", () => {
    render(<AlertBanner riskLevel="extreme" />);
    expect(screen.getByText(/EXTREME RISK/i)).toBeInTheDocument();
  });

  test("emergency number 112 is visible in the DOM", () => {
    render(<AlertBanner riskLevel="high" />);
    const links = screen.getAllByRole("link");
    const has112 = links.some((link) => link.getAttribute("href")?.includes("112"));
    expect(has112).toBe(true);
  });

  test("flood helpline 1078 is visible in the DOM", () => {
    render(<AlertBanner riskLevel="extreme" />);
    const links = screen.getAllByRole("link");
    const has1078 = links.some((link) => link.getAttribute("href")?.includes("1078"));
    expect(has1078).toBe(true);
  });
});
