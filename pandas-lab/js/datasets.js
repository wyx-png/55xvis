/* ============================================================
   内置数据集
   DataFrame 结构：
   { nameKey, name, cols:[{key, zh, en, dtype, map?}], rows:[{key:value}] }
   map: 分类值双语映射 { canonical: {zh:'…', en:'…'} }
   ============================================================ */
(function () {
  /* 可复现的伪随机数 */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function pick(rnd, arr) { return arr[Math.floor(rnd() * arr.length)]; }
  /* 本地时区日期，避免 toISOString 的 UTC 偏移 */
  function ymd(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function ri(rnd, a, b) { return Math.floor(a + rnd() * (b - a + 1)); }
  function rf(rnd, a, b, d) { const v = a + rnd() * (b - a); return Number(v.toFixed(d == null ? 2 : d)); }

  /* ---- 双语分类字典 ---- */
  const MAP = {
    region: {
      east: { zh: '华东', en: 'East China' },
      north: { zh: '华北', en: 'North China' },
      south: { zh: '华南', en: 'South China' },
      central: { zh: '华中', en: 'Central China' },
      west: { zh: '西部', en: 'West China' },
    },
    category: {
      electronics: { zh: '数码电子', en: 'Electronics' },
      apparel: { zh: '服饰鞋包', en: 'Apparel' },
      home: { zh: '家居日用', en: 'Home' },
      food: { zh: '食品生鲜', en: 'Food' },
      beauty: { zh: '美妆个护', en: 'Beauty' },
    },
    channel: {
      online: { zh: '线上商城', en: 'Online Mall' },
      live: { zh: '直播带货', en: 'Live Stream' },
      store: { zh: '线下门店', en: 'Offline Store' },
      community: { zh: '社群团购', en: 'Community' },
    },
    gender: {
      male: { zh: '男', en: 'Male' },
      female: { zh: '女', en: 'Female' },
    },
    grade: {
      g1: { zh: '高一', en: 'Grade 10' },
      g2: { zh: '高二', en: 'Grade 11' },
      g3: { zh: '高三', en: 'Grade 12' },
    },
    klass: {
      a: { zh: 'A 班', en: 'Class A' },
      b: { zh: 'B 班', en: 'Class B' },
      c: { zh: 'C 班', en: 'Class C' },
    },
    subject: {
      chinese: { zh: '语文', en: 'Chinese' },
      math: { zh: '数学', en: 'Math' },
      english: { zh: '英语', en: 'English' },
      physics: { zh: '物理', en: 'Physics' },
      chemistry: { zh: '化学', en: 'Chemistry' },
    },
    city: {
      beijing: { zh: '北京', en: 'Beijing' },
      shanghai: { zh: '上海', en: 'Shanghai' },
      guangzhou: { zh: '广州', en: 'Guangzhou' },
      shenzhen: { zh: '深圳', en: 'Shenzhen' },
      chengdu: { zh: '成都', en: 'Chengdu' },
      hangzhou: { zh: '杭州', en: 'Hangzhou' },
    },
  };

  const col = (key, zh, en, dtype, map) => ({ key, zh, en, dtype, map });
  const cat = (map) => Object.keys(map);

  /* ---------- 1. 电商销售 ---------- */
  function buildSales(n) {
    n = n || 260;
    const rnd = mulberry32(20250101);
    const regions = cat(MAP.region), cats = cat(MAP.category), chans = cat(MAP.channel);
    const rows = [];
    const start = new Date(2025, 0, 1);
    const weight = { electronics: 1.6, apparel: 1.0, home: 0.9, food: 0.6, beauty: 1.2 };
    for (let i = 0; i < n; i++) {
      const d = new Date(start.getTime() + ri(rnd, 0, 179) * 86400000);
      const c = pick(rnd, cats);
      const qty = ri(rnd, 1, 12);
      const price = Math.round(rf(rnd, 39, 1299, 0) * weight[c]);
      const region = pick(rnd, regions);
      const regionBoost = region === 'east' ? 1.15 : region === 'west' ? 0.85 : 1;
      const sales = Number((qty * price * regionBoost * rf(rnd, 0.85, 1.15, 3)).toFixed(2));
      const missRating = rnd() < 0.07;
      rows.push({
        order_id: 'SO' + String(100001 + i),
        date: ymd(d),
        region,
        category: c,
        channel: pick(rnd, chans),
        sales,
        quantity: qty,
        price: Number((sales / qty).toFixed(2)),
        rating: missRating ? null : Number(rf(rnd, 3.2, 5, 1)),
        returned: rnd() < 0.11,
      });
    }
    /* 故意插入若干完全重复的行，便于演示 drop_duplicates */
    for (let k = 0; k < 4; k++) rows.push(Object.assign({}, rows[ri(rnd, 0, 40)]));
    return {
      nameKey: 'data.sales',
      cols: [
        col('order_id', '订单号', 'Order ID', 'string'),
        col('date', '日期', 'Date', 'date'),
        col('region', '地区', 'Region', 'string', MAP.region),
        col('category', '品类', 'Category', 'string', MAP.category),
        col('channel', '渠道', 'Channel', 'string', MAP.channel),
        col('sales', '销售额', 'Sales', 'number'),
        col('quantity', '数量', 'Quantity', 'number'),
        col('price', '单价', 'Unit Price', 'number'),
        col('rating', '评分', 'Rating', 'number'),
        col('returned', '是否退货', 'Returned', 'bool'),
      ],
      rows,
    };
  }

  /* ---------- 2. 学生成绩 ---------- */
  function buildStudents(n) {
    n = n || 220;
    const rnd = mulberry32(777);
    const subjects = cat(MAP.subject);
    const base = { chinese: 82, math: 74, english: 79, physics: 71, chemistry: 75 };
    const rows = [];
    for (let i = 0; i < n; i++) {
      const sid = 'S' + String(2025001 + i);
      const grade = pick(rnd, cat(MAP.grade));
      const klass = pick(rnd, cat(MAP.klass));
      const gender = pick(rnd, cat(MAP.gender));
      const subject = pick(rnd, subjects);
      const hours = rf(rnd, 2, 14, 1);
      const attend = ri(rnd, 82, 100);
      let score = base[subject] + hours * 1.6 + (attend - 90) * 0.7 + rf(rnd, -12, 12, 1);
      score = Math.max(40, Math.min(100, score));
      const missScore = rnd() < 0.05;
      const d = new Date(2025, 5, 1 + ri(rnd, 0, 20));
      rows.push({
        student_id: sid,
        gender,
        grade,
        class: klass,
        subject,
        score: missScore ? null : Number(score.toFixed(1)),
        study_hours: hours,
        attendance: attend,
        exam_date: ymd(d),
      });
    }
    return {
      nameKey: 'data.students',
      cols: [
        col('student_id', '学号', 'Student ID', 'string'),
        col('gender', '性别', 'Gender', 'string', MAP.gender),
        col('grade', '年级', 'Grade', 'string', MAP.grade),
        col('class', '班级', 'Class', 'string', MAP.klass),
        col('subject', '科目', 'Subject', 'string', MAP.subject),
        col('score', '分数', 'Score', 'number'),
        col('study_hours', '学习时长', 'Study Hours', 'number'),
        col('attendance', '出勤率', 'Attendance %', 'number'),
        col('exam_date', '考试日期', 'Exam Date', 'date'),
      ],
      rows,
    };
  }

  /* ---------- 3. 门店运营 ---------- */
  function buildStores(n) {
    n = n || 180;
    const rnd = mulberry32(31415);
    const cities = cat(MAP.city);
    const rows = [];
    const cityBoost = { beijing: 1.35, shanghai: 1.4, guangzhou: 1.1, shenzhen: 1.15, chengdu: 0.95, hangzhou: 1.05 };
    for (let i = 0; i < n; i++) {
      const city = pick(rnd, cities);
      const month = 1 + (i % 6);
      const visitors = ri(rnd, 1800, 9600);
      const conv = rf(rnd, 0.08, 0.26, 3);
      const revenue = Number((visitors * conv * rf(rnd, 55, 120, 0) * cityBoost[city]).toFixed(2));
      const cost = Number((revenue * rf(rnd, 0.52, 0.78, 3)).toFixed(2));
      const staff = ri(rnd, 6, 28);
      const missSat = rnd() < 0.06;
      rows.push({
        store_id: 'ST' + String(101 + (i % 30)),
        city,
        month: '2025-' + String(month).padStart(2, '0'),
        visitors,
        revenue,
        cost,
        profit: Number((revenue - cost).toFixed(2)),
        staff,
        satisfaction: missSat ? null : Number(rf(rnd, 3.6, 5, 1)),
      });
    }
    return {
      nameKey: 'data.stores',
      cols: [
        col('store_id', '门店编号', 'Store ID', 'string'),
        col('city', '城市', 'City', 'string', MAP.city),
        col('month', '月份', 'Month', 'string'),
        col('visitors', '客流量', 'Visitors', 'number'),
        col('revenue', '营业收入', 'Revenue', 'number'),
        col('cost', '成本', 'Cost', 'number'),
        col('profit', '利润', 'Profit', 'number'),
        col('staff', '员工数', 'Staff', 'number'),
        col('satisfaction', '满意度', 'Satisfaction', 'number'),
      ],
      rows,
    };
  }

  /* ---------- 随机数据 ---------- */
  function buildRandom(n) {
    n = n || 120;
    const rnd = mulberry32(Date.now() % 100000);
    const groups = ['alpha', 'beta', 'gamma', 'delta'];
    const rows = [];
    for (let i = 0; i < n; i++) {
      rows.push({
        id: i + 1,
        group: pick(rnd, groups),
        value_a: Number(rf(rnd, 0, 1000, 2)),
        value_b: Number(rf(rnd, 0, 500, 2)),
        value_c: ri(rnd, 0, 100),
        flag: rnd() < 0.5,
      });
    }
    return {
      nameKey: 'data.gen',
      cols: [
        col('id', '编号', 'ID', 'number'),
        col('group', '分组', 'Group', 'string'),
        col('value_a', '指标A', 'Value A', 'number'),
        col('value_b', '指标B', 'Value B', 'number'),
        col('value_c', '指标C', 'Value C', 'number'),
        col('flag', '标记', 'Flag', 'bool'),
      ],
      rows,
    };
  }

  /* ---------- 示例副数据（按当前主表首个分类列生成维度表） ---------- */
  function sampleDf2(mainDf) {
    let keyCol = null;
    if (mainDf) {
      keyCol = mainDf.cols.find(c => c.map) || mainDf.cols.find(c => c.dtype === 'string');
    }
    const rnd = mulberry32(999);
    const rows = [];
    if (keyCol) {
      const keys = keyCol.map ? Object.keys(keyCol.map) : Array.from(new Set(mainDf.rows.map(r => r[keyCol.key]).filter(v => v != null))).slice(0, 12);
      keys.forEach((k, i) => {
        rows.push({
          [keyCol.key]: k,
          manager: ['Anna', 'Bruce', 'Cindy', 'David', 'Eva', 'Frank'][i % 6],
          target: Math.round((80000 + rnd() * 220000) / 1000) * 1000,
          level: ['A', 'B', 'C'][i % 3],
        });
      });
      const cols = [
        { key: keyCol.key, zh: keyCol.zh, en: keyCol.en, dtype: keyCol.dtype, map: keyCol.map },
        col('manager', '负责人', 'Manager', 'string'),
        col('target', '目标额', 'Target', 'number'),
        col('level', '等级', 'Level', 'string'),
      ];
      return { nameKey: 'data.df2', cols, rows };
    }
    for (let i = 0; i < 8; i++) {
      rows.push({ id: i + 1, note: 'extra ' + (i + 1), amount: Math.round(rnd() * 5000) });
    }
    return {
      nameKey: 'data.df2',
      cols: [col('id', '编号', 'ID', 'number'), col('note', '备注', 'Note', 'string'), col('amount', '金额', 'Amount', 'number')],
      rows,
    };
  }

  window.DATASETS = {
    MAP,
    list: [
      { id: 'sales', nameKey: 'data.sales', build: buildSales },
      { id: 'students', nameKey: 'data.students', build: buildStudents },
      { id: 'stores', nameKey: 'data.stores', build: buildStores },
    ],
    build(id, n) {
      if (id === 'sales') return buildSales(n);
      if (id === 'students') return buildStudents(n);
      if (id === 'stores') return buildStores(n);
      if (id === 'random') return buildRandom(n);
      return buildSales(n);
    },
    random: buildRandom,
    sampleDf2,
  };
})();
