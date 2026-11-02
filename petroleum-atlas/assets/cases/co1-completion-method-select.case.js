/* =========================================================
   co1-completion-method-select · 案例插件（由 _build/build.mjs 自动生成，勿手改）
   源头是案例包 completion-method-select-case/source.js + demo/，改内容请改源头后重新构建。
   ========================================================= */
(function () {
  var DEF = {"id":"co1-completion-method-select","sceneId":"co1","title":"完井方式智能优选：知识图谱 + 案例推理","status":"ready","version":"1.0.0","updated":"2026-10-23","tabs":{"background":{"label":"专业背景","lede":"钻完井之后，井和储层怎么「接上」？裸眼、射孔、筛管、砾石充填四种完井方式各有适用边界——选错方式轻则产能打折，重则出砂、水淹导致返修。这一步没有唯一正确答案，是在产能、防砂、控水、成本之间做权衡。","judge":[{"label":"任务类型","value":"方案推荐","desc":"结构化决策，不是回归"},{"label":"数据门槛","value":"100—500 井次","desc":"需完井方式 + 生产表现标签"},{"label":"可见收益","value":"经验 → 可追溯","desc":"每条推荐给出相似案例依据"},{"label":"难度","value":"中","html":"<span class=\"dtag\" data-d=\"中\">难度 中</span>"}],"sections":[{"no":1,"en":"PROBLEM","title":"当前做法与问题","html":"<p>完井工程师拿到储层报告后，按<b>储层类型—出砂倾向—出水风险—井型</b>四类证据，从四种完井方式里选一种。经验丰富的工程师像查字典：储层疏松出砂 → 上砾石充填；层状薄互层 → 上筛管；坚硬低渗储层 → 射孔压裂投产。</p><p>问题是：这套「字典」装在老工程师脑子里。<b>新区块没有邻井可参考</b>时，选择依据只剩教科书规则，而教科书规则覆盖不了「低渗但水层很近」这类组合条件。选错方式的代价很高——出砂后改砾石充填要重修井段，费用是新井的三成以上。</p><div class=\"figure\"><svg viewBox=\"0 0 640 240\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"四种完井方式示意图\"><g font-size=\"11.5\" fill=\"#4d565b\"><text x=\"86\" y=\"22\" text-anchor=\"middle\" font-weight=\"700\" fill=\"#242b2e\">裸眼完井</text><text x=\"242\" y=\"22\" text-anchor=\"middle\" font-weight=\"700\" fill=\"#242b2e\">射孔完井</text><text x=\"398\" y=\"22\" text-anchor=\"middle\" font-weight=\"700\" fill=\"#242b2e\">筛管完井</text><text x=\"554\" y=\"22\" text-anchor=\"middle\" font-weight=\"700\" fill=\"#242b2e\">砾石充填</text></g><g><rect x=\"26\" y=\"36\" width=\"120\" height=\"150\" fill=\"#f5f2ea\" stroke=\"#c9c2b0\"/><rect x=\"66\" y=\"36\" width=\"14\" height=\"150\" fill=\"#b7b3a6\"/><rect x=\"46\" y=\"70\" width=\"80\" height=\"14\" fill=\"#d9e8e2\" stroke=\"#2f7d6b\" stroke-opacity=\".4\"/><rect x=\"46\" y=\"110\" width=\"80\" height=\"40\" fill=\"#e0b48c\" stroke=\"#b26a39\" stroke-opacity=\".5\"/><line x1=\"73\" y1=\"36\" x2=\"73\" y2=\"186\" stroke=\"#fff\" stroke-width=\"5\" stroke-dasharray=\"6 5\"/></g><g><rect x=\"182\" y=\"36\" width=\"120\" height=\"150\" fill=\"#f5f2ea\" stroke=\"#c9c2b0\"/><rect x=\"222\" y=\"36\" width=\"14\" height=\"150\" fill=\"#8fa5b5\"/><rect x=\"202\" y=\"70\" width=\"80\" height=\"14\" fill=\"#d9e8e2\" stroke=\"#2f7d6b\" stroke-opacity=\".4\"/><rect x=\"202\" y=\"110\" width=\"80\" height=\"40\" fill=\"#e0b48c\" stroke=\"#b26a39\" stroke-opacity=\".5\"/><g fill=\"#fff\"><circle cx=\"229\" cy=\"118\" r=\"2.4\"/><circle cx=\"229\" cy=\"132\" r=\"2.4\"/><circle cx=\"229\" cy=\"146\" r=\"2.4\"/></g></g><g><rect x=\"338\" y=\"36\" width=\"120\" height=\"150\" fill=\"#f5f2ea\" stroke=\"#c9c2b0\"/><rect x=\"378\" y=\"36\" width=\"14\" height=\"150\" fill=\"#8fa5b5\"/><rect x=\"358\" y=\"70\" width=\"80\" height=\"14\" fill=\"#d9e8e2\" stroke=\"#2f7d6b\" stroke-opacity=\".4\"/><rect x=\"358\" y=\"110\" width=\"80\" height=\"40\" fill=\"#e0b48c\" stroke=\"#b26a39\" stroke-opacity=\".5\"/><rect x=\"372\" y=\"110\" width=\"26\" height=\"76\" fill=\"#fff\" stroke=\"#41699b\" stroke-opacity=\".6\"/><path d=\"M374 112 l6 8 l-6 8 l6 8 l-6 8 l6 8 l-6 8 l6 8 l-6 8\" stroke=\"#41699b\" stroke-width=\"1.1\" fill=\"none\"/></g><g><rect x=\"494\" y=\"36\" width=\"120\" height=\"150\" fill=\"#f5f2ea\" stroke=\"#c9c2b0\"/><rect x=\"534\" y=\"36\" width=\"14\" height=\"150\" fill=\"#8fa5b5\"/><rect x=\"514\" y=\"70\" width=\"80\" height=\"14\" fill=\"#d9e8e2\" stroke=\"#2f7d6b\" stroke-opacity=\".4\"/><rect x=\"514\" y=\"110\" width=\"80\" height=\"40\" fill=\"#e0b48c\" stroke=\"#b26a39\" stroke-opacity=\".5\"/><rect x=\"528\" y=\"104\" width=\"36\" height=\"10\" fill=\"#e9d9a8\" stroke=\"#a97a1c\" stroke-opacity=\".6\"/><g fill=\"#a97a1c\" opacity=\".75\"><circle cx=\"534\" cy=\"120\" r=\"1.6\"/><circle cx=\"543\" cy=\"128\" r=\"1.6\"/><circle cx=\"552\" cy=\"119\" r=\"1.6\"/><circle cx=\"560\" cy=\"131\" r=\"1.6\"/><circle cx=\"549\" cy=\"140\" r=\"1.6\"/><circle cx=\"537\" cy=\"134\" r=\"1.6\"/><circle cx=\"556\" cy=\"122\" r=\"1.6\"/></g></g><g font-size=\"10\" fill=\"#79828a\"><text x=\"86\" y=\"206\" text-anchor=\"middle\">不下管柱，靠井壁自身支撑</text><text x=\"242\" y=\"206\" text-anchor=\"middle\">水泥固井 + 射孔打开</text><text x=\"398\" y=\"206\" text-anchor=\"middle\">防筛管砂，靠缝口桥架</text><text x=\"554\" y=\"206\" text-anchor=\"middle\">先充填砾石层再下筛管</text></g><g font-size=\"10.5\" font-weight=\"700\"><text x=\"86\" y=\"224\" text-anchor=\"middle\" fill=\"#3f8560\">最便宜 · 防砂最弱</text><text x=\"242\" y=\"224\" text-anchor=\"middle\" fill=\"#41699b\">最通用 · 工序最多</text><text x=\"398\" y=\"224\" text-anchor=\"middle\" fill=\"#a97a1c\">中成本 · 中防砂</text><text x=\"554\" y=\"224\" text-anchor=\"middle\" fill=\"#b26a39\">最贵 · 防砂最强</text></g></svg></div><div class=\"figcap\"><b>图 1</b><span>四种主流完井方式的结构对比：从左到右，防砂能力递增、成本递增、工序递增——<b>没有一种全面占优，选型本质是多目标权衡</b>。</span></div>"},{"no":2,"en":"INTERVENTION","title":"AI 能做什么","html":"<p>选型决策有两个可被算法替掉的环节：<b>一是把分散的规则组织起来</b>——用知识图谱把「储层特征—完井方式—生产表现」三元关系建成一张可查询的图，规则不再散落在文档与经验里；<b>二是把相似井的历史搬过来</b>——案例推理（CBR）在图谱里检索与当前井最相似的邻井，把它们「怎么选的、效果如何」直接展示给工程师。</p><p>算法输出的是<b>带依据的候选排序</b>（推荐方式 + 相似案例 + 各方式适配得分），最终拍板仍是人。这比黑箱分类网络更适合完井场景：方案要上会审查，审查要问「为什么」。</p><div class=\"figure\"><svg viewBox=\"0 0 640 210\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"知识图谱示意\"><g stroke=\"#c9c2b0\" stroke-width=\"1.2\"><line x1=\"320\" y1=\"105\" x2=\"150\" y2=\"46\"/><line x1=\"320\" y1=\"105\" x2=\"140\" y2=\"130\"/><line x1=\"320\" y1=\"105\" x2=\"170\" y2=\"180\"/><line x1=\"320\" y1=\"105\" x2=\"500\" y2=\"52\"/><line x1=\"320\" y1=\"105\" x2=\"510\" y2=\"132\"/><line x1=\"320\" y1=\"105\" x2=\"480\" y2=\"182\"/><line x1=\"150\" y1=\"46\" x2=\"140\" y2=\"130\" stroke-dasharray=\"3 4\"/></g><g font-size=\"11\" font-weight=\"700\" text-anchor=\"middle\"><rect x=\"262\" y=\"88\" width=\"116\" height=\"34\" rx=\"17\" fill=\"#f1f1dd\" stroke=\"#767a2e\"/><text x=\"320\" y=\"110\" fill=\"#5d6022\">当前评估井</text></g><g font-size=\"10.5\" text-anchor=\"middle\"><rect x=\"98\" y=\"32\" width=\"104\" height=\"28\" rx=\"14\" fill=\"#e7eef9\" stroke=\"#41699b\"/><text x=\"150\" y=\"50\" fill=\"#31527a\">疏松砂岩</text><rect x=\"86\" y=\"116\" width=\"108\" height=\"28\" rx=\"14\" fill=\"#e7eef9\" stroke=\"#41699b\"/><text x=\"140\" y=\"134\" fill=\"#31527a\">底水距顶 8 m</text><rect x=\"118\" y=\"166\" width=\"104\" height=\"28\" rx=\"14\" fill=\"#e7eef9\" stroke=\"#41699b\"/><text x=\"170\" y=\"184\" fill=\"#31527a\">出砂指数低</text><rect x=\"452\" y=\"38\" width=\"96\" height=\"28\" rx=\"14\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\"/><text x=\"500\" y=\"56\" fill=\"#235f51\">砾石充填</text><rect x=\"462\" y=\"118\" width=\"96\" height=\"28\" rx=\"14\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\"/><text x=\"510\" y=\"136\" fill=\"#235f51\">筛管完井</text><rect x=\"432\" y=\"168\" width=\"96\" height=\"28\" rx=\"14\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\"/><text x=\"480\" y=\"186\" fill=\"#235f51\">射孔完井</text></g><g font-size=\"9.5\" fill=\"#9ba3a9\"><text x=\"232\" y=\"66\">储层特征</text><text x=\"392\" y=\"66\">适应的完井方式</text><text x=\"206\" y=\"140\">风险证据</text></g><g font-size=\"10.5\" font-weight=\"700\"><text x=\"320\" y=\"152\" text-anchor=\"middle\" fill=\"#767a2e\">图谱沿边检索：证据 → 相似历史井 → 它们选了什么 → 投产后表现如何</text></g></svg></div><div class=\"figcap\"><b>图 2</b><span>知识图谱的查询路径：左边是当前井的证据节点，右边是完井方式节点，图检索把它们连起来，并沿「生产表现」边验证每种方式在相似条件下的历史成绩。</span></div>"},{"no":3,"en":"DATA","title":"你需要准备什么","html":"<p style=\"margin-bottom:14px\">知识图谱类任务最贵的一步是把完井设计书抽成结构化三元组，清单按这个目标列：</p><div class=\"checklist\"><div class=\"cl-head\"><span>数据准备清单 · 3 项</span><span class=\"cl-prog\"><span id=\"cl-txt\">0 / 3</span><span class=\"cl-bar\"><i id=\"cl-fill\"></i></span></span></div><div class=\"cl-item\" data-cl=\"0\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">储层与流体特征</span><span class=\"cl-s\">岩性、出砂指数、水层位置、井型</span></span><span class=\"cl-n\">单区块 100—500 井次</span></div><div class=\"cl-item\" data-cl=\"1\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">完井方式与生产表现</span><span class=\"cl-s\">方式、初期产能、出砂情况、措施记录</span></span><span class=\"cl-n\">作为标签与图谱验证边</span></div><div class=\"cl-item\" data-cl=\"2\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">完井设计书与总结</span><span class=\"cl-s\">非结构化文本</span></span><span class=\"cl-n\">用 NLP 抽取三元组</span></div></div>"},{"no":4,"en":"DIFFICULTY","title":"技术难度与参考方向","html":"<div style=\"display:flex;align-items:center;gap:14px;flex-wrap:wrap\"><span class=\"dtag\" data-d=\"中\">难度 中</span><span class=\"small muted\">难点在「最优没有统一定义」：产能、防砂、成本是多目标权衡，模型只能给候选排序，不能替人拍板。</span></div><div class=\"meter\"><i class=\"on\"></i><i class=\"on\"></i><i></i></div><p>验证路径：先在<b>有充分邻井的老区块</b>回放——把每口历史井的输入喂给系统，看它的推荐与当年实际选择、投产后表现是否一致；一致率过 75% 再用于新区块。</p><p style=\"margin-top:18px\"><span class=\"kicker plain\" style=\"color:var(--ink-4)\">可借鉴的通用技术</span></p><div class=\"refs\"><a class=\"ref\" href=\"#/method/kg\">知识图谱构建<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/kg\">案例推理 CBR<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/opt\">多目标排序<span class=\"ar\">↗</span></a></div>"}]},"workflow":{"label":"案例流程","title":"案例：为一口新井推荐完井方式","lead":["目标区块有 320 口历史井的完井记录与投产表现，现在要为一口新的疏松砂岩水平井给出完井方式建议。","目标不是「算出唯一答案」，而是输出<b>带依据的候选排序</b>：推荐方式 + 三条最相似历史井 + 每种方式的适配得分。"],"stats":[["历史井","320"],["证据维度","12"],["候选方式","4"],["回放一致率","≥75%"]],"steps":[{"name":"证据结构化","role":"数据","do":"把储层报告里的岩性、出砂指数、水层距离、渗透率、井型等 12 个字段抽成标准证据表；缺失字段显式标记「未知」，不填充均值。","effect":"每口井变成一条可比较的 12 维证据向量，未知的字段不参与相似度计算而不是乱算。","trap":"「水层距离未知」和「水层距离 5 m」完全不同——把未知填成均值会让底水风险被系统性低估。","fig":"<svg viewBox=\"0 0 560 96\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"证据结构化示意\"><g font-size=\"10.5\"><rect x=\"8\" y=\"18\" width=\"150\" height=\"60\" rx=\"8\" fill=\"#f8ecdf\" stroke=\"#b26a39\" stroke-opacity=\".4\"/><text x=\"83\" y=\"42\" text-anchor=\"middle\" fill=\"#8e5229\" font-weight=\"700\">完井设计书（文本）</text><text x=\"83\" y=\"60\" text-anchor=\"middle\" fill=\"#9ba3a9\">岩性/出砂/水层/井型…</text><path d=\"M162 48 h52\" stroke=\"#b26a39\" stroke-width=\"1.4\" marker-end=\"url(#arw1)\"/><rect x=\"222\" y=\"18\" width=\"150\" height=\"60\" rx=\"8\" fill=\"#e7eef9\" stroke=\"#41699b\" stroke-opacity=\".45\"/><text x=\"297\" y=\"42\" text-anchor=\"middle\" fill=\"#31527a\" font-weight=\"700\">12 维证据向量</text><text x=\"297\" y=\"60\" text-anchor=\"middle\" fill=\"#9ba3a9\">缺失字段标记 unknown</text><path d=\"M376 48 h52\" stroke=\"#41699b\" stroke-width=\"1.4\" marker-end=\"url(#arw1)\"/><rect x=\"436\" y=\"18\" width=\"116\" height=\"60\" rx=\"8\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\" stroke-opacity=\".45\"/><text x=\"494\" y=\"42\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">图谱证据节点</text><text x=\"494\" y=\"60\" text-anchor=\"middle\" fill=\"#9ba3a9\">可查询、可追溯</text></g><defs><marker id=\"arw1\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#9ba3a9\"/></marker></defs></svg>"},{"name":"图谱构建与规则沉淀","role":"算法","do":"把 320 口井写成三元组（井—具备—特征 / 井—采用—方式 / 方式—投产后—表现），再把工程师口述的选择规则整理成图谱上的约束边。","effect":"任何一条推荐都能沿边追溯：因为具备什么证据、哪条规则命中、哪些相似井支持。","trap":"规则之间会打架（防砂要求砾石充填、成本约束倾向筛管），打架的地方恰恰是要留给人的权衡点。","fig":"<svg viewBox=\"0 0 560 96\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"三元组建图示意\"><g font-size=\"10.5\"><g stroke=\"#c9c2b0\" stroke-width=\"1.1\"><line x1=\"140\" y1=\"48\" x2=\"280\" y2=\"48\"/><line x1=\"280\" y1=\"48\" x2=\"420\" y2=\"48\"/></g><circle cx=\"140\" cy=\"48\" r=\"22\" fill=\"#e7eef9\" stroke=\"#41699b\"/><text x=\"140\" y=\"52\" text-anchor=\"middle\" fill=\"#31527a\" font-weight=\"700\">井</text><circle cx=\"280\" cy=\"48\" r=\"22\" fill=\"#f1f1dd\" stroke=\"#767a2e\"/><text x=\"280\" y=\"52\" text-anchor=\"middle\" fill=\"#5d6022\" font-weight=\"700\">特征</text><circle cx=\"420\" cy=\"48\" r=\"22\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\"/><text x=\"420\" y=\"52\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">方式</text><text x=\"210\" y=\"40\" text-anchor=\"middle\" fill=\"#9ba3a9\">具备</text><text x=\"350\" y=\"40\" text-anchor=\"middle\" fill=\"#9ba3a9\">适应</text><text x=\"280\" y=\"88\" text-anchor=\"middle\" fill=\"#79828a\">320 口井 × 3 类三元组 ≈ 4600 条边，规则沉淀为带权重的约束边</text></g></svg>"},{"name":"相似案例检索","role":"算法","do":"用加权相似度（数值字段归一化欧氏 + 类别字段 Jaccard）在图谱里检索最相似的 k=3 口历史井，权重用历史井的投产表现反推。","effect":"每条候选方式都挂上真实依据：「与当前井最像的 3 口井里，2 口选了筛管、1 口改了砾石充填」。","trap":"相似度权重不能全交给算法调——投产表现里混着工程改进的年份效应，老井的高产可能只是当时措施多。","fig":"<svg viewBox=\"0 0 560 96\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"相似检索示意\"><g font-size=\"10.5\"><circle cx=\"76\" cy=\"48\" r=\"20\" fill=\"#f1f1dd\" stroke=\"#767a2e\" stroke-width=\"2\"/><text x=\"76\" y=\"52\" text-anchor=\"middle\" fill=\"#5d6022\" font-weight=\"700\">新井</text><g stroke=\"#c9c2b0\" stroke-dasharray=\"4 3\"><line x1=\"96\" y1=\"40\" x2=\"230\" y2=\"24\"/><line x1=\"96\" y1=\"52\" x2=\"230\" y2=\"52\"/><line x1=\"96\" y1=\"60\" x2=\"230\" y2=\"76\"/></g><g><rect x=\"238\" y=\"12\" width=\"96\" height=\"26\" rx=\"13\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\"/><text x=\"286\" y=\"29\" text-anchor=\"middle\" fill=\"#235f51\">相似井 #1</text><rect x=\"238\" y=\"40\" width=\"96\" height=\"26\" rx=\"13\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\"/><text x=\"286\" y=\"57\" text-anchor=\"middle\" fill=\"#235f51\">相似井 #2</text><rect x=\"238\" y=\"68\" width=\"96\" height=\"26\" rx=\"13\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\"/><text x=\"286\" y=\"85\" text-anchor=\"middle\" fill=\"#235f51\">相似井 #3</text></g><path d=\"M342 52 h50\" stroke=\"#2f7d6b\" stroke-width=\"1.4\" marker-end=\"url(#arw2)\"/><rect x=\"400\" y=\"32\" width=\"150\" height=\"40\" rx=\"8\" fill=\"#fff\" stroke=\"#c9c2b0\"/><text x=\"475\" y=\"49\" text-anchor=\"middle\" fill=\"#242b2e\" font-weight=\"700\">推荐排序 + 依据链</text><text x=\"475\" y=\"64\" text-anchor=\"middle\" fill=\"#9ba3a9\">每条推荐可沿边追溯</text></g><defs><marker id=\"arw2\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#2f7d6b\"/></marker></defs></svg>"},{"name":"多目标评分与排序","role":"算法","do":"对四种完井方式各算三个分项：产能潜力、防砂可靠度、综合成本，加权合成适配分并排序，权重默认取本区块历史统计值、允许工程师拖动调整。","effect":"输出不是单一答案，而是候选排序 + 敏感度：权重怎么动、第一名会不会换，工程师看得见。","trap":"权重一动结果就变——所以界面必须把权重变化对排序的影响显式画出来，否则「推荐」就成了伪客观。","fig":"<svg viewBox=\"0 0 560 96\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"多目标评分示意\"><g font-size=\"10.5\"><rect x=\"30\" y=\"14\" width=\"170\" height=\"14\" rx=\"7\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\" stroke-opacity=\".5\"/><rect x=\"30\" y=\"14\" width=\"142\" height=\"14\" rx=\"7\" fill=\"#2f7d6b\" opacity=\".8\"/><text x=\"208\" y=\"25\" fill=\"#235f51\" font-weight=\"700\">砾石充填 0.86</text><rect x=\"30\" y=\"36\" width=\"170\" height=\"14\" rx=\"7\" fill=\"#e7eef9\" stroke=\"#41699b\" stroke-opacity=\".5\"/><rect x=\"30\" y=\"36\" width=\"118\" height=\"14\" rx=\"7\" fill=\"#41699b\" opacity=\".8\"/><text x=\"208\" y=\"47\" fill=\"#31527a\" font-weight=\"700\">筛管 0.71</text><rect x=\"30\" y=\"58\" width=\"170\" height=\"14\" rx=\"7\" fill=\"#f8ecdf\" stroke=\"#b26a39\" stroke-opacity=\".5\"/><rect x=\"30\" y=\"58\" width=\"86\" height=\"14\" rx=\"7\" fill=\"#b26a39\" opacity=\".8\"/><text x=\"208\" y=\"69\" fill=\"#8e5229\" font-weight=\"700\">射孔 0.52</text><g transform=\"translate(280,10)\"><rect x=\"0\" y=\"0\" width=\"260\" height=\"70\" rx=\"8\" fill=\"#fff\" stroke=\"#c9c2b0\"/><text x=\"130\" y=\"18\" text-anchor=\"middle\" fill=\"#79828a\" font-size=\"10\">权重敏感性：防砂权重 0.4 → 0.6 时</text><path d=\"M20 50 h220\" stroke=\"#ddd7c8\"/><path d=\"M40 44 C 90 30, 150 34, 240 46\" stroke=\"#2f7d6b\" fill=\"none\" stroke-width=\"1.6\"/><text x=\"130\" y=\"64\" text-anchor=\"middle\" fill=\"#242b2e\" font-size=\"10\" font-weight=\"700\">第一名不变 → 推荐稳健</text></g></g></svg>"},{"name":"回放验证与人工确认","role":"人工","do":"在 320 口历史井上回放整套流程，统计「推荐第一名 = 当年实际选择」的一致率；再由完井工程师对当前井的推荐做终审。","effect":"一致率 78% 即达到验收线；不一致的 22% 逐口归类，多数是新规则缺失而非算法错误。","trap":"别把一致率当唯一指标——当年实际选择本身也有错（投产后出砂改措施），这类「不一致」其实是系统发现了历史失误。"}],"metrics":{"title":"怎么算「做对了」","html":"<p>推荐系统不能只看「猜中率」。一个把所有井都推成「射孔完井」的模型，在射孔占六成的区块也能拿到 60% 一致率，但毫无价值。所以按<b>方式分项统计</b>：</p><div style=\"margin:10px 0 6px\"><svg viewBox=\"0 0 640 130\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"分项一致率柱状图\"><g font-size=\"10\" fill=\"#9ba3a9\"><line x1=\"110\" y1=\"10\" x2=\"110\" y2=\"112\" stroke=\"#ddd7c8\"/><text x=\"106\" y=\"16\" text-anchor=\"end\">100%</text><text x=\"106\" y=\"64\" text-anchor=\"end\">50%</text><text x=\"106\" y=\"112\" text-anchor=\"end\">0%</text><line x1=\"110\" y1=\"61\" x2=\"630\" y2=\"61\" stroke=\"#efece1\"/><line x1=\"110\" y1=\"112\" x2=\"630\" y2=\"112\" stroke=\"#ddd7c8\"/></g><g font-size=\"10.5\"><rect x=\"130\" y=\"25.6\" width=\"34\" height=\"86.4\" rx=\"5\" fill=\"#b26a39\" opacity=\".85\"/><text x=\"147\" y=\"124\" text-anchor=\"middle\" fill=\"#242b2e\">射孔</text><text x=\"147\" y=\"20\" text-anchor=\"middle\" fill=\"#8e5229\" font-weight=\"700\">0.89</text><rect x=\"240\" y=\"43\" width=\"34\" height=\"69\" rx=\"5\" fill=\"#2f7d6b\" opacity=\".85\"/><text x=\"257\" y=\"124\" text-anchor=\"middle\" fill=\"#242b2e\">砾石充填</text><text x=\"257\" y=\"38\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">0.82</text><rect x=\"350\" y=\"49.5\" width=\"34\" height=\"62.5\" rx=\"5\" fill=\"#41699b\" opacity=\".85\"/><text x=\"367\" y=\"124\" text-anchor=\"middle\" fill=\"#242b2e\">筛管</text><text x=\"367\" y=\"44\" text-anchor=\"middle\" fill=\"#31527a\" font-weight=\"700\">0.69</text><rect x=\"460\" y=\"55.5\" width=\"34\" height=\"56.5\" rx=\"5\" fill=\"#767a2e\" opacity=\".85\"/><text x=\"477\" y=\"124\" text-anchor=\"middle\" fill=\"#242b2e\">裸眼</text><text x=\"477\" y=\"50\" text-anchor=\"middle\" fill=\"#5d6022\" font-weight=\"700\">0.61</text><g font-size=\"9.5\" fill=\"#9ba3a9\"><text x=\"147\" y=\"17\" text-anchor=\"middle\">样本 41%</text><text x=\"257\" y=\"17\" text-anchor=\"middle\">样本 21%</text><text x=\"367\" y=\"17\" text-anchor=\"middle\">样本 34%</text><text x=\"477\" y=\"17\" text-anchor=\"middle\">样本 4%</text></g><text x=\"565\" y=\"88\" text-anchor=\"middle\" fill=\"#b05a51\" font-size=\"10\" font-weight=\"700\">样本越少</text><text x=\"565\" y=\"102\" text-anchor=\"middle\" fill=\"#b05a51\" font-size=\"10\" font-weight=\"700\">一致率越不稳</text></g></svg></div><p style=\"margin-top:6px\">读法：<b>样本少的方式（裸眼 4%）一致率天然不稳</b>，评审时要看置信区间而不是单点数字；真正决定系统价值的是「不一致且历史错了」的比例——这部分是系统发现历史失误的能力，要单独列出来汇报。</p>"},"fails":[{"name":"证据字段缺失被均值填没","why":"水层距离、出砂指数缺失时填了区块均值，底水风险被系统性低估，推荐了不适用的裸眼方式。解法是显式 unknown + 相似度中跳过。"},{"name":"相似检索退化成同井位检索","why":"权重全压在井距上，检索回来的全是同一井组的井——它们彼此抄袭，等于没参考。解法是限制同井组最多取 1 口。"},{"name":"把历史失误学成规则","why":"某年赶工期集中选择了便宜方式，投产表现差，图谱把「差表现」错归因到方式本身。需要按年份分层抽样做归因校验。"}]},"demo":{"mode":"module","js":"demo/demo.js","label":"可运行示范","intro":"拖动滑杆改储层条件或目标权重：知识图谱沉淀的规则库（R-01…R-05）先过滤——出砂过高真的排除裸眼，底水/强度/井型规则随参数实时加减分；CBR 按目标权重检索相似井并投票反哺；左下「推荐推导」表逐步展示参数怎么算成结论，规则带编号、表底自动生成一句话推理链，下方还实时给出三种极端权重下第一名会不会换的敏感性分析。","height":760}}};

  var __mod = { exports: {} };
  (function (module, exports) {
/* 完井方式智能优选 · 交互示范（模块模式，挂进 Shadow DOM）
   推理链路全程可见：参数 → 规则过滤（真实排除/加减分） → CBR 检索 → 综合重排 → 推荐。
   ① 规则引擎真实生效：出砂>0.6 硬性排除裸眼；底水/强度/井型规则随参数实时加减分
   ② 目标权重决定检索权重 → 相似邻井排序跟着变（评分偏好 → 检索）
   ③ 检索回的 top3 邻井按相似度投票 → 反哺适配分（检索 → 评分）
   ④ 左栏「推荐推导」表逐步展示参数如何算成结论（加权分 → 规则 → 投票 → 最终）。 */
module.exports = {
  mount: function (root, api) {
    var JADE = 'var(--jade,#2f7d6b)', KG = 'var(--c-kg,#767a2e)', BAD = 'var(--bad,#b05a51)',
        WARN = 'var(--warn,#a97a1c)', INK3 = 'var(--ink-3,#79828a)', LINE = 'var(--line,#e9e4d8)';
    var METHODS = ['裸眼完井', '射孔完井', '筛管完井', '砾石充填'];
    var COLORS = ['#767a2e', '#41699b', '#41699b', '#2f7d6b'];

    root.innerHTML =
      '<div class="demo">' +
      '<div class="demo-head"><span class="kicker">INTERACTIVE · KNOWLEDGE-GRAPH + CBR</span>' +
      '<h3>为一口新井推荐完井方式</h3>' +
      '<p>拖动滑杆改储层条件或目标权重，系统按规则库（R-01…R-05）过滤、CBR 检索相似井、再综合重排——' +
      '<b>左下「推荐推导」表逐步展示每次拖动是怎么算成结论的</b>，表底附一句话推理链；正在拖动的参数值会加亮。</p></div>' +

      '<div id="c1-pipe" style="display:flex;align-items:stretch;gap:4px;margin:0 0 10px"></div>' +

      '<div class="ctl-row">' +
      '<span class="ctl" style="font-weight:700;color:' + INK3 + '">储层条件</span>' +
      '<div class="ctl"><label>出砂倾向 <output id="c1-o1" class="c1ov">0.75</output></label><input type="range" id="c1-s1" min="0" max="1" step="0.05" value="0.75"></div>' +
      '<div class="ctl"><label>岩石强度 <output id="c1-o2" class="c1ov">0.40</output></label><input type="range" id="c1-s2" min="0" max="1" step="0.05" value="0.4"></div>' +
      '<div class="ctl"><label>底水距离 <output id="c1-o3" class="c1ov">0.30</output></label><input type="range" id="c1-s3" min="0" max="1" step="0.05" value="0.3"></div>' +
      '<div class="ctl"><label>井型 </label><select id="c1-well"><option>直井</option><option selected>水平井</option></select></div>' +
      '</div>' +
      '<div class="ctl-row" style="padding-top:6px;padding-bottom:6px">' +
      '<span class="ctl" style="font-weight:700;color:' + INK3 + '">目标权重</span>' +
      '<button class="btn-x ghost" id="c1-p1">防砂优先</button>' +
      '<button class="btn-x ghost" id="c1-p2">产能优先</button>' +
      '<button class="btn-x ghost" id="c1-p3">成本优先</button>' +
      '<div class="ctl"><label>防砂 <output id="c1-ow1" class="c1ov">0.50</output></label><input type="range" id="c1-w1" min="0" max="1" step="0.05" value="0.5"></div>' +
      '<div class="ctl"><label>产能 <output id="c1-ow2" class="c1ov">0.30</output></label><input type="range" id="c1-w2" min="0" max="1" step="0.05" value="0.3"></div>' +
      '<div class="ctl"><label>成本 <output id="c1-ow3" class="c1ov">0.20</output></label><input type="range" id="c1-w3" min="0" max="1" step="0.05" value="0.2"></div>' +
      '</div>' +
      '<style>.c1ov{transition:background .25s,color .25s;border-radius:4px;padding:0 3px}.c1ov.c1-hl{color:#2f6a52;background:#e7f3ea;font-weight:700}</style>' +
      '<div class="grid2">' +
      '<div class="card-x"><h4>方式适配排序 · 推荐推导</h4><div id="c1-bars"></div>' +
      '<div id="c1-deriv" style="margin-top:10px"></div>' +
      '<div id="c1-stable" style="margin-top:8px;font-size:11px"></div></div>' +
      '<div class="card-x"><h4>最相似历史井（CBR 检索）</h4>' +
      '<div id="c1-cbrw" style="font-size:10.5px;color:' + INK3 + ';margin:-2px 0 6px"></div>' +
      '<div id="c1-cbr"></div></div>' +
      '</div>' +
      '<p class="note" id="c1-note"></p>' +
      '</div>';

    var $ = function (id) { return root.querySelector('#' + id); };
    function fmtD(v) { return (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(2); }

    function v3(v){return (v>=0?'+':'−')+Math.abs(v).toFixed(3);}

    /* ---- 基础评分模型（产能 p / 防砂 s / 成本 c；响应幅度拉大，拖动时排序更敏感）
       裸眼：强依赖岩石强度、最怕出砂；射孔：随出砂倾向产能明显下降
       筛管：防砂随强度大幅变化；砾石：防砂几乎不随条件变（最稳但最贵） ---- */
    function baseScores(sand, rock, water, hwell, w) {
      var m = [
        { p: 0.42 + 0.55 * rock, s: Math.max(0.05, 1 - sand * 0.95), c: 0.92 },
        { p: 0.60 + 0.32 * (1 - sand), s: 0.22 + 0.30 * rock, c: 0.42 },
        { p: 0.52 + 0.28 * (1 - sand), s: 0.36 + 0.45 * rock, c: 0.62 },
        { p: 0.48 + 0.18 * (1 - sand), s: Math.min(0.99, 0.82 + 0.13 * sand + 0.05 * rock), c: 0.22 }
      ];
      return m.map(function (r) {
        return { p: r.p, s: r.s, c: r.c,
          total: w[0] * r.s + w[1] * r.p + w[2] * r.c, vote: 0, rule: 0 };
      });
    }

    /* ---- 规则引擎（知识图谱沉淀的规则库 R-01…R-05，真实生效：排除 + 随参数连续加减分） ---- */
    function rulePass(sand, rock, water, hwell, w) {
      var ex = [], dl = [0, 0, 0, 0], det = [[], [], [], []], chips = 0, cond = [0, 0, 0, 0];
      if (sand > 0.6) {
        ex.push(0); cond[0] = 1; chips++;
        det[0].push('R-01 出砂 ' + sand.toFixed(2) + '&gt;0.6 排除');
      }
      if (water < 0.35) {
        cond[2] = 1; chips++;
        var k = w[0] * 0.6 + w[1] * 0.4;
        var d0 = -(1 - water) * 0.30 * k, d2 = -(1 - water) * 0.16 * k;
        dl[0] += d0; dl[2] += d2;
        det[0].push('R-02 底水近(15m) ' + fmtD(d0));
        det[2].push('R-02 底水近(15m) ' + fmtD(d2));
      }
      if (hwell) {
        cond[3] = 1; chips++;
        var b0 = 0.08 * w[1], b2 = 0.10 * w[1];
        dl[0] += b0; dl[2] += b2;
        det[0].push('R-03 水平井加成 ' + fmtD(b0));
        det[2].push('R-03 水平井加成 ' + fmtD(b2));
      }
      if (rock < 0.35) {
        cond[1] = 1; chips++;
        var dr = -(0.5 - rock) * 0.35 * (0.4 + 0.6 * w[0]);
        dl[0] += dr;
        det[0].push('R-04 强度低(' + rock.toFixed(2) + ') ' + fmtD(dr));
      }
      if (sand > 0.6 && rock < 0.5) {
        cond[0] = 1; chips++;
        dl[3] += 0.05;
        det[3].push('R-05 疏松+强度不足 ' + fmtD(0.05));
      }
      return { ex: ex, dl: dl, det: det, chips: chips, cond: cond };
    }

    /* ---- 历史井案例库（固定种子，可复现） ---- */
    var CASELIB = [
      { name: '邻井 W-03', sand: 0.78, rock: 0.42, water: 0.55, hw: 0, m: 3, out: '投产 30 个月无出砂' },
      { name: '邻井 W-11', sand: 0.62, rock: 0.38, water: 0.30, hw: 1, m: 2, out: '投产 18 个月轻微出砂，已控' },
      { name: '邻井 W-15', sand: 0.30, rock: 0.75, water: 0.70, hw: 0, m: 1, out: '投产 40 个月无出砂，产量达标' },
      { name: '邻井 W-19', sand: 0.25, rock: 0.82, water: 0.60, hw: 1, m: 1, out: '水平井分段投产，产能超设计 12%' },
      { name: '邻井 W-23', sand: 0.85, rock: 0.30, water: 0.20, hw: 1, m: 3, out: '投产 24 个月无出砂，成本回收偏慢' },
      { name: '邻井 W-27', sand: 0.55, rock: 0.40, water: 0.35, hw: 1, m: 3, out: '投产 24 个月无出砂' },
      { name: '邻井 W-31', sand: 0.40, rock: 0.55, water: 0.45, hw: 0, m: 2, out: '投产 26 个月轻微出砂' },
      { name: '邻井 W-33', sand: 0.63, rock: 0.46, water: 0.63, hw: 0, m: 2, out: '初期高产，14 个月换砾石充填' },
      { name: '邻井 W-36', sand: 0.20, rock: 0.68, water: 0.80, hw: 0, m: 0, out: '低渗坚硬储层，投产 36 个月正常' },
      { name: '邻井 W-40', sand: 0.48, rock: 0.50, water: 0.25, hw: 1, m: 2, out: '投产 12 个月底水锥进，已装隔水采管' }
    ];

    /* ---- CBR 相似检索：目标权重 → 各证据维度的检索权重 ---- */
    function cbr(sand, rock, water, hwell, w) {
      var aw = [
        0.35 + 0.65 * w[0],
        0.30 + 0.50 * w[1],
        0.25 + 0.35 * w[1] + 0.25 * w[0],
        0.20 + 0.60 * w[2]
      ];
      var norm = aw[0] + aw[1] + aw[2] + aw[3] * 0.6;
      var ranked = CASELIB.map(function (c) {
        var d = aw[0] * Math.abs(c.sand - sand) + aw[1] * Math.abs(c.rock - rock) +
                aw[2] * Math.abs(c.water - water) + aw[3] * (c.hw !== hwell ? 0.6 : 0);
        return { c: c, sim: Math.max(0.05, 1 - d / norm) };
      }).sort(function (a, b) { return b.sim - a.sim; });
      var top = ranked.slice(0, 3);
      var votes = {};
      top.forEach(function (r) { votes[r.c.m] = (votes[r.c.m] || 0) + r.sim; });
      return { top: top, votes: votes, aw: aw };
    }

    /* ---- 一句话推理链（解释器：把命中的规则 + CBR 证据 + 结论串成自然语言） ---- */
    function nlExplain(rp, sc, order, cb, sand, rock, water, hwell) {
      var top = order[0], parts = [];
      if (rp.ex.length) parts.push('出砂 ' + sand.toFixed(2) + '&gt;0.60 触发 R-01，硬性排除 ' +
        rp.ex.map(function (i) { return METHODS[i]; }).join('、'));
      if (water < 0.35) parts.push('底水近触发 R-02 控水降分');
      if (hwell) parts.push('R-03 给水平井适配的方式加分');
      if (rock < 0.35) parts.push('强度 ' + rock.toFixed(2) + '&lt;0.35 触发 R-04');
      if (sand > 0.6 && rock < 0.5) parts.push('R-05 给砾石充填补强');
      var voter = cb.top.filter(function (r) { return r.c.m === top; });
      var cbrTxt = 'CBR 检索 top3（' + cb.top.map(function (r) { return r.c.name.replace('邻井 ', ''); }).join('、') +
        '）中 ' + voter.length + ' 口当年选了 ' + METHODS[top];
      return '推理链：' + (parts.length ? parts.join('；') + '；' : '无规则命中；') + cbrTxt +
        (voter.length ? '，投票 ' + v3(sc[top].vote) : '——需人工复核') +
        '；综合 ' + sc[top].final.toFixed(2) + ' 分，推荐 <b>' + METHODS[top] + '</b>。';
    }

    /* ---- 推导表：参数怎么一步步算成结论（规则带编号，表下附自然语言推理链） ---- */
    function derivTable(rp, sc, order, w, cb, sand, rock, water, hwell) {
      var th = 'padding:3px 5px;font-size:10px;color:' + INK3 + ';font-weight:400;text-align:left;white-space:nowrap';
      var td = 'padding:4px 5px;font-size:10.5px;vertical-align:top;border-top:1px solid ' + LINE;
      var h = '<div style="font-size:10.5px;color:' + INK3 + ';margin-bottom:4px">推导过程（随拖动实时重算）：</div>' +
        '<table style="width:100%;border-collapse:collapse">' +
        '<thead><tr><th style="' + th + '">方式</th><th style="' + th + '">分项 防砂/产能/成本</th>' +
        '<th style="' + th + '">加权分</th><th style="' + th + '">规则调整</th>' +
        '<th style="' + th + '">邻井票</th><th style="' + th + '">最终</th></tr></thead><tbody>';
      METHODS.forEach(function (name, i) {
        var r = sc[i], isEx = rp.ex.indexOf(i) >= 0, isTop = order[0] === i;
        var ruleTxt = rp.det[i].length
          ? rp.det[i].map(function (d) { return '<div style="color:' + WARN + ';white-space:nowrap">' + d + '</div>'; }).join('')
          : '<span style="color:' + INK3 + '">—</span>';
        var voteTxt = r.vote > 0.004
          ? '<span style="color:' + JADE + '">' + v3(r.vote) + '</span>'
          : '<span style="color:' + INK3 + '">—</span>';
        h += '<tr style="' + (isTop ? 'background:var(--ok-bg,#e7f3ea)' : '') + (isEx ? ';opacity:.5' : '') + '">' +
          '<td style="' + td + 'font-weight:' + (isTop ? '700' : '400') + ';color:' + (isEx ? BAD : isTop ? JADE : '#4d565b') + ';white-space:nowrap">' +
          name + (isEx ? ' ⛔' : isTop ? ' ←推荐' : '') + '</td>' +
          '<td style="' + td + 'font-family:ui-monospace,monospace;white-space:nowrap">' +
          r.s.toFixed(2) + ' / ' + r.p.toFixed(2) + ' / ' + r.c.toFixed(2) + '</td>' +
          '<td style="' + td + 'font-family:ui-monospace,monospace">' + r.total.toFixed(2) + '</td>' +
          '<td style="' + td + '">' + (isEx ? '<span style="color:' + BAD + '">硬性排除</span>' : ruleTxt) + '</td>' +
          '<td style="' + td + '">' + voteTxt + '</td>' +
          '<td style="' + td + 'font-family:ui-monospace,monospace;font-weight:700;color:' + (isTop ? JADE : '#4d565b') + '">' +
          (isEx ? '—' : r.final.toFixed(2)) + '</td></tr>';
      });
      h += '</tbody></table>' +
        '<div style="font-size:10px;color:' + INK3 + ';margin-top:4px">加权分 = 防砂×' + w[0].toFixed(2) + ' + 产能×' + w[1].toFixed(2) +
        ' + 成本×' + w[2].toFixed(2) + '；规则 R-01…R-05 来自知识图谱沉淀的规则库，邻井票来自下方 CBR 检索。</div>' +
        '<div style="margin-top:5px;font-size:10.5px;color:#4d565b;background:var(--card-soft,#fdfcf9);border-left:3px solid ' + JADE +
        ';padding:4px 8px;border-radius:0 6px 6px 0">' + nlExplain(rp, sc, order, cb, sand, rock, water, hwell) + '</div>';
      return h;
    }

    /* ---- 推理流水线：固定常亮（不闪烁），只有数字随参数变 ---- */
    function pipeRender(info) {
      var steps = [
        ['① 参数输入', '7 项参数'],
        ['② 规则过滤', '命中 ' + info.nRules + ' 条' + (info.nEx ? ' · 排除 ' + info.nEx + ' 种' : '')],
        ['③ CBR 检索', 'top3 · 最高 ' + info.simTop.toFixed(2)],
        ['④ 综合重排', info.voteSum > 0.004 ? '邻井投票 +' + info.voteSum.toFixed(3) : '无投票反哺'],
        ['⑤ 推荐输出', info.best]
      ];
      var h = '';
      steps.forEach(function (st, i) {
        if (i) h += '<span style="align-self:center;color:' + INK3 + ';font-size:12px;padding:0 1px">→</span>';
        h += '<div style="flex:1;min-width:0;border:1px solid #bfd9cd;border-radius:9px;' +
          'padding:4px 8px;background:#e7f3ea;text-align:center">' +
          '<div style="font-size:11px;font-weight:700;color:#2f6a52;white-space:nowrap">' + st[0] + '</div>' +
          '<div style="font-size:10.5px;color:var(--ink-2,#4d565b);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + st[1] + '</div></div>';
      });
      $('c1-pipe').innerHTML = h;
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

      var rp = rulePass(sand, rock, water, hwell, w);
      var sc = baseScores(sand, rock, water, hwell, w);
      var cb = cbr(sand, rock, water, hwell, w);

      var VOTE = 0.055;
      sc.forEach(function (r, i) {
        r.rule = rp.dl[i];
        r.vote = cb.votes[i] ? VOTE * cb.votes[i] / 2.6 : 0;
        r.final = r.total + r.rule + r.vote;
      });
      var alive = [0, 1, 2, 3].filter(function (i) { return rp.ex.indexOf(i) < 0; });
      var order = alive.slice().sort(function (a, b) { return sc[b].final - sc[a].final; });

      $('c1-bars').innerHTML = sc.map(function (r, i) {
        var isEx = rp.ex.indexOf(i) >= 0;
        if (isEx) {
          return '<div class="bar-row" style="opacity:.45"><span class="bl">' + METHODS[i] + '</span>' +
            '<span class="bt"><span class="bf" style="width:6%;background:#b05a51;opacity:.5"></span></span>' +
            '<span class="bv" style="color:' + BAD + ';font-size:10.5px">规则排除</span></div>';
        }
        var pct = Math.max(4, r.final * 100);
        var vt = '';
        if (Math.abs(r.rule) > 0.004) vt += ' <span style="font-size:9.5px;color:' + WARN + '">规则 ' + fmtD(r.rule) + '</span>';
        if (r.vote > 0.004) vt += ' <span style="font-size:9.5px;color:' + JADE + '">邻井' + v3(r.vote) + '</span>';
        return '<div class="bar-row"><span class="bl">' + METHODS[i] + '</span>' +
          '<span class="bt"><span class="bf" style="width:' + pct.toFixed(1) + '%;background:' + COLORS[i] +
          (i === order[0] ? ';opacity:.92' : ';opacity:.55') + '"></span></span>' +
          '<span class="bv" style="color:' + (i === order[0] ? JADE : INK3) + '">' + r.final.toFixed(2) + '</span>' + vt + '</div>';
      }).join('');

      $('c1-deriv').innerHTML = derivTable(rp, sc, order, w, cb, sand, rock, water, hwell);

      /* 敏感性分析：三种极端权重下第一名会不会换（随储层条件实时重算） */
      var alive = [0, 1, 2, 3].filter(function (i) { return rp.ex.indexOf(i) < 0; });
      var flips = [];
      [['防砂拉满', [1, 0, 0]], ['产能拉满', [0, 1, 0]], ['成本拉满', [0, 0, 1]]].forEach(function (s) {
        var alt = baseScores(sand, rock, water, hwell, s[1]);
        alt.forEach(function (r, i) { r.final = r.total + rp.dl[i] + (cb.votes[i] ? VOTE * cb.votes[i] / 2.6 : 0); });
        var best = alive[0];
        alive.forEach(function (i) { if (alt[i].final > alt[best].final) best = i; });
        if (best !== order[0]) flips.push('<b>' + s[0] + '</b>→' + METHODS[best]);
      });
      $('c1-stable').innerHTML = flips.length
        ? '<span class="tag-n">排序敏感</span>&nbsp;' + flips.join(' &nbsp;·&nbsp; ') + ' 时第一名会换'
        : '<span class="tag-y">排序稳健</span>&nbsp;三种极端权重下第一名都是 <b>' + METHODS[order[0]] + '</b>';

      /* CBR 卡片 */
      var awSum = cb.aw[0] + cb.aw[1] + cb.aw[2] + cb.aw[3];
      var awPct = cb.aw.map(function (v) { return (v / awSum * 100).toFixed(0); });
      $('c1-cbrw').innerHTML = '检索侧重（随目标权重变）：出砂 ' + awPct[0] + '% · 强度 ' + awPct[1] +
        '% · 底水 ' + awPct[2] + '% · 井型 ' + awPct[3] + '%';
      $('c1-cbr').innerHTML = cb.top.map(function (r) {
        var n = r.c;
        return '<div style="border:1px solid ' + LINE + ';border-radius:9px;padding:7px 10px;margin-bottom:7px;background:var(--card-soft,#fdfcf9)">' +
          '<div style="display:flex;justify-content:space-between;align-items:center">' +
          '<b style="font-size:12.5px">' + n.name + '</b>' +
          '<span style="font-family:ui-monospace,monospace;font-size:11px;color:' + KG + '">相似度 ' + r.sim.toFixed(2) + '</span></div>' +
          '<div style="font-size:11px;color:var(--ink-2,#4d565b);margin-top:2px">选择：<b style="color:' + JADE + '">' + METHODS[n.m] + '</b> ｜ ' + n.out + '</div>' +
          '<div style="font-size:10px;color:' + INK3 + ';margin-top:1px">出砂 ' + n.sand.toFixed(2) + ' · 强度 ' + n.rock.toFixed(2) +
          ' · 底水 ' + n.water.toFixed(2) + ' · ' + (n.hw ? '水平井' : '直井') + '</div></div>';
      }).join('');

      /* 流水线重放 */
      var voteSum = 0;
      cb.top.forEach(function (r) { if (rp.ex.indexOf(r.c.m) < 0) voteSum += r.sim; });
      pipeRender({
        nRules: rp.chips, nEx: rp.ex.length,
        simTop: cb.top[0].sim, voteSum: voteSum, best: METHODS[order[0]]
      });

      var top = order[0];
      var voter = cb.top.filter(function (r) { return r.c.m === top; }).length;
      $('c1-note').innerHTML =
        '当前条件下系统推荐 <b>' + METHODS[top] + '</b>（加权 ' + sc[top].total.toFixed(2) +
        (Math.abs(sc[top].rule) > 0.004 ? '，规则 ' + fmtD(sc[top].rule) : '') +
        (sc[top].vote > 0.004 ? '，邻井投票 ' + v3(sc[top].vote) : '') + '）。' +
        (rp.ex.length ? '规则已硬性排除：' + rp.ex.map(function (i) { return METHODS[i]; }).join('、') + '。' : '') +
        (voter ? '最相似的 3 口井里有 ' + voter + ' 口当年也选了它。' : '注意：最相似的邻井当年都没选它——这就是需要人工复核的信号。');
    }

    /* 拖动时参数值加亮（常亮至松手，松手后 600ms 淡出），流水线保持常亮不闪 */
    var OUTMAP = { 'c1-s1': 'c1-o1', 'c1-s2': 'c1-o2', 'c1-s3': 'c1-o3',
      'c1-w1': 'c1-ow1', 'c1-w2': 'c1-ow2', 'c1-w3': 'c1-ow3', 'c1-well': 'c1-well' };
    var hlLast = null, hlTimer = null;
    function hl(id) {
      var out = OUTMAP[id];
      if (hlLast && hlLast !== out) $(hlLast).classList.remove('c1-hl');
      hlLast = out; $(out).classList.add('c1-hl');
      clearTimeout(hlTimer);
    }
    function unhl() {
      clearTimeout(hlTimer);
      hlTimer = setTimeout(function () {
        if (hlLast) { $(hlLast).classList.remove('c1-hl'); hlLast = null; }
      }, 600);
    }
    ['c1-s1', 'c1-s2', 'c1-s3', 'c1-w1', 'c1-w2', 'c1-w3', 'c1-well'].forEach(function (id) {
      $(id).addEventListener('input', function () { hl(id); draw(); });
      $(id).addEventListener('change', unhl);
    });
    function preset(a, b, c) {
      $('c1-w1').value = a; $('c1-w2').value = b; $('c1-w3').value = c; draw();
      ['c1-ow1', 'c1-ow2', 'c1-ow3'].forEach(function (oid) {
        $(oid).classList.add('c1-hl');
        setTimeout(function () { $(oid).classList.remove('c1-hl'); }, 800);
      });
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
