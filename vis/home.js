/* =========================================================
   《可视化导论》课程门户 · 学习地图版
   在原课程门户基础上重构：新增学习路径、知识图谱、图表速查、
   视觉通道速查、概念索引，全部图形由 D3.js v7 实时绘制。
   ========================================================= */
(function () {
  'use strict';

  /* ---------------- 语言 ---------------- */
  let lang = 'zh';
  try { lang = localStorage.getItem('vis_lang') || 'zh'; } catch (e) { }
  const T = v => (v && typeof v === 'object' ? (v[lang] || v.zh) : v);
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const CH_COLOR = ['#2563eb', '#0891b2', '#db2777', '#7c3aed', '#ea580c'];

  /* ---------------- 章节数据 ---------------- */
  const CHAPTERS = [
    {
      id: 'lesson-01', no: 1, viz: 'dikw',
      title: { zh: '数据', en: 'Data' },
      note: { zh: '对应文档：3. 数据', en: 'Doc: 3. Data' },
      desc: {
        zh: '从 DeepSeek 合成新生数据出发，展开数据生成、DIKW 金字塔、Stevens 测量尺度、Mackinlay 视觉通道、D3 数据变换与 Data-Join 三态。',
        en: 'Data generation, DIKW pyramid, Stevens scales, Mackinlay channels, D3 transforms and the Data-Join enter/update/exit model.'
      },
      keys: [
        { zh: 'DIKW 金字塔', en: 'DIKW Pyramid', d: { zh: '数据 → 信息 → 知识 → 智慧的四层递进，可视化处在「信息到知识」的环节。', en: 'Data → Information → Knowledge → Wisdom; visualization bridges information to knowledge.' } },
        { zh: 'Stevens 4 尺度', en: 'Stevens 4 Scales', d: { zh: '定类 / 定序 / 定距 / 定比，决定能做哪些运算、能配哪些视觉通道。', en: 'Nominal / Ordinal / Interval / Ratio — determines valid operations and channels.' } },
        { zh: '8 个 D3 变换函数', en: '8 D3 Array Ops', d: { zh: 'd3.group / rollup / extent / scaleLinear 等，把原始数据整理成可画的形态。', en: 'd3.group, rollup, extent, scaleLinear … reshape raw data into drawable form.' } },
        { zh: 'Selection 三态', en: 'Selection Tri-state', d: { zh: 'enter / update / exit：D3 数据绑定的核心心智模型。', en: 'enter / update / exit — the core mental model of D3 data binding.' } },
      ],
    },
    {
      id: 'lesson-02', no: 2, viz: 'flow',
      title: { zh: '数据可视化流程', en: 'Visualization Pipeline' },
      note: { zh: '对应文档：4. 数据可视化流程', en: 'Doc: 4. Pipeline' },
      desc: {
        zh: 'Card 数据流模型、新生数据 → 分类树 → 树形列表的完整链路，Reingold-Tilford 布局、DOM 事件机制。',
        en: 'Card’s data-flow model, raw data → hierarchy → tree list, Reingold-Tilford layout and DOM event delegation.'
      },
      keys: [
        { zh: 'Card 模型', en: 'Card Model', d: { zh: '原始数据 → 数据表 → 可视化结构 → 视图，四步变换加两段人机反馈。', en: 'Raw data → tables → visual structures → views, with two human feedback loops.' } },
        { zh: 'd3.rollup', en: 'd3.rollup', d: { zh: '按多个键折叠聚合，一步生成层级数据结构。', en: 'Collapse and aggregate by multiple keys into nested structures.' } },
        { zh: 'Reingold-Tilford', en: 'Reingold-Tilford', d: { zh: '整齐紧凑的树布局算法，d3.tree() 的默认实现。', en: 'Tidy tree layout algorithm — the default behind d3.tree().' } },
        { zh: '事件委托', en: 'Event Delegation', d: { zh: '把监听放在父容器上，动态增删节点也不用重新绑定。', en: 'Listen on the parent so dynamically added nodes need no re-binding.' } },
      ],
    },
    {
      id: 'lesson-03', no: 3, viz: 'color',
      title: { zh: '色彩专题', en: 'Color' },
      note: { zh: '独立专题：颜色是可视化基础', en: 'Special topic: color' },
      desc: {
        zh: '颜色模型 + colormap + Lab 色域 + 5 大色系 + 经典科研配色 + 对错案例 + 鲜艳低饱和生成器 + CVD 论文图测，8 小节一站式。',
        en: 'Color models, colormaps, Lab gamut, five palette families, scientific palettes, do/don’t cases and a CVD checker.'
      },
      keys: [
        { zh: '4 颜色空间 + CVD', en: '4 Color Spaces + CVD', d: { zh: 'RGB / HSL / HSV / Lab 的适用场景，以及 8% 男性存在的色觉缺陷。', en: 'RGB/HSL/HSV/Lab and color-vision deficiency affecting ~8% of men.' } },
        { zh: 'Wong / Paul Tol', en: 'Wong / Paul Tol', d: { zh: '两套面向科研的配色方案，天然对 CVD 友好。', en: 'Two scientific palettes designed to be CVD-safe.' } },
        { zh: '5 大色系规则', en: '5 Palette Rules', d: { zh: '分类 / 顺序 / 发散 / 循环 / 强调，选色的第一性问题。', en: 'Categorical / sequential / diverging / cyclic / accent — the first question to ask.' } },
        { zh: '鲜艳 + 低饱和', en: 'Vivid yet Muted', d: { zh: '学术配色的平衡点：辨识度高又不刺眼。', en: 'The balance of academic palettes: distinguishable but not garish.' } },
        { zh: 'CVD 论文图测', en: 'CVD Figure Test', d: { zh: '一键模拟红绿/蓝黄色盲，检查你的图是否还读得懂。', en: 'Simulate deuteranopia / tritanopia to check if your figure still reads.' } },
      ],
    },
    {
      id: 'lesson-04', no: 4, viz: 'fit',
      title: { zh: '低维数据可视化', en: 'Low-dimensional Data' },
      note: { zh: '对应文档：5. 低维数据可视化', en: 'Doc: 5. Low-dim Data' },
      desc: {
        zh: 'Crime 数据坐标变换、10 种曲线拟合、Cleveland 45° 倾角、Marching Squares 等值线，共 5 小节。',
        en: 'Coordinate transforms on crime data, ten curve fittings, Cleveland’s 45° rule and Marching Squares contours.'
      },
      keys: [
        { zh: '三层坐标变换', en: 'Three Transform Layers', d: { zh: '数据坐标 → 归一化 → 设备坐标，比例尺就是第二层。', en: 'Data → normalized → device coordinates; scales live in the middle.' } },
        { zh: '10 种曲线', en: '10 Curves', d: { zh: '线性、多项式、对数、指数、LOESS 等拟合与过拟合风险。', en: 'Linear, polynomial, log, exponential, LOESS … and overfitting risks.' } },
        { zh: 'Cleveland 45°', en: 'Cleveland 45°', d: { zh: '让趋势线的平均倾角接近 45°，人眼最容易判读斜率。', en: 'Bank trend lines to ~45° for the most accurate slope judgement.' } },
        { zh: 'Marching Squares', en: 'Marching Squares', d: { zh: '标量场等值线提取的经典算法，等值线/热力图的基础。', en: 'Classic contour extraction for scalar fields — basis of contour maps.' } },
      ],
    },
    {
      id: 'lesson-05', no: 5, viz: 'cal',
      title: { zh: '时序数据可视化', en: 'Time-series Data' },
      note: { zh: '对应文档：6. 时序数据可视化', en: 'Doc: 6. Time-series' },
      desc: {
        zh: '5 个时间属性、法国人名时间序列、van Wijk 日历热图、阿基米德螺旋日历、Storyline 故事线（《侏罗纪公园》案例）。',
        en: 'Five time properties, French name time series, van Wijk calendar heatmap, Archimedean spiral calendar and storyline charts.'
      },
      keys: [
        { zh: '时间分解', en: 'Time Decomposition', d: { zh: '时间点 / 时间点集 / 时间间隔 / 时间环 / 无序时间，5 种属性决定图形选择。', en: 'Instant / instant set / interval / cyclic / unordered — five properties drive chart choice.' } },
        { zh: '日历 colormap', en: 'Calendar Colormap', d: { zh: 'van Wijk 日历视图：把一年的周期性格律铺成方块矩阵。', en: 'van Wijk calendar view: lay a year of periodicity into a block matrix.' } },
        { zh: '极坐标变换', en: 'Polar Transform', d: { zh: '阿基米德螺旋日历：用半径编码年份、角度编码年内位置。', en: 'Archimedean spiral calendar: radius = year, angle = day of year.' } },
        { zh: 'Storygraph', en: 'Storygraph', d: { zh: '故事线：用线条的聚散表达人物关系随时间的变化。', en: 'Storylines: line convergence expresses evolving character relationships.' } },
      ],
    },
  ];

  /* ---------------- 知识图谱：节点与边 ---------------- */
  const KG_NODES = [
    { id: 'vis', name: { zh: '数据可视化', en: 'Visualization' }, ch: 0, r: 22, d: { zh: '课程总目标：把数据变成可被眼睛读懂的图形。', en: 'The course goal: turn data into graphics the eye can read.' } },
    { id: 'data', name: { zh: '数据', en: 'Data' }, ch: 1, r: 18, d: { zh: '事实的符号记录，可视化流程的起点。', en: 'Symbolic records of facts; the starting point.' } },
    { id: 'dikw', name: { zh: 'DIKW 金字塔', en: 'DIKW Pyramid' }, ch: 1, r: 16, d: { zh: '数据→信息→知识→智慧；可视化主要作用在信息到知识之间。', en: 'Data→Information→Knowledge→Wisdom; visualization acts between information and knowledge.' } },
    { id: 'stevens', name: { zh: 'Stevens 尺度', en: 'Stevens Scales' }, ch: 1, r: 16, d: { zh: '定类/定序/定距/定比，决定能做什么运算。', en: 'Nominal/ordinal/interval/ratio — decides valid operations.' } },
    { id: 'channel', name: { zh: '视觉通道', en: 'Visual Channels' }, ch: 1, r: 18, d: { zh: '位置/长度/角度/面积/色相等编码手段，精度各不相同。', en: 'Position, length, angle, area, hue … with different accuracy.' } },
    { id: 'mackinlay', name: { zh: 'Mackinlay 排序', en: 'Mackinlay Ranking' }, ch: 1, r: 14, d: { zh: '1986 年给出的通道有效性排序：位置最准，面积/色相最弱。', en: 'The 1986 ranking of channel effectiveness: position best, area/hue weakest.' } },
    { id: 'transform', name: { zh: 'D3 数据变换', en: 'D3 Transforms' }, ch: 1, r: 16, d: { zh: 'group/rollup/extent/bin 等把原始数据整理成可画形态。', en: 'group/rollup/extent/bin reshape raw data for drawing.' } },
    { id: 'join', name: { zh: 'Data-Join', en: 'Data-Join' }, ch: 1, r: 16, d: { zh: 'enter / update / exit 三态，D3 的心智核心。', en: 'enter/update/exit — the heart of D3.' } },
    { id: 'card', name: { zh: 'Card 数据流', en: 'Card Data Flow' }, ch: 2, r: 18, d: { zh: '原始数据→数据表→可视化结构→视图，含人机反馈回路。', en: 'Raw data→tables→visual structures→views, with feedback loops.' } },
    { id: 'rollup', name: { zh: 'd3.rollup', en: 'd3.rollup' }, ch: 2, r: 14, d: { zh: '多键折叠聚合，一步生成嵌套结构。', en: 'Multi-key aggregation into nested structures.' } },
    { id: 'hierarchy', name: { zh: '分类树', en: 'Hierarchy' }, ch: 2, r: 15, d: { zh: 'd3.hierarchy：把扁平数据变成父子层级。', en: 'd3.hierarchy turns flat rows into parent-child trees.' } },
    { id: 'tree', name: { zh: 'Reingold-Tilford', en: 'Reingold-Tilford' }, ch: 2, r: 15, d: { zh: '紧凑整齐的树布局，d3.tree() 的默认算法。', en: 'Tidy tree layout, default of d3.tree().' } },
    { id: 'event', name: { zh: '事件委托', en: 'Event Delegation' }, ch: 2, r: 13, d: { zh: '监听挂在父容器，动态节点无需重复绑定。', en: 'Bind once on the parent; dynamic nodes need nothing.' } },
    { id: 'color', name: { zh: '颜色', en: 'Color' }, ch: 3, r: 18, d: { zh: '最强的分类通道，也最容易滥用；要考虑 CVD。', en: 'Strongest categorical channel, easiest to abuse; mind CVD.' } },
    { id: 'space', name: { zh: '颜色空间', en: 'Color Spaces' }, ch: 3, r: 14, d: { zh: 'RGB/HSL/HSV/Lab：Lab 更接近人眼感知均匀。', en: 'RGB/HSL/HSV/Lab; Lab approximates perceptual uniformity.' } },
    { id: 'colormap', name: { zh: 'colormap', en: 'Colormap' }, ch: 3, r: 15, d: { zh: '顺序 / 发散 / 循环色表，用于连续数值编码。', en: 'Sequential/diverging/cyclic maps for continuous values.' } },
    { id: 'cvd', name: { zh: 'CVD 色觉缺陷', en: 'CVD' }, ch: 3, r: 13, d: { zh: '约 8% 男性存在红绿色觉缺陷，配色必须验证。', en: '~8% of men have red-green CVD; always verify palettes.' } },
    { id: 'palette', name: { zh: 'Wong / Tol 配色', en: 'Wong / Tol' }, ch: 3, r: 14, d: { zh: '科研常用、对 CVD 友好的分类配色。', en: 'Scientific, CVD-friendly categorical palettes.' } },
    { id: 'coord', name: { zh: '坐标变换', en: 'Coordinate Transform' }, ch: 4, r: 16, d: { zh: '数据→归一化→设备坐标三层，比例尺居中。', en: 'Data→normalized→device; scales in the middle.' } },
    { id: 'scale', name: { zh: '比例尺 scale', en: 'Scales' }, ch: 4, r: 14, d: { zh: 'd3.scaleLinear / scaleTime / scaleBand：值与像素的映射。', en: 'd3.scaleLinear/scaleTime/scaleBand — value to pixel mapping.' } },
    { id: 'curve', name: { zh: '曲线拟合', en: 'Curve Fitting' }, ch: 4, r: 15, d: { zh: '10 种拟合方式，注意过拟合与外推风险。', en: 'Ten fits; beware overfitting and extrapolation.' } },
    { id: 'cleveland', name: { zh: 'Cleveland 45°', en: 'Cleveland 45°' }, ch: 4, r: 13, d: { zh: '把趋势线平均倾角调到 45°，斜率判读最准。', en: 'Bank trends to 45° for accurate slope reading.' } },
    { id: 'contour', name: { zh: 'Marching Squares', en: 'Marching Squares' }, ch: 4, r: 14, d: { zh: '标量场等值线提取，等值线图/热力图的基础。', en: 'Contour extraction for scalar fields.' } },
    { id: 'time', name: { zh: '时序数据', en: 'Time Series' }, ch: 5, r: 18, d: { zh: '带时间属性的数据，5 种时间属性决定图形选择。', en: 'Data with time; five time properties drive chart choice.' } },
    { id: 'tprop', name: { zh: '5 个时间属性', en: '5 Time Properties' }, ch: 5, r: 14, d: { zh: '时间点/点集/间隔/时间环/无序时间。', en: 'Instant / instant set / interval / cyclic / unordered.' } },
    { id: 'calendar', name: { zh: '日历热图', en: 'Calendar Heatmap' }, ch: 5, r: 15, d: { zh: 'van Wijk 日历视图，看周期性格律。', en: 'van Wijk calendar view for periodic patterns.' } },
    { id: 'polar', name: { zh: '极坐标变换', en: 'Polar Transform' }, ch: 5, r: 14, d: { zh: '螺旋日历：半径=年，角度=年内位置。', en: 'Spiral calendar: radius = year, angle = day.' } },
    { id: 'story', name: { zh: 'Storyline 故事线', en: 'Storyline' }, ch: 5, r: 14, d: { zh: '用线条聚散表达人物关系随时间的变化。', en: 'Line convergence shows evolving relationships.' } },
  ];
  const KG_LINKS = [
    ['vis', 'data'], ['vis', 'card'], ['vis', 'channel'], ['vis', 'color'], ['vis', 'coord'], ['vis', 'time'],
    ['data', 'dikw'], ['data', 'stevens'], ['data', 'transform'],
    ['stevens', 'channel'], ['channel', 'mackinlay'], ['channel', 'color'],
    ['transform', 'join'], ['transform', 'rollup'],
    ['card', 'hierarchy'], ['card', 'coord'],
    ['rollup', 'hierarchy'], ['hierarchy', 'tree'], ['tree', 'event'],
    ['color', 'space'], ['color', 'colormap'], ['color', 'cvd'], ['color', 'palette'],
    ['colormap', 'calendar'], ['colormap', 'contour'],
    ['coord', 'scale'], ['scale', 'curve'], ['curve', 'cleveland'], ['coord', 'contour'],
    ['time', 'tprop'], ['time', 'calendar'], ['coord', 'polar'], ['polar', 'calendar'], ['time', 'story'],
  ];

  /* ---------------- 图表速查 ---------------- */
  const SAMPLE = [
    { label: { zh: '华东', en: 'East' }, v: 128 }, { label: { zh: '华北', en: 'North' }, v: 96 },
    { label: { zh: '华南', en: 'South' }, v: 112 }, { label: { zh: '华中', en: 'Central' }, v: 78 },
    { label: { zh: '西南', en: 'SW' }, v: 64 }, { label: { zh: '西北', en: 'NW' }, v: 52 },
  ];
  const TS = d3.range(24).map(i => ({ i, v: 40 + 26 * Math.sin(i / 3.2) + (i % 5) * 2.4 + (i > 14 ? 12 : 0) }));
  const XY = d3.range(46).map(i => ({ x: 8 + Math.random() * 84, y: 18 + 0.62 * i + (Math.random() - .5) * 22 }));

  const GALLERY = [
    {
      cat: { zh: '比较', en: 'Comparison' }, items: [
        {
          name: { zh: '柱状图', en: 'Bar' }, tag: { zh: '分类大小', en: 'Magnitude' }, kind: 'bar',
          note: { zh: '最稳妥的比较方式：共用一个基线，长度判读精度仅次于位置。类别多时改横向条形图。', en: 'Safest comparison: shared baseline, length accuracy second only to position. Switch to horizontal bars with many categories.' }
        },
        {
          name: { zh: '分组 / 堆叠柱状图', en: 'Grouped / Stacked Bar' }, tag: { zh: '二维比较', en: 'Two factors' }, kind: 'stack',
          note: { zh: '分组比总量、堆叠比构成；堆叠只建议底层对齐的那一层做精确比较。', en: 'Grouped compares magnitude, stacked compares composition; only the baseline-aligned layer is precisely comparable.' }
        },
        {
          name: { zh: '雷达图', en: 'Radar' }, tag: { zh: '多维画像', en: 'Multi-dim' }, kind: 'radar',
          note: { zh: '适合展示多维度「画像」，但面积不代表数值，维度超过 8 个会难以辨读。', en: 'Good for multi-dimensional profiles, but area is misleading and >8 axes becomes unreadable.' }
        },
      ]
    },
    {
      cat: { zh: '分布', en: 'Distribution' }, items: [
        {
          name: { zh: '直方图', en: 'Histogram' }, tag: { zh: '频数分布', en: 'Frequency' }, kind: 'hist',
          note: { zh: '看分布形状与众数；分箱数影响结论，建议多试几个 bin 再下判断。', en: 'Shows shape and mode; bin count changes conclusions — try several.' }
        },
        {
          name: { zh: '箱线图', en: 'Box Plot' }, tag: { zh: '五数概括', en: 'Five-number' }, kind: 'box',
          note: { zh: '中位数、四分位与离群点，比较多个组的分布最有效。', en: 'Median, quartiles and outliers — best for comparing groups.' }
        },
        {
          name: { zh: '散点图', en: 'Scatter' }, tag: { zh: '两变量关系', en: 'Two variables' }, kind: 'scatter',
          note: { zh: '看相关与离群；点过多时用透明度或六边形分箱缓解重叠。', en: 'Shows correlation and outliers; use opacity or hexbin when overplotting.' }
        },
      ]
    },
    {
      cat: { zh: '构成', en: 'Composition' }, items: [
        {
          name: { zh: '饼图 / 环形图', en: 'Pie / Donut' }, tag: { zh: '占比', en: 'Share' }, kind: 'pie',
          note: { zh: '只适合 2–5 个类别、且关注「谁最大」的场景；角度判读精度低，类别多请改用柱状图。', en: 'Only for 2–5 slices when asking “who is biggest”; angle reading is weak — use bars instead.' }
        },
        {
          name: { zh: '堆叠面积图', en: 'Stacked Area' }, tag: { zh: '构成随时间', en: 'Composition over time' }, kind: 'area',
          note: { zh: '看总量与各部分随时间的变化；层数不宜超过 5 层。', en: 'Total and parts over time; keep to ≤5 layers.' }
        },
        {
          name: { zh: '树图 treemap', en: 'Treemap' }, tag: { zh: '层级占比', en: 'Hierarchy' }, kind: 'treemap',
          note: { zh: '用面积表达层级占比，适合「大块是谁」的阅读，不适合精确比较。', en: 'Area encodes hierarchical share; good for “who is big”, not precise comparison.' }
        },
      ]
    },
    {
      cat: { zh: '关系', en: 'Relationship' }, items: [
        {
          name: { zh: '气泡图', en: 'Bubble' }, tag: { zh: '三维编码', en: 'Three vars' }, kind: 'bubble',
          note: { zh: 'x、y 加面积第三维；注意人眼对面积差异不敏感，通常用半径更稳妥。', en: 'x, y plus area; humans judge area poorly — radius is often safer.' }
        },
        {
          name: { zh: '热力图', en: 'Heatmap' }, tag: { zh: '矩阵密度', en: 'Matrix' }, kind: 'heat',
          note: { zh: '用颜色表达矩阵数值，适合相关矩阵、日历视图；务必配颜色图例。', en: 'Colour encodes matrix values — correlation matrices, calendars; always add a legend.' }
        },
        {
          name: { zh: '和弦 / 桑基图', en: 'Chord / Sankey' }, tag: { zh: '流量关系', en: 'Flow' }, kind: 'sankey',
          note: { zh: '表达流量与迁移关系；线的宽度是关键，节点过多会变成「毛线团」。', en: 'Flows and transfers; width is key, too many nodes becomes hairball.' }
        },
      ]
    },
    {
      cat: { zh: '时间 / 趋势', en: 'Time / Trend' }, items: [
        {
          name: { zh: '折线图', en: 'Line' }, tag: { zh: '趋势', en: 'Trend' }, kind: 'line',
          note: { zh: '时间序列的默认选择；斜率判读建议按 Cleveland 45° 原则调整纵横比。', en: 'Default for time series; bank slopes to ~45° per Cleveland.' }
        },
        {
          name: { zh: '日历热图', en: 'Calendar Heatmap' }, tag: { zh: '周期性', en: 'Seasonality' }, kind: 'cal',
          note: { zh: 'van Wijk 日历视图：把一年铺成方块，星期与月份周期一眼可见。', en: 'van Wijk calendar view: a year of blocks reveals weekly and monthly cycles.' }
        },
        {
          name: { zh: '螺旋日历', en: 'Spiral Calendar' }, tag: { zh: '长周期', en: 'Long period' }, kind: 'spiral',
          note: { zh: '阿基米德螺旋：半径编码年份、角度编码年内位置，适合多年周期对比。', en: 'Archimedean spiral: radius = year, angle = day — great for multi-year cycles.' }
        },
      ]
    },
    {
      cat: { zh: '分布形状 / 其他', en: 'Shape / Others' }, items: [
        {
          name: { zh: '等值线 / 等高线', en: 'Contour' }, tag: { zh: '标量场', en: 'Scalar field' }, kind: 'contour',
          note: { zh: 'Marching Squares 提取等值线，适合地形、密度场等二维标量数据。', en: 'Marching Squares contours for terrain, density and other 2D scalar fields.' }
        },
        {
          name: { zh: '故事线 Storyline', en: 'Storyline' }, tag: { zh: '关系演化', en: 'Evolving ties' }, kind: 'story',
          note: { zh: '线条聚散表达人物关系随时间的变化（《侏罗纪公园》案例）。', en: 'Line convergence shows evolving relationships (Jurassic Park case).' }
        },
        {
          name: { zh: '斜率图 Slope', en: 'Slope Graph' }, tag: { zh: '前后对比', en: 'Before/after' }, kind: 'slope',
          note: { zh: '两个时间点之间的变化幅度，比两组柱状图更省空间、更聚焦变化。', en: 'Change between two time points — more compact and focused than paired bars.' }
        },
      ]
    },
  ];

  /* ---------------- 视觉通道 ---------------- */
  const CHANNELS = [
    { name: { zh: '位置', en: 'Position' }, rank: 1, acc: 0.98, kind: 'pos' },
    { name: { zh: '长度', en: 'Length' }, rank: 2, acc: 0.9, kind: 'len' },
    { name: { zh: '角度', en: 'Angle' }, rank: 3, acc: 0.78, kind: 'ang' },
    { name: { zh: '斜率', en: 'Slope' }, rank: 4, acc: 0.72, kind: 'slope' },
    { name: { zh: '面积', en: 'Area' }, rank: 5, acc: 0.6, kind: 'area' },
    { name: { zh: '明度', en: 'Lightness' }, rank: 6, acc: 0.5, kind: 'light' },
    { name: { zh: '色相', en: 'Hue' }, rank: 7, acc: 0.42, kind: 'hue' },
    { name: { zh: '体积/密度', en: 'Volume' }, rank: 8, acc: 0.3, kind: 'vol' },
  ];
  const STEVENS = [
    {
      name: { zh: '定类 Nominal', en: 'Nominal' }, color: '#db2777',
      desc: { zh: '只区分「是不是同一类」，不能比较大小、不能排序。', en: 'Identity only; no order, no magnitude.' },
      ok: { zh: '色相、形状、空间位置分组', en: 'Hue, shape, spatial grouping' },
      no: { zh: '长度、面积、明度（暗示了顺序）', en: 'Length, area, lightness (imply order)' },
      eg: { zh: '性别、民族、籍贯、品类', en: 'Gender, ethnicity, category' },
    },
    {
      name: { zh: '定序 Ordinal', en: 'Ordinal' }, color: '#7c3aed',
      desc: { zh: '有顺序，但相邻等级之间的「差距」不一定相等。', en: 'Ordered, but gaps between ranks are not equal.' },
      ok: { zh: '位置、明度序列、有序色阶', en: 'Position, lightness ramp, sequential colour' },
      no: { zh: '面积/长度做精确差值比较', en: 'Area/length for precise differences' },
      eg: { zh: '学历、满意度等级、年级', en: 'Education level, satisfaction' },
    },
    {
      name: { zh: '定距 Interval', en: 'Interval' }, color: '#0891b2',
      desc: { zh: '差值有意义，但零点不绝对（0 不代表「没有」）。', en: 'Differences meaningful; zero is arbitrary.' },
      ok: { zh: '位置、长度、斜率', en: 'Position, length, slope' },
      no: { zh: '面积/半径（暗示比例关系）', en: 'Area/radius (implies ratios)' },
      eg: { zh: '温度（℃）、日期、年份', en: 'Temperature (°C), dates' },
    },
    {
      name: { zh: '定比 Ratio', en: 'Ratio' }, color: '#2563eb',
      desc: { zh: '有绝对零点，可以比较倍数关系（A 是 B 的两倍）。', en: 'True zero; ratios are meaningful.' },
      ok: { zh: '位置、长度、面积、角度均可', en: 'Position, length, area, angle' },
      no: { zh: '用色相编码数值（无法读出倍数）', en: 'Hue for quantities (ratios unreadable)' },
      eg: { zh: '年龄、身高、销售额、计数', en: 'Age, height, revenue, counts' },
    },
  ];

  /* ---------------- 概念索引（从各章关键点自动汇总） ---------------- */
  const GLOSSARY = (function () {
    const out = [];
    CHAPTERS.forEach(c => c.keys.forEach(k => out.push({ name: k.name || { zh: k.zh, en: k.en }, en: k.en, desc: k.d, ch: c.no, color: CH_COLOR[c.no - 1] })));
    out.forEach(o => { if (!o.name) o.name = { zh: o.zh, en: o.en }; });
    // 追加图谱中的通用概念
    KG_NODES.filter(n => n.ch > 0 && !out.some(o => (o.name.zh === n.name.zh))).forEach(n => {
      out.push({ name: n.name, en: n.name.en, desc: n.d, ch: n.ch, color: CH_COLOR[n.ch - 1] });
    });
    return out;
  })();

  /* ---------------- 进度存储 ---------------- */
  const KEY = 'vis_progress';
  let doneSet = new Set();
  try { doneSet = new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch (e) { }
  function saveDone() { try { localStorage.setItem(KEY, JSON.stringify(Array.from(doneSet))); } catch (e) { } }
  function progress() { return Math.round(doneSet.size / CHAPTERS.length * 100); }
  function renderProgress() {
    const p = progress();
    const f = $('#pmFill'); if (f) f.style.width = p + '%';
    const t = $('#pmText'); if (t) t.textContent = p + '%';
    $$('.ch-done').forEach(b => b.classList.toggle('on', doneSet.has(b.dataset.ch)));
    drawPath();
  }

  /* =========================================================
     Hero 知识结构小图
     ========================================================= */
  function drawHero() {
    const svg = d3.select('#heroGraph'); svg.selectAll('*').remove();
    const W = 560, H = 420;
    const cx = W / 2, cy = H / 2 + 6;
    const hubR = 48;
    const g = svg.append('g');

    // 深海主题配色（比浅色版更亮）
    const NEON = ['#60a5fa', '#2dd4bf', '#f472b6', '#a78bfa', '#fb923c'];

    // defs：枢纽渐变 / 辉光滤镜
    const defs = svg.append('defs');
    const grad = defs.append('radialGradient').attr('id', 'fxhHub');
    grad.append('stop').attr('offset', '0%').attr('stop-color', '#67e8f9');
    grad.append('stop').attr('offset', '45%').attr('stop-color', '#0ea5e9');
    grad.append('stop').attr('offset', '100%').attr('stop-color', '#1e3a8a');
    const flt = defs.append('filter').attr('id', 'fxhGlow')
      .attr('x', '-120%').attr('y', '-120%').attr('width', '340%').attr('height', '340%');
    flt.append('feGaussianBlur').attr('stdDeviation', 3.2).attr('result', 'b');
    const mg = flt.append('feMerge');
    mg.append('feMergeNode').attr('in', 'b');
    mg.append('feMergeNode').attr('in', 'SourceGraphic');

    // 五章节点：手工错落布局（打破均匀五边形的呆板感）+ 轻微倾斜
    const LAYOUT = [
      { a: -90, rx: 4,   ry: 154, tilt: 0    },
      { a: -16, rx: 196, ry: 94,  tilt: 2.4  },
      { a: 58,  rx: 188, ry: 150, tilt: -1.8 },
      { a: 122, rx: 212, ry: 116, tilt: 1.6  },
      { a: 188, rx: 190, ry: 88,  tilt: -2.4 },
    ];
    const nodes = CHAPTERS.map((c, i) => ({
      id: c.id, no: c.no, color: NEON[i],
      label: lang === 'zh' ? '第' + c.no + '章' : 'Chapter ' + c.no,
      title: T(c.title), L: LAYOUT[i],
    }));
    nodes.forEach(n => {
      const rad = n.L.a * Math.PI / 180;
      n.x = cx + Math.cos(rad) * n.L.rx;
      n.y = cy + Math.sin(rad) * n.L.ry;
    });

    // 双层虚线轨道（有透视感的椭圆）
    g.append('ellipse').attr('cx', cx).attr('cy', cy).attr('rx', 214).attr('ry', 156)
      .attr('fill', 'none').attr('stroke', 'rgba(125,211,252,.30)').attr('stroke-width', 1)
      .attr('stroke-dasharray', '2 7');
    g.append('ellipse').attr('cx', cx).attr('cy', cy).attr('rx', 120).attr('ry', 86)
      .attr('fill', 'none').attr('stroke', 'rgba(125,211,252,.18)').attr('stroke-width', 1)
      .attr('stroke-dasharray', '1 6');

    // 弧形发光连线 + 沿线流动的数据光点（光晕 + 亮核）
    nodes.forEach((n, i) => {
      const k = .13 + (i % 3) * .045;
      const mx = (cx + n.x) / 2 + (n.y - cy) * k;
      const my = (cy + n.y) / 2 - (n.x - cx) * k;
      const d = 'M' + cx + ',' + cy + ' Q' + mx + ',' + my + ' ' + n.x + ',' + n.y;
      g.append('path').attr('d', d).attr('fill', 'none')
        .attr('stroke', n.color).attr('stroke-opacity', .6)
        .attr('stroke-width', 1.8).attr('stroke-dasharray', '5 6');
      [0, 1].forEach(j => {
        const dot = g.append('circle')
          .attr('r', j === 0 ? 6.5 : 2.8)
          .attr('fill', n.color)
          .attr('fill-opacity', j === 0 ? .3 : 1)
          .attr('filter', j === 0 ? null : 'url(#fxhGlow)');
        dot.append('animateMotion')
          .attr('dur', (2.6 + i * .38) + 's').attr('repeatCount', 'indefinite')
          .attr('begin', (-(i * .7 + j * .12)) + 's')
          .attr('path', d);
      });
    });

    // 中心枢纽（青蓝渐变球 + 双层呼吸光环 + 外环）
    const hub = g.append('g');
    hub.append('circle').attr('cx', cx).attr('cy', cy).attr('r', hubR + 22)
      .attr('fill', 'none').attr('stroke', 'rgba(103,232,249,.55)').attr('stroke-width', 1.2)
      .attr('class', 'fxh-halo');
    hub.append('circle').attr('cx', cx).attr('cy', cy).attr('r', hubR + 34)
      .attr('fill', 'none').attr('stroke', 'rgba(56,189,248,.4)').attr('stroke-width', 1)
      .attr('class', 'fxh-halo fxh-halo2');
    hub.append('circle').attr('cx', cx).attr('cy', cy).attr('r', hubR).attr('fill', 'url(#fxhHub)')
      .attr('filter', 'url(#fxhGlow)');
    hub.append('circle').attr('cx', cx).attr('cy', cy).attr('r', hubR).attr('fill', 'none')
      .attr('stroke', 'rgba(224,242,254,.65)').attr('stroke-width', 1.2);
    hub.append('text').attr('x', cx).attr('y', cy - 1).attr('text-anchor', 'middle')
      .attr('font-size', 17).attr('font-weight', 800).attr('fill', '#fff')
      .text(lang === 'zh' ? '可视化' : 'VIS');
    hub.append('text').attr('x', cx).attr('y', cy + 17).attr('text-anchor', 'middle')
      .attr('font-size', 10).attr('fill', 'rgba(224,242,254,.9)')
      .text(lang === 'zh' ? '数据 → 图形' : 'data → chart');

    // 章节卡片：深色玻璃 + 发光描边
    const PW = 162, PH = 58;
    const ng = g.selectAll('g.fxh-node').data(nodes).join('g')
      .attr('class', 'fxh-node')
      .attr('transform', d =>
        'translate(' + (d.x - PW / 2) + ',' + (d.y - PH / 2) + ') rotate(' + d.L.tilt + ',' + d.x + ',' + d.y + ')')
      .style('cursor', 'pointer')
      .on('click', (e, d) => { location.href = d.id + '/'; })
      .on('mouseenter', function () { d3.select(this).raise(); });
    const inner = ng.append('g').attr('class', 'fxh-inner');
    ng.each(function (d, i) { d3.select(this).select('.fxh-inner').style('animation-delay', (i * .55) + 's'); });
    inner.append('rect').attr('width', PW).attr('height', PH).attr('rx', 15)
      .attr('fill', 'rgba(7,18,40,.82)').attr('stroke', d => d.color).attr('stroke-width', 1.6)
      .attr('stroke-opacity', .9);
    inner.append('rect').attr('width', PW).attr('height', PH).attr('rx', 15)
      .attr('fill', d => d.color).attr('fill-opacity', .10);
    inner.append('circle').attr('cx', 28).attr('cy', PH / 2).attr('r', 15)
      .attr('fill', d => d.color).attr('filter', 'url(#fxhGlow)');
    inner.append('text').attr('x', 28).attr('y', PH / 2 + 4.5).attr('text-anchor', 'middle')
      .attr('font-size', 13).attr('font-weight', 800).attr('fill', '#04101f').text(d => d.no);
    const isZh = lang === 'zh';
    inner.append('text').attr('x', 52).attr('y', isZh ? 25 : 24)
      .attr('font-size', isZh ? 12.5 : 10.5).attr('font-weight', 700).attr('fill', '#eaf3ff')
      .text(d => d.title);
    inner.append('text').attr('x', 52).attr('y', isZh ? 43 : 42)
      .attr('font-size', 10).attr('font-weight', 600).attr('fill', d => d.color)
      .text(d => d.label);
  }

  /* =========================================================
     学习路径图
     ========================================================= */
  function drawPath() {
    const svg = d3.select('#pathViz'); svg.selectAll('*').remove();
    const W = 1120, H = 280, y = 150;
    const step = W / CHAPTERS.length;
    const xs = CHAPTERS.map((_, i) => step * (i + .5));
    const g = svg.append('g');
    // 主轨道
    g.append('line').attr('x1', xs[0]).attr('y1', y).attr('x2', xs[xs.length - 1]).attr('y2', y)
      .attr('stroke', '#e3e8ef').attr('stroke-width', 8).attr('stroke-linecap', 'round');
    const doneCount = CHAPTERS.filter(c => doneSet.has(c.id)).length;
    g.append('line').attr('x1', xs[0]).attr('y1', y).attr('x2', xs[Math.max(0, doneCount - 1)] || xs[0]).attr('y2', y)
      .attr('stroke', '#16a34a').attr('stroke-width', 8).attr('stroke-linecap', 'round').attr('opacity', doneCount ? .9 : 0);
    // 箭头
    CHAPTERS.forEach((c, i) => {
      if (i === CHAPTERS.length - 1) return;
      g.append('path').attr('d', 'M' + (xs[i] + 60) + ',' + y + ' l8,-5 l0,10 z')
        .attr('fill', '#cbd5e1').attr('opacity', .9);
    });
    const nodes = g.selectAll('g.pn').data(CHAPTERS).join('g').attr('class', 'pn')
      .attr('transform', (d, i) => 'translate(' + xs[i] + ',' + y + ')').style('cursor', 'pointer');
    nodes.append('circle').attr('r', 30)
      .attr('fill', d => doneSet.has(d.id) ? '#dcfce7' : '#fff')
      .attr('stroke', d => doneSet.has(d.id) ? '#16a34a' : CH_COLOR[d.no - 1])
      .attr('stroke-width', 2.5);
    nodes.append('text').attr('text-anchor', 'middle').attr('y', -2).attr('font-size', 15).attr('font-weight', 800)
      .attr('fill', d => doneSet.has(d.id) ? '#15803d' : CH_COLOR[d.no - 1]).text(d => d.no);
    nodes.append('text').attr('text-anchor', 'middle').attr('y', 16).attr('font-size', 9.5).attr('fill', '#7b8794')
      .text(d => doneSet.has(d.id) ? (lang === 'zh' ? '已完成' : 'done') : (lang === 'zh' ? '未开始' : 'todo'));
    nodes.append('text').attr('text-anchor', 'middle').attr('y', -48).attr('font-size', 13.5).attr('font-weight', 700).attr('fill', '#16233b')
      .text(d => (lang === 'zh' ? '第' + d.no + '章 · ' : 'Ch' + d.no + ' · ') + T(d.title));
    nodes.append('text').attr('text-anchor', 'middle').attr('y', 52).attr('font-size', 11).attr('fill', '#475569')
      .text(d => d.keys.length + (lang === 'zh' ? ' 个关键点' : ' key points'));
    nodes.append('text').attr('text-anchor', 'middle').attr('y', 70).attr('font-size', 10.5).attr('fill', '#1d4ed8')
      .text(lang === 'zh' ? '进入章节 →' : 'Open →').style('text-decoration', 'underline');
    // 「完成」打卡按钮：点一下标记完成（再点取消），与右上角进度联动
    const isZhP = lang === 'zh';
    const btn = nodes.append('g').attr('class', 'done-btn')
      .attr('transform', 'translate(0,96)')
      .style('cursor', 'pointer')
      .on('click', function (e, d) {
        e.stopPropagation();
        if (doneSet.has(d.id)) doneSet.delete(d.id); else doneSet.add(d.id);
        saveDone();
        renderProgress();
      });
    btn.append('rect')
      .attr('x', -46).attr('y', -11).attr('width', 92).attr('height', 22).attr('rx', 11)
      .attr('fill', d => doneSet.has(d.id) ? '#16a34a' : '#fff')
      .attr('stroke', d => doneSet.has(d.id) ? '#16a34a' : '#94a3b8')
      .attr('stroke-width', 1.4);
    btn.append('text').attr('text-anchor', 'middle').attr('y', 4)
      .attr('font-size', 10.5).attr('font-weight', 700)
      .attr('fill', d => doneSet.has(d.id) ? '#fff' : '#64748b')
      .text(d => doneSet.has(d.id) ? (isZhP ? '已完成 ✓' : 'Done ✓') : (isZhP ? '标记完成' : 'Mark done'));
    btn.append('title').text(isZhP ? '学完本章点这里打卡；再次点击可取消' : 'Click to toggle completion');
    nodes.on('click', (e, d) => { location.href = d.id + '/'; });
  }

  /* =========================================================
     知识图谱（力导向）
     ========================================================= */
  let kgSim = null, kgFilter = new Set([1, 2, 3, 4, 5]);
  function drawKG() {
    const svg = d3.select('#kgViz');
    const W = 760, H = 560;
    svg.selectAll('*').remove();
    svg.attr('viewBox', '0 0 ' + W + ' ' + H);
    const nodes = KG_NODES.filter(n => n.ch === 0 || kgFilter.has(n.ch)).map(n => Object.assign({}, n));
    const ids = new Set(nodes.map(n => n.id));
    const links = KG_LINKS.filter(l => ids.has(l[0]) && ids.has(l[1])).map(l => ({ source: l[0], target: l[1] }));

    const root = svg.append('g');
    const linkG = root.append('g').attr('stroke', '#c3cede').attr('stroke-opacity', .8);
    const nodeG = root.append('g');

    svg.call(d3.zoom().scaleExtent([0.5, 2.5])
      .filter(e => !e.target.closest('.kg-node'))
      .on('zoom', ev => root.attr('transform', ev.transform)));

    const link = linkG.selectAll('line').data(links).join('line')
      .attr('stroke-width', 1.4).attr('stroke', '#c3cede');

    const color = n => n.ch === 0 ? '#0f172a' : CH_COLOR[n.ch - 1];
    const node = nodeG.selectAll('g.kg-node').data(nodes).join('g')
      .attr('class', 'kg-node').style('cursor', 'pointer')
      .call(d3.drag()
        .on('start', (e, d) => { if (!e.active) kgSim.alphaTarget(.25).restart(); d.fx = d.x; d.fy = d.y; })
        .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; })
        .on('end', (e, d) => { if (!e.active) kgSim.alphaTarget(0); d.fx = null; d.fy = null; }));

    node.append('circle').attr('r', d => d.r)
      .attr('fill', d => d.ch === 0 ? '#0f172a' : '#fff')
      .attr('stroke', color).attr('stroke-width', d => d.ch === 0 ? 0 : 2.4);
    node.append('text').attr('text-anchor', 'middle').attr('y', d => d.r + 14)
      .attr('font-size', 10.8).attr('fill', '#16233b').attr('pointer-events', 'none')
      .text(d => T(d.name));
    node.filter(d => d.ch === 0).append('text').attr('text-anchor', 'middle').attr('y', 4)
      .attr('font-size', 10).attr('fill', '#fff').attr('font-weight', 700).text(lang === 'zh' ? '目标' : 'GOAL');

    node.on('mouseenter', function (e, d) {
      d3.select(this).select('circle').attr('stroke-width', 4);
      showInfo(d);
      link.attr('stroke-opacity', l => (l.source.id === d.id || l.target.id === d.id) ? 1 : .18)
        .attr('stroke', l => (l.source.id === d.id || l.target.id === d.id) ? color(d) : '#c3cede');
    }).on('mouseleave', function () {
      d3.select(this).select('circle').attr('stroke-width', d => d.ch === 0 ? 0 : 2.4);
      link.attr('stroke-opacity', .8).attr('stroke', '#c3cede');
    }).on('click', (e, d) => {
      showInfo(d);
      if (d.ch > 0) { showInfo(d, true); }
    });

    kgSim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(95).strength(.35))
      .force('charge', d3.forceManyBody().strength(-380))
      .force('center', d3.forceCenter(W / 2, H / 2))
      .force('collide', d3.forceCollide(d => d.r + 16))
      .on('tick', () => {
        link.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
        node.attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');
      });
  }
  function showInfo(d, withLink) {
    const box = $('#graphInfo');
    const chTxt = d.ch === 0 ? (lang === 'zh' ? '课程总目标' : 'Course goal')
      : (lang === 'zh' ? '第 ' + d.ch + ' 章' : 'Chapter ' + d.ch);
    box.innerHTML = '<div class="gi-name">' + T(d.name) + '</div>'
      + '<div class="gi-en">' + (d.name.en || '') + '</div>'
      + '<p style="margin:0 0 6px">' + T(d.d) + '</p>'
      + '<div style="font-size:11.5px;color:#7b8794">' + chTxt + '</div>'
      + (d.ch > 0 ? '<a class="gl-go" href="' + CHAPTERS[d.ch - 1].id + '/">' + (lang === 'zh' ? '进入第 ' + d.ch + ' 章 →' : 'Open chapter →') + '</a>' : '');
  }
  function renderFilters() {
    const box = $('#graphFilters'); box.innerHTML = '';
    CHAPTERS.forEach(c => {
      const on = kgFilter.has(c.no);
      const el = document.createElement('span');
      el.className = 'chip' + (on ? ' on' : '');
      el.innerHTML = '<i style="background:' + CH_COLOR[c.no - 1] + '"></i>' + (lang === 'zh' ? '第' + c.no + '章' : 'Ch' + c.no);
      el.onclick = () => {
        if (kgFilter.has(c.no)) kgFilter.delete(c.no); else kgFilter.add(c.no);
        if (!kgFilter.size) kgFilter = new Set([1, 2, 3, 4, 5]);
        renderFilters(); drawKG();
      };
      box.appendChild(el);
    });
    const lg = $('#graphLegend'); lg.innerHTML = '';
    CHAPTERS.forEach(c => {
      const s = document.createElement('span');
      s.innerHTML = '<i class="dot" style="background:' + CH_COLOR[c.no - 1] + '"></i>'
        + (lang === 'zh' ? '第' + c.no + '章 ' : 'Ch' + c.no + ' ') + T(c.title);
      lg.appendChild(s);
    });
    const s2 = document.createElement('span');
    s2.innerHTML = '<i class="dot" style="background:#0f172a"></i>' + (lang === 'zh' ? '课程总目标' : 'Course goal');
    lg.appendChild(s2);
  }

  /* =========================================================
     章节卡片 + 卡片内迷你可视化
     ========================================================= */
  function renderChapters() {
    const box = $('#chapterCards'); box.innerHTML = '';
    CHAPTERS.forEach(c => {
      const el = document.createElement('div');
      el.className = 'ch-card';
      el.innerHTML =
        '<div class="ch-top">'
        + '<span class="ch-no" style="background:' + CH_COLOR[c.no - 1] + '">'
        + (lang === 'zh' ? '第 ' + c.no + ' 章' : 'Chapter ' + c.no) + '</span>'
        + '<h3 class="ch-title">' + T(c.title) + '</h3>'
        + '<p class="ch-note" style="margin:0">' + T(c.note) + '</p>'
        + '</div>'
        + '<div class="ch-viz"><svg viewBox="0 0 340 132" preserveAspectRatio="xMidYMid meet" id="mini-' + c.id + '"></svg>'
        + '<p class="ch-viz-cap">' + miniCap(c.viz) + '</p></div>'
        + '<div class="ch-body">'
        + '<p class="ch-desc">' + T(c.desc) + '</p>'
        + '<div class="ch-keys">' + c.keys.map(k => '<span class="key-tag">' + T(k) + '</span>').join('') + '</div>'
        + '<div class="ch-foot"><a class="ch-link" href="' + c.id + '/">'
        + (lang === 'zh' ? '进入章节 →' : 'Open chapter →') + '</a>'
        + '<button class="ch-done" data-ch="' + c.id + '">'
        + (doneSet.has(c.id) ? (lang === 'zh' ? '✓ 已完成' : '✓ done') : (lang === 'zh' ? '标记完成' : 'mark done')) + '</button></div>'
        + '</div>';
      box.appendChild(el);
    });
    $$('.ch-done').forEach(b => b.addEventListener('click', () => {
      const id = b.dataset.ch;
      if (doneSet.has(id)) doneSet.delete(id); else doneSet.add(id);
      saveDone(); renderChapters(); renderProgress();
    }));
    CHAPTERS.forEach(c => drawMini(c));
  }
  function miniCap(v) {
    const m = {
      dikw: { zh: 'DIKW 金字塔：数据 → 智慧', en: 'DIKW pyramid: data → wisdom' },
      flow: { zh: 'Card 数据流模型（含反馈回路）', en: 'Card data-flow model with feedback' },
      color: { zh: '分类色板 / 顺序色阶 / CVD 风险', en: 'Categorical / sequential / CVD risk' },
      fit: { zh: '散点 + 拟合曲线 + 45° 判读', en: 'Scatter + fit + 45° banking' },
      cal: { zh: '日历热图：一年 52 周', en: 'Calendar heatmap: 52 weeks' },
    };
    return T(m[v] || '');
  }
  function drawMini(c) {
    const sel = d3.select('#mini-' + c.id);
    if (sel.empty()) return;
    sel.selectAll('*').remove();
    const W = 340, H = 132;
    const col = CH_COLOR[c.no - 1];
    if (c.viz === 'dikw') {
      const g = sel.append('g').attr('transform', 'translate(170,10)');
      const lv = [{ t: 'Wisdom', z: '智慧', w: 46 }, { t: 'Knowledge', z: '知识', w: 78 }, { t: 'Information', z: '信息', w: 112 }, { t: 'Data', z: '数据', w: 148 }];
      lv.forEach((l, i) => {
        const y = i * 28;
        g.append('path').attr('d', 'M' + (-l.w / 2) + ',' + y + ' L' + (l.w / 2) + ',' + y + ' L' + (l.w / 2 - 16) + ',' + (y + 24) + ' L' + (-l.w / 2 + 16) + ',' + (y + 24) + ' Z')
          .attr('fill', col).attr('fill-opacity', 0.16 + i * 0.2).attr('stroke', col).attr('stroke-width', 1.2);
        g.append('text').attr('text-anchor', 'middle').attr('y', y + 16).attr('font-size', 10.5).attr('fill', '#16233b')
          .text(lang === 'zh' ? l.z : l.t);
      });
    } else if (c.viz === 'flow') {
      const g = sel.append('g').attr('transform', 'translate(14,26)');
      const steps = lang === 'zh'
        ? ['原始数据', '数据表', '可视化结构', '视图']
        : ['Raw data', 'Tables', 'Vis structures', 'Views'];
      const bw = 70, bh = 40;
      steps.forEach((s, i) => {
        const x = i * (bw + 8);
        g.append('rect').attr('x', x).attr('y', 22).attr('width', bw).attr('height', bh).attr('rx', 7)
          .attr('fill', '#fff').attr('stroke', col).attr('stroke-width', 1.6).attr('fill-opacity', .7);
        g.append('text').attr('x', x + bw / 2).attr('y', 46).attr('text-anchor', 'middle').attr('font-size', 10).attr('fill', '#16233b').text(s);
        if (i < steps.length - 1) g.append('path').attr('d', 'M' + (x + bw + 1) + ',42 l6,-4 l0,8 z').attr('fill', col);
      });
      g.append('path').attr('d', 'M6,52 C6,86 300,86 300,52').attr('fill', 'none').attr('stroke', col)
        .attr('stroke-dasharray', '4 3').attr('stroke-opacity', .7);
      g.append('text').attr('x', 150).attr('y', 90).attr('text-anchor', 'middle').attr('font-size', 9.5).attr('fill', '#7b8794')
        .text(lang === 'zh' ? '人的调节 / 交互反馈' : 'human adjustment / feedback');
    } else if (c.viz === 'color') {
      const g = sel.append('g').attr('transform', 'translate(16,20)');
      const pal = ['#e69f00', '#56b4e9', '#009e73', '#f0e442', '#0072b2', '#d55e00', '#cc79a7', '#000000'];
      pal.forEach((p, i) => {
        g.append('rect').attr('x', i * 36).attr('y', 0).attr('width', 32).attr('height', 34).attr('rx', 5).attr('fill', p);
        g.append('text').attr('x', i * 36 + 16).attr('y', 48).attr('text-anchor', 'middle').attr('font-size', 8).attr('fill', '#7b8794').text('C' + (i + 1));
      });
      const grad = sel.append('defs').append('linearGradient').attr('id', 'gseq-' + c.id);
      grad.attr('x1', '0%').attr('x2', '100%');
      [[0, '#f7fbff'], [0.5, '#4292c6'], [1, '#08306b']].forEach(p => grad.append('stop').attr('offset', p[0] * 100 + '%').attr('stop-color', p[1]));
      const g2 = sel.append('g').attr('transform', 'translate(16,78)');
      g2.append('rect').attr('width', 288).attr('height', 22).attr('rx', 5).attr('fill', 'url(#gseq-' + c.id + ')');
      g2.append('text').attr('y', 38).attr('font-size', 9.5).attr('fill', '#7b8794')
        .text(lang === 'zh' ? '顺序色阶（低 → 高）· 分类色板避免仅靠色相区分' : 'Sequential ramp (low→high) · avoid hue-only encoding');
    } else if (c.viz === 'fit') {
      const g = sel.append('g').attr('transform', 'translate(30,10)');
      const x = d3.scaleLinear().domain([0, 100]).range([0, 275]);
      const y = d3.scaleLinear().domain([0, 100]).range([105, 5]);
      g.append('g').attr('class', 'grid').selectAll('line').data(y.ticks(4)).join('line')
        .attr('x1', 0).attr('x2', 275).attr('y1', d => y(d)).attr('y2', d => y(d));
      g.append('g').attr('class', 'axis').attr('transform', 'translate(0,105)').call(d3.axisBottom(x).ticks(5));
      g.append('g').attr('class', 'axis').call(d3.axisLeft(y).ticks(4));
      const pts = d3.range(34).map(i => ({ x: 4 + i * 2.9, y: 14 + 0.62 * i * 2.4 + (Math.sin(i) * 9) }));
      g.selectAll('circle').data(pts).join('circle').attr('cx', d => x(d.x)).attr('cy', d => y(d.y)).attr('r', 2.6)
        .attr('fill', col).attr('fill-opacity', .75);
      const line = d3.line().x(d => x(d.x)).y(d => y(d.y)).curve(d3.curveMonotoneX);
      g.append('path').datum(pts).attr('d', line).attr('fill', 'none').attr('stroke', col).attr('stroke-width', 2);
      g.append('line').attr('x1', x(6)).attr('y1', y(10)).attr('x2', x(60)).attr('y2', y(64))
        .attr('stroke', '#b45309').attr('stroke-dasharray', '4 3').attr('stroke-width', 1.3);
      g.append('text').attr('x', x(58)).attr('y', y(70)).attr('font-size', 9).attr('fill', '#b45309')
        .text(lang === 'zh' ? '≈45° 判读最准' : '≈45° best');
    } else if (c.viz === 'cal') {
      const g = sel.append('g').attr('transform', 'translate(14,10)');
      const cell = 15, gap = 2;
      d3.range(53).forEach(w => {
        d3.range(7).forEach(d => {
          const v = Math.abs(Math.sin((w + 1) * 0.7 + d)) ;
          g.append('rect').attr('x', w * (cell + gap)).attr('y', d * (cell + gap))
            .attr('width', cell).attr('height', cell).attr('rx', 3)
            .attr('fill', d3.interpolateBlues(0.15 + v * 0.8));
        });
      });
      g.append('text').attr('x', 0).attr('y', 7 * (cell + gap) + 14).attr('font-size', 9.5).attr('fill', '#7b8794')
        .text(lang === 'zh' ? '周 →' : 'weeks →');
    }
  }

  /* =========================================================
     图表速查
     ========================================================= */
  let gCat = 0, gItem = 0;
  function renderGallery() {
    const tabs = $('#galleryTabs'); tabs.innerHTML = '';
    GALLERY.forEach((g, i) => {
      const el = document.createElement('span');
      el.className = 'chip' + (i === gCat ? ' on' : '');
      el.textContent = T(g.cat);
      el.onclick = () => { gCat = i; gItem = 0; renderGallery(); };
      tabs.appendChild(el);
    });
    const list = $('#galleryList'); list.innerHTML = '';
    GALLERY[gCat].items.forEach((it, i) => {
      const el = document.createElement('div');
      el.className = 'gl-item' + (i === gItem ? ' on' : '');
      el.innerHTML = '<span>' + T(it.name) + '</span><em>' + T(it.tag) + '</em>';
      el.onclick = () => { gItem = i; renderGallery(); };
      list.appendChild(el);
    });
    const it = GALLERY[gCat].items[gItem];
    $('#gsTitle').textContent = T(it.name) + ' · ' + T(it.tag);
    $('#gsTag').textContent = T(GALLERY[gCat].cat);
    $('#gsNote').textContent = T(it.note);
    drawGalleryChart(it.kind);
  }
  function drawGalleryChart(kind) {
    const svg = d3.select('#galleryChart'); svg.selectAll('*').remove();
    const W = 620, H = 380, M = { t: 22, r: 18, b: 40, l: 46 };
    const iw = W - M.l - M.r, ih = H - M.t - M.b;
    const g = svg.append('g').attr('transform', 'translate(' + M.l + ',' + M.t + ')');
    const pal = ['#2563eb', '#0891b2', '#db2777', '#7c3aed', '#ea580c', '#16a34a'];

    function axes(x, y, xlab, ylab) {
      g.append('g').attr('class', 'grid').selectAll('line').data(y.ticks(5)).join('line')
        .attr('x1', 0).attr('x2', iw).attr('y1', d => y(d)).attr('y2', d => y(d));
      g.append('g').attr('class', 'axis').attr('transform', 'translate(0,' + ih + ')').call(d3.axisBottom(x));
      g.append('g').attr('class', 'axis').call(d3.axisLeft(y).ticks(5));
      if (xlab) g.append('text').attr('x', iw).attr('y', ih + 34).attr('text-anchor', 'end').attr('font-size', 11).attr('fill', '#7b8794').text(T(xlab));
      if (ylab) g.append('text').attr('x', 0).attr('y', -8).attr('font-size', 11).attr('fill', '#7b8794').text(T(ylab));
    }

    if (kind === 'bar' || kind === 'stack') {
      const x = d3.scaleBand().domain(SAMPLE.map(d => T(d.label))).range([0, iw]).padding(.28);
      const y = d3.scaleLinear().domain([0, d3.max(SAMPLE, d => d.v) * 1.15]).range([ih, 0]).nice();
      axes(x, y, { zh: '地区', en: 'Region' }, { zh: '数值', en: 'Value' });
      if (kind === 'bar') {
        g.selectAll('rect').data(SAMPLE).join('rect')
          .attr('x', d => x(T(d.label))).attr('width', x.bandwidth())
          .attr('y', d => y(d.v)).attr('height', d => ih - y(d.v))
          .attr('rx', 4).attr('fill', (d, i) => pal[i % pal.length]);
      } else {
        const parts = [0.55, 0.3, 0.15];
        SAMPLE.forEach((d, i) => {
          let acc = 0;
          parts.forEach((p, k) => {
            const v = d.v * p;
            g.append('rect').attr('x', x(T(d.label))).attr('width', x.bandwidth())
              .attr('y', y(acc + v)).attr('height', y(acc) - y(acc + v))
              .attr('fill', pal[k % pal.length]).attr('opacity', .92);
            acc += v;
          });
        });
      }
    } else if (kind === 'line' || kind === 'area') {
      const x = d3.scalePoint().domain(TS.map(d => d.i)).range([0, iw]);
      const y = d3.scaleLinear().domain([0, d3.max(TS, d => d.v) * 1.12]).range([ih, 0]).nice();
      axes(x, y, { zh: '时间', en: 'Time' }, { zh: '数值', en: 'Value' });
      const ln = d3.line().x(d => x(d.i)).y(d => y(d.v)).curve(d3.curveMonotoneX);
      if (kind === 'area') {
        const ar = d3.area().x(d => x(d.i)).y0(ih).y1(d => y(d.v)).curve(d3.curveMonotoneX);
        g.append('path').datum(TS).attr('d', ar).attr('fill', pal[0]).attr('fill-opacity', .22);
        // 第二层演示堆叠
        const TS2 = TS.map(d => ({ i: d.i, v: d.v * 0.5 }));
        const ar2 = d3.area().x(d => x(d.i)).y0(d => y(d.v)).y1(d => y(d.v + d.v * 0.5)).curve(d3.curveMonotoneX);
        g.append('path').datum(TS).attr('d', ar2).attr('fill', pal[2]).attr('fill-opacity', .35);
      }
      g.append('path').datum(TS).attr('d', ln).attr('fill', 'none').attr('stroke', pal[0]).attr('stroke-width', 2.2);
      g.selectAll('circle.pt').data(TS).join('circle').attr('class', 'pt')
        .attr('cx', d => x(d.i)).attr('cy', d => y(d.v)).attr('r', 2.6).attr('fill', pal[0]);
    } else if (kind === 'hist') {
      const vals = d3.range(260).map(() => d3.randomNormal(50, 13)());
      const bins = d3.bin().domain([10, 95]).thresholds(16)(vals);
      const x = d3.scaleLinear().domain([10, 95]).range([0, iw]);
      const y = d3.scaleLinear().domain([0, d3.max(bins, b => b.length)]).range([ih, 0]).nice();
      axes(x, y, { zh: '取值', en: 'Value' }, { zh: '频数', en: 'Count' });
      g.selectAll('rect').data(bins).join('rect')
        .attr('x', d => x(d.x0) + 1).attr('width', d => Math.max(0, x(d.x1) - x(d.x0) - 2))
        .attr('y', d => y(d.length)).attr('height', d => ih - y(d.length))
        .attr('fill', pal[0]).attr('fill-opacity', .85);
    } else if (kind === 'box') {
      const groups = [0, 1, 2, 3].map(k => d3.range(60).map(() => d3.randomNormal(48 + k * 9, 8 + k * 2)()));
      const x = d3.scaleBand().domain(['A', 'B', 'C', 'D']).range([0, iw]).padding(.5);
      const y = d3.scaleLinear().domain([10, 95]).range([ih, 0]);
      axes(x, y, null, { zh: '取值', en: 'Value' });
      groups.forEach((arr, i) => {
        arr.sort(d3.ascending);
        const q1 = d3.quantile(arr, .25), med = d3.quantile(arr, .5), q3 = d3.quantile(arr, .75);
        const lo = Math.max(arr[0], q1 - 1.5 * (q3 - q1)), hi = Math.min(arr[arr.length - 1], q3 + 1.5 * (q3 - q1));
        const cx = x(['A', 'B', 'C', 'D'][i]) + x.bandwidth() / 2, bw = x.bandwidth();
        g.append('line').attr('x1', cx).attr('x2', cx).attr('y1', y(lo)).attr('y2', y(hi)).attr('stroke', '#94a3b8');
        g.append('rect').attr('x', cx - bw / 2).attr('width', bw).attr('y', y(q3)).attr('height', y(q1) - y(q3))
          .attr('fill', pal[i]).attr('fill-opacity', .35).attr('stroke', pal[i]).attr('stroke-width', 1.6).attr('rx', 3);
        g.append('line').attr('x1', cx - bw / 2).attr('x2', cx + bw / 2).attr('y1', y(med)).attr('y2', y(med))
          .attr('stroke', pal[i]).attr('stroke-width', 2.6);
        arr.filter(v => v < lo || v > hi).forEach(v => {
          g.append('circle').attr('cx', cx).attr('cy', y(v)).attr('r', 2).attr('fill', '#94a3b8');
        });
      });
    } else if (kind === 'scatter') {
      const x = d3.scaleLinear().domain([0, 100]).range([0, iw]);
      const y = d3.scaleLinear().domain([0, 100]).range([ih, 0]);
      axes(x, y, { zh: 'X', en: 'X' }, { zh: 'Y', en: 'Y' });
      g.selectAll('circle').data(XY).join('circle')
        .attr('cx', d => x(d.x)).attr('cy', d => y(d.y)).attr('r', 4)
        .attr('fill', pal[0]).attr('fill-opacity', .65);
      const xs = XY.map(d => d.x), ys = XY.map(d => d.y);
      const mx = d3.mean(xs), my = d3.mean(ys);
      const b1 = d3.sum(XY.map(d => (d.x - mx) * (d.y - my))) / d3.sum(xs.map(v => (v - mx) ** 2));
      const b0 = my - b1 * mx;
      g.append('line').attr('x1', x(0)).attr('y1', y(b0)).attr('x2', x(100)).attr('y2', y(b0 + b1 * 100))
        .attr('stroke', '#b45309').attr('stroke-width', 2);
    } else if (kind === 'pie') {
      const r = Math.min(iw, ih) / 2 - 6;
      const gg = g.append('g').attr('transform', 'translate(' + iw / 2 + ',' + ih / 2 + ')');
      const pie = d3.pie().value(d => d.v).sort(null);
      const arc = d3.arc().innerRadius(r * 0.52).outerRadius(r);
      gg.selectAll('path').data(pie(SAMPLE)).join('path').attr('d', arc)
        .attr('fill', (d, i) => pal[i % pal.length]).attr('stroke', '#fff').attr('stroke-width', 2);
      gg.selectAll('text').data(pie(SAMPLE)).join('text')
        .attr('transform', d => 'translate(' + arc.centroid(d) + ')')
        .attr('text-anchor', 'middle').attr('font-size', 10.5).attr('fill', '#fff').attr('font-weight', 600)
        .text(d => d.data.v);
    } else if (kind === 'radar') {
      const dims = ['A', 'B', 'C', 'D', 'E', 'F'];
      const r = Math.min(iw, ih) / 2 - 26, cx = iw / 2, cy = ih / 2;
      const ang = i => (i / dims.length) * Math.PI * 2 - Math.PI / 2;
      const rr = d3.scaleLinear().domain([0, 100]).range([0, r]);
      d3.range(4).forEach(k => {
        g.append('polygon').attr('points', dims.map((d, i) => [cx + Math.cos(ang(i)) * rr((k + 1) * 25), cy + Math.sin(ang(i)) * rr((k + 1) * 25)].join(',')))
          .attr('fill', 'none').attr('stroke', '#e3e8ef');
      });
      dims.forEach((d, i) => {
        g.append('line').attr('x1', cx).attr('y1', cy).attr('x2', cx + Math.cos(ang(i)) * r).attr('y2', cy + Math.sin(ang(i)) * r).attr('stroke', '#e3e8ef');
        g.append('text').attr('x', cx + Math.cos(ang(i)) * (r + 14)).attr('y', cy + Math.sin(ang(i)) * (r + 14) + 4)
          .attr('text-anchor', 'middle').attr('font-size', 10.5).attr('fill', '#7b8794').text(d);
      });
      [0, 1].forEach(s => {
        const vals = dims.map(() => 32 + Math.random() * 62);
        g.append('polygon').attr('points', vals.map((v, i) => [cx + Math.cos(ang(i)) * rr(v), cy + Math.sin(ang(i)) * rr(v)].join(',')))
          .attr('fill', pal[s]).attr('fill-opacity', .22).attr('stroke', pal[s]).attr('stroke-width', 2);
      });
    } else if (kind === 'bubble') {
      const data = d3.range(22).map(() => ({ x: 6 + Math.random() * 88, y: 10 + Math.random() * 78, v: 6 + Math.random() * 40 }));
      const x = d3.scaleLinear().domain([0, 100]).range([0, iw]);
      const y = d3.scaleLinear().domain([0, 100]).range([ih, 0]);
      const s = d3.scaleSqrt().domain([0, 46]).range([0, 26]);
      axes(x, y, { zh: 'X', en: 'X' }, { zh: 'Y', en: 'Y' });
      g.selectAll('circle').data(data).join('circle')
        .attr('cx', d => x(d.x)).attr('cy', d => y(d.y)).attr('r', d => s(d.v))
        .attr('fill', pal[0]).attr('fill-opacity', .35).attr('stroke', pal[0]).attr('stroke-width', 1.4);
    } else if (kind === 'heat' || kind === 'cal') {
      const weeks = kind === 'cal' ? 53 : 12, days = 7;
      const cell = Math.min(iw / weeks, ih / days) - 2;
      const gg = g.append('g');
      d3.range(weeks).forEach(w => d3.range(days).forEach(d => {
        const v = Math.abs(Math.sin(w * .8 + d * .5) * 0.7 + Math.random() * .3);
        gg.append('rect').attr('x', w * (cell + 2)).attr('y', d * (cell + 2))
          .attr('width', cell).attr('height', cell).attr('rx', 2.5)
          .attr('fill', d3.interpolateBlues(.12 + v * .82));
      }));
      gg.append('text').attr('y', days * (cell + 2) + 14).attr('font-size', 10.5).attr('fill', '#7b8794')
        .text(kind === 'cal' ? (lang === 'zh' ? '周 →（颜色深 = 数值大）' : 'weeks → (darker = larger)')
          : (lang === 'zh' ? '列 →（颜色深 = 数值大）' : 'columns → (darker = larger)'));
    } else if (kind === 'treemap') {
      const data = { children: SAMPLE.map((d, i) => ({ name: T(d.label), value: d.v, i })) };
      const root = d3.treemap().size([iw, ih]).padding(3)(d3.hierarchy(data).sum(d => d.value).sort((a, b) => b.value - a.value));
      const leaf = g.selectAll('g').data(root.leaves()).join('g').attr('transform', d => 'translate(' + d.x0 + ',' + d.y0 + ')');
      leaf.append('rect').attr('width', d => d.x1 - d.x0).attr('height', d => d.y1 - d.y0).attr('rx', 4)
        .attr('fill', d => pal[d.data.i % pal.length]).attr('fill-opacity', .82);
      leaf.append('text').attr('x', 8).attr('y', 18).attr('font-size', 11).attr('fill', '#fff').attr('font-weight', 600)
        .text(d => d.data.name);
    } else if (kind === 'sankey') {
      const nodes = [{ n: 'A' }, { n: 'B' }, { n: 'C' }, { n: 'X' }, { n: 'Y' }, { n: 'Z' }];
      const flows = [[0, 3, 30], [0, 4, 18], [1, 3, 12], [1, 5, 26], [2, 4, 22], [2, 5, 14]];
      const nx = d3.scalePoint().domain([0, 1]).range([10, iw - 90]);
      const pos = { 0: [10, 40], 1: [10, 140], 2: [10, 240], 3: [iw - 90, 60], 4: [iw - 90, 160], 5: [iw - 90, 260] };
      const total = d3.sum(flows, f => f[2]);
      const sy = d3.scaleLinear().domain([0, total]).range([0, ih - 40]);
      flows.forEach((f, i) => {
        const s = pos[f[0]], t = pos[f[1]];
        const h = sy(f[2]);
        const path = d3.path();
        path.moveTo(s[0] + 66, s[1]);
        path.bezierCurveTo(s[0] + 130, s[1], t[0] - 40, t[1], t[0], t[1]);
        g.append('path').attr('d', path.toString()).attr('fill', pal[i % pal.length]).attr('fill-opacity', .38);
      });
      nodes.forEach((n, i) => {
        const p = pos[i];
        g.append('rect').attr('x', p[0]).attr('y', p[1] - 12).attr('width', 66).attr('height', 24).attr('rx', 5)
          .attr('fill', i < 3 ? pal[0] : pal[3]).attr('fill-opacity', .9);
        g.append('text').attr('x', p[0] + 33).attr('y', p[1] + 4).attr('text-anchor', 'middle').attr('font-size', 11)
          .attr('fill', '#fff').attr('font-weight', 700).text(n.n);
      });
    } else if (kind === 'spiral') {
      const cx = iw / 2, cy = ih / 2, R = Math.min(iw, ih) / 2 - 16;
      g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', R).attr('fill', 'none').attr('stroke', '#e3e8ef');
      d3.range(3).forEach(y => {
        d3.range(120).forEach(d => {
          const t = d / 120, a = t * Math.PI * 2 - Math.PI / 2;
          const rr = (R - 12) * ((y + 1) / 3.4) * (0.62 + t * 0.38);
          const v = Math.abs(Math.sin(d * .4 + y));
          g.append('rect').attr('x', cx + Math.cos(a) * rr - 2).attr('y', cy + Math.sin(a) * rr - 2)
            .attr('width', 4).attr('height', 4).attr('fill', d3.interpolateViridis(v));
        });
      });
      g.append('text').attr('x', cx).attr('y', cy + 4).attr('text-anchor', 'middle').attr('font-size', 10).attr('fill', '#7b8794')
        .text(lang === 'zh' ? '半径=年 · 角度=日' : 'radius=year · angle=day');
    } else if (kind === 'contour') {
      const n = 34, m = 24;
      const vals = [];
      for (let j = 0; j < m; j++) { vals.push([]); for (let i = 0; i < n; i++) vals[j].push(Math.sin(i / 5) * Math.cos(j / 4) + Math.sin((i + j) / 9)); }
      const cs = d3.contours().size([n, m]).thresholds(d3.range(-1.6, 1.7, .32))(vals.flat());
      const x = d3.scaleLinear().domain([0, n]).range([0, iw]);
      const y = d3.scaleLinear().domain([0, m]).range([0, ih]);
      const color = d3.scaleSequential(d3.interpolateViridis).domain([-1.6, 1.6]);
      g.selectAll('path').data(cs).join('path').attr('d', d3.geoPath().transform(null))
        .attr('d', d => {
          const path = d3.geoPath()(d);
          return path;
        })
        .attr('transform', 'scale(' + (iw / n) + ',' + (ih / m) + ')')
        .attr('fill', d => color(d.value)).attr('stroke', '#fff').attr('stroke-width', .4);
    } else if (kind === 'story') {
      const chars = d3.range(6).map(i => ({ id: i, pts: d3.range(14).map(t => ({ t, y: 20 + i * 40 + Math.sin(t / 2.4 + i) * (t > 6 && t < 11 ? 6 : 22) })) }));
      const x = d3.scaleLinear().domain([0, 13]).range([10, iw - 10]);
      const y = d3.scaleLinear().domain([0, 260]).range([ih, 0]);
      const line = d3.line().x(d => x(d.t)).y(d => y(d.y)).curve(d3.curveBasis);
      chars.forEach((c, i) => {
        g.append('path').datum(c.pts).attr('d', line).attr('fill', 'none')
          .attr('stroke', pal[i % pal.length]).attr('stroke-width', 2.4);
        g.append('text').attr('x', 4).attr('y', y(c.pts[0].y) + 4).attr('font-size', 10).attr('fill', pal[i % pal.length])
          .text((lang === 'zh' ? '人物' : 'Char') + (i + 1));
      });
    } else if (kind === 'slope') {
      const data = SAMPLE.map((d, i) => ({ name: T(d.label), a: d.v, b: d.v * (0.6 + Math.random() * 0.9) }));
      const x = d3.scalePoint().domain(['2020', '2025']).range([60, iw - 60]);
      const y = d3.scaleLinear().domain([0, d3.max(data, d => Math.max(d.a, d.b)) * 1.1]).range([ih, 0]);
      data.forEach((d, i) => {
        g.append('line').attr('x1', x('2020')).attr('y1', y(d.a)).attr('x2', x('2025')).attr('y2', y(d.b))
          .attr('stroke', pal[i % pal.length]).attr('stroke-width', 2.2);
        g.append('circle').attr('cx', x('2020')).attr('cy', y(d.a)).attr('r', 3.4).attr('fill', pal[i % pal.length]);
        g.append('circle').attr('cx', x('2025')).attr('cy', y(d.b)).attr('r', 3.4).attr('fill', pal[i % pal.length]);
        g.append('text').attr('x', x('2020') - 8).attr('y', y(d.a) + 4).attr('text-anchor', 'end').attr('font-size', 10).attr('fill', '#475569').text(d.name);
        g.append('text').attr('x', x('2025') + 8).attr('y', y(d.b) + 4).attr('font-size', 10).attr('fill', '#475569')
          .text((d.b >= d.a ? '+' : '') + Math.round(d.b - d.a));
      });
      g.append('text').attr('x', x('2020')).attr('y', ih + 26).attr('text-anchor', 'middle').attr('font-size', 11).attr('fill', '#7b8794').text('2020');
      g.append('text').attr('x', x('2025')).attr('y', ih + 26).attr('text-anchor', 'middle').attr('font-size', 11).attr('fill', '#7b8794').text('2025');
    }
  }

  /* =========================================================
     视觉通道
     ========================================================= */
  function drawChannels() {
    const svg = d3.select('#channelViz'); svg.selectAll('*').remove();
    const W = 1120, H = 320, cols = 4, rows = 2;
    const cw = W / cols, chh = H / rows;
    CHANNELS.forEach((c, i) => {
      const g = svg.append('g').attr('transform', 'translate(' + (i % cols) * cw + ',' + Math.floor(i / cols) * chh + ')');
      g.append('text').attr('x', 14).attr('y', 20).attr('font-size', 12.5).attr('font-weight', 700).attr('fill', '#16233b')
        .text((lang === 'zh' ? '#' + c.rank + ' ' : '#' + c.rank + ' ') + T(c.name));
      g.append('text').attr('x', cw - 14).attr('y', 20).attr('text-anchor', 'end').attr('font-size', 10.5).attr('fill', '#7b8794')
        .text((lang === 'zh' ? '判读精度 ' : 'accuracy ') + Math.round(c.acc * 100) + '%');
      // 精度条
      g.append('rect').attr('x', 14).attr('y', 28).attr('width', cw - 28).attr('height', 5).attr('rx', 3).attr('fill', '#eef2f7');
      g.append('rect').attr('x', 14).attr('y', 28).attr('width', (cw - 28) * c.acc).attr('height', 5).attr('rx', 3)
        .attr('fill', c.acc > .7 ? '#16a34a' : c.acc > .5 ? '#f59e0b' : '#ef4444');
      const vals = [3, 7, 5, 9, 4, 8];
      const box = g.append('g').attr('transform', 'translate(14,46)');
      const bw = cw - 28, bh = chh - 66;
      const sc = d3.scaleLinear().domain([0, 10]).range([0, Math.min(bw, 200)]);
      if (c.kind === 'pos' || c.kind === 'len') {
        vals.forEach((v, k) => {
          const y = k * (bh / 6) + 6;
          if (c.kind === 'pos') {
            box.append('circle').attr('cx', sc(v)).attr('cy', y + 8).attr('r', 5).attr('fill', '#2563eb');
            box.append('line').attr('x1', 0).attr('x2', sc(v)).attr('y1', y + 8).attr('y2', y + 8).attr('stroke', '#e3e8ef');
          } else {
            box.append('rect').attr('x', 0).attr('y', y).attr('width', sc(v)).attr('height', 11).attr('rx', 2).attr('fill', '#2563eb').attr('fill-opacity', .8);
          }
          box.append('text').attr('x', sc(v) + 10).attr('y', y + 9).attr('font-size', 9).attr('fill', '#7b8794').text(v);
        });
      } else if (c.kind === 'ang') {
        const cx = 60, cy = bh / 2, r = Math.min(bh / 2 - 4, 46);
        let a0 = 0;
        vals.forEach((v, k) => {
          const a1 = a0 + (v / d3.sum(vals)) * Math.PI * 2;
          const arc = d3.arc().innerRadius(0).outerRadius(r);
          box.append('path').attr('d', arc({ startAngle: a0, endAngle: a1 })).attr('transform', 'translate(' + cx + ',' + cy + ')')
            .attr('fill', d3.schemeTableau10[k]);
          a0 = a1;
        });
        box.append('text').attr('x', cx + r + 12).attr('y', cy).attr('font-size', 10).attr('fill', '#7b8794')
          .text(lang === 'zh' ? '角度不易读出精确值' : 'angles read poorly');
      } else if (c.kind === 'slope') {
        vals.forEach((v, k) => {
          const y = k * (bh / 6) + 8;
          box.append('line').attr('x1', 0).attr('y1', y + 10).attr('x2', 90).attr('y2', y + 10 - v * 5)
            .attr('stroke', '#2563eb').attr('stroke-width', 2);
        });
        box.append('text').attr('x', 96).attr('y', bh / 2).attr('font-size', 10).attr('fill', '#7b8794')
          .text(lang === 'zh' ? '≈45° 最易判读' : 'bank to 45°');
      } else if (c.kind === 'area') {
        const s = d3.scaleSqrt().domain([0, 10]).range([0, 34]);
        vals.forEach((v, k) => {
          box.append('circle').attr('cx', 24 + k * 44).attr('cy', bh / 2).attr('r', s(v))
            .attr('fill', '#2563eb').attr('fill-opacity', .45).attr('stroke', '#2563eb');
          box.append('text').attr('x', 24 + k * 44).attr('y', bh / 2 + 3).attr('text-anchor', 'middle').attr('font-size', 9).attr('fill', '#16233b').text(v);
        });
      } else if (c.kind === 'light') {
        vals.forEach((v, k) => {
          box.append('rect').attr('x', k * 32).attr('y', 6).attr('width', 28).attr('height', 52).attr('rx', 3)
            .attr('fill', d3.interpolateBlues(0.15 + v / 12));
          box.append('text').attr('x', k * 32 + 14).attr('y', 70).attr('text-anchor', 'middle').attr('font-size', 9).attr('fill', '#7b8794').text(v);
        });
      } else if (c.kind === 'hue') {
        vals.forEach((v, k) => {
          box.append('rect').attr('x', k * 32).attr('y', 6).attr('width', 28).attr('height', 52).attr('rx', 3)
            .attr('fill', d3.interpolateRainbow(v / 10));
          box.append('text').attr('x', k * 32 + 14).attr('y', 70).attr('text-anchor', 'middle').attr('font-size', 9).attr('fill', '#7b8794').text(v);
        });
        box.append('text').attr('x', 200).attr('y', 40).attr('font-size', 10).attr('fill', '#b45309')
          .text(lang === 'zh' ? '色相适合分类，不适合定量' : 'hue: categorical, not quantitative');
      } else {
        vals.forEach((v, k) => {
          box.append('rect').attr('x', k * 32).attr('y', 6).attr('width', 28).attr('height', 52).attr('rx', 3)
            .attr('fill', '#2563eb').attr('fill-opacity', 0.1 + v / 14);
          box.append('text').attr('x', k * 32 + 14).attr('y', 70).attr('text-anchor', 'middle').attr('font-size', 9).attr('fill', '#7b8794').text(v);
        });
      }
    });
  }

  let stIdx = 0;
  function renderStevens() {
    const box = $('#stevensTabs'); box.innerHTML = '';
    STEVENS.forEach((s, i) => {
      const el = document.createElement('span');
      el.className = 'chip' + (i === stIdx ? ' on' : '');
      el.textContent = T(s.name);
      el.onclick = () => { stIdx = i; renderStevens(); };
      box.appendChild(el);
    });
    const s = STEVENS[stIdx];
    $('#stevensResult').innerHTML =
      '<div class="sr-row"><span class="sr-key">' + (lang === 'zh' ? '含义' : 'Meaning') + '</span><span>' + T(s.desc) + '</span></div>'
      + '<div class="sr-row"><span class="sr-key" style="color:#15803d">' + (lang === 'zh' ? '推荐通道' : 'Use') + '</span><span>' + T(s.ok) + '</span></div>'
      + '<div class="sr-row"><span class="sr-key" style="color:#b91c1c">' + (lang === 'zh' ? '避免使用' : 'Avoid') + '</span><span>' + T(s.no) + '</span></div>'
      + '<div class="sr-row"><span class="sr-key">' + (lang === 'zh' ? '例子' : 'Examples') + '</span><span>' + T(s.eg) + '</span></div>';
    const svg = d3.select('#stevensViz'); svg.selectAll('*').remove();
    const g = svg.append('g').attr('transform', 'translate(24,26)');
    const data = [{ n: 'A', v: 4 }, { n: 'B', v: 7 }, { n: 'C', v: 5 }, { n: 'D', v: 9 }];
    const x = d3.scaleBand().domain(data.map(d => d.n)).range([0, 200]).padding(.35);
    const y = d3.scaleLinear().domain([0, 10]).range([150, 0]);
    g.append('g').attr('class', 'grid').selectAll('line').data(y.ticks(5)).join('line')
      .attr('x1', 0).attr('x2', 200).attr('y1', d => y(d)).attr('y2', d => y(d));
    g.append('g').attr('class', 'axis').attr('transform', 'translate(0,150)').call(d3.axisBottom(x));
    g.append('g').attr('class', 'axis').call(d3.axisLeft(y).ticks(5));
    if (stIdx === 0) {
      // 定类：只能用色相区分
      g.selectAll('rect').data(data).join('rect')
        .attr('x', d => x(d.n)).attr('width', x.bandwidth()).attr('y', y(7)).attr('height', 150 - y(7))
        .attr('rx', 3).attr('fill', (d, i) => d3.schemeTableau10[i]);
      g.append('text').attr('x', 100).attr('y', 190).attr('text-anchor', 'middle').attr('font-size', 11).attr('fill', '#7b8794')
        .text(lang === 'zh' ? '高度相同：只用颜色区分类别' : 'equal height: colour only');
    } else if (stIdx === 1) {
      g.selectAll('rect').data(data).join('rect')
        .attr('x', d => x(d.n)).attr('width', x.bandwidth()).attr('y', y(7)).attr('height', 150 - y(7))
        .attr('rx', 3).attr('fill', (d, i) => d3.schemeBlues[4][i]);
      g.append('text').attr('x', 100).attr('y', 190).attr('text-anchor', 'middle').attr('font-size', 11).attr('fill', '#7b8794')
        .text(lang === 'zh' ? '明度有序：有顺序但差距不知' : 'ordered lightness');
    } else if (stIdx === 2) {
      g.selectAll('line').data(data).join('line')
        .attr('x1', d => x(d.n) + x.bandwidth() / 2).attr('x2', d => x(d.n) + x.bandwidth() / 2)
        .attr('y1', d => y(d.v)).attr('y2', 150).attr('stroke', '#0891b2').attr('stroke-width', 3);
      g.selectAll('circle').data(data).join('circle')
        .attr('cx', d => x(d.n) + x.bandwidth() / 2).attr('cy', d => y(d.v)).attr('r', 4).attr('fill', '#0891b2');
      g.append('text').attr('x', 100).attr('y', 190).attr('text-anchor', 'middle').attr('font-size', 11).attr('fill', '#7b8794')
        .text(lang === 'zh' ? '位置可比较差值' : 'position compares differences');
    } else {
      g.selectAll('rect').data(data).join('rect')
        .attr('x', d => x(d.n)).attr('width', x.bandwidth()).attr('y', d => y(d.v)).attr('height', d => 150 - y(d.v))
        .attr('rx', 3).attr('fill', '#2563eb').attr('fill-opacity', .85);
      g.append('text').attr('x', 100).attr('y', 190).attr('text-anchor', 'middle').attr('font-size', 11).attr('fill', '#7b8794')
        .text(lang === 'zh' ? '长度可比较倍数（有零点）' : 'length compares ratios (true zero)');
    }
  }

  /* =========================================================
     概念索引
     ========================================================= */
  function renderGlossary(kw) {
    const list = $('#glossaryList');
    const q = (kw || '').trim().toLowerCase();
    const items = GLOSSARY.filter(it => {
      if (!q) return true;
      return (it.name.zh + ' ' + (it.name.en || '') + ' ' + T(it.desc)).toLowerCase().indexOf(q) >= 0;
    });
    $('#glCount').textContent = items.length + (lang === 'zh' ? ' / ' : ' / ') + GLOSSARY.length + (lang === 'zh' ? ' 条' : ' items');
    list.innerHTML = items.map(it =>
      '<div class="gl-card" data-ch="' + it.ch + '">'
      + '<div class="gl-name"><i style="background:' + it.color + '"></i>' + T(it.name) + '</div>'
      + '<div class="gl-en">' + (it.name.en || '') + '</div>'
      + '<p class="gl-desc">' + T(it.desc) + '</p>'
      + '<span class="gl-go">' + (lang === 'zh' ? '第 ' + it.ch + ' 章 →' : 'Chapter ' + it.ch + ' →') + '</span>'
      + '</div>').join('');
    $$('.gl-card').forEach(c => c.addEventListener('click', () => {
      location.href = CHAPTERS[+c.dataset.ch - 1].id + '/';
    }));
  }

  /* =========================================================
     静态文案区块
     ========================================================= */
  function renderStatic() {
    const howto = [
      { t: { zh: '🎓 课堂讲解', en: '🎓 In class' }, d: { zh: '打开任一章节后，左侧选小节，顶部切换「讲解 / 代码 / 演示」三个 tab，一边讲解、一边实时运行。', en: 'Open a chapter, pick a section on the left, switch between explanation / code / demo tabs live.' } },
      { t: { zh: '📖 学生自学', en: '📖 Self study' }, d: { zh: '按章节顺序过完所有 ⭐ 关键点，每个关键点配有「为什么这么写」+「有什么坑」段落。', en: 'Go through all ⭐ key points in order; each has “why written this way” + “pitfalls”.' } },
      { t: { zh: '💻 教师备课', en: '💻 Teaching prep' }, d: { zh: '每个章节有 1 套独立的 <code>demo/</code> 子目录，可以单独跑、单独改、单独打包给学生。', en: 'Each chapter ships an independent <code>demo/</code> folder you can run, modify and pack separately.' } },
      { t: { zh: '📶 局域网使用', en: '📶 Offline / LAN' }, d: { zh: '若公网不通，可在本机跑 <code>python -m http.server 8080</code>，学生连同一 WiFi 即可访问。', en: 'Run <code>python -m http.server 8080</code> locally; students on the same WiFi can open it.' } },
    ];
    $('#howtoGrid').innerHTML = howto.map(h =>
      '<div class="howto-card"><h3>' + T(h.t) + '</h3><p>' + T(h.d) + '</p></div>').join('');

    const about = [
      {
        t: { zh: '📖 理论来源', en: '📖 Theory' },
        items: ['陈为《可视化导论》', 'Mackinlay 1986（视觉通道排序）', 'Stevens 1946（测量尺度）', 'Cleveland 1984（图形判读）', 'Bostock · D3 官方文档', 'Card 1999（数据流模型）']
      },
      {
        t: { zh: '🎯 设计原则', en: '🎯 Principles' },
        items: [(lang === 'zh' ? '案例为中心，而非理论为中心' : 'Case-centred, not theory-centred'),
        (lang === 'zh' ? '每个知识点都嵌入实践案例' : 'Every concept embedded in a real case'),
        (lang === 'zh' ? '⭐ 关键点解释 + 可运行演示' : '⭐ key-point notes + runnable demos')]
      },
      {
        t: { zh: '🛠 技术栈', en: '🛠 Tech stack' },
        items: [(lang === 'zh' ? '零依赖：HTML + CSS + ES modules' : 'Zero-build: HTML + CSS + ES modules'),
        (lang === 'zh' ? 'D3.js v7（本页已本地化，离线可用）' : 'D3.js v7 (bundled locally, offline-ready)'),
        (lang === 'zh' ? '一条命令启动，无需 npm' : 'One command to serve; no npm needed')]
      },
      {
        t: { zh: '📦 数据集', en: '📦 Datasets' },
        items: [(lang === 'zh' ? '新生数据 CSV（80 条合成记录）' : 'Freshman CSV (80 synthetic rows)'),
        (lang === 'zh' ? 'Crime 1985 数据' : '1985 Crime data'),
        (lang === 'zh' ? 'fetch 加载，离线可用' : 'Loaded via fetch, works offline')]
      },
    ];
    $('#aboutGrid').innerHTML = about.map(a =>
      '<div class="about-card"><h3>' + T(a.t) + '</h3><ul>' + a.items.map(i => '<li>' + i + '</li>').join('') + '</ul></div>').join('');

    const refs = [
      '陈为 等，《数据可视化》（可视化导论），机械工业出版社',
      'Mackinlay, J. (1986). Automating the Design of Graphical Presentations of Relational Information. ACM TOG.',
      'Stevens, S. S. (1946). On the Theory of Scales of Measurement. Science.',
      'Cleveland, W. S. & McGill, R. (1984). Graphical Perception: Theory, Experimentation, and Application.',
      'Card, S. K., Mackinlay, J. D., & Shneiderman, B. (1999). Readings in Information Visualization.',
      'Bostock, M., Ogievetsky, V., & Heer, J. (2011). D3: Data-Driven Documents. IEEE TVCG.',
      'Wong, B. (2011). Color blindness. Nature Methods.',
      'van Wijk, J. J. & van Selow, E. (1999). Cluster and Calendar Based Visualization of Time Series Data.',
    ];
    $('#refList').innerHTML = refs.map(r => '<li>' + r + '</li>').join('');

    $('#heroStats').innerHTML = [
      [CHAPTERS.length, lang === 'zh' ? '个章节' : 'chapters'],
      [GLOSSARY.length, lang === 'zh' ? '个核心概念' : 'key concepts'],
      [KG_LINKS.length, lang === 'zh' ? '条概念依赖' : 'concept links'],
      [GALLERY.reduce((s, g) => s + g.items.length, 0), lang === 'zh' ? '种图表可实时演示' : 'live chart demos'],
    ].map(x => '<div class="hs-item"><div class="hs-num">' + x[0] + '</div><div class="hs-lab">' + x[1] + '</div></div>').join('');
  }

  /* =========================================================
     导航 / 滚动 / 语言
     ========================================================= */
  function initNav() {
    const links = $$('.tb-nav a');
    const secs = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    const sp = $('#spFill'), tt = $('#toTop');
    function onScroll() {
      const st = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      sp.style.width = (h > 0 ? (st / h) * 100 : 0) + '%';
      tt.classList.toggle('show', st > 500);
      let cur = null;
      secs.forEach((s, i) => { if (s.offsetTop - 90 <= st) cur = links[i]; });
      links.forEach(a => a.classList.toggle('active', a === cur));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    tt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    onScroll();
  }
  function setLang(l) {
    lang = l;
    try { localStorage.setItem('vis_lang', l); } catch (e) { }
    $('#langBtn').textContent = l === 'zh' ? 'EN' : '中';
    document.documentElement.lang = l === 'zh' ? 'zh-CN' : 'en';
    renderAll();
  }
  $('#langBtn').addEventListener('click', () => setLang(lang === 'zh' ? 'en' : 'zh'));
  $('#glossaryInput').addEventListener('input', e => renderGlossary(e.target.value));

  function renderAll() {
    renderStatic();
    drawHero();
    drawPath();
    renderFilters();
    drawKG();
    renderChapters();
    renderGallery();
    drawChannels();
    renderStevens();
    renderGlossary($('#glossaryInput').value);
    renderProgress();
  }

  /* 启动 */
  $('#langBtn').textContent = lang === 'zh' ? 'EN' : '中';
  renderAll();
  initNav();
  window.addEventListener('resize', () => { drawHero(); drawPath(); drawChannels(); });
})();
