--- 
layout: post
title: "Springside3.3.3报错：java.lang.NoClassDefFoundError: org/codehaus/classworlds/Launcher解决办法"
wordpress_id: 1079
wordpress_url: http://www.wsria.com/?p=1079
date: 2010-08-09 22:30:50 +08:00
tags: 
 - springside
---
<a title="Springside官网" href="http://www.springside.org.cn/" target="_blank">Springside</a>刚刚发布了<a title="Springside 3.3.3" href="http://www.springside.org.cn/index.php/1/action_viewspace_itemid_25.html" target="_blank">Springside 3.3.</a>3版本，不过这次回复了generate-project.bat文件可以创建mini-web类型的项目。

下载了all-in-one版本，然后运行quick-start.bat出现问题了……
<pre>
<div id="_mcePaste">Exception in thread "main" java.lang.NoClassDefFoundError: org/codehaus/classworlds/Launcher</div>
<div id="_mcePaste">Caused by: java.lang.ClassNotFoundException: org.codehaus.classworlds.Launcher</div>
<div id="_mcePaste">at java.net.URLClassLoader$1.run(URLClassLoader.java:202)</div>
<div id="_mcePaste">at java.security.AccessController.doPrivileged(Native Method)</div>
<div id="_mcePaste">at java.net.URLClassLoader.findClass(URLClassLoader.java:190)</div>
<div id="_mcePaste">at java.lang.ClassLoader.loadClass(ClassLoader.java:307)</div>
<div id="_mcePaste">at sun.misc.Launcher$AppClassLoader.loadClass(Launcher.java:301)</div>
<div id="_mcePaste">at java.lang.ClassLoader.loadClass(ClassLoader.java:248)</div>
<div id="_mcePaste">Could not find the main class: org.codehaus.classworlds.Launcher. ?Program will exit.</div>
Exception in thread "main" java.lang.NoClassDefFoundError: org/codehaus/classworlds/LauncherCaused by: java.lang.ClassNotFoundException: org.codehaus.classworlds.Launcher?? ? ? ?at java.net.URLClassLoader$1.run(URLClassLoader.java:202)?? ? ? ?at java.security.AccessController.doPrivileged(Native Method)?? ? ? ?at java.net.URLClassLoader.findClass(URLClassLoader.java:190)?? ? ? ?at java.lang.ClassLoader.loadClass(ClassLoader.java:307)?? ? ? ?at sun.misc.Launcher$AppClassLoader.loadClass(Launcher.java:301)?? ? ? ?at java.lang.ClassLoader.loadClass(ClassLoader.java:248)Could not find the main class: org.codehaus.classworlds.Launcher. ?Program will exit.</pre>
一时也找不到原因，最直接有效的方式就是打开bat文件查看问题出现在哪里，打开后一看晓得了……因为springside的all-in-one版本里面含有maven工具，可以查看quick-start.bat的第10行命令：
<pre>if exist "tools\maven\apache-maven-2.2.1\" set MVN="%cd%\tools\maven\apache-maven-2.2.1\bin\mvn.bat"</pre>
很清楚springside使用的maven版本是2.2.1，而我本地的版本号是用的Apache Maven 3.0-beta-1，然后我就试着注释掉了第10行命令，再运行，OK
所有使用Apache Maven 3.0-beta-1的同学注意了，如果报错就<strong>把第10行注释掉，</strong>也就是在前面加上#

再次感谢白衣整合了这么好的框架！
