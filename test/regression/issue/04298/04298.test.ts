import { spawn } from "bun";
import { expect, test } from "bun:test";
import { bunEnv, bunExe } from "harness";

test("node:http should not crash when server throws, and should abruptly close the socket", async () => {
  const { promise, resolve, reject } = Promise.withResolvers();
  await using server = spawn({
    cwd: import.meta.dirname,
    cmd: [bunExe(), "04298.fixture.js"],
    env: bunEnv,
    stderr: "inherit",
    ipc(url) {
      resolve(url);
    },
    onExit(exitCode, signalCode) {
      if (signalCode || exitCode !== 0) {
        reject(new Error(`process exited with code ${signalCode || exitCode}`));
      }
    },
  });
  const url = await promise;
  const response = await fetch(url);
});
