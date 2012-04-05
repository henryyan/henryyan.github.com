---
layout: post
title: "在Ubuntu上安装Git1.7.10-rc4(中文化)"
category: git
tags: 
 - git
 - 本地化
---

自从得知Git 1.7.10版本支持**本地化**之后一直关注，最近有时间了在Ubuntu 12.04 LTS上用tar方式安装了最新RC版本。

由于我的工作机是Ubuntu 11.10，安装的是Git 1.7.9版本，安装步骤没有在11.10版本测试；不过大同小异，无非就是依赖的处理，读者可以自行Google处理。

## 1.下载源码包

<pre class="brush: shell">
cd
wget http://git-core.googlecode.com/files/git-1.7.10.rc4.tar.gz
wget http://git-core.googlecode.com/files/git-manpages-1.7.10.rc4.tar.gz
</pre>

上面命令下载了两个文件，一个是git-core的源码，第二个是git的man文档。

## 2.安装依赖

<pre class="brush: shell">
sudo apt-get install libcurl4-gnutls-dev librtmp-dev libcurl4-openssl-dev libexpat1-dev gettext
</pre>

## 3.安装Git

### 3.1 编译源码
<pre class="brush: shell">
tar xzvf git-1.7.10.rc4.tar.gz
cd git-1.7.10.rc4
make prefix=/usr/local all
</pre>

如果在make过程中遇到提示缺少依赖请读者自行Google，安装对应的lib包然后继续运行**make prefix=/usr/local all**。

### 3.2 安装到本地

<pre class="brush: shell">
sudo make prefix=/usr/local install
</pre>

检查版本：
<pre class="brush: shell">
henryyan@hy-VB:~$ git --version
git version 1.7.10.rc4
</pre>

### 3.3 新增的中文本地化

<pre class="brush: shell">
➜ henryyan@hy-VB  ~/henryyan.github.com git:(master) ✗ git status
# 位于分支 master
# 要提交的变更：
#   （使用 "git reset HEAD <file>..." 撤出暂存区）
#
#	修改：      README.md
#
</pre>

<pre class="brush: shell">
➜ henryyan@hy-VB  ~/henryyan.github.com git:(master) ✗ git commit -v
# 请为您的修改输入提交说明。以 '#' 开头
# 的行将被忽略，并且空的提交说明将会中止提交。
#
# 提交者：   henryyan <henryyan@hy-VB.(none)>
#
# 位于分支 master
# 要提交的变更：
#   （使用 "git reset HEAD <file>..." 撤出暂存区）
#
#       修改：      README.md
#
diff --git a/README.md b/README.md
index ebfe47a..27291b3 100644
--- a/README.md
+++ b/README.md
</pre>

## 4. 安装Git Man Pages

在没有安装Git Man之前查看Git的帮助文档会得到下面的结果：
<pre class="brush: shell">
henryyan@hy-VB:~$ git help add
没有 git-add 的手册页条目
当没有手册页时，可以用 man 7 undocumented 命令来寻求帮助。
</pre>

运行下面命令：
<pre class="brush: shell">
sudo tar xvz -C /usr/local/share/man -f git-manpages-1.7.10.rc4.tar.gz
</pre>

再次运行：**git help add**就看到帮助文档了。

	如果以后的release版本发布之后安装方法也是一样的。

## 5.感谢

中文本地化从**1.7.10**版本开始支持，对于团队内E文不好的成员来说有助于更好的理解、使用Git；以后成员遇到操作不懂的地方时TM说去看git help xx，他们再也不会说**看不懂英文**了。

感谢国内Git布道者[蒋鑫](http://weibo.com/gotgit)参与中文本地化工作。

如果你也想参与进来或有更好的翻译请使用Github Fork形式参与进来。

* 中文本地化 On Github：https://github.com/gotgit/git-po-zh_CN ，有问题也可以在这里反馈

* 蒋鑫的Git中文本地化博文：http://www.worldhello.net/2012/02/28/git-l10n.html