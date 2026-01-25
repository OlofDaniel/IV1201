import { render, screen, fireEvent } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { MessageView } from "@/views/messageView";

test("MessageView visar meddelande och hanterar klick", () => {
  const mockClick = vi.fn();

  render(
    <MessageView
      message="Hej Världen"
      loading={false}
      storeButtonClicked={mockClick}
      error={false}
    />,
  );

  const heading = screen.getByRole("heading");
  expect(heading.textContent).toBe("Hej Världen");

  const button = screen.getByRole("button", {
    name: /get message from backend/i,
  });
  fireEvent.click(button);

  expect(mockClick).toHaveBeenCalledTimes(1);
});
