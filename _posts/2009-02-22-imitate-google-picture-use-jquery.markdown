--- 
layout: post
title: "模拟google相册鼠标移动提示信息"
wordpress_id: 285
wordpress_url: http://www.wsria.com/?p=285
date: 2009-02-22 16:57:07 +08:00
category: jquery
tags: 
 - google
 - 悬浮
---
在jQuery中文社区中看到一篇帖子提问，<a href="http://bbs.jquery.org.cn/read.php?tid-3992.html" target="_blank">http://bbs.jquery.org.cn/read.php?tid-3992.html</a>

模拟google的照片鼠标提示信息

下面介绍如何实现：

1、在html中增加两个img
<pre>&lt;img src="panda.jpg" border="0" alt="" width="231" height="300" /&gt;
&lt;img src="no.jpg" alt="" width="231" height="300" /&gt;</pre>
2、准备一个提示信息使用的DIV层

&lt;div id="tipInfo" style="display:none"&gt;&lt;/div&gt;

<!--more-->

这里一定要主意<em>把tipInfo的position设置为absolute</em>，我在做的时候就卡到这里了，后来发现原来忘了设置……

3、javascript代码：
<pre class="brush: js">$(function() {
        //$('#content img:not(:eq(0))')的意思是不显示第一张图片的信息
	$('#content img:not(:eq(0))').hover(
		function() {
			var position = $(this).position();
			var tipHight = $('#tipInfo').height();

			var endTop = (position.top + $(this).height()) - tipHight;
			//$(this).addClass('active');
			$("#tipInfo").width($(this).width())
				.html('作者：' + $(this).attr('author'))
				.show()
				.css({top: endTop + "px", left: position.left + "px"});
		},
		function() {
			//$(this).removeClass('active');
			$('#tipInfo').hide();
		}
	);
});</pre>
测试通过，代码很简单，<a href="http://www.kafeitu.me/demo/imgtip/index.html" target="_blank">点击这里查看演示</a>

源码[download#12#format=1]
