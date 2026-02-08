import nunjucks from 'nunjucks';

export default function TabbedExtension() {
  this.tags = ['codetabs'];
  this.parse = (parser, nodes) => {
    const tok = parser.nextToken();
    const args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(tok.value);

    const body = parser.parseUntilBlocks('endcodetabs');
    parser.advanceAfterBlockEnd();

    return new nodes.CallExtension(this, 'run', args, [body]);
  };

  this.run = (context, tabs, body) => {
    const ret = new nunjucks.runtime.SafeString(`
<div class="CodeTabs"><nav>
  ${tabs
    .map(
      (tab, i) =>
        `<button type="button" data-toggle="${i}" class="CodeTabs-toggle${
          i === 0 ? ' CodeTabs-toggle--active' : ''
        }"><code>${tab}</code></button>`
    )
    .join('')}</nav>
  ${body()}
</div>`);
    return ret;
  };
}
