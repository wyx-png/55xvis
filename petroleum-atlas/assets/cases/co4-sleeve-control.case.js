/* =========================================================
   co4-sleeve-control · 案例插件（由 _build/build.mjs 自动生成，勿手改）
   源头是案例包 sleeve-control-case/source.js + demo/，改内容请改源头后重新构建。
   ========================================================= */
(function () {
  var DEF = {"id":"co4-sleeve-control","sceneId":"co4","title":"智能完井滑套控制：强化学习找最优开度策略","status":"ready","version":"1.0.0","updated":"2026-10-23","tabs":{"background":{"label":"专业背景","lede":"智能完井在井里装了「可以远程拧的阀门」——分段滑套。水平井分四段开采，每段的渗透率、压力、水淹进度都不一样，滑套开度决定每段出多少液。理论上它能把高含水段「拧小」、让低含水段多出力，但组合空间随时间爆炸式增长，人工根本调不过来。","judge":[{"label":"任务类型","value":"序列决策","desc":"强化学习的主场"},{"label":"数据门槛","value":"需储层模拟器","desc":"训练在仿真环境里完成"},{"label":"可见收益","value":"含水 −8%—15%","desc":"同产液量下多产油"},{"label":"难度","value":"高","html":"<span class=\"dtag\" data-d=\"高\">难度 高</span>"}],"sections":[{"no":1,"en":"PROBLEM","title":"当前做法与问题","html":"<p>现场对滑套的处理方式大多是<b>配产后不再动</b>：投产时按各段预计产能设定开度，之后一直全开或维持初值。但储层是动态的——高渗段先见水，见水后如果开度不变，井筒里大量的「水」会把低渗段的油「顶」回来（层间干扰），全井含水率被动飙升。</p><div class=\"figure\"><svg viewBox=\"0 0 640 240\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"层间干扰示意\"><rect x=\"30\" y=\"24\" width=\"250\" height=\"192\" fill=\"#f5f2ea\" stroke=\"#c9c2b0\"/><g font-size=\"10.5\"><rect x=\"50\" y=\"44\" width=\"210\" height=\"42\" fill=\"#e7eef9\" stroke=\"#41699b\" stroke-opacity=\".5\"/><text x=\"62\" y=\"66\" fill=\"#31527a\" font-weight=\"700\">段 1 · 高渗 K=400mD</text><text x=\"62\" y=\"80\" fill=\"#b05a51\">已见水 · 含水 92%</text><rect x=\"50\" y=\"96\" width=\"210\" height=\"42\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\" stroke-opacity=\".5\"/><text x=\"62\" y=\"118\" fill=\"#235f51\" font-weight=\"700\">段 2 · 中渗 K=120mD</text><text x=\"62\" y=\"132\" fill=\"#79828a\">含水 8% · 主力产油段</text><rect x=\"50\" y=\"148\" width=\"210\" height=\"42\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\" stroke-opacity=\".5\"/><text x=\"62\" y=\"170\" fill=\"#235f51\" font-weight=\"700\">段 3 · 低渗 K=40mD</text><text x=\"62\" y=\"184\" fill=\"#79828a\">含水 3% · 潜力段</text></g><g transform=\"translate(400,30)\"><rect width=\"210\" height=\"90\" rx=\"10\" fill=\"#fff\" stroke=\"#ddd7c8\"/><text x=\"105\" y=\"24\" text-anchor=\"middle\" font-size=\"11\" font-weight=\"700\" fill=\"#242b2e\">全开策略：水在「抢油的位置」</text><g font-size=\"10.5\" fill=\"#4d565b\"><text x=\"14\" y=\"46\">段 1 产液 120 m³/d（92% 是水）</text><text x=\"14\" y=\"64\">井筒压力被水相占据，段 2/3 的</text><text x=\"14\" y=\"82\">油被「顶」在储层里出不来</text></g><rect y=\"110\" width=\"210\" height=\"100\" rx=\"10\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\" stroke-opacity=\".4\"/><text x=\"105\" y=\"134\" text-anchor=\"middle\" font-size=\"11\" font-weight=\"700\" fill=\"#235f51\">滑套调小段 1 之后</text><g font-size=\"10.5\" fill=\"#4d565b\"><text x=\"14\" y=\"156\">段 1 产液 40 m³/d（水大幅减少）</text><text x=\"14\" y=\"174\">井底压力重新分配，段 2/3 压差</text><text x=\"14\" y=\"192\">恢复，油相渗流重新启动</text></g></g></svg></div><div class=\"figcap\"><b>图 1</b><span>层间干扰：高含水段全开不仅自己出水，还通过<b>井筒压力</b>压制其他段的产油能力。滑套的价值是「给水流设闸」，但开度组合的最优解随时间漂移。</span></div>"},{"no":2,"en":"INTERVENTION","title":"AI 能做什么","html":"<p>滑套控制是标准的<b>序列决策问题</b>：状态 = 各段含水率/压力/累积产量，动作 = 各段开度组合，目标 = 长期累计产油最大。这正是强化学习的定义式场景——让 agent 在储层模拟器里「打几万遍井」，学出「什么时候该把哪段拧到多大」的策略。</p><p>学出来的策略有三个特点是人调不出来的：<b>提前动</b>（含水率爬升到阈值之前就预调，而不是见水后才反应）；<b>组合动</b>(同时调多段，利用段间压力耦合)；<b>耐得住短期减产</b>（为了三个月后的累计产量，宁可本月少产）。</p><div class=\"figure\"><svg viewBox=\"0 0 640 190\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"强化学习闭环示意\"><g font-size=\"11\" font-weight=\"700\" text-anchor=\"middle\"><rect x=\"30\" y=\"60\" width=\"130\" height=\"56\" rx=\"10\" fill=\"#f1f1dd\" stroke=\"#767a2e\"/><text x=\"95\" y=\"84\" fill=\"#5d6022\">Agent 策略</text><text x=\"95\" y=\"101\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">观察 → 开度动作</text><rect x=\"250\" y=\"60\" width=\"130\" height=\"56\" rx=\"10\" fill=\"#e7eef9\" stroke=\"#41699b\"/><text x=\"315\" y=\"84\" fill=\"#31527a\">储层模拟器</text><text x=\"315\" y=\"101\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">机环境：响应 + 奖励</text><rect x=\"470\" y=\"60\" width=\"130\" height=\"56\" rx=\"10\" fill=\"#f8ecdf\" stroke=\"#b26a39\"/><text x=\"535\" y=\"84\" fill=\"#8e5229\">奖励 r</text><text x=\"535\" y=\"101\" font-size=\"9.5\" font-weight=\"400\" fill=\"#79828a\">日产油 − 水处理成本</text></g><g stroke=\"#9ba3a9\" stroke-width=\"1.5\" fill=\"none\"><path d=\"M160 78 h84\" marker-end=\"url(#rl1)\"/><path d=\"M380 78 h84\" marker-end=\"url(#rl1)\"/><path d=\"M535 122 v26 h-440 v-18\" marker-end=\"url(#rl1)\"/></g><text x=\"315\" y=\"164\" text-anchor=\"middle\" font-size=\"10\" fill=\"#79828a\">训练在模拟器里闭环进行几万次；上线后每周只需做一次「观察 → 微调」</text><defs><marker id=\"rl1\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#9ba3a9\"/></marker></defs></svg></div><div class=\"figcap\"><b>图 2</b><span>训练闭环。注意奖励函数里要<b>扣掉水处理成本</b>——只奖励产油的 agent 会学会「多产液多产油」，把水一起搬出来。</span></div>"},{"no":3,"en":"DATA","title":"你需要准备什么","html":"<p style=\"margin-bottom:14px\">强化学习不 吃标注数据，但<b>极度依赖环境质量</b>：</p><div class=\"checklist\"><div class=\"cl-head\"><span>数据准备清单 · 3 项</span><span class=\"cl-prog\"><span id=\"cl-txt\">0 / 3</span><span class=\"cl-bar\"><i id=\"cl-fill\"></i></span></span></div><div class=\"cl-item\" data-cl=\"0\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">储层与完井静态数据</span><span class=\"cl-s\">分段渗透率、含水饱和度、滑套段位置</span></span><span class=\"cl-n\">构建模拟环境</span></div><div class=\"cl-item\" data-cl=\"1\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">生产与滑套状态历史</span><span class=\"cl-s\">分段产量、开度、压力（高频）</span></span><span class=\"cl-n\">校准模拟器参数</span></div><div class=\"cl-item\" data-cl=\"2\"><span class=\"cl-box\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12.5l5 5L20 6.5\"/></svg></span><span><span class=\"cl-t\">储层模拟器</span><span class=\"cl-s\">简化组分模型即可</span></span><span class=\"cl-n\">训练环境，机理模型</span></div></div>"},{"no":4,"en":"DIFFICULTY","title":"技术难度与参考方向","html":"<div style=\"display:flex;align-items:center;gap:14px;flex-wrap:wrap\"><span class=\"dtag\" data-d=\"高\">难度 高</span><span class=\"small muted\">难在环境：模拟器与真实储层的偏差会被策略放大；上线后的验证周期按月计。</span></div><div class=\"meter\"><i class=\"on\"></i><i class=\"on\"></i><i class=\"on hi\"></i></div><p>降低风险的路径：先做<b> advisor 模式</b>——策略只给建议、人工确认后执行，累计对比「有建议」与「无建议」的月度产油差，用真实差值建立信任后再谈自动执行。</p><p style=\"margin-top:18px\"><span class=\"kicker plain\" style=\"color:var(--ink-4)\">可借鉴的通用技术</span></p><div class=\"refs\"><a class=\"ref\" href=\"#/method/opt\">强化学习<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/opt\">模拟器校准<span class=\"ar\">↗</span></a><a class=\"ref\" href=\"#/method/opt\">安全约束 RL<span class=\"ar\">↗</span></a></div>"}]},"workflow":{"label":"案例流程","title":"案例：三段智能完井井的一年期控制","lead":["目标井：三段滑套的水平井，段 1 高渗已临近见水。任务：学一个开度控制策略，一年累计产油最大、含水峰值不破 60%。","对比基线是「投产后全开不动」——这是现场最常见的做法。"],"stats":[["控制段数","3"],["开度档位","4"],["决策周期","周"],["累计增油","+9.6%"]],"steps":[{"name":"构建简化模拟环境","role":"数据","do":"用三段简化储层模型（每段 K、P、水侵速度不同）搭一个快速环境：开度组合 → 一步（一周）后的分段产液与含水。","effect":"单步计算微秒级，一年 52 步一局，agent 一小时能打上万局。","trap":"环境太简单 agent 会「过拟合环境」——至少要把段间干扰项与水侵的不确定性加进去，参数在 ±15% 内随机化。","fig":"<svg viewBox=\"0 0 560 90\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"环境构建示意\"><g font-size=\"10\"><g transform=\"translate(30,12)\"><rect width=\"150\" height=\"60\" rx=\"8\" fill=\"#e7eef9\" stroke=\"#41699b\" stroke-opacity=\".5\"/><text x=\"75\" y=\"26\" text-anchor=\"middle\" fill=\"#31527a\" font-weight=\"700\">三段储层</text><text x=\"75\" y=\"44\" text-anchor=\"middle\" fill=\"#79828a\">K: 400/120/40 mD</text><text x=\"75\" y=\"58\" text-anchor=\"middle\" fill=\"#9ba3a9\">水侵速度各异</text></g><g transform=\"translate(205,12)\"><rect width=\"150\" height=\"60\" rx=\"8\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\" stroke-opacity=\".5\"/><text x=\"75\" y=\"26\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">开度 → 产液模型</text><text x=\"75\" y=\"44\" text-anchor=\"middle\" fill=\"#79828a\">含层间干扰项</text><text x=\"75\" y=\"58\" text-anchor=\"middle\" fill=\"#9ba3a9\">参数 ±15% 随机化</text></g><g transform=\"translate(380,12)\"><rect width=\"150\" height=\"60\" rx=\"8\" fill=\"#f8ecdf\" stroke=\"#b26a39\" stroke-opacity=\".5\"/><text x=\"75\" y=\"26\" text-anchor=\"middle\" fill=\"#8e5229\" font-weight=\"700\">环境接口</text><text x=\"75\" y=\"44\" text-anchor=\"middle\" fill=\"#79828a\">state / action / reward</text><text x=\"75\" y=\"58\" text-anchor=\"middle\" fill=\"#9ba3a9\">52 步 = 1 局（1 年）</text></g></g></svg>"},{"name":"定义状态、动作与奖励","role":"算法","do":"状态 = 各段含水率、压力、上期产油；动作 = 各段开度（关/25%/50%/100%）离散组合；奖励 = 周产油 − 0.6×周产水（水处理成本折算）。","effect":"把「多产油少出水」翻译成 agent 能优化的标量信号，约束（含水峰值）做成大额罚分。","trap":"奖励系数是业务决策不是技术细节：水处理成本折 0.6 还是 0.2，直接改变策略性格——要让油藏工程师来定。","fig":"<svg viewBox=\"0 0 560 92\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"MDP 定义示意\"><g font-size=\"10\"><g transform=\"translate(24,10)\"><rect width=\"160\" height=\"70\" rx=\"8\" fill=\"#e7eef9\" stroke=\"#41699b\" stroke-opacity=\".5\"/><text x=\"80\" y=\"24\" text-anchor=\"middle\" fill=\"#31527a\" font-weight=\"700\">状态 S（6 维）</text><text x=\"80\" y=\"42\" text-anchor=\"middle\" fill=\"#79828a\">各段含水率 ×3</text><text x=\"80\" y=\"58\" text-anchor=\"middle\" fill=\"#79828a\">压力 ×2 + 上期产油</text></g><g transform=\"translate(200,10)\"><rect width=\"160\" height=\"70\" rx=\"8\" fill=\"#f1f1dd\" stroke=\"#767a2e\" stroke-opacity=\".6\"/><text x=\"80\" y=\"24\" text-anchor=\"middle\" fill=\"#5d6022\" font-weight=\"700\">动作 A（64 组合）</text><text x=\"80\" y=\"42\" text-anchor=\"middle\" fill=\"#79828a\">3 段 × 4 档开度</text><text x=\"80\" y=\"58\" text-anchor=\"middle\" fill=\"#9ba3a9\">关 / 25% / 50% / 100%</text></g><g transform=\"translate(376,10)\"><rect width=\"160\" height=\"70\" rx=\"8\" fill=\"#f8ecdf\" stroke=\"#b26a39\" stroke-opacity=\".5\"/><text x=\"80\" y=\"24\" text-anchor=\"middle\" fill=\"#8e5229\" font-weight=\"700\">奖励 R</text><text x=\"80\" y=\"42\" text-anchor=\"middle\" fill=\"#79828a\">产油 − 0.6×产水</text><text x=\"80\" y=\"58\" text-anchor=\"middle\" fill=\"#9ba3a9\">含水 &gt; 60% 罚 −50</text></g></g></svg>"},{"name":"训练策略网络","role":"算法","do":"用表格型 Q-learning 起步（状态离散化），再升级到小型策略网络；训练 2 万局，epsilon 从 1.0 退火到 0.05。","effect":"奖励曲线在前 5000 局快速爬升后进入平台期；学到的核心模式是「含水率 45% 预警线」——在见水前就把高渗段拧小。","trap":"训练曲线漂亮不等于策略可用：一定要用「参数随机化」的保留环境测试泛化，训练环境上的高分可能是背下了特定的水侵节奏。","fig":"<svg viewBox=\"0 0 560 96\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"训练曲线示意\"><g font-size=\"10\"><line x1=\"50\" y1=\"80\" x2=\"530\" y2=\"80\" stroke=\"#ddd7c8\"/><line x1=\"50\" y1=\"80\" x2=\"50\" y2=\"12\" stroke=\"#ddd7c8\"/><path d=\"M50 74 C 130 70, 170 40, 250 32 C 330 26, 420 24, 530 22\" fill=\"none\" stroke=\"#2f7d6b\" stroke-width=\"2\"/><path d=\"M50 75 C 160 72, 260 66, 380 60 C 450 57, 500 56, 530 55\" fill=\"none\" stroke=\"#b26a39\" stroke-width=\"1.8\" stroke-dasharray=\"6 3\"/><text x=\"120\" y=\"60\" fill=\"#235f51\" font-weight=\"700\">训练奖励（训练环境）</text><text x=\"380\" y=\"48\" fill=\"#8e5229\">保留环境（随机参数）</text><text x=\"290\" y=\"93\" text-anchor=\"middle\" fill=\"#79828a\">2 万局 · 两条曲线差距 = 泛化差距（应 &lt; 10%）</text></g></svg>"},{"name":"策略行为审计","role":"质控","do":"把学到的策略逐周回放，标注每个动作的触发原因；提炼成 if-then 规则给工程师审阅，确认没有违反工程常识的动作。","effect":"审计发现策略的 90% 决策可归纳为 4 条规则 + 2 个特例处理，特例恰好对应人工没注意到的段间耦合。","trap":"「解释不了但有效」的策略在油田推不动——审计不只是合规，是把 AI 的直觉翻译成工程师的语言。","fig":"<svg viewBox=\"0 0 560 90\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"策略审计示意\"><g font-size=\"10\"><g transform=\"translate(30,12)\"><rect width=\"240\" height=\"62\" rx=\"8\" fill=\"#fff\" stroke=\"#c9c2b0\"/><text x=\"120\" y=\"24\" text-anchor=\"middle\" fill=\"#242b2e\" font-weight=\"700\">提炼出的规则（示例）</text><text x=\"14\" y=\"42\" fill=\"#4d565b\">① 段1含水 &gt; 45% → 开度降一档</text><text x=\"14\" y=\"56\" fill=\"#4d565b\">② 段2 压差 &lt; 1.2 MPa → 段3 补位 +25%</text></g><path d=\"M282 43 h44\" stroke=\"#767a2e\" stroke-width=\"1.4\" marker-end=\"url(#c4ar)\"/><g transform=\"translate(336,12)\"><rect width=\"200\" height=\"62\" rx=\"8\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\" stroke-opacity=\".5\"/><text x=\"100\" y=\"24\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">工程师审阅</text><text x=\"100\" y=\"44\" text-anchor=\"middle\" fill=\"#79828a\">4 条常规规则直接采纳</text><text x=\"100\" y=\"58\" text-anchor=\"middle\" fill=\"#9ba3a9\">2 个特例 → 补进操作规程</text></g></g><defs><marker id=\"c4ar\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#767a2e\"/></marker></defs></svg>"},{"name":"advisor 模式上线","role":"人工","do":"策略以建议形式接入生产系统：每周给出开度建议 + 预期效果，人工确认后执行；同步记录「执行建议」与「未执行」的对照。","effect":"三个月 A/B 对照：执行建议的周次累计产油 +9.6%，含水峰值 58%（未破 60% 红线）。","trap":"A/B 对照不是随机的——按周次交替执行会造成人为的周期混淆，按「井组」分层对照更干净。"}],"metrics":{"title":"怎么算「做对了」","html":"<p>控制策略的对比要画在同一张时间轴上，看两个量：<b>累计产油</b>与<b>含水率轨迹</b>：</p><div style=\"margin:10px 0 6px\"><svg viewBox=\"0 0 640 160\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"策略对比曲线\"><g font-size=\"10\" fill=\"#9ba3a9\"><line x1=\"60\" y1=\"20\" x2=\"60\" y2=\"112\" stroke=\"#ddd7c8\"/><line x1=\"60\" y1=\"112\" x2=\"620\" y2=\"112\" stroke=\"#ddd7c8\"/><text x=\"54\" y=\"26\" text-anchor=\"end\">100%</text><text x=\"54\" y=\"70\" text-anchor=\"end\">50%</text><text x=\"54\" y=\"112\" text-anchor=\"end\">0%</text><line x1=\"60\" y1=\"45\" x2=\"620\" y2=\"45\" stroke=\"#b05a51\" stroke-dasharray=\"5 4\" opacity=\".6\"/><text x=\"618\" y=\"40\" text-anchor=\"end\" fill=\"#b05a51\">含水红线 60%</text></g><g font-size=\"10.5\"><path d=\"M60 104 C 160 96, 260 78, 360 62 C 460 50, 540 46, 615 44\" fill=\"none\" stroke=\"#b26a39\" stroke-width=\"2\"/><text x=\"615\" y=\"60\" text-anchor=\"end\" fill=\"#8e5229\">全开策略 · 含水峰值 74%（破线）</text><path d=\"M60 104 C 160 100, 260 94, 360 84 C 460 76, 540 72, 615 70\" fill=\"none\" stroke=\"#2f7d6b\" stroke-width=\"2.2\"/><text x=\"615\" y=\"86\" text-anchor=\"end\" fill=\"#235f51\" font-weight=\"700\">RL 策略 · 峰值 58%</text><text x=\"340\" y=\"130\" text-anchor=\"middle\" fill=\"#79828a\">时间（第 1 周 → 第 52 周）· 全井含水率轨迹</text><text x=\"340\" y=\"148\" text-anchor=\"middle\" fill=\"#235f51\" font-weight=\"700\">同期累计产油：RL 策略 +9.6% —— 少产的水让出了油的空间</text></g></svg></div><p style=\"margin-top:6px\">一个反直觉的读数：RL 策略在前 10 周的产油<b>略低于</b>全开策略——它主动压了即将见水的段 1。短期的牺牲换来全年含水峰值低 16 个百分点，这就是「长期奖励」与「单步奖励」的差别，也是人工调度最难过的一关。</p>"},"fails":[{"name":"环境过拟合","why":"策略在训练环境高分、在参数随机的保留环境崩掉。解法是域随机化 + 保留环境验收。"},{"name":"奖励漏掉水处理成本","why":"只奖励产油，agent 学会大排量采液。成本系数要由业务方定并写进审计报告。"},{"name":"上线即自动执行","why":"模拟器与真实井的偏差被策略放大，一次错误动作可能导致停井。advisor 模式积累信任是必经阶段。"}]},"demo":{"mode":"module","js":"demo/demo.js","label":"可运行示范","intro":"三段滑套井的一年期沙盘：手动拖开度对比「全开」与你的调度，再点「训练 RL 策略」观看奖励曲线爬升与学到的策略怎么每周调开度。","height":660}}};

  var __mod = { exports: {} };
  (function (module, exports) {
/* 智能完井滑套控制 · 交互示范
   三段储层沙盘：开度 → 分层产液；一年 52 周模拟；RL 训练曲线回放 + 策略对比 */
module.exports = {
  mount: function (root, api) {
    var JADE = 'var(--jade,#2f7d6b)', CLAY = 'var(--clay,#b26a39)',
        OPT = 'var(--c-opt,#41699b)', BAD = 'var(--bad,#b05a51)',
        OKC = 'var(--ok,#3f8560)', INK3 = 'var(--ink-3,#79828a)', KG = 'var(--c-kg,#767a2e)';
    var SEG = [
      { name: '段 1 · 高渗', k: 400, wc0: 0.30, rise: 0.052 },  /* 高渗：水侵快 */
      { name: '段 2 · 中渗', k: 120, wc0: 0.06, rise: 0.014 },
      { name: '段 3 · 低渗', k: 40, wc0: 0.02, rise: 0.006 }
    ];
    var LEVELS = [0, 0.25, 0.5, 1];
    var LEVEL_NAME = ['关', '25%', '50%', '100%'];

    root.innerHTML =
      '<div class="demo">' +
      '<div class="demo-head"><span class="kicker">INTERACTIVE · REINFORCEMENT LEARNING SANDBOX</span>' +
      '<h3>三段滑套井 · 一年期控制沙盘</h3>' +
      '<p>每段一个开度滑杆。点「▶ 运行一年」看你手动策略、全开基线、RL 策略的累计产油与含水对比；' +
      '点「训练 RL」看奖励曲线怎么爬升——学到的策略核心是<b>在见水之前就预调</b>。</p></div>' +
      '<div class="ctl-row">' +
      SEG.map(function (sg, i) {
        return '<div class="ctl"><label>' + sg.name + ' <output id="c4-ov' + i + '">100%</output></label>' +
          '<input type="range" id="c4-s' + i + '" min="0" max="3" step="1" value="3"></div>';
      }).join('') +
      '<button class="btn-x" id="c4-run">▶ 运行一年</button>' +
      '<button class="btn-x ghost" id="c4-train">🧠 训练 RL 策略</button>' +
      '</div>' +
      '<div class="grid2">' +
      '<div class="card-x"><h4>全井含水率轨迹（52 周）</h4>' +
      '<svg id="c4-wc" class="chart" viewBox="0 0 420 280" role="img" aria-label="含水率曲线"></svg>' +
      '<div class="legend"><span><i style="background:#c9c2b0"></i>全开基线</span><span><i style="background:' + CLAY + '"></i>手动策略</span><span><i style="background:' + JADE + '"></i>RL 策略</span></div></div>' +
      '<div class="card-x"><h4>结果对比</h4>' +
      '<svg id="c4-cum" class="chart" viewBox="0 0 420 220" role="img" aria-label="累计产油"></svg>' +
      '<div class="readouts" style="grid-template-columns:1fr 1fr 1fr">' +
      '<div class="ro"><span class="k">全开 · 累产油</span><b id="c4-r0">—</b></div>' +
      '<div class="ro"><span class="k">手动 · 累产油</span><b id="c4-r1">—</b></div>' +
      '<div class="ro"><span class="k">RL · 累产油</span><b id="c4-r2">—</b></div>' +
      '</div></div>' +
      '</div>' +
      '<div class="card-x" style="margin-top:14px"><h4>RL 训练过程（奖励曲线回放）</h4>' +
      '<svg id="c4-train" class="chart" viewBox="0 0 840 160" role="img" aria-label="训练奖励曲线"></svg>' +
      '<p class="note" id="c4-note"></p></div>' +
      '</div>';

    var $ = function (id) { return root.querySelector('#' + id); };

    /* 一局模拟：opts(i, wk) 返回段 i 在第 wk 周的开度 */
    function episode(opts, rnd) {
      var wc = SEG.map(function (s) { return s.wc0; });
      var cumOil = 0, cumWater = 0;
      var wcHist = [], oilHist = [];
      for (var wk = 0; wk < 52; wk++) {
        var total = 0, oil = 0, water = 0;
        var flows = [];
        for (var i = 0; i < 3; i++) {
          var open = LEVELS[opts(i, wk)];
          /* 产液 ∝ K × 开度 × (1 - 已采出程度惩罚)，层间干扰：高开度段抢压 */
          var f = SEG[i].k * open * (1 - wc[i] * 0.45) * (rnd ? (1 + (rnd() - .5) * .12) : 1);
          flows.push(f);
          total += f;
        }
        /* 层间干扰：段1开度大 → 段2/3 产能折减 */
        var steal = LEVELS[opts(0, wk)] * 0.18;
        flows[1] *= (1 - steal); flows[2] *= (1 - steal * 0.7);
        total = flows[0] + flows[1] + flows[2];
        for (i = 0; i < 3; i++) {
          oil += flows[i] * (1 - wc[i]);
          water += flows[i] * wc[i];
          wc[i] = Math.min(0.99, wc[i] + SEG[i].rise * LEVELS[opts(i, wk)] + 0.004);
        }
        cumOil += oil; cumWater += water;
        wcHist.push(oil / (oil + water));   /* 全井含油率（画 1-含水） */
        oilHist.push(cumOil);
      }
      return { cumOil: cumOil, cumWater: cumWater, wcHist: wcHist, oilHist: oilHist };
    }

    function allOpen() { return episode(function () { return 3; }); }
    function manual() {
      var lv = [0, 1, 2].map(function (i) { return +$('c4-s' + i).value; });
      return episode(function (i) { return lv[i]; });
    }
    /* RL 策略：核心规则 = 见水前预调。周初按各段含水率决策 */
    function rlPolicy() {
      var wc = SEG.map(function (s) { return s.wc0; });
      return episode(function (i, wk) {
        if (i === 0) return wc[0] > 0.42 ? 1 : (wc[0] > 0.30 ? 2 : 3);
        if (i === 1) return wc[1] > 0.25 ? 2 : 3;
        return wc[2] > 0.15 ? 2 : 3;
      });
    }

    function drawCurves() {
      var base = allOpen(), man = manual(), rl = rlPolicy();
      var W = 420, H = 280, L = 46, R = 14, T = 14, B = 30;
      function xOf(wk) { return L + wk / 51 * (W - L - R); }
      function yOf(v) { return T + (1 - v) * (H - T - B); }
      var s = '';
      [0, .5, 1].forEach(function (v) {
        s += '<line x1="' + L + '" y1="' + yOf(v) + '" x2="' + (W - R) + '" y2="' + yOf(v) + '" stroke="#efece1"/>' +
          '<text x="' + (L - 5) + '" y="' + (yOf(v) + 3) + '" font-size="9" fill="#9ba3a9" text-anchor="end" font-family="monospace">' + Math.round(v * 100) + '%</text>';
      });
      [0, 25, 50].forEach(function (w) {
        s += '<text x="' + xOf(w) + '" y="' + (H - B + 12) + '" font-size="9" fill="#9ba3a9" text-anchor="middle" font-family="monospace">第' + w + '周</text>';
      });
      s += '<line x1="' + L + '" y1="' + (H - B) + '" x2="' + (W - R) + '" y2="' + (H - B) + '" stroke="#c9c2b0"/>' +
        '<line x1="' + L + '" y1="' + yOf(0.4) + '" x2="' + (W - R) + '" y2="' + yOf(0.4) + '" stroke="' + BAD + '" stroke-dasharray="5 4" opacity=".55"/>' +
        '<text x="' + (W - R) + '" y="' + (yOf(0.4) - 4) + '" font-size="9" fill="' + BAD + '" text-anchor="end">含水红线 60%</text>';
      function path(hist, color, w, dash) {
        var d = '';
        hist.forEach(function (v, wk) { d += (wk ? 'L' : 'M') + xOf(wk).toFixed(1) + ' ' + yOf(1 - v).toFixed(1); });
        return '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="' + w + '"' + (dash ? ' stroke-dasharray="6 3"' : '') + ' opacity=".9"/>';
      }
      s += path(base.wcHist, '#c9c2b0', 1.8, true);
      s += path(man.wcHist, CLAY, 1.8, false);
      s += path(rl.wcHist, JADE, 2.2, false);
      s += '<text x="' + (W - R) + '" y="' + (H - 6) + '" font-size="9.5" fill="#79828a" text-anchor="end">全井含水率（画的是含油率，越低含水越高）</text>';
      $('c4-wc').innerHTML = s;

      /* 累计产油柱 */
      var baseO = base.cumOil, mo = man.cumOil, ro = rl.cumOil;
      var maxO = Math.max(baseO, mo, ro) * 1.15;
      function bar(y, label, val, color, ref) {
        var pct = val / maxO * 100;
        var dPct = ((val - ref) / ref * 100);
        var tag = dPct >= 0 ? '+' + dPct.toFixed(1) + '%' : dPct.toFixed(1) + '%';
        return '<text x="10" y="' + (y + 14) + '" font-size="11" fill="#4d565b">' + label + '</text>' +
          '<rect x="92" y="' + y + '" width="' + (300) + '" height="22" rx="11" fill="#efece1"/>' +
          '<rect x="92" y="' + y + '" width="' + (pct * 3).toFixed(0) + '" height="22" rx="11" fill="' + color + '" opacity=".85"/>' +
          '<text x="404" y="' + (y + 15) + '" font-size="10.5" font-weight="700" fill="' + color + '" text-anchor="end">' + tag + '</text>';
      }
      $('c4-cum').innerHTML =
        bar(20, '全开基线', baseO, '#9aa2a8', baseO) +
        bar(70, '手动策略', mo, CLAY, baseO) +
        bar(120, 'RL 策略', ro, JADE, baseO) +
        '<text x="210" y="180" text-anchor="middle" font-size="10" fill="#79828a">累计产油（相对全开基线）· 一年期</text>';
      $('c4-r0').textContent = Math.round(baseO).toLocaleString() + ' m³';
      $('c4-r1').textContent = Math.round(mo).toLocaleString() + ' m³';
      $('c4-r2').textContent = Math.round(ro).toLocaleString() + ' m³';
      return { base: base, man: man, rl: rl };
    }

    function drawTrain(progress) {
      /* 预生成的奖励曲线：QL 爬升 + 保留环境略低 */
      var W = 840, H = 160, L = 46, R = 14, T = 12, B = 26;
      function xOf(i) { return L + i / 200 * (W - L - R); }
      function yOf(v) { return T + (1 - (v - 0) / 140) * (H - T - B); }
      var s = '';
      [0, 70, 140].forEach(function (v) {
        s += '<line x1="' + L + '" y1="' + yOf(v) + '" x2="' + (W - R) + '" y2="' + yOf(v) + '" stroke="#efece1"/>' +
          '<text x="' + (L - 5) + '" y="' + (yOf(v) + 3) + '" font-size="9" fill="#9ba3a9" text-anchor="end" font-family="monospace">' + v + '</text>';
      });
      var n = Math.max(2, Math.round(200 * progress));
      var tr = '', te = '';
      for (var i = 0; i <= n; i++) {
        var trainV = 8 + 108 * (1 - Math.exp(-i / 38)) + Math.sin(i / 9) * 3.2;
        var testV = 8 + 96 * (1 - Math.exp(-i / 46)) + Math.sin(i / 11) * 2.6;
        tr += (i ? 'L' : 'M') + xOf(i).toFixed(1) + ' ' + yOf(trainV).toFixed(1);
        te += (i ? 'L' : 'M') + xOf(i).toFixed(1) + ' ' + yOf(testV).toFixed(1);
      }
      s += '<path d="' + tr + '" fill="none" stroke="' + JADE + '" stroke-width="2"/>' +
        '<path d="' + te + '" fill="none" stroke="' + CLAY + '" stroke-width="1.7" stroke-dasharray="6 3"/>' +
        '<line x1="' + L + '" y1="' + (H - B) + '" x2="' + (W - R) + '" y2="' + (H - B) + '" stroke="#c9c2b0"/>' +
        '<text x="' + (W - R) + '" y="' + (H - 6) + '" font-size="9.5" fill="#79828a" text-anchor="end">训练局数（0 → 2 万）</text>' +
        '<text x="60" y="24" font-size="10" fill="#235f51" font-weight="700">训练环境奖励</text>' +
        '<text x="60" y="40" font-size="10" fill="#8e5229">保留环境（参数随机化）</text>';
      if (progress >= 1) {
        s += '<text x="' + (W - R) + '" y="' + yOf(128) + '" font-size="10" fill="#235f51" font-weight="700" text-anchor="end">两线差距 &lt; 10% → 泛化合格</text>';
      }
      $('c4-train').innerHTML = s;
    }

    var cur = drawCurves();
    ['c4-s0', 'c4-s1', 'c4-s2'].forEach(function (id, i) {
      $(id).addEventListener('input', function () {
        $('c4-ov' + i).textContent = LEVEL_NAME[+$('c4-s' + i).value];
        cur = drawCurves();
      });
    });
    $('c4-run').addEventListener('click', function () {
      cur = drawCurves();
      $('c4-note').innerHTML = '已按你的开度重跑一年。看两条线索：<b>含水轨迹有没有撞红线</b>，以及<b>累产油与全开基线的差</b>。' +
        '试试把段 1 拧到 25%、段 2/3 保持全开——这是人工最直觉的应对，再和 RL 的成绩比一比。';
    });
    $('c4-train').addEventListener('click', function () {
      var p = 0;
      var timer = setInterval(function () {
        p += 0.04;
        drawTrain(Math.min(1, p));
        if (p >= 1) {
          clearInterval(timer);
          cur = drawCurves();
          $('c4-note').innerHTML =
            '<b>训练完成（2 万局）。</b>绿线是训练环境的奖励曲线，橙色虚线是参数随机化的保留环境——两线差距小于 10%，说明策略学的是「规律」而不是「背题」。' +
            '审计学到的策略，90% 的决策可归纳为：<b>段 1 含水率过 42% 预警线就降一档开度</b>（在见水前动，不是见水后动），' +
            '省下的井底压力让给段 2/3。看最上面的含水轨迹：RL 曲线始终没碰红线，而全开基线在第 30 周后破线。' +
            '注意 RL 前 10 周产油略低于全开——<b>短期牺牲换长期含水可控</b>，这正是人工调度最难接受、也是 RL 最有价值的地方。';
        }
      }, 90);
    });

    drawTrain(1);
    $('c4-note').innerHTML =
      '先不动滑杆，直接看三条线的差距：全开基线（灰虚线）在第 30 周后含水冲破 60% 红线；' +
      'RL 策略（绿）全程压在红线以下。然后自己拖一拖开度，看能不能手动打赢 RL——' +
      '大多数人的第一反应「见水才关」都慢了半拍，<b>预调</b>才是关键。';
    return {
      unmount: function () { /* interval 已在完成时清除 */ }
    };
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
