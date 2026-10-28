/* =========================================================
   e1-frac-param-optimize · 案例插件（由 _build/build.mjs 自动生成，勿手改）
   源头是案例包 frac-param-optimize-case/source.js + demo/，改内容请改源头后重新构建。
   ========================================================= */
(function () {
  var DEF = {"id":"e1-frac-param-optimize","sceneId":"e1","title":"压裂参数智能优化：代理模型 + 贝叶斯优化，把\"邻井经验\"换成\"搜出来的最优\"","status":"ready","version":"1.0.0","updated":"2026-10-23","tabs":{"background":{"label":"专业背景","lede":"压裂是页岩和致密油气的\"出生证明\"：不给储层造出缝，井就没有产量。一口井的设计要同时定<b>排量、砂比、液量、簇数</b>四个数——每个数取十档就是一万种组合，而每验证一种组合都要跑一次 40 分钟的压裂模拟。于是现场的做法退化成\"抄邻井\"。这个案例要做的，是把\"抄\"换成\"搜\"。","judge":[{"label":"任务类型","value":"代理模型 + 贝叶斯优化","desc":"多目标（EUR ↑ 成本 ↓）"},{"label":"数据门槛","value":"可靠压裂模拟器 + 数千段历史施工","desc":"样本靠仿真造"},{"label":"可见收益","value":"同预算下 EUR +18%，真模拟 7 500 次 → 90 次","desc":"省的就是钱"},{"label":"难度","value":"高","html":"<span class=\"dtag\" data-d=\"高\">难度 高</span>"}],"sections":[{"no":1,"en":"PROBLEM","title":"当前做法与问题","html":"<p>压裂设计的四个参数互相耦合：排量决定缝能不能延伸，砂比决定缝合上之后还留不留通道，液量决定改造体积，簇数决定一段段\"咬\"多深。<b>任何一个单独调都不代表整体最优</b>。</p><p>组合数是指数的，而模拟很贵——这是所有仿真驱动设计问题的共同困境。现场的真实答案是\"抄邻井\"，但应力剖面、脆性指数、天然裂缝每口井都不同，<b>抄来的方案在三分之一的井上明显次优</b>。</p><div class=\"figure\"><svg viewBox=\"0 0 640 236\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"参数组合爆炸\"><text x=\"16\" y=\"18\" font-size=\"10.5\" font-weight=\"700\" fill=\"#4d565b\">压裂设计要同时定四个数，每个数取 10 档，组合就是一万种</text><g font-size=\"10\"><text x=\"30\" y=\"52\" fill=\"#4d565b\">排量</text><rect x=\"70\" y=\"40\" width=\"180\" height=\"18\" rx=\"9\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\"/><text x=\"160\" y=\"53\" text-anchor=\"middle\" fill=\"#235f51\">2 – 8 m³/min</text><text x=\"30\" y=\"80\" fill=\"#4d565b\">砂比</text><rect x=\"70\" y=\"68\" width=\"180\" height=\"18\" rx=\"9\" fill=\"#f8ecdf\" stroke=\"#b26a39\"/><text x=\"160\" y=\"81\" text-anchor=\"middle\" fill=\"#8e5229\">5 – 25 %</text><text x=\"30\" y=\"108\" fill=\"#4d565b\">液量</text><rect x=\"70\" y=\"96\" width=\"180\" height=\"18\" rx=\"9\" fill=\"#e7eef9\" stroke=\"#41699b\"/><text x=\"160\" y=\"109\" text-anchor=\"middle\" fill=\"#31527a\">800 – 2000 m³</text><text x=\"30\" y=\"136\" fill=\"#4d565b\">簇数</text><rect x=\"70\" y=\"124\" width=\"180\" height=\"18\" rx=\"9\" fill=\"#f1f1dd\" stroke=\"#767a2e\"/><text x=\"160\" y=\"137\" text-anchor=\"middle\" fill=\"#5d6022\">3 – 12 簇/段</text></g><path d=\"M262 84 h34\" stroke=\"#9ba3a9\" stroke-width=\"1.4\" fill=\"none\" marker-end=\"url(#e1a1)\"/><g transform=\"translate(308,34)\"><rect x=\"0\" y=\"0\" width=\"300\" height=\"118\" rx=\"8\" fill=\"#f5f2ea\" stroke=\"#ddd7c8\"/><text x=\"150\" y=\"30\" text-anchor=\"middle\" font-size=\"26\" font-weight=\"700\" fill=\"#b05a51\">10 ⁴ = 10 000</text><text x=\"150\" y=\"52\" text-anchor=\"middle\" font-size=\"9.5\" fill=\"#79828a\">种参数组合，每一种都要用模拟器算一遍才知道好坏</text><rect x=\"24\" y=\"64\" width=\"252\" height=\"14\" rx=\"3\" fill=\"#e9e4d8\"/><rect x=\"24\" y=\"64\" width=\"252\" height=\"14\" rx=\"3\" fill=\"#b05a51\" opacity=\".78\"/><text x=\"150\" y=\"75\" text-anchor=\"middle\" font-size=\"8.5\" fill=\"#fff\">一次模拟 40 min × 10 000 = 278 天（单机）</text><text x=\"150\" y=\"96\" text-anchor=\"middle\" font-size=\"9.5\" fill=\"#8e5229\">这就是为什么\"直接扫模拟器\"永远不在选项里</text></g><text x=\"16\" y=\"182\" font-size=\"10\" fill=\"#4d565b\">现场的真实做法是<b>套用邻井经验</b>：把旁边那口井的方案抄过来改两个数。</text><text x=\"16\" y=\"200\" font-size=\"10\" fill=\"#b05a51\">但应力剖面和天然裂缝每口井都不一样——<tspan font-weight=\"700\">抄来的方案在 1/3 的井上明显次优</tspan>。</text><text x=\"16\" y=\"220\" font-size=\"9.5\" fill=\"#79828a\">优化要解决的不是\"算得动\"，而是\"<tspan fill=\"#235f51\">在算得动的预算里，把最值得试的那几个组合找出来</tspan>\"。</text><defs><marker id=\"e1a1\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#9ba3a9\"/></marker></defs></svg></div><div class=\"figcap\"><b>图 1</b><span>参数组合爆炸。<b>四个参数各取 10 档就是一万种组合</b>，单机算一年——所以问题从来不是\"算得动\"，而是\"在算得动的预算里，怎么挑出最值得试的那几个\"。</span></div>"},{"no":2,"en":"INTERVENTION","title":"AI 能做什么","html":"<p>思路是<b>把\"贵的一次评估\"和\"便宜的一万次搜索\"分开</b>：先用几十次真模拟训一个代理模型（surrogate），它 0.02 秒就能给出任意参数组合的预测<b>和不确定度</b>；然后在代理模型上随便搜；搜索发现\"可能更好但不确定\"的点时，再花一次真模拟去确认。这就是贝叶斯优化。</p><div class=\"figure\"><svg viewBox=\"0 0 640 250\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"代理模型与模拟器\"><text x=\"16\" y=\"18\" font-size=\"10.5\" font-weight=\"700\" fill=\"#4d565b\">先花 40 次真模拟，训一个\"秒回的假模拟器\"，然后在它上面随便搜</text><rect x=\"20\" y=\"34\" width=\"180\" height=\"62\" rx=\"8\" fill=\"#fbfaf6\" stroke=\"#41699b\"/><text x=\"110\" y=\"56\" text-anchor=\"middle\" font-size=\"10.5\" font-weight=\"700\" fill=\"#41699b\">压裂模拟器（真）</text><text x=\"110\" y=\"72\" text-anchor=\"middle\" font-size=\"9\" fill=\"#79828a\">输入地质 + 参数 → 裂缝几何与 EUR</text><rect x=\"230\" y=\"34\" width=\"180\" height=\"62\" rx=\"8\" fill=\"#fbfaf6\" stroke=\"#2f7d6b\"/><text x=\"320\" y=\"56\" text-anchor=\"middle\" font-size=\"10.5\" font-weight=\"700\" fill=\"#2f7d6b\">40 组拉丁超立方样本</text><text x=\"320\" y=\"72\" text-anchor=\"middle\" font-size=\"9\" fill=\"#79828a\">把参数空间\"均匀铺满\"，不留大空档</text><rect x=\"440\" y=\"34\" width=\"180\" height=\"62\" rx=\"8\" fill=\"#fbfaf6\" stroke=\"#b26a39\"/><text x=\"530\" y=\"56\" text-anchor=\"middle\" font-size=\"10.5\" font-weight=\"700\" fill=\"#b26a39\">代理模型（快）</text><text x=\"530\" y=\"72\" text-anchor=\"middle\" font-size=\"9\" fill=\"#79828a\">任意参数 → 0.02 s 出预测 + 不确定度</text><g stroke=\"#9ba3a9\" stroke-width=\"1.4\" fill=\"none\" marker-end=\"url(#e1a2)\"><path d=\"M200 65 h26\"/><path d=\"M410 65 h26\"/></g><text x=\"320\" y=\"112\" text-anchor=\"middle\" font-size=\"9.5\" fill=\"#4d565b\">训练样本 = 真模拟，只花 40 × 40 min ≈ <b>1 天</b></text><text x=\"20\" y=\"146\" font-size=\"10\" font-weight=\"700\" fill=\"#4d565b\">评一次的速度（对数刻度）</text><text x=\"20\" y=\"156\" font-size=\"9\" fill=\"#4d565b\">压裂模拟器</text><rect x=\"20\" y=\"160\" width=\"170\" height=\"13\" rx=\"3\" fill=\"#f5f2ea\"/><rect x=\"20\" y=\"160\" width=\"166.6\" height=\"13\" rx=\"3\" fill=\"#41699b\"/><text x=\"196\" y=\"171\" font-size=\"9\" font-weight=\"700\" fill=\"#41699b\">40 min / 次</text><text x=\"20\" y=\"186\" font-size=\"9\" fill=\"#4d565b\">代理模型</text><rect x=\"20\" y=\"190\" width=\"170\" height=\"13\" rx=\"3\" fill=\"#f5f2ea\"/><rect x=\"20\" y=\"190\" width=\"17.0\" height=\"13\" rx=\"3\" fill=\"#b26a39\"/><text x=\"196\" y=\"201\" font-size=\"9\" font-weight=\"700\" fill=\"#b26a39\">0.02 s / 次（快 12 万倍）</text><text x=\"20\" y=\"222\" font-size=\"9.5\" fill=\"#79828a\">条形长度是对数刻度——直观看不出差别，差别恰恰在这里：<tspan font-weight=\"700\" fill=\"#235f51\">10 000 次搜索，代理模型 3 分钟，模拟器一年</tspan>。</text><text x=\"16\" y=\"242\" font-size=\"9.5\" fill=\"#b05a51\">代理模型不是替代模拟器，而是<b>替模拟器挡掉 99% 的无效组合</b>——发现可疑的好点，再回头花真模拟确认。</text><defs><marker id=\"e1a2\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#9ba3a9\"/></marker></defs></svg></div><div class=\"figcap\"><b>图 2</b><span>代理模型与模拟器的分工。注意条形图是<b>对数刻度</b>：12 万倍的速度差让\"搜一万次\"从一年变成三分钟——但代理模型的每个预测都要当成\"有误差的建议\"，不能当成真相。</span></div><p>第二个要点：<b>产量和成本是冲突的</b>。砂比加一档，EUR 涨一点、成本涨一截，不存在\"又便宜又高产\"的组合。所以这类问题的正确输出不是\"一个最优解\"，而是<b>一条帕累托前沿</b>——把不值得考虑的组合全部划掉，剩下的一小段线交给工程师按预算挑。</p><div class=\"figure\"><svg viewBox=\"0 0 640 210\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"帕累托前沿\"><text x=\"16\" y=\"18\" font-size=\"10.5\" font-weight=\"700\" fill=\"#4d565b\">产量和成本是冲突的：答案不是\"一个点\"，是\"一条线\"</text><rect x=\"52\" y=\"30\" width=\"368\" height=\"148\" fill=\"#fbfaf6\" stroke=\"#ece7da\"/><path d=\"M71.9 165.4L78.8 153.9L84.1 152.1L86.9 149.3L91.7 148.0L160.7 122.5L193.9 105.1L194.4 99.6L205.4 96.0L210.2 92.5L225.8 86.6L241.4 86.3L247.5 80.9L269.5 77.1L296.1 75.9L320.5 64.5L321.7 60.1L364.2 55.2L396.0 51.1\" fill=\"none\" stroke=\"#b26a39\" stroke-width=\"2.4\" stroke-linecap=\"round\"/><circle cx=\"206.7\" cy=\"97.6\" r=\"2.6\" fill=\"rgba(65,105,155,.4)\"/><circle cx=\"377.6\" cy=\"60.1\" r=\"2.6\" fill=\"rgba(65,105,155,.4)\"/><circle cx=\"210.2\" cy=\"92.5\" r=\"3.8\" fill=\"#b26a39\"/><circle cx=\"193.9\" cy=\"105.1\" r=\"3.8\" fill=\"#b26a39\"/><circle cx=\"332.7\" cy=\"69.7\" r=\"2.6\" fill=\"rgba(65,105,155,.4)\"/><circle cx=\"265.0\" cy=\"89.2\" r=\"2.6\" fill=\"rgba(65,105,155,.4)\"/><circle cx=\"305.0\" cy=\"76.8\" r=\"2.6\" fill=\"rgba(65,105,155,.4)\"/><circle cx=\"364.2\" cy=\"55.2\" r=\"3.8\" fill=\"#b26a39\"/><circle cx=\"86.9\" cy=\"149.3\" r=\"3.8\" fill=\"#b26a39\"/><circle cx=\"205.4\" cy=\"96.0\" r=\"3.8\" fill=\"#b26a39\"/><circle cx=\"78.8\" cy=\"153.9\" r=\"3.8\" fill=\"#b26a39\"/><circle cx=\"321.7\" cy=\"60.1\" r=\"3.8\" fill=\"#b26a39\"/><circle cx=\"91.7\" cy=\"148.0\" r=\"3.8\" fill=\"#b26a39\"/><circle cx=\"348.3\" cy=\"68.0\" r=\"2.6\" fill=\"rgba(65,105,155,.4)\"/><circle cx=\"396.0\" cy=\"51.1\" r=\"3.8\" fill=\"#b26a39\"/><circle cx=\"372.8\" cy=\"66.5\" r=\"2.6\" fill=\"rgba(65,105,155,.4)\"/><circle cx=\"344.8\" cy=\"69.9\" r=\"2.6\" fill=\"rgba(65,105,155,.4)\"/><circle cx=\"234.3\" cy=\"87.1\" r=\"2.6\" fill=\"rgba(65,105,155,.4)\"/><circle cx=\"361.6\" cy=\"65.0\" r=\"2.6\" fill=\"rgba(65,105,155,.4)\"/><circle cx=\"296.1\" cy=\"75.9\" r=\"3.8\" fill=\"#b26a39\"/><circle cx=\"320.5\" cy=\"64.5\" r=\"3.8\" fill=\"#b26a39\"/><circle cx=\"382.7\" cy=\"61.7\" r=\"2.6\" fill=\"rgba(65,105,155,.4)\"/><circle cx=\"271.4\" cy=\"86.5\" r=\"2.6\" fill=\"rgba(65,105,155,.4)\"/><circle cx=\"241.4\" cy=\"86.3\" r=\"3.8\" fill=\"#b26a39\"/><circle cx=\"325.7\" cy=\"73.6\" r=\"2.6\" fill=\"rgba(65,105,155,.4)\"/><circle cx=\"360.8\" cy=\"60.8\" r=\"2.6\" fill=\"rgba(65,105,155,.4)\"/><circle cx=\"221.8\" cy=\"94.8\" r=\"2.6\" fill=\"rgba(65,105,155,.4)\"/><circle cx=\"84.1\" cy=\"152.1\" r=\"3.8\" fill=\"#b26a39\"/><circle cx=\"160.7\" cy=\"122.5\" r=\"3.8\" fill=\"#b26a39\"/><circle cx=\"247.5\" cy=\"80.9\" r=\"3.8\" fill=\"#b26a39\"/><circle cx=\"302.9\" cy=\"77.6\" r=\"2.6\" fill=\"rgba(65,105,155,.4)\"/><circle cx=\"200.5\" cy=\"104.1\" r=\"2.6\" fill=\"rgba(65,105,155,.4)\"/><circle cx=\"351.6\" cy=\"69.8\" r=\"2.6\" fill=\"rgba(65,105,155,.4)\"/><circle cx=\"225.8\" cy=\"86.6\" r=\"3.8\" fill=\"#b26a39\"/><circle cx=\"71.9\" cy=\"165.4\" r=\"3.8\" fill=\"#b26a39\"/><circle cx=\"369.6\" cy=\"56.8\" r=\"2.6\" fill=\"rgba(65,105,155,.4)\"/><circle cx=\"358.3\" cy=\"63.6\" r=\"2.6\" fill=\"rgba(65,105,155,.4)\"/><circle cx=\"276.4\" cy=\"79.4\" r=\"2.6\" fill=\"rgba(65,105,155,.4)\"/><circle cx=\"269.5\" cy=\"77.1\" r=\"3.8\" fill=\"#b26a39\"/><circle cx=\"95.9\" cy=\"158.9\" r=\"2.6\" fill=\"rgba(65,105,155,.4)\"/><circle cx=\"342.2\" cy=\"71.5\" r=\"2.6\" fill=\"rgba(65,105,155,.4)\"/><circle cx=\"305.3\" cy=\"79.1\" r=\"2.6\" fill=\"rgba(65,105,155,.4)\"/><circle cx=\"194.4\" cy=\"99.6\" r=\"3.8\" fill=\"#b26a39\"/><circle cx=\"351.0\" cy=\"71.2\" r=\"2.6\" fill=\"rgba(65,105,155,.4)\"/><circle cx=\"238.2\" cy=\"94.2\" r=\"2.6\" fill=\"rgba(65,105,155,.4)\"/><circle cx=\"372.6\" cy=\"60.9\" r=\"2.6\" fill=\"rgba(65,105,155,.4)\"/><rect x=\"134.15789473684208\" y=\"128.6\" width=\"10\" height=\"10\" fill=\"none\" stroke=\"#7a3a33\" stroke-width=\"2\"/><text x=\"148.15789473684208\" y=\"126.6\" font-size=\"9\" fill=\"#7a3a33\">邻井经验（被支配）</text><text x=\"236\" y=\"198\" text-anchor=\"middle\" font-size=\"9.5\" fill=\"#6d757a\">单段改造成本 →</text><text x=\"16\" y=\"104\" font-size=\"9.5\" fill=\"#6d757a\" transform=\"rotate(-90 16 104)\">EUR（压后累计产量）→</text><text x=\"428\" y=\"60\" font-size=\"9.5\" fill=\"#8e5229\" font-weight=\"700\">帕累托前沿</text><text x=\"428\" y=\"76\" font-size=\"9\" fill=\"#79828a\">线上每个点都\"无法在不牺牲</text><text x=\"428\" y=\"90\" font-size=\"9\" fill=\"#79828a\">另一个目标的前提下变好\"</text><text x=\"428\" y=\"112\" font-size=\"9\" fill=\"#4d565b\">前沿下方全是</text><text x=\"428\" y=\"126\" font-size=\"9\" fill=\"#4d565b\">被支配的方案：</text><text x=\"428\" y=\"140\" font-size=\"9\" fill=\"#b05a51\">无论怎么调，</text><text x=\"428\" y=\"154\" font-size=\"9\" fill=\"#b05a51\">都不如线上某个组合</text><text x=\"16\" y=\"200\" font-size=\"9.5\" fill=\"#4d565b\">机器的价值在于<b>把 10 000 个组合里被支配的 9 900 个全部划掉</b>；剩下 5 个怎么挑，是工程师的决定（预算、井网、水责任）。</text></svg></div><div class=\"figcap\"><b>图 3</b><span>帕累托前沿。<b>灰点全部被棕线支配</b>——无论怎么调都不如线上某个组合。优化器的价值就是把这 99% 的组合划掉；\"前沿上怎么挑\"是人的决定。</span></div>"},{"no":3,"en":"DATA","title":"你需要准备什么","html":"<p>这个场景对数据的依赖很特殊：<b>样本不是现场测出来的，是模拟器算出来的</b>。所以第一前提是有一个校准过的压裂模拟器——至少在本区块的历史井上复现过施工压力和压后产量，否则代理模型学到的是\"错误物理的平滑版\"。</p><p>需要三样东西：①<b>地质与岩石力学模型</b>（应力剖面、脆性指数、天然裂缝，来自测井与岩心）；②<b>历史施工曲线</b>（排量、压力、砂比，用于校准模拟器）；③<b>压后产能</b>（测试产量、EUR，用于校准目标函数）。</p><p>样本布点上有一个便宜但关键的讲究：<b>用拉丁超立方（LHS）而不是网格</b>——同样的样本数，LHS 在每一维都铺满取值范围，不留大空档。</p><div class=\"figure\"><svg viewBox=\"0 0 640 170\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"采样策略对比\"><text x=\"16\" y=\"16\" font-size=\"10.5\" font-weight=\"700\" fill=\"#4d565b\">训练样本怎么布点：网格采样 vs 拉丁超立方（LHS）</text><g transform=\"translate(24,30)\"><rect x=\"0\" y=\"0\" width=\"180\" height=\"110\" fill=\"#fbfaf6\" stroke=\"#ddd7c8\"/><circle cx=\"18\" cy=\"18\" r=\"3\" fill=\"#9ba3a9\"/><circle cx=\"54\" cy=\"18\" r=\"3\" fill=\"#9ba3a9\"/><circle cx=\"90\" cy=\"18\" r=\"3\" fill=\"#9ba3a9\"/><circle cx=\"126\" cy=\"18\" r=\"3\" fill=\"#9ba3a9\"/><circle cx=\"162\" cy=\"18\" r=\"3\" fill=\"#9ba3a9\"/><circle cx=\"18\" cy=\"40\" r=\"3\" fill=\"#9ba3a9\"/><circle cx=\"54\" cy=\"40\" r=\"3\" fill=\"#9ba3a9\"/><circle cx=\"90\" cy=\"40\" r=\"3\" fill=\"#9ba3a9\"/><circle cx=\"126\" cy=\"40\" r=\"3\" fill=\"#9ba3a9\"/><circle cx=\"162\" cy=\"40\" r=\"3\" fill=\"#9ba3a9\"/><circle cx=\"18\" cy=\"62\" r=\"3\" fill=\"#9ba3a9\"/><circle cx=\"54\" cy=\"62\" r=\"3\" fill=\"#9ba3a9\"/><circle cx=\"90\" cy=\"62\" r=\"3\" fill=\"#9ba3a9\"/><circle cx=\"126\" cy=\"62\" r=\"3\" fill=\"#9ba3a9\"/><circle cx=\"162\" cy=\"62\" r=\"3\" fill=\"#9ba3a9\"/><circle cx=\"18\" cy=\"84\" r=\"3\" fill=\"#9ba3a9\"/><circle cx=\"54\" cy=\"84\" r=\"3\" fill=\"#9ba3a9\"/><circle cx=\"90\" cy=\"84\" r=\"3\" fill=\"#9ba3a9\"/><circle cx=\"126\" cy=\"84\" r=\"3\" fill=\"#9ba3a9\"/><circle cx=\"162\" cy=\"84\" r=\"3\" fill=\"#9ba3a9\"/><circle cx=\"18\" cy=\"106\" r=\"3\" fill=\"#9ba3a9\"/><circle cx=\"54\" cy=\"106\" r=\"3\" fill=\"#9ba3a9\"/><circle cx=\"90\" cy=\"106\" r=\"3\" fill=\"#9ba3a9\"/><circle cx=\"126\" cy=\"106\" r=\"3\" fill=\"#9ba3a9\"/><circle cx=\"162\" cy=\"106\" r=\"3\" fill=\"#9ba3a9\"/><text x=\"90\" y=\"126\" text-anchor=\"middle\" font-size=\"9\" fill=\"#4d565b\">网格采样：规整，但 25 点只能各取 5 档</text></g><g transform=\"translate(234,30)\"><rect x=\"0\" y=\"0\" width=\"180\" height=\"110\" fill=\"#fbfaf6\" stroke=\"#ddd7c8\"/><circle cx=\"119.1\" cy=\"71.9\" r=\"3\" fill=\"#2f7d6b\"/><circle cx=\"14.8\" cy=\"29.5\" r=\"3\" fill=\"#2f7d6b\"/><circle cx=\"52.8\" cy=\"92.9\" r=\"3\" fill=\"#2f7d6b\"/><circle cx=\"114.1\" cy=\"77.7\" r=\"3\" fill=\"#2f7d6b\"/><circle cx=\"89.0\" cy=\"102.4\" r=\"3\" fill=\"#2f7d6b\"/><circle cx=\"75.7\" cy=\"11.2\" r=\"3\" fill=\"#2f7d6b\"/><circle cx=\"23.8\" cy=\"36.5\" r=\"3\" fill=\"#2f7d6b\"/><circle cx=\"9.6\" cy=\"53.6\" r=\"3\" fill=\"#2f7d6b\"/><circle cx=\"153.2\" cy=\"19.2\" r=\"3\" fill=\"#2f7d6b\"/><circle cx=\"51.7\" cy=\"24.3\" r=\"3\" fill=\"#2f7d6b\"/><circle cx=\"163.7\" cy=\"5.4\" r=\"3\" fill=\"#2f7d6b\"/><circle cx=\"100.5\" cy=\"45.1\" r=\"3\" fill=\"#2f7d6b\"/><circle cx=\"121.5\" cy=\"13.2\" r=\"3\" fill=\"#2f7d6b\"/><circle cx=\"158.6\" cy=\"84.7\" r=\"3\" fill=\"#2f7d6b\"/><circle cx=\"41.5\" cy=\"52.1\" r=\"3\" fill=\"#2f7d6b\"/><circle cx=\"25.0\" cy=\"37.7\" r=\"3\" fill=\"#2f7d6b\"/><circle cx=\"169.2\" cy=\"89.2\" r=\"3\" fill=\"#2f7d6b\"/><circle cx=\"60.2\" cy=\"41.2\" r=\"3\" fill=\"#2f7d6b\"/><circle cx=\"147.6\" cy=\"77.2\" r=\"3\" fill=\"#2f7d6b\"/><circle cx=\"80.3\" cy=\"97.8\" r=\"3\" fill=\"#2f7d6b\"/><circle cx=\"35.5\" cy=\"64.4\" r=\"3\" fill=\"#2f7d6b\"/><circle cx=\"72.6\" cy=\"98.3\" r=\"3\" fill=\"#2f7d6b\"/><circle cx=\"135.9\" cy=\"68.1\" r=\"3\" fill=\"#2f7d6b\"/><circle cx=\"130.9\" cy=\"59.0\" r=\"3\" fill=\"#2f7d6b\"/><circle cx=\"95.4\" cy=\"28.3\" r=\"3\" fill=\"#2f7d6b\"/><path d=\"M0 0 v110\" stroke=\"#eef1e9\"/><path d=\"M0 0 h180\" stroke=\"#eef1e9\"/><path d=\"M36 0 v110\" stroke=\"#eef1e9\"/><path d=\"M0 22 h180\" stroke=\"#eef1e9\"/><path d=\"M72 0 v110\" stroke=\"#eef1e9\"/><path d=\"M0 44 h180\" stroke=\"#eef1e9\"/><path d=\"M108 0 v110\" stroke=\"#eef1e9\"/><path d=\"M0 66 h180\" stroke=\"#eef1e9\"/><path d=\"M144 0 v110\" stroke=\"#eef1e9\"/><path d=\"M0 88 h180\" stroke=\"#eef1e9\"/><path d=\"M180 0 v110\" stroke=\"#eef1e9\"/><path d=\"M0 110 h180\" stroke=\"#eef1e9\"/><text x=\"90\" y=\"126\" text-anchor=\"middle\" font-size=\"9\" fill=\"#235f51\">LHS：同样 25 点，每行每列恰好一个</text></g><g font-size=\"9.5\" fill=\"#4d565b\" transform=\"translate(444,30)\"><text x=\"0\" y=\"14\" font-weight=\"700\">为什么非要 LHS：</text><text x=\"0\" y=\"34\">同样的样本数，LHS 在每一维</text><text x=\"0\" y=\"50\">都\"铺满\"了整个取值范围，</text><text x=\"0\" y=\"70\">不会出现一大块从没采样过的空档。</text><text x=\"0\" y=\"92\" fill=\"#b05a51\">空档 = 代理模型在那里瞎猜，</text><text x=\"0\" y=\"108\" fill=\"#b05a51\">优化器偏偏最爱往空档里钻。</text></g><text x=\"16\" y=\"160\" font-size=\"9.5\" fill=\"#79828a\">初始样本的布点是<b>唯一一次\"不靠优化\"的决定</b>，也是最便宜的一次纠错机会——布错了后面全在填坑。</text></svg></div><div class=\"figcap\"><b>图 4</b><span>采样策略对比。<b>空档 = 代理模型在那里瞎猜</b>，而优化器偏偏最爱往空档里钻——初始布点是这个流程里唯一一次\"不靠优化\"的决定，也是最便宜的一次纠错机会。</span></div>"},{"no":4,"en":"DIFFICULTY","title":"技术难度与失真问题","html":"<p>代理模型一定会失真，难点是<b>让失真看得见、让搜索自己绕开失真</b>。强非均质井的响应面上常有\"假峰\"——看起来不错、物理上不成立的区域（比如砂比高到泵送不了）。只看代理模型的预测，搜索会被假峰骗走；采集函数（EI）同时看\"预测好不好\"和\"这里有多不确定\"，会主动安排模拟去填样本空档，于是谷被重新发现、假峰被戳穿。</p><div class=\"figure\"><svg viewBox=\"0 0 640 196\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"代理模型失真与采集函数\"><text x=\"16\" y=\"18\" font-size=\"10.5\" font-weight=\"700\" fill=\"#4d565b\">代理模型一定会失真，关键是<b>让失真看得见</b></text><rect x=\"46\" y=\"30\" width=\"254\" height=\"110\" fill=\"#fbfaf6\" stroke=\"#ece7da\"/><path d=\"M46.0 122.2L49.2 120.9L52.4 119.5L55.5 118.0L58.7 116.3L61.9 114.6L65.0 112.8L68.2 110.9L71.4 108.9L74.6 106.8L77.8 104.6L80.9 102.4L84.1 100.2L87.3 98.0L90.4 95.8L93.6 93.7L96.8 91.6L100.0 89.7L103.2 88.0L106.3 86.5L109.5 85.2L112.7 84.1L115.9 83.3L119.0 82.8L122.2 82.6L125.4 82.7L128.6 83.1L131.7 83.7L134.9 84.6L138.1 85.7L141.3 87.0L144.4 88.5L147.6 90.0L150.8 91.6L153.9 93.1L157.1 94.6L160.3 96.1L163.5 97.4L166.6 98.5L169.8 99.4L173.0 100.1L176.2 100.5L179.3 100.7L182.5 100.6L185.7 100.2L188.9 99.6L192.0 98.8L195.2 97.8L198.4 96.6L201.6 95.2L204.8 93.8L207.9 92.3L211.1 90.9L214.3 89.4L217.5 88.1L220.6 86.9L223.8 85.9L227.0 85.0L230.2 84.4L233.3 84.1L236.5 84.0L239.7 84.1L242.8 84.6L246.0 85.2L249.2 86.2L252.4 87.3L255.5 88.6L258.7 90.1L261.9 91.7L265.1 93.3L268.3 95.1L271.4 96.9L274.6 98.7L277.8 100.4L281.0 102.2L284.1 103.9L287.3 105.5L290.5 107.1L293.6 108.6L296.8 110.0L300.0 111.4\" fill=\"none\" stroke=\"#b26a39\" stroke-width=\"2\"/><path d=\"M46.0 136.4L49.2 136.3L52.4 136.3L55.5 136.1L58.7 135.9L61.9 135.5L65.0 134.9L68.2 134.1L71.4 132.8L74.6 131.0L77.8 128.4L80.9 125.1L84.1 120.7L87.3 115.2L90.4 108.5L93.6 100.6L96.8 91.7L100.0 82.1L103.2 72.1L106.3 62.1L109.5 52.9L112.7 44.9L115.9 38.8L119.0 34.9L122.2 33.5L125.4 34.9L128.6 38.8L131.7 44.9L134.9 52.9L138.1 62.1L141.3 72.1L144.4 82.1L147.6 91.7L150.8 100.6L153.9 108.5L157.1 115.2L160.3 120.7L163.5 125.1L166.6 128.4L169.8 131.0L173.0 132.8L176.2 132.4L179.3 130.9L182.5 129.1L185.7 126.8L188.9 124.0L192.0 120.7L195.2 116.7L198.4 112.1L201.6 107.0L204.8 101.3L207.9 95.1L211.1 88.7L214.3 82.1L217.5 75.5L220.6 69.2L223.8 63.4L227.0 58.3L230.2 54.2L233.3 51.2L236.5 49.4L239.7 49.0L242.8 50.0L246.0 52.2L249.2 55.7L252.4 60.2L255.5 65.6L258.7 71.7L261.9 78.1L265.1 84.7L268.3 91.3L271.4 97.7L274.6 103.6L277.8 109.1L281.0 114.0L284.1 118.4L287.3 122.1L290.5 125.2L293.6 127.8L296.8 129.9L300.0 131.5\" fill=\"none\" stroke=\"#2f7d6b\" stroke-width=\"1.6\"/><circle cx=\"58.7\" cy=\"135.9\" r=\"3\" fill=\"#41699b\"/><circle cx=\"86.6\" cy=\"116.4\" r=\"3\" fill=\"#41699b\"/><circle cx=\"114.6\" cy=\"41.0\" r=\"3\" fill=\"#41699b\"/><circle cx=\"142.5\" cy=\"76.1\" r=\"3\" fill=\"#41699b\"/><circle cx=\"170.5\" cy=\"131.4\" r=\"3\" fill=\"#41699b\"/><circle cx=\"198.4\" cy=\"112.1\" r=\"3\" fill=\"#41699b\"/><circle cx=\"226.3\" cy=\"59.3\" r=\"3\" fill=\"#41699b\"/><circle cx=\"254.3\" cy=\"63.4\" r=\"3\" fill=\"#41699b\"/><circle cx=\"282.2\" cy=\"115.8\" r=\"3\" fill=\"#41699b\"/><circle cx=\"297.5\" cy=\"130.2\" r=\"3\" fill=\"#41699b\"/><text x=\"52\" y=\"44\" font-size=\"9\" fill=\"#2f7d6b\">— 真响应（模拟器）</text><text x=\"52\" y=\"58\" font-size=\"9\" fill=\"#b26a39\">— 10 个样本的代理模型</text><text x=\"180.62\" y=\"76\" font-size=\"8.5\" fill=\"#b05a51\">两个峰之间的谷被抹平了</text><g font-size=\"9.5\" fill=\"#4d565b\" transform=\"translate(322,30)\"><text x=\"0\" y=\"14\" font-weight=\"700\">采集函数（EI）怎么救：</text><text x=\"0\" y=\"34\">它不只看\"代理说这里好\"，</text><text x=\"0\" y=\"50\">还看\"代理对这里有多不确定\"。</text><text x=\"0\" y=\"70\">样本少的空档不确定性大，</text><text x=\"0\" y=\"86\">EI 会主动安排一次模拟去填——</text><text x=\"0\" y=\"106\">于是谷被重新发现，假峰被戳穿。</text><rect x=\"0\" y=\"120\" width=\"296\" height=\"40\" rx=\"6\" fill=\"#f5f2ea\" stroke=\"#ddd7c8\"/><text x=\"12\" y=\"136\" fill=\"#8e5229\">这就是\"用可视化看误差\"的价值：</text><text x=\"12\" y=\"152\" fill=\"#8e5229\">误差图上红的地方，就是代理在撒谎的地方。</text></g><text x=\"16\" y=\"176\" font-size=\"9.5\" fill=\"#79828a\">左图：蓝点是仅有的 10 次真模拟。代理模型（棕）把两峰之间的深谷插值成了一条平滑的过渡——<tspan fill=\"#b05a51\">如果只信它，最优就找错了</tspan>。</text><text x=\"16\" y=\"192\" font-size=\"9.5\" fill=\"#79828a\">强非均质井上常有这种\"假峰\"：看起来很好，其实物理上不成立（比如砂比高到泵送不了）。</text></svg></div><div class=\"figcap\"><b>图 5</b><span>代理失真与采集函数。<b>误差图上红的地方就是代理在撒谎的地方</b>——这条经验不只属于压裂，所有\"代理模型 + 优化\"的场景都适用：把不确定性画出来，比把模型做复杂更值钱。</span></div>"}]},"workflow":{"title":"案例：某致密气区块 24 口井的压裂参数优化","lead":["区块 24 口水平井，原先全部按邻井经验设计；同区块井间产量相差 3.8 倍，说明\"抄方案\"确实在漏钱。已有商用压裂模拟器的区块模型，单次全井模拟约 40 分钟。","项目周期 5 个月：**前 2 个月校准模拟器，建模 3 周，剩下 2 个月全在现场验证和修约束。**"],"stats":[{"label":"覆盖井数","value":"24 口"},{"label":"真模拟次数","value":"90 次/井"},{"label":"EUR 提升","value":"中位 +18%"},{"label":"施工符合率","value":"92%"}],"steps":[{"name":"地质建模与模拟器校准","role":"数据","do":"用测井应力剖面、岩心脆性指数和微地震资料建区块地质模型；拿 8 口历史井的施工曲线（排量/压力/砂比）校准模拟器，直到压后产量误差 < 12%。","effect":"模拟器在本区块可信，为后面所有\"仿真造样本\"打下地基。","trap":"跳过校准直接用缺省参数的模拟器。后面代理模型学到的是错误物理的平滑版，优化结果看起来很好、现场一塌糊涂。"},{"name":"参数空间定义与 LHS 采样","role":"数据","do":"和压裂工程师一起定四个参数的物理上下限（含泵送约束）；用拉丁超立方布 40 个初始样本点，跑真模拟。","effect":"40 组样本覆盖全部参数空间，没有任何一维出现大空档。","trap":"参数上下限拍脑袋定。砂比上限要问泵送能力，排量上限要问设备功率——约束在采样阶段就要进去，否则样本全浪费在泵不进去的组合上。","fig":"<svg viewBox=\"0 0 640 148\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"参数如何影响目标\"><text x=\"16\" y=\"16\" font-size=\"10.5\" font-weight=\"700\" fill=\"#4d565b\">先把\"哪个参数动什么\"画清楚，再谈优化</text><g font-size=\"9.5\"><rect x=\"20\" y=\"30\" width=\"120\" height=\"88\" rx=\"8\" fill=\"#f5f2ea\" stroke=\"#ddd7c8\"/><text x=\"80\" y=\"48\" text-anchor=\"middle\" font-weight=\"700\" fill=\"#4d565b\">设计参数</text><text x=\"34\" y=\"66\" fill=\"#4d565b\">· 排量（泵的强度）</text><text x=\"34\" y=\"82\" fill=\"#4d565b\">· 砂比（支撑剂）</text><text x=\"34\" y=\"98\" fill=\"#4d565b\">· 液量（改造范围）</text><text x=\"34\" y=\"114\" fill=\"#4d565b\">· 簇数（分几段咬）</text></g><g stroke=\"#9ba3a9\" stroke-width=\"1.3\" fill=\"none\"><path d=\"M146 52 C 200 40, 240 40, 292 46\" marker-end=\"url(#e1a3)\"/><path d=\"M146 74 C 210 70, 250 62, 292 62\" marker-end=\"url(#e1a3)\"/><path d=\"M146 96 C 210 100, 250 106, 292 100\" marker-end=\"url(#e1a3)\"/><path d=\"M146 114 C 200 126, 240 128, 292 118\" marker-end=\"url(#e1a3)\"/></g><g font-size=\"9.5\"><rect x=\"298\" y=\"30\" width=\"150\" height=\"88\" rx=\"8\" fill=\"#fbfaf6\" stroke=\"#2f7d6b\"/><text x=\"373\" y=\"48\" text-anchor=\"middle\" font-weight=\"700\" fill=\"#235f51\">中间量（模拟器算）</text><text x=\"310\" y=\"66\" fill=\"#4d565b\">缝长 / 缝高 / SRV</text><text x=\"310\" y=\"82\" fill=\"#4d565b\">导流能力分布</text><text x=\"310\" y=\"98\" fill=\"#4d565b\">砂堤铺置形态</text><text x=\"310\" y=\"114\" fill=\"#4d565b\">施工压力窗口</text><path d=\"M454 74 h30\" stroke=\"#9ba3a9\" stroke-width=\"1.3\" fill=\"none\" marker-end=\"url(#e1a3)\"/><rect x=\"490\" y=\"30\" width=\"130\" height=\"88\" rx=\"8\" fill=\"#f8ecdf\" stroke=\"#b26a39\"/><text x=\"555\" y=\"48\" text-anchor=\"middle\" font-weight=\"700\" fill=\"#8e5229\">两个目标</text><text x=\"502\" y=\"66\" fill=\"#4d565b\">EUR ↑（产量）</text><text x=\"502\" y=\"82\" fill=\"#4d565b\">成本 ↓（砂+液+泵时）</text><text x=\"502\" y=\"98\" fill=\"#b05a51\">两者冲突</text><text x=\"502\" y=\"114\" fill=\"#79828a\">→ 多目标优化</text></g><text x=\"16\" y=\"140\" font-size=\"9.5\" fill=\"#79828a\">这张图是整个案例的<b>地图</b>：左边的四个旋钮、中间模拟器负责的物理、右边两个打架的目标。</text><defs><marker id=\"e1a3\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#9ba3a9\"/></marker></defs></svg>"},{"name":"代理模型训练与误差可视化","role":"模型","do":"用 RBF/高斯过程拟合样本，输出预测值和不确定度；每个参数切片都出一张\"预测 + 误差\"热图给工程师看。","effect":"代理模型在留出集上 R² ≈ 0.93；误差图直接指出样本稀的区域。","trap":"只报 R² 不画误差图。R² 是全局平均，局部失真藏在里面——而优化器恰恰专挑局部失真的地方钻。"},{"name":"贝叶斯优化与帕累托前沿","role":"模型","do":"在代理模型上按 EI 逐点选真模拟目标，共 50 次额外模拟；对全部评估结果算非支配排序，输出 EUR-成本帕累托前沿。","effect":"同样 90 次真模拟，找到的方案比网格搜索高 9%、比随机搜索高 6%；前沿上保留 5 档可选方案。","trap":"只输出单点最优。工程师要面对预算、井网和水责任的多重约束——给一条前沿加一个权重滑块，比给一个\"最优解\"有用得多。","fig":"<svg viewBox=\"0 0 640 176\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"优化循环\"><g font-size=\"10\" font-weight=\"700\" text-anchor=\"middle\"><rect x=\"18\" y=\"34\" width=\"128\" height=\"52\" rx=\"8\" fill=\"#f5f2ea\" stroke=\"#767a2e\"/><text x=\"82\" y=\"56\" fill=\"#5d6022\">代理模型</text><text x=\"82\" y=\"72\" font-size=\"9\" font-weight=\"400\" fill=\"#79828a\">0.02 s 出预测</text><rect x=\"176\" y=\"34\" width=\"128\" height=\"52\" rx=\"8\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\"/><text x=\"240\" y=\"56\" fill=\"#235f51\">在代理上搜索</text><text x=\"240\" y=\"72\" font-size=\"9\" font-weight=\"400\" fill=\"#79828a\">10 000 组随便试</text><rect x=\"334\" y=\"34\" width=\"128\" height=\"52\" rx=\"8\" fill=\"#e7eef9\" stroke=\"#41699b\"/><text x=\"398\" y=\"56\" fill=\"#31527a\">采集函数 EI</text><text x=\"398\" y=\"72\" font-size=\"9\" font-weight=\"400\" fill=\"#79828a\">挑最值得真算的点</text><rect x=\"492\" y=\"34\" width=\"130\" height=\"52\" rx=\"8\" fill=\"#f8ecdf\" stroke=\"#b26a39\"/><text x=\"557\" y=\"56\" fill=\"#8e5229\">真模拟器</text><text x=\"557\" y=\"72\" font-size=\"9\" font-weight=\"400\" fill=\"#79828a\">花 40 min 确认</text></g><g stroke=\"#9ba3a9\" stroke-width=\"1.4\" fill=\"none\" marker-end=\"url(#e1a4)\"><path d=\"M146 60 h26\"/><path d=\"M304 60 h26\"/><path d=\"M462 60 h26\"/></g><path d=\"M557 90 v34 H82 v-34\" stroke=\"#b26a39\" stroke-width=\"1.4\" fill=\"none\" marker-end=\"url(#e1a4)\"/><text x=\"320\" y=\"140\" text-anchor=\"middle\" font-size=\"9.5\" fill=\"#8e5229\">每确认一个点，样本库 +1，代理模型重训一遍——循环直到预算用完</text><text x=\"320\" y=\"160\" text-anchor=\"middle\" font-size=\"9.5\" fill=\"#4d565b\">这个循环里<b>每一次决策都被画出来</b>：响应面长什么样、EI 指向哪、样本怎么聚——<tspan fill=\"#235f51\">看得见，工程师才敢信</tspan></text><defs><marker id=\"e1a4\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#9ba3a9\"/></marker></defs></svg>"},{"name":"现场验证与约束回填","role":"人工","do":"选 6 口井按推荐方案施工，实测产量回填样本库；把现场暴露出的新约束（砂堤堵塞、压力窗口）写回参数空间，重跑优化。","effect":"三轮后推荐方案施工符合率 92%， EUR 中位提升 18%；优化流程沉淀成区块的标准设计工具。","trap":"优化完就交付。现场一定会告诉你模型不知道的约束——不回填，下一口井还会犯同样的错。","fig":"<svg viewBox=\"0 0 640 168\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"验收指标\"><g font-size=\"10.5\"><text x=\"16\" y=\"28\" fill=\"#b05a51\" font-weight=\"700\">✗ 只报\"最优 EUR +18%\"</text><text x=\"200\" y=\"28\" font-size=\"9.5\" fill=\"#79828a\">不报前沿、不报可施工性，工程师没法用它做决定</text><text x=\"16\" y=\"64\" fill=\"#4d565b\">前沿上给出的可选方案数</text><rect x=\"230\" y=\"52\" width=\"260\" height=\"18\" rx=\"4\" fill=\"#f5f2ea\"/><rect x=\"230\" y=\"52\" width=\"120\" height=\"18\" rx=\"4\" fill=\"#b26a39\"/><text x=\"500\" y=\"66\" fill=\"#8e5229\" font-weight=\"700\">5 档</text><text x=\"540\" y=\"66\" font-size=\"9\" fill=\"#79828a\">从\"省成本\"到\"要产量\"</text><text x=\"16\" y=\"100\" fill=\"#4d565b\">真模拟次数（预算内）</text><rect x=\"230\" y=\"88\" width=\"260\" height=\"18\" rx=\"4\" fill=\"#f5f2ea\"/><rect x=\"230\" y=\"88\" width=\"44\" height=\"18\" rx=\"4\" fill=\"#41699b\"/><text x=\"500\" y=\"102\" fill=\"#31527a\" font-weight=\"700\">90 次</text><text x=\"540\" y=\"102\" font-size=\"9\" fill=\"#79828a\">网格法要 7 500 次</text><text x=\"16\" y=\"136\" fill=\"#4d565b\">现场施工符合率</text><rect x=\"230\" y=\"124\" width=\"260\" height=\"18\" rx=\"4\" fill=\"#f5f2ea\"/><rect x=\"230\" y=\"124\" width=\"230\" height=\"18\" rx=\"4\" fill=\"#2f7d6b\"/><text x=\"500\" y=\"138\" fill=\"#235f51\" font-weight=\"700\">92%</text><text x=\"540\" y=\"138\" font-size=\"9\" fill=\"#79828a\">推荐参数泵得进去</text></g><text x=\"16\" y=\"162\" font-size=\"9.5\" fill=\"#79828a\">优化给的是\"数学上最好\"，现场要的是\"<tspan fill=\"#235f51\">数学上好且泵得进去</tspan>\"——约束必须在搜索里，不能在最后过滤。</text></svg>"}],"metrics":{"title":"怎么算「做对了」","html":"<p>这个场景最常见的汇报陷阱是<b>只报一个\"最优解 +18%\"</b>。工程师没法用一个数做决定：预算不够怎么办？水责任怎么算？砂比泵不进去怎么办？</p><div class=\"figure\"><svg viewBox=\"0 0 640 168\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"验收指标\"><g font-size=\"10.5\"><text x=\"16\" y=\"28\" fill=\"#b05a51\" font-weight=\"700\">✗ 只报\"最优 EUR +18%\"</text><text x=\"200\" y=\"28\" font-size=\"9.5\" fill=\"#79828a\">不报前沿、不报可施工性，工程师没法用它做决定</text><text x=\"16\" y=\"64\" fill=\"#4d565b\">前沿上给出的可选方案数</text><rect x=\"230\" y=\"52\" width=\"260\" height=\"18\" rx=\"4\" fill=\"#f5f2ea\"/><rect x=\"230\" y=\"52\" width=\"120\" height=\"18\" rx=\"4\" fill=\"#b26a39\"/><text x=\"500\" y=\"66\" fill=\"#8e5229\" font-weight=\"700\">5 档</text><text x=\"540\" y=\"66\" font-size=\"9\" fill=\"#79828a\">从\"省成本\"到\"要产量\"</text><text x=\"16\" y=\"100\" fill=\"#4d565b\">真模拟次数（预算内）</text><rect x=\"230\" y=\"88\" width=\"260\" height=\"18\" rx=\"4\" fill=\"#f5f2ea\"/><rect x=\"230\" y=\"88\" width=\"44\" height=\"18\" rx=\"4\" fill=\"#41699b\"/><text x=\"500\" y=\"102\" fill=\"#31527a\" font-weight=\"700\">90 次</text><text x=\"540\" y=\"102\" font-size=\"9\" fill=\"#79828a\">网格法要 7 500 次</text><text x=\"16\" y=\"136\" fill=\"#4d565b\">现场施工符合率</text><rect x=\"230\" y=\"124\" width=\"260\" height=\"18\" rx=\"4\" fill=\"#f5f2ea\"/><rect x=\"230\" y=\"124\" width=\"230\" height=\"18\" rx=\"4\" fill=\"#2f7d6b\"/><text x=\"500\" y=\"138\" fill=\"#235f51\" font-weight=\"700\">92%</text><text x=\"540\" y=\"138\" font-size=\"9\" fill=\"#79828a\">推荐参数泵得进去</text></g><text x=\"16\" y=\"162\" font-size=\"9.5\" fill=\"#79828a\">优化给的是\"数学上最好\"，现场要的是\"<tspan fill=\"#235f51\">数学上好且泵得进去</tspan>\"——约束必须在搜索里，不能在最后过滤。</text></svg></div><p style=\"margin-top:8px\">正确的交付是三样：<b>帕累托前沿（多档可选）、真模拟次数（预算是否现实）、施工符合率（推荐是否可执行）</b>。第三个最容易被漏——数学上最优、现场泵不进去的方案，价值是零。</p>"},"fails":[{"name":"跳过模拟器校准","why":"代理模型学到的是\"错误物理的平滑版\"，优化结果现场一塌糊涂。必须先在历史井上把产量误差校到 12% 以内。"},{"name":"只报单点最优","why":"工程师要面对预算和施工约束。给帕累托前沿加权重滑块，比给一个\"最优解\"有用得多。"},{"name":"只报 R² 不画误差图","why":"R² 是全局平均，局部失真藏在里面，而优化器专挑局部失真的地方钻。误差图上红的地方就是代理在撒谎的地方。"},{"name":"约束放在最后过滤","why":"砂比泵不进去的组合如果在搜索里不被排除，预算会浪费大半。物理约束要在采样和搜索阶段就生效。"},{"name":"优化完不做现场回填","why":"现场一定会暴露模型不知道的约束（砂堤堵塞、压力窗口）。不回填，下一口井还在犯同样的错。"}]},"demo":{"mode":"module","js":"demo/demo.js","label":"可运行示范","intro":"一张代理模型的响应面热图（可切\"预测 / 误差 / 采集函数\"三个视图）、一条 EUR-成本帕累托前沿、三条搜索策略在同样 50 次预算下的 best-so-far 曲线。点\"贝叶斯 +10\"看样本怎么自己往值得花真模拟的地方跑；换到 C 井（有假峰）看随机搜索怎么被骗、贝叶斯怎么逃出来。","height":1080}}};

  var __mod = { exports: {} };
  (function (module, exports) {
/* 压裂参数智能优化 · 交互示范
   两个设计参数（排量、砂比）决定两个互相冲突的目标（EUR 越大越好、成本越低越好）。
   "真函数" pretend 是压裂模拟器：评一次 40 分钟；
   代理模型用 40 个初始样本的 RBF 插值，贝叶斯优化按采集函数（EI）挑下一个最值得评的点。
   看得见的部分：响应面热图 / 代理误差图 / 采集函数图、样本点怎么聚集、
   EUR-成本散点上的帕累托前沿、三种搜索策略在同样预算下的 best-so-far 曲线。纯前端即时计算。 */
module.exports = {
  mount: function (root, api) {
    var JADE = '#2f7d6b', CLAY = '#b26a39', BAD = '#b05a51', OPT = '#41699b', OLIVE = '#767a2e';
    var NW = 200, NH = 150;                       /* 响应面热图分辨率 */
    var QMIN = 2, QMAX = 8, CMIN = 5, CMAX = 25;  /* 排量 m³/min、砂比 % */
    var BUDGET = 50;                              /* 三策略对比用的模拟预算 */
    var EI_N = 64, EI_M = 48;                     /* 采集函数网格 */

    /* ---------- 三口"井"：真函数不一样，难点也不一样 ---------- */
    var WELLS = [
      { name: 'A 井 · 常规砂岩', note: '峰在中间、脊平缓，40 个初始样本就够代理模型学个大概',
        u0: 0.55, v0: 0.52, su: 0.20, sv: 0.19, ridgeA: 0.55, ridgeB: 0.20, ridgeW: 0.35,
        bump2: null, scale: 1.0, expU: 0.34, expV: 0.42 },
      { name: 'B 井 · 致密灰岩', note: '最优贴着高排量高砂比的角，脊很陡——邻井经验（左下角方块）差得远',
        u0: 0.80, v0: 0.78, su: 0.14, sv: 0.13, ridgeA: 0.95, ridgeB: 0.02, ridgeW: 0.55,
        bump2: null, scale: 0.86, expU: 0.34, expV: 0.42 },
      { name: 'C 井 · 强非均质', note: '有个"看起来也不错"的假峰——随机搜索经常被骗进去，贝叶斯靠"哪里不确定去哪里"逃出来',
        u0: 0.74, v0: 0.30, su: 0.13, sv: 0.15, ridgeA: 0.30, ridgeB: 0.52, ridgeW: 0.40,
        bump2: { u: 0.22, v: 0.78, su: 0.16, sv: 0.14, h: 0.93 }, scale: 0.92, expU: 0.34, expV: 0.42 }
    ];

    function lcg(seed) {
      var s = seed >>> 0;
      return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    }
    function clamp01(x) { return x < 0 ? 0 : (x > 1 ? 1 : x); }

    /* ---------- 模拟器（真函数）：评一次"40 分钟" ---------- */
    function sim(w, u, v) {
      var g = Math.exp(-((u - w.u0) * (u - w.u0) / (2 * w.su * w.su) + (v - w.v0) * (v - w.v0) / (2 * w.sv * w.sv)));
      var ridge = w.ridgeW * Math.exp(-(v - (w.ridgeA * u + w.ridgeB)) * (v - (w.ridgeA * u + w.ridgeB)) / 0.018);
      var b2 = w.bump2 ? w.bump2.h * Math.exp(-((u - w.bump2.u) * (u - w.bump2.u) / (2 * w.bump2.su * w.bump2.su) +
        (v - w.bump2.v) * (v - w.bump2.v) / (2 * w.bump2.sv * w.bump2.sv))) : 0;
      var raw = Math.max(g, Math.max(ridge, b2)) + 0.25 * ridge + 0.12 * u;
      return w.scale * (0.38 + 0.62 * Math.min(1, raw / 1.05));
    }
    /* 成本：液量（排量×泵时）+ 砂量（砂比），砂比太高还有设备风险加成 */
    function cost(u, v, w) {
      var c = 0.30 + 0.42 * u + 0.20 * v + 0.10 * u * u + 0.24 * Math.max(0, v - 0.75);
      return c * (0.85 + 0.3 * w.scale);
    }
    var KMQ = QMAX - QMIN, KMC = CMAX - CMIN;

    /* ---------- 代理模型：RBF 插值（带方差，供采集函数用） ---------- */
    function makeSurrogate(pts) {
      var n = pts.length, L = 0.20, i, j, k;
      var K = [];
      for (i = 0; i < n; i++) {
        K.push(new Float64Array(n));
        for (j = 0; j < n; j++) {
          var du = pts[i][0] - pts[j][0], dv = pts[i][1] - pts[j][1];
          K[i][j] = Math.exp(-(du * du + dv * dv) / (2 * L * L));
        }
      }
      for (i = 0; i < n; i++) K[i][i] += 1e-8;
      /* 增广矩阵 [K | y | I] 一次消元，同时得到 α = K⁻¹y 和 K⁻¹ */
      var A = [];
      for (i = 0; i < n; i++) A.push(new Float64Array(2 * n + 1));
      for (i = 0; i < n; i++) {
        for (j = 0; j < n; j++) A[i][j] = K[i][j];
        A[i][n] = pts[i][2];
        A[i][n + 1 + i] = 1;
      }
      for (i = 0; i < n; i++) {
        var p = i, mx = Math.abs(A[i][i]);
        for (j = i + 1; j < n; j++) if (Math.abs(A[j][i]) > mx) { mx = Math.abs(A[j][i]); p = j; }
        if (p !== i) { var tmp = A[i]; A[i] = A[p]; A[p] = tmp; }
        var pv = A[i][i] || 1e-12;
        for (j = 0; j < n; j++) {
          if (j === i) continue;
          var f = A[j][i] / pv;
          if (f === 0) continue;
          for (k = i; k < 2 * n + 1; k++) A[j][k] -= f * A[i][k];
        }
      }
      var alpha = new Float64Array(n), inv = [];
      for (i = 0; i < n; i++) {
        var pv2 = A[i][i] || 1e-12;
        alpha[i] = A[i][n] / pv2;
        var row = new Float64Array(n);
        for (j = 0; j < n; j++) row[j] = A[i][n + 1 + j] / pv2;
        inv.push(row);
      }
      function kv(u, v) {
        var out = new Float64Array(n);
        for (var i2 = 0; i2 < n; i2++) {
          var du2 = u - pts[i2][0], dv2 = v - pts[i2][1];
          out[i2] = Math.exp(-(du2 * du2 + dv2 * dv2) / (2 * L * L));
        }
        return out;
      }
      return {
        n: n,
        mu: function (u, v) {
          var kk = kv(u, v), s = 0;
          for (var i2 = 0; i2 < n; i2++) s += kk[i2] * alpha[i2];
          return s;
        },
        var: function (u, v) {
          var kk = kv(u, v), i2, j2;
          /* σ² = 1 − kᵀ K⁻¹ k */
          var q = 0;
          for (i2 = 0; i2 < n; i2++) {
            var s2 = 0;
            for (j2 = 0; j2 < n; j2++) s2 += inv[i2][j2] * kk[j2];
            q += kk[i2] * s2;
          }
          return Math.max(0, 1 - q);
        }
      };
    }

    /* ---------- 拉丁超立方初始采样 ---------- */
    function lhs(n, seed) {
      var r = lcg(seed), us = [], vs = [], out = [], i, j, t;
      for (i = 0; i < n; i++) { us.push(i); vs.push(i); }
      for (i = n - 1; i > 0; i--) { j = Math.floor(r() * (i + 1)); t = us[i]; us[i] = us[j]; us[j] = t; }
      for (i = n - 1; i > 0; i--) { j = Math.floor(r() * (i + 1)); t = vs[i]; vs[i] = vs[j]; vs[j] = t; }
      for (i = 0; i < n; i++) out.push([(us[i] + r()) / n, (vs[i] + r()) / n]);
      return out;
    }

    /* ---------- 贝叶斯优化：在 EI 网格上找下一个采样点 ---------- */
    function bestSoFar(pts) {
      var b = -1;
      for (var i = 0; i < pts.length; i++) if (pts[i][2] > b) b = pts[i][2];
      return b;
    }
    function phi(z) { return 0.5 * (1 + erf(z / 1.4142136)); }
    function pdf(z) { return Math.exp(-z * z / 2) / 2.5066283; }
    function erf(x) {
      var s = x < 0 ? -1 : 1; x = Math.abs(x);
      var a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
      var t = 1 / (1 + p * x);
      return s * (1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x));
    }
    function eiGrid(sg, pts) {
      var best = bestSoFar(pts), g = [], i, j;
      for (j = 0; j < EI_M; j++) {
        for (i = 0; i < EI_N; i++) {
          var u = (i + 0.5) / EI_N, v = (j + 0.5) / EI_M;
          var mu = sg.mu(u, v), sd = Math.sqrt(sg.var(u, v)) + 1e-9;
          var z = (mu - best - 0.01) / sd;
          g.push({ u: u, v: v, ei: (mu - best - 0.01) * phi(z) + sd * pdf(z) });
        }
      }
      return g;
    }
    function argmaxEI(g) {
      var bi = 0;
      for (var i = 1; i < g.length; i++) if (g[i].ei > g[bi].ei) bi = i;
      return g[bi];
    }

    /* ---------- 帕累托前沿（EUR↑ 成本↓） ---------- */
    function pareto(pts) {
      var P = [], i, j;
      for (i = 0; i < pts.length; i++) {
        var a = pts[i], dom = false;
        for (j = 0; j < pts.length; j++) {
          if (i === j) continue;
          var b = pts[j];
          if (b[2] >= a[2] && b[3] <= a[3] && (b[2] > a[2] || b[3] < a[3])) { dom = true; break; }
        }
        if (!dom) P.push(a);
      }
      P.sort(function (x, y) { return x[3] - y[3]; });
      return P;
    }

    /* ---------------- 状态 ---------------- */
    var wi = 0, pts = [], mode = 'mu', pickW = 0.5, strat = null;

    function reset() {
      var w = WELLS[wi], g0 = lhs(40, 2027 + wi * 97), i;
      pts = [];
      for (i = 0; i < g0.length; i++) {
        pts.push([g0[i][0], g0[i][1], sim(w, g0[i][0], g0[i][1]), cost(g0[i][0], g0[i][1], w)]);
      }
      buildStrategies();
    }
    function buildStrategies() {
      var w = WELLS[wi], i, j, u, v;
      /* 网格搜索：8×7=56 个点，这里只取前 50 次的顺序 */
      var gridPts = [];
      for (j = 0; j < 7; j++) for (i = 0; i < 8; i++) gridPts.push(sim(w, (i + 0.5) / 8, (j + 0.5) / 7));
      /* 随机搜索 */
      var r = lcg(5150 + wi * 31), rnd = [];
      for (i = 0; i < BUDGET; i++) rnd.push(sim(w, r(), r()));
      /* 贝叶斯：8 个 LHS 起步，之后逐步按 EI 采 */
      var g0 = lhs(8, 9021 + wi * 13), bp = [];
      for (i = 0; i < g0.length; i++) bp.push([g0[i][0], g0[i][1], sim(w, g0[i][0], g0[i][1]), 0]);
      for (i = 0; i < BUDGET - g0.length; i++) {
        var pk = argmaxEI(eiGrid(makeSurrogate(bp), bp));
        bp.push([pk.u, pk.v, sim(w, pk.u, pk.v), 0]);
      }
      var gb = -1, rb = -1, bb = -1, grid = [], bay = [], rndB = [];
      for (i = 0; i < BUDGET; i++) {
        if (gridPts[i] > gb) gb = gridPts[i];
        if (rnd[i] > rb) rb = rnd[i];
        if (bp[i][2] > bb) bb = bp[i][2];
        grid.push(gb); bay.push(bb); rndB.push(rb);
      }
      /* 全局最优：细网格 7500 次评估 */
      var opt = -1;
      for (j = 0; j < 75; j++) for (i = 0; i < 100; i++) {
        var val = sim(w, (i + 0.5) / 100, (j + 0.5) / 75);
        if (val > opt) opt = val;
      }
      strat = { grid: grid, rnd: rndB, bay: bay, opt: opt, rndBest: rb, gridBest: gb, bayBest: bb };
    }

    /* ---------------- 界面 ---------------- */
    root.innerHTML =
      '<div class="demo">' +
      '<div class="demo-head"><span class="kicker">INTERACTIVE · SURROGATE + BAYESIAN OPT</span>' +
      '<h3>把"邻井经验"换成"搜出来的最优"</h3>' +
      '<p>左边这张热图就是<b>代理模型眼里的油藏响应面</b>：横轴 = 排量（2–8 m³/min），纵轴 = 砂比（5–25%），' +
      '颜色 = 预测的压后产量（EUR）。真函数是压裂模拟器——<b>评一次要 40 分钟</b>，所以不能拿它直接搜上万种组合。' +
      '右边是 EUR 与成本的散点：两个目标互相冲突，没有"最优"，只有<b>帕累托前沿</b>上"你要多贵的最优"。</p></div>' +

      '<div class="ctl-row">' +
      '<select id="c10-w" style="font-size:12px;padding:4px 8px;border:1px solid var(--line-2,#ddd7c8);border-radius:6px">' +
      WELLS.map(function (w, i) { return '<option value="' + i + '">' + w.name + '</option>'; }).join('') + '</select>' +
      '<button class="btn-x" id="c10-bay">🧭 贝叶斯 +10 点</button>' +
      '<button class="btn-x ghost" id="c10-rnd">🎲 随机 +10 点</button>' +
      '<button class="btn-x ghost" id="c10-reset">↺ 重置样本</button>' +
      '</div>' +

      '<div class="grid2">' +
      '<div class="card-x"><h4>代理模型看到的响应面' +
      '<span style="float:right;font-weight:400;font-size:11px"><label style="margin-right:8px"><input type="radio" name="c10-m" value="mu" checked> 预测 EUR</label>' +
      '<label style="margin-right:8px"><input type="radio" name="c10-m" value="err"> 代理误差</label>' +
      '<label><input type="radio" name="c10-m" value="ei"> 采集函数 EI</label></span></h4>' +
      '<canvas id="c10-hm" width="200" height="150"></canvas>' +
      '<div class="legend"><span><i style="background:#e9efe9"></i>低</span><span><i style="background:' + JADE + '"></i>高（EUR）</span>' +
      '<span>○ 已评样本　◆ 当前最优　□ 邻井经验</span></div>' +
      '<p class="note" id="c10-hn" style="margin:6px 0 0"></p></div>' +

      '<div class="card-x"><h4>产量 ↔ 成本：帕累托前沿</h4>' +
      '<svg id="c10-sc" viewBox="0 0 420 250" role="img" aria-label="EUR 成本散点"></svg>' +
      '<div class="ctl" style="margin-top:2px"><label>更看重产量（相对成本）<output id="c10-ow">50%</output></label>' +
      '<input type="range" id="c10-pw" min="0" max="100" step="1" value="50"></div></div>' +
      '</div>' +

      '<div class="card-x" style="margin-top:12px"><h4>同样 50 次模拟预算，三种搜法差多少</h4>' +
      '<svg id="c10-st" viewBox="0 0 640 200" role="img" aria-label="策略对比曲线"></svg></div>' +

      '<div class="readouts">' +
      '<div class="ro"><span class="k">推荐排量</span><b id="c10-r1">—</b></div>' +
      '<div class="ro"><span class="k">推荐砂比</span><b id="c10-r2">—</b></div>' +
      '<div class="ro"><span class="k">预计 EUR</span><b id="c10-r3">—</b></div>' +
      '<div class="ro"><span class="k">预计成本</span><b id="c10-r4">—</b></div>' +
      '<div class="ro"><span class="k">比邻井经验</span><b id="c10-r5">—</b></div>' +
      '<div class="ro"><span class="k">代理精度 R²</span><b id="c10-r6">—</b></div>' +
      '<div class="ro"><span class="k">已用模拟次数</span><b id="c10-r7">—</b></div>' +
      '</div>' +

      '<p class="note" id="c10-note"></p>' +
      '</div>';

    var $ = function (id) { return root.querySelector('#' + id); };
    var hm = $('c10-hm');
    hm.style.width = '100%'; hm.style.height = 'auto'; hm.style.display = 'block';
    hm.style.border = '1px solid var(--line,#e9e4d8)'; hm.style.borderRadius = '9px';

    /* ---------- 热图 ---------- */
    function drawHeat(s) {
      var ctx = hm.getContext('2d');
      var img = ctx.createImageData(NW, NH), p = img.data, w = WELLS[wi], k = 0, i, j;
      var ei = mode === 'ei' ? eiGrid(s, pts) : null;
      var eiMx = 0;
      if (ei) for (var q = 0; q < ei.length; q++) if (ei[q].ei > eiMx) eiMx = ei[q].ei;
      for (j = 0; j < NH; j++) {
        for (i = 0; i < NW; i++) {
          var u = i / (NW - 1), v = 1 - j / (NH - 1);
          var t, rr, gg, bb;
          if (mode === 'mu') {
            t = clamp01((s.mu(u, v) - 0.38) / 0.62);
            rr = 236 - 96 * t; gg = 240 - 78 * t; bb = 230 - 108 * t;
          } else if (mode === 'err') {
            t = clamp01(Math.abs(s.mu(u, v) - sim(w, u, v)) / 0.09);
            rr = 240 - 30 * t; gg = 238 - 118 * t; bb = 232 - 150 * t;
          } else {
            var gi = Math.min(EI_M - 1, Math.floor((1 - v) * EI_M)) * EI_N + Math.min(EI_N - 1, Math.floor(u * EI_N));
            t = eiMx > 0 ? ei[gi].ei / eiMx : 0;
            rr = 242 - 120 * t; gg = 226 - 96 * t; bb = 196 - 148 * t;
          }
          p[k] = rr | 0; p[k + 1] = gg | 0; p[k + 2] = bb | 0; p[k + 3] = 255;
          k += 4;
        }
      }
      ctx.putImageData(img, 0, 0);
      var X = function (u) { return u * NW; }, Y = function (v) { return (1 - v) * NH; };
      ctx.lineWidth = 1;
      for (i = 0; i < pts.length; i++) {
        ctx.strokeStyle = 'rgba(255,255,255,.85)';
        ctx.beginPath(); ctx.arc(X(pts[i][0]), Y(pts[i][1]), 2.6, 0, 6.284); ctx.stroke();
      }
      var bo = pts[0];
      for (i = 1; i < pts.length; i++) if (pts[i][2] > bo[2]) bo = pts[i];
      ctx.fillStyle = BAD;
      ctx.beginPath();
      ctx.moveTo(X(bo[0]), Y(bo[1]) - 5); ctx.lineTo(X(bo[0]) + 4.5, Y(bo[1]) + 3.5); ctx.lineTo(X(bo[0]) - 4.5, Y(bo[1]) + 3.5);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#7a3a33'; ctx.lineWidth = 2;
      ctx.strokeRect(X(w.expU) - 5, Y(w.expV) - 5, 10, 10);
    }

    /* ---------- 散点 + 前沿 ---------- */
    function drawScatter() {
      var X0 = 40, X1 = 402, Y0 = 16, Y1 = 196, w = WELLS[wi];
      var cmin = 0.28 * (0.85 + 0.3 * w.scale), cmax = 1.10 * (0.85 + 0.3 * w.scale);
      var emin = 0.36, emax = 1.02;
      function px(c) { return X0 + (X1 - X0) * (c - cmin) / (cmax - cmin); }
      function py(e) { return Y1 - (Y1 - Y0) * (e - emin) / (emax - emin); }
      var s = '<rect x="' + X0 + '" y="' + Y0 + '" width="' + (X1 - X0) + '" height="' + (Y1 - Y0) + '" fill="#fbfaf6" stroke="#ece7da"/>';
      [0.25, 0.5, 0.75].forEach(function (f) {
        s += '<path d="M' + X0 + ' ' + (Y0 + (Y1 - Y0) * f).toFixed(1) + 'h' + (X1 - X0) + '" stroke="#f0ede3"/>';
      });
      var P = pareto(pts), i;
      if (P.length > 1) {
        var d = '';
        for (i = 0; i < P.length; i++) d += (i ? 'L' : 'M') + px(P[i][3]).toFixed(1) + ' ' + py(P[i][2]).toFixed(1);
        s += '<path d="' + d + '" fill="none" stroke="' + CLAY + '" stroke-width="2" stroke-linecap="round"/>';
      }
      for (i = 0; i < pts.length; i++) {
        var isP = P.indexOf(pts[i]) >= 0;
        s += '<circle cx="' + px(pts[i][3]).toFixed(1) + '" cy="' + py(pts[i][2]).toFixed(1) + '" r="' + (isP ? 3.6 : 2.4) +
          '" fill="' + (isP ? CLAY : 'rgba(65,105,155,.45)') + '"/>';
      }
      var eExp = sim(w, w.expU, w.expV), cExp = cost(w.expU, w.expV, w);
      s += '<rect x="' + (px(cExp) - 5).toFixed(1) + '" y="' + (py(eExp) - 5).toFixed(1) + '" width="10" height="10" fill="none" stroke="#7a3a33" stroke-width="2"/>' +
        '<text x="' + (px(cExp) + 8).toFixed(1) + '" y="' + (py(eExp) - 8).toFixed(1) + '" font-size="8.5" fill="#7a3a33">邻井经验</text>';
      var pick = P[0], bs = -1e9;
      for (i = 0; i < P.length; i++) {
        var sc2 = pickW * P[i][2] - (1 - pickW) * P[i][3];
        if (sc2 > bs) { bs = sc2; pick = P[i]; }
      }
      s += '<circle cx="' + px(pick[3]).toFixed(1) + '" cy="' + py(pick[2]).toFixed(1) + '" r="6.5" fill="none" stroke="' + JADE + '" stroke-width="2"/>' +
        '<text x="' + (px(pick[3]) + 9).toFixed(1) + '" y="' + (py(pick[2]) + 3).toFixed(1) + '" font-size="9" font-weight="700" fill="#235f51">推荐</text>';
      s += '<text x="' + ((X0 + X1) / 2) + '" y="' + (Y1 + 18) + '" text-anchor="middle" font-size="9" fill="#6d757a">单段改造成本（相对值）→</text>' +
        '<text x="14" y="' + ((Y0 + Y1) / 2) + '" font-size="9" fill="#6d757a" transform="rotate(-90 14 ' + ((Y0 + Y1) / 2) + ')">EUR（相对值）→</text>' +
        '<text x="' + X0 + '" y="' + (Y1 + 34) + '" font-size="9.5" fill="#4d565b">棕点在前沿上，灰点被前沿支配——<b>它们无论怎么调都不如前沿上的某个组合</b>，可以直接划掉。</text>';
      $('c10-sc').innerHTML = s;

      $('c10-r1').textContent = (QMIN + pick[0] * KMQ).toFixed(1) + ' m³/min';
      $('c10-r2').textContent = (CMIN + pick[1] * KMC).toFixed(1) + ' %';
      $('c10-r3').textContent = pick[2].toFixed(3);
      $('c10-r4').textContent = pick[3].toFixed(2);
      var gain = (pick[2] / eExp - 1) * 100;
      $('c10-r5').textContent = (gain >= 0 ? '+' : '') + gain.toFixed(0) + '%';
      $('c10-r5').className = gain > 8 ? 'ok' : (gain > 0 ? 'warn' : 'bad');
    }

    /* ---------- 策略曲线 ---------- */
    function drawStrat() {
      var X0 = 44, X1 = 600, Y0 = 18, Y1 = 148, lo = 0.5, hi = 1.0;
      function px(i) { return X0 + (X1 - X0) * i / (BUDGET - 1); }
      function py(v) { return Y1 - (Y1 - Y0) * (v - lo) / (hi - lo); }
      function line(arr, col, wdt) {
        var d = '';
        for (var i = 0; i < arr.length; i++) d += (i ? 'L' : 'M') + px(i).toFixed(1) + ' ' + py(arr[i]).toFixed(1);
        return '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="' + wdt + '" stroke-linejoin="round"/>';
      }
      var s = '<rect x="' + X0 + '" y="' + Y0 + '" width="' + (X1 - X0) + '" height="' + (Y1 - Y0) + '" fill="#fbfaf6" stroke="#ece7da"/>' +
        '<path d="M' + X0 + ' ' + py(strat.opt).toFixed(1) + 'h' + (X1 - X0) + '" stroke="' + OLIVE + '" stroke-dasharray="5 4" stroke-width="1.4"/>' +
        '<text x="' + (X1 - 4) + '" y="' + (py(strat.opt) - 5).toFixed(1) + '" text-anchor="end" font-size="8.5" fill="#5d6022">全局最优（要 7500 次评估才找得到）</text>';
      s += line(strat.grid, '#9ba3a9', 1.6) + line(strat.rnd, OPT, 1.8) + line(strat.bay, BAD, 2.2);
      s += '<g font-size="9.5">' +
        '<rect x="' + (X0 + 10) + '" y="' + (Y0 + 8) + '" width="88" height="56" rx="6" fill="#fbfaf6" opacity=".92" stroke="#ece7da"/>' +
        '<path d="M' + (X0 + 18) + ' ' + (Y0 + 20) + ' h18" stroke="' + BAD + '" stroke-width="2.2"/>' +
        '<text x="' + (X0 + 42) + '" y="' + (Y0 + 23) + '" fill="#4d565b">贝叶斯</text>' +
        '<path d="M' + (X0 + 18) + ' ' + (Y0 + 38) + ' h18" stroke="' + OPT + '" stroke-width="1.8"/>' +
        '<text x="' + (X0 + 42) + '" y="' + (Y0 + 41) + '" fill="#4d565b">随机</text>' +
        '<path d="M' + (X0 + 18) + ' ' + (Y0 + 56) + ' h18" stroke="#9ba3a9" stroke-width="1.6"/>' +
        '<text x="' + (X0 + 42) + '" y="' + (Y0 + 59) + '" fill="#4d565b">网格</text></g>' +
        '<text x="' + X0 + '" y="' + (Y1 + 16) + '" fill="#6d757a">模拟次数 →</text>' +
        '<text x="' + X0 + '" y="' + (Y1 + 34) + '" font-size="9.5" fill="#4d565b">同样的预算，贝叶斯找到 <b>' + strat.bayBest.toFixed(3) +
        '</b>，随机 <b>' + strat.rndBest.toFixed(3) + '</b>，网格 <b>' + strat.gridBest.toFixed(3) +
        '</b>——井越难，差距越大（换到 C 井看）。</text>';
      $('c10-st').innerHTML = s;
    }

    /* ---------- 代理精度 R² ---------- */
    function r2(s) {
      var r = lcg(77123), se = 0, vt = 0, m = 0, ts = [], i;
      for (i = 0; i < 150; i++) { var u = r(), v = r(), y = sim(WELLS[wi], u, v); ts.push([u, v, y]); m += y; }
      m /= ts.length;
      for (i = 0; i < ts.length; i++) {
        var e = ts[i][2] - s.mu(ts[i][0], ts[i][1]);
        se += e * e; vt += (ts[i][2] - m) * (ts[i][2] - m);
      }
      return Math.max(0, 1 - se / (vt || 1));
    }

    function draw() {
      var s = makeSurrogate(pts);
      drawHeat(s);
      drawScatter();
      drawStrat();
      $('c10-r6').textContent = r2(s).toFixed(2);
      $('c10-r7').textContent = pts.length + ' 次';
      $('c10-hn').innerHTML = WELLS[wi].note +
        (mode === 'ei' ? '　·　<b>采集函数视图</b>：颜色越红 = 这个点越值得花一次模拟。它兼顾"预测好"和"不确定"，所以样本会自动往没人探索过的空档里钻。' : '') +
        (mode === 'err' ? '　·　<b>代理误差视图</b>：红 = 代理错得离谱的地方，恰好是样本稀的地方——<b>代理模型的不可靠，在图上是看得见的</b>。' : '');
      note();
    }

    function note() {
      var tp = [];
      tp.push('<b>为什么不直接用模拟器搜？</b>一次压裂模拟 40 分钟，四个参数各取 10 档就是一万种组合——' +
        '<b>一台机器要算一年</b>。所以先花 40 个样本训一个"秒回的假模拟器"（代理模型），在它上面随便搜；' +
        '搜索发现"这里可能更好但我不确定"时，再回头花一次真模拟。这就是<b>贝叶斯优化</b>的全部逻辑。');
      tp.push('<b>试着做三件事：</b>① 把视图切到<b>采集函数 EI</b>，点几次"贝叶斯 +10"，看样本怎么往"又好又没人去过"的地方跑；' +
        '② 切到<b>代理误差</b>，看误差大的地方正好是样本稀的地方；' +
        '③ 换到 <b>C 井</b>（有假峰），先点"随机 +10"再点"贝叶斯 +10"，看随机搜索怎么被假峰骗走、贝叶斯怎么靠 EI 逃出来。');
      tp.push('<b>右边没有"最优解"。</b>产量和成本是冲突的：砂比加一档，EUR 涨一点，成本涨一截。' +
        '所以最后交给工程师的是<b>一条帕累托前沿</b>加一个权重滑块——' +
        '<b>机器把"不值得考虑的组合"全部划掉，"剩下的怎么挑"是人的决定</b>。这不是 AI 偷懒，这是这个问题的正确形态。');
      $('c10-note').innerHTML = tp.join('<br><br>');
    }

    /* ---------- 事件 ---------- */
    $('c10-w').addEventListener('change', function () { wi = +$('c10-w').value; reset(); draw(); });
    $('c10-bay').addEventListener('click', function () {
      var s = makeSurrogate(pts), w = WELLS[wi];
      for (var i = 0; i < 10; i++) {
        var pk = argmaxEI(eiGrid(s, pts));
        pts.push([pk.u, pk.v, sim(w, pk.u, pk.v), cost(pk.u, pk.v, w)]);
        s = makeSurrogate(pts);
      }
      draw();
    });
    $('c10-rnd').addEventListener('click', function () {
      var r = lcg((Date.now() & 0xffff) | 1), w = WELLS[wi];
      for (var i = 0; i < 10; i++) {
        var u = r(), v = r();
        pts.push([u, v, sim(w, u, v), cost(u, v, w)]);
      }
      draw();
    });
    $('c10-reset').addEventListener('click', function () { reset(); draw(); });
    Array.prototype.forEach.call(root.querySelectorAll('input[name="c10-m"]'), function (r) {
      r.addEventListener('change', function () { mode = r.value; draw(); });
    });
    $('c10-pw').addEventListener('input', function () {
      pickW = +$('c10-pw').value / 100;
      $('c10-ow').textContent = $('c10-pw').value + '%';
      drawScatter();
    });

    reset();
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
