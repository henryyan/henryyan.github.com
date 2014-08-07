--- 
layout: post
title: "利用JavaScript获取窗口/Body的宽度和高度(让jqGrid自适应窗口大小)"
wordpress_id: 1147
wordpress_url: http://www.wsria.com/?p=1147
date: 2010-08-20 13:07:24 +08:00
tags: 
 - jquery
 - 自动
---
项目中使用了easy-ui和jqGrid，我使用easy-ui的layout布局，然后用jqGrid显示数据列表，easyu-ui在改变窗口大小的时候可以自适应，而jqGrid要加一些盐了，所以用到了获取窗口大小的几个参数，这样就可以根据窗口大小改变的时候改变jqGrid的高度和宽度，从网站找的别人写的例子：

演示地址：<a href="http://demo.wsria.com/window/window-all-size.html">http://demo.wsria.com/window/window-all-size.html</a>

可以试着改变窗口大小然后点击“尺寸调试”按钮。
下面分享一下easy-ui的layout布局中把jqGrid列表页面嵌入到iframe的大小例子
<!--more-->
<h2>功能函数：</h2>
<pre class="brush: js">function autoResize(options) {
// 第一次调用
var size = getWidthAndHeigh();
if ($.isFunction(options.callback)) {
	options.callback(size);
}

// 窗口大小改变的时候
window.onresize = function() {
	var size = getWidthAndHeigh(true);
	$(options.dataGrid).jqGrid('setGridHeight', size.height).jqGrid('setGridWidth', size.width);
};

// 获取iframe大小
function getWidthAndHeigh(resize) {
	var iframeHeight = document.body.clientHeight;
	var iframeWidth = document.body.clientWidth;
	// chrome
	if ($.common.browser.isChrome()) {
		iframeWidth -= 16;
		iframeHeight -= 85;
	}
	// firefox
	else if ($.common.browser.isMozila()) {
		iframeWidth -= 15;
		iframeHeight -= 85;
		if (resize) {
			iframeWidth += 18;
			iframeHeight += 13;
		}
	} 
	// IE
	else {
		iframeWidth -= 12;
		iframeHeight -= 83;
		if (resize) {
			iframeHeight += 15;
			iframeWidth += 10;
		}
	}
	return {width: iframeWidth, height: iframeHeight};
}

}</pre>
这里需要说明的是要根据浏览器的不同进行高度和宽度的调整！
<h2>使用方法：</h2>
<pre class="brush: js">autoResize({
        dataGrid: '#list',
	callback: listPropDatas
});</pre>
<a href="http://www.kafeitu.me/files/2010/08/full-size-for-jqgrid.png"><img class="size-medium wp-image-1148" title="full size for jqgrid" src="http://www.kafeitu.me/files/2010/08/full-size-for-jqgrid-300x155.png" alt="" width="300" height="155" /></a>

<a href="http://www.kafeitu.me/files/2010/08/small-size-for-jqgrid.png"><img class="size-medium wp-image-1149" title="small size for jqgrid" src="http://www.kafeitu.me/files/2010/08/small-size-for-jqgrid-300x160.png" alt="" width="300" height="160" /></a>
