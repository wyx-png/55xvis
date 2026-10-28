/* =========================================================
   pr1-rod-pump-dynagraph · 案例插件（由 _build/build.mjs 自动生成，勿手改）
   源头是案例包 rod-pump-dynagraph-case/source.js + demo/，改内容请改源头后重新构建。
   ========================================================= */
(function () {
  var DEF = {"id":"pr1-rod-pump-dynagraph","sceneId":"pr1","title":"抽油机井工况诊断：示功图深度学习分类","status":"ready","version":"1.0.0","updated":"2026-10-23","tabs":{"background":{"label":"专业背景","lede":"全国有十几万口抽油机井，每口井每几分钟就上传一张「示功图」——光杆载荷随冲程变化的封闭曲线。泵的每一种毛病（供液不足、气锁、泵漏、断脱、结蜡）都会把曲线捏出不同的形状。这是石油行业里最像「手写数字识别」的计算机视觉问题。","judge":[{"label":"任务类型","value":"图像分类","desc":"一图一类别，样本充足"},{"label":"数据门槛","value":"每类 ≥ 2000 张","desc":"人工已标注的历史功图"},{"label":"可见收益","value":"1 人 300 口 → 1 人 5000 口","desc":"人工看图是最大瓶颈"},{"label":"难度","value":"中","html":"<span class=\"dtag\" data-d=\"中\">难度 中</span>"}],"sections":[{"no":1,"en":"PROBLEM","title":"当前做法与问题","html":"<p>工况员每天在屏幕上翻几百张示功图：正常的功图近似平行四边形，供液不足的下行程提前卸载、气锁的曲线圆滑鼓包、断脱的载荷直接掉底。有经验的老师傅看一眼形状就能说出毛病，<b>但一个师傅一天最多精看 300 张</b>——而一个采油厂每天新增的功图上万张。</p><div class=\"figure\"><svg viewBox=\"0 0 640 240\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"四种典型示功图\"><g font-size=\"11\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#242b2e\"><text x=\"90\" y=\"20\">正常</text><text x=\"250\" y=\"20\">供液不足</text><text x=\"410\" y=\"20\">气体影响</text><text x=\"570\" y=\"20\">泵漏失</text></g><g fill=\"none\" stroke-width=\"2\"><path d=\"M40 60 L90 44 L140 60 L138 168 L92 186 L44 168 Z\" stroke=\"#2f7d6b\"/><path d=\"M200 60 L250 44 L300 60 L298 120 C 290 150, 270 160, 252 162 C 234 160, 214 150, 202 168 Z\" stroke=\"#b26a39\"/><path d=\"M360 60 C 380 46, 440 46, 460 60 C 468 90, 466 140, 458 168 C 440 182, 380 182, 362 168 C 354 140, 352 90, 360 60 Z\" stroke=\"#767a2e\"/><path d=\"M520 60 L570 44 L620 60 L616 100 C 600 120, 580 130, 570 132 C 558 130, 542 122, 524 110 L522 168 Z\" stroke=\"#41699b\"/></g><g font-size=\"9.5\" fill=\"#79828a\"><text x=\"90\" y=\"204\" text-anchor=\"middle\">平行四边形 · 上下冲程载荷对称</text><text x=\"250\" y=\"204\" text-anchor=\"middle\">下行程中途卸载 · 泵未充满</text><text x=\"410\" y=\"204\" text-anchor=\"middle\">曲线圆鼓 · 气体缓冲了载荷突变</text><text x=\"570\" y=\"204\" text-anchor=\"middle\">上行程中后段载荷衰减 · 阀漏</text></g><g font-size=\"10\" font-weight=\"700\"><text x=\"90\" y=\"222\" text-anchor=\"middle\" fill=\"#3f8560\">坚持生产</text><text x=\"250\" y=\"222\" text-anchor=\"middle\" fill=\"#8e5229\">冲次应下调</text><text x=\"410\" y=\"222\" text-anchor=\"middle\" fill=\"#5d6022\">应加套管气分离</text><text x=\"570\" y=\"222\" text-anchor=\"middle\" fill=\"#31527a\">应检泵</text></g></svg></div><div class=\"figcap\"><b>图 1</b><span>四种典型示功图。<b>形状即诊断</b>：每一种工况都在曲线上留下特有的「捏痕」，这正是图像分类方法能替代人眼的原因。</span></div>"},{"no":2,"en":"INTERVENTION","title":"AI 能做什么","html":"<p>把示功图当图像喂给卷积网络（CNN），输出每种工况的概率——本质与手写数字识别同构，但有一个行业特有的坑：<b>示功图的类别标签来自历史上人工的判断，而人工判断本身有 5%—10% 是错的</b>。所以现场做法不是追求 99% 准确率，而是让模型把「不确定的图」挑出来给人看：置信度高的自动诊断，置信度低的进人工队列。</p><p>由此，工况员的效率提升一个数量级：模型替掉的是<b>确定的那 90%</b>，人只处理模型拿不准的 10%——和人机分工的边际收益完全一致。</p><div class=\"figure\"><svg viewBox=\"0 0 640 200\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"人机分工流水线\"><g font-size=\"11\" font-weight=\"700\" text-anchor=\"middle\"><rect x=\"20\" y=\"66\" width=\"140\" height=\"52\" rx=\"9\" fill=\"#e7eef9\" stroke=\"#41699b\"/><text x=\"90\" y=\"88\" fill=\"#31527a\">每日功图上传</text><text x=\"90\" y=\"105\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">1 万张 / 天</text><rect x=\"200\" y=\"66\" width=\"150\" height=\"52\" rx=\"9\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\"/><text x=\"275\" y=\"88\" fill=\"#235f51\">CNN 分类</text><text x=\"275\" y=\"105\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">置信度 &gt; 0.9 → 自动</text><rect x=\"390\" y=\"66\" width=\"110\" height=\"52\" rx=\"9\" fill=\"#f8ecdf\" stroke=\"#b26a39\"/><text x=\"445\" y=\"88\" fill=\"#8e5229\">低置信度队列</text><text x=\"445\" y=\"105\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">约 10%</text><rect x=\"540\" y=\"66\" width=\"80\" height=\"52\" rx=\"9\" fill=\"#f1f1dd\" stroke=\"#767a2e\"/><text x=\"580\" y=\"88\" fill=\"#5d6022\">工况员</text><text x=\"580\" y=\"105\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">1000 张/天</text></g><g stroke=\"#9ba3a9\" stroke-width=\"1.4\"><path d=\"M160 92 h34\" marker-end=\"url(#dg1)\"/><path d=\"M350 92 h34\" marker-end=\"url(#dg1)\"/><path d=\"M500 92 h34\" marker-end=\"url(#dg1)\"/></g><defs><marker id=\"dg1\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#9ba3a9\"/></marker></defs><text x=\"320\" y=\"165\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#79828a\">诊断结果回写生产数据库：躺井预警、间开制度优化都建立在这张分类表之上</text></svg></div><div class=\"figcap\"><b>图 2</b><span>不要让模型硬扛 100%：自动处理 90% + 人审 10%，准确率与效率同时最优。<b>「置信度门槛」就是这个场景里最重要的工程参数。</b></span></div>"},{"no":3,"en":"DATA","title":"你需要准备什么","html":"<p style=\"margin-bottom:14px\">优势是样本几乎免费——功图数据一直在自动采集，只差标签清洗：</p><div class=\"checklist\"><div class=\"cl-head\"><span>数据准备清单 · 3 项</span><span class=\"cl-prog\"><span id=\"cl-txt\">0 / 3</span><span class=\"cl-bar\"><i id=\"cl-fill\"></i></span></span></div><div class=\"cl-item\" data-cl=\"0\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">历史示功图 + 工况标签</span><span class=\"cl-s\">载荷-冲程数据对，每类 ≥ 2000 张</span></span><span class=\"cl-n\">需清洗错标（约 5%—10%）</span></div><div class=\"cl-item\" data-cl=\"1\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">检泵作业记录</span><span class=\"cl-s\">起管证实的问题类型</span></span><span class=\"cl-n\">金标准验证集</span></div><div class=\"cl-item\" data-cl=\"2\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">井基础信息</span><span class=\"cl-s\">泵径、冲程、冲次、杆组合</span></span><span class=\"cl-n\">归一化用，剔除量纲差异</span></div></div>"},{"no":4,"en":"DIFFICULTY","title":"技术难度与参考方向","html":"<div style=\"display:flex;align-items:center;gap:14px;flex-wrap:wrap\"><span class=\"dtag\" data-d=\"中\">难度 中</span><span class=\"small muted\">技术不难，难在标签质量与类别不均衡（正常样本占七成）。</span></div><div class=\"meter\"><i class=\"on\"></i><i class=\"on\"></i><i></i></div><p>先做减法：类别体系别贪多，从「正常 / 供液不足 / 气锁 / 泵漏 / 断脱」5 类起步，混淆矩阵里相邻类的误判可以后处理合并。杆断与杆脱在功图上几乎同形，<b>硬分成两类只会互相拉低置信度</b>。</p><p style=\"margin-top:18px\"><span class=\"kicker plain\" style=\"color:var(--ink-4)\">可借鉴的通用技术</span></p><div class=\"refs\"><a class=\"ref\" href=\"#/method/cv\">卷积图像分类<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/cv\">不均衡采样<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/cv\">置信度校准<span class=\"ar\">↗</span></a></div>"}]},"workflow":{"label":"案例流程","title":"案例：一个采油作业区 420 口井的功图诊断上线","lead":["作业区 420 口抽油机井，功图每 10 分钟一张，历史库里有 3 年约 190 万张功图，其中 31 万张带人工工况标签。","目标：自动诊断覆盖率 90% 以上，且检泵井的「漏判」不高于纯人工方式的水平。"],"stats":[["历史功图","190 万"],["带标签","31 万"],["类别","5+2"],["自动覆盖率","91%"]],"steps":[{"name":"标签清洗","role":"数据","do":"把 31 万张带标签功图按「标签一致性」过筛：同一口井同一天前后标签矛盾、形状与标签明显不符的直接剔除或降权。","effect":"有效标签 27 万张，错标率从约 8% 压到 2% 以下。","trap":"错标不是均匀噪声——「供液不足」和「正常」的混淆集中在夜间低液面井，不清洗的话模型学会的是「夜里的图都判供液不足」。","fig":"<svg viewBox=\"0 0 560 88\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"标签清洗漏斗\"><g font-size=\"10\"><g text-anchor=\"middle\"><rect x=\"26\" y=\"20\" width=\"120\" height=\"44\" rx=\"8\" fill=\"#e7eef9\" stroke=\"#41699b\" stroke-opacity=\".5\"/><text x=\"86\" y=\"39\" fill=\"#31527a\" font-weight=\"700\">31 万带标签</text><text x=\"86\" y=\"54\" fill=\"#9ba3a9\">错标 ≈8%</text><rect x=\"176\" y=\"20\" width=\"120\" height=\"44\" rx=\"8\" fill=\"#f9efd7\" stroke=\"#a97a1c\" stroke-opacity=\".5\"/><text x=\"236\" y=\"39\" fill=\"#8e5229\" font-weight=\"700\">一致性过筛</text><text x=\"236\" y=\"54\" fill=\"#9ba3a9\">矛盾/形状不符</text><rect x=\"326\" y=\"20\" width=\"120\" height=\"44\" rx=\"8\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\" stroke-opacity=\".5\"/><text x=\"386\" y=\"39\" fill=\"#235f51\" font-weight=\"700\">27 万干净标签</text><text x=\"386\" y=\"54\" fill=\"#9ba3a9\">错标 &lt;2%</text><rect x=\"476\" y=\"20\" width=\"60\" height=\"44\" rx=\"8\" fill=\"#f8ecdf\" stroke=\"#b26a39\" stroke-opacity=\".5\"/><text x=\"506\" y=\"39\" fill=\"#8e5229\" font-weight=\"700\">4 万</text><text x=\"506\" y=\"54\" fill=\"#9ba3a9\">弃用</text></g><g stroke=\"#9ba3a9\" stroke-width=\"1.2\"><path d=\"M146 42 h26\" marker-end=\"url(#pw1)\"/><path d=\"M296 42 h26\" marker-end=\"url(#pw1)\"/><path d=\"M446 42 h26\" marker-end=\"url(#pw1)\"/></g></g><defs><marker id=\"pw1\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#9ba3a9\"/></marker></defs></svg>"},{"name":"功图归一化","role":"工程","do":"把载荷-冲程对归一化到统一坐标（载荷除以杆柱重量、冲程归一到 0—1），再栅格化成 64×64 单通道图。","effect":"不同泵径/冲程/杆组合的井的功图进入同一坐标系，形状特征成为唯一变量。","trap":"栅格化别丢失上下行程的方向信息——正反行程的载荷差（面积差）正是漏失类工况的核心特征，可以多存一个「面积差通道」。","fig":"<svg viewBox=\"0 0 560 90\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"归一化流水线\"><g font-size=\"10\"><g text-anchor=\"middle\"><rect x=\"24\" y=\"20\" width=\"120\" height=\"46\" rx=\"8\" fill=\"#fff\" stroke=\"#c9c2b0\"/><path d=\"M52 36 L74 30 L96 36 L94 56 L74 60 L54 56 Z\" fill=\"none\" stroke=\"#2f7d6b\" stroke-width=\"1.4\"/><text x=\"84\" y=\"44\" font-size=\"8.5\" fill=\"#9ba3a9\">原始载荷-冲程</text><rect x=\"180\" y=\"20\" width=\"120\" height=\"46\" rx=\"8\" fill=\"#e7eef9\" stroke=\"#41699b\" stroke-opacity=\".5\"/><text x=\"240\" y=\"40\" fill=\"#31527a\" font-weight=\"700\">归一化坐标</text><text x=\"240\" y=\"55\" fill=\"#9ba3a9\">除杆重 · 冲程归一</text><rect x=\"336\" y=\"20\" width=\"90\" height=\"46\" rx=\"8\" fill=\"#f1f1dd\" stroke=\"#767a2e\" stroke-opacity=\".5\"/><g fill=\"#767a2e\" opacity=\".6\"><rect x=\"352\" y=\"30\" width=\"5\" height=\"5\"/><rect x=\"360\" y=\"28\" width=\"5\" height=\"5\"/><rect x=\"368\" y=\"30\" width=\"5\" height=\"5\"/><rect x=\"376\" y=\"34\" width=\"5\" height=\"5\"/><rect x=\"356\" y=\"40\" width=\"5\" height=\"5\"/><rect x=\"364\" y=\"42\" width=\"5\" height=\"5\"/><rect x=\"372\" y=\"44\" width=\"5\" height=\"5\"/><rect x=\"380\" y=\"46\" width=\"5\" height=\"5\"/><rect x=\"352\" y=\"50\" width=\"5\" height=\"5\"/><rect x=\"366\" y=\"52\" width=\"5\" height=\"5\"/><rect x=\"378\" y=\"54\" width=\"5\" height=\"5\"/></g><text x=\"381\" y=\"40\" font-size=\"8.5\" fill=\"#9ba3a9\" dx=\"18\">64×64</text><rect x=\"452\" y=\"20\" width=\"84\" height=\"46\" rx=\"8\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\" stroke-opacity=\".5\"/><text x=\"494\" y=\"40\" fill=\"#235f51\" font-weight=\"700\">双通道输入</text><text x=\"494\" y=\"55\" fill=\"#9ba3a9\">功图 + 面积差</text></g><g stroke=\"#9ba3a9\" stroke-width=\"1.2\"><path d=\"M144 43 h30\" marker-end=\"url(#pw2)\"/><path d=\"M300 43 h30\" marker-end=\"url(#pw2)\"/><path d=\"M426 43 h20\" marker-end=\"url(#pw2)\"/></g></g><defs><marker id=\"pw2\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#9ba3a9\"/></marker></defs></svg>"},{"name":"训练与不均衡处理","role":"算法","do":"小 ResNet 起步，类别按平方根倒数重采样；对「正常：异常 = 7:1」的比例做 focal loss。","effect":"异常类召回从 0.74 提到 0.88，正常类 precision 保持 0.97。","trap":"别用准确率当训练指标——「全判正常」就有 70% 准确率但一个躺井都抓不到。盯 macro-F1 和每类召回。","fig":"<svg viewBox=\"0 0 560 90\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"类别不均衡示意\"><g font-size=\"10\"><text x=\"30\" y=\"24\" fill=\"#79828a\">原始样本分布：</text><rect x=\"120\" y=\"14\" width=\"280\" height=\"14\" rx=\"7\" fill=\"#c9c2b0\"/><text x=\"408\" y=\"25\" fill=\"#79828a\">正常 70%</text><rect x=\"120\" y=\"32\" width=\"56\" height=\"14\" rx=\"7\" fill=\"#b26a39\" opacity=\".8\"/><text x=\"184\" y=\"43\" fill=\"#8e5229\">供液不足 9%</text><rect x=\"244\" y=\"32\" width=\"44\" height=\"14\" rx=\"7\" fill=\"#41699b\" opacity=\".8\"/><text x=\"296\" y=\"43\" fill=\"#31527a\">气锁 7%</text><rect x=\"300\" y=\"32\" width=\"40\" height=\"14\" rx=\"7\" fill=\"#767a2e\" opacity=\".8\"/><text x=\"348\" y=\"43\" fill=\"#5d6022\">泵漏 6%</text><rect x=\"352\" y=\"32\" width=\"28\" height=\"14\" rx=\"7\" fill=\"#b05a51\" opacity=\".8\"/><text x=\"386\" y=\"43\" fill=\"#b05a51\">断脱 3%</text><text x=\"30\" y=\"66\" fill=\"#79828a\">处理：平方根重采样 + focal loss，异常召回 0.74 → 0.88</text><rect x=\"120\" y=\"56\" width=\"180\" height=\"14\" rx=\"7\" fill=\"#2f7d6b\" opacity=\".75\"/><rect x=\"304\" y=\"56\" width=\"120\" height=\"14\" rx=\"7\" fill=\"#2f7d6b\" opacity=\".55\"/><rect x=\"428\" y=\"56\" width=\"96\" height=\"14\" rx=\"7\" fill=\"#2f7d6b\" opacity=\".4\"/></g></svg>"},{"name":"置信度门槛整定","role":"质控","do":"在检泵作业记录（金标准）上画「覆盖率—错误率」曲线，选自动处理的置信度门槛：0.90。","effect":"自动覆盖率 91%，自动诊断错误率 3.1%，人工队列缩到 9% 且其中真异常密度是普通功图的 6 倍。","trap":"门槛不是一劳永逸——井况结构变化（新井型、新泵型）会让模型置信度整体漂移，要按月监控置信度分布。","fig":"<svg viewBox=\"0 0 560 92\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"门槛-覆盖率曲线\"><g font-size=\"10\"><line x1=\"50\" y1=\"76\" x2=\"530\" y2=\"76\" stroke=\"#ddd7c8\"/><line x1=\"50\" y1=\"76\" x2=\"50\" y2=\"12\" stroke=\"#ddd7c8\"/><path d=\"M60 20 C 130 22, 200 34, 280 46 C 360 58, 450 68, 520 72\" fill=\"none\" stroke=\"#2f7d6b\" stroke-width=\"2\"/><text x=\"290\" y=\"36\" fill=\"#235f51\" font-weight=\"700\">覆盖率（随门槛降低而升高）</text><path d=\"M60 70 C 150 66, 250 56, 350 42 C 430 30, 480 22, 520 18\" fill=\"none\" stroke=\"#b26a39\" stroke-width=\"1.8\" stroke-dasharray=\"6 3\"/><text x=\"420\" y=\"52\" fill=\"#8e5229\">错误率（随门槛降低而升高）</text><circle cx=\"290\" cy=\"47\" r=\"4\" fill=\"#767a2e\"/><text x=\"298\" y=\"62\" fill=\"#5d6022\" font-weight=\"700\">工作点：门槛 0.90</text></g></svg>"},{"name":"闭环与漂移监控","role":"人工","do":"工况员对低置信度队列的诊断结果回写数据库，成为新的高价值训练样本；每月用检泵记录回测全量模型。","effect":"季度级漂移报警两次，均因新增电潜泵井型——补充样本重训后恢复。","trap":"人审队列的结果是有偏样本（全是难例），直接全量入库重训会把模型带偏，要按难度加权混采。"}],"metrics":{"title":"怎么算「做对了」","html":"<p>这个场景最反直觉的一点：<b>模型准确率 91% 不是好成绩，也不是坏成绩——重要的是错误的结构</b>：</p><div style=\"margin:10px 0 6px\"><svg viewBox=\"0 0 640 140\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"混淆矩阵可视化\"><g font-size=\"10.5\"><g><rect x=\"110\" y=\"24\" width=\"84\" height=\"24\" rx=\"4\" fill=\"#e6f1ec\"/><text x=\"152\" y=\"40\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">0.97</text><rect x=\"198\" y=\"24\" width=\"84\" height=\"24\" rx=\"4\" fill=\"#f9efd7\"/><text x=\"240\" y=\"40\" text-anchor=\"middle\" fill=\"#8e5229\">0.02</text><rect x=\"286\" y=\"24\" width=\"84\" height=\"24\" rx=\"4\" fill=\"#e7f3ea\" opacity=\".6\"/><rect x=\"374\" y=\"24\" width=\"84\" height=\"24\" rx=\"4\" fill=\"#f5f2ea\"/><rect x=\"462\" y=\"24\" width=\"84\" height=\"24\" rx=\"4\" fill=\"#f5f2ea\"/></g><g><rect x=\"110\" y=\"52\" width=\"84\" height=\"24\" rx=\"4\" fill=\"#f9efd7\"/><text x=\"152\" y=\"68\" text-anchor=\"middle\" fill=\"#8e5229\">0.05</text><rect x=\"198\" y=\"52\" width=\"84\" height=\"24\" rx=\"4\" fill=\"#e6f1ec\"/><text x=\"240\" y=\"68\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">0.88</text><rect x=\"286\" y=\"52\" width=\"84\" height=\"24\" rx=\"4\" fill=\"#f8ecdf\"/><text x=\"328\" y=\"68\" text-anchor=\"middle\" fill=\"#a97a1c\">0.05</text><rect x=\"374\" y=\"52\" width=\"84\" height=\"24\" rx=\"4\" fill=\"#f5f2ea\"/><rect x=\"462\" y=\"52\" width=\"84\" height=\"24\" rx=\"4\" fill=\"#f5f2ea\"/></g><g><rect x=\"110\" y=\"80\" width=\"84\" height=\"24\" rx=\"4\" fill=\"#f9efd7\" opacity=\".8\"/><text x=\"152\" y=\"96\" text-anchor=\"middle\" fill=\"#8e5229\">0.04</text><rect x=\"198\" y=\"80\" width=\"84\" height=\"24\" rx=\"4\" fill=\"#f8ecdf\" opacity=\".8\"/><text x=\"240\" y=\"96\" text-anchor=\"middle\" fill=\"#a97a1c\">0.06</text><rect x=\"286\" y=\"80\" width=\"84\" height=\"24\" rx=\"4\" fill=\"#e6f1ec\"/><text x=\"328\" y=\"96\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">0.86</text><rect x=\"374\" y=\"80\" width=\"84\" height=\"24\" rx=\"4\" fill=\"#f5f2ea\"/><rect x=\"462\" y=\"80\" width=\"84\" height=\"24\" rx=\"4\" fill=\"#f5f2ea\"/></g><g><rect x=\"110\" y=\"108\" width=\"84\" height=\"24\" rx=\"4\" fill=\"#f8ecdf\"/><text x=\"152\" y=\"124\" text-anchor=\"middle\" fill=\"#a97a1c\">0.03</text><rect x=\"198\" y=\"108\" width=\"84\" height=\"24\" rx=\"4\" fill=\"#f5f2ea\"/><rect x=\"286\" y=\"108\" width=\"84\" height=\"24\" rx=\"4\" fill=\"#f5f2ea\"/><rect x=\"374\" y=\"108\" width=\"84\" height=\"24\" rx=\"4\" fill=\"#f9e9e5\" opacity=\".8\"/><text x=\"416\" y=\"124\" text-anchor=\"middle\" fill=\"#b05a51\">0.02</text><rect x=\"462\" y=\"108\" width=\"84\" height=\"24\" rx=\"4\" fill=\"#e6f1ec\"/><text x=\"504\" y=\"124\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">0.90</text></g><g font-size=\"9.5\" fill=\"#79828a\"><text x=\"152\" y=\"18\" text-anchor=\"middle\">正常</text><text x=\"240\" y=\"18\" text-anchor=\"middle\">供液不足</text><text x=\"328\" y=\"18\" text-anchor=\"middle\">气锁</text><text x=\"416\" y=\"18\" text-anchor=\"middle\">泵漏</text><text x=\"504\" y=\"18\" text-anchor=\"middle\">断脱</text></g></g></svg></div><p style=\"margin-top:6px\">读法：看两个格——<b>「断脱 → 正常」0.02 和「泵漏 → 正常」0.02</b>。这两格是把「该检泵的井」判成正常，直接对应躺井损失，是最贵的错误；而「供液不足 ↔ 气锁」的互混只影响措施选择，便宜得多。<b>同样是 9% 的错误率，错误结构不同，价值天差地别。</b></p>"},"fails":[{"name":"夜间系统性错标","why":"夜间低液面井的功图被批量错标，模型学到「时段」而不是「形状」。解法是按时段分层清洗与验证。"},{"name":"杆断杆脱硬分两类","why":"两类功图同形，互相拉低置信度，自动覆盖率掉 15%。合并成一类后再用井史区分，指标全面回升。"},{"name":"人审难例直接入库","why":"低置信度队列全是难例，全量重训让模型在简单样本上反而变差。按难度加权混采是解。"}]},"demo":{"mode":"module","js":"demo/demo.js","label":"可运行示范","intro":"从 6 种典型工况里选一种（或随机抽），系统合成带噪声的示功图并逐类给出 CNN 的概率条——先自己看形状判断，再看模型答案，体会「置信度门槛」为什么重要。","height":620}}};

  var __mod = { exports: {} };
  (function (module, exports) {
/* 抽油机井示功图诊断 · 交互示范
   合成 6 种典型示功图（含噪声），展示 CNN 式概率输出与置信度门槛分流。 */
module.exports = {
  mount: function (root, api) {
    var JADE = 'var(--jade,#2f7d6b)', CLAY = 'var(--clay,#b26a39)',
        BAD = 'var(--bad,#b05a51)', INK3 = 'var(--ink-3,#79828a)',
        OPT = 'var(--c-opt,#41699b)';
    var CLASSES = ['正常', '供液不足', '气体影响', '泵漏失', '杆断脱', '结蜡'];
    var COLORS = ['#2f7d6b', '#b26a39', '#767a2e', '#41699b', '#b05a51', '#a97a1c'];

    root.innerHTML =
      '<div class="demo">' +
      '<div class="demo-head"><span class="kicker">INTERACTIVE · DYNAGRAM CLASSIFIER</span>' +
      '<h3>看图识工况：你先猜，模型再答</h3>' +
      '<p>选一种工况（或点「随机抽检」），系统合成带噪声的示功图。先自己看形状给出判断，' +
      '再看右侧的概率条——注意<b>有些图模型自己也拿不准</b>，这正是「低置信度队列」的来源。</p></div>' +
      '<div class="ctl-row">' +
      '<select id="c5-cls" style="font-size:12px;padding:4px 8px;border:1px solid var(--line-2,#ddd7c8);border-radius:6px">' +
      CLASSES.map(function (c) { return '<option>' + c + '</option>'; }).join('') +
      '</select>' +
      '<div class="ctl"><label>噪声水平 <output id="c5-on">0.15</output></label><input type="range" id="c5-n" min="0" max="0.5" step="0.05" value="0.15"></div>' +
      '<button class="btn-x" id="c5-rand">🎲 随机抽检</button>' +
      '<button class="btn-x ghost" id="c5-clsbtn">▶ 模型诊断</button>' +
      '</div>' +
      '<div class="grid2">' +
      '<div class="card-x"><h4>示功图（载荷-冲程，含噪声）</h4>' +
      '<svg id="c5-dg" class="chart" viewBox="0 0 420 320" role="img" aria-label="示功图"></svg></div>' +
      '<div class="card-x"><h4>模型输出（softmax 概率）</h4><div id="c5-probs"></div>' +
      '<div id="c5-verdict" style="margin-top:10px;font-size:11.5px"></div></div>' +
      '</div>' +
      '<p class="note" id="c5-note"></p>' +
      '</div>';

    var $ = function (id) { return root.querySelector('#' + id); };

    /* --- 示功图形状库：参数化合成（归一化坐标 0-1）--- */
    function shape(kind, seed) {
      var up = [], dn = [];
      var w = 0.62, top = 0.18, bot = 0.80;
      function jitter(v) { return v + (Math.sin(seed * 99 + v * 71) + Math.sin(seed * 31 + v * 173)) * 0.012; }
      if (kind === 0) { /* 正常：平行四边形 */
        for (var i = 0; i <= 20; i++) { var t = i / 20; up.push([t * w, top + t * (bot - top) * 0.14 - t * t * 0.04]); }
        for (i = 0; i <= 20; i++) { var t2 = i / 20; dn.push([w - t2 * w, bot - t2 * (bot - top) * 0.06 + t2 * t2 * 0.03]); }
      } else if (kind === 1) { /* 供液不足：下行程中段提前卸载 */
        for (i = 0; i <= 20; i++) { var t3 = i / 20; up.push([t3 * w, top + t3 * 0.10]); }
        for (i = 0; i <= 20; i++) { var t4 = i / 20; var unload = t4 > 0.25 && t4 < 0.8 ? Math.sin((t4 - 0.25) / 0.55 * Math.PI) * 0.34 : 0; dn.push([w - t4 * w, bot - 0.04 - unload + t4 * 0.02]); }
      } else if (kind === 2) { /* 气体影响：圆鼓 */
        for (i = 0; i <= 24; i++) { var t5 = i / 24; up.push([t5 * w * 0.9, top + 0.06 + Math.sin(t5 * Math.PI) * 0.10]); }
        for (i = 0; i <= 24; i++) { var t6 = i / 24; dn.push([w * 0.9 - t6 * w * 0.9, top + 0.42 + Math.sin(t6 * Math.PI) * 0.22]); }
      } else if (kind === 3) { /* 泵漏失：上行程后段载荷衰减 */
        for (i = 0; i <= 24; i++) { var t7 = i / 24; var drop = t7 > 0.45 ? Math.pow((t7 - 0.45) / 0.55, 1.4) * 0.4 : 0; up.push([t7 * w, top + 0.05 * t7 + drop]); }
        for (i = 0; i <= 24; i++) { var t8 = i / 24; dn.push([w - t8 * w, bot - 0.03 - t8 * 0.03]); }
      } else if (kind === 4) { /* 断脱：载荷掉底细条 */
        for (i = 0; i <= 16; i++) { var t9 = i / 16; up.push([t9 * w * 0.3, bot - 0.08 + Math.sin(t9 * 9) * 0.012]); }
        for (i = 0; i <= 16; i++) { var ta = i / 16; dn.push([w * 0.3 - ta * w * 0.3, bot - 0.10 + Math.sin(ta * 7) * 0.012]); }
      } else { /* 结蜡：上行程载荷整体抬高且抖动 */
        for (i = 0; i <= 20; i++) { var tb = i / 20; up.push([tb * w, top - 0.06 + jitter(top - 0.06 + tb * 0.08) * 1.6 - tb * 0.03]); }
        for (i = 0; i <= 20; i++) { var tc = i / 20; dn.push([w - tc * w, bot + 0.05 - tc * 0.05 + jitter(bot + 0.05 - tc * 0.05) * 1.2]); }
      }
      return up.concat(dn);
    }

    /* --- 简化「CNN」：对形状做特征匹配 + 噪声折减 → softmax --- */
    function classify(kind, noise, seed) {
      /* 每类的特征模板得分（演示用手工特征，非真实训练） */
      var scores = CLASSES.map(function (_, ci) {
        var base = ci === kind ? 3.2 - noise * 3 : 0.4;
        /* 类间相似性：供液不足~泵漏，气锁~供液不足 */
        if ((kind === 1 && ci === 3) || (kind === 3 && ci === 1)) base = Math.max(base, 1.5 - noise * 3);
        if ((kind === 1 && ci === 2) || (kind === 2 && ci === 1)) base = Math.max(base, 1.1 - noise * 3);
        if ((kind === 3 && ci === 2) || (kind === 2 && ci === 3)) base = Math.max(base, 0.9 - noise * 3);
        if (kind === 0 && ci === 5) base = Math.max(base, 0.8 - noise * 3);
        return base + Math.sin(seed * 13 + ci * 7) * 0.08;
      });
      var mx = Math.max.apply(null, scores);
      var exps = scores.map(function (s) { return Math.exp((s - mx) * 1.6); });
      var sum = exps.reduce(function (a, b) { return a + b; }, 0);
      return exps.map(function (e) { return e / sum; });
    }

    var W = 420, H = 320, L = 52, R = 16, T = 16, B = 36;
    function draw() {
      var kind = +$('c5-cls').value;
      var noise = +$('c5-n').value;
      var seed = 3 + kind * 17;
      $('c5-on').textContent = noise.toFixed(2);

      var pts = shape(kind, seed).map(function (p) {
        return [p[0] + Math.sin(seed * 7 + p[1] * 91) * noise * 0.35,
                p[1] + Math.sin(seed * 11 + p[0] * 57) * noise * 0.5];
      });
      function xOf(v) { return L + v * (W - L - R); }
      function yOf(v) { return T + (1 - v) * (H - T - B); }
      var s = '';
      [0, .5, 1].forEach(function (v) {
        s += '<line x1="' + L + '" y1="' + yOf(v) + '" x2="' + (W - R) + '" y2="' + yOf(v) + '" stroke="#efece1"/>' +
          '<text x="' + (L - 5) + '" y="' + (yOf(v) + 3) + '" font-size="9" fill="#9ba3a9" text-anchor="end" font-family="monospace">' + Math.round(v * 120) + 'kN</text>';
      });
      s += '<line x1="' + L + '" y1="' + (H - B) + '" x2="' + (W - R) + '" y2="' + (H - B) + '" stroke="#c9c2b0"/>' +
        '<line x1="' + L + '" y1="' + T + '" x2="' + L + '" y2="' + (H - B) + '" stroke="#c9c2b0"/>' +
        '<text x="' + (W - R) + '" y="' + (H - 8) + '" font-size="9.5" fill="#79828a" text-anchor="end">冲程（下死点 → 上死点 → 下死点）</text>' +
        '<text x="12" y="' + (H / 2) + '" font-size="9.5" fill="#79828a" transform="rotate(-90 12 ' + (H / 2) + ')" text-anchor="middle">光杆载荷</text>';
      var d = '';
      pts.forEach(function (p, i) { d += (i ? 'L' : 'M') + xOf(p[0]).toFixed(1) + ' ' + yOf(p[1]).toFixed(1); });
      s += '<path d="' + d + 'Z" fill="' + COLORS[kind] + '" fill-opacity=".05" stroke="' + COLORS[kind] + '" stroke-width="2" stroke-linejoin="round"/>';
      /* 上下行程箭头 */
      var mid = pts[Math.floor(pts.length * 0.25)];
      s += '<text x="' + (xOf(mid[0]) + 6) + '" y="' + (yOf(mid[1]) - 6) + '" font-size="9.5" fill="' + COLORS[kind] + '">上冲程</text>';
      var mid2 = pts[Math.floor(pts.length * 0.75)];
      s += '<text x="' + (xOf(mid2[0]) - 6) + '" y="' + (yOf(mid2[1]) + 16) + '" font-size="9.5" fill="' + COLORS[kind] + '" text-anchor="end">下冲程</text>';
      $('c5-dg').innerHTML = s;
      $('c5-dg').dataset.kind = kind;
      $('c5-dg').dataset.noise = noise;
      $('c5-probs').innerHTML = '<div style="padding:20px 0;text-align:center;color:' + INK3 + ';font-size:12px">点击「▶ 模型诊断」查看分类结果</div>';
      $('c5-verdict').innerHTML = '<span style="color:' + INK3 + '">你的判断：这张图像<b>' + CLASSES[kind] + '</b>吗？噪声大时连人都会犹豫——这正是要设计置信度门槛的原因。</span>';
    }

    function runModel() {
      var kind = +$('c5-dg').dataset.kind, noise = +$('c5-dg').dataset.noise;
      var seed = 3 + kind * 17;
      var probs = classify(kind, noise, seed);
      var order = probs.map(function (p, i) { return i; }).sort(function (a, b) { return probs[b] - probs[a]; });
      $('c5-probs').innerHTML = CLASSES.map(function (c, i) {
        var pct = probs[i] * 100;
        return '<div class="bar-row"><span class="bl" style="width:78px;font-size:11.5px">' + c + '</span>' +
          '<span class="bt"><span class="bf" style="width:' + pct.toFixed(1) + '%;background:' + COLORS[i] + ';opacity:' + (order[0] === i ? '.9' : '.5') + '"></span></span>' +
          '<span class="bv" style="color:' + (order[0] === i ? JADE : INK3) + '">' + pct.toFixed(1) + '%</span></div>';
      }).join('');
      var top = order[0], conf = probs[top];
      var vd = $('c5-verdict');
      if (conf > 0.9) {
        vd.innerHTML = '<span class="tag-y">自动诊断</span>&nbsp;置信度 ' + (conf * 100).toFixed(1) + '% &gt; 门槛 90% —— 直接写入诊断表，人不用看';
      } else if (conf > 0.55) {
        vd.innerHTML = '<span class="tag-n">进人工队列</span>&nbsp;最高置信度只有 ' + (conf * 100).toFixed(1) + '% —— 模型在「' + CLASSES[order[0]] + '」和「' + CLASSES[order[1]] + '」之间犹豫，这种图人工看更有价值';
      } else {
        vd.innerHTML = '<span class="tag-n">进人工队列</span>&nbsp;概率高度分散——噪声把形状特征抹平了。实际生产中这类图会连人带模型一起看';
      }
      $('c5-note').innerHTML =
        '把这个演示当成「置信度门槛」的实验台：<b>把噪声拖大</b>，观察概率条怎么从一家独大变成群雄逐鹿——' +
        '门槛 0.9 的意思是「概率条里第一名要占九成以上才自动放行」。' +
        '再对比「供液不足」和「泵漏失」：这两类形状相近（都是下/上行程提前衰减），是混淆矩阵里最忙的一对，' +
        '实际项目要么接受它们的互混、要么给模型加一个「面积差通道」把上下行程分开看。';
    }

    $('c5-cls').addEventListener('change', draw);
    $('c5-n').addEventListener('input', draw);
    $('c5-clsbtn').addEventListener('click', runModel);
    $('c5-rand').addEventListener('click', function () {
      var k = Math.floor(Math.random() * 6);
      $('c5-cls').value = k;
      $('c5-n').value = (0.1 + Math.random() * 0.35).toFixed(2);
      draw();
      runModel();
    });

    draw();
    runModel();
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
