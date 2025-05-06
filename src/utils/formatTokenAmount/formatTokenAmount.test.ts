// __tests__/formatTokenAmount.test.ts
import { describe, it, expect } from "vitest";
import { formatTokenAmount } from "@/utils"; // adjust path as needed

describe("formatTokenAmount()", () => {
  it("should format a whole token amount with 18 decimals", () => {
    // 1 token in wei = 10^18
    const wei = 1_000_000_000_000_000_000;
    const result = formatTokenAmount(wei, 18);
    expect(result).toBe("1.00");
  });

  it("should format fractional token amounts correctly", () => {
    // 0.123456 tokens in wei (18 decimals)
    const wei = 123_456_000_000_000_000;
    const result = formatTokenAmount(wei, 18);
    // toLocaleString will round to 2 decimals
    expect(result).toBe("0.12");
  });

  it("should round up when needed", () => {
    // 0.9995 tokens → 1.00 after rounding to 2 places
    const wei = 999_500_000_000_000_000;
    const result = formatTokenAmount(wei, 18);
    expect(result).toBe("1.00");
  });

  it("should display minimum two decimals even when trailing zeros", () => {
    // exactly 2.5 tokens
    const wei = 2.5 * 10 ** 18;
    const result = formatTokenAmount(wei, 18);
    expect(result).toBe("2.50");
  });

  it("should handle zero correctly", () => {
    expect(formatTokenAmount(0, 18)).toBe("0.00");
  });

  it("should work with different decimal places", () => {
    // Suppose token has 6 decimals and weiAmount is 1_234_567 (1.234567)
    const wei = 1_234_567;
    expect(formatTokenAmount(wei, 6)).toBe("1.23"); // rounds down
    // And rounds up:
    const wei2 = 1_239_999;
    expect(formatTokenAmount(wei2, 6)).toBe("1.24");
  });
});
