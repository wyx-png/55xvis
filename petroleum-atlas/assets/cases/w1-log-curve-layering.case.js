/* =========================================================
   w1-log-curve-layering · 案例插件（由 _build/build.mjs 自动生成，勿手改）
   源头是案例包 log-curve-layer-case/source.js + demo/，改内容请改源头后重新构建。
   ========================================================= */
(function () {
  var DEF = {"id":"w1-log-curve-layering","sceneId":"w1","title":"测井曲线智能分层：把\"半幅点\"变成可复现的层界","status":"ready","version":"1.0.0","updated":"2026-10-26","tabs":{"background":{"label":"专业背景","lede":"地层对比的第一步是分层：在一口井的测井曲线上，把泥岩段、砂岩段、灰岩段一段段划出来，标出每个层界的深度。解释员的做法是看自然伽马、自然电位、电阻率的\"半幅点\"——曲线从泥岩基线走到砂岩极值，走到一半的位置就是层界。一口井几十个层，一个油田几百口井，全靠人眼和手感。","judge":[{"label":"任务类型","value":"一维时序分割","desc":"层内点占 95% 以上"},{"label":"数据门槛","value":"同区块 ≥ 50 口井分层成果","desc":"老井复查资料最好"},{"label":"可见收益","value":"2.5 h/井 → 20 min/井","desc":"且人人一致"},{"label":"难度","value":"中","html":"<span class=\"dtag\" data-d=\"中\">难度 中</span>"}],"sections":[{"no":1,"en":"PROBLEM","title":"当前做法与问题","html":"<p>分层的规则说起来很清楚：GR 曲线从泥岩基线上升/下降到砂岩极值的一半处，就是层界。<b>但\"半幅\"里的两个端点要靠人定</b>——泥岩基线取哪一段？砂岩极值取最高那一点还是取平台？曲线上叠着薄夹层、钙质条带、井眼扩径，每个人取法不同。</p><p>结果是同一个层，两个解释员能差出 0.5—1 m；同一个人上午划的和下午划的也不完全一致。<b>在厚层上这点误差无所谓，在 2 m 的薄层上就是\"有\"和\"没有\"的区别</b>。而薄层往往正是剩余油富集的地方。</p><div class=\"figure\"><svg viewBox=\"0 0 640 216\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"半幅点分层的人为差异\"><g font-size=\"10.5\"><text x=\"20\" y=\"16\" fill=\"#79828a\">GR 曲线上的一个砂岩层：三个人划出三个层界</text><line x1=\"60\" y1=\"190\" x2=\"600\" y2=\"190\" stroke=\"#ddd7c8\"/><text x=\"330\" y=\"208\" text-anchor=\"middle\" fill=\"#79828a\">深度 →</text><path d=\"M70 60 L150 58 L170 120 L190 150 L200 152 L330 150 L350 118 L370 62 L390 60 L590 58\" fill=\"none\" stroke=\"#2f7d6b\" stroke-width=\"2\"/><line x1=\"70\" y1=\"59\" x2=\"590\" y2=\"59\" stroke=\"#9ba3a9\" stroke-dasharray=\"4 3\"/><text x=\"596\" y=\"62\" fill=\"#9ba3a9\">泥岩基线</text><line x1=\"180\" y1=\"150\" x2=\"330\" y2=\"150\" stroke=\"#9ba3a9\" stroke-dasharray=\"4 3\"/><text x=\"186\" y=\"164\" fill=\"#9ba3a9\">砂岩极值</text><line x1=\"200\" y1=\"105\" x2=\"200\" y2=\"152\" stroke=\"#41699b\" stroke-width=\"1.6\" stroke-dasharray=\"4 3\"/><text x=\"204\" y=\"102\" fill=\"#41699b\">甲：105</text><line x1=\"215\" y1=\"105\" x2=\"215\" y2=\"152\" stroke=\"#767a2e\" stroke-width=\"1.6\" stroke-dasharray=\"4 3\"/><text x=\"219\" y=\"98\" fill=\"#767a2e\">乙：118</text><line x1=\"228\" y1=\"105\" x2=\"228\" y2=\"152\" stroke=\"#b26a39\" stroke-width=\"1.6\" stroke-dasharray=\"4 3\"/><text x=\"232\" y=\"94\" fill=\"#b26a39\">丙：130</text><rect x=\"380\" y=\"118\" width=\"230\" height=\"60\" rx=\"8\" fill=\"#f9e9e5\" stroke=\"#b05a51\" stroke-opacity=\".35\"/><text x=\"394\" y=\"138\" font-size=\"10.5\" fill=\"#b05a51\">层界差 0.8 m → 有效厚度差 0.8 m</text><text x=\"394\" y=\"156\" font-size=\"10.5\" fill=\"#b05a51\">→ 单井地质储量差 3%—5%</text><text x=\"394\" y=\"172\" font-size=\"10.5\" fill=\"#b05a51\">→ 全油田对比时层位串层</text></g></svg></div><div class=\"figcap\"><b>图 1</b><span>\"半幅点\"看似客观，实际两端点都靠人定。<b>分层误差会一路传导到储量计算</b>——这是它值得被自动化的根本原因。</span></div>"},{"no":2,"en":"INTERVENTION","title":"AI 能做什么","html":"<p>把分层重新表述为<b>一维时序分割</b>问题：输入是多条曲线（GR、SP、电阻率、密度、中子、声波）沿深度的序列，输出是每个采样点属于哪个层、边界在哪。主流做法是 1D U-Net / BiLSTM + CRF，或直接做变化点检测 + 层厚后处理。</p><p>这里有一个决定成败的工程判断：<b>分层不是逐点分类，而是\"层序\"</b>。如果只做逐点分类，模型会在层界附近给出\"砂—泥—砂—泥\"的抖动，因为它看不到\"上一层是什么\"的约束。必须引入序列约束（CRF 转移矩阵、或显式的层序规则：沉积旋回里砂岩之上通常是泥岩），或者干脆只对\"层界\"建模、层内由层界切分得到。</p><p>另一个判断：<b>不要指望一套模型通吃所有区块</b>。测井系列不同（3700 与 530 系列）、仪器刻度不同、井眼条件不同，曲线绝对值不可比。跨井迁移前必须先做标准化（如 GR 的泥岩基线/砂岩极值两点归一化，或分位数映射）。</p><div class=\"figure\"><svg viewBox=\"0 0 640 176\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"分层模型结构\"><g font-size=\"11\" font-weight=\"700\" text-anchor=\"middle\"><rect x=\"16\" y=\"54\" width=\"108\" height=\"56\" rx=\"9\" fill=\"#e7eef9\" stroke=\"#41699b\"/><text x=\"70\" y=\"76\" fill=\"#31527a\">多道曲线</text><text x=\"70\" y=\"93\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">标准化后</text><rect x=\"142\" y=\"54\" width=\"108\" height=\"56\" rx=\"9\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\"/><text x=\"196\" y=\"76\" fill=\"#235f51\">1D 编码器</text><text x=\"196\" y=\"93\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">多尺度感受野</text><rect x=\"268\" y=\"54\" width=\"108\" height=\"56\" rx=\"9\" fill=\"#f1f1dd\" stroke=\"#767a2e\"/><text x=\"322\" y=\"76\" fill=\"#5d6022\">层界概率</text><text x=\"322\" y=\"93\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">逐点打分</text><rect x=\"394\" y=\"54\" width=\"108\" height=\"56\" rx=\"9\" fill=\"#f8ecdf\" stroke=\"#b26a39\"/><text x=\"448\" y=\"76\" fill=\"#8e5229\">序列约束</text><text x=\"448\" y=\"93\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">CRF / 层序规则</text><rect x=\"520\" y=\"54\" width=\"104\" height=\"56\" rx=\"9\" fill=\"#f9e9e5\" stroke=\"#b05a51\"/><text x=\"572\" y=\"76\" fill=\"#9c4a42\">分层成果</text><text x=\"572\" y=\"93\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">层界 + 层名</text></g><g stroke=\"#9ba3a9\" stroke-width=\"1.4\"><path d=\"M124 82 h14\" marker-end=\"url(#w1a)\"/><path d=\"M250 82 h14\" marker-end=\"url(#w1a)\"/><path d=\"M376 82 h14\" marker-end=\"url(#w1a)\"/><path d=\"M502 82 h14\" marker-end=\"url(#w1a)\"/></g><defs><marker id=\"w1a\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#9ba3a9\"/></marker></defs><rect x=\"16\" y=\"124\" width=\"608\" height=\"40\" rx=\"9\" fill=\"#fdfcf9\" stroke=\"#e9e4d8\"/><text x=\"34\" y=\"142\" font-size=\"10.5\" fill=\"#4d565b\">关键：只对\"层界\"建模 + 序列约束，层内由层界切分得到 → 天然不会抖，且输出天然满足\"上下层不重复\"</text><text x=\"34\" y=\"158\" font-size=\"10.5\" fill=\"#79828a\">评价指标：<tspan fill=\"#235f51\">层界误差</tspan>（±0.5 m 容差）、<tspan fill=\"#235f51\">层数一致度</tspan>、<tspan fill=\"#235f51\">可自动采用率</tspan>——不能只看逐点准确率（层内点占 95%）</text></svg></div><div class=\"figcap\"><b>图 2</b><span>先找边界再切层，比逐点分类更稳。<b>序列约束这一步不能省</b>，它替代的正是解释员\"这一段应该是正韵律\"的地质常识。</span></div>"},{"no":3,"en":"DATA","title":"你需要准备什么","html":"<p style=\"margin-bottom:14px\">这个场景的数据优势是\"老资料多\"：一个开发几十年的油田，分层成果本就有几千井次。难点在于它们来自不同年代、不同单位、不同标准。</p><div class=\"checklist\"><div class=\"cl-head\"><span>数据准备清单 · 5 项</span><span class=\"cl-prog\"><span id=\"cl-txt\">0 / 5</span><span class=\"cl-bar\"><i id=\"cl-fill\"></i></span></span></div><div class=\"cl-item\" data-cl=\"0\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">常规测井曲线</span><span class=\"cl-s\">GR / SP / RT / DEN / CNL / AC，0.125 m 采样</span></span><span class=\"cl-n\">需深度校正与环境校正</span></div><div class=\"cl-item\" data-cl=\"1\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">历史分层成果（金标准）</span><span class=\"cl-s\">≥ 50 口井，含层界深度与层名</span></span><span class=\"cl-n\">须统一到同一分层方案</span></div><div class=\"cl-item\" data-cl=\"2\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">岩心与录井剖面</span><span class=\"cl-s\">取心井的岩性描述</span></span><span class=\"cl-n\">校验薄层的唯一依据</span></div><div class=\"cl-item\" data-cl=\"3\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">井眼与泥浆信息</span><span class=\"cl-s\">井径、泥浆密度、井斜</span></span><span class=\"cl-n\">扩径段的曲线要剔除或降权</span></div><div class=\"cl-item\" data-cl=\"4\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">邻井层位对比表</span><span class=\"cl-s\">标准井的层位划分</span></span><span class=\"cl-n\">跨井一致性的约束来源</span></div></div>"},{"no":4,"en":"DIFFICULTY","title":"技术难度与参考方向","html":"<div style=\"display:flex;align-items:center;gap:14px;flex-wrap:wrap\"><span class=\"dtag\" data-d=\"中\">难度 中</span><span class=\"small muted\">算法本身不复杂，难点在标准化、薄层与\"分层方案\"本身的统一。</span></div><div class=\"meter\"><i class=\"on\"></i><i class=\"on\"></i><i></i></div><p>强烈建议<b>先用变化点检测（滑动窗口统计检验）做一条基线</b>，把\"层界误差 / 可自动采用率\"这套评价体系先建起来，再上深度学习看增益。很多区块里，好的窗口 + 好的后处理已经能做到 70% 可自动采用。</p><p>第二个建议：<b>先把分层方案统一</b>。同一个砂层组，老方案划 3 个小层、新方案划 5 个小层，历史标签里两套混着，模型学出来必然是\"四不像\"。这件事必须地质师拍板，不是算法问题。</p><p style=\"margin-top:18px\"><span class=\"kicker plain\" style=\"color:var(--ink-4)\">可借鉴的通用技术</span></p><div class=\"refs\"><a class=\"ref\" href=\"#/method/ts\">一维序列分割<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/ts\">变化点检测<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/ts\">条件随机场 CRF<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/ts\">跨井标准化<span class=\"ar\">↗</span></a></div>"}]},"workflow":{"label":"案例流程","title":"案例：某油田 320 口老井的分层复查","lead":["某注水开发油田，320 口老井的测井资料跨越 1985—2015 年三套测井系列，11 个层位，人工复查一口井平均 2.5 h。","目标：分层结果可自动采用率 ≥ 80%，层界误差控制在 ±0.5 m 内，且薄层（<2 m）不漏。"],"stats":[["复查井数","320 口"],["层位数","11 个"],["基线耗时","2.5 h/井"],["自动采用率","82%"]],"steps":[{"name":"曲线标准化与环境校正","role":"数据","do":"先做深度校正（不同系列的深度基准差最多 1.8 m），再按\"泥岩基线—砂岩极值\"两点法把 GR 归一到 0—1，电阻率取对数后分位数映射；扩径段（井径 > 钻头直径 15%）的密度/中子直接剔除。","effect":"同层位在 1990 年与 2010 年曲线上的 GR 分布重合度从 0.42 提到 0.91，跨系列训练才成为可能。","trap":"两点归一化的\"两点\"要按层位固定取，不能按全井极值动态取——动态取会随井眼条件漂移，反而抹掉层间差异。","fig":"<svg viewBox=\"0 0 560 88\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"曲线标准化\"><g font-size=\"10\"><g text-anchor=\"middle\"><rect x=\"18\" y=\"20\" width=\"118\" height=\"44\" rx=\"8\" fill=\"#e7eef9\" stroke=\"#41699b\" stroke-opacity=\".5\"/><text x=\"77\" y=\"38\" fill=\"#31527a\" font-weight=\"700\">三套测井系列</text><text x=\"77\" y=\"53\" fill=\"#9ba3a9\">1985 / 1998 / 2015</text><rect x=\"152\" y=\"20\" width=\"118\" height=\"44\" rx=\"8\" fill=\"#f9efd7\" stroke=\"#a97a1c\" stroke-opacity=\".5\"/><text x=\"211\" y=\"38\" fill=\"#8e5229\" font-weight=\"700\">深度校正</text><text x=\"211\" y=\"53\" fill=\"#9ba3a9\">基准差 ≤1.8 m</text><rect x=\"286\" y=\"20\" width=\"118\" height=\"44\" rx=\"8\" fill=\"#f1f1dd\" stroke=\"#767a2e\" stroke-opacity=\".5\"/><text x=\"345\" y=\"38\" fill=\"#5d6022\" font-weight=\"700\">两点归一化</text><text x=\"345\" y=\"53\" fill=\"#9ba3a9\">GR → 0—1</text><rect x=\"420\" y=\"20\" width=\"122\" height=\"44\" rx=\"8\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\" stroke-opacity=\".5\"/><text x=\"481\" y=\"38\" fill=\"#235f51\" font-weight=\"700\">分布重合 0.91</text><text x=\"481\" y=\"53\" fill=\"#9ba3a9\">原 0.42</text></g><g stroke=\"#9ba3a9\" stroke-width=\"1.2\"><path d=\"M136 42 h12\" marker-end=\"url(#w1b)\"/><path d=\"M270 42 h12\" marker-end=\"url(#w1b)\"/><path d=\"M404 42 h12\" marker-end=\"url(#w1b)\"/></g></g><defs><marker id=\"w1b\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#9ba3a9\"/></marker></defs></svg>"},{"name":"多道特征与旋回编码","role":"工程","do":"除原始曲线外，构造：曲线的一阶差分、局部方差、GR—SP 的幅度差（反映渗透性）、密度—中子交会距离（反映岩性）；再对每口井按层位编码沉积旋回（正韵律/反韵律/均质）。","effect":"仅用 GR 单道时层界误差 ±0.94 m，加入多道与旋回编码后降到 ±0.41 m。","trap":"别把旋回编码做成\"未来信息\"——它只能来自邻井与本井已解释的上部层位，不能来自本层。","fig":"<svg viewBox=\"0 0 560 90\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"多道特征贡献\"><g font-size=\"10\"><text x=\"18\" y=\"20\" fill=\"#79828a\">层界误差随特征增加：</text><rect x=\"170\" y=\"10\" width=\"330\" height=\"12\" rx=\"6\" fill=\"#c9c2b0\"/><text x=\"506\" y=\"20\" fill=\"#79828a\">±0.94 m（仅 GR）</text><rect x=\"170\" y=\"30\" width=\"212\" height=\"12\" rx=\"6\" fill=\"#b26a39\" opacity=\".8\"/><text x=\"388\" y=\"40\" fill=\"#8e5229\">±0.60 m（+SP/RT）</text><rect x=\"170\" y=\"50\" width=\"152\" height=\"12\" rx=\"6\" fill=\"#2f7d6b\"/><text x=\"328\" y=\"60\" fill=\"#235f51\" font-weight=\"700\">±0.41 m（+旋回编码）</text><rect x=\"170\" y=\"70\" width=\"140\" height=\"12\" rx=\"6\" fill=\"#2f7d6b\" opacity=\".6\"/><text x=\"316\" y=\"80\" fill=\"#235f51\">±0.38 m（+序列约束）</text></g></svg>"},{"name":"层界模型训练","role":"算法","do":"1D U-Net 输出逐点\"层界概率\"，正样本是层界附近 ±0.25 m 的窄带（占全井 3%）；用加权 BCE + 距离惩罚（离真值越远惩罚越大）；按井分组切分。","effect":"厚层（>5 m）层界召回 0.96，薄层（1—2 m）召回 0.71——后者是全部误差的主要来源。","trap":"层界正样本的窄带宽度是个超参：太窄学不到上下文，太宽层界会被\"抹平\"。按采样间隔的 2—4 倍取，再按层厚做加权。","fig":"<svg viewBox=\"0 0 560 92\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"层界窄带标注\"><g font-size=\"10\"><text x=\"18\" y=\"20\" fill=\"#79828a\">层界正样本窄带（±0.25 m）只占全井 3%：</text><rect x=\"230\" y=\"10\" width=\"300\" height=\"13\" rx=\"6\" fill=\"#c9c2b0\"/><text x=\"240\" y=\"20\" fill=\"#79828a\">层内 97%</text><rect x=\"230\" y=\"30\" width=\"9\" height=\"13\" fill=\"#b05a51\"/><text x=\"246\" y=\"40\" fill=\"#b05a51\">层界 3%（加权 15×）</text><text x=\"18\" y=\"66\" fill=\"#79828a\">按层厚召回：</text><rect x=\"130\" y=\"56\" width=\"290\" height=\"12\" rx=\"6\" fill=\"#2f7d6b\"/><text x=\"426\" y=\"66\" fill=\"#235f51\">厚层 &gt;5 m：0.96</text><rect x=\"130\" y=\"74\" width=\"214\" height=\"12\" rx=\"6\" fill=\"#b26a39\" opacity=\".85\"/><text x=\"350\" y=\"84\" fill=\"#8e5229\">薄层 1—2 m：0.71（主要误差源）</text></g></svg>"},{"name":"层厚与层序后处理","role":"质控","do":"对概率曲线做峰值检测得到候选层界，再按两套规则修编：最小层厚（<1.5 m 的层合并到相邻层）、层序规则（同一层位在一口井内只能出现一次，砂泥交替抖动直接合并）。","effect":"过分割从平均 4.2 处/井降到 0.8 处/井；层界\"抖动\"现象消失，输出可以直接进地质绘图软件。","trap":"最小层厚别一刀切——碳酸盐岩与薄互层砂岩的合理值差很多。按层组分设，或者让地质师给一张\"允许的最小层厚表\"。","fig":"<svg viewBox=\"0 0 560 94\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"后处理前后\"><g font-size=\"10\"><text x=\"18\" y=\"20\" fill=\"#79828a\">原始模型输出（逐点抖动）：</text><g><rect x=\"130\" y=\"10\" width=\"40\" height=\"13\" fill=\"#8c8574\"/><rect x=\"170\" y=\"10\" width=\"16\" height=\"13\" fill=\"#d8c98a\"/><rect x=\"186\" y=\"10\" width=\"30\" height=\"13\" fill=\"#8c8574\"/><rect x=\"216\" y=\"10\" width=\"14\" height=\"13\" fill=\"#d8c98a\"/><rect x=\"230\" y=\"10\" width=\"120\" height=\"13\" fill=\"#8c8574\"/></g><text x=\"356\" y=\"20\" fill=\"#b05a51\">砂—泥—砂—泥 抖动</text><text x=\"18\" y=\"46\" fill=\"#79828a\">层序 + 层厚后处理：</text><g><rect x=\"130\" y=\"36\" width=\"40\" height=\"13\" fill=\"#8c8574\"/><rect x=\"170\" y=\"36\" width=\"60\" height=\"13\" fill=\"#d8c98a\"/><rect x=\"230\" y=\"36\" width=\"120\" height=\"13\" fill=\"#8c8574\"/></g><text x=\"356\" y=\"46\" fill=\"#235f51\">过分割 4.2 → 0.8 处/井</text><text x=\"18\" y=\"74\" fill=\"#79828a\">规则来源：同一层位井内只出现一次 · 最小层厚按层组分设</text></g></svg>"},{"name":"邻井对比与人工复核","role":"人工","do":"把分层结果投到连井剖面上做横向对比，层位在邻井间突然错位的自动标红；解释员只复核标红段与薄层段。","effect":"人工复核时间从 2.5 h/井降到 20 min/井；82% 的井无需修改直接入库。","trap":"横向对比容易\"过度平滑\"——断层两侧的层位本来就该错位，要先把断层位置排除在对比约束之外。"}],"metrics":{"title":"怎么算「做对了」","html":"<p>这个场景最容易被误用的指标是<b>逐点准确率</b>：层内点占 95% 以上，一个\"把整口井判成泥岩\"的模型也有 60% 的逐点准确率，毫无意义。</p><div style=\"margin:10px 0 6px\"><svg viewBox=\"0 0 640 128\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"分层指标对比\"><g font-size=\"10.5\"><g><rect x=\"40\" y=\"16\" width=\"168\" height=\"26\" rx=\"4\" fill=\"#f5f2ea\"/><text x=\"52\" y=\"34\" fill=\"#79828a\">指标</text><rect x=\"214\" y=\"16\" width=\"140\" height=\"26\" rx=\"4\" fill=\"#f5f2ea\"/><text x=\"284\" y=\"34\" text-anchor=\"middle\" fill=\"#79828a\">厚层 &gt;5 m</text><rect x=\"360\" y=\"16\" width=\"140\" height=\"26\" rx=\"4\" fill=\"#f5f2ea\"/><text x=\"430\" y=\"34\" text-anchor=\"middle\" fill=\"#79828a\">薄层 1—2 m</text><rect x=\"506\" y=\"16\" width=\"114\" height=\"26\" rx=\"4\" fill=\"#f5f2ea\"/><text x=\"563\" y=\"34\" text-anchor=\"middle\" fill=\"#79828a\">业务含义</text></g><g><rect x=\"40\" y=\"46\" width=\"168\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"52\" y=\"62\" fill=\"#4d565b\">层界召回</text><rect x=\"214\" y=\"46\" width=\"140\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"284\" y=\"62\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">0.96</text><rect x=\"360\" y=\"46\" width=\"140\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"430\" y=\"62\" text-anchor=\"middle\" fill=\"#b05a51\" font-weight=\"700\">0.71</text><rect x=\"506\" y=\"46\" width=\"114\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"516\" y=\"62\" fill=\"#79828a\">薄层是短板</text></g><g><rect x=\"40\" y=\"74\" width=\"168\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"52\" y=\"90\" fill=\"#4d565b\">层界误差</text><rect x=\"214\" y=\"74\" width=\"140\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"284\" y=\"90\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">±0.28 m</text><rect x=\"360\" y=\"74\" width=\"140\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"430\" y=\"90\" text-anchor=\"middle\" fill=\"#b26a39\" font-weight=\"700\">±0.72 m</text><rect x=\"506\" y=\"74\" width=\"114\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"516\" y=\"90\" fill=\"#79828a\">容差 ±0.5 m</text></g><g><rect x=\"40\" y=\"102\" width=\"168\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"52\" y=\"118\" fill=\"#4d565b\">可自动采用率</text><rect x=\"214\" y=\"102\" width=\"140\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"284\" y=\"118\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">94%</text><rect x=\"360\" y=\"102\" width=\"140\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"430\" y=\"118\" text-anchor=\"middle\" fill=\"#b26a39\" font-weight=\"700\">46%</text><rect x=\"506\" y=\"102\" width=\"114\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"516\" y=\"118\" fill=\"#79828a\">决定省多少工</text></g></g></svg></div><p style=\"margin-top:6px\">读法：<b>全局平均指标会掩盖薄层的失败</b>。分层这件事的价值恰恰集中在薄层上——厚层人也不会划错。所以汇报时要按层厚分桶，并明确告诉地质师\"薄层仍要人看\"。</p>"},"fails":[{"name":"逐点分类不加序列约束","why":"层界附近输出\"砂—泥—砂—泥\"抖动，层数虚高一倍，成果无法入库。必须对层界建模或加 CRF/层序后处理。"},{"name":"跨系列曲线直接训练","why":"1985 年与 2015 年仪器的 GR 刻度不同，模型学到的是\"年代\"而不是岩性，跨井迁移后层界误差翻倍。必须先标准化。"},{"name":"分层方案未统一就标注","why":"历史标签里新老方案混着（同一层位有的划 3 个小层有的划 5 个），模型学出来层数在两个方案之间摇摆。这件事必须地质师先拍板。"}]},"demo":{"mode":"module","js":"demo/demo.js","label":"可运行示范","intro":"一口井的 GR / SP / 电阻率三道曲线，真值层界用虚线标出。拖动窗宽、判定阈值与最小层厚，看模型划出的实线层界怎么在「切太碎」和「切太粗」之间摆动——分层质量的关键就是这三个参数。","height":760}}};

  var __mod = { exports: {} };
  (function (module, exports) {
/* 测井曲线智能分层 · 交互示范
   合成 GR/SP/电阻率三条曲线（真值分层已知），自实现"滑动窗口变化点检测 + 层厚合并"，
   输出分层结果并与真值层界对照，给出层界误差、过/欠分割与一致度。 */
module.exports = {
  mount: function (root, api) {
    var JADE = '#2f7d6b', CLAY = '#b26a39', BAD = '#b05a51',
        OPT = '#41699b', INK3 = '#79828a', INK2 = '#4d565b';

    var TOP = 2400, BOT = 2560, STEP = 1, N = (BOT - TOP) / STEP;
    /* 真值层：[底深, 岩性, GR基准, SP基准, RT基准(对数), 非均质性] */
    var TRUTH = [
      { bot: 2432, n: '泥岩', gr: 118, sp: -12, rt: 0.85, het: 6 },
      { bot: 2451, n: '砂岩', gr: 62, sp: -46, rt: 1.95, het: 11 },
      { bot: 2468, n: '泥质砂岩', gr: 88, sp: -28, rt: 1.30, het: 14 },
      { bot: 2490, n: '泥岩', gr: 126, sp: -8, rt: 0.75, het: 7 },
      { bot: 2512, n: '灰岩', gr: 24, sp: -62, rt: 2.60, het: 5 },
      { bot: 2531, n: '砂岩', gr: 58, sp: -52, rt: 2.05, het: 13 },
      { bot: 2560, n: '泥岩', gr: 112, sp: -14, rt: 0.90, het: 8 }
    ];
    var LCOL = ['#8c8574', '#d8c98a', '#b9c4a0', '#8c8574', '#cfd8dc', '#d8c98a', '#8c8574'];

    function noise(i, s) {
      var h1 = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453;
      var h2 = Math.sin(i * 39.3468 + s * 11.135) * 24634.6345;
      return ((h1 - Math.floor(h1)) - 0.5) * 2 + ((h2 - Math.floor(h2)) - 0.5) * 0.8;
    }
    function layerAt(d) {
      for (var i = 0; i < TRUTH.length; i++) if (d <= TRUTH[i].bot) return i;
      return TRUTH.length - 1;
    }

    /* 合成三条曲线 */
    function makeCurves(nz, seed) {
      var gr = [], sp = [], rt = [];
      for (var i = 0; i < N; i++) {
        var d = TOP + i * STEP, li = layerAt(d), L = TRUTH[li];
        var wob = Math.sin(i * 0.11 + li * 2.1) * L.het * 0.35 + Math.sin(i * 0.037 + li) * L.het * 0.65;
        gr.push(L.gr + wob + noise(i, seed) * nz * 26);
        sp.push(L.sp - wob * 0.5 + noise(i, seed + 7) * nz * 16);
        rt.push(L.rt + wob * 0.012 + noise(i, seed + 13) * nz * 0.32);
      }
      return { gr: gr, sp: sp, rt: rt };
    }

    /* ---------- 变化点检测：左右窗口的多道统计差异 ---------- */
    function boundaries(c, win, thr, minThk) {
      var sc = [];
      for (var i = win; i < N - win; i++) {
        var lGr = 0, rGr = 0, lRt = 0, rRt = 0, lV = 0, rV = 0, k;
        for (k = 0; k < win; k++) {
          lGr += c.gr[i - 1 - k]; rGr += c.gr[i + k];
          lRt += c.rt[i - 1 - k]; rRt += c.rt[i + k];
        }
        lGr /= win; rGr /= win; lRt /= win; rRt /= win;
        for (k = 0; k < win; k++) {
          lV += Math.pow(c.gr[i - 1 - k] - lGr, 2);
          rV += Math.pow(c.gr[i + k] - rGr, 2);
        }
        lV = Math.sqrt(lV / win); rV = Math.sqrt(rV / win);
        /* 多道一致性：GR 台阶 + 电阻率台阶 + 方差变化 */
        var dGr = Math.abs(rGr - lGr) / 42;
        var dRt = Math.abs(rRt - lRt) / 0.75;
        var dV = Math.abs(rV - lV) / 9;
        sc.push(0.55 * dGr + 0.30 * dRt + 0.15 * dV);
      }
      /* 局部极大 + 阈值 */
      var raw = [];
      for (var j = 1; j < sc.length - 1; j++) {
        if (sc[j] >= sc[j - 1] && sc[j] >= sc[j + 1] && sc[j] > thr) raw.push({ i: j + win, s: sc[j] });
      }
      raw.sort(function (a, b) { return b.s - a.s; });
      /* 按最小层厚合并：从强到弱保留，太近的丢掉 */
      var kept = [];
      for (var m = 0; m < raw.length; m++) {
        var ok = true;
        for (var q = 0; q < kept.length; q++) if (Math.abs(raw[m].i - kept[q].i) * STEP < minThk) { ok = false; break; }
        if (ok) kept.push(raw[m]);
      }
      kept.sort(function (a, b) { return a.i - b.i; });
      return { score: sc, marks: kept };
    }

    function truthBounds() {
      var out = [];
      for (var i = 0; i < TRUTH.length - 1; i++) out.push(TRUTH[i].bot);
      return out;
    }

    root.innerHTML =
      '<div class="demo">' +
      '<div class="demo-head"><span class="kicker">INTERACTIVE · LOG CURVE SEGMENTATION</span>' +
      '<h3>三道曲线，边界在哪？</h3>' +
      '<p>模型看不到"层"，它只看到一串数字。做法是对每个深度点问一句：<b>它左右两侧的统计特征是不是变了？</b>' +
      '变得越突然，越可能是层界。拖动<b>窗宽</b>与<b>判定阈值</b>，看分层结果怎么在"切太碎"和"切太粗"之间摆动。</p></div>' +
      '<div class="ctl-row">' +
      '<div class="ctl"><label>窗宽 <output id="lc-ow">8 m</output></label><input type="range" id="lc-w" min="3" max="24" step="1" value="8"></div>' +
      '<div class="ctl"><label>判定阈值 <output id="lc-ot">0.30</output></label><input type="range" id="lc-t" min="0.08" max="0.8" step="0.02" value="0.3"></div>' +
      '<div class="ctl"><label>最小层厚 <output id="lc-om">6 m</output></label><input type="range" id="lc-m" min="2" max="20" step="1" value="6"></div>' +
      '<div class="ctl"><label>噪声 <output id="lc-on">0.25</output></label><input type="range" id="lc-n" min="0" max="1" step="0.05" value="0.25"></div>' +
      '<button class="btn-x" id="lc-rand">🎲 换一口井</button>' +
      '</div>' +
      '<div class="grid2" style="grid-template-columns:1.35fr 1fr">' +
      '<div class="card-x"><h4>测井道：分层结果（背景色）与层界（实线预测 / 虚线真值）</h4>' +
      '<svg id="lc-track" class="chart" viewBox="0 0 560 470" role="img" aria-label="测井曲线分层"></svg></div>' +
      '<div class="card-x"><h4>分层质量</h4>' +
      '<div class="readouts">' +
      '<div class="ro"><span class="k">识别层数</span><b id="lc-v1">—</b></div>' +
      '<div class="ro"><span class="k">真值层数</span><b id="lc-v2">7</b></div>' +
      '<div class="ro"><span class="k">层界命中</span><b id="lc-v3">—</b></div>' +
      '<div class="ro"><span class="k">平均误差</span><b id="lc-v4">—</b></div>' +
      '<div class="ro"><span class="k">过分割</span><b id="lc-v5">—</b></div>' +
      '<div class="ro"><span class="k">漏检</span><b id="lc-v6">—</b></div>' +
      '<div class="ro"><span class="k">一致度</span><b id="lc-v7">—</b></div>' +
      '<div class="ro"><span class="k">可自动采用</span><b id="lc-v8">—</b></div>' +
      '</div>' +
      '<h4 style="margin-top:14px">变化点得分曲线</h4>' +
      '<svg id="lc-score" class="chart" viewBox="0 0 400 130" role="img" aria-label="变化点得分"></svg></div>' +
      '</div>' +
      '<p class="note" id="lc-note"></p>' +
      '</div>';

    var $ = function (id) { return root.querySelector('#' + id); };
    var SEED = 7;

    var W = 560, H = 470, MT = 16, MB = 26;
    var CW1 = 150, CW2 = 150, CW3 = 150;          /* GR / SP / RT 三道宽 */
    var X1 = 30, X2 = X1 + CW1 + 16, X3 = X2 + CW2 + 16;
    var HH = H - MT - MB;

    function draw() {
      var win = +$('lc-w').value, thr = +$('lc-t').value,
          minThk = +$('lc-m').value, nz = +$('lc-n').value;
      $('lc-ow').textContent = win + ' m';
      $('lc-ot').textContent = thr.toFixed(2);
      $('lc-om').textContent = minThk + ' m';
      $('lc-on').textContent = nz.toFixed(2);

      var c = makeCurves(nz, SEED);
      var res = boundaries(c, win, thr, minThk);
      var tb = truthBounds();
      var marks = res.marks.map(function (m) { return TOP + m.i * STEP; });

      /* ---- 分层着色背景 ---- */
      var s = '';
      var yOf = function (d) { return MT + (d - TOP) / (BOT - TOP) * HH; };
      var edges = [TOP].concat(marks, [BOT]);
      for (var e = 0; e < edges.length - 1; e++) {
        var mid = (edges[e] + edges[e + 1]) / 2, li = layerAt(mid);
        s += '<rect x="' + X1 + '" y="' + yOf(edges[e]).toFixed(1) + '" width="' + (X3 + CW3 - X1) +
          '" height="' + (yOf(edges[e + 1]) - yOf(edges[e])).toFixed(1) + '" fill="' + LCOL[li] +
          '" fill-opacity="' + (e % 2 ? 0.16 : 0.26) + '"/>';
      }
      /* ---- 三道曲线 ---- */
      function poly(arr, x, w, lo, hi, col, lw) {
        var d = '';
        for (var i = 0; i < N; i++) {
          var t = (arr[i] - lo) / (hi - lo);
          if (t < 0) t = 0; if (t > 1) t = 1;
          d += (i ? 'L' : 'M') + (x + t * w).toFixed(1) + ' ' + yOf(TOP + i * STEP).toFixed(1) + ' ';
        }
        return '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="' + lw + '" stroke-linejoin="round"/>';
      }
      s += '<g>' + poly(c.gr, X1, CW1, 0, 160, '#2f7d6b', 1.5) +
        poly(c.sp, X2, CW2, -80, 10, '#41699b', 1.5) +
        poly(c.rt, X3, CW3, 0.2, 3.2, '#b26a39', 1.5) + '</g>';
      /* ---- 道框与刻度 ---- */
      [[X1, CW1, 'GR (API)', '0', '160'], [X2, CW2, 'SP (mV)', '-80', '10'], [X3, CW3, 'RT (Ω·m, 对数示意)', '0.2', '3.2']]
        .forEach(function (t) {
          s += '<rect x="' + t[0] + '" y="' + MT + '" width="' + t[1] + '" height="' + HH + '" fill="none" stroke="#e9e4d8"/>';
          for (var g = 0; g <= 4; g++) {
            var gx = t[0] + g * t[1] / 4;
            s += '<line x1="' + gx + '" y1="' + MT + '" x2="' + gx + '" y2="' + (MT + HH) + '" stroke="#efece1"/>';
          }
          s += '<text x="' + (t[0] + t[1] / 2) + '" y="' + (MT - 4) + '" font-size="9.5" fill="' + INK3 +
            '" text-anchor="middle">' + t[2] + '</text>' +
            '<text x="' + t[0] + '" y="' + (H - 10) + '" font-size="8.5" fill="' + INK3 + '">' + t[3] + '</text>' +
            '<text x="' + (t[0] + t[1]) + '" y="' + (H - 10) + '" font-size="8.5" fill="' + INK3 + '" text-anchor="end">' + t[4] + '</text>';
        });
      /* ---- 深度刻度 ---- */
      for (var d0 = TOP; d0 <= BOT; d0 += 20) {
        s += '<line x1="' + (X1 - 4) + '" y1="' + yOf(d0) + '" x2="' + X1 + '" y2="' + yOf(d0) + '" stroke="#c9c2b0"/>' +
          '<text x="' + (X1 - 6) + '" y="' + (yOf(d0) + 3) + '" font-size="8.5" fill="' + INK3 + '" text-anchor="end" font-family="monospace">' + d0 + '</text>';
      }
      /* ---- 真值层界（虚线） ---- */
      tb.forEach(function (b) {
        s += '<line x1="' + X1 + '" y1="' + yOf(b).toFixed(1) + '" x2="' + (X3 + CW3) + '" y2="' + yOf(b).toFixed(1) +
          '" stroke="#79828a" stroke-width="1.2" stroke-dasharray="5 4"/>' +
          '<text x="' + (X3 + CW3 + 3) + '" y="' + (yOf(b) + 3).toFixed(1) + '" font-size="8.5" fill="' + INK3 + '">真值 ' + b + '</text>';
      });
      /* ---- 预测层界（实线） ---- */
      marks.forEach(function (b, i) {
        var near = 1e9;
        tb.forEach(function (t) { if (Math.abs(t - b) < near) near = Math.abs(t - b); });
        var col = near <= 2 ? JADE : (near <= 5 ? CLAY : BAD);
        s += '<line x1="' + X1 + '" y1="' + yOf(b).toFixed(1) + '" x2="' + (X3 + CW3) + '" y2="' + yOf(b).toFixed(1) +
          '" stroke="' + col + '" stroke-width="2"/>' +
          '<text x="' + (X1 - 6) + '" y="' + (yOf(b) + 3).toFixed(1) + '" font-size="8.5" fill="' + col +
          '" text-anchor="end" font-weight="700">' + Math.round(b) + '</text>';
      });
      $('lc-track').innerHTML = s;

      /* ---- 得分曲线 ---- */
      var sc = res.score, mx = 0;
      for (var q = 0; q < sc.length; q++) if (sc[q] > mx) mx = sc[q];
      if (mx < 0.2) mx = 0.2;
      var sw = 400, sh = 130, sml = 26, smb = 16, smt = 10;
      var g2 = '<line x1="' + sml + '" y1="' + (sh - smb) + '" x2="' + (sw - 6) + '" y2="' + (sh - smb) + '" stroke="#ddd7c8"/>' +
        '<line x1="' + sml + '" y1="' + smt + '" x2="' + sml + '" y2="' + (sh - smb) + '" stroke="#ddd7c8"/>' +
        '<line x1="' + sml + '" y1="' + (smt + (sh - smt - smb) * (1 - thr / mx)) + '" x2="' + (sw - 6) + '" y2="' +
        (smt + (sh - smt - smb) * (1 - thr / mx)) + '" stroke="#b05a51" stroke-width="1.3" stroke-dasharray="5 3"/>' +
        '<text x="' + (sw - 8) + '" y="' + (smt + (sh - smt - smb) * (1 - thr / mx) - 3) + '" font-size="8.5" fill="#b05a51" text-anchor="end">阈值</text>';
      var d2 = '';
      for (var p = 0; p < sc.length; p++) {
        d2 += (p ? 'L' : 'M') + (sml + p / sc.length * (sw - sml - 8)).toFixed(1) + ' ' +
          (smt + (sh - smt - smb) * (1 - sc[p] / mx)).toFixed(1) + ' ';
      }
      g2 += '<path d="' + d2 + '" fill="none" stroke="#2f7d6b" stroke-width="1.3"/>';
      res.marks.forEach(function (m) {
        var px = sml + (m.i - win) / sc.length * (sw - sml - 8);
        g2 += '<circle cx="' + px.toFixed(1) + '" cy="' + (smt + (sh - smt - smb) * (1 - m.s / mx)).toFixed(1) +
          '" r="2.8" fill="#b05a51"/>';
      });
      g2 += '<text x="' + sml + '" y="' + (sh - 4) + '" font-size="8.5" fill="' + INK3 + '">' + TOP + ' m</text>' +
        '<text x="' + (sw - 8) + '" y="' + (sh - 4) + '" font-size="8.5" fill="' + INK3 + '" text-anchor="end">' + BOT + ' m</text>';
      $('lc-score').innerHTML = g2;

      /* ---- 评价 ---- */
      var hit = 0, errs = [], tol = 2;
      tb.forEach(function (t) {
        var best = 1e9;
        marks.forEach(function (m) { if (Math.abs(m - t) < best) best = Math.abs(m - t); });
        if (best <= tol) { hit++; errs.push(best); }
      });
      var extra = 0;
      marks.forEach(function (m) {
        var ok = false;
        tb.forEach(function (t) { if (Math.abs(m - t) <= tol) ok = true; });
        if (!ok) extra++;
      });
      var miss = tb.length - hit;
      var mErr = errs.length ? errs.reduce(function (a, b) { return a + b; }, 0) / errs.length : 0;
      var agree = Math.round(100 * hit / Math.max(tb.length, marks.length));
      var usable = Math.round(100 * (hit - extra * 0.5) / tb.length);
      usable = usable < 0 ? 0 : (usable > 100 ? 100 : usable);

      $('lc-v1').textContent = (marks.length + 1) + ' 层';
      $('lc-v2').textContent = TRUTH.length + ' 层';
      $('lc-v3').textContent = hit + ' / ' + tb.length;
      $('lc-v3').className = hit === tb.length ? 'ok' : (hit >= tb.length - 1 ? 'warn' : 'bad');
      $('lc-v4').textContent = errs.length ? mErr.toFixed(2) + ' m' : '—';
      $('lc-v5').textContent = extra + ' 处';
      $('lc-v5').className = extra === 0 ? 'ok' : (extra <= 2 ? 'warn' : 'bad');
      $('lc-v6').textContent = miss + ' 处';
      $('lc-v6').className = miss === 0 ? 'ok' : 'bad';
      $('lc-v7').textContent = agree + '%';
      $('lc-v7').className = agree >= 85 ? 'ok' : (agree >= 60 ? 'warn' : 'bad');
      $('lc-v8').textContent = usable + '%';
      $('lc-v8').className = usable >= 80 ? 'ok' : (usable >= 50 ? 'warn' : 'bad');

      $('lc-note').innerHTML =
        '把 <b>窗宽</b>从 3 拖到 24：窗太窄，曲线上每一个毛刺都被当成层界（过分割）；窗太宽，薄层被两侧厚层"平均"掉（漏检）。' +
        '再看 <b>阈值</b>：它切在得分曲线上的哪一段，直接决定了这一轮是"切碎"还是"切粗"。' +
        '现场真正有用的不是"分层准不准"，而是最后一格 <b>可自动采用率</b>——' +
        '低于 70% 就意味着人工要逐条改，那还不如让他自己划。';
    }

    ['lc-w', 'lc-t', 'lc-m', 'lc-n'].forEach(function (id) { $(id).addEventListener('input', draw); });
    $('lc-rand').addEventListener('click', function () {
      SEED = (SEED * 1103515245 + 12345) >>> 0;
      draw();
    });

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
