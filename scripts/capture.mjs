/**
 * Visual QA captures: scrolls every level, exercises the palette switcher,
 * and saves viewport screenshots. Dev-only tooling.
 *
 *   node scripts/capture.mjs [baseUrl] [outDir]
 */
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";
import path from "node:path";

const BASE = process.argv[2] ?? "http://localhost:3000";
const OUT = process.argv[3] ?? path.join(process.env.TEMP ?? "/tmp", "nf-shots");
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const LEVELS = ["hero", "about", "projects", "skills", "education", "credits"];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--use-angle=swiftshader", "--window-size=1440,900", "--hide-scrollbars"],
  defaultViewport: { width: 1440, height: 900 },
});

const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(`console: ${m.text()}`);
});

await page.goto(`${BASE}/?noboot`, { waitUntil: "networkidle0", timeout: 60000 });
await sleep(2500);

for (const id of LEVELS) {
  await page.evaluate((lid) => {
    document.getElementById(lid)?.scrollIntoView({ behavior: "instant", block: "start" });
  }, id);
  await sleep(2600); // let the camera damp settle
  await page.screenshot({ path: path.join(OUT, `lv-${id}.png`) });
}

// Palette switcher: open, capture panel, then try two contrasting palettes.
await page.evaluate(() => {
  document.getElementById("hero")?.scrollIntoView({ behavior: "instant" });
});
await sleep(1500);
await page.click("button[aria-haspopup='dialog']");
await sleep(700);
await page.screenshot({ path: path.join(OUT, "skin-panel.png") });

for (const paletteName of ["DESERT", "BAUHAUS"]) {
  const clicked = await page.evaluate((name) => {
    const btn = [...document.querySelectorAll("[role='dialog'] button")].find((b) =>
      b.textContent.includes(name),
    );
    if (btn) btn.click();
    return !!btn;
  }, paletteName);
  if (!clicked) errors.push(`palette button not found: ${paletteName}`);
  await sleep(1400); // theme lerp
  await page.keyboard.press("Escape");
  await sleep(600);
  await page.screenshot({ path: path.join(OUT, `skin-${paletteName.toLowerCase()}.png`) });
  await page.click("button[aria-haspopup='dialog']");
  await sleep(500);
}
await page.keyboard.press("Escape");

console.log(errors.length ? `ERRORS:\n${errors.join("\n")}` : "no page errors");
await browser.close();
