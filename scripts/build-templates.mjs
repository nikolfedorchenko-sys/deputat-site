// Компілює EJS-шаблони з views/ у звичайні JS-функції (cf/templates.js),
// бо в Cloudflare Workers заборонено eval/new Function, тож EJS не може
// компілювати шаблони «на льоту». Запуск: node scripts/build-templates.mjs
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const ejs = require('ejs');

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const VIEWS = ['index', 'news', 'news-list', 'report', 'army', 'gallery', 'manager/login', 'manager/dashboard'];
// Усі змінні, які шаблони отримують ззовні (дані + хелпери)
const LOCALS = ['s', 'news', 'gallery', 'achievements', 'post', 'bodyHtml', 'extraImages',
  'username', 'error', 'esc', 'nl2br', 'paragraphs', 'stripPhotoTokens'];

let out = '// АВТОГЕНЕРОВАНО scripts/build-templates.mjs — не редагуйте вручну, правте views/*.ejs\n';
out += 'export const templates = {\n';
for (const name of VIEWS) {
  const file = path.join(root, 'views', name + '.ejs');
  const fn = ejs.compile(fs.readFileSync(file, 'utf8'), {
    client: true, strict: true, _with: false, localsName: 'locals',
    destructuredLocals: LOCALS, filename: file, compileDebug: false,
  });
  out += `  ${JSON.stringify(name)}: ${fn.toString()},\n`;
}
out += '};\n';
fs.writeFileSync(path.join(root, 'cf', 'templates.js'), out);
console.log('cf/templates.js: ' + VIEWS.length + ' шаблонів');
