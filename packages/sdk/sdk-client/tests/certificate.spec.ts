import { describe, expect, it } from "vitest";

describe("Certificate", () => {
  it("should export, generate, and restore the instance certificate", async () => {
    const password = `sdk-test-${Date.now()}`;
    const original = await threatmap.instance.certificate.export(password);

    expect(original.byteLength).toBeGreaterThan(0);

    try {
      const generated = await threatmap.instance.certificate.generate();
      expect(generated).toBe(true);

      const replacement = await threatmap.instance.certificate.export(password);
      expect(replacement.byteLength).toBeGreaterThan(0);
      expect(replacement).not.toEqual(original);
    } finally {
      const file = new File([new Uint8Array(original)], "certificate.p12");
      await threatmap.instance.certificate.import({ file, password });
    }

    const restored = await threatmap.instance.certificate.export(password);
    expect(restored.byteLength).toBeGreaterThan(0);
  });
});
