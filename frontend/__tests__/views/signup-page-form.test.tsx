import { render, screen, fireEvent } from "@testing-library/react";
import { describe, beforeEach, expect, test, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { SignupPageForm } from "@/components/ui/custom/signup-page-form";

describe("SignupPageForm", () => {
  let mockEyeClick: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockEyeClick = vi.fn();
    render(<SignupPageForm passwordShown={false} onEyeClick={mockEyeClick} />);
  });

  test("fields are updated with correct input values", () => {
    const inputFields = [
      { label: "First name", value: "TestName" },
      { label: "Surname", value: "TestSurname" },
      { label: "Person number", value: "20000101-1234" },
      { label: "Email", value: "TestEmail@test.com" },
      { label: "Username", value: "TestUsername" },
      { label: "Password", value: "TestPassword123!" },
      { label: "Confirm password", value: "TestPassword123!" },
    ];

    inputFields.forEach((field) => {
      const input = screen.getByLabelText(field.label, { exact: true });
      fireEvent.change(input, { target: { value: field.value } });
      expect(input).toHaveValue(field.value);
    });
  });
  test("sumbit button exists and can be pressed", () => {
    const submitButton = screen.getByRole("button", { name: /sign up/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("type", "submit");
  });
  test("calls onEyeClick when eye is clicked", () => {
    const eyeButton = screen.getByRole("button", {
      name: /show password/i,
    });
    fireEvent.click(eyeButton);

    expect(mockEyeClick).toHaveBeenCalledTimes(1);
  });
  test("cancel link button points to /", () => {
    const homepageLink = screen.getByRole("link", { name: /cancel signup/i });

    expect(homepageLink).toHaveAttribute("href", "/");
  });
});
