import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium, devices } from 'playwright';

const TARGET = process.env.TARGET_URL || 'http://localhost:3001';
const OUT_DIR = path.resolve('./mcp_artifacts');

async function ensureOut() {
  await fs.mkdir(OUT_DIR, { recursive: true });
}

async function withPage(device, cb) {
  const browser = await chromium.launch();
  const context = await browser.newContext(device || {});
  const page = await context.newPage();
  await page.goto(TARGET, { waitUntil: 'networkidle' });
  const result = await cb(page, context);
  await context.close();
  await browser.close();
  return result;
}

async function screenshots() {
  await ensureOut();
  // Desktop
  await withPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }, async (page) => {
    await page.screenshot({ path: path.join(OUT_DIR, 'desktop.png'), fullPage: true });
    const vp = page.viewportSize();
    await page.screenshot({
      path: path.join(OUT_DIR, 'hero_desktop.png'),
      clip: { x: 0, y: 0, width: vp.width, height: Math.min(900, vp.height) }
    });
  });
  // Mobile (iPhone 14 Pro)
  const i14 = devices['iPhone 14 Pro'];
  await withPage(i14, async (page) => {
    await page.screenshot({ path: path.join(OUT_DIR, 'mobile.png'), fullPage: true });
    const vp = page.viewportSize();
    await page.screenshot({
      path: path.join(OUT_DIR, 'hero_mobile.png'),
      clip: { x: 0, y: 0, width: vp.width, height: Math.min(900, vp.height) }
    });
  });
}

async function runA11y() {
  await ensureOut();
  const results = await withPage(
    { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 },
    async (page) => {
      await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.1/axe.min.js' });
      const axe = await page.evaluate(async () => {
        return await window.axe.run(document, {
          runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice']
        });
      });
      return axe;
    }
  );
  await fs.writeFile(path.join(OUT_DIR, 'a11y.json'), JSON.stringify(results, null, 2));
  return results;
}

function luminance([r, g, b]) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}
function hexToRgb(hex) {
  const m = hex.replace('#', '');
  const v = m.length === 3 ? m.split('').map((c) => c + c).join('') : m;
  const n = parseInt(v, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function contrastRatio(fgHex, bgHex) {
  const L1 = luminance(hexToRgb(fgHex));
  const L2 = luminance(hexToRgb(bgHex));
  const [hi, lo] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (hi + 0.05) / (lo + 0.05);
}

async function collectMetrics() {
  const metrics = await withPage(
    { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 },
    async (page) => {
      return await page.evaluate(() => {
        const takeStyle = (el) => {
          const cs = getComputedStyle(el);
          const rgbToHex = (rgb) => {
            if (!rgb) return null;
            const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
            if (!m) return null;
            const [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])];
            return '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('');
          };
          return {
            fontFamily: cs.fontFamily,
            fontSize: cs.fontSize,
            lineHeight: cs.lineHeight,
            fontWeight: cs.fontWeight,
            letterSpacing: cs.letterSpacing,
            color: rgbToHex(cs.color),
            backgroundColor: rgbToHex(cs.backgroundColor)
          };
        };

        const h1 = Array.from(document.querySelectorAll('h1')).slice(0, 3).map(takeStyle);
        const h2 = Array.from(document.querySelectorAll('h2')).slice(0, 3).map(takeStyle);
        const h3 = Array.from(document.querySelectorAll('h3')).slice(0, 3).map(takeStyle);
        const h4 = Array.from(document.querySelectorAll('h4')).slice(0, 3).map(takeStyle);
        const bodySamples = Array.from(document.querySelectorAll('p,li,span')).slice(0, 10).map(takeStyle);

        const blocks = Array.from(document.querySelectorAll('main > *:not(script):not(style), section')).slice(0, 20);
        const rects = blocks.map((el) => el.getBoundingClientRect()).filter((r) => r.height > 0);
        const spacings = [];
        for (let i = 0; i < Math.min(rects.length - 1, 12); i++) {
          const a = rects[i], b = rects[i + 1];
          const space = b.top - (a.top + a.height);
          spacings.push(Math.round(space));
        }

        const imgs = Array.from(document.querySelectorAll('img')).slice(0, 12).map((img) => {
          const cs = getComputedStyle(img);
          const rect = img.getBoundingClientRect();
          const src = img.currentSrc || img.src || '';
          const type = src.split('?')[0].split('.').pop()?.toLowerCase() || null;
          return {
            src,
            naturalWidth: img.naturalWidth || null,
            naturalHeight: img.naturalHeight || null,
            renderedWidth: Math.round(rect.width),
            renderedHeight: Math.round(rect.height),
            objectFit: cs.objectFit || null,
            type
          };
        });

        return { h1, h2, h3, h4, bodySamples, spacings, imgs };
      });
    }
  );

  // Colors from body and common elements
  const colors = await withPage(
    { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 },
    async (page) => {
      return await page.evaluate(() => {
        const rgbToHex = (rgb) => {
          if (!rgb) return null;
          const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
          if (!m) return null;
          const [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])];
          return '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('');
        };
        const pick = (sel, prop) => {
          const el = document.querySelector(sel);
          if (!el) return null;
          const cs = getComputedStyle(el);
          return rgbToHex(cs[prop]);
        };
        return {
          text: pick('body', 'color') || '#000000',
          background: pick('body', 'backgroundColor') || '#FFFFFF',
          link: pick('a', 'color') || '#0000EE',
          buttonText: pick('button, [role="button"]', 'color') || null,
          buttonBg: pick('button, [role="button"]', 'backgroundColor') || null,
        };
      });
    }
  );

  const toHex = (v) => v || '#000000';
  const CR = {
    textOnBg: contrastRatio(toHex(colors.text), toHex(colors.background)),
    linkOnBg: contrastRatio(toHex(colors.link || colors.text), toHex(colors.background)),
    buttonOnBg: contrastRatio(toHex(colors.buttonText || colors.text), toHex(colors.buttonBg || colors.background))
  };

  const flaggedImages = (metrics.imgs || []).map((im) => {
    const upscaled = im.naturalWidth && im.renderedWidth && im.renderedWidth > im.naturalWidth;
    const notOptimized = im.type && !['webp', 'avif'].includes(im.type);
    return { ...im, upscaled, notOptimized };
  });

  const out = { metrics, colors, contrast: CR, images: flaggedImages };
  await fs.writeFile(path.join(OUT_DIR, 'metrics.json'), JSON.stringify(out, null, 2));
  return out;
}

function summarizeA11y(axe) {
  const violations = (axe.violations || []).slice(0, 5).map((v) => ({
    id: v.id,
    impact: v.impact,
    description: v.description,
    help: v.help,
    helpUrl: v.helpUrl,
    nodes: v.nodes?.slice(0, 3).map((n) => ({ target: n.target, failureSummary: n.failureSummary }))
  }));
  return violations;
}

function verdict(contrast, spacings) {
  const notes = [];
  if (contrast.textOnBg < 4.5) notes.push('Body text contrast is low; increase darkness or lighten background.');
  if ((spacings || []).some((s) => s < 16)) notes.push('Tight vertical spacing detected; increase rhythm for a more luxurious feel.');
  return notes;
}

function mdReport({ axe, data }) {
  const violations = summarizeA11y(axe);
  const cr = data.contrast;
  const imgs = data.images;
  const spacings = data.metrics.spacings;

  return `### Quick verdict
- ${verdict(cr, spacings).join(' ' ) || 'Overall structure aligns with a luxury aesthetic; further polish recommended on spacing and contrast.'}

### Accessibility (top issues)
${violations.map((v, i) => `- ${i + 1}. ${v.id} (${v.impact}) — ${v.help}
  - ${v.description}
  - Fix: See ${v.helpUrl}`).join('\n') || '- No critical violations detected.'}

### Contrast ratios
- Text on background: ${cr.textOnBg.toFixed(2)} ${cr.textOnBg >= 4.5 ? '✓ AA' : '✗ fail'}
- Link on background: ${cr.linkOnBg.toFixed(2)} ${cr.linkOnBg >= 4.5 ? '✓ AA' : '✗ fail'}
- Button text on button bg: ${cr.buttonOnBg.toFixed(2)} ${cr.buttonOnBg >= 4.5 ? '✓ AA' : '✗ fail'}

### Typography & spacing
- Spacing samples: ${spacings?.join(', ')}

### Imagery (first 12 <img>)
${imgs.map((im) => {
  const size = `${im.renderedWidth}×${im.renderedHeight} (rendered) vs ${im.naturalWidth}×${im.naturalHeight} (natural)`;
  const flags = [(im.upscaled ? 'UP_SCALED' : null), (im.notOptimized ? 'NOT_OPTIMIZED' : null)].filter(Boolean).join(', ');
  return `- ${im.src} — ${size} — type: ${im.type || 'unknown'} ${flags ? `— ${flags}` : ''}`;
}).join('\n') || '- No images found.'}

### Concrete actions to elevate luxury
- Increase section spacing to a consistent rhythm (e.g., 64/80/120px on breakpoints).
- Verify headline uses Cormorant Garamond with tracking (0.15em) and generous size.
- Standardize outlined button with smooth gold hover (#C9A96E) site‑wide.
- Ensure product images are square, WebP/AVIF, and not upscaled.
- Raise body text contrast to meet 4.5:1 where needed.
`;
}

async function main() {
  await screenshots();
  const axe = await runA11y();
  const data = await collectMetrics();
  const report = mdReport({ axe, data });
  await fs.writeFile(path.join(OUT_DIR, 'report.md'), report, 'utf8');
  console.log(report);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});










