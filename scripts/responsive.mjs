/**
 * Responsive QA: capture every level at mobile / tablet-portrait /
 * tablet-landscape widths, and report any element overflowing the
 * viewport horizontally (the classic mobile-break smell). Dev tooling.
 *
 *   node scripts/responsive.mjs [baseUrl] [outDir]
 */
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";
import path from "node:path";

const BASE = process.argv[2] ?? "http://localhost:3000";
const OUT = process.argv[3] ?? path.join(process.env.TEMP ?? "/tmp", "nf-resp");
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844, dpr: 3, mobile: true },
  { name: "tablet", width: 768, height: 1024, dpr: 2, mobile: true },
  { name: "tabletL", width: 1024, height: 768, dpr: 2, mobile: true },
];
const LEVELS = ["hero", "about", "projects", "skills", "education", "credits"];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--use-angle=swiftshader", "--hide-scrollbars"],
});

for (const vp of VIEWPORTS) {
  const page = await browser.newPage();
  await page.emulate({
    viewport: { width: vp.width, height: vp.height, deviceScaleFactor: vp.dpr, isMobile: vp.mobile, hasTouch: vp.mobile },
    userAgent:
      "Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36",
  });
  await page.goto(`${BASE}/?noboot`, { waitUntil: "networkidle0", timeout: 60000 });
  await sleep(2000);

  // Horizontal overflow check.
  const overflow = await page.evaluate((vw) => {
    const docW = document.documentElement.scrollWidth;
    const offenders = [];
    if (docW > vw + 1) {
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.right > vw + 1 && r.width > 0 && r.width <= vw * 3) {
          offenders.push({
            tag: el.tagName,
            cls: (el.className || "").toString().slice(0, 60),
            right: Math.round(r.right),
            width: Math.round(r.width),
          });
        }
      }
    }
    return { docW, vw, offenders: offenders.slice(0, 12) };
  }, vp.width);

  console.log(`\n[${vp.name} ${vp.width}px] docScrollWidth=${overflow.docW}`);
  if (overflow.offenders.length) {
    console.log("  OVERFLOW:");
    overflow.offenders.forEach((o) => console.log(`   ${o.tag}.${o.cls} right=${o.right} w=${o.width}`));
  } else {
    console.log("  no horizontal overflow");
  }

  for (const id of LEVELS) {
    await page.evaluate((lid) => document.getElementById(lid)?.scrollIntoView({ behavior: "instant", block: "start" }), id);
    await sleep(1600);
    await page.screenshot({ path: path.join(OUT, `${vp.name}-${id}.png`) });
  }
  await page.close();
}

await browser.close();
console.log("\ndone");
