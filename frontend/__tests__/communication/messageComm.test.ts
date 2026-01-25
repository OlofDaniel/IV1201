import { expect, test, vi } from "vitest";
import { fetchMessageThunk } from "@/communication/messageComm";

test("Rätt meddelande returneras", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "message from the backend" }),
      }),
    ),
  );

  const action = await fetchMessageThunk()(vi.fn(), vi.fn(), undefined);

  const responseMessage = action.payload.message;

  expect(responseMessage).toContain("message from the backend");
});
