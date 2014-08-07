---
layout: post
title: "Mac平台上IntelliJ IDEA与Clipmenu快捷键冲突解决办法"
category: tools
tags:
 - IDEA
 - Clipmenu
 - 快捷键
---

很久没有写和工具有关的文章了，我觉得这次一定要发出来分享，否则难泄我心头之恨（快捷键冲突）。两个最常用的工具：

1. IntelliJ IDEA: 地球上最好用的IDE，没有之一
2. Clipmenu: 地球上最好用的剪贴板小工具（移步官网：[http://www.clipmenu.com](http://www.clipmenu.com)）

Clipmenu应该是每时每刻都在使用的，每天不知道要按多少次<code>Cmd + C</code>和<code>Cmd + V</code>，它可以帮助我记录（可以配置数量）一定数量的历史记录，可以很方便地粘贴以往复制的内容，这个工具拦截了Cmd + C快捷键，除了原来的复制功能它把复制的内容加入到历史堆栈中，按下快捷键<code>Shift + Cmd + V</code>快捷键就可以从历史中选择了。

但是………………

从IDEA 12升级到13版本后就遇到了问题，经常不能从IDEA中复制内容到其他编辑器，也不能从外部复制内容到IDEA（重复按多次快捷键就可以）；一直以为是Clipmenu不兼容IDEA 13导致的问题，一度想写邮件给Clipmenu官方。

幸运的是…………

今天索性把Clipmenu关掉了，结果在使用IDEA 13的时候习惯性的按了一下<code>Shift + Cmd + V</code>快捷键，好吧……竟然弹出了这样的对话框：

![IDEA 13中的剪贴板历史](/files/2014/07/idea-clipboard-history.jpg)

明白真相的我眼泪吊销来，IDEA 13版本中也添加了类似的功能，快捷键同样也是<code>Shift + Cmd + V</code>，打开IDEA的设计界面把"Paste form History..."的快捷键移除掉就可以了（右键选择Remove）。

![IDEA 13中的剪贴板历史](/files/2014/07/idea-history-shortcut.jpg)

如果你也遇到了这个问题请发泄一下…………