/* eslint-env node, mocha */
import { fileURLToPath } from 'node:url';
import { doesNotThrow, strictEqual } from 'node:assert';
import { accessSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { load } from 'cheerio';

const thisFile = fileURLToPath(import.meta.url);
const thisDirectory = dirname(thisFile);
const plugins = JSON.parse(readFileSync(join(thisDirectory, 'lib/data/plugins.json')));
const sitePath = join(thisDirectory, 'build');

describe('metalsmith.io', () => {
  it('build should have key files', () => {
    const sitePaths = [
      join(sitePath, 'index.html'),
      join(sitePath, 'plugins', 'index.html'),
      join(sitePath, 'api', 'index.html'),
      join(sitePath, 'step-by-step', 'index.html'),
      join(sitePath, 'news', 'index.html'),
      join(sitePath, 'about', 'index.html'),
      join(sitePath, 'index.css'),
      join(sitePath, 'index.js')
    ];

    // Divider images
    for (let i = 1; i < 7; i += 1) {
      sitePaths.push(join(sitePath, '/img', `divider-${i}.png`));
    }

    sitePaths.forEach(filePath => {
      doesNotThrow(() => {
        accessSync(filePath);
      });
    });
  });

  it('index.html should have key elements', () => {
    const indexContent = readFileSync(join(sitePath, 'index.html')).toString();
    const $ = load(indexContent);

    strictEqual($('title')[0].children[0].data, 'Metalsmith | Home');
  });

  it('plugins/index.html should have key elements', () => {
    const indexContent = readFileSync(join(sitePath, '/plugins/index.html')).toString();
    const $ = load(indexContent);

    strictEqual($('title')[0].children[0].data, 'Metalsmith | Plugins');
    strictEqual($('.PluginList li').length, plugins.length);
  });
});
