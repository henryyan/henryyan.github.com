---
layout: post
title: "kft-activiti-demo 1.5.0 发布"
category: activiti
tags:
 - activiti
 - kft-activiti-demo
---

## 1. 废话

继[Activiti 5.11发布](/activiti/2012/12/05/activiti-5-11-release.html)之后一直在**密谋**把一些新特性添加到[kft-activiti-demo](/activiti/2012/05/26/kft-activiti-demo.html)中，现在终于有了点空闲时间添加了一些5.11的新功能，并且修复了一些Bug，尤其是在Windows平台运行时读取外置表单乱码问题。

各位看官请好吧……

## 2. Changelog

1. [13fc350](https://github.com/henryyan/kft-activiti-demo/commit/13fc3503154219c90ca9bf74cc209e85a9c0aa9f) 添加对流程定义状态的控制功能
2. [c50ec09](https://github.com/henryyan/kft-activiti-demo/commit/c50ec096bbf66cd08509cb0733bd503ad3373dc6) 添加流程实例状态控制功能
3. [9a97cda](https://github.com/henryyan/kft-activiti-demo/commit/9a97cda5e2c177c80b1575d9b51a2e7f048a8a82) formkey查询任务时使用native query
4. [3e8ab24](https://github.com/henryyan/kft-activiti-demo/commit/3e8ab246ba6e84708813952f94a675692f76e55a) 清理垃圾
5. [9035e56](https://github.com/henryyan/kft-activiti-demo/commit/9035e5656ff595e6d18944bda093a21994c1b293) 动态表单和外置表单的运行中列表显示的当前节点的英文名称，并在查询流程数据时区分动态、外置表单
6. [7f955c4](https://github.com/henryyan/kft-activiti-demo/commit/7f955c487f246d1d10f462eb2741d0ca3c67c4c8) 重写JuelFormEngine，解决windows平台读取表单内容乱码问题
7. [d72778b](https://github.com/henryyan/kft-activiti-demo/commit/d72778bcdabbb9d14748a81f8db4299ad7b25e96) 升级portlet插件为1.1.1
8. [5e4007c](https://github.com/henryyan/kft-activiti-demo/commit/5e4007c632e1fc2e1790f9867acf70c66290adb1) 升级初始化sql的activiti版本为5.11
9. [684c8a0](https://github.com/henryyan/kft-activiti-demo/commit/684c8a052be198f3c1d1439dff0f4486c1145548) 解决jsp文件中出现两个head问题
10. [3bcbd56](https://github.com/henryyan/kft-activiti-demo/commit/3bcbd5647c7958ee1f4358cd379064f992ba8221) 菜单的传统改为普通，外部改为外置
11. [645347c](https://github.com/henryyan/kft-activiti-demo/commit/645347c55fa067f39161fb99bf5a18eda4034247) 移除不需要的依赖版本号

## 3. 下载及配置

参考Wiki：[https://github.com/henryyan/kft-activiti-demo/wiki](https://github.com/henryyan/kft-activiti-demo/wiki)