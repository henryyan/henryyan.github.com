---
layout: post
title: "在Ubuntu(Debian)上安装最新版Git"
category: git
tags: 
 - git
 - ubuntu
 - debian
 - ppa
---

继上一篇文章：[在Ubuntu上安装Git1.7.10-rc4(中文化)](/git/2012/04/05/install-git-1-7-10-use-tar.html)第三天Git就发布了正式版本**1.7.10**，支持本地化的第一版。

不过上一篇文章是用**源码**方式安装的，所以对于想偷懒的同学来说就觉得麻烦了，因为有人问我为什么要用源码方式，今天就分享一下用PPA安装最新版Git。

## PPA安装

PPA地址：https://launchpad.net/~git-core/+archive/ppa

支持所有的Ubuntu版本。

运行命令：
<pre class="brush: shell">
sudo apt-add-repository ppa:git-core/ppa
sudo apt-get update
sudo apt-get install git
</pre>

如果本地已经安装过Git，可以使用升级命令：
<pre class="brush: shell">
sudo apt-get dist-upgrade
</pre>

如果你的OS使用的是中文语言，那么就运行git命令就看到了中文提示信息，参见：[在Ubuntu上安装Git1.7.10-rc4(中文化)](/git/2012/04/05/install-git-1-7-10-use-tar.html)。

目前还有一些没有国际化和没有中文化翻译的提示信息，可以参考微博：http://goo.gl/uJjaT