import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("App", () => {
  it("mostra o título Triagem", () => {
    expect(renderToString(<App />)).toContain("<h1>Triagem</h1>");
  });
});
