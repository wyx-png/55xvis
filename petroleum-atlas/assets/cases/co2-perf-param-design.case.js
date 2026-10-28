/* =========================================================
   co2-perf-param-design · 案例插件（由 _build/build.mjs 自动生成，勿手改）
   源头是案例包 perf-param-design-case/source.js + demo/，改内容请改源头后重新构建。
   ========================================================= */
(function () {
  var DEF = {"id":"co2-perf-param-design","sceneId":"co2","title":"射孔参数智能设计：代理模型 + 帕累托优化","status":"ready","version":"1.0.0","updated":"2026-10-23","tabs":{"background":{"label":"专业背景","lede":"射孔是让井筒与储层「打通」的最后一步：用射孔弹穿透套管与水泥环，在储层里炸出一条条孔道。孔密、相位角、穿透深度这三个参数，直接决定产能上限和出砂风险——参数设计本质是一道多目标优化题。","judge":[{"label":"任务类型","value":"参数寻优","desc":"优化算法的主场"},{"label":"数据门槛","value":"200—500 井次","desc":"或用物理模型造数据"},{"label":"可见收益","value":"产能 +5%—15%","desc":"同等条件下不增成本"},{"label":"难度","value":"中","html":"<span class=\"dtag\" data-d=\"中\">难度 中</span>"}],"sections":[{"no":1,"en":"PROBLEM","title":"当前做法与问题","html":"<p>现场的射孔设计表大多是「查表 + 经验」：按储层类型套标准方案——孔密 16 孔/米、相位 90°、穿深按弹型上限。标准方案在均质储层上不吃亏，但遇到<b>各向异性强</b>或<b>底水贴近</b>的储层，标准相位可能让产能损失三成，或把孔道打进了水层。</p><div class=\"figure\"><svg viewBox=\"0 0 640 230\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"射孔几何参数示意\"><rect x=\"30\" y=\"26\" width=\"580\" height=\"178\" fill=\"#f5f2ea\" stroke=\"#c9c2b0\"/><rect x=\"60\" y=\"26\" width=\"60\" height=\"178\" fill=\"#8fa5b5\" opacity=\".85\"/><rect x=\"60\" y=\"26\" width=\"60\" height=\"178\" fill=\"none\" stroke=\"#7d93a3\"/><rect x=\"120\" y=\"26\" width=\"14\" height=\"178\" fill=\"#c8cdd2\"/><rect x=\"30\" y=\"96\" width=\"580\" height=\"44\" fill=\"#e0b48c\" opacity=\".55\"/><text x=\"50\" y=\"118\" font-size=\"10.5\" fill=\"#5d4326\" transform=\"rotate(-90 50 118)\" text-anchor=\"middle\">套管 + 水泥环</text><g stroke=\"#41699b\" stroke-width=\"2.4\" fill=\"none\"><path d=\"M134 108 L 210 76 L 292 66\"/><path d=\"M134 116 L 214 128 L 300 138\"/><path d=\"M134 124 L 206 172 L 288 190\"/></g><g font-size=\"10.5\" fill=\"#31527a\"><circle cx=\"292\" cy=\"66\" r=\"3.4\" fill=\"#41699b\"/><text x=\"300\" y=\"62\">孔道 A（60° 相位）</text><circle cx=\"300\" cy=\"138\" r=\"3.4\" fill=\"#41699b\"/><text x=\"308\" y=\"142\">孔道 B（180° 相位）</text><circle cx=\"288\" cy=\"190\" r=\"3.4\" fill=\"#41699b\"/><text x=\"296\" y=\"196\">孔道 C（穿入水层!）</text></g><rect x=\"30\" y=\"140\" width=\"580\" height=\"64\" fill=\"#7fb3d5\" opacity=\".18\"/><text x=\"596\" y=\"152\" font-size=\"10.5\" fill=\"#31527a\" text-anchor=\"end\">水层</text><g font-size=\"10.5\" fill=\"#5d4326\"><text x=\"410\" y=\"90\">孔密 = 每米井段的孔数（图示 3 孔 / 1.5 m = 20 孔/m）</text><text x=\"410\" y=\"108\">相位 = 相邻孔道夹角，决定渗流汇聚程度</text><text x=\"410\" y=\"126\">穿深 = 孔道进入储层的深度，越过钻井污染带才有意义</text></g><text x=\"320\" y=\"222\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#b05a51\" font-weight=\"700\">孔道 C 穿透了隔层——参数不当的代价是提前水淹</text></svg></div><div class=\"figcap\"><b>图 1</b><span>射孔的三个关键几何参数。孔道 C 说明了一个反直觉事实：<b>穿深不是越深越好</b>——穿透气顶隔板或底水遮挡层，产能没增多少，含水率先上去了。</span></div>"},{"no":2,"en":"INTERVENTION","title":"AI 能做什么","html":"<p>产能与出砂对射孔参数的响应有物理模型（有限元/半解析），但<b>单次模拟太慢</b>，没法在现场交互式地试。AI 的介入点是<b>代理模型</b>：先用物理模型批量仿真几万组参数，训练一个毫秒级响应的神经网络替身，再用多目标优化在替身上扫出「产能—出砂」的<b>帕累托前沿</b>。</p><p>工程师看到的不再是单一推荐，而是一条前沿曲线：想要多高的产能，就要承担多大的出砂风险，每一档都给出对应参数组合。这是优化算法类场景的标准打法——<b>物理模型造数据，代理模型提速，优化算法出方案集</b>。</p><div class=\"figure\"><svg viewBox=\"0 0 640 200\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"代理模型工作流\"><g font-size=\"11\" font-weight=\"700\" text-anchor=\"middle\"><rect x=\"18\" y=\"70\" width=\"130\" height=\"52\" rx=\"9\" fill=\"#e7eef9\" stroke=\"#41699b\"/><text x=\"83\" y=\"92\" fill=\"#31527a\">物理模型</text><text x=\"83\" y=\"108\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">单次 ≈ 小时级</text><rect x=\"188\" y=\"70\" width=\"130\" height=\"52\" rx=\"9\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\"/><text x=\"253\" y=\"92\" fill=\"#235f51\">批量仿真 2 万组</text><text x=\"253\" y=\"108\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">离线预计算</text><rect x=\"358\" y=\"70\" width=\"120\" height=\"52\" rx=\"9\" fill=\"#f8ecdf\" stroke=\"#b26a39\"/><text x=\"418\" y=\"92\" fill=\"#8e5229\">代理模型</text><text x=\"418\" y=\"108\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">单次 ≈ 1 ms</text><rect x=\"518\" y=\"70\" width=\"110\" height=\"52\" rx=\"9\" fill=\"#f1f1dd\" stroke=\"#767a2e\"/><text x=\"573\" y=\"92\" fill=\"#5d6022\">帕累托前沿</text><text x=\"573\" y=\"108\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">候选方案集</text></g><g stroke=\"#9ba3a9\" stroke-width=\"1.4\" fill=\"#9ba3a9\"><path d=\"M148 96 h34\" marker-end=\"url(#pc-ar)\"/><path d=\"M318 96 h34\" marker-end=\"url(#pc-ar)\"/><path d=\"M478 96 h34\" marker-end=\"url(#pc-ar)\"/></g><defs><marker id=\"pc-ar\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\"/></marker></defs><text x=\"320\" y=\"165\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#79828a\">训练一次，受益整个区块：代理模型学好后，任何新井的参数扫描都是毫秒级</text></svg></div><div class=\"figcap\"><b>图 2</b><span>「贵模型离线跑，快模型在线答」——这是所有射孔/压裂/注采参数优化类场景的通用架构。</span></div>"},{"no":3,"en":"DATA","title":"你需要准备什么","html":"<p style=\"margin-bottom:14px\">这类任务最大的优点是<b>不依赖现场标注</b>——训练集可以由物理模型批量生成：</p><div class=\"checklist\"><div class=\"cl-head\"><span>数据准备清单 · 3 项</span><span class=\"cl-prog\"><span id=\"cl-txt\">0 / 3</span><span class=\"cl-bar\"><i id=\"cl-fill\"></i></span></span></div><div class=\"cl-item\" data-cl=\"0\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">储层与岩石力学参数</span><span class=\"cl-s\">强度、应力、渗透率、各向异性系数</span></span><span class=\"cl-n\">无需标注</span></div><div class=\"cl-item\" data-cl=\"1\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">射孔参数—产能样本</span><span class=\"cl-s\">孔密、相位、穿深 → 测试产量</span></span><span class=\"cl-n\">200—500 井次，或仿真生成</span></div><div class=\"cl-item\" data-cl=\"2\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">出砂与作业反馈</span><span class=\"cl-s\">出砂量、修井记录</span></span><span class=\"cl-n\">作为优化的硬约束</span></div></div>"},{"no":4,"en":"DIFFICULTY","title":"技术难度与参考方向","html":"<div style=\"display:flex;align-items:center;gap:14px;flex-wrap:wrap\"><span class=\"dtag\" data-d=\"中\">难度 中</span><span class=\"small muted\">难在代理模型的保真度：物理模型本身就有误差，代理再拟合一次，误差会叠乘。</span></div><div class=\"meter\"><i class=\"on\"></i><i class=\"on\"></i><i></i></div><p>先做小规模验证：挑 20 口有测试产量的历史井，比对代理模型预测的产能比与实测值的偏差；偏差 &lt; 8% 即可用于方案筛选，最终方案仍用全物理模型复算一遍。</p><p style=\"margin-top:18px\"><span class=\"kicker plain\" style=\"color:var(--ink-4)\">可借鉴的通用技术</span></p><div class=\"refs\"><a class=\"ref\" href=\"#/method/opt\">代理模型<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/opt\">多目标优化<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/opt\">帕累托前沿<span class=\"ar\">↗</span></a></div>"}]},"workflow":{"label":"案例流程","title":"案例：为一口底水油井设计射孔参数","lead":["目标井：砂岩油井，油层 12 m，底水距油顶 6 m，岩石强度中等。任务是在「不出砂、不早水淹」的约束下把产能比做到最高。","产线工具只有标准方案（16 孔/m · 90° 相位）；本案例的基线就是它，一切改进以「比标准方案好多少」来度量。"],"stats":[["仿真样本","2 万"],["参数维度","3"],["优化目标","2"],["产能提升","+11%"]],"steps":[{"name":"圈定参数空间","role":"数据","do":"孔密 8—32 孔/m、相位 30°—180°、穿深 0.3—0.9 m，按弹型能力与负压设计裁剪出物理可行的组合空间。","effect":"把无限参数空间压缩成 2 万组可仿真的离散网格，每组都带「工程上打得出来」的标签。","trap":"别把弹型做不到的组合留在网格里——优化结果里出现「穿深 0.9 m」而现场 deepest 弹只有 0.6 m，整套方案作废。","fig":"<svg viewBox=\"0 0 560 90\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"参数空间示意\"><g font-size=\"10\"><g transform=\"translate(30,10)\"><rect width=\"150\" height=\"60\" rx=\"8\" fill=\"#e7eef9\" stroke=\"#41699b\" stroke-opacity=\".5\"/><text x=\"75\" y=\"24\" text-anchor=\"middle\" fill=\"#31527a\" font-weight=\"700\">孔密 8—32 /m</text><text x=\"75\" y=\"42\" text-anchor=\"middle\" fill=\"#79828a\">网格 7 档</text><text x=\"75\" y=\"54\" text-anchor=\"middle\" fill=\"#9ba3a9\">经济性截断</text></g><g transform=\"translate(205,10)\"><rect width=\"150\" height=\"60\" rx=\"8\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\" stroke-opacity=\".5\"/><text x=\"75\" y=\"24\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">相位 30°—180°</text><text x=\"75\" y=\"42\" text-anchor=\"middle\" fill=\"#79828a\">网格 6 档</text><text x=\"75\" y=\"54\" text-anchor=\"middle\" fill=\"#9ba3a9\">弹型限制</text></g><g transform=\"translate(380,10)\"><rect width=\"150\" height=\"60\" rx=\"8\" fill=\"#f8ecdf\" stroke=\"#b26a39\" stroke-opacity=\".5\"/><text x=\"75\" y=\"24\" text-anchor=\"middle\" fill=\"#8e5229\" font-weight=\"700\">穿深 0.3—0.9 m</text><text x=\"75\" y=\"42\" text-anchor=\"middle\" fill=\"#79828a\">网格 5 档</text><text x=\"75\" y=\"54\" text-anchor=\"middle\" fill=\"#9ba3a9\">隔层位置约束</text></g><text x=\"280\" y=\"86\" text-anchor=\"middle\" fill=\"#79828a\" font-size=\"10.5\">7 × 6 × 5 = 210 组基础组合 × 井况扰动 = 2 万组仿真样本</text></g></svg>"},{"name":"批量仿真生成训练集","role":"算法","do":"用半解析产能模型 + 出砂判据对 2 万组参数逐组计算：产能比 PR、临界压差、出砂指数。","effect":"得到一张「参数 → 后果」的完整查找表，覆盖包括糟糕组合在内的所有角落。","trap":"仿真样本里必须保留「故意失败」的组合（高孔密 + 强底水），否则代理模型没见过失败长什么样，会在边界上瞎猜。","fig":"<svg viewBox=\"0 0 560 92\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"仿真采样示意\"><g font-size=\"10\"><rect x=\"26\" y=\"12\" width=\"220\" height=\"66\" rx=\"8\" fill=\"#fff\" stroke=\"#c9c2b0\"/><g fill=\"#41699b\" opacity=\".55\"><circle cx=\"46\" cy=\"30\" r=\"2.2\"/><circle cx=\"66\" cy=\"40\" r=\"2.2\"/><circle cx=\"88\" cy=\"26\" r=\"2.2\"/><circle cx=\"110\" cy=\"46\" r=\"2.2\"/><circle cx=\"132\" cy=\"30\" r=\"2.2\"/><circle cx=\"154\" cy=\"54\" r=\"2.2\"/><circle cx=\"176\" cy=\"36\" r=\"2.2\"/><circle cx=\"198\" cy=\"58\" r=\"2.2\"/><circle cx=\"58\" cy=\"60\" r=\"2.2\"/><circle cx=\"120\" cy=\"64\" r=\"2.2\"/><circle cx=\"180\" cy=\"66\" r=\"2.2\"/><circle cx=\"92\" cy=\"56\" r=\"2.2\"/></g><text x=\"136\" y=\"72\" text-anchor=\"middle\" fill=\"#79828a\">拉美随机采样：好组合坏组合都要有</text><path d=\"M252 45 h46\" stroke=\"#2f7d6b\" stroke-width=\"1.5\" marker-end=\"url(#c2ar)\"/><rect x=\"306\" y=\"12\" width=\"220\" height=\"66\" rx=\"8\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\" stroke-opacity=\".4\"/><text x=\"416\" y=\"38\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\" font-size=\"10.5\">每组输出 3 个结果</text><text x=\"416\" y=\"54\" text-anchor=\"middle\" fill=\"#79828a\">PR 产能比 / 临界压差 / 出砂指数</text><text x=\"416\" y=\"70\" text-anchor=\"middle\" fill=\"#9ba3a9\">失败组合不丢弃，打标后保留</text></g><defs><marker id=\"c2ar\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#2f7d6b\"/></marker></defs></svg>"},{"name":"训练代理模型","role":"算法","do":"用小型 MLP 拟合「参数+井况 → PR/出砂」，输入做归一化，按 8:2 划分训练验证集，重点检查外推区（参数空间角落）的误差。","effect":"毫秒级响应的替身，误差 ≤ 5%（与全物理模型相比），足够支撑方案级筛选。","trap":"代理模型在训练分布内很准、分布外乱说——所有输入必须做范围钳制，超出网格的井况直接拒答而不是外推。","fig":"<svg viewBox=\"0 0 560 90\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"代理模型结构\"><g font-size=\"10\"><g fill=\"#e7eef9\" stroke=\"#41699b\" stroke-opacity=\".6\"><circle cx=\"70\" cy=\"26\" r=\"9\"/><circle cx=\"70\" cy=\"46\" r=\"9\"/><circle cx=\"70\" cy=\"66\" r=\"9\"/></g><text x=\"70\" y=\"82\" text-anchor=\"middle\" fill=\"#31527a\">输入 5 维</text><g stroke=\"#c9c2b0\" stroke-width=\".8\"><line x1=\"79\" y1=\"26\" x2=\"241\" y2=\"18\"/><line x1=\"79\" y1=\"26\" x2=\"241\" y2=\"36\"/><line x1=\"79\" y1=\"26\" x2=\"241\" y2=\"56\"/><line x1=\"79\" y1=\"26\" x2=\"241\" y2=\"74\"/><line x1=\"79\" y1=\"46\" x2=\"241\" y2=\"18\"/><line x1=\"79\" y1=\"46\" x2=\"241\" y2=\"36\"/><line x1=\"79\" y1=\"46\" x2=\"241\" y2=\"56\"/><line x1=\"79\" y1=\"46\" x2=\"241\" y2=\"74\"/><line x1=\"79\" y1=\"66\" x2=\"241\" y2=\"18\"/><line x1=\"79\" y1=\"66\" x2=\"241\" y2=\"36\"/><line x1=\"79\" y1=\"66\" x2=\"241\" y2=\"56\"/><line x1=\"79\" y1=\"66\" x2=\"241\" y2=\"74\"/></g><g fill=\"#f8ecdf\" stroke=\"#b26a39\" stroke-opacity=\".6\"><circle cx=\"250\" cy=\"18\" r=\"9\"/><circle cx=\"250\" cy=\"36\" r=\"9\"/><circle cx=\"250\" cy=\"56\" r=\"9\"/><circle cx=\"250\" cy=\"74\" r=\"9\"/></g><text x=\"250\" y=\"88\" text-anchor=\"middle\" fill=\"#8e5229\">隐藏层 ×2</text><g stroke=\"#c9c2b0\" stroke-width=\".8\"><line x1=\"259\" y1=\"18\" x2=\"421\" y2=\"28\"/><line x1=\"259\" y1=\"36\" x2=\"421\" y2=\"28\"/><line x1=\"259\" y1=\"56\" x2=\"421\" y2=\"28\"/><line x1=\"259\" y1=\"74\" x2=\"421\" y2=\"28\"/><line x1=\"259\" y1=\"18\" x2=\"421\" y2=\"60\"/><line x1=\"259\" y1=\"36\" x2=\"421\" y2=\"60\"/><line x1=\"259\" y1=\"56\" x2=\"421\" y2=\"60\"/><line x1=\"259\" y1=\"74\" x2=\"421\" y2=\"60\"/></g><g fill=\"#e6f1ec\" stroke=\"#2f7d6b\" stroke-opacity=\".7\"><circle cx=\"430\" cy=\"28\" r=\"9\"/><circle cx=\"430\" cy=\"60\" r=\"9\"/></g><text x=\"430\" y=\"46\" text-anchor=\"middle\" fill=\"#235f51\" font-size=\"9.5\">PR</text><text x=\"478\" y=\"48\" fill=\"#79828a\" font-size=\"9.5\">出砂</text><text x=\"508\" y=\"30\" text-anchor=\"middle\" fill=\"#79828a\" font-size=\"9.5\">验证误差 ≤5%</text><text x=\"508\" y=\"62\" text-anchor=\"middle\" fill=\"#79828a\" font-size=\"9.5\">分布外拒答</text></g></svg>"},{"name":"多目标优化扫描","role":"算法","do":"在代理模型上做 NSGA-II 式的种群搜索，双目标 = 产能比最大、出砂风险最小，约束 = 临界压差下不出砂。","effect":"输出帕累托前沿：一排「产能—风险」互不支配的候选方案，而不是单一最优点。","trap":"约束处理要硬：违反不出砂约束的解直接淘汰而不是罚分，否则前沿上会混进「漂亮但不可用」的点。","fig":"<svg viewBox=\"0 0 560 96\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"帕累托前沿示意\"><g font-size=\"10\"><line x1=\"50\" y1=\"80\" x2=\"530\" y2=\"80\" stroke=\"#ddd7c8\"/><line x1=\"50\" y1=\"80\" x2=\"50\" y2=\"10\" stroke=\"#ddd7c8\"/><text x=\"290\" y=\"93\" text-anchor=\"middle\" fill=\"#79828a\">出砂风险 →</text><text x=\"14\" y=\"46\" fill=\"#79828a\" transform=\"rotate(-90 14 46)\" text-anchor=\"middle\">产能比 →</text><g fill=\"#c9c2b0\"><circle cx=\"150\" cy=\"62\" r=\"3\"/><circle cx=\"200\" cy=\"66\" r=\"3\"/><circle cx=\"250\" cy=\"58\" r=\"3\"/><circle cx=\"300\" cy=\"64\" r=\"3\"/><circle cx=\"350\" cy=\"56\" r=\"3\"/><circle cx=\"400\" cy=\"60\" r=\"3\"/><circle cx=\"450\" cy=\"52\" r=\"3\"/></g><path d=\"M110 22 C 180 30, 300 34, 490 40\" stroke=\"#2f7d6b\" stroke-width=\"2\" fill=\"none\"/><g fill=\"#2f7d6b\"><circle cx=\"130\" cy=\"26\" r=\"4\"/><circle cx=\"230\" cy=\"31\" r=\"4\"/><circle cx=\"330\" cy=\"35\" r=\"4\"/><circle cx=\"470\" cy=\"39\" r=\"4\"/></g><text x=\"130\" y=\"16\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">高产能-高风险</text><text x=\"470\" y=\"56\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">稳健方案</text><text x=\"300\" y=\"14\" text-anchor=\"middle\" fill=\"#79828a\">帕累托前沿：动一个目标，另一个必然变差</text></g></svg>"},{"name":"方案复核与现场确认","role":"人工","do":"把前沿上选中的 2—3 个方案送全物理模型复算，核对穿深与隔层距离；与射孔队确认弹型库存与负压工艺可行。","effect":"最终方案产能比 0.94（标准方案 0.83），临界压差裕度 1.8 倍，且未穿入底水。","trap":"别忘了和完井方式核对——筛管完井与射孔的孔道清洁工艺不同，代理模型假设的清洁度要人工确认。"}],"metrics":{"title":"怎么算「做对了」","html":"<p>这类任务的关键指标不是模型误差，而是<b>「同预算下比标准方案好多少」</b>：</p><div style=\"margin:10px 0 6px\"><svg viewBox=\"0 0 640 140\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"方案对比图\"><g font-size=\"10.5\"><rect x=\"60\" y=\"30\" width=\"360\" height=\"22\" rx=\"11\" fill=\"#efece1\"/><rect x=\"60\" y=\"30\" width=\"299\" height=\"22\" rx=\"11\" fill=\"#b26a39\" opacity=\".75\"/><text x=\"366\" y=\"45\" fill=\"#8e5229\" font-weight=\"700\">标准方案 PR 0.83 · 出砂风险 中</text><rect x=\"60\" y=\"66\" width=\"360\" height=\"22\" rx=\"11\" fill=\"#efece1\"/><rect x=\"60\" y=\"66\" width=\"338\" height=\"22\" rx=\"11\" fill=\"#2f7d6b\" opacity=\".85\"/><text x=\"406\" y=\"81\" fill=\"#235f51\" font-weight=\"700\">优化方案 PR 0.94 · 出砂风险 低</text><rect x=\"60\" y=\"102\" width=\"360\" height=\"22\" rx=\"11\" fill=\"#efece1\"/><rect x=\"60\" y=\"102\" width=\"380\" height=\"22\" rx=\"11\" fill=\"#b05a51\" opacity=\".7\"/><text x=\"448\" y=\"117\" fill=\"#b05a51\" font-weight=\"700\">激进方案 PR 0.98 · 已穿入底水 ✕</text><text x=\"560\" y=\"45\" text-anchor=\"middle\" fill=\"#79828a\">基线</text><text x=\"560\" y=\"81\" text-anchor=\"middle\" fill=\"#2f7d6b\" font-weight=\"700\">+11% 产能</text><text x=\"560\" y=\"117\" text-anchor=\"middle\" fill=\"#9ba3a9\">被约束淘汰</text></g><line x1=\"420\" y1=\"22\" x2=\"420\" y2=\"130\" stroke=\"#c9c2b0\" stroke-dasharray=\"4 3\"/></svg></div><p style=\"margin-top:6px\">注意激进方案：产能比 0.98 很诱人，但它违反了硬约束。<b>约束的意义就是把这种方案从前沿上剔掉</b>——如果报告里出现「最优点违反了约束」，是优化器配置错了，不是权衡。</p>"},"fails":[{"name":"代理模型在参数角落外推","why":"高孔密 + 大穿深的角落训练样本少，模型外推给出虚高产能。解法是采样时对角落加密 + 对超出网格的输入拒答。"},{"name":"约束写成软罚分","why":"出砂约束用了罚项，前沿上留下「罚了 0.02 但风险翻倍」的点。硬约束过滤是底线。"},{"name":"忘了与弹型目录对齐","why":"优化给出的穿深超出库存弹型能力。参数空间的物理可行性要在建模前就裁掉，而不是事后裁方案。"}]},"demo":{"mode":"module","js":"demo/demo.js","label":"可运行示范","intro":"拖动孔密 / 相位 / 穿深三个滑杆，看产能比与出砂风险怎么变；点「智能寻优」在代理模型上跑一遍网格搜索，画出帕累托前沿并标出推荐方案。","height":660}}};

  var __mod = { exports: {} };
  (function (module, exports) {
/* 射孔参数智能设计 · 交互示范
   简化代理模型：孔密/相位/穿深 → 产能比 PR 与出砂风险；
   「智能寻优」按钮在网格上搜索并绘制帕累托前沿。 */
module.exports = {
  mount: function (root, api) {
    var JADE = 'var(--jade,#2f7d6b)', CLAY = 'var(--clay,#b26a39)',
        OPT = 'var(--c-opt,#41699b)', BAD = 'var(--bad,#b05a51)',
        INK3 = 'var(--ink-3,#79828a)';
    root.innerHTML =
      '<div class="demo">' +
      '<div class="demo-head"><span class="kicker">INTERACTIVE · SURROGATE + PARETO</span>' +
      '<h3>射孔参数设计台：产能与出砂的权衡</h3>' +
      '<p>拖动三个参数，右侧代理模型实时给出产能比（PR，越高越好）与出砂风险（越低越好）。' +
      '点「智能寻优」，看优化算法怎么在几百组组合里扫出<b>帕累托前沿</b>，并按底水约束筛掉危险方案。</p></div>' +
      '<div class="ctl-row">' +
      '<div class="ctl"><label>孔密 <output id="c2-o1">16</output> 孔/m</label><input type="range" id="c2-s1" min="8" max="32" step="2" value="16"></div>' +
      '<div class="ctl"><label>相位 <output id="c2-o2">90</output>°</label><input type="range" id="c2-s2" min="30" max="180" step="15" value="90"></div>' +
      '<div class="ctl"><label>穿深 <output id="c2-o3">0.45</output> m</label><input type="range" id="c2-s3" min="0.3" max="0.9" step="0.05" value="0.45"></div>' +
      '<button class="btn-x" id="c2-go">▶ 智能寻优</button>' +
      '</div>' +
      '<div class="grid2">' +
      '<div class="card-x"><h4>当前参数的响应（代理模型）</h4>' +
      '<div class="bar-row"><span class="bl">产能比 PR</span><span class="bt"><span class="bf" id="c2-b1"></span></span><span class="bv" id="c2-v1">—</span></div>' +
      '<div class="bar-row"><span class="bl">出砂风险</span><span class="bt"><span class="bf" id="c2-b2"></span></span><span class="bv" id="c2-v2">—</span></div>' +
      '<div class="bar-row"><span class="bl">底水安全</span><span class="bt"><span class="bf" id="c2-b3"></span></span><span class="bv" id="c2-v3">—</span></div>' +
      '<div id="c2-verdict" style="margin-top:10px;font-size:11.5px"></div>' +
      '<div class="legend"><span><i style="background:' + CLAY + '"></i>产能</span><span><i style="background:' + OPT + '"></i>出砂</span><span><i style="background:' + JADE + '"></i>水淹</span></div></div>' +
      '<div class="card-x"><h4>参数空间扫描（产能比 × 出砂风险）</h4>' +
      '<svg id="c2-chart" class="chart" viewBox="0 0 420 300" role="img" aria-label="帕累托图"></svg>' +
      '<div class="legend"><span><i style="background:#c9c2b0"></i>可行组合</span><span><i style="background:' + CLAY + '"></i>被支配</span><span><i style="background:' + JADE + '"></i>帕累托前沿</span><span><i style="background:' + BAD + '"></i>违反约束</span></div></div>' +
      '</div>' +
      '<p class="note" id="c2-note"></p>' +
      '</div>';

    var $ = function (id) { return root.querySelector('#' + id); };
    var W = 420, H = 300, L = 46, R = 14, T = 14, B = 34;

    /* 简化代理模型：系数为示范值，量纲无量纲 */
    function model(dens, phas, pen) {
      /* 相位 60° 最优（各向异性储层），90° 次之，30°/180° 差 */
      var ph = Math.exp(-Math.pow((phas - 60) / 62, 2));
      /* 产能：孔密与穿深边际递减（污染带 0.35m 是门槛） */
      var densF = 1 - Math.exp(-dens / 13);
      var penF = pen < 0.35 ? pen / 0.35 * 0.55 : 0.55 + (pen - 0.35) / 0.55 * 0.45;
      var pr = 0.46 + 0.42 * densF * (0.55 + 0.45 * ph) * (0.72 + 0.28 * penF);
      /* 出砂风险：孔密越高、穿深越深、岩石越软风险越大 */
      var sand = 0.14 + dens / 32 * 0.42 + pen / 0.9 * 0.30 - 0.12 * ph;
      /* 底水安全：穿深 0.62m 以上开始逼近隔层 */
      var water = pen <= 0.62 ? 1 : Math.max(0, 1 - (pen - 0.62) / 0.18);
      return { pr: pr, sand: Math.min(1, sand), water: water };
    }

    function draw() {
      var dens = +$('c2-s1').value, phas = +$('c2-s2').value, pen = +$('c2-s3').value;
      $('c2-o1').textContent = dens; $('c2-o2').textContent = phas; $('c2-o3').textContent = pen.toFixed(2);
      var r = model(dens, phas, pen);
      $('c2-b1').style.width = (r.pr * 100).toFixed(1) + '%';
      $('c2-b1').style.background = CLAY; $('c2-b1').style.opacity = .85;
      $('c2-v1').textContent = r.pr.toFixed(2);
      $('c2-b2').style.width = (r.sand * 100).toFixed(1) + '%';
      $('c2-b2').style.background = OPT; $('c2-b2').style.opacity = .8;
      $('c2-v2').textContent = r.sand.toFixed(2);
      $('c2-b3').style.width = (r.water * 100).toFixed(1) + '%';
      $('c2-b3').style.background = r.water < 0.5 ? BAD : JADE; $('c2-b3').style.opacity = .8;
      $('c2-v3').textContent = r.water < 0.5 ? '穿隔层!' : (r.water < 0.9 ? '偏近' : '安全');

      var vd = $('c2-verdict');
      if (r.water < 0.5) {
        vd.innerHTML = '<span class="tag-n">违反约束</span>&nbsp;穿深 ' + pen.toFixed(2) + ' m 已越过隔层——这个方案再高产也不能用';
      } else if (r.sand > 0.62) {
        vd.innerHTML = '<span class="tag-n">高风险</span>&nbsp;出砂风险 ' + r.sand.toFixed(2) + '：投产半年内大概率出砂，需要砾石充填配套';
      } else {
        vd.innerHTML = '<span class="tag-y">可行</span>&nbsp;PR ' + r.pr.toFixed(2) + '，试着自己找「产能高且风险低」的角落——然后点智能寻优看算法找得对不对';
      }
      drawChart(null, dens, phas, pen);
    }

    function xOf(v) { return L + v * (W - L - R); }
    function yOf(v) { return T + (1 - v) * (H - T - B); }

    function drawChart(front, cd, cp, ce) {
      var s = '';
      [0, .25, .5, .75, 1].forEach(function (v) {
        s += '<line x1="' + L + '" y1="' + yOf(v) + '" x2="' + (W - R) + '" y2="' + yOf(v) + '" stroke="#efece1"/>' +
          '<text x="' + (L - 5) + '" y="' + (yOf(v) + 3) + '" font-size="9" fill="#9ba3a9" text-anchor="end" font-family="monospace">' + v.toFixed(2) + '</text>';
      });
      [0, .25, .5, .75, 1].forEach(function (v) {
        s += '<text x="' + xOf(v) + '" y="' + (H - B + 12) + '" font-size="9" fill="#9ba3a9" text-anchor="middle" font-family="monospace">' + v.toFixed(2) + '</text>';
      });
      s += '<line x1="' + L + '" y1="' + (H - B) + '" x2="' + (W - R) + '" y2="' + (H - B) + '" stroke="#c9c2b0"/>' +
        '<line x1="' + L + '" y1="' + T + '" x2="' + L + '" y2="' + (H - B) + '" stroke="#c9c2b0"/>' +
        '<text x="' + (W - R) + '" y="' + (H - 8) + '" font-size="10" fill="#79828a" text-anchor="end">出砂风险 →</text>' +
        '<text x="14" y="' + (H / 2) + '" font-size="10" fill="#79828a" transform="rotate(-90 14 ' + (H / 2) + ')" text-anchor="middle">产能比 PR →</text>';

      /* 网格扫描 7×6×5=210 组 */
      var pts = [];
      for (var d = 8; d <= 32; d += 4) for (var p = 30; p <= 180; p += 30) for (var e = 0.3; e <= 0.9; e += 0.15) {
        pts.push(model(d, p, e));
      }
      /* 帕累托：风险升序，PR 必须递增才不被支配；违反水约束单独标 */
      var feasible = pts.filter(function (r) { return r.water >= 0.5; });
      var sorted = feasible.slice().sort(function (a, b) { return a.sand - b.sand; });
      var front2 = [], best = -1;
      sorted.forEach(function (r) { if (r.pr > best) { front2.push(r); best = r.pr; } });

      feasible.forEach(function (r) {
        var onF = front2.indexOf(r) >= 0;
        if (onF) return;
        s += '<circle cx="' + xOf(r.sand) + '" cy="' + yOf(r.pr) + '" r="3" fill="#c9c2b0" opacity=".65"/>';
      });
      var bads = pts.filter(function (r) { return r.water < 0.5; });
      bads.forEach(function (r) {
        s += '<circle cx="' + xOf(Math.min(r.sand, 0.98)) + '" cy="' + yOf(r.pr) + '" r="2.6" fill="' + BAD + '" opacity=".3"/>';
      });
      s += '<path d="' + front2.map(function (r, i) { return (i ? 'L' : 'M') + xOf(r.sand).toFixed(1) + ' ' + yOf(r.pr).toFixed(1); }).join(' ') + '" fill="none" stroke="' + JADE + '" stroke-width="1.8" opacity=".8"/>';
      front2.forEach(function (r) {
        s += '<circle cx="' + xOf(r.sand) + '" cy="' + yOf(r.pr) + '" r="3.6" fill="' + JADE + '"/>';
      });
      /* 当前参数位置 */
      if (cd != null) {
        var cur = model(cd, cp, ce);
        var bad = cur.water < 0.5;
        s += '<circle cx="' + xOf(Math.min(cur.sand, 0.99)) + '" cy="' + yOf(cur.pr) + '" r="6" fill="none" stroke="' + (bad ? BAD : '#242b2e') + '" stroke-width="2"/>' +
          '<circle cx="' + xOf(Math.min(cur.sand, 0.99)) + '" cy="' + yOf(cur.pr) + '" r="2.5" fill="' + (bad ? BAD : '#242b2e') + '"/>';
      }
      /* 推荐点：前沿上 PR 最高且风险 <0.55 */
      var rec = null;
      front2.forEach(function (r) { if (r.sand < 0.55 && (!rec || r.pr > rec.pr)) rec = r; });
      if (rec) {
        s += '<circle cx="' + xOf(rec.sand) + '" cy="' + yOf(rec.pr) + '" r="7" fill="none" stroke="' + JADE + '" stroke-width="1.6" stroke-dasharray="3 2"/>' +
          '<text x="' + (xOf(rec.sand) - 8) + '" y="' + (yOf(rec.pr) - 9) + '" font-size="9.5" fill="#235f51" font-weight="700" text-anchor="end">推荐</text>';
      }
      $('c2-chart').innerHTML = s;

      if (front) {
        $('c2-note').innerHTML =
          '寻优扫了 <b>210 组参数</b>：灰点是被支配的组合（有别的组合产能更高、风险更低），绿点是<b>帕累托前沿</b>——' +
          '沿这条线，想多要产能就必须接受更多出砂风险，不存在「既要又要」。' +
          '红点是<b>被硬约束淘汰</b>的组合（穿深越过底水隔层），它们再优秀也不进候选。' +
          '当前十字圈是你手动调的位置——把它拖到前沿附近，说明你已经有工程师的直觉了。';
      }
    }

    $('c2-s1').addEventListener('input', draw);
    $('c2-s2').addEventListener('input', draw);
    $('c2-s3').addEventListener('input', draw);
    $('c2-go').addEventListener('click', function () {
      $('c2-note').innerHTML = '寻优中：代理模型逐组评估 210 组参数…';
      setTimeout(function () { drawChart(true, +$('c2-s1').value, +$('c2-s2').value, +$('c2-s3').value); }, 350);
    });

    draw();
    $('c2-note').innerHTML = '先随手拖滑杆感受一下三个参数的效应：<b>相位 60° 附近产能最优</b>（各向异性储层的经验值）；<b>穿深过 0.62 m 开始威胁隔层</b>；孔密是产能与出砂共同的推手。想看系统级视角，点右上「智能寻优」。';
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
