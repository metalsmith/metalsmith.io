import hljs from 'highlight.js/lib/core';
import js from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import yml from 'highlight.js/lib/languages/yaml';
import md from 'highlight.js/lib/languages/markdown';
import xml from 'highlight.js/lib/languages/xml';
import bash from 'highlight.js/lib/languages/bash';
import dos from 'highlight.js/lib/languages/dos';
import txt from 'highlight.js/lib/languages/plaintext';
import diff from 'highlight.js/lib/languages/diff';
import django from 'highlight.js/lib/languages/django';

export default function initSyntaxHighlighting() {
  hljs.registerLanguage('javascript', js);
  hljs.registerLanguage('json', json);
  hljs.registerLanguage('yaml', yml);
  hljs.registerLanguage('markdown', md);
  hljs.registerLanguage('html', xml);
  hljs.registerLanguage('xml', xml);
  hljs.registerLanguage('bash', bash);
  hljs.registerLanguage('dos', dos);
  hljs.registerLanguage('plaintext', txt);
  hljs.registerLanguage('diff', diff);
  hljs.registerLanguage('django', django);

  hljs.highlightAll();
}
