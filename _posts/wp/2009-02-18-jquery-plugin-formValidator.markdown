--- 
layout: post
title: "推荐jQuery插件系列——表单验证formValidator"
wordpress_id: 214
wordpress_url: http://www.wsria.com/?p=214
date: 2009-02-18 19:41:13 +08:00
category: jquery
tags: 
 - plugin
 - 验证
---
在开发各种BS架构的系统时表单验证是每个系统、网站都要做的一件事情，在客户端拦截用户的输入、选择是否合法从而降低对服务端的压力也增加用户体验，一般来说都会简单的验证必输项是否为空，或者必选项是否已选择，复杂一点的比如在注册时实时验证用户名是否重复，如此等等

在开发账务管理系统的时候开始想使用自己在公司项目中写的一个验证方法，但是后来想想感觉功能太单调了，虽然能够满足系统的要求但是用户体验不好，所有的错误提示都是使用的alert的方式提示用户，而且没有实时验证的功能，最终放弃了；然后就在<a href="http://plugins.jquery.com/" target="_blank">jQuery官网插件</a>上搜索关于验证的插件，刚刚说的几个功能都得满足，找了几个最终选择了<a href="http://www.yhuan.com/formvalidator/index.html?from=www.wsria.com" target="_blank">formValidator</a>，下面是摘自插件官网上的：

<!--more-->
<pre><span style="font-size: large;"><strong>本插件于其他校验控件最大的区别有3点：</strong></span>

<strong>1、校验功能可以扩展。</strong>
<strong> </strong><strong> </strong> 对 中文、英文、数字、整数、实数、Email地址格式、基于HTTP协议的网址格式、电话号码格式、手机号码格式、货币格式、邮政编码、身份证号码、QQ号 码、日期等等这些控制，别的表单校验控件是代码里写死的，而formValidator是通过外部js文件来扩展的，<span style="color: #ff0000;"><em>你可以通过写正则表达式和函数来无限的扩展这些功能</em></span>。

<strong>2、实现了校验代码于html代码的完全分离。</strong>
你的所有信息都无需配置在校验表单元素上，你只要在js上配置你的信息。使美工（界面）和javascript工程师的工作不交织在一起

<strong>3、你只需写一行代码就能完成一个表单元素的所有校验。你只需要写一行代码就能完成一下所有的控制</strong>
<ul>
	<li>支持所有类型客户端控件的校验</li>
	<li>支持jQuery所有的选择器语法，只要控件有唯一ID和type属性</li>
	<li>支持函数和正则表达式的扩展。提供扩展库formValidatorReg.js，你可以自由的添加、修改里面的内容。</li>
	<li>支持2种校验模式。第一种：文字提示(showword模式)；第二种：弹出窗口提示(showalert模式)</li>
	<li>支持多个校验组。如果一个页面有多个提交按钮，分别做不同得提交，提交前要做不同的校验，所以你得用到校验组的功能。</li>
	<li>支持4种状态的信息提示功能，可以灵活的控制4种状态是否显示。第一种：刚打开网页的时候进行提示；第二种：获得焦点的时候进行提示；第三种：失去焦点时，校验成功时候的提示；第四种：失去焦点时，校验失败的错误提示。</li>
	<li>支持自动构建提示层。可以进行精确的定位。</li>
	<li>支持自定义错误提示信息。</li>
	<li>支持控件的字符长度、值范围、选择个数的控制。值范围支持数值型和字符型；选择的个数支持radio/checkbox/select三种控件</li>
	<li>支持2个控件值的比较。目前可以比较字符串和数值型。</li>
	<li>支持服务器端校验。</li>
	<li>支持输入格式的校验。</li>
</ul>
</pre>
大家可以到<a href="http://www.yhuan.com/formvalidator/index.html?from=www.wsria.com" target="_blank">formValidator </a>官网上去查看具体效果及其使用方法，也可以在晚上7点之后访问我在<a href="http://yanhonglei.gicp.net/finance/" target="_blank">账务管理系统</a>中的实际应用效果供大家参考

但是目前jQuery的版本更新到了1.3弃用了1.1和1.2版本中@写法，例如选择一个已选择的radio在1.1或者1.2版本中可以这样写：
<pre class="brush: js" line="1">alert($(":radio[@checked]").length);</pre>
但是在1.3中就不可以这样写，1.3的写法：
<pre class="brush: js" line="1">alert($(":radio:checked").length);</pre>
所以当我前段时间更新到1.3版本中就出现问题了，我上传一个我修改过的版本供大家下载:

[download#10#format=1]
