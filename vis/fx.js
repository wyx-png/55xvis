/* ============================================================
   首页动态增强脚本（fx.js）
   —— Hero 粒子网络 / 数字滚动 / 滚动进场 / 概念滚动条 / 顶栏滚动态
   纯原生、零依赖、IIFE 无全局污染，支持 prefers-reduced-motion
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('fx');

  var reduceMQ = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduce = !!(reduceMQ && reduceMQ.matches);

  /* =======================================================
     0. 全局点阵底纹
     ======================================================= */
  var grid = document.createElement('div');
  grid.className = 'fx-grid';
  document.body.appendChild(grid);

  /* =======================================================
     1. Hero 粒子网络（Canvas）
     ======================================================= */
  function initParticles() {
    var hero = document.querySelector('.hero');
    if (!hero || reduce) return;

    // 装饰光斑
    ['b1', 'b2', 'b3'].forEach(function (c) {
      var b = document.createElement('div');
      b.className = 'fx-blob ' + c;
      hero.appendChild(b);
    });

    var cvs = document.createElement('canvas');
    cvs.className = 'fx-particles';
    hero.insertBefore(cvs, hero.firstChild);
    var ctx = cvs.getContext('2d');

    var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var ps = [], mouse = { x: -9999, y: -9999, on: false };
    var running = true, raf = 0;
    var COLORS = ['#38bdf8', '#22d3ee', '#7dd3fc', '#818cf8', '#67e8f9', '#c4b5fd'];

    function resize() {
      var r = hero.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width));
      H = Math.max(1, Math.round(r.height));
      cvs.width = Math.round(W * dpr);
      cvs.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function build() {
      var area = W * H;
      var n = Math.round(Math.min(90, Math.max(26, area / 15000)));
      ps = [];
      for (var i = 0; i < n; i++) {
        ps.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - .5) * .30,
          vy: (Math.random() - .5) * .26,
          r: 1.1 + Math.random() * 1.9,
          a: .32 + Math.random() * .38,
          c: COLORS[(Math.random() * COLORS.length) | 0]
        });
      }
    }

    function step() {
      raf = requestAnimationFrame(step);
      if (!running) return;
      ctx.clearRect(0, 0, W, H);

      var LINK = Math.max(96, Math.min(148, Math.sqrt(W * H) / 7));
      var L2 = LINK * LINK;
      var i, j, p, q, dx, dy, d2, d;

      // 移动 + 鼠标轻微吸引
      for (i = 0; i < ps.length; i++) {
        p = ps[i];
        p.x += p.vx; p.y += p.vy;
        if (mouse.on) {
          dx = mouse.x - p.x; dy = mouse.y - p.y;
          d2 = dx * dx + dy * dy;
          if (d2 < 32400) {            // 180px
            d = Math.sqrt(d2) || 1;
            if (d > 26) { p.x += dx / d * .5; p.y += dy / d * .5; }
          }
        }
        if (p.x < -12) p.x = W + 12; else if (p.x > W + 12) p.x = -12;
        if (p.y < -12) p.y = H + 12; else if (p.y > H + 12) p.y = -12;
      }

      // 连线（深海主题：青色细网）
      ctx.lineWidth = .7;
      ctx.strokeStyle = '#38bdf8';
      for (i = 0; i < ps.length; i++) {
        p = ps[i];
        for (j = i + 1; j < ps.length; j++) {
          q = ps[j];
          dx = p.x - q.x; dy = p.y - q.y;
          d2 = dx * dx + dy * dy;
          if (d2 < L2) {
            d = Math.sqrt(d2);
            ctx.globalAlpha = (1 - d / LINK) * .28;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      // 鼠标到附近节点的连线
      if (mouse.on) {
        ctx.strokeStyle = '#7dd3fc';
        ctx.lineWidth = .85;
        for (i = 0; i < ps.length; i++) {
          p = ps[i];
          dx = mouse.x - p.x; dy = mouse.y - p.y;
          d2 = dx * dx + dy * dy;
          if (d2 < 32400) {
            d = Math.sqrt(d2);
            ctx.globalAlpha = (1 - d / 180) * .5;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y); ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'rgba(56,189,248,.14)';
        ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 18, 0, 6.284); ctx.fill();
        ctx.fillStyle = 'rgba(125,211,252,.55)';
        ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 2.6, 0, 6.284); ctx.fill();
      }

      // 节点（先画大光晕，再画亮核）
      for (i = 0; i < ps.length; i++) {
        p = ps[i];
        ctx.globalAlpha = p.a * .3;
        ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3, 0, 6.284); ctx.fill();
        ctx.globalAlpha = Math.min(1, p.a + .35);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.284); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // 尺寸变化
    if (window.ResizeObserver) {
      new ResizeObserver(function () { resize(); }).observe(hero);
    } else {
      window.addEventListener('resize', resize);
    }
    var rt = 0;
    window.addEventListener('resize', function () {
      clearTimeout(rt); rt = setTimeout(resize, 200);
    });

    // 鼠标
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.on = true;
    });
    hero.addEventListener('mouseleave', function () { mouse.on = false; mouse.x = mouse.y = -9999; });

    // 离屏 / 后台暂停，省电
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { running = e.isIntersecting; });
      }).observe(hero);
    }
    document.addEventListener('visibilitychange', function () {
      running = !document.hidden;
    });

    resize();
    raf = requestAnimationFrame(step);
  }

  /* =======================================================
     2. Hero 统计数字滚动递增
     ======================================================= */
  function initCountUp() {
    var box = document.getElementById('heroStats');
    if (!box) return;

    function run() {
      var nums = box.querySelectorAll('.hs-num');
      for (var i = 0; i < nums.length; i++) {
        (function (el) {
          if (el.getAttribute('data-fx') === '1') return;
          var target = parseInt((el.textContent || '').replace(/[^\d]/g, ''), 10);
          el.setAttribute('data-fx', '1');
          if (!isFinite(target) || target <= 0 || reduce) return;
          var t0 = 0, dur = 1200, done = false;
          function fin() { if (!done) { done = true; el.textContent = String(target); } }
          setTimeout(fin, 1400); // 兜底：rAF 被节流时也保证显示最终值
          function tick(ts) {
            if (done) return;
            if (!t0) t0 = ts;
            var k = Math.min(1, (ts - t0) / dur);
            var e = 1 - Math.pow(1 - k, 3);
            el.textContent = String(Math.round(target * e));
            if (k < 1) requestAnimationFrame(tick); else fin();
          }
          requestAnimationFrame(tick);
        })(nums[i]);
      }
    }
    setTimeout(run, 420);
    if (window.MutationObserver) {
      new MutationObserver(run).observe(box, { childList: true, subtree: true, characterData: true });
    }
  }

  /* =======================================================
     3. 滚动进场
     ======================================================= */
  var SEL = [
    '.sec-head', '.card', '.ch-card', '.howto-card', '.about-card',
    '.gl-card', '.path-legend', '.chapters-grid', '.ref-list'
  ].join(',');

  function initReveal() {
    var pending = [];
    function scan() {
      var list = document.querySelectorAll(SEL);
      for (var i = 0; i < list.length; i++) {
        var el = list[i];
        if (!el.classList.contains('fx-reveal') && !el.classList.contains('fx-skip')) {
          el.classList.add('fx-reveal');
          pending.push(el);
        }
      }
      while (pending.length) io.observe(pending.pop());
    }
    var io = new IntersectionObserver(function (es) {
      for (var i = 0; i < es.length; i++) {
        if (es[i].isIntersecting) {
          es[i].target.classList.add('fx-in');
          io.unobserve(es[i].target);
        }
      }
    }, { rootMargin: '0px 0px -6% 0px', threshold: .06 });

    scan();
    var t = 0;
    if (window.MutationObserver) {
      new MutationObserver(function () {
        clearTimeout(t); t = setTimeout(scan, 260);
      }).observe(document.body, { childList: true, subtree: true });
    }
    window.addEventListener('load', scan);
  }

  /* =======================================================
     4. 概念滚动条
     ======================================================= */
  function initTicker() {
    var wrap = document.getElementById('fxTicker');
    if (!wrap) return;
    var TERMS = [
      ['数据清洗', 'Data Wrangling'], ['标度与映射', 'Scales'],
      ['SVG 绘图', 'SVG Graphics'], ['色彩映射', 'Colormap'],
      ['直方图', 'Histogram'], ['箱线图', 'Boxplot'],
      ['散点图', 'Scatter Plot'], ['力导向布局', 'Force Layout'],
      ['树图与层次', 'Tree / Treemap'], ['等高线', 'Contours'],
      ['时间序列', 'Time Series'], ['数据绑定', 'Data-Join'],
      ['交互与联动', 'Interaction'], ['视觉通道', 'Visual Channels'],
      ['降维', 'Dimension Reduction'], ['图表选型', 'Chart Choice']
    ];
    var group = TERMS.map(function (t) {
      return '<span class="fxt"><b>' + t[0] + '</b><em>' + t[1] + '</em></span>';
    }).join('');

    var track = document.createElement('div');
    track.className = 'fx-track';
    var probe = document.createElement('span');
    probe.className = 'fx-grp';
    probe.innerHTML = group;
    track.appendChild(probe);
    wrap.appendChild(track);

    var w = probe.getBoundingClientRect().width || 1200;
    var k = Math.max(1, Math.ceil((window.innerWidth * 1.25) / w));
    var half = '';
    for (var i = 0; i < k; i++) half += '<span class="fx-grp">' + group + '</span>';
    track.innerHTML = '<span class="fx-half">' + half + '</span><span class="fx-half">' + half + '</span>';
  }

  /* =======================================================
     5. 顶栏滚动态 + Hero 卡片视差
     ======================================================= */
  function initScrollFx() {
    var bar = document.getElementById('topbar');
    var card = document.querySelector('.hero-viz');
    var tick = false;
    function upd() {
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      if (bar) bar.classList.toggle('scrolled', y > 12);
      if (card && !reduce && y < 900) {
        card.style.transform = 'translateY(' + (-y * .055).toFixed(2) + 'px)';
      }
      tick = false;
    }
    window.addEventListener('scroll', function () {
      if (!tick) { tick = true; requestAnimationFrame(upd); }
    }, { passive: true });
    upd();
  }

  /* =======================================================
     启动
     ======================================================= */
  function boot() {
    try { initParticles(); } catch (e) { }
    try { initCountUp(); } catch (e) { }
    try { initTicker(); } catch (e) { }
    try { initScrollFx(); } catch (e) { }
    try { initReveal(); } catch (e) { }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // 保险：入场动画结束后强制内容可见，避免任何环境下内容被动画"藏住"
  setTimeout(function () { root.classList.add('fx-ready'); }, 1600);
})();
