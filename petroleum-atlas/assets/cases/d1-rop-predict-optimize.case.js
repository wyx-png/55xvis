/* =========================================================
   d1-rop-predict-optimize · 案例插件（由 _build/build.mjs 自动生成，勿手改）
   源头是案例包 rop-predict-optimize-case/source.js + demo/，改内容请改源头后重新构建。
   ========================================================= */
(function () {
  var DEF = {"id":"d1-rop-predict-optimize","sceneId":"d1","title":"钻速预测与参数优化：把每米成本压下来","status":"ready","version":"1.0.0","updated":"2026-10-26","tabs":{"background":{"label":"专业背景","lede":"一口 5000 m 的井，钻井费用里最大的一块是\"时间\"。机械钻速（ROP，m/h）每提高 10%，单井周期往往能省下两三天。司钻凭经验给钻压、转速、排量，钻井工程师用 Bourgoyne-Young 之类的机理公式估算 ROP——但公式里的地层系数要人工标定，换一个地层就失效。这个场景要做的，是用实时录井流把 ROP 预测准，再在预测器之上把参数推荐出来。","judge":[{"label":"任务类型","value":"回归预测 + 带约束寻优","desc":"分钟级更新"},{"label":"数据门槛","value":"同区块 ≥ 20 口井录井","desc":"含岩性与钻头记录"},{"label":"可见收益","value":"同层段钻速 +8%—18%","desc":"按每米成本核算"},{"label":"难度","value":"中","html":"<span class=\"dtag\" data-d=\"中\">难度 中</span>"}],"sections":[{"no":1,"en":"PROBLEM","title":"当前做法与问题","html":"<p>现场给参数的逻辑很朴素：钻压给大一点、转速给快一点，钻速就上去了。但<b>ROP 与钻压并不是单调递增的</b>——钻压超过\"拐点（founder point）\"后，切削齿吃入过深、井底岩屑来不及被携走、重复破碎加剧，ROP 反而掉头向下。转速也一样，过高的转速会激发粘滑与涡动，钻头先坏、MWD 跟着遭殃。</p><p>机理公式（Bourgoyne-Young、Maurer 等）能描述一部分趋势，但里面有七八个地层系数：<b>每换一个层段就要重新标定，而标定的依据往往只有\"上一口井好像是这样\"</b>。于是现场的实际做法是\"看邻井、凭经验、留余量\"——保守但安全，代价是 ROP 长期低于最优值。</p><div class=\"figure\"><svg viewBox=\"0 0 640 224\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"ROP 与钻压的非单调关系\"><g font-size=\"10.5\"><text x=\"26\" y=\"16\" fill=\"#79828a\">ROP 与钻压：机理公式 vs 实际</text><line x1=\"60\" y1=\"190\" x2=\"600\" y2=\"190\" stroke=\"#ddd7c8\"/><line x1=\"60\" y1=\"190\" x2=\"60\" y2=\"28\" stroke=\"#ddd7c8\"/><text x=\"330\" y=\"212\" text-anchor=\"middle\" fill=\"#79828a\">钻压 WOB（kN） →</text><text x=\"14\" y=\"112\" fill=\"#79828a\" transform=\"rotate(-90 14 112)\" text-anchor=\"middle\">ROP（m/h）</text><path d=\"M70 178 C 160 150, 250 118, 340 92 C 430 66, 520 44, 590 32\" fill=\"none\" stroke=\"#9ba3a9\" stroke-width=\"1.8\" stroke-dasharray=\"6 4\"/><text x=\"430\" y=\"60\" fill=\"#79828a\">机理公式（单调，抓不到拐点）</text><path d=\"M70 176 C 130 152, 190 128, 250 106 C 300 89, 340 78, 372 72 C 404 74, 430 84, 452 100 C 480 120, 520 148, 590 168\" fill=\"none\" stroke=\"#2f7d6b\" stroke-width=\"2.4\"/><text x=\"196\" y=\"120\" fill=\"#235f51\" font-weight=\"700\">实际：过了拐点反而回落</text><line x1=\"372\" y1=\"60\" x2=\"372\" y2=\"186\" stroke=\"#b26a39\" stroke-width=\"1.5\" stroke-dasharray=\"5 3\"/><text x=\"378\" y=\"204\" fill=\"#b26a39\">拐点 ≈ 128 kN（随地层而变）</text><circle cx=\"372\" cy=\"72\" r=\"4.2\" fill=\"#b05a51\"/><rect x=\"404\" y=\"120\" width=\"196\" height=\"46\" rx=\"8\" fill=\"#f9e9e5\" stroke=\"#b05a51\" stroke-opacity=\".35\"/><text x=\"416\" y=\"139\" font-size=\"10.5\" fill=\"#b05a51\">拐点右侧：ROP 掉、磨损涨、</text><text x=\"416\" y=\"156\" font-size=\"10.5\" fill=\"#b05a51\">振动起来，三重代价同时发生</text></g></svg></div><div class=\"figcap\"><b>图 1</b><span>ROP 与钻压的关系有一条明显的\"先升后降\"曲线。<b>纯单调公式在这里必然失效，而这条拐点线的位置随地层、钻头磨损、排量整体平移</b>——这正是机器学习相对于机理模型的增量所在。</span></div>"},{"no":2,"en":"INTERVENTION","title":"AI 能做什么","html":"<p>拆成两件事：<b>先预测，再寻优</b>。预测器吃的是实时录井流（钻压、转速、排量、扭矩、立管压力、伽马、岩性、井深），吐出下一分钟的 ROP；寻优器在预测器之上做网格/贝叶斯搜索，找出<b>满足约束且每米成本最低</b>的钻压与转速组合。</p><p>必须说清楚的两个工程判断。<b>第一，目标函数不是 ROP 最大，而是每米成本最低</b>：</p><div class=\"figure\" style=\"margin:6px 0 2px\"><svg viewBox=\"0 0 640 76\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"每米成本构成\"><rect x=\"20\" y=\"18\" width=\"600\" height=\"42\" rx=\"9\" fill=\"#fdfcf9\" stroke=\"#e9e4d8\"/><text x=\"40\" y=\"44\" font-size=\"13\" fill=\"#242b2e\" font-family=\"monospace\">每米成本 =（钻机小时费 + 钻头摊销）÷ ROP</text><text x=\"330\" y=\"62\" font-size=\"10.5\" fill=\"#79828a\">钻头摊销 = 钻头单价 ÷ 可钻小时，而可钻小时 ≈ 1 /（钻压^1.5 · 转速^0.6）</text></svg></div><p style=\"margin-top:10px\">把钻压拉到极限确实能把 ROP 拉高，但磨损速率按<b>钻压的 1.5 次方</b>走——一只钻头从 60 h 寿命压到 20 h，摊到每米里的钱比省下的钻机费更多。<b>Account 里真正的最优解，几乎总在拐点左侧一点。</b></p><p><b>第二，推荐必须带约束，且要考虑数据滞后</b>：扭矩上限、泵压上限、振动等级、MWD 传输延迟（井下数据滞后 30—90 s）。一个不考虑滞后的\"最优钻压\"，落到井底时地层可能已经换了。</p><div class=\"figure\"><svg viewBox=\"0 0 640 168\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"预测加寻优的闭环\"><g font-size=\"11\" font-weight=\"700\" text-anchor=\"middle\"><rect x=\"18\" y=\"52\" width=\"112\" height=\"56\" rx=\"9\" fill=\"#e7eef9\" stroke=\"#41699b\"/><text x=\"74\" y=\"74\" fill=\"#31527a\">实时录井流</text><text x=\"74\" y=\"91\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">1 Hz 综合录井</text><rect x=\"150\" y=\"52\" width=\"112\" height=\"56\" rx=\"9\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\"/><text x=\"206\" y=\"74\" fill=\"#235f51\">ROP 预测器</text><text x=\"206\" y=\"91\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">GBDT / MLP</text><rect x=\"282\" y=\"52\" width=\"112\" height=\"56\" rx=\"9\" fill=\"#f1f1dd\" stroke=\"#767a2e\"/><text x=\"338\" y=\"74\" fill=\"#5d6022\">带约束寻优</text><text x=\"338\" y=\"91\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">扭矩/振动/磨损</text><rect x=\"414\" y=\"52\" width=\"100\" height=\"56\" rx=\"9\" fill=\"#f8ecdf\" stroke=\"#b26a39\"/><text x=\"464\" y=\"74\" fill=\"#8e5229\">推荐参数</text><text x=\"464\" y=\"91\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">每 1—3 min</text><rect x=\"534\" y=\"52\" width=\"88\" height=\"56\" rx=\"9\" fill=\"#f9e9e5\" stroke=\"#b05a51\"/><text x=\"578\" y=\"74\" fill=\"#9c4a42\">司钻执行</text><text x=\"578\" y=\"91\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">可覆盖</text></g><g stroke=\"#9ba3a9\" stroke-width=\"1.4\"><path d=\"M130 80 h16\" marker-end=\"url(#r1a)\"/><path d=\"M262 80 h16\" marker-end=\"url(#r1a)\"/><path d=\"M394 80 h16\" marker-end=\"url(#r1a)\"/><path d=\"M514 80 h16\" marker-end=\"url(#r1a)\"/></g><defs><marker id=\"r1a\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#9ba3a9\"/></marker></defs><path d=\"M578 108 C 578 136, 300 140, 74 122\" fill=\"none\" stroke=\"#b26a39\" stroke-width=\"1.4\" stroke-dasharray=\"6 4\"/><text x=\"330\" y=\"152\" font-size=\"10.5\" fill=\"#8e5229\" text-anchor=\"middle\">执行结果回灌：实测 ROP 与预测的偏差就是下一轮的训练样本（注意 MWD 滞后 30—90 s，需按时间戳对齐）</text></svg></div><div class=\"figcap\"><b>图 2</b><span>预测器负责\"知道现在会钻多快\"，寻优器负责\"下一步该给多少\"。<b>司钻始终可以按经验覆盖推荐值</b>——这条人工旁路既是安全兜底，也是最有价值的对照数据。</span></div>"},{"no":3,"en":"DATA","title":"你需要准备什么","html":"<p style=\"margin-bottom:14px\">这个场景的数据一般不难拿——综合录井仪一直在采。难的是<b>对齐与清洗</b>：录井、MWD、钻头记录来自三套系统，时间戳口径不一样。</p><div class=\"checklist\"><div class=\"cl-head\"><span>数据准备清单 · 5 项</span><span class=\"cl-prog\"><span id=\"cl-txt\">0 / 5</span><span class=\"cl-bar\"><i id=\"cl-fill\"></i></span></span></div><div class=\"cl-item\" data-cl=\"0\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">综合录井实时数据</span><span class=\"cl-s\">钻压/转速/扭矩/排量/立压，1 Hz 或更密</span></span><span class=\"cl-n\">核心特征，需去停泵、接单根段</span></div><div class=\"cl-item\" data-cl=\"1\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">实测机械钻速</span><span class=\"cl-s\">由深度差分得到，需平滑</span></span><span class=\"cl-n\">标签；接单根处会假性归零</span></div><div class=\"cl-item\" data-cl=\"2\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">钻头记录（IADC）</span><span class=\"cl-s\">钻头型号、入井/起出深度、磨损等级</span></span><span class=\"cl-n\">磨损建模与成本核算的必需项</span></div><div class=\"cl-item\" data-cl=\"3\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">岩性与地层分层</span><span class=\"cl-s\">录井岩性 + 测井分层，或随钻伽马</span></span><span class=\"cl-n\">分段建模的关键特征</span></div><div class=\"cl-item\" data-cl=\"4\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">MWD 振动与井下参数</span><span class=\"cl-s\">粘滑/涡动等级、井下钻压转速</span></span><span class=\"cl-n\">约束项，注意 30—90 s 滞后</span></div></div>"},{"no":4,"en":"DIFFICULTY","title":"技术难度与参考方向","html":"<div style=\"display:flex;align-items:center;gap:14px;flex-wrap:wrap\"><span class=\"dtag\" data-d=\"中\">难度 中</span><span class=\"small muted\">模型不难，难在特征对齐、分段建模与\"推荐值敢不敢被执行\"。</span></div><div class=\"meter\"><i class=\"on\"></i><i class=\"on\"></i><i></i></div><p>先别一上来就换大模型。<b>用 GBDT（XGBoost / LightGBM）在表格特征上做 ROP 回归，通常已经能把 MAPE 压到 15% 以内</b>，而且特征重要性可以直接讲给钻井工程师听——这一点在推广阶段比精度更重要。深度学习（LSTM / TCN）只在你要显式建模\"钻头磨损随时间的累积\"时才值得上。</p><p>另一个容易踩的坑：<b>不要用全井段一个模型</b>。砂岩段与灰岩段的 ROP 差一个量级，混在一起训练得到的模型在每个段上都不准。把岩性/层位作为特征加进去，或者干脆按层段分段建模。</p><p style=\"margin-top:18px\"><span class=\"kicker plain\" style=\"color:var(--ink-4)\">可借鉴的通用技术</span></p><div class=\"refs\"><a class=\"ref\" href=\"#/method/ts\">表格回归与特征重要性<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/opt\">带约束寻优<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/opt\">贝叶斯优化<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/ts\">分布漂移监控<span class=\"ar\">↗</span></a></div>"}]},"workflow":{"label":"案例流程","title":"案例：一个区块 26 口井的钻速优化上线","lead":["某致密砂岩气区块，26 口井历史录井数据（合计 13.8 万 m 进尺），二开 215.9 mm 井眼段平均机械钻速 11.4 m/h，单井周期 41 天。","目标：在不增加钻头消耗的前提下，把该井段机械钻速提高 10% 以上，且振动报警次数不增加。"],"stats":[["历史井数","26 口"],["进尺","13.8 万 m"],["基线钻速","11.4 m/h"],["上线后","13.1 m/h"]],"steps":[{"name":"录井数据对齐与清洗","role":"数据","do":"统一三套系统的时间基准，剔除停泵、接单根、划眼、测斜等非钻进段；深度差分得到实测 ROP 后做 30 s 中值滤波，去掉接单根造成的假性归零。","effect":"有效钻进样本从 9.2 万条筛到 6.1 万条，ROP 标签的分布从\"一堆零 + 长尾\"变成接近对数正态。","trap":"别用井深做对齐键——不同井的补心高与斜深/垂深换算不同，必须用\"钻进状态位 + 时间戳\"双重判定。","fig":"<svg viewBox=\"0 0 560 88\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"数据清洗漏斗\"><g font-size=\"10\"><g text-anchor=\"middle\"><rect x=\"18\" y=\"20\" width=\"112\" height=\"44\" rx=\"8\" fill=\"#e7eef9\" stroke=\"#41699b\" stroke-opacity=\".5\"/><text x=\"74\" y=\"38\" fill=\"#31527a\" font-weight=\"700\">9.2 万条</text><text x=\"74\" y=\"53\" fill=\"#9ba3a9\">原始录井</text><rect x=\"146\" y=\"20\" width=\"112\" height=\"44\" rx=\"8\" fill=\"#f9efd7\" stroke=\"#a97a1c\" stroke-opacity=\".5\"/><text x=\"202\" y=\"38\" fill=\"#8e5229\" font-weight=\"700\">剔非钻进段</text><text x=\"202\" y=\"53\" fill=\"#9ba3a9\">停泵/接单根/划眼</text><rect x=\"274\" y=\"20\" width=\"112\" height=\"44\" rx=\"8\" fill=\"#f1f1dd\" stroke=\"#767a2e\" stroke-opacity=\".5\"/><text x=\"330\" y=\"38\" fill=\"#5d6022\" font-weight=\"700\">时间对齐</text><text x=\"330\" y=\"53\" fill=\"#9ba3a9\">MWD 滞后校正</text><rect x=\"402\" y=\"20\" width=\"134\" height=\"44\" rx=\"8\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\" stroke-opacity=\".5\"/><text x=\"469\" y=\"38\" fill=\"#235f51\" font-weight=\"700\">6.1 万条可用</text><text x=\"469\" y=\"53\" fill=\"#9ba3a9\">含岩性与磨损标签</text></g><g stroke=\"#9ba3a9\" stroke-width=\"1.2\"><path d=\"M130 42 h12\" marker-end=\"url(#r1b)\"/><path d=\"M258 42 h12\" marker-end=\"url(#r1b)\"/><path d=\"M386 42 h12\" marker-end=\"url(#r1b)\"/></g></g><defs><marker id=\"r1b\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#9ba3a9\"/></marker></defs></svg>"},{"name":"特征工程：把物理先验写进特征","role":"工程","do":"除原始参数外，显式构造：机械比能 MSE、单位进尺扭矩、钻头累计进尺与累计磨损估计、岩性 one-hot、层位埋深、水力参数（钻头压降、射流冲击力）。","effect":"加入\"钻头累计进尺\"这一项后，验证集 MAPE 从 22.1% 降到 16.4%——模型终于能表达\"钻头越旧越慢\"。","trap":"别把\"本段已钻进尺\"这类未来信息当特征：离线指标会虚高，上线时根本拿不到。所有特征必须是\"给出推荐那一刻已知\"。","fig":"<svg viewBox=\"0 0 560 90\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"特征重要性\"><g font-size=\"10\"><text x=\"18\" y=\"22\" fill=\"#79828a\">GBDT 特征重要性（前 6）：</text><rect x=\"150\" y=\"12\" width=\"300\" height=\"12\" rx=\"6\" fill=\"#2f7d6b\"/><text x=\"456\" y=\"22\" fill=\"#235f51\">钻头累计进尺</text><rect x=\"150\" y=\"28\" width=\"246\" height=\"12\" rx=\"6\" fill=\"#2f7d6b\" opacity=\".85\"/><text x=\"402\" y=\"38\" fill=\"#235f51\">钻压 WOB</text><rect x=\"150\" y=\"44\" width=\"198\" height=\"12\" rx=\"6\" fill=\"#41699b\" opacity=\".85\"/><text x=\"354\" y=\"54\" fill=\"#31527a\">岩性（层段）</text><rect x=\"150\" y=\"60\" width=\"162\" height=\"12\" rx=\"6\" fill=\"#41699b\" opacity=\".7\"/><text x=\"318\" y=\"70\" fill=\"#31527a\">转速 RPM</text><rect x=\"150\" y=\"76\" width=\"120\" height=\"12\" rx=\"6\" fill=\"#767a2e\" opacity=\".8\"/><text x=\"276\" y=\"86\" fill=\"#5d6022\">排量/水力</text></g></svg>"},{"name":"训练 ROP 预测器","role":"算法","do":"GBDT 回归，按井做分组切分（同一口井的样本不跨训练/验证），目标取 log(ROP) 以压住长尾；按层段加权，避免深部慢层段被淹没。","effect":"验证集 MAPE 15.2%，且在\"拐点附近\"的样本上误差最大——这与物理直觉一致，也正是需要寻优器保守处理的地方。","trap":"按井分组切分是硬要求：随机切会让同一口井的相邻样本同时出现在训练集和测试集，指标虚高 5—8 个点。","fig":"<svg viewBox=\"0 0 560 92\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"预测值与实测值散点\"><g font-size=\"10\"><line x1=\"50\" y1=\"76\" x2=\"520\" y2=\"76\" stroke=\"#ddd7c8\"/><line x1=\"50\" y1=\"76\" x2=\"50\" y2=\"14\" stroke=\"#ddd7c8\"/><text x=\"285\" y=\"90\" text-anchor=\"middle\" fill=\"#79828a\">实测 ROP（m/h）</text><text x=\"14\" y=\"46\" fill=\"#79828a\" transform=\"rotate(-90 14 46)\" text-anchor=\"middle\">预测 ROP</text><path d=\"M60 72 L500 20\" stroke=\"#9ba3a9\" stroke-dasharray=\"5 4\"/><text x=\"430\" y=\"66\" fill=\"#9ba3a9\">理想</text><g fill=\"#2f7d6b\" opacity=\".55\"><circle cx=\"90\" cy=\"66\" r=\"2.4\"/><circle cx=\"130\" cy=\"58\" r=\"2.4\"/><circle cx=\"170\" cy=\"54\" r=\"2.4\"/><circle cx=\"205\" cy=\"46\" r=\"2.4\"/><circle cx=\"240\" cy=\"44\" r=\"2.4\"/><circle cx=\"280\" cy=\"38\" r=\"2.4\"/><circle cx=\"315\" cy=\"34\" r=\"2.4\"/><circle cx=\"350\" cy=\"30\" r=\"2.4\"/><circle cx=\"390\" cy=\"27\" r=\"2.4\"/><circle cx=\"430\" cy=\"23\" r=\"2.4\"/><circle cx=\"470\" cy=\"20\" r=\"2.4\"/></g><g fill=\"#b05a51\" opacity=\".7\"><circle cx=\"205\" cy=\"58\" r=\"2.8\"/><circle cx=\"240\" cy=\"52\" r=\"2.8\"/><circle cx=\"280\" cy=\"48\" r=\"2.8\"/><circle cx=\"315\" cy=\"42\" r=\"2.8\"/></g><text x=\"322\" y=\"62\" fill=\"#b05a51\">拐点附近误差最大</text><text x=\"70\" y=\"26\" fill=\"#235f51\" font-weight=\"700\">按井分组切分 · MAPE 15.2%</text></g></svg>"},{"name":"寻优与约束整定","role":"质控","do":"在预测器上做网格搜索（钻压 40—200 kN × 转速 60—200 rpm），目标为每米成本；硬约束为扭矩上限、泵压上限、振动等级，软约束为钻头寿命不低于 40 h。","effect":"推荐值分布集中在拐点左侧 10—25 kN；相较司钻经验值，平均钻速提升 14.9%，钻头寿命基本持平。","trap":"约束阈值别照搬手册：不同钻具组合、不同井斜下的振动响应差很多。先在 2 口井上\"只提示不执行\"跑一趟，把阈值标定出来。","fig":"<svg viewBox=\"0 0 560 94\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"寻优结果对照\"><g font-size=\"10\"><text x=\"18\" y=\"20\" fill=\"#79828a\">推荐 vs 经验（同一层段）：</text><rect x=\"150\" y=\"10\" width=\"180\" height=\"13\" rx=\"6\" fill=\"#c9c2b0\"/><text x=\"336\" y=\"21\" fill=\"#79828a\">经验 140 kN / 110 rpm → 11.4 m/h</text><rect x=\"150\" y=\"28\" width=\"216\" height=\"13\" rx=\"6\" fill=\"#2f7d6b\"/><text x=\"372\" y=\"39\" fill=\"#235f51\" font-weight=\"700\">推荐 128 kN / 155 rpm → 13.1 m/h</text><rect x=\"150\" y=\"46\" width=\"252\" height=\"13\" rx=\"6\" fill=\"#b05a51\" opacity=\".55\"/><text x=\"408\" y=\"57\" fill=\"#b05a51\">ROP 最大点 186 kN / 190 rpm → 13.6 m/h（钻头寿命 21 h）</text><text x=\"18\" y=\"76\" fill=\"#79828a\">成本账：经验 1.00× · 推荐 <tspan fill=\"#235f51\" font-weight=\"700\">0.87×</tspan> · ROP 最大点 <tspan fill=\"#b05a51\" font-weight=\"700\">1.06×</tspan></text><text x=\"18\" y=\"90\" fill=\"#8e5229\">钻得最快的那一点，每米成本反而更高</text></g></svg>"},{"name":"上线与人工旁路","role":"人工","do":"推荐值以\"建议卡\"形式推到司钻屏，司钻可一键覆盖；覆盖理由（振动大、地层变了、钻头声音不对）被记录为结构化字段，每周复盘。","effect":"前 3 口井采纳率 62%，复盘后把振动约束阈值下调，采纳率升到 88%；单井周期 41 → 36 天。","trap":"别把采纳率当 KPI 硬压——司钻覆盖的理由里最有价值的是\"地层变了\"，这些正是模型分布漂移的预警信号，要单独统计。"}],"metrics":{"title":"怎么算「做对了」","html":"<p>这个场景有三层指标，缺一层就会误判：</p><div style=\"margin:10px 0 6px\"><svg viewBox=\"0 0 640 130\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"三层指标\"><g font-size=\"10.5\"><g><rect x=\"30\" y=\"16\" width=\"150\" height=\"26\" rx=\"4\" fill=\"#f5f2ea\"/><text x=\"42\" y=\"34\" fill=\"#79828a\">层</text><rect x=\"186\" y=\"16\" width=\"180\" height=\"26\" rx=\"4\" fill=\"#f5f2ea\"/><text x=\"276\" y=\"34\" text-anchor=\"middle\" fill=\"#79828a\">指标</text><rect x=\"372\" y=\"16\" width=\"130\" height=\"26\" rx=\"4\" fill=\"#f5f2ea\"/><text x=\"437\" y=\"34\" text-anchor=\"middle\" fill=\"#79828a\">结果</text><rect x=\"508\" y=\"16\" width=\"112\" height=\"26\" rx=\"4\" fill=\"#f5f2ea\"/><text x=\"564\" y=\"34\" text-anchor=\"middle\" fill=\"#79828a\">说明</text></g><g><rect x=\"30\" y=\"46\" width=\"150\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"42\" y=\"62\" fill=\"#4d565b\">模型精度</text><rect x=\"186\" y=\"46\" width=\"180\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"276\" y=\"62\" text-anchor=\"middle\" fill=\"#4d565b\">ROP 预测 MAPE</text><rect x=\"372\" y=\"46\" width=\"130\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"437\" y=\"62\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">15.2%</text><rect x=\"508\" y=\"46\" width=\"112\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"518\" y=\"62\" fill=\"#79828a\">按井分组切分</text></g><g><rect x=\"30\" y=\"74\" width=\"150\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"42\" y=\"90\" fill=\"#4d565b\">推荐质量</text><rect x=\"186\" y=\"74\" width=\"180\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"276\" y=\"90\" text-anchor=\"middle\" fill=\"#4d565b\">采纳率 / 钻速提升</text><rect x=\"372\" y=\"74\" width=\"130\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"437\" y=\"90\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">88% / +14.9%</text><rect x=\"508\" y=\"74\" width=\"112\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"518\" y=\"90\" fill=\"#79828a\">复盘后</text></g><g><rect x=\"30\" y=\"102\" width=\"150\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"42\" y=\"118\" fill=\"#4d565b\">业务结果</text><rect x=\"186\" y=\"102\" width=\"180\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"276\" y=\"118\" text-anchor=\"middle\" fill=\"#4d565b\">单井周期 / 每米成本</text><rect x=\"372\" y=\"102\" width=\"130\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"437\" y=\"118\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">41→36 天 / -13%</text><rect x=\"508\" y=\"102\" width=\"112\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"518\" y=\"118\" fill=\"#79828a\">这才是结算口径</text></g></g></svg></div><p style=\"margin-top:6px\">读法：<b>模型精度好不等于推荐有效</b>——MAPE 15% 的模型如果推荐值总是被司钻覆盖，业务价值就是零。所以中间那层\"采纳率\"必须单独盯：它同时反映模型的准度与推荐的可解释性。<b>采纳率上不去时，先去问覆盖理由，而不是回去调模型。</b></p>"},"fails":[{"name":"全井段一个模型","why":"砂岩段与灰岩段 ROP 差一个量级，混合训练后每个段都不准。把岩性/层位做特征或分段建模，MAPE 立刻改善。"},{"name":"泄漏的未来信息","why":"用了\"本段已钻进尺\"\"本段平均 ROP\"当特征，离线 MAPE 只有 9%，上线时这些量根本拿不到，预测直接崩。所有特征必须以\"推荐时刻已知\"为准。"},{"name":"只优化 ROP 最大","why":"推荐值长期落在拐点右侧，钻速确实高了 18%，但钻头寿命从 58 h 掉到 22 h，每米成本反而上升 6%。目标函数必须是每米成本。"}]},"demo":{"mode":"module","js":"demo/demo.js","label":"可运行示范","intro":"这是一张 ROP 响应曲面：横轴钻压、纵轴转速，每格颜色是模型预测的钻速，红圈是按「每米成本最低」选出的推荐点，蓝色虚线圈是常见的经验参数。拖动地层、钻头磨损、排量与振动容忍度，看推荐点怎么移动。","height":720}}};

  var __mod = { exports: {} };
  (function (module, exports) {
/* 钻速预测与参数优化 · 交互示范
   网格扫描 WOB × RPM：自实现 ROP 机理-统计混合模型（含 founder 拐点、水力净化、
   钻头磨损、粘滑振动约束），按「每米成本最低」寻优，而不是按 ROP 最大。 */
module.exports = {
  mount: function (root, api) {
    var JADE = '#2f7d6b', CLAY = '#b26a39', BAD = '#b05a51',
        OPT = '#41699b', INK3 = '#79828a', INK2 = '#4d565b';

    var NW = 22, NR = 15;                 /* WOB 网格 × RPM 网格 */
    var W0 = 40, W1 = 200;                /* 钻压 40—200 kN */
    var R0 = 60, R1 = 200;                /* 转速 60—200 rpm */
    var RIG = 5000;                       /* 钻机小时费（元/h） */
    var BIT = 180000;                     /* 一只钻头（元） */

    /* 地层：可钻性基准 + founder 拐点 + 研磨性 */
    var FORM = [
      { n: '软泥岩', k: 34, wf: 96, ab: 0.6 },
      { n: '中硬砂岩', k: 20, wf: 128, ab: 1.0 },
      { n: '硬砂砾岩', k: 11, wf: 168, ab: 1.6 },
      { n: '致密灰岩', k: 7, wf: 196, ab: 2.1 }
    ];

    function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

    /* ---------- 混合 ROP 模型 ---------- */
    /* ROP = 地层基准 × 水力净化 × 磨损折减 × 拐点折减 × WOB^a × RPM^b */
    function rop(wob, rpm, fm, wear, q) {
      var fHyd = clamp(0.52 + 0.48 * (q - 18) / 26, 0.35, 1.0);         /* 井底净化 */
      var fWear = clamp(1 - 0.58 * wear, 0.30, 1);                       /* 牙齿磨损 */
      var over = Math.max(0, (wob - fm.wf) / fm.wf);
      var fFound = 1 / (1 + 2.6 * Math.pow(over, 1.75));                 /* founder 拐点后回落 */
      var a1 = 0.85, b1 = 0.55;
      var base = Math.pow(Math.max(wob, 1) / 120, a1) * Math.pow(Math.max(rpm, 1) / 120, b1);
      return fm.k * fHyd * fWear * fFound * base;
    }
    /* 粘滑/涡动风险：高转速 + 大钻压 + 硬地层 */
    function vib(wob, rpm, fm) {
      var v = Math.max(0, (rpm - 130) / 70) * (0.45 + 0.55 * wob / W1)
            + 0.22 * Math.max(0, (wob - fm.wf) / fm.wf) * (fm.ab / 1.6);
      return clamp(v, 0, 1.4);
    }
    /* 牙齿/轴承磨损速率（相对），决定钻头寿命 */
    function wearRate(wob, rpm, fm) {
      return Math.pow(wob / 110, 1.5) * Math.pow(rpm / 110, 0.6) * fm.ab;
    }
    /* 每米综合成本（元/m）= (钻机小时费 + 钻头摊销) / ROP */
    function costPerM(wob, rpm, fm, wear, q) {
      var r = rop(wob, rpm, fm, wear, q);
      if (r <= 0.02) return 1e9;
      var life = 62 / Math.max(wearRate(wob, rpm, fm), 0.05);            /* 钻头可钻小时 */
      return (RIG + BIT / life) / r;
    }
    /* 机械比能 MSE（MPa 量级示意）：衡量破碎岩石的效率，越低越好 */
    function mse(wob, rpm, fm, wear, q) {
      var r = rop(wob, rpm, fm, wear, q);
      if (r <= 0.02) return 999;
      return (480 * rpm / Math.max(r, 0.05)) * (0.35 + 0.65 * wob / W1) * (1 + 0.5 * fm.ab);
    }

    root.innerHTML =
      '<div class="demo">' +
      '<div class="demo-head"><span class="kicker">INTERACTIVE · ROP SURFACE &amp; PARAMETER OPTIMIZER</span>' +
      '<h3>钻压与转速怎么配？看这张响应曲面</h3>' +
      '<p>模型每算一格给出一个钻速（ROP）。<b>最优点不在角落</b>——它落在"ROP 还在涨"与"钻头磨损、振动风险开始咬人"的交界上。' +
      '拖下面的滑条（尤其是<b>钻头磨损</b>），看红圈怎么整体平移。</p></div>' +
      '<div class="ctl-row">' +
      '<div class="ctl"><label>地层 <select id="rp-fm" style="font-size:12px;padding:3px 6px;border:1px solid var(--line-2,#ddd7c8);border-radius:6px">' +
      FORM.map(function (f, i) { return '<option value="' + i + '">' + f.n + '</option>'; }).join('') +
      '</select></label></div>' +
      '<div class="ctl"><label>钻头磨损 <output id="rp-ow">0.20</output></label><input type="range" id="rp-w" min="0" max="0.9" step="0.05" value="0.2"></div>' +
      '<div class="ctl"><label>排量 <output id="rp-oq">32 L/s</output></label><input type="range" id="rp-q" min="18" max="46" step="1" value="32"></div>' +
      '<div class="ctl"><label>振动容忍 <output id="rp-ov">0.35</output></label><input type="range" id="rp-v" min="0.2" max="0.8" step="0.05" value="0.35"></div>' +
      '<button class="btn-x ghost" id="rp-vc">振动约束：开</button>' +
      '</div>' +
      '<div class="grid2">' +
      '<div class="card-x"><h4>ROP 响应曲面（横轴钻压 kN · 纵轴转速 rpm）</h4>' +
      '<svg id="rp-surf" class="chart" viewBox="0 0 560 400" role="img" aria-label="ROP 响应曲面"></svg>' +
      '<div class="legend"><span><i style="background:#f7f4ea"></i>低 ROP</span><span><i style="background:#b9d3c7"></i>中</span>' +
      '<span><i style="background:#3f8a72"></i>高</span><span><i style="background:#c9c2b0"></i>约束越界</span>' +
      '<span><i style="background:#b05a51"></i>最优点</span></div></div>' +
      '<div class="card-x"><h4>推荐参数与成本账</h4>' +
      '<div class="readouts">' +
      '<div class="ro"><span class="k">推荐钻压</span><b id="rp-v1">—</b></div>' +
      '<div class="ro"><span class="k">推荐转速</span><b id="rp-v2">—</b></div>' +
      '<div class="ro"><span class="k">预测 ROP</span><b id="rp-v3">—</b></div>' +
      '<div class="ro"><span class="k">每米成本</span><b id="rp-v4">—</b></div>' +
      '<div class="ro"><span class="k">钻头寿命</span><b id="rp-v5">—</b></div>' +
      '<div class="ro"><span class="k">机械比能</span><b id="rp-v6">—</b></div>' +
      '<div class="ro"><span class="k">振动裕度</span><b id="rp-v7">—</b></div>' +
      '<div class="ro"><span class="k">vs 经验参数</span><b id="rp-v8">—</b></div>' +
      '</div>' +
      '<div id="rp-why" style="margin-top:12px;font-size:11.5px;line-height:1.75"></div></div>' +
      '</div>' +
      '<p class="note" id="rp-note"></p>' +
      '</div>';

    var $ = function (id) { return root.querySelector('#' + id); };
    var vibOn = true;

    var W = 560, H = 400, ML = 46, MR = 10, MT = 12, MB = 46;
    var GW = W - ML - MR, GH = H - MT - MB;
    var CW = GW / NW, CH = GH / NR;

    function draw() {
      var fi = +$('rp-fm').value, fm = FORM[fi];
      var wear = +$('rp-w').value, q = +$('rp-q').value, vtol = +$('rp-v').value;
      $('rp-ow').textContent = wear.toFixed(2);
      $('rp-oq').textContent = q + ' L/s';
      $('rp-ov').textContent = vtol.toFixed(2);

      /* ---- 扫网格 ---- */
      var grid = [], best = null, maxR = 0, feas = 0, top = null;
      for (var r = 0; r < NR; r++) {
        var row = [];
        var rpm = R0 + (r + 0.5) * (R1 - R0) / NR;
        for (var c = 0; c < NW; c++) {
          var wob = W0 + (c + 0.5) * (W1 - W0) / NW;
          var ro = rop(wob, rpm, fm, wear, q);
          var vb = vib(wob, rpm, fm);
          var ok = !vibOn || vb <= vtol;
          var cs = costPerM(wob, rpm, fm, wear, q);
          var cell = { wob: wob, rpm: rpm, rop: ro, vib: vb, ok: ok, cost: cs };
          row.push(cell);
          if (ro > maxR) { maxR = ro; top = cell; }
          if (ok) { feas++; if (!best || cs < best.cost) best = row[c]; }
        }
        grid.push(row);
      }
      if (!best) best = grid[Math.floor(NR / 2)][Math.floor(NW / 2)];
      if (!top) top = best;

      /* ---- 画曲面 ---- */
      var s = '<defs><pattern id="rpx" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">' +
        '<rect width="6" height="6" fill="#efece1"/><line x1="0" y1="0" x2="0" y2="6" stroke="#c9c2b0" stroke-width="2.2"/></pattern></defs>';
      for (var rr = 0; rr < NR; rr++) {
        for (var cc = 0; cc < NW; cc++) {
          var g = grid[rr][cc];
          var t = clamp(g.rop / maxR, 0, 1);
          var col = !g.ok ? 'url(#rpx)'
            : t < 0.2 ? '#f7f4ea' : t < 0.4 ? '#e3ebe6' : t < 0.6 ? '#c6dbd0'
            : t < 0.8 ? '#9cc5b3' : t < 0.94 ? '#6ba892' : '#3f8a72';
          s += '<rect x="' + (ML + cc * CW).toFixed(1) + '" y="' + (MT + (NR - 1 - rr) * CH).toFixed(1) +
            '" width="' + (CW + 0.6).toFixed(1) + '" height="' + (CH + 0.6).toFixed(1) + '" fill="' + col + '"/>';
          if (!g.ok) {
            var cx = ML + cc * CW + CW / 2, cy = MT + (NR - 1 - rr) * CH + CH / 2;
            s += '<path d="M' + (cx - 3.2) + ' ' + (cy - 3.2) + ' L' + (cx + 3.2) + ' ' + (cy + 3.2) +
                 ' M' + (cx + 3.2) + ' ' + (cy - 3.2) + ' L' + (cx - 3.2) + ' ' + (cy + 3.2) +
                 '" stroke="#b05a51" stroke-width="1.1" opacity=".75"/>';
          }
        }
      }
      /* 坐标轴 */
      s += '<line x1="' + ML + '" y1="' + (MT + GH) + '" x2="' + (ML + GW) + '" y2="' + (MT + GH) + '" stroke="#c9c2b0"/>' +
        '<line x1="' + ML + '" y1="' + MT + '" x2="' + ML + '" y2="' + (MT + GH) + '" stroke="#c9c2b0"/>';
      for (var k = 0; k <= 4; k++) {
        var wx = W0 + k * (W1 - W0) / 4, xx = ML + k * GW / 4;
        s += '<text x="' + xx + '" y="' + (MT + GH + 15) + '" font-size="9.5" fill="' + INK3 + '" text-anchor="middle" font-family="monospace">' + Math.round(wx) + '</text>' +
          '<line x1="' + xx + '" y1="' + (MT + GH) + '" x2="' + xx + '" y2="' + (MT + GH + 4) + '" stroke="#c9c2b0"/>';
        var ry = R0 + k * (R1 - R0) / 4, yy = MT + GH - k * GH / 4;
        s += '<text x="' + (ML - 6) + '" y="' + (yy + 3) + '" font-size="9.5" fill="' + INK3 + '" text-anchor="end" font-family="monospace">' + Math.round(ry) + '</text>';
      }
      s += '<text x="' + (ML + GW / 2) + '" y="' + (H - 6) + '" font-size="10" fill="' + INK2 + '" text-anchor="middle">钻压 WOB（kN）</text>' +
        '<text x="12" y="' + (MT + GH / 2) + '" font-size="10" fill="' + INK2 + '" transform="rotate(-90 12 ' + (MT + GH / 2) + ')" text-anchor="middle">转速 RPM（rpm）</text>';

      /* founder 拐点竖线 */
      var fxx = ML + (fm.wf - W0) / (W1 - W0) * GW;
      s += '<line x1="' + fxx.toFixed(1) + '" y1="' + MT + '" x2="' + fxx.toFixed(1) + '" y2="' + (MT + GH) + '" stroke="#b26a39" stroke-width="1.4" stroke-dasharray="5 3"/>' +
        '<text x="' + (fxx + 5) + '" y="' + (MT + 11) + '" font-size="9.5" fill="' + CLAY + '">拐点 ' + fm.wf + ' kN</text>';

      /* 最优点 */
      var bx = ML + (best.wob - W0) / (W1 - W0) * GW;
      var by = MT + GH - (best.rpm - R0) / (R1 - R0) * GH;
      s += '<circle cx="' + bx.toFixed(1) + '" cy="' + by.toFixed(1) + '" r="7.5" fill="none" stroke="#b05a51" stroke-width="2.4"/>' +
        '<circle cx="' + bx.toFixed(1) + '" cy="' + by.toFixed(1) + '" r="2.6" fill="#b05a51"/>' +
        '<text x="' + (bx + 11).toFixed(1) + '" y="' + (by + 4).toFixed(1) + '" font-size="10.5" font-weight="700" fill="#b05a51">' +
        Math.round(best.wob) + ' kN / ' + Math.round(best.rpm) + ' rpm</text>';
      /* 经验参数对照点 */
      var ex = ML + (140 - W0) / (W1 - W0) * GW, ey = MT + GH - (110 - R0) / (R1 - R0) * GH;
      s += '<circle cx="' + ex.toFixed(1) + '" cy="' + ey.toFixed(1) + '" r="5.5" fill="none" stroke="#41699b" stroke-width="1.8" stroke-dasharray="3 2"/>' +
        '<text x="' + (ex - 8).toFixed(1) + '" y="' + (ey - 9).toFixed(1) + '" font-size="9.5" fill="' + OPT + '" text-anchor="end">经验 140/110</text>';
      $('rp-surf').innerHTML = s;

      /* ---- 读数 ---- */
      var life = 62 / Math.max(wearRate(best.wob, best.rpm, fm), 0.05);
      var cBest = costPerM(best.wob, best.rpm, fm, wear, q);
      var cExp = costPerM(140, 110, fm, wear, q);
      var ropExp = rop(140, 110, fm, wear, q);
      var gain = (cExp - cBest) / cExp * 100;
      $('rp-v1').textContent = Math.round(best.wob) + ' kN';
      $('rp-v2').textContent = Math.round(best.rpm) + ' rpm';
      $('rp-v3').textContent = best.rop.toFixed(1) + ' m/h';
      $('rp-v4').textContent = Math.round(cBest) + ' 元/m';
      $('rp-v5').textContent = life.toFixed(0) + ' h';
      $('rp-v6').textContent = mse(best.wob, best.rpm, fm, wear, q).toFixed(0);
      $('rp-v7').textContent = (vibOn ? '裕度 ' + (vtol - best.vib).toFixed(2) : '不限');
      $('rp-v7').className = !vibOn ? '' : (vtol - best.vib > 0.08 ? 'ok' : 'warn');
      $('rp-v8').textContent = (gain >= 0 ? '-' : '+') + Math.abs(gain).toFixed(0) + '%';
      $('rp-v8').className = gain >= 0 ? 'ok' : 'bad';

      var why = [];
      why.push('ROP 最大点不是成本最低点：网格里钻得最快的那格是 <b>' + Math.round(top.wob) + ' kN / ' +
        Math.round(top.rpm) + ' rpm</b>（' + top.rop.toFixed(1) + ' m/h），每米成本 <b>' +
        Math.round(top.cost) + ' 元/m</b>；而推荐点只要 <b>' + Math.round(cBest) + ' 元/m</b>，' +
        '钻速只慢了 ' + (100 * (top.rop - best.rop) / top.rop).toFixed(0) + '%。');
      why.push('原因在磨损：钻得最快的那格钻压已越过 <b>拐点 ' + fm.wf + ' kN</b>，磨损速率按 <b>钻压^1.5</b> 走，' +
        '钻头寿命被压到 ' + (62 / Math.max(wearRate(top.wob, top.rpm, fm), 0.05)).toFixed(0) +
        ' h，一只 18 万的钻头摊到每米里反而更贵。');
      why.push('可行域占全网格 <b>' + Math.round(feas / (NW * NR) * 100) + '%</b>' +
        (vibOn ? '——右上那片斜纹区是振动超容忍度（高转速 + 大钻压激发粘滑/涡动），现场会直接打坏 MWD 与钻头。' :
          '——振动约束已关闭，但右上角的成本并不更优，说明约束没有卡住最优解。'));
      $('rp-why').innerHTML = why.join('<br><br>');
    }

    ['rp-fm', 'rp-w', 'rp-q', 'rp-v'].forEach(function (id) {
      $(id).addEventListener('input', draw);
      $(id).addEventListener('change', draw);
    });
    $('rp-vc').addEventListener('click', function () {
      vibOn = !vibOn;
      $('rp-vc').textContent = '振动约束：' + (vibOn ? '开' : '关');
      draw();
    });

    draw();
    $('rp-note').innerHTML =
      '把这个演示当成一口井的"参数会诊台"：<b>把钻头磨损从 0.2 拖到 0.8</b>，看红圈怎么从右上往左下撤——' +
      '新钻头可以激进，磨到后期必须收着打，这正是纯机理公式给不出来的判断。' +
      '再看<b>排量</b>：它不直接提高 ROP，而是改善井底净化，排量不够时整张曲面一起塌陷（岩屑重复破碎）。' +
      '最后记住那句：现场优化目标从来不是"钻得最快"，而是<b>每米成本最低</b>——' +
      'ROP 提高 20% 而钻头寿命减半，账是亏的。';
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
