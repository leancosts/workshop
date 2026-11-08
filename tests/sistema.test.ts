import { describe, expect, it } from "vitest";
import { nomeDoSistema } from "../src/sistema.js";

describe("repositório inicial", () => {
  it("roda os testes com um comando", () => {
    expect(nomeDoSistema).toBe("Prontidão da tripulação");
  });
});
