/* ============================================================
   Visual Pandas Lab · 图表渲染（ECharts）
   ============================================================ */
(function () {
  const PAL = ['#4F46E5', '#0EA5A4', '#F59E0B', '#EC4899', '#10B981', '#6366F1', '#EF4444', '#8B5CF6'];
  const T = (k, v) => window.I18N.t(k, v);

  function toolbox() {
    return {
      right: 10, top: 2, itemSize: 14, itemGap: 6,
      feature: {
        saveAsImage: { pixelRatio: 2 },
        dataView: { readOnly: true },
        restore: {},
      },
    };
  }
  function baseGrid() {
    return { left: 58, right: 28, top: 66, bottom: 56, containLabel: true };
  }
  function chartTitle(text) {
    return { text: text, left: 10, top: 10, textStyle: { fontSize: 13, fontWeight: 600, color: '#1e293b' } };
  }

  function groupRows(df, xKey, yKeys, agg) {
    const map = new Map();
    const order = [];
    df.rows.forEach(r => {
      const k = r[xKey] == null ? '(null)' : String(r[xKey]);
      if (!map.has(k)) { map.set(k, []); order.push(k); }
      map.get(k).push(r);
    });
    return order.map(k => {
      const rs = map.get(k);
      const o = { key: k };
      yKeys.forEach(y => { o[y] = window.PE.applyAgg(rs.map(r => r[y]), agg); });
      return o;
    });
  }

  function xLabel(df, key, rawKey) {
    const c = window.PE.colOf(df, key);
    const v = window.PE.disp(df, key, rawKey);
    return v == null ? T('grid.nullVal') : String(v);
  }

  function render(dom, df, cfg) {
    if (!dom) return;
    if (typeof echarts === 'undefined') { dom.innerHTML = ''; return; }
    let chart = echarts.getInstanceByDom(dom);
    if (!chart) chart = echarts.init(dom, null, { renderer: 'canvas' });

    if (!df || !df.rows.length || !df.cols.length) {
      chart.clear();
      chart.setOption({
        title: { text: T('chart_.noData'), left: 'center', top: 'middle', textStyle: { color: '#94a3b8', fontSize: 14 } },
      });
      return;
    }

    const type = cfg.type || 'bar';
    const opt = {
      color: PAL,
      textStyle: { fontFamily: 'system-ui, "Microsoft YaHei", sans-serif' },
      grid: baseGrid(),
      toolbox: toolbox(),
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, confine: true },
      legend: { top: 38, type: 'scroll', textStyle: { fontSize: 11 } },
    };

    try {
      if (type === 'heat') buildHeat(opt, df, cfg);
      else if (type === 'hist') buildHist(opt, df, cfg);
      else if (type === 'box') buildBox(opt, df, cfg);
      else if (type === 'pie') buildPie(opt, df, cfg);
      else if (type === 'scatter') buildScatter(opt, df, cfg);
      else buildCartesian(opt, df, cfg);
    } catch (e) {
      chart.clear();
      chart.setOption({
        title: { text: T('chart_.pickHint'), left: 'center', top: 'middle', textStyle: { color: '#94a3b8', fontSize: 14 } },
      });
      return;
    }
    chart.setOption(opt, true);
    chart.resize();
  }

  function titleOf(df, cfg) {
    if (cfg.title) return cfg.title;
    const x = window.PE.colOf(df, cfg.x), y = window.PE.colOf(df, (cfg.ys || [])[0]);
    const agg = cfg.agg && cfg.agg !== 'none' ? window.PE.aggLabel(cfg.agg) : '';
    return T('chart_.autoTitle', { agg, y: y ? window.PE.label(y) : '', x: x ? window.PE.label(x) : '' });
  }

  function buildCartesian(opt, df, cfg) {
    const xCol = window.PE.colOf(df, cfg.x);
    const yCols = (cfg.ys || []).map(k => window.PE.colOf(df, k)).filter(Boolean);
    if (!xCol || !yCols.length) throw new Error('need fields');
    const agg = cfg.agg && cfg.agg !== 'none' ? cfg.agg : null;
    let items;
    if (agg) {
      items = groupRows(df, cfg.x, yCols.map(c => c.key), agg);
      items.sort((a, b) => (window.PE.toNum(b[yCols[0].key]) || 0) - (window.PE.toNum(a[yCols[0].key]) || 0));
    } else {
      items = df.rows.map(r => {
        const o = { key: r[cfg.x] == null ? '(null)' : String(r[cfg.x]) };
        yCols.forEach(c => { o[c.key] = window.PE.toNum(r[c.key]); });
        return o;
      });
    }
    const n = Math.max(1, parseInt(cfg.topN, 10) || 20);
    if (items.length > n) items = items.slice(0, n);

    const cats = items.map(it => xLabel(df, cfg.x, it.key));
    const y2Col = cfg.y2 && cfg.y2 !== 'none' && cfg.y2 !== cfg.ys[0] ? window.PE.colOf(df, cfg.y2) : null;
    const stack = !!cfg.stack && (cfg.type === 'bar' || cfg.type === 'area');
    const series = yCols.map((c, i) => ({
      name: window.PE.label(c),
      type: cfg.type === 'area' ? 'line' : cfg.type,
      smooth: cfg.type === 'line' || cfg.type === 'area',
      stack: stack ? 'total' : undefined,
      areaStyle: cfg.type === 'area' ? { opacity: 0.22 } : undefined,
      barMaxWidth: 32,
      itemStyle: { borderRadius: !stack && cfg.type === 'bar' ? [4, 4, 0, 0] : 0 },
      emphasis: { focus: 'series' },
      data: items.map(it => it[c.key]),
    }));
    if (y2Col) {
      series.push({
        name: window.PE.label(y2Col) + (window.I18N.lang === 'zh' ? '（右轴）' : ' (right)'),
        type: cfg.type === 'bar' ? 'line' : (cfg.type === 'area' ? 'line' : cfg.type),
        yAxisIndex: 1,
        smooth: true, symbolSize: 6,
        itemStyle: { color: PAL[1] },
        data: items.map(it => it[y2Col.key]),
      });
    }
    opt.tooltip = { trigger: 'axis', axisPointer: { type: 'shadow' }, confine: true };
    opt.legend = Object.assign({}, opt.legend, { data: series.map(s => s.name) });
    opt.xAxis = { type: 'category', data: cats, name: window.PE.label(xCol), nameLocation: 'middle', nameGap: 28, axisLabel: { interval: 'auto', rotate: cats.length > 12 ? 30 : 0, fontSize: 11, hideOverlap: true }, nameTextStyle: { fontSize: 11 } };
    const yAxis = [{ type: 'value', name: agg ? window.PE.aggLabel(agg) : '', scale: false, axisLabel: { fontSize: 11 }, nameTextStyle: { fontSize: 11 }, splitLine: { lineStyle: { type: 'dashed', color: '#EEF2F7' } } }];
    if (y2Col) {
      yAxis.push({ type: 'value', name: window.PE.label(y2Col), position: 'right', axisLabel: { fontSize: 11 }, nameTextStyle: { fontSize: 11 }, splitLine: { show: false } });
      opt.grid.right = 58;
    }
    opt.yAxis = yAxis;
    opt.series = series;
    opt.title = { text: titleOf(df, cfg), left: 10, top: 10, textStyle: { fontSize: 13, fontWeight: 600, color: '#1e293b' } };
    if (cats.length > 24) {
      opt.dataZoom = [{ type: 'inside' }, { type: 'slider', height: 14, bottom: 22 }];
      opt.grid.bottom = 62;
    }
  }

  function buildPie(opt, df, cfg) {
    const xCol = window.PE.colOf(df, cfg.x);
    const yCol = window.PE.colOf(df, (cfg.ys || [])[0]);
    if (!xCol || !yCol) throw new Error('need fields');
    const agg = cfg.agg && cfg.agg !== 'none' ? cfg.agg : 'sum';
    let items = groupRows(df, cfg.x, [yCol.key], agg);
    items.sort((a, b) => (window.PE.toNum(b[yCol.key]) || 0) - (window.PE.toNum(a[yCol.key]) || 0));
    const n = Math.max(1, parseInt(cfg.topN, 10) || 10);
    if (items.length > n) items = items.slice(0, n);
    opt.tooltip = { trigger: 'item', formatter: '{b}: {c} ({d}%)', confine: true };
    opt.legend = { type: 'scroll', bottom: 6, top: 'auto', textStyle: { fontSize: 11 } };
    opt.series = [{
      type: 'pie', radius: ['38%', '66%'], center: ['50%', '52%'],
      itemStyle: { borderColor: '#fff', borderWidth: 2 },
      label: { fontSize: 11, formatter: '{b} {d}%' },
      data: items.map(it => ({ name: xLabel(df, cfg.x, it.key), value: it[yCol.key] == null ? 0 : it[yCol.key] })),
    }];
    opt.grid = undefined;
    opt.title = { text: titleOf(df, cfg), left: 10, top: 10, textStyle: { fontSize: 13, fontWeight: 600, color: '#1e293b' } };
  }

  function buildScatter(opt, df, cfg) {
    const xCol = window.PE.colOf(df, cfg.x);
    const yCol = window.PE.colOf(df, (cfg.ys || [])[0]);
    if (!xCol || !yCol) throw new Error('need fields');
    const gKey = cfg.group && cfg.group !== 'none' ? cfg.group : null;

    if (xCol.dtype !== 'number') {
      /* 类目型 X（日期/地区等）：按类目聚合后画散点，等价 groupby(X)[Y].agg() */
      const agg = cfg.agg && cfg.agg !== 'none' ? cfg.agg : 'sum';
      const n = Math.max(1, parseInt(cfg.topN, 10) || 20);
      let items = groupRows(df, cfg.x, [yCol.key], agg);
      items.sort((a, b) => (window.PE.toNum(b[yCol.key]) || 0) - (window.PE.toNum(a[yCol.key]) || 0));
      items = items.slice(0, n);
      const cats = items.map(it => xLabel(df, cfg.x, it.key));
      if (gKey) {
        const gLabels = Array.from(new Set(df.rows.map(r => xLabel(df, gKey, r[gKey] == null ? '(null)' : String(r[gKey])))));
        opt.legend = Object.assign({}, opt.legend, { data: gLabels });
        opt.series = gLabels.map(g => ({
          name: g, type: 'scatter', symbolSize: 12, itemStyle: { opacity: 0.85 },
          data: items.map(it => {
            const rs = df.rows.filter(r => String(r[cfg.x]) === it.key
              && xLabel(df, gKey, r[gKey] == null ? '(null)' : String(r[gKey])) === g);
            const v = rs.length ? window.PE.applyAgg(rs.map(r => r[yCol.key]), agg) : null;
            return [xLabel(df, cfg.x, it.key), v == null ? null : v];
          }),
        }));
      } else {
        opt.legend = { show: false };
        opt.series = [{
          name: window.PE.label(yCol), type: 'scatter', symbolSize: 13,
          itemStyle: { opacity: 0.8, color: PAL[0] },
          data: items.map(it => [xLabel(df, cfg.x, it.key), it[yCol.key]]),
        }];
      }
      opt.tooltip = { trigger: 'item', confine: true, formatter: p => p.seriesName + '<br/>' + p.value[0] + ' · ' + window.PE.aggLabel(agg) + ': ' + p.value[1] };
      opt.xAxis = { type: 'category', data: cats, name: window.PE.label(xCol), nameLocation: 'middle', nameGap: 28, axisLabel: { fontSize: 11, rotate: cats.length > 8 ? 25 : 0, hideOverlap: true } };
      opt.yAxis = { type: 'value', name: window.PE.label(yCol), axisLabel: { fontSize: 11 }, splitLine: { lineStyle: { type: 'dashed', color: '#EEF2F7' } } };
    } else {
      const pts = df.rows.map(r => {
        const xv = window.PE.toNum(r[cfg.x]), yv = window.PE.toNum(r[yCol.key]);
        return { xv, yv, g: gKey ? window.PE.disp(df, gKey, r[gKey]) : null };
      }).filter(p => p.xv !== null && p.yv !== null);
      if (gKey) {
        const groups = Array.from(new Set(pts.map(p => String(p.g))));
        opt.legend = Object.assign({}, opt.legend, { data: groups });
        opt.series = groups.map((g, i) => ({
          name: g, type: 'scatter', symbolSize: 9,
          itemStyle: { opacity: 0.78 },
          data: pts.filter(p => String(p.g) === g).map(p => [p.xv, p.yv]),
        }));
      } else {
        opt.legend = { show: false };
        opt.series = [{ type: 'scatter', symbolSize: 9, itemStyle: { opacity: 0.72 }, data: pts.map(p => [p.xv, p.yv]) }];
      }
      opt.tooltip = { trigger: 'item', confine: true, formatter: p => (p.seriesName ? p.seriesName + '<br/>' : '') + 'x: ' + p.value[0] + '<br/>y: ' + p.value[1] };
      opt.xAxis = { type: 'value', name: window.PE.label(xCol), nameLocation: 'middle', nameGap: 26, axisLabel: { fontSize: 11 }, splitLine: { lineStyle: { type: 'dashed', color: '#EEF2F7' } } };
      opt.yAxis = { type: 'value', name: window.PE.label(yCol), axisLabel: { fontSize: 11 }, splitLine: { lineStyle: { type: 'dashed', color: '#EEF2F7' } } };
    }
    opt.title = chartTitle(cfg.title || (xCol.dtype === 'number'
      ? T('chart_.scatterTitle', { y: window.PE.label(yCol), x: window.PE.label(xCol) })
      : titleOf(df, cfg)));
  }

  function buildHist(opt, df, cfg) {
    const c = window.PE.colOf(df, cfg.x);
    if (!c) throw new Error('need fields');
    const vals = window.PE.nums(df, cfg.x);
    if (!vals.length) {
      /* 非数值列：自动退化为 value_counts 频数条形图（等价 df[col].value_counts()） */
      const counts = new Map(); const order = [];
      df.rows.forEach(r => {
        const k = r[cfg.x] == null ? '(null)' : String(r[cfg.x]);
        if (!counts.has(k)) { counts.set(k, 0); order.push(k); }
        counts.set(k, counts.get(k) + 1);
      });
      const items = order.map(k => ({ k, v: counts.get(k) }))
        .sort((a, b) => b.v - a.v).slice(0, 30);
      const cats = items.map(it => xLabel(df, cfg.x, it.k));
      opt.tooltip = { trigger: 'axis', axisPointer: { type: 'shadow' }, confine: true };
      opt.legend = { show: false };
      opt.series = [{
        name: T('profile.sFreq'), type: 'bar', barMaxWidth: 32,
        itemStyle: { borderRadius: [4, 4, 0, 0], color: PAL[0] },
        data: items.map(it => it.v),
      }];
      opt.xAxis = { type: 'category', data: cats, name: window.PE.label(c), nameLocation: 'middle', nameGap: 28, axisLabel: { fontSize: 11, rotate: cats.length > 8 ? 25 : 0, hideOverlap: true } };
      opt.yAxis = { type: 'value', name: T('profile.sFreq'), axisLabel: { fontSize: 11 }, splitLine: { lineStyle: { type: 'dashed', color: '#EEF2F7' } } };
      opt.title = chartTitle(cfg.title || T('chart_.histVc', { col: window.PE.label(c) }));
      return;
    }
    const bins = Math.max(3, Math.min(40, parseInt(cfg.bins, 10) || 12));
    const mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals);
    const step = (mx - mn) / bins || 1;
    const counts = new Array(bins).fill(0);
    vals.forEach(v => {
      let i = Math.floor((v - mn) / step);
      if (i >= bins) i = bins - 1; if (i < 0) i = 0;
      counts[i]++;
    });
    const labels = counts.map((_, i) => (mn + step * i).toFixed(step < 1 ? 2 : 0));
    opt.tooltip = { trigger: 'axis', axisPointer: { type: 'shadow' }, confine: true };
    opt.legend = { show: false };
    opt.series = [{
      name: T('profile.sFreq'), type: 'bar', barMaxWidth: 28,
      itemStyle: { borderRadius: [4, 4, 0, 0], color: PAL[0] },
      data: counts,
    }];
    opt.xAxis = { type: 'category', data: labels, name: window.PE.label(c), nameLocation: 'middle', nameGap: 28, axisLabel: { fontSize: 10, interval: Math.ceil(bins / 12), hideOverlap: true } };
    opt.yAxis = { type: 'value', name: T('profile.sFreq'), axisLabel: { fontSize: 11 }, splitLine: { lineStyle: { type: 'dashed', color: '#EEF2F7' } } };
    opt.title = chartTitle(cfg.title || T('chart_.histTitle', { col: window.PE.label(c) }));
  }

  function buildBox(opt, df, cfg) {
    const xCol = window.PE.colOf(df, cfg.x);
    const yCol = window.PE.colOf(df, (cfg.ys || [])[0]);
    if (!xCol || !yCol) throw new Error('need fields');
    const map = new Map(); const order = [];
    df.rows.forEach(r => {
      const k = r[cfg.x] == null ? '(null)' : String(r[cfg.x]);
      if (!map.has(k)) { map.set(k, []); order.push(k); }
      const v = window.PE.toNum(r[yCol.key]);
      if (v !== null) map.get(k).push(v);
    });
    const cats = order.slice(0, 24).map(k => xLabel(df, cfg.x, k));
    const data = order.slice(0, 24).map(k => {
      const a = map.get(k).slice().sort((x, y) => x - y);
      if (!a.length) return [0, 0, 0, 0, 0];
      const q = p => Number(window.PE.quantile(a, p).toFixed(2));
      return [q(0), q(0.25), q(0.5), q(0.75), q(1)];
    });
    opt.tooltip = { trigger: 'item', confine: true };
    opt.legend = { show: false };
    opt.series = [{ name: window.PE.label(yCol), type: 'boxplot', data, itemStyle: { borderColor: PAL[0], color: 'rgba(79,70,229,0.14)' } }];
    opt.xAxis = { type: 'category', data: cats, axisLabel: { fontSize: 11, rotate: cats.length > 8 ? 25 : 0, hideOverlap: true } };
    opt.yAxis = { type: 'value', name: window.PE.label(yCol), axisLabel: { fontSize: 11 }, splitLine: { lineStyle: { type: 'dashed', color: '#EEF2F7' } } };
    opt.title = { text: cfg.title || (T('chart_.boxTitle', { y: window.PE.label(yCol), x: window.PE.label(xCol) })), left: 10, top: 10, textStyle: { fontSize: 13, fontWeight: 600, color: '#1e293b' } };
  }

  function buildHeat(opt, df, cfg) {
    const mode = cfg.heatMode || 'corr';
    let xCats, yCats, data, min = 0, max = 0, name;
    if (mode === 'corr') {
      const cm = window.PE.corr(df);
      if (cm.cols.length < 2) throw new Error('need 2 numeric');
      xCats = cm.cols.map(c => window.PE.label(c));
      yCats = cm.cols.map(c => window.PE.label(c));
      data = [];
      cm.mat.forEach((row, i) => row.forEach((v, j) => { data.push([j, i, v == null ? '-' : v]); }));
      min = -1; max = 1; name = T('profile.corrTitle');
    } else {
      const xCol = window.PE.colOf(df, cfg.x);
      const yCol = window.PE.colOf(df, (cfg.ys || [])[0]);
      const vCol = window.PE.colOf(df, cfg.value);
      if (!xCol || !yCol || !vCol) throw new Error('need fields');
      const agg = cfg.agg && cfg.agg !== 'none' ? cfg.agg : 'sum';
      const xs = Array.from(new Set(df.rows.map(r => String(r[cfg.x])))).slice(0, 24);
      const ys = Array.from(new Set(df.rows.map(r => String(r[yCol.key])))).slice(0, 24);
      xCats = xs.map(v => xLabel(df, cfg.x, v));
      yCats = ys.map(v => xLabel(df, yCol.key, v));
      data = [];
      ys.forEach((y, yi) => {
        xs.forEach((x, xi) => {
          const rs = df.rows.filter(r => String(r[cfg.x]) === x && String(r[yCol.key]) === y);
          const v = window.PE.applyAgg(rs.map(r => r[vCol.key]), agg);
          if (v != null) { min = Math.min(min, v); max = Math.max(max, v); }
          data.push([xi, yi, v == null ? '-' : v]);
        });
      });
      name = T('chart_.hMatrix');
    }
    opt.tooltip = { position: 'top', confine: true, formatter: p => (p.value[2] === '-' ? '-' : p.value[2]) };
    opt.legend = { show: false };
    opt.grid = { left: 90, right: 30, top: 66, bottom: 76 };
    opt.xAxis = { type: 'category', data: xCats, splitArea: { show: true }, axisLabel: { fontSize: 10, rotate: 30, hideOverlap: true } };
    opt.yAxis = { type: 'category', data: yCats, splitArea: { show: true }, axisLabel: { fontSize: 10 } };
    opt.visualMap = {
      min, max, calculable: true, orient: 'horizontal', left: 'center', bottom: 6, itemHeight: 90,
      inRange: { color: ['#3B82F6', '#E0F2FE', '#F97316'] },
      textStyle: { fontSize: 10 },
    };
    opt.series = [{
      name, type: 'heatmap', data,
      label: { show: xCats.length <= 8 && yCats.length <= 8, fontSize: 10 },
      emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.2)' } },
    }];
    opt.title = { text: cfg.title || name, left: 10, top: 10, textStyle: { fontSize: 13, fontWeight: 600, color: '#1e293b' } };
  }

  window.PCHARTS = { render, PAL };
})();
