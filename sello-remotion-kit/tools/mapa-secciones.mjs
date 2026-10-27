import { chromium } from "playwright";
const ID = process.argv[2] ?? "7a747ccd-6de0-4568-b483-8a09045d7f98";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 420, height: 910 }, deviceScaleFactor: 1, locale: "es-MX", timezoneId: "America/Mexico_City" });
const p = await ctx.newPage();
await p.goto(`http://localhost:3000/demo/${ID}`, { waitUntil: "networkidle" });
await p.addStyleTag({ content: `.sticky{display:none!important}` });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(2000);
const secs = await p.evaluate(() => {
  const out = [];
  document.querySelectorAll("section, h1, h2, h3").forEach((el) => {
    const r = el.getBoundingClientRect();
    const top = Math.round(r.top + window.scrollY);
    const txt = (el.tagName === "SECTION" ? "" : el.textContent.trim().slice(0, 40));
    out.push(`${String(top).padStart(5)}  ${el.tagName.padEnd(7)} h=${String(Math.round(r.height)).padStart(4)}  ${txt}`);
  });
  return out;
});
console.log(secs.join("\n"));
console.log("--- total:", await p.evaluate(() => document.documentElement.scrollHeight));
await b.close();
