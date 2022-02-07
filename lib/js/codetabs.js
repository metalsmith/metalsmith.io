function toArray(items) {
  return Array.prototype.slice.call(items);
}

let scrollPos = window.scrollY;
let docHeight = document.body.scrollHeight;

function rememberScrollPos() {
  const change = docHeight - document.body.scrollHeight;
  if (change) {
    window.scrollY = scrollPos + change;
    scrollPos = window.scrollY;
    docHeight = document.body.scrollHeight;
  }
}

function CodeTabs(elem) {
  this.elem = elem;
  this.toggles = toArray(elem.querySelectorAll('.CodeTabs-toggle'));
  this.blocks = toArray(elem.querySelectorAll('figure'));
  this.activate = this.activate.bind(this);
}

CodeTabs.create = function (elem) {
  return new CodeTabs(elem);
};

CodeTabs.init = function (elements) {
  const all = Array.prototype.map.call(elements, CodeTabs.create);
  all.forEach(codeTabs => {
    codeTabs.init(all);
  });
};

CodeTabs.prototype.init = function (all) {
  this.toggles.forEach((toggle, index) => {
    toggle.addEventListener('click', () => {
      all
        .filter(
          tabs => tabs.toggles[index] && tabs.toggles[index].textContent === toggle.textContent
        )
        .forEach(tabs => tabs.activate(index));
    });
  });
  return this;
};

CodeTabs.prototype.activate = function (index) {
  this.toggles.forEach(toggle => {
    toggle.classList.remove('CodeTabs-toggle--active');
  });
  this.blocks.forEach((block, blockIndex) => {
    if (blockIndex === index) {
      block.style.display = 'block';
      this.toggles[index].classList.add('CodeTabs-toggle--active');
    } else {
      block.style.display = 'none';
    }
  });
  rememberScrollPos();
  return this;
};

export default CodeTabs.init;
