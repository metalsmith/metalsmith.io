import Anchor from 'anchor-js';

const body = document.querySelector('.Page-body');
const titles = body.querySelectorAll('h2,h3,h4,h5,h6');

export default function initAnchors() {
  [].forEach.call(titles, function (title) {
    const anchor = title.previousElementSibling && title.previousElementSibling.querySelector('a');
    if (anchor) {
      title.id = title.previousElementSibling.querySelector('a').name;
    }
  });
  // eslint-disable-next-line
  const anchors = new Anchor({
    placement: 'left',
    icon: '#'
  });
  anchors.add('h2,h3,h4,h5,h6').remove('.Highlight-wrapper h2');
}
