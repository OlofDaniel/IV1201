import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import "@testing-library/jest-dom/vitest";
import { SignupPageForm } from "@/components/ui/custom/signup-page-form";

describe("SignupPageForm", () => {
  test("ska uppdatera alla fält korrekt efter input", () => {
    render(<SignupPageForm />);

    const inputFields = [
      { label: /First name/i, value: "TestName" },
      { label: /Surname/i, value: "TestSurname" },
      { label: /Person number/i, value: "20000101-1234" },
      { label: /Email/i, value: "TestEmail@test.com" },
      { label: /Username/i, value: "TestUsername" },
      { label: /Password/i, value: "TestPassword123!" },
    ];

    inputFields.forEach((field) => {
      const input = screen.getByLabelText(field.label);
      fireEvent.change(input, { target: { value: field.value } });
      expect(input).toHaveValue(field.value);
    });
  });

  test("sumbit knapp ska finnas och fungera", () => {
    render(<SignupPageForm />);

    const sumbitButton = screen.getByRole("button", { name: /sign up/i });
    expect(sumbitButton).toBeInTheDocument();
    expect(sumbitButton).toHaveAttribute("type", "submit");
  });
});
