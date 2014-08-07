--- 
layout: post
title: "基于Java、jQuery应用的账务管理系统开源了(09.3.19更新)"
wordpress_id: 136
wordpress_url: http://www.wsria.com/?p=136
date: 2009-02-14 17:35:00 +08:00
category: financial
tags: 
 - 演示
 - 财务
---
基于Java、jQuery开发的账务管理系统(个人版)系统演示及源码共享，致力于企业级RIA应用……

<!--more-->

在这个特殊的日子还是继续宅男的生活，过着没有情人的情人节，但是今年这个没有情人的情人节要献给广大Java、jQuery技术爱好者一份大礼，半年来周末、下班时间学习使用的账务管理系统公开源代码了，关于系统的说明请参看本博客相关文章，废话不说了，googlecode地址公布如下：

2009.02.25更新……
<pre>版本库主页：<a href="http://code.google.com/p/finance-p/" target="_blank">http://code.google.com/p/finance-p/</a>
匿名检出版本库：svn checkout http://finance-p.googlecode.com/svn/branches/v1-Final finance
<a href="http://code.google.com/p/finance-p/downloads/list" target="_blank">googlecode</a>上去下载<!--，也可以从从本站[download id="4" format="1"]-->

<a href="http://www.wsria.com/archives/73" target="_blank">预览系统演示视频</a></pre>
<pre>关于系统功能的内部实现会陆续发布文章供大家研究、学习

如果你想参与到此项目的继续开发请联系博主

代码、功能仅供学习、参考，肯定存在一定问题，希望一块学习</pre>
<h2>更新2009.2.26</h2>
<pre>最近有一个网友下载了基于Java、jQuery开发的账务管理系统，上次的文档写的不完整，在这里向各位表示歉意，下面写一个完整的安装文档：
<p style="text-indent: 21pt;"><!--[if gte mso 9]><xml> <w:WordDocument> <w:View>Normal</w:View> <w:Zoom>0</w:Zoom> <w:PunctuationKerning /> <w:DrawingGridVerticalSpacing>7.8 磅</w:DrawingGridVerticalSpacing> <w:DisplayHorizontalDrawingGridEvery>0</w:DisplayHorizontalDrawingGridEvery> <w:DisplayVerticalDrawingGridEvery>2</w:DisplayVerticalDrawingGridEvery> <w:ValidateAgainstSchemas /> <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid> <w:IgnoreMixedContent>false</w:IgnoreMixedContent> <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText> <w:Compatibility> <w:SpaceForUL /> <w:BalanceSingleByteDoubleByteWidth /> <w:DoNotLeaveBackslashAlone /> <w:ULTrailSpace /> <w:DoNotExpandShiftReturn /> <w:AdjustLineHeightInTable /> <w:BreakWrappedTables /> <w:SnapToGridInCell /> <w:WrapTextWithPunct /> <w:UseAsianBreakRules /> <w:DontGrowAutofit /> <w:UseFELayout /> </w:Compatibility> <w:BrowserLevel>MicrosoftInternetExplorer4</w:BrowserLevel> </w:WordDocument> </xml><![endif]--><!--[if gte mso 9]><xml> <w:LatentStyles DefLockedState="false" LatentStyleCount="156"> </w:LatentStyles> </xml><![endif]--></p>
</pre>
<pre><strong>一、</strong><strong>一个仅供学习之用的账务管理系统</strong><strong>(</strong><strong>个人版</strong><strong>)</strong>

<strong>系统简介</strong>： 1、实现了用户、组管理 2、实现了物品类别、详细管理 3、实现了基本账务(货币)管理

开发此系统的初衷在于学习技术以便更好的应用在公司的项目中，本系统特别注重用户体验方面的设计，友好的界面和傻瓜式的操作

<strong>前后台架构</strong>： 1、java语言(jdk1.5)、struts1.2.9、hibernate3.2.6.ga、spring2.0.8 2、前台：主要使用了轻量级的ajax开发框架jQuery，使用jQuery很轻松的降低了服务器压力提高了用户体验并且代码容易维护，尤其是jQuery的插件机制更是简易了代码 3、数据库版本为mysql5.0 4、编码：为防止ajax乱码，所以项目、数据库全部使用UTF-8编码

浏览器兼容性： 目前的设计兼容IE7+、FireFox、Chrome(有一点路径问题) 因为IE6下的CSS文件还为完成所以使用IE6访问系统会出现布局不美观情况

<strong>二、系统配置说明</strong>

1、<strong>数据库</strong>
<ul>
	<li>mysql，本人使用版本是5.0.18</li>
	<li>建立数据库名称为：finance，字符集设置为UTF-8，然后导入bak/finance.sql文件</li>
</ul>
<img class="size-full wp-image-337" title="dbinfo" src="http://www.kafeitu.me/files/2009/02/dbinfo.png" alt="mysql数据库属性" width="275" height="171" />

2、<strong>编译项目</strong>

<strong>说明：本项目没有使用标准的WebRoot格式，源代码文件夹SRC位于/WEB-INF/SRC目录下
</strong>
<ul>
	<li>SVN版本库和压缩包中没有class文件，即/WEB-INF目录下没有classes目录，<strong><em>需要自己使用eclipse编译</em></strong>，所有用到的jar包都在WEB-INF/lib目录下，即<span style="color: #0000ff;"><em>eclipse中build path--&gt;libraries</em></span>设置，各个框架的版本上面都已说明</li>
	<li>编译时如果使用MyEclipse的话使用J2EE1.4这个library</li>
	<li>使用tomcat或者weblogic等服务器jar包的请自行引入</li>
<a href="http://www.kafeitu.me/files/2009/02/eclipsedir.png"><img class="size-full wp-image-338" title="eclipsedir" src="http://www.kafeitu.me/files/2009/02/eclipsedir.png" alt="配置完成的eclipse目录" width="162" height="430" /></a>
<div class="mceTemp mceIEcenter"><dl id="attachment_357" class="wp-caption aligncenter" style="width: 510px;"> <dt class="wp-caption-dt"><a href="http://www.kafeitu.me/files/2009/02/eclipselib.png" target="_blank"><img class="size-medium wp-image-357" title="eclipselib" src="http://www.kafeitu.me/files/2009/02/eclipselib-300x169.png" alt="eclipse编译环境" width="500" height="200" /></a>

</dt> <dd class="wp-caption-dd">配置完成的eclipse目录</dd> </dl></div></ul>
3、<strong>设置、启动服务</strong>
<ul>
	<li>打开finance/WEB-INF/config/applicationContext.xml：</li>
	<li>修改<strong>第10、11行的数据库名和密码</strong>为你的mysql数据库用户名、密码</li>
	<li><strong>部署tomcat应用：</strong>
<ul>
	<li>在tomcat目录confCatalinalocalhost下建立一个finance.xml</li>
	<li>内容：&lt;Context docBase="D:projectsfinancetrunk" reloadable="true" privileged="true"&gt;&lt;/Context&gt;
docBase根据自己的情况设置</li>
</ul>
</li>
	<li>做完上面两步后就可以启动服务了，如果应用名设置为finance就直接可以访问了，如果自己另外定了应用名称则需要修改common/js/plugin/weebox.js中第17行，改为：url: '/<strong><em>应用名称</em></strong>/common/js/plugin/bgiframe.js'即可</li>
	<li>访问系统最好使用Firefox浏览器，因为FF内置的JS引擎机制速度比IE快的多，或者google的Chrome浏览器也不错，其内置的JS8引擎比FF的性能还要好</li>
<a href="http://www.kafeitu.me/files/2009/02/finance.png"><img class="size-full wp-image-55" title="finance" src="http://www.kafeitu.me/files/2009/02/finance.png" alt="账务管理系统(个人版)演示" width="491" height="371" /></a></ul>
<strong>4</strong><strong>、更新最新版本</strong><strong> </strong>

<em><strong><a href="http://finance-p.googlecode.com/svn/trunk/">http://finance-p.googlecode.com/svn/trunk/</a></strong></em><tt></tt>

声明：本系统仅供学习使用，禁止商业应用 版权归<a href="http://www.wsria.com" target="_blank">http://www.wsria.com</a>所有

如果有问题请联系作者：

QQ：576525789
MSN：yanhonglei@gmail.com</pre>
