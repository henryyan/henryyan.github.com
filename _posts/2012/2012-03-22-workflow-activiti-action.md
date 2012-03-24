---
layout: post
title: "工作流引擎Activiti使用总结(Writing...)"
---

## 1.简单介工作流引擎与Activiti

对于工作流引擎的解释请参考百度百科：[工作流引擎](http://baike.baidu.com/view/1636259.htm)

### 1.1 我与工作流引擎

在第一家公司工作的时候主要任务就是开发OA系统，当然基本都是有工作流的支持，不过当时使用的工作流引擎是公司一些牛人开发的（据说是用一个开源的引擎修改的），名称叫CoreFlow；功能相对Activiti来说比较弱，但是能满足日常的使用，当然也有不少的问题所以后来我们只能修改引擎的代码打补丁。

现在是我工作的第二家公司，因为要开发ERP、OA等系统需要使用工作流，在项目调研阶段我先搜索资料选择使用哪个**开源**工作流引擎，最终确定了Activiti5并基于公司的架构做了一些DEMO。

### 1.2 Activiti与JBPM5？

对于Activiti、jBPM4、jBPM5我们应该如何选择，在InfoQ上有一篇文章写的很好，从大的层面比较各个引擎之间的差异，请参考文章：[纵观jBPM：从jBPM3到jBPM5以及Activiti5](http://www.infoq.com/cn/articles/rh-jbpm5-activiti5)

### 1.3 Activiti资料

* 官网：http://www.activiti.org/

* 下载：http://www.activiti.org/download.html

* 版本：Activiti的版本是从**5**开始的，因为Activiti是使用jBPM4的源码；**版本发布**：两个月发布一次。

* Eclipse Plugin: http://activiti.org/designer/update/

* QQ群：5435716

## 2.初次使用遇到问题收集

因为Activiti刚刚退出不久所以资料比较**空缺**，中文资料更是少的**可怜**，所以开始的时候一头雾水（虽然之前用过工作流，但是感觉差距很多），而且官方的手册还不是很全面；所以我把我在学习使用的过程遇到的一些疑问都罗列出来分享给大家；以下几点是我遇到和想到的，如果你还有什么疑问可以在评论中和我交流再补充。

### 2.1 部署流程图后中文乱码

**乱码**是一直缠绕着国人的问题，之前各个技术、工具出现乱码的问题写过很多文章，这里也不例外……，Activiti的乱码问题在流程图中。

流程图的乱码如下图所示：

![通过*.bpmn20.xml部署后中文出现乱码](/wpfiles/2012/03/activiti-process-messy-character.png)

解决办法有两种：

#### 2.1.1 修改源代码方式

修改源码<pre>org.activiti.engine.impl.bpmn.diagram.ProcessDiagramCanvas</pre>

在构造方法<pre>public ProcessDiagramCanvas(int width, int height)</pre>
中有一行代码是设置字体的，默认是用**Arial**字体，这就是乱码产生的原因，把字改为本地的中文字体即可，例如：
<pre>Font font = new Font("WenQuanYi Micro Hei", Font.BOLD, 11);</pre>

当然如果你有配置文件读取工具那么可以设置在*.properties文件中，我就是这么做的：
<pre>Font font = new Font(PropertyFileUtil.get("activiti.diagram.canvas.font"), Font.BOLD, 11);</pre>

#### 2.1.2 使用压缩包方式部署

使用Activit Deisigner工具设计流程图的时候会有三个类型的文件:

* .activiti设计工具使用的文件

* .bpmn20.xml设计工具自动根据.activiti文件生成的xml文件

* .png流程图图片

##### 2.1.2.1 使用工具打包Bar文件

##### 2.2.2.2 使用Ant脚本打包Zip文件

### 2.2 业务和流程的关联方式

### 2.3 使用引擎提供的Form还是自定义业务Form

### 2.4 同步用户数据

### 2.5 流程图设计工具用什么

### 2.6 Activiti Designer For Eclipse Plugin

这个插件是用来设计流程图的工具，但是有一个很讨厌的Bug一直未修复，安装了插件后Eclipse的复制和粘帖快捷键会被更换为(Ctrl+Insert、Shift+Insert)；Bug描述请见：

* [Activit Forums中报告的Bug](http://forums.activiti.org/en/viewtopic.php?f=8&t=2701)

* [Jira的登记](http://jira.codehaus.org/browse/ACT-992)

## 3.配置

### 3.1 整合Spring

## 4.代码封装

### 4.1 Service

### 4.2 Action

### 4.3 jQuery UI

### 4.4 插件jquery.workflow.js

## 5.使用单元测试