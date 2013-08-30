--- 
layout: post
title: "Eclipse+Maven+WTP+Tomcat不能Run On Server其中一个原因"
wordpress_id: 1004
wordpress_url: http://www.wsria.com/?p=1004
date: 2010-08-10 11:37:33 +08:00
tags: 
 - ecplise
 - maven
 - WTP
 - tomcat
---
<p>使用Maven有段时间了，自己DIY项目后遇到了一个问题，项目不能使用WTP提供的Run On Server功能……</p>
<h2>1、问题描述</h2>
<p>配置好项目，配置好Tomcat6，加入项目到Tomcat中然后运行Tomcat没有加载项目的日志信息</p>
<h2>2、环境配置</h2>
<ul>
<li>Eclipse With Java EE + WTP + Maven</li>
<li>WTP的组件配置.settings/org.eclipse.wst.common.component</li>
</ul>
<pre class="brush: xml" line='1'><?xml version="1.0" encoding="UTF-8"?>
<project-modules id="moduleCoreId" project-version="1.5.0">
  <wb-module deploy-name="exercise-admin">
<property name="context-root" value="exercise-admin"/>
    		<wb-resource deploy-path="/WEB-INF/classes" source-path="src/main/java"/>
        <wb-resource deploy-path="/WEB-INF/classes" source-path="src/main/resources"/>
        <wb-resource deploy-path="/WEB-INF/classes" source-path="/src/main/java"/>
        <wb-resource deploy-path="/WEB-INF/classes" source-path="/src/main/resources"/>

        <wb-resource deploy-path="/" source-path="/src/main/webapp/js"/>
        <wb-resource deploy-path="/" source-path="/src/main/webapp/common"/>
        <wb-resource deploy-path="/" source-path="/src/main/webapp/WEB-INF/content"/>
        <wb-resource deploy-path="/" source-path="/src/main/webapp"/>
<property name="java-output-path" value="/target/classes"/>
  </wb-module>
</project-modules>
</pre>
<p>说明一下wtp的默认规则，org.eclipse.wst.common.component规定deploy-path为斜杠(/)并且是包含WEB-INF的wb-resource要在第一位，所以我在这里犯错了，看上面的配置就清楚了</p>
<h2>3、问题原因</h2>
<p>我一向喜欢“工欲善其事必先利其器”；因为基于Maven的WTP工程默认只有一个</p>
<pre class="brush: xml"><wb-resource deploy-path="/" source-path="/src/main/webapp"/></pre>
<p>看截图<a href="http://www.kafeitu.me/files/2010/08/默认.png"><img src="http://www.kafeitu.me/files/2010/08/默认.png" alt="" title="Maven + WTP默认的WebResources" width="314" height="298" class="size-full wp-image-1086" /></a><br />
所以默认的.settings/org.eclipse.wst.common.component的配置如下：</p>
<pre class="brush: xml" line='1'>
<?xml version="1.0" encoding="UTF-8"?>
<project-modules id="moduleCoreId" project-version="1.5.0">
  <wb-module deploy-name="exercise-admin">
<property name="context-root" value="exercise-admin"/>
    		<wb-resource deploy-path="/WEB-INF/classes" source-path="src/main/java"/>
        <wb-resource deploy-path="/WEB-INF/classes" source-path="src/main/resources"/>
        <wb-resource deploy-path="/WEB-INF/classes" source-path="/src/main/java"/>
        <wb-resource deploy-path="/WEB-INF/classes" source-path="/src/main/resources"/>

        <wb-resource deploy-path="/" source-path="/src/main/webapp"/>
<property name="java-output-path" value="/target/classes"/>
  </wb-module>
</project-modules>
</pre>
<p>现在比较一下就比较清楚了，原因是我DIY的配置多了3行，所以我DIY的配置如下：<br />
<a href="http://www.kafeitu.me/files/2010/08/diy.png"><img src="http://www.kafeitu.me/files/2010/08/diy.png" alt="" title="maven + wpt配置diy后" width="293" height="114" class="aligncenter size-full wp-image-1087" /></a></p>
<p>还有另外一个原因就是因为我的通过m2eclipse插件提供的SCM功能checkout项目，原本DIY配置好的项目被eclipse改动了，从svn信息看得出来，所以导致了问题的发生</p>
<h2>4、问题关键所在</h2>
<p>保证项目的<strong>.settings/org.eclipse.wst.common.component</strong>文件中的
<pre class="brush: xml"><wb-resource deploy-path="/" source-path="/src/main/webapp"/></pre>
<p>在以<em>deploy-path="/"</em>的wb-resource排在第一位，因为tomcat启动时要读取WEB-INF/web.xml，如果不在第一位找不到当然服务不能启动</p>
<h2>5、问题解决</h2>
<ul>
<li>根据上面说的保证webapp的位置即可，最终配置如下，可以保留DIY结果又可以启动服务：
<pre class="brush: xml" line='1'>
<?xml version="1.0" encoding="UTF-8"?>
<project-modules id="moduleCoreId" project-version="1.5.0">
  <wb-module deploy-name="exercise-admin">
<property name="context-root" value="exercise-admin"/>
    		<wb-resource deploy-path="/WEB-INF/classes" source-path="src/main/java"/>
        <wb-resource deploy-path="/WEB-INF/classes" source-path="src/main/resources"/>
        <wb-resource deploy-path="/WEB-INF/classes" source-path="/src/main/java"/>
        <wb-resource deploy-path="/WEB-INF/classes" source-path="/src/main/resources"/>
        <wb-resource deploy-path="/" source-path="/src/main/webapp"/>
        <wb-resource deploy-path="/" source-path="/src/main/webapp/js"/>
        <wb-resource deploy-path="/" source-path="/src/main/webapp/common"/>
        <wb-resource deploy-path="/" source-path="/src/main/webapp/WEB-INF/content"/>
<property name="java-output-path" value="/target/classes"/>
  </wb-module>
</project-modules>
</pre>
</li>
<li>或者不要使用m2eclipse提供的SCM检出功能，直接用乌龟checkout，这样就不会因为eclipse自动设置修改.settings/org.eclipse.wst.common.component配置了</li>
</ul>
