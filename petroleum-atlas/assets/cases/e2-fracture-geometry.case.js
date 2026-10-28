/* =========================================================
   e2-fracture-geometry · 案例插件（由 _build/build.mjs 自动生成，勿手改）
   源头是案例包 fracture-geometry-case/source.js + demo/，改内容请改源头后重新构建。
   ========================================================= */
(function () {
  var DEF = {"id":"e2-fracture-geometry","sceneId":"e2","title":"压裂裂缝形态预测：模型算的是缝网，要的是产能","status":"ready","version":"1.0.0","updated":"2026-10-26","tabs":{"background":{"label":"专业背景","lede":"压裂施工几十方砂打进地层，最后到底形成了什么样的裂缝？这个问题没法直接看，只能算。商业软件做拟三维或全三维数值模拟，一次算几小时；微地震监测能给出事件云，但那是\"岩石破裂的位置\"，不完全等于\"流体能流动的缝网\"。于是需要一条又快、又能量化不确定性的路：用数值模拟训练代理模型，秒级给出缝网形态与产能相关的量。","judge":[{"label":"任务类型","value":"代理模型 + 形态预测","desc":"秒级，可反复试算"},{"label":"数据门槛","value":"≥ 500 组数值模拟样本","desc":"或同区块微地震"},{"label":"可见收益","value":"3 h → 8 s，可扫参数","desc":"方案对比从 3 个到 200 个"},{"label":"难度","value":"高","html":"<span class=\"dtag\" data-d=\"高\">难度 高</span>"}],"sections":[{"no":1,"en":"PROBLEM","title":"当前做法与问题","html":"<p>压裂设计的基本流程：地质力学建模 → 用商业软件模拟裂缝扩展 → 得到缝长、缝高、导流能力 → 预测产量 → 选方案。<b>问题在于数值模拟一次要几小时，而设计参数（排量、黏度、砂比、段簇划分、液量）的组合有成千上万种</b>——实际只能试三五个方案，选一个\"看起来还行\"的。</p><p>第二个问题是<b>\"精确的不一定是对的\"</b>：模拟结果对输入参数（地应力、杨氏模量、天然裂缝分布、滤失系数）极其敏感，而这些参数本身来自有限的测井与岩心，误差常在 ±20% 以上。<b>一个精确到小数点后两位的缝长预测，输入本身就不确定，精度毫无意义。</b></p><div class=\"figure\"><svg viewBox=\"0 0 640 214\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"模拟耗时与参数空间\"><g font-size=\"10.5\"><text x=\"20\" y=\"16\" fill=\"#79828a\">设计参数空间 vs 能试算的次数</text><rect x=\"30\" y=\"30\" width=\"290\" height=\"166\" rx=\"8\" fill=\"#fdfcf9\" stroke=\"#c9c2b0\"/><text x=\"46\" y=\"50\" fill=\"#4d565b\" font-weight=\"700\">参数空间（示意）</text><g fill=\"#e7eef9\" stroke=\"#41699b\" stroke-opacity=\".35\"><rect x=\"46\" y=\"60\" width=\"42\" height=\"24\"/><rect x=\"92\" y=\"60\" width=\"42\" height=\"24\"/><rect x=\"138\" y=\"60\" width=\"42\" height=\"24\"/><rect x=\"184\" y=\"60\" width=\"42\" height=\"24\"/><rect x=\"230\" y=\"60\" width=\"42\" height=\"24\"/><rect x=\"46\" y=\"88\" width=\"42\" height=\"24\"/><rect x=\"92\" y=\"88\" width=\"42\" height=\"24\"/><rect x=\"138\" y=\"88\" width=\"42\" height=\"24\"/><rect x=\"184\" y=\"88\" width=\"42\" height=\"24\"/><rect x=\"230\" y=\"88\" width=\"42\" height=\"24\"/><rect x=\"46\" y=\"116\" width=\"42\" height=\"24\"/><rect x=\"92\" y=\"116\" width=\"42\" height=\"24\"/><rect x=\"138\" y=\"116\" width=\"42\" height=\"24\"/><rect x=\"184\" y=\"116\" width=\"42\" height=\"24\"/><rect x=\"230\" y=\"116\" width=\"42\" height=\"24\"/><rect x=\"46\" y=\"144\" width=\"42\" height=\"24\"/><rect x=\"92\" y=\"144\" width=\"42\" height=\"24\"/><rect x=\"138\" y=\"144\" width=\"42\" height=\"24\"/><rect x=\"184\" y=\"144\" width=\"42\" height=\"24\"/><rect x=\"230\" y=\"144\" width=\"42\" height=\"24\"/></g><g fill=\"#b05a51\" opacity=\".85\"><rect x=\"92\" y=\"88\" width=\"42\" height=\"24\"/><rect x=\"184\" y=\"116\" width=\"42\" height=\"24\"/><rect x=\"138\" y=\"60\" width=\"42\" height=\"24\"/></g><text x=\"46\" y=\"186\" font-size=\"10.5\" fill=\"#b05a51\">实际只试了 3 个方案，覆盖不到 1%</text><rect x=\"340\" y=\"30\" width=\"270\" height=\"166\" rx=\"8\" fill=\"#f9e9e5\" stroke=\"#b05a51\" stroke-opacity=\".3\"/><text x=\"356\" y=\"52\" fill=\"#b05a51\" font-weight=\"700\">数值模拟的成本</text><text x=\"356\" y=\"76\" font-size=\"10.5\" fill=\"#4d565b\">单次全三维模拟：2—6 h</text><text x=\"356\" y=\"98\" font-size=\"10.5\" fill=\"#4d565b\">一天最多跑 4—8 个方案</text><text x=\"356\" y=\"120\" font-size=\"10.5\" fill=\"#4d565b\">设计周期 2 周内要定方案</text><text x=\"356\" y=\"150\" font-size=\"10.5\" fill=\"#b05a51\">→ 敏感性分析做不动</text><text x=\"356\" y=\"172\" font-size=\"10.5\" fill=\"#b05a51\">→ 不确定性量化做不动</text><text x=\"356\" y=\"190\" font-size=\"10\" fill=\"#79828a\">输入参数本身误差 ±20%，输出的\"精确\"是假的</text></g></svg></div><div class=\"figcap\"><b>图 1</b><span>参数空间巨大而试算能力极小。<b>这不是精度问题，是计算量问题</b>——所以才需要代理模型把单次评估从小时压到秒级。</span></div>"},{"no":2,"en":"INTERVENTION","title":"AI 能做什么","html":"<p>核心思路是<b>代理模型（surrogate）</b>：先用数值模拟器跑几百到几千组参数组合，把\"施工参数 + 地质参数 → 缝网形态 / SRV / 产能指标\"这张表建起来，再训练一个秒级预测器（GBDT、MLP 或图神经网络）。有了它，就能在几分钟里扫遍参数空间、做敏感性分析、做蒙特卡洛不确定性量化。</p><p>必须讲清楚的两件事。<b>第一，SRV 不是目标，有效支撑体积才是。</b>复杂缝网的改造体积可以很大，但分支缝太窄，支撑剂进不去，闭合后就是无效体积——看图里那片浅色格子。<b>第二，压裂结果本质是不确定的</b>：同一组参数，天然裂缝分布的一点差异就能让缝网长得完全不同。所以模型该输出分布与期望，而不是一个确定的缝长。</p><div class=\"figure\"><svg viewBox=\"0 0 640 176\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"代理模型工作流\"><g font-size=\"11\" font-weight=\"700\" text-anchor=\"middle\"><rect x=\"16\" y=\"52\" width=\"104\" height=\"56\" rx=\"9\" fill=\"#e7eef9\" stroke=\"#41699b\"/><text x=\"68\" y=\"74\" fill=\"#31527a\">数值模拟</text><text x=\"68\" y=\"91\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">500—3000 组</text><rect x=\"138\" y=\"52\" width=\"104\" height=\"56\" rx=\"9\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\"/><text x=\"190\" y=\"74\" fill=\"#235f51\">代理模型</text><text x=\"190\" y=\"91\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">3 h → 8 s</text><rect x=\"260\" y=\"52\" width=\"104\" height=\"56\" rx=\"9\" fill=\"#f1f1dd\" stroke=\"#767a2e\"/><text x=\"312\" y=\"74\" fill=\"#5d6022\">参数扫描</text><text x=\"312\" y=\"91\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">几百个方案</text><rect x=\"382\" y=\"52\" width=\"104\" height=\"56\" rx=\"9\" fill=\"#f8ecdf\" stroke=\"#b26a39\"/><text x=\"434\" y=\"74\" fill=\"#8e5229\">不确定性量化</text><text x=\"434\" y=\"91\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">蒙特卡洛</text><rect x=\"504\" y=\"52\" width=\"120\" height=\"56\" rx=\"9\" fill=\"#f9e9e5\" stroke=\"#b05a51\"/><text x=\"564\" y=\"74\" fill=\"#9c4a42\">有效支撑体积</text><text x=\"564\" y=\"91\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">而非 SRV</text></g><g stroke=\"#9ba3a9\" stroke-width=\"1.4\"><path d=\"M120 80 h14\" marker-end=\"url(#e2a)\"/><path d=\"M242 80 h14\" marker-end=\"url(#e2a)\"/><path d=\"M364 80 h14\" marker-end=\"url(#e2a)\"/><path d=\"M486 80 h14\" marker-end=\"url(#e2a)\"/></g><defs><marker id=\"e2a\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#9ba3a9\"/></marker></defs><rect x=\"16\" y=\"122\" width=\"608\" height=\"40\" rx=\"9\" fill=\"#fdfcf9\" stroke=\"#e9e4d8\"/><text x=\"34\" y=\"140\" font-size=\"10.5\" fill=\"#4d565b\">代理模型只在训练域内可信：超出样本范围（新层系、极端排量）必须回数值模拟重算，不能直接外推</text><text x=\"34\" y=\"156\" font-size=\"10.5\" fill=\"#79828a\">压后验证：微地震事件云 + 施工压力拟合 + 产量历史 —— 三者互相印证，缺一个都不能算验证</text></svg></div><div class=\"figcap\"><b>图 2</b><span>代理模型的价值不在\"代替模拟器\"，而在<b>把一次评估的成本降到可以做统计</b>——有了统计才能谈不确定性。</span></div>"},{"no":3,"en":"DATA","title":"你需要准备什么","html":"<p style=\"margin-bottom:14px\">这个场景的数据是\"造\"出来的：先有模拟器，才有训练样本。所以清单的前两项是本场景特有的。</p><div class=\"checklist\"><div class=\"cl-head\"><span>数据准备清单 · 5 项</span><span class=\"cl-prog\"><span id=\"cl-txt\">0 / 5</span><span class=\"cl-bar\"><i id=\"cl-fill\"></i></span></span></div><div class=\"cl-item\" data-cl=\"0\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">数值模拟样本库</span><span class=\"cl-s\">500—3000 组，覆盖参数空间</span></span><span class=\"cl-n\">需按实验设计采样，不能随机</span></div><div class=\"cl-item\" data-cl=\"1\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">地质力学参数及不确定性</span><span class=\"cl-s\">地应力、杨氏模量、泊松比、天然裂缝</span></span><span class=\"cl-n\">要给出分布而非单值</span></div><div class=\"cl-item\" data-cl=\"2\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">施工数据</span><span class=\"cl-s\">压力、排量、砂比、液量（每分钟）</span></span><span class=\"cl-n\">压后拟合的依据</span></div><div class=\"cl-item\" data-cl=\"3\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">微地震监测事件</span><span class=\"cl-s\">事件位置、震级、时间</span></span><span class=\"cl-n\">事件云 ≠ 缝网，需谨慎解读</span></div><div class=\"cl-item\" data-cl=\"4\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">压后产量历史</span><span class=\"cl-s\">≥ 6 个月单井/分段产量</span></span><span class=\"cl-n\">唯一能验证\"有效\"的数据</span></div></div>"},{"no":4,"en":"DIFFICULTY","title":"技术难度与参考方向","html":"<div style=\"display:flex;align-items:center;gap:14px;flex-wrap:wrap\"><span class=\"dtag\" data-d=\"高\">难度 高</span><span class=\"small muted\">难在\"预测什么\"这个问题的定义，而不在模型本身。</span></div><div class=\"meter\"><i class=\"on\"></i><i class=\"on\"></i><i class=\"on hi\"></i></div><p>最重要的一条建议：<b>先把\"预测目标\"定清楚，再谈模型。</b>缝长、SRV、有效支撑体积、产能——这四个量依次更接近业务，但也依次更难验证。很多项目失败不是因为模型不好，而是因为优化了一个与产量相关性很弱的量（比如单纯最大化 SRV）。</p><p>第二条：<b>务必给代理模型加\"域外检测\"</b>。当输入落在训练样本覆盖不到的区域（新层系、极端排量、异常应力）时，模型必须明确说\"我不知道\"，而不是给出一个看似合理的数。<b>一个简单的做法是看输入到训练样本的最小距离，超阈值就拒绝预测。</b></p><p style=\"margin-top:18px\"><span class=\"kicker plain\" style=\"color:var(--ink-4)\">可借鉴的通用技术</span></p><div class=\"refs\"><a class=\"ref\" href=\"#/method/opt\">代理模型与实验设计<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/cv\">形态/图结构预测<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/opt\">不确定性量化<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/opt\">域外检测<span class=\"ar\">↗</span></a></div>"}]},"workflow":{"label":"案例流程","title":"案例：某页岩气平台 12 口井的压裂参数优化","lead":["某页岩气平台 12 口水平井、186 段，原设计靠 3—5 次数值模拟对比定方案，单段设计周期 1.5 天。","目标：建立秒级缝网预测，把方案对比数量提升两个量级，并用压后产量验证\"优化目标选对了没有\"。"],"stats":[["井数 / 段数","12 / 186"],["单次评估","3 h → 8 s"],["对比方案数","3 → 200+"],["产量预测 MAPE","19%"]],"steps":[{"name":"实验设计与样本库","role":"数据","do":"用拉丁超立方采样在设计空间（排量、黏度、砂比、液量、段长、簇数 × 地应力、模量、天然裂缝密度）取 1600 组，逐组跑数值模拟。","effect":"1600 组样本覆盖设计空间；采样后模型在未试过的参数点上的插值误差 6.2%，随机采样则需 3 倍样本才能达到同样精度。","trap":"别用随机采样：参数空间里\"排量 × 黏度\"这类交互项需要结构化覆盖，拉丁超立方或 Sobol 序列效率高得多。","fig":"<svg viewBox=\"0 0 560 88\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"实验设计采样\"><g font-size=\"10\"><g text-anchor=\"middle\"><rect x=\"18\" y=\"20\" width=\"118\" height=\"44\" rx=\"8\" fill=\"#e7eef9\" stroke=\"#41699b\" stroke-opacity=\".5\"/><text x=\"77\" y=\"38\" fill=\"#31527a\" font-weight=\"700\">拉丁超立方</text><text x=\"77\" y=\"53\" fill=\"#9ba3a9\">结构化覆盖</text><rect x=\"152\" y=\"20\" width=\"118\" height=\"44\" rx=\"8\" fill=\"#f9efd7\" stroke=\"#a97a1c\" stroke-opacity=\".5\"/><text x=\"211\" y=\"38\" fill=\"#8e5229\" font-weight=\"700\">1600 组模拟</text><text x=\"211\" y=\"53\" fill=\"#9ba3a9\">后台跑 3 周</text><rect x=\"286\" y=\"20\" width=\"118\" height=\"44\" rx=\"8\" fill=\"#f1f1dd\" stroke=\"#767a2e\" stroke-opacity=\".5\"/><text x=\"345\" y=\"38\" fill=\"#5d6022\" font-weight=\"700\">代理模型</text><text x=\"345\" y=\"53\" fill=\"#9ba3a9\">插值误差 6.2%</text><rect x=\"420\" y=\"20\" width=\"122\" height=\"44\" rx=\"8\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\" stroke-opacity=\".5\"/><text x=\"481\" y=\"38\" fill=\"#235f51\" font-weight=\"700\">单次 8 s</text><text x=\"481\" y=\"53\" fill=\"#9ba3a9\">原 3 h</text></g><g stroke=\"#9ba3a9\" stroke-width=\"1.2\"><path d=\"M136 42 h12\" marker-end=\"url(#e2b)\"/><path d=\"M270 42 h12\" marker-end=\"url(#e2b)\"/><path d=\"M404 42 h12\" marker-end=\"url(#e2b)\"/></g></g><defs><marker id=\"e2b\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#9ba3a9\"/></marker></defs></svg>"},{"name":"地质参数不确定性建模","role":"工程","do":"不把地应力、杨氏模量、天然裂缝密度当成确定值，而是给出分布（由测井、岩心、微地震反演共同约束），在预测时做蒙特卡洛抽样。","effect":"同一施工方案的缝长预测从\"218 m\"变成\"P10 162 m / P50 218 m / P90 279 m\"，设计评审第一次能讨论风险而不只是期望值。","trap":"地质参数的分布不能拍脑袋给——要用压后压力拟合反演来收窄。每口井压后都做一次反演，分布会逐口变窄，这是平台滚动开发最大的知识收益。","fig":"<svg viewBox=\"0 0 560 90\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"不确定性收窄\"><g font-size=\"10\"><text x=\"18\" y=\"20\" fill=\"#79828a\">同一方案的缝长预测（P10—P90）：</text><rect x=\"230\" y=\"10\" width=\"240\" height=\"13\" rx=\"6\" fill=\"#c9c2b0\" opacity=\".5\"/><text x=\"476\" y=\"20\" fill=\"#79828a\">压前 138—312 m</text><rect x=\"262\" y=\"30\" width=\"180\" height=\"13\" rx=\"6\" fill=\"#b26a39\" opacity=\".7\"/><text x=\"448\" y=\"40\" fill=\"#8e5229\">3 口井后 156—286 m</text><rect x=\"286\" y=\"50\" width=\"140\" height=\"13\" rx=\"6\" fill=\"#2f7d6b\"/><text x=\"432\" y=\"60\" fill=\"#235f51\" font-weight=\"700\">12 口井后 162—279 m</text><text x=\"230\" y=\"82\" fill=\"#79828a\">每口井压后反演 → 地质参数分布逐口收窄</text></g></svg>"},{"name":"缝网形态与有效支撑预测","role":"算法","do":"代理模型输出缝网网格（occupancy）+ 缝宽分布，再按\"缝宽 > 支撑剂进入门槛\"判定有效支撑体积；输出 SRV、有效支撑体积、复杂度指数三个量。","effect":"缝长与微地震解释长度的平均误差 14%；有效支撑体积与压后 6 个月累产的秩相关 0.71，而 SRV 只有 0.34。","trap":"这个 0.34 vs 0.71 的对比就是本项目的核心结论：<b>SRV 与产量的相关性远低于有效支撑体积</b>。如果当初优化的是 SRV，方案会系统性偏向\"造大体积但进不去砂\"。","fig":"<svg viewBox=\"0 0 560 92\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"SRV 与有效支撑的相关性\"><g font-size=\"10\"><text x=\"18\" y=\"20\" fill=\"#79828a\">与压后 6 个月累产的秩相关：</text><rect x=\"290\" y=\"10\" width=\"98\" height=\"13\" rx=\"6\" fill=\"#c9c2b0\"/><text x=\"394\" y=\"20\" fill=\"#79828a\">SRV：0.34</text><rect x=\"290\" y=\"30\" width=\"112\" height=\"13\" rx=\"6\" fill=\"#b26a39\" opacity=\".75\"/><text x=\"408\" y=\"40\" fill=\"#8e5229\">缝长：0.39</text><rect x=\"290\" y=\"50\" width=\"204\" height=\"13\" rx=\"6\" fill=\"#2f7d6b\"/><text x=\"500\" y=\"60\" fill=\"#235f51\" font-weight=\"700\">有效支撑体积：0.71</text><text x=\"18\" y=\"84\" fill=\"#b05a51\">优化目标选错，模型再准也没用</text></g></svg>"},{"name":"参数扫描与方案优选","role":"质控","do":"在代理模型上扫 200+ 方案，按\"有效支撑体积最大化 + 成本约束\"排序；对进入前 10 的方案回数值模拟器复核，并做域外检测。","effect":"推荐方案相较原设计：有效支撑体积 +23%，材料成本 -8%；现场实施后首年平均日产提高 17%。","trap":"代理模型选出的\"最优\"往往落在训练样本边界上（外推风险最高）。必须加域外检测，并对前 10 名全部回模拟器复核，不能只信代理模型。","fig":"<svg viewBox=\"0 0 560 94\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"方案扫描与复核\"><g font-size=\"10\"><text x=\"18\" y=\"20\" fill=\"#79828a\">两层筛选：</text><rect x=\"150\" y=\"8\" width=\"180\" height=\"40\" rx=\"8\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\" stroke-opacity=\".5\"/><text x=\"240\" y=\"26\" fill=\"#235f51\" font-weight=\"700\" text-anchor=\"middle\">代理模型扫 200+</text><text x=\"240\" y=\"42\" fill=\"#9ba3a9\" text-anchor=\"middle\">8 s/次 · 共 27 min</text><rect x=\"348\" y=\"8\" width=\"192\" height=\"40\" rx=\"8\" fill=\"#f8ecdf\" stroke=\"#b26a39\" stroke-opacity=\".5\"/><text x=\"444\" y=\"26\" fill=\"#8e5229\" font-weight=\"700\" text-anchor=\"middle\">前 10 名回模拟器复核</text><text x=\"444\" y=\"42\" fill=\"#9ba3a9\" text-anchor=\"middle\">含域外检测</text><text x=\"150\" y=\"66\" fill=\"#235f51\" font-weight=\"700\">有效支撑 +23% · 成本 -8% · 首年日产 +17%</text><text x=\"150\" y=\"84\" fill=\"#8e5229\">代理模型的最优解常在样本边界 → 必须复核</text></g></svg>"},{"name":"压后验证与分布收窄","role":"人工","do":"每段压后用施工压力拟合反演缝网参数，与微地震事件云、产量历史三者对照；反演结果回灌样本库重训代理模型。","effect":"三轮迭代后产量预测 MAPE 从 31% 降到 19%；地质参数分布显著收窄，后续井的设计不确定性下降约 30%。","trap":"别把微地震事件云直接当缝网：它记录的是\"岩石发生剪切破裂的位置\"，包括大量不会被支撑、也不导流的小事件。用它做验证要设事件密度阈值，不能直接比体积。"}],"metrics":{"title":"怎么算「做对了」","html":"<p>这个场景的指标有一条清晰的因果链，<b>断在哪一环都要能看出来</b>：</p><div style=\"margin:10px 0 6px\"><svg viewBox=\"0 0 640 126\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"四层指标链\"><g font-size=\"10.5\"><g><rect x=\"26\" y=\"16\" width=\"164\" height=\"26\" rx=\"4\" fill=\"#f5f2ea\"/><text x=\"38\" y=\"34\" fill=\"#79828a\">环节</text><rect x=\"196\" y=\"16\" width=\"150\" height=\"26\" rx=\"4\" fill=\"#f5f2ea\"/><text x=\"271\" y=\"34\" text-anchor=\"middle\" fill=\"#79828a\">指标</text><rect x=\"352\" y=\"16\" width=\"130\" height=\"26\" rx=\"4\" fill=\"#f5f2ea\"/><text x=\"417\" y=\"34\" text-anchor=\"middle\" fill=\"#79828a\">结果</text><rect x=\"488\" y=\"16\" width=\"132\" height=\"26\" rx=\"4\" fill=\"#f5f2ea\"/><text x=\"554\" y=\"34\" text-anchor=\"middle\" fill=\"#79828a\">说明</text></g><g><rect x=\"26\" y=\"46\" width=\"164\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"38\" y=\"62\" fill=\"#4d565b\">代理模型精度</text><rect x=\"196\" y=\"46\" width=\"150\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"271\" y=\"62\" text-anchor=\"middle\" fill=\"#4d565b\">插值误差</text><rect x=\"352\" y=\"46\" width=\"130\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"417\" y=\"62\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">6.2%</text><rect x=\"488\" y=\"46\" width=\"132\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"498\" y=\"62\" fill=\"#79828a\">相对数值模拟</text></g><g><rect x=\"26\" y=\"74\" width=\"164\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"38\" y=\"90\" fill=\"#4d565b\">形态解释</text><rect x=\"196\" y=\"74\" width=\"150\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"271\" y=\"90\" text-anchor=\"middle\" fill=\"#4d565b\">缝长 vs 微地震</text><rect x=\"352\" y=\"74\" width=\"130\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"417\" y=\"90\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">误差 14%</text><rect x=\"488\" y=\"74\" width=\"132\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"498\" y=\"90\" fill=\"#79828a\">需设事件阈值</text></g><g><rect x=\"26\" y=\"102\" width=\"164\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"38\" y=\"118\" fill=\"#4d565b\">业务结果</text><rect x=\"196\" y=\"102\" width=\"150\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"271\" y=\"118\" text-anchor=\"middle\" fill=\"#4d565b\">产量 MAPE / 日产</text><rect x=\"352\" y=\"102\" width=\"130\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"417\" y=\"118\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">19% / +17%</text><rect x=\"488\" y=\"102\" width=\"132\" height=\"24\" rx=\"4\" fill=\"#fff\"/><text x=\"498\" y=\"118\" fill=\"#79828a\">唯一结算口径</text></g></g></svg></div><p style=\"margin-top:6px\">读法：<b>代理模型误差 6% 是个陷阱指标</b>——它只说明\"学得像模拟器\"，不代表\"学得像地层\"。真正要看的是最后一行。本项目最关键的一次发现，是中间那次相关性对比：<b>SRV 与产量的秩相关只有 0.34，而有效支撑体积是 0.71</b>——优化目标选错，模型再准也白搭。</p>"},"fails":[{"name":"把 SRV 当优化目标","why":"复杂缝网的改造体积可以很大，但分支缝太窄、支撑剂进不去，闭合后是无效体积。本项目里 SRV 与产量的秩相关只有 0.34，而有效支撑体积是 0.71——优化 SRV 会系统性偏向\"造大体积但不产气\"。"},{"name":"代理模型域外外推","why":"模型选出的\"最优解\"常落在训练样本边界上，超出覆盖范围的预测看似合理实则不可信。必须加域外检测，并对前 10 名方案全部回数值模拟器复核。"},{"name":"把微地震事件云当缝网","why":"事件记录的是岩石剪切破裂位置，包含大量不导流、不被支撑的小事件，直接比体积会高估缝网规模。验证时要设事件密度阈值，并用施工压力拟合与产量三者互相印证。"}]},"demo":{"mode":"module","js":"demo/demo.js","label":"可运行示范","intro":"调节排量、黏度、水平应力差、天然裂缝密度与砂比，看缝网形态如何变化。重点对比三个数：改造体积 SRV、有效支撑体积、预测增产倍数——SRV 最大的那组，往往不是产得最多的那组。","height":720}}};

  var __mod = { exports: {} };
  (function (module, exports) {
/* 压裂裂缝形态预测 · 交互示范
   由施工参数（排量/黏度/砂比）与地质条件（水平应力差/天然裂缝密度）
   生成压裂裂缝网络并预测 SRV、缝长缝高、复杂度与有效支撑体积。 */
module.exports = {
  mount: function (root, api) {
    var JADE = '#2f7d6b', CLAY = '#b26a39', BAD = '#b05a51',
        OPT = '#41699b', INK3 = '#79828a', INK2 = '#4d565b';

    var GX = 62, GY = 40;            /* 网格：列（沿井筒）× 行（缝高方向） */
    var CELL = 7;                    /* 每格代表 7 m */
    var PERF = 6;                    /* 射孔簇数 */
    var WELL_ROW = 20;               /* 井筒所在行 */

    function rnd(seed) {
      var s = (seed >>> 0) || 1;
      return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    }
    function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

    /* ---------- 物理解释（自实现的简化代理模型） ---------- */
    /* 缝半长：排量与黏度越大越长；应力差越大越受限于主缝方向（更长更窄） */
    function halfLen(q, mu, dSig) {
      return 60 + 165 * Math.pow(q / 14, 0.55) * Math.pow(mu / 30, 0.22) * (0.85 + 0.35 * dSig / 8);
    }
    /* 分支（转向/开启天然裂缝）概率：应力差越小、天然裂缝越发育 → 越复杂 */
    function branchP(dSig, nat) {
      return clamp(0.30 * (1 - dSig / 11) + 0.42 * nat, 0.04, 0.82);
    }
    /* 缝宽：黏度与砂比主导；排量提高略增宽 */
    function width(mu, q, sand) {
      return clamp(2.2 + 3.6 * Math.pow(mu / 40, 0.7) + 1.4 * (q / 14) - 1.1 * sand, 1.2, 8.5);
    }

    /* ---------- 生成缝网：主干 + 递归分叉（随机游走） ---------- */
    function grow(seed, hp, nat, dSig, q, mu) {
      var acc = [];
      for (var i = 0; i < GX; i++) { acc.push([]); for (var j = 0; j < GY; j++) acc[i][j] = 0; }
      var R = rnd(seed);
      var bp = branchP(dSig, nat);
      var L = halfLen(q, mu, dSig);
      var maxCell = L / CELL;

      function walk(col, row, dir, energy, depth) {
        if (energy <= 0.12 || depth > 6) return;
        var c = Math.round(col), r = Math.round(row);
        if (c < 0 || c >= GX || r < 0 || r >= GY) return;
        acc[c][r] = Math.max(acc[c][r], clamp(energy, 0.15, 1));
        var nE = energy * (0.86 + 0.1 * R());
        /* 主方向前进（沿缝长方向 dir = ±1 表示向左右两翼，行方向抖动代表缝高起伏） */
        var jitter = (R() - 0.5) * (1.1 + 1.6 * nat);
        walk(col + dir * 1, row + jitter, dir, nE, depth);
        /* 分叉：开启天然裂缝，方向偏转 */
        if (R() < bp) {
          var turn = (R() - 0.5) * (2.2 + 2.4 * nat);
          walk(col + dir * 0.6, row + turn * 1.8, dir, nE * (0.5 + 0.3 * R()), depth + 1);
        }
      }

      for (var p = 0; p < PERF; p++) {
        var c0 = Math.round(GX / 2 + (p - (PERF - 1) / 2) * 7);
        walk(c0, WELL_ROW, 1, 1, 0);
        walk(c0, WELL_ROW, -1, 1, 0);
      }
      /* 统计 */
      var cells = 0, colsHit = [], maxExt = 0;
      for (var i2 = 0; i2 < GX; i2++) {
        var any = false;
        for (var j2 = 0; j2 < GY; j2++) if (acc[i2][j2] > 0) { cells++; any = true; maxExt = Math.max(maxExt, Math.abs(i2 - GX / 2)); }
        if (any) colsHit.push(i2);
      }
      return { acc: acc, cells: cells, L: L, maxExt: maxExt * CELL, bp: bp, width: width(mu, q, 0.3) };
    }

    root.innerHTML =
      '<div class="demo">' +
      '<div class="demo-head"><span class="kicker">INTERACTIVE · FRACTURE GEOMETRY &amp; SRV</span>' +
      '<h3>压裂裂缝长什么样，施工参数说了算</h3>' +
      '<p>同样的地层，<b>大排量低黏</b>造出的是又长又窄的单一主缝，<b>小应力差 + 天然裂缝发育</b>造出的是复杂缝网。' +
      '拖动下面的参数，看缝网形态、改造体积（SRV）与<b>有效支撑体积</b>怎么变——注意最后一项：' +
      '<b>SRV 大不等于产得多</b>，分支太细的缝网进不去砂，大部分是"无效体积"。</p></div>' +
      '<div class="ctl-row">' +
      '<div class="ctl"><label>排量 <output id="fg-oq">14 m³/min</output></label><input type="range" id="fg-q" min="4" max="22" step="1" value="14"></div>' +
      '<div class="ctl"><label>压裂液黏度 <output id="fg-om">30 mPa·s</output></label><input type="range" id="fg-m" min="2" max="80" step="2" value="30"></div>' +
      '<div class="ctl"><label>水平应力差 <output id="fg-os">5 MPa</output></label><input type="range" id="fg-s" min="1" max="11" step="0.5" value="5"></div>' +
      '<div class="ctl"><label>天然裂缝密度 <output id="fg-on">0.45</output></label><input type="range" id="fg-nt" min="0" max="1" step="0.05" value="0.45"></div>' +
      '<div class="ctl"><label>砂比 <output id="fg-osd">0.18</output></label><input type="range" id="fg-sd" min="0.05" max="0.4" step="0.01" value="0.18"></div>' +
      '<button class="btn-x" id="fg-rand">🎲 换一次随机实现</button>' +
      '</div>' +
      '<div class="grid2" style="grid-template-columns:1.35fr 1fr">' +
      '<div class="card-x"><h4>缝网俯视图（沿水平井筒展开，中间横线为井筒）</h4>' +
      '<svg id="fg-map" class="chart" viewBox="0 0 480 320" role="img" aria-label="裂缝网络俯视图"></svg>' +
      '<div class="legend"><span><i style="background:#2f7d6b"></i>主缝（有效支撑）</span><span><i style="background:#8fb9a8"></i>分支（部分支撑）</span>' +
      '<span><i style="background:#d8cfae"></i>开启但未支撑（无效体积）</span><span><i style="background:#41699b"></i>井筒</span></div></div>' +
      '<div class="card-x"><h4>形态与产能指标</h4>' +
      '<div class="readouts">' +
      '<div class="ro"><span class="k">裂缝半长</span><b id="fg-v1">—</b></div>' +
      '<div class="ro"><span class="k">改造体积 SRV</span><b id="fg-v2">—</b></div>' +
      '<div class="ro"><span class="k">有效支撑体积</span><b id="fg-v3">—</b></div>' +
      '<div class="ro"><span class="k">复杂度指数</span><b id="fg-v4">—</b></div>' +
      '<div class="ro"><span class="k">平均缝宽</span><b id="fg-v5">—</b></div>' +
      '<div class="ro"><span class="k">支撑剂铺置率</span><b id="fg-v6">—</b></div>' +
      '<div class="ro"><span class="k">预测增产倍数</span><b id="fg-v7">—</b></div>' +
      '<div class="ro"><span class="k">形态判读</span><b id="fg-v8">—</b></div>' +
      '</div>' +
      '<div id="fg-why" style="margin-top:12px;font-size:11.5px;line-height:1.75"></div></div>' +
      '</div>' +
      '<p class="note" id="fg-note"></p>' +
      '</div>';

    var $ = function (id) { return root.querySelector('#' + id); };
    var SEED = 1001;

    var W = 480, H = 320, ML = 30, MT = 14, MB = 26;
    var GW = W - ML - 12, GH = H - MT - MB;
    var CW = GW / GX, CH = GH / GY;
    var HEIGHT = 32;   /* 缝高 m，用于算体积 */

    function draw() {
      var q = +$('fg-q').value, mu = +$('fg-m').value, dSig = +$('fg-s').value,
          nat = +$('fg-nt').value, sand = +$('fg-sd').value;
      $('fg-oq').textContent = q + ' m³/min';
      $('fg-om').textContent = mu + ' mPa·s';
      $('fg-os').textContent = dSig + ' MPa';
      $('fg-on').textContent = nat.toFixed(2);
      $('fg-osd').textContent = sand.toFixed(2);

      var g = grow(SEED, 0, nat, dSig, q, mu);
      var w = width(mu, q, sand);
      /* 支撑剂能否进入：缝宽需大于粒径的 3 倍（简化为阈值 2.6 mm） */
      var propEff = clamp((w - 2.2) / 3.2, 0.05, 0.95) * clamp(sand / 0.22, 0.55, 1.15);
      propEff = clamp(propEff, 0.05, 0.92);

      var s = '';
      var srvCells = 0, effCells = 0;
      for (var i = 0; i < GX; i++) {
        for (var j = 0; j < GY; j++) {
          var v = g.acc[i][j];
          if (v <= 0) continue;
          srvCells++;
          /* 能量越高 = 缝越宽 = 越可能进砂 */
          var sup = v > 0.62 ? 1 : (v > 0.3 ? propEff * 0.75 : propEff * 0.25);
          if (sup > 0.45) effCells += 1; else effCells += sup;
          var col = v > 0.62 ? '#2f7d6b' : (v > 0.3 ? '#8fb9a8' : '#d8cfae');
          var op = v > 0.62 ? 0.92 : (v > 0.3 ? 0.72 : 0.5);
          s += '<rect x="' + (ML + i * CW).toFixed(1) + '" y="' + (MT + j * CH).toFixed(1) +
            '" width="' + (CW + 0.5).toFixed(1) + '" height="' + (CH + 0.5).toFixed(1) +
            '" fill="' + col + '" fill-opacity="' + op + '"/>';
        }
      }
      /* 井筒 */
      var wy = MT + WELL_ROW * CH + CH / 2;
      s += '<line x1="' + ML + '" y1="' + wy.toFixed(1) + '" x2="' + (ML + GW) + '" y2="' + wy.toFixed(1) +
        '" stroke="#41699b" stroke-width="2.4"/>';
      for (var p = 0; p < PERF; p++) {
        var cx = ML + (GX / 2 + (p - (PERF - 1) / 2) * 7) * CW;
        s += '<circle cx="' + cx.toFixed(1) + '" cy="' + wy.toFixed(1) + '" r="2.6" fill="#fff" stroke="#41699b" stroke-width="1.4"/>';
      }
      s += '<rect x="' + ML + '" y="' + MT + '" width="' + GW + '" height="' + GH + '" fill="none" stroke="#c9c2b0"/>' +
        '<text x="' + (ML + GW / 2) + '" y="' + (H - 8) + '" font-size="9.5" fill="' + INK3 + '" text-anchor="middle">沿井筒方向（每格 ' + CELL + ' m，总长约 ' + Math.round(GX * CELL) + ' m）</text>' +
        '<text x="12" y="' + (MT + GH / 2) + '" font-size="9.5" fill="' + INK2 + '" transform="rotate(-90 12 ' + (MT + GH / 2) + ')" text-anchor="middle">缝高方向</text>' +
        '<text x="' + (ML + 4) + '" y="' + (MT + 12) + '" font-size="9" fill="#41699b">井筒 · ' + PERF + ' 簇射孔</text>';
      $('fg-map').innerHTML = s;

      /* ---- 指标 ---- */
      var srv = srvCells * CELL * CELL * HEIGHT / 1e4;          /* 万 m³ */
      var eff = effCells * CELL * CELL * HEIGHT / 1e4;
      var cplx = clamp(g.bp * 1.5 + (srvCells / (GX * GY)) * 0.8, 0, 2.4);
      var shape = cplx > 1.35 ? '复杂缝网' : (cplx > 0.85 ? '主缝 + 次生缝' : '单一主缝');
      /* 增产倍数：主要由"有效支撑体积"与缝长决定，而非 SRV */
      var gain = 1 + 1.9 * Math.sqrt(eff / Math.max(srv, 0.01)) * Math.min(eff / 40, 1) + 0.5 * Math.min(g.L / 260, 1);
      gain = clamp(gain, 1, 4.2);

      $('fg-v1').textContent = Math.round(g.L) + ' m';
      $('fg-v2').textContent = srv.toFixed(1) + ' 万 m³';
      $('fg-v3').textContent = eff.toFixed(1) + ' 万 m³';
      $('fg-v3').className = eff / Math.max(srv, 0.01) > 0.55 ? 'ok' : (eff / Math.max(srv, 0.01) > 0.35 ? 'warn' : 'bad');
      $('fg-v4').textContent = cplx.toFixed(2);
      $('fg-v5').textContent = w.toFixed(1) + ' mm';
      $('fg-v5').className = w > 3.2 ? 'ok' : (w > 2.4 ? 'warn' : 'bad');
      $('fg-v6').textContent = Math.round(propEff * 100) + ' %';
      $('fg-v6').className = propEff > 0.6 ? 'ok' : (propEff > 0.35 ? 'warn' : 'bad');
      $('fg-v7').textContent = gain.toFixed(2) + ' ×';
      $('fg-v7').className = gain > 2.4 ? 'ok' : (gain > 1.6 ? 'warn' : 'bad');
      $('fg-v8').textContent = shape;

      var why = [];
      why.push('当前：缝半长 <b>' + Math.round(g.L) + ' m</b>，SRV <b>' + srv.toFixed(1) + ' 万 m³</b>，' +
        '但<b>有效支撑体积只有 ' + eff.toFixed(1) + ' 万 m³</b>（占 SRV 的 ' +
        Math.round(eff / Math.max(srv, 0.01) * 100) + '%）。');
      if (cplx > 1.3) {
        why.push('<b style="color:' + CLAY + '">这是复杂缝网</b>：应力差小 + 天然裂缝发育，裂缝到处转向。' +
          '好处是接触面积大（SRV 高），坏处是分支缝太窄——<b>支撑剂进不去</b>，' +
          '看图里大片<b style="color:#8e5229">浅黄色</b>格子：它们被压开了，但没有砂撑着，闭合后就是无效体积。');
        why.push('把 <b>黏度</b> 拉高（提高缝宽、改善携砂）或提高 <b>砂比</b>，看有效支撑比例怎么变化——' +
          '这是复杂缝网地层调配方的主要思路。');
      } else {
        why.push('<b style="color:' + JADE + '">这是以主缝为主的形态</b>：应力差大，裂缝被"锁"在最大主应力方向，' +
          '造出的是长而窄的单一缝（图里深色格子为主）。SRV 不算大，但<b>缝宽够、进砂好</b>，有效支撑比例反而高。');
        why.push('把 <b>应力差</b> 调到 2 MPa 以下再看看：缝网会突然"炸开"成复杂形态——' +
          '同样一方液，改造体积变大了，但有效支撑体积不一定跟着涨。');
      }
      if (w < 2.5) why.push('<b style="color:' + BAD + '">缝宽仅 ' + w.toFixed(1) + ' mm</b>：低于支撑剂进入的门槛，' +
        '此时再高的 SRV 都是虚的。现场对策是<b>先打高黏前置液造宽缝，再进砂</b>，而不是一味加排量。');
      $('fg-why').innerHTML = why.join('<br><br>');
    }

    ['fg-q', 'fg-m', 'fg-s', 'fg-nt', 'fg-sd'].forEach(function (id) { $(id).addEventListener('input', draw); });
    $('fg-rand').addEventListener('click', function () { SEED = (SEED * 1103515245 + 12345) >>> 0; draw(); });

    draw();
    $('fg-note').innerHTML =
      '把 <b>水平应力差</b> 从 11 拖到 1，是整个演示里最有信息量的一次操作：缝网从"一根长缝"膨胀成"一片网"，' +
      'SRV 差不多翻倍，但预测增产倍数只涨一点点——<b>因为多出来的体积大多是进不去砂的细分支</b>。' +
      '这就是为什么压裂设计不能只盯 SRV：真正决定产能的是<b>有效支撑体积 × 导流能力</b>。' +
      '再点几次"换一次随机实现"：同一组参数，缝网长相每次都不一样——<b>压裂结果的本质是不确定的</b>，' +
      '模型该给的是分布与期望，而不是一个确定的缝长。';
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
