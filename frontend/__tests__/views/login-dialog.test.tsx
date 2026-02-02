import { render, screen, fireEvent } from "@testing-library/react";
import { describe, beforeEach, test, vi, expect } from "vitest";
import { LoginDialog } from "@/components/ui/custom/login-dialog";

describe("LoginDialog view test", () => {
  let mockLogin: ReturnType<typeof vi.fn>;
  let mockOnOpenChange: ReturnType<typeof vi.fn>;
  let mockEyeClick: ReturnType<typeof vi.fn>;
  let username: HTMLInputElement;
  let password: HTMLInputElement;
  let form: HTMLFormElement;

  beforeEach(() => {
    mockLogin = vi.fn();
    mockOnOpenChange = vi.fn();
    mockEyeClick = vi.fn();

    render(
      <LoginDialog
        username={null}
        password={null}
        passwordShown={false}
        dialogIsOpen={true}
        onLoginClick={mockLogin}
        onOpenChange={mockOnOpenChange}
        onEyeClick={mockEyeClick}
      />,
    );

    username = screen.getByLabelText("Username") as HTMLInputElement;
    password = screen.getByLabelText("Password") as HTMLInputElement;
    form = screen.getByRole("form") as HTMLFormElement;
  });

  test("calls onLoginClick with correct username and password", () => {
    fireEvent.change(username, { target: { value: "myuser" } });
    fireEvent.change(password, { target: { value: "mypassword" } });

    fireEvent.submit(form);

    expect(mockLogin).toHaveBeenCalledWith("myuser", "mypassword");
    expect(mockLogin).toHaveBeenCalledTimes(1);
  });
  test("calls onOpenChange(false) when Cancel is clicked", () => {
    const cancelButton = screen.getByRole("button", { name: /cancel/i });

    fireEvent.click(cancelButton);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    expect(mockOnOpenChange).toHaveBeenCalledTimes(1);
  });
  test("calls onEyeClick when eye is clicked", () => {
    const eyeButton = screen.getByRole("button", {
      name: /show password/i,
    });
    fireEvent.click(eyeButton);

    expect(mockEyeClick).toHaveBeenCalledTimes(1);
  });
  test("signup link points to /signup", () => {
    const signupLink = screen.getByRole("link", { name: /sign up here/i });

    expect(signupLink).toHaveAttribute("href", "/signup");
  });
});
