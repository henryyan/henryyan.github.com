---
layout: post
title: "Activiti入门，学习资源索引"
category: activiti 
tags: 
 - activiti
 - 教程
 - 学习
---

本文是针对初次接触Activiti或者初次接触工作流的初学者撰写，希望能帮助更多的人。

## 1.Activiti流程引擎简介

此项目于2010年Tom Bayen（jBPM创始人）离开jBoss后加入Alfresco公司之后的又一力作；第一版在2010年5月发布，当时仅支持最简单的流程处理，后来版本发布频率固定为每两个月一版。
值得一提的是参与项目开发的除了Tom Bayen和十几位核心开发人员之外还有其他公司的成员的参与，例如：SpringSource、MuleSoft、Salves、Signavio、FuseSource、NextLevel等公司。

Activiti是一个针对企业用户、开发人员、系统管理员轻量级工作流业务管理平台。其核心是使用Java开发的快速、稳定BPMN  2.0流程引擎。Activiti 是在 Apache V2 许可下发布的。Activiti可以运行在任何类型的Java程序中，例如服务器、集群、云服务。它可以完美地与Spring集成。计基于简约思想的设计使Activiti非常的轻量级。
它有着活跃的社区，而且越来越多的企业都选择Activiti作为自己的流程引擎或者嵌入到自己的系统平台中（例如ESB）。

## 2.学习资源

因为Activiti是新兴之秀，目前中文资料不多，所以读者只能参考官方的用户手册学习，同时可以结合官方的一些例子（基于Junit）。

如果是第一次接触工作流请建议先了解工作流的理论知识，否则直接学习Activiti会一头雾水，在技术群里也遇到过这样的网友，有些问题莫名其妙！！！工作流方面的资料网上很多，自己Google……

### 2.1 官方资源

下载的压缩包后解压如下图所示。

![](/files/2012/08/activiti-floder.png)


* **doc**：该目录包含了三种文档：javadocs、userguide、xsd。
* **javadocs**：包名按照功能模块划分，org.activiti.engine.*，具体会在接下来详细介绍。
* **userguide**：用户手册，包含环境配置、10分钟快速入门以及各个功能模块的使用教程。
* **xsd**：包含BPMN2.0规范的XSD文件以及Activiti扩展的自定义标签XSD。
* **setup**：用来构建、启动Activiti Explorer演示程序。通过ant demo.start命令即可自动下载tomcat，配置数据库，最后打开浏览器访问应用。
* **workspace**: 该目录包含了各种应用的实例程序，都以单元测试的形式介绍功能的使用方式。读者可以直接把项目导入至Eclipse查看其源代码，从而可以断点调试学习。

----

	尤其是userguide和javadocs建议花点时间从头到尾阅读，并在阅读过程中使用单元测试方式学习以验证自己的猜测结果。

## 2.2 本博客发布的和Activiti有关的博文
利用空余时间也发布了一些Activiti方面的资料，仅供参考。

请移步访问：[浏览和Activiit有关的博文](/categories.html#activiti-ref)


## 3.参考实例

笔者在初次学习Activiti的时候苦于资料缺乏，而且又没有实际的例子参考，其实大家学习任何一门技术都是从HelloWorld开始，这也是最有效的方式，这是学习的根基。

后来在公司的几个项目中实施之后利用业余时间做了一个简单的activiti demo，例子使用日常的请假流程，demo截图如下。

详细了解demo程序请访问：[Activiti快速入门项目-kft-activiti-demo](/activiti/2012/05/26/kft-activiti-demo.html)

![](/files/2012/05/kft-activiti-demo.png)

## 4.社区支持

有关Activiti方面的问题（引擎、Designer等）可以到官方论坛发帖：[http://forums.activiti.org/](http://forums.activiti.org/)。

如果想得到最快技术支持可以申请加入**Activiti中文群**：236540304

## 5.Bug、Feature反馈

访问Jira：[http://jira.codehaus.org](http://jira.codehaus.org)