--- 
layout: post
title: "城市级联选择插件jquery.area2select闪亮登场(前后台设计)"
wordpress_id: 1237
wordpress_url: http://www.wsria.com/?p=1237
date: 2010-10-18 21:16:42 +08:00
tags: 
 - area2select
---
公司的一个二期项目需要使用地区信息的级联选择功能，因为本来有数据库设计所以就根据数据库设计构建了本次要发布的插件：jquery.area2select，算是真正意义上的第一个jQuery插件吧。
插件的开发目的一是为了公司的项目试用，另外一个就是把各种我平常开发积累的东西分享给大家，也就是我创建的<a href="http://code.google.com/p/wsria/" target="_blank">wsria</a>项目。
<h3>一、文档以及API</h3>
如果看着累直接点击<a href="http://www.kafeitu.me/demo/plugins/area2select/area-plugin-caption.html" target="_blank"><strong>这里</strong></a>，在新窗口打开。
<h3>二、配套演示地址</h3>
因为是和后台配合使用，所以专门搭建了一个部署在tomcat上的演示程序；
<strong>演示地址：</strong><a href="http://kafeitu.gicp.net:10000/demo" target="_blank">http://kafeitu.gicp.net:10000/demo</a>，进入页面后在<strong>左侧</strong>的“地区信息”栏目中。
<!--more-->
<h3>三、插件源码相关下载</h3>
<ol>
	<li><strong>发布版本</strong>：<a href="http://code.google.com/p/wsria/downloads/list" target="_blank">http://code.google.com/p/wsria/downloads/list</a></li>
	<li><strong>SVN最新版本</strong>：
请用SVN客户端检出或导出仓库：http://wsria.googlecode.com/svn/trunk/</li>
</ol>
<h3>四、下载后的配置说明：</h3>
<ol>
	<li>自己搞一个tomcat，把war包放在tomcat的webapp目录中；然后在<strong>D盘</strong>下建立<strong>wsria-demo</strong>文件夹，war的WEB-INF/classes/applicationContext.xml中中默认配置了两个本地数据库配置文件，即：
<strong>Windows</strong>：d:/wsria-demo/application.properties
<strong>Linux</strong>：var/wsria-demo/application.properties

在wsria-demo文件夹中配置你本地的数据库，请参考：
<a href="http://code.google.com/p/wsria/source/browse/tags/demo-1.0.2/src/main/resources/application.properties" target="_blank">http://code.google.com/p/wsria/source/browse/tags/demo-1.0.2/src/main/resources/application.properties</a>
你需要修改的是17、18、19行的配置，主要是修改本地mysql的数据库名称和用户名密码</li>
	<li>接下来把sql脚本导入到你的数据库中，脚本在<a href="http://code.google.com/p/wsria/source/browse/#svn/repository/1.0.2" target="_blank">http://code.google.com/p/wsria/source/browse/#svn/repository/1.0.2</a>的wsria-demo-1.0.2.sql中</li>
</ol>
现在你可以运行你的TOMCAT了，如果你本地有Maven环境也可以直接用mvn jetty:run命令运行。
