/* ============================================================
   Кейсы — фильтрация по направлениям
============================================================ */
(function () {
  var chips = document.querySelectorAll('.chip');
  var kases = document.querySelectorAll('.kase');
  var empty = document.getElementById('empty-state');

  function apply(filter) {
    var shown = 0;
    kases.forEach(function (k) {
      var cats = (k.dataset.cat || '').split(' ');
      var match = (filter === 'all') || cats.indexOf(filter) !== -1;
      k.classList.toggle('hide', !match);
      if (match) shown++;
    });
    if (empty) empty.classList.toggle('show', shown === 0);
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');
      apply(chip.dataset.filter);
    });
  });
})();
