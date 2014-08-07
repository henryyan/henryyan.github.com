--- 
layout: post
title: "IE中丢失session问题解决办法"
wordpress_id: 510
wordpress_url: http://www.wsria.com/?p=510
date: 2009-04-21 09:39:25 +08:00
tags: 
 - IE
 - session
---
前段时间在一个项目中为了避免用户的误操作所以点击一个按钮后使用了模态对话框来打开一个新的页面，顺便说一下后台语言为JAVA；昨天在测试的时候出现了问题，具体表现如下：

在IE中打开模态对话框&lt;window.showModalDialog()&gt;然后在模态对话框中再打开一个标准窗口&lt;window.open()&gt;，在打开的新窗口中获取session信息得到的为null，很怪的事情是在有些IE6下面可以有的不可以，版本号我也对比过一样，把Internet选项页都重置了，但是在IE7下面都没有问题，然后我就想是不是没有打补丁，google了一下也没有发现什么补丁之类的；

最后询问了一下架构师阿强他看到后好像很激动的说我知道，在dialog中打开新窗口会丢失session的，豁然明白了，令人痛恨的IE6……

最后换成了window.open()没有问题了

希望有同此遭遇的网友能避免这个BUG
