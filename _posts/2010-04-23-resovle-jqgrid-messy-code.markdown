--- 
layout: post
title: "jqGrid查询中文乱码问题解决办法(2011-11-11)"
wordpress_id: 961
wordpress_url: http://www.wsria.com/?p=961
date: 2010-04-23 17:23:33 +08:00
tags: 
 - jqGrid
---
<h3>终极解决办法-2011-11-11</h3>
之前是通过修改源码的方式解决乱码问题，但是只能解决一部分问题而且不利于升级，<strong>@嘴大饿急</strong>的意见我实验了一下比较完美，设置所有的ajax请求都使用post请求就可以了，具体代码：
<pre>
$.jgrid.ajaxOptions.type = 'post';
</pre>
上面的这段代码可以在项目的common.js中设置，这样所有的jqgrid的ajax请求都是用post发送，远离乱码……清净了！
哎呀，今天又是一个好日子，百年一遇的六一……

<h3>历史解决办法</h3>
<a href="http://www.trirand.com/blog/">jqGrid</a>是我用过最好的基于jQuery的列表插件，在项目中试用后效果很不错，基于jQuery UI的界面美观并且可以更好皮肤……

花了一天时间实现了增删改和查询功能，但是在查询中文的时候遇到了乱码问题……诡异，说一下情况：
<ul>
	<li>我的开发环境是全站UTF-8，而且有编码Filter；</li>
	<li>jqGrid版本为：3.6.4</li>
</ul>
<strong>在后台断点调试发现如下特点：</strong>

1、新增、编辑没有乱码问题

2、查询中文后台时得到的参数是乱码

然后就考虑了，如果是开发环境问题那肯定全部都有乱码问题，所以问题应该在jqGrid的查询函数里面，最后通过Firebug找到了：
<pre class="brush: js">c.find(".ui-search").click(function() {</pre>
这一行是查询功能的开始也就是点击“查询”的触发函数

所以根据以往的经验在这里<strong>把参数值编码一次</strong>就可以了，也就是<strong>encodeURIComponent</strong>函数具体修改如下：
<ol>
	<li>找到第6202行</li>
	<li>找到代码
<pre class="brush: js" line="6201">var p = jQuery(this).find("select[name='field'] :selected").val(),
g = jQuery(this).find("select[name='op'] :selected").val(),
f = jQuery(this).find("input.vdata,select.vdata :selected").val();</pre>
</li>
	<li>现在看到这里的3行代码就是查询时获取参数的3个变量，我们要修改的就是这里，最终代码：
<pre class="brush: js" line="6202">var p = encodeURIComponent(jQuery(this).find("select[name='field'] :selected").val()),
g = encodeURIComponent(jQuery(this).find("select[name='op'] :selected").val()),
f = encodeURIComponent(jQuery(this).find("input.vdata,select.vdata :selected").val());</pre>
</li>
</ol>
到此大功告成

--------------------------------分割线-----------------------------------

为了方便网友顺便提供本人修改后的jqGrid3.6.4版本的源码，分为3种类型（未压缩、迷你版、压缩版pack）

[download id="27" format="1"]<br/>

[download id="28" format="1"]<br/>

[download id="29" format="1"]

<h3>jqGrid3.8版本，更新日期(2010-11-06)</h3>
此版本是我修改后一直在项目中运行的，目前没有发现问题，特此公布，仅有min和pack版本
[download id="32" format="1"]<br/>
[download id="33" format="1"]
