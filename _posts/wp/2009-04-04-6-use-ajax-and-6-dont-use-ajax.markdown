--- 
layout: post
title: "6个你必须用到AJAX的地方与6个不必用到的地方"
wordpress_id: 505
wordpress_url: http://www.wsria.com/?p=505
date: 2009-04-04 22:27:38 +08:00
category: ria
tags: 
 - ajax
---
用ajax开发系统、网站确实好给客户带来了很大的方便，也降低了服务器的压力，但是我们在开发的时候不能盲目的使用ajax，不是所有的情况都适合使用ajax的，下面是从CSDN上面看到的，分享给大家。

<!--more-->

<strong><em>下面是当前网页应用程序应该出现的地方：</em></strong>
<ul>
	<li><strong>基于表单的交互</strong></li>
</ul>
<pre>表单是很慢的，非常慢。尝试编辑位于del.icio.us上面的一个书签？点击编辑链接打开一个编辑书签的表单页面，然后编辑你的内容并点击提交 按钮等待整个提交过程结束，最后返回上一页并向下滚动到你刚才编辑的书签那里查看内容是否已经正确更改。那AJAX呢？点击编辑链接马上开始更改标签内 容，点击提交按钮开始异步传输标签编辑的内容并立即看到更改后的内容而无需重载整个页面。</pre>
<ul>
	<li><strong>深层树状导航</strong></li>
</ul>
<pre><span>总而言之，带有深层树状导航的应用程序通常是一个噩梦。在大多数情况中简单平直的拓扑结构以及搜索/标记可以很好的工作。但是如果一个 应用程序真正使用深层树状导航，使用JavaScript来管理拓扑ui(user interface用户接口)，则使用Ajax懒加载深层数据可以降低<strong style="font-weight: normal; color: #0000ff; text-decoration: underline;" onclick="window.open(&quot;http://rad.17luntan.com/ClickPortal/WebClick.aspx?id=20845&amp;k=%u670D%u52A1%u5668&amp;siteid=0098295a-e262-40f7-ae50-7a6fbbdb678b&amp;url=http%3A//news.csdn.net/n/20070320/102126.html&amp;gourl=http%3A//go.microsoft.com/%3Flinkid%3D6331218&amp;parm=8228C63D713FD535B916E81B8E8790870DF5635C76BD3B0E&amp;alliedsiteid=0&quot;);" onmouseover="isShowAds = true;isShowAds2 = true;ads.Move(this,&quot;&quot;,&quot;%u5FAE%u8F6F%u670D%u52A1%u5668%u7AEF%u4EA7%u54C1%u5927%u5168%uFF0C%u70B9%u51FB%u83B7%u5F97%u3002&quot;,&quot;20845&quot;,&quot;服务器&quot;,&quot;%u670D%u52A1%u5668&quot;,&quot;http%3A//go.microsoft.com/%3Flinkid%3D6331218&quot;)" onmouseout="isShowAds = false;isShowAds2 = false;">服务器</strong>的负载。举例来说，为了阅读一个只有一行的结果来加载整个一个新页面是非常耗时的。</span></pre>
<ul>
	<li><strong>实时用户对用户通讯</strong></li>
</ul>
<pre><span>在一个允许用户创建实时讨论的<strong style="font-weight: normal; color: #0000ff; text-decoration: underline;" onclick="window.open(&quot;http://rad.17luntan.com/ClickPortal/WebClick.aspx?id=19007&amp;k=%u4FE1%u606F&amp;siteid=0098295a-e262-40f7-ae50-7a6fbbdb678b&amp;url=http%3A//news.csdn.net/n/20070320/102126.html&amp;gourl=http%3A//www.kaola.cn/help/tool2.jsp%3FkaolaId%3DA-8-0-0-0&amp;parm=8228C63D713FD535B916E81B8E8790870DF5635C76BD3B0E&amp;alliedsiteid=0&quot;);" onmouseover="isShowAds = true;isShowAds2 = true;ads.Move(this,&quot;http://rad.17luntan.com/UploadImage/15/633059381563100000.gif&quot;,&quot;%u7CBE%u5F69%u56FE%u7247%2C%u5C0F%u7535%u5F71%2CFLASH%2C%u6536%u85CF%u4F60%u559C%u6B22%u7684%21%u5168%u80FD%u6536%u85CF%u5DE5%u5177-%u8003%u62C9%u5B9D&quot;,&quot;19007&quot;,&quot;信息&quot;,&quot;%u6574%u5408%u521B%u9020%u4F60%u7684%u4FE1%u606F&quot;,&quot;http%3A//www.kaola.cn/help/tool2.jsp%3FkaolaId%3DA-8-0-0-0&quot;)" onmouseout="isShowAds = false;isShowAds2 = false;">信息</strong>公 告系统中，迫使用户一次又一次的更新完页面看到答复是非常愚蠢的。回复应该是实时的，用户不应被迫总是去痴迷于刷新操作。即使是gmail这个已经对以前 像hotmail/yahoo mail的收件箱刷新，刷新收件箱标记的操作有所改进，也并没有充分的使用Ajax的功能来提示有新<strong style="font-weight: normal; color: #0000ff; text-decoration: underline;" onclick="window.open(&quot;http://rad.17luntan.com/ClickPortal/WebClick.aspx?id=20592&amp;k=%u90AE%u4EF6&amp;siteid=0098295a-e262-40f7-ae50-7a6fbbdb678b&amp;url=http%3A//news.csdn.net/n/20070320/102126.html&amp;gourl=http%3A//go.microsoft.com/%3Flinkid%3D6331216&amp;parm=8228C63D713FD535B916E81B8E8790870DF5635C76BD3B0E&amp;alliedsiteid=0&quot;);" onmouseover="isShowAds = true;isShowAds2 = true;ads.Move(this,&quot;&quot;,&quot;%u6700%u597D%u7684%u90AE%u4EF6%u670D%u52A1%u5668%uFF01%u6765%u81EA%u5FAE%u8F6F&quot;,&quot;20592&quot;,&quot;邮件&quot;,&quot;%u90AE%u4EF6&quot;,&quot;http%3A//go.microsoft.com/%3Flinkid%3D6331216&quot;)" onmouseout="isShowAds = false;isShowAds2 = false;">邮件</strong>到达。</span></pre>
<ul>
	<li><strong>投票、是否选择、等级评价</strong></li>
</ul>
<pre>如果Ajax提交过程没有一个协调的UI提示是非常糟糕的，通过使用Ajax来提交一个调查或是否选择可以减少提交过程等待的痛苦。通过减少点击的 等待时间，Ajax应用程序变得越来越有交互性-如果要用40秒来提交一个投票，除非非常在意的话大多数人会选择放弃。如果只花1秒呢，非常大比例的人会 乐于参加投票的。（我在Netflix versus有2008张电影投票在IMDb.com有210张电影投票）</pre>
<ul>
	<li><strong>过滤和复杂数据操作</strong></li>
</ul>
<pre>应用一个过滤、按日期排序、按日期和姓名排序、打开或关闭过滤器等等。任何一种高交换型操作应该交给JavaScript来处理而不是通过向服务器来提交一系列的请求。在查找或者操作大量数据的时候带来的视图上的改变最多不会超过30秒，Ajax真的使这些操作加速了。</pre>
<ul>
	<li><strong>普通录入时的提示/</strong><strong>自动补齐</strong></li>
</ul>
<pre>一些软件/JavaScript是擅长于帮助用户完成键入相同的文字或可以预测的文字的工作的。在del.icio.us 和 Gmail 中该功能是非常有益的，可以用来快速增加标记/email等。</pre>
对于一个频繁使用的应用程序诸如网页邮件客户端或博客阅读器来说，用户有充足的时间来学习如何使用新的UI概念但是他们却无法接受一个非常缓慢 的反应速度。这种应用为Ajax变的更加普及起到了一个完美的杠杆作用。随着用户使用频率的增加，更多的Ajax部件应该加强用户的使用体验。

但是对于网页应用程序来说，把每件事甚至任何事都用JavaScript来实现也是没有意义的。Ajax只是针对一些特定的环境才能带来显著的 帮助。在Ajax出现之前网页应用程序已经可以工作的很好了并且目前在网页开发中Ajax还存在着许多的缺陷和缺点。就算不从服务器端取得一个异步的信息 数据流一个平直的html网页日志也可以工作的很好。对于文档或文档之间的跳转来说，老旧的纯HTML仍然是最好的选择。简单或很少使用的应用程序就算不 用JavaScript同样可以很好的工作。

<strong><em>下面是一些不应该用到Ajax</em><em>的地方：</em></strong>
<ul>
	<li><strong>简单的表单</strong></li>
</ul>
<pre>就算表单是Ajax技术的最大受益人，一个简单内容的表单，或提交订货单，或一次性的很少用到的表单都不应该使用以Ajax驱动的表单提交机制。总的来说，如果一个表单不是很长用，或已经工作的很好，那么就算使用Ajax也没有什么帮助。</pre>
<ul>
	<li><strong>搜索</strong></li>
</ul>
<pre>实时搜索带来的痛苦要远大于他带来的帮助。这就是为什么Google Suggest还处于beta测试而并没有放在主页上的原因。在Start.com Live.com上搜索的时候你是不能使用返回按钮来查看上一次搜索或返回上一页的。或许还没有人来完成这项工作，但是完成这个工作应该是很困难的至少是 不太明知的或者会因此带来更多的麻烦。（译注：现在已经有很多开源的框架可以实现历史记录功能）</pre>
<ul>
	<li><strong>基本导航</strong></li>
</ul>
<pre>总的来说，使用Ajax为一个基础的网站/程序做导航是一个可怕的念头。谁会把用来使自己的程序变的更好的时间花在编写代码模仿浏览器的行为上面？在基础页面中导航的操作中JavaScript是没有用的。</pre>
<ul>
	<li><strong>替换大量的信息</strong></li>
</ul>
<pre>Ajax可以不用整页刷新来动态更新页面中改变的一小部分。但是如果一页上的大部分内容都需要更新，那为什么不从服务器那里获得一个新页面呢？</pre>
<ul>
	<li><strong>显示操作</strong></li>
</ul>
<pre>虽然看上去Ajax是一个纯UI技术，其实不是这样的。他实际上是一个数据同步、操作、传输的技术。要想得到一个稳定的干净的网页程序，不使用 Ajax/JavaScript来直接完成用户接口是明智的。JavaScript可以分散分布并简单的操作XHTML/HTML DOM，根据CSS规则来决定如何让UI显示数据。</pre>
<ul>
	<li><strong>无用的网页小部件</strong></li>
</ul>
滑块选择控件、拖拽控件、弹性控件（此处原文为bouncies，不知指为何物？）、鼠标样式、天气预报控件，这些小部件应该可以被更直接的控件代 替或者为了整洁干脆整个去掉。为了选择一种颜色，也许滑块选择控件可以选择一个正确的阴影颜色，但是在一个商店中选择一个价格，使用滑块选择控件选到分这 个单位对于用户来说有点过分。
