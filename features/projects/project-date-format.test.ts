import { describe, expect, it } from "vitest";

import { formatCalendarDate } from "./project-date-format";

describe("formatCalendarDate", () => {
  it("formats an ISO calendar date without timezone conversion", () => {
    expect(formatCalendarDate("2026-05-22")).toBe("22/05/2026");
  });
});
