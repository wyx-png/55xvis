/* =========================================================
   co3-tubular-load · 案例插件（由 _build/build.mjs 自动生成，勿手改）
   源头是案例包 tubular-load-case/source.js + demo/，改内容请改源头后重新构建。
   ========================================================= */
(function () {
  var DEF = {"id":"co3-tubular-load","sceneId":"co3","title":"完井管柱受力智能分析：代理模型快速扫工况","status":"ready","version":"1.0.0","updated":"2026-10-23","tabs":{"background":{"label":"专业背景","lede":"完井管柱要在井里挂几十年：自重把它往下拉，内外压差把它挤扁或撑爆，温度一升它又要伸长、螺旋屈曲贴上井壁。受力分析的目的只有一个——确保任何工况下，管柱的载荷与变形都在安全包络之内。","judge":[{"label":"任务类型","value":"载荷预测","desc":"机理模型为主，AI 加速"},{"label":"数据门槛","value":"无需标注","desc":"可批量仿真生成样本"},{"label":"可见收益","value":"工况 → 秒级","desc":"替代商用软件逐工况手算"},{"label":"难度","value":"中","html":"<span class=\"dtag\" data-d=\"中\">难度 中</span>"}],"sections":[{"no":1,"en":"PROBLEM","title":"当前做法与问题","html":"<p>管柱受力分析有成熟机理模型（ soft string / hard string ），工程上靠商用软件逐工况计算。问题不在算不准，而在<b>算得太慢、组合太多</b>：产量从 0 到 120% 变、温度从关井到满负荷变、压力从常压到关井憋压变——三个维度的组合几十上百种，工程师只挑「最保守的几种」算。</p><div class=\"figure\"><svg viewBox=\"0 0 640 230\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"管柱载荷来源示意\"><rect x=\"20\" y=\"20\" width=\"200\" height=\"190\" fill=\"#f5f2ea\" stroke=\"#c9c2b0\"/><rect x=\"90\" y=\"20\" width=\"26\" height=\"170\" fill=\"#8fa5b5\"/><rect x=\"96\" y=\"60\" width=\"14\" height=\"60\" fill=\"#fff\" opacity=\".45\"/><path d=\"M96 120 q7 12 0 24 q-7 12 0 24 q7 12 0 24\" stroke=\"#b05a51\" stroke-width=\"1.6\" fill=\"none\"/><text x=\"120\" y=\"52\" font-size=\"10\" fill=\"#31527a\">轴向拉力（自重）</text><text x=\"120\" y=\"90\" font-size=\"10\" fill=\"#31527a\">膨胀（内压 &gt; 外压）</text><text x=\"120\" y=\"150\" font-size=\"10\" fill=\"#b05a51\" font-weight=\"700\">螺旋屈曲段</text><text x=\"120\" y=\"166\" font-size=\"10\" fill=\"#79828a\">（轴向压力过大）</text><text x=\"120\" y=\"200\" font-size=\"10\" fill=\"#79828a\">深度 ↓</text><g transform=\"translate(250,30)\"><rect width=\"370\" height=\"160\" rx=\"10\" fill=\"#fff\" stroke=\"#ddd7c8\"/><g font-size=\"11\" fill=\"#242b2e\" font-weight=\"700\"><text x=\"20\" y=\"30\">四种基本效应，一个工况都不能漏</text></g><g font-size=\"10.5\" fill=\"#4d565b\"><text x=\"20\" y=\"58\">① 自重拉力：<tspan fill=\"#9ba3a9\">井口拉力最大，越深越接近中性</tspan></text><text x=\"20\" y=\"82\">② 活塞力：<tspan fill=\"#9ba3a9\">内外压差作用在管柱变截面处</tspan></text><text x=\"20\" y=\"106\">③ 热效应：<tspan fill=\"#9ba3a9\">温度升高 → 管柱伸长 → 底部转受压</tspan></text><text x=\"20\" y=\"130\">④ 屈曲：<tspan fill=\"#9ba3a9\">压力超过屈曲临界值后螺旋贴壁，摩阻激增</tspan></text></g><rect x=\"20\" y=\"140\" width=\"330\" height=\"0\" fill=\"none\"/><g font-size=\"10\" fill=\"#b05a51\"><text x=\"20\" y=\"150\">危险组合 = 高温 + 高内压 + 关井：</text></g><g font-size=\"10\" fill=\"#79828a\"><text x=\"20\" y=\"167\">三者叠加时中和点上移，屈曲段加长，接头密封最脆弱</text></g></g></svg></div><div class=\"figcap\"><b>图 1</b><span>管柱受力的四个来源。最危险的不是单效应最大的时候，而是<b>组合工况</b>：满产高温 + 关井憋压的叠加，会让受压段骤然加长。</span></div>"},{"no":2,"en":"INTERVENTION","title":"AI 能做什么","html":"<p>机理模型准但慢，AI 的角色是<b>把它变快</b>：用机理模型批量生成几千个工况的载荷样本，训练代理模型，之后任何工况组合的轴向力分布、中和点位置、安全系数剖面都能<b>毫秒级</b>出结果。工程师从「挑几个保守工况」变成「<b>扫完整个工况矩阵</b>」，再让算法自动标出安全系数最低的工况组合。</p><p>这是「机理 + 数据」混合建模的典型场景：数据不用标注（仿真即标签），AI 不替代机理，只替掉<b>重复计算</b>这一层。</p><div class=\"figure\"><svg viewBox=\"0 0 640 190\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"工况矩阵扫描示意\"><g font-size=\"10.5\"><g transform=\"translate(30,26)\"><g fill=\"#e7eef9\" stroke=\"#41699b\" stroke-opacity=\".45\"><rect width=\"52\" height=\"52\" rx=\"6\"/><rect x=\"58\" width=\"52\" height=\"52\" rx=\"6\"/><rect x=\"116\" width=\"52\" height=\"52\" rx=\"6\"/><rect x=\"174\" width=\"52\" height=\"52\" rx=\"6\"/><rect x=\"232\" width=\"52\" height=\"52\" rx=\"6\"/><rect y=\"58\" width=\"52\" height=\"52\" rx=\"6\"/><rect x=\"58\" y=\"58\" width=\"52\" height=\"52\" rx=\"6\"/><rect x=\"116\" y=\"58\" width=\"52\" height=\"52\" rx=\"6\"/><rect x=\"174\" y=\"58\" width=\"52\" height=\"52\" rx=\"6\"/><rect x=\"232\" y=\"58\" width=\"52\" height=\"52\" rx=\"6\"/><rect y=\"116\" width=\"52\" height=\"52\" rx=\"6\"/><rect x=\"58\" y=\"116\" width=\"52\" height=\"52\" rx=\"6\"/><rect x=\"116\" y=\"116\" width=\"52\" height=\"52\" rx=\"6\"/><rect x=\"174\" y=\"116\" width=\"52\" height=\"52\" rx=\"6\"/><rect x=\"232\" y=\"116\" width=\"52\" height=\"52\" rx=\"6\"/></g><g fill=\"#41699b\" opacity=\".75\"><rect x=\"174\" width=\"52\" height=\"52\" rx=\"6\" opacity=\".3\"/><rect x=\"174\" y=\"58\" width=\"52\" height=\"52\" rx=\"6\" opacity=\".55\"/><rect x=\"232\" y=\"58\" width=\"52\" height=\"52\" rx=\"6\"/><rect x=\"174\" y=\"116\" width=\"52\" height=\"52\" rx=\"6\"/><rect x=\"232\" y=\"116\" width=\"52\" height=\"52\" rx=\"6\" opacity=\".85\"/></g><text x=\"142\" y=\"186\" text-anchor=\"middle\" fill=\"#79828a\">产量 × 温度 × 压力 = 5×3×5 = 75 个工况</text><text x=\"290\" y=\"130\" fill=\"#b05a51\" font-weight=\"700\">← 最危险工况自动标红</text><text x=\"290\" y=\"148\" fill=\"#235f51\">代理模型 2 秒扫完全部</text><text x=\"290\" y=\"30\" fill=\"#4d565b\" font-weight=\"700\">手工方式：只算 4 个保守角点</text></g></g></svg></div><div class=\"figcap\"><b>图 2</b><span>左侧色块矩阵：颜色越深安全系数越低。手工方式只算四个角点，而真正危险的组合往往<b>藏在矩阵中间</b>——满产的温升效应叠加中等的关井压力，比任何一个角点都危险。</span></div>"},{"no":3,"en":"DATA","title":"你需要准备什么","html":"<p style=\"margin-bottom:14px\">最大优势：<b>训练数据全部由机理模型生成</b>，真实失效样本只做最终校验：</p><div class=\"checklist\"><div class=\"cl-head\"><span>数据准备清单 · 3 项</span><span class=\"cl-prog\"><span id=\"cl-txt\">0 / 3</span><span class=\"cl-bar\"><i id=\"cl-fill\"></i></span></span></div><div class=\"cl-item\" data-cl=\"0\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">管柱结构与材料</span><span class=\"cl-s\">钢级、壁厚、接箍额定载荷、下深</span></span><span class=\"cl-n\">无需标注</span></div><div class=\"cl-item\" data-cl=\"1\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">工况参数样本</span><span class=\"cl-s\">温度、压力、产量的组合 × 机理模型输出</span></span><span class=\"cl-n\">批量仿真生成</span></div><div class=\"cl-item\" data-cl=\"2\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">失效案例</span><span class=\"cl-s\">断脱、泄漏、永久螺旋变形记录</span></span><span class=\"cl-n\">少量，用于校验包络</span></div></div>"},{"no":4,"en":"DIFFICULTY","title":"技术难度与参考方向","html":"<div style=\"display:flex;align-items:center;gap:14px;flex-wrap:wrap\"><span class=\"dtag\" data-d=\"中\">难度 中</span><span class=\"small muted\">代理模型在机理模型之上再拟合一次，误差叠乘；屈曲段的强非线性是最难拟合的部分。</span></div><div class=\"meter\"><i class=\"on\"></i><i class=\"on\"></i><i></i></div><p>先验策略：屈曲段附近不要用光滑网络硬拟合——把屈曲判据<b>写进模型结构</b>（分段模型），网络只学分段之间的光滑插值。</p><p style=\"margin-top:18px\"><span class=\"kicker plain\" style=\"color:var(--ink-4)\">可借鉴的通用技术</span></p><div class=\"refs\"><a class=\"ref\" href=\"#/method/opt\">代理模型<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/opt\">敏感性分析<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/opt\">可靠性评估<span class=\"ar\">↗</span></a></div>"}]},"workflow":{"label":"案例流程","title":"案例：一条 3200 m 生产管柱的全工况扫描","lead":["目标井：3200 m 直井，P110 钢级生产管柱，预期井口温度峰值 95°C。任务是在投产前确认「任何工况下安全系数 ≥ 1.4」。","基线做法是手算 4 个角点工况；本案例用代理模型扫 75 个工况，把藏在矩阵中间的危险组合找出来。"],"stats":[["井深","3200 m"],["工况组合","75"],["扫描耗时","2 s"],["最低安全系数","1.42"]],"steps":[{"name":"建立管柱与工况模型","role":"数据","do":"录入管柱分段结构（壁厚/钢级/接箍额定载荷）与 5 档产量、3 档温度、5 档井口压力的工况矩阵。","effect":"一套可复用的井况描述，换井只改参数文件。","trap":"接箍额定载荷是逐段不同的——用整柱统一值会高估薄弱段的余量。","fig":"<svg viewBox=\"0 0 560 88\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"管柱分段示意\"><g font-size=\"10\"><rect x=\"40\" y=\"10\" width=\"26\" height=\"64\" fill=\"#8fa5b5\"/><g stroke=\"#fff\" stroke-width=\"1\"><line x1=\"40\" y1=\"26\" x2=\"66\" y2=\"26\"/><line x1=\"40\" y1=\"42\" x2=\"66\" y2=\"42\"/><line x1=\"40\" y1=\"58\" x2=\"66\" y2=\"58\"/></g><rect x=\"40\" y=\"42\" width=\"26\" height=\"16\" fill=\"#b05a51\" opacity=\".55\"/><g font-size=\"9.5\" fill=\"#79828a\"><text x=\"74\" y=\"20\">0—800 m：壁厚 7.3 mm</text><text x=\"74\" y=\"36\">800—2000 m：壁厚 6.5 mm</text><text x=\"74\" y=\"52\" fill=\"#b05a51\" font-weight=\"700\">2000—3200 m：壁厚 5.5 mm（薄弱段）</text><text x=\"74\" y=\"68\">接箍额定载荷逐段录入</text></g></g></svg>"},{"name":"机理模型批量仿真","role":"算法","do":"对 75 个工况组合逐个解 soft-string 方程，输出每个工况的轴向力分布、中和点深度、屈曲段长度。","effect":"约 5000 条载荷分布曲线构成训练集，每条曲线 64 个深度采样点。","trap":"温度剖面要用实测井温梯度插值，别用线性近似——温升差 10°C，热应力差半个屈曲临界值。","fig":"<svg viewBox=\"0 0 560 92\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"批量仿真示意\"><g font-size=\"10\"><rect x=\"30\" y=\"12\" width=\"180\" height=\"66\" rx=\"8\" fill=\"#e7eef9\" stroke=\"#41699b\" stroke-opacity=\".45\"/><text x=\"120\" y=\"34\" text-anchor=\"middle\" fill=\"#31527a\" font-weight=\"700\">soft-string 机理模型</text><text x=\"120\" y=\"52\" text-anchor=\"middle\" fill=\"#79828a\">75 工况 × 64 深度点</text><text x=\"120\" y=\"68\" text-anchor=\"middle\" fill=\"#9ba3a9\">输出轴向力 / 中和点 / 屈曲段</text><path d=\"M216 45 h44\" stroke=\"#2f7d6b\" stroke-width=\"1.5\" marker-end=\"url(#c3ar)\"/><rect x=\"268\" y=\"12\" width=\"150\" height=\"66\" rx=\"8\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\" stroke-opacity=\".45\"/><text x=\"343\" y=\"34\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">训练集</text><text x=\"343\" y=\"52\" text-anchor=\"middle\" fill=\"#79828a\">4800 条曲线</text><text x=\"343\" y=\"68\" text-anchor=\"middle\" fill=\"#9ba3a9\">工况 → 载荷剖面</text><path d=\"M424 45 h44\" stroke=\"#2f7d6b\" stroke-width=\"1.5\" marker-end=\"url(#c3ar)\"/><rect x=\"474\" y=\"24\" width=\"60\" height=\"40\" rx=\"8\" fill=\"#f8ecdf\" stroke=\"#b26a39\" stroke-opacity=\".5\"/><text x=\"504\" y=\"48\" text-anchor=\"middle\" fill=\"#8e5229\" font-weight=\"700\">代理模型</text></g><defs><marker id=\"c3ar\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#2f7d6b\"/></marker></defs></svg>"},{"name":"分段代理模型训练","role":"算法","do":"屈曲段与非屈曲段分开建模：先训练一个分类头判断屈曲状态，再对两种状态各拟合回归模型，交界处强制连续。","effect":"强非线性被分段结构吸收，整体误差 ≤ 3%，比单一网络好一倍。","trap":"把「机理已知的部分」写进结构，把「难算的部分」交给学习——反过来做（纯黑箱拟合全部）误差会烂在屈曲段。","fig":"<svg viewBox=\"0 0 560 90\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"分段建模示意\"><g font-size=\"10\"><rect x=\"36\" y=\"14\" width=\"240\" height=\"30\" rx=\"8\" fill=\"#e7eef9\" stroke=\"#41699b\" stroke-opacity=\".5\"/><text x=\"156\" y=\"33\" text-anchor=\"middle\" fill=\"#31527a\" font-weight=\"700\">状态分类头：屈曲 / 非屈曲</text><rect x=\"36\" y=\"52\" width=\"112\" height=\"26\" rx=\"7\" fill=\"#f8ecdf\" stroke=\"#b26a39\" stroke-opacity=\".5\"/><text x=\"92\" y=\"69\" text-anchor=\"middle\" fill=\"#8e5229\">回归 A（屈曲）</text><rect x=\"164\" y=\"52\" width=\"112\" height=\"26\" rx=\"7\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\" stroke-opacity=\".5\"/><text x=\"220\" y=\"69\" text-anchor=\"middle\" fill=\"#235f51\">回归 B（非屈曲）</text><path d=\"M320 45 h50\" stroke=\"#767a2e\" stroke-width=\"1.4\" marker-end=\"url(#c3ar2)\"/><rect x=\"380\" y=\"24\" width=\"160\" height=\"40\" rx=\"8\" fill=\"#fff\" stroke=\"#c9c2b0\"/><text x=\"460\" y=\"41\" text-anchor=\"middle\" fill=\"#242b2e\" font-weight=\"700\">交界强制连续</text><text x=\"460\" y=\"57\" text-anchor=\"middle\" fill=\"#79828a\">整体误差 ≤ 3%</text></g><defs><marker id=\"c3ar2\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#767a2e\"/></marker></defs></svg>"},{"name":"全工况扫描与风险定位","role":"算法","do":"代理模型 2 秒扫完 75 个工况，按最低安全系数排序，输出热力矩阵与 Top-5 危险工况清单。","effect":"找到藏在矩阵中间的真危险工况：满产 95°C + 关井 60% 压力，安全系数 1.42（比任何角点都低）。","trap":"扫描结果必须抽 3 个工况送回机理模型复算——代理模型自己不知道自己什么时候错。","fig":"<svg viewBox=\"0 0 560 96\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"风险热力矩阵\"><g font-size=\"9.5\"><g><rect x=\"120\" y=\"12\" width=\"60\" height=\"22\" rx=\"4\" fill=\"#e7f3ea\"/><rect x=\"184\" y=\"12\" width=\"60\" height=\"22\" rx=\"4\" fill=\"#e7f3ea\"/><rect x=\"248\" y=\"12\" width=\"60\" height=\"22\" rx=\"4\" fill=\"#f9efd7\"/><rect x=\"312\" y=\"12\" width=\"60\" height=\"22\" rx=\"4\" fill=\"#f9efd7\"/><rect x=\"376\" y=\"12\" width=\"60\" height=\"22\" rx=\"4\" fill=\"#f9e9e5\" opacity=\".7\"/><rect x=\"120\" y=\"38\" width=\"60\" height=\"22\" rx=\"4\" fill=\"#e7f3ea\"/><rect x=\"184\" y=\"38\" width=\"60\" height=\"22\" rx=\"4\" fill=\"#f9efd7\"/><rect x=\"248\" y=\"38\" width=\"60\" height=\"22\" rx=\"4\" fill=\"#f9efd7\"/><rect x=\"312\" y=\"38\" width=\"60\" height=\"22\" rx=\"4\" fill=\"#f9e9e5\" opacity=\".85\"/><rect x=\"376\" y=\"38\" width=\"60\" height=\"22\" rx=\"4\" fill=\"#f9e9e5\"/><rect x=\"120\" y=\"64\" width=\"60\" height=\"22\" rx=\"4\" fill=\"#f9efd7\"/><rect x=\"184\" y=\"64\" width=\"60\" height=\"22\" rx=\"4\" fill=\"#f9efd7\"/><rect x=\"248\" y=\"64\" width=\"60\" height=\"22\" rx=\"4\" fill=\"#f9e9e5\" opacity=\".85\"/><rect x=\"312\" y=\"64\" width=\"60\" height=\"22\" rx=\"4\" fill=\"#f9e9e5\"/><rect x=\"376\" y=\"64\" width=\"60\" height=\"22\" rx=\"4\" fill=\"#b05a51\" opacity=\".85\"/></g><text x=\"460\" y=\"28\" fill=\"#79828a\">绿 = SF 高</text><text x=\"460\" y=\"54\" fill=\"#79828a\">黄 = 中</text><text x=\"460\" y=\"80\" fill=\"#b05a51\" font-weight=\"700\">红 = 危险工况</text><text x=\"90\" y=\"28\" text-anchor=\"end\" fill=\"#79828a\">常压</text><text x=\"90\" y=\"54\" text-anchor=\"end\" fill=\"#79828a\">半憋压</text><text x=\"90\" y=\"80\" text-anchor=\"end\" fill=\"#79828a\">全憋压</text><text x=\"290\" y=\"94\" text-anchor=\"middle\" fill=\"#79828a\">列 = 温度档（常温 → 95°C），行 = 压力档</text></g></svg>"},{"name":"设计反馈与包络确认","role":"人工","do":"对最危险工况给出改进建议（提高薄弱段壁厚 / 限定关井压力上限），复扫确认全矩阵 SF ≥ 1.4 后封版。","effect":"调整薄弱段壁厚后最低 SF 从 1.42 升到 1.58，全工况达标。","trap":"「限定关井压力上限」是运营约束不是设计变更——要写进操作规程并让现场知道为什么，否则一关井就超标。"}],"metrics":{"title":"怎么算「做对了」","html":"<p>载荷分析的验收是双重的：<b>代理误差</b>与<b>包络达标</b>，缺一不可：</p><div style=\"margin:10px 0 6px\"><svg viewBox=\"0 0 640 150\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"安全系数剖面对比\"><g font-size=\"10\" fill=\"#9ba3a9\"><line x1=\"90\" y1=\"16\" x2=\"90\" y2=\"120\" stroke=\"#ddd7c8\"/><line x1=\"90\" y1=\"120\" x2=\"620\" y2=\"120\" stroke=\"#ddd7c8\"/><text x=\"84\" y=\"30\" text-anchor=\"end\">1.8</text><text x=\"84\" y=\"66\" text-anchor=\"end\">1.4</text><text x=\"84\" y=\"112\" text-anchor=\"end\">1.0</text><line x1=\"90\" y1=\"66\" x2=\"620\" y2=\"66\" stroke=\"#b05a51\" stroke-dasharray=\"5 4\" opacity=\".6\"/><text x=\"616\" y=\"60\" text-anchor=\"end\" fill=\"#b05a51\">设计红线 SF=1.4</text></g><g font-size=\"10.5\"><path d=\"M100 24 C 200 34, 300 44, 380 58 C 430 68, 470 88, 500 96\" fill=\"none\" stroke=\"#b26a39\" stroke-width=\"2\" opacity=\".7\"/><text x=\"120\" y=\"20\" fill=\"#8e5229\">改进前 · 最小 SF 1.42（2000 m 以下贴线）</text><path d=\"M100 20 C 220 30, 340 40, 420 50 C 470 57, 500 70, 520 78\" fill=\"none\" stroke=\"#2f7d6b\" stroke-width=\"2.2\"/><text x=\"300\" y=\"30\" fill=\"#235f51\" font-weight=\"700\">改进后 · 最小 SF 1.58</text><circle cx=\"500\" cy=\"96\" r=\"4\" fill=\"#b26a39\"/><text x=\"508\" y=\"110\" fill=\"#8e5229\" font-size=\"9.5\">薄弱段 2000—3200 m</text><text x=\"356\" y=\"136\" text-anchor=\"middle\" fill=\"#79828a\">井深 0 → 3200 m（曲线为最危险工况下的安全系数剖面）</text></g></svg></div><p style=\"margin-top:6px\">复核口径：代理模型给出的最小 SF 工况，必须用机理模型复算确认；若复算结果偏差 &gt; 5%，说明代理模型在那个区域不可信，需要补样本重训。</p>"},"fails":[{"name":"屈曲段黑箱拟合烂掉","why":"单一网络在屈曲临界点附近误差爆炸（该处载荷-深度曲线有折点）。分段建模 + 机理判据写进结构是解。"},{"name":"温度剖面线性化","why":"井温不是线性分布，热应力对温升敏感。用实测梯度插值，误差立降一半。"},{"name":"只验角点工况","why":"危险组合藏在矩阵中间（高温 + 中等压力），只算角点的做法系统性漏检。全矩阵扫描正是本案例的价值。"}]},"demo":{"mode":"module","js":"demo/demo.js","label":"可运行示范","intro":"拖动产量 / 温升 / 井口压力三个滑杆构造工况，左图实时显示轴向力沿深度的分布与中和点，右图给出薄弱段安全系数与全矩阵扫描的热力图。","height":640}}};

  var __mod = { exports: {} };
  (function (module, exports) {
/* 完井管柱受力智能分析 · 交互示范
   简化 soft-string：滑杆构造工况 → 轴向力-深度曲线 + 中和点 + 安全系数 + 工况矩阵热力图 */
module.exports = {
  mount: function (root, api) {
    var JADE = 'var(--jade,#2f7d6b)', CLAY = 'var(--clay,#b26a39)',
        OPT = 'var(--c-opt,#41699b)', BAD = 'var(--bad,#b05a51)',
        OKC = 'var(--ok,#3f8560)', INK3 = 'var(--ink-3,#79828a)';
    root.innerHTML =
      '<div class="demo">' +
      '<div class="demo-head"><span class="kicker">INTERACTIVE · SOFT-STRING SURROGATE</span>' +
      '<h3>管柱受力分析台：工况怎么改写载荷剖面</h3>' +
      '<p>拖动三个工况参数，左图显示轴向力沿井深的分布（正值 = 拉伸，负值 = 受压）、中和点位置与屈曲段；' +
      '右图把 75 个工况的安全系数画成热力矩阵——看你怎么把矩阵「拖红」。</p></div>' +
      '<div class="ctl-row">' +
      '<div class="ctl"><label>产量 <output id="c3-o1">80</output>%</label><input type="range" id="c3-s1" min="0" max="120" step="10" value="80"></div>' +
      '<div class="ctl"><label>井口温升 <output id="c3-o2">60</output> °C</label><input type="range" id="c3-s2" min="0" max="95" step="5" value="60"></div>' +
      '<div class="ctl"><label>关井憋压 <output id="c3-o3">40</output>%</label><input type="range" id="c3-s3" min="0" max="100" step="10" value="40"></div>' +
      '</div>' +
      '<div class="grid2">' +
      '<div class="card-x"><h4>轴向力分布（最危险工况）</h4>' +
      '<svg id="c3-axial" class="chart" viewBox="0 0 380 330" role="img" aria-label="轴向力-深度曲线"></svg>' +
      '<div class="legend"><span><i style="background:' + OPT + '"></i>轴向力</span><span><i style="background:' + BAD + '"></i>屈曲段</span><span><i style="background:' + JADE + '"></i>中和点</span></div></div>' +
      '<div class="card-x"><h4>工况矩阵：安全系数热力图</h4>' +
      '<svg id="c3-matrix" class="chart" viewBox="0 0 380 300" role="img" aria-label="工况热力矩阵"></svg>' +
      '<div class="readouts" style="grid-template-columns:1fr 1fr">' +
      '<div class="ro"><span class="k">最低安全系数</span><b id="c3-sf">—</b></div>' +
      '<div class="ro"><span class="k">屈曲段长度</span><b id="c3-buck">—</b></div>' +
      '</div></div>' +
      '</div>' +
      '<p class="note" id="c3-note"></p>' +
      '</div>';

    var $ = function (id) { return root.querySelector('#' + id); };
    var DEPTH = 3200, N = 64;
    /* 薄弱段 2000—3200m，额定载荷较低 */
    function rating(z) { return z < 2000 ? 1.0 : 0.72; }

    /* 简化模型：axial(z) = 自重拉力 - 温升压缩 - 憋压活塞力；屈曲在受压超阈值后 */
    function axialForce(q, dT, pp) {
      var arr = [], i;
      var wPull = 1.0 - q * 0.15;          /* 流动减轻浮力 */
      var heat = dT / 95 * 640;            /* 热致压缩力 kN */
      var piston = pp / 100 * 520;         /* 憋压活塞力 kN */
      var buckCrit = 320;                  /* 屈曲临界压力 kN */
      var buckLen = 0;
      for (i = 0; i <= N; i++) {
        var z = DEPTH * i / N;
        var f = 680 * wPull * (1 - z / DEPTH) - heat * (z / DEPTH) - piston * (0.4 + 0.6 * z / DEPTH);
        arr.push(f);
      }
      /* 屈曲段：从底部向上累计受压超过临界的范围 */
      for (i = N; i >= 0; i--) {
        if (-arr[i] > buckCrit * rating(DEPTH * i / N)) buckLen = DEPTH - DEPTH * i / N;
        else if (arr[i] > 0) break;
      }
      var minSF = 99, minZ = 0;
      for (i = 0; i <= N; i++) {
        var z = DEPTH * i / N;
        var f = arr[i];
        var sf = f >= 0 ? 1450 * rating(z) / Math.max(f, 1) : 860 * rating(z) / Math.max(-f, 1);
        if (sf < minSF) { minSF = sf; minZ = z; }
      }
      return { arr: arr, minSF: minSF, minZ: minZ, buckLen: buckLen };
    }

    function heatColor(v) { /* v:0-1 低→高危险 */
      if (v < 0.33) return '#e7f3ea';
      if (v < 0.66) return '#f9efd7';
      if (v < 0.88) return '#f6ddd6';
      return '#f0b7ae';
    }

    function draw() {
      var q = +$('c3-s1').value, dT = +$('c3-s2').value, pp = +$('c3-s3').value;
      $('c3-o1').textContent = q; $('c3-o2').textContent = dT; $('c3-o3').textContent = pp;
      var r = axialForce(q, dT, pp);

      /* --- 轴向力曲线 --- */
      var W = 380, H = 330, L = 52, R = 16, T = 14, B = 30;
      var maxF = 760, minF = -860;
      function xOf(f) { return L + (f - minF) / (maxF - minF) * (W - L - R); }
      function yOf(z) { return T + z / DEPTH * (H - T - B); }
      var s = '';
      [500, 0, -300, -600].forEach(function (f) {
        s += '<line x1="' + xOf(f) + '" y1="' + T + '" x2="' + xOf(f) + '" y2="' + (H - B) + '" stroke="#efece1"/>' +
          '<text x="' + (xOf(f)) + '" y="' + (H - B + 12) + '" font-size="9" fill="#9ba3a9" text-anchor="middle" font-family="monospace">' + f + '</text>';
      });
      [0, 1000, 2000, 3000].forEach(function (z) {
        s += '<line x1="' + L + '" y1="' + yOf(z) + '" x2="' + (W - R) + '" y2="' + yOf(z) + '" stroke="#efece1"/>' +
          '<text x="' + (L - 6) + '" y="' + (yOf(z) + 3) + '" font-size="9" fill="#9ba3a9" text-anchor="end" font-family="monospace">' + z + '</text>';
      });
      s += '<line x1="' + xOf(0) + '" y1="' + T + '" x2="' + xOf(0) + '" y2="' + (H - B) + '" stroke="#c9c2b0"/>' +
        '<text x="' + (W - R) + '" y="' + (H - 6) + '" font-size="9.5" fill="#79828a" text-anchor="end">轴向力 kN（+拉 / −压）</text>' +
        '<text x="10" y="' + (H / 2) + '" font-size="9.5" fill="#79828a" transform="rotate(-90 10 ' + (H / 2) + ')" text-anchor="middle">井深 m</text>';
      /* 屈曲段背景 */
      if (r.buckLen > 0) {
        var bz0 = yOf(DEPTH - r.buckLen);
        s += '<rect x="' + L + '" y="' + bz0 + '" width="' + (W - L - R) + '" height="' + ((H - B) - bz0) + '" fill="' + BAD + '" opacity=".08"/>' +
          '<text x="' + (W - R - 4) + '" y="' + (bz0 + 14) + '" font-size="9.5" fill="' + BAD + '" text-anchor="end" font-weight="700">螺旋屈曲段 ' + Math.round(r.buckLen) + ' m</text>';
      }
      /* 曲线 */
      var d = '';
      for (var i = 0; i <= N; i++) {
        d += (i ? 'L' : 'M') + xOf(r.arr[i]).toFixed(1) + ' ' + yOf(DEPTH * i / N).toFixed(1);
      }
      s += '<path d="' + d + '" fill="none" stroke="' + OPT + '" stroke-width="2"/>';
      /* 中和点 */
      var zi = 0; while (zi < N && r.arr[zi] > 0) zi++;
      s += '<circle cx="' + xOf(0) + '" cy="' + yOf(DEPTH * zi / N) + '" r="4.5" fill="' + JADE + '"/>' +
        '<text x="' + (xOf(0) + 8) + '" y="' + (yOf(DEPTH * zi / N) + 4) + '" font-size="9.5" fill="#235f51" font-weight="700">中和点 ' + Math.round(DEPTH * zi / N) + ' m</text>';
      /* 薄弱段 */
      s += '<rect x="' + L + '" y="' + yOf(2000) + '" width="' + (W - L - R) + '" height="' + (yOf(3200) - yOf(2000)) + '" fill="none" stroke="#ddd7c8" stroke-dasharray="4 3"/>' +
        '<text x="' + (L + 6) + '" y="' + (yOf(2600) + 4) + '" font-size="9.5" fill="' + INK3 + '">薄弱段（壁厚 5.5 mm）</text>';
      $('c3-axial').innerHTML = s;

      /* --- 热力矩阵 --- */
      var qs = [0, 40, 80, 120], ts = [20, 45, 70, 95], ps = [0, 40, 80, 100];
      var W2 = 380, cell = 62, gx = 60, gy = 40;
      var s2 = '<text x="' + gx + '" y="24" font-size="10" fill="#79828a">列 = 井口温升 °C，行 = 憋压 %</text>';
      ts.forEach(function (t, c) {
        s2 += '<text x="' + (gx + c * cell + cell / 2) + '" y="40" font-size="9.5" fill="' + INK3 + '" text-anchor="middle" font-family="monospace">' + t + '</text>';
      });
      var worst = null;
      ps.forEach(function (p, ri) {
        s2 += '<text x="' + (gx - 8) + '" y="' + (gy + ri * cell + cell / 2 + 4) + '" font-size="9.5" fill="' + INK3 + '" text-anchor="end" font-family="monospace">' + p + '%</text>';
        ts.forEach(function (t, c) {
          var sf = axialForce(q, t, p).minSF;
          var v = Math.max(0, Math.min(1, (2.1 - sf) / 1.2));
          if (!worst || sf < worst.sf) worst = { sf: sf, t: t, p: p };
          s2 += '<rect x="' + (gx + c * cell + 2) + '" y="' + (gy + ri * cell + 2) + '" width="' + (cell - 4) + '" height="' + (cell - 4) + '" rx="6" fill="' + heatColor(v) + '"/>' +
            '<text x="' + (gx + c * cell + cell / 2) + '" y="' + (gy + ri * cell + cell / 2 + 4) + '" font-size="9.5" text-anchor="middle" font-family="monospace" fill="#4d565b">' + sf.toFixed(2) + '</text>';
        });
      });
      /* 当前工况高亮 */
      var ci = ts.indexOf(dT || ts.reduce(function (a, b) { return Math.abs(b - dT) < Math.abs(a - dT) ? b : a; }));
      s2 += '<rect x="' + (gx + ci * cell) + '" y="' + (gy + (ps.indexOf(pp) || 0) * cell) + '" width="' + cell + '" height="' + cell + '" rx="8" fill="none" stroke="#242b2e" stroke-width="2"/>';
      $('c3-matrix').innerHTML = s2;

      $('c3-sf').textContent = r.minSF.toFixed(2);
      $('c3-sf').className = r.minSF < 1.4 ? 'bad' : (r.minSF < 1.6 ? 'warn' : 'ok');
      $('c3-buck').textContent = Math.round(r.buckLen) + ' m';
      $('c3-buck').className = r.buckLen > 400 ? 'bad' : (r.buckLen > 100 ? 'warn' : 'ok');

      $('c3-note').innerHTML =
        '当前工况最低安全系数 <b>' + r.minSF.toFixed(2) + '</b>（出现在 ' + Math.round(r.minZ) + ' m 薄弱段）。' +
        '注意两个规律：<b>温升</b>把曲线往受压方向平移（热伸长），<b>憋压</b>则把深部进一步压向屈曲——' +
        '两者叠加时，最危险的工况<b>不在矩阵角点，而在「高温 + 中高憋压」的格子里</b>，这正是全矩阵扫描的价值。' +
        '试试只拖产量：产量对安全系数的影响其实最小——它只改变浮力与流动摩阻。';
    }

    ['c3-s1', 'c3-s2', 'c3-s3'].forEach(function (id) { $(id).addEventListener('input', draw); });
    draw();
    return { unmount: function () { } };
  },
  unmount: function () { }
};

  })(__mod, __mod.exports);
  var D = __mod.exports || {};

  DEF.tabs.demo = {
    label: DEF.tabs.demo.label || '可运行示范',
    intro: DEF.tabs.demo.intro || '',
    height: DEF.tabs.demo.height || 560,
    mount: function (root, ctx) {
      if (D.mount) D.mount(root, { scene: ctx && ctx.scene, kase: ctx && ctx.kase });
      /* 插件模式不走 Shadow DOM，demo.css 需手动注入；必须在 mount 之后（mount 会重写 innerHTML） */
      if (typeof document !== 'undefined' && !root.querySelector('style[data-demo-css]')) {
        var st = document.createElement('style');
        st.setAttribute('data-demo-css', '1');
        st.textContent = `/* 案例示范通用样式（模块模式：注入 Shadow DOM；与站点令牌一致） */
*{box-sizing:border-box}
.demo{font-size:13px;line-height:1.7;color:var(--ink,#242b2e)}
.demo-head{margin-bottom:14px}
.demo-head h3{margin:8px 0 4px;font-size:16.5px;letter-spacing:-.01em}
.demo-head p{margin:0;color:var(--ink-2,#4d565b);font-size:12.5px;line-height:1.78}
.kicker{font-family:ui-monospace,monospace;font-size:10px;letter-spacing:.14em;color:var(--jade,#2f7d6b);font-weight:700}
.ctl-row{display:flex;flex-wrap:wrap;gap:10px 22px;margin:0 0 12px;padding:10px 14px;background:var(--card-soft,#fdfcf9);border:1px solid var(--line,#e9e4d8);border-radius:9px}
.ctl{display:flex;align-items:center;gap:10px;font-size:12px;color:var(--ink-2,#4d565b)}
.ctl label{display:flex;align-items:center;gap:7px;white-space:nowrap}
.ctl output{font-family:ui-monospace,monospace;font-size:12.5px;color:var(--jade,#2f7d6b);font-weight:700;min-width:44px}
.ctl input[type=range]{accent-color:var(--jade,#2f7d6b);width:120px;height:18px}
.ctl select{font-size:12px;padding:3px 6px;border:1px solid var(--line-2,#ddd7c8);border-radius:6px;background:#fff;color:var(--ink)}
.btn-x{font-size:12px;font-weight:600;padding:5px 14px;border-radius:99px;border:1px solid var(--jade,#2f7d6b);background:var(--jade,#2f7d6b);color:#fff;cursor:pointer}
.btn-x:hover{background:var(--jade-d,#235f51)}
.btn-x.ghost{background:#fff;color:var(--jade,#2f7d6b)}
.btn-x.ghost:hover{background:var(--jade-l,#e6f1ec)}
svg.chart{display:block;width:100%;height:auto;border:1px solid var(--line,#e9e4d8);border-radius:9px;background:#fff}
svg.chart + svg.chart{margin-top:-1px}
.readouts{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:1px;background:var(--line,#e9e4d8);border:1px solid var(--line,#e9e4d8);border-radius:9px;overflow:hidden;margin-top:12px}
.ro{background:#fff;padding:9px 12px}
.ro .k{display:block;font-size:10px;color:var(--ink-3,#79828a);letter-spacing:.06em;margin-bottom:2px}
.ro b{font-family:ui-monospace,monospace;font-size:13.5px;font-weight:700}
.ro b.ok{color:var(--ok,#3f8560)}
.ro b.bad{color:var(--bad,#b05a51)}
.ro b.warn{color:var(--warn,#a97a1c)}
.note{margin:12px 0 0;font-size:12px;color:var(--ink-3,#79828a);line-height:1.78}
.note b{color:var(--ink,#242b2e)}
.legend{display:flex;flex-wrap:wrap;gap:6px 16px;margin:9px 0 0;font-size:11px;color:var(--ink-2,#4d565b)}
.legend i{display:inline-block;width:9px;height:9px;border-radius:3px;margin-right:5px;vertical-align:-1px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:640px){.grid2{grid-template-columns:1fr}}
.card-x{border:1px solid var(--line,#e9e4d8);border-radius:10px;background:#fff;padding:12px 14px}
.card-x h4{margin:0 0 8px;font-size:12.5px;color:var(--ink-2,#4d565b)}
.bar-row{display:flex;align-items:center;gap:10px;margin:7px 0}
.bar-row .bl{width:96px;font-size:12px;color:var(--ink-2,#4d565b);text-align:right;flex:none}
.bar-row .bt{flex:1;height:16px;background:var(--paper-3,#efece1);border-radius:99px;overflow:hidden;display:block}
.bar-row .bf{height:100%;border-radius:99px;transition:width .45s cubic-bezier(.3,.8,.3,1);display:block}
.bar-row .bv{width:56px;font-family:ui-monospace,monospace;font-size:12px;font-weight:700;flex:none}
.tag-y{display:inline-block;font-size:10.5px;font-weight:700;padding:2px 9px;border-radius:99px;background:var(--ok-bg,#e7f3ea);color:var(--ok,#3f8560)}
.tag-n{display:inline-block;font-size:10.5px;font-weight:700;padding:2px 9px;border-radius:99px;background:var(--bad-bg,#f9e9e5);color:var(--bad,#b05a51)}
`;
        root.appendChild(st);
      }
    },
    unmount: function () { if (D.unmount) D.unmount(); }
  };

  Cases.register(DEF);
})();
