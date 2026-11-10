import { afterAll, describe, expect, it } from "vitest";
import { db, pool } from "./client";

describe("cliente do banco", () => {
  afterAll(() => pool.end());

  it("exporta a conexão sem abrir socket", () => {
    expect(db).toBeDefined();
    expect(pool.totalCount).toBe(0);
  });
});
