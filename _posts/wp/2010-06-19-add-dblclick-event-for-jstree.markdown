--- 
layout: post
title: "为jstree添加双击事件切换[展开/收缩]功能"
wordpress_id: 989
wordpress_url: http://www.wsria.com/?p=989
date: 2010-06-19 11:36:10 +08:00
tags: 
 - jstree
---
<h2 class="title">一、概述</h2>
<a href="http://www.jstree.com" target="_self">jstree</a>是一个基于jQuery开发的优秀树插件，能够快速生成美观实用的树；目前项目中使用了这个插件遇到了一点问题，以前使用simpletree的时候可以双击父节点[<strong>展开/收缩</strong>]子节点，但是好像jstree没有提供这个功能，所以只有自己开发了。

使用的<strong>版本号</strong>：jsTree 1.0-rc1
没有添加双击功能时：<a href="http://www.kafeitu.me/demo/jstree/jstreeNormal.html" target="_blank">http://www.kafeitu.me/demo/jstree/jstreeNormal.html</a>
<h2 class="title">二、分析源码</h2>
<!--more-->
因为现在要做的是监听双击事件所以在源码中查找[<strong>dblclick</strong>]，在整篇源代码中只有一个地方出现了<strong>dblclick</strong>，这就容易多了；

在第<strong>297</strong>行处，代码如下：
<pre class="brush: js">.bind("dblclick.jstree", function (event) {
	var sel;
	if(document.selection &amp;&amp; document.selection.empty) { document.selection.empty(); }
	else {
		if(window.getSelection) {
			sel = window.getSelection();
			try {
				sel.removeAllRanges();
				sel.collapse();
			} catch (err) { }
		}
	}
})
</pre>
先不要看这些代码的意思，除非你想深入了解jstree的细节
<h2 class="title">三、修改源码</h2>
在修改源码之前先考虑一个问题，点击树左边的三角符号是怎么触发的事件，答案很简单，在源码中查找<strong>click.jstree</strong>，也就是第<strong>290</strong>行代码处，这里最主要的一句话就是
<pre class="brush: js">this.toggle_node(trgt);</pre>
，调用了jstree提供的toggle_node方法，也就是可以切换[<strong>展开/收缩</strong>]树节点，很好，我们可以借用一下

在298行代码处加入两行代码：
<pre class="brush: js">var trgt = $(event.target).parent().find('ins').get(0);
$jstree.toggle_node(trgt);
</pre>
这里使用的$jstree定义在283行的
<pre class="brush: js">init	: function () {</pre>
之后，
<pre class="brush: js">var $jstree = this;</pre>
，用$jstree引用jstree对象以便调用提供的接口；
现在解释一下298行添加的那两行代码，第一行查询到<code>ins</code>标签，第二行调用jstree的toggle_node切换树分支的展开和收缩；
至此大功告成！
<h2 class="title">四、结果演示</h2>
有双击功能的演示：<a href="http://www.kafeitu.me/demo/jstree/jstreeWithDblclick.html" target="_blank">http://www.kafeitu.me/demo/jstree/jstreeWithDblclick.html</a>
<h2 class="title">五、程序下载</h2>
[download id="30" format="1"]
