import { describe, test, expect, vi } from "vitest";
import {
  togglePasswordShown,
  setDialogIsOpen,
} from "@/models/Redux/login-slice";

// Mocks the postLoginThunk call to see what parameters were used
vi.mock("@/communication/login-communication", () => ({
  postLoginThunk: vi.fn(() => vi.fn()),
}));
import { postLoginThunk } from "@/communication/login-communication";
import { createLoginPresenterHandlers } from "@/presenters/login-dialog-presenter";

describe("loginPresenter presenter test", () => {
  test("dispatches login thunk with credentials", () => {
    const dispatch = vi.fn();
    const loginHandlers = createLoginPresenterHandlers(dispatch);

    loginHandlers.onLoginClick("usr", "pswrd");

    expect(postLoginThunk).toHaveBeenCalledWith({
      username: "usr",
      password: "pswrd",
    });
    expect(dispatch).toHaveBeenCalledWith(expect.any(Function));
  });

  test("dispatches togglePasswordShown", () => {
    const dispatch = vi.fn();
    const loginHandlers = createLoginPresenterHandlers(dispatch);

    loginHandlers.onEyeClick();

    expect(dispatch).toHaveBeenCalledWith(togglePasswordShown());
  });

  test("dispatches setDialogIsOpen(false)", () => {
    const dispatch = vi.fn();
    const loginHandlers = createLoginPresenterHandlers(dispatch);

    loginHandlers.onOpenChange(false);

    expect(dispatch).toHaveBeenCalledWith(setDialogIsOpen(false));
  });
});
