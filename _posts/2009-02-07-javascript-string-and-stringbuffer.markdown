--- 
layout: post
title: " javascript中字符串累加的性能优化(String和StringBuffer)"
wordpress_id: 17
wordpress_url: http://wsria.com/?p=17
date: 2009-02-07 18:38:39 +08:00
category: javascript
tags: 
 - string
 - StringBuffer
---
<p class="highlighter">在JAVA中操作N个字符串累加或许会使用:</p>

<div class="highlighter">
<ol class="highlighter-j">
	<li><span>String?strs?= </span><span class="string">""</span><span>;</span></li>
	<li class="alt"><span class="keyword">for</span><span>(</span><span class="keyword">int</span><span> i?= </span><span class="number">0</span><span>;?i&lt;</span><span class="number">2000</span><span>;?i++)?{</span></li>
	<li><span> strs?+= </span><span class="string">"my?test"</span><span>;</span></li>
	<li class="alt"><span>}</span></li>
</ol>
</div>
稍微有点编程经验的可能就会使用StringBuffer类来累加字符串，例如：

<!--more-->
<div class="highlighter">
<ol class="highlighter-j">
	<li><span>StringBuffer?strs?= </span><span class="keyword">new</span><span> StringBuffer();</span></li>
	<li class="alt"><span class="keyword">for</span><span>(</span><span class="keyword">int</span><span> i?= </span><span class="number">0</span><span>;?i&lt;</span><span class="number">2000</span><span>;?i++)?{</span></li>
	<li><span> strs.append(</span><span class="string">"my?text"</span><span>);</span></li>
	<li class="alt"><span>}</span></li>
</ol>
</div>
<span>性能大家测试一下就知道了，根据机器配置的不同时间差可能会不一样；</span>

<span>下面我们来看看javascript中如何使用：</span>

<span>在javascript中只有String对象而没有设计StringBuffer对象，那我们就来自己设计一个StringBuffer对象</span>
<div class="highlighter">
<ol class="highlighter-c">
	<li><span class="keyword">function</span><span> StringBuffer(){</span></li>
	<li class="alt"><span> </span><span class="keyword">this</span><span>._strings_?= </span><span class="keyword">new</span><span> Array();</span></li>
	<li><span>}</span></li>
	<li><span>StringBuffer.prototype.append?= </span><span class="keyword">function</span><span>(str)?{</span></li>
	<li class="alt"><span> </span><span class="keyword">this</span><span>._strings_.push(str);</span></li>
	<li><span>}</span></li>
	<li><span>StringBuffer.prototype.toString?= </span><span class="keyword">function</span><span>()?{</span></li>
	<li class="alt"><span> </span><span class="keyword">return</span><span> </span><span class="keyword">this</span><span>._strings_.join(</span><span class="string">""</span><span>);</span></li>
	<li><span>}</span></li>
</ol>
</div>
这个StringBuffer对象只有两个方法，一个是增加字符串，一个是输出累加的字符串结果，原理就是使用数组暂存累加的字符串内容最后再做字符串的链接操作，这样就把String对象中的累加操作省掉了，下面是20000次循环后的结果：

累加字符串共消耗1218毫秒
StringBuffer共消耗188毫秒

经测试差距在4-10倍之间，效率就很明显了，呵呵
