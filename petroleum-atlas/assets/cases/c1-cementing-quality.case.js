/* =========================================================
   c1-cementing-quality · 案例插件（由 _build/build.mjs 自动生成，勿手改）
   源头是案例包 cementing-quality-case/source.js + demo/，改内容请改源头后重新构建。
   ========================================================= */
(function () {
  var DEF = {"id":"c1-cementing-quality","sceneId":"c1","title":"固井质量智能评价：CBL 之外，还得看 VDL 那张图","status":"ready","version":"1.0.0","updated":"2026-10-26","tabs":{"background":{"label":"专业背景","lede":"固井是\"一次性\"的工程：水泥浆泵进去、候凝、然后就再也摸不着了。它封隔得好不好，决定了这口井会不会层间窜、会不会环空带压。评价手段是声波测井——CBL 声幅曲线给一个数，VDL 变密度图给一张图。一个数加一张图，要靠人把套管波、地层波、泥浆波三条波列分开看。","judge":[{"label":"任务类型","value":"图像 + 曲线联合判读","desc":"分段输出，非整井一结论"},{"label":"数据门槛","value":"≥ 60 井次且有验证","desc":"试油或挤水泥结果"},{"label":"可见收益","value":"40 min/井 → 6 min/井","desc":"且减少漏判窜槽"},{"label":"难度","value":"中","html":"<span class=\"dtag\" data-d=\"中\">难度 中</span>"}],"sections":[{"no":1,"en":"PROBLEM","title":"当前做法与问题","html":"<p>声波测井的道理很直白：套管波沿套管传播，能量耦合进水泥环的越少、传回来的越强，说明<b>一界面（套管—水泥）胶结越差</b>；地层波穿过水泥环到达地层，条纹越清晰，说明<b>二界面（水泥—地层）胶结越好</b>。CBL 给的是首波幅度一个数，VDL 给的是整条波列的黑白条纹图。</p><p>问题在于<b>首波不一定是套管波</b>。在\"快速地层\"（地层声速高于套管声速，多见于致密灰岩、硬石膏）里，地层波会抢在套管波前面到达，CBL 记到的是地层波的幅度——声幅偏低，看起来胶结极好，实际一塌糊涂。这是固井评价里最经典的一个坑，也是每年都要付出代价的坑。</p><div class=\"figure\"><svg viewBox=\"0 0 640 208\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"快速地层导致CBL误判\"><g font-size=\"10.5\"><text x=\"20\" y=\"16\" fill=\"#79828a\">同样一口井，套管波与地层波谁先到，决定了 CBL 记的是谁</text><g><rect x=\"34\" y=\"34\" width=\"270\" height=\"150\" rx=\"8\" fill=\"#fdfcf9\" stroke=\"#c9c2b0\"/><text x=\"48\" y=\"52\" fill=\"#31527a\" font-weight=\"700\">常规地层（地层波晚到）</text><line x1=\"48\" y1=\"78\" x2=\"290\" y2=\"78\" stroke=\"#efece1\"/><path d=\"M56 78 q6 -22 12 0 q6 20 12 0 q6 -16 12 0 q6 12 12 0 q6 -8 12 0\" fill=\"none\" stroke=\"#41699b\" stroke-width=\"1.6\"/><text x=\"60\" y=\"100\" font-size=\"9\" fill=\"#41699b\">套管波（先到 · 强）</text><path d=\"M168 78 q6 -14 12 0 q6 12 12 0 q6 -9 12 0 q6 7 12 0\" fill=\"none\" stroke=\"#b26a39\" stroke-width=\"1.6\"/><text x=\"172\" y=\"100\" font-size=\"9\" fill=\"#b26a39\">地层波（后到 · 弱）</text><rect x=\"48\" y=\"112\" width=\"242\" height=\"26\" rx=\"6\" fill=\"#f9e9e5\"/><text x=\"60\" y=\"130\" font-size=\"10.5\" fill=\"#b05a51\">CBL 记到套管波 68% → 判\"胶结差\"，结论正确</text><text x=\"60\" y=\"146\" font-size=\"9.5\" fill=\"#79828a\">一界面确实没胶结好</text><rect x=\"48\" y=\"150\" width=\"242\" height=\"24\" rx=\"6\" fill=\"#e7f3ea\"/><text x=\"60\" y=\"167\" font-size=\"10.5\" fill=\"#3f8560\">与 VDL 判读一致 → 决策：挤水泥</text></g><g><rect x=\"336\" y=\"34\" width=\"270\" height=\"150\" rx=\"8\" fill=\"#fdfcf9\" stroke=\"#c9c2b0\"/><text x=\"350\" y=\"52\" fill=\"#9c4a42\" font-weight=\"700\">快速地层（地层波抢先）</text><line x1=\"350\" y1=\"78\" x2=\"592\" y2=\"78\" stroke=\"#efece1\"/><path d=\"M358 78 q6 -14 12 0 q6 12 12 0 q6 -9 12 0 q6 7 12 0\" fill=\"none\" stroke=\"#b26a39\" stroke-width=\"1.6\"/><text x=\"362\" y=\"100\" font-size=\"9\" fill=\"#b26a39\">地层波（先到）</text><path d=\"M470 78 q6 -22 12 0 q6 20 12 0 q6 -16 12 0 q6 12 12 0\" fill=\"none\" stroke=\"#41699b\" stroke-width=\"1.6\"/><text x=\"474\" y=\"100\" font-size=\"9\" fill=\"#41699b\">套管波（后到 · 仍很强）</text><rect x=\"350\" y=\"112\" width=\"242\" height=\"26\" rx=\"6\" fill=\"#f9efd7\"/><text x=\"362\" y=\"130\" font-size=\"10.5\" fill=\"#8e5229\">CBL 记到地层波 14% → 判\"胶结优\"，结论错误</text><text x=\"362\" y=\"146\" font-size=\"9.5\" fill=\"#79828a\">VDL 上套管波条纹又黑又直</text><rect x=\"350\" y=\"150\" width=\"242\" height=\"24\" rx=\"6\" fill=\"#f9e9e5\"/><text x=\"362\" y=\"167\" font-size=\"10.5\" fill=\"#b05a51\">漏判窜槽 → 投产层间窜、环空带压</text></g><text x=\"320\" y=\"200\" text-anchor=\"middle\" fill=\"#79828a\">同一个\"声幅低\"的数字，在两种地层里含义完全相反</text></g></svg></div><div class=\"figcap\"><b>图 1</b><span>只看 CBL 一条曲线，等于只听第一声。<b>快速地层下这个\"第一声\"换了人，结论就反了</b>——必须把 VDL 的整条波列看进去。</span></div>"},{"no":2,"en":"INTERVENTION","title":"AI 能做什么","html":"<p>把 VDL 当成图像、把 CBL 当成曲线，用双通道网络做<b>分段</b>评价：每一小段（如 1.5 m）输出一界面胶结率、二界面胶结率、胶结指数 BI 与质量分级。图像分支看的是\"套管波条纹有多黑、地层波条纹有多清晰、到达时间对不对\"，曲线分支看的是幅度水平。</p><p>必须交代的两个工程判断。<b>第一，输出必须是分段的</b>：整段平均 BI 会把一段 8 m 的窜槽彻底抹掉，而窜槽恰恰是唯一会导致报废的缺陷。第二，<b>微环（microannulus）不是缺陷</b>——它是套管内压力变化后套管弹性回缩造成的微米级环隙，加压后会闭合。模型如果只学\"有缝=差\"，会在微环上大量误报。<b>必须把\"加压/未加压\"作为条件输入，或让模型分别给出两种状态。</b></p><div class=\"figure\"><svg viewBox=\"0 0 640 172\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"双通道评价模型\"><g font-size=\"11\" font-weight=\"700\" text-anchor=\"middle\"><rect x=\"18\" y=\"46\" width=\"118\" height=\"52\" rx=\"9\" fill=\"#e7eef9\" stroke=\"#41699b\"/><text x=\"77\" y=\"68\" fill=\"#31527a\">VDL 变密度图</text><text x=\"77\" y=\"85\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">图像分支 CNN</text><rect x=\"154\" y=\"46\" width=\"108\" height=\"52\" rx=\"9\" fill=\"#f1f1dd\" stroke=\"#767a2e\"/><text x=\"208\" y=\"68\" fill=\"#5d6022\">融合</text><text x=\"208\" y=\"85\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">分段 1.5 m</text><rect x=\"280\" y=\"46\" width=\"126\" height=\"52\" rx=\"9\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\"/><text x=\"343\" y=\"68\" fill=\"#235f51\">一/二界面胶结率</text><text x=\"343\" y=\"85\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">+ 胶结指数 BI</text><rect x=\"424\" y=\"46\" width=\"100\" height=\"52\" rx=\"9\" fill=\"#f8ecdf\" stroke=\"#b26a39\"/><text x=\"474\" y=\"68\" fill=\"#8e5229\">窜槽检测</text><text x=\"474\" y=\"85\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">局部异常段</text><rect x=\"542\" y=\"46\" width=\"80\" height=\"52\" rx=\"9\" fill=\"#f9e9e5\" stroke=\"#b05a51\"/><text x=\"582\" y=\"68\" fill=\"#9c4a42\">处置建议</text><text x=\"582\" y=\"85\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">挤 / 观察</text></g><rect x=\"18\" y=\"92\" width=\"118\" height=\"52\" rx=\"9\" fill=\"#fdfcf9\" stroke=\"#c9c2b0\"/><text x=\"77\" y=\"114\" fill=\"#4d565b\">CBL 声幅曲线</text><text x=\"77\" y=\"131\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">曲线分支 1D</text><g stroke=\"#9ba3a9\" stroke-width=\"1.4\"><path d=\"M136 72 h14\" marker-end=\"url(#c1a)\"/><path d=\"M136 118 L152 96\" marker-end=\"url(#c1a)\"/><path d=\"M262 72 h14\" marker-end=\"url(#c1a)\"/><path d=\"M406 72 h14\" marker-end=\"url(#c1a)\"/><path d=\"M524 72 h14\" marker-end=\"url(#c1a)\"/></g><defs><marker id=\"c1a\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#9ba3a9\"/></marker></defs><text x=\"320\" y=\"164\" font-size=\"10.5\" fill=\"#79828a\" text-anchor=\"middle\">条件输入：候凝时间、水泥浆体系、套管程序、井径、是否加压（微环判别的关键）</text></svg></div><div class=\"figcap\"><b>图 2</b><span>图像分支负责\"看出 CBL 看不出的东西\"，曲线分支负责定量。<b>两个分支不一致时（如快速地层），以图像分支为准</b>——这条规则要写进模型，而不是留给现场判断。</span></div>"},{"no":3,"en":"DATA","title":"你需要准备什么","html":"<p style=\"margin-bottom:14px\">这个场景的标签最难得：<b>\"胶结质量\"没有直接测量值</b>，只能靠后续验证反推。所以清单里后两项是决定成败的。</p><div class=\"checklist\"><div class=\"cl-head\"><span>数据准备清单 · 5 项</span><span class=\"cl-prog\"><span id=\"cl-txt\">0 / 5</span><span class=\"cl-bar\"><i id=\"cl-fill\"></i></span></span></div><div class=\"cl-item\" data-cl=\"0\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">CBL / VDL 原始资料</span><span class=\"cl-s\">声幅曲线 + 变密度波列</span></span><span class=\"cl-n\">要原始波列，不要只存图</span></div><div class=\"cl-item\" data-cl=\"1\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">固井施工记录</span><span class=\"cl-s\">水泥浆体系、密度、顶替排量与返高</span></span><span class=\"cl-n\">解释\"为什么这段差\"的依据</span></div><div class=\"cl-item\" data-cl=\"2\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">井身结构与井径</span><span class=\"cl-s\">套管程序、井径曲线、扶正器位置</span></span><span class=\"cl-n\">偏心与扩径会干扰解释</span></div><div class=\"cl-item\" data-cl=\"3\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">试油与生产验证</span><span class=\"cl-s\">是否层间窜、是否环空带压</span></span><span class=\"cl-n\">唯一可靠的金标准</span></div><div class=\"cl-item\" data-cl=\"4\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">挤水泥作业记录</span><span class=\"cl-s\">挤入量、压力、是否成功</span></span><span class=\"cl-n\">反向验证模型判断</span></div></div>"},{"no":4,"en":"DIFFICULTY","title":"技术难度与参考方向","html":"<div style=\"display:flex;align-items:center;gap:14px;flex-wrap:wrap\"><span class=\"dtag\" data-d=\"中\">难度 中</span><span class=\"small muted\">网络不复杂，难点在标签稀缺、分段粒度与微环这类\"似是而非\"的判读。</span></div><div class=\"meter\"><i class=\"on\"></i><i class=\"on\"></i><i></i></div><p>建议不要一上来就做端到端分类。更稳的路径是<b>先让模型输出连续的\"胶结指数\"，分级留给规则与人</b>：BI 是连续量，可以直接和声幅、地层波能量对账；而\"优/良/中/差\"的分级标准各油田不一样，写死在模型里反而难推广。</p><p>另一个提醒：<b>先做\"快速地层\"识别这个小任务</b>。它是一个干净的二分类（地层波是否早于套管波到达），标签可以从声波时差曲线直接得到，不需要人工标注。把这个做准，主模型的最大误差源就消除了。</p><p style=\"margin-top:18px\"><span class=\"kicker plain\" style=\"color:var(--ink-4)\">可借鉴的通用技术</span></p><div class=\"refs\"><a class=\"ref\" href=\"#/method/cv\">图像 + 曲线多模态<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/ts\">一维曲线分支<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/cv\">弱标签与分段监督<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/cv\">异常段检测<span class=\"ar\">↗</span></a></div>"}]},"workflow":{"label":"案例流程","title":"案例：某区块 180 口井的固井质量复查","lead":["某气田 180 口井，套管程序为 244.5 mm + 139.7 mm 双层，评价井段平均 1400 m，历史判读 40 min/井，且发生过 3 起因漏判窜槽导致的层间窜。","目标：判读提速到 10 min 内，窜槽漏判率降到 1% 以下，且微环不再被误判为缺陷。"],"stats":[["复查井数","180 口"],["评价井段","1400 m/井"],["判读耗时","6 min/井"],["决策一致率","91%"]],"steps":[{"name":"波列资料齐套与分段","role":"数据","do":"把 20 年间的 CBL/VDL 统一到同一深度基准与采样率，按 1.5 m 切段；同时把固井施工记录（水泥浆体系、顶替排量、返高）按段挂上去。","effect":"可评价段 21.6 万个，其中 3.1 万个有试油或挤水泥验证，构成金标准集。","trap":"老资料里 VDL 只有打印图没有数字波列——这部分要么放弃，要么做图像扫描 + 数字化，别把它当\"有资料\"。","fig":"<svg viewBox=\"0 0 560 88\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"资料分段\"><g font-size=\"10\"><g text-anchor=\"middle\"><rect x=\"18\" y=\"20\" width=\"122\" height=\"44\" rx=\"8\" fill=\"#e7eef9\" stroke=\"#41699b\" stroke-opacity=\".5\"/><text x=\"79\" y=\"38\" fill=\"#31527a\" font-weight=\"700\">180 井次</text><text x=\"79\" y=\"53\" fill=\"#9ba3a9\">跨 20 年三套仪器</text><rect x=\"156\" y=\"20\" width=\"122\" height=\"44\" rx=\"8\" fill=\"#f9efd7\" stroke=\"#a97a1c\" stroke-opacity=\".5\"/><text x=\"217\" y=\"38\" fill=\"#8e5229\" font-weight=\"700\">统一基准</text><text x=\"217\" y=\"53\" fill=\"#9ba3a9\">深度 + 采样率</text><rect x=\"294\" y=\"20\" width=\"122\" height=\"44\" rx=\"8\" fill=\"#f1f1dd\" stroke=\"#767a2e\" stroke-opacity=\".5\"/><text x=\"355\" y=\"38\" fill=\"#5d6022\" font-weight=\"700\">1.5 m 切段</text><text x=\"355\" y=\"53\" fill=\"#9ba3a9\">挂施工参数</text><rect x=\"432\" y=\"20\" width=\"110\" height=\"44\" rx=\"8\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\" stroke-opacity=\".5\"/><text x=\"487\" y=\"38\" fill=\"#235f51\" font-weight=\"700\">3.1 万有验证</text><text x=\"487\" y=\"53\" fill=\"#9ba3a9\">金标准</text></g><g stroke=\"#9ba3a9\" stroke-width=\"1.2\"><path d=\"M140 42 h12\" marker-end=\"url(#c1b)\"/><path d=\"M278 42 h12\" marker-end=\"url(#c1b)\"/><path d=\"M416 42 h12\" marker-end=\"url(#c1b)\"/></g></g><defs><marker id=\"c1b\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#9ba3a9\"/></marker></defs></svg>"},{"name":"快速地层预识别","role":"工程","do":"用声波时差曲线判\"地层声速是否高于套管声速\"，把全井段标成快速/常规两类；这是一个不需要人工标签的二分类子任务。","effect":"180 口井中 27 口含快速地层段（15%），这些井的 CBL 单独判读准确率只有 0.58，标记后交给 VDL 分支判读，升到 0.89。","trap":"别用\"地层岩性=灰岩\"直接推断快速地层——孔隙度与含气性会显著改变声速，必须用实测时差。","fig":"<svg viewBox=\"0 0 560 90\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"快速地层识别效果\"><g font-size=\"10\"><text x=\"18\" y=\"20\" fill=\"#79828a\">CBL 单独判读准确率（按是否快速地层分桶）：</text><rect x=\"270\" y=\"10\" width=\"164\" height=\"13\" rx=\"6\" fill=\"#2f7d6b\"/><text x=\"440\" y=\"20\" fill=\"#235f51\">常规段 0.91</text><rect x=\"270\" y=\"30\" width=\"104\" height=\"13\" rx=\"6\" fill=\"#b05a51\" opacity=\".75\"/><text x=\"380\" y=\"40\" fill=\"#b05a51\">快速地层段 0.58</text><text x=\"18\" y=\"62\" fill=\"#79828a\">标记后交给 VDL 分支：</text><rect x=\"270\" y=\"52\" width=\"160\" height=\"13\" rx=\"6\" fill=\"#2f7d6b\"/><text x=\"436\" y=\"62\" fill=\"#235f51\">快速地层段 0.89</text><text x=\"150\" y=\"80\" fill=\"#8e5229\">27 / 180 口井含快速地层段（15%）</text></g></svg>"},{"name":"双通道模型训练","role":"算法","do":"VDL 图像分支用轻 CNN，CBL 曲线分支用 1D 卷积，融合后输出连续 BI；训练目标用\"试油/挤水泥验证\"反推的胶结率，按段加权（窜槽段权重 5×）。","effect":"BI 与验证胶结率的相关系数 0.86；窜槽段召回 0.93，误报率 4.2%。","trap":"训练标签来自\"是否发生窜\"这类后果性验证，是弱标签且高度不均衡——窜槽段只占 5%，必须加权，否则模型学会\"全判良好\"就有 95% 准确率。","fig":"<svg viewBox=\"0 0 560 92\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"标签不均衡与加权\"><g font-size=\"10\"><text x=\"18\" y=\"20\" fill=\"#79828a\">验证标签分布（按段）：</text><rect x=\"180\" y=\"10\" width=\"330\" height=\"13\" rx=\"6\" fill=\"#c9c2b0\"/><text x=\"516\" y=\"20\" fill=\"#79828a\">良好/可接受 82%</text><rect x=\"180\" y=\"30\" width=\"46\" height=\"13\" rx=\"6\" fill=\"#b26a39\" opacity=\".8\"/><text x=\"232\" y=\"40\" fill=\"#8e5229\">中等 11%</text><rect x=\"180\" y=\"50\" width=\"22\" height=\"13\" rx=\"6\" fill=\"#b05a51\"/><text x=\"208\" y=\"60\" fill=\"#b05a51\">窜槽 5%（权重 5×）</text><text x=\"18\" y=\"84\" fill=\"#235f51\" font-weight=\"700\">加权后：窜槽召回 0.93 · 误报 4.2%</text></g></svg>"},{"name":"分段输出与微环分流","role":"质控","do":"不输出整井结论，只输出逐段 BI 与窜槽标记；对\"声幅偏高但套管波到达时间正常、加压后幅度回落\"的段单独标为\"疑似微环\"，进人工确认队列而不判为缺陷。","effect":"微环误报从 46 段降到 5 段；现场因\"误判缺陷\"做的无效挤水泥作业减少 11 井次。","trap":"微环的判据要靠\"加压前后对比\"，只在做过加压复测的井上成立。没复测的井不能凭空判微环，只能标\"不确定\"。","fig":"<svg viewBox=\"0 0 560 94\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"微环分流\"><g font-size=\"10\"><text x=\"18\" y=\"20\" fill=\"#79828a\">声幅偏高 ≠ 缺陷，先问一句\"是不是微环\"：</text><rect x=\"270\" y=\"10\" width=\"150\" height=\"13\" rx=\"6\" fill=\"#b05a51\" opacity=\".8\"/><text x=\"426\" y=\"20\" fill=\"#b05a51\">原：46 段判为缺陷</text><rect x=\"270\" y=\"30\" width=\"126\" height=\"13\" rx=\"6\" fill=\"#2f7d6b\"/><text x=\"402\" y=\"40\" fill=\"#235f51\">加压后回落 → 微环 41 段</text><rect x=\"270\" y=\"50\" width=\"16\" height=\"13\" rx=\"6\" fill=\"#b05a51\"/><text x=\"292\" y=\"60\" fill=\"#b05a51\">真缺陷 5 段（需挤水泥）</text><text x=\"18\" y=\"84\" fill=\"#8e5229\">节省：无效挤水泥 11 井次</text></g></svg>"},{"name":"试油验证闭环","role":"人工","do":"每口井试油或投产后，把\"是否层间窜、是否环空带压\"回写到对应段；每季度用新增验证集回测，并把漏判段单独复盘。","effect":"三轮迭代后窜槽漏判率从 8.3% 降到 0.7%，未再发生层间窜事故。","trap":"验证是有偏的——只有\"被怀疑有问题\"的段才会被重点验证，正常段很少被证实。要按模型置信度分层抽样做主动验证，否则验证集永远是难例。"}],"metrics":{"title":"怎么算「做对了」","html":"<p>固井评价的代价函数是<b>严重不对称</b>的：漏判一段窜槽，可能导致层间窜、环空带压，最坏要报废；而误判一段好水泥为缺陷，只是多挤一次水泥的钱。</p><div style=\"margin:10px 0 6px\"><svg viewBox=\"0 0 640 126\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"不对称代价\"><g font-size=\"10.5\"><g><rect x=\"30\" y=\"16\" width=\"180\" height=\"26\" rx=\"4\" fill=\"#f5f2ea\"/><text x=\"42\" y=\"34\" fill=\"#79828a\">判断结果</text><rect x=\"216\" y=\"16\" width=\"150\" height=\"26\" rx=\"4\" fill=\"#f5f2ea\"/><text x=\"291\" y=\"34\" text-anchor=\"middle\" fill=\"#79828a\">占比</text><rect x=\"372\" y=\"16\" width=\"238\" height=\"26\" rx=\"4\" fill=\"#f5f2ea\"/><text x=\"491\" y=\"34\" text-anchor=\"middle\" fill=\"#79828a\">代价</text></g><g><rect x=\"30\" y=\"46\" width=\"180\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"42\" y=\"62\" fill=\"#4d565b\">漏判窜槽（判好，实坏）</text><rect x=\"216\" y=\"46\" width=\"150\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"291\" y=\"62\" text-anchor=\"middle\" fill=\"#b05a51\" font-weight=\"700\">0.7%</text><rect x=\"372\" y=\"46\" width=\"238\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"382\" y=\"62\" fill=\"#b05a51\">层间窜 / 环空带压 / 报废</text></g><g><rect x=\"30\" y=\"74\" width=\"180\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"42\" y=\"90\" fill=\"#4d565b\">误判好水泥为缺陷</text><rect x=\"216\" y=\"74\" width=\"150\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"291\" y=\"90\" text-anchor=\"middle\" fill=\"#b26a39\" font-weight=\"700\">4.2%</text><rect x=\"372\" y=\"74\" width=\"238\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"382\" y=\"90\" fill=\"#8e5229\">多挤一次水泥的钱</text></g><g><rect x=\"30\" y=\"102\" width=\"180\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"42\" y=\"118\" fill=\"#4d565b\">判读耗时</text><rect x=\"216\" y=\"102\" width=\"150\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"291\" y=\"118\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">40 → 6 min</text><rect x=\"372\" y=\"102\" width=\"238\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"382\" y=\"118\" fill=\"#79828a\">人只复核标红段</text></g></g></svg></div><p style=\"margin-top:6px\">读法：这两类错误的比例<b>不应该是 1:1</b>。实际部署时应该主动把阈值往\"宁可多挤\"的方向推一点——误报 4.2% 换来漏判 0.7%，这个交换是划算的。<b>但交换比例要先和作业方谈定，写进验收标准</b>，不能由模型自己决定。</p>"},"fails":[{"name":"只看 CBL 一条曲线","why":"快速地层下首波是地层波，声幅假性偏低，胶结差被判成优。必须把 VDL 波列作为独立通道输入，并在两者冲突时以图像分支为准。"},{"name":"整段平均 BI","why":"一段 8 m 的窜槽被上下好段平均掉，整井 BI 0.82 看起来合格，投产后层间窜。必须分段输出，窜槽按段报警。"},{"name":"把微环当缺陷","why":"套管回缩造成的微米级环隙加压后会闭合，按缺陷处理会多做 11 井次无效挤水泥。要把\"是否加压\"作为条件，并把疑似微环送人工而不是自动判坏。"}]},"demo":{"mode":"module","js":"demo/demo.js","label":"可运行示范","intro":"左侧是 CBL 声幅曲线与 VDL 变密度图，右侧是模型评价结果。选「快速地层」工况并关掉 VDL 判读，就能复现这个行业最经典的误判：声幅很低、结论却是错的。","height":760}}};

  var __mod = { exports: {} };
  (function (module, exports) {
/* 固井质量智能评价 · 交互示范
   合成 CBL 声幅曲线 + VDL 变密度图（套管波/地层波/泥浆波三条波列），
   演示「只看 CBL 会被快速地层骗过，加上 VDL 才能判准」这一行业关键坑。 */
module.exports = {
  mount: function (root, api) {
    var JADE = '#2f7d6b', CLAY = '#b26a39', BAD = '#b05a51',
        OPT = '#41699b', INK3 = '#79828a', INK2 = '#4d565b';

    var NR = 56;                       /* VDL 深度行数 */
    var NT = 92;                       /* 时间列数 */
    var TOP = 2180, BOT = 2320;        /* 评价井段 m */

    var CASES = [
      { n: '胶结良好（双界面均好）', b1: 0.94, b2: 0.90, ch: 0, fast: 0 },
      { n: '一界面微环（套管-水泥有缝）', b1: 0.35, b2: 0.86, ch: 0, fast: 0 },
      { n: '窜槽（泥浆窜槽未顶替干净）', b1: 0.42, b2: 0.55, ch: 1, fast: 0 },
      { n: '顶替不良（混浆段）', b1: 0.62, b2: 0.38, ch: 1, fast: 0 },
      { n: '快速地层（地层波超前干扰）', b1: 0.88, b2: 0.87, ch: 0, fast: 1 },
      { n: '二界面差（水泥-地层胶结差）', b1: 0.92, b2: 0.28, ch: 0, fast: 0 }
    ];

    function noise(i, s) {
      var h = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
      return (h - Math.floor(h)) * 2 - 1;
    }
    function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

    /* ---------- 波列合成 ---------- */
    /* 到达时间：套管波固定 t1；地层波 t2 随深度线性提前（速度越大越早）
       快速地层时 t2 < t1 —— 首波变成地层波，CBL 读数被"骗" */
    function arrivals(depth, fast) {
      var t1 = 26;                                   /* 套管波到达（列） */
      var t2 = fast ? 20 : 52 + (depth - TOP) / (BOT - TOP) * 6;  /* 地层波 */
      return { t1: t1, t2: t2 };
    }
    function waveAt(depth, t, cs, nz, seed) {
      var ar = arrivals(depth, cs.fast);
      /* 套管波：一界面胶结越好越弱 */
      var a1 = (1 - cs.b1) * 0.95 + 0.06;
      /* 地层波：二界面胶结越好越强，且需要穿过水泥环 */
      var a2 = cs.b2 * 0.72 + 0.04;
      /* 泥浆波：恒定弱 */
      var a3 = 0.10 + 0.06 * (1 - cs.b1);
      var v = 0;
      v += a1 * Math.sin((t - ar.t1) * 0.62) * Math.exp(-Math.abs(t - ar.t1) / 26);
      v += a2 * Math.sin((t - ar.t2) * 0.55) * Math.exp(-Math.abs(t - ar.t2) / 15);
      v += a3 * Math.sin((t - 68) * 0.5) * Math.exp(-Math.abs(t - 68) / 20);
      v += noise(depth * 3 + t, seed) * nz * 0.55;
      return clamp(v, -1, 1);
    }
    /* 窜槽：在井段中部留一段未胶结带 */
    function bondAt(depth, cs) {
      if (!cs.ch) return { b1: cs.b1, b2: cs.b2 };
      var mid = (TOP + BOT) / 2;
      var inCh = Math.abs(depth - mid) < 26;
      return inCh ? { b1: 0.18, b2: 0.15 } : { b1: Math.min(0.95, cs.b1 + 0.2), b2: Math.min(0.95, cs.b2 + 0.25) };
    }

    root.innerHTML =
      '<div class="demo">' +
      '<div class="demo-head"><span class="kicker">INTERACTIVE · CBL / VDL CEMENT EVALUATION</span>' +
      '<h3>只看声幅曲线会被骗：把 VDL 也看进去</h3>' +
      '<p>固井质量测井给出两样东西：<b>CBL 声幅曲线</b>（首波幅度，越小胶结越好）和 <b>VDL 变密度图</b>（整条波列的黑白条纹）。' +
      '只看 CBL 时，<b>快速地层</b>会让地层波抢在套管波前面到达，声幅读数假性偏低——看起来胶结极好，其实一塌糊涂。' +
      '选一个工况，看模型怎么靠 VDL 纠正这个判断。</p></div>' +
      '<div class="ctl-row">' +
      '<select id="cq-cs" style="font-size:12px;padding:4px 8px;border:1px solid var(--line-2,#ddd7c8);border-radius:6px;max-width:280px">' +
      CASES.map(function (c, i) { return '<option value="' + i + '">' + c.n + '</option>'; }).join('') +
      '</select>' +
      '<div class="ctl"><label>顶替效率 <output id="cq-od">0.85</output></label><input type="range" id="cq-d" min="0.3" max="1" step="0.05" value="0.85"></div>' +
      '<div class="ctl"><label>噪声 <output id="cq-on">0.20</output></label><input type="range" id="cq-n" min="0" max="0.8" step="0.05" value="0.2"></div>' +
      '<button class="btn-x ghost" id="cq-vdl">VDL 判读：开</button>' +
      '<button class="btn-x" id="cq-run">▶ 模型评价</button>' +
      '</div>' +
      '<div class="grid2" style="grid-template-columns:1.15fr 1fr">' +
      '<div class="card-x"><h4>CBL 声幅曲线 + VDL 变密度图</h4>' +
      '<svg id="cq-v" class="chart" viewBox="0 0 520 400" role="img" aria-label="CBL 与 VDL"></svg>' +
      '<div class="legend"><span><i style="background:#2f2a24"></i>波峰（黑）</span><span><i style="background:#ffffff"></i>波谷（白）</span>' +
      '<span><i style="background:#41699b"></i>套管波到达</span><span><i style="background:#b26a39"></i>地层波到达</span></div></div>' +
      '<div class="card-x"><h4>评价结果</h4>' +
      '<div class="readouts">' +
      '<div class="ro"><span class="k">CBL 首波幅度</span><b id="cq-v1">—</b></div>' +
      '<div class="ro"><span class="k">胶结指数 BI</span><b id="cq-v2">—</b></div>' +
      '<div class="ro"><span class="k">一界面胶结率</span><b id="cq-v3">—</b></div>' +
      '<div class="ro"><span class="k">二界面胶结率</span><b id="cq-v4">—</b></div>' +
      '<div class="ro"><span class="k">质量分级</span><b id="cq-v5">—</b></div>' +
      '<div class="ro"><span class="k">模型置信度</span><b id="cq-v6">—</b></div>' +
      '<div class="ro"><span class="k">单看 CBL 结论</span><b id="cq-v7">—</b></div>' +
      '<div class="ro"><span class="k">处置建议</span><b id="cq-v8">—</b></div>' +
      '</div>' +
      '<div id="cq-why" style="margin-top:12px;font-size:11.5px;line-height:1.75"></div></div>' +
      '</div>' +
      '<p class="note" id="cq-note"></p>' +
      '</div>';

    var $ = function (id) { return root.querySelector('#' + id); };
    var useVdl = true, SEED = 11;

    var W = 520, H = 400, ML = 30, MT = 14, MB = 24;
    var CBLW = 96, GAP = 10;
    var VX = ML + CBLW + GAP, VW = W - VX - 12;
    var HH = H - MT - MB;
    var RH = HH / NR, CW = VW / NT;

    function draw() {
      var ci = +$('cq-cs').value, cs = CASES[ci];
      var disp = +$('cq-d').value, nz = +$('cq-n').value;
      $('cq-od').textContent = disp.toFixed(2);
      $('cq-on').textContent = nz.toFixed(2);

      /* 顶替效率影响整体胶结 */
      var fac = 0.45 + 0.55 * disp;

      /* ---- VDL ---- */
      var s = '';
      var cbl = [];
      for (var r = 0; r < NR; r++) {
        var depth = TOP + (r + 0.5) * (BOT - TOP) / NR;
        var bd = bondAt(depth, cs);
        var b1 = clamp(bd.b1 * fac, 0.05, 0.98), b2 = clamp(bd.b2 * fac, 0.05, 0.98);
        var eff = { b1: b1, b2: b2, ch: cs.ch, fast: cs.fast };
        var rowMax = 0;
        for (var t = 0; t < NT; t++) {
          var v = waveAt(depth, t, eff, nz, SEED);
          var av = Math.abs(v);
          if (t < 40 && av > rowMax) rowMax = av;      /* 首波窗内取最大 */
          var g = Math.round(255 - clamp(av, 0, 1) * 235);
          var cw = CW + 0.7, y = MT + r * RH;
          s += '<rect x="' + (VX + t * CW).toFixed(1) + '" y="' + y.toFixed(1) +
            '" width="' + cw.toFixed(1) + '" height="' + (RH + 0.7).toFixed(1) +
            '" fill="rgb(' + g + ',' + g + ',' + g + ')"/>';
        }
        cbl.push(rowMax);
      }
      /* 到达时间参考线 */
      var a0 = arrivals(TOP, cs.fast), a1 = arrivals(BOT, cs.fast);
      s += '<line x1="' + (VX + a0.t1 * CW) + '" y1="' + MT + '" x2="' + (VX + a1.t1 * CW) + '" y2="' + (MT + HH) +
        '" stroke="#41699b" stroke-width="1.4" stroke-dasharray="4 3" opacity=".8"/>' +
        '<text x="' + (VX + a0.t1 * CW + 3) + '" y="' + (MT + 9) + '" font-size="8.5" fill="#41699b">套管波</text>';
      s += '<line x1="' + (VX + a0.t2 * CW) + '" y1="' + MT + '" x2="' + (VX + a1.t2 * CW) + '" y2="' + (MT + HH) +
        '" stroke="#b26a39" stroke-width="1.4" stroke-dasharray="4 3" opacity=".85"/>' +
        '<text x="' + (VX + a0.t2 * CW + 3) + '" y="' + (MT + HH - 4) + '" font-size="8.5" fill="#b26a39">地层波</text>';
      s += '<rect x="' + VX + '" y="' + MT + '" width="' + VW + '" height="' + HH + '" fill="none" stroke="#c9c2b0"/>' +
        '<text x="' + (VX + VW / 2) + '" y="' + (H - 8) + '" font-size="9.5" fill="' + INK3 + '" text-anchor="middle">时间 →（VDL 变密度）</text>';

      /* ---- CBL 曲线 ---- */
      var d1 = '';
      for (var i = 0; i < NR; i++) {
        var xx = ML + (1 - cbl[i]) * CBLW;
        d1 += (i ? 'L' : 'M') + xx.toFixed(1) + ' ' + (MT + i * RH + RH / 2).toFixed(1) + ' ';
      }
      s += '<rect x="' + ML + '" y="' + MT + '" width="' + CBLW + '" height="' + HH + '" fill="#fdfcf9" stroke="#c9c2b0"/>';
      for (var g2 = 0; g2 <= 4; g2++) {
        var gx = ML + g2 * CBLW / 4;
        s += '<line x1="' + gx + '" y1="' + MT + '" x2="' + gx + '" y2="' + (MT + HH) + '" stroke="#efece1"/>' +
          '<text x="' + gx + '" y="' + (H - 8) + '" font-size="8" fill="' + INK3 + '" text-anchor="middle" font-family="monospace">' + (100 - g2 * 25) + '</text>';
      }
      s += '<text x="' + (ML + CBLW / 2) + '" y="' + (MT - 4) + '" font-size="9.5" fill="' + INK3 + '" text-anchor="middle">CBL（% 相对幅度）</text>' +
        '<path d="' + d1 + '" fill="none" stroke="#2f7d6b" stroke-width="1.8" stroke-linejoin="round"/>';
      for (var dd = TOP; dd <= BOT; dd += 35) {
        var yy = MT + (dd - TOP) / (BOT - TOP) * HH;
        s += '<text x="' + (ML - 4) + '" y="' + (yy + 3) + '" font-size="8.5" fill="' + INK3 + '" text-anchor="end" font-family="monospace">' + dd + '</text>';
      }
      $('cq-v').innerHTML = s;

      /* ---- 模型评价 ---- */
      var sum1 = 0, sum2 = 0, fmSum = 0, cblAvg = 0;
      for (var k = 0; k < NR; k++) {
        var dep = TOP + (k + 0.5) * (BOT - TOP) / NR;
        var bb = bondAt(dep, cs);
        sum1 += clamp(bb.b1 * fac, 0, 1); sum2 += clamp(bb.b2 * fac, 0, 1);
        cblAvg += cbl[k];
        /* VDL 里的地层波清晰度：地层波到达窗内的能量 */
        var e = bondAt(dep, cs), eff2 = { b1: clamp(e.b1 * fac, 0, 1), b2: clamp(e.b2 * fac, 0, 1), ch: cs.ch, fast: cs.fast };
        var ar = arrivals(dep, cs.fast), fm = 0;
        for (var t2 = Math.round(ar.t2); t2 < Math.min(NT, ar.t2 + 14); t2++) fm += Math.abs(waveAt(dep, t2, eff2, nz, SEED));
        fmSum += fm / 14;
      }
      var m1 = sum1 / NR, m2 = sum2 / NR, fmQ = fmSum / NR, cblM = cblAvg / NR;
      var cblPct = clamp(cblM * 100, 0, 100);
      /* 只看 CBL：幅度越低越"好" */
      var cblOnly = cblPct < 20 ? '优' : (cblPct < 40 ? '中' : '差');
      /* 模型：CBL + VDL 地层波清晰度联合判断 */
      var bi = clamp(0.42 * (1 - cblM) + 0.58 * clamp(fmQ * 1.9, 0, 1), 0, 1);
      if (!useVdl) bi = clamp(1 - cblM * 1.15, 0, 1);
      var grade = bi > 0.8 ? '优' : bi > 0.6 ? '良' : bi > 0.4 ? '中' : '差';
      var conf = clamp(0.95 - nz * 0.55 - (cs.fast ? 0.12 : 0) - (cs.ch ? 0.08 : 0), 0.35, 0.99);
      var act = bi > 0.8 ? '无需处理' : bi > 0.6 ? '观察，射孔前复测' : bi > 0.4 ? '挤水泥（段内）' : '必须挤水泥 / 补救';

      $('cq-v1').textContent = cblPct.toFixed(0) + ' %';
      $('cq-v1').className = cblPct < 20 ? 'ok' : (cblPct < 40 ? 'warn' : 'bad');
      $('cq-v2').textContent = bi.toFixed(2);
      $('cq-v3').textContent = Math.round(m1 * 100) + ' %';
      $('cq-v3').className = m1 > 0.8 ? 'ok' : (m1 > 0.5 ? 'warn' : 'bad');
      $('cq-v4').textContent = Math.round(m2 * 100) + ' %';
      $('cq-v4').className = m2 > 0.8 ? 'ok' : (m2 > 0.5 ? 'warn' : 'bad');
      $('cq-v5').textContent = grade;
      $('cq-v5').className = bi > 0.8 ? 'ok' : (bi > 0.6 ? '' : 'bad');
      $('cq-v6').textContent = Math.round(conf * 100) + ' %';
      $('cq-v7').textContent = cblOnly;
      $('cq-v7').className = cblOnly === '优' ? 'ok' : (cblOnly === '中' ? 'warn' : 'bad');
      $('cq-v8').textContent = act;
      $('cq-v8').className = bi > 0.6 ? 'ok' : 'bad';

      var why = [];
      if (cs.fast) {
        why.push('<b style="color:' + BAD + '">这就是快速地层陷阱</b>：地层波到达时间（' + Math.round(a0.t2) + ' 列）' +
          '早于套管波（' + a0.t1 + ' 列），首波其实是地层波。CBL 只有 <b>' + cblPct.toFixed(0) + '%</b>，' +
          '按老办法判"胶结优"，但 VDL 上地层波条纹稀疏——说明水泥环并未把声能好好耦合到地层。');
        why.push('关掉 <b>VDL 判读</b>再看一次：BI 会跳到 ' + clamp(1 - cblM * 1.15, 0, 1).toFixed(2) +
          '，处置建议变成"无需处理"。<b>现场漏判窜槽，往往就是这么发生的。</b>');
      } else if (cs.ch) {
        why.push('窜槽段在井段中部：那一带 VDL 上套管波条纹又黑又直（声能沿套管跑，没传进水泥环），' +
          'CBL 幅度整段抬高。<b>注意评价要分段给结论</b>——整段平均 BI ' + bi.toFixed(2) + ' 会掩盖中部的坏段。');
      } else {
        why.push('当前工况下 CBL 与 VDL 结论一致：首波幅度 ' + cblPct.toFixed(0) + '%，' +
          'VDL 上地层波条纹' + (fmQ > 0.42 ? '清晰连续' : '弱而断续') + '，两者互相印证，模型置信度较高。');
        why.push('把 <b>顶替效率</b>拖低：一、二界面胶结率同时下降，但<b>下降速度不同</b>——' +
          '顶替不良先伤二界面（水泥-地层），微环先伤一界面（套管-水泥）。看两个百分数谁掉得更快。');
      }
      if (nz > 0.5) why.push('<b style="color:' + CLAY + '">噪声已偏大</b>：VDL 条纹被打散，模型置信度掉到 ' +
        Math.round(conf * 100) + '%，这种资料应当要求重测或换仪器。');
      $('cq-why').innerHTML = why.join('<br><br>');
    }

    ['cq-cs', 'cq-d', 'cq-n'].forEach(function (id) {
      $(id).addEventListener('input', draw);
      $(id).addEventListener('change', draw);
    });
    $('cq-vdl').addEventListener('click', function () {
      useVdl = !useVdl;
      $('cq-vdl').textContent = 'VDL 判读：' + (useVdl ? '开' : '关');
      draw();
    });
    $('cq-run').addEventListener('click', function () { SEED = (SEED * 1103515245 + 12345) >>> 0; draw(); });

    draw();
    $('cq-note').innerHTML =
      '把这个演示当成固井评价的"双证据"练习：<b>CBL 是一条数，VDL 是一张图</b>。' +
      '数字会骗人（快速地层、仪器偏心、泥浆气侵都会让声幅假性偏低），而图上套管波与地层波的<b>到达时间和条纹强度</b>不会同时骗人。' +
      '所以模型必须吃 VDL 而不只是 CBL——这也是为什么这个场景用"图像 + 曲线"双通道，而不是单看一条曲线。' +
      '最后记住：固井评价的结论<b>必须分段给</b>，整段平均会把局部窜槽抹掉。';
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
