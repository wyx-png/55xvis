/* =========================================================
   co1-completion-method-select · 案例插件（由 _build/build.mjs 自动生成，勿手改）
   源头是案例包 completion-method-select-case/source.js + demo/，改内容请改源头后重新构建。
   ========================================================= */
(function () {
  var DEF = {"id":"co1-completion-method-select","sceneId":"co1","title":"完井方式智能优选：知识图谱 + 案例推理","status":"ready","version":"1.0.0","updated":"2026-10-23","tabs":{"background":{"label":"专业背景","lede":"钻完井之后，井和储层怎么「接上」？裸眼、射孔、筛管、砾石充填四种完井方式各有适用边界——选错方式轻则产能打折，重则出砂、水淹导致返修。这一步没有唯一正确答案，是在产能、防砂、控水、成本之间做权衡。","judge":[{"label":"任务类型","value":"方案推荐","desc":"结构化决策，不是回归"},{"label":"数据门槛","value":"100—500 井次","desc":"需完井方式 + 生产表现标签"},{"label":"可见收益","value":"经验 → 可追溯","desc":"每条推荐给出相似案例依据"},{"label":"难度","value":"中","html":"<span class=\"dtag\" data-d=\"中\">难度 中</span>"}],"sections":[{"no":1,"en":"PROBLEM","title":"当前做法与问题","html":"<p>完井工程师拿到储层报告后，按<b>储层类型—出砂倾向—出水风险—井型</b>四类证据，从四种完井方式里选一种。经验丰富的工程师像查字典：储层疏松出砂 → 上砾石充填；层状薄互层 → 上筛管；坚硬低渗储层 → 射孔压裂投产。</p><p>问题是：这套「字典」装在老工程师脑子里。<b>新区块没有邻井可参考</b>时，选择依据只剩教科书规则，而教科书规则覆盖不了「低渗但水层很近」这类组合条件。选错方式的代价很高——出砂后改砾石充填要重修井段，费用是新井的三成以上。</p><div class=\"figure\"><svg viewBox=\"0 0 640 240\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"四种完井方式示意图\"><g font-size=\"11.5\" fill=\"#4d565b\"><text x=\"86\" y=\"22\" text-anchor=\"middle\" font-weight=\"700\" fill=\"#242b2e\">裸眼完井</text><text x=\"242\" y=\"22\" text-anchor=\"middle\" font-weight=\"700\" fill=\"#242b2e\">射孔完井</text><text x=\"398\" y=\"22\" text-anchor=\"middle\" font-weight=\"700\" fill=\"#242b2e\">筛管完井</text><text x=\"554\" y=\"22\" text-anchor=\"middle\" font-weight=\"700\" fill=\"#242b2e\">砾石充填</text></g><g><rect x=\"26\" y=\"36\" width=\"120\" height=\"150\" fill=\"#f5f2ea\" stroke=\"#c9c2b0\"/><rect x=\"66\" y=\"36\" width=\"14\" height=\"150\" fill=\"#b7b3a6\"/><rect x=\"46\" y=\"70\" width=\"80\" height=\"14\" fill=\"#d9e8e2\" stroke=\"#2f7d6b\" stroke-opacity=\".4\"/><rect x=\"46\" y=\"110\" width=\"80\" height=\"40\" fill=\"#e0b48c\" stroke=\"#b26a39\" stroke-opacity=\".5\"/><line x1=\"73\" y1=\"36\" x2=\"73\" y2=\"186\" stroke=\"#fff\" stroke-width=\"5\" stroke-dasharray=\"6 5\"/></g><g><rect x=\"182\" y=\"36\" width=\"120\" height=\"150\" fill=\"#f5f2ea\" stroke=\"#c9c2b0\"/><rect x=\"222\" y=\"36\" width=\"14\" height=\"150\" fill=\"#8fa5b5\"/><rect x=\"202\" y=\"70\" width=\"80\" height=\"14\" fill=\"#d9e8e2\" stroke=\"#2f7d6b\" stroke-opacity=\".4\"/><rect x=\"202\" y=\"110\" width=\"80\" height=\"40\" fill=\"#e0b48c\" stroke=\"#b26a39\" stroke-opacity=\".5\"/><g fill=\"#fff\"><circle cx=\"229\" cy=\"118\" r=\"2.4\"/><circle cx=\"229\" cy=\"132\" r=\"2.4\"/><circle cx=\"229\" cy=\"146\" r=\"2.4\"/></g></g><g><rect x=\"338\" y=\"36\" width=\"120\" height=\"150\" fill=\"#f5f2ea\" stroke=\"#c9c2b0\"/><rect x=\"378\" y=\"36\" width=\"14\" height=\"150\" fill=\"#8fa5b5\"/><rect x=\"358\" y=\"70\" width=\"80\" height=\"14\" fill=\"#d9e8e2\" stroke=\"#2f7d6b\" stroke-opacity=\".4\"/><rect x=\"358\" y=\"110\" width=\"80\" height=\"40\" fill=\"#e0b48c\" stroke=\"#b26a39\" stroke-opacity=\".5\"/><rect x=\"372\" y=\"110\" width=\"26\" height=\"76\" fill=\"#fff\" stroke=\"#41699b\" stroke-opacity=\".6\"/><path d=\"M374 112 l6 8 l-6 8 l6 8 l-6 8 l6 8 l-6 8 l6 8 l-6 8\" stroke=\"#41699b\" stroke-width=\"1.1\" fill=\"none\"/></g><g><rect x=\"494\" y=\"36\" width=\"120\" height=\"150\" fill=\"#f5f2ea\" stroke=\"#c9c2b0\"/><rect x=\"534\" y=\"36\" width=\"14\" height=\"150\" fill=\"#8fa5b5\"/><rect x=\"514\" y=\"70\" width=\"80\" height=\"14\" fill=\"#d9e8e2\" stroke=\"#2f7d6b\" stroke-opacity=\".4\"/><rect x=\"514\" y=\"110\" width=\"80\" height=\"40\" fill=\"#e0b48c\" stroke=\"#b26a39\" stroke-opacity=\".5\"/><rect x=\"528\" y=\"104\" width=\"36\" height=\"10\" fill=\"#e9d9a8\" stroke=\"#a97a1c\" stroke-opacity=\".6\"/><g fill=\"#a97a1c\" opacity=\".75\"><circle cx=\"534\" cy=\"120\" r=\"1.6\"/><circle cx=\"543\" cy=\"128\" r=\"1.6\"/><circle cx=\"552\" cy=\"119\" r=\"1.6\"/><circle cx=\"560\" cy=\"131\" r=\"1.6\"/><circle cx=\"549\" cy=\"140\" r=\"1.6\"/><circle cx=\"537\" cy=\"134\" r=\"1.6\"/><circle cx=\"556\" cy=\"122\" r=\"1.6\"/></g></g><g font-size=\"10\" fill=\"#79828a\"><text x=\"86\" y=\"206\" text-anchor=\"middle\">不下管柱，靠井壁自身支撑</text><text x=\"242\" y=\"206\" text-anchor=\"middle\">水泥固井 + 射孔打开</text><text x=\"398\" y=\"206\" text-anchor=\"middle\">防筛管砂，靠缝口桥架</text><text x=\"554\" y=\"206\" text-anchor=\"middle\">先充填砾石层再下筛管</text></g><g font-size=\"10.5\" font-weight=\"700\"><text x=\"86\" y=\"224\" text-anchor=\"middle\" fill=\"#3f8560\">最便宜 · 防砂最弱</text><text x=\"242\" y=\"224\" text-anchor=\"middle\" fill=\"#41699b\">最通用 · 工序最多</text><text x=\"398\" y=\"224\" text-anchor=\"middle\" fill=\"#a97a1c\">中成本 · 中防砂</text><text x=\"554\" y=\"224\" text-anchor=\"middle\" fill=\"#b26a39\">最贵 · 防砂最强</text></g></svg></div><div class=\"figcap\"><b>图 1</b><span>四种主流完井方式的结构对比：从左到右，防砂能力递增、成本递增、工序递增——<b>没有一种全面占优，选型本质是多目标权衡</b>。</span></div>"},{"no":2,"en":"INTERVENTION","title":"AI 能做什么","html":"<p>选型决策有两个可被算法替掉的环节：<b>一是把分散的规则组织起来</b>——用知识图谱把「储层特征—完井方式—生产表现」三元关系建成一张可查询的图，规则不再散落在文档与经验里；<b>二是把相似井的历史搬过来</b>——案例推理（CBR）在图谱里检索与当前井最相似的邻井，把它们「怎么选的、效果如何」直接展示给工程师。</p><p>算法输出的是<b>带依据的候选排序</b>（推荐方式 + 相似案例 + 各方式适配得分），最终拍板仍是人。这比黑箱分类网络更适合完井场景：方案要上会审查，审查要问「为什么」。</p><div class=\"figure\"><svg viewBox=\"0 0 640 210\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"知识图谱示意\"><g stroke=\"#c9c2b0\" stroke-width=\"1.2\"><line x1=\"320\" y1=\"105\" x2=\"150\" y2=\"46\"/><line x1=\"320\" y1=\"105\" x2=\"140\" y2=\"130\"/><line x1=\"320\" y1=\"105\" x2=\"170\" y2=\"180\"/><line x1=\"320\" y1=\"105\" x2=\"500\" y2=\"52\"/><line x1=\"320\" y1=\"105\" x2=\"510\" y2=\"132\"/><line x1=\"320\" y1=\"105\" x2=\"480\" y2=\"182\"/><line x1=\"150\" y1=\"46\" x2=\"140\" y2=\"130\" stroke-dasharray=\"3 4\"/></g><g font-size=\"11\" font-weight=\"700\" text-anchor=\"middle\"><rect x=\"262\" y=\"88\" width=\"116\" height=\"34\" rx=\"17\" fill=\"#f1f1dd\" stroke=\"#767a2e\"/><text x=\"320\" y=\"110\" fill=\"#5d6022\">当前评估井</text></g><g font-size=\"10.5\" text-anchor=\"middle\"><rect x=\"98\" y=\"32\" width=\"104\" height=\"28\" rx=\"14\" fill=\"#e7eef9\" stroke=\"#41699b\"/><text x=\"150\" y=\"50\" fill=\"#31527a\">疏松砂岩</text><rect x=\"86\" y=\"116\" width=\"108\" height=\"28\" rx=\"14\" fill=\"#e7eef9\" stroke=\"#41699b\"/><text x=\"140\" y=\"134\" fill=\"#31527a\">底水距顶 8 m</text><rect x=\"118\" y=\"166\" width=\"104\" height=\"28\" rx=\"14\" fill=\"#e7eef9\" stroke=\"#41699b\"/><text x=\"170\" y=\"184\" fill=\"#31527a\">出砂指数低</text><rect x=\"452\" y=\"38\" width=\"96\" height=\"28\" rx=\"14\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\"/><text x=\"500\" y=\"56\" fill=\"#235f51\">砾石充填</text><rect x=\"462\" y=\"118\" width=\"96\" height=\"28\" rx=\"14\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\"/><text x=\"510\" y=\"136\" fill=\"#235f51\">筛管完井</text><rect x=\"432\" y=\"168\" width=\"96\" height=\"28\" rx=\"14\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\"/><text x=\"480\" y=\"186\" fill=\"#235f51\">射孔完井</text></g><g font-size=\"9.5\" fill=\"#9ba3a9\"><text x=\"232\" y=\"66\">储层特征</text><text x=\"392\" y=\"66\">适应的完井方式</text><text x=\"206\" y=\"140\">风险证据</text></g><g font-size=\"10.5\" font-weight=\"700\"><text x=\"320\" y=\"152\" text-anchor=\"middle\" fill=\"#767a2e\">图谱沿边检索：证据 → 相似历史井 → 它们选了什么 → 投产后表现如何</text></g></svg></div><div class=\"figcap\"><b>图 2</b><span>知识图谱的查询路径：左边是当前井的证据节点，右边是完井方式节点，图检索把它们连起来，并沿「生产表现」边验证每种方式在相似条件下的历史成绩。</span></div>"},{"no":3,"en":"DATA","title":"你需要准备什么","html":"<p style=\"margin-bottom:14px\">知识图谱类任务最贵的一步是把完井设计书抽成结构化三元组，清单按这个目标列：</p><div class=\"checklist\"><div class=\"cl-head\"><span>数据准备清单 · 3 项</span><span class=\"cl-prog\"><span id=\"cl-txt\">0 / 3</span><span class=\"cl-bar\"><i id=\"cl-fill\"></i></span></span></div><div class=\"cl-item\" data-cl=\"0\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">储层与流体特征</span><span class=\"cl-s\">岩性、出砂指数、水层位置、井型</span></span><span class=\"cl-n\">单区块 100—500 井次</span></div><div class=\"cl-item\" data-cl=\"1\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">完井方式与生产表现</span><span class=\"cl-s\">方式、初期产能、出砂情况、措施记录</span></span><span class=\"cl-n\">作为标签与图谱验证边</span></div><div class=\"cl-item\" data-cl=\"2\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">完井设计书与总结</span><span class=\"cl-s\">非结构化文本</span></span><span class=\"cl-n\">用 NLP 抽取三元组</span></div></div>"},{"no":4,"en":"DIFFICULTY","title":"技术难度与参考方向","html":"<div style=\"display:flex;align-items:center;gap:14px;flex-wrap:wrap\"><span class=\"dtag\" data-d=\"中\">难度 中</span><span class=\"small muted\">难点在「最优没有统一定义」：产能、防砂、成本是多目标权衡，模型只能给候选排序，不能替人拍板。</span></div><div class=\"meter\"><i class=\"on\"></i><i class=\"on\"></i><i></i></div><p>验证路径：先在<b>有充分邻井的老区块</b>回放——把每口历史井的输入喂给系统，看它的推荐与当年实际选择、投产后表现是否一致；一致率过 75% 再用于新区块。</p><p style=\"margin-top:18px\"><span class=\"kicker plain\" style=\"color:var(--ink-4)\">可借鉴的通用技术</span></p><div class=\"refs\"><a class=\"ref\" href=\"#/method/kg\">知识图谱构建<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/kg\">案例推理 CBR<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/opt\">多目标排序<span class=\"ar\">↗</span></a></div>"}]},"workflow":{"label":"案例流程","title":"案例：为一口新井推荐完井方式","lead":["目标区块有 320 口历史井的完井记录与投产表现，现在要为一口新的疏松砂岩水平井给出完井方式建议。","目标不是「算出唯一答案」，而是输出<b>带依据的候选排序</b>：推荐方式 + 三条最相似历史井 + 每种方式的适配得分。"],"stats":[["历史井","320"],["证据维度","12"],["候选方式","4"],["回放一致率","≥75%"]],"steps":[{"name":"证据结构化","role":"数据","do":"把储层报告里的岩性、出砂指数、水层距离、渗透率、井型等 12 个字段抽成标准证据表；缺失字段显式标记「未知」，不填充均值。","effect":"每口井变成一条可比较的 12 维证据向量，未知的字段不参与相似度计算而不是乱算。","trap":"「水层距离未知」和「水层距离 5 m」完全不同——把未知填成均值会让底水风险被系统性低估。","fig":"<svg viewBox=\"0 0 560 96\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"证据结构化示意\"><g font-size=\"10.5\"><rect x=\"8\" y=\"18\" width=\"150\" height=\"60\" rx=\"8\" fill=\"#f8ecdf\" stroke=\"#b26a39\" stroke-opacity=\".4\"/><text x=\"83\" y=\"42\" text-anchor=\"middle\" fill=\"#8e5229\" font-weight=\"700\">完井设计书（文本）</text><text x=\"83\" y=\"60\" text-anchor=\"middle\" fill=\"#9ba3a9\">岩性/出砂/水层/井型…</text><path d=\"M162 48 h52\" stroke=\"#b26a39\" stroke-width=\"1.4\" marker-end=\"url(#arw1)\"/><rect x=\"222\" y=\"18\" width=\"150\" height=\"60\" rx=\"8\" fill=\"#e7eef9\" stroke=\"#41699b\" stroke-opacity=\".45\"/><text x=\"297\" y=\"42\" text-anchor=\"middle\" fill=\"#31527a\" font-weight=\"700\">12 维证据向量</text><text x=\"297\" y=\"60\" text-anchor=\"middle\" fill=\"#9ba3a9\">缺失字段标记 unknown</text><path d=\"M376 48 h52\" stroke=\"#41699b\" stroke-width=\"1.4\" marker-end=\"url(#arw1)\"/><rect x=\"436\" y=\"18\" width=\"116\" height=\"60\" rx=\"8\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\" stroke-opacity=\".45\"/><text x=\"494\" y=\"42\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">图谱证据节点</text><text x=\"494\" y=\"60\" text-anchor=\"middle\" fill=\"#9ba3a9\">可查询、可追溯</text></g><defs><marker id=\"arw1\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#9ba3a9\"/></marker></defs></svg>"},{"name":"图谱构建与规则沉淀","role":"算法","do":"把 320 口井写成三元组（井—具备—特征 / 井—采用—方式 / 方式—投产后—表现），再把工程师口述的选择规则整理成图谱上的约束边。","effect":"任何一条推荐都能沿边追溯：因为具备什么证据、哪条规则命中、哪些相似井支持。","trap":"规则之间会打架（防砂要求砾石充填、成本约束倾向筛管），打架的地方恰恰是要留给人的权衡点。","fig":"<svg viewBox=\"0 0 560 96\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"三元组建图示意\"><g font-size=\"10.5\"><g stroke=\"#c9c2b0\" stroke-width=\"1.1\"><line x1=\"140\" y1=\"48\" x2=\"280\" y2=\"48\"/><line x1=\"280\" y1=\"48\" x2=\"420\" y2=\"48\"/></g><circle cx=\"140\" cy=\"48\" r=\"22\" fill=\"#e7eef9\" stroke=\"#41699b\"/><text x=\"140\" y=\"52\" text-anchor=\"middle\" fill=\"#31527a\" font-weight=\"700\">井</text><circle cx=\"280\" cy=\"48\" r=\"22\" fill=\"#f1f1dd\" stroke=\"#767a2e\"/><text x=\"280\" y=\"52\" text-anchor=\"middle\" fill=\"#5d6022\" font-weight=\"700\">特征</text><circle cx=\"420\" cy=\"48\" r=\"22\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\"/><text x=\"420\" y=\"52\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">方式</text><text x=\"210\" y=\"40\" text-anchor=\"middle\" fill=\"#9ba3a9\">具备</text><text x=\"350\" y=\"40\" text-anchor=\"middle\" fill=\"#9ba3a9\">适应</text><text x=\"280\" y=\"88\" text-anchor=\"middle\" fill=\"#79828a\">320 口井 × 3 类三元组 ≈ 4600 条边，规则沉淀为带权重的约束边</text></g></svg>"},{"name":"相似案例检索","role":"算法","do":"用加权相似度（数值字段归一化欧氏 + 类别字段 Jaccard）在图谱里检索最相似的 k=3 口历史井，权重用历史井的投产表现反推。","effect":"每条候选方式都挂上真实依据：「与当前井最像的 3 口井里，2 口选了筛管、1 口改了砾石充填」。","trap":"相似度权重不能全交给算法调——投产表现里混着工程改进的年份效应，老井的高产可能只是当时措施多。","fig":"<svg viewBox=\"0 0 560 96\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"相似检索示意\"><g font-size=\"10.5\"><circle cx=\"76\" cy=\"48\" r=\"20\" fill=\"#f1f1dd\" stroke=\"#767a2e\" stroke-width=\"2\"/><text x=\"76\" y=\"52\" text-anchor=\"middle\" fill=\"#5d6022\" font-weight=\"700\">新井</text><g stroke=\"#c9c2b0\" stroke-dasharray=\"4 3\"><line x1=\"96\" y1=\"40\" x2=\"230\" y2=\"24\"/><line x1=\"96\" y1=\"52\" x2=\"230\" y2=\"52\"/><line x1=\"96\" y1=\"60\" x2=\"230\" y2=\"76\"/></g><g><rect x=\"238\" y=\"12\" width=\"96\" height=\"26\" rx=\"13\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\"/><text x=\"286\" y=\"29\" text-anchor=\"middle\" fill=\"#235f51\">相似井 #1</text><rect x=\"238\" y=\"40\" width=\"96\" height=\"26\" rx=\"13\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\"/><text x=\"286\" y=\"57\" text-anchor=\"middle\" fill=\"#235f51\">相似井 #2</text><rect x=\"238\" y=\"68\" width=\"96\" height=\"26\" rx=\"13\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\"/><text x=\"286\" y=\"85\" text-anchor=\"middle\" fill=\"#235f51\">相似井 #3</text></g><path d=\"M342 52 h50\" stroke=\"#2f7d6b\" stroke-width=\"1.4\" marker-end=\"url(#arw2)\"/><rect x=\"400\" y=\"32\" width=\"150\" height=\"40\" rx=\"8\" fill=\"#fff\" stroke=\"#c9c2b0\"/><text x=\"475\" y=\"49\" text-anchor=\"middle\" fill=\"#242b2e\" font-weight=\"700\">推荐排序 + 依据链</text><text x=\"475\" y=\"64\" text-anchor=\"middle\" fill=\"#9ba3a9\">每条推荐可沿边追溯</text></g><defs><marker id=\"arw2\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#2f7d6b\"/></marker></defs></svg>"},{"name":"多目标评分与排序","role":"算法","do":"对四种完井方式各算三个分项：产能潜力、防砂可靠度、综合成本，加权合成适配分并排序，权重默认取本区块历史统计值、允许工程师拖动调整。","effect":"输出不是单一答案，而是候选排序 + 敏感度：权重怎么动、第一名会不会换，工程师看得见。","trap":"权重一动结果就变——所以界面必须把权重变化对排序的影响显式画出来，否则「推荐」就成了伪客观。","fig":"<svg viewBox=\"0 0 560 96\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"多目标评分示意\"><g font-size=\"10.5\"><rect x=\"30\" y=\"14\" width=\"170\" height=\"14\" rx=\"7\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\" stroke-opacity=\".5\"/><rect x=\"30\" y=\"14\" width=\"142\" height=\"14\" rx=\"7\" fill=\"#2f7d6b\" opacity=\".8\"/><text x=\"208\" y=\"25\" fill=\"#235f51\" font-weight=\"700\">砾石充填 0.86</text><rect x=\"30\" y=\"36\" width=\"170\" height=\"14\" rx=\"7\" fill=\"#e7eef9\" stroke=\"#41699b\" stroke-opacity=\".5\"/><rect x=\"30\" y=\"36\" width=\"118\" height=\"14\" rx=\"7\" fill=\"#41699b\" opacity=\".8\"/><text x=\"208\" y=\"47\" fill=\"#31527a\" font-weight=\"700\">筛管 0.71</text><rect x=\"30\" y=\"58\" width=\"170\" height=\"14\" rx=\"7\" fill=\"#f8ecdf\" stroke=\"#b26a39\" stroke-opacity=\".5\"/><rect x=\"30\" y=\"58\" width=\"86\" height=\"14\" rx=\"7\" fill=\"#b26a39\" opacity=\".8\"/><text x=\"208\" y=\"69\" fill=\"#8e5229\" font-weight=\"700\">射孔 0.52</text><g transform=\"translate(280,10)\"><rect x=\"0\" y=\"0\" width=\"260\" height=\"70\" rx=\"8\" fill=\"#fff\" stroke=\"#c9c2b0\"/><text x=\"130\" y=\"18\" text-anchor=\"middle\" fill=\"#79828a\" font-size=\"10\">权重敏感性：防砂权重 0.4 → 0.6 时</text><path d=\"M20 50 h220\" stroke=\"#ddd7c8\"/><path d=\"M40 44 C 90 30, 150 34, 240 46\" stroke=\"#2f7d6b\" fill=\"none\" stroke-width=\"1.6\"/><text x=\"130\" y=\"64\" text-anchor=\"middle\" fill=\"#242b2e\" font-size=\"10\" font-weight=\"700\">第一名不变 → 推荐稳健</text></g></g></svg>"},{"name":"回放验证与人工确认","role":"人工","do":"在 320 口历史井上回放整套流程，统计「推荐第一名 = 当年实际选择」的一致率；再由完井工程师对当前井的推荐做终审。","effect":"一致率 78% 即达到验收线；不一致的 22% 逐口归类，多数是新规则缺失而非算法错误。","trap":"别把一致率当唯一指标——当年实际选择本身也有错（投产后出砂改措施），这类「不一致」其实是系统发现了历史失误。"}],"metrics":{"title":"怎么算「做对了」","html":"<p>推荐系统不能只看「猜中率」。一个把所有井都推成「射孔完井」的模型，在射孔占六成的区块也能拿到 60% 一致率，但毫无价值。所以按<b>方式分项统计</b>：</p><div style=\"margin:10px 0 6px\"><svg viewBox=\"0 0 640 130\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"分项一致率柱状图\"><g font-size=\"10\" fill=\"#9ba3a9\"><line x1=\"110\" y1=\"10\" x2=\"110\" y2=\"112\" stroke=\"#ddd7c8\"/><text x=\"106\" y=\"16\" text-anchor=\"end\">100%</text><text x=\"106\" y=\"64\" text-anchor=\"end\">50%</text><text x=\"106\" y=\"112\" text-anchor=\"end\">0%</text><line x1=\"110\" y1=\"61\" x2=\"630\" y2=\"61\" stroke=\"#efece1\"/><line x1=\"110\" y1=\"112\" x2=\"630\" y2=\"112\" stroke=\"#ddd7c8\"/></g><g font-size=\"10.5\"><rect x=\"130\" y=\"25.6\" width=\"34\" height=\"86.4\" rx=\"5\" fill=\"#b26a39\" opacity=\".85\"/><text x=\"147\" y=\"124\" text-anchor=\"middle\" fill=\"#242b2e\">射孔</text><text x=\"147\" y=\"20\" text-anchor=\"middle\" fill=\"#8e5229\" font-weight=\"700\">0.89</text><rect x=\"240\" y=\"43\" width=\"34\" height=\"69\" rx=\"5\" fill=\"#2f7d6b\" opacity=\".85\"/><text x=\"257\" y=\"124\" text-anchor=\"middle\" fill=\"#242b2e\">砾石充填</text><text x=\"257\" y=\"38\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">0.82</text><rect x=\"350\" y=\"49.5\" width=\"34\" height=\"62.5\" rx=\"5\" fill=\"#41699b\" opacity=\".85\"/><text x=\"367\" y=\"124\" text-anchor=\"middle\" fill=\"#242b2e\">筛管</text><text x=\"367\" y=\"44\" text-anchor=\"middle\" fill=\"#31527a\" font-weight=\"700\">0.69</text><rect x=\"460\" y=\"55.5\" width=\"34\" height=\"56.5\" rx=\"5\" fill=\"#767a2e\" opacity=\".85\"/><text x=\"477\" y=\"124\" text-anchor=\"middle\" fill=\"#242b2e\">裸眼</text><text x=\"477\" y=\"50\" text-anchor=\"middle\" fill=\"#5d6022\" font-weight=\"700\">0.61</text><g font-size=\"9.5\" fill=\"#9ba3a9\"><text x=\"147\" y=\"17\" text-anchor=\"middle\">样本 41%</text><text x=\"257\" y=\"17\" text-anchor=\"middle\">样本 21%</text><text x=\"367\" y=\"17\" text-anchor=\"middle\">样本 34%</text><text x=\"477\" y=\"17\" text-anchor=\"middle\">样本 4%</text></g><text x=\"565\" y=\"88\" text-anchor=\"middle\" fill=\"#b05a51\" font-size=\"10\" font-weight=\"700\">样本越少</text><text x=\"565\" y=\"102\" text-anchor=\"middle\" fill=\"#b05a51\" font-size=\"10\" font-weight=\"700\">一致率越不稳</text></g></svg></div><p style=\"margin-top:6px\">读法：<b>样本少的方式（裸眼 4%）一致率天然不稳</b>，评审时要看置信区间而不是单点数字；真正决定系统价值的是「不一致且历史错了」的比例——这部分是系统发现历史失误的能力，要单独列出来汇报。</p>"},"fails":[{"name":"证据字段缺失被均值填没","why":"水层距离、出砂指数缺失时填了区块均值，底水风险被系统性低估，推荐了不适用的裸眼方式。解法是显式 unknown + 相似度中跳过。"},{"name":"相似检索退化成同井位检索","why":"权重全压在井距上，检索回来的全是同一井组的井——它们彼此抄袭，等于没参考。解法是限制同井组最多取 1 口。"},{"name":"把历史失误学成规则","why":"某年赶工期集中选择了便宜方式，投产表现差，图谱把「差表现」错归因到方式本身。需要按年份分层抽样做归因校验。"}]},"demo":{"mode":"module","js":"demo/demo.js","label":"可运行示范","intro":"拖动储层条件滑杆构造一口新井，看知识图谱式推理怎么给出四种完井方式的适配排序、最相似的邻井案例，以及权重调整对排序的敏感性。","height":640}}};

  var __mod = { exports: {} };
  (function (module, exports) {
/* 完井方式智能优选 · 交互示范（模块模式，挂进 Shadow DOM）
   简化的多目标评分 + 案例推理：拖动储层条件，看四种完井方式的适配分排序
   如何随条件与权重变化，以及推荐依据（命中规则 + 相似邻井）怎么生成。 */
module.exports = {
  mount: function (root, api) {
    var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
    var JADE = 'var(--jade,#2f7d6b)', CLAY = 'var(--clay,#b26a39)',
        OPT = 'var(--c-opt,#41699b)', KG = 'var(--c-kg,#767a2e)',
        BAD = 'var(--bad,#b05a51)', INK3 = 'var(--ink-3,#79828a)';
    var METHODS = ['裸眼完井', '射孔完井', '筛管完井', '砾石充填'];
    var COLORS = ['#767a2e', '#41699b', '#41699b', '#2f7d6b'];

    root.innerHTML =
      '<div class="demo">' +
      '<div class="demo-head"><span class="kicker">INTERACTIVE · KNOWLEDGE-GRAPH SCORING</span>' +
      '<h3>为一口新井推荐完井方式</h3>' +
      '<p>拖动滑杆构造储层条件，系统按「产能 / 防砂 / 成本」三目标给四种方式打分排序——' +
      '同时列出命中的规则与最相似的历史井案例。切换右侧权重，观察推荐会不会翻盘。</p></div>' +
      '<div class="ctl-row">' +
      '<div class="ctl"><label>出砂倾向 <output id="c1-o1">0.75</output></label><input type="range" id="c1-s1" min="0" max="1" step="0.05" value="0.75"></div>' +
      '<div class="ctl"><label>岩石强度 <output id="c1-o2">0.40</output></label><input type="range" id="c1-s2" min="0" max="1" step="0.05" value="0.4"></div>' +
      '<div class="ctl"><label>底水距离 <output id="c1-o3">0.30</output></label><input type="range" id="c1-s3" min="0" max="1" step="0.05" value="0.3"></div>' +
      '<div class="ctl"><label>井型 </label><select id="c1-well"><option>直井</option><option selected>水平井</option></select></div>' +
      '</div>' +
      '<div class="ctl-row" style="padding-top:8px;padding-bottom:8px">' +
      '<span class="ctl" style="font-weight:700;color:' + INK3 + '">目标权重</span>' +
      '<button class="btn-x ghost" id="c1-p1">防砂优先</button>' +
      '<button class="btn-x ghost" id="c1-p2">产能优先</button>' +
      '<button class="btn-x ghost" id="c1-p3">成本优先</button>' +
      '<div class="ctl"><label>防砂 <output id="c1-ow1">0.50</output></label><input type="range" id="c1-w1" min="0" max="1" step="0.05" value="0.5"></div>' +
      '<div class="ctl"><label>产能 <output id="c1-ow2">0.30</output></label><input type="range" id="c1-w2" min="0" max="1" step="0.05" value="0.3"></div>' +
      '<div class="ctl"><label>成本 <output id="c1-ow3">0.20</output></label><input type="range" id="c1-w3" min="0" max="1" step="0.05" value="0.2"></div>' +
      '</div>' +
      '<div class="grid2">' +
      '<div class="card-x"><h4>方式适配排序（加权分）</h4><div id="c1-bars"></div>' +
      '<div id="c1-stable" style="margin-top:10px;font-size:11.5px"></div></div>' +
      '<div class="card-x"><h4>最相似历史井（案例推理检索）</h4><div id="c1-cbr"></div></div>' +
      '</div>' +
      '<div id="c1-rules" style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px"></div>' +
      '<p class="note" id="c1-note"></p>' +
      '</div>';

    var $ = function (id) { return root.querySelector('#' + id); };

    /* ---- 评分模型（简化的行业经验公式，系数为示范值） ---- */
    function scores(sand, rock, water, hwell, w) {
      /* 各方式分项：产能 p / 防砂 s / 成本 c，均 0~1 */
      var m = [
        { p: 0.55 + 0.35 * rock + (hwell ? 0.08 : 0), s: 1 - sand * 0.92, c: 0.92 },
        { p: 0.70 + 0.20 * (1 - sand), s: 0.30 + 0.25 * rock, c: 0.42 },
        { p: 0.62 + 0.18 * (1 - sand) + (hwell ? 0.10 : 0), s: 0.52 + 0.30 * rock, c: 0.62 },
        { p: 0.58 + 0.12 * (1 - sand), s: 0.88 + 0.10 * sand, c: 0.22 }
      ];
      var out = m.map(function (r) {
        return { p: r.p, s: r.s, c: r.c,
          total: w[0] * r.s + w[1] * r.p + w[2] * r.c };
      });
      /* 底水惩罚：裸眼与筛管对底水敏感（控水能力弱） */
      out[0].total -= (1 - water) * 0.30 * (w[0] * 0.6 + w[1] * 0.4);
      out[2].total -= (1 - water) * 0.16 * (w[0] * 0.6 + w[1] * 0.4);
      return out;
    }

    function rules(sand, rock, water, hwell) {
      var r = [];
      if (sand > 0.6) r.push(['bad', '出砂倾向 ' + sand.toFixed(2) + ' &gt; 0.6 — 裸眼完井被硬性排除']);
      if (water < 0.35) r.push(['warn', '底水距顶近（' + (8 + water * 22).toFixed(0) + ' m）— 裸眼/筛管控水弱，评分下调']);
      if (hwell) r.push(['ok', '水平井 — 裸眼与筛管的产能加成生效（+8%—10%）']);
      if (rock < 0.35) r.push(['warn', '岩石强度低 — 井壁支撑差，裸眼风险高']);
      if (sand > 0.6 && rock < 0.5) r.push(['ok', '规则链命中：疏松储层 + 强度不足 → 砾石充填权重上调']);
      return r;
    }

    /* 固定种子的邻井案例库：条件随输入微扰，保持可复现 */
    function neighbors(sand, rock, water, hwell, wsand) {
      var wells = [];
      var names = ['邻井 W-11', '邻井 W-27', '邻井 W-33'];
      var pick = [2, 3, 2]; /* 筛管 / 砾石 / 筛管 */
      var outs = ['投产 18 个月轻微出砂，已控', '投产 24 个月无出砂', '初期高产，14 个月换砾石充填'];
      for (var i = 0; i < 3; i++) {
        wells.push({
          name: names[i],
          sand: Math.min(1, sand + (i - 1) * 0.08),
          rock: Math.max(0, rock + (i - 1) * 0.06),
          method: METHODS[pick[i]],
          out: outs[i],
          sim: 0.94 - Math.abs(i - 1) * 0.05 - Math.abs(sand - 0.75) * 0.1
        });
      }
      return wells;
    }

    function draw() {
      var sand = +$('c1-s1').value, rock = +$('c1-s2').value, water = +$('c1-s3').value;
      var hwell = $('c1-well').selectedIndex === 1;
      var w = [+$('c1-w1').value, +$('c1-w2').value, +$('c1-w3').value];
      $('c1-o1').textContent = sand.toFixed(2);
      $('c1-o2').textContent = rock.toFixed(2);
      $('c1-o3').textContent = water.toFixed(2);
      $('c1-ow1').textContent = w[0].toFixed(2);
      $('c1-ow2').textContent = w[1].toFixed(2);
      $('c1-ow3').textContent = w[2].toFixed(2);

      var sc = scores(sand, rock, water, hwell, w);
      var max = Math.max.apply(null, sc.map(function (r) { return r.total; }));
      var order = sc.map(function (r, i) { return i; }).sort(function (a, b) { return sc[b].total - sc[a].total; });

      $('c1-bars').innerHTML = sc.map(function (r, i) {
        var pct = Math.max(4, r.total * 100);
        return '<div class="bar-row"><span class="bl">' + METHODS[i] + '</span>' +
          '<span class="bt"><span class="bf" style="width:' + pct.toFixed(1) + '%;background:' + COLORS[i] +
          (i === order[0] ? ';opacity:.92' : ';opacity:.55') + '"></span></span>' +
          '<span class="bv" style="color:' + (i === order[0] ? JADE : INK3) + '">' + r.total.toFixed(2) + '</span></div>';
      }).join('');

      /* 敏感性：把防砂权重外推到 1，看第一名是否更换 */
      var alt = scores(sand, rock, water, hwell, [1, 0, 0]);
      var bestAllSand = 0;
      alt.forEach(function (r, i) { if (r.total > alt[bestAllSand].total) bestAllSand = i; });
      var stableTxt;
      if (bestAllSand === order[0]) {
        stableTxt = '<span class="tag-y">排序稳健</span>&nbsp;即使防砂权重拉满，第一名仍是 <b>' + METHODS[order[0]] + '</b>';
      } else {
        stableTxt = '<span class="tag-n">排序敏感</span>&nbsp;防砂权重拉满后第一名会换成 <b>' + METHODS[bestAllSand] +
          '</b> —— 当前推荐对权重有依赖，上会时要带敏感性分析';
      }
      $('c1-stable').innerHTML = stableTxt;

      /* 案例推理卡片 */
      $('c1-cbr').innerHTML = neighbors(sand, rock, water, hwell).map(function (n) {
        return '<div style="border:1px solid var(--line,#e9e4d8);border-radius:9px;padding:8px 11px;margin-bottom:8px;background:var(--card-soft,#fdfcf9)">' +
          '<div style="display:flex;justify-content:space-between;align-items:center">' +
          '<b style="font-size:12.5px">' + n.name + '</b>' +
          '<span style="font-family:ui-monospace,monospace;font-size:11px;color:' + KG + '">相似度 ' + n.sim.toFixed(2) + '</span></div>' +
          '<div style="font-size:11.5px;color:var(--ink-2,#4d565b);margin-top:3px">选择：<b style="color:' + JADE + '">' + n.method + '</b> ｜ ' + n.out + '</div>' +
          '<div style="font-size:10.5px;color:' + INK3 + ';margin-top:2px">出砂 ' + n.sand.toFixed(2) + ' · 强度 ' + n.rock.toFixed(2) + '</div></div>';
      }).join('');

      /* 命中规则 */
      $('c1-rules').innerHTML = rules(sand, rock, water, hwell).map(function (r) {
        var bg = r[0] === 'bad' ? 'var(--bad-bg,#f9e9e5);color:var(--bad,#b05a51)'
          : r[0] === 'warn' ? 'var(--warn-bg,#f9efd7);color:var(--warn,#a97a1c)'
          : 'var(--ok-bg,#e7f3ea);color:var(--ok,#3f8560)';
        return '<span style="font-size:11px;font-weight:600;padding:3px 10px;border-radius:99px;background:' + bg + '">' + r[1] + '</span>';
      }).join('');

      var top = order[0];
      $('c1-note').innerHTML =
        '当前条件下系统推荐 <b>' + METHODS[top] + '</b>（加权 ' + sc[top].total.toFixed(2) + '）。' +
        '注意三条证据链都指向它：命中规则、相似井的实际选择、以及分项得分（产能 ' + sc[top].p.toFixed(2) +
        ' / 防砂 ' + sc[top].s.toFixed(2) + ' / 成本 ' + sc[top].c.toFixed(2) + '）。' +
        '试着把<b>出砂倾向拖到 0.3 以下</b>再看——筛管的防砂溢价不再值钱，排序立刻洗牌；' +
        '这正是流程里「多目标评分 + 敏感性分析」要暴露给工程师的信息。';
    }

    ['c1-s1', 'c1-s2', 'c1-s3', 'c1-w1', 'c1-w2', 'c1-w3', 'c1-well'].forEach(function (id) {
      $(id).addEventListener('input', draw);
    });
    /* 权重预设 */
    function preset(a, b, c) {
      $('c1-w1').value = a; $('c1-w2').value = b; $('c1-w3').value = c; draw();
    }
    $('c1-p1').addEventListener('click', function () { preset(0.6, 0.25, 0.15); });
    $('c1-p2').addEventListener('click', function () { preset(0.2, 0.6, 0.2); });
    $('c1-p3').addEventListener('click', function () { preset(0.15, 0.2, 0.65); });

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
