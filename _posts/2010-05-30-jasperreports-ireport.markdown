--- 
layout: post
title: "JasperReports iReport导出PDF中文解决办法"
wordpress_id: 981
wordpress_url: http://www.wsria.com/?p=981
date: 2010-05-30 20:52:57 +08:00
tags: 
 - JasperReports
 - 中文
---
最近研究JasperReports的UI可视化设计工具iReport在导出PDF文档时遇到了老问题：中文乱码……哎，又是乱码，解决呗

办法很简单：
<h2><span style="color: #99cc00;">一、设置文字标签的属性</span></h2>
点击文字标签设置PDF的属性，如下

Pdf font? name: STSong-Light;

Pdf? embedded:勾上（其实不打钩也可以）

pdf enccoding: UniGB-UCS2-H (Chinese Simplified)

设置完成后再点击<strong>预览</strong>查看控制台是否有报错，因为设置了中文语言所以如果iReport的lib目录下面没有中文语言包<strong>iTextAsian.jar</strong>的时候会报错，如下图：

<!--more-->

<a href="http://www.kafeitu.me/files/2010/05/1.jpg"><img class="alignnone size-full  wp-image-982" title="1" src="http://www.kafeitu.me/files/2010/05/1.jpg" alt="iReport缺少iTextAsian.jar包时" width="579" height="270" /></a>

如果出现上面错误，应该就是iReport缺少iTextAsian.jar包。工具-&gt;选项-&gt;iReport-&gt;Fonts 看到下面的pdf

font path里面没有iTextAsian.jar如图：

<a href="http://www.kafeitu.me/files/2010/05/2.jpg"><img class="alignnone size-full wp-image-983" title="2" src="http://www.kafeitu.me/files/2010/05/2.jpg" alt="" width="486" height="376" /></a>
<h2><span style="color: #99cc00;">二、设置iReport的字体Classpath</span></h2>
复制iTextAsian.jar包到iReport的libs目录里面，并添加到classpath中。

工具-&gt;选项-&gt;iReport-&gt;classpath -&gt;add iTextAsian.jar -&gt;确定

<a href="http://www.kafeitu.me/files/2010/05/3.jpg"><img class="alignnone size-full wp-image-984" title="3" src="http://www.kafeitu.me/files/2010/05/3.jpg" alt="" width="547" height="342" /></a>

设置完成后再检查一下Font标签的<strong>pdf font path</strong> 发现是否有iTextAsian.jar了

<a href="http://www.kafeitu.me/files/2010/05/4.jpg"><img class="alignnone size-full wp-image-985" title="4" src="http://www.kafeitu.me/files/2010/05/4.jpg" alt="" width="475" height="355" /></a>
<h2><span style="color: #99cc00;">三、重启iReport并重新导出PDF文档</span></h2>
到此设置完成了iReport导出PDF时的Classpath，现在可以试一试是否能够成功导出含有中文的PDF文档了

<a href="http://www.kafeitu.me/files/2010/05/5.jpg"><img class="alignnone size-full wp-image-986" title="5" src="http://www.kafeitu.me/files/2010/05/5.jpg" alt="" width="581" height="249" /></a>

控制台没有任何错误，明确的指出了导出PDF时使用iText，OK，大功告成！
