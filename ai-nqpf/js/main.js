/* ============================================================
   交互逻辑：神经网络粒子 / 打字机 / 数字滚动 / 时间轴 / 行业切换
   ============================================================ */

/* ---------- 1. Hero 神经网络粒子 ---------- */
(function () {
  const canvas = document.getElementById('netCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], mouse = { x: -9999, y: -9999 };
  const N = window.innerWidth < 768 ? 45 : 90;
  const LINK = 150;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < N; i++) {
    nodes.push({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .55, vy: (Math.random() - .5) * .55,
      r: Math.random() * 2.2 + 1,
      hue: Math.random() > .5 ? '0,229,255' : '139,92,246'
    });
  }

  canvas.parentElement.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
  });
  canvas.parentElement.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  function tick() {
    ctx.clearRect(0, 0, W, H);
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
      // 鼠标引力
      const dxm = mouse.x - n.x, dym = mouse.y - n.y;
      const dm = Math.hypot(dxm, dym);
      if (dm < 160) { n.x += dxm * .004; n.y += dym * .004; }
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${n.hue},.85)`;
      ctx.shadowColor = `rgba(${n.hue},.8)`;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0,229,255,${(1 - d / LINK) * .28})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ---------- 2. 打字机副标题 ---------- */
(function () {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const lines = [
    '以数据为要素 · 以算力为底座 · 以算法为引擎',
    '让创新主导发展，让全要素生产率跃升',
    '一组可视化数据，读懂 AI 如何重塑千行百业'
  ];
  let li = 0, ci = 0, deleting = false;
  function step() {
    const text = lines[li];
    if (!deleting) {
      el.textContent = text.slice(0, ++ci);
      if (ci === text.length) { deleting = true; return setTimeout(step, 2200); }
      setTimeout(step, 90);
    } else {
      el.textContent = text.slice(0, --ci);
      if (ci === 0) { deleting = false; li = (li + 1) % lines.length; return setTimeout(step, 400); }
      setTimeout(step, 35);
    }
  }
  step();
})();

/* ---------- 3. 数字滚动 ---------- */
(function () {
  const counters = document.querySelectorAll('.count-up');
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      io.unobserve(el);
      const target = parseFloat(el.dataset.target);
      const decimal = parseInt(el.dataset.decimal || '0');
      const dur = 2000, t0 = performance.now();
      (function run(now) {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        el.textContent = (target * eased).toFixed(decimal).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        if (p < 1) requestAnimationFrame(run);
      })(t0);
    });
  }, { threshold: .4 });
  counters.forEach(c => io.observe(c));
})();

/* ---------- 4. 滚动显现动画 ---------- */
(function () {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.reveal').forEach((el, i) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
        delay: (i % 4) * .08
      });
    });
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.style.transition = 'opacity .9s ease, transform .9s ease';
          en.target.style.opacity = 1;
          en.target.style.transform = 'none';
          io.unobserve(en.target);
        }
      });
    }, { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }
})();

/* ---------- 5. 时间轴内容 ---------- */
(function () {
  const data = [
    { year: '1956', title: '达特茅斯会议', desc: '"人工智能"概念正式诞生，人类第一次尝试让机器拥有智能。' },
    { year: '1997', title: '深蓝战胜棋王', desc: 'IBM"深蓝"击败国际象棋世界冠军卡斯帕罗夫，计算智能初露锋芒。' },
    { year: '2006', title: '深度学习破晓', desc: 'Hinton 提出深度信念网络，神经网络迎来复兴，感知智能开始爆发。' },
    { year: '2012', title: 'AlexNet 时刻', desc: '深度卷积网络在 ImageNet 大赛一骑绝尘，图像识别准确率飞跃，产业界全面转向深度学习。' },
    { year: '2016', title: 'AlphaGo 落子', desc: 'AlphaGo 战胜李世石，强化学习征服围棋这一人类智慧高地，AI 成为全球焦点。' },
    { year: '2017', title: 'Transformer 问世', desc: '谷歌提出 Transformer 架构，成为此后所有大语言模型的技术基座。中国同年发布《新一代人工智能发展规划》。' },
    { year: '2022', title: 'ChatGPT 引爆', desc: 'ChatGPT 两个月用户破亿，生成式AI让"机器会创作"成为现实，认知智能实现跃迁。' },
    { year: '2023', title: '百模大战', desc: '全球大模型竞赛开启；中国提出"新质生产力"重大论断，AI被置于驱动生产力变革的核心位置。' },
    { year: '2024', title: '"人工智能+"行动', desc: '"人工智能+"首次写入《政府工作报告》；Sora 文生视频惊艳世界，AI加速向实体经济渗透。' },
    { year: '2025', title: 'DeepSeek 时刻', desc: '中国开源大模型 DeepSeek-R1 以极高性价比震动全球；国务院部署深入实施"人工智能+"行动，具身智能元年开启。' }
  ];
  const wrap = document.getElementById('tlWrap');
  if (!wrap) return;
  data.forEach((d, i) => {
    const item = document.createElement('div');
    item.className = 'tl-item ' + (i % 2 === 0 ? 'left' : 'right');
    item.innerHTML = `<span class="dot"></span>
      <div class="tl-card">
        <div class="tl-year">${d.year}</div>
        <h4>${d.title}</h4>
        <p>${d.desc}</p>
      </div>`;
    wrap.appendChild(item);
  });
  // 动画
  const items = wrap.querySelectorAll('.tl-item');
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    items.forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, x: el.classList.contains('left') ? -60 : 60 },
        {
          opacity: 1, x: 0, duration: .9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' }
        });
    });
  } else {
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) { en.target.style.opacity = 1; io.unobserve(en.target); }
    }), { threshold: .2 });
    items.forEach(el => { el.style.transition = 'opacity .8s'; io.observe(el); });
  }
})();

/* ---------- 6. 行业 Tab 切换 ---------- */
(function () {
  const IND = {
    manu: {
      title: '🏭 智能制造：从"制造"到"智造"',
      icon: '🏭',
      desc: 'AI 与工业深度融合，让机器会"思考"、产线会"决策"。从预测性维护到智能质检，从工艺优化到柔性生产，人工智能正在重塑全球第一制造业大国的生产函数。',
      chips: [
        ['1200+ 家', '全国已建成先进级智能工厂，卓越级智能工厂超230家'],
        ['占全球 51%', '中国工业机器人年装机量连续多年占全球一半以上'],
        ['3.2 万亿元', '智能制造装备产业规模，覆盖全部制造业大类']
      ]
    },
    health: {
      title: '🏥 智慧医疗：让优质医疗触手可及',
      icon: '🏥',
      desc: '从医学影像秒级阅片到 AI 辅助新药研发，从智能导诊到远程手术，人工智能正在突破优质医疗资源的时空边界，让"健康中国"更有智慧。',
      chips: [
        ['2 亿+ 个', 'AlphaFold 预测的蛋白质三维结构数量，覆盖科学界已知几乎所有蛋白质'],
        ['100+ 张', 'AI 医学影像产品获批国家三类医疗器械注册证（约数）'],
        ['研发提速', 'AI 制药将候选药物发现周期从数年缩短至数月（约数）']
      ]
    },
    agri: {
      title: '🌾 智慧农业：把论文写在田野上',
      icon: '🌾',
      desc: '植保无人机掠过麦田，遥感卫星巡田定产，AI 识别病虫害、精准灌溉施肥——千年农耕文明正被注入智能基因，端牢"中国饭碗"有了科技底气。',
      chips: [
        ['20 万+ 架', '全国植保无人机保有量，作业面积数十亿亩次（约数）'],
        ['北斗+AI', '农机自动驾驶系统规模化应用，耕种收全程智能化'],
        ['节本增效', '智慧灌溉/施肥可节水节肥20%以上（约数）']
      ]
    },
    trans: {
      title: '🚗 智慧交通：重新定义出行',
      icon: '🚗',
      desc: '从 L2 级辅助驾驶普及到 Robotaxi 驶上街头，从智慧港口无人集卡到城市大脑疏解拥堵，AI 让"人享其行、物畅其流"加速到来。',
      chips: [
        ['55.7%', '2024年上半年中国 L2 级辅助驾驶新车渗透率'],
        ['1 亿+ 公里', '全国自动驾驶公开道路测试累计里程（约数）'],
        ['全自动化码头', '中国自动化集装箱码头数量位居世界前列']
      ]
    },
    fin: {
      title: '💰 智慧金融：风控与普惠的双翼',
      icon: '💰',
      desc: '毫秒级智能风控拦截欺诈，大模型重塑投研与客服，AI 让金融服务更聪明、更安全，也让小微企业与普通农户共享普惠金融的阳光。',
      chips: [
        ['1200 亿+ 元', '国有六大行年度金融科技投入规模（约数）'],
        ['毫秒级', 'AI 风控实现交易欺诈毫秒级识别拦截'],
        ['80%+', '头部机构智能客服问题独立解决率（约数）']
      ]
    },
    energy: {
      title: '🔋 智慧能源：为"双碳"装上智能大脑',
      icon: '🔋',
      desc: 'AI 预测风光出力、优化电网调度，巡检无人机守护万里输电线路，智能化矿山让采煤不见煤——能源革命与数字革命在 AI 处交汇。',
      chips: [
        ['1900+ 处', '全国煤矿智能化采掘工作面数量（约数）'],
        ['无人机巡检', '特高压输电线路 AI 巡检覆盖率持续提升'],
        ['虚拟电厂', 'AI 聚合分散能源资源，提升电网灵活性与新能源消纳能力']
      ]
    }
  };
  const tabs = document.querySelectorAll('.ind-tab');
  const title = document.getElementById('indTitle');
  const desc = document.getElementById('indDesc');
  const chips = document.getElementById('indChips');
  const visual = document.getElementById('indVisual');
  if (!tabs.length) return;

  function render(key) {
    const d = IND[key];
    title.textContent = d.title;
    desc.textContent = d.desc;
    chips.innerHTML = d.chips.map(c => `<div class="chip"><b>${c[0]}</b><span>${c[1]}</span></div>`).join('');
    visual.innerHTML = `<span class="big-icon">${d.icon}</span>`;
  }
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    render(t.dataset.ind);
  }));
  render('manu');
})();

/* ---------- 7. 侧边栏 / 进度条 / 返回顶部 ---------- */
(function () {
  const bar = document.getElementById('progressBar');
  const fill = document.getElementById('sideProgressFill');
  const ptext = document.getElementById('sideProgressText');
  const backTop = document.getElementById('backTop');
  const sideLinks = document.querySelectorAll('.side-nav a');

  function onScroll() {
    const st = window.scrollY;
    const h = document.documentElement.scrollHeight - innerHeight;
    const pct = h > 0 ? Math.min(st / h * 100, 100) : 0;
    bar.style.width = pct + '%';
    if (fill) fill.style.width = pct + '%';
    if (ptext) ptext.textContent = '阅读进度 ' + Math.round(pct) + '%';
    backTop.classList.toggle('show', st > 600);

    // 高亮当前板块
    const secs = document.querySelectorAll('section[id]');
    let cur = '';
    secs.forEach(s => { if (st >= s.offsetTop - 220) cur = s.id; });
    sideLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();
