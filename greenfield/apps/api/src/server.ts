import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { buildApp } from "./app";

// O .env fica na raiz de greenfield/, três pastas acima deste arquivo.
const envFile = fileURLToPath(new URL("../../../.env", import.meta.url));
if (existsSync(envFile)) process.loadEnvFile(envFile);

const port = Number(process.env.PORT ?? 3000);

await buildApp().listen({ port, host: "0.0.0.0" });
