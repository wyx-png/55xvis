/* =========================================================
   wo3-casing-damage · 案例插件（由 _build/build.mjs 自动生成，勿手改）
   源头是案例包 casing-damage-case/source.js + demo/，改内容请改源头后重新构建。
   ========================================================= */
(function () {
  var DEF = {"id":"wo3-casing-damage","sceneId":"wo3","title":"套管损伤智能识别：井径看形状，电磁看壁厚","status":"ready","version":"1.0.0","updated":"2026-10-26","tabs":{"background":{"label":"专业背景","lede":"套管是油井的骨架。它埋在水泥环后面、地层中间，几十年承受着腐蚀、地层蠕变、压裂压力和注水冲刷。发现问题靠测井：机械多臂井径（MIT）量内径变化，电磁探伤/壁厚仪（MTT 一类）量金属还剩多少。工程师拿到的是一张\"深度 × 方位\"的展开图，要在上面找出哪一段坏了、坏成什么样、还能不能继续用。","judge":[{"label":"任务类型","value":"展开图异常分割 + 分级","desc":"多通道融合"},{"label":"数据门槛","value":"≥ 80 井次且含修井验证","desc":"标签靠修井证实"},{"label":"可见收益","value":"漏检率 8.7% → 1.2%","desc":"提前安排修井"},{"label":"难度","value":"中","html":"<span class=\"dtag\" data-d=\"中\">难度 中</span>"}],"sections":[{"no":1,"en":"PROBLEM","title":"当前做法与问题","html":"<p>工程师看的是两张图：井径展开图上，缩径处颜色变深；电磁展开图上，壁厚损失处颜色变深。判读要点是\"有没有、在哪一段、多严重、要不要修\"。<b>这件事难在两处：一是测井本身有盲区，二是判读高度依赖经验。</b></p><p>盲区是物理性的：机械井径只对\"内径变了\"有反应，电磁只对\"金属少了\"有反应。<b>而套管损伤里最贵的那几类——均匀腐蚀、点蚀穿孔——恰恰是形状基本不变、金属悄悄变少的类型。</b>只测井径的井，会完全看不见它们，直到某天突然穿孔、出砂、环空窜。</p><div class=\"figure\"><svg viewBox=\"0 0 640 216\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"两类损伤在两种仪器上的可见性\"><g font-size=\"10.5\"><text x=\"20\" y=\"16\" fill=\"#79828a\">同一段套管，两类损伤，两台仪器的反应完全不同</text><g><rect x=\"30\" y=\"30\" width=\"280\" height=\"166\" rx=\"8\" fill=\"#fdfcf9\" stroke=\"#c9c2b0\"/><text x=\"46\" y=\"50\" fill=\"#31527a\" font-weight=\"700\">① 套管变形（挤毁缩径）</text><rect x=\"46\" y=\"60\" width=\"248\" height=\"40\" rx=\"6\" fill=\"#efece1\"/><g><rect x=\"60\" y=\"68\" width=\"20\" height=\"24\" fill=\"#e8dfc8\"/><rect x=\"84\" y=\"68\" width=\"20\" height=\"24\" fill=\"#d8c7a0\"/><rect x=\"108\" y=\"68\" width=\"20\" height=\"24\" fill=\"#b8916b\"/><rect x=\"132\" y=\"68\" width=\"20\" height=\"24\" fill=\"#9c6f4e\"/><rect x=\"156\" y=\"68\" width=\"20\" height=\"24\" fill=\"#9c6f4e\"/><rect x=\"180\" y=\"68\" width=\"20\" height=\"24\" fill=\"#b8916b\"/><rect x=\"204\" y=\"68\" width=\"20\" height=\"24\" fill=\"#d8c7a0\"/><rect x=\"228\" y=\"68\" width=\"20\" height=\"24\" fill=\"#e8dfc8\"/></g><text x=\"56\" y=\"118\" font-size=\"9.5\" fill=\"#41699b\">井径：明显看到缩径</text><rect x=\"46\" y=\"124\" width=\"248\" height=\"40\" rx=\"6\" fill=\"#f4f2ec\"/><text x=\"170\" y=\"149\" font-size=\"9.5\" fill=\"#79828a\" text-anchor=\"middle\">电磁：几乎无反应（金属还在）</text><text x=\"46\" y=\"182\" font-size=\"10.5\" fill=\"#3f8560\">结论：两台里任一台都能抓到 → 不容易漏</text></g><g><rect x=\"330\" y=\"30\" width=\"280\" height=\"166\" rx=\"8\" fill=\"#fdfcf9\" stroke=\"#c9c2b0\"/><text x=\"346\" y=\"50\" fill=\"#9c4a42\" font-weight=\"700\">② 均匀腐蚀 / 点蚀（壁厚减薄）</text><rect x=\"346\" y=\"60\" width=\"248\" height=\"40\" rx=\"6\" fill=\"#f4f2ec\"/><text x=\"470\" y=\"85\" font-size=\"9.5\" fill=\"#79828a\" text-anchor=\"middle\">井径：内径没变，看不出来</text><rect x=\"346\" y=\"124\" width=\"248\" height=\"40\" rx=\"6\" fill=\"#efece1\"/><g><rect x=\"360\" y=\"132\" width=\"20\" height=\"24\" fill=\"#b06a5a\"/><rect x=\"384\" y=\"132\" width=\"20\" height=\"24\" fill=\"#96543f\"/><rect x=\"408\" y=\"132\" width=\"20\" height=\"24\" fill=\"#7d3f2a\"/><rect x=\"432\" y=\"132\" width=\"20\" height=\"24\" fill=\"#7d3f2a\"/><rect x=\"456\" y=\"132\" width=\"20\" height=\"24\" fill=\"#7d3f2a\"/><rect x=\"480\" y=\"132\" width=\"20\" height=\"24\" fill=\"#96543f\"/><rect x=\"504\" y=\"132\" width=\"20\" height=\"24\" fill=\"#b06a5a\"/><rect x=\"528\" y=\"132\" width=\"20\" height=\"24\" fill=\"#c98a72\"/></g><text x=\"356\" y=\"118\" font-size=\"9.5\" fill=\"#b05a51\">电磁：壁厚损失清清楚楚</text><text x=\"346\" y=\"182\" font-size=\"10.5\" fill=\"#b05a51\">结论：只测井径 → 100% 漏检，直到穿孔</text></g></g></svg></div><div class=\"figcap\"><b>图 1</b><span>测量通道决定了你能看见什么。<b>套管损伤里最贵的那几类，恰恰是机械井径看不见的类型</b>——这是必须上电磁通道的物理理由，不是\"多测一项更保险\"。</span></div>"},{"no":2,"en":"INTERVENTION","title":"AI 能做什么","html":"<p>把展开图当作图像（深度 × 方位的二维网格），用分割网络或异常检测模型输出\"每一格是否异常\"，再沿深度聚合成损伤段，最后对每段做<b>类型分类</b>（腐蚀 / 变形 / 穿孔 / 错断）与<b>剩余强度回归</b>。两个通道各自编码后融合。</p><p>必须讲清楚的关键判断：<b>这个任务的代价是严重不对称的</b>。把重伤判成轻伤，后果是套管突然失效、井报废、甚至环空带压到地面；把轻伤判成重伤，后果只是多下一次工具、多花几天。<b>所以阈值不能按 F1 最高来定，要按\"漏检代价 / 误报代价\"的比值往保守方向推。</b></p><div class=\"figure\"><svg viewBox=\"0 0 640 172\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"代价不对称与阈值选择\"><g font-size=\"10.5\"><text x=\"20\" y=\"16\" fill=\"#79828a\">同一条 ROC 曲线，代价不对称时最优点位置完全不同</text><line x1=\"70\" y1=\"150\" x2=\"600\" y2=\"150\" stroke=\"#ddd7c8\"/><line x1=\"70\" y1=\"150\" x2=\"70\" y2=\"30\" stroke=\"#ddd7c8\"/><text x=\"335\" y=\"166\" text-anchor=\"middle\" fill=\"#79828a\">误报率（多下一次工具）→</text><text x=\"18\" y=\"94\" fill=\"#79828a\" transform=\"rotate(-90 18 94)\" text-anchor=\"middle\">检出率</text><path d=\"M80 138 C 130 108, 180 78, 240 60 C 320 42, 420 34, 580 32\" fill=\"none\" stroke=\"#2f7d6b\" stroke-width=\"2\"/><circle cx=\"240\" cy=\"60\" r=\"5\" fill=\"#767a2e\"/><text x=\"248\" y=\"52\" fill=\"#5d6022\">F1 最高点</text><circle cx=\"430\" cy=\"34\" r=\"5.5\" fill=\"#b05a51\"/><text x=\"438\" y=\"28\" fill=\"#b05a51\">代价最优工作点（往右推）</text><rect x=\"330\" y=\"76\" width=\"290\" height=\"52\" rx=\"8\" fill=\"#f9e9e5\" stroke=\"#b05a51\" stroke-opacity=\".3\"/><text x=\"344\" y=\"94\" font-size=\"10.5\" fill=\"#b05a51\">漏检代价：套管失效 / 井报废 / 环空带压</text><text x=\"344\" y=\"112\" font-size=\"10.5\" fill=\"#b05a51\">误报代价：多下一次工具 · 两者相差约 50 倍</text><text x=\"344\" y=\"126\" font-size=\"10\" fill=\"#79828a\">→ 阈值应设在\"宁可多查\"的方向</text></g></svg></div><div class=\"figcap\"><b>图 2</b><span>把重伤判轻，比把轻伤判重危险得多。<b>这个比值要先和作业方谈定，写进验收标准，不能交给模型的默认阈值。</b></span></div>"},{"no":3,"en":"DATA","title":"你需要准备什么","html":"<p style=\"margin-bottom:14px\">这个场景的标签非常难得：<b>套管到底坏没坏，只有起出管柱或修井时才知道</b>。所以清单里最后两项决定了模型能不能被验证。</p><div class=\"checklist\"><div class=\"cl-head\"><span>数据准备清单 · 5 项</span><span class=\"cl-prog\"><span id=\"cl-txt\">0 / 5</span><span class=\"cl-bar\"><i id=\"cl-fill\"></i></span></span></div><div class=\"cl-item\" data-cl=\"0\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">井径 + 电磁原始展开数据</span><span class=\"cl-s\">深度 × 方位的二维数组</span></span><span class=\"cl-n\">要原始数据，不要只存图</span></div><div class=\"cl-item\" data-cl=\"1\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">套管程序</span><span class=\"cl-s\">钢级、壁厚、外径、下深</span></span><span class=\"cl-n\">剩余强度计算的基准</span></div><div class=\"cl-item\" data-cl=\"2\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">井史与工况</span><span class=\"cl-s\">压裂次数、注水、出砂、腐蚀介质</span></span><span class=\"cl-n\">解释\"为什么这里坏\"</span></div><div class=\"cl-item\" data-cl=\"3\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">修井 / 起管证实记录</span><span class=\"cl-s\">实际损伤位置、类型、处理方式</span></span><span class=\"cl-n\">唯一金标准，最稀缺</span></div><div class=\"cl-item\" data-cl=\"4\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">生产异常记录</span><span class=\"cl-s\">出砂、含水突升、环空带压</span></span><span class=\"cl-n\">间接验证，量大但噪声高</span></div></div>"},{"no":4,"en":"DIFFICULTY","title":"技术难度与参考方向","html":"<div style=\"display:flex;align-items:center;gap:14px;flex-wrap:wrap\"><span class=\"dtag\" data-d=\"中\">难度 中</span><span class=\"small muted\">模型不难；难在标签稀缺、方位分辨率与\"重伤判轻\"的代价控制。</span></div><div class=\"meter\"><i class=\"on\"></i><i class=\"on\"></i><i></i></div><p>因为标签稀缺，<b>建议先走\"异常检测 + 人工确认\"而不是端到端分类</b>：模型只负责\"这段和你预期的不一样\"，把候选段推给人，人确认后回灌成标签。这样第一轮上线不需要训练集，就能开始积累样本。</p><p>另一个容易被忽略的点是<b>仪器臂数决定方位分辨率</b>。6 臂井径在 360° 上只有 6 个采样点，一个 30 mm 的点蚀坑很可能正好落在两个臂之间被完全抹掉。<b>把臂数作为模型的一个条件输入</b>，或者直接按臂数分档建模，比硬学更靠谱。</p><p style=\"margin-top:18px\"><span class=\"kicker plain\" style=\"color:var(--ink-4)\">可借鉴的通用技术</span></p><div class=\"refs\"><a class=\"ref\" href=\"#/method/cv\">图像异常检测<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/cv\">多通道融合<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/cv\">代价敏感学习<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/ts\">剩余强度回归<span class=\"ar\">↗</span></a></div>"}]},"workflow":{"label":"案例流程","title":"案例：某老区 240 口井的套管普查","lead":["某开发 30 年的老区，240 口井做套管普查，检测井段平均 1800 m。历史判读 1.5 h/井，损伤井占比 31%，发生过 4 起因漏检腐蚀段导致的突发穿孔。","目标：漏检率降到 2% 以下，且\"重伤判轻\"这一类错误降到零。"],"stats":[["普查井数","240 口"],["检测井段","1800 m/井"],["损伤井占比","31%"],["漏检率","1.2%"]],"steps":[{"name":"多源资料配对与对齐","role":"数据","do":"把井径、电磁、磁定位（接箍）三条曲线对齐到同一深度基准，并按接箍位置校正深度漂移；把套管程序（钢级、壁厚）按段挂上去。","effect":"深度对齐误差从 ±0.8 m 降到 ±0.15 m——这是\"能不能和修井记录对上\"的前提。","trap":"不同仪器下井次序不同、电缆拉伸不同，深度基准天生不一致。必须用接箍（磁定位）做硬对齐，不能只信深度计数器。","fig":"<svg viewBox=\"0 0 560 88\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"多源对齐\"><g font-size=\"10\"><g text-anchor=\"middle\"><rect x=\"18\" y=\"20\" width=\"116\" height=\"44\" rx=\"8\" fill=\"#e7eef9\" stroke=\"#41699b\" stroke-opacity=\".5\"/><text x=\"76\" y=\"38\" fill=\"#31527a\" font-weight=\"700\">三条曲线</text><text x=\"76\" y=\"53\" fill=\"#9ba3a9\">井径/电磁/接箍</text><rect x=\"150\" y=\"20\" width=\"116\" height=\"44\" rx=\"8\" fill=\"#f9efd7\" stroke=\"#a97a1c\" stroke-opacity=\".5\"/><text x=\"208\" y=\"38\" fill=\"#8e5229\" font-weight=\"700\">接箍硬对齐</text><text x=\"208\" y=\"53\" fill=\"#9ba3a9\">校正电缆拉伸</text><rect x=\"282\" y=\"20\" width=\"116\" height=\"44\" rx=\"8\" fill=\"#f1f1dd\" stroke=\"#767a2e\" stroke-opacity=\".5\"/><text x=\"340\" y=\"38\" fill=\"#5d6022\" font-weight=\"700\">挂套管程序</text><text x=\"340\" y=\"53\" fill=\"#9ba3a9\">钢级/壁厚</text><rect x=\"414\" y=\"20\" width=\"128\" height=\"44\" rx=\"8\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\" stroke-opacity=\".5\"/><text x=\"478\" y=\"38\" fill=\"#235f51\" font-weight=\"700\">±0.15 m</text><text x=\"478\" y=\"53\" fill=\"#9ba3a9\">原 ±0.8 m</text></g><g stroke=\"#9ba3a9\" stroke-width=\"1.2\"><path d=\"M134 42 h12\" marker-end=\"url(#w3a)\"/><path d=\"M266 42 h12\" marker-end=\"url(#w3a)\"/><path d=\"M398 42 h12\" marker-end=\"url(#w3a)\"/></g></g><defs><marker id=\"w3a\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#9ba3a9\"/></marker></defs></svg>"},{"name":"展开图标准化与接箍掩膜","role":"工程","do":"把井径与电磁重采样成统一的\"深度 × 方位\"网格（0.1 m × 10°），并对接箍位置做掩膜——接箍在两种仪器上都有强响应，不掩掉会被当成损伤。","effect":"接箍引起的假异常从平均 11 处/井降到 0.4 处/井。","trap":"接箍间距不是严格等距（套管长度有公差），用固定间距掩膜会漏掉一部分。要用磁定位曲线实测的接箍深度逐个掩膜。","fig":"<svg viewBox=\"0 0 560 90\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"接箍掩膜\"><g font-size=\"10\"><text x=\"18\" y=\"20\" fill=\"#79828a\">接箍是最大的假异常源：</text><rect x=\"200\" y=\"10\" width=\"330\" height=\"14\" rx=\"7\" fill=\"#efece1\"/><g fill=\"#b05a51\" opacity=\".8\"><rect x=\"216\" y=\"12\" width=\"4\" height=\"10\"/><rect x=\"268\" y=\"12\" width=\"4\" height=\"10\"/><rect x=\"320\" y=\"12\" width=\"4\" height=\"10\"/><rect x=\"372\" y=\"12\" width=\"4\" height=\"10\"/><rect x=\"424\" y=\"12\" width=\"4\" height=\"10\"/><rect x=\"476\" y=\"12\" width=\"4\" height=\"10\"/></g><text x=\"200\" y=\"42\" fill=\"#b05a51\">掩膜前：11 处/井被当成损伤</text><rect x=\"200\" y=\"52\" width=\"330\" height=\"14\" rx=\"7\" fill=\"#efece1\"/><g fill=\"#2f7d6b\"><rect x=\"300\" y=\"54\" width=\"60\" height=\"10\"/></g><text x=\"366\" y=\"64\" fill=\"#235f51\">真损伤段（保留）</text><text x=\"200\" y=\"84\" fill=\"#235f51\" font-weight=\"700\">掩膜后：0.4 处/井</text></g></svg>"},{"name":"双通道异常分割","role":"算法","do":"井径与电磁各自编码后在深度维融合，输出每格异常概率；沿深度连通成段，再对每段做类型分类与剩余强度回归。用代价敏感损失：重伤判轻的惩罚是轻伤判重的 20 倍。","effect":"段级召回 0.94；其中\"仅腐蚀型\"（井径无反应）召回 0.91——这正是过去漏检的那一类。","trap":"别用像素级 dice 当主指标：损伤段在整口井里占比不到 2%，像素指标会驱动模型\"什么都不报\"。要看段级召回与分级混淆矩阵。","fig":"<svg viewBox=\"0 0 560 92\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"按损伤类型的召回\"><g font-size=\"10\"><text x=\"18\" y=\"20\" fill=\"#79828a\">按损伤类型的段级召回：</text><rect x=\"230\" y=\"10\" width=\"290\" height=\"12\" rx=\"6\" fill=\"#2f7d6b\"/><text x=\"526\" y=\"20\" fill=\"#235f51\">变形/错断 0.98</text><rect x=\"230\" y=\"30\" width=\"270\" height=\"12\" rx=\"6\" fill=\"#2f7d6b\" opacity=\".85\"/><text x=\"506\" y=\"40\" fill=\"#235f51\">仅腐蚀型 0.91（原漏检类）</text><rect x=\"230\" y=\"50\" width=\"248\" height=\"12\" rx=\"6\" fill=\"#b26a39\" opacity=\".85\"/><text x=\"484\" y=\"60\" fill=\"#8e5229\">点蚀穿孔 0.83（坑小，最易漏）</text><text x=\"230\" y=\"80\" fill=\"#79828a\">代价敏感损失：重伤判轻的惩罚 ×20</text></g></svg>"},{"name":"分级阈值与代价矩阵","role":"质控","do":"与作业方共同确定\"漏检 : 误报 ≈ 50 : 1\"的代价比，据此把判定阈值从 F1 最优点往右推；并对每一档严重度单独设阈值。","effect":"漏检率 8.7% → 1.2%；重伤判轻 0 起；代价是每条井多复核 2.3 段（约 15 min）。","trap":"代价比不要拍脑袋设成 50:1 就完事——不同井（高产井 vs 边缘井、水源区 vs 一般区）的代价不同。至少按井的重要度分两档。","fig":"<svg viewBox=\"0 0 560 94\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"阈值调整结果\"><g font-size=\"10\"><text x=\"18\" y=\"20\" fill=\"#79828a\">阈值从 F1 点右移后的代价交换：</text><rect x=\"230\" y=\"10\" width=\"86\" height=\"13\" rx=\"6\" fill=\"#b05a51\"/><text x=\"322\" y=\"20\" fill=\"#b05a51\">原漏检 8.7%</text><rect x=\"230\" y=\"30\" width=\"12\" height=\"13\" rx=\"6\" fill=\"#2f7d6b\"/><text x=\"248\" y=\"40\" fill=\"#235f51\">现漏检 1.2%</text><rect x=\"230\" y=\"54\" width=\"40\" height=\"13\" rx=\"6\" fill=\"#c9c2b0\"/><text x=\"276\" y=\"64\" fill=\"#79828a\">误报 +2.3 段/井</text><text x=\"230\" y=\"86\" fill=\"#8e5229\">代价：每井多复核约 15 min</text></g></svg>"},{"name":"修井验证闭环","role":"人工","do":"每次修井或起管时，把实际看到的损伤位置、类型、处理方式回写；对模型\"判正常但后来出事\"的段单独复盘。","effect":"两轮迭代后，点蚀穿孔召回从 0.83 提到 0.92；累计 68 井次验证样本。","trap":"验证样本天然偏向\"被怀疑的段\"，正常段很少被证实。要按模型置信度分层抽样做主动验证，否则验证集永远是难例，无法估计真实漏检率。"}],"metrics":{"title":"怎么算「做对了」","html":"<p>这个场景必须<b>按损伤类型分桶看召回</b>，并且单独盯\"重伤判轻\"这一个格子——全局召回会把最关键的信息藏起来。</p><div style=\"margin:10px 0 6px\"><svg viewBox=\"0 0 640 130\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"分级混淆矩阵\"><g font-size=\"10.5\"><g font-size=\"9.5\" fill=\"#79828a\"><text x=\"150\" y=\"18\" text-anchor=\"middle\">判正常</text><text x=\"230\" y=\"18\" text-anchor=\"middle\">判轻度</text><text x=\"310\" y=\"18\" text-anchor=\"middle\">判中度</text><text x=\"390\" y=\"18\" text-anchor=\"middle\">判重度</text></g><g><text x=\"30\" y=\"42\" fill=\"#4d565b\">实正常</text><rect x=\"110\" y=\"28\" width=\"80\" height=\"22\" rx=\"4\" fill=\"#e6f1ec\"/><text x=\"150\" y=\"43\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">0.96</text><rect x=\"190\" y=\"28\" width=\"80\" height=\"22\" rx=\"4\" fill=\"#f5f2ea\"/><text x=\"230\" y=\"43\" text-anchor=\"middle\" fill=\"#a97a1c\">0.04</text><rect x=\"270\" y=\"28\" width=\"80\" height=\"22\" rx=\"4\" fill=\"#f5f2ea\"/><rect x=\"350\" y=\"28\" width=\"80\" height=\"22\" rx=\"4\" fill=\"#f5f2ea\"/></g><g><text x=\"30\" y=\"70\" fill=\"#4d565b\">实轻度</text><rect x=\"110\" y=\"56\" width=\"80\" height=\"22\" rx=\"4\" fill=\"#f9efd7\"/><text x=\"150\" y=\"71\" text-anchor=\"middle\" fill=\"#8e5229\">0.06</text><rect x=\"190\" y=\"56\" width=\"80\" height=\"22\" rx=\"4\" fill=\"#e6f1ec\"/><text x=\"230\" y=\"71\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">0.88</text><rect x=\"270\" y=\"56\" width=\"80\" height=\"22\" rx=\"4\" fill=\"#f5f2ea\"/><text x=\"310\" y=\"71\" text-anchor=\"middle\" fill=\"#a97a1c\">0.06</text><rect x=\"350\" y=\"56\" width=\"80\" height=\"22\" rx=\"4\" fill=\"#f5f2ea\"/></g><g><text x=\"30\" y=\"98\" fill=\"#4d565b\">实中度</text><rect x=\"110\" y=\"84\" width=\"80\" height=\"22\" rx=\"4\" fill=\"#f9e9e5\"/><text x=\"150\" y=\"99\" text-anchor=\"middle\" fill=\"#b05a51\">0.02</text><rect x=\"190\" y=\"84\" width=\"80\" height=\"22\" rx=\"4\" fill=\"#f8ecdf\"/><text x=\"230\" y=\"99\" text-anchor=\"middle\" fill=\"#8e5229\">0.11</text><rect x=\"270\" y=\"84\" width=\"80\" height=\"22\" rx=\"4\" fill=\"#e6f1ec\"/><text x=\"310\" y=\"99\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">0.85</text><rect x=\"350\" y=\"84\" width=\"80\" height=\"22\" rx=\"4\" fill=\"#f5f2ea\"/><text x=\"390\" y=\"99\" text-anchor=\"middle\" fill=\"#a97a1c\">0.02</text></g><g><text x=\"30\" y=\"126\" fill=\"#4d565b\">实重度</text><rect x=\"110\" y=\"112\" width=\"80\" height=\"22\" rx=\"4\" fill=\"#fff\" stroke=\"#b05a51\" stroke-width=\"1.5\"/><text x=\"150\" y=\"127\" text-anchor=\"middle\" fill=\"#b05a51\" font-weight=\"700\">0</text><rect x=\"190\" y=\"112\" width=\"80\" height=\"22\" rx=\"4\" fill=\"#f9e9e5\"/><text x=\"230\" y=\"127\" text-anchor=\"middle\" fill=\"#b05a51\">0.03</text><rect x=\"270\" y=\"112\" width=\"80\" height=\"22\" rx=\"4\" fill=\"#f8ecdf\"/><text x=\"310\" y=\"127\" text-anchor=\"middle\" fill=\"#8e5229\">0.14</text><rect x=\"350\" y=\"112\" width=\"80\" height=\"22\" rx=\"4\" fill=\"#e6f1ec\"/><text x=\"390\" y=\"127\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">0.83</text></g></g></svg></div><p style=\"margin-top:6px\">读法：红框那一个格子（<b>实重度 → 判正常</b>）是这个模型<b>唯一必须为零</b>的格子——它对应\"套管都快断了还说它没事\"。为了守住这个 0，我们接受\"实轻度 → 判中度\"有 6% 的过判。这是用便宜的错误换掉昂贵的错误，<b>而这个交换比例要事先和作业方写进验收标准</b>。</p>"},"fails":[{"name":"只测井径就下结论","why":"均匀腐蚀与点蚀不改变内径，机械井径完全无反应，直到穿孔才发现。必须上电磁通道，或至少对高风险井（老井、含 H₂S/CO₂、出砂井）强制双测。"},{"name":"用 F1 最优点定阈值","why":"F1 默认漏检与误报等价，而这里漏检代价约为误报的 50 倍。按 F1 定阈值会系统性漏掉重伤段，改用代价矩阵后漏检率从 8.7% 降到 1.2%。"},{"name":"用像素 dice 当主指标","why":"损伤段占全井不到 2%，像素指标会驱动模型\"什么都不报\"以换取高分。必须用段级召回 + 分级混淆矩阵，并单独盯\"重伤判轻\"那一格。"}]},"demo":{"mode":"module","js":"demo/demo.js","label":"可运行示范","intro":"左边是机械井径展开图（看内径），右边是电磁探伤展开图（看壁厚）。选「均匀腐蚀」再关掉电磁通道，就能复现最危险的漏检：壁厚快掉光了，井径上却几乎看不出来。","height":900}}};

  var __mod = { exports: {} };
  (function (module, exports) {
/* 套管损伤智能识别 · 交互示范
   合成套管展开图（深度 × 方位）：机械井径（看变形）与电磁探伤（看壁厚损失）两个通道，
   演示「单看井径会漏掉只腐蚀不变形的段」这一互补关系，并给出损伤分段与剩余强度评估。 */
module.exports = {
  mount: function (root, api) {
    var JADE = '#2f7d6b', CLAY = '#b26a39', BAD = '#b05a51',
        OPT = '#41699b', INK3 = '#79828a', INK2 = '#4d565b';

    var NR = 58, NA = 36;                 /* 深度行 × 方位列 */
    var TOP = 1420, BOT = 1620;           /* 检测井段 m */
    var ID0 = 124.3;                      /* 套管内径基准 mm */

    var TYPES = [
      { n: '均匀腐蚀（壁厚整体减薄）', cor: 1, def: 0.05, spot: 0 },
      { n: '点蚀穿孔（局部深坑）', cor: 0.35, def: 0.1, spot: 1 },
      { n: '套管变形（挤毁缩径）', cor: 0.15, def: 0.9, spot: 0 },
      { n: '错断 / 严重变形', cor: 0.2, def: 1.0, spot: 0 },
      { n: '接箍处泄漏', cor: 0.5, def: 0.15, spot: 1 }
    ];

    function noise(i, s) {
      var h = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
      return (h - Math.floor(h)) * 2 - 1;
    }
    function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

    /* 真值：壁厚损失率 0—1 与 内径变化 mm（正=缩径） */
    function truth(ti, sev, seed) {
      var T = TYPES[ti];
      var loss = [], defo = [];
      var dTop = TOP + (BOT - TOP) * 0.34, dBot = TOP + (BOT - TOP) * 0.58;   /* 损伤段 */
      for (var r = 0; r < NR; r++) {
        var d = TOP + (r + 0.5) * (BOT - TOP) / NR;
        var inSeg = d >= dTop && d <= dBot;
        var lr = [], dr = [];
        for (var a = 0; a < NA; a++) {
          var ang = a / NA * 360;
          var lv = 0, dv = 0;
          if (inSeg) {
            var shape = 0.5 + 0.5 * Math.sin((d - dTop) / (dBot - dTop) * Math.PI);  /* 段内中间最重 */
            lv = T.cor * sev * shape;
            if (T.spot) {   /* 点蚀：方位上集中在几个点 */
              var pit = Math.exp(-Math.pow(((ang + 720) % 360 - 120) / 26, 2))
                      + Math.exp(-Math.pow(((ang + 720) % 360 - 250) / 18, 2));
              lv = clamp(lv * 0.5 + sev * pit * 0.85, 0, 1);
            }
            dv = T.def * sev * shape * (0.6 + 0.4 * Math.cos(ang / 180 * Math.PI));   /* 椭圆化 */
          }
          lr.push(clamp(lv, 0, 1));
          dr.push(clamp(dv * 6.5, 0, 7));   /* 缩径最多 7 mm */
        }
        loss.push(lr); defo.push(dr);
      }
      /* 接箍：每 10 m 一圈，井径上有响应、电磁上也有 */
      return { loss: loss, defo: defo, dTop: dTop, dBot: dBot };
    }

    /* ---------- 仪器测量 ---------- */
    function measure(tv, arms, nz, emtOn, seed) {
      var cal = [], emt = [];
      var step = NA / arms;
      for (var r = 0; r < NR; r++) {
        var cr = [], er = [];
        for (var a = 0; a < NA; a++) {
          /* 机械井径：只有有限个臂，方位上被"抹平"（分辨率损失） */
          var ai = Math.floor(a / step) * step;
          var dv = tv.defo[r][ai];
          cr.push(ID0 - dv + noise(r * 41 + a, seed) * nz * 0.7);
          /* 电磁探伤：看壁厚，噪声更大 */
          er.push(emtOn ? clamp(tv.loss[r][a] + noise(r * 17 + a, seed + 3) * nz * 0.34, 0, 1) : 0);
        }
        cal.push(cr); emt.push(er);
      }
      return { cal: cal, emt: emt };
    }

    /* ---------- 识别：阈值 + 连通段 ---------- */
    function detect(m, thr, minLen, emtOn) {
      var rows = [];
      for (var r = 0; r < NR; r++) {
        var mx = 0, mxc = 0;
        for (var a = 0; a < NA; a++) {
          var lv = emtOn ? m.emt[r][a] : (ID0 - m.cal[r][a]) / 7;
          if (lv > mx) mx = lv;
          if (ID0 - m.cal[r][a] > mxc) mxc = ID0 - m.cal[r][a];
        }
        rows.push({ r: r, emt: mx, cal: mxc });
      }
      var segs = [], cur = null;
      for (var i = 0; i < rows.length; i++) {
        var on = emtOn ? (rows[i].emt > thr) : (rows[i].cal > thr * 7);
        if (on) { if (!cur) cur = { a: i, b: i, mx: rows[i].emt, mxc: rows[i].cal }; else { cur.b = i; cur.mx = Math.max(cur.mx, rows[i].emt); cur.mxc = Math.max(cur.mxc, rows[i].cal); } }
        else if (cur) { segs.push(cur); cur = null; }
      }
      if (cur) segs.push(cur);
      /* 合并过短段 */
      var out = [];
      for (var k = 0; k < segs.length; k++) {
        var len = (segs[k].b - segs[k].a + 1) * (BOT - TOP) / NR;
        if (len >= minLen) out.push(segs[k]);
      }
      return { rows: rows, segs: out };
    }

    root.innerHTML =
      '<div class="demo">' +
      '<div class="demo-head"><span class="kicker">INTERACTIVE · CASING INSPECTION (CALIPER + EM)</span>' +
      '<h3>井径看变形，电磁看壁厚：两个通道缺一不可</h3>' +
      '<p>机械多臂井径量的是<b>内径</b>（套管被挤扁、缩径才看得出），电磁探伤量的是<b>壁厚</b>（腐蚀减薄、点蚀才看得出）。' +
      '所以存在一类最危险的损伤：<b>壁已经腐蚀掉大半，但内径没变</b>——只测井径的井会完全漏掉它。' +
      '选"均匀腐蚀"，再关掉电磁通道试试。</p></div>' +
      '<div class="ctl-row">' +
      '<select id="cd-t" style="font-size:12px;padding:4px 8px;border:1px solid var(--line-2,#ddd7c8);border-radius:6px;max-width:250px">' +
      TYPES.map(function (t, i) { return '<option value="' + i + '">' + t.n + '</option>'; }).join('') +
      '</select>' +
      '<div class="ctl"><label>严重度 <output id="cd-os">0.60</output></label><input type="range" id="cd-s" min="0.1" max="1" step="0.05" value="0.6"></div>' +
      '<div class="ctl"><label>仪器臂数 <output id="cd-oa">24</output></label><input type="range" id="cd-a" min="6" max="36" step="6" value="24"></div>' +
      '<div class="ctl"><label>噪声 <output id="cd-on">0.25</output></label><input type="range" id="cd-n" min="0" max="0.8" step="0.05" value="0.25"></div>' +
      '<div class="ctl"><label>判定阈值 <output id="cd-ot">0.30</output></label><input type="range" id="cd-th" min="0.1" max="0.7" step="0.02" value="0.3"></div>' +
      '<button class="btn-x ghost" id="cd-em">电磁通道：开</button>' +
      '</div>' +
      '<div class="grid2" style="grid-template-columns:1fr 1fr">' +
      '<div class="card-x"><h4>机械井径（内径 mm，越小越缩径）</h4>' +
      '<svg id="cd-1" class="chart" viewBox="0 0 380 400" role="img" aria-label="井径展开图"></svg></div>' +
      '<div class="card-x"><h4>电磁探伤（壁厚损失率）</h4>' +
      '<svg id="cd-2" class="chart" viewBox="0 0 380 400" role="img" aria-label="电磁探伤展开图"></svg></div>' +
      '</div>' +
      '<div class="card-x" style="margin-top:12px"><h4>识别结果</h4>' +
      '<div class="readouts">' +
      '<div class="ro"><span class="k">检出损伤段</span><b id="cd-v1">—</b></div>' +
      '<div class="ro"><span class="k">真值深度</span><b id="cd-v2">—</b></div>' +
      '<div class="ro"><span class="k">位置误差</span><b id="cd-v3">—</b></div>' +
      '<div class="ro"><span class="k">最大壁厚损失</span><b id="cd-v4">—</b></div>' +
      '<div class="ro"><span class="k">最大缩径</span><b id="cd-v5">—</b></div>' +
      '<div class="ro"><span class="k">剩余抗挤比</span><b id="cd-v6">—</b></div>' +
      '<div class="ro"><span class="k">损伤类型</span><b id="cd-v7">—</b></div>' +
      '<div class="ro"><span class="k">处置建议</span><b id="cd-v8">—</b></div>' +
      '</div>' +
      '<div id="cd-why" style="margin-top:12px;font-size:11.5px;line-height:1.75"></div></div>' +
      '<p class="note" id="cd-note"></p>' +
      '</div>';

    var $ = function (id) { return root.querySelector('#' + id); };
    var emtOn = true, SEED = 31;

    var W = 380, H = 400, ML = 34, MT = 14, MB = 26;
    var GW = W - ML - 10, GH = H - MT - MB;
    var RH = GH / NR, CW = GW / NA;

    function heat(id, arr, lo, hi, cmap, rev) {
      var s = '';
      for (var r = 0; r < NR; r++) {
        for (var a = 0; a < NA; a++) {
          var t = clamp((arr[r][a] - lo) / (hi - lo), 0, 1);
          if (rev) t = 1 - t;
          var col = cmap(t);
          s += '<rect x="' + (ML + a * CW).toFixed(1) + '" y="' + (MT + r * RH).toFixed(1) +
            '" width="' + (CW + 0.6).toFixed(1) + '" height="' + (RH + 0.6).toFixed(1) + '" fill="' + col + '"/>';
        }
      }
      for (var d = TOP; d <= BOT; d += 40) {
        var y = MT + (d - TOP) / (BOT - TOP) * GH;
        s += '<text x="' + (ML - 4) + '" y="' + (y + 3) + '" font-size="8.5" fill="' + INK3 + '" text-anchor="end" font-family="monospace">' + d + '</text>';
      }
      [0, 90, 180, 270, 360].forEach(function (ang) {
        var x = ML + ang / 360 * GW;
        s += '<text x="' + x + '" y="' + (H - 8) + '" font-size="8.5" fill="' + INK3 + '" text-anchor="middle">' + ang + '°</text>';
      });
      s += '<rect x="' + ML + '" y="' + MT + '" width="' + GW + '" height="' + GH + '" fill="none" stroke="#c9c2b0"/>';
      $(id).innerHTML = s;
    }
    /* 井径色标：正常=纸色，缩径=红 */
    function cmapCal(t) {
      var g = Math.round(252 - t * 90), r = Math.round(252 - t * 20), b = Math.round(246 - t * 140);
      return 'rgb(' + r + ',' + g + ',' + b + ')';
    }
    /* 电磁色标：无损=纸色，损失=深蓝红 */
    function cmapEm(t) {
      if (t < 0.35) return 'rgb(' + Math.round(250 - t * 60) + ',' + Math.round(248 - t * 120) + ',' + Math.round(238 - t * 160) + ')';
      return 'rgb(' + Math.round(230 - (t - 0.35) * 300) + ',' + Math.round(150 - (t - 0.35) * 380) + ',' + Math.round(120 - (t - 0.35) * 260) + ')';
    }

    function draw() {
      var ti = +$('cd-t').value, sev = +$('cd-s').value, arms = +$('cd-a').value,
          nz = +$('cd-n').value, thr = +$('cd-th').value;
      $('cd-os').textContent = sev.toFixed(2);
      $('cd-oa').textContent = arms;
      $('cd-on').textContent = nz.toFixed(2);
      $('cd-ot').textContent = thr.toFixed(2);

      var tv = truth(ti, sev, SEED);
      var m = measure(tv, arms, nz, emtOn, SEED);
      heat('cd-1', m.cal, ID0 - 7, ID0 + 0.5, cmapCal, false);
      if (emtOn) heat('cd-2', m.emt, 0, 1, cmapEm, false);
      else {
        var s = '<rect x="' + ML + '" y="' + MT + '" width="' + GW + '" height="' + GH + '" fill="#f4f2ec" stroke="#c9c2b0"/>' +
          '<text x="' + (ML + GW / 2) + '" y="' + (MT + GH / 2) + '" font-size="12" fill="' + INK3 + '" text-anchor="middle">未测电磁（本次只下井径）</text>' +
          '<text x="' + (ML + GW / 2) + '" y="' + (MT + GH / 2 + 18) + '" font-size="10.5" fill="' + BAD + '" text-anchor="middle">壁厚变化看不见</text>';
        $('cd-2').innerHTML = s;
      }

      var res = detect(m, thr, 3, emtOn);
      var segs = res.segs;
      var maxLoss = 0, maxDef = 0;
      for (var r = 0; r < NR; r++) for (var a = 0; a < NA; a++) {
        if (tv.loss[r][a] > maxLoss) maxLoss = tv.loss[r][a];
        if (tv.defo[r][a] > maxDef) maxDef = tv.defo[r][a];
      }
      var hit = 0, err = 99;
      segs.forEach(function (sg) {
        var d1 = TOP + sg.a * (BOT - TOP) / NR, d2 = TOP + (sg.b + 1) * (BOT - TOP) / NR;
        if (d2 > tv.dTop && d1 < tv.dBot) { hit++; err = Math.min(err, Math.abs((d1 + d2) / 2 - (tv.dTop + tv.dBot) / 2)); }
      });
      /* 剩余抗挤强度比：随壁厚损失与椭圆度下降 */
      var oval = clamp(maxDef / 7, 0, 1);
      var ratio = clamp((1 - maxLoss * 0.72) * (1 - oval * 0.45), 0.08, 1);
      var tname = TYPES[ti].n.split('（')[0];
      var act = ratio > 0.8 ? '正常生产，定期复测' : ratio > 0.6 ? '限压生产，1 年内复测' : ratio > 0.4 ? '贴补套管 / 下小套管' : '立即修井，报废评估';
      var conf = clamp(0.94 - nz * 0.5 - (arms < 12 ? 0.14 : 0) - (emtOn ? 0 : 0.22), 0.3, 0.98);

      $('cd-v1').textContent = segs.length + ' 段';
      $('cd-v1').className = segs.length === 1 ? 'ok' : (segs.length > 1 ? 'warn' : 'bad');
      $('cd-v2').textContent = Math.round(tv.dTop) + '—' + Math.round(tv.dBot) + ' m';
      $('cd-v3').textContent = hit ? err.toFixed(1) + ' m' : (segs.length ? '误判' : '未检出');
      $('cd-v3').className = hit && err < 6 ? 'ok' : 'bad';
      $('cd-v4').textContent = Math.round(maxLoss * 100) + ' %';
      $('cd-v4').className = maxLoss < 0.3 ? 'ok' : (maxLoss < 0.55 ? 'warn' : 'bad');
      $('cd-v5').textContent = maxDef.toFixed(1) + ' mm';
      $('cd-v5').className = maxDef < 2 ? 'ok' : (maxDef < 4.5 ? 'warn' : 'bad');
      $('cd-v6').textContent = ratio.toFixed(2);
      $('cd-v6').className = ratio > 0.8 ? 'ok' : (ratio > 0.55 ? 'warn' : 'bad');
      $('cd-v7').textContent = tname;
      $('cd-v8').textContent = act;
      $('cd-v8').className = ratio > 0.6 ? 'ok' : 'bad';

      var why = [];
      if (!emtOn && (ti === 0 || ti === 1 || ti === 4)) {
        why.push('<b style="color:' + BAD + '">这就是最危险的漏检</b>：壁厚已经损失 <b>' + Math.round(maxLoss * 100) +
          '%</b>，但内径只变了 <b>' + maxDef.toFixed(1) + ' mm</b>——机械井径上看不出明显异常，' +
          '检出段数：<b>' + segs.length + '</b>。' +
          '这类井往往是在<b>突然穿孔、出砂或环空窜</b>之后才被发现，处理成本是提前检出的十倍。');
      } else if (!emtOn) {
        why.push('当前损伤以变形为主，井径通道确实能抓到（检出 ' + segs.length + ' 段）。' +
          '但请注意：即便是变形井，也常伴生腐蚀，只测井径会低估损伤程度。');
      } else {
        why.push('两个通道都在：电磁看到壁厚损失 <b>' + Math.round(maxLoss * 100) + '%</b>，' +
          '井径看到缩径 <b>' + maxDef.toFixed(1) + ' mm</b>，模型把两者融合后给出剩余抗挤比 <b>' + ratio.toFixed(2) + '</b>。');
      }
      if (arms < 12) why.push('<b style="color:' + CLAY + '">臂数只有 ' + arms + '</b>：方位分辨率不足，' +
        '点蚀坑被"抹"成一整片，容易把局部深坑判成均匀减薄——这会让剩余强度评估偏乐观（危险方向）。');
      if (nz > 0.5) why.push('噪声偏大：电磁通道本来信噪比就低，噪声上去后判定阈值必须同步抬高，' +
        '代价是浅层轻度腐蚀会被漏掉。这种情况应要求<b>降低测速重测</b>，而不是靠调阈值硬凑。');
      why.push('把 <b>严重度</b> 从 0.1 拖到 1.0：注意<b>壁厚损失先到达报废线，而内径变化后到</b>——' +
        '这就是为什么修井决策看的是剩余抗挤比，而不是"内径缩了多少"。');
      $('cd-why').innerHTML = why.join('<br><br>');
    }

    ['cd-t', 'cd-s', 'cd-a', 'cd-n', 'cd-th'].forEach(function (id) {
      $(id).addEventListener('input', draw);
      $(id).addEventListener('change', draw);
    });
    $('cd-em').addEventListener('click', function () {
      emtOn = !emtOn;
      $('cd-em').textContent = '电磁通道：' + (emtOn ? '开' : '关');
      draw();
    });

    draw();
    $('cd-note').innerHTML =
      '这个演示的核心只有一句话：<b>测量通道决定了你能看见什么</b>。' +
      '机械井径只对"形状变了"有反应，电磁探伤只对"金属少了"有反应，而套管损伤里最贵的那几类（均匀腐蚀、点蚀穿孔）' +
      '恰恰是形状基本不变、金属悄悄变少的类型。' +
      '所以模型做多通道融合不是为了刷指标，而是为了<b>不漏掉那几类看不见的损伤</b>。' +
      '最后提醒：剩余强度评估的误差方向很重要——<b>把重伤判轻，比把轻伤判重危险得多</b>，阈值要往"宁可多查"的方向设。';
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
