const defaultoptions = {
  selector: '[href="#top"]',
  scrollOffset: 0,
  showOffset: 100,
  speed: 0,
  container: window
};

function hideToggle(elem) {
  elem.setAttribute('hidden', '');
  setTimeout(function () {
    elem.style.display = 'none';
  }, 50);
}

function showToggle(elem) {
  elem.style.display = 'block';
  setTimeout(function () {
    elem.removeAttribute('hidden');
  }, 50);
}

function scrollToTop(opts) {
  opts = Object.assign(defaultoptions, opts || {});
  let togglesHidden = true;

  Object.keys(defaultoptions).forEach(function (key) {
    if (opts[key] && typeof opts[key] === typeof defaultoptions[key])
      defaultoptions[key] = opts[key];
  });

  function onToggleClick(e) {
    e.preventDefault();
    opts.container.scrollTo(0, 0 + opts.scrollOffset);
  }

  const elems = document.querySelectorAll(defaultoptions.selector);
  for (let i = 0; i < elems.length; i++) {
    elems[i].addEventListener('click', onToggleClick);
  }

  const prop = opts.container === window ? 'scrollY' : 'scrollTop';

  function toggleDisplay(e) {
    if (e.currentTarget[prop] < opts.showOffset) {
      if (togglesHidden) return;

      for (let i = 0; i < elems.length; i++) {
        hideToggle(elems[i]);
      }
      togglesHidden = true;
    } else {
      if (!togglesHidden) return;

      for (let i = 0; i < elems.length; i++) {
        showToggle(elems[i]);
      }
      togglesHidden = false;
    }
  }

  opts.container.addEventListener('scroll', toggleDisplay);
}

export default scrollToTop;
