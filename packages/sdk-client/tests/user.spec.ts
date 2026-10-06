import { describe, expect, it } from "vitest";

describe("User", () => {
  it("should be able to get the viewer", async () => {
    const viewer = await threatmap.user.viewer();
    expect(viewer.kind).toBe("CloudUser");
  });
});
