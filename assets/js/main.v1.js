/* ИП Латышев В.В. — меню, схема проёма, состав монтажа, заявка */
(function () {
  'use strict';
  var WA = 'https://wa.me/375293615612';
  var NS = 'http://www.w3.org/2000/svg';

  /* ---------- шапка ---------- */
  var head = document.querySelector('.head');
  function onScroll() {
    if (!head) return;
    head.classList.toggle('is-stuck', window.scrollY > 30 || head.classList.contains('head--solid'));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- меню ---------- */
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('drawer');
  var closeBtn = document.getElementById('drawer-close');
  var lastFocus = null;
  function focusables() {
    if (!drawer) return [];
    return Array.prototype.slice.call(drawer.querySelectorAll('a[href],button:not([disabled]),input,select,textarea'))
      .filter(function (el) { return el.offsetParent !== null; });
  }
  function openDrawer() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.hidden = false;
    document.body.classList.add('is-locked');
    if (burger) burger.setAttribute('aria-expanded', 'true');
    var f = focusables(); if (f.length) f[0].focus();
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.hidden = true;
    document.body.classList.remove('is-locked');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (burger) burger.addEventListener('click', function () { (drawer && drawer.hidden) ? openDrawer() : closeDrawer(); });
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (drawer) {
    drawer.addEventListener('click', function (e) { if (e.target === drawer) closeDrawer(); });
    drawer.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = focusables(); if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('is-locked');
        if (burger) burger.setAttribute('aria-expanded', 'false');
      });
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && !drawer.hidden) closeDrawer();
  });

  /* ---------- появление ---------- */
  var rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && rv.length) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add('is-in'); }); }

  function el(tag, attrs, text) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) e.setAttribute(k, attrs[k]);
    if (text) e.textContent = text;
    return e;
  }

  /* ---------- проём ---------- */
  var svg = document.getElementById('opSvg');
  if (svg) {
    var opW = document.getElementById('opW'), opH = document.getElementById('opH');
    var opWOut = document.getElementById('opWOut'), opHOut = document.getElementById('opHOut');
    var oLeaf = document.getElementById('o-leaf'), oFrame = document.getElementById('o-frame');
    var oVerdict = document.getElementById('o-verdict'), opSend = document.getElementById('op-send');

    var GAP = 15, BOX = 35;

    function verdict(leafW) {
      if (leafW >= 900) return 'Широкий проём: полотно 900 мм и шире. Обычно это двустворчатая дверь или полотно с доборами.';
      if (leafW >= 800) return 'Стандарт для квартиры: полотно 800–890 мм. Самый ходовой размер, выбор дверей максимальный.';
      if (leafW >= 700) return 'Узкий проём: полотно 700–790 мм. Дверь подбираем под него, обычно без переделки проёма.';
      return 'Проём уже стандарта: полотно меньше 700 мм. Нужно расширение или нестандартная дверь — обсуждаем на замере.';
    }

    function drawOp() {
      var W = parseFloat(opW.value), H = parseFloat(opH.value);
      var s = Math.min(380 / W, 320 / H);
      var w = W * s, h = H * s;
      var x0 = (620 - w) / 2, y0 = 78;
      var frameW = W - 2 * GAP, frameH = H - 2 * GAP;
      var leafW = frameW - 2 * BOX, leafH = frameH - BOX;

      while (svg.firstChild) svg.removeChild(svg.firstChild);

      var defs = el('defs');
      var pat = el('pattern', { id: 'pWall', width: 11, height: 11, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' });
      pat.appendChild(el('line', { x1: 0, y1: 0, x2: 0, y2: 11, stroke: 'rgba(233,230,224,.16)', 'stroke-width': 1 }));
      defs.appendChild(pat);
      svg.appendChild(defs);

      /* стена и проём */
      svg.appendChild(el('rect', { x: 40, y: 26, width: 540, height: h + 96, fill: '#232A2E' }));
      svg.appendChild(el('rect', { x: 40, y: 26, width: 540, height: h + 96, fill: 'url(#pWall)' }));
      svg.appendChild(el('rect', { x: x0, y: y0, width: w, height: h, fill: '#0A0D0F' }));

      /* коробка */
      svg.appendChild(el('rect', { x: x0 + GAP * s, y: y0 + GAP * s, width: frameW * s, height: frameH * s, fill: 'none', stroke: '#C08A3E', 'stroke-width': 2.4 }));
      /* полотно */
      var lx = x0 + (GAP + BOX) * s, ly = y0 + GAP * s;
      svg.appendChild(el('rect', { x: lx, y: ly, width: leafW * s, height: leafH * s, fill: '#3A4145', stroke: 'rgba(233,230,224,.55)', 'stroke-width': 1.2 }));
      /* петли */
      [0.18, 0.5, 0.82].forEach(function (k) {
        svg.appendChild(el('rect', { x: lx - 1, y: ly + leafH * s * k - 7, width: 7, height: 14, fill: '#C08A3E' }));
      });
      /* ручка */
      var hy = ly + leafH * s - 1000 * s;
      svg.appendChild(el('circle', { cx: lx + leafW * s - 26, cy: Math.max(ly + 16, Math.min(ly + leafH * s - 16, hy)), r: 4, fill: '#C08A3E' }));
      svg.appendChild(el('rect', { x: lx + leafW * s - 32, y: Math.max(ly + 16, Math.min(ly + leafH * s - 16, hy)) - 1.5, width: 12, height: 3, fill: '#C08A3E' }));

      /* размер ширины */
      var dyy = y0 + h + 34;
      svg.appendChild(el('line', { x1: x0, y1: dyy, x2: x0 + w, y2: dyy, stroke: 'rgba(233,230,224,.45)', 'stroke-width': 1 }));
      [x0, x0 + w].forEach(function (x) {
        svg.appendChild(el('line', { x1: x, y1: dyy - 7, x2: x, y2: dyy + 7, stroke: '#C08A3E', 'stroke-width': 1.4 }));
      });
      svg.appendChild(el('text', { x: x0 + w / 2, y: dyy + 22, 'text-anchor': 'middle' }, 'проём ' + W + ' мм'));

      /* размер высоты */
      var dxx = x0 - 30;
      svg.appendChild(el('line', { x1: dxx, y1: y0, x2: dxx, y2: y0 + h, stroke: 'rgba(233,230,224,.45)', 'stroke-width': 1 }));
      [y0, y0 + h].forEach(function (y) {
        svg.appendChild(el('line', { x1: dxx - 7, y1: y, x2: dxx + 7, y2: y, stroke: '#C08A3E', 'stroke-width': 1.4 }));
      });
      var tv = el('text', { x: dxx - 10, y: y0 + h / 2, 'text-anchor': 'middle' }, 'проём ' + H);
      tv.setAttribute('transform', 'rotate(-90 ' + (dxx - 10) + ' ' + (y0 + h / 2) + ')');
      svg.appendChild(tv);

      /* подпись полотна */
      svg.appendChild(el('text', { x: lx + 10, y: ly + 20 }, 'полотно ' + leafW + ' × ' + leafH + ' мм'));
      svg.appendChild(el('text', { x: 40, y: 18 }, 'ФАСАД · ВИД С УЛИЦЫ'));

      /* числа */
      oLeaf.textContent = leafW + ' × ' + leafH;
      oFrame.textContent = frameW + ' × ' + frameH;
      opWOut.textContent = W + ' мм';
      opHOut.textContent = H + ' мм';
      oVerdict.textContent = verdict(leafW) + (H < 1960 ? ' По высоте проём низковат: уточняем порог и высоту коробки.' : '');

      opSend.href = WA + '?text=' + encodeURIComponent(
        'Проём с сайта\nШирина проёма: ' + W + ' мм\nВысота проёма: ' + H + ' мм' +
        '\nПолотно по расчёту: ' + leafW + ' × ' + leafH + ' мм' +
        '\nКоробка: ' + frameW + ' × ' + frameH + ' мм' +
        '\nХочу уточнить стоимость установки.');
    }
    [opW, opH].forEach(function (i) { i.addEventListener('input', drawOp); });
    drawOp();
  }

  /* ---------- состав монтажа ---------- */
  var scopeList = document.querySelectorAll('input[name="scope"]');
  if (scopeList.length) {
    var picked = document.getElementById('scope-picked');
    var countEl = document.getElementById('scope-count');
    var emptyEl = document.getElementById('scope-empty');
    var sendScope = document.getElementById('scope-send');
    var total = scopeList.length;

    function refresh() {
      var values = [];
      scopeList.forEach(function (c) { if (c.checked) values.push(c.value); });

      while (picked.firstChild) picked.removeChild(picked.firstChild);
      values.forEach(function (v) {
        var li = document.createElement('li');
        li.textContent = v;
        picked.appendChild(li);
      });
      countEl.textContent = 'выбрано ' + values.length + ' из ' + total;
      emptyEl.hidden = values.length > 0;

      var text = values.length
        ? 'Монтаж металлической двери. Нужно:\n— ' + values.join('\n— ') + '\nПодскажите стоимость и сроки.'
        : 'Монтаж металлической двери. Подскажите, что входит в установку и сколько стоит.';
      sendScope.href = WA + '?text=' + encodeURIComponent(text);
    }
    scopeList.forEach(function (c) { c.addEventListener('change', refresh); });
    refresh();
  }

  /* ---------- заявка ---------- */
  var form = document.getElementById('lead');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var g = function (sel) { var f = form.querySelector(sel); return f ? f.value : ''; };
      var name = g('#f-name'), phone = g('#f-phone'), obj = g('#f-obj'), what = g('#f-what'), note = g('#f-note');
      var ok = form.querySelector('.form__ok');
      if (name.trim().length < 2 || phone.replace(/\D/g, '').length < 9) {
        if (ok) { ok.hidden = false; ok.textContent = 'Укажите имя и телефон, чтобы мы могли ответить.'; }
        return;
      }
      var text = 'Заявка на замер\nИмя: ' + name.trim() + '\nТелефон: ' + phone.trim() +
        (obj ? '\nОбъект: ' + obj : '') + (what ? '\nЧто нужно: ' + what : '') +
        (note.trim() ? '\nКомментарий: ' + note.trim() : '');
      var url = WA + '?text=' + encodeURIComponent(text);
      if (ok) {
        ok.hidden = false;
        ok.innerHTML = 'Заявка собрана. Если WhatsApp не открылся, <a href="' + url + '" target="_blank" rel="noopener">нажмите здесь</a>.';
      }
      window.open(url, '_blank', 'noopener');
    });
  }
})();
