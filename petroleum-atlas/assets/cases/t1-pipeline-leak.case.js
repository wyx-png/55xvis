/* =========================================================
   t1-pipeline-leak · 案例插件（由 _build/build.mjs 自动生成，勿手改）
   源头是案例包 pipeline-leak-case/source.js + demo/，改内容请改源头后重新构建。
   ========================================================= */
(function () {
  var DEF = {"id":"t1-pipeline-leak","sceneId":"t1","title":"管道泄漏智能检测：把振动的时空图当成图像来看","status":"ready","version":"1.0.0","updated":"2026-10-23","tabs":{"background":{"label":"专业背景","lede":"长输管道一旦穿孔，损失的不只是油，还有停输、环境赔付和抢修。管道沿线现在铺着两根东西：一根是<b>压力变送器</b>（只在首末站有），一根是越来越常见的<b>分布式光纤（DAS）</b>——沿管道埋一芯光缆，整根光缆就变成几万个振动传感器，每 10 米一个测点，每秒采样上千次。问题从\"有没有数据\"变成了\"数据太多，人看不过来\"。","judge":[{"label":"任务类型","value":"时空图分类","desc":"把时空切片当图像处理"},{"label":"数据门槛","value":"≥ 2000 段标注事件","desc":"真实泄漏极少，需仿真补"},{"label":"可见收益","value":"虚警 3 次/天 → 0.3 次/天","desc":"否则调度会关掉它"},{"label":"难度","value":"中","html":"<span class=\"dtag\" data-d=\"中\">难度 中</span>"}],"sections":[{"no":1,"en":"PROBLEM","title":"当前做法与问题","html":"<p>传统的管道泄漏监测靠两套东西：一是 <b>SCADA 流量平衡</b>（进的量和出的量对不上就是漏了，但小泄漏根本对不出来）；二是 <b>负压波法</b>——泄漏瞬间产生一个向两端传播的减压波，用首末站两个压力变送器接收到这个波的<b>时间差</b>就能算出漏点位置。</p><p>负压波很灵敏，0.5% 的泄漏也能有响应；但它的致命伤是<b>分不清\"漏了\"和\"人在操作\"</b>：调泵、调阀、清管器过站，都会产生几乎一模一样的压力波。所以现场的真实状态是：<b>报警天天响，调度员早就学会先忽略报警，等别的证据来了才信</b>。</p><div class=\"figure\"><svg viewBox=\"0 0 640 268\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"负压波定位原理\"><rect x=\"30\" y=\"24\" width=\"580\" height=\"16\" rx=\"8\" fill=\"#eef1f3\" stroke=\"#9ba3a9\"/><g fill=\"#41699b\"><rect x=\"26\" y=\"18\" width=\"10\" height=\"28\" rx=\"2\"/><rect x=\"604\" y=\"18\" width=\"10\" height=\"28\" rx=\"2\"/></g><g font-size=\"9.5\" text-anchor=\"middle\"><text x=\"30\" y=\"58\" fill=\"#31527a\">首站压力变送器（0 km）</text><text x=\"612\" y=\"58\" fill=\"#31527a\">末站压力变送器（60 km）</text><text x=\"204\" y=\"58\" fill=\"#b05a51\" font-weight=\"700\">泄漏点 x = 18 km</text></g><path d=\"M204 40 l0 14\" stroke=\"#b05a51\" stroke-width=\"2\"/><g stroke=\"#b05a51\" stroke-width=\"1.3\" fill=\"none\" marker-end=\"url(#t1a1)\"><path d=\"M192 40 q-80 5 -158 0\"/><path d=\"M216 40 q198 5 380 0\"/></g><text x=\"120\" y=\"74\" text-anchor=\"middle\" font-size=\"9\" fill=\"#8e5229\">波传 t₁ = x / v</text><text x=\"440\" y=\"74\" text-anchor=\"middle\" font-size=\"9\" fill=\"#8e5229\">波传 t₂ = (L − x) / v</text><rect x=\"30\" y=\"90\" width=\"580\" height=\"76\" fill=\"#fbfaf6\" stroke=\"#ece7da\"/><path d=\"M34.0 110.2 L38.8 108.8 L43.6 108.8 L48.4 109.0 L53.2 109.0 L58.0 108.7 L62.8 108.5 L67.6 110.0 L72.5 108.6 L77.3 108.0 L82.1 108.9 L86.9 108.1 L91.7 109.0 L96.5 108.2 L101.3 108.3 L106.1 108.5 L110.9 110.3 L115.7 109.9 L120.5 108.8 L125.3 109.4 L130.1 109.3 L134.9 109.6 L139.7 109.5 L144.6 109.2 L149.4 109.5 L154.2 108.6 L159.0 108.4 L163.8 108.5 L168.6 108.6 L173.4 108.2 L178.2 110.2 L183.0 109.7 L187.8 109.8 L192.6 108.3 L197.4 108.9 L202.2 110.0 L207.0 108.2 L211.8 118.3 L216.7 125.1 L221.5 129.4 L226.3 133.4 L231.1 136.5 L235.9 137.4 L240.7 140.5 L245.5 141.6 L250.3 141.9 L255.1 142.1 L259.9 144.3 L264.7 143.6 L269.5 144.4 L274.3 144.2 L279.1 145.8 L283.9 144.0 L288.8 145.2 L293.6 145.8 L298.4 146.2 L303.2 145.6 L308.0 145.3 L312.8 144.5 L317.6 145.6 L322.4 144.6 L327.2 146.4 L332.0 145.7 L336.8 144.4 L341.6 145.7 L346.4 144.8 L351.2 146.4 L356.1 144.8 L360.9 145.3 L365.7 144.4 L370.5 145.4 L375.3 145.8 L380.1 146.4 L384.9 145.7 L389.7 145.2 L394.5 144.9 L399.3 145.2 L404.1 146.0 L408.9 145.1 L413.7 145.8 L418.5 144.5 L423.3 146.0 L428.2 146.6 L433.0 144.7 L437.8 145.9 L442.6 145.3 L447.4 146.5 L452.2 145.6 L457.0 145.5 L461.8 145.5 L466.6 146.2 L471.4 145.7 L476.2 145.1 L481.0 144.6 L485.8 145.3 L490.6 146.3 L495.4 144.5 L500.3 145.4 L505.1 144.7 L509.9 146.1 L514.7 144.4 L519.5 145.9 L524.3 146.3 L529.1 146.4 L533.9 146.1 L538.7 146.6 L543.5 144.9 L548.3 145.2 L553.1 146.4 L557.9 146.6 L562.7 145.0 L567.5 145.1 L572.4 145.1 L577.2 146.2 L582.0 146.6 L586.8 146.5 L591.6 145.0 L596.4 144.6 L601.2 144.6 L606.0 144.8\" fill=\"none\" stroke=\"#41699b\" stroke-width=\"1.6\"/><path d=\"M34.0 110.3 L38.8 108.8 L43.6 108.1 L48.4 108.5 L53.2 109.1 L58.0 108.7 L62.8 108.8 L67.6 110.2 L72.5 109.7 L77.3 108.7 L82.1 110.3 L86.9 110.0 L91.7 108.5 L96.5 109.6 L101.3 109.2 L106.1 108.1 L110.9 109.2 L115.7 109.3 L120.5 108.6 L125.3 110.0 L130.1 108.4 L134.9 109.3 L139.7 110.1 L144.6 110.3 L149.4 108.8 L154.2 110.1 L159.0 109.9 L163.8 108.4 L168.6 109.1 L173.4 108.3 L178.2 109.1 L183.0 108.5 L187.8 110.3 L192.6 110.1 L197.4 109.8 L202.2 108.8 L207.0 109.4 L211.8 109.5 L216.7 108.7 L221.5 108.8 L226.3 110.3 L231.1 108.7 L235.9 109.0 L240.7 109.8 L245.5 108.4 L250.3 109.8 L255.1 109.4 L259.9 109.8 L264.7 109.6 L269.5 109.3 L274.3 108.3 L279.1 108.8 L283.9 108.1 L288.8 108.1 L293.6 109.3 L298.4 110.3 L303.2 110.2 L308.0 108.5 L312.8 108.5 L317.6 109.8 L322.4 108.5 L327.2 109.0 L332.0 108.9 L336.8 110.3 L341.6 108.6 L346.4 108.7 L351.2 110.2 L356.1 108.1 L360.9 109.5 L365.7 109.1 L370.5 108.5 L375.3 110.0 L380.1 109.4 L384.9 110.3 L389.7 109.2 L394.5 109.8 L399.3 108.8 L404.1 108.2 L408.9 110.1 L413.7 110.2 L418.5 109.0 L423.3 109.5 L428.2 109.9 L433.0 110.0 L437.8 108.5 L442.6 118.3 L447.4 124.0 L452.2 130.0 L457.0 133.7 L461.8 136.5 L466.6 138.7 L471.4 140.7 L476.2 142.5 L481.0 143.1 L485.8 143.5 L490.6 143.9 L495.4 143.8 L500.3 144.4 L505.1 144.1 L509.9 145.4 L514.7 144.4 L519.5 145.0 L524.3 144.6 L529.1 144.3 L533.9 146.4 L538.7 145.7 L543.5 146.0 L548.3 146.1 L553.1 144.8 L557.9 145.9 L562.7 145.7 L567.5 145.9 L572.4 144.8 L577.2 145.6 L582.0 146.2 L586.8 146.0 L591.6 146.6 L596.4 146.3 L601.2 144.4 L606.0 145.6\" fill=\"none\" stroke=\"#2f7d6b\" stroke-width=\"1.6\"/><g stroke=\"#b05a51\" stroke-dasharray=\"4 3\"><path d=\"M205.6 96 v66\"/><path d=\"M434.4 96 v66\"/></g><text x=\"205.6\" y=\"92\" text-anchor=\"middle\" font-size=\"9\" fill=\"#b05a51\">t₁</text><text x=\"434.4\" y=\"92\" text-anchor=\"middle\" font-size=\"9\" fill=\"#b05a51\">t₂</text><g stroke=\"#b26a39\" stroke-width=\"1.4\" fill=\"none\"><path d=\"M205.6 150 h228.8\"/></g><text x=\"320.0\" y=\"146\" text-anchor=\"middle\" font-size=\"9.5\" fill=\"#8e5229\">Δt</text><g font-size=\"9\"><text x=\"38\" y=\"106\" fill=\"#31527a\">■ 首站</text><text x=\"38\" y=\"120\" fill=\"#235f51\">■ 末站</text></g><g transform=\"translate(30,186)\"><rect x=\"0\" y=\"0\" width=\"580\" height=\"46\" rx=\"8\" fill=\"#f5f2ea\" stroke=\"#ddd7c8\"/><text x=\"290\" y=\"20\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"700\" fill=\"#4d565b\" font-family=\"ui-monospace,monospace\">x = (L − v · Δt) / 2　　Δt = t₂ − t₁</text><text x=\"290\" y=\"38\" text-anchor=\"middle\" font-size=\"9.5\" fill=\"#79828a\">漏得越大、波越陡，t₁ t₂ 越好认；漏得越小，压力下降被日常波动盖住，两个时刻就都认不准了</text></g><text x=\"30\" y=\"252\" font-size=\"10\" fill=\"#4d565b\">负压波法的优点：<tspan font-weight=\"700\" fill=\"#235f51\">灵敏度高，小到 0.5% 的泄漏也能有响应</tspan>。</text><text x=\"30\" y=\"264\" font-size=\"10\" fill=\"#b05a51\">缺点：调泵、调阀、清管都会产生压力波——<tspan font-weight=\"700\">它分不清是\"漏了\"还是\"人在操作\"</tspan>。</text><defs><marker id=\"t1a1\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#b26a39\"/></marker></defs></svg></div><div class=\"figcap\"><b>图 1</b><span>负压波定位原理。<b>这个公式是管道行业的常识</b>：x = (L − v·Δt)/2。它解决的是\"漏在哪\"，但解决不了\"是不是真的漏了\"——而后者才是误报的真正来源。</span></div>"},{"no":2,"en":"INTERVENTION","title":"AI 能做什么","html":"<p>分布式光纤（DAS）把整根光缆变成传感器阵列：光脉冲在光纤里走，遇到振动会产生背向散射的变化，<b>解算出来就是\"哪个位置、在什么时刻、振动有多强\"</b>。把它排成图——横轴是沿管道距离、纵轴是时间、颜色是振动能量——就得到一张<b>时空瀑布图</b>。</p><p>关键发现在这张图上：<b>泄漏是固定位置的一条竖带，车辆是一条陡斜线，施工是同一位置的间歇闪烁，清管是更缓的一条斜带，而调泵调阀是整条线同时变化</b>。这五类事件加上\"什么都没有\"，共六类，在图像上长得完全不一样——那它就是一个标准的图像分类问题。</p><div class=\"figure\"><svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"DAS 瀑布图上的五种事件签名\"><text x=\"16\" y=\"16\" font-size=\"10.5\" font-weight=\"700\" fill=\"#4d565b\">同一张时空图，五种事件长得完全不一样 → 这就是图像分类能派上用场的原因</text><g font-size=\"9\" fill=\"#79828a\"><text x=\"16\" y=\"30\">每格：横轴 = 沿管道距离，纵轴 = 时间（向下为时间增长），颜色深浅 = 该处振动能量</text></g><rect x=\"16\" y=\"40\" width=\"186\" height=\"130\" fill=\"#fbfaf6\" stroke=\"#ddd7c8\"/><text x=\"109\" y=\"184\" text-anchor=\"middle\" font-size=\"10\" font-weight=\"700\" fill=\"#4d565b\">泄漏：固定位置的一条竖带</text><rect x=\"155.0\" y=\"158.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"119.9\" y=\"143.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"126.7\" y=\"92.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"98.2\" y=\"151.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"51.4\" y=\"146.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"172.9\" y=\"152.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"178.6\" y=\"162.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"68.6\" y=\"52.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"59.6\" y=\"156.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"42.9\" y=\"131.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"68.8\" y=\"91.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"87.9\" y=\"95.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"78.2\" y=\"118.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"189.0\" y=\"81.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"178.6\" y=\"119.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"79.7\" y=\"74.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"112.4\" y=\"48.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"36.0\" y=\"132.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"61.5\" y=\"72.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"160.6\" y=\"50.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"84.4\" y=\"82.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"149.8\" y=\"58.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"37.0\" y=\"126.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"143.3\" y=\"118.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"60.2\" y=\"153.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"59.7\" y=\"109.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"140.3\" y=\"73.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"87.7\" y=\"131.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"172.9\" y=\"46.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"186.8\" y=\"58.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"28.7\" y=\"103.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"96.6\" y=\"111.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"61.4\" y=\"76.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"138.4\" y=\"164.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"23.9\" y=\"85.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"78.8\" y=\"100.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"166.3\" y=\"47.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"28.9\" y=\"110.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"50.2\" y=\"114.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"198.1\" y=\"97.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"21.8\" y=\"72.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"147.0\" y=\"112.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"70.2\" y=\"58.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"28.2\" y=\"53.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"23.2\" y=\"162.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"48.7\" y=\"116.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"35.2\" y=\"121.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"194.2\" y=\"59.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"191.5\" y=\"72.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"137.2\" y=\"52.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"72.9\" y=\"157.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"20.6\" y=\"120.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"74.1\" y=\"143.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"148.5\" y=\"44.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"191.1\" y=\"122.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"184.8\" y=\"109.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"140.9\" y=\"53.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"123.4\" y=\"57.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"37.4\" y=\"150.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"117.8\" y=\"43.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"178.0\" y=\"43.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"86.4\" y=\"123.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"155.3\" y=\"153.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"50.2\" y=\"63.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"76.6\" y=\"54.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"49.3\" y=\"126.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"56.9\" y=\"160.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"145.0\" y=\"104.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"138.5\" y=\"102.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"163.1\" y=\"45.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"131.3\" y=\"54.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"136.8\" y=\"133.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"178.1\" y=\"53.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"114.0\" y=\"127.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"189.4\" y=\"53.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"196.6\" y=\"87.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"120.2\" y=\"135.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"107.7\" y=\"150.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"45.2\" y=\"90.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"143.7\" y=\"126.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"114.2\" y=\"104.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"198.1\" y=\"113.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"153.2\" y=\"64.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"62.9\" y=\"90.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"164.7\" y=\"155.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"124.0\" y=\"131.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"141.7\" y=\"97.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"168.9\" y=\"137.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"178.4\" y=\"94.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"190.4\" y=\"148.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"97.1\" y=\"44.0\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.71\"/><rect x=\"97.1\" y=\"47.0\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.60\"/><rect x=\"97.1\" y=\"50.1\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.70\"/><rect x=\"97.1\" y=\"53.1\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.70\"/><rect x=\"97.1\" y=\"56.2\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.64\"/><rect x=\"97.1\" y=\"59.3\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.83\"/><rect x=\"97.1\" y=\"62.3\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.78\"/><rect x=\"97.1\" y=\"65.3\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.71\"/><rect x=\"97.1\" y=\"68.4\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.79\"/><rect x=\"97.1\" y=\"71.5\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.72\"/><rect x=\"97.1\" y=\"74.5\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.78\"/><rect x=\"97.1\" y=\"77.5\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.76\"/><rect x=\"97.1\" y=\"80.6\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.68\"/><rect x=\"97.1\" y=\"83.7\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.77\"/><rect x=\"97.1\" y=\"86.7\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.77\"/><rect x=\"97.1\" y=\"89.8\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.79\"/><rect x=\"97.1\" y=\"92.8\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.80\"/><rect x=\"97.1\" y=\"95.8\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.58\"/><rect x=\"97.1\" y=\"98.9\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.70\"/><rect x=\"97.1\" y=\"101.9\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.55\"/><rect x=\"97.1\" y=\"105.0\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.81\"/><rect x=\"97.1\" y=\"108.0\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.88\"/><rect x=\"97.1\" y=\"111.1\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.74\"/><rect x=\"97.1\" y=\"114.1\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.85\"/><rect x=\"97.1\" y=\"117.2\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.89\"/><rect x=\"97.1\" y=\"120.3\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.70\"/><rect x=\"97.1\" y=\"123.3\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.74\"/><rect x=\"97.1\" y=\"126.3\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.64\"/><rect x=\"97.1\" y=\"129.4\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.73\"/><rect x=\"97.1\" y=\"132.4\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.81\"/><rect x=\"97.1\" y=\"135.5\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.88\"/><rect x=\"97.1\" y=\"138.6\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.69\"/><rect x=\"97.1\" y=\"141.6\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.60\"/><rect x=\"97.1\" y=\"144.6\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.62\"/><rect x=\"97.1\" y=\"147.7\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.86\"/><rect x=\"97.1\" y=\"150.8\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.85\"/><rect x=\"97.1\" y=\"153.8\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.65\"/><rect x=\"97.1\" y=\"156.8\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.82\"/><rect x=\"97.1\" y=\"159.9\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.62\"/><rect x=\"97.1\" y=\"162.9\" width=\"5.3\" height=\"3.6\" fill=\"#b05a51\" opacity=\"0.64\"/><rect x=\"222\" y=\"40\" width=\"186\" height=\"130\" fill=\"#fbfaf6\" stroke=\"#ddd7c8\"/><text x=\"315\" y=\"184\" text-anchor=\"middle\" font-size=\"10\" font-weight=\"700\" fill=\"#4d565b\">第三方施工：同一位置间歇出现</text><rect x=\"361.0\" y=\"158.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"325.9\" y=\"143.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"332.7\" y=\"92.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"304.2\" y=\"151.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"257.4\" y=\"146.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"378.9\" y=\"152.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"384.6\" y=\"162.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"274.6\" y=\"52.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"265.6\" y=\"156.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"248.9\" y=\"131.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"274.8\" y=\"91.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"293.9\" y=\"95.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"284.2\" y=\"118.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"395.0\" y=\"81.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"384.6\" y=\"119.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"285.7\" y=\"74.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"318.4\" y=\"48.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"242.0\" y=\"132.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"267.5\" y=\"72.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"366.6\" y=\"50.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"290.4\" y=\"82.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"355.8\" y=\"58.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"243.0\" y=\"126.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"349.3\" y=\"118.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"266.2\" y=\"153.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"265.7\" y=\"109.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"346.3\" y=\"73.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"293.7\" y=\"131.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"378.9\" y=\"46.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"392.8\" y=\"58.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"234.7\" y=\"103.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"302.6\" y=\"111.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"267.4\" y=\"76.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"344.4\" y=\"164.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"229.9\" y=\"85.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"284.8\" y=\"100.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"372.3\" y=\"47.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"234.9\" y=\"110.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"256.2\" y=\"114.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"404.1\" y=\"97.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"227.8\" y=\"72.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"353.0\" y=\"112.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"276.2\" y=\"58.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"234.2\" y=\"53.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"229.2\" y=\"162.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"254.7\" y=\"116.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"241.2\" y=\"121.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"400.2\" y=\"59.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"397.5\" y=\"72.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"343.2\" y=\"52.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"278.9\" y=\"157.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"226.6\" y=\"120.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"280.1\" y=\"143.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"354.5\" y=\"44.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"397.1\" y=\"122.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"390.8\" y=\"109.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"346.9\" y=\"53.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"329.4\" y=\"57.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"243.4\" y=\"150.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"323.8\" y=\"43.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"384.0\" y=\"43.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"292.4\" y=\"123.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"361.3\" y=\"153.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"256.2\" y=\"63.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"282.6\" y=\"54.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"255.3\" y=\"126.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"262.9\" y=\"160.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"351.0\" y=\"104.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"344.5\" y=\"102.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"369.1\" y=\"45.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"337.3\" y=\"54.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"342.8\" y=\"133.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"384.1\" y=\"53.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"320.0\" y=\"127.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"395.4\" y=\"53.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"402.6\" y=\"87.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"326.2\" y=\"135.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"313.7\" y=\"150.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"251.2\" y=\"90.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"349.7\" y=\"126.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"320.2\" y=\"104.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"404.1\" y=\"113.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"359.2\" y=\"64.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"268.9\" y=\"90.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"370.7\" y=\"155.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"330.0\" y=\"131.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"347.7\" y=\"97.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"374.9\" y=\"137.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"384.4\" y=\"94.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"396.4\" y=\"148.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"297.2\" y=\"44.0\" width=\"4.7\" height=\"3.6\" fill=\"#b26a39\" opacity=\"0.43\"/><rect x=\"297.2\" y=\"47.0\" width=\"4.7\" height=\"3.6\" fill=\"#b26a39\" opacity=\"0.58\"/><rect x=\"297.2\" y=\"50.1\" width=\"4.7\" height=\"3.6\" fill=\"#b26a39\" opacity=\"0.78\"/><rect x=\"297.2\" y=\"53.1\" width=\"4.7\" height=\"3.6\" fill=\"#b26a39\" opacity=\"0.60\"/><rect x=\"297.2\" y=\"56.2\" width=\"4.7\" height=\"3.6\" fill=\"#b26a39\" opacity=\"0.62\"/><rect x=\"297.2\" y=\"59.3\" width=\"4.7\" height=\"3.6\" fill=\"#b26a39\" opacity=\"0.68\"/><rect x=\"297.2\" y=\"62.3\" width=\"4.7\" height=\"3.6\" fill=\"#b26a39\" opacity=\"0.70\"/><rect x=\"297.2\" y=\"65.3\" width=\"4.7\" height=\"3.6\" fill=\"#b26a39\" opacity=\"0.73\"/><rect x=\"297.2\" y=\"71.5\" width=\"4.7\" height=\"3.6\" fill=\"#b26a39\" opacity=\"0.59\"/><rect x=\"297.2\" y=\"74.5\" width=\"4.7\" height=\"3.6\" fill=\"#b26a39\" opacity=\"0.76\"/><rect x=\"297.2\" y=\"80.6\" width=\"4.7\" height=\"3.6\" fill=\"#b26a39\" opacity=\"0.83\"/><rect x=\"297.2\" y=\"86.7\" width=\"4.7\" height=\"3.6\" fill=\"#b26a39\" opacity=\"0.65\"/><rect x=\"297.2\" y=\"89.8\" width=\"4.7\" height=\"3.6\" fill=\"#b26a39\" opacity=\"0.63\"/><rect x=\"297.2\" y=\"98.9\" width=\"4.7\" height=\"3.6\" fill=\"#b26a39\" opacity=\"0.43\"/><rect x=\"297.2\" y=\"101.9\" width=\"4.7\" height=\"3.6\" fill=\"#b26a39\" opacity=\"0.84\"/><rect x=\"297.2\" y=\"108.0\" width=\"4.7\" height=\"3.6\" fill=\"#b26a39\" opacity=\"0.77\"/><rect x=\"297.2\" y=\"111.1\" width=\"4.7\" height=\"3.6\" fill=\"#b26a39\" opacity=\"0.49\"/><rect x=\"297.2\" y=\"114.1\" width=\"4.7\" height=\"3.6\" fill=\"#b26a39\" opacity=\"0.81\"/><rect x=\"297.2\" y=\"117.2\" width=\"4.7\" height=\"3.6\" fill=\"#b26a39\" opacity=\"0.77\"/><rect x=\"297.2\" y=\"120.3\" width=\"4.7\" height=\"3.6\" fill=\"#b26a39\" opacity=\"0.46\"/><rect x=\"297.2\" y=\"123.3\" width=\"4.7\" height=\"3.6\" fill=\"#b26a39\" opacity=\"0.40\"/><rect x=\"297.2\" y=\"132.4\" width=\"4.7\" height=\"3.6\" fill=\"#b26a39\" opacity=\"0.62\"/><rect x=\"297.2\" y=\"135.5\" width=\"4.7\" height=\"3.6\" fill=\"#b26a39\" opacity=\"0.62\"/><rect x=\"297.2\" y=\"138.6\" width=\"4.7\" height=\"3.6\" fill=\"#b26a39\" opacity=\"0.85\"/><rect x=\"297.2\" y=\"141.6\" width=\"4.7\" height=\"3.6\" fill=\"#b26a39\" opacity=\"0.40\"/><rect x=\"297.2\" y=\"144.6\" width=\"4.7\" height=\"3.6\" fill=\"#b26a39\" opacity=\"0.75\"/><rect x=\"297.2\" y=\"147.7\" width=\"4.7\" height=\"3.6\" fill=\"#b26a39\" opacity=\"0.52\"/><rect x=\"297.2\" y=\"150.8\" width=\"4.7\" height=\"3.6\" fill=\"#b26a39\" opacity=\"0.46\"/><rect x=\"297.2\" y=\"153.8\" width=\"4.7\" height=\"3.6\" fill=\"#b26a39\" opacity=\"0.44\"/><rect x=\"297.2\" y=\"156.8\" width=\"4.7\" height=\"3.6\" fill=\"#b26a39\" opacity=\"0.74\"/><rect x=\"297.2\" y=\"162.9\" width=\"4.7\" height=\"3.6\" fill=\"#b26a39\" opacity=\"0.72\"/><rect x=\"428\" y=\"40\" width=\"186\" height=\"130\" fill=\"#fbfaf6\" stroke=\"#ddd7c8\"/><text x=\"521\" y=\"184\" text-anchor=\"middle\" font-size=\"10\" font-weight=\"700\" fill=\"#4d565b\">车辆经过：一条斜线（在移动）</text><rect x=\"498.9\" y=\"81.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"539.1\" y=\"122.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"513.9\" y=\"152.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"488.0\" y=\"141.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"460.7\" y=\"131.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"532.7\" y=\"145.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"519.8\" y=\"47.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"467.1\" y=\"129.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"537.9\" y=\"50.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"505.9\" y=\"83.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"446.3\" y=\"106.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"532.8\" y=\"87.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"544.6\" y=\"161.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"503.4\" y=\"152.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"549.9\" y=\"105.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"475.7\" y=\"130.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"496.3\" y=\"116.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"585.8\" y=\"67.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"496.4\" y=\"60.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"431.7\" y=\"156.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"558.7\" y=\"61.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"433.2\" y=\"86.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"441.5\" y=\"110.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"580.7\" y=\"132.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"469.4\" y=\"160.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"490.2\" y=\"103.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"502.0\" y=\"116.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"588.0\" y=\"46.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"589.9\" y=\"101.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"512.3\" y=\"143.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"599.1\" y=\"122.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"585.6\" y=\"139.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"448.8\" y=\"62.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"553.4\" y=\"158.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"492.2\" y=\"163.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"455.7\" y=\"72.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"537.0\" y=\"44.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"434.6\" y=\"102.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"544.4\" y=\"46.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"475.2\" y=\"105.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"513.2\" y=\"50.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"574.2\" y=\"52.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"518.9\" y=\"112.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"441.1\" y=\"86.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"481.7\" y=\"113.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"579.0\" y=\"112.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"547.1\" y=\"101.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"517.6\" y=\"98.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"480.2\" y=\"58.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"456.9\" y=\"117.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"487.7\" y=\"113.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"564.0\" y=\"137.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"520.1\" y=\"101.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"490.7\" y=\"110.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"556.7\" y=\"52.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"464.6\" y=\"93.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"457.0\" y=\"73.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"492.9\" y=\"122.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"529.6\" y=\"163.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"558.9\" y=\"134.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"593.5\" y=\"92.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"602.3\" y=\"107.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"573.5\" y=\"59.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"553.6\" y=\"134.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"492.1\" y=\"113.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"561.5\" y=\"50.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"471.9\" y=\"83.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"516.1\" y=\"139.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"500.3\" y=\"63.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"535.5\" y=\"103.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"479.6\" y=\"158.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"528.5\" y=\"123.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"586.3\" y=\"80.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"591.7\" y=\"145.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"569.6\" y=\"114.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"443.3\" y=\"154.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"446.5\" y=\"113.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"461.6\" y=\"125.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"590.8\" y=\"106.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"460.8\" y=\"108.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"523.9\" y=\"108.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"482.9\" y=\"72.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"436.8\" y=\"149.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"546.6\" y=\"159.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"517.7\" y=\"63.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"483.4\" y=\"143.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"587.0\" y=\"113.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"491.5\" y=\"73.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"604.3\" y=\"43.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"566.4\" y=\"84.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"437.9\" y=\"44.0\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.56\"/><rect x=\"442.1\" y=\"47.0\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.55\"/><rect x=\"446.2\" y=\"50.1\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.45\"/><rect x=\"450.4\" y=\"53.1\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.72\"/><rect x=\"454.5\" y=\"56.2\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.58\"/><rect x=\"458.7\" y=\"59.3\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.49\"/><rect x=\"462.9\" y=\"62.3\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.66\"/><rect x=\"467.0\" y=\"65.3\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.61\"/><rect x=\"471.2\" y=\"68.4\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.74\"/><rect x=\"475.3\" y=\"71.5\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.50\"/><rect x=\"479.5\" y=\"74.5\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.68\"/><rect x=\"483.6\" y=\"77.5\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.60\"/><rect x=\"487.8\" y=\"80.6\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.69\"/><rect x=\"491.9\" y=\"83.7\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.75\"/><rect x=\"496.1\" y=\"86.7\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.48\"/><rect x=\"500.2\" y=\"89.8\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.49\"/><rect x=\"504.4\" y=\"92.8\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.66\"/><rect x=\"508.5\" y=\"95.8\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.74\"/><rect x=\"512.7\" y=\"98.9\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.51\"/><rect x=\"516.8\" y=\"101.9\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.51\"/><rect x=\"521.0\" y=\"105.0\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.53\"/><rect x=\"525.2\" y=\"108.0\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.46\"/><rect x=\"529.3\" y=\"111.1\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.71\"/><rect x=\"533.5\" y=\"114.1\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.63\"/><rect x=\"537.6\" y=\"117.2\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.61\"/><rect x=\"541.8\" y=\"120.3\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.65\"/><rect x=\"545.9\" y=\"123.3\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.67\"/><rect x=\"550.1\" y=\"126.3\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.47\"/><rect x=\"554.2\" y=\"129.4\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.62\"/><rect x=\"558.4\" y=\"132.4\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.47\"/><rect x=\"562.5\" y=\"135.5\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.64\"/><rect x=\"566.7\" y=\"138.6\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.74\"/><rect x=\"570.8\" y=\"141.6\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.62\"/><rect x=\"575.0\" y=\"144.6\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.57\"/><rect x=\"579.1\" y=\"147.7\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.46\"/><rect x=\"583.3\" y=\"150.8\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.48\"/><rect x=\"587.5\" y=\"153.8\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.70\"/><rect x=\"591.6\" y=\"156.8\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.63\"/><rect x=\"595.8\" y=\"159.9\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.64\"/><rect x=\"599.9\" y=\"162.9\" width=\"4.2\" height=\"3.6\" fill=\"#41699b\" opacity=\"0.52\"/><rect x=\"118\" y=\"200\" width=\"186\" height=\"100\" fill=\"#fbfaf6\" stroke=\"#ddd7c8\"/><text x=\"211\" y=\"314\" text-anchor=\"middle\" font-size=\"10\" font-weight=\"700\" fill=\"#4d565b\">清管器：更慢的一条斜带</text><rect x=\"188.9\" y=\"232.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"229.1\" y=\"263.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"203.9\" y=\"286.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"178.0\" y=\"277.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"150.7\" y=\"269.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"222.7\" y=\"280.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"209.8\" y=\"206.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"157.1\" y=\"268.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"227.9\" y=\"208.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"195.9\" y=\"233.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"136.3\" y=\"250.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"222.8\" y=\"236.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"234.6\" y=\"293.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"193.4\" y=\"285.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"239.9\" y=\"250.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"165.7\" y=\"269.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"186.3\" y=\"259.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"275.8\" y=\"221.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"186.4\" y=\"216.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"121.7\" y=\"288.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"248.7\" y=\"217.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"123.2\" y=\"236.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"131.5\" y=\"253.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"270.7\" y=\"271.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"159.4\" y=\"292.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"180.2\" y=\"248.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"192.0\" y=\"258.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"278.0\" y=\"205.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"279.9\" y=\"247.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"202.3\" y=\"279.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"289.1\" y=\"263.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"275.6\" y=\"276.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"138.8\" y=\"217.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"243.4\" y=\"290.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"182.2\" y=\"294.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"145.7\" y=\"225.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"227.0\" y=\"204.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"124.6\" y=\"247.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"234.4\" y=\"206.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"165.2\" y=\"250.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"203.2\" y=\"208.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"264.2\" y=\"209.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"208.9\" y=\"255.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"131.1\" y=\"236.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"171.7\" y=\"256.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"269.0\" y=\"255.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"237.1\" y=\"247.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"207.6\" y=\"244.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"170.2\" y=\"214.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"146.9\" y=\"259.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"177.7\" y=\"256.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"254.0\" y=\"274.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"210.1\" y=\"247.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"180.7\" y=\"254.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"246.7\" y=\"209.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"154.6\" y=\"241.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"147.0\" y=\"225.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"182.9\" y=\"263.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"219.6\" y=\"294.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"248.9\" y=\"272.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"283.5\" y=\"240.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"292.3\" y=\"252.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"263.5\" y=\"215.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"243.6\" y=\"272.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"182.1\" y=\"256.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"251.5\" y=\"209.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"161.9\" y=\"233.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"206.1\" y=\"276.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"190.3\" y=\"218.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"225.5\" y=\"248.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"169.6\" y=\"290.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"218.5\" y=\"263.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"276.3\" y=\"231.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"281.7\" y=\"280.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"259.6\" y=\"256.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"133.3\" y=\"287.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"136.5\" y=\"256.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"151.6\" y=\"265.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"280.8\" y=\"251.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"150.8\" y=\"252.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"213.9\" y=\"252.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"172.9\" y=\"225.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"126.8\" y=\"283.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"236.6\" y=\"291.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"207.7\" y=\"218.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"173.4\" y=\"279.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"277.0\" y=\"256.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"181.5\" y=\"226.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"294.3\" y=\"203.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"256.4\" y=\"234.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"133.9\" y=\"204.0\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.51\"/><rect x=\"135.5\" y=\"206.3\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.50\"/><rect x=\"137.1\" y=\"208.6\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.40\"/><rect x=\"138.8\" y=\"210.9\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.67\"/><rect x=\"140.4\" y=\"213.2\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.53\"/><rect x=\"142.0\" y=\"215.5\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.44\"/><rect x=\"143.7\" y=\"217.8\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.61\"/><rect x=\"145.3\" y=\"220.1\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.56\"/><rect x=\"146.9\" y=\"222.4\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.69\"/><rect x=\"148.6\" y=\"224.7\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.45\"/><rect x=\"150.2\" y=\"227.0\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.63\"/><rect x=\"151.8\" y=\"229.3\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.55\"/><rect x=\"153.4\" y=\"231.6\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.64\"/><rect x=\"155.1\" y=\"233.9\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.70\"/><rect x=\"156.7\" y=\"236.2\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.43\"/><rect x=\"158.3\" y=\"238.5\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.44\"/><rect x=\"160.0\" y=\"240.8\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.61\"/><rect x=\"161.6\" y=\"243.1\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.69\"/><rect x=\"163.2\" y=\"245.4\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.46\"/><rect x=\"164.9\" y=\"247.7\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.46\"/><rect x=\"166.5\" y=\"250.0\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.48\"/><rect x=\"168.1\" y=\"252.3\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.41\"/><rect x=\"169.8\" y=\"254.6\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.66\"/><rect x=\"171.4\" y=\"256.9\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.58\"/><rect x=\"173.0\" y=\"259.2\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.56\"/><rect x=\"174.7\" y=\"261.5\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.60\"/><rect x=\"176.3\" y=\"263.8\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.62\"/><rect x=\"177.9\" y=\"266.1\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.42\"/><rect x=\"179.6\" y=\"268.4\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.57\"/><rect x=\"181.2\" y=\"270.7\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.42\"/><rect x=\"182.8\" y=\"273.0\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.59\"/><rect x=\"184.4\" y=\"275.3\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.69\"/><rect x=\"186.1\" y=\"277.6\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.57\"/><rect x=\"187.7\" y=\"279.9\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.52\"/><rect x=\"189.3\" y=\"282.2\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.41\"/><rect x=\"191.0\" y=\"284.5\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.43\"/><rect x=\"192.6\" y=\"286.8\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.65\"/><rect x=\"194.2\" y=\"289.1\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.58\"/><rect x=\"195.9\" y=\"291.4\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.59\"/><rect x=\"197.5\" y=\"293.7\" width=\"7.1\" height=\"2.9\" fill=\"#767a2e\" opacity=\"0.47\"/><rect x=\"330\" y=\"200\" width=\"186\" height=\"100\" fill=\"#fbfaf6\" stroke=\"#ddd7c8\"/><text x=\"423\" y=\"314\" text-anchor=\"middle\" font-size=\"10\" font-weight=\"700\" fill=\"#4d565b\">调泵/调阀：整条线同时变化</text><rect x=\"400.9\" y=\"232.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"441.1\" y=\"263.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"415.9\" y=\"286.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"390.0\" y=\"277.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"362.7\" y=\"269.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"434.7\" y=\"280.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"421.8\" y=\"206.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"369.1\" y=\"268.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"439.9\" y=\"208.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"407.9\" y=\"233.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"348.3\" y=\"250.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"434.8\" y=\"236.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"446.6\" y=\"293.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"405.4\" y=\"285.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"451.9\" y=\"250.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"377.7\" y=\"269.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"398.3\" y=\"259.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"487.8\" y=\"221.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"398.4\" y=\"216.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"333.7\" y=\"288.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"460.7\" y=\"217.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"335.2\" y=\"236.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"343.5\" y=\"253.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"482.7\" y=\"271.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"371.4\" y=\"292.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"392.2\" y=\"248.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"404.0\" y=\"258.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"490.0\" y=\"205.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"491.9\" y=\"247.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"414.3\" y=\"279.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"501.1\" y=\"263.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"487.6\" y=\"276.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"350.8\" y=\"217.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"455.4\" y=\"290.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"394.2\" y=\"294.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"357.7\" y=\"225.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"439.0\" y=\"204.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"336.6\" y=\"247.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"446.4\" y=\"206.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"377.2\" y=\"250.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"415.2\" y=\"208.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"476.2\" y=\"209.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"420.9\" y=\"255.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"343.1\" y=\"236.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"383.7\" y=\"256.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"481.0\" y=\"255.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"449.1\" y=\"247.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"419.6\" y=\"244.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"382.2\" y=\"214.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"358.9\" y=\"259.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"389.7\" y=\"256.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"466.0\" y=\"274.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"422.1\" y=\"247.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"392.7\" y=\"254.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"458.7\" y=\"209.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"366.6\" y=\"241.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"359.0\" y=\"225.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"394.9\" y=\"263.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"431.6\" y=\"294.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"460.9\" y=\"272.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"495.5\" y=\"240.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"504.3\" y=\"252.1\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"475.5\" y=\"215.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"455.6\" y=\"272.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"394.1\" y=\"256.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"463.5\" y=\"209.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"373.9\" y=\"233.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"418.1\" y=\"276.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"402.3\" y=\"218.5\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"437.5\" y=\"248.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"381.6\" y=\"290.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"430.5\" y=\"263.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"488.3\" y=\"231.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"493.7\" y=\"280.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"471.6\" y=\"256.8\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"345.3\" y=\"287.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"348.5\" y=\"256.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"363.6\" y=\"265.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"492.8\" y=\"251.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"362.8\" y=\"252.3\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"425.9\" y=\"252.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"384.9\" y=\"225.6\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"338.8\" y=\"283.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"448.6\" y=\"291.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"419.7\" y=\"218.9\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"385.4\" y=\"279.0\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"489.0\" y=\"256.2\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"393.5\" y=\"226.4\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"506.3\" y=\"203.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"468.4\" y=\"234.7\" width=\"3\" height=\"3\" fill=\"#c9cdcf\" opacity=\".5\"/><rect x=\"334.0\" y=\"227.0\" width=\"178.0\" height=\"2.9\" fill=\"#7e5a8d\" opacity=\".55\"/><rect x=\"334.0\" y=\"229.3\" width=\"178.0\" height=\"2.9\" fill=\"#7e5a8d\" opacity=\".55\"/><rect x=\"334.0\" y=\"263.8\" width=\"178.0\" height=\"2.9\" fill=\"#7e5a8d\" opacity=\".55\"/><rect x=\"334.0\" y=\"266.1\" width=\"178.0\" height=\"2.9\" fill=\"#7e5a8d\" opacity=\".55\"/><g font-size=\"9.5\" fill=\"#79828a\"><text x=\"16\" y=\"196\">↓ 时间</text><text x=\"150\" y=\"192\" text-anchor=\"end\">距离 →</text></g><text x=\"16\" y=\"316\" font-size=\"10\" fill=\"#4d565b\">这五类在时空图上的区别，靠<b>规则写不出来</b>（阈值、斜率、能量都重叠），但对卷积网络来说就是五种<b>纹理</b>——把时空图当图像处理，是 DAS 泄漏监测现在的主流做法</text></svg></div><div class=\"figcap\"><b>图 2</b><span>一个 6 km 区段、60 s 窗口里的五种事件签名。<b>这是整个案例的核心图</b>：判别信息不在\"能量大小\"里（干扰普遍比泄漏大），而在<b>时空形态</b>里。所以必须把时空图当图像，而不是给每个测点设阈值。</span></div>"},{"no":3,"en":"DATA","title":"你需要准备什么","html":"<p>这个场景的数据困境很特殊：<b>干扰样本要多少有多少，真泄漏样本几乎没有</b>。一条管道一年可能一次真泄漏都没有，而沿线的施工、农机、车辆、风雨每天都在产生海量振动。</p><p>解法是两条腿：先在<b>真实采集的背景</b>上叠加<b>按物理模型合成的泄漏信号</b>，造出大量正样本；再用少量<b>站场放油试验</b>（真的开阀放油，安全可控）和真实历史事件做校准。</p><div class=\"figure\"><svg viewBox=\"0 0 640 200\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"样本构成\"><text x=\"16\" y=\"18\" font-size=\"10.5\" font-weight=\"700\" fill=\"#4d565b\">真泄漏太少，标签必须靠\"真的 + 仿的\"两条腿走路</text><g transform=\"translate(16,30)\"><rect x=\"0\" y=\"0\" width=\"560\" height=\"30\" rx=\"4\" fill=\"#f5f2ea\" stroke=\"#ddd7c8\"/><rect x=\"0\" y=\"0\" width=\"530\" height=\"30\" rx=\"4\" fill=\"#767a2e\" opacity=\".7\"/><text x=\"12\" y=\"20\" font-size=\"10\" fill=\"#fff\" font-weight=\"700\">干扰样本（施工/车辆/清管/调阀/风雨）　94%</text><rect x=\"0\" y=\"40\" width=\"560\" height=\"30\" rx=\"4\" fill=\"#f5f2ea\" stroke=\"#ddd7c8\"/><rect x=\"0\" y=\"40\" width=\"300\" height=\"30\" rx=\"4\" fill=\"#41699b\" opacity=\".65\"/><text x=\"12\" y=\"60\" font-size=\"10\" fill=\"#fff\" font-weight=\"700\">仿真泄漏（在真实背景上加合成泄漏信号）　53%</text><rect x=\"0\" y=\"80\" width=\"560\" height=\"30\" rx=\"4\" fill=\"#f5f2ea\" stroke=\"#ddd7c8\"/><rect x=\"0\" y=\"80\" width=\"14\" height=\"30\" rx=\"4\" fill=\"#b05a51\"/><text x=\"26\" y=\"100\" font-size=\"10\" fill=\"#b05a51\" font-weight=\"700\">真实泄漏（站场放油试验 + 历史真实事件）　2.5%</text></g><text x=\"16\" y=\"152\" font-size=\"10\" fill=\"#4d565b\">做法：先在<b>真实背景噪声</b>上叠加<b>按物理模型合成的泄漏信号</b>造出海量正样本，再用少量<b>真实放油试验</b>做最后的校准。</text><text x=\"16\" y=\"172\" font-size=\"10\" fill=\"#79828a\">关键前提：<tspan fill=\"#235f51\">合成用的背景必须是真采的</tspan>，否则模型见到的是干净背景，到现场被各种干扰淹掉。</text><text x=\"16\" y=\"190\" font-size=\"10\" fill=\"#b05a51\">反过来，只有真实泄漏、没有仿真，样本量撑不起深度学习——这是这个场景绕不开的取舍。</text></svg></div><div class=\"figcap\"><b>图 3</b><span>样本构成。<b>合成用的背景必须是真采的</b>，这是唯一不能省的一条——用干净背景训出来的模型，到现场会被各种干扰直接淹没。</span></div>"},{"no":4,"en":"DIFFICULTY","title":"技术难度与参考方向","html":"<p>两个难点叠在一起：<b>一是泄漏信号沿光缆衰减很快</b>，离泄漏点几公里外信噪比就接近 1；<b>二是干扰的幅度普遍比泄漏大</b>——挖掘机路过、清管器通过、农民犁地，哪一个都比一个小泄漏响。</p><p>所以任何基于\"能量阈值\"的方案都会失败。真正的判别信息在<b>时空形态</b>里：固定还是移动、连续还是间歇、局部还是全线同步。</p><div class=\"figure\"><svg viewBox=\"0 0 640 196\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"信号衰减与干扰幅度\"><text x=\"16\" y=\"18\" font-size=\"10.5\" font-weight=\"700\" fill=\"#4d565b\">难点一：泄漏信号沿光缆衰减很快，远了就看不见</text><rect x=\"30\" y=\"30\" width=\"420\" height=\"90\" fill=\"#fbfaf6\" stroke=\"#ece7da\"/><g stroke=\"#ece7da\"><path d=\"M30 75 h420\"/></g><path d=\"M30 40 C 90 46, 150 58, 210 72 C 270 86, 340 100, 450 108\" fill=\"none\" stroke=\"#b05a51\" stroke-width=\"2\"/><path d=\"M30 118 C 120 116, 220 112, 330 106 C 390 102, 420 100, 450 98\" fill=\"none\" stroke=\"#9ba3a9\" stroke-width=\"1.6\" stroke-dasharray=\"5 3\"/><text x=\"240\" y=\"62\" font-size=\"9.5\" fill=\"#b05a51\">泄漏振动能量（随距离指数衰减）</text><text x=\"240\" y=\"130\" font-size=\"9.5\" fill=\"#79828a\">沿线本底噪声（基本恒定）</text><g stroke=\"#b05a51\" stroke-dasharray=\"3 3\"><path d=\"M300 30 v90\"/></g><text x=\"300\" y=\"136\" text-anchor=\"middle\" font-size=\"9\" fill=\"#b05a51\">信噪比 ≈ 1：到这里就基本没救了</text><g font-size=\"9\" fill=\"#79828a\"><text x=\"30\" y=\"146\">泄漏点</text><text x=\"420\" y=\"146\" text-anchor=\"end\">沿光缆距离 →</text></g><text x=\"470\" y=\"30\" font-size=\"10\" font-weight=\"700\" fill=\"#4d565b\">难点二：干扰比泄漏大</text><g font-size=\"9.5\" transform=\"translate(470,42)\"><text x=\"0\" y=\"16\" fill=\"#4d565b\">机械施工</text><rect x=\"70\" y=\"6\" width=\"150\" height=\"14\" rx=\"3\" fill=\"#f5f2ea\"/><rect x=\"70\" y=\"6\" width=\"132\" height=\"14\" rx=\"3\" fill=\"#767a2e\" opacity=\".8\"/><text x=\"0\" y=\"40\" fill=\"#4d565b\">清管作业</text><rect x=\"70\" y=\"30\" width=\"150\" height=\"14\" rx=\"3\" fill=\"#f5f2ea\"/><rect x=\"70\" y=\"30\" width=\"96\" height=\"14\" rx=\"3\" fill=\"#767a2e\" opacity=\".65\"/><text x=\"0\" y=\"64\" fill=\"#4d565b\">调泵调阀</text><rect x=\"70\" y=\"54\" width=\"150\" height=\"14\" rx=\"3\" fill=\"#f5f2ea\"/><rect x=\"70\" y=\"54\" width=\"78\" height=\"14\" rx=\"3\" fill=\"#767a2e\" opacity=\".5\"/><text x=\"0\" y=\"88\" fill=\"#4d565b\">小泄漏</text><rect x=\"70\" y=\"78\" width=\"150\" height=\"14\" rx=\"3\" fill=\"#f5f2ea\"/><rect x=\"70\" y=\"78\" width=\"24\" height=\"14\" rx=\"3\" fill=\"#b05a51\"/></g><text x=\"16\" y=\"176\" font-size=\"10\" fill=\"#4d565b\">结论：<tspan font-weight=\"700\" fill=\"#235f51\">单看\"能量大小\"永远分不出来</tspan>——真正的判别信息在<b>时空形态</b>里（固定还是移动、连续还是间歇、局部还是全线同步）。</text><text x=\"16\" y=\"192\" font-size=\"9.5\" fill=\"#79828a\">这也是为什么这个场景必须用\"把时空图当图像\"的方法，而不是给每个通道设阈值。</text></svg></div><div class=\"figcap\"><b>图 4</b><span>衰减与干扰幅度。<b>右侧那组条状图是重点</b>：机械施工的振动能量是小泄漏的五倍。这意味着<b>任何\"响得厉害就报警\"的逻辑，报出来的都是施工</b>——这正是老系统被调度员关掉的原因。</span></div>"}]},"workflow":{"title":"案例：一条 186 km 原油管线的 DAS 泄漏监测上线","lead":["管线 186 km，穿越农田、公路、河道，沿线第三方施工频繁，历史上有 4 次打孔盗油。原 SCADA 系统只能发现 1.5% 以上的泄漏，且平均 4 小时才发现。","项目周期 9 个月。**前 4 个月在采集背景数据和做放油试验，建模只用了 2 个月，剩下 3 个月全在做虚警治理。**"],"stats":[{"label":"管线长度","value":"186 km"},{"label":"DAS 测点","value":"18,600 个"},{"label":"放油试验","value":"11 次"},{"label":"虚警","value":"0.3 次/天"}],"steps":[{"name":"光缆敷设与数据接入","role":"数据","do":"沿管道同沟敷设一芯通信光缆，每 10 m 一个测点、1 kHz 采样；只取振幅包络降到 100 Hz 存，数据量降到可承受范围。","effect":"186 km 全线覆盖，18,600 个测点。原始数据量 40 GB/天，包络后 6 GB/天。","trap":"不做包络直接存原始波形：40 GB/天的数据连传都传不回来，更别说训练。DAS 项目最先死在数据链路上。"},{"name":"采集真实背景 + 放油试验","role":"数据","do":"先连续采 3 个月各种工况下的背景振动（含施工、车辆、清管、风雨）；再在站场做 11 次受控放油试验，记录真泄漏信号。","effect":"拿到 2,400 小时真实背景 + 11 段真泄漏，为仿真提供了物理参数。","trap":"拿实验室/仿真背景去训。背景是\"干扰的总和\"，只有真采的才对；用干净背景，模型上线第一周虚警率就是 100%。","fig":"<svg viewBox=\"0 0 640 150\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"时空切片\"><text x=\"16\" y=\"18\" font-size=\"10.5\" font-weight=\"700\" fill=\"#4d565b\">先切段，再成图：整条光缆 → 31 张 6 km 的时空图</text><text x=\"16\" y=\"34\" font-size=\"9\" fill=\"#79828a\">18,600 个测点 × 1 kHz 采样的原始流，是不可能直接喂给网络的</text><rect x=\"16\" y=\"40\" width=\"292\" height=\"86\" fill=\"#fbfaf6\" stroke=\"#ddd7c8\"/><g transform=\"translate(24,46)\"><rect x=\"0\" y=\"0\" width=\"270\" height=\"34\" rx=\"4\" fill=\"#eef1f3\" stroke=\"#c9cdcf\"/><path d=\"M8.7 0 v34\" stroke=\"#dfe3e5\"/><path d=\"M17.4 0 v34\" stroke=\"#dfe3e5\"/><path d=\"M26.1 0 v34\" stroke=\"#dfe3e5\"/><path d=\"M34.8 0 v34\" stroke=\"#dfe3e5\"/><path d=\"M43.5 0 v34\" stroke=\"#dfe3e5\"/><path d=\"M52.3 0 v34\" stroke=\"#dfe3e5\"/><path d=\"M61.0 0 v34\" stroke=\"#dfe3e5\"/><path d=\"M69.7 0 v34\" stroke=\"#dfe3e5\"/><path d=\"M78.4 0 v34\" stroke=\"#dfe3e5\"/><path d=\"M87.1 0 v34\" stroke=\"#dfe3e5\"/><path d=\"M95.8 0 v34\" stroke=\"#dfe3e5\"/><path d=\"M104.5 0 v34\" stroke=\"#dfe3e5\"/><path d=\"M113.2 0 v34\" stroke=\"#dfe3e5\"/><path d=\"M121.9 0 v34\" stroke=\"#dfe3e5\"/><path d=\"M130.6 0 v34\" stroke=\"#dfe3e5\"/><path d=\"M139.4 0 v34\" stroke=\"#dfe3e5\"/><path d=\"M148.1 0 v34\" stroke=\"#dfe3e5\"/><path d=\"M156.8 0 v34\" stroke=\"#dfe3e5\"/><path d=\"M165.5 0 v34\" stroke=\"#dfe3e5\"/><path d=\"M174.2 0 v34\" stroke=\"#dfe3e5\"/><path d=\"M182.9 0 v34\" stroke=\"#dfe3e5\"/><path d=\"M191.6 0 v34\" stroke=\"#dfe3e5\"/><path d=\"M200.3 0 v34\" stroke=\"#dfe3e5\"/><path d=\"M209.0 0 v34\" stroke=\"#dfe3e5\"/><path d=\"M217.7 0 v34\" stroke=\"#dfe3e5\"/><path d=\"M226.5 0 v34\" stroke=\"#dfe3e5\"/><path d=\"M235.2 0 v34\" stroke=\"#dfe3e5\"/><path d=\"M243.9 0 v34\" stroke=\"#dfe3e5\"/><path d=\"M252.6 0 v34\" stroke=\"#dfe3e5\"/><path d=\"M261.3 0 v34\" stroke=\"#dfe3e5\"/><rect x=\"104.5\" y=\"-3\" width=\"8.7\" height=\"40\" fill=\"#b05a51\" opacity=\".65\" rx=\"2\"/><text x=\"0\" y=\"52\" font-size=\"8.5\" fill=\"#79828a\">0 km</text><text x=\"270\" y=\"52\" text-anchor=\"end\" font-size=\"8.5\" fill=\"#79828a\">186 km</text><g stroke=\"#b05a51\" stroke-width=\"1.2\" fill=\"none\"><path d=\"M108.9 46 v14\"/></g><text x=\"108.9\" y=\"64\" text-anchor=\"middle\" font-size=\"8.5\" fill=\"#b05a51\">当前区段 6 km</text></g><path d=\"M316 84 h26\" fill=\"none\" stroke=\"#9ba3a9\" stroke-width=\"1.4\" marker-end=\"url(#t1a2)\"/><rect x=\"350\" y=\"40\" width=\"274\" height=\"86\" fill=\"#fbfaf6\" stroke=\"#ddd7c8\"/><g transform=\"translate(360,50)\"><rect x=\"0\" y=\"0\" width=\"160\" height=\"66\" fill=\"#fbfaf6\" stroke=\"#ece7da\"/><rect x=\"62\" y=\"3\" width=\"14\" height=\"60\" fill=\"#b05a51\" opacity=\".6\"/><text x=\"0\" y=\"80\" font-size=\"8.5\" fill=\"#79828a\">← 6 km（100 列）→</text><text x=\"166\" y=\"34\" font-size=\"8.5\" fill=\"#79828a\">↓60 s</text><text x=\"166\" y=\"46\" font-size=\"8.5\" fill=\"#79828a\">（120 行）</text></g><text x=\"16\" y=\"140\" font-size=\"9.5\" fill=\"#4d565b\">每个区段把<b>空间上每 6 个测点合并、时间上每 0.5 s 取均方根</b>，就压成一张 <b>100 × 120</b> 的图——这正是 2D 卷积能直接吃的尺寸。</text><defs><marker id=\"t1a2\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#9ba3a9\"/></marker></defs></svg>"},{"name":"时空成图与分类模型","role":"模型","do":"把 186 km 切成 31 个 6 km 区段，每区段压成 100 × 120 的时空图；先在图上做 τ–p（Radon）变换量出事件的\"视速度\"，把\"移动的干扰\"和\"固定的泄漏\"在变换域里分开，再进 2D 卷积网络分六类。","effect":"六类分类准确率 94%，其中泄漏类召回 96%、精确率 88%；τ–p 给出的视速度直接把车辆、清管器和泄漏分开。","trap":"直接端到端喂原始流：网络把大部分容量花在学习\"背景长什么样\"，迁移到别的管线就崩。先加 τ–p 等于把物理先验塞进模型前面。","fig":"<svg viewBox=\"0 0 640 184\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"Radon 域判别\"><text x=\"16\" y=\"16\" font-size=\"10.5\" font-weight=\"700\" fill=\"#4d565b\">τ–p（Radon）变换：把\"斜的\"变成\"点\"，顺手量出事件的视速度</text><g transform=\"translate(20,26)\"><rect x=\"0\" y=\"0\" width=\"180\" height=\"120\" fill=\"#fbfaf6\" stroke=\"#ddd7c8\"/><rect x=\"76\" y=\"4\" width=\"14\" height=\"112\" fill=\"#b05a51\" opacity=\".6\"/><text x=\"90\" y=\"132\" text-anchor=\"middle\" font-size=\"9\" fill=\"#4d565b\">竖直信号（泄漏）</text><g stroke=\"#ece7da\"><path d=\"M0 60 h180\"/></g></g><g transform=\"translate(230,26)\"><rect x=\"0\" y=\"0\" width=\"180\" height=\"120\" fill=\"#fbfaf6\" stroke=\"#ddd7c8\"/><circle cx=\"90\" cy=\"60\" r=\"7\" fill=\"#b05a51\"/><text x=\"90\" y=\"132\" text-anchor=\"middle\" font-size=\"9\" fill=\"#4d565b\">τ–p 域：竖的落在 p = 0，视速度 0 m/s</text><text x=\"90\" y=\"144\" text-anchor=\"middle\" font-size=\"8.5\" fill=\"#8e5229\">＝ 静止 → 泄漏 / 施工</text></g><g transform=\"translate(440,26)\"><rect x=\"0\" y=\"0\" width=\"180\" height=\"120\" fill=\"#fbfaf6\" stroke=\"#ddd7c8\"/><path d=\"M20 8 L160 112\" stroke=\"#41699b\" stroke-width=\"3\" opacity=\".7\"/><text x=\"90\" y=\"132\" text-anchor=\"middle\" font-size=\"9\" fill=\"#4d565b\">斜的落在大 p 处，视速度 16.7 m/s</text><text x=\"90\" y=\"144\" text-anchor=\"middle\" font-size=\"8.5\" fill=\"#31527a\">＝ 60 km/h → 车辆（清管器只有 10 m/s）</text><circle cx=\"150\" cy=\"105\" r=\"6\" fill=\"#41699b\"/></g><text x=\"16\" y=\"176\" font-size=\"10\" fill=\"#79828a\">工程上常用的做法：<tspan fill=\"#235f51\">先做 τ–p 把\"移动的干扰\"和\"固定的泄漏\"在变换域里分开，再进网络</tspan>——等于把物理先验塞进模型前面，比让网络从零学要稳得多。</text></svg>"},{"name":"负压波定位与多源融合","role":"工程","do":"DAS 判定\"像泄漏\"后，立刻去查首末站压力曲线，用负压波算位置；同时核对该时段 SCADA 的进出流量差。三证齐全才报。","effect":"单 DAS 的虚警率 3 次/天，三源融合后 0.3 次/天；定位中位误差 ±120 m。","trap":"只靠 DAS 就报警。DAS 能说\"这里在响\"，但说不准\"是不是在漏\"；虚警率压不到能用的水平，调度员立刻把它关了。"},{"name":"调度确认与闭环","role":"人工","do":"报警推送到调度台，必须由调度员确认后才派车；每次报警都要回执（真泄漏/施工/清管/其他），回执进下一轮训练。","effect":"三轮迭代后虚警降到 0.3 次/天；上线 14 个月抓到 2 次真实打孔盗油，均在 15 分钟内报警。","trap":"自动派车。派人出车的成本是实的，误报一次就消耗一次信任——这个场景交付的是\"高度可疑\"，不是\"确认泄漏\"。","fig":"<svg viewBox=\"0 0 640 152\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"报警与复核闭环\"><g font-size=\"10\" font-weight=\"700\" text-anchor=\"middle\"><rect x=\"16\" y=\"30\" width=\"120\" height=\"46\" rx=\"8\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\"/><text x=\"76\" y=\"50\" fill=\"#235f51\">DAS 判定</text><text x=\"76\" y=\"68\" font-size=\"9\" font-weight=\"400\" fill=\"#79828a\">是不是泄漏</text><rect x=\"166\" y=\"30\" width=\"120\" height=\"46\" rx=\"8\" fill=\"#e7eef9\" stroke=\"#41699b\"/><text x=\"226\" y=\"50\" fill=\"#31527a\">负压波定位</text><text x=\"226\" y=\"68\" font-size=\"9\" font-weight=\"400\" fill=\"#79828a\">漏在哪</text><rect x=\"316\" y=\"30\" width=\"120\" height=\"46\" rx=\"8\" fill=\"#f8ecdf\" stroke=\"#b26a39\"/><text x=\"376\" y=\"50\" fill=\"#8e5229\">SCADA 核对</text><text x=\"376\" y=\"68\" font-size=\"9\" font-weight=\"400\" fill=\"#79828a\">流量是否失衡</text><rect x=\"466\" y=\"30\" width=\"158\" height=\"46\" rx=\"8\" fill=\"#f1f1dd\" stroke=\"#767a2e\"/><text x=\"545\" y=\"50\" fill=\"#5d6022\">调度员确认</text><text x=\"545\" y=\"68\" font-size=\"9\" font-weight=\"400\" fill=\"#79828a\">派人去现场</text></g><g stroke=\"#9ba3a9\" stroke-width=\"1.4\" fill=\"none\" marker-end=\"url(#t1a3)\"><path d=\"M136 53 h26\"/><path d=\"M286 53 h26\"/><path d=\"M436 53 h26\"/></g><text x=\"320\" y=\"106\" text-anchor=\"middle\" font-size=\"10\" fill=\"#4d565b\">三套独立证据都对上了才报：<tspan font-weight=\"700\" fill=\"#235f51\">DAS 说\"像\"、负压波说\"在哪\"、SCADA 说\"流量确实少了\"</tspan></text><text x=\"320\" y=\"126\" text-anchor=\"middle\" font-size=\"9.5\" fill=\"#79828a\">只靠 DAS 报警，虚警率压不到能用的水平；三个都对上，虚警率能降到每天 0.3 次以下</text><text x=\"320\" y=\"144\" text-anchor=\"middle\" font-size=\"9.5\" fill=\"#b05a51\">这个环节机器替代不了：<tspan font-weight=\"700\">最后一步必须是人拍板</tspan>，因为派人出车的成本是实的</text><defs><marker id=\"t1a3\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#9ba3a9\"/></marker></defs></svg>"}],"metrics":{"title":"怎么算「做对了」","html":"<p>这个场景最常见的汇报陷阱是<b>只报检出率</b>。把判定阈值松到满天报警，检出率一样能到 96%——而这样的系统上线三天就会被关掉。</p><div class=\"figure\"><svg viewBox=\"0 0 640 168\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"三个验收指标\"><g font-size=\"10.5\"><text x=\"16\" y=\"28\" fill=\"#b05a51\" font-weight=\"700\">✗ 检出率 96%</text><text x=\"200\" y=\"28\" font-size=\"9.5\" fill=\"#79828a\">不说虚警率的检出率，等于没说——把阈值松到满天报警，检出率也能到 96%</text><text x=\"16\" y=\"64\" fill=\"#4d565b\">小泄漏检出率（≤1%）</text><rect x=\"230\" y=\"52\" width=\"260\" height=\"18\" rx=\"4\" fill=\"#f5f2ea\"/><rect x=\"230\" y=\"52\" width=\"192\" height=\"18\" rx=\"4\" fill=\"#41699b\"/><text x=\"500\" y=\"66\" fill=\"#31527a\" font-weight=\"700\">74%</text><text x=\"540\" y=\"66\" font-size=\"9\" fill=\"#79828a\">越大越好，但最难</text><text x=\"16\" y=\"100\" fill=\"#4d565b\">每公里每天虚警</text><rect x=\"230\" y=\"88\" width=\"260\" height=\"18\" rx=\"4\" fill=\"#f5f2ea\"/><rect x=\"230\" y=\"88\" width=\"52\" height=\"18\" rx=\"4\" fill=\"#2f7d6b\"/><text x=\"500\" y=\"102\" fill=\"#235f51\" font-weight=\"700\">0.02</text><text x=\"540\" y=\"102\" font-size=\"9\" fill=\"#79828a\">这才是调度员关心的</text><text x=\"16\" y=\"136\" fill=\"#4d565b\">定位误差（中位）</text><rect x=\"230\" y=\"124\" width=\"260\" height=\"18\" rx=\"4\" fill=\"#f5f2ea\"/><rect x=\"230\" y=\"124\" width=\"72\" height=\"18\" rx=\"4\" fill=\"#b26a39\"/><text x=\"500\" y=\"138\" fill=\"#8e5229\" font-weight=\"700\">±120 m</text><text x=\"540\" y=\"138\" font-size=\"9\" fill=\"#79828a\">影响挖坑位置</text></g><text x=\"16\" y=\"162\" font-size=\"9.5\" fill=\"#79828a\">三个必须一起汇报：<tspan fill=\"#235f51\">只报检出率的，一定会把阈值松到没人理它为止</tspan></text></svg></div><p style=\"margin-top:8px\">正确的验收是三个数：<b>小泄漏（≤1%）检出率、每公里每天虚警次数、定位误差</b>。第二个最重要也最常被省略——<b>调度员的耐心是这个系统真正的资源上限</b>。</p>"},"fails":[{"name":"只报检出率","why":"把阈值松到满天报警，检出率也能到 96%。必须同时报每公里每天虚警次数——这个数决定系统能不能活下来。"},{"name":"用仿真背景训练","why":"背景是干扰的总和，只有真采的才对。用干净背景训的模型上线第一周虚警率 100%。"},{"name":"只靠 DAS 报警","why":"DAS 能说\"这里在响\"，说不准\"是不是在漏\"。必须与负压波定位、SCADA 流量平衡三源融合，虚警才能从 3 次/天降到 0.3 次/天。"},{"name":"直接存原始 DAS 波形","why":"40 GB/天的数据连传都传不回来。必须先取振幅包络降采样，DAS 项目最先死在数据链路上。"},{"name":"按 F1 自动选阈值","why":"F1 会给出激进阈值，虚警翻十倍。阈值要按\"调度员一天能忍几次出车\"来定，业务代价不在 F1 里。"}]},"demo":{"mode":"module","js":"demo/demo.js","label":"可运行示范","intro":"图上是一段 6 km 光缆、60 s 的时空瀑布图。选一种事件，看它的<b>形状签名</b>：瀑布图上是什么形状、<b>τ–p 谱</b>量出它在以多少 m/s 移动、模型给出六类概率；再看首末站压力波算出的漏点位置，最后看三源融合的结论。把泄漏开小、噪声开大，看负压波和 DAS 谁先失灵。","height":1150}}};

  var __mod = { exports: {} };
  (function (module, exports) {
/* 管道泄漏智能检测 · 交互示范
   一条 60 km 输油管道，DAS 光纤把它切成 10 个 6 km 区段逐段扫描；
   同一段光纤上，泄漏 / 第三方施工 / 车辆 / 清管器 / 调阀 五种事件在
   "时空瀑布图"上形状完全不同。示范里用 τ–p（Radon）变换量出事件的视速度，
   用首末站压力波的到达时差定位，最后做三源融合。纯前端即时计算。 */
module.exports = {
  mount: function (root, api) {
    var NX = 100, NT = 120;          /* 100 个空间测点 × 120 帧 */
    var SEGKM = 6, MPPX = SEGKM * 1000 / NX;   /* 60 m/测点 */
    var FSEC = 0.5;                  /* 0.5 s/帧，共 60 s */
    var PPF = FSEC / MPPX;           /* (m/s) → (测点/帧) 换算系数 1/120 */
    var SEG0 = 12;                   /* 本段起点里程 12 km（第 3 段：12–18 km） */
    var L = 60;                      /* 全线长度 km */
    var VW = 1.0;                    /* 负压波传播速度 km/s ≈ 1000 m/s */
    var V_VEH = 60 / 3.6;            /* 伴行路上车辆 60 km/h ≈ 16.7 m/s */
    var V_PIG = 10;                  /* 气体管道清管器 ≈ 10 m/s */
    var JADE = '#2f7d6b', CLAY = '#b26a39', BAD = '#b05a51', OPT = '#41699b', OLIVE = '#767a2e', PURPLE = '#7e5a8d';
    var KINDS = ['leak', 'cons', 'veh', 'pig', 'valve', 'none'];
    var NAMES = ['泄漏', '第三方施工', '车辆经过', '清管器', '调泵/调阀', '无事件'];
    var COLORS = [BAD, CLAY, OPT, OLIVE, PURPLE, '#9ba3a9'];

    function lcg(seed) {
      var s = seed >>> 0;
      return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    }
    function mean(a) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return s / a.length; }
    function stdv(a) { var m = mean(a), s = 0; for (var i = 0; i < a.length; i++) s += (a[i] - m) * (a[i] - m); return Math.sqrt(s / a.length); }
    function clamp01(v) { return v < 0 ? 0 : (v > 1 ? 1 : v); }

    /* τ–p 候选斜率（测点/帧），换算成视速度 = sl / PPF (m/s) */
    var RS = [0, 0.0333, -0.0333, 0.0667, -0.0667, 0.0833, -0.0833, 0.1, -0.1,
      0.1333, -0.1333, 0.2, -0.2, 0.3, -0.3, 0.45, -0.45];

    /* ---------- 合成 DAS 时空数据 ---------- */
    function gen(kind, px, amp, noise, seed) {
      var r = lcg(seed), d = new Float32Array(NX * NT), x, t, i, cx;
      /* 本底：三个固定的"天然吵点"——伴行路交叉口、泵站、河流穿越 */
      var hot = [];
      for (var h = 0; h < 3; h++) hot.push(Math.floor(r() * NX));
      for (x = 0; x < NX; x++) {
        var base = 0.25 + 0.1 * r();
        for (var hi = 0; hi < hot.length; hi++) if (Math.abs(x - hot[hi]) < 3) base += 0.14;
        for (t = 0; t < NT; t++) d[x * NT + t] = base * (0.6 + 0.8 * r()) * noise;
      }
      if (kind === 'leak') {
        /* 固定在一点、连续不断：喷流噪声 */
        for (t = 0; t < NT; t++) for (i = -2; i <= 2; i++) {
          cx = px + i; if (cx < 0 || cx >= NX) continue;
          d[cx * NT + t] += amp * Math.exp(-(i * i) / 1.6) * (0.75 + 0.5 * r());
        }
      } else if (kind === 'cons') {
        /* 固定在一点、间歇：挖机一斗一斗地挖 */
        for (t = 0; t < NT; t++) {
          if (r() > 0.36) continue;
          for (i = -1; i <= 1; i++) {
            cx = px + i; if (cx < 0 || cx >= NX) continue;
            d[cx * NT + t] += amp * 1.7 * Math.exp(-(i * i) / 1.2) * (0.5 + 1.2 * r());
          }
        }
      } else if (kind === 'veh') {
        /* 沿伴行路移动：一条陡的斜线 */
        for (t = 0; t < NT; t++) {
          cx = Math.round(px - V_VEH * PPF * NT / 2 + t * V_VEH * PPF);
          if (cx < 0 || cx >= NX) continue;
          for (i = -1; i <= 1; i++) {
            if (cx + i < 0 || cx + i >= NX) continue;
            d[(cx + i) * NT + t] += amp * 1.3 * (i === 0 ? 1 : 0.5) * (0.7 + 0.6 * r());
          }
        }
      } else if (kind === 'pig') {
        /* 在管内缓慢移动：一条缓的斜带 */
        for (t = 0; t < NT; t++) {
          cx = Math.round(px - V_PIG * PPF * NT / 2 + t * V_PIG * PPF);
          if (cx < 0 || cx >= NX) continue;
          for (i = -2; i <= 2; i++) {
            if (cx + i < 0 || cx + i >= NX) continue;
            d[(cx + i) * NT + t] += amp * 1.1 * Math.exp(-(i * i) / 2.2) * (0.7 + 0.6 * r());
          }
        }
      } else if (kind === 'valve') {
        /* 全线同时：几道横贯全图的横线 */
        [18, 19, 62, 63].forEach(function (tv) {
          for (x = 0; x < NX; x++) d[x * NT + tv] += amp * 1.5 * (0.8 + 0.5 * r());
        });
      }
      return d;
    }

    /* ---------- 特征提取：全部用比值，与绝对幅度、噪声水平无关 ---------- */
    function feats(d) {
      var colE = new Float32Array(NX), rowE = new Float32Array(NT), gm = 0, x, t;
      for (x = 0; x < NX; x++) {
        var s = 0;
        for (t = 0; t < NT; t++) s += d[x * NT + t];
        colE[x] = s / NT; gm += s;
      }
      gm /= (NX * NT);
      for (t = 0; t < NT; t++) {
        var s2 = 0;
        for (x = 0; x < NX; x++) s2 += d[x * NT + t];
        rowE[t] = s2 / NX;
      }
      var bx = 0;
      for (x = 1; x < NX; x++) if (colE[x] > colE[bx]) bx = x;
      var sorted = [];
      for (x = 0; x < NX; x++) sorted.push(colE[x]);
      sorted.sort(function (a, b) { return a - b; });
      var med = sorted[NX >> 1] || 1e-6;
      var seq = [];
      for (t = 0; t < NT; t++) seq.push(d[bx * NT + t]);
      var m = mean(seq), sd = stdv(seq) || 0.001;
      var rMax = 0;
      for (t = 0; t < NT; t++) if (rowE[t] > rMax) rMax = rowE[t];
      /* τ–p（Radon）扫描：沿各候选斜率把能量叠起来，看哪一条最突出 */
      var acc = new Float32Array(NX), spec = [], bestS = 0, bestV = 0, p0 = 0;
      for (var si = 0; si < RS.length; si++) {
        var sl = RS[si];
        for (x = 0; x < NX; x++) acc[x] = 0;
        for (t = 0; t < NT; t++) {
          var sh = sl * (t - NT / 2);
          for (x = 0; x < NX; x++) {
            var c2 = Math.round(x + sh);
            if (c2 < 0 || c2 >= NX) continue;
            acc[x] += d[c2 * NT + t];
          }
        }
        var mv = 0;
        for (x = 0; x < NX; x++) if (acc[x] > mv) mv = acc[x];
        mv /= NT;
        spec.push({ v: sl / PPF, val: mv });
        if (sl === 0) p0 = mv;
        if (mv > bestV) { bestV = mv; bestS = sl; }
      }
      return {
        bx: bx,
        ctr: colE[bx] / med,            /* 峰值反差：有没有一个特别响的位置 */
        cv: sd / (m + 0.02),            /* 起伏度：那一列是稳着响还是一阵一阵 */
        sync: rMax / (gm || 1),         /* 全线同步：整条线是不是同时被扰动 */
        movr: bestV / (p0 + 1e-6),      /* 移动增益：斜着叠比竖着叠清楚多少 */
        v: bestS / PPF,                 /* 视速度 m/s */
        spec: spec
      };
    }

    /* ---------- 六类打分 → softmax 概率 ---------- */
    function classify(f) {
      var cs = clamp01((f.ctr - 1.35) / 3.0);
      var stdy = clamp01(1 - f.cv / 0.6);
      var bur = clamp01(f.cv / 0.9);
      var mov = clamp01((f.movr - 1) / 0.8);
      var sy = clamp01((f.sync - 1) / 3.0);
      var vehK = Math.exp(-Math.pow((Math.abs(f.v) - 16.7) / 5.5, 2));
      var pigK = Math.exp(-Math.pow((Math.abs(f.v) - 10) / 4.5, 2));
      var mv = vehK + pigK;
      var sc = [
        3.6 * cs * stdy - 2.2 * bur - 1.6 * mov - 1.2 * sy - 1.4 * mv,   /* 泄漏 */
        3.2 * cs * bur - 2.0 * stdy - 1.6 * mov - 1.2 * sy - 1.4 * mv,   /* 施工 */
        3.0 * vehK + 1.6 * mov - 1.5 * cs * stdy - 1.0 * sy - 1.2 * bur, /* 车辆 */
        3.0 * pigK + 1.6 * mov - 1.5 * cs * stdy - 1.0 * sy - 1.2 * bur, /* 清管 */
        3.4 * sy - 1.2 * cs - 1.0 * stdy - 1.0 * mov,                    /* 调阀 */
        1.6 - 4.5 * cs - 2.0 * mov - 1.8 * sy - 1.0 * stdy               /* 无事件 */
      ];
      var mx = -1e9, i;
      for (i = 0; i < sc.length; i++) if (sc[i] > mx) mx = sc[i];
      var ex = [], sum = 0;
      for (i = 0; i < sc.length; i++) { var e = Math.exp((sc[i] - mx) * 1.05); ex.push(e); sum += e; }
      return ex.map(function (v) { return v / sum; });
    }

    /* ---------- 负压波：首末站压力 + 到达时刻差定位 ---------- */
    function pressures(kind, xkm, amp, noise, seed) {
      var r = lcg(seed + 7), p1 = [], p2 = [], i;
      var t0 = 10;
      var a1 = t0 + xkm / (VW * FSEC), a2 = t0 + (L - xkm) / (VW * FSEC);
      var drop = (kind === 'leak') ? amp * 0.55 : (kind === 'valve' ? amp * 0.42 : 0);
      var s1 = 0, s2 = 0;
      for (i = 0; i < NT; i++) {
        s1 = s1 * 0.9 + (r() - 0.5) * 0.03 * noise;
        s2 = s2 * 0.9 + (r() - 0.5) * 0.03 * noise;
        var d1 = i > a1 ? drop * (1 - Math.exp(-(i - a1) * 0.07)) : 0;
        var d2 = i > a2 ? drop * (1 - Math.exp(-(i - a2) * 0.07)) : 0;
        p1.push(6 - d1 + s1 + (r() - 0.5) * 0.012 * noise);
        p2.push(6 - d2 + s2 + (r() - 0.5) * 0.012 * noise);
      }
      return { p1: p1, p2: p2, a1: a1, a2: a2, drop: drop };
    }
    /* 到达时刻拾取：滑动平均后看下降率，阈值随噪声抬高 */
    function arrive(p, noise, seed) {
      var r = lcg(seed + 31), sm = [], i, j, k;
      for (i = 0; i < p.length; i++) {
        var s = 0, n = 0;
        for (k = -3; k <= 3; k++) { if (i + k >= 0 && i + k < p.length) { s += p[i + k]; n++; } }
        sm.push(s / n);
      }
      var thr = -(0.0018 + 0.011 * noise);
      for (j = 8; j < p.length; j++) {
        var dv1 = (sm[j] - sm[j - 4]) / 4, dv2 = (sm[j - 1] - sm[j - 5]) / 4;
        if (dv1 < thr && dv2 < thr) {
          return j - 2 + Math.round((r() - 0.5) * 2 * (1 + noise * 4));
        }
      }
      return null;
    }

    /* ---------- 瀑布图 ---------- */
    function waterfall(cv, d) {
      var ctx = cv.getContext('2d');
      var img = ctx.createImageData(NX, NT), p = img.data, k = 0;
      for (var t = 0; t < NT; t++) {
        for (var x = 0; x < NX; x++) {
          var v = d[x * NT + t] / 0.85;
          if (v > 1) v = 1; if (v < 0) v = 0;
          var rr, gg, bb;
          if (v < 0.45) { var a = v / 0.45; rr = 244 - 4 * a; gg = 242 - 14 * a; bb = 236 - 22 * a; }
          else { var b = (v - 0.45) / 0.55; rr = 240 - 64 * b; gg = 228 - 106 * b; bb = 214 - 125 * b; }
          p[k] = rr | 0; p[k + 1] = gg | 0; p[k + 2] = bb | 0; p[k + 3] = 255;
          k += 4;
        }
      }
      ctx.putImageData(img, 0, 0);
    }

    /* ---------------- 界面 ---------------- */
    root.innerHTML =
      '<div class="demo">' +
      '<div class="demo-head"><span class="kicker">INTERACTIVE · DAS + 负压波 + SCADA 三源融合</span>' +
      '<h3>同一段光纤，五种事件五种形状</h3>' +
      '<p>图是<b>第 3 段（12–18 km）</b>这段 6 km 光缆的时空瀑布图：横轴 = 沿管道距离，纵轴 = 时间（向下增长，共 60 s），' +
      '颜色 = 振动能量。整条 60 km 管线被切成 10 个这样的区段，DAS 模型逐段扫描。' +
      '泄漏是固定位置的一条竖带、第三方施工是同位置的间歇闪烁、车辆是一条陡斜线、' +
      '清管器是更缓的斜带、调阀是整条线同时被扰动。</p></div>' +

      '<div class="ctl-row">' +
      '<select id="c9-k" style="font-size:12px;padding:4px 8px;border:1px solid var(--line-2,#ddd7c8);border-radius:6px">' +
      KINDS.map(function (v, i) { return '<option value="' + v + '">' + NAMES[i] + '</option>'; }).join('') + '</select>' +
      '<div class="ctl"><label>段内位置 <output id="c9-op">3.0 km</output></label><input type="range" id="c9-p" min="0.5" max="5.5" step="0.1" value="3"></div>' +
      '<div class="ctl"><label>事件强度 <output id="c9-oa">0.60</output></label><input type="range" id="c9-a" min="0.08" max="1.2" step="0.04" value="0.6"></div>' +
      '<div class="ctl"><label>背景噪声 <output id="c9-on">0.30</output></label><input type="range" id="c9-n" min="0.1" max="1.1" step="0.05" value="0.3"></div>' +
      '<button class="btn-x ghost" id="c9-rand">🎲 换一段光纤</button>' +
      '</div>' +

      '<div class="card-x"><h4>DAS 时空瀑布图（6 km × 60 s）</h4>' +
      '<canvas id="c9-wf" width="100" height="120"></canvas>' +
      '<div class="legend"><span><i style="background:#f4f2ec"></i>本底</span>' +
      '<span><i style="background:#e8b9a4"></i>中等振动</span>' +
      '<span><i style="background:' + BAD + '"></i>强振动</span>' +
      '<span>↓ 时间 0→60 s　·　横轴 → 12→18 km</span></div></div>' +

      '<div class="grid2" style="margin-top:12px">' +
      '<div class="card-x"><h4>DAS 形态识别（六类概率）</h4><div id="c9-probs"></div>' +
      '<div id="c9-das" style="margin-top:10px;font-size:11.5px"></div></div>' +
      '<div class="card-x"><h4>τ–p 视速度谱（Radon）</h4>' +
      '<svg id="c9-rs" viewBox="0 0 420 132" role="img" aria-label="视速度谱"></svg></div>' +
      '</div>' +

      '<div class="card-x" style="margin-top:12px"><h4>负压波定位：首末站压力与到达时差</h4>' +
      '<svg id="c9-pr" viewBox="0 0 420 168" role="img" aria-label="压力曲线与定位"></svg></div>' +

      '<div class="readouts">' +
      '<div class="ro"><span class="k">DAS 判定</span><b id="c9-v1">—</b></div>' +
      '<div class="ro"><span class="k">判定置信度</span><b id="c9-v2">—</b></div>' +
      '<div class="ro"><span class="k">τ–p 视速度</span><b id="c9-v3">—</b></div>' +
      '<div class="ro"><span class="k">负压波定位</span><b id="c9-v4">—</b></div>' +
      '<div class="ro"><span class="k">定位误差</span><b id="c9-v5">—</b></div>' +
      '<div class="ro"><span class="k">SCADA 需时</span><b id="c9-v6">—</b></div>' +
      '<div class="ro"><span class="k">三源融合结论</span><b id="c9-v7">—</b></div>' +
      '</div>' +

      '<p class="note" id="c9-note"></p>' +
      '</div>';

    var $ = function (id) { return root.querySelector('#' + id); };
    /* 支持 URL 预设：?dk=veh&dp=2.4&da=0.6&dn=0.3 （仅影响初始选择，便于定点讲解） */
    try {
      var q = (typeof location !== 'undefined' && location.search) || '';
      function qp(k) { var m = q.match(new RegExp('[?&]' + k + '=([^&]+)')); return m ? decodeURIComponent(m[1]) : null; }
      var qk = qp('dk'), qpp = qp('dp'), qa = qp('da'), qn = qp('dn');
      if (qk && KINDS.indexOf(qk) >= 0) $('c9-k').value = qk;
      if (qpp) $('c9-p').value = qpp;
      if (qa) $('c9-a').value = qa;
      if (qn) $('c9-n').value = qn;
    } catch (e) { }
    var wf = $('c9-wf');
    wf.style.width = '100%'; wf.style.height = '300px'; wf.style.display = 'block';
    wf.style.border = '1px solid var(--line,#e9e4d8)'; wf.style.borderRadius = '9px';
    var SEED = 88007;

    function draw() {
      var kind = $('c9-k').value, pos = +$('c9-p').value,
          amp = +$('c9-a').value, noise = +$('c9-n').value;
      $('c9-op').textContent = pos.toFixed(1) + ' km';
      $('c9-oa').textContent = amp.toFixed(2);
      $('c9-on').textContent = noise.toFixed(2);
      var px = Math.round(pos / SEGKM * NX), xkm = SEG0 + pos;

      var d = gen(kind, px, amp, noise, SEED);
      waterfall(wf, d);

      /* ---- DAS 形态识别 ---- */
      var f = feats(d), pr = classify(f);
      var rows = '';
      for (var i = 0; i < KINDS.length; i++) {
        var w = (pr[i] * 100).toFixed(0);
        rows += '<div class="bar-row"><span class="bl">' + NAMES[i] + '</span>' +
          '<span class="bt"><span class="bf" style="width:' + w + '%;background:' + COLORS[i] + '"></span></span>' +
          '<span class="bv">' + w + '%</span></div>';
      }
      $('c9-probs').innerHTML = rows;
      var bi = 0;
      for (var j = 1; j < pr.length; j++) if (pr[j] > pr[bi]) bi = j;
      var conf = pr[bi], hit = KINDS[bi] === kind;
      $('c9-v1').textContent = NAMES[bi];
      $('c9-v1').className = hit ? 'ok' : 'bad';
      $('c9-v2').textContent = (conf * 100).toFixed(0) + '%';
      $('c9-v2').className = conf > 0.6 ? 'ok' : (conf > 0.35 ? 'warn' : 'bad');
      $('c9-v3').textContent = Math.abs(f.v) < 0.5 ? '静止 0 m/s' : f.v.toFixed(0) + ' m/s';
      $('c9-v3').className = Math.abs(f.v) < 0.5 ? '' : 'ok';
      $('c9-das').innerHTML = (hit ? '✔ 判对了' : '✘ 判错了（真值：' + NAMES[KINDS.indexOf(kind)] + '）') +
        '　·　抓到的位置：<b>' + (SEG0 + f.bx * SEGKM / NX).toFixed(1) + ' km</b>' +
        '　·　峰值反差 ' + f.ctr.toFixed(1) + '×　起伏度 ' + f.cv.toFixed(2) +
        '　全线同步 ' + f.sync.toFixed(1) + '×　移动增益 ' + f.movr.toFixed(2) + '×';
      drawRadon(f);

      /* ---- 负压波 ---- */
      var P = pressures(kind, xkm, amp, noise, SEED);
      var ta = arrive(P.p1, noise, SEED), tb = arrive(P.p2, noise, SEED);
      var xest = null, err = null;
      if (ta !== null && tb !== null) {
        xest = (L - VW * (tb - ta) * FSEC) / 2;
        if (xest < 0) xest = 0; if (xest > L) xest = L;
        err = Math.abs(xest - xkm);
      }
      $('c9-v4').textContent = xest === null ? '未检出波前' : xest.toFixed(1) + ' km';
      $('c9-v4').className = xest === null ? '' : (err < 1.5 ? 'ok' : (err < 3 ? 'warn' : 'bad'));
      $('c9-v5').textContent = err === null ? '—' : '±' + err.toFixed(1) + ' km';
      $('c9-v5').className = err === null ? '' : (err < 1.5 ? 'ok' : (err < 3 ? 'warn' : 'bad'));

      /* ---- SCADA 质量平衡：能发现有漏，但要攒够时间，且不能定位 ---- */
      var tsc = kind === 'leak' ? Math.min(120, 8 / (amp * amp * 6 + 0.05)) : null;
      $('c9-v6').textContent = tsc === null ? '—' : tsc.toFixed(0) + ' min';
      $('c9-v6').className = tsc === null ? '' : (tsc < 20 ? 'ok' : (tsc < 60 ? 'warn' : 'bad'));

      /* ---- 三源融合 ---- */
      var isLeak = KINDS[bi] === 'leak', fused, cls = '';
      if (!isLeak) { fused = '不报警'; cls = kind === 'leak' ? 'bad' : 'ok'; }
      else if (xest === null) { fused = '可疑 · 等 SCADA'; cls = 'warn'; }
      else if (err < 3) { fused = '报警 · 派人到 ' + xest.toFixed(1) + ' km'; cls = 'ok'; }
      else { fused = '报警（定位待确认）'; cls = 'warn'; }
      $('c9-v7').textContent = fused; $('c9-v7').className = cls;

      drawPressure(P, ta, tb, xest, xkm);
      note(kind, amp, noise, KINDS[bi], conf, xest, err, tsc);
    }

    function drawRadon(f) {
      var X0 = 30, X1 = 410, YB = 92, VMAX = 54;
      var s = '<rect x="' + X0 + '" y="14" width="' + (X1 - X0) + '" height="' + (YB - 14) +
        '" fill="#fbfaf6" stroke="#ece7da"/>';
      var mx = 0, i;
      for (i = 0; i < f.spec.length; i++) if (f.spec[i].val > mx) mx = f.spec[i].val;
      var bw = (X1 - X0) / f.spec.length;
      for (i = 0; i < f.spec.length; i++) {
        var it = f.spec[i], h = (it.val / (mx + 1e-9)) * (YB - 20);
        var vx = X0 + (X1 - X0) * (it.v + VMAX) / (2 * VMAX);
        var best = Math.abs(it.v - f.v) < 0.01;
        s += '<rect x="' + (vx - bw / 2).toFixed(1) + '" y="' + (YB - h).toFixed(1) + '" width="' + (bw * 0.72).toFixed(1) +
          '" height="' + h.toFixed(1) + '" fill="' + (best ? CLAY : '#cfd6d2') + '" rx="1"/>';
      }
      /* 参考线：静止 / 清管器 / 车辆 */
      function mark(v, col, lab) {
        var vx = X0 + (X1 - X0) * (v + VMAX) / (2 * VMAX);
        return '<g stroke="' + col + '" stroke-dasharray="3 3"><path d="M' + vx.toFixed(1) + ' 16 v' + (YB - 16) + '"/></g>' +
          '<text x="' + vx.toFixed(1) + '" y="12" text-anchor="middle" font-size="8.5" fill="' + col + '">' + lab + '</text>';
      }
      s += mark(0, '#8d979c', '静止');
      s += mark(V_PIG, OLIVE, '清管');
      s += mark(V_VEH, OPT, '车辆');
      s += '<path d="M' + X0 + ' ' + YB + 'h' + (X1 - X0) + '" stroke="#c9c4b6"/>';
      [-40, -20, 0, 20, 40].forEach(function (tv) {
        var vx = X0 + (X1 - X0) * (tv + VMAX) / (2 * VMAX);
        s += '<text x="' + vx.toFixed(1) + '" y="' + (YB + 12) + '" text-anchor="middle" font-size="8.5" fill="#6d757a">' + tv + '</text>';
      });
      s += '<text x="' + (X0 + X1) / 2 + '" y="' + (YB + 26) + '" text-anchor="middle" font-size="9" fill="#4d565b">视速度 (m/s)　·　' +
        '峰值越高 = 沿这个斜率把能量叠起来最齐</text>';
      s += '<text x="26" y="60" text-anchor="end" font-size="8.5" fill="#6d757a">叠加能量</text>';
      $('c9-rs').innerHTML = s;
    }

    function drawPressure(P, ta, tb, xest, xkm, amp) {
      var X0 = 34, X1 = 404, Y0 = 12, H = 56;
      function pc(vals, y, lo, hi) {
        var dd = '';
        for (var i = 0; i < vals.length; i++) {
          var x = X0 + (X1 - X0) * i / (vals.length - 1);
          var t = (vals[i] - lo) / (hi - lo);
          if (t < 0) t = 0; if (t > 1) t = 1;
          dd += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + (y + H - t * H).toFixed(1);
        }
        return dd;
      }
      var lo = 6 - Math.max(0.06, P.drop) - 0.06, hi = 6.03;
      var s = '<rect x="' + X0 + '" y="' + Y0 + '" width="' + (X1 - X0) + '" height="' + H + '" fill="#fbfaf6" stroke="#ece7da"/>' +
        '<path d="' + pc(P.p1, Y0, lo, hi) + '" fill="none" stroke="' + OPT + '" stroke-width="1.5"/>' +
        '<text x="' + (X0 - 5) + '" y="' + (Y0 + 11) + '" text-anchor="end" font-size="8.5" fill="#31527a">首站</text>';
      s += '<rect x="' + X0 + '" y="' + (Y0 + H + 12) + '" width="' + (X1 - X0) + '" height="' + H + '" fill="#fbfaf6" stroke="#ece7da"/>' +
        '<path d="' + pc(P.p2, Y0 + H + 12, lo, hi) + '" fill="none" stroke="' + JADE + '" stroke-width="1.5"/>' +
        '<text x="' + (X0 - 5) + '" y="' + (Y0 + H + 23) + '" text-anchor="end" font-size="8.5" fill="#235f51">末站</text>';
      [ta, tb].forEach(function (tv, idx) {
        if (tv === null) return;
        var x = X0 + (X1 - X0) * tv / (NT - 1);
        var y = idx === 0 ? Y0 : Y0 + H + 12;
        s += '<g stroke="' + BAD + '" stroke-dasharray="4 3"><path d="M' + x.toFixed(1) + ' ' + y + ' v' + H + '"/></g>' +
          '<circle cx="' + x.toFixed(1) + '" cy="' + (y + H).toFixed(1) + '" r="3.5" fill="' + BAD + '"/>';
      });
      if (ta !== null && tb !== null) {
        var xa = X0 + (X1 - X0) * ta / (NT - 1), xb = X0 + (X1 - X0) * tb / (NT - 1);
        s += '<g stroke="' + BAD + '" stroke-width="1.3" fill="none"><path d="M' + xa.toFixed(1) + ' ' + (Y0 + H + 5) +
          ' h' + (xb - xa).toFixed(1) + '"/></g>' +
          '<text x="' + ((xa + xb) / 2).toFixed(1) + '" y="' + (Y0 + H + 1) + '" text-anchor="middle" font-size="8.5" fill="#b05a51">Δt</text>';
      }
      s += '<text x="' + X0 + '" y="' + (Y0 + 2 * H + 40) + '" font-size="9.5" fill="#4d565b">' +
        'x = (L − v·Δt) / 2　→　' +
        (xest === null ? '本方法没抓到压力波前（漏太小 / 噪声太大）' :
          '定位 ' + xest.toFixed(1) + ' km，真值 ' + xkm.toFixed(1) + ' km') + '</text>';
      $('c9-pr').innerHTML = s;
    }

    function note(kind, amp, noise, pred, conf, xest, err, tsc) {
      var tp = [], kn = NAMES[KINDS.indexOf(kind)];
      if (kind === 'none') {
        tp.push('现在这段<b>没有事件</b>，只有本底噪声。看图上那几道竖着的亮带——' +
          '它们是<b>伴行路交叉口、泵站、河流穿越</b>这些天生的吵点，在图上和泄漏长得一模一样。' +
          '这就是 DAS 泄漏监测最难的地方：<b>干扰不但比泄漏大，连形状都差不多</b>。' +
          '模型能分开它们，靠的不是"响不响"，而是"峰值比中位高出几倍"。');
      } else {
        tp.push('真值是<b>' + kn + '</b>，模型判成<b>' + NAMES[KINDS.indexOf(pred)] + '</b>（置信度 ' + (conf * 100).toFixed(0) + '%）。' +
          '看瀑布图上的形状签名：<b>' +
          (kind === 'leak' ? '固定位置的一条竖带，60 秒一直在响' :
            kind === 'cons' ? '同一位置的间歇闪烁（挖机一斗一斗地挖）' :
              kind === 'veh' ? '一条陡斜线，声源在沿伴行路跑' :
                kind === 'pig' ? '更缓的一条斜带，比车辆慢得多' :
                  '几道横贯全图的横线，整条线同时被扰动') + '</b>。' +
          '判别信息不在"响不响"，而在"怎么响"。');
      }
      if (kind === 'valve') {
        tp.push('注意下面那张压力图：<b>调阀同样产生压力波，负压波法照样会算出一个"漏点位置"</b>——' +
          '这就是为什么<b>只靠负压波，现场一半的报警都是调泵调阀</b>。' +
          '而 DAS 看的是时空形态：调阀"全线同步"，泄漏"固定一点"，一眼分开。<b>两者互补，缺一不可。</b>');
      } else if (kind === 'leak') {
        if (xest === null) {
          tp.push('把<b>强度调到 0.2 以下</b>再看：压力波已经小到认不出拐点，' +
            '<b>负压波失灵了</b>；再往上加噪声，DAS 也开始把这条竖带当成背景，判成"无事件"——' +
            '<b>这就是漏报</b>。小泄漏谁都难，现场靠 SCADA 质量平衡长时间攒：<b>现在需要 ' +
            (tsc === null ? '很久' : tsc.toFixed(0) + ' 分钟') + '</b>才能从进出流量差里看出来。');
        } else {
          tp.push('三源都有话说：DAS 说"这一段在响，形状像泄漏"（能定性、能定位到 ±' + err.toFixed(1) + ' km），' +
            '负压波说"漏点在 ' + xest.toFixed(1) + ' km"，SCADA 说"进出流量确实少了，攒 ' + tsc.toFixed(0) +
            ' 分钟能确认"。<b>三条都对上才派人</b>——这就是现场不误报、不漏报的全部家底。' +
            '把强度调到 0.2 以下，看负压波先失灵、DAS 后失灵的顺序。');
        }
      } else if (kind === 'cons') {
        tp.push('第三方施工是<b>最容易被误报成泄漏</b>的一类：它也在固定位置、也持续。' +
          '分开它们的只有一条——<b>泄漏是稳稳地响，施工是一阵一阵地响</b>。' +
          '看概率条里"起伏度"那个数：起伏度大 = 间歇 = 施工。');
      } else {
        tp.push('<b>把背景噪声拉到 0.9</b>，看瀑布图怎么被背景竖条带淹没；' +
          '再把<b>强度调到最小</b>，看模型什么时候开始判错——' +
          '这两个滑块就是现场"光缆埋得深不深"和"漏得多小"的真实写照。');
      }
      $('c9-note').innerHTML = tp.join('<br><br>');
    }

    $('c9-k').addEventListener('change', draw);
    ['c9-p', 'c9-a', 'c9-n'].forEach(function (id) { $(id).addEventListener('input', draw); });
    $('c9-rand').addEventListener('click', function () {
      SEED = (SEED * 1103515245 + 12345) >>> 0; draw();
    });

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
