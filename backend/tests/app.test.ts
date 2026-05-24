import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app";

describe("App Endpoints", () => {
  it("GET /health should return 200 OK", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "ok");
    expect(res.body).toHaveProperty("timestamp");
  });

  it("GET /unknown should return 404", async () => {
    const res = await request(app).get("/unknown-route");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "Rota não encontrada.");
  });
});
