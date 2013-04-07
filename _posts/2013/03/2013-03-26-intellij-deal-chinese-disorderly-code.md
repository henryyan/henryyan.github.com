---
layout: post
title: "IntelliJ IDEA中文乱码解决办法"
category: tools
tags:
 - 开发工具
 - IntelliJ IDEA
 - 乱码
---

## 1. 预热

刚刚接触IntelliJ IDEA几天，在易用性方面的确比Eclipse好很多，比较智能，各种插件、工具都已经集成，和Mac OS X类似——开箱即用，并且在试用了之后在开源中国三折（后悔2折的时候没有下手）购买了授权。

但是还是老大难问题——中文乱码，让我不得不花费了一些时间去折腾它，这一点就不如Eclipse了，没有遇到过乱码问题。

乱码问题表现在使用Web Server（Tomcat、Jetty）时输出日志或者直接System.out.println("中文字符")时会出现，如果仅仅执行类的**main**函数没有问题。

## 2. 环境

我针对乱码问题在不同的环境下进行了测试：

### 2.1. 系统语言：英文

我一直的习惯把系统语言设置为英文（强迫性记忆），这是第一次**遇到乱码**问题，分析了程序执行参数如下：
<pre>ps -ef | grep java</pre>

执行后得到如下的结果，省略了classpath：
<pre>
/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/bin/java -d64 -Djava.awt.headless=true -Xmx512m -Dfile.encoding=MacRoman -classpath … org.jetbrains.idea.maven.server.RemoteMavenServer
</pre>

分析参数和编码有关的只有一个：

<pre>-Dfile.encoding=MacRoman </pre>

### 2.2. 系统语言：中文

先说明一下如果系统语言设置为中文是**没有乱码**问题的，所以网上大量的**重复**文章的办法是把"File Encoding"设置为GBK或者GB2312，但是很多系统的编码不可能因为一个IDE而更改编码，所以这种办法直接无视！！！

切换到中文语言后分析执行参数，和英文语言下不同的是：

<pre>-Dfile.encoding=GB2312</pre>

## 3. 解决办法

相信看完了分析已经知道如何解决问题了，因为**MacRoman**编码不包含中文所以会出现乱码，而设置系统语言为中文的时候系统默认设置为GB2312编码，所以编码问题自然就没有了。

### 3.1. 步骤一

和项目编码统一，更改IntelliJ IDEA启动时的编码参数即可，打开下面的配置文件：

<pre>/Applications/IntelliJ IDEA 12.app/Contents/Info.plist</pre>

	在IntelliJ IDEA 12.app文件右键选择“Show Contents”即可看到Contents目录。

找到**key**等于**VMOptions**位置，这里设置的虚拟机的参数，在后面追加下面的参数保存文件。

<pre>-Dfile.encoding=UTF-8</pre>

> PS：从12.1版本开始默认添加了这个参数

### 3.2. 步骤二

不要以为问题解决了，实际上只完成了一半，因为是运行Web Server时出现的乱码，所以Web Server的编码要和IDEA保持一致：

![IDEA中设置Web Server的虚拟机编码](/files/2013/03/idea-tomcat-encoding-settings.png)

这样IDE的编码（控制台编码受IDE影响）和Web Server输出的编码一致问题解决。

启动Web Server之后再分析JVM的参数可以看到 -Dfile.encoding=UTF-8。
