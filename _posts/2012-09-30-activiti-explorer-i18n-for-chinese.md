---
layout: post
title: "Activiti Explorer中文汉化"
category: activiti
tags: 
 - activiti
 - 中文
 - i18n
 - Activiti Explorer
 - 打包
---

## 1. 中文汉化

因为Activiti迁移到了Github勾起了我修改源码的兴趣，正好发布了新版本的Activiti Modeler而且这两者整合到了一起，在查看源码的时候发现有几个国际化支持但是很少，然后有了想法把Activiti Explorer汉化一下（曾经不止一个人问我有没有汉化版）。

说做就做，首先Fork了Github的Activiti源码，然后花了几个小时时间把中文国际化做完了，并发布了第一版Demo：

[http://aws.kafeitu.me:8888/activiti-explorer2](http://aws.kafeitu.me:8888/activiti-explorer2)


![汉化后的登陆页面](/files/2012/09/activiti-explorer-i18n-for-chinese-login.png)

再看看登陆之后的主页面：

![汉化后的主页面](/files/2012/09/activiti-explorer-i18n-for-chinese-main.png)

## 2. 获取汉化包

我已经在github上提交了pull request，等合并到master之后官方应该会重新发布activiti explorer，到时就可以直接支持中文了。

想尝鲜的除了访问在线的demo之外还可以从我Fork的Activiti项目自己打包，Github项目地址：

[https://github.com/henryyan/Activiti](https://github.com/henryyan/Activiti)

如何打包请参考：[新版Activiti Modeler发布以及教程](/activiti/2012/09/30/new-version-of-activiti-modeler.html)的第3节。

	由于中西方差异在表单方面可能有些不妥，可以和我联系讨论改进。

## 3. 更新记录

* **2012-09-30**：翻译了第一版，给官网提交了pull request，等待合并。