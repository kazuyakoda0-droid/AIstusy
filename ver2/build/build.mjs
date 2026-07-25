/**
 * 用語詳細ページのジェネレータ
 *   node build/build.mjs      （ver2 ディレクトリで実行）
 * content.mjs のデータから ver2/pages/*.html を生成する。
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { PAGES } from './content.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, '..', 'pages');
mkdirSync(outDir, { recursive: true });

const byslug = Object.fromEntries(PAGES.map((p) => [p.slug, p]));

/** 写真のねこ。CSS の多重背景で、写真が無いときは線画ねこにフォールバックする */
const cat = (v = 'kitten') => `<span class="catpic catpic-${v} cat" aria-hidden="true"></span>`;
const CAT = cat('kitten');

function block(b) {
  switch (b.t) {
    case 'p':
      return b.body.map((x) => `<p>${x}</p>`).join('\n');
    case 'steps':
      return `<div class="dsteps">${b.items
        .map(
          (s, i) =>
            `<div class="st"><div class="n">${s.n ?? i + 1}</div><div><div class="tt">${s.tt}</div><div class="dd">${s.dd}</div></div></div>`
        )
        .join('')}</div>`;
    case 'cards':
      return `<div class="dcards">${b.items
        .map((c) => `<div><div class="h">${c.h}</div><div class="t">${c.t}</div><div class="d">${c.d}</div></div>`)
        .join('')}</div>`;
    case 'compare':
      return `<div class="dcompare">
<div class="bad"><div class="h">${b.bad.h}</div><q>${b.bad.q}</q>${b.bad.memo ? `<div class="memo">${b.bad.memo}</div>` : ''}</div>
<div class="good"><div class="h">${b.good.h}</div><q>${b.good.q}</q>${b.good.memo ? `<div class="memo">${b.good.memo}</div>` : ''}</div>
</div>`;
    case 'code':
      return `<div class="dcode">${b.code}</div>`;
    case 'note':
      return `<div class="dnote"><div class="h">${b.h}</div><p>${b.p}</p></div>`;
    case 'meta':
      return `<div class="dmeta">${cat('silver')}<div><div class="h">${b.h ?? 'たとえるなら'}</div><p>${b.p}</p></div></div>`;
    case 'faq':
      return `<div class="faq">${b.items
        .map((f) => `<details><summary>${f.q}</summary><div class="a">${f.a}</div></details>`)
        .join('')}</div>`;
    default:
      throw new Error('unknown block type: ' + b.t);
  }
}

function section(s) {
  return `<section class="dsec">
  <div class="wrap-wide">
    <p class="label">${s.label}</p>
    <h2>${s.h}</h2>
    ${s.blocks.map(block).join('\n    ')}
  </div>
</section>`;
}

function related(p) {
  const list = (p.related || []).map((sl) => byslug[sl]).filter(Boolean);
  if (!list.length) return '';
  return `<section class="dnext">
  <div class="wrap-wide">
    <p class="label">Related topics / つづけて読む</p>
    <div class="topics">
      ${list
        .map(
          (r) =>
            `<a class="topic" href="${r.slug}.html"><span class="t">${r.plain}</span><span class="d">${r.short}</span><span class="go">READ →</span></a>`
        )
        .join('\n      ')}
    </div>
    <p style="margin-top:38px"><a class="btn" href="../index.html#s${p.session}">第${p.session}回にもどる <span class="arw">→</span></a></p>
  </div>
</section>`;
}

function render(p) {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${p.plain}｜はじめてのAI勉強会 Ver.2</title>
<meta name="description" content="${p.short}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Azeret+Mono:wght@300;400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Inter:wght@300;400;500&family=Noto+Sans+JP:wght@300;400;500&family=Noto+Serif+JP:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../styles/base.css">
<link rel="stylesheet" href="../styles/detail.css">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%90%B1%3C/text%3E%3C/svg%3E">
</head>
<body>

<div class="dbar">
  <div class="dbar-in">
    <a class="back" href="../index.html">${CAT}<span>← AI勉強会 Ver.2</span></a>
    <span class="crumb">第${p.session}回 ${p.sessionTitle} / ${p.plain}</span>
  </div>
</div>

<main>
<section class="dhero">
  <div class="wrap-wide dhero-grid">
    <div>
      <p class="eyebrow">SESSION ${String(p.session).padStart(2, '0')} · ${p.cat}</p>
      <h1>${p.title}</h1>
      <span class="en">${p.en}</span>
    </div>
    <div class="side">
      ${p.lede.map((x) => `<p>${x}</p>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="oneline">
  <div class="wrap-wide oneline-in">
    ${CAT}
    <div>
      <span class="lb">ひとことで言うと</span>
      <p class="big">${p.one}</p>
    </div>
  </div>
</section>

${p.sections.map(section).join('\n\n')}
</main>

${related(p)}

<footer class="foot">
  <div class="wrap">
    <p>AI STUDY PROGRAM — VER.2 / FOR BEGINNERS</p>
    <div class="links">
      <a href="../index.html">TOP</a>
      <a href="../index.html#roadmap">ROADMAP</a>
      <a href="../index.html#s${p.session}">SESSION ${String(p.session).padStart(2, '0')}</a>
    </div>
  </div>
</footer>
</body>
</html>
`;
}

let n = 0;
for (const p of PAGES) {
  writeFileSync(join(outDir, p.slug + '.html'), render(p), 'utf8');
  n++;
}
console.log(`built ${n} pages -> ${outDir}`);
