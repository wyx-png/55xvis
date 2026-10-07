/* ============================================================
   ECharts 图表配置 —— 数据均来自公开权威机构报告
   ============================================================ */

const PALETTE = ['#00e5ff', '#3d7bff', '#8b5cf6', '#ffd54f', '#ff7a90', '#4ade80', '#f472b6', '#38bdf8'];

const baseText = { color: '#8fa3c8', fontFamily: 'Noto Sans SC, sans-serif' };

function baseGrid() {
  return { left: 60, right: 30, top: 56, bottom: 40 };
}

function axisStyle() {
  return {
    axisLine: { lineStyle: { color: 'rgba(120,170,255,.3)' } },
    axisLabel: { color: '#8fa3c8', fontSize: 12 },
    splitLine: { lineStyle: { color: 'rgba(120,170,255,.08)' } }
  };
}

const tooltipBase = {
  backgroundColor: 'rgba(10,17,40,.92)',
  borderColor: 'rgba(0,229,255,.35)',
  textStyle: { color: '#e8f0ff', fontSize: 13 },
  confine: true
};

const chartInstances = [];
function makeChart(id, option) {
  const el = document.getElementById(id);
  if (!el || typeof echarts === 'undefined') return;
  // 统一注入交互工具栏：保存图片 / 数据视图 / 重置 / 柱状折线切换
  const hasBarLine = (option.series || []).some(s => ['bar', 'line'].includes(s.type));
  const feature = {
    saveAsImage: { title: '保存为图片', backgroundColor: '#0a1128', pixelRatio: 2 },
    dataView: { title: '数据视图', lang: ['数据视图', '关闭', '刷新'], readOnly: true },
    restore: { title: '重置' }
  };
  if (hasBarLine) feature.magicType = { type: ['line', 'bar'], title: { line: '切换折线图', bar: '切换柱状图' } };
  if (!option.toolbox) {
    option.toolbox = {
      feature,
      right: 8, top: 0,
      itemSize: 13, itemGap: 5,
      iconStyle: { borderColor: '#8fa3c8' },
      emphasis: { iconStyle: { borderColor: '#00e5ff', textFill: '#00e5ff' } }
    };
  }
  const chart = echarts.init(el, null, { renderer: 'canvas' });
  chart.setOption(option);
  chartInstances.push(chart);
  return chart;
}

/* ---------- 1. 中国AI核心产业规模 ---------- */
makeChart('chartChinaScale', {
  tooltip: Object.assign({}, tooltipBase, { trigger: 'axis' }),
  grid: baseGrid(),
  xAxis: {
    type: 'category',
    data: ['2020', '2021', '2022', '2023', '2024'],
    ...axisStyle()
  },
  yAxis: {
    type: 'value', name: '亿元',
    nameTextStyle: { color: '#8fa3c8' }, ...axisStyle()
  },
  series: [{
    name: '核心产业规模',
    type: 'bar',
    barWidth: '46%',
    data: [
      { value: 3031 },
      { value: 4341 },
      { value: 5080 },
      { value: 5784 },
      {
        value: 6000,
        itemStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: '#ffd54f' }, { offset: 1, color: '#ff7a90' }]
          },
          borderRadius: [8, 8, 0, 0]
        }
      }
    ],
    label: { show: true, position: 'top', color: '#e8f0ff', fontWeight: 700 },
    itemStyle: {
      borderRadius: [8, 8, 0, 0],
      color: {
        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [{ offset: 0, color: '#00e5ff' }, { offset: 1, color: '#3d7bff' }]
      }
    },
    markLine: {
      symbol: 'none',
      lineStyle: { color: '#ffd54f', type: 'dashed' },
      label: { color: '#ffd54f', formatter: '2020—2023 年均复合增速 ≈ 24%' },
      data: []
    },
    animationDuration: 1600,
    animationEasing: 'elasticOut'
  }],
  graphic: [{
    type: 'text', right: 24, top: 34,
    style: { text: '2024年上半年已接近6000亿元', fill: '#ffd54f', fontSize: 12 }
  }]
});

/* ---------- 2. 行业应用渗透度 雷达 ---------- */
makeChart('chartRadar', {
  tooltip: tooltipBase,
  radar: {
    indicator: [
      { name: '互联网', max: 100 },
      { name: '金融', max: 100 },
      { name: '政务', max: 100 },
      { name: '电信', max: 100 },
      { name: '制造', max: 100 },
      { name: '交通', max: 100 },
      { name: '医疗', max: 100 },
      { name: '能源', max: 100 }
    ],
    radius: '62%',
    center: ['50%', '54%'],
    axisName: { color: '#c7d6f5', fontSize: 13 },
    splitArea: { areaStyle: { color: ['rgba(0,229,255,.02)', 'rgba(61,123,255,.05)'] } },
    splitLine: { lineStyle: { color: 'rgba(120,170,255,.18)' } },
    axisLine: { lineStyle: { color: 'rgba(120,170,255,.25)' } }
  },
  series: [{
    type: 'radar',
    data: [{
      value: [90, 82, 76, 74, 65, 62, 58, 52],
      name: 'AI应用渗透度',
      areaStyle: {
        color: {
          type: 'radial', x: .5, y: .5, r: .6,
          colorStops: [{ offset: 0, color: 'rgba(0,229,255,.45)' }, { offset: 1, color: 'rgba(139,92,246,.18)' }]
        }
      },
      lineStyle: { color: '#00e5ff', width: 2.5 },
      itemStyle: { color: '#00e5ff' },
      symbolSize: 6
    }],
    animationDuration: 1600
  }]
});

/* ---------- 3. 生成式AI专利 ---------- */
makeChart('chartPatent', {
  tooltip: Object.assign({}, tooltipBase, {
    trigger: 'axis', axisPointer: { type: 'shadow' },
    formatter: p => `${p[0].name}<br/>专利申请量：<b>${p[0].value.toLocaleString()}</b> 件`
  }),
  grid: { left: 90, right: 60, top: 42, bottom: 30 },
  xAxis: { type: 'value', ...axisStyle() },
  yAxis: {
    type: 'category',
    data: ['印度', '日本', '韩国', '美国', '中国'],
    ...axisStyle(), splitLine: { show: false }
  },
  series: [{
    type: 'bar',
    barWidth: '52%',
    data: [
      { value: 1350 },
      { value: 3409 },
      { value: 4155 },
      { value: 6276 },
      {
        value: 38210,
        itemStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [{ offset: 0, color: '#3d7bff' }, { offset: 1, color: '#00e5ff' }]
          },
          borderRadius: [0, 8, 8, 0],
          shadowColor: 'rgba(0,229,255,.5)', shadowBlur: 18
        }
      }
    ],
    label: { show: true, position: 'right', color: '#e8f0ff', formatter: v => v.value.toLocaleString() },
    itemStyle: { borderRadius: [0, 8, 8, 0], color: 'rgba(120,170,255,.4)' },
    animationDelay: i => i * 150
  }]
});

/* ---------- 4. 中国算力总规模 ---------- */
makeChart('chartCompute', {
  tooltip: Object.assign({}, tooltipBase, { trigger: 'axis' }),
  grid: baseGrid(),
  xAxis: {
    type: 'category', boundaryGap: false,
    data: ['2020', '2021', '2022', '2023', '2024'],
    ...axisStyle()
  },
  yAxis: {
    type: 'value', name: 'EFLOPS',
    nameTextStyle: { color: '#8fa3c8' }, ...axisStyle()
  },
  series: [{
    name: '算力总规模',
    type: 'line',
    smooth: true,
    symbol: 'circle', symbolSize: 10,
    data: [135, 180, 197, 230, 246],
    lineStyle: { width: 4, color: '#8b5cf6', shadowColor: 'rgba(139,92,246,.6)', shadowBlur: 16 },
    itemStyle: { color: '#8b5cf6', borderColor: '#fff', borderWidth: 2 },
    areaStyle: {
      color: {
        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [{ offset: 0, color: 'rgba(139,92,246,.45)' }, { offset: 1, color: 'rgba(139,92,246,.02)' }]
      }
    },
    label: { show: true, color: '#c4b5fd', fontWeight: 700 },
    markPoint: {
      symbol: 'pin', symbolSize: 56,
      itemStyle: { color: '#00e5ff' },
      label: { color: '#05070f', fontWeight: 900, formatter: '全球\n第二' },
      data: [{ coord: ['2024', 246] }]
    },
    animationDuration: 1800
  }],
  graphic: [{
    type: 'text', left: 60, bottom: 44,
    style: { text: '其中2023年智能算力70 EFLOPS，增速超70%，占比超30%', fill: '#8fa3c8', fontSize: 12 }
  }]
});

/* ---------- 5. 机器人密度 ---------- */
makeChart('chartRobot', {
  tooltip: Object.assign({}, tooltipBase, {
    trigger: 'axis', axisPointer: { type: 'shadow' },
    formatter: p => `${p[0].name}<br/>每万名员工：<b>${p[0].value}</b> 台`
  }),
  grid: { left: 90, right: 50, top: 42, bottom: 30 },
  xAxis: { type: 'value', ...axisStyle() },
  yAxis: {
    type: 'category',
    data: ['全球平均', '美国', '日本', '德国', '中国', '新加坡', '韩国'],
    ...axisStyle(), splitLine: { show: false }
  },
  series: [{
    type: 'bar',
    barWidth: '55%',
    data: [162, 295, 419, 429,
      {
        value: 470,
        itemStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [{ offset: 0, color: '#ff7a90' }, { offset: 1, color: '#ffd54f' }]
          },
          borderRadius: [0, 8, 8, 0], shadowColor: 'rgba(255,213,79,.5)', shadowBlur: 16
        }
      },
      770, 1012],
    label: { show: true, position: 'right', color: '#e8f0ff' },
    itemStyle: { borderRadius: [0, 8, 8, 0], color: 'rgba(120,170,255,.4)' },
    animationDelay: i => i * 120
  }],
  graphic: [{
    type: 'text', right: 30, bottom: 36,
    style: { text: '中国：2013年第25位 → 2023年超越德日，跃居全球第三', fill: '#ffd54f', fontSize: 12 }
  }]
});

/* ---------- 6. 全球AI市场规模 ---------- */
makeChart('chartGlobal', {
  tooltip: Object.assign({}, tooltipBase, {
    trigger: 'axis',
    formatter: p => `${p[0].name}<br/>市场规模：<b>$${p[0].value}B</b>（约${(p[0].value / 10).toFixed(1)}千亿美元）`
  }),
  grid: baseGrid(),
  xAxis: {
    type: 'category', boundaryGap: false,
    data: ['2022', '2023', '2024', '2025E', '2026E', '2027E', '2030E'],
    ...axisStyle()
  },
  yAxis: {
    type: 'value', name: '十亿美元',
    nameTextStyle: { color: '#8fa3c8' }, ...axisStyle()
  },
  series: [{
    name: '全球AI市场规模',
    type: 'line', smooth: true,
    symbol: 'circle', symbolSize: 9,
    data: [136.6, 142.3, 184.0, 243.7, 320.0, 407.0, 826.7],
    lineStyle: { width: 4, color: '#00e5ff', shadowColor: 'rgba(0,229,255,.5)', shadowBlur: 18 },
    itemStyle: { color: '#00e5ff', borderColor: '#fff', borderWidth: 2 },
    areaStyle: {
      color: {
        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [{ offset: 0, color: 'rgba(0,229,255,.35)' }, { offset: 1, color: 'rgba(0,229,255,.02)' }]
      }
    },
    label: { show: true, color: '#a5f3fc', fontWeight: 700 },
    markArea: {
      itemStyle: { color: 'rgba(139,92,246,.08)' },
      label: { color: '#c4b5fd', fontSize: 12 },
      data: [[{ name: '预测区间', xAxis: '2025E' }, { xAxis: '2030E' }]]
    },
    animationDuration: 2000
  }]
});

/* ---------- 7. PwC 2030 各地区贡献 ---------- */
makeChart('chartPwc', {
  tooltip: Object.assign({}, tooltipBase, {
    trigger: 'axis', axisPointer: { type: 'shadow' },
    formatter: p => {
      const extra = { '中国': '26.1%', '北美': '14.5%', '北欧': '9.9%', '非洲及其他亚太': '5.6%', '发达亚洲': '10.4%', '南欧': '11.5%', '拉美': '5.4%' };
      return `${p[0].name}<br/>AI贡献：<b>${p[0].value}</b> 万亿美元<br/>拉动GDP幅度：<b>${extra[p[0].name] || '-'}</b>`;
    }
  }),
  grid: { left: 120, right: 70, top: 44, bottom: 30 },
  xAxis: { type: 'value', name: '万亿美元', nameTextStyle: { color: '#8fa3c8' }, ...axisStyle() },
  yAxis: {
    type: 'category',
    data: ['拉美', '南欧', '发达亚洲', '非洲及其他亚太', '北欧', '北美', '中国'],
    ...axisStyle(), splitLine: { show: false }
  },
  series: [{
    type: 'bar',
    barWidth: '55%',
    data: [
      { value: 0.5 }, { value: 0.7 }, { value: 0.9 }, { value: 1.2 }, { value: 1.8 }, { value: 3.7 },
      {
        value: 7.0,
        itemStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [{ offset: 0, color: '#ff7a90' }, { offset: 1, color: '#ff4d6d' }]
          },
          borderRadius: [0, 8, 8, 0], shadowColor: 'rgba(255,77,109,.5)', shadowBlur: 20
        }
      }
    ],
    label: {
      show: true, position: 'right', color: '#e8f0ff',
      formatter: v => `$${v.value}T`
    },
    itemStyle: { borderRadius: [0, 8, 8, 0], color: 'rgba(120,170,255,.4)' },
    animationDelay: i => i * 140
  }],
  graphic: [{
    type: 'text', right: 40, top: 32,
    style: { text: '中国将成为AI最大受益经济体', fill: '#ff7a90', fontSize: 13, fontWeight: 700 }
  }]
});

/* ---------- 8. 行业赋能气泡图 ---------- */
makeChart('chartBubble', {
  tooltip: Object.assign({}, tooltipBase, {
    formatter: p => `<b>${p.data[3]}</b><br/>AI渗透度：${p.data[0]}<br/>年增速：${p.data[1]}%<br/>AI相关市场规模：约${p.data[2]}万亿元`
  }),
  grid: { left: 70, right: 50, top: 58, bottom: 60 },
  xAxis: {
    type: 'value', name: 'AI渗透度（%）', min: 30, max: 95,
    nameLocation: 'middle', nameGap: 32,
    nameTextStyle: { color: '#8fa3c8', fontSize: 13 }, ...axisStyle()
  },
  yAxis: {
    type: 'value', name: 'AI应用年增速（%）', min: 20, max: 50,
    nameTextStyle: { color: '#8fa3c8', fontSize: 13 }, ...axisStyle()
  },
  series: [{
    type: 'scatter',
    data: [
      [65, 35, 3.2, '制造'], [58, 42, 0.8, '医疗'], [82, 30, 0.6, '金融'],
      [62, 38, 0.5, '交通'], [40, 45, 0.2, '农业'], [52, 33, 0.4, '能源'],
      [60, 28, 0.7, '零售'], [55, 40, 0.3, '教育']
    ],
    symbolSize: d => Math.sqrt(d[2]) * 52 + 14,
    label: {
      show: true, formatter: p => p.data[3],
      color: '#fff', fontWeight: 700, fontSize: 14, position: 'inside'
    },
    itemStyle: {
      color: p => PALETTE[p.dataIndex % PALETTE.length],
      opacity: .78, shadowBlur: 20, shadowColor: 'rgba(0,229,255,.35)'
    },
    markLine: {
      silent: true, symbol: 'none',
      lineStyle: { type: 'dashed', color: 'rgba(255,213,79,.5)' },
      label: { color: '#ffd54f', fontSize: 11 },
      data: [
        { xAxis: 62, label: { formatter: '平均渗透度≈62%' } },
        { yAxis: 36, label: { formatter: '平均增速≈36%' } }
      ]
    },
    animationDuration: 1600
  }]
});

/* ---------- 9. 桑基图：AI 如何转化为新质生产力 ---------- */
makeChart('chartSankey', {
  tooltip: Object.assign({}, tooltipBase, { trigger: 'item', triggerOn: 'mousemove' }),
  series: [{
    type: 'sankey',
    left: 50, right: 150, top: 38, bottom: 24,
    nodeWidth: 20, nodeGap: 16,
    emphasis: { focus: 'adjacency' },
    lineStyle: { color: 'gradient', curveness: .5, opacity: .32 },
    label: { color: '#e8f0ff', fontSize: 13, fontWeight: 700 },
    levels: [
      { depth: 0, itemStyle: { color: '#3d7bff' } },
      { depth: 1, itemStyle: { color: '#00e5ff' } },
      { depth: 2, itemStyle: { color: '#8b5cf6' } },
      { depth: 3, itemStyle: { color: '#ffd54f' } }
    ],
    data: [
      { name: '数据要素' }, { name: '算力底座' }, { name: '算法创新' },
      { name: '感知智能' }, { name: '认知智能' }, { name: '决策智能' }, { name: '生成式创造' },
      { name: '质量变革' }, { name: '效率变革' }, { name: '动力变革' },
      { name: '新质生产力' }
    ],
    links: [
      { source: '数据要素', target: '感知智能', value: 8 },
      { source: '数据要素', target: '认知智能', value: 10 },
      { source: '算力底座', target: '认知智能', value: 8 },
      { source: '算力底座', target: '生成式创造', value: 6 },
      { source: '算法创新', target: '认知智能', value: 8 },
      { source: '算法创新', target: '决策智能', value: 6 },
      { source: '算法创新', target: '生成式创造', value: 5 },
      { source: '感知智能', target: '效率变革', value: 8 },
      { source: '认知智能', target: '质量变革', value: 8 },
      { source: '认知智能', target: '效率变革', value: 6 },
      { source: '决策智能', target: '质量变革', value: 6 },
      { source: '决策智能', target: '动力变革', value: 6 },
      { source: '生成式创造', target: '动力变革', value: 8 },
      { source: '质量变革', target: '新质生产力', value: 20 },
      { source: '效率变革', target: '新质生产力', value: 22 },
      { source: '动力变革', target: '新质生产力', value: 19 }
    ],
    animationDuration: 2000
  }]
});

/* ---------- 10. 力导向图谱：中国AI产业生态 ---------- */
makeChart('chartGraph', {
  tooltip: Object.assign({}, tooltipBase, {
    formatter: p => p.dataType === 'node' ? `<b>${p.data.name}</b><br/>${p.data.desc || ''}` : ''
  }),
  legend: {
    data: ['核心引擎', '基础层', '技术层', '应用层'],
    textStyle: { color: '#8fa3c8' },
    bottom: 8,
    icon: 'circle'
  },
  series: [{
    type: 'graph',
    layout: 'force',
    roam: true,
    draggable: true,
    categories: [
      { name: '核心引擎', itemStyle: { color: '#ffd54f' } },
      { name: '基础层', itemStyle: { color: '#3d7bff' } },
      { name: '技术层', itemStyle: { color: '#00e5ff' } },
      { name: '应用层', itemStyle: { color: '#8b5cf6' } }
    ],
    force: { repulsion: 260, edgeLength: [46, 110], gravity: .1 },
    label: { show: true, color: '#fff', fontSize: 12, fontWeight: 700 },
    lineStyle: { color: 'rgba(0,229,255,.35)', width: 1.4, curveness: .08 },
    emphasis: { focus: 'adjacency', lineStyle: { width: 3 }, label: { fontSize: 14 } },
    data: [
      { name: '人工智能', category: 0, symbolSize: 72, desc: '新质生产力的核心引擎', label: { fontSize: 16 } },
      { name: 'AI芯片', category: 1, symbolSize: 40, desc: '智能算力的硬件根基' },
      { name: '开发框架', category: 1, symbolSize: 38, desc: '国产深度学习框架加速成长' },
      { name: '通用大模型', category: 1, symbolSize: 44, desc: '302款生成式AI服务完成备案' },
      { name: '智算中心', category: 1, symbolSize: 40, desc: '全国60余个智算中心（2023）' },
      { name: '数据要素', category: 1, symbolSize: 38, desc: '"数据要素×"三年行动' },
      { name: '机器学习', category: 2, symbolSize: 34 },
      { name: '计算机视觉', category: 2, symbolSize: 34 },
      { name: '自然语言处理', category: 2, symbolSize: 34 },
      { name: '智能语音', category: 2, symbolSize: 32 },
      { name: '具身智能', category: 2, symbolSize: 34, desc: '2025年被称为具身智能元年' },
      { name: '智能制造', category: 3, symbolSize: 40 },
      { name: '智慧医疗', category: 3, symbolSize: 36 },
      { name: '智慧农业', category: 3, symbolSize: 36 },
      { name: '智慧交通', category: 3, symbolSize: 36 },
      { name: '智慧金融', category: 3, symbolSize: 36 },
      { name: '智慧能源', category: 3, symbolSize: 36 }
    ],
    links: [
      { source: '人工智能', target: 'AI芯片' }, { source: '人工智能', target: '开发框架' },
      { source: '人工智能', target: '通用大模型' }, { source: '人工智能', target: '智算中心' },
      { source: '人工智能', target: '数据要素' },
      { source: '人工智能', target: '机器学习' }, { source: '人工智能', target: '计算机视觉' },
      { source: '人工智能', target: '自然语言处理' }, { source: '人工智能', target: '智能语音' },
      { source: '人工智能', target: '具身智能' },
      { source: '通用大模型', target: '自然语言处理' }, { source: 'AI芯片', target: '智算中心' },
      { source: '数据要素', target: '机器学习' },
      { source: '机器学习', target: '智能制造' }, { source: '计算机视觉', target: '智能制造' },
      { source: '计算机视觉', target: '智慧医疗' }, { source: '自然语言处理', target: '智慧医疗' },
      { source: '计算机视觉', target: '智慧农业' }, { source: '机器学习', target: '智慧农业' },
      { source: '计算机视觉', target: '智慧交通' }, { source: '具身智能', target: '智慧交通' },
      { source: '自然语言处理', target: '智慧金融' }, { source: '机器学习', target: '智慧金融' },
      { source: '机器学习', target: '智慧能源' }, { source: '智能语音', target: '智慧金融' },
      { source: '具身智能', target: '智能制造' }
    ],
    animationDuration: 2000
  }]
});

/* ---------- 11. 环形图：算力结构 ---------- */
makeChart('chartComputePie', {
  tooltip: Object.assign({}, tooltipBase, { trigger: 'item' }),
  series: [{
    type: 'pie',
    radius: ['52%', '74%'],
    center: ['50%', '48%'],
    avoidLabelOverlap: true,
    itemStyle: { borderColor: '#0a1128', borderWidth: 4, borderRadius: 8 },
    label: { color: '#c7d6f5', fontSize: 13, formatter: '{b}\n{d}%' },
    data: [
      {
        value: 30.4, name: '智能算力',
        itemStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 1, y2: 1,
            colorStops: [{ offset: 0, color: '#00e5ff' }, { offset: 1, color: '#8b5cf6' }]
          },
          shadowColor: 'rgba(0,229,255,.5)', shadowBlur: 24
        }
      },
      { value: 69.6, name: '通用/超算算力', itemStyle: { color: 'rgba(120,170,255,.28)' } }
    ],
    animationDuration: 1600
  }],
  graphic: [{
    type: 'text', left: 'center', top: '42%',
    style: { text: '智能算力\n占比超30%', textAlign: 'center', fill: '#fff', fontSize: 20, fontWeight: 900, lineHeight: 28 }
  }]
});

/* ---------- 12. 仪表盘：工业机器人全球占比 ---------- */
makeChart('chartRobotGauge', {
  series: [{
    type: 'gauge',
    startAngle: 210, endAngle: -30,
    min: 0, max: 100,
    radius: '88%', center: ['50%', '56%'],
    progress: {
      show: true, width: 16, roundCap: true,
      itemStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [{ offset: 0, color: '#3d7bff' }, { offset: 1, color: '#00e5ff' }]
        },
        shadowColor: 'rgba(0,229,255,.6)', shadowBlur: 16
      }
    },
    axisLine: { roundCap: true, lineStyle: { width: 16, color: [[1, 'rgba(120,170,255,.12)']] } },
    pointer: { show: false },
    axisTick: { show: false },
    splitLine: { show: false },
    axisLabel: { show: false },
    title: { offsetCenter: [0, '38%'], color: '#8fa3c8', fontSize: 13 },
    detail: {
      valueAnimation: true,
      formatter: '{value}%',
      color: '#00e5ff', fontSize: 40, fontWeight: 900,
      offsetCenter: [0, '-4%']
    },
    data: [{ value: 51, name: '中国工业机器人装机量占全球比重\n（连续10余年世界第一）' }],
    animationDuration: 2000
  }]
});

/* ---------- 自适应 ---------- */
window.addEventListener('resize', () => chartInstances.forEach(c => c.resize()));
