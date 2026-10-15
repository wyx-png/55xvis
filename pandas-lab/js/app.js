/* ============================================================
   Visual Pandas Lab · 主程序
   ============================================================ */
(function () {
  const T = (k, v) => window.I18N.t(k, v);
  const PE = () => window.PE;
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

  const MODULES = [
    { id: 'load', ico: '⬆' }, { id: 'inspect', ico: '🔍' }, { id: 'select', ico: '⌗' }, { id: 'clean', ico: '🧹' },
    { id: 'transform', ico: 'ƒ' }, { id: 'group', ico: 'Σ' }, { id: 'combine', ico: '⋈' }, { id: 'export', ico: '⬇' },
  ];

  const State = {
    base: null, df2: null, cur: null, steps: [],
    module: 'load', tab: 'data', report: null,
    grid: { page: 1, size: 25, sortKey: null, sortDir: 1, search: '' },
    chart: { type: 'bar', x: null, ys: [], agg: 'sum', group: 'none', topN: 20, title: '', heatMode: 'corr', value: null, bins: 12, y2: 'none', stack: false },
    conds: [],
    sel: {},      // 面板列选择：sel[group] = Set
    form: {},     // 面板表单值：form[module][field]
    pasteTarget: 'main',
  };

  const F = (mod, field, def) => {
    State.form[mod] = State.form[mod] || {};
    if (State.form[mod][field] === undefined) State.form[mod][field] = def;
    return State.form[mod][field];
  };
  const S = group => {
    if (!State.sel[group]) State.sel[group] = new Set();
    return State.sel[group];
  };
  const selArr = group => Array.from(S(group));

  /* ================= 数据载入 ================= */
  function setBase(df, keepSteps) {
    State.base = df;
    if (!keepSteps) State.steps = [];
    State.sel = {};      /* 换数据集后清空列选择 */
    State.conds = [];
    State.grid.page = 1;
    State.grid.sortKey = null;
    State.report = null;
    recompute();
    autoChartFields();
    renderAll();
  }
  function recompute() {
    State.cur = State.base ? PE().runPipeline(State.base, State.steps) : null;
  }
  function autoChartFields() {
    const df = State.cur;
    if (!df || !df.cols.length) return;
    const keys = new Set(df.cols.map(c => c.key));
    let x = df.cols.find(c => c.dtype === 'string' && c.map);
    if (!x) x = df.cols.find(c => c.dtype === 'string' || c.dtype === 'date');
    if (!x) x = df.cols[0];
    const y = df.cols.filter(c => c.dtype === 'number');
    State.chart.x = x ? x.key : null;
    State.chart.ys = y.slice(0, 1).map(c => c.key);
    State.chart.group = 'none';
    if (!State.chart.agg) State.chart.agg = 'sum';
    if (!keys.has(State.chart.value)) State.chart.value = null;
  }
  function ensureChartFields() {
    const df = State.cur; if (!df) return;
    const keys = new Set(df.cols.map(c => c.key));
    if (!keys.has(State.chart.x)) {
      const c = df.cols.find(c => c.dtype === 'string' || c.dtype === 'date');
      State.chart.x = c ? c.key : (df.cols[0] ? df.cols[0].key : null);
    }
    State.chart.ys = State.chart.ys.filter(k => keys.has(k));
    if (!State.chart.ys.length) {
      const c = df.cols.find(c => c.dtype === 'number');
      if (c) State.chart.ys = [c.key];
    }
    if (State.chart.group && !keys.has(State.chart.group)) State.chart.group = 'none';
    if (State.chart.value && !keys.has(State.chart.value)) State.chart.value = null;
  }

  /* ================= 操作应用 ================= */
  function applyOp(op, params) {
    if (!State.base) { toast(T('toast.noData'), 'err'); return; }
    try {
      const res = PE().OPS[op](State.cur, params);
      State.steps.push({ op, params, code: res.code, name: T('pipe.opNames.' + op) });
      State.cur = res.df;
      State.grid.page = 1;
      ensureChartFields();
      renderAll();
      toast(T('toast.applied', { op: T('pipe.opNames.' + op) }));
    } catch (e) {
      toast(T('toast.err', { msg: e.message || e }), 'err');
    }
  }
  function undoTo(i) {
    State.steps = State.steps.slice(0, i);
    recompute(); ensureChartFields(); renderAll();
    toast(T('toast.undone', { n: i + 1 }));
  }

  /* ================= 面板：加载 ================= */
  function panelLoad() {
    const df = State.base;
    const opts = window.DATASETS.list.map(d =>
      '<option value="' + d.id + '"' + (F('load', 'sample', 'sales') === d.id ? ' selected' : '') + '>' + T(d.nameKey) + '</option>').join('');
    return ''
      + '<h3 class="pt">⬆ ' + T('load.title') + '</h3>'
      + '<p class="pdesc">' + T('load.desc') + '</p>'
      + card(T('load.sample'), 'pd.read_csv',
        '<div class="row2"><select data-f="sample" data-mod="load">' + opts + '</select>'
        + '<button class="btn primary" data-act="loadSample">' + T('load.loadBtn') + '</button></div>')
      + card(T('load.filesCard'), 'to_csv',
        '<p class="hint" style="margin-top:0">' + T('load.filesHint') + '</p>'
        + '<div class="file-links">'
        + window.DATASETS.list.map(d =>
          '<span class="file-pair"><a class="file-link" href="sample-data/' + d.id + '-zh.csv" download>⬇ ' + esc(T(d.nameKey)) + ' · ' + T('load.zhCols') + '</a>'
          + '<a class="file-link" href="sample-data/' + d.id + '-en.csv" download>⬇ ' + esc(T(d.nameKey)) + ' · ' + T('load.enCols') + '</a></span>').join('')
        + '</div>')
      + card(T('load.upload'), 'read_csv / read_excel',
        '<div class="dropzone" data-act="pickFile" data-target="main">' + T('load.uploadHint') + '</div>')
      + card(T('load.paste'), '',
        '<textarea data-f="paste" data-mod="load" placeholder="' + esc(T('load.pastePh')) + '"></textarea>'
        + '<div class="row2" style="margin-top:8px"><button class="btn" data-act="pasteLoad">' + T('load.pasteBtn') + '</button>'
        + '<button class="btn" data-act="pasteDf2">' + T('load.loadSecond') + '</button></div>')
      + card(T('load.random'), 'DataFrame',
        '<div class="row2"><input class="input" type="number" min="10" max="2000" value="' + (F('load', 'rnd', 120) || 120) + '" data-f="rnd" data-mod="load">'
        + '<button class="btn" data-act="genRandom">' + T('load.randomBtn') + '</button></div>')
      + card(T('app.dataset'), '',
        '<div class="row2"><button class="btn" data-act="setDefault">' + T('load.setDefault') + '</button>'
        + '<button class="btn ghost" data-act="clearDefault">' + T('load.clearDefault') + '</button></div>'
        + '<p class="hint" style="margin-top:8px">' + T('load.current') + '：' + esc(datasetName(df)) + '</p>')
      + card(T('load.second'), '',
        (State.df2
          ? '<p class="hint">' + esc(datasetName(State.df2)) + ' · ' + State.df2.rows.length + ' ' + T('profile.kpiRows') + ' × ' + State.df2.cols.length + '</p>'
          : '<p class="hint">' + T('load.secondEmpty') + '</p>')
        + '<div class="row2" style="margin-top:8px"><button class="btn" data-act="pickFile" data-target="df2">' + T('combine.upload2') + '</button>'
        + '<button class="btn ghost" data-act="sampleDf2">' + T('combine.sample2') + '</button></div>'
        + (State.df2 ? '<button class="btn ghost block" style="margin-top:6px" data-act="clearDf2">' + T('load.clearSecond') + '</button>' : ''));
  }

  /* ================= 面板：检视 ================= */
  function panelInspect() {
    const df = State.cur;
    if (!df) return emptyPanel();
    const colOpts = df.cols.map(c => '<option value="' + esc(c.key) + '"' + (F('inspect', 'col', df.cols[0].key) === c.key ? ' selected' : '') + '>' + esc(PE().label(c)) + '</option>').join('');
    return ''
      + '<h3 class="pt">🔍 ' + T('inspect.title') + '</h3>'
      + '<p class="pdesc">' + T('inspect.desc') + '</p>'
      + card(T('inspect.head') + ' ✦', 'df.head',
        '<div class="row2"><input class="input" type="number" min="1" value="' + (F('inspect', 'hn', 10) || 10) + '" data-f="hn" data-mod="inspect">'
        + '<button class="btn" data-act="apply" data-op="head">' + T('inspect.apply') + '</button></div>')
      + card(T('inspect.tail') + ' ✦', 'df.tail',
        '<div class="row2"><input class="input" type="number" min="1" value="' + (F('inspect', 'tn', 10) || 10) + '" data-f="tn" data-mod="inspect">'
        + '<button class="btn" data-act="apply" data-op="tail">' + T('inspect.apply') + '</button></div>')
      + card(T('inspect.sample') + ' ✦', 'df.sample',
        '<div class="row2"><input class="input" type="number" min="1" value="' + (F('inspect', 'sn', 10) || 10) + '" data-f="sn" data-mod="inspect">'
        + '<button class="btn" data-act="apply" data-op="sample">' + T('inspect.apply') + '</button></div>')
      + card(T('inspect.look'), '',
        '<div class="field"><label>' + T('inspect.pickCol') + '</label><select data-f="col" data-mod="inspect">' + colOpts + '</select></div>'
        + '<div class="row2"><button class="btn" data-act="report" data-kind="vc">' + T('inspect.valueCounts') + '</button>'
        + '<button class="btn" data-act="report" data-kind="uniq">' + T('inspect.unique') + '</button></div>'
        + '<div class="row2" style="margin-top:6px"><button class="btn" data-act="report" data-kind="miss">' + T('inspect.missing') + '</button>'
        + '<button class="btn" data-act="report" data-kind="dup">' + T('inspect.dup') + '</button></div>'
        + '<button class="btn block" style="margin-top:6px" data-act="report" data-kind="corr">' + T('inspect.corr') + '</button>');
  }

  /* ================= 面板：选择 ================= */
  function panelSelect() {
    const df = State.cur;
    if (!df) return emptyPanel();
    const logic = F('select', 'logic', 'and');
    let condsHtml = '';
    State.conds.forEach((c, i) => {
      condsHtml += '<div class="cond-row">'
        + '<select data-act="condCol" data-i="' + i + '">' + df.cols.map(x => '<option value="' + esc(x.key) + '"' + (c.col === x.key ? ' selected' : '') + '>' + esc(PE().label(x)) + '</option>').join('') + '</select>'
        + '<select data-act="condOp" data-i="' + i + '">' + Object.keys(T('common.ops') ? window.I18N.dict[I18N.lang].common.ops : {}).map(o => '<option value="' + o + '"' + (c.op === o ? ' selected' : '') + '>' + T('common.ops.' + o) + '</option>').join('') + '</select>'
        + valueControl(df, c.col, c.value, i)
        + '<button class="cond-del" data-act="delCond" data-i="' + i + '">×</button></div>';
    });
    return ''
      + '<h3 class="pt">⌗ ' + T('select.title') + '</h3>'
      + '<p class="pdesc">' + T('select.desc') + '</p>'
      + card(T('select.keepCols'), 'df[[...]]',
        '<p class="hint" style="margin-bottom:6px">' + T('select.colsHint') + '</p>' + chipGroup('keep', df) +
        '<div class="row2" style="margin-top:8px"><button class="btn primary" data-act="apply" data-op="select">' + T('common.apply') + '</button>'
        + '<button class="btn ghost" data-act="clearSel" data-group="keep">' + T('common.none') + '</button></div>')
      + card(T('select.dropCols'), 'df.drop',
        chipGroup('drop', df) +
        '<div class="row2" style="margin-top:8px"><button class="btn primary" data-act="apply" data-op="dropcols">' + T('common.apply') + '</button>'
        + '<button class="btn ghost" data-act="clearSel" data-group="drop">' + T('common.none') + '</button></div>')
      + card(T('select.filter'), 'boolean mask',
        '<div class="field"><label>' + T('select.logic') + '</label><select data-f="logic" data-mod="select">'
        + '<option value="and"' + (logic === 'and' ? ' selected' : '') + '>' + T('select.and') + '</option>'
        + '<option value="or"' + (logic === 'or' ? ' selected' : '') + '>' + T('select.or') + '</option></select></div>'
        + condsHtml
        + '<button class="btn tiny ghost" data-act="addCond">＋ ' + T('select.addCond') + '</button>'
        + '<div id="matchedHint" class="hint" style="margin-top:6px"></div>'
        + '<button class="btn primary block" style="margin-top:8px" data-act="apply" data-op="filter">' + T('select.applyBtn') + '</button>')
      + card(T('select.range'), 'df.iloc',
        '<div class="row2"><div class="field"><label>' + T('select.start') + '</label><input class="input" type="number" min="0" value="0" data-f="istart" data-mod="select"></div>'
        + '<div class="field"><label>' + T('select.end') + '</label><input class="input" type="number" min="0" value="' + Math.min(20, df.rows.length) + '" data-f="iend" data-mod="select"></div></div>'
        + '<button class="btn primary block" data-act="apply" data-op="iloc">' + T('common.apply') + '</button>')
      + card(T('select.loc'), 'df.loc + isin',
        '<div class="field"><label>' + T('select.locCol') + '</label>' + colSelect('select', 'lcol', df, c => c.dtype !== 'number' || !!c.map) + '</div>'
        + '<div class="field"><label>' + T('select.locVals') + '</label><div class="chips">' + locValueChips(df) + '</div></div>'
        + '<button class="btn primary block" data-act="apply" data-op="loc">' + T('common.apply') + '</button>')
      + card(T('select.query'), 'df.query',
        '<div class="field"><label>' + T('select.queryExpr') + '</label><input class="input" data-f="qexpr" data-mod="select" placeholder="' + esc(T('select.queryPh')) + '"></div>'
        + '<p class="hint mono">' + esc(T('select.queryHint')) + '</p>'
        + '<button class="btn primary block" style="margin-top:8px" data-act="apply" data-op="query">' + T('common.apply') + '</button>');
  }
  /* loc 的取值多选（按当前选定列的前 30 个唯一值生成） */
  function locValueChips(df) {
    const key = F('select', 'lcol') || (df.cols.find(c => c.dtype !== 'number' || c.map) || df.cols[0]).key;
    const c = PE().colOf(df, key);
    if (!c) return '';
    const chosen = S('lvals');
    const vals = Array.from(new Set(df.rows.map(r => PE().disp(df, c.key, r[c.key])).filter(v => v != null).map(v => String(v)))).slice(0, 30);
    return vals.map(v => '<span class="chip' + (chosen.has(v) ? ' on' : '') + '" data-act="toggleSet" data-group="lvals" data-key="' + esc(v) + '">' + esc(v) + '</span>').join('');
  }

  /* 新增/切换条件时的默认值，与 valueControl 的控件形态保持一致 */
  function defVal(df, key) {
    const c = PE().colOf(df, key);
    if (!c) return '';
    if (c.map) return Object.keys(c.map)[0];
    if (c.dtype === 'bool') return 'true';
    if (c.dtype !== 'number') {
      const uniq = Array.from(new Set(df.rows.map(r => r[key]).filter(v => v != null).map(v => String(v))));
      if (uniq.length && uniq.length <= 40) return uniq[0];
    }
    return '';
  }

  function valueControl(df, colKey, value, i) {
    const c = PE().colOf(df, colKey);
    if (!c) return '<input class="input" data-act="condVal" data-i="' + i + '">';
    if (c.map) {
      return '<select data-act="condVal" data-i="' + i + '">' + Object.keys(c.map).map(k =>
        '<option value="' + esc(k) + '"' + (String(value) === k ? ' selected' : '') + '>' + esc(c.map[k][I18N.lang] || k) + '</option>').join('') + '</select>';
    }
    if (c.dtype === 'bool') {
      return '<select data-act="condVal" data-i="' + i + '"><option value="true"' + (value === 'true' ? ' selected' : '') + '>' + T('common.true_') + '</option>'
        + '<option value="false"' + (value === 'false' ? ' selected' : '') + '>' + T('common.false_') + '</option></select>';
    }
    const uniq = new Set(df.rows.map(r => r[c.key]).filter(v => v != null).map(v => String(v)));
    if (c.dtype !== 'number' && uniq.size && uniq.size <= 40) {
      return '<select data-act="condVal" data-i="' + i + '">' + Array.from(uniq).map(v =>
        '<option value="' + esc(v) + '"' + (String(value) === v ? ' selected' : '') + '>' + esc(v) + '</option>').join('') + '</select>';
    }
    return '<input class="input" type="' + (c.dtype === 'number' ? 'number' : 'text') + '" value="' + esc(value == null ? '' : value) + '" data-act="condVal" data-i="' + i + '">';
  }

  /* ================= 面板：清洗 ================= */
  function colSelect(mod, field, df, filterFn, noneLabel) {
    const list = df.cols.filter(filterFn || (() => true));
    /* 日期列优先排在前面（resample 等场景需要） */
    list.sort((a, b) => (a.dtype === 'date' ? 0 : 1) - (b.dtype === 'date' ? 0 : 1));
    const v = F(mod, field, list.length ? list[0].key : '');
    return '<select data-f="' + field + '" data-mod="' + mod + '">'
      + (noneLabel ? '<option value=""' + (v === '' ? ' selected' : '') + '>' + esc(noneLabel) + '</option>' : '')
      + list.map(c =>
      '<option value="' + esc(c.key) + '"' + (v === c.key ? ' selected' : '') + '>' + esc(PE().label(c)) + '</option>').join('') + '</select>';
  }
  function panelClean() {
    const df = State.cur; if (!df) return emptyPanel();
    const how = F('clean', 'dhow', 'any');
    return ''
      + '<h3 class="pt">🧹 ' + T('clean.title') + '</h3>'
      + '<p class="pdesc">' + T('clean.desc') + '</p>'
      + card(T('clean.dropna'), 'df.dropna',
        '<div class="field"><label>' + T('clean.dropnaHow') + '</label><select data-f="dhow" data-mod="clean">'
        + '<option value="any"' + (how === 'any' ? ' selected' : '') + '>' + T('clean.any') + '</option>'
        + '<option value="all"' + (how === 'all' ? ' selected' : '') + '>' + T('clean.all') + '</option>'
        + '<option value="subset"' + (how === 'subset' ? ' selected' : '') + '>' + T('clean.subset') + '</option></select></div>'
        + (how === 'subset' ? '<div class="field"><label>' + T('clean.subsetCols') + '</label>' + chipGroup('subset', df) + '</div>' : '')
        + '<button class="btn primary block" style="margin-top:8px" data-act="apply" data-op="dropna">' + T('common.apply') + '</button>')
      + card(T('clean.fillna'), 'df.fillna',
        '<div class="field"><label>' + T('clean.fillCol') + '</label>' + colSelect('clean', 'fcol', df) + '</div>'
        + '<div class="field"><label>' + T('clean.fillHow') + '</label><select data-f="fhow" data-mod="clean">'
        + [['mean', 'fmean'], ['median', 'fmedian'], ['mode', 'fmode'], ['zero', 'fzero'], ['ffill', 'fffill'], ['bfill', 'fbfill'], ['value', 'fvalue']]
          .map(([v, k]) => '<option value="' + v + '"' + (F('clean', 'fhow', 'mean') === v ? ' selected' : '') + '>' + T('clean.' + k) + '</option>').join('') + '</select></div>'
        + (F('clean', 'fhow', 'mean') === 'value' ? '<div class="field"><label>' + T('clean.fillVal') + '</label><input class="input" data-f="fval" data-mod="clean"></div>' : '')
        + '<button class="btn primary block" data-act="apply" data-op="fillna">' + T('common.apply') + '</button>')
      + card(T('clean.dropdup'), 'df.drop_duplicates',
        '<div class="field"><label>' + T('clean.dupCols') + '</label>' + chipGroup('dup', df) + '</div>'
        + '<div class="field"><label>' + T('clean.keep') + '</label><select data-f="keep" data-mod="clean">'
        + [['first', 'kfirst'], ['last', 'klast'], ['none', 'kneit']].map(([v, k]) => '<option value="' + v + '"' + (F('clean', 'keep', 'first') === v ? ' selected' : '') + '>' + T('clean.' + k) + '</option>').join('') + '</select></div>'
        + '<button class="btn primary block" data-act="apply" data-op="dropdup">' + T('common.apply') + '</button>')
      + card(T('clean.rename'), 'df.rename',
        '<div class="row2"><div class="field"><label>' + T('clean.oldCol') + '</label>' + colSelect('clean', 'rcol', df) + '</div>'
        + '<div class="field"><label>' + T('clean.newName') + '</label><input class="input" data-f="rname" data-mod="clean"></div></div>'
        + '<button class="btn primary block" data-act="apply" data-op="rename">' + T('common.apply') + '</button>')
      + card(T('clean.astype'), 'df.astype',
        '<div class="row2"><div class="field"><label>' + T('clean.oldCol') + '</label>' + colSelect('clean', 'acol', df) + '</div>'
        + '<div class="field"><label>' + T('clean.toType') + '</label><select data-f="atype" data-mod="clean">'
        + ['number', 'string', 'bool', 'date'].map(t => '<option value="' + t + '"' + (F('clean', 'atype', 'string') === t ? ' selected' : '') + '>' + dtypeLabel(t) + '</option>').join('') + '</select></div></div>'
        + '<button class="btn primary block" data-act="apply" data-op="astype">' + T('common.apply') + '</button>')
      + card(T('clean.replace'), 'df.replace',
        '<div class="field"><label>' + T('clean.oldCol') + '</label>' + colSelect('clean', 'pcol', df) + '</div>'
        + '<div class="row2"><div class="field"><label>' + T('clean.oldVal') + '</label><input class="input" data-f="pold" data-mod="clean"></div>'
        + '<div class="field"><label>' + T('clean.newVal') + '</label><input class="input" data-f="pnew" data-mod="clean"></div></div>'
        + '<button class="btn primary block" data-act="apply" data-op="replace">' + T('common.apply') + '</button>')
      + card(T('clean.strOps'), '.str',
        '<div class="field"><label>' + T('clean.oldCol') + '</label>' + colSelect('clean', 'scol', df, c => c.dtype === 'string') + '</div>'
        + '<div class="field"><label>' + T('clean.strFunc') + '</label><select data-f="sfn" data-mod="clean">'
        + [['trim', 'strim'], ['upper', 'supper'], ['lower', 'slower'], ['title', 'stitle'], ['slice', 'sslice'], ['len', 'slen']]
          .map(([v, k]) => '<option value="' + v + '"' + (F('clean', 'sfn', 'trim') === v ? ' selected' : '') + '>' + T('clean.' + k) + '</option>').join('') + '</select></div>'
        + (F('clean', 'sfn', 'trim') === 'slice' ? '<div class="field"><label>' + T('clean.slenN') + '</label><input class="input" type="number" value="5" data-f="sn2" data-mod="clean"></div>' : '')
        + '<button class="btn primary block" data-act="apply" data-op="str">' + T('common.apply') + '</button>');
  }

  /* ================= 面板：变换 ================= */
  function panelTransform() {
    const df = State.cur; if (!df) return emptyPanel();
    return ''
      + '<h3 class="pt">ƒ ' + T('transform.title') + '</h3>'
      + '<p class="pdesc">' + T('transform.desc') + '</p>'
      + card(T('transform.sort'), 'df.sort_values',
        '<div class="field"><label>' + T('transform.sortCols') + '</label>' + chipGroup('sortc', df) + '</div>'
        + '<div class="field"><label>' + T('transform.order') + '</label><select data-f="sord" data-mod="transform">'
        + '<option value="asc"' + (F('transform', 'sord', 'desc') === 'asc' ? ' selected' : '') + '>' + T('transform.asc') + '</option>'
        + '<option value="desc"' + (F('transform', 'sord', 'desc') === 'desc' ? ' selected' : '') + '>' + T('transform.desc2') + '</option></select></div>'
        + '<button class="btn primary block" data-act="apply" data-op="sort">' + T('common.apply') + '</button>')
      + card(T('transform.newCol'), 'df.assign',
        '<div class="field"><label>' + T('transform.newName') + '</label><input class="input" data-f="nname" data-mod="transform" placeholder="profit"></div>'
        + '<div class="field"><label>' + T('transform.expr') + '</label><input class="input" data-f="nexpr" data-mod="transform" placeholder="sales - cost"></div>'
        + '<p class="hint mono">' + esc(T('transform.exprHint')) + '</p>'
        + '<button class="btn primary block" style="margin-top:8px" data-act="apply" data-op="newcol">' + T('common.apply') + '</button>')
      + card(T('transform.apply'), '.apply',
        '<div class="row2"><div class="field"><label>' + T('clean.oldCol') + '</label>' + colSelect('transform', 'mcol', df, c => c.dtype === 'number') + '</div>'
        + '<div class="field"><label>' + T('transform.func') + '</label><select data-f="mfn" data-mod="transform">'
        + [['round', 'fround'], ['abs', 'fabs'], ['sqrt', 'fsqrt'], ['log', 'flog'], ['exp', 'fexp'], ['floor', 'ffloor'], ['ceil', 'fceil'], ['neg', 'fneg'], ['zscore', 'fzscore'], ['minmax', 'fminmax']]
          .map(([v, k]) => '<option value="' + v + '"' + (F('transform', 'mfn', 'round') === v ? ' selected' : '') + '>' + T('transform.' + k) + '</option>').join('') + '</select></div></div>'
        + '<button class="btn primary block" data-act="apply" data-op="apply">' + T('common.apply') + '</button>')
      + card(T('transform.rank'), 'df.rank',
        '<div class="row2"><div class="field"><label>' + T('clean.oldCol') + '</label>' + colSelect('transform', 'rkcol', df, c => c.dtype === 'number') + '</div>'
        + '<div class="field"><label>' + T('transform.rankDir') + '</label><select data-f="rkdir" data-mod="transform">'
        + '<option value="desc">' + T('transform.rdesc') + '</option><option value="asc">' + T('transform.rasc') + '</option></select></div></div>'
        + '<button class="btn primary block" data-act="apply" data-op="rank">' + T('common.apply') + '</button>')
      + card(T('transform.cum'), 'cumsum',
        '<div class="row2"><div class="field"><label>' + T('clean.oldCol') + '</label>' + colSelect('transform', 'ccol', df, c => c.dtype === 'number') + '</div>'
        + '<div class="field"><label>' + T('transform.cumFunc') + '</label><select data-f="cfn" data-mod="transform">'
        + [['sum', 'csum'], ['max', 'cmax'], ['min', 'cmin'], ['mean', 'cmean']].map(([v, k]) => '<option value="' + v + '"' + (F('transform', 'cfn', 'sum') === v ? ' selected' : '') + '>' + T('transform.' + k) + '</option>').join('') + '</select></div></div>'
        + '<button class="btn primary block" data-act="apply" data-op="cum">' + T('common.apply') + '</button>')
      + card(T('transform.diff') + ' / ' + T('transform.pct'), 'diff / pct_change',
        '<div class="row2"><div class="field"><label>' + T('clean.oldCol') + '</label>' + colSelect('transform', 'dcol', df, c => c.dtype === 'number') + '</div>'
        + '<div class="field"><label>' + T('transform.periods') + '</label><input class="input" type="number" min="1" value="1" data-f="dper" data-mod="transform"></div></div>'
        + '<div class="row2"><button class="btn" data-act="apply" data-op="diff">' + T('transform.diff') + '</button>'
        + '<button class="btn" data-act="apply" data-op="pct">' + T('transform.pct') + '</button></div>')
      + card(T('transform.rolling'), 'df.rolling',
        '<div class="row3"><div class="field"><label>' + T('clean.oldCol') + '</label>' + colSelect('transform', 'wcol', df, c => c.dtype === 'number') + '</div>'
        + '<div class="field"><label>' + T('transform.window') + '</label><input class="input" type="number" min="2" value="7" data-f="wwin" data-mod="transform"></div>'
        + '<div class="field"><label>' + T('transform.rfunc') + '</label><select data-f="wfn" data-mod="transform">'
        + [['mean', 'rmean'], ['sum', 'rsum'], ['max', 'rmax'], ['min', 'rmin'], ['std', 'rstd']].map(([v, k]) => '<option value="' + v + '"' + (F('transform', 'wfn', 'mean') === v ? ' selected' : '') + '>' + T('transform.' + k) + '</option>').join('') + '</select></div></div>'
        + '<button class="btn primary block" data-act="apply" data-op="rolling">' + T('common.apply') + '</button>')
      + card(T('transform.resample'), 'df.resample',
        '<div class="row3"><div class="field"><label>' + T('transform.rsDate') + '</label>' + colSelect('transform', 'rsdate', df, c => c.dtype === 'date' || c.dtype === 'string') + '</div>'
        + '<div class="field"><label>' + T('transform.rsFreq') + '</label><select data-f="rsfreq" data-mod="transform">'
        + [['D', 'fD'], ['W', 'fW'], ['M', 'fM'], ['Q', 'fQ'], ['Y', 'fY']].map(([v, k]) => '<option value="' + v + '"' + (F('transform', 'rsfreq', 'M') === v ? ' selected' : '') + '>' + T('transform.' + k) + '</option>').join('') + '</select></div>'
        + '<div class="field"><label>' + T('transform.rsVal') + '</label>' + colSelect('transform', 'rsval', df, c => c.dtype === 'number') + '</div></div>'
        + '<div class="field"><label>' + T('transform.rsAgg') + '</label><select data-f="rsagg" data-mod="transform">'
        + PE().AGGS.map(a => '<option value="' + a + '"' + (F('transform', 'rsagg', 'sum') === a ? ' selected' : '') + '>' + PE().aggLabel(a) + '</option>').join('') + '</select></div>'
        + '<button class="btn primary block" data-act="apply" data-op="resample">' + T('common.apply') + '</button>')
      + card(T('transform.bin'), 'pd.cut',
        '<div class="row3"><div class="field"><label>' + T('clean.oldCol') + '</label>' + colSelect('transform', 'bcol', df, c => c.dtype === 'number') + '</div>'
        + '<div class="field"><label>' + T('transform.bins') + '</label><input class="input" type="number" min="2" value="4" data-f="bnum" data-mod="transform"></div>'
        + '<div class="field"><label>' + T('transform.bmethod') + '</label><select data-f="bmth" data-mod="transform">'
        + '<option value="width">' + T('transform.bwidth') + '</option><option value="freq">' + T('transform.bfreq') + '</option></select></div></div>'
        + '<button class="btn primary block" data-act="apply" data-op="bin">' + T('common.apply') + '</button>');
  }

  /* ================= 面板：聚合 ================= */
  function panelGroup() {
    const df = State.cur; if (!df) return emptyPanel();
    const aggChips = PE().AGGS.map(a => {
      const on = S('aggs').has(a);
      return '<span class="chip' + (on ? ' on' : '') + '" data-act="toggleSet" data-group="aggs" data-key="' + a + '">' + esc(PE().aggLabel(a)) + '</span>';
    }).join('');
    return ''
      + '<h3 class="pt">Σ ' + T('group.title') + '</h3>'
      + '<p class="pdesc">' + T('group.desc') + '</p>'
      + card(T('group.groupBy'), 'df.groupby',
        '<div class="field"><label>' + T('group.gCols') + '</label>' + chipGroup('gcols', df, c => c.dtype !== 'number' || !!c.map) + '</div>'
        + '<div class="field"><label>' + T('group.mCols') + '</label>' + chipGroup('mcols', df, c => c.dtype === 'number') + '</div>'
        + '<div class="field"><label>' + T('group.aFuncs') + '</label><div class="chips">' + aggChips + '</div></div>'
        + '<div class="field"><label>' + T('group.sortRes') + '</label><select data-f="gsort" data-mod="group">'
        + '<option value="none">' + T('group.sNone') + '</option><option value="desc">' + T('group.sValDesc') + '</option><option value="asc">' + T('group.sValAsc') + '</option></select></div>'
        + '<button class="btn primary block" data-act="apply" data-op="group">' + T('common.apply') + '</button>')
      + card(T('group.pivot'), 'df.pivot_table',
        '<div class="field"><label>' + T('group.pIndex') + '</label>' + colSelect('group', 'pidx', df, c => c.dtype !== 'number' || !!c.map) + '</div>'
        + '<div class="field"><label>' + T('group.pCols') + '</label>' + colSelect('group', 'pcols', df, c => c.dtype !== 'number' || !!c.map) + '</div>'
        + '<div class="field"><label>' + T('group.pVals') + '</label>' + colSelect('group', 'pvals', df, c => c.dtype === 'number') + '</div>'
        + '<div class="field"><label>' + T('group.pAgg') + '</label><select data-f="pagg" data-mod="group">'
        + PE().AGGS.map(a => '<option value="' + a + '"' + (F('group', 'pagg', 'sum') === a ? ' selected' : '') + '>' + PE().aggLabel(a) + '</option>').join('') + '</select></div>'
        + '<label class="chip static" style="margin-bottom:8px"><input type="checkbox" data-f="pfill" data-mod="group"' + (F('group', 'pfill', false) ? ' checked' : '') + '> ' + T('group.pFill') + '</label>'
        + '<button class="btn primary block" data-act="apply" data-op="pivot">' + T('common.apply') + '</button>')
      + card(T('group.melt'), 'df.melt',
        '<div class="field"><label>' + T('group.mId') + '</label>' + chipGroup('ids', df, c => c.dtype !== 'number' || !!c.map) + '</div>'
        + '<div class="field"><label>' + T('group.mVals') + '</label>' + chipGroup('vals', df, c => c.dtype === 'number') + '</div>'
        + '<button class="btn primary block" data-act="apply" data-op="melt">' + T('common.apply') + '</button>')
      + card(T('group.crosstab'), 'pd.crosstab',
        '<div class="row2"><div class="field"><label>' + T('group.ctIndex') + '</label>' + colSelect('group', 'ctidx', df, c => c.dtype !== 'number' || !!c.map) + '</div>'
        + '<div class="field"><label>' + T('group.ctCols') + '</label>' + colSelect('group', 'ctcols', df, c => c.dtype !== 'number' || !!c.map) + '</div></div>'
        + '<div class="row2"><div class="field"><label>' + T('group.ctVals') + '</label>' + colSelect('group', 'ctvals', df, c => c.dtype === 'number', T('group.ctCount')) + '</div>'
        + '<div class="field"><label>' + T('group.ctAgg') + '</label><select data-f="ctagg" data-mod="group">'
        + PE().AGGS.map(a => '<option value="' + a + '"' + (F('group', 'ctagg', 'sum') === a ? ' selected' : '') + '>' + PE().aggLabel(a) + '</option>').join('') + '</select></div></div>'
        + '<button class="btn primary block" data-act="apply" data-op="crosstab">' + T('common.apply') + '</button>');
  }

  /* ================= 面板：合并 ================= */
  function panelCombine() {
    const df = State.cur; if (!df) return emptyPanel();
    const df2 = State.df2;
    const common = df2 ? df.cols.filter(c => df2.cols.some(x => x.key === c.key)) : [];
    return ''
      + '<h3 class="pt">⋈ ' + T('combine.title') + '</h3>'
      + '<p class="pdesc">' + T('combine.desc') + '</p>'
      + card(T('combine.df2'), '',
        (df2 ? '<p class="hint">' + esc(datasetName(df2)) + ' · ' + df2.rows.length + ' × ' + df2.cols.length + '</p>'
          + '<p class="hint mono">' + df2.cols.map(c => esc(PE().label(c))).join(' | ') + '</p>'
          : '<p class="hint">' + T('combine.df2None') + '</p>')
        + '<div class="row2" style="margin-top:8px"><button class="btn" data-act="pickFile" data-target="df2">' + T('combine.upload2') + '</button>'
        + '<button class="btn ghost" data-act="sampleDf2">' + T('combine.sample2') + '</button></div>')
      + card(T('combine.merge'), 'df.merge',
        (common.length
          ? '<div class="field"><label>' + T('combine.mKey') + '</label><select data-f="mkey" data-mod="combine">'
            + common.map(c => '<option value="' + esc(c.key) + '"' + (F('combine', 'mkey', common[0].key) === c.key ? ' selected' : '') + '>' + esc(PE().label(c)) + '</option>').join('') + '</select></div>'
            + '<div class="field"><label>' + T('combine.mHow') + '</label><select data-f="mhow" data-mod="combine">'
            + [['inner', 'hInner'], ['left', 'hLeft'], ['right', 'hRight'], ['outer', 'hOuter']].map(([v, k]) => '<option value="' + v + '"' + (F('combine', 'mhow', 'left') === v ? ' selected' : '') + '>' + T('combine.' + k) + '</option>').join('') + '</select></div>'
            + '<button class="btn primary block" data-act="apply" data-op="merge">' + T('common.apply') + '</button>'
          : '<p class="hint">' + T('combine.needDf2') + '</p>'))
      + card(T('combine.concat'), 'pd.concat',
        '<p class="hint" style="margin-bottom:8px">' + T('combine.concatHint') + '</p>'
        + '<button class="btn primary block" data-act="apply" data-op="concat">' + T('common.apply') + '</button>');
  }

  /* ================= 面板：导出 ================= */
  function panelExport() {
    return ''
      + '<h3 class="pt">⬇ ' + T('export_.title') + '</h3>'
      + '<p class="pdesc">' + T('export_.desc') + '</p>'
      + card('', '',
        '<button class="btn primary block" style="margin-bottom:8px" data-act="expCsv">' + T('export_.csv') + '</button>'
        + '<button class="btn block" style="margin-bottom:8px" data-act="expJson">' + T('export_.json') + '</button>'
        + '<button class="btn block" style="margin-bottom:8px" data-act="expMd">' + T('export_.md') + '</button>'
        + '<button class="btn block" style="margin-bottom:8px" data-act="copyData">' + T('export_.copyData') + '</button>'
        + '<button class="btn block" data-act="copyCode">' + T('export_.copyCode') + '</button>');
  }

  /* ================= 小组件 ================= */
  const DTYPE_KEY = { number: 'dtypeNum', string: 'dtypeStr', date: 'dtypeDate', bool: 'dtypeBool' };
  function dtypeLabel(dt) { return T('grid.' + (DTYPE_KEY[dt] || 'dtypeStr')); }
  function dtypeShort(dt) {
    if (window.I18N.lang === 'zh') return dtypeLabel(dt);
    return { number: 'num', string: 'text', date: 'date', bool: 'bool' }[dt] || 'text';
  }

  function card(title, pandas, body) {
    return '<div class="card"><h4>' + esc(title) + (pandas ? '<span class="pandas">' + esc(pandas) + '</span>' : '') + '</h4>' + body + '</div>';
  }
  function chipGroup(group, df, filterFn) {
    const list = df.cols.filter(filterFn || (() => true));
    return '<div class="chips">' + list.map(c => {
      const on = S(group).has(c.key);
      const dt = dtypeShort(c.dtype);
      return '<span class="chip' + (on ? ' on' : '') + '" data-act="toggleSet" data-group="' + group + '" data-key="' + esc(c.key) + '">'
        + esc(PE().label(c)) + '<span class="dt">' + dt.slice(0, 3) + '</span></span>';
    }).join('') + '</div>';
  }
  function emptyPanel() {
    return '<h3 class="pt">' + T('nav.hint') + '</h3><p class="pdesc">' + T('toast.noData') + '</p>';
  }
  function datasetName(df) {
    if (!df) return '—';
    return df.nameKey ? T(df.nameKey) : (df.name || 'dataset');
  }

  /* ================= 渲染 ================= */
  function renderAll() {
    renderHeader(); renderNav(); renderPanel(); renderPipeline(); renderTabs(); renderPanes();
  }
  function renderHeader() {
    $('appTitle').textContent = T('app.title');
    $('appSub').textContent = T('app.subtitle');
    $('btnLang').textContent = T('app.langBtn');
    $('btnReset').textContent = T('app.reset');
    $('btnReset').title = T('app.resetTip');
    $('btnHelp').textContent = T('app.help');
    $('dsName').textContent = datasetName(State.base);
    const df = State.cur;
    $('dsShape').textContent = T('app.rowsCols', { rows: df ? df.rows.length : 0, cols: df ? df.cols.length : 0 });
    $('df2Tag').classList.toggle('hidden', !State.df2);
  }
  function renderNav() {
    $('modNav').innerHTML = MODULES.map(m =>
      '<button data-act="module" data-id="' + m.id + '" class="' + (State.module === m.id ? 'active' : '') + '">'
      + '<span class="ico">' + m.ico + '</span>' + T('nav.' + m.id) + '</button>').join('');
  }
  function renderPanel() {
    const p = $('panel');
    if (!State.base && State.module !== 'load') { p.innerHTML = emptyPanel(); return; }
    p.innerHTML = ({
      load: panelLoad, inspect: panelInspect, select: panelSelect, clean: panelClean,
      transform: panelTransform, group: panelGroup, combine: panelCombine, export: panelExport,
    }[State.module] || panelLoad)();
    updateMatched();
  }
  function renderPipeline() {
    $('pipeTitle').textContent = T('pipe.title');
    $('btnCopyCode').textContent = T('code.copy');
    $('btnClearPipe').textContent = T('pipe.clear');
    $('pipeCount').textContent = State.steps.length ? T('pipe.count', { n: State.steps.length }) : '';
    if (!State.steps.length) {
      $('pipeline').innerHTML = '<div class="pipe-empty">' + esc(T('pipe.empty')) + '</div>';
      return;
    }
    $('pipeline').innerHTML = State.steps.map((s, i) =>
      '<div class="step" data-act="undo" data-i="' + i + '" title="' + esc(T('pipe.undo')) + '">'
      + '<span class="st-idx">' + (i + 1) + '</span>'
      + '<div class="st-name">' + esc(s.name) + '</div>'
      + '<div class="st-code">' + esc(s.code) + '</div>'
      + '<span class="st-undo">↩</span></div>').join('<div class="step-arrow">›</div>');
  }
  function renderTabs() {
    const tabs = [['data', 'tab.data'], ['profile', 'tab.profile'], ['chart', 'tab.chart'], ['code', 'tab.code']];
    $('tabs').innerHTML = tabs.map(([id, k]) =>
      '<button data-act="tab" data-id="' + id + '" class="' + (State.tab === id ? 'active' : '') + '">' + T(k) + '</button>').join('');
    ['data', 'profile', 'chart', 'code'].forEach(id => {
      $('pane' + id.charAt(0).toUpperCase() + id.slice(1)).classList.toggle('hidden', State.tab !== id);
    });
  }
  function renderPanes() {
    renderGridBar(); renderGrid();
    renderProfile();
    renderChartBuilder(); renderChart();
    renderCode();
  }

  /* ---- 数据表 ---- */
  function renderGridBar() {
    $('gridSearch').placeholder = T('grid.search');
    const sizes = [10, 25, 50, 100];
    $('pageSize').innerHTML = sizes.map(s => '<option value="' + s + '"' + (State.grid.size === s ? ' selected' : '') + '>' + s + '</option>').join('');
    $('btnPrevPage').textContent = T('grid.prev');
    $('btnNextPage').textContent = T('grid.next');
  }
  function visibleRows() {
    const df = State.cur; if (!df) return [];
    let rows = df.rows.map((r, i) => ({ r, i }));
    const q = (State.grid.search || '').trim().toLowerCase();
    if (q) {
      rows = rows.filter(({ r }) => df.cols.some(c => {
        const v = PE().disp(df, c.key, r[c.key]);
        return v != null && String(v).toLowerCase().includes(q);
      }));
    }
    const sk = State.grid.sortKey;
    if (sk) {
      const c = PE().colOf(df, sk);
      rows.sort((a, b) => {
        let av = a.r[sk], bv = b.r[sk];
        if (c && c.dtype === 'number') { av = PE().toNum(av); bv = PE().toNum(bv); }
        else { av = String(av == null ? '' : av); bv = String(bv == null ? '' : bv); }
        if (av == null) return 1; if (bv == null) return -1;
        if (av === bv) return 0;
        return (av > bv ? 1 : -1) * State.grid.sortDir;
      });
    }
    return rows;
  }
  function renderGrid() {
    const df = State.cur, el = $('grid');
    if (!df || !df.rows.length) { el.innerHTML = '<tbody><tr><td style="padding:26px;color:#94A3B8">' + esc(T('grid.noData')) + '</td></tr></tbody>'; $('pageInd').textContent = ''; $('rowsAll').textContent = ''; return; }
    const vis = visibleRows();
    const total = Math.max(1, Math.ceil(vis.length / State.grid.size));
    if (State.grid.page > total) State.grid.page = total;
    const start = (State.grid.page - 1) * State.grid.size;
    const page = vis.slice(start, start + State.grid.size);
    let html = '<thead><tr><th class="idx-col">' + T('grid.index') + '</th>';
    df.cols.forEach(c => {
      const ind = State.grid.sortKey === c.key ? (State.grid.sortDir === 1 ? ' ▲' : ' ▼') : '';
      html += '<th data-act="sort" data-key="' + esc(c.key) + '">' + esc(PE().label(c))
        + '<span class="th-dt">' + esc(dtypeShort(c.dtype)) + '</span>'
        + '<span class="sort-ind">' + ind + '</span></th>';
    });
    html += '</tr></thead><tbody>';
    page.forEach(({ r, i }) => {
      html += '<tr><td class="idx">' + (i + 1) + '</td>';
      df.cols.forEach(c => {
        const v = r[c.key];
        if (PE().isNull(v)) { html += '<td class="nil">' + esc(T('grid.nullVal')) + '</td>'; return; }
        if (c.dtype === 'number') { html += '<td class="num">' + esc(PE().fmtNum(v)) + '</td>'; return; }
        html += '<td>' + esc(PE().disp(df, c.key, v)) + '</td>';
      });
      html += '</tr>';
    });
    html += '</tbody>';
    el.innerHTML = html;
    $('rowsAll').textContent = T('grid.rowsAll', { n: df.rows.length });
    $('pageInd').textContent = T('grid.page', { p: State.grid.page, t: total });
  }

  /* ---- 统计概览 ---- */
  function renderProfile() {
    const df = State.cur;
    if (!df) { $('profile').innerHTML = '<div class="code-empty">' + esc(T('toast.noData')) + '</div>'; return; }
    const P = PE();
    const infos = P.info(df);
    const missCells = infos.reduce((s, i) => s + i.nullCount, 0);
    const numCols = df.cols.filter(c => c.dtype === 'number').length;
    const txtCols = df.cols.length - numCols;
    const dup = P.dupCount(df);
    const kpi = (label, val, cls) => '<div class="kpi ' + (cls || '') + '"><div class="k-label">' + esc(label) + '</div><div class="k-value">' + esc(val) + '</div></div>';
    let html = '<div class="profile"><div class="kpis">'
      + kpi(T('profile.kpiRows'), df.rows.length, 'accent')
      + kpi(T('profile.kpiCols'), df.cols.length, 'accent')
      + kpi(T('profile.kpiMissing'), missCells, missCells ? 'warn' : '')
      + kpi(T('profile.kpiNum'), numCols)
      + kpi(T('profile.kpiText'), txtCols)
      + kpi(T('profile.kpiDup'), dup, dup ? 'warn' : '')
      + '</div>';

    if (State.report) html += reportHtml(State.report);

    html += '<div class="sec-title">' + T('profile.fieldInfo') + '<span class="pandas">df.info()</span></div>';
    html += '<table class="mini-t"><thead><tr><th>' + T('profile.cName') + '</th><th>' + T('profile.cDtype') + '</th><th>' + T('profile.cNon') + '</th><th>' + T('profile.cNull') + '</th><th>' + T('profile.cUniq') + '</th><th>' + T('profile.cSample') + '</th></tr></thead><tbody>';
    infos.forEach(i => {
      html += '<tr><td>' + esc(P.label(i.col)) + '</td><td>' + esc(dtypeLabel(i.col.dtype)) + '</td>'
        + '<td class="num">' + i.nonNull + '</td><td class="num">' + i.nullCount + '</td><td class="num">' + i.unique + '</td>'
        + '<td>' + esc(i.sample == null ? '—' : P.disp(df, i.col.key, i.sample)) + '</td></tr>';
    });
    html += '</tbody></table>';

    const desc = P.describe(df);
    if (desc.length) {
      html += '<div class="sec-title">' + T('profile.describeTitle') + '<span class="pandas">df.describe()</span></div>';
      const isNum = desc[0].kind === 'number';
      html += '<table class="mini-t"><thead><tr><th>' + T('profile.cName') + '</th>';
      if (isNum) ['sCount', 'sMean', 'sStd', 'sMin', 's25', 's50', 's75', 'sMax'].forEach(k => { html += '<th>' + T('profile.' + k) + '</th>'; });
      else ['sCount', 'sUniq', 'sTop', 'sFreq'].forEach(k => { html += '<th>' + T('profile.' + k) + '</th>'; });
      html += '</tr></thead><tbody>';
      desc.forEach(d => {
        html += '<tr><td>' + esc(P.label(d.col)) + '</td>';
        if (d.kind === 'number') {
          [d.count, d.mean, d.std, d.min, d.p25, d.p50, d.p75, d.max].forEach(v => { html += '<td class="num">' + esc(P.fmtNum(v)) + '</td>'; });
        } else {
          html += '<td class="num">' + d.count + '</td><td class="num">' + d.unique + '</td><td>' + esc(d.top == null ? '—' : d.top) + '</td><td class="num">' + d.freq + '</td>';
        }
        html += '</tr>';
      });
      html += '</tbody></table>';
    }

    html += '<div class="mini-charts">'
      + '<div class="mini-chart"><div class="mc-cap">' + T('profile.missingTitle') + '</div><div class="mc-box" id="mcMiss"></div></div>'
      + '<div class="mini-chart"><div class="mc-cap">' + T('profile.corrTitle') + '<span class="pandas">' + T('profile.corrHint') + '</span></div><div class="mc-box" id="mcCorr"></div></div>'
      + '</div></div>';
    $('profile').innerHTML = html;

    /* 缺失率图 */
    const miss = P.missingByCol(df).filter(m => m.count > 0);
    const missDom = $('mcMiss');
    if (missDom && typeof echarts !== 'undefined') {
      const ch = echarts.init(missDom);
      if (miss.length) {
        ch.setOption({
          grid: { left: 70, right: 16, top: 14, bottom: 26, containLabel: true },
          tooltip: { trigger: 'axis', confine: true },
          xAxis: { type: 'value', max: 100, axisLabel: { fontSize: 10, formatter: '{value}%' }, splitLine: { lineStyle: { type: 'dashed', color: '#EEF2F7' } } },
          yAxis: { type: 'category', data: miss.map(m => P.label(m.col)), axisLabel: { fontSize: 10 } },
          series: [{ type: 'bar', data: miss.map(m => Number((m.rate * 100).toFixed(1))), itemStyle: { color: '#F59E0B', borderRadius: [0, 4, 4, 0] }, barMaxWidth: 14 }],
        }, true);
      } else {
        ch.setOption({ title: { text: '0', left: 'center', top: 'middle', textStyle: { color: '#10B981', fontSize: 20 } } }, true);
      }
      ch.resize();
    }
    const corrDom = $('mcCorr');
    if (corrDom && typeof echarts !== 'undefined') {
      const ch = echarts.init(corrDom);
      const cm = P.corr(df);
      if (cm.cols.length >= 2) {
        const data = [];
        cm.mat.forEach((row, i) => row.forEach((v, j) => data.push([j, i, v == null ? '-' : v])));
        ch.setOption({
          grid: { left: 66, right: 12, top: 12, bottom: 46 },
          tooltip: { position: 'top', confine: true },
          xAxis: { type: 'category', data: cm.cols.map(c => P.label(c)), axisLabel: { fontSize: 9, rotate: 40 } },
          yAxis: { type: 'category', data: cm.cols.map(c => P.label(c)), axisLabel: { fontSize: 9 } },
          visualMap: { min: -1, max: 1, calculable: true, orient: 'horizontal', left: 'center', bottom: 2, itemHeight: 70, inRange: { color: ['#3B82F6', '#F1F5F9', '#F97316'] } },
          series: [{ type: 'heatmap', data, label: { show: cm.cols.length <= 6, fontSize: 9 } }],
        }, true);
      } else {
        ch.setOption({ title: { text: T('profile.corrHint'), left: 'center', top: 'middle', textStyle: { color: '#94A3B8', fontSize: 11 } } }, true);
      }
      ch.resize();
    }
  }

  function reportHtml(rep) {
    const P = PE(), df = State.cur;
    let html = '<div class="sec-title">' + T('inspect.reportTitle') + '<span class="pandas">' + esc(rep.title) + '</span></div>';
    if (rep.kind === 'vc' || rep.kind === 'uniq') {
      const vc = P.valueCounts(df, rep.col);
      const c = P.colOf(df, rep.col);
      html += '<table class="mini-t"><thead><tr><th>' + esc(P.label(c)) + '</th><th>' + T('profile.sFreq') + '</th><th>%</th></tr></thead><tbody>'
        + vc.slice(0, 30).map(x => '<tr><td>' + esc(x.value == null ? T('grid.nullVal') : P.disp(df, rep.col, x.value)) + '</td><td class="num">' + x.count + '</td><td class="num">' + (x.count / df.rows.length * 100).toFixed(1) + '%</td></tr>').join('')
        + '</tbody></table>';
    } else if (rep.kind === 'miss') {
      const miss = P.missingByCol(df);
      html += '<table class="mini-t"><thead><tr><th>' + T('profile.cName') + '</th><th>' + T('profile.cNull') + '</th><th>%</th></tr></thead><tbody>'
        + miss.map(m => '<tr><td>' + esc(P.label(m.col)) + '</td><td class="num">' + m.count + '</td><td class="num">' + (m.rate * 100).toFixed(1) + '%</td></tr>').join('')
        + '</tbody></table>';
    } else if (rep.kind === 'dup') {
      const n = P.dupCount(df);
      html += '<p class="hint" style="font-size:13px">' + T('profile.kpiDup') + '：<b>' + n + '</b> / ' + df.rows.length + '</p>';
    } else if (rep.kind === 'corr') {
      html += '<p class="hint">' + T('profile.corrHint') + '</p>';
    }
    return html;
  }

  /* ---- 图表 ---- */
  function renderChartBuilder() {
    const df = State.cur;
    if (!df) { $('chartBuilder').innerHTML = ''; return; }
    const P = PE();
    const types = [['bar', 'cBar'], ['line', 'cLine'], ['area', 'cArea'], ['scatter', 'cScatter'], ['pie', 'cPie'], ['hist', 'cHist'], ['box', 'cBox'], ['heat', 'cHeat']];
    const colOpts = sel => df.cols.map(c => '<option value="' + esc(c.key) + '"' + (sel === c.key ? ' selected' : '') + '>' + esc(P.label(c)) + '</option>').join('');
    const numOpts = sel => df.cols.filter(c => c.dtype === 'number').map(c => '<option value="' + esc(c.key) + '"' + (sel === c.key ? ' selected' : '') + '>' + esc(P.label(c)) + '</option>').join('');
    const c = State.chart;
    const isHeat = c.type === 'heat';
    const heatMatrix = isHeat && c.heatMode === 'matrix';
    /* 直方图需要数值列：X 选了文本列时自动切换并提示 */
    if (c.type === 'hist') {
      const xc = c.x ? df.cols.find(x => x.key === c.x) : null;
      if (!xc || xc.dtype !== 'number') {
        const num = df.cols.find(x => x.dtype === 'number');
        if (num) { c.x = num.key; toast(T('chart_.autoNum')); }
      }
    }
    if (heatMatrix) {
      const nums = df.cols.filter(x => x.dtype === 'number');
      if (!c.value && nums.length) c.value = nums[nums.length - 1].key;
      if (!c.ys.length && nums.length) c.ys = [nums[0].key];
    }
    let html = '<div class="cb-field"><label>' + T('chart_.type') + '</label><div class="type-btns">'
      + types.map(([v, k]) => '<button data-act="ctype" data-v="' + v + '" class="' + (c.type === v ? 'active' : '') + '">' + T('chart_.' + k) + '</button>').join('') + '</div></div>';
    if (isHeat) {
      html += '<div class="cb-field"><label>' + T('chart_.heatMode') + '</label><select data-act="cfield" data-k="heatMode">'
        + '<option value="corr"' + (c.heatMode === 'corr' ? ' selected' : '') + '>' + T('chart_.hCorr') + '</option>'
        + '<option value="matrix"' + (c.heatMode === 'matrix' ? ' selected' : '') + '>' + T('chart_.hMatrix') + '</option></select></div>';
    }
    html += '<div class="cb-field"><label>' + (c.type === 'hist' ? T('chart_.xField') : T('chart_.xField')) + '</label><select data-act="cfield" data-k="x">' + colOpts(c.x) + '</select></div>';
    if (c.type === 'hist') {
      html += '<div class="cb-field"><label>' + T('transform.bins') + '</label><input class="input" type="number" min="3" max="40" value="' + c.bins + '" data-act="cfield" data-k="bins"></div>';
    } else if (!isHeat) {
      html += '<div class="cb-field wide"><label>' + (c.type === 'pie' || c.type === 'scatter' ? T('chart_.yField') : T('chart_.yFields')) + '</label>'
        + '<div class="chips">' + df.cols.filter(x => x.dtype === 'number').map(x =>
          '<span class="chip' + (c.ys.includes(x.key) ? ' on' : '') + '" data-act="toggleY" data-key="' + esc(x.key) + '">' + esc(P.label(x)) + '</span>').join('') + '</div></div>';
      const xColC = c.x ? df.cols.find(x => x.key === c.x) : null;
      const scatterCat = c.type === 'scatter' && xColC && xColC.dtype !== 'number';
      if (c.type !== 'scatter' || scatterCat) {
        html += '<div class="cb-field"><label>' + T('chart_.agg') + '</label><select data-act="cfield" data-k="agg">'
          + '<option value="none"' + (c.agg === 'none' ? ' selected' : '') + '>' + T('chart_.aggNone') + '</option>'
          + P.AGGS.map(a => '<option value="' + a + '"' + (c.agg === a ? ' selected' : '') + '>' + P.aggLabel(a) + '</option>').join('') + '</select></div>';
      }
      if (c.type === 'bar' || c.type === 'line' || c.type === 'area' || c.type === 'scatter' || c.type === 'box') {
        html += '<div class="cb-field"><label>' + T('chart_.groupBy') + '</label><select data-act="cfield" data-k="group">'
          + '<option value="none"' + (c.group === 'none' ? ' selected' : '') + '>' + T('chart_.groupNone') + '</option>'
          + df.cols.filter(x => x.dtype !== 'number' || x.map).map(x => '<option value="' + esc(x.key) + '"' + (c.group === x.key ? ' selected' : '') + '>' + esc(P.label(x)) + '</option>').join('') + '</select></div>';
      }
      html += '<div class="cb-field"><label>' + T('chart_.topN') + '</label><input class="input" type="number" min="3" max="200" value="' + c.topN + '" data-act="cfield" data-k="topN"></div>';
      html += '<div class="cb-field"><label>' + T('chart_.y2') + '</label><select data-act="cfield" data-k="y2">'
        + '<option value="none"' + (!c.y2 || c.y2 === 'none' ? ' selected' : '') + '>' + T('chart_.groupNone') + '</option>'
        + df.cols.filter(x => x.dtype === 'number').map(x => '<option value="' + esc(x.key) + '"' + (c.y2 === x.key ? ' selected' : '') + '>' + esc(P.label(x)) + '</option>').join('') + '</select></div>';
      if (c.type === 'bar' || c.type === 'area') {
        html += '<div class="cb-field"><label>' + T('chart_.stack') + '</label><select data-act="cfield" data-k="stack">'
          + '<option value="0"' + (!c.stack ? ' selected' : '') + '>' + T('chart_.stackNo') + '</option>'
          + '<option value="1"' + (c.stack ? ' selected' : '') + '>' + T('chart_.stackYes') + '</option></select></div>';
      }
    } else if (heatMatrix) {
      html += '<div class="cb-field"><label>' + T('chart_.yField') + '</label><select data-act="cfield" data-k="y0">' + colOpts(c.ys[0]) + '</select></div>';
      html += '<div class="cb-field"><label>' + T('chart_.yFields') + '</label><select data-act="cfield" data-k="value">' + numOpts(c.value) + '</select></div>';
      html += '<div class="cb-field"><label>' + T('chart_.agg') + '</label><select data-act="cfield" data-k="agg">'
        + P.AGGS.map(a => '<option value="' + a + '"' + (c.agg === a ? ' selected' : '') + '>' + P.aggLabel(a) + '</option>').join('') + '</select></div>';
    }
    html += '<div class="cb-field"><label>' + T('chart_.cTitle') + '</label><input class="input" value="' + esc(c.title) + '" data-act="cfield" data-k="title" placeholder="' + esc(T('chart_.cTitle')) + '"></div>';
    $('chartBuilder').innerHTML = html;
  }
  function renderChart() {
    window.PCHARTS.render($('chartBox'), State.cur, State.chart);
  }

  /* ---- 代码 ---- */
  function codeText() {
    const df0 = State.base;
    let s = 'import pandas as pd\n\n' + T('code.base') + '\n';
    s += df0 ? "df = pd.read_csv('" + slug(datasetName(df0)) + ".csv')\n" : "df = pd.read_csv('data.csv')\n";
    s += 'print(df.head())\n\n' + T('code.hint') + '\n';
    State.steps.forEach((st, i) => {
      s += '\n# ' + T('pipe.step', { n: i + 1 }) + ' · ' + st.name + '\n' + st.code + '\n';
    });
    return s;
  }
  function renderCode() {
    $('codeDesc').innerHTML = '<span>' + esc(T('code.desc')) + '</span>'
      + '<button class="btn tiny" data-act="copyCode2">' + T('code.copy') + '</button>';
    const raw = esc(codeText());
    const html = raw
      .split('\n').map(line => {
        if (/^\s*#/.test(line)) return '<span class="cm">' + line + '</span>';
        return line.replace(/\b(import|from|as|df|pd)\b/g, '<span class="kw">$1</span>');
      }).join('\n');
    $('codeBox').innerHTML = html;
  }
  function slug(s) { return String(s || 'data').replace(/[^\w\u4e00-\u9fa5]+/g, '_').slice(0, 24); }

  /* ================= 导入/导出 ================= */
  function parseText(text) {
    text = (text || '').trim();
    if (!text) return null;
    if (text[0] === '[' || text[0] === '{') {
      const j = JSON.parse(text);
      const arr = Array.isArray(j) ? j : [j];
      const keys = [];
      arr.forEach(o => Object.keys(o).forEach(k => { if (!keys.includes(k)) keys.push(k); }));
      return PE().fromMatrix(keys, arr.map(o => keys.map(k => o[k])), 'data.pasted');
    }
    const res = Papa.parse(text, { header: true, skipEmptyLines: true, dynamicTyping: false });
    if (!res.data || !res.data.length) return null;
    const keys = res.meta.fields || Object.keys(res.data[0]);
    return PE().fromMatrix(keys, res.data.map(r => keys.map(k => r[k])), 'data.pasted');
  }
  function readFile(file, cb) {
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const fr = new FileReader();
    fr.onerror = () => toast(T('load.errFile'), 'err');
    fr.onload = e => {
      try {
        if (['xlsx', 'xls'].includes(ext)) {
          const wb = XLSX.read(e.target.result, { type: 'array' });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const arr = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null, raw: false });
          if (!arr.length) throw new Error(T('load.errEmpty'));
          const headers = arr[0].map((h, i) => h == null || h === '' ? 'col_' + (i + 1) : String(h));
          cb(PE().fromMatrix(headers, arr.slice(1), null, file.name));
        } else if (ext === 'json') {
          cb(parseText(new TextDecoder('utf-8').decode(e.target.result)));
        } else {
          const txt = new TextDecoder('utf-8').decode(e.target.result);
          const delim = ext === 'tsv' ? '\t' : null;
          const res = Papa.parse(txt, { header: true, skipEmptyLines: true, delimiter: delim || undefined });
          if (!res.data || !res.data.length) throw new Error(T('load.errEmpty'));
          const keys = res.meta.fields || Object.keys(res.data[0]);
          cb(PE().fromMatrix(keys, res.data.map(r => keys.map(k => r[k])), null, file.name));
        }
      } catch (err) {
        toast(T('load.errParse', { msg: err.message }), 'err');
      }
    };
    if (['xlsx', 'xls'].includes(ext)) fr.readAsArrayBuffer(file); else fr.readAsText(file);
  }
  function toCsv(df) {
    const rows = [df.cols.map(c => PE().label(c))];
    df.rows.forEach(r => rows.push(df.cols.map(c => {
      const v = PE().disp(df, c.key, r[c.key]);
      if (v == null) return '';
      const s = String(v);
      return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    })));
    return rows.map(r => r.join(',')).join('\n');
  }
  function download(name, content, mime) {
    const blob = new Blob(['\ufeff' + content], { type: mime || 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  function copy(text) {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) { }
    document.body.removeChild(ta);
  }

  /* ================= 事件 ================= */
  function toast(msg, type) {
    const el = $('toast');
    el.textContent = msg;
    el.className = 'toast show' + (type === 'err' ? ' err' : '');
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.className = 'toast'; }, 2200);
  }
  function updateMatched() {
    const el = $('matchedHint');
    if (!el || !State.cur) return;
    const conds = State.conds.filter(c => c.col && (c.op === 'isnull' || c.op === 'notnull' || (c.value !== '' && c.value != null)));
    if (!conds.length) { el.textContent = ''; return; }
    const n = PE().filterMask(State.cur, conds, F('select', 'logic', 'and')).length;
    el.textContent = T('select.matched', { n });
  }

  document.addEventListener('click', e => {
    const t = e.target.closest('[data-act]');
    if (!t) return;
    const act = t.getAttribute('data-act');
    const mod = State.module;

    if (act === 'module') { State.module = t.getAttribute('data-id'); renderNav(); renderPanel(); return; }
    if (act === 'tab') { State.tab = t.getAttribute('data-id'); renderTabs(); renderPanes(); return; }
    if (act === 'toggleSet') {
      const g = t.getAttribute('data-group'), k = t.getAttribute('data-key');
      const s = S(g); s.has(k) ? s.delete(k) : s.add(k);
      const on = s.has(k); t.classList.toggle('on', on);
      if (g === 'aggs') { /* noop */ }
      return;
    }
    if (act === 'toggleY') {
      const k = t.getAttribute('data-key');
      const i = State.chart.ys.indexOf(k);
      if (i >= 0) State.chart.ys.splice(i, 1); else State.chart.ys.push(k);
      t.classList.toggle('on', State.chart.ys.includes(k));
      renderChart(); return;
    }
    if (act === 'clearSel') { S(t.getAttribute('data-group')).clear(); renderPanel(); return; }
    if (act === 'undo') { undoTo(parseInt(t.getAttribute('data-i'), 10)); return; }
    if (act === 'sort') {
      const k = t.getAttribute('data-key');
      if (State.grid.sortKey === k) State.grid.sortDir *= -1;
      else { State.grid.sortKey = k; State.grid.sortDir = 1; }
      renderGrid(); return;
    }
    if (act === 'ctype') { State.chart.type = t.getAttribute('data-v'); renderChartBuilder(); renderChart(); return; }

    /* 操作步骤 */
    if (act === 'apply') {
      const op = t.getAttribute('data-op');
      const df = State.cur;
      const A = {
        head: { n: F('inspect', 'hn', 10) }, tail: { n: F('inspect', 'tn', 10) }, sample: { n: F('inspect', 'sn', 10) },
        select: { cols: selArr('keep') }, dropcols: { cols: selArr('drop') },
        filter: { conds: State.conds.slice(), logic: F('select', 'logic', 'and') },
        iloc: { start: F('select', 'istart', 0), end: F('select', 'iend', df.rows.length) },
        query: { expr: F('select', 'qexpr', '') },
        loc: { col: F('select', 'lcol'), values: selArr('lvals') },
        resample: { col: F('transform', 'rsdate'), value: F('transform', 'rsval'), freq: F('transform', 'rsfreq', 'M'), agg: F('transform', 'rsagg', 'sum') },
        crosstab: { index: F('group', 'ctidx'), columns: F('group', 'ctcols'), values: F('group', 'ctvals'), agg: F('group', 'ctagg', 'sum') },
        dropna: { how: F('clean', 'dhow', 'any'), cols: selArr('subset') },
        fillna: { col: F('clean', 'fcol'), how: F('clean', 'fhow', 'mean'), value: F('clean', 'fval', '') },
        dropdup: { cols: selArr('dup'), keep: F('clean', 'keep', 'first') },
        rename: { col: F('clean', 'rcol'), newName: F('clean', 'rname', '') },
        astype: { col: F('clean', 'acol'), type: F('clean', 'atype', 'string') },
        replace: { col: F('clean', 'pcol'), oldVal: F('clean', 'pold', ''), newVal: F('clean', 'pnew', '') },
        str: { col: F('clean', 'scol'), fn: F('clean', 'sfn', 'trim'), n: F('clean', 'sn2', 5) },
        sort: { cols: selArr('sortc'), order: F('transform', 'sord', 'desc') },
        newcol: { name: F('transform', 'nname', ''), expr: F('transform', 'nexpr', '') },
        apply: { col: F('transform', 'mcol'), fn: F('transform', 'mfn', 'round') },
        rank: { col: F('transform', 'rkcol'), dir: F('transform', 'rkdir', 'desc') },
        cum: { col: F('transform', 'ccol'), fn: F('transform', 'cfn', 'sum') },
        diff: { col: F('transform', 'dcol'), periods: F('transform', 'dper', 1) },
        pct: { col: F('transform', 'dcol'), periods: F('transform', 'dper', 1) },
        rolling: { col: F('transform', 'wcol'), window: F('transform', 'wwin', 7), fn: F('transform', 'wfn', 'mean') },
        bin: { col: F('transform', 'bcol'), bins: F('transform', 'bnum', 4), method: F('transform', 'bmth', 'width') },
        group: { groups: selArr('gcols'), measures: selArr('mcols'), aggs: selArr('aggs'), sort: F('group', 'gsort', 'none') },
        pivot: { index: F('group', 'pidx'), columns: F('group', 'pcols'), values: F('group', 'pvals'), agg: F('group', 'pagg', 'sum'), fill0: !!F('group', 'pfill', false) },
        melt: { ids: selArr('ids'), values: selArr('vals') },
        merge: { df2: State.df2, key: F('combine', 'mkey'), how: F('combine', 'mhow', 'left'), suffixes: ['_x', '_y'] },
        concat: { df2: State.df2 },
      }[op];
      applyOp(op, A || {});
      return;
    }

    /* 加载相关 */
    if (act === 'loadSample') {
      const id = F('load', 'sample', 'sales');
      setBase(window.DATASETS.build(id));
      toast(T('load.ok', { n: State.base.rows.length }));
      return;
    }
    if (act === 'genRandom') {
      setBase(window.DATASETS.random(parseInt(F('load', 'rnd', 120), 10) || 120));
      toast(T('load.ok', { n: State.base.rows.length }));
      return;
    }
    if (act === 'pasteLoad') {
      const df = parseText(F('load', 'paste', ''));
      if (!df) { toast(T('load.errEmpty'), 'err'); return; }
      setBase(df); toast(T('load.ok', { n: df.rows.length }));
      return;
    }
    if (act === 'pasteDf2') {
      const df = parseText(F('load', 'paste', ''));
      if (!df) { toast(T('load.errEmpty'), 'err'); return; }
      State.df2 = df; renderHeader(); renderPanel(); toast(T('load.ok', { n: df.rows.length }));
      return;
    }
    if (act === 'pickFile') { State.pasteTarget = t.getAttribute('data-target') || 'main'; $('fileInput').click(); return; }
    if (act === 'sampleDf2') {
      State.df2 = window.DATASETS.sampleDf2(State.base);
      renderHeader(); renderPanel(); toast(T('load.ok', { n: State.df2.rows.length }));
      return;
    }
    if (act === 'clearDf2') { State.df2 = null; renderHeader(); renderPanel(); return; }
    if (act === 'setDefault') {
      try {
        localStorage.setItem('vpl_default', JSON.stringify({ cols: State.base.cols, rows: State.base.rows, nameKey: State.base.nameKey, name: State.base.name }));
        toast(T('load.defaultSaved'));
      } catch (err) { toast(T('toast.err', { msg: 'localStorage' }), 'err'); }
      return;
    }
    if (act === 'clearDefault') {
      localStorage.removeItem('vpl_default');
      setBase(window.DATASETS.build('sales'));
      toast(T('load.clearDefault'));
      return;
    }

    /* 筛选条件 */
    if (act === 'addCond') {
      const df = State.cur;
      const k = df.cols[0].key;
      State.conds.push({ col: k, op: '==', value: defVal(df, k) });
      renderPanel(); return;
    }
    if (act === 'delCond') { State.conds.splice(parseInt(t.getAttribute('data-i'), 10), 1); renderPanel(); return; }

    /* 检视报告 */
    if (act === 'report') {
      const kind = t.getAttribute('data-kind');
      const col = F('inspect', 'col', State.cur.cols[0].key);
      const titles = { vc: T('inspect.valueCounts'), uniq: T('inspect.unique'), miss: T('inspect.missing'), dup: T('inspect.dup'), corr: T('inspect.corr') };
      State.report = { kind, col, title: titles[kind] || '' };
      State.tab = 'profile'; renderTabs(); renderPanes();
      return;
    }

    /* 导出 */
    if (act === 'expCsv') { download(slug(datasetName(State.base)) + '_result.csv', toCsv(State.cur)); toast(T('export_.done')); return; }
    if (act === 'expJson') {
      const arr = State.cur.rows.map(r => {
        const o = {}; State.cur.cols.forEach(c => { o[PE().label(c)] = PE().disp(State.cur, c.key, r[c.key]); }); return o;
      });
      download(slug(datasetName(State.base)) + '_result.json', JSON.stringify(arr, null, 2), 'application/json');
      toast(T('export_.done')); return;
    }
    if (act === 'expMd') {
      const df = State.cur;
      const head = '| ' + df.cols.map(c => PE().label(c)).join(' | ') + ' |';
      const sep = '| ' + df.cols.map(() => '---').join(' | ') + ' |';
      const body = df.rows.slice(0, 200).map(r => '| ' + df.cols.map(c => {
        const v = PE().disp(df, c.key, r[c.key]); return v == null ? '' : String(v);
      }).join(' | ') + ' |').join('\n');
      copy([head, sep, body].join('\n')); toast(T('export_.done')); return;
    }
    if (act === 'copyData') {
      copy(toCsv(State.cur)); toast(T('export_.done')); return;
    }
    if (act === 'copyCode' || act === 'copyCode2') { copy(codeText()); toast(T('code.copied')); return; }
  });

  /* 表单变化 */
  function onFormChange(e) {
    const el = e.target;
    const f = el.getAttribute && el.getAttribute('data-f');
    if (f) {
      const mod = el.getAttribute('data-mod') || State.module;
      State.form[mod] = State.form[mod] || {};
      State.form[mod][f] = el.type === 'checkbox' ? el.checked : el.value;
      if (['dhow', 'fhow', 'sfn', 'lcol'].includes(f)) renderPanel();
      if (f === 'logic') updateMatched();
      return;
    }
    const a = el.getAttribute && el.getAttribute('data-act');
    if (a === 'condCol' || a === 'condOp' || a === 'condVal') {
      const i = parseInt(el.getAttribute('data-i'), 10);
      if (!State.conds[i]) return;
      if (a === 'condCol') {
        State.conds[i].col = el.value; State.conds[i].value = defVal(State.cur, el.value);
        renderPanel();
      } else if (a === 'condOp') {
        State.conds[i].op = el.value; updateMatched();
      } else {
        State.conds[i].value = el.value; updateMatched();
      }
      return;
    }
    if (a === 'cfield') {
      const k = el.getAttribute('data-k');
      const v = el.type === 'number' ? parseInt(el.value, 10) : el.value;
      if (k === 'y0') State.chart.ys = [v];
      else if (k === 'bins' || k === 'topN') State.chart[k] = Math.max(1, v || 1);
      else if (k === 'stack') State.chart.stack = v === '1';
      else State.chart[k] = v;
      if (k === 'heatMode') renderChartBuilder();
      renderChart();
      return;
    }
  }
  document.addEventListener('change', onFormChange);
  document.addEventListener('input', e => {
    if (e.target.id === 'gridSearch') { State.grid.search = e.target.value; State.grid.page = 1; renderGrid(); return; }
    if (e.target.id === 'pageSize') { State.grid.size = parseInt(e.target.value, 10); State.grid.page = 1; renderGrid(); return; }
    onFormChange(e);
  });

  /* 分页 */
  $('btnPrevPage').addEventListener('click', () => { State.grid.page = Math.max(1, State.grid.page - 1); renderGrid(); });
  $('btnNextPage').addEventListener('click', () => { State.grid.page++; renderGrid(); });

  /* 文件选择 */
  $('fileInput').addEventListener('change', e => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    readFile(f, df => {
      if (!df) { toast(T('load.errEmpty'), 'err'); return; }
      if (State.pasteTarget === 'df2') { State.df2 = df; renderHeader(); renderPanel(); }
      else setBase(df);
      toast(T('load.ok', { n: df.rows.length }));
    });
    e.target.value = '';
  });

  /* 拖放 */
  document.addEventListener('dragover', e => { const dz = e.target.closest('.dropzone'); if (dz) { e.preventDefault(); dz.classList.add('over'); } });
  document.addEventListener('dragleave', e => { const dz = e.target.closest('.dropzone'); if (dz) dz.classList.remove('over'); });
  document.addEventListener('drop', e => {
    const dz = e.target.closest('.dropzone');
    if (!dz) return;
    e.preventDefault(); dz.classList.remove('over');
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (!f) return;
    State.pasteTarget = dz.getAttribute('data-target') || 'main';
    readFile(f, df => {
      if (!df) { toast(T('load.errEmpty'), 'err'); return; }
      if (State.pasteTarget === 'df2') { State.df2 = df; renderHeader(); renderPanel(); } else setBase(df);
      toast(T('load.ok', { n: df.rows.length }));
    });
  });

  /* 顶栏 */
  $('btnLang').addEventListener('click', () => {
    const lang = window.I18N.toggle();
    try { localStorage.setItem('vpl_lang', lang); } catch (e) { }
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    renderAll();
  });
  $('btnReset').addEventListener('click', () => {
    State.steps = []; State.conds = []; State.sel = {}; recompute(); autoChartFields(); renderAll(); toast(T('toast.reset'));
  });
  $('btnClearPipe').addEventListener('click', () => { State.steps = []; recompute(); ensureChartFields(); renderAll(); toast(T('toast.cleared')); });
  $('btnCopyCode').addEventListener('click', () => { copy(codeText()); toast(T('code.copied')); });
  $('btnHelp').addEventListener('click', () => {
    $('helpTitle').textContent = T('help.title');
    $('helpBody').innerHTML = ['l1', 'l2', 'l3', 'l4', 'l5'].map(k => '<p>' + esc(T('help.' + k)) + '</p>').join('');
    $('btnCloseHelp').textContent = T('help.close');
    $('helpMask').classList.remove('hidden');
  });
  $('btnCloseHelp').addEventListener('click', () => $('helpMask').classList.add('hidden'));
  $('helpMask').addEventListener('click', e => { if (e.target === $('helpMask')) $('helpMask').classList.add('hidden'); });

  window.addEventListener('resize', () => {
    const box = $('chartBox');
    if (box && typeof echarts !== 'undefined') { const c = echarts.getInstanceByDom(box); if (c) c.resize(); }
  });

  /* ================= 启动 ================= */
  function boot() {
    try {
      const lang = localStorage.getItem('vpl_lang');
      if (lang === 'en' || lang === 'zh') window.I18N.set(lang);
    } catch (e) { }
    /* URL 深链：?lang=en&tab=chart&module=group&ctype=scatter&cx=date&cy=sales */
    let chartQ = null;
    try {
      const q = new URLSearchParams(location.search);
      if (q.get('lang') === 'en' || q.get('lang') === 'zh') window.I18N.set(q.get('lang'));
      const tabs = ['data', 'profile', 'chart', 'code'];
      if (tabs.includes(q.get('tab'))) State.tab = q.get('tab');
      if (MODULES.some(m => m.id === q.get('module'))) State.module = q.get('module');
      if (q.get('ctype') || q.get('cx') || q.get('cy')) {
        chartQ = {
          type: q.get('ctype'), x: q.get('cx'),
          ys: q.get('cy') ? q.get('cy').split(',') : null,
          agg: q.get('agg'), y2: q.get('cy2'), stack: q.get('stack') === '1',
        };
      }
    } catch (e) { }
    document.documentElement.lang = window.I18N.lang === 'zh' ? 'zh-CN' : 'en';
    let df = null;
    try {
      const raw = localStorage.getItem('vpl_default');
      if (raw) {
        const o = JSON.parse(raw);
        if (o && o.cols && o.rows) df = { nameKey: o.nameKey || null, name: o.name || 'default', cols: o.cols, rows: o.rows };
      }
    } catch (e) { }
    if (!df) df = window.DATASETS.build('sales');
    State.base = df;
    recompute();
    autoChartFields();
    /* 图表深链参数在自动选列之后应用，避免被覆盖 */
    if (chartQ) {
      if (chartQ.type) State.chart.type = chartQ.type;
      if (chartQ.x) State.chart.x = chartQ.x;
      if (chartQ.ys && chartQ.ys.length) State.chart.ys = chartQ.ys;
      if (chartQ.agg) State.chart.agg = chartQ.agg;
      if (chartQ.y2) State.chart.y2 = chartQ.y2;
      if (chartQ.stack) State.chart.stack = true;
    }
    renderAll();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
