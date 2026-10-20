/* 课程导航条：注入到各章节页顶部，提供 返回门户 / 章节切换 / 学习进度。
   自包含、样式带 vcb- 前缀，不与页面原有样式冲突。 */
(function () {
  'use strict';
  var CHAPTERS = [
    { id: 'lesson-01', no: 1, zh: '数据', en: 'Data', color: '#2563eb' },
    { id: 'lesson-02', no: 2, zh: '数据可视化流程', en: 'Pipeline', color: '#0891b2' },
    { id: 'lesson-03', no: 3, zh: '色彩专题', en: 'Color', color: '#db2777' },
    { id: 'lesson-04', no: 4, zh: '低维数据可视化', en: 'Low-dim', color: '#7c3aed' },
    { id: 'lesson-05', no: 5, zh: '时序数据可视化', en: 'Time-series', color: '#ea580c' },
  ];
  var here = location.pathname.replace(/\/$/, '');
  var cur = here.split('/').pop();
  var done = [];
  try { done = JSON.parse(localStorage.getItem('vis_progress') || '[]'); } catch (e) { }

  var css = ''
    + '.vcb-bar{position:fixed;top:0;left:0;right:0;z-index:9999;height:46px;display:flex;align-items:center;'
    + 'gap:10px;padding:0 14px;background:rgba(255,255,255,.96);border-bottom:1px solid #e3e8ef;'
    + 'font-family:"PingFang SC","Microsoft YaHei",system-ui,sans-serif;box-shadow:0 1px 8px rgba(16,24,40,.06)}'
    + '.vcb-back{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:700;color:#1d4ed8;'
    + 'text-decoration:none;padding:5px 10px;border-radius:8px;border:1px solid #dbe4f5;background:#f4f8ff}'
    + '.vcb-back:hover{background:#e8efff;text-decoration:none}'
    + '.vcb-links{display:flex;gap:4px;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none}'
    + '.vcb-links::-webkit-scrollbar{display:none}'
    + '.vcb-link{font-size:12px;color:#475569;text-decoration:none;padding:5px 10px;border-radius:8px;'
    + 'white-space:nowrap;display:inline-flex;align-items:center;gap:5px;border:1px solid transparent}'
    + '.vcb-link:hover{background:#eef2f7;text-decoration:none}'
    + '.vcb-link.cur{color:#1d4ed8;background:#e8efff;border-color:#c7d7f5;font-weight:700}'
    + '.vcb-dot{width:7px;height:7px;border-radius:99px;display:inline-block}'
    + '.vcb-prog{margin-left:auto;font-size:11.5px;color:#7b8794;display:flex;align-items:center;gap:7px;white-space:nowrap}'
    + '.vcb-pbar{width:54px;height:5px;border-radius:99px;background:#e3e8ef;overflow:hidden}'
    + '.vcb-pbar i{display:block;height:100%;background:#16a34a}'
    + '@media(max-width:760px){.vcb-prog{display:none}}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var bar = document.createElement('div');
  bar.className = 'vcb-bar';
  var html = '<a class="vcb-back" href="../index.html">← 门户首页</a><div class="vcb-links">';
  CHAPTERS.forEach(function (c) {
    var link = here.indexOf('/' + c.id) >= 0 ? c.id + '/' : '../' + c.id + '/';
    html += '<a class="vcb-link' + (c.id === cur ? ' cur' : '') + '" href="' + link + '">'
      + '<i class="vcb-dot" style="background:' + c.color + '"></i>'
      + (done.indexOf(c.id) >= 0 ? '✓ ' : '') + '第' + c.no + '章 · ' + c.zh + '</a>';
  });
  var pct = Math.round(done.length / CHAPTERS.length * 100);
  html += '</div><div class="vcb-prog"><span>学习进度 ' + pct + '%</span>'
    + '<span class="vcb-pbar"><i style="width:' + pct + '%"></i></span></div>';
  bar.innerHTML = html;

  // 插到 body 最前，并给页面让出空间
  document.body.insertBefore(bar, document.body.firstChild);
  var pad = document.createElement('div');
  pad.style.height = '46px';
  document.body.insertBefore(pad, bar.nextSibling);
})();
