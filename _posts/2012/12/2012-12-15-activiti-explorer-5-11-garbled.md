---
layout: post
title: "Activiti Explorer 5.11登录页面乱码解决办法"
category: activiti 
tags: 
 - activiti
 - explorer
 - 乱码
---

## 1. 问题描述

乱码问题见下图，上面的截图是乱码问题，下面的是正常的；此问题仅发生在Windows，Linux和Mac没问题。

![](/files/2012/12/activiti-explorer-5.11-garbled.jpg)

## 2. 问题原因

乱码的原因是因为后台输出登录页面的html代码时没有转换为UTF-8编码，所以导致乱码。

对此我表示非常的抱歉，在翻译时没有把Windows作为Server运行Activiti Explorer测试汉化，而是以Mac平台（系统使用英文）作为Server用Windows验证中文汉化。

## 3. 解决办法

在5.11发布的几天后Activiti群里面有人报告说Windows平台有中文乱码问题，我也试着去解决可是无果。。。。。

今天群里的**@灿灿** 同学解决了这个问题，感谢灿灿的帮助得以修复此问题。

修正的记录可以从这里查看[https://github.com/Activiti/Activiti/pull/13](https://github.com/Activiti/Activiti/pull/13)

## 4. 获取修复版本

我在修复这个问题之后第一时间基于5.11分支打包了activiti explorer的war包，下载地址：

[http://www.kafeitu.me/download/activiti/5.11/activiti-explorer.war](http://www.kafeitu.me/download/activiti/5.11/activiti-explorer.war)

	另外，已经和Tijs沟通过了，他尽可能重新打包更新官网的5.11版本的zip文件。