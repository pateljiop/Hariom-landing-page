const { chromium } = require("playwright");
const { spawn } = require("node:child_process");

const pages = [
  { path: "/index.html", theme: null },
  ...[
    "studio", "terminal", "editorial", "brutalist", "cinema", "minimal",
    "playful", "retro", "swiss", "neon", "nature", "dashboard", "magazine",
    "mono", "pixel", "future", "office", "netflix",
  ].map((theme) => ({ path: `/worlds/${theme}.html`, theme })),
];

(async () => {
  const server = spawn("python3", ["-m", "http.server", "4173", "--bind", "127.0.0.1"], {
    stdio: "ignore",
  });
  let browser;
  const failures = [];
  try {
    await new Promise((resolve, reject) => {
      const started = Date.now();
      const poll = async () => {
        try {
          const response = await fetch("http://127.0.0.1:4173/index.html");
          if (response.ok) return resolve();
        } catch {}
        if (Date.now() - started > 10000) return reject(new Error("Local test server did not start"));
        setTimeout(poll, 200);
      };
      poll();
    });

    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--enable-webgl", "--ignore-gpu-blocklist", "--use-gl=angle", "--use-angle=swiftshader"],
    });

    for (const item of pages) {
      const page = await browser.newPage({ viewport: { width: 1365, height: 900 } });
      const pageErrors = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));
      const responseErrors = [];
      page.on("response", (response) => {
        if (response.status() >= 400 && new URL(response.url()).origin === "http://127.0.0.1:4173") {
          responseErrors.push(`${response.status()} ${response.url()}`);
        }
      });

      try {
        const response = await page.goto(`http://127.0.0.1:4173${item.path}`, {
          waitUntil: "domcontentloaded",
          timeout: 15000,
        });
        if (!response || response.status() !== 200) {
          failures.push(`${item.path}: page HTTP status ${response?.status() ?? "no response"}`);
        }

        const stage = page.locator(".p-3d-stage");
        if (item.theme) {
          if (await stage.count() !== 1) {
            failures.push(`${item.path}: expected exactly one 3D stage, found ${await stage.count()}`);
          }
          const theme = await page.locator("html").getAttribute("data-world-page");
          if (theme !== item.theme) failures.push(`${item.path}: expected theme ${item.theme}, got ${theme}`);
          try {
            await page.waitForFunction(() => {
              const stage = document.querySelector(".p-3d-stage");
              return stage?.classList.contains("p-3d-ready") && stage.querySelector("canvas");
            }, null, { timeout: 18000 });
          } catch {
            failures.push(`${item.path}: 3D canvas did not reach ready state`);
          }
        }

        if (pageErrors.length) failures.push(`${item.path}: browser errors: ${pageErrors.join(" | ")}`);
        if (responseErrors.length) failures.push(`${item.path}: local asset errors: ${responseErrors.join(" | ")}`);
        console.log(`${item.path}: ${pageErrors.length || responseErrors.length ? "FAIL" : "loaded"}`);
      } catch (error) {
        failures.push(`${item.path}: ${error.message}`);
      } finally {
        await page.close();
      }
    }
  } finally {
    if (browser) await browser.close();
    server.kill("SIGTERM");
  }

  if (failures.length) {
    console.error("\nBrowser QA failures:\n- " + failures.join("\n- "));
    process.exitCode = 1;
  } else {
    console.log(`\nBrowser QA passed for all ${pages.length} pages.`);
  }
})();
