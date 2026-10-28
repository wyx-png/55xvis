/* =========================================================
   pr2-production-forecast · 案例插件（由 _build/build.mjs 自动生成，勿手改）
   源头是案例包 production-forecast-case/source.js + demo/，改内容请改源头后重新构建。
   ========================================================= */
(function () {
  var DEF = {"id":"pr2-production-forecast","sceneId":"pr2","title":"产量智能预测：配产要的不是一条线，是一段区间","status":"ready","version":"1.0.0","updated":"2026-10-26","tabs":{"background":{"label":"专业背景","lede":"每个月，采油厂都要给一千多口井下个月的配产指标；每年还要给措施（压裂、补孔、调驱）算经济账。传统做法是 Arps 递减分析：把历史产量拟合成指数、双曲或调和递减曲线，然后往外推。它简洁、可解释，但它只吐出一条确定的线——而配产、投资、措施排序这些决策，真正需要的是\"可能落在哪一段里\"。","judge":[{"label":"任务类型","value":"时间序列概率预测","desc":"输出区间而非单点"},{"label":"数据门槛","value":"≥ 3 年月度 + 措施记录","desc":"同区块多井更好"},{"label":"可见收益","value":"配产偏差 ±7% 以内","desc":"措施排序更准"},{"label":"难度","value":"中","html":"<span class=\"dtag\" data-d=\"中\">难度 中</span>"}],"sections":[{"no":1,"en":"PROBLEM","title":"当前做法与问题","html":"<p>Arps 递减分析的核心是\"一口井的产量按一条规律衰减\"。工程师从历史里挑一段稳态数据，拟合出初始产量、递减率与递减指数，然后外推。<b>这套方法有两个前提：井的生产方式不变，且未来不出现历史里没有过的事件。</b></p><p>而现实里这两个前提都经常被打破：压裂、换泵、调驱、邻井注水见效、井网调整——每一次都让曲线换个斜率。<b>更麻烦的是方法本身不给不确定性</b>：同一条外推曲线，用在\"老井稳产\"和\"刚压裂完\"两种情形下，可信度差一个量级，但输出长得一模一样。</p><div class=\"figure\"><svg viewBox=\"0 0 640 208\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"Arps 外推的困境\"><g font-size=\"10.5\"><line x1=\"60\" y1=\"180\" x2=\"610\" y2=\"180\" stroke=\"#ddd7c8\"/><line x1=\"60\" y1=\"180\" x2=\"60\" y2=\"26\" stroke=\"#ddd7c8\"/><text x=\"335\" y=\"200\" text-anchor=\"middle\" fill=\"#79828a\">时间 →</text><text x=\"16\" y=\"104\" fill=\"#79828a\" transform=\"rotate(-90 16 104)\" text-anchor=\"middle\">产量</text><path d=\"M70 60 C 140 66, 200 84, 250 108 C 300 132, 340 152, 375 166\" fill=\"none\" stroke=\"#2f7d6b\" stroke-width=\"2\"/><text x=\"150\" y=\"76\" fill=\"#235f51\">历史产量（稳态递减）</text><path d=\"M375 166 C 420 178, 470 186, 520 190 C 560 193, 590 195, 604 196\" fill=\"none\" stroke=\"#41699b\" stroke-width=\"2\"/><text x=\"470\" y=\"182\" fill=\"#31527a\">Arps 外推（一条线）</text><line x1=\"375\" y1=\"40\" x2=\"375\" y2=\"176\" stroke=\"#c9c2b0\" stroke-dasharray=\"4 3\"/><text x=\"381\" y=\"52\" fill=\"#79828a\">今日</text><g><path d=\"M375 166 L400 108 L430 118 L470 132 L520 146 L570 158 L604 166\" fill=\"none\" stroke=\"#b05a51\" stroke-width=\"2\"/><circle cx=\"400\" cy=\"108\" r=\"3\" fill=\"#b05a51\"/><text x=\"404\" y=\"100\" fill=\"#b05a51\">第 26 天压裂：真值跳升并重新递减</text></g><rect x=\"150\" y=\"24\" width=\"270\" height=\"34\" rx=\"8\" fill=\"#f9e9e5\" stroke=\"#b05a51\" stroke-opacity=\".35\"/><text x=\"164\" y=\"38\" font-size=\"10.5\" fill=\"#b05a51\">外推曲线与真值之间的整块面积，就是配产误差</text><text x=\"164\" y=\"52\" font-size=\"10.5\" fill=\"#b05a51\">而这条线不会告诉你\"我其实没把握\"</text></g></svg></div><div class=\"figcap\"><b>图 1</b><span>Arps 外推的问题不是\"不准\"，而是<b>它不允许自己不知道</b>。确定性曲线在措施前后长得一样，使用者无从判断哪一段可信。</span></div>"},{"no":2,"en":"INTERVENTION","title":"AI 能做什么","html":"<p>关键转变是<b>从\"预测一个数\"改成\"预测一个分布\"</b>：用分位数回归（同时输出 P10 / P50 / P90）或深度概率模型（DeepAR、TFT），直接给出未来每个月的产量区间。这样配产可以用 P50，风险预案可以按 P10 做，措施经济评价可以按整个分布算期望。</p><p>第二个转变是<b>把井史事件当作特征</b>，而不是当作\"异常点剔除\"。压裂、换泵、调驱、邻井注水、井网调整——这些是产量曲线换斜率的原因，写进模型才有可能学到措施响应。这里必须澄清一件事：<b>模型不可能预测出历史里从未发生过的措施</b>，它做的是\"无措施基线 + 措施响应函数\"，排产时由人把计划中的措施叠加进去。</p><div class=\"figure\"><svg viewBox=\"0 0 640 168\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"概率预测如何用于决策\"><g font-size=\"10.5\"><line x1=\"60\" y1=\"132\" x2=\"610\" y2=\"132\" stroke=\"#ddd7c8\"/><line x1=\"60\" y1=\"132\" x2=\"60\" y2=\"26\" stroke=\"#ddd7c8\"/><text x=\"335\" y=\"152\" text-anchor=\"middle\" fill=\"#79828a\">时间 →</text><path d=\"M70 52 C 140 58, 200 74, 250 96 C 300 116, 340 124, 375 128\" fill=\"none\" stroke=\"#2f7d6b\" stroke-width=\"2\"/><path d=\"M375 128 C 430 136, 490 142, 540 146 C 570 148, 590 150, 604 151\" fill=\"none\" stroke=\"#41699b\" stroke-width=\"2\"/><path d=\"M375 110 C 430 104, 490 104, 540 106 C 570 107, 590 108, 604 109\" fill=\"none\" stroke=\"#41699b\" stroke-width=\"1.2\" stroke-dasharray=\"5 3\"/><path d=\"M375 144 C 430 158, 490 170, 540 178 C 570 183, 590 186, 604 188\" fill=\"none\" stroke=\"#41699b\" stroke-width=\"1.2\" stroke-dasharray=\"5 3\"/><text x=\"450\" y=\"98\" fill=\"#31527a\">P90</text><text x=\"450\" y=\"140\" fill=\"#31527a\">P50（配产用）</text><text x=\"450\" y=\"192\" fill=\"#31527a\">P10</text><line x1=\"375\" y1=\"32\" x2=\"375\" y2=\"130\" stroke=\"#c9c2b0\" stroke-dasharray=\"4 3\"/><text x=\"381\" y=\"42\" fill=\"#79828a\">今日</text><rect x=\"70\" y=\"20\" width=\"230\" height=\"28\" rx=\"7\" fill=\"#fdfcf9\" stroke=\"#e9e4d8\"/><text x=\"82\" y=\"39\" font-size=\"10.5\" fill=\"#4d565b\">区间随预测期张开 = 模型在表达\"越远越没把握\"</text><rect x=\"330\" y=\"20\" width=\"290\" height=\"28\" rx=\"7\" fill=\"#e7f3ea\" stroke=\"#3f8560\" stroke-opacity=\".3\"/><text x=\"342\" y=\"39\" font-size=\"10.5\" fill=\"#3f8560\">配产取 P50 · 保底方案按 P10 · 措施经济评价用全分布</text></g></svg></div><div class=\"figcap\"><b>图 2</b><span>区间不是\"误差条\"，是决策输入。<b>P50 用来下指标，P10 用来做最坏打算</b>——这两个数在油气生产里对应完全不同的行动。</span></div>"},{"no":3,"en":"DATA","title":"你需要准备什么","html":"<p style=\"margin-bottom:14px\">产量数据本身几乎一定够用（SCADA / 日报一直在采）。这个场景真正的门槛是<b>井史事件是否结构化</b>——如果措施只写在作业总结的 Word 里，模型就永远学不到\"为什么换了斜率\"。</p><div class=\"checklist\"><div class=\"cl-head\"><span>数据准备清单 · 5 项</span><span class=\"cl-prog\"><span id=\"cl-txt\">0 / 5</span><span class=\"cl-bar\"><i id=\"cl-fill\"></i></span></span></div><div class=\"cl-item\" data-cl=\"0\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">单井产量历史</span><span class=\"cl-s\">日产油/气/水，≥ 3 年</span></span><span class=\"cl-n\">需处理关井、计量误差与回灌</span></div><div class=\"cl-item\" data-cl=\"1\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">井史事件表（结构化）</span><span class=\"cl-s\">措施类型、日期、规模、层位</span></span><span class=\"cl-n\">最关键的一项</span></div><div class=\"cl-item\" data-cl=\"2\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">井筒与井网信息</span><span class=\"cl-s\">井型、层系、泵径、注采对应关系</span></span><span class=\"cl-n\">跨井泛化的分组依据</span></div><div class=\"cl-item\" data-cl=\"3\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">邻井与注水动态</span><span class=\"cl-s\">注水量、见效时间</span></span><span class=\"cl-n\">解释\"突然稳住\"的原因</span></div><div class=\"cl-item\" data-cl=\"4\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">计划性事件日历</span><span class=\"cl-s\">检修、停产、计划措施</span></span><span class=\"cl-n\">已知未来，须人工叠加</span></div></div>"},{"no":4,"en":"DIFFICULTY","title":"技术难度与参考方向","html":"<div style=\"display:flex;align-items:center;gap:14px;flex-wrap:wrap\"><span class=\"dtag\" data-d=\"中\">难度 中</span><span class=\"small muted\">模型不难；难在把井史事件结构化、以及让区间\"守得住覆盖率\"。</span></div><div class=\"meter\"><i class=\"on\"></i><i class=\"on\"></i><i></i></div><p>建议路径：<b>先用梯度提升树在\"滑动窗口统计特征 + 井史事件特征\"上做分位数回归</b>（LightGBM 直接支持 quantile objective），把 PICP / PINAW 这套评价体系先建起来。深度序列模型（DeepAR / TFT）只在井数多、序列长、且要跨井共享模式时才值得上。</p><p>要特别警惕一件事：<b>概率模型的区间必须做校准</b>。标称 P10—P90 的区间，实际只覆盖 60% 的真值，那这个区间就是假的。校准的做法是拿一段历史做滚动回测，看每个分位点的实际命中率，再做分位数映射修正。<b>这一步比换模型重要得多。</b></p><p style=\"margin-top:18px\"><span class=\"kicker plain\" style=\"color:var(--ink-4)\">可借鉴的通用技术</span></p><div class=\"refs\"><a class=\"ref\" href=\"#/method/ts\">分位数回归<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/ts\">概率时序预测<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/ts\">区间校准<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/ts\">滚动回测<span class=\"ar\">↗</span></a></div>"}]},"workflow":{"label":"案例流程","title":"案例：某采油厂 1200 口井的月度配产","lead":["某采油厂 1200 口井，8 年月度生产数据，每月下配产指标；历史配产与实际产量偏差平均 ±18%，措施经济评价因此经常算错。","目标：6 个月滚动预测的配产偏差压到 ±10% 以内，且给出可用的不确定性区间。"],"stats":[["井数","1200 口"],["历史","8 年月度"],["基线偏差","±18%"],["上线后","±7.4%"]],"steps":[{"name":"井史事件结构化","role":"数据","do":"从作业总结、措施台账与日报里，把每口井的措施事件抽成结构化记录（类型、日期、层位、规模）；同时把关井、检修、计量故障标记为\"非生产事件\"而非零产量。","effect":"累计 1.4 万条事件，覆盖 83% 的井；抽完之后，\"产量曲线换斜率\"这件事在 76% 的情况下有明确归因。","trap":"把检修停产当零产量喂给模型，会让它学到\"周期性归零\"的假规律。必须单独建事件表，产量序列里这些段应标记为缺失而不是 0。","fig":"<svg viewBox=\"0 0 560 88\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"井史事件结构化\"><g font-size=\"10\"><g text-anchor=\"middle\"><rect x=\"18\" y=\"20\" width=\"118\" height=\"44\" rx=\"8\" fill=\"#e7eef9\" stroke=\"#41699b\" stroke-opacity=\".5\"/><text x=\"77\" y=\"38\" fill=\"#31527a\" font-weight=\"700\">作业总结</text><text x=\"77\" y=\"53\" fill=\"#9ba3a9\">Word / PDF</text><rect x=\"152\" y=\"20\" width=\"118\" height=\"44\" rx=\"8\" fill=\"#f9efd7\" stroke=\"#a97a1c\" stroke-opacity=\".5\"/><text x=\"211\" y=\"38\" fill=\"#8e5229\" font-weight=\"700\">事件抽取</text><text x=\"211\" y=\"53\" fill=\"#9ba3a9\">类型/日期/层位</text><rect x=\"286\" y=\"20\" width=\"118\" height=\"44\" rx=\"8\" fill=\"#f1f1dd\" stroke=\"#767a2e\" stroke-opacity=\".5\"/><text x=\"345\" y=\"38\" fill=\"#5d6022\" font-weight=\"700\">非生产事件</text><text x=\"345\" y=\"53\" fill=\"#9ba3a9\">停产≠零产量</text><rect x=\"420\" y=\"20\" width=\"122\" height=\"44\" rx=\"8\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\" stroke-opacity=\".5\"/><text x=\"481\" y=\"38\" fill=\"#235f51\" font-weight=\"700\">1.4 万条</text><text x=\"481\" y=\"53\" fill=\"#9ba3a9\">覆盖 83% 井</text></g><g stroke=\"#9ba3a9\" stroke-width=\"1.2\"><path d=\"M136 42 h12\" marker-end=\"url(#p2a)\"/><path d=\"M270 42 h12\" marker-end=\"url(#p2a)\"/><path d=\"M404 42 h12\" marker-end=\"url(#p2a)\"/></g></g><defs><marker id=\"p2a\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#9ba3a9\"/></marker></defs></svg>"},{"name":"多尺度特征与样本组织","role":"工程","do":"对每个预测起点构造：近 3/6/12 月的产量斜率与波动、距上次措施的天数、上次措施类型与规模、累计产量、邻井注水量变化、层系与井型分组。","effect":"加入\"距上次措施天数 + 措施类型\"两项后，6 个月预测的 MAPE 从 31% 降到 22%。","trap":"训练样本要按\"预测起点\"滚动采样而不是随机切，且必须做时间切分（用前 6 年训练、最后 2 年测试）。随机切会让未来信息泄漏进训练集。","fig":"<svg viewBox=\"0 0 560 90\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"特征贡献\"><g font-size=\"10\"><text x=\"18\" y=\"20\" fill=\"#79828a\">6 个月预测 MAPE：</text><rect x=\"180\" y=\"10\" width=\"300\" height=\"12\" rx=\"6\" fill=\"#c9c2b0\"/><text x=\"486\" y=\"20\" fill=\"#79828a\">31%（仅产量历史）</text><rect x=\"180\" y=\"30\" width=\"212\" height=\"12\" rx=\"6\" fill=\"#b26a39\" opacity=\".8\"/><text x=\"398\" y=\"40\" fill=\"#8e5229\">22%（+措施特征）</text><rect x=\"180\" y=\"50\" width=\"164\" height=\"12\" rx=\"6\" fill=\"#2f7d6b\"/><text x=\"350\" y=\"60\" fill=\"#235f51\" font-weight=\"700\">17%（+邻井注水）</text><rect x=\"180\" y=\"70\" width=\"148\" height=\"12\" rx=\"6\" fill=\"#2f7d6b\" opacity=\".65\"/><text x=\"334\" y=\"80\" fill=\"#235f51\">15.4%（+区间校准后 P50）</text></g></svg>"},{"name":"分位数模型与区间校准","role":"算法","do":"用 LightGBM 的 quantile objective 同时训练 P10 / P50 / P90 三个分位数头；再用滚动回测统计每个分位点的实际命中率，做分位数映射校准。","effect":"校准前标称 80% 的区间实际只覆盖 63%，校准后 79.6%，区间宽度只增加 8%。","trap":"别跳过校准这一步。未校准的区间看着窄、覆盖率却不够，用它做风险预案会比没有区间更危险——因为你以为自己知道了。","fig":"<svg viewBox=\"0 0 560 92\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"区间校准前后\"><g font-size=\"10\"><text x=\"18\" y=\"20\" fill=\"#79828a\">标称 80% 区间的实际覆盖率：</text><rect x=\"250\" y=\"10\" width=\"180\" height=\"13\" rx=\"6\" fill=\"#c9c2b0\"/><text x=\"436\" y=\"20\" fill=\"#79828a\">标称 80%</text><rect x=\"250\" y=\"30\" width=\"142\" height=\"13\" rx=\"6\" fill=\"#b05a51\" opacity=\".75\"/><text x=\"398\" y=\"40\" fill=\"#b05a51\">校准前 63%</text><rect x=\"250\" y=\"50\" width=\"179\" height=\"13\" rx=\"6\" fill=\"#2f7d6b\"/><text x=\"435\" y=\"60\" fill=\"#235f51\" font-weight=\"700\">校准后 79.6%</text><text x=\"250\" y=\"80\" fill=\"#79828a\">区间宽度仅 +8%</text></g></svg>"},{"name":"配产与人机分工","role":"质控","do":"配产取 P50；对\"距上次措施 <60 天\"或\"近 30 天波动超阈值\"的井自动标红，这些井的区间较宽，交由地质所人工复核并按计划措施叠加增量。","effect":"自动配产覆盖 81% 的井，其余 19% 人工复核；整体配产偏差从 ±18% 降到 ±7.4%。","trap":"别把\"计划中的措施\"偷偷算进模型预测——它是已知的未来信息，必须作为人工叠加项单独列出，否则一旦措施推迟，偏差会全部暴露。","fig":"<svg viewBox=\"0 0 560 94\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"人机分工\"><g font-size=\"10\"><text x=\"18\" y=\"20\" fill=\"#79828a\">配产流程：</text><rect x=\"130\" y=\"8\" width=\"120\" height=\"40\" rx=\"8\" fill=\"#e7eef9\" stroke=\"#41699b\" stroke-opacity=\".5\"/><text x=\"190\" y=\"26\" fill=\"#31527a\" font-weight=\"700\" text-anchor=\"middle\">P50 自动配产</text><text x=\"190\" y=\"42\" fill=\"#9ba3a9\" text-anchor=\"middle\">81% 的井</text><rect x=\"266\" y=\"8\" width=\"120\" height=\"40\" rx=\"8\" fill=\"#f8ecdf\" stroke=\"#b26a39\" stroke-opacity=\".5\"/><text x=\"326\" y=\"26\" fill=\"#8e5229\" font-weight=\"700\" text-anchor=\"middle\">标红复核</text><text x=\"326\" y=\"42\" fill=\"#9ba3a9\" text-anchor=\"middle\">19%（区间宽）</text><rect x=\"402\" y=\"8\" width=\"140\" height=\"40\" rx=\"8\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\" stroke-opacity=\".5\"/><text x=\"472\" y=\"26\" fill=\"#235f51\" font-weight=\"700\" text-anchor=\"middle\">叠加计划措施</text><text x=\"472\" y=\"42\" fill=\"#9ba3a9\" text-anchor=\"middle\">人工项，单独列</text><text x=\"130\" y=\"70\" fill=\"#235f51\" font-weight=\"700\">整体配产偏差 ±18% → ±7.4%</text><text x=\"130\" y=\"86\" fill=\"#8e5229\">计划措施必须人工叠加，不能算进模型预测</text></g></svg>"},{"name":"措施经济评价闭环","role":"人工","do":"把措施后的实际产量与\"无措施基线\"对比，得到措施增量的实证分布；用这个分布更新措施响应函数，反过来改进经济评价。","effect":"措施候选井排序的命中率从 0.61 提到 0.78；年度措施投入不变，增油量提升 12%。","trap":"\"无措施基线\"本身是模型的反事实输出，不能直接当真值——要用\"同期同类型未措施井\"做对照组验证，否则会把模型偏差当成措施效果。"}],"metrics":{"title":"怎么算「做对了」","html":"<p>产量预测有三层指标，逐层递进，<b>只报第一层一定会误导决策</b>：</p><div style=\"margin:10px 0 6px\"><svg viewBox=\"0 0 640 128\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"三层预测指标\"><g font-size=\"10.5\"><g><rect x=\"34\" y=\"16\" width=\"150\" height=\"26\" rx=\"4\" fill=\"#f5f2ea\"/><text x=\"46\" y=\"34\" fill=\"#79828a\">层</text><rect x=\"190\" y=\"16\" width=\"170\" height=\"26\" rx=\"4\" fill=\"#f5f2ea\"/><text x=\"275\" y=\"34\" text-anchor=\"middle\" fill=\"#79828a\">指标</text><rect x=\"366\" y=\"16\" width=\"128\" height=\"26\" rx=\"4\" fill=\"#f5f2ea\"/><text x=\"430\" y=\"34\" text-anchor=\"middle\" fill=\"#79828a\">结果</text><rect x=\"500\" y=\"16\" width=\"120\" height=\"26\" rx=\"4\" fill=\"#f5f2ea\"/><text x=\"560\" y=\"34\" text-anchor=\"middle\" fill=\"#79828a\">说明</text></g><g><rect x=\"34\" y=\"46\" width=\"150\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"46\" y=\"62\" fill=\"#4d565b\">点预测</text><rect x=\"190\" y=\"46\" width=\"170\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"275\" y=\"62\" text-anchor=\"middle\" fill=\"#4d565b\">P50 的 MAPE</text><rect x=\"366\" y=\"46\" width=\"128\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"430\" y=\"62\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">15.4%</text><rect x=\"500\" y=\"46\" width=\"120\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"510\" y=\"62\" fill=\"#79828a\">最常报的一层</text></g><g><rect x=\"34\" y=\"74\" width=\"150\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"46\" y=\"90\" fill=\"#4d565b\">区间质量</text><rect x=\"190\" y=\"74\" width=\"170\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"275\" y=\"90\" text-anchor=\"middle\" fill=\"#4d565b\">PICP / PINAW</text><rect x=\"366\" y=\"74\" width=\"128\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"430\" y=\"90\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">79.6% / 0.42</text><rect x=\"500\" y=\"74\" width=\"120\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"510\" y=\"90\" fill=\"#79828a\">守得住才算数</text></g><g><rect x=\"34\" y=\"102\" width=\"150\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"46\" y=\"118\" fill=\"#4d565b\">业务结果</text><rect x=\"190\" y=\"102\" width=\"170\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"275\" y=\"118\" text-anchor=\"middle\" fill=\"#4d565b\">配产偏差 / 措施命中</text><rect x=\"366\" y=\"102\" width=\"128\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"430\" y=\"118\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">±7.4% / 0.78</text><rect x=\"500\" y=\"102\" width=\"120\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"510\" y=\"118\" fill=\"#79828a\">真正在乎的</text></g></g></svg></div><p style=\"margin-top:6px\">读法：MAPE 15% 听起来不错，但如果区间覆盖率只有 63%，那这个\"15%\"是在<b>被低估的不确定性</b>下取得的，用它做配产会系统性冒进。所以汇报时必须<b>点误差和区间质量一起报</b>，二者缺一不可。</p>"},"fails":[{"name":"用单点预测配产","why":"确定性曲线无法表达\"这口井刚压裂完、把握不大\"，配产偏差 ±18% 且误差单向。改成 P50 + 区间后降到 ±7.4%，且风险可控。"},{"name":"把措施后的临时高峰当趋势","why":"Arps 用措施后的高产量段拟合，斜率被拉平，一路高估。必须把井史事件当特征，或按\"措施后天数\"分段建模。"},{"name":"跳过区间校准","why":"标称 80% 的区间实际只覆盖 63%，看着窄却靠不住，风险预案比没有区间更危险。校准只需增加 8% 宽度即可达到 79.6% 覆盖。"}]},"demo":{"mode":"module","js":"demo/demo.js","label":"可运行示范","intro":"一口井的日产油曲线：绿色是历史实产，灰色虚线是未来真值，蓝色是数据驱动预测（含 P10—P90 区间），橙色细线是 Arps 外推。切换模型、选择措施场景，看两种方法在\"措施后\"差多远。","height":720}}};

  var __mod = { exports: {} };
  (function (module, exports) {
/* 产量智能预测 · 交互示范
   合成一口井的日产油曲线（Arps 递减 + 措施事件 + 噪声），
   对比「机理外推」与「带区间的数据驱动预测」，用 PICP / 区间宽度 / 累积误差评价。 */
module.exports = {
  mount: function (root, api) {
    var JADE = '#2f7d6b', CLAY = '#b26a39', BAD = '#b05a51',
        OPT = '#41699b', INK3 = '#79828a', INK2 = '#4d565b';

    var MAXD = 900;

    function noise(i, s) {
      var h1 = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453;
      var h2 = Math.sin(i * 63.7264 + s * 21.713) * 12345.678;
      return ((h1 - Math.floor(h1)) - 0.5) * 1.6 + ((h2 - Math.floor(h2)) - 0.5) * 0.7;
    }
    function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

    /* 措施：[实施日, 类型, 增益倍数, 维持天数] */
    var MEASURES = [
      { d: -1, n: '无措施', g: 1, dec: 0 },
      { d: 260, n: '第 260 天压裂', g: 2.3, dec: 0.55 },
      { d: 340, n: '第 340 天换大泵', g: 1.6, dec: 0.75 },
      { d: 420, n: '第 420 天调驱', g: 1.35, dec: 0.85 }
    ];

    /* ---------- 真值曲线（模型看不到未来） ---------- */
    function truth(hist, b, di, mz, nz, seed) {
      var q0 = 42, q = [], i;
      var m = MEASURES[mz];
      for (i = 0; i <= MAXD; i++) {
        var base = q0 / Math.pow(1 + b * di * i, 1 / b);
        var gain = 1, t = i;
        if (m.d > 0 && i >= m.d) {
          var dt = i - m.d;
          /* 措施后先跳升，再按加速递减回落 */
          gain = m.g * Math.pow(m.dec, dt / 90) + (1 - Math.pow(m.dec, dt / 90)) * 1;
          if (gain < 1.05) gain = 1.05;
          base = base * gain * Math.pow(m.dec, dt / 260);
        }
        var v = base * (1 + noise(i, seed) * nz * 0.16);
        q.push(Math.max(0.6, v));
      }
      return q;
    }

    /* ---------- 预测器 ---------- */
    /* A) Arps 双曲递减外推：用历史末段拟合 b、Di，无区间 */
    function arpsFit(h, hv) {
      var n = hv.length, i1 = Math.floor(n * 0.55);
      var s1 = 0, s2 = 0;
      for (var i = i1; i < n; i++) { s1 += hv[i]; s2 += i; }
      var qEnd = hv[n - 1], qMid = hv[Math.floor((i1 + n) / 2)];
      var slope = (qEnd - qMid) / (n - 1 - Math.floor((i1 + n) / 2));
      var di = clamp(-slope / Math.max(qEnd, 1), 0.0008, 0.02);
      var b = clamp(0.45 + Math.abs(slope) * 12, 0.2, 1.4);
      var q0 = qEnd;
      return function (dt) { return q0 / Math.pow(1 + b * di * dt, 1 / b); };
    }
    /* B) 数据驱动：分段自适应 + 近期波动定区间宽 + 措施检测 */
    function mlFit(hv, h, mz, m) {
      var n = hv.length;
      /* 近 60 天的局部斜率（自适应，能跟上措施后的新趋势） */
      var w = Math.min(60, Math.floor(n / 3));
      var sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
      for (var i = n - w; i < n; i++) {
        var x = i - (n - w), y = Math.log(Math.max(hv[i], 0.5));
        sumX += x; sumY += y; sumXY += x * y; sumXX += x * x;
      }
      var den = w * sumXX - sumX * sumX;
      var slope = den !== 0 ? (w * sumXY - sumX * sumY) / den : -0.002;
      var inter = (sumY - slope * sumX) / w;
      /* 近 40 天残差标准差 → 区间宽度的种子 */
      var res = 0, cnt = 0;
      for (var j = n - 40; j < n; j++) {
        var fit = Math.exp(inter + slope * (j - (n - w)));
        res += Math.pow(Math.log(Math.max(hv[j], 0.5)) - Math.log(Math.max(fit, 0.5)), 2); cnt++;
      }
      var sd = Math.sqrt(res / Math.max(cnt, 1));
      /* 是否检测到措施：历史末段是否出现向上跳变 */
      var jump = 0;
      if (n > 90) {
        var a1 = 0, a2 = 0;
        for (var k = n - 30; k < n - 10; k++) a1 += hv[k];
        for (var k2 = n - 10; k2 < n; k2++) a2 += hv[k2];
        jump = (a2 / 10) / Math.max(a1 / 20, 0.1) - 1;
      }
      var detected = jump > 0.18;
      return {
        f: function (dt) {
          var v = Math.exp(inter + slope * (w - 1 + dt));
          /* 措施后加速递减的先验：检测到跳升则叠加回落 */
          if (detected) v *= Math.pow(0.78, dt / 120);
          return Math.max(0.5, v);
        },
        sd: sd, detected: detected, jump: jump
      };
    }

    root.innerHTML =
      '<div class="demo">' +
      '<div class="demo-head"><span class="kicker">INTERACTIVE · PRODUCTION FORECAST WITH UNCERTAINTY</span>' +
      '<h3>外推一条曲线，还是给出一段区间？</h3>' +
      '<p>产量预测最难的不是"拟合过去"，而是<b>未来会不会发生一件过去没发生过的事</b>——压裂、换泵、调驱，' +
      '每一次措施都让曲线换个斜率。选一个措施场景，看纯外推怎么被甩开，再看数据驱动的预测是怎么靠区间把"我不知道"表达出来的。</p></div>' +
      '<div class="ctl-row">' +
      '<div class="ctl"><label>历史长度 <output id="pf-oh">360 天</output></label><input type="range" id="pf-h" min="180" max="720" step="30" value="360"></div>' +
      '<div class="ctl"><label>递减指数 b <output id="pf-ob">0.70</output></label><input type="range" id="pf-b" min="0.3" max="1.2" step="0.05" value="0.7"></div>' +
      '<select id="pf-mz" style="font-size:12px;padding:4px 8px;border:1px solid var(--line-2,#ddd7c8);border-radius:6px">' +
      MEASURES.map(function (m, i) { return '<option value="' + i + '">' + m.n + '</option>'; }).join('') +
      '</select>' +
      '<div class="ctl"><label>预测期 <select id="pf-hz" style="font-size:12px;padding:3px 6px;border:1px solid var(--line-2,#ddd7c8);border-radius:6px">' +
      '<option value="90">90 天</option><option value="180">180 天</option><option value="365">365 天</option></select></label></div>' +
      '<div class="ctl"><label>噪声 <output id="pf-on">0.35</output></label><input type="range" id="pf-n" min="0.1" max="1" step="0.05" value="0.35"></div>' +
      '<button class="btn-x ghost" id="pf-md">模型：数据驱动</button>' +
      '<button class="btn-x" id="pf-rand">🎲 换井</button>' +
      '</div>' +
      '<div class="grid2" style="grid-template-columns:1.5fr 1fr">' +
      '<div class="card-x"><h4>日产油：历史（实线）· 预测（虚线 + P10—P90 区间）· 真值（浅灰）</h4>' +
      '<svg id="pf-c" class="chart" viewBox="0 0 560 340" role="img" aria-label="产量预测曲线"></svg>' +
      '<div class="legend"><span><i style="background:#2f7d6b"></i>历史实产</span><span><i style="background:#79828a"></i>未来真值</span>' +
      '<span><i style="background:#41699b"></i>数据驱动预测</span><span><i style="background:#b26a39"></i>Arps 外推</span>' +
      '<span><i style="background:#c9dcea"></i>P10—P90 区间</span></div></div>' +
      '<div class="card-x"><h4>预测质量</h4>' +
      '<div class="readouts">' +
      '<div class="ro"><span class="k">MAE</span><b id="pf-v1">—</b></div>' +
      '<div class="ro"><span class="k">MAPE</span><b id="pf-v2">—</b></div>' +
      '<div class="ro"><span class="k">区间覆盖率</span><b id="pf-v3">—</b></div>' +
      '<div class="ro"><span class="k">平均区间宽</span><b id="pf-v4">—</b></div>' +
      '<div class="ro"><span class="k">累积产量误差</span><b id="pf-v5">—</b></div>' +
      '<div class="ro"><span class="k">措施识别</span><b id="pf-v6">—</b></div>' +
      '<div class="ro"><span class="k">末点预测</span><b id="pf-v7">—</b></div>' +
      '<div class="ro"><span class="k">结论</span><b id="pf-v8">—</b></div>' +
      '</div>' +
      '<div id="pf-why" style="margin-top:12px;font-size:11.5px;line-height:1.75"></div></div>' +
      '</div>' +
      '<p class="note" id="pf-note"></p>' +
      '</div>';

    var $ = function (id) { return root.querySelector('#' + id); };
    var useML = true, SEED = 21;

    var W = 560, H = 340, ML = 40, MR = 12, MT = 14, MB = 34;
    var GW = W - ML - MR, GH = H - MT - MB;

    function draw() {
      var h = +$('pf-h').value, b = +$('pf-b').value, mz = +$('pf-mz').value,
          hz = +$('pf-hz').value, nz = +$('pf-n').value;
      $('pf-oh').textContent = h + ' 天';
      $('pf-ob').textContent = b.toFixed(2);
      $('pf-on').textContent = nz.toFixed(2);

      var q = truth(h, b, 0.006, mz, nz, SEED);
      var hv = q.slice(0, h);
      var DMAX = Math.min(MAXD, h + hz);
      var vmax = 0;
      for (var i = 0; i <= DMAX; i++) if (q[i] > vmax) vmax = q[i];
      vmax *= 1.15;
      var X = function (d) { return ML + d / DMAX * GW; };
      var Y = function (v) { return MT + GH - clamp(v / vmax, 0, 1) * GH; };

      var s = '';
      /* 网格 */
      for (var g = 0; g <= 4; g++) {
        var yv = MT + GH - g * GH / 4;
        s += '<line x1="' + ML + '" y1="' + yv + '" x2="' + (ML + GW) + '" y2="' + yv + '" stroke="#efece1"/>' +
          '<text x="' + (ML - 4) + '" y="' + (yv + 3) + '" font-size="8.5" fill="' + INK3 + '" text-anchor="end" font-family="monospace">' + (vmax * g / 4).toFixed(0) + '</text>';
      }
      var m = MEASURES[mz];
      /* 预测：两条 */
      var ar = arpsFit(h, hv);
      var mo = mlFit(hv, h, mz, m);
      var pred = useML ? mo.f : ar;
      var sd = mo.sd;

      /* 区间带（P10—P90） */
      var up = [], dn = [];
      for (var t = 0; t <= DMAX - h; t++) {
        var v0 = pred(t);
        var wid = (useML ? 1 : 0) * (0.55 + 1.35 * sd) * (0.35 + 0.65 * Math.sqrt(t / Math.max(hz, 1)));
        up.push([X(h + t), Y(clamp(v0 * Math.exp(1.2816 * wid * 0.42), 0, vmax))]);
        dn.push([X(h + t), Y(clamp(v0 * Math.exp(-1.2816 * wid * 0.42), 0.2, vmax))]);
      }
      if (useML) {
        var poly = 'M' + up.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' L') +
          ' L' + dn.reverse().map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' L') + ' Z';
        s += '<path d="' + poly + '" fill="#c9dcea" fill-opacity=".55" stroke="none"/>';
      }
      /* 未来真值 */
      var dt = '';
      for (var d2 = h; d2 <= DMAX; d2++) dt += (d2 === h ? 'M' : 'L') + X(d2).toFixed(1) + ' ' + Y(q[d2]).toFixed(1) + ' ';
      s += '<path d="' + dt + '" fill="none" stroke="#79828a" stroke-width="1.4" stroke-dasharray="3 2" opacity=".8"/>';
      /* 历史 */
      var dh = '';
      for (var d3 = 0; d3 <= h; d3++) dh += (d3 === 0 ? 'M' : 'L') + X(d3).toFixed(1) + ' ' + Y(q[d3]).toFixed(1) + ' ';
      s += '<path d="' + dh + '" fill="none" stroke="#2f7d6b" stroke-width="1.8"/>';
      /* 预测线 */
      var dp = '';
      for (var t2 = 0; t2 <= DMAX - h; t2++) dp += (t2 === 0 ? 'M' : 'L') + X(h + t2).toFixed(1) + ' ' + Y(pred(t2)).toFixed(1) + ' ';
      s += '<path d="' + dp + '" fill="none" stroke="' + (useML ? OPT : CLAY) + '" stroke-width="2" stroke-dasharray="6 3"/>';
      /* 对照：另一条预测（灰色细线，方便对比） */
      var dp2 = '';
      var other = useML ? ar : mo.f;
      for (var t3 = 0; t3 <= DMAX - h; t3++) dp2 += (t3 === 0 ? 'M' : 'L') + X(h + t3).toFixed(1) + ' ' + Y(other(t3)).toFixed(1) + ' ';
      s += '<path d="' + dp2 + '" fill="none" stroke="' + (useML ? CLAY : OPT) + '" stroke-width="1.2" stroke-dasharray="2 3" opacity=".55"/>';
      /* 今日分隔线 */
      s += '<line x1="' + X(h).toFixed(1) + '" y1="' + MT + '" x2="' + X(h).toFixed(1) + '" y2="' + (MT + GH) + '" stroke="#c9c2b0" stroke-width="1.2"/>' +
        '<text x="' + (X(h) - 4).toFixed(1) + '" y="' + (MT + 10) + '" font-size="9" fill="' + INK3 + '" text-anchor="end">今日</text>';
      /* 措施标记 */
      if (m.d > 0 && m.d <= DMAX) {
        s += '<line x1="' + X(m.d).toFixed(1) + '" y1="' + MT + '" x2="' + X(m.d).toFixed(1) + '" y2="' + (MT + GH) + '" stroke="#b26a39" stroke-width="1.2" stroke-dasharray="4 3"/>' +
          '<text x="' + (X(m.d) + 4).toFixed(1) + '" y="' + (MT + 22) + '" font-size="9" fill="' + CLAY + '">' + m.n.replace('第 ', '').replace(' 天', '天') + '</text>';
      }
      s += '<line x1="' + ML + '" y1="' + (MT + GH) + '" x2="' + (ML + GW) + '" y2="' + (MT + GH) + '" stroke="#c9c2b0"/>' +
        '<text x="' + (ML + GW / 2) + '" y="' + (H - 8) + '" font-size="9.5" fill="' + INK3 + '" text-anchor="middle">时间（天）</text>' +
        '<text x="12" y="' + (MT + GH / 2) + '" font-size="9.5" fill="' + INK2 + '" transform="rotate(-90 12 ' + (MT + GH / 2) + ')" text-anchor="middle">日产油（m³/d）</text>';
      $('pf-c').innerHTML = s;

      /* ---- 评价 ---- */
      var n = DMAX - h, ae = 0, ape = 0, inBand = 0, bandSum = 0, cumP = 0, cumT = 0;
      for (var t4 = 1; t4 <= n; t4++) {
        var pv = pred(t4), tv = q[h + t4];
        ae += Math.abs(pv - tv);
        ape += Math.abs(pv - tv) / Math.max(tv, 0.5);
        cumP += pv; cumT += tv;
        var wid2 = (useML ? 1 : 0) * (0.55 + 1.35 * sd) * (0.35 + 0.65 * Math.sqrt(t4 / Math.max(hz, 1)));
        var lo = pv * Math.exp(-1.2816 * wid2 * 0.42), hi = pv * Math.exp(1.2816 * wid2 * 0.42);
        bandSum += (hi - lo) / Math.max(pv, 0.5);
        if (tv >= lo && tv <= hi) inBand++;
      }
      var mae = ae / n, mape = ape / n * 100;
      var picp = useML ? inBand / n * 100 : 0;
      var aw = useML ? bandSum / n * 100 : 0;
      var cumErr = (cumP - cumT) / cumT * 100;
      var endP = pred(n), endT = q[DMAX];

      $('pf-v1').textContent = mae.toFixed(2);
      $('pf-v2').textContent = mape.toFixed(1) + ' %';
      $('pf-v2').className = mape < 20 ? 'ok' : (mape < 40 ? 'warn' : 'bad');
      $('pf-v3').textContent = useML ? picp.toFixed(0) + ' %' : '无区间';
      $('pf-v3').className = !useML ? '' : (picp > 75 ? 'ok' : (picp > 50 ? 'warn' : 'bad'));
      $('pf-v4').textContent = useML ? '±' + (aw / 2).toFixed(0) + ' %' : '—';
      $('pf-v5').textContent = (cumErr >= 0 ? '+' : '') + cumErr.toFixed(1) + ' %';
      $('pf-v5').className = Math.abs(cumErr) < 10 ? 'ok' : (Math.abs(cumErr) < 25 ? 'warn' : 'bad');
      $('pf-v6').textContent = m.d < 0 ? '—' : ((m.d <= h) === mo.detected ? '正确' : '漏检');
      if (m.d < 0) $('pf-v6').className = '';
      else $('pf-v6').className = ((m.d <= h) === mo.detected) ? 'ok' : 'bad';
      $('pf-v7').textContent = endP.toFixed(1) + ' / ' + endT.toFixed(1);
      $('pf-v8').textContent = Math.abs(cumErr) < 10 ? '可用于配产' : (Math.abs(cumErr) < 25 ? '仅作参考' : '不可用于配产');
      $('pf-v8').className = Math.abs(cumErr) < 10 ? 'ok' : (Math.abs(cumErr) < 25 ? 'warn' : 'bad');

      var why = [];
      if (m.d > 0 && m.d > h) {
        why.push('<b style="color:' + BAD + '">措施发生在未来</b>（第 ' + m.d + ' 天，预测期从 ' + h + ' 天开始）。' +
          '任何只吃历史数据的模型都不可能知道它会发生——<b>这不是模型缺陷，是任务定义问题</b>。' +
          '现场的正确做法是：预测给出"无措施基线"，措施排产后由人叠加增量，两条线分开报。');
        why.push('看 <b>累积产量误差</b>：' + (cumErr >= 0 ? '+' : '') + cumErr.toFixed(1) + '%——' +
          '这就是"用无措施预测去配产"会犯的错。这也是为什么<b>产量预测必须给区间而不是单点值</b>。');
      } else if (m.d > 0 && m.d <= h) {
        why.push('措施已在历史里（第 ' + m.d + ' 天）。数据驱动模型靠<b>近 60 天的自适应斜率</b>跟上了措施后的新趋势' +
          (mo.detected ? '，并且识别出了产量跳升（' + Math.round(mo.jump * 100) + '%）' : '，但没有把它识别为跳升') + '。');
        why.push('切换到 <b>Arps 外推</b> 对比：它用历史末段拟合双曲递减，斜率被措施后的高产量拉平，' +
          '于是把"措施带来的暂时高峰"当成长期趋势一路外推——<b>这正是老方法最常见的系统性高估</b>。');
      } else {
        why.push('无措施场景：趋势平稳，两种方法的差距主要来自<b>噪声与递减指数</b>。' +
          '把噪声拖到 0.9，看数据驱动模型的 P10—P90 区间怎么自动变宽——区间宽度是它自己"知道不确定性在变大"的表达。');
      }
      if (!useML) why.push('<b style="color:' + CLAY + '">当前是 Arps 外推</b>：它只能给一条线，给不了区间。' +
        '这意味着它无法表达"我不知道"，而配产决策恰恰需要知道不确定性有多大。');
      $('pf-why').innerHTML = why.join('<br><br>');
    }

    ['pf-h', 'pf-b', 'pf-mz', 'pf-hz', 'pf-n'].forEach(function (id) {
      $(id).addEventListener('input', draw);
      $(id).addEventListener('change', draw);
    });
    $('pf-md').addEventListener('click', function () {
      useML = !useML;
      $('pf-md').textContent = '模型：' + (useML ? '数据驱动' : 'Arps 外推');
      draw();
    });
    $('pf-rand').addEventListener('click', function () { SEED = (SEED * 1103515245 + 12345) >>> 0; draw(); });

    draw();
    $('pf-note').innerHTML =
      '把 <b>预测期</b>从 90 天拉到 365 天：区间会像喇叭一样张开，覆盖率却不一定下降——' +
      '<b>好的概率预测应该"越远越宽、但仍然守得住覆盖率"</b>。如果区间张开了覆盖率反而掉了，说明模型低估了长期不确定性。' +
      '再切到 <b>Arps 外推</b>：它给的是一条确定的线，看起来"专业"，但把措施后的临时高峰当成趋势外推出去，' +
      '误差是系统性的、单向的——<b>确定性预测的最大问题不是不准，而是它不允许自己不知道。</b>';
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
