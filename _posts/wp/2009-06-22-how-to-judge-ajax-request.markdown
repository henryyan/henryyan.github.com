--- 
layout: post
title: "如何判断一个请求是否为AJAX请求"
wordpress_id: 582
wordpress_url: http://www.wsria.com/?p=582
date: 2009-06-22 11:26:58 +08:00
tags: 
 - ajax
---
昨天在搞一个系统的时候遇到一个问题，我要在后台判断这个请求来自哪里，就是说是通过URL直接访问的呢还是通过AJAX方式访问的，以此来判断该怎么处理和响应，在群里面询问了一下也没有人知道，后来就想修改JQUERY的源码，就是在提交的时候在URL中加入自定义的AJAX请求标示，但是想想这样做不太好，破坏了JQUERY的完整性；继续在搜索，后来终于发现了，哈哈
<pre>那么服务器如果区别这个请求是ajax呢？因为同步和异步ajax的请求的头文件是一样的。我们如果通过X-Requested-With"="XMLHttpRequest”来标识这个请求是ajax的请求。如果服务器硬是要区分的话，就可以通过获取该头部来判断。</pre>
这是来自一篇JQUERY的AJAX请求的文章，这样我在后台获取header属性中的"X-Requested-With"就可以知道是什么类型的请求了
附上Java代码：
<pre class="brush: java">
/**
 * 判断是否为Ajax请求
 * @param request	HttpServletRequest
 * @return	是true, 否false
 */
public static boolean isAjaxRequest(HttpServletRequest request) {
	String requestType = request.getHeader("X-Requested-With");
	if (requestType != null && requestType.equals("XMLHttpRequest")) {
		return true;
	} else {
		return false;
	}
}
</pre>
