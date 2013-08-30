--- 
layout: post
title: "备忘：金格、用友CELL不能在IE8下使用的解决办法"
wordpress_id: 713
wordpress_url: http://www.wsria.com/?p=713
date: 2009-10-14 17:16:44 +08:00
tags: 
 - IE6
 - 金格
---
说明一下，公司的项目图文混排都是使用的金格WebOffice，报表是用友的CELL；

最近重装系统后把IE升级到IE8版本，然后发现装不上金格和用友CELL插件，本来想还原成IE7的，后来google了一下发现了解决办法.

<strong>具体的步骤：</strong>
<pre>以管理员身份运行ie8，然后选择?工具-Internet选项-高级-安全，接着找到启用内存保护帮助减少联机攻击，把前面的勾勾去掉，再选择确定，然后重新打开ie8进入页面就可以用了。</pre>
