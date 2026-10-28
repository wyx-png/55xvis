/* =========================================================
   动效引擎 Motion Engine
   ---------------------------------------------------------
   职责：只负责「视觉怎么出现、怎么响应鼠标」，
         不参与任何数据、路由、上传与案例注册逻辑。

   设计原则（重要）：
   1. 不改 shell.js / kit.js / registry.js / case-upload.js 的任何契约；
   2. 不动 .imp-* 系列 DOM（添加案例对话框），上传功能零改动；
   3. 所有动效都能在「系统减少动态效果」下自动降级；
   4. 页面切走后停止 rAF，切回来再启动，不空转。

   包含的动效：
   A 顶部路由进度条      B 视图淡入上移      C 头部吸顶 + 滚动进度线
   D 导航滑动指示条      E 滚动揭示（交错）  F HERO 粒子流画布（可交互）
   G 标题逐行遮罩上滑    H 速览数字滚动      I 场景名滚动带
   J 卡片聚光灯          K 回到顶部（环形进度）
   ========================================================= */
(function () {
  'use strict';
  if (typeof window === 'undefined' || !window.document) return;

  var D = document;
  var A = window.ATLAS || {};

  /* ---------- 能力探测 ---------- */
  var RM = false, FINE = false;
  try { RM = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { }
  try { FINE = !!(window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches); } catch (e) { }

  function q(s, r) { return (r || D).querySelector(s); }
  function qa(s, r) { return Array.prototype.slice.call((r || D).querySelectorAll(s)); }
  function mk(tag, cls, html) {
    var e = D.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function isDark() { return D.documentElement.classList.contains('dark'); }

  /* =========================================================
     L. 主题切换（深色 / 浅色），localStorage 记忆
     ========================================================= */
  function themeBtn(root) {
    var b = q('#theme-toggle', root);
    if (!b || b.__mtheme) return;
    b.__mtheme = 1;
    function paint() { b.textContent = isDark() ? '☾' : '☀'; }
    b.addEventListener('click', function () {
      var dk = !isDark();
      D.documentElement.classList.toggle('dark', dk);
      try { localStorage.setItem('atlas.theme', dk ? 'dark' : 'light'); } catch (e) { }
      paint();
      window.dispatchEvent(new Event('atlas-theme'));
    });
    paint();
  }

  /* =========================================================
     A. 顶部路由进度条
     ========================================================= */
  var prog = mk('div', 'm-prog', '<i></i>');
  if (D.body) D.body.appendChild(prog);
  var ptimers = [];
  function runProg() {
    if (RM) return;
    ptimers.forEach(clearTimeout); ptimers = [];
    prog.classList.remove('finish');
    prog.classList.add('on');
    void prog.offsetWidth;                    /* 强制回流，保证 0 → 42% 有过渡 */
    prog.classList.add('start');
    ptimers.push(setTimeout(function () { prog.classList.add('finish'); }, 240));
    ptimers.push(setTimeout(function () { prog.classList.remove('on'); }, 720));
    ptimers.push(setTimeout(function () { prog.classList.remove('start', 'finish'); }, 800));
  }

  /* =========================================================
     C. 头部吸顶态 + 滚动进度
     ========================================================= */
  var scrollQueued = false;
  function onScroll() {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(function () {
      scrollQueued = false;
      var de = D.documentElement;
      var y = window.pageYOffset || de.scrollTop || 0;
      var max = (de.scrollHeight - window.innerHeight) || 1;
      D.body.style.setProperty('--sp', clamp(y / max, 0, 1).toFixed(4));
      var h = q('.hdr');
      if (h) h.classList.toggle('solid', y > 10);
      if (topBtn) topBtn.classList.toggle('on', y > 400);
    });
  }

  /* =========================================================
     D. 导航滑动指示条
     ========================================================= */
  var ind = null;
  function syncInd() {
    var nav = q('.nav');
    if (!nav) return;
    if (!ind || ind.parentNode !== nav) {
      if (ind && ind.parentNode) ind.parentNode.removeChild(ind);
      ind = mk('i', 'nav-ind');
      nav.appendChild(ind);
    }
    var a = nav.querySelector('a.on');
    if (!a || !nav.contains(a)) { ind.classList.remove('on'); return; }
    var r = a.getBoundingClientRect(), b = nav.getBoundingClientRect();
    ind.style.left = (r.left - b.left + 7) + 'px';
    ind.style.width = Math.max(0, r.width - 14) + 'px';
    ind.classList.add('on');
  }

  /* =========================================================
     E. 滚动揭示
     ========================================================= */
  var io = null;
  if (window.IntersectionObserver) {
    io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        io.unobserve(el);
        el.classList.add('in');
        /* 动画结束后把类摘掉：避免残留 transform 影响原有 hover 动效 */
        setTimeout(function () {
          el.classList.remove('m-rv', 'in');
          el.style.removeProperty('--m-i');
          if (el.tagName === 'DIV' && el.classList.contains('sec-head')) el.classList.add('m-on');
        }, 1100);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
  }

  var GROUPS = [
    ['.chain', '.step'],
    ['.methods', '.mcard'],
    ['.fields', '.field'],
    ['.scenes', '.scene-row'],
    ['.case-list', '.case-card'],
    ['.grid2', '.card'],
    ['.grid3', '.card']
  ];
  var SINGLES = ['.sec-head', '.matrix-wrap', '.page-head', '.detail-head', '.summary', '.blocked-box', '.panel'];

  function markReveal(root) {
    GROUPS.forEach(function (g) {
      qa(g[0], root).forEach(function (box) {
        qa(g[1], box).forEach(function (el, i) { arm(el, i); });
      });
    });
    SINGLES.forEach(function (s) {
      qa(s, root).forEach(function (el, i) { arm(el, i); });
    });
    /* 兜底：顶层散落的 .card（不在已知容器里） */
    qa('.card', root).forEach(function (el) {
      if (el.closest('.grid2,.grid3,.case-list,.fields,.methods,.panel')) return;
      arm(el, 0);
    });
  }
  function arm(el, i) {
    if (!el || el.__mrv) return;
    el.__mrv = 1;
    /* 没有 IntersectionObserver 或用户要求减少动态：不做揭示，内容直接可见 */
    if (RM || !io) return;
    if (el.getBoundingClientRect().top > window.innerHeight * 1.15) {
      el.classList.add('m-rv');
      el.style.setProperty('--m-i', String(Math.min(i, 6)));
      io.observe(el);
    }
  }

  /* =========================================================
     G. 标题逐行遮罩上滑
     ========================================================= */
  function splitTitle(root) {
    var h1 = q('.hero h1', root);
    if (!h1 || h1.__msplit || RM) return;
    h1.__msplit = 1;
    var parts = h1.innerHTML.split(/<br\s*\/?>/i);
    h1.innerHTML = parts.map(function (p) {
      return '<span class="m-ln"><i>' + p + '</i></span>';
    }).join('');
  }

  /* =========================================================
     H. 速览数字滚动
     ========================================================= */
  function countUp(root) {
    qa('.spec-row .v, .ph-stat .n, .hero-stats .n', root).forEach(function (el) {
      if (el.__mcu) return;
      el.__mcu = 1;
      var node = el.childNodes[0];
      if (!node || node.nodeType !== 3) return;
      var txt = String(node.nodeValue || '').trim();
      var m = txt.match(/^(\d[\d,]*)([\s\S]*)$/);
      if (!m) return;
      var target = parseInt(m[1].replace(/,/g, ''), 10);
      if (!isFinite(target) || target < 2) return;
      var suffix = m[2] || '';
      var small = el.querySelector('small');
      if (RM) return;
      var t0 = 0, dur = 900, done = false;
      function fin() {
        if (done) return; done = true;
        node.nodeValue = txt;
        if (small) el.appendChild(small);
      }
      function step(ts) {
        if (done) return;
        if (!t0) t0 = ts;
        var k = clamp((ts - t0) / dur, 0, 1);
        k = 1 - Math.pow(1 - k, 3);
        node.nodeValue = Math.round(target * k).toLocaleString('en-US') + suffix;
        if (k < 1) requestAnimationFrame(step); else fin();
      }
      node.nodeValue = '0';
      if (small) el.appendChild(small);
      requestAnimationFrame(step);
      setTimeout(fin, dur + 420);            /* rAF 被节流也保证最终值正确 */
    });
  }

  /* =========================================================
     I. 场景名滚动带
     ========================================================= */
  function ticker(root) {
    var main = q('main', root);
    if (!main) return;
    var hero = q('.hero', main);
    if (!hero || main.querySelector('.m-tk')) return;
    var scenes = A.allScenes || [];
    if (!scenes.length) return;

    var M = A.methods || {};
    function item(sc) {
      var k = (sc.methods && sc.methods[0]) || 'cv';
      var c = (M[k] && M[k].colorKey) || k;
      var idx = sc.stageIdx != null ? String(sc.stageIdx) : '·';
      if (idx.length < 2) idx = '0' + idx;
      return '<span class="m-tk-i"><i style="--mc:var(--c-' + c + ')"></i><b>' + idx + '</b>' +
        String(sc.name || '').replace(/[<>&]/g, '') + '</span>';
    }
    var one = scenes.map(item).join('');
    var band = mk('div', 'm-tk',
      '<div class="m-tk-row">' + one + one + '</div>');
    band.setAttribute('aria-hidden', 'true');
    if (hero.nextSibling) main.insertBefore(band, hero.nextSibling);
    else main.appendChild(band);
  }

  /* =========================================================
     J. 卡片聚光灯
     ========================================================= */
  function spotlights(root) {
    if (!FINE) return;
    qa('.mcard, .field, .card, .spec', root).forEach(function (el) {
      if (el.__mspot) return;
      el.__mspot = 1;
      if (!el.classList.contains('m-spot')) el.classList.add('m-spot');
      el.addEventListener('mousemove', function (ev) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', ((ev.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        el.style.setProperty('--my', ((ev.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      });
    });
  }

  /* =========================================================
     J2. 三维倾斜：鼠标在卡片上移动时轻微转向（速览卡 / 方法卡）
     ========================================================= */
  function tilt(sel, root, max) {
    if (RM || !FINE) return;
    qa(sel, root).forEach(function (el) {
      if (el.__mtilt) return;
      el.__mtilt = 1;
      el.addEventListener('mousemove', function (ev) {
        var r = el.getBoundingClientRect();
        var px = (ev.clientX - r.left) / r.width - 0.5;
        var py = (ev.clientY - r.top) / r.height - 0.5;
        el.style.transform =
          'perspective(900px) rotateY(' + (px * max).toFixed(2) + 'deg) rotateX(' + (-py * max).toFixed(2) + 'deg)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* =========================================================
     K. 回到顶部
     ========================================================= */
  var topBtn = null;
  function backTop() {
    if (topBtn) return;
    topBtn = mk('button', 'm-top');
    topBtn.type = 'button';
    topBtn.setAttribute('aria-label', '回到顶部');
    topBtn.innerHTML =
      '<svg viewBox="0 0 44 44" class="ring"><circle class="b" cx="22" cy="22" r="21"/>' +
      '<circle class="f" cx="22" cy="22" r="21"/></svg>' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });
    });
    D.body.appendChild(topBtn);
  }

  /* =========================================================
     F. HERO 粒子流画布
     ========================================================= */
  /* 三色粒子：玉青为主，群青点缀，少量陶土（深色主题下整体提亮） */
  var CJ = '47,125,107', CC = '178,106,57', CB = '65,105,155';
  function applyPal() {
    if (isDark()) { CJ = '96,199,170'; CC = '219,158,101'; CB = '122,168,228'; }
    else { CJ = '47,125,107'; CC = '178,106,57'; CB = '65,105,155'; }
  }
  applyPal();
  window.addEventListener('atlas-theme', function () { applyPal(); if (heroState && heroState.repaint) heroState.repaint(); });
  var heroState = null;

  function heroFX(root) {
    var hero = q('.hero', root);
    if (!hero || hero.querySelector('.m-hero-fx')) return;
    var cv = mk('canvas', 'm-hero-fx');
    cv.setAttribute('aria-hidden', 'true');
    /* 网格座标纸垫底（14.1），粒子画布叠其上 */
    var grid = mk('div', 'm-hero-grid');
    grid.setAttribute('aria-hidden', 'true');
    hero.insertBefore(grid, hero.firstChild);
    hero.insertBefore(cv, hero.firstChild);
    var ctx = cv.getContext && cv.getContext('2d');
    if (!ctx) { hero.removeChild(cv); return; }

    /* 视差：hero 内容层随鼠标轻微偏移（与粒子引力同源，lerp 平滑） */
    var par = FINE && !RM ? q('.wrap', hero) : null;
    var px = 0, py = 0, ptx = 0, pty = 0;

    var W = 0, H = 0, dpr = 1, P = [];
    var tmx = -1e4, tmy = -1e4, hover = false;
    var raf = 0;

    /* 两套皮肤：深色维持原样不动；浅色改为低饱和灰蓝，含蓄不抢戏 */
    var GLB = ['108,132,152', '124,146,166', '124,146,166', '108,132,152', '146,152,163'];  /* 浅色：灰调蓝 */
    var GLINK = '112,136,156';                                                              /* 浅色连线：极淡灰蓝 */
    function skin() {
      return isDark()
        ? { pal: [CJ, CB, CB, CJ, CC], link: CJ, mouse: CB, dot: 1, line: 1, halo: 1 }
        /* 浅色：点稍微提存在感（白底上浅色会消失，需补一点），连线再弱一档，
           柔光收一半 —— 白底上大面积柔光会显得灰蒙蒙、发脏 */
        : { pal: GLB, link: GLINK, mouse: GLINK, dot: 1.35, line: 0.42, halo: 0.45 };
    }
    var LINK = 150, LINK2 = LINK * LINK;      /* 粒子间连线距离（参考 netCanvas：150） */
    var MRA = 160, MRA2 = MRA * MRA;          /* 鼠标引力半径（参考：160） */
    var SPD = 0.19;                           /* 漂移速度：再降一档，慢而稳 */
    var GLOW = 7;                             /* 粒子发光半径（参考：shadowBlur 8） */

    function seed() {
      P = [];
      var mob = W < 720;                       /* 窄屏：粒子更少、连线更短，保证性能与呼吸感 */
      LINK = mob ? 118 : 150; LINK2 = LINK * LINK;
      /* 抖动网格布点：先均匀切格，再在格内随机偏移 —— 密度接近参考的 90 个，但不会聚成一簇 */
      var cols = mob ? 8 : Math.max(6, Math.round(W / 92));
      var rows = mob ? 5 : Math.max(3, Math.round(H / 88));
      var cw = W / cols, chh = H / rows;
      for (var gx = 0; gx < cols; gx++) {
        for (var gy = 0; gy < rows; gy++) {
          if (Math.random() < 0.07) continue;  /* 少量随机留白，疏密有致 */
          P.push({
            x: (gx + 0.15 + Math.random() * 0.7) * cw,
            y: (gy + 0.15 + Math.random() * 0.7) * chh,
            vx: (Math.random() - 0.5) * SPD * 2, vy: (Math.random() - 0.5) * SPD * 2,
            r: 1.0 + Math.random() * 1.7,      /* 1.0–2.7 px，比参考(1–3.2)更小一号 */
            ci: (Math.random() * 5) | 0,       /* 存调色板索引而非颜色，切主题即时生效 */
            a: 0.55 + Math.random() * 0.35,    /* 参考 alpha 0.85，这里按大小略降 */
            ph: Math.random() * 6.283
          });
        }
      }
    }

    function fit() {
      var r = hero.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = r.width; H = r.height;
      var w = Math.max(1, Math.round(W * dpr)), h = Math.max(1, Math.round(H * dpr));
      if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; seed(); }
    }

    function drawLines() {
      var SK = skin();
      for (var a = 0; a < P.length; a++) {
        var pa = P[a];
        for (var b = a + 1; b < P.length; b++) {
          var pb = P[b];
          var dx = pa.x - pb.x, dy = pa.y - pb.y, d2 = dx * dx + dy * dy;
          if (d2 > LINK2) continue;
          var k = 1 - d2 / LINK2;
          ctx.strokeStyle = 'rgba(' + SK.link + ',' + (k * k * 0.26 * SK.line).toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
        }
        if (hover) {
          var mx2 = pa.x - tmx, my2 = pa.y - tmy, md2 = mx2 * mx2 + my2 * my2;
          if (md2 < MRA2) {
            var mk = 1 - md2 / MRA2;
            ctx.strokeStyle = 'rgba(' + SK.mouse + ',' + (mk * 0.32 * SK.line).toFixed(3) + ')';
            ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(tmx, tmy); ctx.stroke();
          }
        }
      }
    }

    function drawDots(t) {
      var SK = skin();
      for (var j = 0; j < P.length; j++) {
        var p = P[j];
        var col = SK.pal[p.ci];
        var tw = 0.72 + 0.28 * Math.sin(t * 0.00095 + p.ph);      /* 呼吸明暗 */
        var al = Math.min(1, p.a * tw * SK.dot);
        /* 双层柔光打底（不触发阴影，省性能）；浅色下收敛，避免白底发脏 */
        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + col + ',' + (al * 0.10 * SK.halo).toFixed(3) + ')';
        ctx.arc(p.x, p.y, p.r * 3.8, 0, 6.283);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + col + ',' + (al * 0.22 * SK.halo).toFixed(3) + ')';
        ctx.arc(p.x, p.y, p.r * 2.1, 0, 6.283);
        ctx.fill();
        /* 实心核：深色下加 shadowBlur 发光；浅色下关掉阴影，只留干净的小圆点 */
        ctx.beginPath();
        if (SK.halo === 1) { ctx.shadowColor = 'rgba(' + col + ',' + (al * 0.8).toFixed(3) + ')'; ctx.shadowBlur = GLOW; }
        ctx.fillStyle = 'rgba(' + col + ',' + al.toFixed(3) + ')';
        ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function step(t) {
      for (var i = 0; i < P.length; i++) {
        var p = P[i];
        p.x += p.vx + Math.sin(t * 0.00062 + p.ph) * 0.028;        /* 漂移 + 微摆 */
        p.y += p.vy + Math.cos(t * 0.00053 + p.ph) * 0.028;
        /* 边界反弹（参考 netCanvas 的做法），粒子始终留在首屏内，网络更稳定 */
        if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); }
        else if (p.x > W) { p.x = W; p.vx = -Math.abs(p.vx); }
        if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); }
        else if (p.y > H) { p.y = H; p.vy = -Math.abs(p.vy); }
        if (hover) {                                             /* 向光标轻微聚拢：直接位移，同参考 */
          var dx = tmx - p.x, dy = tmy - p.y, d2 = dx * dx + dy * dy;
          if (d2 < MRA2 && d2 > 1) {
            p.x += dx * 0.004; p.y += dy * 0.004;
          }
        }
        var sp = p.vx * p.vx + p.vy * p.vy;                      /* 限速，防甩飞 */
        if (sp > 0.36) { var s = 0.6 / Math.sqrt(sp); p.vx *= s; p.vy *= s; }
      }
    }

    function loop(ts) {
      if (!D.body.contains(cv)) { raf = 0; return; }
      fit();
      var t = ts || 0;
      step(t);
      if (par) {                                   /* 内容层视差（幅度很小，纯点缀） */
        px += (ptx - px) * 0.055; py += (pty - py) * 0.055;
        par.style.transform = 'translate3d(' + px.toFixed(2) + 'px,' + py.toFixed(2) + 'px,0)';
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      drawLines();
      drawDots(t);
      raf = requestAnimationFrame(loop);
    }
    function kick() { if (!raf && !RM) raf = requestAnimationFrame(loop); }

    hero.addEventListener('mouseenter', function () { hover = true; });
    hero.addEventListener('mouseleave', function () { hover = false; tmx = -1e4; tmy = -1e4; ptx = 0; pty = 0; });
    hero.addEventListener('mousemove', function (ev) {
      var r = cv.getBoundingClientRect();
      tmx = ev.clientX - r.left; tmy = ev.clientY - r.top;
      if (par) {
        var hr = hero.getBoundingClientRect();
        ptx = ((ev.clientX - hr.left) / hr.width - 0.5) * 12;
        pty = ((ev.clientY - hr.top) / hr.height - 0.5) * 7;
      }
    });

    if (RM) {
      /* 减少动态：画一张静态星群，不跑动画循环 */
      var paintStatic = function () {
        fit();
        var SK = skin();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);
        ctx.lineWidth = 1;
        for (var a = 0; a < P.length; a++) {
          for (var b = a + 1; b < P.length; b++) {
            var dx = P[a].x - P[b].x, dy = P[a].y - P[b].y, d2 = dx * dx + dy * dy;
            if (d2 > LINK2) continue;
            var k0 = 1 - d2 / LINK2;
            ctx.strokeStyle = 'rgba(' + SK.link + ',' + (k0 * 0.13 * SK.line).toFixed(3) + ')';
            ctx.beginPath(); ctx.moveTo(P[a].x, P[a].y); ctx.lineTo(P[b].x, P[b].y); ctx.stroke();
          }
        }
        for (var j = 0; j < P.length; j++) {
          var sp = P[j], sc = SK.pal[sp.ci], sa = Math.min(1, sp.a * SK.dot);
          ctx.beginPath();
          ctx.fillStyle = 'rgba(' + sc + ',' + (sa * 0.12 * SK.halo).toFixed(3) + ')';
          ctx.arc(sp.x, sp.y, sp.r * 3.8, 0, 6.283); ctx.fill();
          ctx.beginPath();
          ctx.fillStyle = 'rgba(' + sc + ',' + (sa * 0.26 * SK.halo).toFixed(3) + ')';
          ctx.arc(sp.x, sp.y, sp.r * 2.1, 0, 6.283); ctx.fill();
          ctx.beginPath();
          if (SK.halo === 1) { ctx.shadowColor = 'rgba(' + sc + ',' + (sa * 0.8).toFixed(3) + ')'; ctx.shadowBlur = GLOW; }
          ctx.fillStyle = 'rgba(' + sc + ',' + sa.toFixed(3) + ')';
          ctx.arc(sp.x, sp.y, sp.r, 0, 6.283);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      };
      paintStatic();
      window.addEventListener('resize', paintStatic);
      heroState = { kick: function () { }, stop: function () { }, repaint: paintStatic };
      return;
    }

    heroState = { kick: kick, stop: function () { if (raf) { cancelAnimationFrame(raf); raf = 0; } } };
    kick();
  }

  /* =========================================================
     装配：视图每次重渲染后重新挂一次
     ========================================================= */
  var view = D.getElementById('view');
  var pending = 0;
  function decorate() {
    var root = view || D.body;
    splitTitle(root);      /* G 标题逐行进场 */
    ticker(root);          /* I 滚动带       */
    markReveal(root);      /* E 滚动揭示     */
    countUp(root);         /* H 数字滚动     */
    spotlights(root);      /* J 聚光灯       */
    themeBtn(root);        /* L 主题切换     */
    tilt('.spec, .mcard', root, 5);   /* J2 三维倾斜    */
    syncInd();             /* D 导航指示条   */
    heroFX(root);          /* F 粒子画布     */
    onScroll();
  }

  function schedule() {
    clearTimeout(pending);
    pending = setTimeout(decorate, 30);
  }

  if (window.MutationObserver && view) {
    var mo = new MutationObserver(schedule);
    mo.observe(view, { childList: true, subtree: false });
  }
  window.addEventListener('hashchange', function () { runProg(); schedule(); });
  window.addEventListener('resize', function () { syncInd(); schedule(); });
  D.addEventListener('visibilitychange', function () {
    if (D.hidden) { if (heroState) heroState.stop(); }
    else { if (heroState) heroState.kick(); }
  });

  /* 首屏：shell.js 还没跑时 view 里是占位内容，等 DOM 就绪再挂一次 */
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', schedule);
  schedule();

  backTop();
  runProg();
})();
