const input       = document.getElementById('searchInput');
const wrapper     = document.getElementById('searchWrapper');
const icons       = document.getElementById('iconCircles');
const overlay     = document.getElementById('overlayBox');
const searchBar   = document.getElementById('searchBar');
const searchIcon  = document.getElementById('searchIcon');
const menuBtn     = document.getElementById('menuIcon');
const cmdBtn      = document.getElementById('commandIcon');

const _canvas = document.createElement('canvas');
function measureText(text, font) {
  const ctx = _canvas.getContext('2d');
  ctx.font = font;
  return ctx.measureText(text).width;
}

function getMinBarWidth() {
  const style  = window.getComputedStyle(input);
  const font   = `${style.fontSize} ${style.fontFamily}`;
  const textPx = measureText(input.placeholder, font);
  return Math.ceil(104 + textPx + 24);
}

function showIcons() {
  searchBar.style.width = getMinBarWidth() + 'px';
  icons.classList.add('show');
}

function hideIcons() {
  searchBar.style.width = '';
  icons.classList.remove('show');
  overlay.classList.remove('show');
}

input.addEventListener('focus', showIcons);

wrapper.addEventListener('focusout', e => {
  if (!wrapper.contains(e.relatedTarget)) hideIcons();
});

function keepFocus(e) {
  e.preventDefault();
  input.focus();
}
searchIcon.addEventListener('mousedown', keepFocus);
menuBtn.addEventListener('mousedown',    keepFocus);
cmdBtn.addEventListener('mousedown',     keepFocus);

menuBtn.addEventListener('click', () => overlay.classList.toggle('show'));
cmdBtn.addEventListener('click',  () => overlay.classList.toggle('show'));

input.addEventListener('input', () => overlay.classList.remove('show'));
input.addEventListener('click', () => overlay.classList.remove('show'));
