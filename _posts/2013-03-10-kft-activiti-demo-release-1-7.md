---
layout: post
title: "Activiti快速入门项目kft-activiti-demo 1.7.0版本发布"
category: activiti
tags:
 - activiti
 - Activiti Modeler
 - 整合
 - kft-activiti-demo
---

本次更新包含一下特性：

1. 添加分页查询演示
2. 添加流程定义对象(ProcessDefinition)缓存演示, see: [Tweaking the process definition cache in Activiti 5.12](http://www.jorambarrez.be/blog/2012/12/20/tweaking-process-definition-cache/)
3. 添加activityFontName属性配置，可以解决流程图中包含中文导致生成的流程图乱码问题
4. 整合Activiti Modeler，可以在线设计流程，参考：[整合Activiti Modeler到业务系统（或BPM平台）](/activiti/2013/03/10/integrate-activiti-modeler.html)

由于在线demo访问人数比较多，导致产生了大量数据（数据库文件接近300M），本次把数据库初始化并添加了分页功能，并使用我自行打包的#5.12.1#版本提供Native Query的分页查询功能。 

**源码下载**：[https://github.com/henryyan/kft-activiti-demo](https://github.com/henryyan/kft-activiti-demo)

**在线Demo**：[http://demo.kafeitu.me/kft-activiti-demo](http://demo.kafeitu.me/kft-activiti-demo)
