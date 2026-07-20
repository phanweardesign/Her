const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");

process.env.JWT_SECRET ||= "test-secret-that-is-long-enough";
const app = require("../server");
const User = require("../models/User");

async function withServer(fn) {
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  try { await fn(`http://127.0.0.1:${port}`); }
  finally { await new Promise(resolve => server.close(resolve)); }
}

test("health route reports password reset route", async () => {
  await withServer(async base => {
    const res = await fetch(`${base}/api/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.ok, true);
    assert.equal(body.passwordResetRoute, "/api/auth/forgot-password");
  });
});

test("forgot-password route exists and validates email", async () => {
  await withServer(async base => {
    const res = await fetch(`${base}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "bad" })
    });
    assert.equal(res.status, 400);
    assert.match((await res.json()).message, /valid email/i);
  });
});

test("forgot-password hides unknown accounts", async () => {
  const original = User.findOne;
  User.findOne = () => ({ select: async () => null });
  try {
    await withServer(async base => {
      const res = await fetch(`${base}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "nobody@example.com" })
      });
      assert.equal(res.status, 200);
      assert.match((await res.json()).message, /if that email is registered/i);
    });
  } finally { User.findOne = original; }
});

test("unknown API route returns JSON", async () => {
  await withServer(async base => {
    const res = await fetch(`${base}/api/not-real`);
    assert.equal(res.status, 404);
    assert.match(res.headers.get("content-type"), /json/);
  });
});
