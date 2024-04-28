/* eslint-disable import/no-extraneous-dependencies */
import nunjucks from 'nunjucks';

export default function CodeBlockExtension() {
  this.tags = ['codeblock'];
  this.parse = (parser, nodes) => {
    // get the tag token
    const tok = parser.nextToken();

    // parse the args and move after the block end. passing true
    // as the second arg is required if there are no parentheses
    const args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(tok.value);

    // parse the body
    const body = parser.parseUntilBlocks('endcodeblock');
    parser.advanceAfterBlockEnd();

    return new nodes.CallExtension(this, 'run', args, [body]);
  };

  this.run = (context, filename, body) => {
    if (!body) {
      body = filename;
      filename = null;
    }
    const ret = new nunjucks.runtime.SafeString(`
<figure class="Code">
  ${filename ? `<code class="Code-filename">${filename}</code>` : ''}
  ${body()}
</figure>`);
    return ret;
  };
}

// usage:
// const CodeBlockExtension = require('./metalsmith/nunjucks-codeblock');
// inPlace options:
//  extensions: {
//    CodeBlockExtension: new CodeBlockExtension()
//  }
// in templates:
// {% codeblock "js","metalsmith.js" %}
// code goes here
// {% endcodeblock %}
