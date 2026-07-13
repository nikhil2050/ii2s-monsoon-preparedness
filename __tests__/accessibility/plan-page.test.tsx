import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import PlanDashboard from "@/components/PlanDashboard";
import { mockPlan, mockProfile } from "../mocks/mockData";

expect.extend(toHaveNoViolations);

beforeEach(() => {
  jest.restoreAllMocks();
  Storage.prototype.getItem = jest.fn().mockImplementation((key: string) => {
    if (key === "monsoonPlan") return JSON.stringify(mockPlan);
    if (key === "userProfile") return JSON.stringify(mockProfile);
    if (key === "monsoonForecast") return null;
    return null;
  });
});

describe("Plan page accessibility", () => {
  test("PlanDashboard has no accessibility violations", async () => {
    const { container } = render(
      <PlanDashboard plan={mockPlan} location={mockProfile.location} profile={mockProfile} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("risk badge conveys information beyond just color", () => {
    const { container } = render(
      <PlanDashboard plan={mockPlan} location={mockProfile.location} profile={mockProfile} />
    );
    const badge = container.querySelector(".capitalize");
    expect(badge?.textContent?.trim().toLowerCase()).toMatch(/high|moderate|low|extreme/);
  });
});
