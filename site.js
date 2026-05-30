/* ============================================================
   Диджитал плюс — сайт · интерактив + фирменный паттерн
============================================================ */

// ---- знак-вертушка (B3) как inline SVG ----
function pinwheelSVG(size, color, accent) {
  return '<svg viewBox="0 0 100 100" width="' + size + '" height="' + size + '" aria-hidden="true">' +
    '<rect x="48" y="8" width="20" height="30" rx="3" fill="' + color + '"/>' +
    '<rect x="62" y="48" width="30" height="20" rx="3" fill="' + color + '"/>' +
    '<rect x="32" y="62" width="20" height="30" rx="3" fill="' + color + '"/>' +
    '<rect x="8" y="32" width="30" height="20" rx="3" fill="' + color + '"/>' +
    '<rect x="42" y="42" width="16" height="16" rx="2" fill="' + accent + '"/>' +
  '</svg>';
}

// inject standalone marks
document.querySelectorAll('[data-mark]').forEach(function (el) {
  el.innerHTML = pinwheelSVG(el.dataset.s || 100, el.dataset.c || '#F4F1EB', el.dataset.a || '#E2553A');
});

// ---- pattern fields ----
function buildPattern(el) {
  var size = parseInt(el.dataset.psize || '26', 10);
  var gap = parseInt(el.dataset.pgap || String(size), 10);
  var base = el.dataset.pbase || 'rgba(244,241,235,0.07)';
  var accent = el.dataset.paccent || '#E2553A';
  var rect = el.getBoundingClientRect();
  var w = rect.width || (el.parentElement ? el.parentElement.offsetWidth : 900);
  var h = rect.height || (el.parentElement ? el.parentElement.offsetHeight : 400);
  if (w < 10 || h < 10) { w = Math.max(w, 900); h = Math.max(h, 400); }
  var step = size + gap;
  var cols = Math.ceil(w / step) + 2;
  var rows = Math.ceil(h / step) + 2;
  var html = '';
  var i = 0;
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      var isAccent = (i % 11 === 5);
      html += '<span style="left:' + (c * step) + 'px; top:' + (r * step) + 'px;">' +
        pinwheelSVG(size, base, isAccent ? accent : base) + '</span>';
      i++;
    }
  }
  el.innerHTML = html;
}
function rebuildPatterns() { document.querySelectorAll('.pattern-fill').forEach(buildPattern); }
rebuildPatterns();

var rt;
window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(rebuildPatterns, 180); });

// ---- mobile menu ----
var burger = document.getElementById('burger');
var menu = document.getElementById('mobile-menu');
function closeMenu() { burger.classList.remove('open'); menu.classList.remove('open'); document.body.style.overflow = ''; }
if (burger && menu) {
  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    burger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
}

// ---- FAQ accordion ----
document.querySelectorAll('.faq .item').forEach(function (item) {
  var q = item.querySelector('.q');
  var a = item.querySelector('.a');
  q.addEventListener('click', function () {
    var isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq .item.open').forEach(function (other) {
      if (other !== item) { other.classList.remove('open'); other.querySelector('.a').style.maxHeight = null; }
    });
    if (isOpen) { item.classList.remove('open'); a.style.maxHeight = null; }
    else { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
  });
});

// ---- contact form (demo) ----
var form = document.getElementById('lead-form');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.style.display = 'none';
    var ok = document.getElementById('form-success');
    if (ok) ok.classList.add('show');
  });
}

// ---- reveal on scroll ----
var io = new IntersectionObserver(function (entries) {
  entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
