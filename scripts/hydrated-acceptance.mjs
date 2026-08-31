#!/usr/bin/env node
/**
 * WEBMON-PRINT — hydrated acceptance layer.
 *
 * WHY THIS EXISTS
 * ---------------
 * scripts/acceptance.py reads server HTML. That is the right thing to read for
 * most of this property, and it must not be weakened. But text that only exists
 * after hydration never appears in it, so the server layer is structurally blind
 * to every word the interactive components produce.
 *
 * M1.5 proved the gap with two real defects that shipped through a PASS: a
 * banned em dash and a duplicated word, both in the drying tool's result panel,
 * both invisible until a select was changed. They were found by hand. This is
 * that check, automated.
 *
 * WHAT IT IS NOT
 * --------------
 * Not a replacement for the server layer, and not a second copy of its rules.
 * Banned wording is read from scripts/banned-claims.json, which acceptance.py
 * also reads. One rule set, two readers -- because a duplicated rule set is the
 * exact failure this property has now paid for three times.
 *
 * DRIVING, NOT SAMPLING
 * ---------------------
 * A tool checked in its empty state proves nothing; the empty state was always
 * clean. Every component here is driven through its real outcomes, including the
 * ones that are commercially inconvenient -- "print it yourself", "we do not
 * print this" -- because those are the states whose wording matters most.
 *
 * Usage:
 *   node scripts/hydrated-acceptance.mjs                 (production)
 *   node scripts/hydrated-acceptance.mjs --site http://localhost:3000
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const arg = (n, d) => {
  const i = process.argv.indexOf('--' + n);
  return i > -1 ? process.argv[i + 1] : d;
};
const SITE = (arg('site', 'https://www.printlog3d.com')).replace(/\/$/, '');

const rules = JSON.parse(fs.readFileSync(path.join(HERE, 'banned-claims.json'), 'utf8'));
const banned = rules.patterns;
const caseSensitive = new Set(rules.case_sensitive || []);

const failures = [];
const fail = (m) => failures.push(m);
let checks = 0;

/** Rules that only make sense against rendered prose, not markup. */
function checkProse(text, where) {
  checks++;
  for (const [name, pattern] of Object.entries(banned)) {
    // Markup-shaped rules are the server layer's job; skip them on plain text.
    if (/href=|amazon\.com\/s\?k=/.test(pattern)) continue;
    let re;
    try {
      re = new RegExp(pattern, caseSensitive.has(name) ? '' : 'i');
    } catch {
      continue; // a pattern JS cannot compile is the server layer's to enforce
    }
    const m = text.match(re);
    if (m) fail(`${where} -> banned wording "${name}": ...${excerpt(text, m.index)}...`);
  }

  // Rendering corruption: the same word twice in a row. This is what produced
  // "Yes, PETG is hygroscopic. Hygroscopic. Dry at 65C" -- two correct strings
  // concatenated into one wrong sentence.
  const dup = text.match(/\b([A-Za-z]{4,})\W+\1\b/i);
  if (dup) fail(`${where} -> duplicated word "${dup[1]}": ...${excerpt(text, dup.index)}...`);

  // A result panel that renders nothing is a dead end wearing a working UI.
  if (text.trim().length < 12) fail(`${where} -> result panel rendered essentially no text`);
}

function excerpt(t, i) {
  return t.slice(Math.max(0, i - 40), i + 60).replace(/\s+/g, ' ').trim();
}

/** Dead CTAs, unreachable labels and overflow, measured in the live DOM. */
async function checkPage(page, label) {
  const res = await page.evaluate(() => {
    const out = { dead: [], unlabelled: [], smallTargets: [], overflow: null };

    for (const a of document.querySelectorAll('a')) {
      const href = a.getAttribute('href');
      if (href === '' || href === '#') {
        out.dead.push((a.textContent || '').trim().slice(0, 40) || '(no text)');
      }
    }

    // A control deliberately removed from the accessibility tree needs no
    // accessible name. The signup honeypot is the real case: it is aria-hidden
    // and tabIndex -1 precisely so people never reach it, and flagging it as an
    // a11y defect is a detector bug, not a site defect. Verified as a false
    // positive on /free-download before this exclusion was added.
    const outOfTree = (el) =>
      el.closest('[aria-hidden="true"]') !== null || el.tabIndex < 0;

    for (const c of document.querySelectorAll('select, input:not([type=hidden]), textarea')) {
      if (outOfTree(c)) continue;
      if (c.type === 'radio' || c.type === 'checkbox') {
        if (!c.closest('label') && !c.getAttribute('aria-label') &&
            !(c.id && document.querySelector(`label[for="${CSS.escape(c.id)}"]`))) {
          out.unlabelled.push(c.name || c.type);
        }
        continue;
      }
      const byFor = c.id && document.querySelector(`label[for="${CSS.escape(c.id)}"]`);
      if (!byFor && !c.getAttribute('aria-label') && !c.closest('label')) {
        out.unlabelled.push(c.tagName.toLowerCase() + (c.id ? '#' + c.id : ''));
      }
    }

    // Standalone controls only. Inline prose links legitimately sit lower.
    for (const el of document.querySelectorAll('select, button, [role=button]')) {
      const r = el.getBoundingClientRect();
      if (r.height > 0 && r.height < 44) {
        out.smallTargets.push(el.tagName.toLowerCase() + ':' + Math.round(r.height));
      }
    }
    return out;
  });

  // Overflow: scroll right and read scrollX. scrollWidth lies in an emulated
  // viewport -- learned on DPF, recorded in audit_mobile_presentation.mjs.
  const overflow = await page.evaluate(() => {
    const before = window.scrollX;
    window.scrollTo(9999, window.scrollY);
    const after = window.scrollX;
    window.scrollTo(before, window.scrollY);
    return after > 0;
  });

  checks++;
  for (const d of res.dead) fail(`${label} -> dead CTA after hydration: "${d}"`);
  for (const u of res.unlabelled) fail(`${label} -> form control with no accessible name: ${u}`);
  for (const s of res.smallTargets) fail(`${label} -> standalone control under 44px: ${s}`);
  if (overflow) fail(`${label} -> horizontal overflow at ${page.viewportSize().width}px`);
}

/** Read a component's live result panel. */
async function panelText(page, placement) {
  return page.evaluate((p) => {
    const s = document.querySelector(`[data-placement="${p}"]`);
    if (!s) return null;
    const live = s.querySelector('[aria-live]');
    return (live || s).innerText;
  }, placement);
}

async function setSelect(page, placement, id, value) {
  await page.selectOption(`[data-placement="${placement}"] #${id}`, value);
  await page.waitForTimeout(90);
}

async function clickRadio(page, placement, name, value) {
  await page.evaluate(
    ({ p, n, v }) => {
      const s = document.querySelector(`[data-placement="${p}"]`);
      const el = s.querySelector(`input[type=radio][name="${n}"][value="${v}"]`);
      el.click();
    },
    { p: placement, n: name, v: value },
  );
  await page.waitForTimeout(90);
}

const browser = await chromium.launch();

for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();

  const consoleErrors = [];
  const pageErrors = [];
  // Console-error scoping.
  //
  // A third-party pixel failing to load is not a defect in this property and
  // not something we control. Cancelled _rsc prefetches are normal Next.js
  // behaviour when a navigation aborts them.
  //
  // Scoped by the message's own URL rather than its text: Chrome reports
  // "Failed to load resource: net::ERR_CONNECTION_TIMED_OUT" with no URL in the
  // text at all, so a text match would have suppressed genuine first-party
  // failures too. First-party asset resolution is separately and completely
  // covered by the server layer, which fetches every referenced asset.
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const text = m.text().slice(0, 200);
    const url = (m.location() && m.location().url) || '';
    if (/_rsc=/.test(url)) return;
    if (url && !/printlog3d\.com/.test(url)) return;   // someone else's host
    consoleErrors.push((url ? url.slice(0, 70) + ' :: ' : '') + text.slice(0, 120));
  });

  page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 160)));

  const tag = `${viewport.width}px`;

  // ---------------------------------------------------------------- DRYING
  {
    const url = `${SITE}/how-to-dry-filament`;
    await page.goto(url, { waitUntil: 'load', timeout: 45000 });
    const label = `[${tag}] /how-to-dry-filament`;

    if (!(await panelText(page, 'drying-decision'))) {
      fail(`${label} -> drying tool did not hydrate`);
    } else {
      // Drive every branch the component can take, not just a happy one.
      // peek: the oven guard. petg: a dryer is enough. pla: needs nothing.
      // pc-cf: the newest profile, most likely to be missing data.
      for (const slug of ['peek', 'petg', 'pla', 'tpu', 'pc-cf', 'nylon-pa6']) {
        await setSelect(page, 'drying-decision', 'dry-material', slug);
        const t = await panelText(page, 'drying-decision');
        checkProse(t, `${label} drying[${slug}]`);
        if (slug === 'peek' && !/oven/i.test(t)) {
          fail(`${label} drying[peek] -> no oven guard; PEEK needs 120-150C and dryers stop near 90C`);
        }
        if (/undefined|null|NaN/.test(t)) {
          fail(`${label} drying[${slug}] -> unrendered value in output`);
        }
      }
      // The optional symptom select must not break the answer.
      await setSelect(page, 'drying-decision', 'dry-symptom', 'strings');
      checkProse(await panelText(page, 'drying-decision'), `${label} drying[symptom]`);
    }
    await checkPage(page, label);
  }

  // ------------------------------------------------------------- OUTSOURCE
  {
    const url = `${SITE}/get-it-printed`;
    await page.goto(url, { waitUntil: 'load', timeout: 45000 });
    const label = `[${tag}] /get-it-printed`;

    if (!(await panelText(page, 'outsource-decision'))) {
      fail(`${label} -> outsource tool did not hydrate`);
    } else {
      const cases = [
        // material, ownPrinter, fits, expected phrase, why it matters
        ['pla', 'yes', 'yes', /print it yourself/i, 'must refuse to sell when the reader can do it'],
        ['peek', 'no', 'yes', /we do not print/i, 'must not route an unsupported material to the service'],
        ['pc-cf', 'no', 'yes', /we do not print/i, 'newest NOT_SUPPORTED material must gate correctly'],
        ['tpu', 'no', 'yes', /on request|case by case/i, 'CONDITIONAL must not imply instant quoting'],
        ['petg', 'no', 'yes', /quote/i, 'SUPPORTED must reach the quote path'],
        ['pla', 'no', 'no', /too big|splitting/i, 'oversize must not claim capability'],
      ];
      for (const [slug, own, fits, expect, why] of cases) {
        await setSelect(page, 'outsource-decision', 'os-material', slug);
        await clickRadio(page, 'outsource-decision', 'own-printer', own);
        await clickRadio(page, 'outsource-decision', 'fits', fits);
        const t = await panelText(page, 'outsource-decision');
        const where = `${label} outsource[${slug}/${own}/${fits}]`;
        checkProse(t, where);
        if (!expect.test(t)) fail(`${where} -> expected ${expect} (${why}). Got: ${t.slice(0, 110)}`);
        // A CONDITIONAL or SUPPORTED answer must disclose common ownership.
        if (/quote/i.test(t) && !/Anvil Road/i.test(t)) {
          fail(`${where} -> routes to the owned service without disclosing common ownership`);
        }
      }
    }
    await checkPage(page, label);
  }

  // ------------------------------------- client copy on the rest of the estate
  for (const p of ['/', '/workshop', '/3d-printer-troubleshooting', '/library/tpu', '/asa-vs-abs', '/free-download']) {
    await page.goto(SITE + p, { waitUntil: 'load', timeout: 45000 });
    await checkPage(page, `[${tag}] ${p}`);
  }

  checks++;
  for (const e of consoleErrors) fail(`[${tag}] console error: ${e}`);
  for (const e of pageErrors) fail(`[${tag}] hydration/page error: ${e}`);

  await ctx.close();
}

await browser.close();

console.log('');
console.log(`HYDRATED ACCEPTANCE against ${SITE}`);
console.log(`${checks} checks across 2 viewports, 8 routes, 12 driven tool states`);
if (failures.length) {
  console.log(`FAIL: ${failures.length} finding(s)`);
  console.log('');
  for (const f of failures) console.log('  - ' + f);
  process.exit(1);
}
console.log('PASS: no findings');
