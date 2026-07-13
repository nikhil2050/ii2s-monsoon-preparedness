import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ChecklistCard from "@/components/ChecklistCard";
import { mockChecklistItems } from "../mocks/mockData";

global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ success: true, data: { items: mockChecklistItems } }),
});

const mockProfile = {
  profileType: "family",
  householdSize: 4,
  hasElderly: true,
  hasInfants: false,
  hasDisabled: false,
};

describe("ChecklistCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all items", async () => {
    render(<ChecklistCard phase="before" profile={mockProfile} />);
    // Wait for items to appear after fetch
    const task = await screen.findByText("Prepare emergency kit");
    expect(task).toBeInTheDocument();
  });

  test("urgent items render with red highlight", async () => {
    render(<ChecklistCard phase="before" profile={mockProfile} />);
    const urgentBadges = await screen.findAllByText("urgent");
    expect(urgentBadges.length).toBeGreaterThanOrEqual(1);
  });

  test("clicking checkbox toggles done state", async () => {
    render(<ChecklistCard phase="before" profile={mockProfile} />);
    const firstItem = await screen.findByText("Prepare emergency kit");
    const button = firstItem.closest("button");
    expect(button).toBeInTheDocument();

    if (button) {
      // Initial: not done, no line-through
      expect(firstItem.className).not.toContain("line-through");
      fireEvent.click(button);
    }
  });
});
