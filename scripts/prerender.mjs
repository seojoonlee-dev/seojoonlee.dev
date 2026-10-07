import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { paths, render } from "../build/server/entry-server.js";

const template = readFileSync("dist/index.html", "utf8");
const hoisted = /^(<title>[^<]*<\/title>|<meta [^>]*\/>|<link [^>]*\/>)/;

function page(html) {
  let head = "";
  let body = html;
  let m;
  while ((m = body.match(hoisted))) {
    head += `    ${m[0]}\n`;
    body = body.slice(m[0].length);
  }
  return template
    .replace("  </head>", `${head}  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

const files = [...paths.map((p) => [p, p === "/" ? "index.html" : `${p.slice(1)}.html`]), ["/404", "404.html"]];

for (const [path, file] of files) {
  const out = `dist/${file}`;
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, page(await render(path)));
  console.log(`prerendered ${path} -> ${out}`);
}
