#!/usr/bin/env node
// Simulates concurrent survey-wall submissions ahead of the event.
// Deliberately reuses a small pool of device ids (fewer than the request
// count) so the rate limiter (lib/rateLimit.ts) can be verified to actually
// trigger under load, not just measured for raw throughput.
//
// Usage:
//   node scripts/load-test.mjs [url] [totalRequests] [concurrency]
//   node scripts/load-test.mjs http://localhost:3000 100 20

import { randomUUID } from "node:crypto";

const BASE_URL = process.argv[2] ?? "http://localhost:3000";
const TOTAL_REQUESTS = Number(process.argv[3] ?? 100);
const CONCURRENCY = Number(process.argv[4] ?? 20);
const DEVICE_POOL_SIZE = 15;

const devicePool = Array.from({ length: DEVICE_POOL_SIZE }, () => randomUUID());

function pickDevice() {
  return devicePool[Math.floor(Math.random() * devicePool.length)];
}

async function submitOne(i) {
  const deviceId = pickDevice();
  const start = performance.now();
  try {
    const res = await fetch(`${BASE_URL}/api/submit-message`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: `cm2_device_id=${deviceId}`,
      },
      body: JSON.stringify({
        name: `LoadTest${i}`,
        message: `Load test message #${i} at ${new Date().toISOString()}`,
      }),
    });
    const body = await res.json().catch(() => ({}));
    const ms = performance.now() - start;
    return {
      ok: res.ok && body.ok === true,
      status: res.status,
      rateLimited: typeof body.error === "string" && body.error.includes("posting a little fast"),
      ms,
    };
  } catch (err) {
    return { ok: false, status: 0, error: String(err), ms: performance.now() - start };
  }
}

async function run() {
  console.log(
    `Load-testing ${BASE_URL}/api/submit-message — ${TOTAL_REQUESTS} requests, concurrency ${CONCURRENCY}, ${DEVICE_POOL_SIZE} simulated devices`
  );

  const results = [];
  let inFlight = 0;
  let nextIndex = 0;

  await new Promise((resolve) => {
    function launchNext() {
      if (nextIndex >= TOTAL_REQUESTS) {
        if (inFlight === 0) resolve();
        return;
      }
      const i = nextIndex++;
      inFlight++;
      submitOne(i).then((result) => {
        results.push(result);
        inFlight--;
        launchNext();
      });
    }
    for (let c = 0; c < CONCURRENCY; c++) launchNext();
  });

  const succeeded = results.filter((r) => r.ok);
  const rateLimited = results.filter((r) => r.rateLimited);
  const failed = results.filter((r) => !r.ok && !r.rateLimited);
  const durations = results.map((r) => r.ms).sort((a, b) => a - b);
  const pct = (p) => durations[Math.floor((durations.length - 1) * p)];

  console.log(`\nResults:`);
  console.log(`  Succeeded:     ${succeeded.length}`);
  console.log(`  Rate-limited:  ${rateLimited.length} (expected — ${DEVICE_POOL_SIZE} devices sharing ${TOTAL_REQUESTS} requests)`);
  console.log(`  Other errors:  ${failed.length}`);
  console.log(
    `  Latency (ms):  p50=${pct(0.5).toFixed(0)} p90=${pct(0.9).toFixed(0)} p99=${pct(0.99).toFixed(0)} max=${durations[
      durations.length - 1
    ].toFixed(0)}`
  );

  if (failed.length > 0) {
    console.log(`\nFirst few unexpected failures:`);
    failed.slice(0, 5).forEach((r) => console.log(`  status=${r.status} error=${r.error ?? ""}`));
  }

  if (rateLimited.length === 0) {
    console.log(`\n⚠ No requests were rate-limited — double-check lib/rateLimit.ts is wired up before the event.`);
  }
}

run();
