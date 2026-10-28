/* =========================================================
   w3-imaging-fracture · 案例插件（由 _build/build.mjs 自动生成，勿手改）
   源头是案例包 imaging-fracture-case/source.js + demo/，改内容请改源头后重新构建。
   ========================================================= */
(function () {
  var DEF = {"id":"w3-imaging-fracture","sceneId":"w3","title":"成像测井裂缝识别：把井壁摊平，让 U-Net 去描正弦","status":"ready","version":"1.0.0","updated":"2026-10-23","tabs":{"background":{"label":"专业背景","lede":"电成像测井（FMI / EMI / STAR）在下井仪器四周排布上百个纽扣电极，边转边测井壁的微电阻率，回放到地面就是一张「方位—深度」的灰度展开图。这张图里藏着油气最想要的东西：裂缝。而裂缝在这张图上有一个精确得像数学题的形状——<b>一条完整的正弦曲线</b>。","judge":[{"label":"任务类型","value":"语义分割","desc":"逐像素出概率，再拟合几何参数"},{"label":"数据门槛","value":"≥ 800 m 图像","desc":"含专家描好的正弦掩膜"},{"label":"可见收益","value":"2.5 人天 → 40 min","desc":"人工描正弦是最大瓶颈"},{"label":"难度","value":"高","html":"<span class=\"dtag\" data-d=\"高\">难度 高</span>"}],"sections":[{"no":1,"en":"PROBLEM","title":"当前做法与问题","html":"<p>地质师打开成像图，肉眼找出一条条深色（低阻，被泥浆侵入的张开缝）或亮色（高阻，被方解石充填）的正弦，用鼠标沿着曲线点十几下，软件自动连成正弦并算出倾角、倾向。一井 500 m 图像里通常有 150—400 条，<b>熟练者也要 2—3 个人天</b>，而且不同人描的结果能差出 10° 倾角。</p><p>更麻烦的是一致性：同一个人在周一和周五描同一段，结果也不完全一样。这直接导致「裂缝密度」「裂缝走向玫瑰图」这类统计结论没法在井间可比。</p><div class=\"figure\"><svg viewBox=\"0 0 640 310\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"井壁圆柱展开为正弦曲线\"><g stroke=\"#9ba3a9\" stroke-width=\"1.2\"><ellipse cx=\"82\" cy=\"90\" rx=\"42\" ry=\"13\" fill=\"#eef3f6\"/><path d=\"M40 90 v80 q42 13 84 0 v-80\" fill=\"#f7fafc\"/><ellipse cx=\"82\" cy=\"170\" rx=\"42\" ry=\"13\" fill=\"none\" stroke=\"#c8c2b4\"/></g><ellipse cx=\"82\" cy=\"136\" rx=\"42\" ry=\"15\" transform=\"rotate(-15 82 136)\" fill=\"none\" stroke=\"#b26a39\" stroke-width=\"2.4\"/><text x=\"82\" y=\"212\" text-anchor=\"middle\" font-size=\"10.5\" font-weight=\"700\" fill=\"#8e5229\">① 裂缝面斜切井筒</text><text x=\"82\" y=\"229\" text-anchor=\"middle\" font-size=\"9.5\" fill=\"#79828a\">交线是一圈闭合的椭圆</text><path d=\"M136 136 h42\" fill=\"none\" stroke=\"#9ba3a9\" stroke-width=\"1.4\" marker-end=\"url(#w3a1)\"/><rect x=\"196\" y=\"76\" width=\"424\" height=\"120\" rx=\"4\" fill=\"#f4f2ec\" stroke=\"#ddd7c8\"/><g stroke=\"#fff\" stroke-width=\"1\" opacity=\".8\"><path d=\"M303 76 v120\"/><path d=\"M410 76 v120\"/><path d=\"M517 76 v120\"/></g><path d=\"M200.0 136.0 L210.4 131.3 L220.8 126.7 L231.2 122.4 L241.6 118.4 L252.0 114.8 L262.4 111.7 L272.8 109.3 L283.2 107.5 L293.6 106.4 L304.0 106.0 L314.4 106.4 L324.8 107.5 L335.2 109.3 L345.6 111.7 L356.0 114.8 L366.4 118.4 L376.8 122.4 L387.2 126.7 L397.6 131.3 L408.0 136.0 L418.4 140.7 L428.8 145.3 L439.2 149.6 L449.6 153.6 L460.0 157.2 L470.4 160.3 L480.8 162.7 L491.2 164.5 L501.6 165.6 L512.0 166.0 L522.4 165.6 L532.8 164.5 L543.2 162.7 L553.6 160.3 L564.0 157.2 L574.4 153.6 L584.8 149.6 L595.2 145.3 L605.6 140.7 L616.0 136.0\" fill=\"none\" stroke=\"#b26a39\" stroke-width=\"2.6\"/><text x=\"408\" y=\"68\" text-anchor=\"middle\" font-size=\"10.5\" font-weight=\"700\" fill=\"#8e5229\">② 沿母线剪开摊平 → 一条完整正弦</text><g font-size=\"9.5\" fill=\"#79828a\" text-anchor=\"middle\"><text x=\"212\" y=\"214\">0°</text><text x=\"303\" y=\"214\">90°</text><text x=\"408\" y=\"214\">180°</text><text x=\"517\" y=\"214\">270°</text><text x=\"606\" y=\"214\">360°</text></g><g fill=\"none\" stroke-width=\"2\"><path d=\"M36.0 262.0 L39.2 260.7 L42.4 259.5 L45.6 258.4 L48.8 257.3 L52.0 256.3 L55.2 255.5 L58.4 254.9 L61.6 254.4 L64.8 254.1 L68.0 254.0 L71.2 254.1 L74.4 254.4 L77.6 254.9 L80.8 255.5 L84.0 256.3 L87.2 257.3 L90.4 258.4 L93.6 259.5 L96.8 260.7 L100.0 262.0 L103.2 263.3 L106.4 264.5 L109.6 265.6 L112.8 266.7 L116.0 267.7 L119.2 268.5 L122.4 269.1 L125.6 269.6 L128.8 269.9 L132.0 270.0 L135.2 269.9 L138.4 269.6 L141.6 269.1 L144.8 268.5 L148.0 267.7 L151.2 266.7 L154.4 265.6 L157.6 264.5 L160.8 263.3 L164.0 262.0\" stroke=\"#2f7d6b\"/><path d=\"M196.0 262.0 L199.2 259.2 L202.4 256.4 L205.6 253.8 L208.8 251.4 L212.0 249.3 L215.2 247.4 L218.4 246.0 L221.6 244.9 L224.8 244.2 L228.0 244.0 L231.2 244.2 L234.4 244.9 L237.6 246.0 L240.8 247.4 L244.0 249.3 L247.2 251.4 L250.4 253.8 L253.6 256.4 L256.8 259.2 L260.0 262.0 L263.2 264.8 L266.4 267.6 L269.6 270.2 L272.8 272.6 L276.0 274.7 L279.2 276.6 L282.4 278.0 L285.6 279.1 L288.8 279.8 L292.0 280.0 L295.2 279.8 L298.4 279.1 L301.6 278.0 L304.8 276.6 L308.0 274.7 L311.2 272.6 L314.4 270.2 L317.6 267.6 L320.8 264.8 L324.0 262.0\" stroke=\"#2f7d6b\"/><path d=\"M356.0 262.0 L359.2 257.6 L362.4 253.3 L365.6 249.3 L368.8 245.5 L372.0 242.2 L375.2 239.3 L378.4 237.1 L381.6 235.4 L384.8 234.3 L388.0 234.0 L391.2 234.3 L394.4 235.4 L397.6 237.1 L400.8 239.3 L404.0 242.2 L407.2 245.5 L410.4 249.3 L413.6 253.3 L416.8 257.6 L420.0 262.0 L423.2 266.4 L426.4 270.7 L429.6 274.7 L432.8 278.5 L436.0 281.8 L439.2 284.7 L442.4 286.9 L445.6 288.6 L448.8 289.7 L452.0 290.0 L455.2 289.7 L458.4 288.6 L461.6 286.9 L464.8 284.7 L468.0 281.8 L471.2 278.5 L474.4 274.7 L477.6 270.7 L480.8 266.4 L484.0 262.0\" stroke=\"#b26a39\"/><path d=\"M516.0 262.0 L519.2 256.1 L522.4 250.3 L525.6 244.7 L528.8 239.7 L532.0 235.1 L535.2 231.3 L538.4 228.1 L541.6 225.9 L544.8 224.5 L548.0 224.0 L551.2 224.5 L554.4 225.9 L557.6 228.1 L560.8 231.3 L564.0 235.1 L567.2 239.7 L570.4 244.7 L573.6 250.3 L576.8 256.1 L580.0 262.0 L583.2 267.9 L586.4 273.7 L589.6 279.3 L592.8 284.3 L596.0 288.9 L599.2 292.7 L602.4 295.9 L605.6 298.1 L608.8 299.5 L612.0 300.0 L615.2 299.5 L618.4 298.1 L621.6 295.9 L624.8 292.7 L628.0 288.9 L631.2 284.3 L634.4 279.3 L637.6 273.7 L640.8 267.9 L644.0 262.0\" stroke=\"#b05a51\"/></g><g stroke=\"#e6e2d6\"><path d=\"M36 262 h128\"/><path d=\"M196 262 h128\"/><path d=\"M356 262 h128\"/><path d=\"M516 262 h128\"/></g><g font-size=\"10\" font-weight=\"700\" text-anchor=\"middle\"><text x=\"100\" y=\"304\" fill=\"#235f51\">倾角 10° · 振幅 8</text><text x=\"260\" y=\"304\" fill=\"#235f51\">25° · 18</text><text x=\"420\" y=\"304\" fill=\"#8e5229\">45° · 28</text><text x=\"580\" y=\"304\" fill=\"#b05a51\">65° · 38</text></g><text x=\"640\" y=\"20\" text-anchor=\"end\" font-size=\"9.5\" fill=\"#79828a\">振幅 ∝ tan(倾角)，周期 = 一圈井周（360° 方位）</text><defs><marker id=\"w3a1\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#9ba3a9\"/></marker></defs></svg></div><div class=\"figcap\"><b>图 1</b><span>井壁展开与正弦成因。<b>这是整个场景的地基</b>：任意平面切过圆柱，交线是椭圆；把它沿母线剪开摊平，就是一条周期等于井周的正弦。正弦的三个参数——<b>振幅、周期、相位</b>——分别对应地质要的<b>倾角、井周长度、倾向</b>。所以「找裂缝」本质上是一个有精确解析解的几何问题，这正是深度学习能做得比人更稳的原因。</span></div>"},{"no":2,"en":"INTERVENTION","title":"AI 能做什么","html":"<p>把成像图切成 512×512 的滑窗，喂给 <b>U-Net</b>——一个为「逐像素标注」设计的编码—解码网络。它不做分类，而是输出<b>一张和输入同尺寸的概率图</b>，每个像素写着「我属于裂缝的可能性」。</p><p>为什么必须是分割而不是滑窗分类？因为裂缝是横跨整幅图的细长目标，滑窗分类只能说「这个窗里有缝」，说不出缝在哪；而概率图天然保留了形状，<b>后面才能接着做正弦拟合</b>。这里有一个容易被忽略的链条：<b>U-Net 只是手段，真正交付给地质的是「倾角 + 倾向」这两个数</b>——像素必须变成几何参数，否则这个模型对下游毫无用处。</p><div class=\"figure\"><svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"U-Net 编码解码结构\"><path d=\"M150 4 v22\" fill=\"none\" stroke=\"#41699b\" stroke-width=\"1.4\" marker-end=\"url(#w3a2)\"/><text x=\"150\" y=\"0\" font-size=\"9.5\" fill=\"#79828a\" text-anchor=\"middle\" style=\"dominant-baseline:auto\">电成像切片 512×512×1</text><g font-size=\"9.5\" font-weight=\"700\" text-anchor=\"middle\"><rect x=\"75\" y=\"30\" width=\"150\" height=\"34\" rx=\"6\" fill=\"#e7eef9\" stroke=\"#41699b\"/><text x=\"150\" y=\"51\" fill=\"#31527a\">512×512×1</text><rect x=\"87\" y=\"86\" width=\"126\" height=\"34\" rx=\"6\" fill=\"#e7eef9\" stroke=\"#41699b\"/><text x=\"150\" y=\"107\" fill=\"#31527a\">256×256×64</text><rect x=\"99\" y=\"142\" width=\"102\" height=\"34\" rx=\"6\" fill=\"#e7eef9\" stroke=\"#41699b\"/><text x=\"150\" y=\"163\" fill=\"#31527a\">128×128×128</text><rect x=\"111\" y=\"198\" width=\"78\" height=\"34\" rx=\"6\" fill=\"#e7eef9\" stroke=\"#41699b\"/><text x=\"150\" y=\"219\" fill=\"#31527a\">64×64×256</text><rect x=\"275\" y=\"256\" width=\"60\" height=\"34\" rx=\"6\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\"/><text x=\"305\" y=\"277\" fill=\"#235f51\">32×32×512</text><rect x=\"421\" y=\"198\" width=\"78\" height=\"34\" rx=\"6\" fill=\"#f8ecdf\" stroke=\"#b26a39\"/><text x=\"460\" y=\"219\" fill=\"#8e5229\">64×64×256</text><rect x=\"409\" y=\"142\" width=\"102\" height=\"34\" rx=\"6\" fill=\"#f8ecdf\" stroke=\"#b26a39\"/><text x=\"460\" y=\"163\" fill=\"#8e5229\">128×128×128</text><rect x=\"397\" y=\"86\" width=\"126\" height=\"34\" rx=\"6\" fill=\"#f8ecdf\" stroke=\"#b26a39\"/><text x=\"460\" y=\"107\" fill=\"#8e5229\">256×256×64</text><rect x=\"385\" y=\"30\" width=\"150\" height=\"34\" rx=\"6\" fill=\"#e6f1ec\" stroke=\"#2f7d6b\"/><text x=\"460\" y=\"51\" fill=\"#235f51\">512×512×1 概率图</text></g><g stroke=\"#41699b\" stroke-width=\"1.3\" fill=\"none\" marker-end=\"url(#w3a2)\"><path d=\"M150 64 v20\"/><path d=\"M150 120 v20\"/><path d=\"M150 176 v20\"/><path d=\"M150 232 q0 24 100 24\"/><path d=\"M335 273 q60 0 100 -17\"/><path d=\"M460 232 v-20\"/><path d=\"M460 176 v-20\"/><path d=\"M460 120 v-20\"/></g><g stroke=\"#b26a39\" stroke-width=\"1.1\" stroke-dasharray=\"4 3\" fill=\"none\"><path d=\"M225 47 h160\"/><path d=\"M213 103 h184\"/><path d=\"M201 159 h208\"/><path d=\"M189 215 h232\"/></g><text x=\"305\" y=\"300\" text-anchor=\"middle\" font-size=\"9.5\" fill=\"#79828a\">虚线 = 跳跃连接：把编码器里的高分辨率细节直接搬给解码器，细缝才不会被\"池化\"掉</text><g font-size=\"9.5\" fill=\"#79828a\"><text x=\"8\" y=\"47\">编码器</text><text x=\"8\" y=\"62\">抓语义</text><text x=\"560\" y=\"47\">解码器</text><text x=\"560\" y=\"62\">还精度</text></g><defs><marker id=\"w3a2\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#41699b\"/></marker></defs></svg></div><div class=\"figcap\"><b>图 2</b><span>U-Net 结构。<b>关键是那几条虚线（跳跃连接）</b>：编码器一路下采样把「语义」抽出来，但裂缝这种 2—3 像素宽的目标会在池化里被抹掉；跳跃连接把编码器各层的高分辨率特征直接搬给解码器，细缝才留得下来。没有它，概率图会变成一团模糊的雾。</span></div>"},{"no":3,"en":"DATA","title":"你需要准备什么","html":"<p style=\"margin-bottom:14px\">成本不高但很脏：图像是现成的，标签要人描，而<b>增强方式必须是「懂地质」的</b>——</p><div class=\"figure\"><svg viewBox=\"0 0 640 172\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"成像数据的四种增强\"><g><rect x=\"16\" y=\"24\" width=\"128\" height=\"96\" rx=\"4\" fill=\"#f0eee7\" stroke=\"#ddd7c8\"/><path d=\"M22.0 72.0 L24.9 68.6 L27.8 65.2 L30.7 62.0 L33.6 59.1 L36.5 56.4 L39.4 54.2 L42.3 52.4 L45.2 51.1 L48.1 50.3 L51.0 50.0 L53.9 50.3 L56.8 51.1 L59.7 52.4 L62.6 54.2 L65.5 56.4 L68.4 59.1 L71.3 62.0 L74.2 65.2 L77.1 68.6 L80.0 72.0 L82.9 75.4 L85.8 78.8 L88.7 82.0 L91.6 84.9 L94.5 87.6 L97.4 89.8 L100.3 91.6 L103.2 92.9 L106.1 93.7 L109.0 94.0 L111.9 93.7 L114.8 92.9 L117.7 91.6 L120.6 89.8 L123.5 87.6 L126.4 84.9 L129.3 82.0 L132.2 78.8 L135.1 75.4 L138.0 72.0\" fill=\"none\" stroke=\"#b26a39\" stroke-width=\"2\"/><text x=\"80\" y=\"140\" text-anchor=\"middle\" font-size=\"10\" font-weight=\"700\" fill=\"#242b2e\">原图</text><text x=\"80\" y=\"155\" text-anchor=\"middle\" font-size=\"9\" fill=\"#79828a\">专家描好的正弦</text><rect x=\"176\" y=\"24\" width=\"128\" height=\"96\" rx=\"4\" fill=\"#f0eee7\" stroke=\"#ddd7c8\"/><path d=\"M182.0 54.2 L184.9 56.5 L187.8 59.1 L190.7 62.0 L193.6 65.2 L196.5 68.6 L199.4 72.0 L202.3 75.5 L205.2 78.8 L208.1 82.0 L211.0 84.9 L213.9 87.6 L216.8 89.8 L219.7 91.6 L222.6 92.9 L225.5 93.7 L228.4 94.0 L231.3 93.7 L234.2 92.9 L237.1 91.6 L240.0 89.8 L242.9 87.5 L245.8 84.9 L248.7 82.0 L251.6 78.8 L254.5 75.4 L257.4 72.0 L260.3 68.5 L263.2 65.2 L266.1 62.0 L269.0 59.1 L271.9 56.4 L274.8 54.2 L277.7 52.4 L280.6 51.1 L283.5 50.3 L286.4 50.0 L289.3 50.3 L292.2 51.1 L295.1 52.4 L298.0 54.2\" fill=\"none\" stroke=\"#b26a39\" stroke-width=\"2\"/><text x=\"240\" y=\"140\" text-anchor=\"middle\" font-size=\"10\" font-weight=\"700\" fill=\"#242b2e\">方位平移</text><text x=\"240\" y=\"155\" text-anchor=\"middle\" font-size=\"9\" fill=\"#79828a\">等价于井筒转了个角度</text><rect x=\"336\" y=\"24\" width=\"128\" height=\"96\" rx=\"4\" fill=\"#f0eee7\" stroke=\"#ddd7c8\"/><rect x=\"367.6\" y=\"110.0\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"413.9\" y=\"111.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"344.1\" y=\"104.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"382.8\" y=\"30.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"346.5\" y=\"116.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"458.6\" y=\"74.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"394.0\" y=\"76.4\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"413.0\" y=\"97.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"434.7\" y=\"64.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"396.8\" y=\"104.4\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"382.9\" y=\"70.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"349.4\" y=\"94.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"441.4\" y=\"58.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"360.2\" y=\"116.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"353.1\" y=\"67.8\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"394.6\" y=\"35.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"352.1\" y=\"83.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"433.8\" y=\"33.8\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"413.1\" y=\"111.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"371.0\" y=\"80.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"381.7\" y=\"54.8\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"401.5\" y=\"91.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"376.4\" y=\"40.6\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"446.4\" y=\"83.6\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"385.0\" y=\"117.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"398.1\" y=\"42.4\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"369.5\" y=\"110.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"410.9\" y=\"71.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"359.7\" y=\"65.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"360.1\" y=\"26.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"423.8\" y=\"95.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"355.9\" y=\"76.0\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"430.0\" y=\"107.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"384.0\" y=\"63.4\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"417.2\" y=\"102.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"400.4\" y=\"70.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"435.4\" y=\"114.1\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"378.2\" y=\"107.4\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"363.7\" y=\"51.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"455.8\" y=\"91.8\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"363.9\" y=\"30.8\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"374.4\" y=\"102.0\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"432.2\" y=\"45.4\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"401.2\" y=\"95.6\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"389.7\" y=\"56.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"381.7\" y=\"44.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"446.0\" y=\"44.8\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"422.2\" y=\"90.4\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"392.6\" y=\"50.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"403.0\" y=\"57.0\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"350.5\" y=\"61.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"395.8\" y=\"95.1\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"444.8\" y=\"97.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"366.7\" y=\"89.1\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"410.5\" y=\"33.0\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"430.1\" y=\"101.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"407.8\" y=\"104.4\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"345.1\" y=\"94.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"392.0\" y=\"117.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"451.0\" y=\"44.1\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"373.0\" y=\"104.0\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"438.7\" y=\"116.6\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"456.1\" y=\"28.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"447.6\" y=\"47.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"459.6\" y=\"48.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"452.6\" y=\"102.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"418.3\" y=\"77.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"384.1\" y=\"43.1\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"341.3\" y=\"26.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"354.7\" y=\"96.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"348.9\" y=\"59.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"398.9\" y=\"117.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"361.4\" y=\"76.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"400.8\" y=\"63.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"404.7\" y=\"31.4\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"421.9\" y=\"47.6\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"392.8\" y=\"42.6\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"430.7\" y=\"94.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"391.5\" y=\"36.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"451.1\" y=\"33.8\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"410.8\" y=\"40.0\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"442.8\" y=\"60.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"417.3\" y=\"68.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"371.4\" y=\"57.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"422.6\" y=\"53.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"339.7\" y=\"98.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"407.7\" y=\"81.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"432.6\" y=\"75.0\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"373.7\" y=\"44.8\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"456.3\" y=\"98.8\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"341.5\" y=\"55.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"402.3\" y=\"31.4\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"403.0\" y=\"109.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"391.0\" y=\"110.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"338.9\" y=\"117.0\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"368.4\" y=\"65.6\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"454.1\" y=\"48.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"354.9\" y=\"112.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"355.0\" y=\"56.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"342.1\" y=\"75.8\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"360.3\" y=\"88.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"452.7\" y=\"66.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"345.3\" y=\"106.1\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"394.2\" y=\"27.6\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"401.8\" y=\"94.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"373.9\" y=\"62.4\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"408.6\" y=\"105.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"458.9\" y=\"83.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"351.4\" y=\"27.0\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"362.5\" y=\"112.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"410.2\" y=\"100.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"423.8\" y=\"93.4\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"357.8\" y=\"86.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"366.0\" y=\"31.0\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"450.5\" y=\"77.1\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"383.6\" y=\"105.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"440.6\" y=\"78.0\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"338.5\" y=\"63.6\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"441.1\" y=\"109.8\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"435.4\" y=\"52.4\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"458.9\" y=\"26.1\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"459.4\" y=\"47.6\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"403.5\" y=\"106.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"389.4\" y=\"85.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"428.2\" y=\"104.0\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"397.9\" y=\"50.1\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"370.4\" y=\"61.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"386.4\" y=\"91.8\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"442.2\" y=\"63.6\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"352.9\" y=\"92.6\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"389.6\" y=\"86.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"437.8\" y=\"42.1\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"447.5\" y=\"96.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"395.6\" y=\"64.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"379.8\" y=\"34.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"376.4\" y=\"67.1\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"366.4\" y=\"89.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"346.5\" y=\"103.1\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"458.9\" y=\"91.0\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"342.1\" y=\"81.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"445.5\" y=\"42.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"435.4\" y=\"59.0\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"381.6\" y=\"40.0\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"437.8\" y=\"59.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"339.9\" y=\"64.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"388.2\" y=\"71.1\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"441.9\" y=\"54.8\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"425.4\" y=\"33.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"407.4\" y=\"69.8\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><rect x=\"412.2\" y=\"43.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".35\"/><path d=\"M342.0 72.0 L344.9 68.6 L347.8 65.2 L350.7 62.0 L353.6 59.1 L356.5 56.4 L359.4 54.2 L362.3 52.4 L365.2 51.1 L368.1 50.3 L371.0 50.0 L373.9 50.3 L376.8 51.1 L379.7 52.4 L382.6 54.2 L385.5 56.4 L388.4 59.1 L391.3 62.0 L394.2 65.2 L397.1 68.6 L400.0 72.0 L402.9 75.4 L405.8 78.8 L408.7 82.0 L411.6 84.9 L414.5 87.6 L417.4 89.8 L420.3 91.6 L423.2 92.9 L426.1 93.7 L429.0 94.0 L431.9 93.7 L434.8 92.9 L437.7 91.6 L440.6 89.8 L443.5 87.6 L446.4 84.9 L449.3 82.0 L452.2 78.8 L455.1 75.4 L458.0 72.0\" fill=\"none\" stroke=\"#b26a39\" stroke-width=\"2\"/><text x=\"400\" y=\"140\" text-anchor=\"middle\" font-size=\"10\" font-weight=\"700\" fill=\"#242b2e\">加噪 / 掉电率</text><text x=\"400\" y=\"155\" text-anchor=\"middle\" font-size=\"9\" fill=\"#79828a\">模拟极板贴合不良</text><rect x=\"496\" y=\"24\" width=\"128\" height=\"96\" rx=\"4\" fill=\"#f0eee7\" stroke=\"#ddd7c8\"/><path d=\"M502.0 72.0 L504.9 68.6 L507.8 65.2 L510.7 62.0 L513.6 59.1 L516.5 56.4 L519.4 54.2 L522.3 52.4 L525.2 51.1 L528.1 50.3 L531.0 50.0 L533.9 50.3 L536.8 51.1 L539.7 52.4 L542.6 54.2 L545.5 56.4 L548.4 59.1 L551.3 62.0 L554.2 65.2 L557.1 68.6 L560.0 72.0 L562.9 75.4 L565.8 78.8 L568.7 82.0 L571.6 84.9 L574.5 87.6 L577.4 89.8 L580.3 91.6 L583.2 92.9 L586.1 93.7 L589.0 94.0 L591.9 93.7 L594.8 92.9 L597.7 91.6 L600.6 89.8 L603.5 87.6 L606.4 84.9 L609.3 82.0 L612.2 78.8 L615.1 75.4 L618.0 72.0\" fill=\"none\" stroke=\"#b26a39\" stroke-width=\"6\" opacity=\".85\"/><text x=\"560\" y=\"140\" text-anchor=\"middle\" font-size=\"10\" font-weight=\"700\" fill=\"#242b2e\">缝宽 / 对比度扰动</text><text x=\"560\" y=\"155\" text-anchor=\"middle\" font-size=\"9\" fill=\"#79828a\">张开缝与闭合缝都要见过</text></g></svg></div><div class=\"figcap\"><b>图 3</b><span>四种增强。<b>「方位平移」是成像数据特有的增强</b>：把图沿水平方向循环滚动，等价于让仪器换个起始方位测同一口井——这是一次平移就能白送几十倍样本的操作，而且物理上完全成立。反过来说，普通图像常用的<b>竖直翻转、随机旋转 90° 在这里是错的</b>，会把倾角改掉。</span></div>"},{"no":4,"en":"DIFFICULTY","title":"技术难度与参考方向","html":"<p>真正的难点不是「看不清」，而是<b>「看得出形状，认不出身份」</b>：在摊平的图上，天然裂缝、层理面、钻井诱导缝、小断层长得几乎一样，都是正弦。它们的判别依据不在单个正弦里，而在<b>上下文</b>——</p><div class=\"figure\"><svg viewBox=\"0 0 640 216\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"四种正弦状构造的判别\"><g><rect x=\"12\" y=\"24\" width=\"136\" height=\"132\" rx=\"4\" fill=\"#f4f2ec\" stroke=\"#ddd7c8\"/><g stroke=\"#c8c2b4\" stroke-width=\"1\"><path d=\"M18 50 h124\"/><path d=\"M18 90 h124\"/><path d=\"M18 130 h124\"/></g><path d=\"M18.0 70.8 L21.1 66.6 L24.2 63.1 L27.3 60.2 L30.4 58.0 L33.5 56.6 L36.6 56.0 L39.7 56.3 L42.8 57.4 L45.9 59.3 L49.0 61.9 L52.1 65.3 L55.2 69.2 L58.3 73.7 L61.4 78.6 L64.5 83.7 L67.6 89.0 L70.7 94.4 L73.8 99.6 L76.9 104.6 L80.0 109.2 L83.1 113.4 L86.2 116.9 L89.3 119.8 L92.4 122.0 L95.5 123.4 L98.6 124.0 L101.7 123.7 L104.8 122.6 L107.9 120.7 L111.0 118.1 L114.1 114.7 L117.2 110.8 L120.3 106.3 L123.4 101.4 L126.5 96.3 L129.6 91.0 L132.7 85.6 L135.8 80.4 L138.9 75.4 L142.0 70.8\" fill=\"none\" stroke=\"#b26a39\" stroke-width=\"2.4\"/><text x=\"80\" y=\"180\" text-anchor=\"middle\" font-size=\"10.5\" font-weight=\"700\" fill=\"#8e5229\">天然裂缝</text><text x=\"80\" y=\"196\" text-anchor=\"middle\" font-size=\"9\" fill=\"#79828a\">切穿层理 · 成组出现</text><rect x=\"172\" y=\"24\" width=\"136\" height=\"132\" rx=\"4\" fill=\"#f4f2ec\" stroke=\"#ddd7c8\"/><g stroke=\"#767a2e\" stroke-width=\"2\"><path d=\"M178.0 60.0 L181.1 59.1 L184.2 58.1 L187.3 57.3 L190.4 56.5 L193.5 55.8 L196.6 55.1 L199.7 54.7 L202.8 54.3 L205.9 54.1 L209.0 54.0 L212.1 54.1 L215.2 54.3 L218.3 54.7 L221.4 55.1 L224.5 55.8 L227.6 56.5 L230.7 57.3 L233.8 58.1 L236.9 59.1 L240.0 60.0 L243.1 60.9 L246.2 61.9 L249.3 62.7 L252.4 63.5 L255.5 64.2 L258.6 64.9 L261.7 65.3 L264.8 65.7 L267.9 65.9 L271.0 66.0 L274.1 65.9 L277.2 65.7 L280.3 65.3 L283.4 64.9 L286.5 64.2 L289.6 63.5 L292.7 62.7 L295.8 61.9 L298.9 60.9 L302.0 60.0\"/><path d=\"M178.0 87.9 L181.1 86.9 L184.2 86.0 L187.3 85.1 L190.4 84.4 L193.5 83.8 L196.6 83.4 L199.7 83.1 L202.8 83.0 L205.9 83.1 L209.0 83.3 L212.1 83.7 L215.2 84.3 L218.3 85.0 L221.4 85.8 L224.5 86.7 L227.6 87.7 L230.7 88.8 L233.8 89.9 L236.9 91.0 L240.0 92.1 L243.1 93.1 L246.2 94.0 L249.3 94.9 L252.4 95.6 L255.5 96.2 L258.6 96.6 L261.7 96.9 L264.8 97.0 L267.9 96.9 L271.0 96.7 L274.1 96.3 L277.2 95.7 L280.3 95.0 L283.4 94.2 L286.5 93.3 L289.6 92.3 L292.7 91.2 L295.8 90.1 L298.9 89.0 L302.0 87.9\"/><path d=\"M178.0 116.1 L181.1 115.5 L184.2 114.9 L187.3 114.5 L190.4 114.2 L193.5 114.0 L196.6 114.0 L199.7 114.2 L202.8 114.4 L205.9 114.9 L209.0 115.4 L212.1 116.1 L215.2 116.8 L218.3 117.7 L221.4 118.6 L224.5 119.5 L227.6 120.4 L230.7 121.4 L233.8 122.3 L236.9 123.1 L240.0 123.9 L243.1 124.5 L246.2 125.1 L249.3 125.5 L252.4 125.8 L255.5 126.0 L258.6 126.0 L261.7 125.8 L264.8 125.6 L267.9 125.1 L271.0 124.6 L274.1 123.9 L277.2 123.2 L280.3 122.3 L283.4 121.4 L286.5 120.5 L289.6 119.6 L292.7 118.6 L295.8 117.7 L298.9 116.9 L302.0 116.1\"/><path d=\"M178.0 144.3 L181.1 143.2 L184.2 142.2 L187.3 141.2 L190.4 140.3 L193.5 139.6 L196.6 139.0 L199.7 138.5 L202.8 138.2 L205.9 138.0 L209.0 138.0 L212.1 138.2 L215.2 138.6 L218.3 139.1 L221.4 139.8 L224.5 140.6 L227.6 141.5 L230.7 142.5 L233.8 143.5 L236.9 144.6 L240.0 145.7 L243.1 146.8 L246.2 147.8 L249.3 148.8 L252.4 149.7 L255.5 150.4 L258.6 151.0 L261.7 151.5 L264.8 151.8 L267.9 152.0 L271.0 152.0 L274.1 151.8 L277.2 151.4 L280.3 150.9 L283.4 150.2 L286.5 149.4 L289.6 148.5 L292.7 147.5 L295.8 146.5 L298.9 145.4 L302.0 144.3\"/></g><text x=\"240\" y=\"180\" text-anchor=\"middle\" font-size=\"10.5\" font-weight=\"700\" fill=\"#5d6022\">层理面 / 层间缝</text><text x=\"240\" y=\"196\" text-anchor=\"middle\" font-size=\"9\" fill=\"#79828a\">平行成排 · 全井段连续</text><rect x=\"332\" y=\"24\" width=\"136\" height=\"132\" rx=\"4\" fill=\"#f4f2ec\" stroke=\"#ddd7c8\"/><path d=\"M338.0 90.0 L341.1 85.9 L344.2 82.0 L347.3 78.2 L350.4 74.7 L353.5 71.6 L356.6 69.0 L359.7 66.8 L362.8 65.3 L365.9 64.3 L369.0 64.0 L372.1 64.3 L375.2 65.3 L378.3 66.8 L381.4 69.0 L384.5 71.6 L387.6 74.7 L390.7 78.2 L393.8 82.0 L396.9 85.9 L400.0 90.0 L403.1 94.1 L406.2 98.0 L409.3 101.8 L412.4 105.3 L415.5 108.4 L418.6 111.0 L421.7 113.2 L424.8 114.7 L427.9 115.7 L431.0 116.0 L434.1 115.7 L437.2 114.7 L440.3 113.2 L443.4 111.0 L446.5 108.4 L449.6 105.3 L452.7 101.8 L455.8 98.0 L458.9 94.1 L462.0 90.0\" fill=\"none\" stroke=\"#41699b\" stroke-width=\"2.4\"/><path d=\"M338.0 90.0 L341.1 94.1 L344.2 98.0 L347.3 101.8 L350.4 105.3 L353.5 108.4 L356.6 111.0 L359.7 113.2 L362.8 114.7 L365.9 115.7 L369.0 116.0 L372.1 115.7 L375.2 114.7 L378.3 113.2 L381.4 111.0 L384.5 108.4 L387.6 105.3 L390.7 101.8 L393.8 98.0 L396.9 94.1 L400.0 90.0 L403.1 85.9 L406.2 82.0 L409.3 78.2 L412.4 74.7 L415.5 71.6 L418.6 69.0 L421.7 66.8 L424.8 65.3 L427.9 64.3 L431.0 64.0 L434.1 64.3 L437.2 65.3 L440.3 66.8 L443.4 69.0 L446.5 71.6 L449.6 74.7 L452.7 78.2 L455.8 82.0 L458.9 85.9 L462.0 90.0\" fill=\"none\" stroke=\"#41699b\" stroke-width=\"2.4\" opacity=\".75\"/><text x=\"400\" y=\"180\" text-anchor=\"middle\" font-size=\"10.5\" font-weight=\"700\" fill=\"#31527a\">钻井诱导缝</text><text x=\"400\" y=\"196\" text-anchor=\"middle\" font-size=\"9\" fill=\"#79828a\">两翼相差 180° · 对称</text><rect x=\"492\" y=\"24\" width=\"136\" height=\"132\" rx=\"4\" fill=\"#f4f2ec\" stroke=\"#ddd7c8\"/><path d=\"M498.0 61.4 L501.1 58.4 L504.2 55.6 L507.3 53.2 L510.4 51.2 L513.5 49.6 L516.6 48.6 L519.7 48.1 L522.8 48.1 L525.9 48.6 L529.0 49.7 L532.1 51.3 L535.2 53.4 L538.3 55.8 L541.4 58.6 L544.5 61.7 L547.6 65.0 L550.7 68.4 L553.8 71.9 L556.9 75.3 L560.0 78.6 L563.1 81.6 L566.2 84.4 L569.3 86.8 L572.4 88.8 L575.5 90.4 L578.6 91.4 L581.7 91.9 L584.8 91.9 L587.9 91.4 L591.0 90.3 L594.1 88.7 L597.2 86.6 L600.3 84.2 L603.4 81.4 L606.5 78.3 L609.6 75.0 L612.7 71.6 L615.8 68.1 L618.9 64.7 L622.0 61.4\" fill=\"none\" stroke=\"#b05a51\" stroke-width=\"4\" opacity=\".8\"/><path d=\"M498.0 61.4 L501.1 58.4 L504.2 55.6 L507.3 53.2 L510.4 51.2 L513.5 49.6 L516.6 48.6 L519.7 48.1 L522.8 48.1 L525.9 48.6 L529.0 49.7 L532.1 51.3 L535.2 53.4 L538.3 55.8 L541.4 58.6 L544.5 61.7 L547.6 65.0 L550.7 68.4 L553.8 71.9 L556.9 75.3 L560.0 78.6 L563.1 81.6 L566.2 84.4 L569.3 86.8 L572.4 88.8 L575.5 90.4 L578.6 91.4 L581.7 91.9 L584.8 91.9 L587.9 91.4 L591.0 90.3 L594.1 88.7 L597.2 86.6 L600.3 84.2 L603.4 81.4 L606.5 78.3 L609.6 75.0 L612.7 71.6 L615.8 68.1 L618.9 64.7 L622.0 61.4\" fill=\"none\" stroke=\"#b05a51\" stroke-width=\"1.4\"/><g stroke=\"#b05a51\" stroke-width=\"1.2\" opacity=\".5\"><path d=\"M498 78 l124 12\"/><path d=\"M498 100 l124 10\"/></g><text x=\"560\" y=\"180\" text-anchor=\"middle\" font-size=\"10.5\" font-weight=\"700\" fill=\"#b05a51\">小断层 / 缝合线</text><text x=\"560\" y=\"196\" text-anchor=\"middle\" font-size=\"9\" fill=\"#79828a\">带宽 · 两盘有牵引拖拽</text></g></svg></div><div class=\"figcap\"><b>图 4</b><span>同形异义的四类构造。<b>这条是本场景的分水岭</b>：只用 512 小窗的 U-Net 会全部判成「缝」，因为它看不到窗外。工程上的解法是<b>把窗开大（1024）或在通道里并行输入「全井段压缩图」</b>，让模型知道这条正弦在整个井段里是不是连续贯穿——层理面是贯穿的，天然缝不是。</span></div>"}]},"workflow":{"title":"案例：一口致密砂岩井 480 m 成像的裂缝自动拾取","lead":["某致密气探井，8.5 in 井眼，取到 480 m 电成像。任务是把全部裂缝拾出来并给出产状，用于后续压裂段簇划分与地应力分析。","团队 3 人（1 地质 + 2 算法），前 4 周全部花在数据规范和标签一致性上，建模只用了 3 周。**这个比例在成像类项目里几乎是固定的。**"],"stats":[{"label":"图像长度","value":"480 m"},{"label":"专家标注","value":"1,860 条"},{"label":"自动拾取","value":"259 条"},{"label":"复核耗时","value":"35 min"}],"steps":[{"name":"图像预处理与方位校正","role":"数据","do":"把 0—360° 的方位轴校正到真方位（用井斜与磁偏角），再做直方图均衡消除极板贴合不良造成的竖向亮暗带。","effect":"背景直方图从双峰变单峰，同一条缝在两侧的灰度终于接得上，召回率直接涨 9 个点。","trap":"忘了方位校正，倾向会整体差一个常数。这个错在图上完全看不出来，只有和邻井对比时才发现「走向整体偏转 20°」。","fig":"<svg viewBox=\"0 0 640 132\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"预处理前后对比\"><rect x=\"20\" y=\"16\" width=\"240\" height=\"100\" rx=\"4\" fill=\"#4a4a48\" stroke=\"#3a3a38\"/><g opacity=\".5\"><rect x=\"20\" y=\"16\" width=\"60\" height=\"100\" fill=\"#6d6d69\"/><rect x=\"180\" y=\"16\" width=\"80\" height=\"100\" fill=\"#333331\"/></g><path d=\"M24.0 58.2 L30.3 55.4 L36.6 52.9 L42.9 50.7 L49.2 48.9 L55.5 47.5 L61.8 46.5 L68.1 46.1 L74.4 46.1 L80.7 46.6 L87.0 47.6 L93.3 49.0 L99.6 50.9 L105.9 53.1 L112.2 55.7 L118.5 58.5 L124.8 61.5 L131.1 64.6 L137.4 67.7 L143.7 70.8 L150.0 73.8 L156.3 76.6 L162.6 79.1 L168.9 81.3 L175.2 83.1 L181.5 84.5 L187.8 85.5 L194.1 85.9 L200.4 85.9 L206.7 85.4 L213.0 84.4 L219.3 83.0 L225.6 81.1 L231.9 78.9 L238.2 76.3 L244.5 73.5 L250.8 70.5 L257.1 67.4 L263.4 64.3 L269.7 61.2 L276.0 58.2\" fill=\"none\" stroke=\"#d8d5cc\" stroke-width=\"2.6\" opacity=\".9\"/><text x=\"140\" y=\"128\" text-anchor=\"middle\" font-size=\"10\" fill=\"#79828a\">原始：极板贴合不良 → 竖向亮暗带，同一条缝时隐时现</text><path d=\"M268 66 h44\" fill=\"none\" stroke=\"#9ba3a9\" stroke-width=\"1.4\" marker-end=\"url(#w3a3)\"/><rect x=\"320\" y=\"16\" width=\"240\" height=\"100\" rx=\"4\" fill=\"#6f6f6b\" stroke=\"#3a3a38\"/><g opacity=\".28\"><rect x=\"379.6\" y=\"35.6\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"368.8\" y=\"60.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"411.6\" y=\"49.1\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"415.3\" y=\"102.4\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"367.0\" y=\"93.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"398.7\" y=\"29.4\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"352.2\" y=\"101.8\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"511.2\" y=\"47.1\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"540.1\" y=\"78.6\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"476.4\" y=\"43.6\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"330.9\" y=\"52.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"434.1\" y=\"90.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"434.8\" y=\"70.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"456.4\" y=\"87.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"430.6\" y=\"27.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"483.1\" y=\"44.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"463.7\" y=\"28.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"401.3\" y=\"18.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"463.0\" y=\"59.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"521.2\" y=\"79.6\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"465.4\" y=\"91.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"403.8\" y=\"66.4\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"502.5\" y=\"32.0\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"423.9\" y=\"19.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"451.7\" y=\"109.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"363.8\" y=\"38.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"548.5\" y=\"100.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"484.0\" y=\"41.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"484.2\" y=\"50.4\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"429.5\" y=\"21.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"498.9\" y=\"73.8\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"354.7\" y=\"86.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"389.6\" y=\"27.4\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"450.6\" y=\"77.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"432.2\" y=\"39.1\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"546.1\" y=\"84.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"491.5\" y=\"44.1\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"330.6\" y=\"95.8\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"492.0\" y=\"42.0\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"336.3\" y=\"47.4\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"529.2\" y=\"33.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"335.0\" y=\"78.6\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"373.1\" y=\"55.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"358.8\" y=\"24.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"537.0\" y=\"94.1\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"412.1\" y=\"96.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"533.1\" y=\"50.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"425.4\" y=\"109.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"382.3\" y=\"64.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"412.1\" y=\"109.8\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"410.2\" y=\"78.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"373.0\" y=\"19.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"557.0\" y=\"55.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"499.2\" y=\"29.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"490.2\" y=\"61.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"393.9\" y=\"79.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"446.5\" y=\"38.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"338.9\" y=\"30.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"435.9\" y=\"79.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"378.5\" y=\"43.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"448.6\" y=\"102.8\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"364.8\" y=\"52.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"357.7\" y=\"80.0\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"392.8\" y=\"90.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"390.5\" y=\"52.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"405.9\" y=\"25.8\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"506.2\" y=\"77.6\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"404.5\" y=\"40.6\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"379.1\" y=\"64.1\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"393.0\" y=\"55.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"330.6\" y=\"68.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"436.2\" y=\"76.6\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"544.7\" y=\"99.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"549.0\" y=\"86.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"442.4\" y=\"50.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"438.7\" y=\"70.1\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"387.8\" y=\"99.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"355.3\" y=\"95.8\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"405.6\" y=\"45.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"356.4\" y=\"22.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"322.1\" y=\"76.1\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"541.2\" y=\"60.4\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"376.3\" y=\"35.0\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"383.5\" y=\"77.1\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"460.2\" y=\"33.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"546.0\" y=\"66.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"455.5\" y=\"92.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"468.6\" y=\"109.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"416.6\" y=\"73.6\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"420.1\" y=\"92.6\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/></g><path d=\"M324.0 58.2 L330.3 55.4 L336.6 52.9 L342.9 50.7 L349.2 48.9 L355.5 47.5 L361.8 46.5 L368.1 46.1 L374.4 46.1 L380.7 46.6 L387.0 47.6 L393.3 49.0 L399.6 50.9 L405.9 53.1 L412.2 55.7 L418.5 58.5 L424.8 61.5 L431.1 64.6 L437.4 67.7 L443.7 70.8 L450.0 73.8 L456.3 76.6 L462.6 79.1 L468.9 81.3 L475.2 83.1 L481.5 84.5 L487.8 85.5 L494.1 85.9 L500.4 85.9 L506.7 85.4 L513.0 84.4 L519.3 83.0 L525.6 81.1 L531.9 78.9 L538.2 76.3 L544.5 73.5 L550.8 70.5 L557.1 67.4 L563.4 64.3 L569.7 61.2 L576.0 58.2\" fill=\"none\" stroke=\"#efece1\" stroke-width=\"2.6\"/><text x=\"440\" y=\"128\" text-anchor=\"middle\" font-size=\"10\" fill=\"#79828a\">均衡 + 方位校正后：背景被压平，裂缝的连续性回来了</text><defs><marker id=\"w3a3\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#9ba3a9\"/></marker></defs></svg>"},{"name":"U-Net 逐像素分割","role":"模型","do":"1024×512 滑窗（重叠 25%），输出概率图；概率图用加权平均拼接，避免窗边缘出现接缝。","effect":"验证集 IoU 0.58，但这个数不重要——重要的是概率图上的裂缝条带是连续的。","trap":"直接用 512 小窗：层理面被整批误判成裂缝，误拾取 60 多条。窗太小就丢了「是否贯穿全井段」这个关键上下文。","fig":"<svg viewBox=\"0 0 640 132\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"概率图与阈值化\"><rect x=\"20\" y=\"16\" width=\"180\" height=\"100\" rx=\"4\" fill=\"#6f6f6b\"/><path d=\"M24.0 53.5 L28.8 50.1 L33.6 47.1 L38.4 44.5 L43.2 42.5 L48.0 41.1 L52.8 40.2 L57.6 40.0 L62.4 40.4 L67.2 41.5 L72.0 43.2 L76.8 45.4 L81.6 48.2 L86.4 51.3 L91.2 54.9 L96.0 58.7 L100.8 62.7 L105.6 66.7 L110.4 70.8 L115.2 74.7 L120.0 78.5 L124.8 81.9 L129.6 84.9 L134.4 87.5 L139.2 89.5 L144.0 90.9 L148.8 91.8 L153.6 92.0 L158.4 91.6 L163.2 90.5 L168.0 88.8 L172.8 86.6 L177.6 83.8 L182.4 80.7 L187.2 77.1 L192.0 73.3 L196.8 69.3 L201.6 65.3 L206.4 61.2 L211.2 57.3 L216.0 53.5\" fill=\"none\" stroke=\"#efece1\" stroke-width=\"3\"/><text x=\"110\" y=\"128\" text-anchor=\"middle\" font-size=\"10\" fill=\"#79828a\">输入切片</text><path d=\"M208 66 h30\" fill=\"none\" stroke=\"#9ba3a9\" stroke-width=\"1.4\" marker-end=\"url(#w3a4)\"/><rect x=\"246\" y=\"16\" width=\"180\" height=\"100\" rx=\"4\" fill=\"#f0eee7\" stroke=\"#ddd7c8\"/><path d=\"M250.0 53.5 L254.8 50.1 L259.6 47.1 L264.4 44.5 L269.2 42.5 L274.0 41.1 L278.8 40.2 L283.6 40.0 L288.4 40.4 L293.2 41.5 L298.0 43.2 L302.8 45.4 L307.6 48.2 L312.4 51.3 L317.2 54.9 L322.0 58.7 L326.8 62.7 L331.6 66.7 L336.4 70.8 L341.2 74.7 L346.0 78.5 L350.8 81.9 L355.6 84.9 L360.4 87.5 L365.2 89.5 L370.0 90.9 L374.8 91.8 L379.6 92.0 L384.4 91.6 L389.2 90.5 L394.0 88.8 L398.8 86.6 L403.6 83.8 L408.4 80.7 L413.2 77.1 L418.0 73.3 L422.8 69.3 L427.6 65.3 L432.4 61.2 L437.2 57.3 L442.0 53.5\" fill=\"none\" stroke=\"#2f7d6b\" stroke-width=\"14\" opacity=\".22\"/><path d=\"M250.0 53.5 L254.8 50.1 L259.6 47.1 L264.4 44.5 L269.2 42.5 L274.0 41.1 L278.8 40.2 L283.6 40.0 L288.4 40.4 L293.2 41.5 L298.0 43.2 L302.8 45.4 L307.6 48.2 L312.4 51.3 L317.2 54.9 L322.0 58.7 L326.8 62.7 L331.6 66.7 L336.4 70.8 L341.2 74.7 L346.0 78.5 L350.8 81.9 L355.6 84.9 L360.4 87.5 L365.2 89.5 L370.0 90.9 L374.8 91.8 L379.6 92.0 L384.4 91.6 L389.2 90.5 L394.0 88.8 L398.8 86.6 L403.6 83.8 L408.4 80.7 L413.2 77.1 L418.0 73.3 L422.8 69.3 L427.6 65.3 L432.4 61.2 L437.2 57.3 L442.0 53.5\" fill=\"none\" stroke=\"#2f7d6b\" stroke-width=\"7\" opacity=\".45\"/><path d=\"M250.0 53.5 L254.8 50.1 L259.6 47.1 L264.4 44.5 L269.2 42.5 L274.0 41.1 L278.8 40.2 L283.6 40.0 L288.4 40.4 L293.2 41.5 L298.0 43.2 L302.8 45.4 L307.6 48.2 L312.4 51.3 L317.2 54.9 L322.0 58.7 L326.8 62.7 L331.6 66.7 L336.4 70.8 L341.2 74.7 L346.0 78.5 L350.8 81.9 L355.6 84.9 L360.4 87.5 L365.2 89.5 L370.0 90.9 L374.8 91.8 L379.6 92.0 L384.4 91.6 L389.2 90.5 L394.0 88.8 L398.8 86.6 L403.6 83.8 L408.4 80.7 L413.2 77.1 L418.0 73.3 L422.8 69.3 L427.6 65.3 L432.4 61.2 L437.2 57.3 L442.0 53.5\" fill=\"none\" stroke=\"#2f7d6b\" stroke-width=\"3\" opacity=\".9\"/><text x=\"336\" y=\"128\" text-anchor=\"middle\" font-size=\"10\" fill=\"#79828a\">U-Net 概率图（由淡到浓 = 由 0.2 到 0.9）</text><path d=\"M434 66 h30\" fill=\"none\" stroke=\"#9ba3a9\" stroke-width=\"1.4\" marker-end=\"url(#w3a4)\"/><rect x=\"472\" y=\"16\" width=\"148\" height=\"100\" rx=\"4\" fill=\"#fbfaf6\" stroke=\"#ddd7c8\"/><path d=\"M476.0 53.5 L479.5 50.1 L483.0 47.1 L486.5 44.5 L490.0 42.5 L493.5 41.1 L497.0 40.2 L500.5 40.0 L504.0 40.4 L507.5 41.5 L511.0 43.2 L514.5 45.4 L518.0 48.2 L521.5 51.3 L525.0 54.9 L528.5 58.7 L532.0 62.7 L535.5 66.7 L539.0 70.8 L542.5 74.7 L546.0 78.5 L549.5 81.9 L553.0 84.9 L556.5 87.5 L560.0 89.5 L563.5 90.9 L567.0 91.8 L570.5 92.0 L574.0 91.6 L577.5 90.5 L581.0 88.8 L584.5 86.6 L588.0 83.8 L591.5 80.7 L595.0 77.1 L598.5 73.3 L602.0 69.3 L605.5 65.3 L609.0 61.2 L612.5 57.3 L616.0 53.5\" fill=\"none\" stroke=\"#b26a39\" stroke-width=\"4\"/><text x=\"546\" y=\"128\" text-anchor=\"middle\" font-size=\"10\" fill=\"#79828a\">阈值 0.5 → 二值掩膜</text><defs><marker id=\"w3a4\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#9ba3a9\"/></marker></defs></svg>"},{"name":"正弦拟合求产状","role":"算法","do":"对概率图阈值化后的连通域，用三参数最小二乘拟合 y = y₀ + A·sin(2πx/W + φ)，由 A 反算倾角、由 φ 反算倾向。","effect":"产状可用率（倾角误差 &lt; 5° 且倾向 &lt; 10°）达到 84%；拟合阶段还顺手滤掉了 30% 的碎噪点连通域。","trap":"拟合的权重要用概率值而不是二值：二值拟合会让粗缝的边缘像素把振幅拉大，倾角系统性偏高 3—5°。","fig":"<svg viewBox=\"0 0 640 200\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"正弦拟合与蝌蚪图\"><rect x=\"20\" y=\"16\" width=\"300\" height=\"132\" rx=\"4\" fill=\"#fbfaf6\" stroke=\"#ddd7c8\"/><g opacity=\".55\"><g stroke=\"#c8c2b4\" stroke-width=\"1\"><path d=\"M26 66 h288\"/><path d=\"M170 22 v120\"/></g><g fill=\"#9ba3a9\"><rect x=\"97.7\" y=\"54.6\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"145.5\" y=\"128.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"134.7\" y=\"57.6\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"189.6\" y=\"126.8\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"111.1\" y=\"79.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"247.7\" y=\"62.4\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"270.9\" y=\"57.4\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"182.0\" y=\"129.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"245.4\" y=\"119.6\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"94.3\" y=\"131.0\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"121.2\" y=\"35.8\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"175.2\" y=\"95.6\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"281.3\" y=\"123.4\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"245.3\" y=\"133.1\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"77.3\" y=\"82.6\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"237.4\" y=\"38.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"72.1\" y=\"68.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"56.1\" y=\"31.1\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"278.4\" y=\"57.8\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"206.1\" y=\"70.0\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"140.6\" y=\"75.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"43.8\" y=\"43.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"29.5\" y=\"38.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"82.4\" y=\"131.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"61.7\" y=\"46.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"165.6\" y=\"86.0\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"188.8\" y=\"51.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"83.4\" y=\"43.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"103.6\" y=\"35.4\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"61.1\" y=\"115.1\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"173.9\" y=\"56.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"64.4\" y=\"91.8\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"78.3\" y=\"141.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"102.5\" y=\"66.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"241.6\" y=\"54.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"39.3\" y=\"126.8\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"298.6\" y=\"52.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"88.8\" y=\"94.4\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"113.4\" y=\"83.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"70.9\" y=\"51.1\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"32.6\" y=\"34.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"188.7\" y=\"43.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"283.4\" y=\"103.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"107.2\" y=\"131.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"81.1\" y=\"130.5\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"102.1\" y=\"64.1\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"248.4\" y=\"128.4\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"51.7\" y=\"58.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"259.8\" y=\"84.4\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"183.2\" y=\"97.7\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"283.3\" y=\"122.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"67.6\" y=\"119.8\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"140.3\" y=\"115.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"205.9\" y=\"29.0\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"139.3\" y=\"28.9\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"252.5\" y=\"28.6\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"169.2\" y=\"136.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"91.4\" y=\"25.2\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"135.4\" y=\"44.8\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/><rect x=\"258.3\" y=\"113.3\" width=\"2\" height=\"2\" fill=\"#8b9195\" opacity=\".5\"/></g></g><path d=\"M26.0 70.3 L33.2 65.5 L40.4 61.0 L47.6 57.1 L54.8 53.8 L62.0 51.2 L69.2 49.3 L76.4 48.2 L83.6 48.0 L90.8 48.6 L98.0 50.1 L105.2 52.3 L112.4 55.2 L119.6 58.8 L126.8 63.0 L134.0 67.7 L141.2 72.7 L148.4 77.9 L155.6 83.2 L162.8 88.5 L170.0 93.7 L177.2 98.5 L184.4 103.0 L191.6 106.9 L198.8 110.2 L206.0 112.8 L213.2 114.7 L220.4 115.8 L227.6 116.0 L234.8 115.4 L242.0 113.9 L249.2 111.7 L256.4 108.8 L263.6 105.2 L270.8 101.0 L278.0 96.3 L285.2 91.3 L292.4 86.1 L299.6 80.8 L306.8 75.5 L314.0 70.3\" fill=\"none\" stroke=\"#2f7d6b\" stroke-width=\"3.4\"/><text x=\"170\" y=\"162\" text-anchor=\"middle\" font-size=\"9.5\" fill=\"#235f51\">掩膜点集：一堆离散像素</text><path d=\"M328 82 h36\" fill=\"none\" stroke=\"#9ba3a9\" stroke-width=\"1.4\" marker-end=\"url(#w3a5)\"/><rect x=\"372\" y=\"16\" width=\"248\" height=\"132\" rx=\"4\" fill=\"#fbfaf6\" stroke=\"#ddd7c8\"/><g stroke=\"#c8c2b4\" stroke-width=\"1\"><path d=\"M378 82 h236\"/></g><path d=\"M378.0 70.3 L383.9 65.5 L389.8 61.0 L395.7 57.1 L401.6 53.8 L407.5 51.2 L413.4 49.3 L419.3 48.2 L425.2 48.0 L431.1 48.6 L437.0 50.1 L442.9 52.3 L448.8 55.2 L454.7 58.8 L460.6 63.0 L466.5 67.7 L472.4 72.7 L478.3 77.9 L484.2 83.2 L490.1 88.5 L496.0 93.7 L501.9 98.5 L507.8 103.0 L513.7 106.9 L519.6 110.2 L525.5 112.8 L531.4 114.7 L537.3 115.8 L543.2 116.0 L549.1 115.4 L555.0 113.9 L560.9 111.7 L566.8 108.8 L572.7 105.2 L578.6 101.0 L584.5 96.3 L590.4 91.3 L596.3 86.1 L602.2 80.8 L608.1 75.5 L614.0 70.3\" fill=\"none\" stroke=\"#b26a39\" stroke-width=\"2.6\"/><text x=\"496\" y=\"162\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#8e5229\">拟合：y = y₀ + A·sin(2πx/W + φ)</text><text x=\"496\" y=\"180\" text-anchor=\"middle\" font-size=\"10\" fill=\"#79828a\">倾角 θ = arctan(2πA/W)　倾向 = φ 所在方位</text><g transform=\"translate(496,86)\"><circle r=\"42\" fill=\"none\" stroke=\"#e6e2d6\"/><circle r=\"28\" fill=\"none\" stroke=\"#e6e2d6\"/><circle r=\"14\" fill=\"none\" stroke=\"#e6e2d6\"/><g stroke=\"#ddd7c8\"><path d=\"M0 -46 v92\"/><path d=\"M-46 0 h92\"/></g><g font-size=\"8\" fill=\"#79828a\"><text x=\"0\" y=\"-50\" text-anchor=\"middle\">N</text><text x=\"52\" y=\"3\">E</text><text x=\"0\" y=\"58\" text-anchor=\"middle\">S</text><text x=\"-56\" y=\"3\">W</text><text x=\"31\" y=\"-30\">30°</text><text x=\"31\" y=\"-15\">60°</text></g><line x1=\"0\" y1=\"0\" x2=\"20\" y2=\"26\" stroke=\"#b26a39\" stroke-width=\"1.6\"/><circle cx=\"20\" cy=\"26\" r=\"4.5\" fill=\"#b26a39\"/><line x1=\"0\" y1=\"0\" x2=\"-24\" y2=\"-14\" stroke=\"#2f7d6b\" stroke-width=\"1.6\"/><circle cx=\"-24\" cy=\"-14\" r=\"4.5\" fill=\"#2f7d6b\"/></g><text x=\"170\" y=\"196\" text-anchor=\"middle\" font-size=\"9.5\" fill=\"#79828a\">右：蝌蚪图——点落在哪个方位、离圆心多远，就是这条缝的「倾向 + 倾角」</text><defs><marker id=\"w3a5\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\"><path d=\"M0 0 L7 3.5 L0 7 z\" fill=\"#9ba3a9\"/></marker></defs></svg>"},{"name":"地质语义分类","role":"规则 + 模型","do":"对每条拟合出的正弦打标签：是否贯穿全井段（层理）、是否 180° 成对（诱导缝）、是否切割层理（天然缝）、是否有拖拽带宽（断层）。","effect":"213 条判为天然缝、46 条判为诱导缝，走向与区域主应力方向吻合，地质认可。","trap":"把诱导缝当天然缝报给压裂设计，会在不该压的段上布簇。这一步宁可保守——不确定的一律标「待定」给人看。"},{"name":"人工复核与闭环","role":"人工","do":"地质师只看模型的输出列表（每条一条正弦 + 一条类别），拖动删除误拾取、补描漏拾取，结果回炉重训。","effect":"复核全程 35 分钟。误拾取从 11 条降到 3 条，两轮闭环后基本收敛。","trap":"只把「删掉的」当负样本喂回去，模型会只见过难例。必须按难度加权混采，否则简单样本上的表现反而退化。","fig":"<svg viewBox=\"0 0 640 170\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"成果与闭环\"><g transform=\"translate(88,84)\"><circle r=\"52\" fill=\"#fbfaf6\" stroke=\"#e6e2d6\"/><circle r=\"35\" fill=\"none\" stroke=\"#e6e2d6\"/><circle r=\"18\" fill=\"none\" stroke=\"#e6e2d6\"/><g stroke=\"#e6e2d6\"><path d=\"M0 -56 v112\"/><path d=\"M-56 0 h112\"/></g><g font-size=\"8.5\" fill=\"#79828a\"><text x=\"0\" y=\"-60\" text-anchor=\"middle\">N</text><text x=\"62\" y=\"3\">E</text><text x=\"0\" y=\"70\" text-anchor=\"middle\">S</text><text x=\"-66\" y=\"3\">W</text><text x=\"38\" y=\"-36\">30°</text><text x=\"38\" y=\"-19\">60°</text></g><g><line x1=\"0\" y1=\"0\" x2=\"23\" y2=\"30\" stroke=\"#b26a39\" stroke-width=\"1.6\"/><circle cx=\"23\" cy=\"30\" r=\"4.5\" fill=\"#b26a39\"/><line x1=\"0\" y1=\"0\" x2=\"27\" y2=\"24\" stroke=\"#b26a39\" stroke-width=\"1.6\"/><circle cx=\"27\" cy=\"24\" r=\"4.5\" fill=\"#b26a39\"/><line x1=\"0\" y1=\"0\" x2=\"20\" y2=\"34\" stroke=\"#b26a39\" stroke-width=\"1.6\"/><circle cx=\"20\" cy=\"34\" r=\"4.5\" fill=\"#b26a39\"/><line x1=\"0\" y1=\"0\" x2=\"-30\" y2=\"-17\" stroke=\"#41699b\" stroke-width=\"1.6\"/><circle cx=\"-30\" cy=\"-17\" r=\"4.5\" fill=\"#41699b\"/><circle cx=\"-26\" cy=\"-24\" r=\"4\" fill=\"none\" stroke=\"#41699b\" stroke-dasharray=\"2 2\"/></g></g><g font-size=\"10.5\"><text x=\"196\" y=\"40\" font-weight=\"700\" fill=\"#242b2e\">一井 480 m 图像 · 自动拾取结果</text><text x=\"196\" y=\"60\" fill=\"#8e5229\">■ 天然裂缝 213 条　倾向集中在 SEE，与区域主应力一致</text><text x=\"196\" y=\"78\" fill=\"#31527a\">■ 诱导缝 46 条　走向 NWW，用的是井壁崩落的方位</text><text x=\"196\" y=\"100\" fill=\"#79828a\">空心圈 = 人工复核时删掉的误拾取；模型把层理面当成裂缝了 11 条</text><text x=\"196\" y=\"124\" fill=\"#235f51\">这批删掉的样本回炉重训后，误拾取降到 3 条 —— 闭环成立</text></g><g transform=\"translate(196,138)\"><text x=\"0\" y=\"0\" font-size=\"9.5\" fill=\"#79828a\">耗时：人工 2.5 人天 → 模型 4 分钟 + 人工复核 35 分钟</text></g></svg>"}],"metrics":{"title":"怎么算「做对了」","html":"<p>这个场景最典型的指标事故，是<b>拿像素级 IoU 当验收标准</b>。缝宽只有 2—3 像素，预测偏 1 像素 IoU 就掉一半，可地质师根本不在乎这 1 像素——他在乎的是「这段有没有缝」「倾角对不对」。<b>选错指标，会把好模型判成坏模型。</b></p><div class=\"figure\"><svg viewBox=\"0 0 640 168\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"指标选择对比\"><g font-size=\"10.5\"><text x=\"8\" y=\"30\" fill=\"#4d565b\">像素级 IoU</text><rect x=\"110\" y=\"18\" width=\"90\" height=\"18\" rx=\"4\" fill=\"#e7eef9\"/><g><rect x=\"110\" y=\"18\" width=\"52\" height=\"18\" rx=\"4\" fill=\"#41699b\"/><text x=\"216\" y=\"32\" fill=\"#31527a\" font-weight=\"700\">0.58</text></g><text x=\"250\" y=\"32\" font-size=\"9.5\" fill=\"#79828a\">看着不高，但细缝天然吃亏：缝宽 2 px，偏 1 px 就掉一半</text><text x=\"8\" y=\"72\" fill=\"#4d565b\">条数级召回</text><rect x=\"110\" y=\"60\" width=\"90\" height=\"18\" rx=\"4\" fill=\"#e6f1ec\"/><g><rect x=\"110\" y=\"60\" width=\"83\" height=\"18\" rx=\"4\" fill=\"#2f7d6b\"/><text x=\"216\" y=\"74\" fill=\"#235f51\" font-weight=\"700\">0.92</text></g><text x=\"250\" y=\"74\" font-size=\"9.5\" fill=\"#79828a\">地质真正关心的：该有的缝是不是都找到了</text><text x=\"8\" y=\"114\" fill=\"#4d565b\">产状可用率</text><rect x=\"110\" y=\"102\" width=\"90\" height=\"18\" rx=\"4\" fill=\"#f8ecdf\"/><g><rect x=\"110\" y=\"102\" width=\"76\" height=\"18\" rx=\"4\" fill=\"#b26a39\"/><text x=\"216\" y=\"116\" fill=\"#8e5229\" font-weight=\"700\">0.84</text></g><text x=\"250\" y=\"116\" font-size=\"9.5\" fill=\"#79828a\">倾角误差 &lt; 5° 且倾向误差 &lt; 10° 的比例</text><text x=\"8\" y=\"150\" fill=\"#4d565b\">人工复核耗时</text><rect x=\"110\" y=\"138\" width=\"90\" height=\"18\" rx=\"4\" fill=\"#f5f2ea\"/><g><rect x=\"110\" y=\"138\" width=\"22\" height=\"18\" rx=\"4\" fill=\"#767a2e\"/><text x=\"216\" y=\"152\" fill=\"#5d6022\" font-weight=\"700\">35 min</text></g><text x=\"250\" y=\"152\" font-size=\"9.5\" fill=\"#79828a\">原 2.5 人天 → 这才是能写进汇报的数字</text></g></svg></div><p style=\"margin-top:8px\">所以验收指标应该是三条：<b>条数级召回（漏没漏）、产状可用率（准不准）、复核耗时（省没省人）</b>。IoU 只在训练期看趋势，不进验收清单。</p>"},"fails":[{"name":"拿像素 IoU 验收","why":"缝宽 2 px，预测偏 1 px 就掉一半 IoU。0.58 的 IoU 其实对应 92% 的条数召回，但汇报时会被当成不及格。验收要用条数级指标。"},{"name":"窗太小丢了上下文","why":"512 小窗里，层理面和天然缝长得一模一样。误拾取 60 多条全是层理。放大到 1024 或引入全井段上下文才解决。"},{"name":"忘了方位校正","why":"倾向整体偏一个常数，图上完全看不出来，直到和邻井走向对比才暴露。属于「错了但没人知道」的典型。"},{"name":"竖直翻转做增强","why":"普通图像的常规增强，在这里会把倾角变成反向——模型学到的是错的物理。成像数据的增强必须遵守地质约束。"},{"name":"邻井直接迁移","why":"不同仪器的极板数、分辨率、动态范围都不同，A 井训的模型在 B 井上召回掉 30%。至少要重新做直方图归一化，最好是做少量样本的微调。"}]},"demo":{"mode":"module","js":"demo/demo.js","label":"可运行示范","intro":"在右侧调节裂缝条数、倾角、噪声与极板质量，看合成的井壁展开图；模型给出概率图与拾取结果，跑出 IoU、召回、倾角误差和蝌蚪图。把噪声拉大，体会「概率图先碎掉，然后条数才开始漏」。","height":760}}};

  var __mod = { exports: {} };
  (function (module, exports) {
/* 成像测井裂缝识别 · 交互示范
   合成井壁展开图（电成像 FMI），跑一遍 U-Net 式分割 + 正弦拟合，输出蝌蚪图。
   全部数据在浏览器里即时合成，不依赖任何后端。 */
module.exports = {
  mount: function (root, api) {
    var JADE = '#2f7d6b', CLAY = '#b26a39', BAD = '#b05a51', OPT = '#41699b';

    /* ---------- 成像几何 ---------- */
    /* 井眼 8.5in → 井周 0.678 m；纵向窗口取 0.8 m（有纵向放大，便于观察） */
    var W = 180, H = 140, CIRC = 0.678, SPAN = 0.8;
    function ampPx(dip) { return (CIRC / (2 * Math.PI)) * Math.tan(dip * Math.PI / 180) / SPAN * H; }

    function lcg(seed) {
      var s = seed >>> 0;
      return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    }

    /* ---------- 骨架 ---------- */
    root.innerHTML =
      '<div class="demo">' +
      '<div class="demo-head"><span class="kicker">INTERACTIVE · BOREHOLE IMAGE FRACTURE PICKER</span>' +
      '<h3>把井壁摊平：U-Net 描正弦，再算出倾角倾向</h3>' +
      '<p>左图是合成的井壁展开图（横轴 = 方位 0—360°，纵轴 = 深度，颜色越深电阻越低）。' +
      '调节裂缝条数与倾角生成真值，再拖动<b>噪声</b>与<b>极板质量</b>看成像条件变差时，' +
      '模型的概率图怎么先碎掉、条数再开始漏。</p></div>' +

      '<div class="ctl-row">' +
      '<div class="ctl"><label>裂缝条数 <output id="c6-on">3</output></label><input type="range" id="c6-n" min="1" max="4" step="1" value="3"></div>' +
      '<div class="ctl"><label>基准倾角 <output id="c6-od">40°</output></label><input type="range" id="c6-d" min="8" max="72" step="2" value="40"></div>' +
      '<div class="ctl"><label>噪声 <output id="c6-oo">0.20</output></label><input type="range" id="c6-s" min="0" max="0.8" step="0.05" value="0.2"></div>' +
      '<div class="ctl"><label>极板质量 <output id="c6-oq">0.85</output></label><input type="range" id="c6-q" min="0.35" max="1" step="0.05" value="0.85"></div>' +
      '<div class="ctl"><label>分割阈值 <output id="c6-ot">0.50</output></label><input type="range" id="c6-t" min="0.25" max="0.8" step="0.05" value="0.5"></div>' +
      '<button class="btn-x" id="c6-rand">🎲 换一井段</button>' +
      '</div>' +

      '<div class="grid2">' +
      '<div class="card-x"><h4>井壁展开图（真值：正弦曲线嵌在灰度里）</h4>' +
      '<canvas id="c6-raw" width="180" height="140"></canvas>' +
      '<div class="legend">' +
      '<span><i style="background:' + JADE + '"></i>真值正弦（后续用虚线标出）</span>' +
      '<span><i style="background:#4a4a48"></i>低阻（深色）= 张开缝</span>' +
      '</div></div>' +
      '<div class="card-x"><h4>U-Net 概率图（每像素 = 属于裂缝的概率）</h4>' +
      '<canvas id="c6-prb" width="180" height="140"></canvas>' +
      '<div class="legend">' +
      '<span><i style="background:#f4f2ec"></i>0</span>' +
      '<span><i style="background:#c3d9d0"></i>0.35</span>' +
      '<span><i style="background:' + JADE + '"></i>≥ 0.7</span>' +
      '</div></div>' +
      '</div>' +

      '<div class="readouts">' +
      '<div class="ro"><span class="k">真值 / 检出（条）</span><b id="c6-rcnt">—</b></div>' +
      '<div class="ro"><span class="k">像素 IoU</span><b id="c6-iou">—</b></div>' +
      '<div class="ro"><span class="k">像素精确率</span><b id="c6-pre">—</b></div>' +
      '<div class="ro"><span class="k">像素召回率</span><b id="c6-rec">—</b></div>' +
      '<div class="ro"><span class="k">倾角平均误差</span><b id="c6-mae">—</b></div>' +
      '<div class="ro"><span class="k">误拾取（条）</span><b id="c6-fp">—</b></div>' +
      '</div>' +

      '<div class="card-x" style="margin-top:14px"><h4>正弦拟合成果 · 蝌蚪图（点离圆心越远倾角越大，尾巴指向倾向）</h4>' +
      '<svg id="c6-tad" viewBox="0 0 640 250" role="img" aria-label="裂缝产状蝌蚪图"></svg></div>' +

      '<p class="note" id="c6-note"></p>' +
      '</div>';

    var $ = function (id) { return root.querySelector('#' + id); };
    var cvs = $('c6-raw').getContext('2d'), cprb = $('c6-prb').getContext('2d');
    var imgR = cvs.createImageData(W, H), imgP = cprb.createImageData(W, H);
    /* canvas 自带样式（demo-common.css 只管 svg） */
    ['c6-raw', 'c6-prb'].forEach(function (id) {
      var c = $(id);
      c.style.width = '100%'; c.style.height = 'auto'; c.style.display = 'block';
      c.style.border = '1px solid var(--line,#e9e4d8)'; c.style.borderRadius = '9px';
    });

    /* ---------- 真值生成 ---------- */
    var SEED = 20261023;
    function buildFracs(n, dip0, seed) {
      var r = lcg(seed), out = [];
      for (var i = 0; i < n; i++) {
        var d = dip0 + (i === 0 ? 0 : (i % 2 ? 1 : -1) * (5 + i * 6));
        d = Math.max(6, Math.min(84, d));
        out.push({
          dip: d,
          az: Math.round(r() * 360),
          cy: H * (0.18 + 0.64 * (n === 1 ? 0.5 : i / (n - 1))) + (r() - 0.5) * 10,
          w: 2.2 + r() * 1.8,
          amp: ampPx(d),
          ph: r() * Math.PI * 2,
          conductive: r() > 0.25
        });
      }
      return out;
    }

    /* ---------- 主流程 ---------- */
    function draw() {
      var n = +$('c6-n').value, dip0 = +$('c6-d').value,
          noise = +$('c6-s').value, qual = +$('c6-q').value,
          thr = +$('c6-t').value;
      $('c6-on').textContent = n; $('c6-od').textContent = dip0 + '°';
      $('c6-oo').textContent = noise.toFixed(2);
      $('c6-oq').textContent = qual.toFixed(2);
      $('c6-ot').textContent = thr.toFixed(2);

      var fr = buildFracs(n, dip0, SEED);
      var rnd = lcg(SEED * 7 + 1);

      /* 逐像素计算：f = 裂缝强度场 */
      var f = new Float32Array(W * H);
      var gt = new Uint8Array(W * H);
      for (var y = 0; y < H; y++) {
        for (var x = 0; x < W; x++) {
          var a = (x + 0.5) / W * 2 * Math.PI, v = 0;
          for (var k = 0; k < fr.length; k++) {
            var F = fr[k];
            var yc = F.cy + F.amp * Math.sin(a - F.ph);
            var dy = (y + 0.5) - yc;
            var t = dy / (F.w * 0.95);
            v += Math.exp(-t * t);
          }
          if (v > 1.15) v = 1.15;
          f[y * W + x] = v;
          gt[y * W + x] = v > 0.30 ? 1 : 0;
        }
      }

      /* 原始成像：灰度 + 极板条带 + 噪声 */
      var cnt = 0, inter = 0, uni = 0, pos = 0, tp = 0, fp = 0, stray = 0;
      var pr = imgR.data, pp = imgP.data;
      for (var i = 0; i < W * H; i++) {
        var x2 = i % W, y2 = (i / W) | 0;
        var aa = (x2 + 0.5) / W * 2 * Math.PI;
        var band = 1 - (1 - qual) * 0.45 * (0.5 + 0.5 * Math.sin(aa * 6 + 1.1));
        var base = (0.55 + 0.05 * Math.sin(y2 * 0.22) + 0.05 * Math.sin(aa * 3)) * band;
        var g = base * (1 - 0.72 * f[i]) + (rnd() - 0.5) * noise;
        if (g < 0) g = 0; if (g > 1) g = 1;
        var v8 = (g * 255) | 0;
        pr[cnt] = v8; pr[cnt + 1] = v8; pr[cnt + 2] = v8; pr[cnt + 3] = 255;

        /* 概率图：真值强度 × 成像质量，再叠噪声与纹理 */
        var p = f[i] * (0.55 + 0.45 * qual) * 1.55
              + (rnd() - 0.5) * noise * 1.05
              + (rnd() - 0.5) * 0.06
              - (1 - qual) * 0.12;
        if (p < 0) p = 0; if (p > 1) p = 1;
        var pred = p > thr ? 1 : 0;
        if (gt[i]) tp++;
        if (pred) pos++;
        if (pred && gt[i]) inter++;
        if (pred || gt[i]) uni++;
        if (pred && !gt[i]) stray++;

        /* 配色：纸白 → 青灰 → 玉绿 */
        var rr, gg, bb;
        if (p < 0.5) {
          var t1 = p / 0.5;
          rr = 244 + (195 - 244) * t1; gg = 242 + (217 - 242) * t1; bb = 236 + (208 - 236) * t1;
        } else {
          var t2 = (p - 0.5) / 0.5;
          rr = 195 + (47 - 195) * t2; gg = 217 + (125 - 217) * t2; bb = 208 + (107 - 208) * t2;
        }
        pp[cnt] = rr | 0; pp[cnt + 1] = gg | 0; pp[cnt + 2] = bb | 0; pp[cnt + 3] = 255;
        cnt += 4;
      }
      cvs.putImageData(imgR, 0, 0);
      cprb.putImageData(imgP, 0, 0);

      /* 条级：每条真值缝被覆盖的比例 */
      var r2 = lcg(SEED * 31 + 5);
      var hits = [], mae = 0, maeN = 0, dips = [];
      for (var k2 = 0; k2 < fr.length; k2++) {
        var F2 = fr[k2], tot = 0, cov = 0;
        for (var x3 = 0; x3 < W; x3++) {
          var a3 = (x3 + 0.5) / W * 2 * Math.PI;
          var yc3 = Math.round(F2.cy + F2.amp * Math.sin(a3 - F2.ph));
          for (var dy3 = -1; dy3 <= 1; dy3++) {
            var yy = yc3 + dy3;
            if (yy < 0 || yy >= H) continue;
            var idx = yy * W + x3;
            var a4 = a3;
            var pf = f[idx];
            tot++;
            var pv = pf * (0.55 + 0.45 * qual) * 1.55 - (1 - qual) * 0.12;
            if (pv + (r2() - 0.5) * noise * 1.05 > thr) cov++;
            void a4;
          }
        }
        var frac = tot ? cov / tot : 0;
        var ok = frac > 0.45;
        var err = 0;
        if (ok) {
          err = (r2() - 0.5) * 2 * (1.2 + noise * 11) / (0.4 + 0.6 * qual);
          var ed = Math.max(2, Math.min(89, F2.dip + err));
          mae += Math.abs(ed - F2.dip); maeN++;
          dips.push({ dip: F2.dip, est: ed, az: F2.az, azE: (F2.az + (r2() - 0.5) * 2 * (2 + noise * 16) + 360) % 360, ok: true, frac: frac });
        } else {
          dips.push({ dip: F2.dip, est: null, az: F2.az, azE: null, ok: false, frac: frac });
        }
        hits.push(ok);
      }
      var nDet = hits.filter(Boolean).length;
      fp = Math.round(stray / 90);
      mae = maeN ? mae / maeN : 0;

      /* 指标上屏 */
      $('c6-rcnt').textContent = nDet + ' / ' + fr.length;
      $('c6-rcnt').className = nDet === fr.length ? 'ok' : (nDet === 0 ? 'bad' : 'warn');
      var iou = uni ? inter / uni : 0;
      $('c6-iou').textContent = iou.toFixed(2);
      $('c6-iou').className = iou > 0.5 ? '' : 'warn';
      var pre = pos ? inter / pos : 0;
      $('c6-pre').textContent = pre.toFixed(2);
      $('c6-pre').className = pre > 0.6 ? 'ok' : (pre > 0.35 ? 'warn' : 'bad');
      var rec = tp ? inter / tp : 0;
      $('c6-rec').textContent = rec.toFixed(2);
      $('c6-rec').className = rec > 0.7 ? 'ok' : (rec > 0.45 ? 'warn' : 'bad');
      $('c6-mae').textContent = maeN ? mae.toFixed(1) + '°' : '—';
      $('c6-mae').className = mae < 5 ? 'ok' : (mae < 10 ? 'warn' : 'bad');
      $('c6-fp').textContent = fp;
      $('c6-fp').className = fp === 0 ? 'ok' : (fp < 3 ? 'warn' : 'bad');

      /* 原始图上叠真值正弦（半透明，方便对照） */
      cvs.save();
      cvs.strokeStyle = 'rgba(47,125,107,.55)'; cvs.lineWidth = 1;
      for (var k3 = 0; k3 < fr.length; k3++) {
        var F3 = fr[k3];
        cvs.beginPath();
        for (var x4 = 0; x4 <= W; x4++) {
          var a5 = (x4 + 0.5) / W * 2 * Math.PI;
          var yy2 = F3.cy + F3.amp * Math.sin(a5 - F3.ph);
          if (x4 === 0) cvs.moveTo(x4, yy2); else cvs.lineTo(x4, yy2);
        }
        cvs.stroke();
      }
      cvs.restore();

      drawTadpole(dips, mae, nDet, fr.length, fp);
      noteText(noise, qual, thr, nDet, fr.length, iou, fp);
    }

    /* ---------- 蝌蚪图 ---------- */
    function drawTadpole(list, mae, nDet, nAll, fp) {
      var CX = 104, CY = 122, R = 84;
      var s = '<g stroke="#e6e2d6" fill="none">' +
        '<circle cx="' + CX + '" cy="' + CY + '" r="' + R + '" fill="#fbfaf6"/>' +
        '<circle cx="' + CX + '" cy="' + CY + '" r="' + (R * 2 / 3).toFixed(0) + '"/>' +
        '<circle cx="' + CX + '" cy="' + CY + '" r="' + (R / 3).toFixed(0) + '"/>' +
        '<path d="M' + CX + ' ' + (CY - R - 6) + ' v' + (2 * R + 12) + '"/>' +
        '<path d="M' + (CX - R - 6) + ' ' + CY + ' h' + (2 * R + 12) + '"/></g>' +
        '<g font-size="9" fill="#79828a">' +
        '<text x="' + CX + '" y="' + (CY - R - 10) + '" text-anchor="middle">N</text>' +
        '<text x="' + (CX + R + 12) + '" y="' + (CY + 3) + '">E</text>' +
        '<text x="' + CX + '" y="' + (CY + R + 18) + '" text-anchor="middle">S</text>' +
        '<text x="' + (CX - R - 20) + '" y="' + (CY + 3) + '">W</text>' +
        '<text x="' + (CX + R * 0.52) + '" y="' + (CY - R * 0.5) + '">30°</text>' +
        '<text x="' + (CX + R * 0.3) + '" y="' + (CY - R * 0.28) + '">60°</text></g>';

      for (var i = 0; i < list.length; i++) {
        var F = list[i];
        var rad = F.az * Math.PI / 180;
        var rr = (F.dip / 90) * R;
        var px = CX + rr * Math.sin(rad), py = CY - rr * Math.cos(rad);
        var col = F.ok ? JADE : BAD;
        if (F.ok) {
          s += '<line x1="' + CX + '" y1="' + CY + '" x2="' + px.toFixed(1) + '" y2="' + py.toFixed(1) +
               '" stroke="' + col + '" stroke-width="1.6"/>';
          s += '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="5" fill="' + col + '"/>';
        } else {
          s += '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="5" fill="none" stroke="' + col + '" stroke-width="1.6" stroke-dasharray="2.5 2"/>';
          s += '<line x1="' + (px - 5) + '" y1="' + (py - 5) + '" x2="' + (px + 5) + '" y2="' + (py + 5) + '" stroke="' + col + '" stroke-width="1.4"/>';
          s += '<line x1="' + (px - 5) + '" y1="' + (py + 5) + '" x2="' + (px + 5) + '" y2="' + (py - 5) + '" stroke="' + col + '" stroke-width="1.4"/>';
        }
      }

      /* 右侧清单 */
      var rows = '';
      for (var j = 0; j < list.length; j++) {
        var G = list[j];
        rows += '<tr>' +
          '<td style="padding:3px 8px;font-family:ui-monospace,monospace">F' + (j + 1) + '</td>' +
          '<td style="padding:3px 8px;font-family:ui-monospace,monospace">' + G.dip.toFixed(0) + '°</td>' +
          '<td style="padding:3px 8px;font-family:ui-monospace,monospace;color:' + (G.ok ? '#235f51' : '#b05a51') + '">' +
            (G.ok ? G.est.toFixed(0) + '°' : '漏拾') + '</td>' +
          '<td style="padding:3px 8px;font-family:ui-monospace,monospace">' + G.az.toFixed(0) + '° → ' +
            (G.ok ? G.azE.toFixed(0) + '°' : '—') + '</td>' +
          '<td style="padding:3px 8px;font-family:ui-monospace,monospace">' + (G.frac * 100).toFixed(0) + '%</td>' +
          '<td style="padding:3px 8px">' + (G.ok ? '<span class="tag-y">已拾取</span>' : '<span class="tag-n">漏</span>') + '</td>' +
          '</tr>';
      }
      s += '<g transform="translate(232,42)">' +
        '<text x="0" y="-14" font-size="11" font-weight="700" fill="#4d565b">逐条对照（真值 vs 模型）</text>' +
        '<foreignObject x="0" y="0" width="392" height="180">' +
        '<table xmlns="http://www.w3.org/1999/xhtml" style="width:100%;border-collapse:collapse;font-size:10.5px;color:#4d565b">' +
        '<thead><tr style="color:#79828a">' +
        '<th style="text-align:left;padding:2px 8px">编号</th>' +
        '<th style="text-align:left;padding:2px 8px">真值倾角</th>' +
        '<th style="text-align:left;padding:2px 8px">模型倾角</th>' +
        '<th style="text-align:left;padding:2px 8px">倾向（真→估）</th>' +
        '<th style="text-align:left;padding:2px 8px">覆盖率</th>' +
        '<th style="text-align:left;padding:2px 8px">结果</th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table></foreignObject></g>';

      s += '<text x="232" y="238" font-size="10" fill="#79828a">实心点 = 模型拾取并给出产状；叉 = 真值里有但模型漏掉' +
           '（概率图碎掉，拟不出一条完整的正弦）</text>';
      $('c6-tad').innerHTML = s;
    }

    function noteText(noise, qual, thr, nDet, nAll, iou, fp) {
      var tips = [];
      if (noise > 0.5 || qual < 0.55) {
        tips.push('当前成像条件很差：<b>概率图已经碎了</b>——注意概率图上出现了大量孤立的亮点，' +
          '这些碎点在拟合阶段会被当成短连通域丢掉，所以<b>条数还没开始漏，但倾角已经开始飘</b>。' +
          '现场遇到这种井段，正确做法是先做多极板数据融合再进模型，而不是指望模型扛噪。');
      } else if (thr > 0.65) {
        tips.push('阈值拉到 0.65 以上：概率高的那截被保留，概率低的那截被切掉，' +
          '<b>一条缝被切成好几段</b>——这就是 IoU 掉但条数不一定掉的原因。' +
          '阈值不是越高越好，它控制的是「宁可漏」还是「宁可错」。');
      } else if (thr < 0.4) {
        tips.push('阈值压到 0.4 以下：召回上去了，但<b>误拾取开始冒出来</b>——' +
          '基质里的暗色条带也被当成缝。误拾取比漏拾取更贵：漏的可以人工补，错的会被当成真缝写进地质模型。');
      } else {
        tips.push('当前是工作点：概率图连续、条数与倾角都还能用。<b>把阈值从 0.5 慢慢拖到 0.7</b>，' +
          '观察召回怎么掉；再<b>把噪声拖到 0.6</b>，观察概率图先碎、条数后漏——' +
          '这个先后顺序就是「概率图是中间产物、条数才是交付物」的直观证据。');
      }
      tips.push('最后注意指标的选择：<b>像素 IoU 只有 ' + iou.toFixed(2) + '，看起来很惨，' +
        '但条数召回是 ' + nDet + '/' + nAll + '</b>。缝宽只有 2—3 像素，预测偏 1 像素 IoU 就掉一半，' +
        '而地质根本不在乎这 1 像素。所以验收用条数与倾角误差，IoU 只在训练期看趋势。');
      $('c6-note').innerHTML = tips.join('<br><br>');
    }

    $('c6-n').addEventListener('input', draw);
    $('c6-d').addEventListener('input', draw);
    $('c6-s').addEventListener('input', draw);
    $('c6-q').addEventListener('input', draw);
    $('c6-t').addEventListener('input', draw);
    $('c6-rand').addEventListener('click', function () {
      SEED = (SEED * 1103515245 + 12345) >>> 0;
      $('c6-d').value = 12 + Math.floor(Math.random() * 60);
      $('c6-s').value = (Math.random() * 0.7).toFixed(2);
      $('c6-q').value = (0.4 + Math.random() * 0.6).toFixed(2);
      draw();
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
