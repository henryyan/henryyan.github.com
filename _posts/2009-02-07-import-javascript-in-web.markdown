--- 
layout: post
title: "关于WEB开发中引入javascript文件方式的一点建议"
wordpress_id: 12
wordpress_url: http://wsria.com/?p=12
date: 2009-02-07 18:24:46 +08:00
category: javascript
tags: 
 - jquery
 - prototype
 - dojo
 - ext
 - 建议
---
平常我们开发WEB应用是会用到第三方工具包，例如：jQuery、prototype、dojo、ext等等，第三方工具包有个特点就是在发布的时候文件名都是以版本号命名文件，例如：jquery-1.2.6.js，其中1.2.6就是版本号。

在此之前我第一次使用第三方工具包的时候是用的prototype1.4.js，所以当时就在JSP文件中这样写：
&lt;script  type="text/javascript"  src="common/prototype1.4.js"&gt;&lt;/script&gt;
后来做完项目后仔细考虑了一下如果以后更新版本怎么办，上百个文件中引入了同一个文件名的文件而且还带有版本号，如果版本从1.4更新到1.5该怎么办？你可能会说直接把1.5版本的内容替换1.4的内容不就行了，但是文件名还是1.4以后维护项目的人会以为使用的1.4，如果有BUG发生在版本上就麻烦了……

<!--more-->

我现在在使用一个轻量级的AJAX框架jQuery，在看一些网友写一个DEMO或做插件是都会在头部：
&lt;script  type="text/javascript"  src="jquery1.2.6.js"&gt;&lt;/script&gt;
这样写，目前的版本是1.2.6，过段时间更新版本了就得修改引入文件的代码了，这样做太死了……

所以我建议在开发项目时应该这样写：
&lt;script  type="text/javascript"  src="../../common/js/jquery-last.js"&gt;&lt;/script&gt;
就把文件名固定为jquery_last.js，意思就是最新的版本，反正在文件中也有版本号，这样就不至于引入的JS文件和内容不一致的问题了，这其实是一个小事但我相信有很多人都忽略了这点，写此文章希望对没有这个做的网友个提醒，如果嫌我小题大做请留言，目的就是总结自己的经验让同行少走弯路。
