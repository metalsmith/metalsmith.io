import hljs from 'highlight.js/lib/core';
import js from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import yml from 'highlight.js/lib/languages/yaml';
import md from 'highlight.js/lib/languages/markdown';
import xml from 'highlight.js/lib/languages/xml';
import bash from 'highlight.js/lib/languages/bash';
import dos from 'highlight.js/lib/languages/dos';

export default function initSyntaxHighlighting() {
  hljs.registerLanguage('javascript', js);
  hljs.registerLanguage('json', json);
  hljs.registerLanguage('yaml', yml);
  hljs.registerLanguage('markdown', md);
  hljs.registerLanguage('html', xml);
  hljs.registerLanguage('xml', xml);
  hljs.registerLanguage('bash', bash);
  hljs.registerLanguage('dos', dos);

  hljs.highlightAll();
}
