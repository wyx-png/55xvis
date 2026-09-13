/* ===================================================================
 * main.js —— 课程网站全局 JS 逻辑（首页 + lesson-01~06）
 * 全部用原生 JavaScript，不依赖任何打包工具
 * 布局：每个小节独立「讲解 ⇄ 关键代码 ⇄ 演示」三 Tab
 * 提供：顶部导航高亮 / 小节级 Tab 切换 / 侧边目录滚动 + 高亮
 *       + demo 懒加载（切到该小节演示 Tab 时才初始化）
 * =================================================================== */
(function () {
  'use strict';

  /* ---------- 0. 自动注入语言切换按钮（确保所有页面都有 中/EN） ---------- */
  function initLangToggle() {
    var inner = document.querySelector('.site-nav .nav-inner');
    if (!inner) return;
    if (inner.querySelector('.lang-toggle')) return; // 已存在则跳过
    var toggle = document.createElement('div');
    toggle.className = 'lang-toggle';
    toggle.id = 'lang-toggle';
    toggle.innerHTML = '<button data-lang="zh" class="active">中</button><button data-lang="en">EN</button>';
    inner.appendChild(toggle);
  }

  /* ---------- 1. 顶部导航高亮当前页 ---------- */
  function initNavActive() {
    var navItems = document.querySelectorAll('.site-nav .nav-item');
    if (!navItems.length) return;
    var path = window.location.pathname.split('/').filter(Boolean);
    var folder = path[path.length - 2] || '';
    var current = folder.indexOf('lesson-') === 0 ? folder : 'home';
    navItems.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('data-key') === current);
    });
  }

  /* ---------- 2. 小节级 Tab 切换（讲解 / 关键代码 / 演示） ---------- */
  function initSecTabs() {
    var sections = document.querySelectorAll('.lesson-section');
    sections.forEach(function (sec) {
      var tabBar = sec.querySelector('.sec-tab-bar');
      if (!tabBar) return;
      var btns = tabBar.querySelectorAll('.sec-tab-btn');
      var panels = sec.querySelectorAll('.sec-tab-panel');

      btns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var target = btn.getAttribute('data-tab');
          btns.forEach(function (b) { b.classList.remove('active'); });
          panels.forEach(function (p) { p.classList.remove('active'); });
          btn.classList.add('active');
          var panel = sec.querySelector('.sec-tab-panel[data-panel="' + target + '"]');
          if (panel) panel.classList.add('active');
          // 切到演示 Tab 时，触发该小节 demo 运行
          if (target === 'demo') {
            var secId = sec.getAttribute('id');
            if (secId) window.dispatchEvent(new CustomEvent('demo:activate', { detail: { sectionId: secId } }));
          }
        });
      });
    });
  }

  /* ---------- 3. 侧边目录：点击滚动 + 滚动高亮 ---------- */
  function initSidebar() {
    var sidebar = document.querySelector('.lesson-sidebar');
    if (!sidebar) return;
    var links = sidebar.querySelectorAll('a.side-link[data-target]');
    var sections = [];

    links.forEach(function (link) {
      var id = link.getAttribute('data-target');
      var sec = document.getElementById(id);
      if (sec) {
        sections.push({ id: id, el: sec, link: link });
        link.addEventListener('click', function (e) {
          e.preventDefault();
          // 确保该小节的讲解 Tab 处于激活状态
          var readBtn = sec.querySelector('.sec-tab-btn[data-tab="read"]');
          if (readBtn) readBtn.click();
          // 滚动到该小节
          setTimeout(function () {
            sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 30);
        });
      }
    });
    if (!sections.length) return;

    if ('IntersectionObserver' in window) {
      var visible = new Map();
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) visible.set(en.target.id, en.intersectionRatio);
          else visible.delete(en.target.id);
        });
        var topId = null, topRatio = 0;
        visible.forEach(function (r, id) {
          if (r > topRatio) { topRatio = r; topId = id; }
        });
        if (topId) {
          sections.forEach(function (s) {
            s.link.classList.toggle('active', s.id === topId);
          });
        }
      }, { rootMargin: '-90px 0px -60% 0px', threshold: [0, 0.25, 0.5, 1] });
      sections.forEach(function (s) { io.observe(s.el); });
    }
  }

  /* ---------- 4. demo 注册表（按 section id 懒加载） ---------- */
  var demoRegistry = {};
  var demoRan = {};

  window.registerDemo = function (sectionId, fn) {
    demoRegistry[sectionId] = fn;
  };

  // 语言切换时重渲染指定 demo（清空 SVG 后重跑）
  window.rerunDemo = function (sectionId) {
    if (!demoRegistry[sectionId]) return;
    var svg = document.querySelector('#' + sectionId + ' .demo-stage svg');
    if (svg) svg.innerHTML = '';
    try {
      demoRegistry[sectionId]();
    } catch (e) {
      console.error('[demo rerun]', sectionId, e);
    }
  };

  function tryRunDemo(sectionId) {
    if (demoRan[sectionId]) return;
    if (!demoRegistry[sectionId]) return;
    try {
      demoRegistry[sectionId]();
      demoRan[sectionId] = true;
    } catch (e) {
      console.error('[demo]', sectionId, e);
    }
  }

  // 监听 demo:activate 事件，运行对应小节的 demo
  window.addEventListener('demo:activate', function (e) {
    if (e && e.detail && e.detail.sectionId) {
      tryRunDemo(e.detail.sectionId);
    }
  });

  /* ---------- 5. 简易代码高亮 ---------- */
  function initCodeHighlight() {
    var kw = ['var','let','const','function','return','if','else','for','while','new','import','from','export','default','class','try','catch','of','in','typeof','await','async','true','false','null','undefined','this'];
    document.querySelectorAll('pre code[data-raw]').forEach(function (code) {
      if (code.getAttribute('data-done')) return;
      var raw = code.textContent;
      var html = raw.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

      // 用占位符避免后续正则匹配到已插入的 span 标签属性
      var tokens = [];
      function stash(replacement) {
        var idx = tokens.length;
        tokens.push(replacement);
        return '\x00' + idx + '\x00';
      }

      // 注释
      html = html.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, function (m) {
        return stash('<span class="tok-cmt">' + m + '</span>');
      });
      // 字符串
      html = html.replace(/("[^"]*"|'[^']*'|`[^`]*`)/g, function (m) {
        return stash('<span class="tok-str">' + m + '</span>');
      });
      // ⭐ 关键点标记
      html = html.replace(/(⭐)/g, function (m) {
        return stash('<span class="tok-star">' + m + '</span>');
      });
      // 数字
      html = html.replace(/\b(\d+(\.\d+)?)\b/g, function (m) {
        return stash('<span class="tok-num">' + m + '</span>');
      });
      // 关键字
      html = html.replace(new RegExp('\\b(' + kw.join('|') + ')\\b', 'g'), function (m) {
        return stash('<span class="tok-kw">' + m + '</span>');
      });
      // 函数调用
      html = html.replace(/\b([a-zA-Z_$][\w$]*)\s*\(/g, function (m, name) {
        return stash('<span class="tok-fn">' + name + '</span>(');
      });

      // 还原占位符
      html = html.replace(/\x00(\d+)\x00/g, function (_, i) {
        return tokens[+i];
      });

      code.innerHTML = html;
      code.setAttribute('data-done', '1');
    });
  }

  /* ---------- 入口 ---------- */
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function () {
    initLangToggle();
    initNavActive();
    initSecTabs();
    initSidebar();
    initCodeHighlight();
  });
})();
