/* =========================================================
   s1-fault-auto-interpret · 案例插件（由 _build/build.mjs 自动生成，勿手改）
   源头是案例包 fault-interpret-case/source.js + demo/，改内容请改源头后重新构建。
   ========================================================= */
(function () {
  var DEF = {"id":"s1-fault-auto-interpret","sceneId":"s1","title":"地震断层自动解释：从相干体到断层面","status":"ready","version":"1.0.0","updated":"2026-10-26","tabs":{"background":{"label":"专业背景","lede":"一个 800 km² 的三维地震工区里藏着几百条断层。解释员要在 inline、crossline、时间切片三个方向上逐条把断层\"点\"出来，再串成面——这是一项以\"月\"为单位的活，而且两个解释员解释同一块体，断层位置能差出半个道距。断层控制着圈闭、油水界面与注水见效，是构造建模里最不能错的一层。","judge":[{"label":"任务类型","value":"三维体细结构分割","desc":"正样本只占 1%—3%"},{"label":"数据门槛","value":"合成体预训练 + 真实微调","desc":"真实断层标签极贵"},{"label":"可见收益","value":"解释周期以月 → 以周计","desc":"人工只复核模型挑出来的"},{"label":"难度","value":"高","html":"<span class=\"dtag\" data-d=\"高\">难度 高</span>"}],"sections":[{"no":1,"en":"PROBLEM","title":"当前做法与问题","html":"<p>解释员的做法是在切片上\"描\"：先在 inline 上每隔 10—20 条点一次断层，再换 crossline 校一遍，最后在时间切片上确认走向。<b>断层的本质是三维连通的曲面，人工却只能在二维切片上逐点勾</b>——两个方向对不上就要反复回来改。</p><p>更麻烦的是判断本身很主观：这条\"暗线\"到底是断层、还是河道边缘、还是采集脚印？弱振幅带里同相轴本来就不连续，老解释员凭经验敢连，新手不敢连。<b>工区越大，人与人之间的不一致越明显。</b></p><div class=\"figure\"><svg viewBox=\"0 0 640 232\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"断层解释的三方向人工追踪\"><g font-size=\"11\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#242b2e\"><text x=\"110\" y=\"18\">Inline 剖面</text><text x=\"320\" y=\"18\">Crossline 剖面</text><text x=\"530\" y=\"18\">时间切片</text></g><g stroke=\"#c9c2b0\" fill=\"none\"><rect x=\"26\" y=\"28\" width=\"170\" height=\"120\" rx=\"6\" fill=\"#fdfcf9\"/><rect x=\"236\" y=\"28\" width=\"170\" height=\"120\" rx=\"6\" fill=\"#fdfcf9\"/><rect x=\"446\" y=\"28\" width=\"170\" height=\"120\" rx=\"6\" fill=\"#fdfcf9\"/></g><g stroke=\"#9ba3a9\" stroke-width=\"1\" fill=\"none\"><path d=\"M34 48 q28 -8 56 0 t56 0 t56 0\"/><path d=\"M34 66 q28 -8 56 0 t56 0 t56 0\"/><path d=\"M34 84 q28 -8 56 0 t56 0 t56 0\"/><path d=\"M34 102 q28 -8 56 0 t56 0 t56 0\"/><path d=\"M34 120 q28 -8 56 0 t56 0 t56 0\"/><path d=\"M34 138 q28 -8 56 0 t56 0 t56 0\"/><path d=\"M244 48 q28 -8 56 0 t56 0 t56 0\"/><path d=\"M244 66 q28 -8 56 0 t56 0 t56 0\"/><path d=\"M244 84 q28 -8 56 0 t56 0 t56 0\"/><path d=\"M244 102 q28 -8 56 0 t56 0 t56 0\"/><path d=\"M244 120 q28 -8 56 0 t56 0 t56 0\"/><path d=\"M244 138 q28 -8 56 0 t56 0 t56 0\"/></g><g stroke=\"#b05a51\" stroke-width=\"2\" stroke-dasharray=\"5 3\"><path d=\"M124 34 L86 144\"/><path d=\"M330 34 L296 144\"/></g><g fill=\"#b05a51\"><circle cx=\"124\" cy=\"34\" r=\"2.6\"/><circle cx=\"330\" cy=\"34\" r=\"2.6\"/><circle cx=\"106\" cy=\"70\" r=\"2.6\"/><circle cx=\"98\" cy=\"104\" r=\"2.6\"/><circle cx=\"88\" cy=\"136\" r=\"2.6\"/><circle cx=\"312\" cy=\"70\" r=\"2.6\"/><circle cx=\"304\" cy=\"104\" r=\"2.6\"/><circle cx=\"296\" cy=\"136\" r=\"2.6\"/></g><path d=\"M470 92 C 500 70, 540 78, 566 60 C 578 52, 590 58, 606 50\" fill=\"none\" stroke=\"#b05a51\" stroke-width=\"2.4\"/><g stroke=\"#41699b\" stroke-width=\"1\" opacity=\".55\" fill=\"none\"><path d=\"M462 44 h128\"/><path d=\"M462 62 h128\"/><path d=\"M462 80 h128\"/><path d=\"M462 98 h128\"/><path d=\"M462 116 h128\"/></g><text x=\"534\" y=\"128\" font-size=\"9\" fill=\"#41699b\" text-anchor=\"middle\">同相轴（时间切片上呈条带）</text><g font-size=\"10\" fill=\"#79828a\" text-anchor=\"middle\"><text x=\"111\" y=\"168\">逐条\"点\"断层 · 每 10—20 条点一次</text><text x=\"321\" y=\"168\">换方向再校一遍</text><text x=\"531\" y=\"168\">确认走向与连续性</text></g><rect x=\"26\" y=\"182\" width=\"590\" height=\"34\" rx=\"8\" fill=\"#f9e9e5\" stroke=\"#b05a51\" stroke-opacity=\".35\"/><text x=\"46\" y=\"204\" font-size=\"11\" fill=\"#b05a51\">同一个体，两个人解释：断层条数 312 vs 268，位置平均差 1.4 个道距</text></svg></div><div class=\"figcap\"><b>图 1</b><span>断层是三维曲面，人工只能在二维切片上逐点勾。<b>不一致不是态度问题，是这个任务本身的信息组织方式不适合人眼。</b></span></div>"},{"no":2,"en":"INTERVENTION","title":"AI 能做什么","html":"<p>正确的问题表述不是\"这条线是不是断层\"，而是<b>给体里每一个采样点一个断层概率</b>。做法分三步：先算多属性（相干体看波形不连续、曲率看层面弯曲、倾角方位看产状突变），再用 <b>3D U-Net</b> 在三维子体上输出概率体，最后阈值化 + 骨架化 + 断面拟合，得到走向、倾角、断距都齐全的断层面。</p><p>这里有两个必须交代清楚的工程判断。第一，<b>正样本只占 1%—3%</b>，是极端不均衡的细结构分割，dice loss 与加权采样是标配；第二，<b>真实标签极贵</b>（人工解释一条断层要几小时），工业上普遍走\"合成体预训练 + 少量真实微调\"：用褶积模型正演，随机断距、倾角、频带、噪声，生成上千个<b>已知标准答案</b>的地震体先把网络喂会。</p><div class=\"figure\"><svg viewBox=\"0 0 640 196\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"断层自动解释流水线\"><g font-size=\"11\" font-weight=\"700\" text-anchor=\"middle\"><rect x=\"16\" y=\"52\" width=\"104\" height=\"58\" rx=\"9\" fill=\"#e7eef9\" stroke=\"#41699b\"/><text x=\"68\" y=\"74\" fill=\"#31527a\">三维地震体</text><text x=\"68\" y=\"91\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">振幅数据</text><rect x=\"140\" y=\"52\" width=\"112\" height=\"58\" rx=\"9\" fill=\"#f1f1dd\" stroke=\"#767a2e\"/><text x=\"196\" y=\"74\" fill=\"#5d6022\">多属性计算</text><text x=\"196\" y=\"91\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">相干/曲率/方位</text><rect x=\"272\" y=\"52\" width=\"112\" height=\"58\" rx=\"9\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\"/><text x=\"328\" y=\"74\" fill=\"#235f51\">3D U-Net</text><text x=\"328\" y=\"91\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">输出概率体</text><rect x=\"404\" y=\"52\" width=\"104\" height=\"58\" rx=\"9\" fill=\"#f8ecdf\" stroke=\"#b26a39\"/><text x=\"456\" y=\"74\" fill=\"#8e5229\">阈值 + 骨架化</text><text x=\"456\" y=\"91\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">1 道宽的线</text><rect x=\"528\" y=\"52\" width=\"96\" height=\"58\" rx=\"9\" fill=\"#f9e9e5\" stroke=\"#b05a51\"/><text x=\"576\" y=\"74\" fill=\"#9c4a42\">断面拟合</text><text x=\"576\" y=\"91\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">走向/倾角/断距</text></g><g stroke=\"#9ba3a9\" stroke-width=\"1.4\"><path d=\"M120 81 h16\" marker-end=\"url(#f1a)\"/><path d=\"M252 81 h16\" marker-end=\"url(#f1a)\"/><path d=\"M384 81 h16\" marker-end=\"url(#f1a)\"/><path d=\"M508 81 h16\" marker-end=\"url(#f1a)\"/></g><defs><marker id=\"f1a\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#9ba3a9\"/></marker></defs><rect x=\"16\" y=\"126\" width=\"608\" height=\"52\" rx=\"9\" fill=\"#fdfcf9\" stroke=\"#e9e4d8\"/><text x=\"34\" y=\"146\" font-size=\"11\" fill=\"#4d565b\">合成体预训练（正演，已知答案）→ 真实工区少量微调 → 人工只复核模型挑出的候选</text><text x=\"34\" y=\"166\" font-size=\"10.5\" fill=\"#79828a\">评价不看像素精度：看<b style=\"color:#235f51\">断层条数召回</b>、<b style=\"color:#235f51\">断距误差</b>、<b style=\"color:#235f51\">骨架连通分量数</b>（越少越连续）</text></svg></div><div class=\"figcap\"><b>图 2</b><span>把\"描线\"改成\"算概率体\"：网络负责在三维上保持连续，人只负责判断模型挑出来的那几十条。<b>阈值决定的是人工复核量，不是 F1。</b></span></div>"},{"no":3,"en":"DATA","title":"你需要准备什么","html":"<p style=\"margin-bottom:14px\">这一项的数据门槛不在\"量\"，而在\"标签从哪来\"——真实断层标签几乎不可能大规模获得，所以清单里前三项是必须的：</p><div class=\"checklist\"><div class=\"cl-head\"><span>数据准备清单 · 5 项</span><span class=\"cl-prog\"><span id=\"cl-txt\">0 / 5</span><span class=\"cl-bar\"><i id=\"cl-fill\"></i></span></span></div><div class=\"cl-item\" data-cl=\"0\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">叠前/叠后地震体</span><span class=\"cl-s\">SEG-Y，inline × crossline × 时间</span></span><span class=\"cl-n\">须知道采集方向与道距</span></div><div class=\"cl-item\" data-cl=\"1\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">合成正演样本</span><span class=\"cl-s\">≥ 1000 个体，随机断距/倾角/噪声</span></span><span class=\"cl-n\">预训练主力，答案已知</span></div><div class=\"cl-item\" data-cl=\"2\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">人工解释的断层（金标准）</span><span class=\"cl-s\">1—3 个小块体，完整解释</span></span><span class=\"cl-n\">微调 + 测试的唯一样本</span></div><div class=\"cl-item\" data-cl=\"3\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">井分层与断点深度</span><span class=\"cl-s\">钻井证实的断层深度/断距</span></span><span class=\"cl-n\">校验断距误差</span></div><div class=\"cl-item\" data-cl=\"4\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">采集观测系统信息</span><span class=\"cl-s\">炮检点、面元、采集脚印方向</span></span><span class=\"cl-n\">区分假断层的关键</span></div></div>"},{"no":4,"en":"DIFFICULTY","title":"技术难度与参考方向","html":"<div style=\"display:flex;align-items:center;gap:14px;flex-wrap:wrap\"><span class=\"dtag\" data-d=\"高\">难度 高</span><span class=\"small muted\">难不在网络，难在标签来源与\"什么算一条断层\"的定义。</span></div><div class=\"meter\"><i class=\"on\"></i><i class=\"on\"></i><i class=\"on hi\"></i></div><p>先别追求端到端一次成型。建议路径：<b>先用相干体 + 经典图像处理（阈值 + 骨架化）跑通一条基线</b>，把\"阈值—复核量\"这条业务曲线先建立起来，再上 3D U-Net 比增益。很多工区里，好的属性 + 好的后处理已经能省掉一半工作量。</p><p>另一个容易被忽略的点：<b>断层的定义必须先写死</b>——断距小于多少米算断层？是否只解释油层段以上？不同解释员的标准不一样，模型学的就是这种不一致。先把标准固化成一份解释规范，再标注。</p><p style=\"margin-top:18px\"><span class=\"kicker plain\" style=\"color:var(--ink-4)\">可借鉴的通用技术</span></p><div class=\"refs\"><a class=\"ref\" href=\"#/method/cv\">三维图像分割<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/cv\">极端不均衡采样<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/cv\">合成数据预训练<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/cv\">骨架化与连通性<span class=\"ar\">↗</span></a></div>"}]},"workflow":{"label":"案例流程","title":"案例：860 km² 三维工区的断层解释提速","lead":["某探区 860 km² 三维地震（420 GB），历史人工解释断层 312 条，两个解释员背靠背解释一次要 6 周，且条数对不上。","目标：模型给出候选断层后人工复核，解释周期压到 2 周内，且井证实的断层不漏。"],"stats":[["工区面积","860 km²"],["地震体","420 GB"],["人工解释断层","312 条"],["复核后周期","11 天"]],"steps":[{"name":"合成体正演预训练","role":"数据","do":"用褶积模型正演：随机生成层速度、反射系数，再随机加 6—40 m 断距的断层面，叠加坡度噪声、随机频带（15—45 Hz）与采集脚印，生成 1800 个 128³ 的合成体。","effect":"网络在真实工区微调前就学会了\"波形不连续 = 断层\"这个基本模式，微调样本量只需原来的 1/5。","trap":"合成体的噪声与频带必须与真实工区对齐，否则微调时网络要先\"忘掉\"合成分布，收敛极慢——先做一遍频谱匹配再训练。","fig":"<svg viewBox=\"0 0 560 92\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"合成正演样本生成\"><g font-size=\"10\"><g text-anchor=\"middle\"><rect x=\"18\" y=\"20\" width=\"96\" height=\"44\" rx=\"8\" fill=\"#e7eef9\" stroke=\"#41699b\" stroke-opacity=\".5\"/><text x=\"66\" y=\"38\" fill=\"#31527a\" font-weight=\"700\">层速度模型</text><text x=\"66\" y=\"53\" fill=\"#9ba3a9\">随机生成</text><rect x=\"132\" y=\"20\" width=\"96\" height=\"44\" rx=\"8\" fill=\"#f1f1dd\" stroke=\"#767a2e\" stroke-opacity=\".5\"/><text x=\"180\" y=\"38\" fill=\"#5d6022\" font-weight=\"700\">加断层面</text><text x=\"180\" y=\"53\" fill=\"#9ba3a9\">断距 6—40 m</text><rect x=\"246\" y=\"20\" width=\"96\" height=\"44\" rx=\"8\" fill=\"#f8ecdf\" stroke=\"#b26a39\" stroke-opacity=\".5\"/><text x=\"294\" y=\"38\" fill=\"#8e5229\" font-weight=\"700\">褶积正演</text><text x=\"294\" y=\"53\" fill=\"#9ba3a9\">子波 15—45 Hz</text><rect x=\"360\" y=\"20\" width=\"96\" height=\"44\" rx=\"8\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\" stroke-opacity=\".5\"/><text x=\"408\" y=\"38\" fill=\"#235f51\" font-weight=\"700\">加噪声/脚印</text><text x=\"408\" y=\"53\" fill=\"#9ba3a9\">贴近真实</text><rect x=\"474\" y=\"20\" width=\"68\" height=\"44\" rx=\"8\" fill=\"#fdfcf9\" stroke=\"#c9c2b0\"/><text x=\"508\" y=\"38\" fill=\"#4d565b\" font-weight=\"700\">1800 体</text><text x=\"508\" y=\"53\" fill=\"#9ba3a9\">标签已知</text></g><g stroke=\"#9ba3a9\" stroke-width=\"1.2\"><path d=\"M114 42 h14\" marker-end=\"url(#f1b)\"/><path d=\"M228 42 h14\" marker-end=\"url(#f1b)\"/><path d=\"M342 42 h14\" marker-end=\"url(#f1b)\"/><path d=\"M456 42 h14\" marker-end=\"url(#f1b)\"/></g></g><defs><marker id=\"f1b\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#9ba3a9\"/></marker></defs></svg>"},{"name":"多属性输入","role":"工程","do":"把振幅体换成三通道：相干体（相邻道多倾角 semblance，看波形不连续）、曲率（看层面弯曲）、倾角方位（看产状突变）。河道边缘、采集脚印在相干体上也是暗线，但在曲率与方位上形态不同。","effect":"单用相干体时假断层 41 条，三通道融合后降到 14 条，断层召回基本不变。","trap":"属性要在同一个时窗与同一个网格上重采样后叠加；相干体的时窗越长越平滑、断层越粗，时窗要和断层规模匹配。","fig":"<svg viewBox=\"0 0 560 90\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"三属性融合\"><g font-size=\"10\" text-anchor=\"middle\"><rect x=\"16\" y=\"18\" width=\"108\" height=\"52\" rx=\"7\" fill=\"#fdfcf9\" stroke=\"#c9c2b0\"/><text x=\"70\" y=\"34\" fill=\"#41699b\" font-weight=\"700\">相干体</text><path d=\"M28 56 q18 -8 36 0 t36 0\" fill=\"none\" stroke=\"#9ba3a9\"/><path d=\"M62 42 L58 66\" stroke=\"#b05a51\" stroke-width=\"1.6\"/><text x=\"70\" y=\"82\" fill=\"#79828a\">暗线：断层 / 河道 / 脚印</text><rect x=\"150\" y=\"18\" width=\"108\" height=\"52\" rx=\"7\" fill=\"#fdfcf9\" stroke=\"#c9c2b0\"/><text x=\"204\" y=\"34\" fill=\"#767a2e\" font-weight=\"700\">曲率</text><path d=\"M162 56 q18 -10 36 0 t36 0\" fill=\"none\" stroke=\"#9ba3a9\"/><text x=\"204\" y=\"82\" fill=\"#79828a\">层面弯曲处才有响应</text><rect x=\"284\" y=\"18\" width=\"108\" height=\"52\" rx=\"7\" fill=\"#fdfcf9\" stroke=\"#c9c2b0\"/><text x=\"338\" y=\"34\" fill=\"#b26a39\" font-weight=\"700\">倾角方位</text><path d=\"M296 56 q18 -8 36 0 t36 0\" fill=\"none\" stroke=\"#9ba3a9\"/><text x=\"338\" y=\"82\" fill=\"#79828a\">产状突变带</text><rect x=\"418\" y=\"18\" width=\"124\" height=\"52\" rx=\"7\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\" stroke-opacity=\".5\"/><text x=\"480\" y=\"34\" fill=\"#235f51\" font-weight=\"700\">三通道融合</text><text x=\"480\" y=\"52\" fill=\"#79828a\">假断层 41 → 14 条</text></g></svg>"},{"name":"概率体训练","role":"算法","do":"128³ 子体滑窗训练，3D U-Net + dice loss，正样本按 20 倍加权采样；合成体预训练 60 轮，真实工区 3 个小块微调 12 轮。","effect":"小断距（<10 m）断层召回从 0.51 提到 0.79，这是人工最容易漏的一类。","trap":"dice loss 偏爱\"粗线\"：概率体阈值化后断层带会变宽，断距被系统高估。要么在后处理做骨架化，要么在损失里加一项惩罚厚度。","fig":"<svg viewBox=\"0 0 560 92\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"三维子体训练与类别不均衡\"><g font-size=\"10\"><text x=\"20\" y=\"26\" fill=\"#79828a\">体素类别占比：</text><rect x=\"130\" y=\"16\" width=\"360\" height=\"14\" rx=\"7\" fill=\"#c9c2b0\"/><text x=\"498\" y=\"27\" fill=\"#79828a\">非断层 98%</text><rect x=\"130\" y=\"36\" width=\"8\" height=\"14\" rx=\"3\" fill=\"#b05a51\"/><text x=\"146\" y=\"47\" fill=\"#b05a51\">断层 2%（加权 20×）</text><text x=\"20\" y=\"74\" fill=\"#79828a\">128³ 滑窗子体 · 3D U-Net · dice loss · 合成预训练 60 轮 → 真实微调 12 轮</text><text x=\"20\" y=\"88\" fill=\"#235f51\" font-weight=\"700\">小断距召回 0.51 → 0.79（人工最容易漏的那一类）</text></g></svg>"},{"name":"阈值化与骨架化","role":"质控","do":"概率体按阈值二值化，再逐行取概率加权质心连成 1 道宽的骨架线，最后拟合断面（走向、倾角、断距）。阈值由\"解释员一天能复核多少条\"反推，而不是由 F1 最高决定。","effect":"阈值 0.35：候选 41 条（召回 0.86），断距误差 ±9 m，骨架连通分量 1.4 条/断层。","trap":"阈值一降，召回和假断层一起涨。要按复核产能反推阈值，并把\"假断层\"单独统计——它消耗的是解释员的耐心。","fig":"<svg viewBox=\"0 0 560 94\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"阈值与业务指标的关系\"><g font-size=\"10\"><line x1=\"50\" y1=\"78\" x2=\"530\" y2=\"78\" stroke=\"#ddd7c8\"/><line x1=\"50\" y1=\"78\" x2=\"50\" y2=\"12\" stroke=\"#ddd7c8\"/><text x=\"54\" y=\"90\" fill=\"#79828a\">阈值 低 → 高</text><path d=\"M64 22 C 160 26, 260 40, 360 56 C 440 68, 480 74, 520 76\" fill=\"none\" stroke=\"#2f7d6b\" stroke-width=\"2\"/><text x=\"300\" y=\"34\" fill=\"#235f51\" font-weight=\"700\">断层召回</text><path d=\"M64 74 C 150 70, 250 60, 350 46 C 430 34, 480 26, 520 20\" fill=\"none\" stroke=\"#b05a51\" stroke-width=\"1.8\" stroke-dasharray=\"6 3\"/><text x=\"380\" y=\"40\" fill=\"#b05a51\">假断层条数</text><circle cx=\"230\" cy=\"34\" r=\"4\" fill=\"#767a2e\"/><text x=\"238\" y=\"48\" fill=\"#5d6022\" font-weight=\"700\">工作点：阈值 0.35</text><text x=\"238\" y=\"62\" fill=\"#79828a\">由\"解释员一天复核 8 条\"反推</text></g></svg>"},{"name":"人工复核闭环","role":"人工","do":"解释员只审查模型给出的 41 条候选，删掉假断层、补齐断断续续的部分；修改结果回灌成新的微调样本，每季度重训一次。","effect":"复核 11 天完成全工区，其中删假断层 9 条、补连 6 条；第二轮重训后假断层降到 5 条。","trap":"复核结果是有偏样本——只有模型\"拿不准\"的那部分才被认真看过，全量回灌会让模型在简单区域退化。要按\"模型置信度分层\"采样回灌。"}],"metrics":{"title":"怎么算「做对了」","html":"<p>这个场景最反直觉的一点：<b>像素级 dice 高不代表解释得好</b>。断层带被\"加粗\"时 dice 反而上升，但断距被高估、断面也不连续，对构造建模毫无用处。</p><div style=\"margin:10px 0 6px\"><svg viewBox=\"0 0 640 132\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"业务指标对照\"><g font-size=\"10.5\"><g><rect x=\"60\" y=\"18\" width=\"150\" height=\"24\" rx=\"4\" fill=\"#f5f2ea\"/><text x=\"70\" y=\"34\" fill=\"#79828a\">指标</text><rect x=\"216\" y=\"18\" width=\"120\" height=\"24\" rx=\"4\" fill=\"#f5f2ea\"/><text x=\"276\" y=\"34\" text-anchor=\"middle\" fill=\"#79828a\">人工基线</text><rect x=\"342\" y=\"18\" width=\"120\" height=\"24\" rx=\"4\" fill=\"#e6f1ec\"/><text x=\"402\" y=\"34\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">模型 + 复核</text><rect x=\"468\" y=\"18\" width=\"140\" height=\"24\" rx=\"4\" fill=\"#f5f2ea\"/><text x=\"538\" y=\"34\" text-anchor=\"middle\" fill=\"#79828a\">怎么读</text></g><g><rect x=\"60\" y=\"46\" width=\"150\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"70\" y=\"62\" fill=\"#4d565b\">断层条数召回</text><rect x=\"216\" y=\"46\" width=\"120\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"276\" y=\"62\" text-anchor=\"middle\" fill=\"#4d565b\">1.00（定义）</text><rect x=\"342\" y=\"46\" width=\"120\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"402\" y=\"62\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">0.86</text><rect x=\"468\" y=\"46\" width=\"140\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"478\" y=\"62\" fill=\"#79828a\">漏的多是小断距</text></g><g><rect x=\"60\" y=\"74\" width=\"150\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"70\" y=\"90\" fill=\"#4d565b\">断距误差</text><rect x=\"216\" y=\"74\" width=\"120\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"276\" y=\"90\" text-anchor=\"middle\" fill=\"#4d565b\">±14 m</text><rect x=\"342\" y=\"74\" width=\"120\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"402\" y=\"90\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">±9 m</text><rect x=\"468\" y=\"74\" width=\"140\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"478\" y=\"90\" fill=\"#79828a\">与井断点对比</text></g><g><rect x=\"60\" y=\"102\" width=\"150\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"70\" y=\"118\" fill=\"#4d565b\">解释周期</text><rect x=\"216\" y=\"102\" width=\"120\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"276\" y=\"118\" text-anchor=\"middle\" fill=\"#4d565b\">42 天</text><rect x=\"342\" y=\"102\" width=\"120\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"402\" y=\"118\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">11 天</text><rect x=\"468\" y=\"102\" width=\"140\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"478\" y=\"118\" fill=\"#79828a\">这才是付钱买的指标</text></g></g></svg></div><p style=\"margin-top:6px\">读法：真正值钱的是最下面一行。<b>召回 0.86 不是\"少了 14% 的断层\"，而是\"人工只需要复核 41 条而不是在 420 GB 里找 312 条\"</b>——漏掉的那部分里，绝大多数是断距小于 10 m 的次级断层，靠井断点与生产动态资料兜底。</p>"},"fails":[{"name":"用像素 dice 当主指标","why":"概率体被\"加粗\"时 dice 上升但断距高估、断面破碎，构造建模无法使用。改用条数召回 + 断距误差 + 连通分量数。"},{"name":"合成与真实频带不匹配","why":"合成体用 30 Hz 子波、真实工区主频 18 Hz，微调时网络要先忘掉合成分布，收敛慢且小断层召回上不去。先做频谱匹配。"},{"name":"把采集脚印当断层","why":"脚印在时间切片上呈规则网格状暗线，相干体上与断层同形。靠观测系统信息做方向性掩膜，或引入曲率通道区分。"}]},"demo":{"mode":"module","js":"demo/demo.js","label":"可运行示范","intro":"拖动断距与噪声看清\"断层在剖面上到底是什么样\"，再拖阈值观察召回与假断层如何此消彼长；开关多属性融合与骨架化，看假断层和断面连续性怎么变。","height":720}}};

  var __mod = { exports: {} };
  (function (module, exports) {
/* 地震断层自动解释 · 交互示范
   合成一张 Inline 地震剖面（12 条反射同相轴 + 一条斜穿断层 + 河道边缘 + 采集脚印），
   自实现「简化相干体」= 相邻三道在多倾角上的相似度（semblance）→ 断层概率体 →
   阈值化 + 骨架化（逐行概率加权质心连线）→ 断面，与真值对照，
   并给出业务指标：断层召回、假断层段数、断距误差、骨架连通分量数、待复核段数。 */
module.exports = {
  mount: function (root, api) {
    /* ---------- 网格：80 道 × 72 采样 × 8 ms —— 一张 576 ms 的 Inline 切片 ---------- */
    var NX = 80, NT = 72, DT = 8;
    var PW = 560, PH = 340, ML = 34, MR = 6, MT = 10, MB = 24;
    var WW = PW - ML - MR, HH = PH - MT - MB;
    var DX = WW / NX, DY = HH / NT;
    var TA = 6, TB = NT - 6;                    /* 断层在时间上的有效范围 */
    var DIPS = [-3, -2, -1, 0, 1, 2, 3], HW = 3; /* 倾角搜索范围（采样/道）与半窗长 */
    var MID = 0.32, TAU = 0.09;                  /* 概率头（sigmoid）的中心与陡度 */
    var NL = 12;                                 /* 同相轴条数 */

    var JADE = '#2f7d6b', CLAY = '#b26a39', BAD = '#b05a51',
        OPT = '#41699b', INK3 = '#79828a', INK2 = '#4d565b';

    /* ---------- 确定型伪随机 ---------- */
    function rnd(seed) {
      var s = (seed >>> 0) || 1;
      return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    }
    function nrnd(x, t, s) {
      var h = Math.sin(x * 127.1 + t * 311.7 + s * 74.7) * 43758.5453;
      return (h - Math.floor(h)) * 2 - 1;
    }
    function ricker(d, fc) { var a = Math.PI * fc * d, b = a * a; return (1 - 2 * b) * Math.exp(-b); }
    function f1(v) { return Math.round(v * 10) / 10; }
    function X(x) { return ML + (x + 0.5) * DX; }
    function Y(t) { return MT + (t + 0.5) * DY; }

    /* ---------- 断面真值：一条略弯的斜穿断面 x = XF(t) ---------- */
    function XF(t) { return 41 + 0.17 * (t - 34) + 0.0022 * (t - 34) * (t - 34); }

    /* ---------- 合成剖面 ---------- */
    function build(seed, throwSm, nz) {
      var r = rnd(seed * 7919 + 13), L = [], k;
      for (k = 0; k < NL; k++) {
        L.push({
          t0: 8 + k * 5.0,
          amp: (k % 2 ? -1 : 1) * (0.6 + 0.4 * r()),
          fc: 0.13 + 0.035 * r(),
          dip: (r() - 0.5) * 0.05,
          a: 0.5 + 0.9 * r(),
          lam: 24 + 30 * r(),
          ph: r() * 6.2832,
          k: k
        });
      }
      /* 采集脚印：源检点距不均 → 每 8 道一个周期，道间振幅与时移都不同 */
      var FP = [1, 0.35, -0.3, -0.75, -0.3, 0.35, 0.9, 0.2];
      var stX = [], amX = [];
      for (k = 0; k < NX; k++) { stX.push(nz * 1.6 * FP[k % 8]); amX.push(1 + nz * 1.1 * FP[k % 8]); }

      function tf(g, x) {
        var tc = g.t0 + g.dip * (x - 40) + g.a * Math.sin(6.2832 * x / g.lam + g.ph) + stX[x];
        var xf = XF(g.t0);                                  /* 该同相轴被错断的道号 */
        if (x >= xf) tc += throwSm;                          /* 断距：右盘整体下掉 */
        var dd = Math.abs(x - xf);
        if (dd < 6) tc += (x < xf ? 1 : -1) * 0.4 * Math.exp(-dd / 2.2);   /* 牵引拖拽 */
        if (g.t0 >= 8 && g.t0 <= 30 && x >= 54 && x <= 66) {                /* 河道杂乱带 */
          tc += 3.0 * Math.exp(-Math.pow((x - 60) / 5.5, 2)) + 1.35 * nrnd(x, g.k * 7 + 3, seed + 11);
        }
        return tc;
      }

      var tr = new Float32Array(NX * NT), x, t;
      for (x = 0; x < NX; x++) {
        for (t = 0; t < NT; t++) {
          var v = nz * 0.32 * nrnd(x, t, seed);
          var dF = Math.abs(x - XF(t)), inF = dF < 1.7;      /* 断层破碎带 */
          for (k = 0; k < NL; k++) {
            var g = L[k], amp = g.amp, tc = tf(g, x);
            if (g.t0 >= 8 && g.t0 <= 30 && x >= 54 && x <= 66) amp *= 0.55;
            if (g.t0 > 50) amp *= 0.7;                        /* 深层弱振幅 */
            if (inF) amp *= 0.5;                              /* 断面处同相轴被"抹断" */
            v += amp * ricker(t - tc, g.fc) * amX[x];
          }
          if (inF) v += (0.22 + 0.6 * nz) * nrnd(x + 61, t, seed + 5);   /* 断面绕射/破碎 */
          tr[x * NT + t] = v;
        }
      }
      return { tr: tr, L: L, tf: tf };
    }

    /* ---------- 简化相干体：三道 × 多倾角搜索的 semblance ---------- */
    function attrib(tr) {
      var N = NX * NT, C = new Float32Array(N), D = new Float32Array(N), K = new Float32Array(N);
      var x, t, pi, j, u;
      for (x = 0; x < NX; x++) {
        for (t = 0; t < NT; t++) {
          var best = -1, bp = 0;
          for (pi = 0; pi < DIPS.length; pi++) {
            var p = DIPS[pi], S = 0, Q = 0, n = 0;
            for (j = -1; j <= 1; j++) {
              var xx = x + j; if (xx < 0 || xx >= NX) continue;
              for (u = -HW; u <= HW; u++) {
                var tt = t + u + p * j; if (tt < 0 || tt >= NT) continue;
                var v = tr[xx * NT + tt]; S += v; Q += v * v; n++;
              }
            }
            if (n < 14) continue;
            var sm = (S * S) / (n * (Q + 1e-9));
            if (sm > best) { best = sm; bp = p; }
          }
          var c = best < 0 ? 0 : (best > 1 ? 1 : best);
          C[x * NT + t] = c; D[x * NT + t] = bp;
        }
      }
      /* 曲率属性 = 沿道方向的最优倾角梯度（沿时间平滑后再取差，压掉随机抖动） */
      for (x = 0; x < NX; x++) {
        for (t = 0; t < NT; t++) {
          var s = 0, m = 0;
          for (var q = -2; q <= 2; q++) {
            var tq = t + q; if (tq < 0 || tq >= NT) continue;
            var a = D[(x + 1 < NX ? x + 1 : x) * NT + tq];
            var b = D[(x - 1 >= 0 ? x - 1 : x) * NT + tq];
            s += Math.abs(a - b); m++;
          }
          var kk = m ? s / m / 5 : 0;
          K[x * NT + t] = kk > 1 ? 1 : kk;
        }
      }
      return { C: C, D: D, K: K };
    }

    /* ---------- 概率头：不连续度 →（可选）曲率门控 → sigmoid ---------- */
    function probHead(A, attrOn) {
      var N = NX * NT, P = new Float32Array(N);
      for (var i = 0; i < N; i++) {
        var d = 1 - A.C[i]; if (d < 0) d = 0; if (d > 1) d = 1;
        var raw = attrOn ? d * (0.45 + 0.55 * A.K[i]) : d;
        P[i] = 1 / (1 + Math.exp(-(raw - MID) / TAU));
      }
      return P;
    }

    /* ---------- 骨架化 / 连通域 ---------- */
    function components(P, thr, skel) {
      var out = [], t, x, i;
      if (skel) {
        /* 逐行取概率加权质心，再跨行连接 → 简化的骨架化（细化成一条 1 道宽的线） */
        var rows = [];
        for (t = 0; t < NT; t++) {
          var runs = [], cur = null;
          for (x = 0; x < NX; x++) {
            var w = P[x * NT + t] - thr;
            if (w > 0.02) { if (!cur) cur = { w: 0, sx: 0 }; cur.w += w; cur.sx += x * w; }
            else if (cur) { runs.push(cur); cur = null; }
          }
          if (cur) runs.push(cur);
          var rr = [];
          for (i = 0; i < runs.length; i++) {
            if (runs[i].w > 0.3) rr.push({ x: runs[i].sx / runs[i].w, w: runs[i].w });
          }
          rows.push(rr);
        }
        var nodes = [], idx = [];
        for (t = 0; t < NT; t++) idx.push([]);
        for (t = 0; t < NT; t++) {
          for (i = 0; i < rows[t].length; i++) { idx[t].push(nodes.length); nodes.push({ t: t, x: rows[t][i].x, w: rows[t][i].w }); }
        }
        var par = []; for (i = 0; i < nodes.length; i++) par.push(i);
        function find(a) { while (par[a] !== a) { par[a] = par[par[a]]; a = par[a]; } return a; }
        for (t = 1; t < NT; t++) {
          for (var ia = 0; ia < idx[t - 1].length; ia++) {
            for (var ib = 0; ib < idx[t].length; ib++) {
              if (Math.abs(nodes[idx[t - 1][ia]].x - nodes[idx[t][ib]].x) <= 2.3) {
                var ra = find(idx[t - 1][ia]), rb = find(idx[t][ib]);
                if (ra !== rb) par[ra] = rb;
              }
            }
          }
        }
        var groups = {}, key;
        for (i = 0; i < nodes.length; i++) {
          key = find(i);
          if (!groups[key]) groups[key] = [];
          groups[key].push(nodes[i]);
        }
        for (key in groups) {
          var g = groups[key];
          if (g.length < 3) continue;                 /* 滤掉碎噪点 */
          g.sort(function (a, b) { return a.t - b.t; });
          var rs = [], lastT = -9;
          for (i = 0; i < g.length; i++) {
            if (g[i].t === lastT) { if (g[i].w > rs[rs.length - 1].w) rs[rs.length - 1] = { t: g[i].t, x: g[i].x }; continue; }
            rs.push({ t: g[i].t, x: g[i].x }); lastT = g[i].t;
          }
          out.push({ rows: rs, size: g.length });
        }
      } else {
        /* 未骨架化：直接在二值掩膜上做 4 连通域（洪水填充） */
        var seen = new Float32Array(NX * NT), stack = [];
        for (var s0 = 0; s0 < NX * NT; s0++) {
          if (seen[s0] || P[s0] < thr) continue;
          stack.length = 0; stack.push(s0); seen[s0] = 1;
          var cells = [];
          while (stack.length) {
            var c = stack.pop(); cells.push(c);
            var cx = (c / NT) | 0, ct = c % NT, nb = [];
            if (ct > 0) nb.push(c - 1);
            if (ct < NT - 1) nb.push(c + 1);
            if (cx > 0) nb.push(c - NT);
            if (cx < NX - 1) nb.push(c + NT);
            for (i = 0; i < nb.length; i++) {
              var q2 = nb[i];
              if (seen[q2] || P[q2] < thr) continue;
              seen[q2] = 1; stack.push(q2);
            }
          }
          if (cells.length < 12) continue;            /* 滤掉碎噪点 */
          var byRow = {}, order = [];
          for (i = 0; i < cells.length; i++) {
            var ccx = (cells[i] / NT) | 0, cct = cells[i] % NT, w2 = P[cells[i]] - thr + 0.02;
            if (!byRow[cct]) { byRow[cct] = { t: cct, sx: 0, w: 0 }; order.push(cct); }
            byRow[cct].sx += ccx * w2; byRow[cct].w += w2;
          }
          order.sort(function (a, b) { return a - b; });
          var rs2 = [];
          for (i = 0; i < order.length; i++) rs2.push({ t: order[i], x: byRow[order[i]].sx / byRow[order[i]].w });
          out.push({ rows: rs2, size: cells.length });
        }
      }
      /* 与真值断面比对：命中率高的算"真断层"，其余算假断层 */
      for (i = 0; i < out.length; i++) {
        var hit = 0;
        for (var jj = 0; jj < out[i].rows.length; jj++) {
          if (Math.abs(out[i].rows[jj].x - XF(out[i].rows[jj].t)) <= 2.5) hit++;
        }
        out[i].match = out[i].rows.length ? hit / out[i].rows.length : 0;
        out[i].isTrue = out[i].match >= 0.35;
        out[i].span = out[i].rows[out[i].rows.length - 1].t - out[i].rows[0].t + 1;
      }
      out.sort(function (a, b) { return b.size - a.size; });
      return out;
    }

    /* ---------- 断距：跨断面两侧道的互相关（抛物线细化到亚采样） ---------- */
    function lagOf(tr, xa, xb, t) {
      var cs = [], bi = 0, bc = -2;
      for (var L = -9; L <= 9; L++) {
        var s = 0, sa = 0, sb = 0, n = 0;
        for (var u = -5; u <= 5; u++) {
          var ta = t + u, tb = t + u + L;
          if (ta < 0 || ta >= NT || tb < 0 || tb >= NT) continue;
          var A = tr[xa * NT + ta], B = tr[xb * NT + tb];
          s += A * B; sa += A * A; sb += B * B; n++;
        }
        if (n < 7) { cs.push(-2); continue; }
        var c = s / (Math.sqrt(sa * sb) + 1e-9);
        cs.push(c);
        if (c > bc) { bc = c; bi = L + 9; }
      }
      var y1 = cs[bi - 1], y2 = cs[bi], y3 = cs[bi + 1], den = y1 - 2 * y2 + y3;
      var d = (bi > 0 && bi < cs.length - 1 && Math.abs(den) > 1e-9) ? 0.5 * (y1 - y3) / den : 0;
      if (d > 1) d = 1; if (d < -1) d = -1;
      return (bi - 9) + d;
    }
    function throwErr(tr, comp, throwSm) {
      var lags = [];
      for (var i = 0; i < comp.rows.length; i += 2) {
        var xa = Math.round(comp.rows[i].x) - 4, xb = Math.round(comp.rows[i].x) + 4;
        if (xa < 0 || xb >= NX || comp.rows[i].t < 4 || comp.rows[i].t > NT - 5) continue;
        lags.push(lagOf(tr, xa, xb, comp.rows[i].t));
      }
      if (lags.length < 3) return null;
      lags.sort(function (a, b) { return a - b; });
      var med = lags[lags.length >> 1];
      return Math.abs(med - throwSm) * DT;
    }

    /* ---------------- 界面 ---------------- */
    root.innerHTML =
      '<div class="demo">' +
      '<div class="demo-head"><span class="kicker">INTERACTIVE · FAULT PROBABILITY WORKbench</span>' +
      '<h3>把阈值从 0.5 拉到 0.2：召回上去了，假断层也跟着上来了</h3>' +
      '<p>下面是一张合成的 Inline 剖面（12 条同相轴 + 一条斜穿断层 + 一处河道杂乱带 + 采集脚印）。' +
      '「▶ 自动解释」会用自实现的<b>简化相干算法</b>（相邻三道在多倾角上的相似度）算出每个采样点的断层概率，' +
      '再阈值化、骨架化成一条断面线，和绿线（真值）对照。' +
      '<b>拖动阈值，看召回与假断层怎么一起变。</b></p></div>' +

      '<div class="ctl-row">' +
      '<div class="ctl"><label>概率阈值 <output id="ft-oth">0.45</output></label><input type="range" id="ft-th" min="0.1" max="0.9" step="0.05" value="0.45"></div>' +
      '<div class="ctl"><label>断距 <output id="ft-odsp">40 ms</output></label><input type="range" id="ft-dsp" min="0" max="80" step="8" value="40"></div>' +
      '<div class="ctl"><label>噪声/脚印 <output id="ft-onz">0.35</output></label><input type="range" id="ft-nz" min="0" max="0.9" step="0.05" value="0.35"></div>' +
      '<button class="btn-x" id="ft-attr">多属性融合 · 开</button>' +
      '<button class="btn-x" id="ft-skel">骨架化后处理 · 开</button>' +
      '<button class="btn-x ghost" id="ft-run">▶ 自动解释</button>' +
      '</div>' +

      '<div class="grid2" style="grid-template-columns:1.35fr 1fr">' +
      '<div class="card-x"><h4>Inline 剖面 + 断层概率体（红色越浓＝越像断层）</h4>' +
      '<svg id="ft-sec" class="chart" viewBox="0 0 560 340" role="img" aria-label="地震剖面与断层概率体"></svg>' +
      '<div class="legend">' +
      '<span><i style="background:#2f7d6b"></i>真值断面</span>' +
      '<span><i style="background:#b05a51"></i>AI 解释断面</span>' +
      '<span><i style="background:#b05a51;opacity:.3"></i>断层概率体</span>' +
      '<span><i style="background:#41699b"></i>河道杂乱带</span>' +
      '<span><i style="background:#c9c2b4"></i>采集脚印</span></div></div>' +

      '<div class="card-x"><h4>业务指标（不是像素精度）</h4>' +
      '<div class="readouts">' +
      '<div class="ro"><span class="k">断层召回</span><b id="ft-v1">—</b></div>' +
      '<div class="ro"><span class="k">假断层段数</span><b id="ft-v2">—</b></div>' +
      '<div class="ro"><span class="k">断距误差</span><b id="ft-v3">—</b></div>' +
      '<div class="ro"><span class="k">骨架连通分量</span><b id="ft-v4">—</b></div>' +
      '<div class="ro"><span class="k">待复核段数</span><b id="ft-v5">—</b></div>' +
      '<div class="ro"><span class="k">质检结论</span><b id="ft-v6">—</b></div>' +
      '</div>' +
      '<div id="ft-bars" style="margin-top:10px"></div>' +
      '<div id="ft-vd" style="margin-top:8px;font-size:11.5px;line-height:1.7"></div>' +
      '</div></div>' +

      '<p class="note" id="ft-note"></p>' +
      '</div>';

    var $ = function (id) { return root.querySelector('#' + id); };
    var SEED = 20261023, NRUN = 0;
    var attrOn = true, skelOn = true;

    /* ---------------- 剖面绘制 ---------------- */
    function drawSection(M, P, thr, comps, skel) {
      var s = '', x, t, k, i;
      s += '<rect x="0" y="0" width="' + PW + '" height="' + PH + '" fill="#fbfaf6"/>';
      /* 采集脚印位置（每 8 道一道） */
      for (x = 0; x < NX; x++) {
        if (x % 8 !== 3) continue;
        s += '<line x1="' + f1(X(x)) + '" y1="' + MT + '" x2="' + f1(X(x)) + '" y2="' + (PH - MB) +
          '" stroke="#c9c2b4" stroke-width="1" stroke-dasharray="2 4" opacity=".55"/>';
      }
      /* 时间网格 */
      for (t = 0; t <= NT; t += 12) {
        var gy = f1(MT + t * DY);
        s += '<line x1="' + ML + '" y1="' + gy + '" x2="' + (PW - MR) + '" y2="' + gy + '" stroke="#efece1"/>';
        s += '<text x="' + (ML - 5) + '" y="' + f1(MT + t * DY + 3) + '" font-size="8.5" fill="#9ba3a9" ' +
          'text-anchor="end" font-family="ui-monospace,monospace">' + (t * DT) + '</text>';
      }
      s += '<text x="11" y="' + (PH / 2) + '" font-size="9" fill="' + INK3 + '" transform="rotate(-90 11 ' +
        (PH / 2) + ')" text-anchor="middle">时间 (ms)</text>';
      for (x = 0; x <= NX; x += 20) {
        s += '<text x="' + f1(ML + x * DX) + '" y="' + (PH - 8) + '" font-size="8.5" fill="#9ba3a9" ' +
          'text-anchor="middle" font-family="ui-monospace,monospace">' + (x * 25 + 1200) + '</text>';
      }

      /* 河道杂乱带 */
      s += '<rect x="' + f1(X(54)) + '" y="' + f1(Y(6)) + '" width="' + f1(X(66) - X(54)) +
        '" height="' + f1(Y(32) - Y(6)) + '" fill="' + OPT + '" fill-opacity=".05" stroke="' + OPT +
        '" stroke-opacity=".45" stroke-dasharray="3 3"/>' +
        '<text x="' + f1((X(54) + X(66)) / 2) + '" y="' + f1(Y(4)) + '" font-size="9" fill="' + OPT +
        '" text-anchor="middle">河道（杂乱弱振幅）</text>';

      /* 同相轴：沿 x 的波列，在断面处断开 */
      for (k = 0; k < M.L.length; k++) {
        var g = M.L[k], xf = XF(g.t0), xl = Math.floor(xf);
        var seg = [[0, xl], [xl + 1, NX - 1]];
        for (i = 0; i < seg.length; i++) {
          var d = '';
          for (x = seg[i][0]; x <= seg[i][1]; x++) {
            var yy = M.tf(g, x) + 1.3 * Math.sin(6.2832 * x / 3.6 + g.ph * 3);
            d += (x === seg[i][0] ? 'M' : 'L') + f1(X(x)) + ' ' + f1(Y(yy));
          }
          s += '<path d="' + d + '" fill="none" stroke="#2b3136" stroke-width="1.05" stroke-opacity="' +
            f1(0.35 + 0.42 * Math.abs(g.amp)) + '"/>';
        }
      }

      /* 概率体叠加 */
      for (x = 0; x < NX; x++) {
        for (t = 0; t < NT; t++) {
          var p = P[x * NT + t]; if (p < 0.18) continue;
          s += '<rect x="' + f1(X(x) - DX / 2) + '" y="' + f1(Y(t) - DY / 2) + '" width="' + f1(DX + 0.4) +
            '" height="' + f1(DY + 0.4) + '" fill="' + BAD + '" fill-opacity="' + f1(0.1 + 0.6 * p) + '"/>';
        }
      }

      /* 真值断面 */
      var dgt = '';
      for (t = TA; t <= TB; t++) dgt += (t === TA ? 'M' : 'L') + f1(X(XF(t))) + ' ' + f1(Y(t));
      s += '<path d="' + dgt + '" fill="none" stroke="' + JADE + '" stroke-width="2"/>';
      s += '<text x="' + f1(X(XF(TA)) - 6) + '" y="' + f1(Y(TA) - 4) + '" font-size="9" fill="' + JADE +
        '" text-anchor="end">真值断面</text>';

      /* 解释断面 */
      for (i = 0; i < comps.length; i++) {
        var c = comps[i], d2 = '';
        for (var jj = 0; jj < c.rows.length; jj++) {
          d2 += (jj ? 'L' : 'M') + f1(X(c.rows[jj].x)) + ' ' + f1(Y(c.rows[jj].t));
        }
        if (skel) {
          s += '<path d="' + d2 + '" fill="none" stroke="' + BAD + '" stroke-width="1.8" stroke-dasharray="5 3"/>';
        } else {
          s += '<path d="' + d2 + '" fill="none" stroke="' + BAD + '" stroke-width="6" stroke-opacity=".3"/>';
        }
      }
      if (comps.length) {
        var c0 = comps[0], rr = c0.rows[c0.rows.length - 1];
        s += '<text x="' + f1(X(rr.x) + 6) + '" y="' + f1(Y(rr.t) + 10) + '" font-size="9" fill="' + BAD +
          '">解释断面' + (skel ? '（骨架）' : '（未细化·被加粗）') + '</text>';
      }
      $('ft-sec').innerHTML = s;
    }

    /* ---------------- 主流程 ---------------- */
    function draw() {
      var thr = +$('ft-th').value;
      var throwMs = +$('ft-dsp').value;
      var nz = +$('ft-nz').value;
      $('ft-oth').textContent = thr.toFixed(2);
      $('ft-odsp').textContent = throwMs + ' ms';
      $('ft-onz').textContent = nz.toFixed(2);
      $('ft-attr').className = attrOn ? 'btn-x' : 'btn-x ghost';
      $('ft-attr').textContent = '多属性融合 · ' + (attrOn ? '开' : '关');
      $('ft-skel').className = skelOn ? 'btn-x' : 'btn-x ghost';
      $('ft-skel').textContent = '骨架化后处理 · ' + (skelOn ? '开' : '关');

      var throwSm = throwMs / DT;
      var M = build(SEED, throwSm, nz);
      var A = attrib(M.tr);
      var P = probHead(A, attrOn);

      /* 召回：真值断面 ±2 道内有没有被点亮的采样点 */
      var hit = 0, tot = 0, t, x;
      for (t = TA; t <= TB; t++) {
        tot++;
        var xc = Math.round(XF(t)), ok = 0;
        for (var d = -2; d <= 2; d++) {
          var xi = xc + d; if (xi < 0 || xi >= NX) continue;
          if (P[xi * NT + t] >= thr) { ok = 1; break; }
        }
        hit += ok;
      }
      var recall = tot ? hit / tot : 0;

      var comps = components(P, thr, skelOn);
      var falseN = 0, i;
      for (i = 0; i < comps.length; i++) if (!comps[i].isTrue) falseN++;

      /* 断距：只在最像断层的那个连通分量上量 */
      var best = null;
      for (i = 0; i < comps.length; i++) {
        if (!comps[i].isTrue || comps[i].rows.length < 6) continue;
        if (!best || comps[i].size > best.size) best = comps[i];
      }
      var terr = best ? throwErr(M.tr, best, throwSm) : null;

      drawSection(M, P, thr, comps, skelOn);

      /* 读数 */
      var v1 = $('ft-v1'), v2 = $('ft-v2'), v3 = $('ft-v3'), v4 = $('ft-v4'), v5 = $('ft-v5'), v6 = $('ft-v6');
      v1.textContent = (recall * 100).toFixed(0) + '%';
      v1.className = recall >= 0.85 ? 'ok' : (recall >= 0.6 ? 'warn' : 'bad');
      v2.textContent = String(falseN);
      v2.className = falseN <= 1 ? 'ok' : (falseN <= 3 ? 'warn' : 'bad');
      v3.textContent = terr === null ? '—' : terr.toFixed(1) + ' ms';
      v3.className = terr === null ? 'bad' : (terr <= 12 ? 'ok' : (terr <= 24 ? 'warn' : 'bad'));
      v4.textContent = String(comps.length);
      v4.className = comps.length <= 2 ? 'ok' : (comps.length <= 5 ? 'warn' : 'bad');
      v5.textContent = String(comps.length);
      v5.className = comps.length <= 2 ? 'ok' : (comps.length <= 5 ? 'warn' : 'bad');

      var verdict, vcls;
      if (throwMs < 24) { verdict = '断距太小·漏检'; vcls = 'bad'; }
      else if (recall >= 0.85 && falseN <= 1) { verdict = '可交付'; vcls = 'ok'; }
      else if (recall < 0.5) { verdict = '漏断层严重'; vcls = 'bad'; }
      else if (falseN >= 4) { verdict = '假断层多'; vcls = 'bad'; }
      else { verdict = '需人工复核'; vcls = 'warn'; }
      v6.textContent = verdict; v6.className = vcls;

      /* 逐项 bar-row */
      function bar(label, txt, frac, color) {
        return '<div class="bar-row"><span class="bl">' + label + '</span>' +
          '<span class="bt"><span class="bf" style="width:' + f1(Math.max(2, Math.min(100, frac * 100))) +
          '%;background:' + color + '"></span></span><span class="bv" style="color:' + color + '">' + txt + '</span></div>';
      }
      $('ft-bars').innerHTML =
        bar('断层召回', (recall * 100).toFixed(0) + '%', recall, JADE) +
        bar('假断层段数', String(falseN), Math.min(1, falseN / 8), falseN > 1 ? BAD : JADE) +
        bar('断距误差', terr === null ? '—' : terr.toFixed(0) + 'ms',
          terr === null ? 1 : Math.min(1, terr / 48), terr === null ? BAD : (terr <= 12 ? JADE : CLAY)) +
        bar('连通分量数', String(comps.length), Math.min(1, comps.length / 10),
          comps.length <= 2 ? JADE : (comps.length <= 5 ? CLAY : BAD)) +
        bar('断层像素占比', ((function () {
          var c = 0; for (var q = 0; q < NX * NT; q++) if (P[q] >= thr) c++;
          return c / (NX * NT);
        })() * 100).toFixed(2) + '%', 0.02, INK2);

      var vd = $('ft-vd');
      if (throwMs < 24) {
        vd.innerHTML = '<span class="tag-n">漏检</span> 断距 ' + throwMs + ' ms 只相当于 ' + throwSm.toFixed(1) +
          ' 个采样点，<b>还落在倾角搜索范围内——算法把它当成"地层在倾斜"，而不是断层</b>。' +
          '这是小断距断层天然检测不到的原因，不是模型不够大。';
      } else if (falseN >= 4 && recall >= 0.85) {
        vd.innerHTML = '<span class="tag-n">假断层主导</span> 召回 ' + (recall * 100).toFixed(0) +
          '%，但同时冒出 ' + falseN + ' 条假断层。这些段都要人工逐条看一遍——<b>复核量才是成本</b>。';
      } else if (recall < 0.5) {
        vd.innerHTML = '<span class="tag-n">阈值过高</span> 断面断成了碎片，召回只有 ' + (recall * 100).toFixed(0) +
          '%。把阈值往下压一点，或者开「多属性融合」把断面的响应提上来。';
      } else {
        vd.innerHTML = '<span class="tag-y">' + verdict + '</span> 召回 ' + (recall * 100).toFixed(0) +
          '%，假断层 ' + falseN + ' 条，连通分量 ' + comps.length + ' 个' +
          (terr === null ? '' : '，断距误差 ' + terr.toFixed(1) + ' ms') + '。';
      }

      var tp = [];
      tp.push('先做一组对照：<b>把「多属性融合」关掉</b>，只用相干一个通道。' +
        '采集脚印（每 8 道一道的道间时移）在相干体上同样是"暗线"，' +
        '假断层段数会从 ' + falseN + ' 条跳到十几条——<b>这就是"断层暗线"不等于"断层"</b>的具体样子：' +
        '河道边缘、盐丘边界、弱振幅带、采集脚印，全都长一个样。');
      tp.push('再拖 <b>阈值</b>：从 0.6 一路降到 0.2，你会看到<b>召回和假断层段数一起往上走</b>。' +
        '所以阈值不是一个"调参调到 F1 最高"的数，而是<b>业务参数</b>：' +
        '它定的是"这一轮要人工复核多少条"，应该按解释员一天能看多少条来反推。');
      tp.push('最后看 <b>骨架化</b>：关掉它，解释结果是一条又粗又糊的带子（这正是"用 dice 训练偏爱粗线"的后果），' +
        '断距也会被量偏；打开它，逐行取概率加权质心连成一条 1 道宽的线，' +
        '<b>连通分量数越少＝断面越连续</b>，这才是能交给构造建模的东西。');
      $('ft-note').innerHTML = tp.join('<br><br>');
    }

    ['ft-th', 'ft-dsp', 'ft-nz'].forEach(function (id) { $(id).addEventListener('input', draw); });
    $('ft-attr').addEventListener('click', function () { attrOn = !attrOn; draw(); });
    $('ft-skel').addEventListener('click', function () { skelOn = !skelOn; draw(); });
    $('ft-run').addEventListener('click', function () { NRUN++; SEED = (SEED * 1103515245 + 12345) >>> 0; draw(); });

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
