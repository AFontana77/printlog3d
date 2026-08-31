#!/usr/bin/env node
/**
 * PrintLog3D — exhaustive link and affiliate validator.
 *
 * Crawls the live property from its sitemap plus the homepage, follows every
 * same-origin link it discovers, tests each destination, and records every
 * outbound commercial link with its affiliate state.
 *
 * WHY IT DOES NOT TRUST HEAD
 * Several merchants answer HEAD with a 405 or a 403 while serving GET perfectly
 * well, so HEAD is only used as a cheap first pass on internal URLs and every
 * external destination is fetched with GET.
 *
 * WHY AMAZON IS CLASSIFIED SEPARATELY
 * Amazon serves 403/503 to automated clients as a matter of course. Recording
 * that as a broken link would fill the report with false failures and hide the
 * real ones, so those become BOT_BLOCKED_REQUIRES_MANUAL_CHECK. A blocked bot
 * is not evidence of a dead product, and it is not evidence of a live one
 * either -- product liveness is proven separately, through the Creators API.
 *
 *   node scripts/audit-links.mjs                      full crawl
 *   node scripts/audit-links.mjs --internal-only      skip external fetches
 *   node scripts/audit-links.mjs --site http://localhost:3000
 *
 * Exit code 1 when a blocking defect is found, so it can gate CI.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const arg = (n, d) => {
  const i = process.argv.indexOf('--' + n);
  return i > -1 ? process.argv[i + 1] : d;
};
const SITE = arg('site', 'https://www.printlog3d.com').replace(/\/$/, '');
const INTERNAL_ONLY = process.argv.includes('--internal-only');
const OWN_TAG = 'printlog3d-20';
const ORIGIN = new URL(SITE).origin;
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36 PrintLog3D-LinkAudit/1.0';

/** Merchant recognition, so commercial links can be classified by program. */
const MERCHANTS = [
  { host: /(^|\.)amazon\./i, merchant: 'Amazon', program: 'amazon-associates' },
  { host: /(^|\.)matterhackers\.com$/i, merchant: 'MatterHackers', program: 'matterhackers' },
  { host: /(^|\.)polymaker\.com$/i, merchant: 'Polymaker', program: 'polymaker' },
  { host: /(^|\.)printedsolid\.com$/i, merchant: 'Printed Solid', program: null },
  { host: /(^|\.)xometry\.com$/i, merchant: 'Xometry', program: null },
  { host: /(^|\.)jlc3dp\.com$/i, merchant: 'JLC3DP', program: null },
  { host: /(^|\.)treatstock\.com$/i, merchant: 'Treatstock', program: 'treatstock' },
  { host: /(^|\.)bambulab\.com$/i, merchant: 'Bambu Lab', program: 'bambulab' },
  { host: /(^|\.)creality\.com$/i, merchant: 'Creality', program: 'creality' },
  { host: /(^|\.)prusa3d\.com$/i, merchant: 'Prusa', program: 'prusa' },
  { host: /(^|\.)sunlu\.com$/i, merchant: 'SUNLU', program: 'sunlu' },
  { host: /3dprinterondemand\.com$/i, merchant: '3DPrinterOnDemand', program: 'owned-service' },
];

function merchantFor(url) {
  let host;
  try {
    host = new URL(url).hostname;
  } catch {
    return { merchant: null, program: null };
  }
  const hit = MERCHANTS.find((m) => m.host.test(host));
  return hit ? { merchant: hit.merchant, program: hit.program } : { merchant: null, program: null };
}

/** Canonicalize so /a, /a/ and /a?x= are not audited as three different pages. */
function canonical(u) {
  try {
    const url = new URL(u, SITE);
    url.hash = '';
    if (url.origin === ORIGIN) url.search = '';
    let s = url.toString();
    if (url.pathname !== '/' && s.endsWith('/')) s = s.slice(0, -1);
    return s;
  } catch {
    return null;
  }
}

const SKIP_SCHEME = /^(mailto:|tel:|javascript:|data:|#)/i;

async function fetchWithRedirects(url, method = 'GET') {
  const chain = [];
  let current = url;
  for (let i = 0; i < 6; i++) {
    let res;
    try {
      res = await fetch(current, {
        method,
        redirect: 'manual',
        headers: { 'user-agent': UA, accept: '*/*' },
        signal: AbortSignal.timeout(30000),
      });
    } catch (e) {
      return { status: 0, finalUrl: current, chain, error: String(e.name || e).slice(0, 60) };
    }
    if ([301, 302, 303, 307, 308].includes(res.status)) {
      const loc = res.headers.get('location');
      if (!loc) return { status: res.status, finalUrl: current, chain };
      const next = new URL(loc, current).toString();
      if (chain.includes(next)) return { status: res.status, finalUrl: next, chain, loop: true };
      chain.push(next);
      current = next;
      continue;
    }
    return { status: res.status, finalUrl: current, chain };
  }
  return { status: 0, finalUrl: current, chain, loop: true };
}

// ---------------------------------------------------------------- crawl
async function sitemapUrls() {
  const res = await fetch(SITE + '/sitemap.xml', { headers: { 'user-agent': UA } });
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const pages = new Map();      // url -> html
const links = [];             // every discovered link
const seen = new Set();

function extractLinks(html, sourceUrl) {
  const out = [];
  const re = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html))) {
    const attrs = m[1];
    const hrefM = /\bhref="([^"]*)"/i.exec(attrs);
    if (!hrefM) continue;
    const raw = hrefM[1]
      .replace(/&amp;/g, '&')
      .replace(/&#x27;/g, "'")
      .replace(/&quot;/g, '"');
    const relM = /\brel="([^"]*)"/i.exec(attrs);
    const anchor = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80);
    out.push({ source: sourceUrl, raw, anchor, rel: relM ? relM[1] : '' });
  }
  return out;
}

async function crawl() {
  const queue = [SITE + '/', ...(await sitemapUrls())].map(canonical).filter(Boolean);
  const todo = [...new Set(queue)];

  while (todo.length) {
    const url = todo.shift();
    if (seen.has(url)) continue;
    seen.add(url);

    const r = await fetchWithRedirects(url);
    let html = '';
    if (r.status === 200) {
      try {
        const res = await fetch(r.finalUrl, { headers: { 'user-agent': UA } });
        html = await res.text();
      } catch { /* recorded below by status */ }
    }
    pages.set(url, { ...r, html });

    if (!html) continue;
    for (const l of extractLinks(html, url)) {
      links.push(l);
      if (SKIP_SCHEME.test(l.raw)) continue;
      const abs = canonical(l.raw);
      if (abs && abs.startsWith(ORIGIN) && !seen.has(abs)) todo.push(abs);
    }
  }
}

// ---------------------------------------------------------------- classify
const results = [];
const blocking = [];
const advisory = [];

async function classify() {
  const cache = new Map();
  const ts = new Date().toISOString();

  for (const l of links) {
    if (SKIP_SCHEME.test(l.raw)) continue;
    const target = canonical(l.raw);
    if (!target) {
      blocking.push(`UNPARSEABLE href on ${l.source}: "${l.raw}"`);
      continue;
    }
    const internal = target.startsWith(ORIGIN);
    const { merchant, program } = merchantFor(target);
    const isAmazon = merchant === 'Amazon';
    const tagM = /[?&]tag=([^&]+)/.exec(target);

    let status = null;
    let finalUrl = target;
    let note = '';

    if (internal) {
      const known = pages.get(target);
      if (known) {
        status = known.status;
        finalUrl = known.finalUrl;
      } else if (cache.has(target)) {
        ({ status, finalUrl } = cache.get(target));
      } else {
        const r = await fetchWithRedirects(target);
        status = r.status;
        finalUrl = r.finalUrl;
        if (r.loop) note = 'REDIRECT_LOOP';
        cache.set(target, { status, finalUrl });
      }
      if (status >= 400) blocking.push(`INTERNAL ${status} — ${target}  (from ${l.source})`);
      if (note === 'REDIRECT_LOOP') blocking.push(`REDIRECT LOOP — ${target}`);
    } else if (!INTERNAL_ONLY) {
      if (cache.has(target)) {
        ({ status, finalUrl, note } = cache.get(target));
      } else {
        const r = await fetchWithRedirects(target);
        status = r.status;
        finalUrl = r.finalUrl;
        if (isAmazon && (status === 403 || status === 503 || status === 0)) {
          note = 'BOT_BLOCKED_REQUIRES_MANUAL_CHECK';
        } else if (status >= 400 || status === 0) {
          note = 'EXTERNAL_UNREACHABLE';
          advisory.push(`EXTERNAL ${status || r.error} — ${merchant || 'link'} ${target}  (from ${l.source})`);
        }
        cache.set(target, { status, finalUrl, note });
      }
    }

    // The one rule that is never advisory: an Amazon link must carry our tag.
    if (isAmazon) {
      if (!tagM) {
        blocking.push(`AMAZON LINK WITH NO TAG — ${target}  (from ${l.source})`);
      } else if (tagM[1] !== OWN_TAG) {
        blocking.push(`AMAZON LINK CARRIES "${tagM[1]}" NOT ${OWN_TAG} — ${target}  (from ${l.source})`);
      }
      if (!/sponsored/i.test(l.rel)) {
        blocking.push(`AMAZON LINK MISSING rel=sponsored — ${target}  (from ${l.source})`);
      }
    }

    results.push({
      source_url: l.source,
      anchor_text: l.anchor,
      target_url: target,
      final_url: finalUrl,
      http_status: status,
      scope: internal ? 'internal' : 'external',
      classification: merchant ? (program ? 'commercial' : 'editorial') : internal ? 'internal' : 'editorial',
      merchant: merchant || '',
      affiliate_program: program || '',
      affiliate_tracking_present: isAmazon ? Boolean(tagM) : program ? 'n/a-no-credentials' : false,
      amazon_tag: tagM ? tagM[1] : '',
      rel: l.rel,
      note,
      checked_at: ts,
    });
  }
}

// ---------------------------------------------------------------- images
function auditImages() {
  for (const [url, p] of pages) {
    if (!p.html) continue;
    for (const m of p.html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/gi)) {
      const src = m[1].replace(/&amp;/g, '&');
      if (src.startsWith('data:')) continue;
      results.push({
        source_url: url,
        anchor_text: '[image]',
        target_url: src.slice(0, 200),
        final_url: '',
        http_status: '',
        scope: src.startsWith('http') && !src.startsWith(ORIGIN) ? 'external' : 'internal',
        classification: 'asset',
        merchant: '',
        affiliate_program: '',
        affiliate_tracking_present: false,
        amazon_tag: '',
        rel: '',
        note: '',
        checked_at: new Date().toISOString(),
      });
    }
    // A product card with no destination is a dead commercial unit.
    for (const m of p.html.matchAll(/<a\b[^>]*\bhref="(#|)"[^>]*>/gi)) {
      blocking.push(`BLANK CTA — ${url}  ${m[0].slice(0, 70)}`);
    }
  }
}

// ---------------------------------------------------------------- report
function write() {
  const outDir = path.join(HERE, '..', 'reports');
  fs.mkdirSync(outDir, { recursive: true });

  const amazon = results.filter((r) => r.merchant === 'Amazon');
  const summary = {
    site: SITE,
    generated_at: new Date().toISOString(),
    pages_crawled: pages.size,
    links_examined: results.length,
    internal: results.filter((r) => r.scope === 'internal').length,
    external: results.filter((r) => r.scope === 'external').length,
    commercial: results.filter((r) => r.classification === 'commercial').length,
    amazon_links: amazon.length,
    amazon_tagged_correctly: amazon.filter((r) => r.amazon_tag === OWN_TAG).length,
    amazon_bot_blocked: amazon.filter((r) => r.note === 'BOT_BLOCKED_REQUIRES_MANUAL_CHECK').length,
    blocking_findings: blocking.length,
    advisory_findings: advisory.length,
  };

  fs.writeFileSync(
    path.join(outDir, 'link-audit.json'),
    JSON.stringify({ summary, blocking, advisory, links: results }, null, 2),
  );

  const cols = Object.keys(results[0] || { source_url: '' });
  const csv = [cols.join(',')]
    .concat(results.map((r) => cols.map((c) => `"${String(r[c] ?? '').replace(/"/g, '""')}"`).join(',')))
    .join('\n');
  fs.writeFileSync(path.join(outDir, 'link-audit.csv'), csv);

  const md = [
    '# PrintLog3D link and affiliate audit',
    '',
    `**${SITE}** · ${summary.generated_at}`,
    '',
    '| Metric | Value |',
    '|---|---|',
    ...Object.entries(summary).slice(2).map(([k, v]) => `| ${k.replace(/_/g, ' ')} | ${v} |`),
    '',
    '## Blocking findings',
    '',
    blocking.length ? blocking.map((b) => `- ${b}`).join('\n') : '_None._',
    '',
    '## Advisory',
    '',
    '_External hosts we do not control. Amazon bot-blocks are excluded by design._',
    '',
    advisory.length ? advisory.map((a) => `- ${a}`).join('\n') : '_None._',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(outDir, 'link-audit.md'), md);

  console.log('');
  console.log(`LINK AUDIT — ${SITE}`);
  for (const [k, v] of Object.entries(summary).slice(2)) {
    console.log(`  ${k.replace(/_/g, ' ').padEnd(26)} ${v}`);
  }
  console.log('');
  if (blocking.length) {
    console.log(`BLOCKING: ${blocking.length}`);
    blocking.slice(0, 25).forEach((b) => console.log('  - ' + b));
    if (blocking.length > 25) console.log(`  ... ${blocking.length - 25} more (see reports/link-audit.md)`);
  } else {
    console.log('BLOCKING: none');
  }
  if (advisory.length) {
    console.log('');
    console.log(`ADVISORY: ${advisory.length}`);
    advisory.slice(0, 10).forEach((a) => console.log('  - ' + a));
  }
  console.log('');
  console.log('written: printlog3d/reports/link-audit.{json,csv,md}');
  return blocking.length ? 1 : 0;
}

await crawl();
await classify();
auditImages();
process.exit(write());
