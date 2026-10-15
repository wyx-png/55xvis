/* ============================================================
   Visual Pandas Lab · 数据引擎
   纯前端实现 pandas 常用操作，每一步同时生成等价 pandas 代码
   ============================================================ */
(function () {
  const T = (k, v) => window.I18N.t(k, v);
  const LANG = () => window.I18N.lang;

  /* ---------- 基础工具 ---------- */
  function isNull(v) {
    return v === null || v === undefined || v === '' || (typeof v === 'number' && !isFinite(v));
  }
  function toNum(v) {
    if (isNull(v)) return null;
    if (typeof v === 'number') return isFinite(v) ? v : null;
    if (typeof v === 'boolean') return v ? 1 : 0;
    const s = String(v).replace(/[,\s%¥$￥]/g, '');
    if (s === '') return null;
    const n = Number(s);
    return isFinite(n) ? n : null;
  }
  function clone(df) {
    return {
      nameKey: df.nameKey, name: df.name,
      cols: df.cols.map(c => Object.assign({}, c)),
      rows: df.rows.map(r => Object.assign({}, r)),
    };
  }
  function colOf(df, key) { return df.cols.find(c => c.key === key); }
  function label(col) {
    if (!col) return '';
    return (LANG() === 'en' ? (col.en || col.zh) : (col.zh || col.en)) || col.key;
  }
  /* 展示值（分类值走双语映射） */
  function disp(df, colKey, v) {
    const c = colOf(df, colKey);
    if (isNull(v)) return null;
    if (c && c.map && c.map[v]) return c.map[v][LANG()] || c.map[v].zh || v;
    if (typeof v === 'boolean') return v ? T('common.true_') : T('common.false_');
    return v;
  }
  function dispStr(df, colKey, v) {
    const d = disp(df, colKey, v);
    return isNull(d) ? T('grid.nullVal') : String(d);
  }
  function fmtNum(n) {
    if (isNull(n)) return T('grid.nullVal');
    const x = Number(n);
    if (!isFinite(x)) return T('grid.nullVal');
    if (Math.abs(x) >= 1000) return x.toLocaleString('en-US', { maximumFractionDigits: 2 });
    return String(Number(x.toFixed(4)));
  }

  function inferDtype(vals) {
    let nonNull = 0, num = 0, date = 0, bool = 0;
    for (const v of vals) {
      if (isNull(v)) continue;
      nonNull++;
      if (typeof v === 'boolean') { bool++; continue; }
      if (typeof v === 'number') { num++; continue; }
      const s = String(v).trim();
      if (/^(true|false)$/i.test(s)) { bool++; continue; }
      if (/^-?\d+(\.\d+)?$/.test(s.replace(/,/g, '')) && toNum(s) !== null) { num++; continue; }
      if (/^\d{4}-\d{1,2}-\d{1,2}([ T].*)?$/.test(s) || /^\d{4}\/\d{1,2}\/\d{1,2}$/.test(s)) date++;
    }
    if (!nonNull) return 'string';
    if (bool === nonNull) return 'bool';
    if (num === nonNull) return 'number';
    if (date / nonNull > 0.8) return 'date';
    if (num / nonNull > 0.7) return 'number';
    return 'string';
  }

  /* 由表头 + 二维数组构建 DataFrame */
  function fromMatrix(headers, rows, nameKey, name) {
    const cols = headers.map((h, i) => {
      const key = String(h == null || h === '' ? 'col_' + (i + 1) : h).trim();
      return { key, zh: key, en: key, dtype: 'string' };
    });
    const out = rows.map(r => {
      const o = {};
      cols.forEach((c, i) => { o[c.key] = r[i] === undefined ? null : r[i]; });
      return o;
    });
    return normalize({ nameKey, name, cols, rows: out });
  }
  function normalize(df) {
    const cols = df.cols.map(c => Object.assign({}, c));
    cols.forEach(c => { c.dtype = c.dtype || inferDtype(df.rows.map(r => r[c.key])); });
    return { nameKey: df.nameKey, name: df.name, cols, rows: df.rows };
  }

  /* ---------- 统计 ---------- */
  function quantile(sorted, p) {
    const n = sorted.length;
    if (!n) return null;
    const idx = (n - 1) * p;
    const lo = Math.floor(idx), hi = Math.ceil(idx);
    if (lo === hi) return sorted[lo];
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
  }
  function mean(a) { return a.length ? a.reduce((s, v) => s + v, 0) / a.length : null; }
  function std(a) {
    if (a.length < 2) return a.length === 1 ? 0 : null;
    const m = mean(a);
    return Math.sqrt(a.reduce((s, v) => s + (v - m) * (v - m), 0) / (a.length - 1));
  }
  function nums(df, key) {
    const out = [];
    for (const r of df.rows) { const n = toNum(r[key]); if (n !== null) out.push(n); }
    return out;
  }
  function describe(df) {
    const res = [];
    for (const c of df.cols) {
      if (c.dtype === 'number') {
        const a = nums(df, c.key).slice().sort((x, y) => x - y);
        res.push({
          col: c, kind: 'number', count: a.length, mean: mean(a), std: std(a),
          min: a.length ? a[0] : null, p25: quantile(a, 0.25), p50: quantile(a, 0.5),
          p75: quantile(a, 0.75), max: a.length ? a[a.length - 1] : null,
        });
      } else {
        const vals = df.rows.map(r => r[c.key]).filter(v => !isNull(v));
        const freq = {};
        vals.forEach(v => { const k = String(v); freq[k] = (freq[k] || 0) + 1; });
        const keys = Object.keys(freq);
        let top = null, topN = 0;
        keys.forEach(k => { if (freq[k] > topN) { topN = freq[k]; top = k; } });
        res.push({
          col: c, kind: 'cat', count: vals.length, unique: keys.length,
          top: top == null ? null : disp(df, c.key, keys.includes(top) ? (c.dtype === 'number' ? Number(top) : top) : top),
          freq: topN,
        });
      }
    }
    return res;
  }
  function info(df) {
    return df.cols.map(c => {
      const vals = df.rows.map(r => r[c.key]);
      const nonNull = vals.filter(v => !isNull(v)).length;
      const uniq = new Set(vals.filter(v => !isNull(v)).map(v => String(v))).size;
      const sample = vals.find(v => !isNull(v));
      return { col: c, nonNull, nullCount: vals.length - nonNull, unique: uniq, sample };
    });
  }
  function corr(df) {
    const numCols = df.cols.filter(c => c.dtype === 'number');
    const m = numCols.map(c => nums(df, c.key));
    const n = numCols.length;
    const mat = [];
    for (let i = 0; i < n; i++) {
      mat.push([]);
      for (let j = 0; j < n; j++) {
        if (i === j) { mat[i].push(1); continue; }
        const a = m[i], b = m[j];
        const len = Math.min(a.length, b.length);
        if (!len) { mat[i].push(null); continue; }
        const ma = mean(a.slice(0, len)), mb = mean(b.slice(0, len));
        let num = 0, da = 0, db = 0;
        for (let k = 0; k < len; k++) {
          const x = a[k] - ma, y = b[k] - mb;
          num += x * y; da += x * x; db += y * y;
        }
        mat[i].push(da && db ? Number((num / Math.sqrt(da * db)).toFixed(3)) : null);
      }
    }
    return { cols: numCols, mat };
  }
  function valueCounts(df, key) {
    const freq = new Map();
    for (const r of df.rows) {
      const v = r[key];
      const k = isNull(v) ? '\u0000null' : String(v);
      freq.set(k, (freq.get(k) || 0) + 1);
    }
    return Array.from(freq.entries())
      .map(([k, n]) => ({ value: k === '\u0000null' ? null : k, count: n }))
      .sort((a, b) => b.count - a.count);
  }
  function dupCount(df) {
    const seen = new Set(); let dup = 0;
    for (const r of df.rows) {
      const k = df.cols.map(c => String(r[c.key])).join('\u0001');
      if (seen.has(k)) dup++; else seen.add(k);
    }
    return dup;
  }
  function missingByCol(df) {
    return df.cols.map(c => ({
      col: c,
      rate: df.rows.length ? df.rows.filter(r => isNull(r[c.key])).length / df.rows.length : 0,
      count: df.rows.filter(r => isNull(r[c.key])).length,
    }));
  }

  /* ---------- 条件筛选 ---------- */
  function testCond(df, r, cond) {
    const c = colOf(df, cond.col);
    if (!c) return true;
    const v = r[cond.col];
    if (cond.op === 'isnull') return isNull(v);
    if (cond.op === 'notnull') return !isNull(v);
    if (isNull(v)) return false;
    const s = String(v);
    const target = cond.value;
    switch (cond.op) {
      case '>': return toNum(v) > toNum(target);
      case '>=': return toNum(v) >= toNum(target);
      case '<': return toNum(v) < toNum(target);
      case '<=': return toNum(v) <= toNum(target);
      case '==': return c.dtype === 'number' ? toNum(v) === toNum(target) : s === String(target);
      case '!=': return c.dtype === 'number' ? toNum(v) !== toNum(target) : s !== String(target);
      case 'contains': return s.toLowerCase().includes(String(target).toLowerCase());
      case 'notcontains': return !s.toLowerCase().includes(String(target).toLowerCase());
      case 'startswith': return s.toLowerCase().startsWith(String(target).toLowerCase());
      case 'endswith': return s.toLowerCase().endsWith(String(target).toLowerCase());
      default: return true;
    }
  }
  function filterMask(df, conds, logic) {
    return df.rows.filter(r => {
      if (!conds.length) return true;
      const tests = conds.map(c => testCond(df, r, c));
      return logic === 'or' ? tests.some(Boolean) : tests.every(Boolean);
    });
  }

  /* ---------- 表达式求值（新列） ---------- */
  const FNS = {
    round: 1, abs: 1, sqrt: 1, log: 1, exp: 1, floor: 1, ceil: 1, min: 2, max: 2, pow: 2,
  };
  function tokenize(expr) {
    const tokens = [];
    let i = 0;
    while (i < expr.length) {
      const ch = expr[i];
      if (/\s/.test(ch)) { i++; continue; }
      if (/[0-9.]/.test(ch)) {
        let j = i;
        while (j < expr.length && /[0-9.]/.test(expr[j])) j++;
        tokens.push({ t: 'num', v: parseFloat(expr.slice(i, j)) }); i = j; continue;
      }
      if (/[A-Za-z_\u4e00-\u9fa5]/.test(ch)) {
        let j = i;
        while (j < expr.length && /[A-Za-z0-9_\u4e00-\u9fa5]/.test(expr[j])) j++;
        tokens.push({ t: 'id', v: expr.slice(i, j) }); i = j; continue;
      }
      if ('+-*/(),'.includes(ch)) { tokens.push({ t: 'op', v: ch }); i++; continue; }
      throw new Error('bad char ' + ch);
    }
    return tokens;
  }
  function toRPN(tokens) {
    const prec = { '+': 1, '-': 1, '*': 2, '/': 2 };
    const out = [], stack = [];
    let prev = null;
    for (const tk of tokens) {
      if (tk.t === 'num') { out.push(tk); }
      else if (tk.t === 'id') {
        if (prev && (prev.t === 'num' || prev.t === 'id' || prev.v === ')')) throw new Error('missing operator');
        out.push(tk);
      } else if (tk.v === ',') {
        while (stack.length && stack[stack.length - 1].v !== '(') out.push(stack.pop());
        if (!stack.length) throw new Error('comma outside function');
      } else if (tk.v === '(') {
        if (prev && prev.t === 'id' && FNS[prev.v]) { /* 函数调用 */ }
        stack.push(tk);
      } else if (tk.v === ')') {
        while (stack.length && stack[stack.length - 1].v !== '(') out.push(stack.pop());
        if (!stack.length) throw new Error('unbalanced parens');
        stack.pop();
        if (stack.length && stack[stack.length - 1].t === 'id' && FNS[stack[stack.length - 1].v]) out.push(stack.pop());
      } else {
        while (stack.length && stack[stack.length - 1].v !== '(' && prec[stack[stack.length - 1].v] >= prec[tk.v]) out.push(stack.pop());
        stack.push(tk);
      }
      prev = tk;
    }
    while (stack.length) {
      const s = stack.pop();
      if (s.v === '(') throw new Error('unbalanced parens');
      out.push(s);
    }
    return out;
  }
  /* 编译表达式：返回 (row)=>number|null */
  function compileExpr(expr, df) {
    const rpn = toRPN(tokenize(expr));
    const known = new Set(df.cols.map(c => c.key));
    const labels = new Map();
    df.cols.forEach(c => { labels.set(c.zh, c.key); labels.set(c.en, c.key); labels.set(c.key, c.key); });
    const rpn2 = rpn.map(tk => {
      if (tk.t === 'id') {
        if (FNS[tk.v]) return tk;
        const key = known.has(tk.v) ? tk.v : labels.get(tk.v);
        if (!key) throw new Error('unknown "' + tk.v + '"');
        return { t: 'col', v: key };
      }
      return tk;
    });
    return function (row) {
      const st = [];
      for (const tk of rpn2) {
        if (tk.t === 'num') st.push(tk.v);
        else if (tk.t === 'col') {
          const n = toNum(row[tk.v]);
          if (n === null) return null;
          st.push(n);
        } else if (FNS[tk.v]) {
          const arity = FNS[tk.v];
          if (st.length < arity) return null;
          const args = [];
          for (let i = 0; i < arity; i++) args.unshift(st.pop());
          let v;
          switch (tk.v) {
            case 'round': v = Math.round(args[0] * 100) / 100; break;
            case 'abs': v = Math.abs(args[0]); break;
            case 'sqrt': v = args[0] < 0 ? null : Math.sqrt(args[0]); break;
            case 'log': v = args[0] > 0 ? Math.log(args[0]) : null; break;
            case 'exp': v = Math.exp(args[0]); break;
            case 'floor': v = Math.floor(args[0]); break;
            case 'ceil': v = Math.ceil(args[0]); break;
            case 'min': v = Math.min(args[0], args[1]); break;
            case 'max': v = Math.max(args[0], args[1]); break;
            case 'pow': v = Math.pow(args[0], args[1]); break;
            default: v = null;
          }
          if (v === null) return null;
          st.push(v);
        } else {
          const b = st.pop(), a = st.pop();
          if (a === undefined || b === undefined) return null;
          let v;
          switch (tk.v) {
            case '+': v = a + b; break;
            case '-': v = a - b; break;
            case '*': v = a * b; break;
            case '/': v = b === 0 ? null : a / b; break;
            default: v = null;
          }
          if (v === null || !isFinite(v)) return null;
          st.push(v);
        }
      }
      return st.length ? st[st.length - 1] : null;
    };
  }

  /* ---------- 聚合函数 ---------- */
  const AGGS = ['sum', 'mean', 'median', 'count', 'min', 'max', 'std', 'var', 'nunique'];
  function aggLabel(agg) {
    const map = { sum: 'aSum', mean: 'aMean', median: 'aMedian', count: 'aCount', min: 'aMin', max: 'aMax', std: 'aStd', var: 'aVar', nunique: 'aNunique' };
    return T('group.' + map[agg]);
  }
  function applyAgg(values, agg) {
    const numsArr = values.map(toNum).filter(v => v !== null);
    switch (agg) {
      case 'sum': return numsArr.length ? Number(numsArr.reduce((s, v) => s + v, 0).toFixed(4)) : null;
      case 'mean': return numsArr.length ? Number(mean(numsArr).toFixed(4)) : null;
      case 'median': return numsArr.length ? Number(quantile(numsArr.slice().sort((a, b) => a - b), 0.5).toFixed(4)) : null;
      case 'count': return values.filter(v => !isNull(v)).length;
      case 'min': return numsArr.length ? Math.min.apply(null, numsArr) : null;
      case 'max': return numsArr.length ? Math.max.apply(null, numsArr) : null;
      case 'std': { const s = std(numsArr); return s == null ? null : Number(s.toFixed(4)); }
      case 'var': { const s = std(numsArr); return s == null ? null : Number((s * s).toFixed(4)); }
      case 'nunique': return new Set(values.filter(v => !isNull(v)).map(v => String(v))).size;
      default: return null;
    }
  }

  /* ============================================================
     操作集合：每个 op(df, p) => { df, code }
     ============================================================ */
  const OPS = {
    head(df, p) {
      const n = Math.max(0, parseInt(p.n, 10) || 5);
      return { df: { nameKey: df.nameKey, name: df.name, cols: df.cols, rows: df.rows.slice(0, n) }, code: 'df = df.head(' + n + ')' };
    },
    tail(df, p) {
      const n = Math.max(0, parseInt(p.n, 10) || 5);
      return { df: { nameKey: df.nameKey, name: df.name, cols: df.cols, rows: df.rows.slice(-n) }, code: 'df = df.tail(' + n + ')' };
    },
    sample(df, p) {
      const n = Math.max(0, parseInt(p.n, 10) || 5);
      const idx = df.rows.map((_, i) => i);
      for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
      const rows = idx.slice(0, n).sort((a, b) => a - b).map(i => df.rows[i]);
      return { df: { nameKey: df.nameKey, name: df.name, cols: df.cols, rows }, code: 'df = df.sample(' + n + ', random_state=1)' };
    },
    select(df, p) {
      const keys = p.cols || [];
      if (!keys.length) throw new Error(T('toast.needCol'));
      const cols = keys.map(k => colOf(df, k)).filter(Boolean);
      const rows = df.rows.map(r => { const o = {}; cols.forEach(c => { o[c.key] = r[c.key]; }); return o; });
      return {
        df: { nameKey: df.nameKey, name: df.name, cols, rows },
        code: 'df = df[[' + cols.map(c => "'" + label(c) + "'").join(', ') + ']]',
      };
    },
    dropcols(df, p) {
      const keys = p.cols || [];
      if (!keys.length) throw new Error(T('toast.needCol'));
      const cols = df.cols.filter(c => !keys.includes(c.key));
      if (!cols.length) throw new Error(T('toast.needCol'));
      const rows = df.rows.map(r => { const o = {}; cols.forEach(c => { o[c.key] = r[c.key]; }); return o; });
      return {
        df: { nameKey: df.nameKey, name: df.name, cols, rows },
        code: 'df = df.drop(columns=[' + keys.map(k => "'" + label(colOf(df, k)) + "'").join(', ') + '])',
      };
    },
    filter(df, p) {
      const conds = (p.conds || []).filter(c => c.col && (c.op === 'isnull' || c.op === 'notnull' || (c.value !== '' && c.value != null)));
      if (!conds.length) throw new Error(T('select.needVal'));
      const rows = filterMask(df, conds, p.logic || 'and');
      const code = 'df = df[' + conds.map(c => {
        const cname = label(colOf(df, c.col));
        if (c.op === 'isnull') return "df['" + cname + "'].isna()";
        if (c.op === 'notnull') return "df['" + cname + "'].notna()";
        const val = (colOf(df, c.col) || {}).dtype === 'number' ? disp(df, c.col, c.value) : "'" + disp(df, c.col, c.value) + "'";
        if (['contains', 'notcontains', 'startswith', 'endswith'].includes(c.op)) {
          const neg = c.op.startsWith('not') ? '~' : '';
          const m = { contains: 'contains', notcontains: 'contains', startswith: 'startswith', endswith: 'endswith' }[c.op];
          return neg + "df['" + cname + "'].str." + m + "('" + disp(df, c.col, c.value) + "')";
        }
        return "(df['" + cname + "'] " + c.op + ' ' + val + ')';
      }).join(p.logic === 'or' ? ' | ' : ' & ') + ']';
      return { df: { nameKey: df.nameKey, name: df.name, cols: df.cols, rows }, code };
    },
    iloc(df, p) {
      const a = parseInt(p.start, 10) || 0;
      const b = p.end === '' || p.end == null ? df.rows.length : parseInt(p.end, 10);
      const rows = df.rows.slice(a, b);
      return { df: { nameKey: df.nameKey, name: df.name, cols: df.cols, rows }, code: 'df = df.iloc[' + a + ':' + b + ']' };
    },
    dropna(df, p) {
      const how = p.how || 'any';
      const subset = p.cols || [];
      let code, rows;
      if (how === 'subset') {
        if (!subset.length) throw new Error(T('toast.needCol'));
        rows = df.rows.filter(r => subset.every(k => !isNull(r[k])));
        code = 'df = df.dropna(subset=[' + subset.map(k => "'" + label(colOf(df, k)) + "'").join(', ') + '])';
      } else {
        /* how='any'：任一列缺失即删 → 保留全部非空的行；how='all'：整行全缺才删 → 保留至少一个非空的行 */
        rows = df.rows.filter(r => how === 'all' ? df.cols.some(c => !isNull(r[c.key])) : df.cols.every(c => !isNull(r[c.key])));
        code = 'df = df.dropna(how="' + how + '")';
      }
      return { df: { nameKey: df.nameKey, name: df.name, cols: df.cols, rows }, code };
    },
    fillna(df, p) {
      const key = p.col; if (!key) throw new Error(T('toast.needCol'));
      const how = p.how || 'mean';
      const d = clone(df);
      const arr = nums(d, key);
      let fill = null, code;
      switch (how) {
        case 'mean': fill = Number(mean(arr).toFixed(4)); code = "df['" + label(colOf(d, key)) + "'] = df['" + label(colOf(d, key)) + "'].fillna(df['" + label(colOf(d, key)) + "'].mean())"; break;
        case 'median': { const s = arr.slice().sort((a, b) => a - b); fill = Number(quantile(s, 0.5).toFixed(4)); code = "df['" + label(colOf(d, key)) + "'] = df['" + label(colOf(d, key)) + "'].fillna(df['" + label(colOf(d, key)) + "'].median())"; break; }
        case 'mode': {
          const vc = valueCounts(d, key).filter(x => x.value !== null);
          fill = vc.length ? d.rows.find(r => String(r[key]) === String(vc[0].value))[key] : null;
          code = "df['" + label(colOf(d, key)) + "'] = df['" + label(colOf(d, key)) + "'].fillna(df['" + label(colOf(d, key)) + "'].mode()[0])"; break;
        }
        case 'zero': fill = 0; code = "df['" + label(colOf(d, key)) + "'] = df['" + label(colOf(d, key)) + "'].fillna(0)"; break;
        case 'ffill': code = "df['" + label(colOf(d, key)) + "'] = df['" + label(colOf(d, key)) + "'].fillna(method='ffill')"; break;
        case 'bfill': code = "df['" + label(colOf(d, key)) + "'] = df['" + label(colOf(d, key)) + "'].fillna(method='bfill')"; break;
        default: fill = p.value; code = "df['" + label(colOf(d, key)) + "'] = df['" + label(colOf(d, key)) + "'].fillna(" + (colOf(d, key).dtype === 'number' ? toNum(p.value) : "'" + p.value + "'") + ")";
      }
      if (how === 'ffill' || how === 'bfill') {
        let last = null;
        const seq = how === 'ffill' ? d.rows : d.rows.slice().reverse();
        seq.forEach(r => {
          if (isNull(r[key])) { if (last !== null) r[key] = last; } else last = r[key];
        });
      } else {
        d.rows.forEach(r => { if (isNull(r[key]) && fill !== null) r[key] = fill; });
      }
      return { df: d, code };
    },
    dropdup(df, p) {
      const keys = (p.cols || []).length ? p.cols : df.cols.map(c => c.key);
      const keep = p.keep || 'first';
      const seen = new Set();
      const rows = [];
      const src = keep === 'last' ? df.rows.slice().reverse() : df.rows;
      src.forEach(r => {
        const k = keys.map(x => String(r[x])).join('\u0001');
        if (seen.has(k)) return;
        seen.add(k); rows.push(r);
      });
      let out = keep === 'last' ? rows.reverse() : rows;
      if (keep === 'none') {
        const cnt = new Map();
        df.rows.forEach(r => { const k = keys.map(x => String(r[x])).join('\u0001'); cnt.set(k, (cnt.get(k) || 0) + 1); });
        out = df.rows.filter(r => cnt.get(keys.map(x => String(r[x])).join('\u0001')) === 1);
      }
      return {
        df: { nameKey: df.nameKey, name: df.name, cols: df.cols, rows: out },
        code: 'df = df.drop_duplicates(' + ((p.cols || []).length ? 'subset=[' + p.cols.map(k => "'" + label(colOf(df, k)) + "'").join(', ') + '], ' : '') + "keep='" + keep + "')",
      };
    },
    rename(df, p) {
      const c = colOf(df, p.col); if (!c || !p.newName) throw new Error(T('toast.needCol'));
      const d = clone(df);
      const cc = colOf(d, p.col);
      if (LANG() === 'en') cc.en = p.newName; else cc.zh = p.newName;
      return { df: d, code: "df = df.rename(columns={'" + label(c) + "': '" + p.newName + "'})" };
    },
    astype(df, p) {
      const c = colOf(df, p.col); if (!c) throw new Error(T('toast.needCol'));
      const d = clone(df);
      const cc = colOf(d, p.col);
      const t = p.type;
      d.rows.forEach(r => {
        const v = r[cc.key];
        if (isNull(v)) { r[cc.key] = null; return; }
        if (t === 'number') r[cc.key] = toNum(v);
        else if (t === 'string') r[cc.key] = String(v);
        else if (t === 'bool') r[cc.key] = !!(typeof v === 'boolean' ? v : (String(v).match(/^(true|1|yes|y)$/i) ? true : false));
        else r[cc.key] = String(v);
      });
      cc.dtype = t === 'date' ? 'string' : t;
      const pyType = { number: 'float', string: 'str', bool: 'bool', date: 'str' }[t];
      return { df: d, code: "df['" + label(c) + "'] = df['" + label(c) + "'].astype('" + pyType + "')" };
    },
    replace(df, p) {
      const c = colOf(df, p.col); if (!c) throw new Error(T('toast.needCol'));
      const d = clone(df);
      d.rows.forEach(r => {
        if (String(r[c.key]) === String(p.oldVal)) {
          r[c.key] = c.dtype === 'number' ? toNum(p.newVal) : p.newVal;
        }
      });
      const ov = c.dtype === 'number' ? toNum(p.oldVal) : "'" + p.oldVal + "'";
      const nv = c.dtype === 'number' ? toNum(p.newVal) : "'" + p.newVal + "'";
      return { df: d, code: "df['" + label(c) + "'] = df['" + label(c) + "'].replace(" + ov + ', ' + nv + ')' };
    },
    str(df, p) {
      const c = colOf(df, p.col); if (!c) throw new Error(T('toast.needCol'));
      const d = clone(df);
      const fn = p.fn;
      const n = parseInt(p.n, 10) || 5;
      d.rows.forEach(r => {
        const v = r[c.key];
        if (isNull(v)) return;
        const s = String(v);
        r[c.key] = fn === 'trim' ? s.trim()
          : fn === 'upper' ? s.toUpperCase()
            : fn === 'lower' ? s.toLowerCase()
              : fn === 'title' ? s.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                : fn === 'slice' ? s.slice(0, n)
                  : fn === 'len' ? s.length : s;
      });
      if (fn === 'len') colOf(d, c.key).dtype = 'number';
      const py = { trim: '.str.strip()', upper: '.str.upper()', lower: '.str.lower()', title: '.str.title()', slice: '.str[:' + n + ']', len: '.str.len()' }[fn];
      return { df: d, code: "df['" + label(c) + "'] = df['" + label(c) + "']" + py };
    },
    sort(df, p) {
      const keys = p.cols || []; if (!keys.length) throw new Error(T('toast.needCol'));
      const asc = p.order !== 'desc';
      const rows = df.rows.slice().sort((a, b) => {
        for (const k of keys) {
          const c = colOf(df, k);
          let av = a[k], bv = b[k];
          if (c && c.dtype === 'number') { av = toNum(av); bv = toNum(bv); }
          else { av = String(av == null ? '' : av); bv = String(bv == null ? '' : bv); }
          if (av === bv) continue;
          if (av == null) return 1; if (bv == null) return -1;
          return (av > bv ? 1 : -1) * (asc ? 1 : -1);
        }
        return 0;
      });
      return {
        df: { nameKey: df.nameKey, name: df.name, cols: df.cols, rows },
        code: 'df = df.sort_values(' + (keys.length > 1 ? '[' : '') + keys.map(k => "'" + label(colOf(df, k)) + "'").join(', ') + (keys.length > 1 ? ']' : '') + ', ascending=' + (asc ? 'True' : 'False') + ')',
      };
    },
    newcol(df, p) {
      if (!p.name) throw new Error(T('toast.needExpr'));
      if (!p.expr) throw new Error(T('toast.needExpr'));
      const fn = compileExpr(p.expr, df);
      const key = 'c_' + p.name.replace(/[^\w\u4e00-\u9fa5]/g, '_');
      const d = clone(df);
      d.rows.forEach(r => { r[key] = fn(r); });
      d.cols.push({ key, zh: p.name, en: p.name, dtype: 'number' });
      return { df: d, code: "df['" + p.name + "'] = " + p.expr };
    },
    apply(df, p) {
      const c = colOf(df, p.col); if (!c) throw new Error(T('toast.needCol'));
      const d = clone(df);
      const vals = nums(d, c.key);
      const m0 = mean(vals), sd = std(vals);
      const mn = vals.length ? Math.min.apply(null, vals) : 0, mx = vals.length ? Math.max.apply(null, vals) : 0;
      const fn = p.fn;
      d.rows.forEach(r => {
        const n = toNum(r[c.key]);
        if (n === null) { r[c.key] = null; return; }
        let v = n;
        switch (fn) {
          case 'round': v = Math.round(n * 100) / 100; break;
          case 'abs': v = Math.abs(n); break;
          case 'sqrt': v = n < 0 ? null : Math.sqrt(n); break;
          case 'log': v = n > 0 ? Math.log(n) : null; break;
          case 'exp': v = Math.exp(n); break;
          case 'floor': v = Math.floor(n); break;
          case 'ceil': v = Math.ceil(n); break;
          case 'neg': v = -n; break;
          case 'zscore': v = sd ? Number(((n - m0) / sd).toFixed(4)) : 0; break;
          case 'minmax': v = mx !== mn ? Number(((n - mn) / (mx - mn)).toFixed(4)) : 0; break;
          default: v = n;
        }
        r[c.key] = v === null ? null : Number(Number(v).toFixed(6));
      });
      const py = {
        round: '.round(2)', abs: '.abs()', sqrt: '.apply(np.sqrt)', log: '.apply(np.log)',
        exp: '.apply(np.exp)', floor: '.apply(np.floor)', ceil: '.apply(np.ceil)', neg: ' * -1',
        zscore: ' = (df[c] - df[c].mean()) / df[c].std()', minmax: ' = (df[c] - df[c].min()) / (df[c].max() - df[c].min())',
      }[fn] || '';
      const nm = label(c);
      let code;
      if (fn === 'zscore' || fn === 'minmax') {
        code = "df['" + nm + "']" + py.replace(/df\[c\]/g, "df['" + nm + "']");
      } else {
        code = "df['" + nm + "'] = df['" + nm + "']" + py;
      }
      return { df: d, code };
    },
    rank(df, p) {
      const c = colOf(df, p.col); if (!c) throw new Error(T('toast.needCol'));
      const d = clone(df);
      const desc = p.dir !== 'asc';
      const key = c.key + '_rank';
      const order = d.rows.map((r, i) => ({ i, v: toNum(r[c.key]) }))
        .sort((a, b) => {
          if (a.v == null && b.v == null) return a.i - b.i;
          if (a.v == null) return 1; if (b.v == null) return -1;
          return (a.v - b.v) * (desc ? -1 : 1);
        });
      let rank = 0, prev = null;
      order.forEach((o, idx) => {
        if (prev === null || o.v !== prev) { rank = idx + 1; prev = o.v; }
        d.rows[o.i][key] = o.v == null ? null : rank;
      });
      d.cols.push({ key, zh: (c.zh || label(c)) + '_排名', en: (c.en || c.key) + '_rank', dtype: 'number' });
      return { df: d, code: "df['" + label(c) + "_rank'] = df['" + label(c) + "'].rank(ascending=" + (desc ? 'False' : 'True') + ", method='min')" };
    },
    cum(df, p) {
      const c = colOf(df, p.col); if (!c) throw new Error(T('toast.needCol'));
      const d = clone(df);
      const fn = p.fn || 'sum';
      const suffix = { sum: '累计和', max: '累计最大', min: '累计最小', mean: '累计均值' };
      const suffixEn = { sum: 'cumsum', max: 'cummax', min: 'cummin', mean: 'cummean' };
      const key = c.key + '_' + suffixEn[fn];
      let acc = null, n = 0, sum = 0;
      d.rows.forEach(r => {
        const v = toNum(r[c.key]);
        if (v === null) { r[key] = null; return; }
        n++; sum += v;
        if (fn === 'sum') acc = Number(sum.toFixed(6));
        else if (fn === 'max') acc = acc === null ? v : Math.max(acc, v);
        else if (fn === 'min') acc = acc === null ? v : Math.min(acc, v);
        else acc = Number((sum / n).toFixed(6));
        r[key] = acc;
      });
      d.cols.push({ key, zh: (c.zh || label(c)) + '_' + suffix[fn], en: (c.en || c.key) + '_' + suffixEn[fn], dtype: 'number' });
      const py = { sum: 'cumsum()', max: 'cummax()', min: 'cummin()' }[fn] || 'expanding().mean()';
      return { df: d, code: "df['" + label(c) + '_' + suffixEn[fn] + "'] = df['" + label(c) + "']." + py };
    },
    diff(df, p) {
      const c = colOf(df, p.col); if (!c) throw new Error(T('toast.needCol'));
      const per = Math.max(1, parseInt(p.periods, 10) || 1);
      const d = clone(df);
      const key = c.key + '_diff' + per;
      d.rows.forEach((r, i) => {
        const cur = toNum(r[c.key]);
        const prev = i - per >= 0 ? toNum(d.rows[i - per][c.key]) : null;
        r[key] = (cur === null || prev === null) ? null : Number((cur - prev).toFixed(6));
      });
      d.cols.push({ key, zh: (c.zh || label(c)) + '_差分' + per, en: (c.en || c.key) + '_diff' + per, dtype: 'number' });
      return { df: d, code: "df['" + label(c) + '_diff' + per + "'] = df['" + label(c) + "'].diff(" + per + ')' };
    },
    pct(df, p) {
      const c = colOf(df, p.col); if (!c) throw new Error(T('toast.needCol'));
      const per = Math.max(1, parseInt(p.periods, 10) || 1);
      const d = clone(df);
      const key = c.key + '_pct' + per;
      d.rows.forEach((r, i) => {
        const cur = toNum(r[c.key]);
        const prev = i - per >= 0 ? toNum(d.rows[i - per][c.key]) : null;
        r[key] = (cur === null || prev === null || prev === 0) ? null : Number(((cur - prev) / prev * 100).toFixed(4));
      });
      d.cols.push({ key, zh: (c.zh || label(c)) + '_变化率' + per, en: (c.en || c.key) + '_pct' + per, dtype: 'number' });
      return { df: d, code: "df['" + label(c) + '_pct' + per + "'] = df['" + label(c) + "'].pct_change(" + per + ') * 100' };
    },
    rolling(df, p) {
      const c = colOf(df, p.col); if (!c) throw new Error(T('toast.needCol'));
      const w = Math.max(1, parseInt(p.window, 10) || 3);
      const fn = p.fn || 'mean';
      const d = clone(df);
      const key = c.key + '_roll' + w;
      const arr = d.rows.map(r => toNum(r[c.key]));
      d.rows.forEach((r, i) => {
        const win = arr.slice(Math.max(0, i - w + 1), i + 1).filter(v => v !== null);
        let v = null;
        if (win.length) {
          if (fn === 'mean') v = Number(mean(win).toFixed(6));
          else if (fn === 'sum') v = Number(win.reduce((s, x) => s + x, 0).toFixed(6));
          else if (fn === 'max') v = Math.max.apply(null, win);
          else if (fn === 'min') v = Math.min.apply(null, win);
          else v = win.length > 1 ? Number(std(win).toFixed(6)) : 0;
        }
        r[key] = v;
      });
      d.cols.push({ key, zh: (c.zh || label(c)) + '_滚动' + w, en: (c.en || c.key) + '_roll' + w, dtype: 'number' });
      return { df: d, code: "df['" + label(c) + '_roll' + w + "'] = df['" + label(c) + "'].rolling(" + w + ').' + fn + '()' };
    },
    bin(df, p) {
      const c = colOf(df, p.col); if (!c) throw new Error(T('toast.needCol'));
      const k = Math.max(1, parseInt(p.bins, 10) || 4);
      const method = p.method || 'width';
      const vals = nums(df, c.key).slice().sort((a, b) => a - b);
      let edges = [];
      if (method === 'width') {
        const mn = vals[0], mx = vals[vals.length - 1];
        const step = (mx - mn) / k;
        for (let i = 0; i <= k; i++) edges.push(Number((mn + step * i).toFixed(4)));
      } else {
        for (let i = 0; i <= k; i++) edges.push(Number(quantile(vals, i / k).toFixed(4)));
      }
      const d = clone(df);
      const key = c.key + '_bin';
      const lab = i => '[' + edges[i] + ', ' + edges[i + 1] + (i === k - 1 ? ']' : ')');
      d.rows.forEach(r => {
        const v = toNum(r[c.key]);
        if (v === null) { r[key] = null; return; }
        let idx = k - 1;
        for (let i = 0; i < k; i++) { if (v >= edges[i] && v < edges[i + 1]) { idx = i; break; } }
        if (v >= edges[k]) idx = k - 1;
        r[key] = lab(idx);
      });
      d.cols.push({ key, zh: label(c) + '_分箱', en: label(c) + '_bin', dtype: 'string' });
      return { df: d, code: "df['" + label(c) + "_bin'] = pd.cut(df['" + label(c) + "'], bins=" + k + (method === 'freq' ? ', duplicates="drop"' : '') + ')' };
    },
    group(df, p) {
      const groups = p.groups || []; const measures = p.measures || []; const aggs = p.aggs || [];
      if (!groups.length) throw new Error(T('toast.needCol'));
      if (!measures.length || !aggs.length) throw new Error(T('toast.needY'));
      const map = new Map();
      df.rows.forEach(r => {
        const k = groups.map(g => String(r[g])).join('\u0001');
        if (!map.has(k)) map.set(k, []);
        map.get(k).push(r);
      });
      const cols = groups.map(g => colOf(df, g));
      const mCols = [];
      measures.forEach(m => {
        aggs.forEach(a => {
          const mc = colOf(df, m);
          mCols.push({
            key: m + '_' + a, groupKey: m, agg: a,
            zh: label(mc) + '_' + (LANG() === 'zh' ? aggLabel(a) : a),
            en: (mc.en || mc.key) + '_' + (LANG() === 'en' ? aggLabel(a) : a),
            dtype: 'number',
          });
        });
      });
      const rows = [];
      map.forEach((rs, k) => {
        const o = {};
        groups.forEach((g, i) => { o[g] = rs[0][g]; });
        mCols.forEach(mc => { o[mc.key] = applyAgg(rs.map(r => r[mc.groupKey]), mc.agg); });
        rows.push(o);
      });
      if (p.sort === 'desc' || p.sort === 'asc') {
        const first = mCols[0].key;
        rows.sort((a, b) => {
          const av = toNum(a[first]), bv = toNum(b[first]);
          if (av == null) return 1; if (bv == null) return -1;
          return (av - bv) * (p.sort === 'desc' ? -1 : 1);
        });
      }
      const named = mCols.map(mc => label(colOf(df, mc.groupKey)) + '_' + mc.agg + "=('" + label(colOf(df, mc.groupKey)) + "', '" + mc.agg + "')").join(', ');
      const code = 'df = df.groupby([' + groups.map(g => "'" + label(colOf(df, g)) + "'").join(', ') + '], as_index=False).agg(' + named + ')';
      return { df: { nameKey: df.nameKey, name: df.name, cols: cols.concat(mCols), rows }, code };
    },
    pivot(df, p) {
      const idx = p.index, colk = p.columns, val = p.values, agg = p.agg || 'sum';
      if (!idx || !colk || !val) throw new Error(T('toast.needCol'));
      /* 列 key 校验：key 失效（列集合已变化）时给出友好提示，绝不让 undefined 进入结果列 */
      const idxCol = colOf(df, idx), colCol = colOf(df, colk), valCol = colOf(df, val);
      if (!idxCol || !colCol || !valCol) throw new Error(T('toast.needCol'));
      const colKeys = Array.from(new Set(df.rows.map(r => r[colk]).filter(v => !isNull(v)).map(v => String(v))));
      const idxKeys = Array.from(new Set(df.rows.map(r => r[idx]).filter(v => !isNull(v)).map(v => String(v))));
      const outCols = [idxCol].concat(colKeys.map(k => ({
        key: 'p_' + k,
        zh: (colCol.map && colCol.map[k] ? colCol.map[k].zh : (colCol.map ? k : colCol.zh + '_' + k)),
        en: (colCol.map && colCol.map[k] ? colCol.map[k].en : colCol.en + '_' + k),
        dtype: 'number',
      })));
      const rows = idxKeys.map(ik => {
        const o = {};
        o[idx] = df.rows.find(r => String(r[idx]) === ik)[idx];
        colKeys.forEach((ck, i) => {
          const vals = df.rows.filter(r => String(r[idx]) === ik && String(r[colk]) === ck).map(r => r[val]);
          let v = applyAgg(vals, agg);
          if (p.fill0 && v == null) v = 0;
          o[outCols[i + 1].key] = v;
        });
        return o;
      });
      return {
        df: { nameKey: df.nameKey, name: df.name, cols: outCols, rows },
        code: 'df = df.pivot_table(index="' + label(idxCol) + '", columns="' + label(colCol) + '", values="' + label(valCol) + '", aggfunc="' + agg + '"' + (p.fill0 ? ', fill_value=0' : '') + ').reset_index()',
      };
    },
    melt(df, p) {
      const ids = p.ids || [], vals = p.values || [];
      if (!vals.length) throw new Error(T('toast.needY'));
      const varMap = {};
      vals.forEach(v => { const c = colOf(df, v); varMap[v] = { zh: c.zh || c.key, en: c.en || c.zh || c.key }; });
      const rows = [];
      df.rows.forEach(r => {
        vals.forEach(v => {
          const o = {};
          ids.forEach(i => { o[i] = r[i]; });
          o.variable = v;
          o.value = r[v];
          rows.push(o);
        });
      });
      const cols = ids.map(i => colOf(df, i)).concat([
        { key: 'variable', zh: '变量', en: 'variable', dtype: 'string', map: varMap },
        { key: 'value', zh: '数值', en: 'value', dtype: 'number' },
      ]);
      return {
        df: { nameKey: df.nameKey, name: df.name, cols, rows },
        code: 'df = df.melt(id_vars=[' + ids.map(i => "'" + label(colOf(df, i)) + "'").join(', ') + '], value_vars=[' + vals.map(v => "'" + label(colOf(df, v)) + "'").join(', ') + "], var_name='variable', value_name='value')",
      };
    },
    merge(df, p) {
      const df2 = p.df2;
      if (!df2) throw new Error(T('combine.needDf2'));
      const key = p.key; if (!key) throw new Error(T('combine.needKey'));
      const how = p.how || 'left';
      const sx = (p.suffixes && p.suffixes[0]) || '_x', sy = (p.suffixes && p.suffixes[1]) || '_y';
      const leftCols = df.cols.map(c => ({ key: c.key, zh: c.zh, en: c.en, dtype: c.dtype, map: c.map }));
      const rightCols = [];
      df2.cols.forEach(c => {
        if (c.key === key) return;
        const dup = df.cols.some(x => x.key === c.key);
        rightCols.push({
          key: c.key + (dup ? sy : ''),
          zh: c.zh + (dup ? sy : ''), en: c.en + (dup ? sy : ''), dtype: c.dtype, map: c.map,
        });
      });
      const cols = leftCols.concat(rightCols);
      const rightMap = new Map();
      df2.rows.forEach(r => {
        const k = String(r[key]);
        if (!rightMap.has(k)) rightMap.set(k, []);
        rightMap.get(k).push(r);
      });
      const rows = [];
      const used = new Set();
      df.rows.forEach(r => {
        const k = String(r[key]);
        const matches = rightMap.get(k);
        if (matches && matches.length) {
          matches.forEach(m => {
            const o = {};
            cols.forEach(c => { o[c.key] = null; });
            leftCols.forEach(c => { o[c.key] = r[c.key]; });
            rightCols.forEach(c => {
              const src = c.key.endsWith(sy) && df2.cols.some(x => x.key === c.key.slice(0, -sy.length)) ? c.key.slice(0, -sy.length) : c.key;
              o[c.key] = m[src];
            });
            rows.push(o);
            used.add(k);
          });
        } else if (how === 'left' || how === 'outer') {
          const o = {};
          cols.forEach(c => { o[c.key] = null; });
          leftCols.forEach(c => { o[c.key] = r[c.key]; });
          rows.push(o);
        }
      });
      if (how === 'right' || how === 'outer') {
        df2.rows.forEach(m => {
          const k = String(m[key]);
          if (used.has(k) && how === 'outer') return;
          if (used.has(k)) return;
          const o = {};
          cols.forEach(c => { o[c.key] = null; });
          o[key] = m[key];
          rightCols.forEach(c => {
            const src = c.key.endsWith(sy) && df2.cols.some(x => x.key === c.key.slice(0, -sy.length)) ? c.key.slice(0, -sy.length) : c.key;
            o[c.key] = m[src];
          });
          rows.push(o);
        });
      }
      return {
        df: { nameKey: df.nameKey, name: df.name, cols, rows },
        code: 'df = df.merge(df2, on="' + label(colOf(df, key)) + '", how="' + how + '", suffixes=("' + sx + '", "' + sy + '"))',
      };
    },
    concat(df, p) {
      const df2 = p.df2;
      if (!df2) throw new Error(T('combine.needDf2'));
      const keys = [];
      df.cols.forEach(c => keys.push(c.key));
      df2.cols.forEach(c => { if (!keys.includes(c.key)) keys.push(c.key); });
      const meta = {};
      df.cols.forEach(c => { meta[c.key] = c; });
      df2.cols.forEach(c => { if (!meta[c.key]) meta[c.key] = c; });
      const cols = keys.map(k => ({ key: k, zh: meta[k].zh, en: meta[k].en, dtype: meta[k].dtype, map: meta[k].map }));
      const rows = df.rows.map(r => {
        const o = {}; cols.forEach(c => { o[c.key] = r[c.key] === undefined ? null : r[c.key]; }); return o;
      }).concat(df2.rows.map(r => {
        const o = {}; cols.forEach(c => { o[c.key] = r[c.key] === undefined ? null : r[c.key]; }); return o;
      }));
      return {
        df: { nameKey: df.nameKey, name: df.name, cols, rows },
        code: 'df = pd.concat([df, df2], ignore_index=True)',
      };
    },

    /* ---------- 高阶 1：df.loc 按标签取值 ---------- */
    loc(df, p) {
      const c = colOf(df, p.col); if (!c) throw new Error(T('toast.needCol'));
      const vals = (p.values || []).map(v => String(v));
      if (!vals.length) throw new Error(T('select.locNeedVal'));
      const rows = df.rows.filter(r => vals.includes(String(disp(df, c.key, r[c.key]))) || vals.includes(String(r[c.key])));
      const quoted = vals.map(v => (c.dtype === 'number' ? v : "'" + v + "'")).join(', ');
      return {
        df: { nameKey: df.nameKey, name: df.name, cols: df.cols, rows },
        code: "df = df.loc[df['" + label(c) + "'].isin([" + quoted + '])]',
      };
    },

    /* ---------- 高阶 2：df.query 表达式筛选 ---------- */
    query(df, p) {
      const expr = String(p.expr || '').trim();
      if (!expr) throw new Error(T('select.queryEmpty'));
      const pred = buildQueryFn(df, expr);
      const rows = df.rows.filter(pred);
      return {
        df: { nameKey: df.nameKey, name: df.name, cols: df.cols, rows },
        code: 'df = df.query("' + toPandasQuery(df, expr).replace(/"/g, "'") + '")',
      };
    },

    /* ---------- 高阶 3：resample 时间重采样 ---------- */
    resample(df, p) {
      const c = colOf(df, p.col); if (!c) throw new Error(T('toast.needCol'));
      const v = colOf(df, p.value); if (!v) throw new Error(T('toast.needCol'));
      const freq = p.freq || 'M';
      const agg = p.agg || 'sum';
      const fKey = { D: 'D', W: 'W', M: 'M', Q: 'Q', Y: 'Y' }[freq] || 'M';
      const buckets = new Map(); const order = [];
      df.rows.forEach(r => {
        const d = parseDate(r[c.key]); if (!d) return;
        const k = periodKey(d, freq);
        if (!buckets.has(k)) { buckets.set(k, []); order.push(k); }
        buckets.get(k).push(r[v.key]);
      });
      order.sort();
      const pKey = c.key + '_' + fKey.toLowerCase();
      const vKey = v.key + '_' + agg;
      const rows = order.map(k => {
        const o = {}; o[pKey] = k; o[vKey] = applyAgg(buckets.get(k), agg); return o;
      });
      const SUF = { D: ['_按日', '_daily'], W: ['_按周', '_weekly'], M: ['_按月', '_monthly'], Q: ['_按季', '_quarterly'], Y: ['_按年', '_yearly'] };
      const suf = SUF[fKey] || SUF.M;
      return {
        df: {
          nameKey: null, name: df.name,
          cols: [
            { key: pKey, zh: (c.zh || label(c)) + suf[0], en: (c.en || c.key) + suf[1], dtype: 'string' },
            { key: vKey, zh: (v.zh || label(v)) + '_' + aggLabel(agg), en: (v.en || v.key) + '_' + agg, dtype: 'number' },
          ],
          rows,
        },
        code: "df = df.set_index('" + label(c) + "').resample('" + fKey + "')['" + label(v) + "']." + agg + '().reset_index()',
      };
    },

    /* ---------- 高阶 4：pd.crosstab 交叉表 ---------- */
    crosstab(df, p) {
      const ic = colOf(df, p.index); if (!ic) throw new Error(T('toast.needCol'));
      const jc = colOf(df, p.columns); if (!jc) throw new Error(T('toast.needCol'));
      const vc = p.values ? colOf(df, p.values) : null;
      const agg = p.agg || 'sum';
      const iVals = Array.from(new Set(df.rows.map(r => String(disp(df, ic.key, r[ic.key]))))).slice(0, 30);
      const jVals = Array.from(new Set(df.rows.map(r => String(disp(df, jc.key, r[jc.key]))))).slice(0, 30);
      const cols = [{ key: ic.key, zh: ic.zh || label(ic), en: ic.en || ic.key, dtype: ic.dtype }];
      const jCols = jVals.map(j => ({
        key: '__' + j, zh: String(j), en: String(j), dtype: 'number',
      }));
      cols.push.apply(cols, jCols);
      const rows = iVals.map(i => {
        const o = {}; o[ic.key] = i;
        jVals.forEach((j, ji) => {
          const rs = df.rows.filter(r => String(disp(df, ic.key, r[ic.key])) === i && String(disp(df, jc.key, r[jc.key])) === j);
          o[jCols[ji].key] = vc ? applyAgg(rs.map(r => r[vc.key]), agg) : rs.length;
        });
        return o;
      });
      return {
        df: { nameKey: null, name: df.name, cols, rows },
        code: vc
          ? "df = pd.crosstab(df['" + label(ic) + "'], df['" + label(jc) + "'], values=df['" + label(vc) + "'], aggfunc='" + agg + "')"
          : "df = pd.crosstab(df['" + label(ic) + "'], df['" + label(jc) + "'])",
      };
    },
  };

  /* ---- query 表达式：词法 + 递归下降 ---- */
  function tokenizeQuery(s) {
    const src = String(s || '')
      .replace(/\bAND\b/g, '&').replace(/\band\b/g, '&')
      .replace(/\bOR\b/g, '|').replace(/\bor\b/g, '|')
      .replace(/\bNOT\b/g, '!').replace(/\bnot\b/g, '!');
    const tokens = []; let i = 0;
    while (i < src.length) {
      const ch = src[i];
      if (/\s/.test(ch)) { i++; continue; }
      if ('()&|!'.includes(ch)) { tokens.push({ t: 'op', v: ch }); i++; continue; }
      if (ch === "'" || ch === '"') {
        let j = i + 1, buf = '';
        while (j < src.length && src[j] !== ch) { buf += src[j]; j++; }
        tokens.push({ t: 'lit', v: buf }); i = j + 1; continue;
      }
      if ('><!='.includes(ch)) {
        let op = ch;
        if (src[i + 1] === '=') { op += '='; i++; }
        tokens.push({ t: 'op', v: op }); i++; continue;
      }
      const m = src.slice(i).match(/^[\w\u4e00-\u9fa5.%\-]+/) || src.slice(i).match(/^[^\s&|()!<>=]+/);
      if (m) {
        const v = m[0];
        tokens.push({ t: (/^-?\d+(\.\d+)?$/.test(v) ? 'lit' : 'id'), v });
        i += v.length; continue;
      }
      i++;
    }
    return tokens;
  }
  function buildQueryFn(df, expr) {
    const tk = tokenizeQuery(expr);
    if (!tk.length) throw new Error(T('select.queryEmpty'));
    let pos = 0;
    const peek = () => tk[pos];
    function parseOr() {
      let l = parseAnd();
      while (peek() && peek().v === '|') { pos++; l = { type: 'or', l, r: parseAnd() }; }
      return l;
    }
    function parseAnd() {
      let l = parseUnary();
      while (peek() && peek().v === '&') { pos++; l = { type: 'and', l, r: parseUnary() }; }
      return l;
    }
    function parseUnary() {
      if (peek() && peek().v === '!') { pos++; return { type: 'not', x: parseUnary() }; }
      return parsePrimary();
    }
    function parsePrimary() {
      const t = peek();
      if (!t) throw new Error(T('select.queryBad'));
      if (t.t === 'op' && t.v === '(') {
        pos++; const e = parseOr();
        if (!peek() || peek().v !== ')') throw new Error(T('select.queryBad'));
        pos++; return e;
      }
      const left = tk[pos++];
      const op = peek();
      if (op && op.t === 'op' && ['>', '<', '>=', '<=', '==', '!=', '='].includes(op.v)) {
        pos++; const right = tk[pos++];
        if (!right) throw new Error(T('select.queryBad'));
        return { type: 'cmp', l: left, op: op.v === '=' ? '==' : op.v, r: right };
      }
      return { type: 'truthy', l: left };
    }
    const ast = parseOr();
    return row => evalNode(df, ast, row);
  }
  function valueOf(df, node, row) {
    if (!node) return null;
    if (node.t === 'lit') return node.v;
    const c = df.cols.find(x => x.key === node.v || label(x) === node.v || x.zh === node.v || x.en === node.v);
    if (c) return disp(df, c.key, row[c.key]);
    return node.v;
  }
  function evalNode(df, n, row) {
    if (n.type === 'and') return evalNode(df, n.l, row) && evalNode(df, n.r, row);
    if (n.type === 'or') return evalNode(df, n.l, row) || evalNode(df, n.r, row);
    if (n.type === 'not') return !evalNode(df, n.x, row);
    if (n.type === 'truthy') { const v = valueOf(df, n.l, row); return !(v == null || v === false || v === '' || v === 'False'); }
    const a = valueOf(df, n.l, row), b = valueOf(df, n.r, row);
    const na = toNum(a), nb = toNum(b);
    const bothNum = na !== null && nb !== null;
    const cmp = (x, y) => (bothNum ? x - y : String(x == null ? '' : x).localeCompare(String(y == null ? '' : y)));
    const d = cmp(bothNum ? na : a, bothNum ? nb : b);
    switch (n.op) {
      case '>': return d > 0;
      case '<': return d < 0;
      case '>=': return d >= 0;
      case '<=': return d <= 0;
      case '==': return d === 0;
      default: return d !== 0;
    }
  }
  function toPandasQuery(df, expr) {
    return String(expr)
      .replace(/\bAND\b/g, '&').replace(/\band\b/g, '&')
      .replace(/\bOR\b/g, '|').replace(/\bor\b/g, '|')
      .replace(/\bNOT\b/g, 'not').replace(/\bnot\b/g, 'not')
      /* 单个 = 补成 ==，但不动 != >= <= == */
      .replace(/(?<![=!><])=(?!=)/g, '==').trim();
  }
  function parseDate(v) {
    if (v == null) return null;
    const s = String(v).trim();
    const m = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    const m2 = s.match(/^(\d{4})[-/](\d{1,2})$/);
    if (m2) return new Date(Number(m2[1]), Number(m2[2]) - 1, 1);
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }
  function periodKey(d, freq) {
    const y = d.getFullYear(), m = d.getMonth() + 1;
    const p2 = n => String(n).padStart(2, '0');
    if (freq === 'D') return y + '-' + p2(m) + '-' + p2(d.getDate());
    if (freq === 'Y') return String(y);
    if (freq === 'Q') return y + '-Q' + Math.ceil(m / 3);
    if (freq === 'W') {
      const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      const day = t.getUTCDay() || 7;
      t.setUTCDate(t.getUTCDate() + 4 - day);
      const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
      const week = Math.ceil((((t - yearStart) / 86400000) + 1) / 7);
      return t.getUTCFullYear() + '-W' + p2(week);
    }
    return y + '-' + p2(m);
  }

  /* 依次执行操作链 */
  function runPipeline(base, steps) {
    let df = clone(base);
    for (const s of steps) {
      const fn = OPS[s.op];
      if (!fn) continue;
      const res = fn(df, s.params || {});
      df = res.df;
    }
    return df;
  }

  window.PE = {
    isNull, toNum, clone, colOf, label, disp, dispStr, fmtNum, inferDtype,
    fromMatrix, normalize, describe, info, corr, valueCounts, dupCount, missingByCol,
    filterMask, compileExpr, applyAgg, OPS, runPipeline, AGGS, aggLabel, quantile, mean, std, nums,
  };
})();
